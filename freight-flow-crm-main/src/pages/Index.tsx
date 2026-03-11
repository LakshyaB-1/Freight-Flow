import { useState, useMemo, useEffect, useCallback } from 'react';
import { Shipment, ShipmentFormData } from '@/types/shipment';
import { useAuth } from '@/contexts/AuthContext';
import { useShipments } from '@/hooks/useShipments';
import { useUserRole } from '@/hooks/useUserRole';
import { useIsMobile } from '@/hooks/use-mobile';
import WebsiteLayout from '@/components/WebsiteLayout';
import StatCard from '@/components/StatCard';
import ShipmentTable from '@/components/ShipmentTable';
import ShipmentForm from '@/components/ShipmentForm';
import ShipmentDetails from '@/components/ShipmentDetails';
import ExcelImport from '@/components/ExcelImport';
import MobileShipmentCard from '@/components/MobileShipmentCard';
import ReportsAnalytics from '@/components/ReportsAnalytics';
import AdminUserManagement from '@/components/AdminUserManagement';
import InsightsDashboard from '@/components/InsightsDashboard';
import AIAssistantPanel from '@/components/AIAssistantPanel';
import OnboardingTutorial from '@/components/OnboardingTutorial';
import CustomerManager from '@/components/CustomerManager';
import TaskManager from '@/components/TaskManager';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Package, Clock, CheckCircle2, Container, Plus, Loader2, FileSpreadsheet,
  ChevronDown, BarChart3, Users, Search, Sparkles, UserCircle, ListTodo,
} from 'lucide-react';
import oceanShip from '@/assets/ocean-ship.jpg';

