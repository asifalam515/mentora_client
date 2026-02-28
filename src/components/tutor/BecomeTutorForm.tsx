"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { createTutorProfile } from "@/services/tutorProfile";
import { useAuthStore } from "@/store/useAuthStore.ts";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Award,
  BookOpen,
  Check,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Clock,
  FileText,
  Plus,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { redirect } from "next/navigation";
import { useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";

// ----------------------------------------------------------------------
// Schemas
// ----------------------------------------------------------------------

// Step 1: Basic Information (education & languages optional)
const basicInfoSchema = z.object({
  headline: z
    .string()
    .min(5, "Headline must be at least 5 characters")
    .max(100),
  bio: z.string().min(5, "Bio must be at least 5 characters").max(2000),
  education: z
    .array(
      z.object({
        degree: z.string().optional(),
        institution: z.string().optional(),
        year: z.string().optional(),
      }),
    )
    .optional(),
  languages: z.array(z.string()).optional(),
});

// Step 2: Subjects & Experience – subjects now store category ID
const subjectsSchema = z.object({
  subjects: z
    .array(
      z.object({
        id: z.string().min(1, "Please select a subject"),
        rate: z.number().min(5, "Rate must be at least $5").max(500),
      }),
    )
    .min(1, "At least one subject is required"),
  experience: z.number().min(0, "Experience must be a positive number"),
});

// Step 3: Pricing
const pricingSchema = z.object({
  pricePerHr: z.number().min(5, "Minimum $5 per hour").max(500),
});

// Step 4: Verification (now only agreements, file uploads removed)
const verificationSchema = z.object({
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  agreeToBackground: z.boolean().refine((val) => val === true, {
    message: "You must consent to background verification",
  }),
});

// Combined schema
const completeSchema = basicInfoSchema
  .merge(subjectsSchema)
  .merge(pricingSchema)
  .merge(verificationSchema);

// Types
type CompleteFormValues = z.infer<typeof completeSchema>;

// ----------------------------------------------------------------------
// Component
// ----------------------------------------------------------------------

interface BecomeTutorFormProps {
  categories: Array<{ id: string; name: string }>;
}

export default function BecomeTutorForm({ categories }: BecomeTutorFormProps) {
  const user = useAuthStore((state) => state.user);

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  // --------------------------------------------------------------------
  // Form initialization
  // --------------------------------------------------------------------
  const form = useForm<CompleteFormValues>({
    resolver: zodResolver(completeSchema),
    defaultValues: {
      headline: "",
      bio: "",
      education: [],
      languages: [],
      subjects: [{ id: "", rate: 30 }],
      experience: 0,
      pricePerHr: 30,
      agreeToTerms: false,
      agreeToBackground: false,
    },
  });

  const { control, handleSubmit, trigger, watch } = form;

  // Field arrays for dynamic inputs
  const {
    fields: educationFields,
    append: appendEducation,
    remove: removeEducation,
  } = useFieldArray({
    control,
    name: "education",
  });

  const {
    fields: subjectFields,
    append: appendSubject,
    remove: removeSubject,
  } = useFieldArray({
    control,
    name: "subjects",
  });

  // --------------------------------------------------------------------
  // Steps configuration
  // --------------------------------------------------------------------
  const steps = [
    {
      number: 1,
      title: "Basic Information",
      icon: <User className="h-4 w-4" />,
    },
    {
      number: 2,
      title: "Subjects & Experience",
      icon: <BookOpen className="h-4 w-4" />,
    },
    { number: 3, title: "Pricing", icon: <Clock className="h-4 w-4" /> },
    {
      number: 4,
      title: "Verification",
      icon: <FileText className="h-4 w-4" />,
    },
  ];

  const totalSteps = steps.length;
  const progress = (currentStep / totalSteps) * 100;

  // --------------------------------------------------------------------
  // Navigation
  // --------------------------------------------------------------------
  const handleNext = async () => {
    let isValid = false;
    switch (currentStep) {
      case 1:
        isValid = await trigger(["headline", "bio"]);
        break;
      case 2:
        isValid = await trigger(["subjects", "experience"]);
        break;
      case 3:
        isValid = await trigger(["pricePerHr"]);
        break;
      default:
        isValid = true;
    }
    if (isValid) {
      setCurrentStep((prev) => Math.min(prev + 1, totalSteps));
    }
  };

  const handlePrevious = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const onSubmit = async (values: CompleteFormValues) => {
    const toastId = toast.loading("Submitting your application...");
    setIsSubmitting(true);

    try {
      // Clean up education: remove empty entries
      const cleanedEducation =
        values.education?.filter((e) => e.degree || e.institution || e.year) ||
        [];

      // Extract category IDs from subjects
      const categoryIds = values.subjects.map((s) => s.id);

      // Build payload
      const payload = {
        headline: values.headline,
        bio: values.bio,
        experience: values.experience,
        pricePerHr: values.pricePerHr,
        categoryIds,
        education: cleanedEducation,
        languages: values.languages || [],
        agreeToTerms: values.agreeToTerms,
        agreeToBackground: values.agreeToBackground,
      };

      try {
        const data = createTutorProfile(payload);
        if (!data) {
          console.log("error occured");
        }
      } catch (error) {
        console.log(error);
      }

      toast.success(
        "Application submitted successfully! Please create your availability slots.",
        { id: toastId },
      );
      setIsSubmitted(true);
      redirect("/availability-slot");
    } catch (error: any) {
      toast.error(error.message || "Something went wrong", { id: toastId });
      console.error("Submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // --------------------------------------------------------------------
  // Preview data
  // --------------------------------------------------------------------
  const tutorPreview = {
    name: user?.name || "Your Name",
    headline: watch("headline") || "Your Headline",
    bio: watch("bio") || "Your bio will appear here...",
    subjects: watch("subjects")
      .map((s) => {
        const cat = categories.find((c) => c.id === s.id);
        return cat?.name || "";
      })
      .filter(Boolean),
    pricePerHr: watch("pricePerHr"),
  };

  // --------------------------------------------------------------------
  // Submitted view
  // --------------------------------------------------------------------
  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background flex items-center justify-center p-4">
        <Card className="max-w-md w-full text-center border-2 shadow-xl">
          <CardContent className="p-8 space-y-4">
            <div className="mx-auto h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="h-10 w-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-bold">Application Submitted!</h2>
            <p className="text-muted-foreground">
              Thank you for applying to become a tutor on SkillBridge. We'll
              review your application and get back to you within 2-3 business
              days.
            </p>
            <div className="pt-4">
              <Button
                onClick={() => redirect("/availability-slot")}
                className="w-full"
              >
                Create Availability Slot
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // --------------------------------------------------------------------
  // Main Form
  // --------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-primary/5 to-background py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            <Sparkles className="h-3 w-3 mr-2" />
            Become a Tutor
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
            Join SkillBridge as an Expert Tutor
          </h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Share your knowledge, inspire learners, and earn on your own terms.
            Complete the application below to get started.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8 max-w-3xl mx-auto">
          <div className="flex justify-between mb-2">
            <span className="text-sm font-medium">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Step Indicators */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4">
            {steps.map((step) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors ${
                    currentStep === step.number
                      ? "border-primary bg-primary text-primary-foreground"
                      : currentStep > step.number
                        ? "border-green-500 bg-green-500 text-white"
                        : "border-muted-foreground/30 text-muted-foreground"
                  }`}
                >
                  {currentStep > step.number ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    step.icon
                  )}
                </div>
                <span
                  className={`ml-2 text-sm hidden md:inline ${
                    currentStep === step.number
                      ? "font-medium text-foreground"
                      : "text-muted-foreground"
                  }`}
                >
                  {step.title}
                </span>
                {step.number < totalSteps && (
                  <ChevronRight className="mx-2 h-4 w-4 text-muted-foreground/50" />
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Form Column */}
          <div className="lg:col-span-2">
            <Card className="border-2 shadow-xl">
              <CardHeader>
                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                <CardDescription>
                  {currentStep === 1 &&
                    "Tell us about yourself and your background."}
                  {currentStep === 2 &&
                    "List the subjects you want to teach and your overall experience."}
                  {currentStep === 3 && "Set your hourly rate."}
                  {currentStep === 4 &&
                    "Agree to the terms and background verification."}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    {/* Step 1: Basic Info */}
                    {currentStep === 1 && (
                      <div className="space-y-6">
                        <FormField
                          control={control}
                          name="headline"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Professional Headline</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="e.g., PhD in Mathematics with 10+ years teaching experience"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                A short summary of your experience (max 100
                                characters)
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name="bio"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Bio</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Tell students about yourself, your teaching style, and experience..."
                                  className="min-h-[150px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Minimum 50 characters. Be detailed and engaging.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Languages (optional) */}
                        <FormField
                          control={control}
                          name="languages"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>
                                Languages you speak (optional)
                              </FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="English, Spanish, French..."
                                  value={field.value?.join(", ") || ""}
                                  onChange={(e) =>
                                    field.onChange(
                                      e.target.value
                                        .split(",")
                                        .map((s) => s.trim())
                                        .filter(Boolean),
                                    )
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                Separate languages with commas
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        {/* Education (optional) */}
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-base">
                              Education (optional)
                            </FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                appendEducation({
                                  degree: "",
                                  institution: "",
                                  year: "",
                                })
                              }
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Education
                            </Button>
                          </div>
                          {educationFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="space-y-3 p-4 border rounded-lg relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2"
                                onClick={() => removeEducation(index)}
                                disabled={educationFields.length === 0}
                              >
                                <X className="h-4 w-4" />
                              </Button>
                              <FormField
                                control={control}
                                name={`education.${index}.degree`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Degree (optional)</FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="e.g., B.Sc. in Computer Science"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={control}
                                name={`education.${index}.institution`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>
                                      Institution (optional)
                                    </FormLabel>
                                    <FormControl>
                                      <Input
                                        placeholder="University name"
                                        {...field}
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                              <FormField
                                control={control}
                                name={`education.${index}.year`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Year (optional)</FormLabel>
                                    <FormControl>
                                      <Input placeholder="2020" {...field} />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Step 2: Subjects & Experience */}
                    {currentStep === 2 && (
                      <div className="space-y-6">
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <FormLabel className="text-base">
                              Subjects you can teach
                            </FormLabel>
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={() =>
                                appendSubject({ id: "", rate: 30 })
                              }
                            >
                              <Plus className="h-4 w-4 mr-2" />
                              Add Subject
                            </Button>
                          </div>
                          {subjectFields.map((field, index) => (
                            <div
                              key={field.id}
                              className="space-y-3 p-4 border rounded-lg relative"
                            >
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="absolute right-2 top-2"
                                onClick={() => removeSubject(index)}
                                disabled={subjectFields.length === 1}
                              >
                                <X className="h-4 w-4" />
                              </Button>

                              <FormField
                                control={control}
                                name={`subjects.${index}.id`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Subject</FormLabel>
                                    <Select
                                      onValueChange={field.onChange}
                                      defaultValue={field.value}
                                    >
                                      <FormControl>
                                        <SelectTrigger>
                                          <SelectValue placeholder="Select a subject" />
                                        </SelectTrigger>
                                      </FormControl>
                                      <SelectContent>
                                        {categories.map((cat) => (
                                          <SelectItem
                                            key={cat.id}
                                            value={cat.id}
                                          >
                                            {cat.name}
                                          </SelectItem>
                                        ))}
                                      </SelectContent>
                                    </Select>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={control}
                                name={`subjects.${index}.rate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Rate ($/hr)</FormLabel>
                                    <FormControl>
                                      <Input
                                        type="number"
                                        {...field}
                                        onChange={(e) =>
                                          field.onChange(
                                            parseFloat(e.target.value),
                                          )
                                        }
                                      />
                                    </FormControl>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          ))}
                        </div>

                        {/* Overall experience */}
                        <FormField
                          control={control}
                          name="experience"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Total years of experience</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  min={0}
                                  max={100}
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(e.target.valueAsNumber || 0)
                                  }
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 3: Pricing */}
                    {currentStep === 3 && (
                      <div className="space-y-6">
                        <FormField
                          control={control}
                          name="pricePerHr"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Base Hourly Rate ($/hr)</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  {...field}
                                  onChange={(e) =>
                                    field.onChange(parseFloat(e.target.value))
                                  }
                                />
                              </FormControl>
                              <FormDescription>
                                This will be your default rate. You can set
                                different rates per subject later if needed.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Step 4: Verification */}
                    {currentStep === 4 && (
                      <div className="space-y-6">
                        <FormField
                          control={control}
                          name="agreeToTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I agree to the{" "}
                                  <a
                                    href="/terms"
                                    className="text-primary hover:underline"
                                  >
                                    Terms of Service
                                  </a>{" "}
                                  and{" "}
                                  <a
                                    href="/privacy"
                                    className="text-primary hover:underline"
                                  >
                                    Privacy Policy
                                  </a>
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={control}
                          name="agreeToBackground"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I consent to a background verification check
                                </FormLabel>
                                <p className="text-sm text-muted-foreground">
                                  This helps us ensure the safety of our
                                  learning community.
                                </p>
                              </div>
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {/* Navigation Buttons */}
                    <div className="flex justify-between pt-4">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentStep === 1}
                      >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Previous
                      </Button>
                      {currentStep < totalSteps ? (
                        <Button type="button" onClick={handleNext}>
                          Next
                          <ChevronRight className="h-4 w-4 ml-2" />
                        </Button>
                      ) : (
                        <Button type="submit" disabled={isSubmitting}>
                          {isSubmitting ? (
                            <>
                              <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
                              Submitting...
                            </>
                          ) : (
                            "Submit Application"
                          )}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Preview & Help */}
          <div className="lg:col-span-1 space-y-6">
            {/* Profile Preview */}
            <Card className="sticky top-24">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-primary" />
                  Profile Preview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10">
                      {tutorPreview.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-bold">{tutorPreview.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {tutorPreview.headline}
                    </p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Hourly Rate</span>
                    <span className="font-semibold">
                      ${tutorPreview.pricePerHr}/hr
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Subjects</span>
                    <Badge variant="outline">
                      {tutorPreview.subjects.length}
                    </Badge>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground line-clamp-3">
                  {tutorPreview.bio}
                </div>
              </CardContent>
            </Card>

            {/* Help Card */}
            <Card>
              <CardContent className="p-6 space-y-3">
                <div className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Why become a tutor?</h3>
                </div>
                <ul className="space-y-2 text-sm">
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Set your own schedule and rates</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Reach students worldwide</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Secure payments and support</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                    <span>Build your reputation with reviews</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
