import { useMemo, useState, useEffect } from 'react';
import { Shipment } from '@/types/shipment';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  AlertTriangle,
  TrendingUp,
  Clock,
  Package,
  Sparkles,
  Loader2,
  RefreshCw,
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';

interface InsightsDashboardProps {
  shipments: Shipment[];
}

const InsightsDashboard = ({ shipments }: InsightsDashboardProps) => {
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);

  const insights = useMemo(() => {
    const now = new Date();
    const pending = shipments.filter((s) => s.status === 'PENDING');
    const completed = shipments.filter((s) => s.status === 'DONE');

    // At risk: pending for > 14 days
    const atRisk = pending.filter((s) => {
      const created = new Date(s.createdAt || s.date);
      const days = (now.getTime() - created.getTime()) / (1000 * 60 * 60 * 24);
      return days > 14;
    });

    // Recent activity: completed in last 7 days
    const recentCompleted = completed.filter((s) => {
      const updated = new Date(s.updatedAt || s.date);
      const days = (now.getTime() - updated.getTime()) / (1000 * 60 * 60 * 24);
      return days <= 7;
    });

    // Busiest shipping lines
    const lineCount: Record<string, number> = {};
    shipments.forEach((s) => {
      if (s.shippingLine) {
        lineCount[s.shippingLine] = (lineCount[s.shippingLine] || 0) + 1;
      }
    });
    const topLines = Object.entries(lineCount)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3);

    return { pending, completed, atRisk, recentCompleted, topLines };
  }, [shipments]);

  const fetchAISummary = async () => {
    setSummaryLoading(true);
    setAiSummary('');

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.access_token) {
        throw new Error('You must be logged in to use AI insights');
      }

      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/ai-assistant`;
      const resp = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({
          messages: [{ role: 'user', content: 'Give me a daily insights summary including at-risk shipments, key stats, and top recommendations. Be concise.' }],
        }),
      });

      if (!resp.ok || !resp.body) {
        throw new Error('Failed to get AI insights');
      }

      const reader = resp.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        buffer += decoder.decode(value, { stream: true });

        let idx: number;
        while ((idx = buffer.indexOf('\n')) !== -1) {
          let line = buffer.slice(0, idx);
          buffer = buffer.slice(idx + 1);
          if (line.endsWith('\r')) line = line.slice(0, -1);
          if (!line.startsWith('data: ')) continue;
          const jsonStr = line.slice(6).trim();
          if (jsonStr === '[DONE]') break;
          try {
            const parsed = JSON.parse(jsonStr);
            const content = parsed.choices?.[0]?.delta?.content;
            if (content) {
              result += content;
              setAiSummary(result);
            }
          } catch { /* partial */ }
        }
      }
    } catch (err: any) {
      setAiSummary(`⚠️ Could not generate AI summary: ${err.message}`);
    } finally {
      setSummaryLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-primary/10 p-2 rounded-lg">
              <Package className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold">{shipments.length}</p>
              <p className="text-xs text-muted-foreground">Total Shipments</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-warning/10 p-2 rounded-lg">
              <Clock className="h-5 w-5 text-warning" />
            </div>
            <div>
              <p className="text-2xl font-bold">{insights.pending.length}</p>
              <p className="text-xs text-muted-foreground">Pending</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-destructive/10 p-2 rounded-lg">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <div>
              <p className="text-2xl font-bold">{insights.atRisk.length}</p>
              <p className="text-xs text-muted-foreground">At Risk</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="bg-success/10 p-2 rounded-lg">
              <TrendingUp className="h-5 w-5 text-success" />
            </div>
            <div>
              <p className="text-2xl font-bold">{insights.recentCompleted.length}</p>
              <p className="text-xs text-muted-foreground">Completed (7d)</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* At-Risk Shipments */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              Shipments at Risk
            </CardTitle>
            <CardDescription>Pending for more than 14 days</CardDescription>
          </CardHeader>
          <CardContent>
            {insights.atRisk.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">No shipments at risk 🎉</p>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="space-y-2">
                  {insights.atRisk.map((s) => {
                    const days = Math.round(
                      (Date.now() - new Date(s.createdAt || s.date).getTime()) / (1000 * 60 * 60 * 24)
                    );
                    return (
                      <div key={s.id} className="flex items-center justify-between p-3 rounded-lg bg-destructive/5 border border-destructive/10">
                        <div className="min-w-0">
                          <p className="text-sm font-medium truncate">{s.consignee}</p>
                          <p className="text-xs text-muted-foreground">{s.commodity}</p>
                        </div>
                        <Badge variant="outline" className="shrink-0 text-destructive border-destructive/30">
                          {days}d overdue
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>

        {/* AI Summary */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4 text-primary" />
                AI Daily Summary
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                className="gap-1 text-xs"
                onClick={fetchAISummary}
                disabled={summaryLoading}
              >
                {summaryLoading ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <RefreshCw className="h-3 w-3" />
                )}
                {aiSummary ? 'Refresh' : 'Generate'}
              </Button>
            </div>
            <CardDescription>AI-powered operational insights</CardDescription>
          </CardHeader>
          <CardContent>
            {!aiSummary && !summaryLoading ? (
              <div className="text-center py-6">
                <Sparkles className="h-8 w-8 mx-auto text-muted-foreground/30 mb-2" />
                <p className="text-sm text-muted-foreground">
                  Click "Generate" to get your AI insights
                </p>
              </div>
            ) : summaryLoading && !aiSummary ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-5 w-5 animate-spin text-primary" />
              </div>
            ) : (
              <ScrollArea className="h-[200px]">
                <div className="prose prose-sm max-w-none dark:prose-invert [&_p]:my-1 [&_ul]:my-1 [&_li]:my-0.5 text-sm">
                  <ReactMarkdown>{aiSummary}</ReactMarkdown>
                </div>
              </ScrollArea>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default InsightsDashboard;
