import { useState } from "react";
import { createRoute } from "@tanstack/react-router";
import { Route as rootRoute } from "./__root";
import { Sidebar } from "../components/workspace/Sidebar";
import { ScannerCardStream } from "../components/ui/scanner-card-stream";
import { RequireAuth } from "../components/auth/RequireAuth";
import { Mail, Sparkles, Award, Search } from "lucide-react";
import { useTeam } from "../hooks/useTeam";

const TeamContent = () => {
  const { data: teamData = [] } = useTeam();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeDepartment, setActiveDepartment] = useState("All");

  const departments = ["All", ...Array.from(new Set(teamData.map((m) => m.department)))];

  const filteredMembers = teamData.filter((member) => {
    const matchesSearch =
      member.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.jobTitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      member.skills.some((s) =>
        s.toLowerCase().includes(searchQuery.toLowerCase()),
      );

    const matchesDept =
      activeDepartment === "All" || member.department === activeDepartment;

    return matchesSearch && matchesDept;
  });

  return (
    <div className="flex h-screen w-full bg-[#F8FAFC] overflow-hidden text-slate-900 font-sans">
      {/* Left Navigation Sidebar */}
      <Sidebar />

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Scrollable Content Container */}
        <main className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8">
          {/* Header Banner */}
          <div className="bg-white rounded-3xl border border-slate-200/80 p-6 md:p-8 shadow-2xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <span className="bg-indigo-50 text-indigo-700 text-xs px-3 py-1 rounded-full font-normal flex items-center gap-1.5 border border-indigo-200/80">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>i11Sprint Innovators</span>
                  </span>
                </div>
                <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">
                  Meet The Team
                </h1>
                <p className="text-xs font-normal text-slate-500 mt-1 max-w-xl">
                  The talented engineers, designers, and strategists
                  collaborating to accelerate your team's software potential.
                </p>
              </div>

              {/* Department Count Pill */}
              <div className="flex items-center gap-3 bg-slate-50 border border-slate-200/60 p-3 rounded-2xl">
                <div className="w-10 h-10 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-normal">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-sm font-semibold text-slate-900 block">
                    {teamData.length} Specialists
                  </span>
                  <span className="text-[11px] font-normal text-slate-400">
                    across {departments.length - 1} departments
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3D WebGL Scanner Card Stream Component */}
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/80 space-y-4 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3 relative z-20">
              <span className="text-xs font-normal text-indigo-600 flex items-center gap-2">
                <span>i11Labs Team Stream</span>
              </span>
              <span className="text-[11px] text-slate-500 font-normal">
                Drag or scroll to inspect team profiles
              </span>
            </div>

            <ScannerCardStream
              teamMembers={teamData.map((m) => ({
                name: m.fullName,
                role: m.jobTitle,
                image: m.avatarUrl ?? '',
              }))}
              initialSpeed={140}
              repeat={4}
              cardGap={40}
            />
          </div>

          {/* Department Filter Bar & Search */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-2 rounded-2xl border border-slate-200/80 shadow-2xs">
            {/* Filter Tabs */}
            <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto">
              {departments.map((dept) => (
                <button
                  key={dept}
                  onClick={() => setActiveDepartment(dept)}
                  className={`px-4 py-2 text-xs font-normal rounded-xl transition-all whitespace-nowrap ${
                    activeDepartment === dept
                      ? "bg-slate-900 text-white shadow-xs"
                      : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/70"
                  }`}
                >
                  {dept}
                </button>
              ))}
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search team member..."
                className="w-full bg-slate-50 border border-slate-200/80 focus:border-indigo-500 focus:bg-white rounded-xl pl-9 pr-4 py-2 text-xs font-normal focus:outline-none transition-all"
              />
            </div>
          </div>

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredMembers.map((member) => (
              <div
                key={member.id}
                className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-2xs hover:shadow-md hover:border-indigo-200 transition-all space-y-4 flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Avatar & Department Pill */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative">
                      <img
                        src={member.avatarUrl ?? undefined}
                        alt={member.fullName}
                        className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 group-hover:border-indigo-500 transition-all shadow-sm bg-slate-100"
                      />
                      <span className="w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-white absolute -bottom-1 -right-1" />
                    </div>

                    <span className="bg-slate-100 text-slate-700 text-[10px] font-normal px-2.5 py-1 rounded-full border border-slate-200/80">
                      {member.department}
                    </span>
                  </div>

                  {/* Name & Role */}
                  <div>
                    <h3 className="text-base font-semibold text-slate-900 group-hover:text-indigo-600 transition-colors">
                      {member.fullName}
                    </h3>
                    <p className="text-xs font-normal text-indigo-600 mt-0.5">
                      {member.jobTitle}
                    </p>
                  </div>

                  {/* Bio */}
                  <p className="text-xs font-normal text-slate-500 leading-relaxed line-clamp-3">
                    {member.bio}
                  </p>

                  {/* Skills Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {member.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-indigo-50/70 text-indigo-700 font-normal text-[10px] px-2.5 py-0.5 rounded-md border border-indigo-100"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Footer Action Links */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs font-normal text-slate-400">
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-1.5 text-slate-600 hover:text-indigo-600 transition-colors"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span className="text-[11px]">Email</span>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>
    </div>
  );
};

export const TeamPage = () => (
  <RequireAuth>
    <TeamContent />
  </RequireAuth>
);

export const Route = createRoute({
  getParentRoute: () => rootRoute,
  path: "/team",
  component: TeamPage,
});
