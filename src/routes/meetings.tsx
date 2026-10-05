import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Sidebar } from "../components/workspace/Sidebar";
import { MeetingCard } from "../components/meetings/MeetingCard";
import { CreateMeetingModal } from "../components/meetings/CreateMeetingModal";
import { RequireAuth } from "../components/auth/RequireAuth";
import {
  Plus,
  Search,
  SlidersHorizontal,
  Download,
  Calendar as CalendarIcon,
  ChevronDown,
} from "lucide-react";
import type { MeetingStatus } from "../types/meeting";
import { useCurrentUser } from "../hooks/useAuth";
import { useMeetings, useCreateMeeting, useUpdateMeetingStatus } from "../hooks/useMeetings";

const MeetingsContent = () => {
  const { data: currentUser } = useCurrentUser();
  const { data: meetings = [] } = useMeetings();
  const createMeeting = useCreateMeeting();
  const updateMeetingStatus = useUpdateMeetingStatus();

  const [activeTab, setActiveTab] = useState<
    "Upcoming" | "Ongoing" | "Rescheduled" | "Cancelled"
  >("Upcoming");
  const [searchQuery, setSearchQuery] = useState("");
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  if (!currentUser) return null;

  const handleStatusChange = (meetingId: string, newStatus: MeetingStatus) => {
    updateMeetingStatus.mutate({ id: meetingId, status: newStatus });
  };

  // Group meetings by date
  const filteredMeetings = meetings.filter((meeting) => {
    const matchesSearch =
      meeting.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      meeting.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (!matchesSearch) return false;

    if (activeTab === "Upcoming") return true;
    return meeting.status === activeTab;
  });

  const dateGroups = Array.from(
    new Set(filteredMeetings.map((m) => m.dateGroup)),
  );

  const nextMeeting = meetings.find((m) => m.status === "Ongoing" || m.status === "Pending");

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header Banner */}
        <header className="w-full bg-white border-b border-slate-200/80 px-6 md:px-8 py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sticky top-0 z-20 shadow-2xs">
          <div className="space-y-1">
            <h1 className="text-xl md:text-2xl font-semibold text-slate-900 tracking-tight flex items-center gap-2">
              <span>Good Morning, {currentUser.fullName}</span>
              <span className="inline-block animate-bounce">👋</span>
            </h1>
            <p className="text-xs md:text-sm text-slate-500 font-normal">
              New day, new opportunities — Let's make the most of today's
              meetings.
            </p>
          </div>

          {/* Top Right Next Meeting Card */}
          {nextMeeting && (
            <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 px-4 flex items-center gap-3 shadow-2xs">
              <div className="w-8 h-8 rounded-full bg-amber-400 text-amber-900 font-normal text-xs flex items-center justify-center flex-shrink-0 shadow-xs">
                {nextMeeting.title.charAt(0)}
              </div>
              <div className="text-xs">
                <span className="font-medium text-slate-900 block">
                  {nextMeeting.title}
                </span>
                <span className="text-slate-500">{nextMeeting.dateGroup} · {nextMeeting.startTime}</span>
              </div>
            </div>
          )}
        </header>

        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          {/* Action & Filter Bar */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 bg-white p-3 md:p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1 sm:pb-0">
              {(
                ["Upcoming", "Ongoing", "Rescheduled", "Cancelled"] as const
              ).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-4 py-2 text-xs font-normal rounded-xl transition-all whitespace-nowrap ${
                    activeTab === tab
                      ? "bg-indigo-50 text-indigo-600 font-medium border border-indigo-200/80 shadow-2xs"
                      : "text-slate-500 hover:text-slate-800 hover:bg-slate-100/70"
                  }`}
                >
                  {tab}
                </button>
              ))}

              <div className="h-6 w-px bg-slate-200 mx-1" />

              {/* Date Range Dropdown */}
              <button className="flex items-center gap-2 border border-slate-200/80 hover:bg-slate-50 px-3.5 py-2 rounded-xl text-xs font-normal text-slate-700 transition-colors">
                <CalendarIcon className="w-4 h-4 text-slate-400" />
                <span>Date Range</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
              </button>
            </div>

            {/* Right Action Controls */}
            <div className="flex items-center gap-2.5">
              {/* Search Toggle */}
              {isSearchOpen ? (
                <div className="relative flex items-center bg-slate-100 rounded-xl px-3 py-1.5 border border-slate-300">
                  <Search className="w-4 h-4 text-slate-400 mr-2" />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search meetings..."
                    className="bg-transparent text-xs text-slate-900 placeholder:text-slate-400 focus:outline-none w-36 sm:w-48 font-normal"
                    autoFocus
                  />
                  <button
                    onClick={() => setIsSearchOpen(false)}
                    className="text-slate-400 hover:text-slate-600 text-xs ml-1 font-normal"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2.5 border border-slate-200/80 rounded-xl hover:bg-slate-50 text-slate-600 transition-colors"
                  title="Search"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}

              {/* Filter */}
              <button className="flex items-center gap-1.5 border border-slate-200/80 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-normal text-slate-700 transition-colors">
                <SlidersHorizontal className="w-4 h-4 text-slate-500" />
                <span>Filter</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>

              {/* Export */}
              <button className="flex items-center gap-1.5 border border-slate-200/80 hover:bg-slate-50 px-3.5 py-2.5 rounded-xl text-xs font-normal text-slate-700 transition-colors">
                <Download className="w-4 h-4 text-slate-500" />
                <span>Export</span>
              </button>

              {/* + Create Appointment Primary Button */}
              <button
                onClick={() => setIsCreateModalOpen(true)}
                className="bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-semibold text-xs px-5 py-2.5 rounded-xl shadow-md shadow-indigo-600/20 flex items-center gap-2 transition-all active:scale-[0.98]"
              >
                <Plus className="w-4 h-4 stroke-2" />
                <span>Create Appointment</span>
              </button>
            </div>
          </div>

          {/* Grouped Date Meetings List */}
          {dateGroups.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <p className="text-sm font-normal text-slate-500">
                {meetings.length === 0
                  ? "No meetings scheduled yet — create your first appointment."
                  : "No meetings found in this view."}
              </p>
              <button
                onClick={() => {
                  setActiveTab("Upcoming");
                  setSearchQuery("");
                }}
                className="text-xs font-medium text-indigo-600 hover:text-indigo-700 underline"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            dateGroups.map((date) => {
              const groupMeetings = filteredMeetings.filter(
                (m) => m.dateGroup === date,
              );

              return (
                <div key={date} className="space-y-4">
                  {/* Group Date Title */}
                  <h2 className="text-sm font-semibold text-slate-800 px-1 flex items-center gap-2">
                    <CalendarIcon className="w-4 h-4 text-indigo-600" />
                    <span>{date}</span>
                  </h2>

                  {/* Meeting cards for this date */}
                  <div className="space-y-4">
                    {groupMeetings.map((meeting) => (
                      <MeetingCard
                        key={meeting.id}
                        meeting={meeting}
                        onStatusChange={handleStatusChange}
                      />
                    ))}
                  </div>
                </div>
              );
            })
          )}
        </main>
      </div>

      {/* Modal */}
      <CreateMeetingModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreateMeeting={(payload) => createMeeting.mutate(payload)}
      />
    </div>
  );
};

export const MeetingsPage = () => (
  <RequireAuth>
    <MeetingsContent />
  </RequireAuth>
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/meetings",
  component: MeetingsPage,
});
