import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { messages, action, shipmentId } = await req.json();

    const GEMINI_API_KEY = Deno.env.get("GEMINI_API_KEY");
    if (!GEMINI_API_KEY) throw new Error("GEMINI_API_KEY is not configured");

    const authHeader = req.headers.get("Authorization");
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Get user from auth
    let userId: string | null = null;
    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
      const { data: { user } } = await anonClient.auth.getUser(token);
      userId = user?.id || null;
    }

    // Fetch shipment context data
    let contextData = "";

    if (userId) {
      // Fetch shipments
      const { data: shipments } = await supabase
        .from("shipments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (shipments && shipments.length > 0) {
        contextData += `\n\n## Current Shipments (${shipments.length} total):\n`;
        for (const s of shipments) {
          contextData += `- ID: ${s.id} | Consignee: ${s.consignee} | Shipper: ${s.shipper} | Commodity: ${s.commodity} | Status: ${s.status || 'PENDING'} | Container: ${s.container_no || 'N/A'} | Date: ${s.date} | BE No: ${s.be_no || 'N/A'} | Current Status: ${s.current_status || 'N/A'}\n`;
        }

        // If specific shipment requested, get milestones
        if (shipmentId) {
          const { data: milestones } = await supabase
            .from("shipment_milestones")
            .select("*")
            .eq("shipment_id", shipmentId);

          if (milestones && milestones.length > 0) {
            contextData += `\n## Milestones for shipment ${shipmentId}:\n`;
            for (const m of milestones) {
              contextData += `- ${m.milestone_type}: ${m.status} | Date: ${m.milestone_date || 'Not set'} | Notes: ${m.notes || 'None'}\n`;
            }
          }

          const { data: docs } = await supabase
            .from("shipment_documents")
            .select("*")
            .eq("shipment_id", shipmentId);

          if (docs && docs.length > 0) {
            contextData += `\n## Documents for shipment ${shipmentId}:\n`;
            for (const d of docs) {
              contextData += `- ${d.file_name} (${d.document_type || 'other'}) uploaded ${d.created_at}\n`;
            }
          }
        }

        // Compute insights
        const pending = shipments.filter((s: any) => (s.status || '').toLowerCase() === 'pending');
        const done = shipments.filter((s: any) => (s.status || '').toLowerCase() === 'done');
        contextData += `\n## Quick Stats:\n- Total: ${shipments.length} | Pending: ${pending.length} | Completed: ${done.length}\n`;

        // Check for potential delays (shipments pending for >14 days)
        const now = new Date();
        const atRisk = pending.filter((s: any) => {
          const created = new Date(s.created_at);
          const days = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
          return days > 14;
        });

        if (atRisk.length > 0) {
          contextData += `\n## ⚠️ At-Risk Shipments (pending >14 days):\n`;
          for (const s of atRisk) {
            const days = Math.round((now.getTime() - new Date(s.created_at).getTime()) / (1000 * 60 * 60 * 24));
            contextData += `- ${s.consignee} / ${s.commodity} — pending for ${days} days\n`;
          }
        }
      }
    }

    const systemPrompt = `You are an AI assistant for Freight Link Logistics, a freight forwarding and customs clearance CRM. You have access to the user's shipment, milestone, and document data.

Your capabilities:
1. Summarize shipment status in plain, professional language
2. Draft professional customer emails for delays, updates, or confirmations
3. Suggest next actions based on shipment status and milestones
4. Highlight shipments at risk of delay
5. Provide insights about the logistics operation

When drafting emails, use a professional business tone and include relevant shipment details.
When summarizing, be concise but thorough.
When suggesting actions, be specific and actionable.

${action === 'insights' ? 'The user is requesting a daily insights summary. Analyze all data and provide: 1) Shipments at risk of delay, 2) Key statistics, 3) Recommended actions.' : ''}

Here is the current data context:
${contextData}`;

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/openai/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${GEMINI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          ...(Array.isArray(messages) ? messages : []),
        ],
        stream: true,
      }),
    });

    if (!response.ok) {
      console.error("AI gateway error:", response.status);
      return new Response(JSON.stringify({ error: "AI service error" }), {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
