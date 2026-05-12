"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import {
  Award,
  BookOpen,
  Facebook,
  Globe,
  Heart,
  Instagram,
  Linkedin,
  Mail,
  MapPin,
  MessageSquare,
  Phone,
  Shield,
  Twitter,
  Users,
} from "lucide-react";
import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  const quickLinks = [
    { label: "Browse Tutors", href: "/tutors" },
    { label: "How It Works", href: "/how-it-works" },
    { label: "Pricing", href: "/pricing" },
    { label: "Success Stories", href: "/success-stories" },
    { label: "Become a Tutor", href: "/become-tutor" },
  ];

  const studentLinks = [
    { label: "Student Dashboard", href: "/dashboard" },
    { label: "My Bookings", href: "/dashboard/bookings" },
    { label: "My Reviews", href: "/dashboard/reviews" },
    { label: "Learning Resources", href: "/resources" },
    { label: "Help Center", href: "/help" },
  ];

  const tutorLinks = [
    { label: "Tutor Dashboard", href: "/tutor/dashboard" },
    { label: "Set Availability", href: "/tutor/availability" },
    { label: "My Students", href: "/tutor/students" },
    { label: "Earnings", href: "/tutor/earnings" },
    { label: "Tutor Resources", href: "/tutor/resources" },
  ];

  const legalLinks = [
    { label: "Terms of Service", href: "/terms" },
    { label: "Privacy Policy", href: "/privacy" },
    { label: "Cookie Policy", href: "/cookies" },
    { label: "Code of Conduct", href: "/code-of-conduct" },
    { label: "Accessibility", href: "/accessibility" },
  ];

  const socialLinks = [
    {
      icon: <Facebook className="h-5 w-5" />,
      href: "https://facebook.com",
      label: "Facebook",
    },
    {
      icon: <Twitter className="h-5 w-5" />,
      href: "https://twitter.com",
      label: "Twitter",
    },
    {
      icon: <Instagram className="h-5 w-5" />,
      href: "https://instagram.com",
      label: "Instagram",
    },
    {
      icon: <Linkedin className="h-5 w-5" />,
      href: "https://linkedin.com",
      label: "LinkedIn",
    },
  ];

  const contactInfo = [
    { icon: <Mail className="h-4 w-4" />, text: "support@skillbridge.com" },
    { icon: <Phone className="h-4 w-4" />, text: "+1 (555) 123-4567" },
    {
      icon: <MapPin className="h-4 w-4" />,
      text: "123 Education St, Knowledge City",
    },
  ];

  const stats = [
    { value: "500+", label: "Expert Tutors" },
    { value: "10,000+", label: "Students Helped" },
    { value: "50,000+", label: "Sessions Completed" },
    { value: "4.9/5", label: "Average Rating" },
  ];

  const subscribeToNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle newsletter subscription
    console.log("Subscribed to newsletter");
  };

  return (
    <footer className="bg-background mt-auto overflow-hidden">
      <Separator />
      {/* Newsletter Section */}
      <div className="border-b border-border/40">
        <div className="container mx-auto px-4 py-12">
          <div className="grid md:grid-cols-2 gap-8 items-center max-w-5xl mx-auto">
            <div>
              <h3 className="text-2xl font-bold tracking-tight mb-2">Stay Updated</h3>
              <p className="text-muted-foreground text-sm">
                Get the latest tips, success stories, and platform updates
                delivered to your inbox.
              </p>
            </div>
            <form onSubmit={subscribeToNewsletter} className="space-y-3">
              <div className="flex flex-col sm:flex-row gap-3">
                <Input
                  type="email"
                  placeholder="Enter your email"
                  className="flex-1 bg-background"
                  required
                />
                <Button type="submit" className="sm:w-auto shadow-sm">
                  Subscribe
                </Button>
              </div>
              <p className="text-xs text-muted-foreground/70">
                By subscribing, you agree to our Privacy Policy and consent to
                receive updates.
              </p>
            </form>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary">
                <BookOpen className="h-7 w-7 text-primary-foreground" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-primary">SkillBridge</h2>
                <p className="text-sm text-muted-foreground">
                  Connecting Learners with Experts
                </p>
              </div>
            </div>

            <p className="text-muted-foreground">
              SkillBridge is your premier platform for connecting with expert
              tutors worldwide. Learn new skills, advance your career, and
              achieve your goals with personalized guidance.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <h4 className="font-semibold flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Contact Us
              </h4>
              <div className="space-y-2">
                {contactInfo.map((item, index) => (
                  <div key={index} className="flex items-center gap-3 text-sm">
                    {item.icon}
                    <span className="text-muted-foreground">{item.text}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-3">
              <h4 className="font-semibold">Follow Us</h4>
              <div className="flex gap-3">
                {socialLinks.map((social, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="icon"
                    asChild
                    className="rounded-full h-10 w-10"
                  >
                    <Link
                      href={social.href}
                      aria-label={social.label}
                      target="_blank"
                    >
                      {social.icon}
                    </Link>
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {quickLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Students */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Users className="h-5 w-5" />
              For Students
            </h3>
            <ul className="space-y-3">
              {studentLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* For Tutors */}
          <div>
            <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
              <Award className="h-5 w-5" />
              For Tutors
            </h3>
            <ul className="space-y-3">
              {tutorLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="w-1 h-1 rounded-full bg-primary/50"></span>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Stats Section */}
        <div className="mt-12 pt-8 border-t">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Footer */}
      <div className="bg-muted/50">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {/* Trust Badges */}
              <div className="flex items-center gap-2 text-sm">
                <Shield className="h-4 w-4 text-primary" />
                <span className="text-muted-foreground">Secure Platform</span>
              </div>
              <div className="hidden md:block">
                <Separator orientation="vertical" className="h-6" />
              </div>
              <div className="flex items-center gap-2 text-sm">
                <Heart className="h-4 w-4 text-destructive" />
                <span className="text-muted-foreground">Verified Tutors</span>
              </div>
            </div>

            {/* Legal Links */}
            <div className="flex flex-wrap items-center justify-center gap-4 text-sm">
              {legalLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>

            {/* Theme Toggle and Copyright */}
            <div className="flex items-center gap-4">
              <div className="text-sm text-muted-foreground">
                © {currentYear} SkillBridge. Made with{" "}
                <Heart className="h-3 w-3 inline text-destructive" /> for
                learners.
              </div>
            </div>
          </div>

          {/* Mobile Copyright */}
          <div className="mt-4 text-center md:hidden">
            <div className="text-sm text-muted-foreground">
              © {currentYear} SkillBridge. All rights reserved.
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
