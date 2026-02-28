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
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Roles } from "@/constants/roles";
import { loginUser, registerUser } from "@/services/auth";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import { jwtDecode } from "jwt-decode";
import {
  ArrowRight,
  BookOpen,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  Lock,
  Mail,
  Shield,
  Sparkles,
  User,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// Form validation schema
const registerSchema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Please enter a valid email address"),
    password: z
      .string()
      .min(6, "Password must be at least 6 characters")

      .regex(/[a-z]/, "Password must contain at least one lowercase letter"),
    confirmPassword: z.string(),
    role: z.enum(["STUDENT", "TUTOR"]),
    agreeToTerms: z.boolean().refine((val) => val === true, {
      message: "You must agree to the terms and conditions",
    }),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

type RegisterFormValues = z.infer<typeof registerSchema>;

const RegisterForm = () => {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const setUser = useAuthStore((state) => state.setUser);

  // Initialize form with react hook form
  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
      agreeToTerms: false,
    },
  });

  const onSubmit = async (value: RegisterFormValues) => {
    setIsSubmitting(true);
    const toastId = toast.loading("Creating your account...");
    try {
      const res = await registerUser(value);
      if (!res.success || res.success === false) {
        toast.error(res?.message || "Invalid credentials", { id: toastId });
        return;
      }

      // ✅ Login automatically after register
      const loginRes = await loginUser({
        email: value.email,
        password: value.password,
      });

      if (!loginRes || !loginRes.success) {
        toast.error(
          "Account created but login failed. Please login manually.",
          { id: toastId },
        );
        router.push("/login");
        return;
      }

      const decodedUser = jwtDecode(loginRes.data.token);
      useAuthStore.getState().setUser(decodedUser);
      // Redirect only if user is a TUTOR
      const role = loginRes.data?.user?.role;
      console.log(role);
      if (role === "TUTOR") {
        router.push("/become-tutor");
      } else {
        router.push("/");
      }
      toast.success("Account created successfully!", { id: toastId });
    } catch (error: any) {
      toast.error(error?.message || "Unexpected error", { id: toastId });
    } finally {
      setIsSubmitting(false);
    }
  };
  // Password strength checker
  const getPasswordStrength = (password: string) => {
    if (password.length === 0)
      return { score: 0, color: "bg-gray-200", text: "Enter a password" };

    let score = 0;
    if (password.length >= 6) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^A-Za-z0-9]/.test(password)) score++;

    const strengthMap = [
      { color: "bg-red-500", text: "Very Weak" },
      { color: "bg-orange-500", text: "Weak" },
      { color: "bg-yellow-500", text: "Fair" },
      { color: "bg-blue-500", text: "Good" },
      { color: "bg-green-500", text: "Strong" },
      { color: "bg-green-600", text: "Very Strong" },
    ];

    return strengthMap[Math.min(score, strengthMap.length - 1)];
  };

  const password = form.watch("password");
  const strength = getPasswordStrength(password);

  const features = {
    student: [
      "Access to 500+ expert tutors",
      "Flexible scheduling",
      "Personalized learning plans",
      "Progress tracking dashboard",
      "Certificate of completion",
    ],
    tutor: [
      "Set your own hourly rate",
      "Flexible work hours",
      "Secure payment processing",
      "Dedicated tutor dashboard",
      "Marketing and promotion",
    ],
  };

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
                  <p className="text-muted-foreground">
                    Connect. Learn. Succeed.
                  </p>
                </div>
              </div>

              <h2 className="text-4xl font-bold tracking-tight">
                Start Your{" "}
                <span className="text-primary">Learning Journey</span> Today
              </h2>
              <p className="text-lg text-muted-foreground">
                Join thousands of learners and experts who are transforming
                education through personalized tutoring.
              </p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">500+</div>
                <div className="text-sm text-muted-foreground">
                  Expert Tutors
                </div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">10K+</div>
                <div className="text-sm text-muted-foreground">Students</div>
              </div>
              <div className="space-y-1">
                <div className="text-3xl font-bold text-primary">4.9★</div>
                <div className="text-sm text-muted-foreground">Avg Rating</div>
              </div>
            </div>

            {/* Trust Badges */}
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Shield className="h-5 w-5 text-green-500" />
                  <span className="text-sm">Secure & Encrypted</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-blue-500" />
                  <span className="text-sm">Verified Tutors</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Registration Form */}
          <Card className="border-2 shadow-2xl overflow-hidden">
            {/* Card Header */}
            <CardHeader className="bg-gradient-to-r from-primary/5 to-primary/10 pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    Create Your Account
                  </CardTitle>
                  <CardDescription>
                    Join SkillBridge in under 2 minutes
                  </CardDescription>
                </div>
                <Badge
                  variant="outline"
                  className="text-primary border-primary"
                >
                  <Sparkles className="h-3 w-3 mr-1" />
                  Free Signup
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-6">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  {/* Role Selection */}
                  <div className="space-y-3">
                    <Label className="text-base font-medium">
                      I want to join as a
                    </Label>
                    <Tabs
                      defaultValue="STUDENT"
                      className="w-full"
                      onValueChange={(value) =>
                        form.setValue("role", value as "STUDENT" | "TUTOR")
                      }
                    >
                      <TabsList className="grid grid-cols-2">
                        <TabsTrigger value={Roles.student} className="gap-2">
                          <GraduationCap className="h-4 w-4" />
                          Student
                        </TabsTrigger>
                        <TabsTrigger value={Roles.tutor} className="gap-2">
                          <User className="h-4 w-4" />
                          Tutor
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="student" className="space-y-2 pt-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            Perfect for learners seeking personalized guidance
                          </p>
                        </div>
                      </TabsContent>

                      <TabsContent value="TUTOR" className="space-y-2 pt-4">
                        <div className="flex items-start gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                          <p className="text-sm text-muted-foreground">
                            Share your expertise and earn money on your schedule
                          </p>
                        </div>
                      </TabsContent>
                    </Tabs>
                  </div>

                  <Separator />

                  {/* Personal Information */}
                  <div className="space-y-4">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <User className="h-4 w-4" />
                              Full Name
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="John Doe"
                                {...field}
                                className="h-11"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

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
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Password Field */}
                    <FormField
                      control={form.control}
                      name="password"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="h-11 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 px-3"
                                onClick={() => setShowPassword(!showPassword)}
                              >
                                {showPassword ? (
                                  <EyeOff className="h-4 w-4" />
                                ) : (
                                  <Eye className="h-4 w-4" />
                                )}
                              </Button>
                            </div>
                          </FormControl>

                          {/* Password Strength Meter */}
                          {password && (
                            <div className="space-y-2 mt-2">
                              <div className="flex items-center justify-between text-xs">
                                <span>Password strength:</span>
                                <span
                                  className={`font-medium ${
                                    strength.text === "Very Strong"
                                      ? "text-green-600"
                                      : strength.text === "Strong"
                                        ? "text-green-500"
                                        : strength.text === "Good"
                                          ? "text-blue-500"
                                          : strength.text === "Fair"
                                            ? "text-yellow-500"
                                            : "text-red-500"
                                  }`}
                                >
                                  {strength.text}
                                </span>
                              </div>
                              <div className="h-1.5 w-full bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                                <div
                                  className={`h-full ${strength.color} transition-all duration-500`}
                                  style={{
                                    width: `${password.length > 0 ? (strength as any).score * 20 : 0}%`,
                                  }}
                                />
                              </div>
                            </div>
                          )}

                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {/* Confirm Password Field */}
                    <FormField
                      control={form.control}
                      name="confirmPassword"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <Lock className="h-4 w-4" />
                            Confirm Password
                          </FormLabel>
                          <FormControl>
                            <div className="relative">
                              <Input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="••••••••"
                                {...field}
                                className="h-11 pr-10"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-0 top-0 h-11 px-3"
                                onClick={() =>
                                  setShowConfirmPassword(!showConfirmPassword)
                                }
                              >
                                {showConfirmPassword ? (
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
                  </div>

                  {/* Terms and Conditions */}
                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex items-start space-x-3 space-y-0 rounded-md border p-4">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                            className="mt-1"
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel className="font-normal">
                            I agree to the{" "}
                            <Link
                              href="/terms"
                              className="text-primary hover:underline"
                            >
                              Terms of Service
                            </Link>{" "}
                            and{" "}
                            <Link
                              href="/privacy"
                              className="text-primary hover:underline"
                            >
                              Privacy Policy
                            </Link>
                          </FormLabel>
                          <p className="text-sm text-muted-foreground">
                            By creating an account, you acknowledge that you've
                            read and accept our terms.
                          </p>
                        </div>
                      </FormItem>
                    )}
                  />

                  {/* Submit Button */}
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base font-medium"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                        Creating Account...
                      </>
                    ) : (
                      <>
                        Create Account
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </>
                    )}
                  </Button>
                </form>
              </Form>

              {/* Login Link */}
              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="text-primary font-medium hover:underline"
                  >
                    Sign in here
                  </Link>
                </p>
              </div>
            </CardContent>

            {/* Role Features */}
            <CardFooter className="bg-muted/30 border-t p-6">
              <div className="w-full space-y-3">
                <h4 className="font-semibold flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  Benefits for{" "}
                  {form.watch("role") === "STUDENT" ? "Students" : "Tutors"}:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {(form.watch("role") === "STUDENT"
                    ? features.student
                    : features.tutor
                  ).map((feature, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="h-1.5 w-1.5 rounded-full bg-primary" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
