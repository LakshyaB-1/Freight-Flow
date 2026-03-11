/// <reference lib="deno.ns" />
/// <reference types="https://deno.land/x/types/index.d.ts" />

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.86.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const OPENAI_API_KEY = Deno.env.get("OPENAI_API_KEY");
    if (!OPENAI_API_KEY) throw new Error("OPENAI_API_KEY is not configured");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Require authentication
    const authHeader = req.headers.get("Authorization");

    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Authentication required" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    const anonClient = createClient(
      supabaseUrl,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data, error: claimsError } = await anonClient.auth.getClaims(token);

    if (claimsError || !data?.claims) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const userId = data.claims.sub as string;

    // Validate request body
    let body: unknown;

    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: "Invalid JSON body" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (typeof body !== "object" || body === null) {
      return new Response(
        JSON.stringify({ error: "Request body must be an object" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { messages, action, shipmentId } = body as Record<string, unknown>;

    // Validate messages
    if (messages !== undefined && !Array.isArray(messages)) {
      return new Response(
        JSON.stringify({ error: "'messages' must be an array" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (Array.isArray(messages) && messages.length > 50) {
      return new Response(
        JSON.stringify({ error: "Too many messages (max 50)" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate action
    const allowedActions = [
      "insights",
      "summarize",
      "draft_email",
      "suggest_actions",
    ];

    if (
      action !== undefined &&
      (typeof action !== "string" || !allowedActions.includes(action))
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid action" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate shipmentId
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

    if (
      shipmentId !== undefined &&
      shipmentId !== null &&
      (typeof shipmentId !== "string" || !uuidRegex.test(shipmentId))
    ) {
      return new Response(
        JSON.stringify({ error: "Invalid shipmentId format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Fetch shipment context
    let contextData = "";

    const { data: shipments } = await supabase
      .from("shipments")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(50);

    if (shipments && shipments.length > 0) {
      contextData += `\n\n## Current Shipments (${shipments.length} total):\n`;

      for (const s of shipments) {
        contextData += `- ID: ${s.id} | Consignee: ${s.consignee} | Shipper: ${s.shipper} | Commodity: ${s.commodity} | Status: ${s.status || "PENDING"} | Container: ${s.container_no || "N/A"} | Date: ${s.date} | BE No: ${s.be_no || "N/A"} | Current Status: ${s.current_status || "N/A"}\n`;
      }

      if (shipmentId) {
        const { data: milestones } = await supabase
          .from("shipment_milestones")
          .select("*")
          .eq("shipment_id", shipmentId as string);

        if (milestones && milestones.length > 0) {
          contextData += `\n## Milestones for shipment ${shipmentId}:\n`;

          for (const m of milestones) {
            contextData += `- ${m.milestone_type}: ${m.status} | Date: ${m.milestone_date || "Not set"} | Notes: ${m.notes || "None"}\n`;
          }
        }

        const { data: docs } = await supabase
          .from("shipment_documents")
          .select("*")
          .eq("shipment_id", shipmentId as string);

        if (docs && docs.length > 0) {
          contextData += `\n## Documents for shipment ${shipmentId}:\n`;

          for (const d of docs) {
            contextData += `- ${d.file_name} (${d.document_type || "other"}) uploaded ${d.created_at}\n`;
          }
        }
      }

      const pending = shipments.filter(
        (s: any) => (s.status || "").toLowerCase() === "pending"
      );

      const done = shipments.filter(
        (s: any) => (s.status || "").toLowerCase() === "done"
      );

      contextData += `\n## Quick Stats:\n- Total: ${shipments.length} | Pending: ${pending.length} | Completed: ${done.length}\n`;
    }

    const systemPrompt = `
You are the AI logistics assistant for Freight Link Logistics Systems CRM.

Capabilities:
1. Summarize shipment status
2. Draft professional customer emails
3. Suggest next operational actions
4. Highlight delayed shipments
5. Provide logistics insights

${contextData}
`;

    const response = await fetch(
      "https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${OPENAI_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o",
          messages: [
            { role: "system", content: systemPrompt },
            ...(Array.isArray(messages) ? messages : []),
          ],
          stream: true,
        }),
      }
    );

    if (!response.ok) {
      console.error("AI API error:", response.status);

      return new Response(
        JSON.stringify({ error: "AI service error" }),
        {
          status: 500,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        }
      );
    }

    return new Response(response.body, {
      headers: {
        ...corsHeaders,
        "Content-Type": "text/event-stream",
      },
    });
  } catch (e) {
    console.error("AI assistant error:", e);

    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});