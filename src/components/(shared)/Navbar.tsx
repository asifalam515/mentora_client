"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { Roles } from "@/constants/roles";
import { useAuth } from "@/contexts/auth-context";
import { authClient } from "@/lib/auth";
import {
  BarChart3,
  BookOpen,
  Calendar,
  Clock,
  Home,
  LogOut,
  Menu,
  Search,
  Shield,
  User,
  Users,
  X,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { ModeToggle } from "./ModeToggle";

interface UserData {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "STUDENT" | "TUTOR";
  avatar?: string;
}

const Navbar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { session, loading } = useAuth();

  const userData = session?.user;

  const user: UserData | null = userData
    ? {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
        avatar: userData.image,
      }
    : null;

  // Scroll blur effect
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleLogout = async () => {
    await authClient.signOut();
    toast.success("Logged out successfully");
    router.push("/");
  };

  const publicNavItems = [
    { href: "/", label: "Home", icon: <Home className="h-4 w-4" /> },
    {
      href: "/tutors",
      label: "Browse Tutors",
      icon: <Search className="h-4 w-4" />,
    },
  ];

  const studentNavItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/bookings",
      label: "My Bookings",
      icon: <Calendar className="h-4 w-4" />,
    },
  ];

  const tutorNavItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/availability-slot",
      label: "Availability",
      icon: <Clock className="h-4 w-4" />,
    },
    {
      href: "/tutor/profile",
      label: "Profile",
      icon: <User className="h-4 w-4" />,
    },
  ];

  const adminNavItems = [
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: <BarChart3 className="h-4 w-4" />,
    },
    {
      href: "/admin/users",
      label: "Users",
      icon: <Users className="h-4 w-4" />,
    },
    {
      href: "/bookings",
      label: "Bookings",
      icon: <BookOpen className="h-4 w-4" />,
    },
    {
      href: "/admin/categories",
      label: "Categories",
      icon: <Shield className="h-4 w-4" />,
    },
  ];

  const getRoleNavItems = () => {
    if (!user) return [];
    switch (user.role) {
      case Roles.student:
        return studentNavItems;
      case Roles.tutor:
        return tutorNavItems;
      case Roles.admin:
        return adminNavItems;
      default:
        return [];
    }
  };

  const roleNavItems = getRoleNavItems();

  const isActive = (href: string) =>
    href === "/" ? pathname === href : pathname.startsWith(href);

  const getProfileRoute = () => {
    if (!user) return "/";
    if (user.role === Roles.student) return "/dashboard/profile";
    if (user.role === Roles.tutor) return "/tutor/profile";
    return "/admin";
  };

  return (
    <nav
      className={`sticky top-0 z-50 w-full border-b bg-background transition-all duration-200 ${
        scrolled
          ? "backdrop-blur supports-[backdrop-filter]:bg-background/80 shadow-sm"
          : ""
      }`}
    >
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-muted">
              <BookOpen className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">SkillBridge</span>
          </Link>

          {/* Desktop */}
          <div className="hidden md:flex items-center space-x-1">
            {publicNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}

            {roleNavItems.map((item) => (
              <Link key={item.href} href={item.href}>
                <Button
                  variant={isActive(item.href) ? "default" : "ghost"}
                  className="flex items-center gap-2"
                >
                  {item.icon}
                  {item.label}
                </Button>
              </Link>
            ))}

            <Separator orientation="vertical" className="mx-2 h-6" />

            {/* Auth */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 rounded-full">
                    <Avatar>
                      <AvatarImage src={user.avatar} />
                      <AvatarFallback>{user.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {user.email}
                    </p>
                    <Badge className="mt-1">{user.role}</Badge>
                  </DropdownMenuLabel>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem asChild>
                    <Link href={getProfileRoute()}>
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </Link>
                  </DropdownMenuItem>

                  <DropdownMenuSeparator />

                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-destructive"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Button variant="ghost" onClick={() => router.push("/login")}>
                  Login
                </Button>
                <Button onClick={() => router.push("/register")}>
                  Get Started
                </Button>
              </>
            )}

            <Separator orientation="vertical" className="mx-2 h-6" />
            <ModeToggle />
          </div>

          {/* Mobile toggle */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setIsMobileMenuOpen((p) => !p)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </Button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
