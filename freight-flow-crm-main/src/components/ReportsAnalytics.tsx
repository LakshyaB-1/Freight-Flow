import { useMemo } from 'react';
import { Shipment } from '@/types/shipment';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line } from 'recharts';
import { FileDown, FileSpreadsheet } from 'lucide-react';
import { format, parseISO, startOfMonth, endOfMonth, eachMonthOfInterval, subMonths } from 'date-fns';
import ExcelJS from 'exceljs';

interface ChartData {
  name: string;
  value: number;
  fill?: string;
}

interface MonthlyData {
  month: string;
  shipments: number;
}

interface TrendData {
  month: string;
  weight: number;
  cbm: number;
}

interface SummaryStats {
  totalWeight: number;
  totalCbm: number;
  avgWeight: number;
  avgCbm: number;
}

interface ReportsAnalyticsProps {
  shipments: Shipment[];
}

const chartConfig: ChartConfig = {
  pending: {
    label: 'Pending',
    color: 'hsl(var(--warning))',
  },
  done: {
    label: 'Completed',
    color: 'hsl(var(--success))',
  },
  fcl: {
    label: 'FCL',
    color: 'hsl(var(--primary))',
  },
  lcl: {
    label: 'LCL',
    color: 'hsl(var(--accent))',
  },
  shipments: {
    label: 'Shipments',
    color: 'hsl(var(--primary))',
  },
  weight: {
    label: 'Weight (kg)',
    color: 'hsl(var(--chart-1))',
  },
  cbm: {
    label: 'CBM',
    color: 'hsl(var(--chart-2))',
  },
};

const COLORS = ['hsl(var(--primary))', 'hsl(var(--accent))', 'hsl(var(--warning))', 'hsl(var(--success))'];

