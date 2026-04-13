import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Lock, ArrowRight, Wand2 } from "lucide-react";

export default function SmartQuiz() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  if (!isAuthenticated || !user) {
    navigate("/");
    return null;
  }

  return (
    <DashboardLayout>
      <div className="max-w-2xl mx-auto">
        <Card className="p-12 text-center border-2 border-purple-200 bg-gradient-to-br from-purple-50 to-indigo-50">
          <Lock className="w-16 h-16 text-purple-600 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Smart Quiz Generator
          </h1>
          <p className="text-lg text-gray-600 mb-8">
            Unlimited adaptive quizzes that target your weak areas and help you improve
          </p>

          <div className="bg-white rounded-lg p-6 mb-8 text-left">
            <h2 className="font-semibold text-gray-900 mb-4">What You Get:</h2>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-gray-700">
                <Wand2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                Unlimited quiz generation from your notes
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Wand2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                Adaptive difficulty based on your performance
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Wand2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                Focus on topics where you struggle most
              </li>
              <li className="flex items-center gap-3 text-gray-700">
                <Wand2 className="w-5 h-5 text-purple-600 flex-shrink-0" />
                Detailed explanations for every question
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-600 mb-2">Pricing:</p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-2xl font-bold text-gray-900">$7.99</p>
                  <p className="text-sm text-gray-600">/month</p>
                </div>
                <p className="text-gray-400">or</p>
                <div>
                  <p className="text-2xl font-bold text-gray-900">$49</p>
                  <p className="text-sm text-gray-600">/year (save 49%)</p>
                </div>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 py-6 text-lg">
              Upgrade to Premium
              <ArrowRight className="w-5 h-5 ml-2" />
            </Button>

            <Button
              variant="outline"
              className="w-full"
              onClick={() => navigate("/dashboard")}
            >
              Back to Dashboard
            </Button>
          </div>
        </Card>
      </div>
    </DashboardLayout>
  );
}
