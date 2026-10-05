import { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { Route as rootRoute } from './__root';
import { Sidebar } from '../components/workspace/Sidebar';
import { WorkspaceSidebar } from '../components/workspace/WorkspaceSidebar';
import { AddProjectModal } from '../components/workspace/AddProjectModal';
import { Header, type ViewMode } from '../components/workspace/Header';
import { TaskTable } from '../components/workspace/TaskTable';
import { KanbanBoard } from '../components/workspace/KanbanBoard';
import { AddTaskModal } from '../components/workspace/AddTaskModal';
import { InviteModal } from '../components/workspace/InviteModal';
import { TaskDetailsModal } from '../components/workspace/TaskDetailsModal';
import { TaskCommentsModal } from '../components/workspace/TaskCommentsModal';
import { KanbanToolbar } from '../components/workspace/KanbanToolbar';
import { AddBoardModal, type BoardColumnConfig } from '../components/workspace/AddBoardModal';
import { AddCustomStatusModal } from '../components/workspace/AddCustomStatusModal';
import { RequireAuth } from '../components/auth/RequireAuth';
import { DockTabs, type DockItem } from '../components/ui/dock-tabs';
import { UserCheck, Rocket, Pencil, Code, Folder, Plus, UserPlus } from 'lucide-react';
import type { Task, TaskStatus } from '../types/workspace';
import { useCurrentUser, useCreateEmployee } from '../hooks/useAuth';
import { useTeam } from '../hooks/useTeam';
import { useProjects, useCreateProject } from '../hooks/useProjects';
import { useCustomStatuses, useCreateCustomStatus } from '../hooks/useCustomStatuses';
import {
  useTasks,
  useCreateTask,
  useUpdateTask,
  useAddTaskComment,
  useAddSubtask,
  useToggleSubtask,
} from '../hooks/useTasks';

const DashboardContent = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: teamMembers = [] } = useTeam();
  const { data: projects = [] } = useProjects();
  const { data: tasks = [] } = useTasks();
  const { data: customStatuses = [] } = useCustomStatuses();

  const createProject = useCreateProject();
  const createCustomStatus = useCreateCustomStatus();
  const createTask = useCreateTask();
  const updateTask = useUpdateTask();
  const addTaskComment = useAddTaskComment();
  const addSubtask = useAddSubtask();
  const toggleSubtask = useToggleSubtask();
  const createEmployee = useCreateEmployee();

  const [viewMode, setViewMode] = useState<ViewMode>('table');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [isAddTaskModalOpen, setIsAddTaskModalOpen] = useState(false);
  const [isInviteModalOpen, setIsInviteModalOpen] = useState(false);

  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [isTaskDetailsModalOpen, setIsTaskDetailsModalOpen] = useState(false);

  const [commentingTaskId, setCommentingTaskId] = useState<string | null>(null);
  const [isCommentsModalOpen, setIsCommentsModalOpen] = useState(false);

  const [isAddCustomStatusModalOpen, setIsAddCustomStatusModalOpen] = useState(false);

  const [currentProjectId, setCurrentProjectId] = useState<string | null>(null);
  const [isAddProjectModalOpen, setIsAddProjectModalOpen] = useState(false);

  const [isAddBoardModalOpen, setIsAddBoardModalOpen] = useState(false);
  const [boardColumns, setBoardColumns] = useState<BoardColumnConfig[]>([
    { id: 'col-todo', title: 'To Do', color: 'bg-indigo-600' },
    { id: 'col-in-progress', title: 'In Progress', color: 'bg-amber-500' },
    { id: 'col-scheduled', title: 'Scheduled', color: 'bg-blue-500' },
    { id: 'col-completed', title: 'Completed', color: 'bg-emerald-600' },
  ]);

  if (!currentUser) return null;

  const isAdmin = currentUser.role === 'ADMIN';

  const selectedTask = tasks.find((t) => t.id === selectedTaskId) ?? null;
  const commentingTask = tasks.find((t) => t.id === commentingTaskId) ?? null;

  const handleAddProject = (name: string) => {
    createProject.mutate({ name }, { onSuccess: (project) => setCurrentProjectId(project.id) });
  };

  const handleAddCustomStatus = (status: { name: string; color: string }) => {
    createCustomStatus.mutate(status);
  };

  const handleAddBoardColumn = (newCol: BoardColumnConfig) => {
    setBoardColumns((prev) => [...prev, newCol]);
  };

  // Bottom Floating Dock Items configuration
  const bottomDockItems: DockItem[] = [
    {
      id: 'all',
      name: 'All Tasks',
      icon: <UserCheck />,
      color: 'bg-slate-800 shadow-slate-900/30',
      onClick: () => setActiveCategory('all')
    },
    {
      id: 'Deployment',
      name: 'Deployment',
      icon: <Rocket />,
      color: 'bg-cyan-600 shadow-cyan-600/30',
      onClick: () => setActiveCategory('Deployment')
    },
    {
      id: 'Design',
      name: 'Design',
      icon: <Pencil />,
      color: 'bg-purple-600 shadow-purple-600/30',
      onClick: () => setActiveCategory('Design')
    },
    {
      id: 'Development',
      name: 'Development',
      icon: <Code />,
      color: 'bg-emerald-600 shadow-emerald-600/30',
      onClick: () => setActiveCategory('Development')
    },
    {
      id: 'Operational',
      name: 'Operational',
      icon: <Folder />,
      color: 'bg-indigo-600 shadow-indigo-600/30',
      onClick: () => setActiveCategory('Operational')
    },
    ...(isAdmin
      ? [
          {
            id: 'add-task',
            name: 'Add New Task',
            icon: <Plus />,
            color: 'bg-slate-800 shadow-slate-900/30',
            onClick: () => setIsAddTaskModalOpen(true),
          },
          {
            id: 'invite',
            name: 'Add Employee',
            icon: <UserPlus />,
            color: 'bg-slate-800 shadow-slate-900/30',
            onClick: () => setIsInviteModalOpen(true),
          },
        ]
      : []),
  ];

  const handleTaskStatusChange = (taskId: string, newStatus: TaskStatus) => {
    updateTask.mutate({ id: taskId, status: newStatus });
  };

  const handleTaskClick = (task: Task) => {
    setSelectedTaskId(task.id);
    setIsTaskDetailsModalOpen(true);
  };

  const handleCommentClick = (task: Task) => {
    setCommentingTaskId(task.id);
    setIsCommentsModalOpen(true);
  };

  // Filter tasks based on search query AND active category
  const filteredTasks = tasks.filter((task) => {
    const matchesSearch =
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory = activeCategory === 'all' || task.type === activeCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="flex h-screen w-full bg-[#F4F5F9] overflow-hidden text-slate-900 font-sans relative">
      {/* Left Icon Rail */}
      <Sidebar />

      {/* Workspace Project Sidebar */}
      <WorkspaceSidebar
        projects={projects}
        currentProjectId={currentProjectId}
        onSelectProject={setCurrentProjectId}
        onAddProjectClick={() => setIsAddProjectModalOpen(true)}
        onInviteClick={() => setIsInviteModalOpen(true)}
        showInvite={isAdmin}
      />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        {/* Top Header */}
        <Header
          viewMode={viewMode}
          onViewModeChange={setViewMode}
          onAddNewClick={() => setIsAddTaskModalOpen(true)}
          showAddNew={isAdmin}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          currentUser={currentUser}
          teamPreview={teamMembers.filter((m) => m.id !== currentUser.id)}
        />

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {filteredTasks.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <p className="text-sm font-semibold text-slate-500">
                {tasks.length === 0
                  ? 'No tasks yet — create your first task to get started.'
                  : `No tasks found matching filter "${activeCategory}"`}
              </p>
              {tasks.length > 0 && (
                <button
                  onClick={() => setActiveCategory('all')}
                  className="text-xs font-bold text-indigo-600 hover:text-indigo-700 underline"
                >
                  Reset Filter
                </button>
              )}
            </div>
          ) : viewMode === 'table' ? (
            <TaskTable
              tasks={filteredTasks}
              customStatuses={customStatuses}
              isAdmin={isAdmin}
              onTaskStatusChange={handleTaskStatusChange}
              onAddNewTaskClick={() => setIsAddTaskModalOpen(true)}
              onOpenAddStatusModal={() => setIsAddCustomStatusModalOpen(true)}
              onTaskClick={handleTaskClick}
              onCommentClick={handleCommentClick}
            />
          ) : (
            <div className="space-y-6">
              <KanbanToolbar
                onNewBoardClick={() => setIsAddBoardModalOpen(true)}
              />
              <KanbanBoard
                tasks={filteredTasks}
                columns={boardColumns}
                isAdmin={isAdmin}
                onTaskStatusChange={handleTaskStatusChange}
                onAddNewTaskClick={() => setIsAddTaskModalOpen(true)}
                onTaskClick={handleTaskClick}
              />
            </div>
          )}
        </main>

        {/* Task Manager Dedicated Bottom Task Bar */}
        <footer className="w-full bg-white border-t border-slate-200/80 py-3 px-6 shadow-md z-30 shrink-0 flex items-center justify-center">
          <DockTabs
            items={bottomDockItems}
            activeId={activeCategory}
            onItemClick={(id) => setActiveCategory(id)}
          />
        </footer>
      </div>

      {/* Modals */}
      <AddTaskModal
        isOpen={isAddTaskModalOpen}
        customStatuses={customStatuses}
        teamMembers={teamMembers}
        onClose={() => setIsAddTaskModalOpen(false)}
        onAddTask={(payload) =>
          createTask.mutate({ ...payload, projectId: currentProjectId ?? undefined })
        }
        onOpenAddStatusModal={() => setIsAddCustomStatusModalOpen(true)}
      />

      <InviteModal
        isOpen={isInviteModalOpen}
        onClose={() => setIsInviteModalOpen(false)}
        onCreateEmployee={(payload) => createEmployee.mutateAsync(payload)}
      />

      <TaskDetailsModal
        task={selectedTask}
        customStatuses={customStatuses}
        isOpen={isTaskDetailsModalOpen}
        onClose={() => setIsTaskDetailsModalOpen(false)}
        onStatusChange={handleTaskStatusChange}
        onAddSubtask={(taskId, title) => addSubtask.mutate({ taskId, title })}
        onToggleSubtask={(taskId, subtaskId, isCompleted) =>
          toggleSubtask.mutate({ taskId, subtaskId, isCompleted })
        }
        onAddComment={(taskId, content) => addTaskComment.mutate({ taskId, content })}
        onOpenAddStatusModal={() => setIsAddCustomStatusModalOpen(true)}
      />

      <TaskCommentsModal
        task={commentingTask}
        isOpen={isCommentsModalOpen}
        onClose={() => setIsCommentsModalOpen(false)}
        onAddComment={(taskId, content) => addTaskComment.mutate({ taskId, content })}
      />

      <AddBoardModal
        isOpen={isAddBoardModalOpen}
        onClose={() => setIsAddBoardModalOpen(false)}
        onAddBoard={handleAddBoardColumn}
      />

      <AddCustomStatusModal
        isOpen={isAddCustomStatusModalOpen}
        onClose={() => setIsAddCustomStatusModalOpen(false)}
        onAddCustomStatus={handleAddCustomStatus}
      />

      <AddProjectModal
        isOpen={isAddProjectModalOpen}
        onClose={() => setIsAddProjectModalOpen(false)}
        onAddProject={handleAddProject}
      />
    </div>
  );
};

export const HomeWorkspacePage = () => (
  <RequireAuth>
    <DashboardContent />
  </RequireAuth>
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: '/dashboard',
  component: HomeWorkspacePage,
});
