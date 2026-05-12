"use client";

import {
  Bell,
  ChevronDown,
  Home,
  Settings,
  User,
  type LucideIcon,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import React, { useMemo } from "react";

import { ModeToggle } from "@/components/(shared)/ModeToggle";

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
  return (
    <div className="flex min-h-screen w-full">
      <div className="flex w-full bg-background text-foreground">
        <Sidebar
          navItems={navItems}
          accountItems={accountItems}
          userName={userName}
          userPlan={userPlan}
        />
        <DashboardContent title={title} subtitle={subtitle}>
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
    <nav className="sticky top-0 h-screen w-64 shrink-0 border-r border-border bg-card p-2 shadow-sm">
      <TitleSection userName={userName} userPlan={userPlan} />

      <div className="mb-8 space-y-1">
        {navItems.map((item) => (
          <Option
            key={item.href}
            item={item}
            selectedPath={selectedPath}
            open
          />
        ))}
      </div>

      {accountItems.length > 0 && (
        <div className="space-y-1 border-t border-border pt-4">
          <div className="px-3 py-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
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
      className={`relative flex h-10 w-full items-center rounded-md transition-all duration-200 ${
        isSelected
          ? "bg-primary/10 text-primary font-medium"
          : "text-muted-foreground hover:bg-muted hover:text-foreground"
      }`}
    >
      <div
        className={`grid h-full w-12 place-content-center ${
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
        <span className="absolute right-3 flex h-5 w-5 items-center justify-center rounded-full bg-blue-500 text-xs font-medium text-white shadow-sm dark:bg-blue-600">
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
    <div className="mb-6 border-b border-border pb-4">
      <div className="flex items-center justify-between rounded-md p-2 transition-colors hover:bg-muted">
        <div className="flex items-center gap-3">
          <Logo />
          <div className="transition-opacity duration-200">
            <span className="block text-sm font-semibold text-foreground">
              {userName}
            </span>
            <span className="block text-xs text-muted-foreground">
              {userPlan}
            </span>
          </div>
        </div>
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </div>
    </div>
  );
};

const Logo = () => {
  return (
    <div className="grid size-10 shrink-0 place-content-center rounded-lg bg-primary shadow-sm">
      <Home className="h-5 w-5 text-primary-foreground" />
    </div>
  );
};

type DashboardContentProps = {
  title: string;
  subtitle: string;
  children: React.ReactNode;
};

const DashboardContent = ({
  title,
  subtitle,
  children,
}: DashboardContentProps) => {
  const headline = useMemo(() => title, [title]);

  return (
    <div className="flex-1 overflow-auto bg-background p-6">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {headline}
          </h1>
          <p className="mt-1 text-muted-foreground">{subtitle}</p>
        </div>
        <div className="flex items-center gap-4">
          <button className="relative rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground shadow-sm">
            <Bell className="h-5 w-5" />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-primary" />
          </button>
          <ModeToggle />
          <button className="rounded-lg border border-border bg-card p-2 text-muted-foreground transition-colors hover:text-foreground shadow-sm">
            <User className="h-5 w-5" />
          </button>
        </div>
      </div>

      {children}
    </div>
  );
};

export const Example = () => {
  const navItems: NavItem[] = [
    { title: "Dashboard", href: "/dashboard", icon: Home },
    { title: "Profile", href: "/profile", icon: User },
    { title: "Messages", href: "/chats", icon: Bell, notifs: 3 },
  ];

  const accountItems: NavItem[] = [
    { title: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <DashboardWithCollapsibleSidebar
      title="Dashboard"
      subtitle="Welcome back to your dashboard"
      userName="TomIsLoading"
      userPlan="Pro Plan"
      navItems={navItems}
      accountItems={accountItems}
    >
      <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900">
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Demo content area.
        </p>
      </div>
    </DashboardWithCollapsibleSidebar>
  );
};
