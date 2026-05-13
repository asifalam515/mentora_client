"use client";

import {
  Bell,
  ChevronDown,
  Home,
  Settings,
  User,
  Search,
  MessageSquare,
  type LucideIcon,
  Menu,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useMemo, useState } from "react";
import { motion } from "framer-motion";

import { ModeToggle } from "@/components/(shared)/ModeToggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

type NavItem = {
  title: string;
  href: string;
  icon: LucideIcon;
  notifs?: number;
};

type DashboardSidebarShellProps = {
  title?: string;
  subtitle?: string;
  userName?: string;
  userPlan?: string;
  navItems: NavItem[];
  accountItems?: NavItem[];
  children: React.ReactNode;
};

type OptionProps = {
  item: NavItem;
  open: boolean;
  selectedPath: string;
};

export const DashboardWithCollapsibleSidebar = ({
  title = "Dashboard",
  subtitle = "Welcome back to your dashboard",
  userName = "Mentora User",
  userPlan = "Pro Plan",
  navItems,
  accountItems = [],
  children,
}: DashboardSidebarShellProps) => {
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen w-full bg-background text-foreground">
      <div className="hidden md:block">
        <Sidebar
          navItems={navItems}
          accountItems={accountItems}
          userName={userName}
          userPlan={userPlan}
        />
      </div>

      <div className="flex-1 flex flex-col min-w-0">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border/50 bg-background/80 backdrop-blur-md sticky top-0 z-50">
          <Logo />
          <Button variant="ghost" size="icon" onClick={() => setIsMobileOpen(!isMobileOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>

        {/* Mobile Sidebar */}
        {isMobileOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-background pt-16">
            <Sidebar
              navItems={navItems}
              accountItems={accountItems}
              userName={userName}
              userPlan={userPlan}
            />
          </div>
        )}

        <DashboardContent title={title} subtitle={subtitle} userName={userName} userPlan={userPlan}>
          {children}
        </DashboardContent>
      </div>
    </div>
  );
};

type SidebarProps = {
  navItems: NavItem[];
  accountItems: NavItem[];
  userName: string;
  userPlan: string;
};

const Sidebar = ({
  navItems,
  accountItems,
  userName,
  userPlan,
}: SidebarProps) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const selectedPath = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;

  return (
    <nav className="sticky top-0 h-screen w-64 shrink-0 border-r border-border/50 bg-card p-4 shadow-sm flex flex-col">
      <TitleSection userName={userName} userPlan={userPlan} />

      <div className="space-y-1 flex-1 overflow-y-auto">
        {navItems.map((item) => (
          <Option
            key={item.href}
            item={item}
            selectedPath={selectedPath}
            open
          />
        ))}

        {accountItems.length > 0 && (
          <div className="space-y-1 mt-6">
            <div className="px-3 py-2 text-xs font-medium tracking-wider text-muted-foreground uppercase">
              Account
            </div>
            {accountItems.map((item) => (
              <Option
                key={item.href}
                item={item}
                selectedPath={selectedPath}
                open
              />
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

const Option = ({ item, selectedPath, open }: OptionProps) => {
  const Icon = item.icon;
  const isSelected =
    selectedPath === item.href ||
    (item.href !== "/dashboard" && selectedPath.startsWith(item.href));

  return (
    <Link
      href={item.href}
      aria-current={isSelected ? "page" : undefined}
      className={`relative flex h-10 w-full items-center rounded-lg transition-all duration-200 group ${
        isSelected
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
      }`}
    >
      {isSelected && (
        <motion.div 
          layoutId="activeTab" 
          className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-full" 
          initial={false}
        />
      )}
      <div
        className={`grid h-full w-12 place-content-center transition-transform group-hover:scale-110 ${
          isSelected ? "text-primary" : ""
        }`}
      >
        <Icon className="h-4 w-4" />
      </div>

      {open && (
        <span
          className={`text-sm font-medium transition-opacity duration-200 ${
            isSelected ? "font-semibold" : ""
          }`}
        >
          {item.title}
        </span>
      )}

      {item.notifs && open && (
        <span className="absolute right-3 flex h-5 min-w-[20px] px-1.5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow-sm">
          {item.notifs}
        </span>
      )}
    </Link>
  );
};

type TitleSectionProps = {
  userName: string;
  userPlan: string;
};

const TitleSection = ({ userName, userPlan }: TitleSectionProps) => {
  return (
    <div className="mb-6 border-b border-border/50 pb-6">
      <div className="flex items-center gap-3 px-2">
        <Logo />
        <span className="font-bold text-lg tracking-tight">SkillBridge</span>
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-8 shrink-0 place-content-center rounded-lg bg-gradient-to-br from-primary to-primary/80 shadow-md">
      <Home className="h-4 w-4 text-primary-foreground" />
    </div>
  );
};

type DashboardContentProps = {
  title: string;
  subtitle: string;
  userName: string;
  userPlan: string;
  children: React.ReactNode;
};

const DashboardContent = ({
  title,
  subtitle,
  userName,
  userPlan,
  children,
}: DashboardContentProps) => {
  const headline = useMemo(() => title, [title]);

  return (
    <div className="flex-1 overflow-auto bg-background/50">
      {/* Top Navbar */}
      <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-md">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative hidden md:flex w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Search anything..." 
              className="h-9 w-full rounded-md border border-input bg-muted/50 pl-9 pr-4 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <ModeToggle />
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground">
            <MessageSquare className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-primary ring-2 ring-background" />
          </Button>
          <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-foreground mr-2">
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-rose-500 ring-2 ring-background" />
          </Button>
          <div className="h-8 w-px bg-border/50 mr-2 hidden sm:block" />
          <div className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity">
            <Avatar className="h-8 w-8 border border-border/50">
              <AvatarImage src="" />
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">{userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="hidden sm:block text-sm text-left">
              <p className="font-medium leading-none text-foreground">{userName}</p>
              <p className="text-[10px] text-muted-foreground mt-1">{userPlan}</p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground hidden sm:block" />
          </div>
        </div>
      </header>

      <main className="p-6 md:p-8 max-w-7xl mx-auto">
        <div className="mb-8">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold tracking-tight text-foreground"
          >
            {headline}
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mt-1 text-sm text-muted-foreground"
          >
            {subtitle}
          </motion.p>
        </div>

        {children}
      </main>
    </div>
  );
};
