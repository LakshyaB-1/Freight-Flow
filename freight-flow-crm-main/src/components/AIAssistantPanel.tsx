import { useState, useRef, useEffect, useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bot,
  Send,
  Loader2,
  Sparkles,
  MessageSquare,
  Mail,
  ListChecks,
  FileText,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

type Msg = { role: 'user' | 'assistant'; content: string };

const QUICK_ACTIONS = [
  { label: 'Summarize shipments', icon: FileText, prompt: 'Summarize all my current shipments and their statuses.' },
  { label: 'Draft delay email', icon: Mail, prompt: 'Draft a professional email to notify a customer about a shipment delay. Use the most at-risk shipment data.' },
  { label: 'Suggest next actions', icon: ListChecks, prompt: 'Based on my current shipments and milestones, suggest the top 3 actions I should take next.' },
  { label: 'Daily insights', icon: Sparkles, prompt: 'Give me a daily insights summary including at-risk shipments, key stats, and recommendations.' },
];

interface AIAssistantPanelProps {
  shipmentId?: string;
}

const AIAssistantPanel = ({ shipmentId }: AIAssistantPanelProps) => {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const streamChat = async (userMessages: Msg[]) => {
    const { data: { session } } = await supabase.auth.getSession();
    const accessToken = session?.access_token;
    if (!accessToken) throw new Error('You must be logged in to use the AI assistant.');

    const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;

    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        messages: userMessages,
        shipmentId: shipmentId || null,
      }),
    });

    if (!resp.ok) {
      const errData = await resp.json().catch(() => ({}));
      throw new Error(errData.error || `Request failed (${resp.status})`);
    }

    if (!resp.body) throw new Error('No response stream');

    const reader = resp.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    let assistantMessage = '';

    const updateMessage = (fullContent: string) => {
      setMessages((prev) => {
        const last = prev[prev.length - 1];
        if (last?.role === 'assistant') {
          return prev.map((m, i) => (i === prev.length - 1 ? { ...m, content: fullContent } : m));
        }
        return [...prev, { role: 'assistant', content: fullContent }];
      });
    };

    // Batch updates using RAF for performance
    let renderScheduled = false;
    const scheduleRender = (content: string) => {
      assistantMessage = content;
      if (!renderScheduled) {
        renderScheduled = true;
        requestAnimationFrame(() => {
          renderScheduled = false;
          updateMessage(assistantMessage);
        });
      }
    };

    // Stream response processing
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      let lineEnd: number;
      while ((lineEnd = buffer.indexOf('\n')) !== -1) {
        const line = buffer.slice(0, lineEnd);
        buffer = buffer.slice(lineEnd + 1);

        // Skip empty lines and server comments
        const trimmedLine = line.trim();
        if (!trimmedLine || trimmedLine.startsWith(':')) continue;

        // Parse SSE format
        if (!trimmedLine.startsWith('data: ')) continue;

        const dataStr = trimmedLine.slice(6);
        if (dataStr === '[DONE]') {
          // Stream complete
          updateMessage(assistantMessage);
          return;
        }

        try {
          const parsed = JSON.parse(dataStr);
          const content = parsed.choices?.[0]?.delta?.content;
          if (content) {
            assistantMessage += content;
            scheduleRender(assistantMessage);
          }
        } catch (e) {
          // Malformed JSON, skip this line
          console.error('Failed to parse SSE chunk:', e);
        }
      }
    }

    // Final render to ensure all content is displayed
    updateMessage(assistantMessage);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isLoading) return;
    const userMsg: Msg = { role: 'user', content: text.trim() };
    const allMessages = [...messages, userMsg];
    setMessages(allMessages);
    setInput('');
    setIsLoading(true);

    try {
      await streamChat(allMessages);
    } catch (err: any) {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: `⚠️ Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          size="lg"
          className="fixed bottom-6 right-6 z-50 gap-2 rounded-full shadow-lg h-14 px-6"
        >
          <Bot className="h-5 w-5" />
          <span className="hidden sm:inline">AI Assistant</span>
        </Button>
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b border-border">
          <SheetTitle className="flex items-center gap-2">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Bot className="h-5 w-5 text-primary" />
            </div>
            AI Assistant
            <Badge variant="outline" className="text-[10px] ml-auto">
              Powered by AI
            </Badge>
          </SheetTitle>
        </SheetHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 px-4" ref={scrollRef}>
          <div className="py-4 space-y-4">
            {messages.length === 0 && (
              <div className="text-center py-8 space-y-4">
                <Sparkles className="h-10 w-10 mx-auto text-primary/40" />
                <div>
                  <p className="font-medium text-foreground">How can I help?</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ask me about your shipments, or use a quick action below.
                  </p>
                </div>
                <div className="grid grid-cols-2 gap-2 max-w-sm mx-auto">
                  {QUICK_ACTIONS.map((qa) => (
                    <Card
                      key={qa.label}
                      className="cursor-pointer hover:bg-muted/50 transition-colors"
                      onClick={() => sendMessage(qa.prompt)}
                    >
                      <CardContent className="p-3 flex flex-col items-center gap-2 text-center">
                        <qa.icon className="h-5 w-5 text-primary" />
                        <span className="text-xs font-medium">{qa.label}</span>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                className={cn(
                  'flex',
                  msg.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    'max-w-[85%] rounded-xl px-4 py-3 text-sm',
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted/50 text-foreground'
                  )}
                >
                  {msg.role === 'assistant' ? (
                    <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-1 [&_ul]:my-1 [&_ol]:my-1 [&_li]:my-0.5">
                      <ReactMarkdown>{msg.content}</ReactMarkdown>
                    </div>
                  ) : (
                    msg.content
                  )}
                </div>
              </div>
            ))}

            {isLoading && messages[messages.length - 1]?.role !== 'assistant' && (
              <div className="flex justify-start">
                <div className="bg-muted/50 rounded-xl px-4 py-3">
                  <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Input */}
        <div className="border-t border-border p-4 space-y-2">
          {messages.length > 0 && (
            <div className="flex gap-1 overflow-x-auto pb-1">
              {QUICK_ACTIONS.map((qa) => (
                <Button
                  key={qa.label}
                  variant="outline"
                  size="sm"
                  className="shrink-0 text-xs gap-1"
                  onClick={() => sendMessage(qa.prompt)}
                  disabled={isLoading}
                >
                  <qa.icon className="h-3 w-3" />
                  {qa.label}
                </Button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <Textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about your shipments..."
              className="min-h-[44px] max-h-[120px] resize-none text-sm"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage(input);
                }
              }}
            />
            <Button
              size="icon"
              onClick={() => sendMessage(input)}
              disabled={!input.trim() || isLoading}
              className="shrink-0 h-11 w-11"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default AIAssistantPanel;
