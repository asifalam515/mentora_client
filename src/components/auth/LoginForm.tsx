"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";

import { loginUser } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  ChevronRight,
  Eye,
  EyeOff,
  Fingerprint,
  KeyRound,
  Lock,
  Mail,
  Shield,
  Sparkles,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form validation schema
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(1, "Password is required"),
  rememberMe: z.boolean(), // removed .default(false)
});

type LoginFormValues = z.infer<typeof loginSchema>;

const LoginForm = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeMethod, setActiveMethod] = useState<
    "credentials" | "google" | "github"
  >("credentials");
  const { setUser } = useAuthStore();

  // Initialize form
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: false,
    },
  });

  const handleCredentialsLogin = async (value: LoginFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Logging in...");

    try {
      const res = await loginUser(value);

      // Check if the response returned from loginUser indicates failure
      if (!res || res.success === false) {
        toast.error(res?.message || "Invalid credentials", { id: toastId });
        return; // Stop execution here
      }

      // Success path
      toast.success(res.message || "Logged in successfully!", { id: toastId });

      // Note: ensure your loginUser return object actually contains res.data.user
      if (res.data?.user) {
        setUser(res.data.user);
      }

      const redirectPath = searchParams.get("redirect");
      const safeRedirectPath =
        redirectPath &&
        redirectPath.startsWith("/") &&
        !redirectPath.startsWith("//")
          ? redirectPath
          : "/";

      router.push(safeRedirectPath);
      router.refresh();
    } catch (error: any) {
      // This catches unexpected system/network crashes
      toast.error("An unexpected error occurred", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleForgotPassword = () => {
    router.push("/forgot-password");
  };

  const stats = [
    { number: "10K+", label: "Active Learners", icon: "👨‍🎓" },
    { number: "500+", label: "Expert Tutors", icon: "👨‍🏫" },
    { number: "50K+", label: "Sessions", icon: "📚" },
    { number: "4.9★", label: "Avg Rating", icon: "⭐" },
  ];

  const features = [
    "1-on-1 personalized tutoring",
    "Flexible scheduling",
    "Progress tracking",
    "Interactive whiteboard",
    "Certificate of completion",
    "24/7 support",
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
      {/* Background Decorative Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 h-80 w-80 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-80 w-80 rounded-full bg-primary/5 blur-3xl" />
        <div className="absolute top-1/4 left-1/3 h-60 w-60 rounded-full bg-blue-500/5 blur-2xl" />
      </div>

      <div className="w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Side - Branding & Info */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center">
                  <BookOpen className="h-7 w-7 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold">SkillBridge</h1>
                  <p className="text-muted-foreground">Welcome Back!</p>
                </div>
              </div>

              <h2 className="text-4xl font-bold tracking-tight">
                Continue Your{" "}
                <span className="text-primary">Learning Journey</span>
              </h2>
              <p className="text-lg text-muted-foreground">
                Sign in to access your personalized dashboard, upcoming
                sessions, and learning resources.
              </p>
            </div>

            {/* Features */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Platform Features
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg bg-primary/5 dark:bg-primary/10"
                  >
                    <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                    <span className="text-sm">{feature}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="text-center p-4 rounded-xl bg-card border"
                >
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.number}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {stat.label}
                  </div>
                  <div className="text-xl mt-2">{stat.icon}</div>
                </div>
              ))}
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-green-500/10 dark:bg-green-500/20">
                <Shield className="h-4 w-4 text-green-500" />
                <span className="text-sm font-medium">Secure Login</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 dark:bg-blue-500/20">
                <Fingerprint className="h-4 w-4 text-blue-500" />
                <span className="text-sm font-medium">2FA Available</span>
              </div>
            </div>
          </div>

          {/* Right Side - Login Form */}
          <Card className="border-2 shadow-2xl overflow-hidden">
            {/* Card Header */}
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">Welcome Back</CardTitle>
                  <CardDescription>
                    Sign in to continue your learning journey
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  <UserCheck className="h-3 w-3 mr-1" />
                  Secure
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              {/* Social Login Buttons */}

              {/* Credentials Form */}
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleCredentialsLogin)}
                  className="space-y-4"
                >
                  {/* Email Field */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center gap-2">
                          <Mail className="h-4 w-4" />
                          Email Address
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="john@example.com"
                            {...field}
                            className="h-11"
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Password Field */}
                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="flex items-center justify-between">
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password
                          </FormLabel>
                          <Button
                            type="button"
                            variant="link"
                            size="sm"
                            className="h-auto p-0 text-xs"
                            onClick={handleForgotPassword}
                          >
                            Forgot password?
                          </Button>
                        </div>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="••••••••"
                              {...field}
                              className="h-11 pr-10"
                              disabled={isSubmitting}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-0 top-0 h-11 px-3"
                              onClick={() => setShowPassword(!showPassword)}
                              disabled={isSubmitting}
                            >
                              {showPassword ? (
                                <EyeOff className="h-4 w-4" />
                              ) : (
                                <Eye className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Remember Me */}
                  <FormField
                    control={form.control}
                    name="rememberMe"
                    render={({ field }) => (
                      <FormItem className="flex items-center space-x-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            disabled={isSubmitting}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal cursor-pointer">
                          Remember this device for 30 days
                        </FormLabel>
                      </FormItem>
                    )}
                  />

                  {/* Login Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-medium mt-2"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        {activeMethod === "google"
                          ? "Signing in with Google..."
                          : activeMethod === "github"
                            ? "Signing in with GitHub..."
                            : "Signing in..."}
                      </>
                    ) : (
                      <>
                        Sign In
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Divider */}
              <Separator className="my-6" />

              {/* Security Info */}
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                    <Shield className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Secure Login</p>
                    <p className="text-xs text-muted-foreground">
                      Your credentials are encrypted and protected
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                    <KeyRound className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">
                      Two-Factor Authentication
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Add an extra layer of security to your account
                    </p>
                  </div>
                  <Button variant="outline" size="sm" className="text-xs">
                    Enable 2FA
                  </Button>
                </div>
              </div>
            </CardContent>

            {/* Card Footer */}
            <CardFooter className="bg-muted/30 border-t p-6">
              <div className="w-full text-center">
                <p className="text-sm text-muted-foreground">
                  Don't have an account?{" "}
                  <Link
                    href="/register"
                    className="text-primary font-medium hover:underline inline-flex items-center"
                  >
                    Create account
                    <ChevronRight className="h-4 w-4 ml-1" />
                  </Link>
                </p>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