const Index = () => {
  const { user, loading: authLoading } = useAuth();
  const { shipments, loading: shipmentsLoading, addShipment, updateShipment, deleteShipment } = useShipments();
  const { isAdmin, loading: roleLoading } = useUserRole();
  const isMobile = useIsMobile();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'DONE'>('ALL');
  const [formOpen, setFormOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [editingShipment, setEditingShipment] = useState<Shipment | undefined>(undefined);
  const [excelImportOpen, setExcelImportOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('shipments');
  const [showTutorial, setShowTutorial] = useState(false);

  const handleShowTutorial = useCallback(() => setShowTutorial(true), []);

  useEffect(() => {
    window.addEventListener('show-tutorial', handleShowTutorial);
    return () => window.removeEventListener('show-tutorial', handleShowTutorial);
  }, [handleShowTutorial]);

  const stats = useMemo(() => {
    const total = shipments.length;
    const pending = shipments.filter((s: Shipment) => s.status === 'PENDING').length;
    const done = shipments.filter((s: Shipment) => s.status === 'DONE').length;
    const totalContainers = shipments.length;
    return { total, pending, done, totalContainers };
  }, [shipments]);

  const filteredShipments = useMemo(() => {
    return shipments.filter((shipment: Shipment) => {
      const matchesSearch =
        shipment.consignee.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shipment.shipper.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shipment.containerNo?.toLowerCase().includes(searchTerm.toLowerCase()) || false) ||
        shipment.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (shipment.beNo?.toLowerCase().includes(searchTerm.toLowerCase()) || false);
      const matchesStatus = statusFilter === 'ALL' || shipment.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [shipments, searchTerm, statusFilter]);

  const handleAddShipment = async (data: ShipmentFormData) => { await addShipment(data); setFormOpen(false); };
  const handleImportShipments = async (importedShipments: ShipmentFormData[]) => { for (const s of importedShipments) await addShipment(s); };
  const handleEditShipment = async (data: ShipmentFormData) => {
    if (!editingShipment) return;
    const id = editingShipment._id || editingShipment.id;
    if (id) await updateShipment(id, data);
    setEditingShipment(undefined);
    setFormOpen(false);
  };
  const handleDelete = async (id: string) => { await deleteShipment(id); };
  const handleEdit = (shipment: Shipment) => { setEditingShipment(shipment); setFormOpen(true); };
  const handleView = (shipment: Shipment) => { setSelectedShipment(shipment); setDetailsOpen(true); };
  const handleFormClose = (open: boolean) => { setFormOpen(open); if (!open) setEditingShipment(undefined); };

  if (authLoading || shipmentsLoading || roleLoading) {
    return (
      <WebsiteLayout>
        <div className="flex items-center justify-center py-32">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </WebsiteLayout>
    );
  }

  if (!user) return null;

  return (
    <WebsiteLayout>
      {/* Dashboard Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img src={oceanShip} alt="" className="w-full h-full object-cover opacity-15" />
          <div className="absolute inset-0 bg-gradient-to-b from-secondary via-secondary/95 to-secondary" />
        </div>
        <div className="container mx-auto px-4 py-8 md:py-10 relative z-10">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-secondary-foreground">
                Dashboard
              </h1>
              <p className="text-secondary-foreground/70 mt-1">
                Manage your shipments, customers, tasks, and reports.
              </p>
            </div>
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search shipments..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-secondary-foreground/10 border-secondary-foreground/20 text-secondary-foreground placeholder:text-secondary-foreground/50"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="container mx-auto px-4 py-8 space-y-8">
        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total Shipments" value={stats.total} icon={Package} variant="primary" />
          <StatCard title="Pending" value={stats.pending} icon={Clock} variant="warning" />
          <StatCard title="Completed" value={stats.done} icon={CheckCircle2} variant="success" />
          <StatCard title="Containers" value={stats.totalContainers} icon={Container} />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <TabsList className="bg-muted flex-wrap h-auto gap-1 p-1">
              <TabsTrigger value="shipments" className="gap-2">
                <Package className="h-4 w-4" /><span className="hidden sm:inline">Shipments</span>
              </TabsTrigger>
              <TabsTrigger value="customers" className="gap-2">
                <UserCircle className="h-4 w-4" /><span className="hidden sm:inline">Customers</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-2">
                <ListTodo className="h-4 w-4" /><span className="hidden sm:inline">Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="insights" className="gap-2">
                <Sparkles className="h-4 w-4" /><span className="hidden sm:inline">Insights</span>
              </TabsTrigger>
              <TabsTrigger value="reports" className="gap-2">
                <BarChart3 className="h-4 w-4" /><span className="hidden sm:inline">Reports</span>
              </TabsTrigger>
              {isAdmin && (
                <TabsTrigger value="users" className="gap-2">
                  <Users className="h-4 w-4" /><span className="hidden sm:inline">Users</span>
                </TabsTrigger>
              )}
            </TabsList>

            {activeTab === 'shipments' && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button className="gap-2 w-full sm:w-auto">
                    <Plus className="h-4 w-4" />Add Shipment<ChevronDown className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => setFormOpen(true)}><Plus className="h-4 w-4 mr-2" />Add Manually</DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setExcelImportOpen(true)}><FileSpreadsheet className="h-4 w-4 mr-2" />Import from Excel</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          <TabsContent value="shipments" className="mt-6 space-y-4">
            <Tabs value={statusFilter} onValueChange={(v) => setStatusFilter(v as typeof statusFilter)}>
              <TabsList className="bg-muted">
                <TabsTrigger value="ALL">All</TabsTrigger>
                <TabsTrigger value="PENDING">Pending</TabsTrigger>
                <TabsTrigger value="DONE">Completed</TabsTrigger>
              </TabsList>
            </Tabs>

            {isMobile ? (
              <div className="space-y-4">
                {filteredShipments.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                    <Container className="h-12 w-12 mb-4 opacity-50" />
                    <p className="text-lg font-medium">No shipments found</p>
                    <p className="text-sm">Add a new shipment to get started</p>
                  </div>
                ) : (
                  filteredShipments.map((shipment: Shipment) => (
                    <MobileShipmentCard key={shipment._id || shipment.id} shipment={shipment} onView={handleView} onEdit={handleEdit} onDelete={handleDelete} />
                  ))
                )}
              </div>
            ) : (
              <ShipmentTable shipments={filteredShipments} onEdit={handleEdit} onDelete={handleDelete} onView={handleView} />
            )}
          </TabsContent>

          <TabsContent value="customers" className="mt-6">
            <CustomerManager />
          </TabsContent>

          <TabsContent value="tasks" className="mt-6">
            <TaskManager />
          </TabsContent>

          <TabsContent value="insights" className="mt-6">
            <InsightsDashboard shipments={shipments} />
          </TabsContent>

          <TabsContent value="reports" className="mt-6">
            <ReportsAnalytics shipments={shipments} />
          </TabsContent>

          {isAdmin && (
            <TabsContent value="users" className="mt-6">
              <AdminUserManagement />
            </TabsContent>
          )}
        </Tabs>
      </section>

      {/* Modals */}
      <ShipmentForm open={formOpen} onOpenChange={handleFormClose} onSubmit={editingShipment ? handleEditShipment : handleAddShipment} initialData={editingShipment} />
      <ShipmentDetails shipment={selectedShipment} open={detailsOpen} onOpenChange={setDetailsOpen} />
      <ExcelImport open={excelImportOpen} onOpenChange={setExcelImportOpen} onImport={handleImportShipments} />
      <AIAssistantPanel shipmentId={selectedShipment?.id || selectedShipment?._id} />
      <OnboardingTutorial forceShow={showTutorial} onComplete={() => setShowTutorial(false)} />
    </WebsiteLayout>
  );
};

export default Index;
