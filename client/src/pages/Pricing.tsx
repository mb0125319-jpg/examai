import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Check, X, ArrowRight } from "lucide-react";
import { useLocation } from "wouter";
import { useAuth } from "@/_core/hooks/useAuth";

export default function Pricing() {
  const [, navigate] = useLocation();
  const { isAuthenticated } = useAuth();

  const features = [
    { name: "Notes Upload", free: true, premium: true },
    { name: "AI Summaries", free: true, premium: true },
    { name: "Basic Quizzes", free: true, premium: true },
    { name: "Progress Tracker", free: true, premium: true },
    { name: "AI Exam Predictor", free: false, premium: true },
    { name: "Smart Quiz Generator", free: false, premium: true },
    { name: "Instant Notes-to-Flashcards", free: false, premium: true },
    { name: "Weakness Analyzer", free: false, premium: true },
    { name: "AI Study Planner", free: false, premium: true },
    { name: "Priority Support", free: false, premium: true },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
      {/* Header */}
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <h1 className="text-5xl font-bold text-gray-900 mb-4">
          Simple, Transparent Pricing
        </h1>
        <p className="text-xl text-gray-600">
          Choose the plan that fits your study needs
        </p>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-6xl mx-auto px-4 pb-16">
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {/* Free Plan */}
          <Card className="p-8 relative">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Free</h2>
              <p className="text-gray-600 mb-4">Perfect for getting started</p>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-bold text-gray-900">$0</span>
                <span className="text-gray-600">/month</span>
              </div>
            </div>

            <Button
              onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
              className="w-full bg-blue-600 hover:bg-blue-700 mb-8"
            >
              {isAuthenticated ? "Go to Dashboard" : "Get Started"}
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="space-y-4">
              <p className="font-semibold text-gray-900 mb-4">Includes:</p>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center gap-3"
                >
                  {feature.free ? (
                    <Check className="w-5 h-5 text-green-600 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={
                      feature.free ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>

          {/* Premium Plan */}
          <Card className="p-8 relative border-2 border-blue-600 bg-gradient-to-br from-blue-50 to-indigo-50 shadow-xl">
            <div className="absolute top-0 right-0 bg-blue-600 text-white px-4 py-1 rounded-bl-lg text-sm font-semibold">
              Most Popular
            </div>

            <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Premium</h2>
              <p className="text-gray-600 mb-4">
                Unlock all AI-powered features
              </p>
              <div className="space-y-2">
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold text-gray-900">$7.99</span>
                  <span className="text-gray-600">/month</span>
                </div>
                <p className="text-sm text-gray-600">
                  or <span className="font-semibold">$49/year</span> (save 49%)
                </p>
              </div>
            </div>

            <Button className="w-full bg-blue-600 hover:bg-blue-700 mb-8">
              Upgrade to Premium
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>

            <div className="space-y-4">
              <p className="font-semibold text-gray-900 mb-4">Everything in Free, plus:</p>
              {features.map((feature) => (
                <div
                  key={feature.name}
                  className="flex items-center gap-3"
                >
                  {feature.premium ? (
                    <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                  ) : (
                    <X className="w-5 h-5 text-gray-300 flex-shrink-0" />
                  )}
                  <span
                    className={
                      feature.premium ? "text-gray-900" : "text-gray-400"
                    }
                  >
                    {feature.name}
                  </span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
            Frequently Asked Questions
          </h2>

          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I switch between plans?
              </h3>
              <p className="text-gray-600">
                Yes! You can upgrade to Premium or downgrade to Free at any time.
                Changes take effect immediately.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Is there a free trial for Premium?
              </h3>
              <p className="text-gray-600">
                We're currently offering a 7-day free trial for Premium features.
                No credit card required to start.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                What payment methods do you accept?
              </h3>
              <p className="text-gray-600">
                We accept all major credit cards (Visa, Mastercard, American Express)
                and PayPal for secure payments.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Can I cancel anytime?
              </h3>
              <p className="text-gray-600">
                Absolutely! Cancel your subscription anytime with no questions asked.
                You'll retain access until the end of your billing period.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Do you offer refunds?
              </h3>
              <p className="text-gray-600">
                We offer a 30-day money-back guarantee if you're not satisfied with
                your Premium subscription.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Ready to supercharge your learning?
        </h2>
        <p className="text-lg text-gray-600 mb-8">
          Join thousands of students already using ExamAI to improve their grades
        </p>
        <Button
          onClick={() => navigate(isAuthenticated ? "/dashboard" : "/")}
          className="bg-blue-600 hover:bg-blue-700 py-6 px-8 text-lg"
        >
          Get Started Today
          <ArrowRight className="w-5 h-5 ml-2" />
        </Button>
      </div>
    </div>
  );
}
