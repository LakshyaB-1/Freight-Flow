import { useState } from 'react';
import { useTasks, Task, TaskFormData } from '@/hooks/useTasks';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Plus, Loader2, Calendar, Flag, CheckCircle2, Circle, Clock, AlertTriangle, Trash2 } from 'lucide-react';
import { format, isPast, isToday } from 'date-fns';

const priorityConfig: Record<string, { color: string; icon: typeof Flag }> = {
  high: { color: 'text-destructive', icon: AlertTriangle },
  medium: { color: 'text-warning', icon: Flag },
  low: { color: 'text-muted-foreground', icon: Flag },
};

const TaskManager = () => {
  const { tasks, loading, addTask, updateTask, deleteTask } = useTasks();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filter, setFilter] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');

  const filtered = tasks.filter(t => filter === 'all' || t.status === filter);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: TaskFormData = {
      title: fd.get('title') as string,
      description: fd.get('description') as string,
      priority: fd.get('priority') as string,
      dueDate: fd.get('dueDate') as string || undefined,
    };
    await addTask(data);
    setDialogOpen(false);
  };

  const toggleComplete = async (task: Task) => {
    const newStatus = task.status === 'completed' ? 'pending' : 'completed';
    await updateTask(task.id, { status: newStatus });
  };

  const handleDelete = async (id: string) => {
    if (confirm('Delete this task?')) await deleteTask(id);
  };

  if (loading) {
    return <div className="flex justify-center py-12"><Loader2 className="h-6 w-6 animate-spin text-primary" /></div>;
  }

  const counts = {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
  };

  const overdue = tasks.filter(t => t.status !== 'completed' && t.dueDate && isPast(new Date(t.dueDate)) && !isToday(new Date(t.dueDate)));

  return (
    <div className="space-y-6">
      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {([['all', 'All Tasks', Circle], ['pending', 'Pending', Clock], ['in_progress', 'In Progress', Flag], ['completed', 'Completed', CheckCircle2]] as const).map(([key, label, Icon]) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`p-4 rounded-xl border text-left transition-all ${filter === key ? 'border-primary bg-primary/5 shadow-sm' : 'border-border bg-card hover:border-primary/30'}`}
          >
            <div className="flex items-center gap-2 mb-1">
              <Icon className={`h-4 w-4 ${filter === key ? 'text-primary' : 'text-muted-foreground'}`} />
              <span className="text-xs font-medium text-muted-foreground">{label}</span>
            </div>
            <p className="text-2xl font-bold text-foreground">{counts[key]}</p>
          </button>
        ))}
      </div>

      {/* Overdue warning */}
      {overdue.length > 0 && (
        <div className="flex items-center gap-3 p-4 bg-destructive/10 border border-destructive/20 rounded-xl">
          <AlertTriangle className="h-5 w-5 text-destructive shrink-0" />
          <p className="text-sm text-foreground">
            <strong>{overdue.length} overdue task{overdue.length > 1 ? 's' : ''}</strong> — {overdue.map(t => t.title).join(', ')}
          </p>
        </div>
      )}

      {/* Add task */}
      <div className="flex justify-end">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2"><Plus className="h-4 w-4" />New Task</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Create Task</DialogTitle></DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input id="title" name="title" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority</Label>
                  <Select name="priority" defaultValue="medium">
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Low</SelectItem>
                      <SelectItem value="medium">Medium</SelectItem>
                      <SelectItem value="high">High</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input id="dueDate" name="dueDate" type="date" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Cancel</Button>
                <Button type="submit">Create Task</Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Task list */}
      {filtered.length === 0 ? (
        <div className="flex flex-col items-center py-16 text-muted-foreground">
          <CheckCircle2 className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-lg font-medium">No tasks found</p>
          <p className="text-sm">Create a task to track your follow-ups</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(task => {
            const isOverdue = task.status !== 'completed' && task.dueDate && isPast(new Date(task.dueDate)) && !isToday(new Date(task.dueDate));
            const pConfig = priorityConfig[task.priority] || priorityConfig.medium;
            return (
              <Card key={task.id} className={`border transition-all hover:shadow-sm ${isOverdue ? 'border-destructive/30 bg-destructive/5' : 'border-border'} ${task.status === 'completed' ? 'opacity-60' : ''}`}>
                <CardContent className="p-4 flex items-start gap-3">
                  <Checkbox
                    checked={task.status === 'completed'}
                    onCheckedChange={() => toggleComplete(task)}
                    className="mt-1"
                  />
                  <div className="flex-1 min-w-0">
                    <p className={`font-medium text-foreground ${task.status === 'completed' ? 'line-through' : ''}`}>{task.title}</p>
                    {task.description && <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>}
                    <div className="flex flex-wrap gap-2 mt-2">
                      <Badge variant="outline" className={`text-xs gap-1 ${pConfig.color}`}>
                        <pConfig.icon className="h-3 w-3" />
                        {task.priority}
                      </Badge>
                      {task.dueDate && (
                        <Badge variant="outline" className={`text-xs gap-1 ${isOverdue ? 'text-destructive border-destructive/30' : ''}`}>
                          <Calendar className="h-3 w-3" />
                          {format(new Date(task.dueDate), 'MMM d, yyyy')}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Button size="icon" variant="ghost" className="text-destructive hover:text-destructive shrink-0" onClick={() => handleDelete(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TaskManager;