const ReportsAnalytics = ({ shipments }: ReportsAnalyticsProps) => {
  const statusData = useMemo(() => {
    const pending = shipments.filter((s) => s.status === 'PENDING').length;
    const done = shipments.filter((s) => s.status === 'DONE').length;
    return [
      { name: 'Pending', value: pending, fill: 'hsl(var(--warning))' },
      { name: 'Completed', value: done, fill: 'hsl(var(--success))' },
    ];
  }, [shipments]);

  const typeData = useMemo(() => {
    const fcl = shipments.filter((s) => s.type === 'FCL').length;
    const lcl = shipments.filter((s) => s.type === 'LCL').length;
    return [
      { name: 'FCL', value: fcl, fill: 'hsl(217, 91%, 60%)' },
      { name: 'LCL', value: lcl, fill: 'hsl(0, 84%, 60%)' },
    ];
  }, [shipments]);

  const monthlyData = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return last6Months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const count = shipments.filter((s) => {
        const date = parseISO(s.date);
        return date >= monthStart && date <= monthEnd;
      }).length;

      return {
        month: format(month, 'MMM'),
        shipments: count,
      };
    });
  }, [shipments]);

  const topConsignees = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      counts[s.consignee] = (counts[s.consignee] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [shipments]);

  const topShippingLines = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      if (s.shippingLine) {
        counts[s.shippingLine] = (counts[s.shippingLine] || 0) + 1;
      }
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([name, value]) => ({ name, value }));
  }, [shipments]);

  const busiestMonths = useMemo(() => {
    const counts: Record<string, number> = {};
    shipments.forEach((s) => {
      const month = format(parseISO(s.date), 'MMM yyyy');
      counts[month] = (counts[month] || 0) + 1;
    });
    return Object.entries(counts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([name, value]) => ({ name, value }));
  }, [shipments]);

  const weightCbmTrends = useMemo(() => {
    const last6Months = eachMonthOfInterval({
      start: subMonths(new Date(), 5),
      end: new Date(),
    });

    return last6Months.map((month) => {
      const monthStart = startOfMonth(month);
      const monthEnd = endOfMonth(month);
      const monthShipments = shipments.filter((s) => {
        const date = parseISO(s.date);
        return date >= monthStart && date <= monthEnd;
      });

      const totalWeight = monthShipments.reduce((acc, s) => acc + (s.weight || 0), 0);
      const totalCbm = monthShipments.reduce((acc, s) => acc + (s.cbm || 0), 0);

      return {
        month: format(month, 'MMM'),
        weight: Math.round(totalWeight * 100) / 100,
        cbm: Math.round(totalCbm * 100) / 100,
      };
    });
  }, [shipments]);

  const summaryStats = useMemo(() => {
    const totalWeight = shipments.reduce((acc, s) => acc + (s.weight || 0), 0);
    const totalCbm = shipments.reduce((acc, s) => acc + (s.cbm || 0), 0);
    const avgWeight = shipments.length > 0 ? totalWeight / shipments.length : 0;
    const avgCbm = shipments.length > 0 ? totalCbm / shipments.length : 0;
    
    return {
      totalWeight: Math.round(totalWeight * 100) / 100,
      totalCbm: Math.round(totalCbm * 100) / 100,
      avgWeight: Math.round(avgWeight * 100) / 100,
      avgCbm: Math.round(avgCbm * 100) / 100,
    };
  }, [shipments]);

  const exportToPDF = () => {
    window.print();
  };

  const exportToExcel = async () => {
    const workbook = new ExcelJS.Workbook();
    
    // Shipments sheet
    const ws = workbook.addWorksheet('Shipments');
    ws.columns = [
      { header: 'Date', key: 'date', width: 12 },
      { header: 'BL Date', key: 'blDate', width: 12 },
      { header: 'Consignee', key: 'consignee', width: 20 },
      { header: 'Shipper', key: 'shipper', width: 20 },
      { header: 'Commodity', key: 'commodity', width: 20 },
      { header: 'Container No', key: 'containerNo', width: 18 },
      { header: 'Container Size', key: 'containerSize', width: 14 },
      { header: 'Shipping Line', key: 'shippingLine', width: 18 },
      { header: 'Type', key: 'type', width: 8 },
      { header: 'Forwarder', key: 'forwarder', width: 18 },
      { header: 'CHA', key: 'cha', width: 18 },
      { header: 'No. of Packets', key: 'noOfPackets', width: 14 },
      { header: 'Weight (kg)', key: 'weight', width: 12 },
      { header: 'CBM', key: 'cbm', width: 10 },
      { header: 'Status', key: 'status', width: 10 },
      { header: 'BE No', key: 'beNo', width: 14 },
      { header: 'BE Date', key: 'beDate', width: 12 },
      { header: 'Current Status', key: 'currentStatus', width: 18 },
      { header: 'IEC No', key: 'iecNo', width: 14 },
    ];
    
    shipments.forEach((s) => {
      ws.addRow({
        date: s.date,
        blDate: s.blDate,
        consignee: s.consignee,
        shipper: s.shipper,
        commodity: s.commodity,
        containerNo: s.containerNo,
        containerSize: s.containerSize ? s.containerSize + "'" : '',
        shippingLine: s.shippingLine,
        type: s.type,
        forwarder: s.forwarder,
        cha: s.cha,
        noOfPackets: s.noOfPackets,
        weight: s.weight,
        cbm: s.cbm,
        status: s.status,
        beNo: s.beNo,
        beDate: s.beDate,
        currentStatus: s.currentStatus,
        iecNo: s.iecNo,
      });
    });

    // Summary sheet
    const summaryWs = workbook.addWorksheet('Summary');
    summaryWs.columns = [
      { header: 'Metric', key: 'metric', width: 20 },
      { header: 'Value', key: 'value', width: 15 },
    ];
    summaryWs.addRow({ metric: 'Total Shipments', value: shipments.length });
    summaryWs.addRow({ metric: 'Pending', value: shipments.filter((s) => s.status === 'PENDING').length });
    summaryWs.addRow({ metric: 'Completed', value: shipments.filter((s) => s.status === 'DONE').length });
    summaryWs.addRow({ metric: 'FCL Shipments', value: shipments.filter((s) => s.type === 'FCL').length });
    summaryWs.addRow({ metric: 'LCL Shipments', value: shipments.filter((s) => s.type === 'LCL').length });
    summaryWs.addRow({ metric: 'Total Weight (kg)', value: Number(shipments.reduce((acc, s) => acc + s.weight, 0).toFixed(2)) });
    summaryWs.addRow({ metric: 'Total CBM', value: Number(shipments.reduce((acc, s) => acc + s.cbm, 0).toFixed(2)) });

    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Freight_Link_Report_${format(new Date(), 'yyyy-MM-dd')}.xlsx`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6 print:bg-white print-reports-area">
      {/* Export Buttons */}
      <div className="flex gap-3 print:hidden">
        <Button onClick={exportToPDF} variant="outline" className="gap-2">
          <FileDown className="h-4 w-4" />
          Export PDF
        </Button>
        <Button onClick={exportToExcel} variant="outline" className="gap-2">
          <FileSpreadsheet className="h-4 w-4" />
          Export Excel
        </Button>
      </div>

      {/* Summary Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{summaryStats.totalWeight.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total Weight (kg)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{summaryStats.totalCbm.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Total CBM</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{summaryStats.avgWeight.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Avg Weight (kg)</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold text-primary">{summaryStats.avgCbm.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">Avg CBM</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <PieChart>
                <Pie
                  data={statusData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {statusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Type Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Shipment Types</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <PieChart>
                <Pie
                  data={typeData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, value }) => `${name}: ${value}`}
                >
                  {typeData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Shipping Lines */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Top Shipping Lines</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={topShippingLines} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                <Bar dataKey="value" fill="hsl(var(--chart-3))" radius={[0, 4, 4, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Busiest Months */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Busiest Months</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[200px]">
              <BarChart data={busiestMonths}>
                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                <YAxis />
                <Bar dataKey="value" fill="hsl(var(--chart-4))" radius={[4, 4, 0, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Monthly Trend */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Monthly Shipments Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={monthlyData}>
                <XAxis dataKey="month" />
                <YAxis />
                <Line
                  type="monotone"
                  dataKey="shipments"
                  stroke="hsl(var(--primary))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--primary))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Weight/CBM Trends */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Weight & CBM Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <LineChart data={weightCbmTrends}>
                <XAxis dataKey="month" />
                <YAxis yAxisId="weight" orientation="left" stroke="hsl(var(--chart-1))" />
                <YAxis yAxisId="cbm" orientation="right" stroke="hsl(var(--chart-2))" />
                <Line
                  yAxisId="weight"
                  type="monotone"
                  dataKey="weight"
                  name="Weight (kg)"
                  stroke="hsl(var(--chart-1))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-1))' }}
                />
                <Line
                  yAxisId="cbm"
                  type="monotone"
                  dataKey="cbm"
                  name="CBM"
                  stroke="hsl(var(--chart-2))"
                  strokeWidth={2}
                  dot={{ fill: 'hsl(var(--chart-2))' }}
                />
                <ChartTooltip content={<ChartTooltipContent />} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Consignees */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Top Consignees</CardTitle>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[250px]">
              <BarChart data={topConsignees} layout="vertical">
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Bar dataKey="value" fill="hsl(var(--primary))" radius={[0, 4, 4, 0]} />
                <ChartTooltip content={<ChartTooltipContent />} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
