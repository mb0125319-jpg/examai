import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { Brain, Plus, Loader2, CheckCircle2, XCircle } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Quizzes() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [selectedQuiz, setSelectedQuiz] = useState<number | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState<number | null>(null);

  // Redirect unauthenticated users
  if (!isAuthenticated || !user) {
    navigate("/");
    return null;
  }

  // Get user's quizzes
  const { data: quizzes = [], isLoading: quizzesLoading, refetch } = trpc.quizzes.list.useQuery();
  const generateQuizMutation = trpc.quizzes.generate.useMutation();
  const submitQuizMutation = trpc.quizResponses.submit.useMutation();

  const handleGenerateQuiz = async () => {
    toast.info("Select a note first to generate a quiz");
  };

  const handleSubmitQuiz = async () => {
    if (!selectedQuiz) return;

    try {
      const result = await submitQuizMutation.mutateAsync({
        quizId: selectedQuiz,
        answers,
      });
      setScore(result.score);
      setSubmitted(true);
      toast.success(`Quiz completed! Score: ${result.percentage}%`);
    } catch (error) {
      toast.error("Failed to submit quiz");
    }
  };

  const currentQuiz = quizzes.find((q: any) => q.id === selectedQuiz);

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Quizzes</h1>
            <p className="text-gray-600 mt-1">
              Practice and test your knowledge
            </p>
          </div>
          <Button
            onClick={() => navigate("/notes")}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            Generate Quiz
          </Button>
        </div>

        {/* Quiz Taker */}
        {selectedQuiz && currentQuiz && !submitted ? (
          <Card className="p-8 border-2 border-blue-200">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">
              {currentQuiz.title}
            </h2>

            <div className="space-y-8">
              {currentQuiz.questions?.map((question: any, index: number) => (
                <div key={question.id} className="border-b pb-6 last:border-b-0">
                  <h3 className="font-semibold text-gray-900 mb-4">
                    {index + 1}. {question.question}
                  </h3>

                  <div className="space-y-3">
                    {question.options?.map((option: string, optIndex: number) => (
                      <label
                        key={optIndex}
                        className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <input
                          type="radio"
                          name={question.id}
                          value={option}
                          checked={answers[question.id] === option}
                          onChange={(e) =>
                            setAnswers({
                              ...answers,
                              [question.id]: e.target.value,
                            })
                          }
                          className="w-4 h-4"
                        />
                        <span className="ml-3 text-gray-700">{option}</span>
                      </label>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 flex gap-2">
              <Button
                onClick={handleSubmitQuiz}
                className="bg-green-600 hover:bg-green-700"
              >
                Submit Quiz
              </Button>
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedQuiz(null);
                  setAnswers({});
                  setSubmitted(false);
                }}
              >
                Cancel
              </Button>
            </div>
          </Card>
        ) : submitted && score !== null ? (
          <Card className="p-8 text-center border-2 border-green-200 bg-green-50">
            <CheckCircle2 className="w-16 h-16 text-green-600 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Quiz Completed!
            </h2>
            <p className="text-4xl font-bold text-green-600 mb-4">
              {score}/{currentQuiz?.questions?.length || 0}
            </p>
            <p className="text-gray-600 mb-6">
              Great job! Keep practicing to improve your score.
            </p>
            <Button
              onClick={() => {
                setSelectedQuiz(null);
                setAnswers({});
                setSubmitted(false);
                setScore(null);
              }}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Take Another Quiz
            </Button>
          </Card>
        ) : null}

        {/* Quizzes List */}
        {!selectedQuiz && (
          <>
            {quizzesLoading ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
              </div>
            ) : quizzes.length === 0 ? (
              <Card className="p-12 text-center">
                <Brain className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No quizzes yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Generate quizzes from your notes to practice and test your knowledge
                </p>
                <Button
                  onClick={() => navigate("/notes")}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  Go to Notes
                </Button>
              </Card>
            ) : (
              <div className="grid gap-6">
                {quizzes.map((quiz: any) => (
                  <Card
                    key={quiz.id}
                    className="p-6 hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => setSelectedQuiz(quiz.id)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900">
                          {quiz.title}
                        </h3>
                        <p className="text-sm text-gray-600 mt-1">
                          {quiz.questions?.length || 0} questions • {quiz.difficulty} difficulty
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(quiz.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button className="bg-blue-600 hover:bg-blue-700">
                        Take Quiz
                      </Button>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  );
}
