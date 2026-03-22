# OpenAI API Setup Guide

Your project has been successfully migrated from Lovable to OpenAI API. Here's what you need to do:

## 1. Environment Configuration

### For Supabase Functions (Backend)
Add your OpenAI API key to your Supabase project secrets:

```bash
supabase secrets set OPENAI_API_KEY=sk-your-openai-api-key-here
```

You can get your API key from: https://platform.openai.com/api-keys

### For Local Development
Create a `.env.local` file in your project root with:
```
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_PUBLISHABLE_KEY=your-supabase-anon-key
```

## 2. What's Already Configured

✅ **AI Assistant Function** (`supabase/functions/ai-assistant/index.ts`)
- Uses OpenAI's GPT-4o model via `/v1/chat/completions` endpoint
- Authenticates with Bearer token using `OPENAI_API_KEY`
- Supports streaming responses for real-time responses
- Automatically contextualizes with user's shipment data

✅ **Frontend Integration**
- `AIAssistantPanel.tsx` - Chat interface component
- `InsightsDashboard.tsx` - Analytics and insights component
- Both call the Supabase AI assistant function correctly

## 3. AI Assistant Capabilities

The AI assistant is configured to help with:
- Summarize shipment status
- Draft professional customer emails
- Suggest next operational actions
- Highlight delayed shipments
- Provide logistics insights

## 4. API Request Format

The AI assistant accepts requests with:
```typescript
{
  messages: Array<{ role: "user" | "assistant", content: string }>,
  action?: "insights" | "summarize" | "draft_email" | "suggest_actions",
  shipmentId?: string (optional UUID format)
}
```

## 5. Removed Components

- **lovable-tagger** - Development-only component tagging removed from `vite.config.ts`
- All Lovable-specific references have been removed

## 6. Testing the Integration

1. Start your development server: `npm run dev`
2. Navigate to the Insights Dashboard or AI Assistant Panel
3. Send a message to the AI assistant
4. Check Supabase logs for any API errors

## 7. Cost Optimization Tips

- The function streams responses to avoid long response times
- Only retrieves user's last 50 shipments for context
- Uses GPT-4o for better reasoning on logistics tasks
- Monitor your OpenAI usage at: https://platform.openai.com/account/usage/overview

## 8. Troubleshooting

**Issue**: "OPENAI_API_KEY is not configured"
- Solution: Ensure the secret is set in your Supabase project

**Issue**: Authentication errors (401)
- Solution: Verify the user is properly authenticated with valid JWT token

**Issue**: AI responses are slow
- Solution: This is normal for streaming. The function streams text token-by-token.

For more details, check the AI assistant implementation in `supabase/functions/ai-assistant/index.ts`
