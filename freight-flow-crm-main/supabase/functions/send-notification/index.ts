import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { Resend } from "https://esm.sh/resend@2.0.0";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the caller is authenticated
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const anonClient = createClient(supabaseUrl, Deno.env.get("SUPABASE_ANON_KEY")!);
    const token = authHeader.replace("Bearer ", "");
    const { data: { user: caller } } = await anonClient.auth.getUser(token);
    if (!caller) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Parse and validate request body
    let rawBody: unknown;
    try {
      rawBody = await req.json();
    } catch {
      return new Response(JSON.stringify({ error: "Invalid JSON body" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    if (typeof rawBody !== "object" || rawBody === null) {
      return new Response(JSON.stringify({ error: "Request body must be an object" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const b = rawBody as Record<string, unknown>;

    // Validate required fields
    if (!b.user_id || typeof b.user_id !== "string" || !uuidRegex.test(b.user_id)) {
      return new Response(JSON.stringify({ error: "Invalid or missing user_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    if (!b.shipment_id || typeof b.shipment_id !== "string" || !uuidRegex.test(b.shipment_id)) {
      return new Response(JSON.stringify({ error: "Invalid or missing shipment_id" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const validateStr = (val: unknown, maxLen: number): string => {
      if (val === undefined || val === null) return '';
      if (typeof val !== 'string') return '';
      return val.slice(0, maxLen);
    };

    const user_id = b.user_id as string;
    const shipment_id = b.shipment_id as string;

    // Sanitize user-provided strings to prevent XSS in email HTML
    const escapeHtml = (s: string) => s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
    const old_status = escapeHtml(validateStr(b.old_status, 100));
    const new_status = escapeHtml(validateStr(b.new_status, 100));
    const container_no = escapeHtml(validateStr(b.container_no, 100));
    const consignee = escapeHtml(validateStr(b.consignee, 200));

    console.log("Processing notification for user:", user_id, "shipment:", shipment_id);

    // Check user notification preferences
    const { data: prefs, error: prefsError } = await supabase
      .from("notification_preferences")
      .select("email_on_status_change")
      .eq("user_id", user_id)
      .maybeSingle();

    if (prefsError) {
      console.error("Error fetching preferences:", prefsError);
      throw prefsError;
    }

    // If user doesn't want notifications, skip
    if (prefs && !prefs.email_on_status_change) {
      console.log("User has disabled status change notifications");
      return new Response(JSON.stringify({ success: true, skipped: true }), {
        status: 200,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Get user email from profiles
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email")
      .eq("user_id", user_id)
      .maybeSingle();

    if (profileError || !profile?.email) {
      console.error("Error fetching profile or no email:", profileError);
      return new Response(JSON.stringify({ success: false, error: "No email found" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    console.log("Sending email to:", profile.email);

    const statusColor = new_status === "done" ? "#22c55e" : "#f59e0b";
    const statusText = new_status === "done" ? "COMPLETED" : "PENDING";

    const emailResponse = await resend.emails.send({
      from: "Freight Flow CRM <onboarding@resend.dev>",
      to: [profile.email],
      subject: `Shipment Status Update: ${container_no}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f4f4f5; padding: 20px;">
          <div style="max-width: 600px; margin: 0 auto; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
            <div style="background: linear-gradient(135deg, #0ea5e9 0%, #0284c7 100%); padding: 30px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 24px;">📦 Shipment Status Update</h1>
            </div>
            <div style="padding: 30px;">
              <p style="color: #374151; font-size: 16px; margin-bottom: 20px;">
                Your shipment status has been updated:
              </p>
              
              <div style="background: #f9fafb; border-radius: 8px; padding: 20px; margin-bottom: 20px;">
                <table style="width: 100%; border-collapse: collapse;">
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Container No:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${container_no}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Consignee:</td>
                    <td style="padding: 8px 0; color: #111827; font-weight: 600; text-align: right;">${consignee}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">Previous Status:</td>
                    <td style="padding: 8px 0; color: #6b7280; text-align: right; text-transform: uppercase;">${old_status}</td>
                  </tr>
                  <tr>
                    <td style="padding: 8px 0; color: #6b7280; font-size: 14px;">New Status:</td>
                    <td style="padding: 8px 0; text-align: right;">
                      <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 20px; font-size: 12px; font-weight: 600;">
                        ${statusText}
                      </span>
                    </td>
                  </tr>
                </table>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; margin-top: 20px;">
                Log in to Freight Flow CRM to view full details.
              </p>
            </div>
            <div style="background: #f9fafb; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #9ca3af; font-size: 12px; margin: 0;">
                Freight Flow CRM - Your Trusted Logistics Partner
              </p>
            </div>
          </div>
        </body>
        </html>
      `,
    });

    console.log("Email sent successfully");

    return new Response(JSON.stringify({ success: true }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: any) {
    console.error("Error in send-notification:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
