"use client";

import React, { useState, useRef } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import {
  Home,
  Mail,
  Calendar,
  Camera,
  Music,
  Settings,
  FileText,
  MessageCircle,
  Globe,
  Folder,
  UserCheck,
  Rocket,
  Pencil,
  Code,
  UserPlus,
  Plus,
} from "lucide-react";

export interface DockItem {
  id: string;
  name: string;
  icon: React.ReactNode;
  color: string;
  onClick?: () => void;
}

export const defaultDockItems: DockItem[] = [
  {
    id: "home",
    name: "My Work",
    icon: <UserCheck />,
    color: "bg-indigo-600 shadow-indigo-600/30",
  },
  {
    id: "deployment",
    name: "Deployment",
    icon: <Rocket />,
    color: "bg-cyan-600 shadow-cyan-600/30",
  },
  {
    id: "design",
    name: "Design",
    icon: <Pencil />,
    color: "bg-purple-600 shadow-purple-600/30",
  },
  {
    id: "development",
    name: "Development",
    icon: <Code />,
    color: "bg-emerald-600 shadow-emerald-600/30",
  },
  {
    id: "projects",
    name: "Projects",
    icon: <Folder />,
    color: "bg-slate-800 shadow-slate-900/30",
  },
  {
    id: "add-task",
    name: "Add Task",
    icon: <Plus />,
    color: "bg-slate-800 shadow-slate-900/30",
  },
  {
    id: "invite",
    name: "Invite Team",
    icon: <UserPlus />,
    color: "bg-slate-800 shadow-slate-900/30",
  },
  {
    id: "settings",
    name: "Settings",
    icon: <Settings />,
    color: "bg-slate-800 shadow-slate-900/30",
  },
];

export const classicDockItems: DockItem[] = [
  { id: "finder", name: "Finder", icon: <Folder />, color: "bg-blue-500" },
  { id: "home", name: "Home", icon: <Home />, color: "bg-gray-600" },
  { id: "mail", name: "Mail", icon: <Mail />, color: "bg-blue-600" },
  { id: "calendar", name: "Calendar", icon: <Calendar />, color: "bg-red-500" },
  { id: "camera", name: "Camera", icon: <Camera />, color: "bg-gray-800" },
  {
    id: "music",
    name: "Music",
    icon: <Music />,
    color: "bg-gradient-to-br from-pink-500 to-purple-600",
  },
  {
    id: "messages",
    name: "Messages",
    icon: <MessageCircle />,
    color: "bg-green-500",
  },
  { id: "safari", name: "Safari", icon: <Globe />, color: "bg-blue-400" },
  { id: "notes", name: "Notes", icon: <FileText />, color: "bg-yellow-400" },
  {
    id: "settings",
    name: "Settings",
    icon: <Settings />,
    color: "bg-gray-500",
  },
];

function DockIcon({
  item,
  mouseX,
  activeId,
  onItemClick,
}: {
  item: DockItem;
  mouseX: any;
  activeId?: string;
  onItemClick?: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() ?? { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  const widthSync = useTransform(distance, [-150, 0, 150], [48, 76, 48]);
  const width = useSpring(widthSync, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  const heightSync = useTransform(distance, [-150, 0, 150], [48, 76, 48]);
  const height = useSpring(heightSync, {
    mass: 0.1,
    stiffness: 170,
    damping: 14,
  });

  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);

  const isActive = activeId === item.id;

  const handleClick = () => {
    setIsClicked(true);
    if (item.onClick) item.onClick();
    if (onItemClick) onItemClick(item.id);
    setTimeout(() => setIsClicked(false), 200);
  };

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={handleClick}
      className="aspect-square cursor-pointer flex items-center justify-center relative group select-none"
      whileTap={{ scale: 0.92 }}
    >
      <motion.div
        className={`w-full h-full rounded-2xl shadow-md flex items-center justify-center text-white relative overflow-hidden ${item.color}`}
        animate={{
          y: isClicked ? 4 : isHovered ? -10 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 400,
          damping: 17,
        }}
      >
        <motion.div
          className="text-lg md:text-xl"
          animate={{
            scale: isHovered ? 1.15 : 1,
          }}
          transition={{
            type: "spring",
            stiffness: 400,
            damping: 17,
          }}
        >
          {item.icon}
        </motion.div>

        {/* Shine effect */}
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent rounded-2xl pointer-events-none"
          animate={{
            opacity: isHovered ? 0.4 : 0.15,
          }}
          transition={{ duration: 0.2 }}
        />
      </motion.div>

      {/* Tooltip */}
      <motion.div
        initial={{ opacity: 0, y: 10, scale: 0.8 }}
        animate={{
          opacity: isHovered ? 1 : 0,
          y: isHovered ? -24 : 10,
          scale: isHovered ? 1 : 0.8,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
        className="absolute -top-12 left-1/2 transform -translate-x-1/2 bg-slate-900 text-white text-[11px] font-bold px-3 py-1 rounded-xl whitespace-nowrap pointer-events-none shadow-xl border border-slate-700"
      >
        {item.name}
      </motion.div>

      {/* Active indicator dot */}
      <motion.div
        className={`absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-1.5 h-1.5 rounded-full ${
          isActive
            ? "bg-indigo-600 shadow-xs shadow-indigo-500"
            : "bg-transparent"
        }`}
        animate={{
          scale: isClicked ? 1.8 : isActive ? 1.3 : 1,
          opacity: isActive ? 1 : 0,
        }}
        transition={{
          type: "spring",
          stiffness: 500,
          damping: 30,
        }}
      />
    </motion.div>
  );
}

interface DockTabsProps {
  items?: DockItem[];
  activeId?: string;
  onItemClick?: (id: string) => void;
  className?: string;
}

export function DockTabs({
  items = defaultDockItems,
  activeId,
  onItemClick,
  className = "",
}: DockTabsProps) {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      className={`flex items-center justify-center select-none w-full ${className}`}
    >
      <motion.div
        onMouseMove={(e) => mouseX.set(e.pageX)}
        onMouseLeave={() => mouseX.set(Infinity)}
        className="w-full flex h-16 items-center justify-evenly gap-4 md:gap-8 px-4 md:px-10 max-w-5xl mx-auto"
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 0.1,
        }}
      >
        {items.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            activeId={activeId}
            onItemClick={onItemClick}
          />
        ))}
      </motion.div>
    </div>
  );
}
