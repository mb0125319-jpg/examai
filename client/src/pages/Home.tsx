import { useAuth } from "@/_core/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { getLoginUrl } from "@/const";
import {
  Brain,
  BookOpen,
  TrendingUp,
  Zap,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  BarChart3,
  Lightbulb,
  Calendar,
  Wand2,
  Lock,
} from "lucide-react";
import { useLocation } from "wouter";

export default function Home() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect authenticated users to dashboard
  if (isAuthenticated && user) {
    navigate("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-white/80 backdrop-blur-md border-b border-blue-100 z-50">
        <div className="container flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-lg flex items-center justify-center">
              <Brain className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              ExamAI
            </span>
          </div>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            className="bg-blue-600 hover:bg-blue-700"
          >
            Sign In
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="container max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span className="text-sm font-medium text-blue-700">
              AI-Powered Learning Platform
            </span>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Study Smarter,
            <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              {" "}
              Not Harder
            </span>
          </h1>

          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            Transform your study notes into personalized learning experiences.
            Get AI-powered summaries, adaptive quizzes, and exam predictions to
            ace your tests.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button
              onClick={() => (window.location.href = getLoginUrl())}
              size="lg"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-6 text-lg"
            >
              Get Started Free
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              className="px-8 py-6 text-lg border-2"
            >
              Watch Demo
            </Button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="relative mt-12 rounded-2xl overflow-hidden shadow-2xl">
            <div className="aspect-video bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
              <div className="text-center">
                <BookOpen className="w-16 h-16 text-blue-400 mx-auto mb-4" />
                <p className="text-gray-500">Dashboard Preview</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 bg-white/50">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Powerful Features for Every Student
            </h2>
            <p className="text-lg text-gray-600">
              Everything you need to study effectively and improve your grades
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Tier Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                </div>
                Free Tier
              </h3>

              <div className="space-y-4">
                <FeatureCard
                  icon={<BookOpen className="w-5 h-5" />}
                  title="Upload Notes"
                  description="Easily upload your study materials and organize by subject"
                />
                <FeatureCard
                  icon={<Zap className="w-5 h-5" />}
                  title="AI Summaries"
                  description="Get instant summaries of your notes (limited)"
                />
                <FeatureCard
                  icon={<Brain className="w-5 h-5" />}
                  title="Basic Quizzes"
                  description="Generate practice questions from your notes"
                />
                <FeatureCard
                  icon={<TrendingUp className="w-5 h-5" />}
                  title="Progress Tracker"
                  description="Monitor your study activity and quiz scores"
                />
              </div>
            </div>

            {/* Premium Tier Features */}
            <div className="space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                </div>
                Premium Tier
              </h3>

              <div className="space-y-4">
                <FeatureCard
                  icon={<Lightbulb className="w-5 h-5" />}
                  title="AI Exam Predictor"
                  description="Predict likely exam questions with AI analysis"
                  premium
                />
                <FeatureCard
                  icon={<Wand2 className="w-5 h-5" />}
                  title="Smart Quiz Generator"
                  description="Unlimited adaptive quizzes targeting weak areas"
                  premium
                />
                <FeatureCard
                  icon={<BarChart3 className="w-5 h-5" />}
                  title="Instant Notes-to-Flashcards"
                  description="Auto-convert notes into effective flashcards"
                  premium
                />
                <FeatureCard
                  icon={<Calendar className="w-5 h-5" />}
                  title="AI Study Planner"
                  description="Get personalized daily study schedules"
                  premium
                />
              </div>
            </div>
          </div>

          {/* Additional Premium Features */}
          <div className="mt-12 p-8 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-2xl border border-purple-200">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <BarChart3 className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="text-lg font-bold text-gray-900 mb-2">
                  Weakness Analyzer
                </h4>
                <p className="text-gray-700">
                  Identify topics you struggle with and get targeted
                  recommendations for improvement. Premium only.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-lg text-gray-600">
              Choose the plan that works best for you
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Free Plan */}
            <Card className="p-8 border-2 border-gray-200 hover:border-blue-300 transition-colors">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <p className="text-gray-600">Perfect for getting started</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600 ml-2">/month</span>
              </div>

              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                variant="outline"
                className="w-full mb-8"
              >
                Get Started
              </Button>

              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Upload notes (limited)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">AI Summaries (limited)</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Basic quizzes</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <span className="text-gray-700">Progress tracker</span>
                </li>
              </ul>
            </Card>

            {/* Premium Plan */}
            <Card className="p-8 border-2 border-blue-500 bg-gradient-to-br from-blue-50 to-indigo-50 relative">
              <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                Most Popular
              </div>

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Premium
                </h3>
                <p className="text-gray-600">
                  For serious students who want to excel
                </p>
              </div>

              <div className="mb-6">
                <div className="flex items-baseline gap-2 mb-2">
                  <span className="text-4xl font-bold text-gray-900">$7.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600">
                  or <span className="font-semibold">$49/year</span> (save 49%)
                </p>
              </div>

              <Button
                onClick={() => (window.location.href = getLoginUrl())}
                className="w-full mb-8 bg-blue-600 hover:bg-blue-700"
              >
                Start Free Trial
              </Button>

              <ul className="space-y-4">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Everything in Free</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">AI Exam Predictor</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Smart Quiz Generator</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">
                      Instant Notes-to-Flashcards
                    </span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">Weakness Analyzer</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">
                    <span className="font-semibold">AI Study Planner</span>
                  </span>
                </li>
                <li className="flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-purple-600 flex-shrink-0" />
                  <span className="text-gray-700">Unlimited uploads</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="container max-w-3xl mx-auto text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Transform Your Studying?</h2>
          <p className="text-lg mb-8 text-blue-100">
            Join thousands of students who are already improving their grades with ExamAI
          </p>
          <Button
            onClick={() => (window.location.href = getLoginUrl())}
            size="lg"
            className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 text-lg font-semibold"
          >
            Start Your Free Account
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="container max-w-5xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Brain className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-white">ExamAI</span>
              </div>
              <p className="text-sm">
                AI-powered study assistant for smarter learning
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Pricing
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    About
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Contact
                  </a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="#" className="hover:text-white transition">
                    Privacy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition">
                    Terms
                  </a>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-center text-sm">
            <p>&copy; 2026 ExamAI. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  premium = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  premium?: boolean;
}) {
  return (
    <div className="flex gap-4 p-4 rounded-lg bg-white border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
      <div
        className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
          premium
            ? "bg-purple-100 text-purple-600"
            : "bg-blue-100 text-blue-600"
        }`}
      >
        {icon}
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-1">
          <h4 className="font-semibold text-gray-900">{title}</h4>
          {premium && (
            <Lock className="w-3 h-3 text-purple-600" />
          )}
        </div>
        <p className="text-sm text-gray-600">{description}</p>
      </div>
    </div>
  );
}
