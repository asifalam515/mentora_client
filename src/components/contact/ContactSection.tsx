"use client";

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
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Building,
  CheckCircle,
  ChevronDown,
  Clock,
  Facebook,
  FileText,
  Globe,
  HelpCircle,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Send,
  Shield,
  Star,
  Twitter,
  User,
} from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../ui/accordion";

// Form validation schema
const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  subject: z.string().min(1, "Please select a subject"),
  message: z.string().min(10, "Message must be at least 10 characters"),
  category: z.enum(["general", "technical", "billing", "tutor", "student"]),
  agreeToTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to our privacy policy",
  }),
});

type ContactFormValues = z.infer<typeof contactSchema>;

const ContactSection = () => {
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize form
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
      category: "general",
      agreeToTerms: true,
    },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1500));
      setIsSubmitted(true);
      form.reset();
    } catch (error) {
      console.error("Contact form error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const contactMethods = [
    {
      icon: <Mail className="h-6 w-6" />,
      title: "Email Support",
      description: "Get help via email",
      details: "support@skillbridge.com",
      color: "bg-blue-500",
      responseTime: "Within 24 hours",
    },
    {
      icon: <Phone className="h-6 w-6" />,
      title: "Phone Support",
      description: "Call our support team",
      details: "+1 (555) 123-4567",
      color: "bg-green-500",
      responseTime: "Mon-Fri, 9AM-6PM EST",
    },
    {
      icon: <MessageSquare className="h-6 w-6" />,
      title: "Live Chat",
      description: "Chat with our team",
      details: "Available on dashboard",
      color: "bg-purple-500",
      responseTime: "Instant response",
    },
    {
      icon: <HelpCircle className="h-6 w-6" />,
      title: "Help Center",
      description: "Find answers yourself",
      details: "knowledgebase.skillbridge.com",
      color: "bg-amber-500",
      responseTime: "24/7 access",
    },
  ];

  const faqs = [
    {
      question: "How do I book a tutoring session?",
      answer:
        "Browse tutors by subject, view their profiles and availability, then click 'Book Session' to schedule a time that works for you.",
    },
    {
      question: "What subjects do you offer tutoring for?",
      answer:
        "We offer tutoring across 50+ subjects including Mathematics, Science, Languages, Programming, Test Prep, Music, and more.",
    },
    {
      question: "How are tutors verified?",
      answer:
        "All tutors go through a rigorous verification process including credential checks, background verification, and teaching assessment.",
    },
    {
      question: "Can I get a refund if I'm not satisfied?",
      answer:
        "Yes, we offer a satisfaction guarantee. If you're not satisfied with your session, you can request a refund within 24 hours.",
    },
    {
      question: "How do I become a tutor on SkillBridge?",
      answer:
        "Apply through our tutor application form, complete the verification process, set up your profile, and start teaching!",
    },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      label: "Facebook",
      href: "https://facebook.com",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      label: "Twitter",
      href: "https://twitter.com",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      label: "Instagram",
      href: "https://instagram.com",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      label: "LinkedIn",
      href: "https://linkedin.com",
    },
  ];

  const categories = [
    { value: "general", label: "General Inquiry" },
    { value: "technical", label: "Technical Support" },
    { value: "billing", label: "Billing & Payment" },
    { value: "tutor", label: "Tutor Support" },
    { value: "student", label: "Student Support" },
  ];

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-primary/10 to-primary/5 py-16">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto">
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">
              <MessageSquare className="h-3 w-3 mr-2" />
              We're Here to Help
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
              Get in <span className="text-primary">Touch</span> with Us
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Have questions? We're here to help. Reach out to our support team
              or browse our FAQ section.
            </p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column - Contact Methods */}
          <div className="lg:col-span-2">
            {/* Success Message */}
            {isSubmitted && (
              <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20 dark:border-green-800">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                      <CheckCircle className="h-6 w-6 text-green-600 dark:text-green-400" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-green-800 dark:text-green-300">
                        Message Sent Successfully!
                      </h3>
                      <p className="text-green-600 dark:text-green-400 text-sm">
                        Thank you for contacting us. We'll get back to you
                        within 24 hours.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Contact Form */}
            <Card className="border-2 shadow-lg">
              <CardHeader>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Send className="h-6 w-6 text-primary" />
                  Send us a Message
                </CardTitle>
                <CardDescription>
                  Fill out the form below and we'll get back to you as soon as
                  possible.
                </CardDescription>
              </CardHeader>

              <CardContent>
                <Form {...form}>
                  <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-6"
                  >
                    <div className="grid md:grid-cols-2 gap-6">
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
                                disabled={isSubmitting}
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
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      {/* Category Field */}
                      <FormField
                        control={form.control}
                        name="category"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Category
                            </FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              disabled={isSubmitting}
                            >
                              <FormControl>
                                <SelectTrigger className="h-11">
                                  <SelectValue placeholder="Select category" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {categories.map((category) => (
                                  <SelectItem
                                    key={category.value}
                                    value={category.value}
                                  >
                                    {category.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      {/* Subject Field */}
                      <FormField
                        control={form.control}
                        name="subject"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="flex items-center gap-2">
                              <FileText className="h-4 w-4" />
                              Subject
                            </FormLabel>
                            <FormControl>
                              <Input
                                placeholder="How can we help you?"
                                {...field}
                                className="h-11"
                                disabled={isSubmitting}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    {/* Message Field */}
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="flex items-center gap-2">
                            <MessageSquare className="h-4 w-4" />
                            Your Message
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Please provide details about your inquiry..."
                              className="min-h-[150px] resize-none"
                              {...field}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <FormMessage />
                          <div className="text-xs text-muted-foreground mt-1">
                            Please be as detailed as possible so we can assist
                            you better.
                          </div>
                        </FormItem>
                      )}
                    />

                    {/* Terms Agreement */}
                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                              disabled={isSubmitting}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm font-normal">
                              I agree to the{" "}
                              <Link
                                href="/privacy"
                                className="text-primary hover:underline"
                              >
                                Privacy Policy
                              </Link>{" "}
                              and consent to SkillBridge contacting me about my
                              inquiry.
                            </FormLabel>
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
                          Sending Message...
                        </>
                      ) : (
                        <>
                          Send Message
                          <Send className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Contact Info & FAQ */}
          <div className="space-y-8">
            {/* Contact Methods */}
            <div className="space-y-4">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Contact Options
              </h3>
              <div className="space-y-3">
                {contactMethods.map((method, index) => (
                  <Card
                    key={index}
                    className="border hover:border-primary/30 transition-colors"
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <div
                          className={`${method.color} h-12 w-12 rounded-lg flex items-center justify-center`}
                        >
                          <div className="text-white">{method.icon}</div>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-semibold">{method.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {method.description}
                          </p>
                          <div className="mt-2">
                            <p className="font-medium">{method.details}</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Clock className="h-3 w-3 text-muted-foreground" />
                              <span className="text-xs text-muted-foreground">
                                {method.responseTime}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />
          </div>
        </div>

        {/* FAQ Section */}
        <div className="grid grid-rows-2 gap-3">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xl font-bold flex items-center gap-2">
                <HelpCircle className="h-5 w-5 text-primary" />
                Frequently Asked Questions
              </h3>
              <Badge variant="outline" className="text-xs">
                {faqs.length} Questions
              </Badge>
            </div>

            <Accordion type="single" collapsible className="space-y-2">
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={index}
                  value={`item-${index}`}
                  className="border rounded-lg px-4"
                >
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="text-left font-medium">{faq.question}</div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4 text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <div className="text-center">
              <Button variant="outline" className="gap-2" asChild>
                <Link href="/faq">
                  View All FAQs
                  <ChevronDown className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          </div>

          {/* Company Info */}
          <Card className="border">
            <CardContent className="p-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Building className="h-5 w-5 text-primary" />
                  <div>
                    <h4 className="font-semibold">SkillBridge Headquarters</h4>
                    <p className="text-sm text-muted-foreground">
                      123 Education Street
                    </p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Knowledge City, EC 12345</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Globe className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">www.skillbridge.com</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Shield className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">24/7 Secure Support</span>
                  </div>
                </div>

                {/* Social Links */}
                <div className="pt-4">
                  <p className="text-sm font-medium mb-3">Follow Us</p>
                  <div className="flex gap-2">
                    {socialLinks.map((social, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="icon"
                        asChild
                        className="h-10 w-10 rounded-full"
                      >
                        <Link
                          href={social.href}
                          target="_blank"
                          aria-label={social.label}
                        >
                          {social.icon}
                        </Link>
                      </Button>
                    ))}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Support Stats */}
        <div className="mt-16">
          <Card className="border-0 bg-gradient-to-r from-primary/5 to-primary/10 dark:from-primary/10 dark:to-primary/20">
            <CardContent className="p-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    24/7
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Support Availability
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    98%
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Satisfaction Rate
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    15min
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Avg Response Time
                  </div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-primary mb-2">
                    50K+
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Issues Resolved
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Testimonials */}
        <div className="mt-16">
          <div className="text-center mb-8">
            <Badge className="mb-2 bg-primary/10 text-primary border-primary/20">
              <Star className="h-3 w-3 mr-2" />
              What Our Users Say
            </Badge>
            <h2 className="text-3xl font-bold">Loved by Students & Tutors</h2>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                name: "Sarah Johnson",
                role: "Student",
                text: "The support team helped me find the perfect tutor for my calculus class. Amazing service!",
                rating: 5,
              },
              {
                name: "Dr. Michael Chen",
                role: "Tutor",
                text: "As a tutor, the platform support is exceptional. They're always ready to help with any questions.",
                rating: 5,
              },
              {
                name: "Emily Rodriguez",
                role: "Parent",
                text: "Quick responses and helpful guidance for my child's learning journey. Highly recommended!",
                rating: 5,
              },
            ].map((testimonial, index) => (
              <Card key={index} className="border">
                <CardContent className="p-6">
                  <div className="flex items-center gap-1 mb-4">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star
                        key={i}
                        className="h-4 w-4 fill-yellow-400 text-yellow-400"
                      />
                    ))}
                  </div>
                  <p className="text-muted-foreground mb-4 italic">
                    "{testimonial.text}"
                  </p>
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {testimonial.role}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactSection;
