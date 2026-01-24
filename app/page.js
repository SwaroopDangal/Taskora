import { SignInButton, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";
import {
  ArrowRight,
  CheckCircle2,
  BarChart3,
  Users,
  Zap,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function LandingPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      {/* Animated background effect */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 -left-4 w-96 h-96 bg-emerald-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-blue-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-96 h-96 bg-violet-400/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
      </div>

      {/* Navigation */}
      <nav className="relative z-10 border-b border-slate-200 backdrop-blur-sm bg-white/80">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-2xl font-black text-white">T</span>
              </div>
              <span className="text-2xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Taskora
              </span>
            </div>

            <div className="flex items-center gap-4">
              <SignInButton mode="modal">
                <Button
                  variant="ghost"
                  className="text-slate-700 hover:bg-slate-100"
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignInButton mode="modal">
                <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-semibold shadow-lg shadow-emerald-500/30">
                  Get Started
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </SignInButton>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 container mx-auto px-6 pt-20 pb-32">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200">
            <Zap className="h-4 w-4 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">
              Project Management Reimagined
            </span>
          </div>

          <h1 className="text-6xl md:text-7xl font-black leading-tight">
            <span className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 bg-clip-text text-transparent">
              Manage Projects
            </span>
            <br />
            <span className="bg-gradient-to-r from-emerald-600 via-teal-600 to-blue-600 bg-clip-text text-transparent">
              Like Never Before
            </span>
          </h1>

          <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
            Taskora brings your team together with powerful project management
            tools designed for modern workflows. Stay organized, collaborate
            seamlessly, and ship faster.
          </p>

          <div className="flex items-center justify-center gap-4 pt-4">
            <SignInButton mode="modal">
              <Button
                size="lg"
                className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg px-8 py-6 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all"
              >
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </SignInButton>
            <SignInButton mode="modal">
              <Button
                size="lg"
                variant="outline"
                className="border-slate-300 text-slate-700 hover:bg-slate-50 font-semibold text-lg px-8 py-6"
              >
                Sign In
              </Button>
            </SignInButton>
          </div>

          <div className="flex items-center justify-center gap-8 pt-8 text-sm text-slate-600">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Free 14-day trial</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-600" />
              <span>Cancel anytime</span>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 container mx-auto px-6 pb-32">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4">
              Everything you need to{" "}
              <span className="bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                succeed
              </span>
            </h2>
            <p className="text-slate-600 text-lg">
              Powerful features to keep your projects on track
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                icon: BarChart3,
                title: "Track Progress",
                description:
                  "Visualize your project timeline with intuitive boards and charts",
                gradient: "from-emerald-500 to-teal-500",
              },
              {
                icon: Users,
                title: "Team Collaboration",
                description:
                  "Work together seamlessly with real-time updates and comments",
                gradient: "from-blue-500 to-indigo-500",
              },
              {
                icon: Calendar,
                title: "Smart Scheduling",
                description:
                  "Never miss a deadline with automated reminders and calendars",
                gradient: "from-violet-500 to-purple-500",
              },
            ].map((feature, index) => (
              <Card
                key={index}
                className="bg-white border-slate-200 hover:shadow-xl hover:border-emerald-200 transition-all group"
              >
                <CardContent className="p-8">
                  <div
                    className={`w-14 h-14 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-lg`}
                  >
                    <feature.icon className="h-7 w-7 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 container mx-auto px-6 pb-32">
        <div className="max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-emerald-50 via-teal-50 to-blue-50 border-emerald-200 overflow-hidden shadow-2xl">
            <CardContent className="p-12 text-center">
              <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                Ready to transform your workflow?
              </h2>
              <p className="text-xl text-slate-700 mb-8 max-w-2xl mx-auto">
                Join thousands of teams already using Taskora to manage their
                projects efficiently
              </p>

              <SignInButton mode="modal">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-bold text-lg px-10 py-6 shadow-xl shadow-emerald-500/30"
                >
                  Get Started for Free
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </SignInButton>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 border-t border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-6 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center shadow-lg">
                <span className="text-lg font-black text-white">T</span>
              </div>
              <span className="text-lg font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                Taskora
              </span>
            </div>
            <p className="text-slate-600 text-sm">
              © 2026 Taskora. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
