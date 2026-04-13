import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Brain,
  TrendingUp,
  Plus,
  Sparkles,
  Lock,
} from "lucide-react";
import { trpc } from "@/lib/trpc";

export default function Dashboard() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect unauthenticated users to home
  if (!isAuthenticated || !user) {
    navigate("/");
    return null;
  }

  // TODO: Get user subscription tier from backend
  const isPremium = false;

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg p-8 text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome back, {user.name}!</h1>
          <p className="text-blue-100">
            {isPremium ? (
              <>
                You're on the <span className="font-semibold">Premium Plan</span>
                . Unlock all advanced features.
              </>
            ) : (
              <>
                You're on the <span className="font-semibold">Free Plan</span>.{" "}
                <button className="underline hover:text-blue-50">
                  Upgrade to Premium
                </button>{" "}
                for unlimited features.
              </>
            )}
          </p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Notes Uploaded</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Quizzes Completed</p>
                <p className="text-3xl font-bold text-gray-900">0</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">—</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Main Features Grid */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold text-gray-900">Study Tools</h2>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Free Tier Features */}
            <FeatureCard
              icon={<BookOpen className="w-6 h-6" />}
              title="Upload Notes"
              description="Upload your study materials and get AI summaries"
              action="Upload Notes"
              href="/notes"
              badge="Free"
            />

            <FeatureCard
              icon={<Brain className="w-6 h-6" />}
              title="Generate Quiz"
              description="Create practice questions from your notes"
              action="Create Quiz"
              href="/quizzes"
              badge="Free"
            />

            {/* Premium Features */}
            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Exam Predictor"
              description="Predict likely exam questions based on your notes"
              action="Predict Questions"
              href="/exam-predictor"
              badge="Premium"
              locked={!isPremium}
            />

            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Smart Quiz Generator"
              description="Unlimited adaptive quizzes targeting weak areas"
              action="Generate Smart Quiz"
              href="/smart-quiz"
              badge="Premium"
              locked={!isPremium}
            />

            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Instant Notes-to-Flashcards"
              description="Auto-convert your notes into effective flashcards"
              action="Create Flashcards"
              href="/flashcards"
              badge="Premium"
              locked={!isPremium}
            />

            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="Weakness Analyzer"
              description="Identify topics you need to improve and get recommendations"
              action="Analyze Weaknesses"
              href="/weakness-analyzer"
              badge="Premium"
              locked={!isPremium}
            />

            <FeatureCard
              icon={<Sparkles className="w-6 h-6" />}
              title="AI Study Planner"
              description="Get personalized daily study schedules"
              action="Create Study Plan"
              href="/study-planner"
              badge="Premium"
              locked={!isPremium}
            />

            <FeatureCard
              icon={<TrendingUp className="w-6 h-6" />}
              title="Progress Tracker"
              description="Monitor your study activity and quiz scores"
              action="View Progress"
              href="/progress"
              badge="Free"
            />
          </div>
        </div>

        {/* Upgrade CTA */}
        {!isPremium && (
          <Card className="p-8 bg-gradient-to-r from-purple-50 to-indigo-50 border-2 border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  Unlock Premium Features
                </h3>
                <p className="text-gray-600">
                  Get unlimited access to AI Exam Predictor, Smart Quiz Generator,
                  Flashcards, Weakness Analyzer, and AI Study Planner.
                </p>
              </div>
              <Button className="bg-blue-600 hover:bg-blue-700 whitespace-nowrap ml-4">
                Upgrade Now
              </Button>
            </div>
          </Card>
        )}
      </div>
    </DashboardLayout>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  action,
  href,
  badge,
  locked = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  action: string;
  href: string;
  badge: string;
  locked?: boolean;
}) {
  const [, navigate] = useLocation();

  return (
    <Card
      className={`p-6 hover:shadow-lg transition-all ${
        locked ? "opacity-60 bg-gray-50" : ""
      }`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            badge === "Premium"
              ? "bg-purple-100 text-purple-600"
              : "bg-blue-100 text-blue-600"
          }`}
        >
          {icon}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={`text-xs font-semibold px-2 py-1 rounded ${
              badge === "Premium"
                ? "bg-purple-100 text-purple-700"
                : "bg-green-100 text-green-700"
            }`}
          >
            {badge}
          </span>
          {locked && <Lock className="w-4 h-4 text-gray-400" />}
        </div>
      </div>

      <h3 className="text-lg font-bold text-gray-900 mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>

      <Button
        onClick={() => !locked && navigate(href)}
        disabled={locked}
        className={locked ? "w-full opacity-50 cursor-not-allowed" : "w-full"}
        variant={locked ? "outline" : "default"}
      >
        {action}
      </Button>
    </Card>
  );
}
