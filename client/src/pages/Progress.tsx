import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Card } from "@/components/ui/card";
import { trpc } from "@/lib/trpc";
import { TrendingUp, BookOpen, Brain, Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from "recharts";

export default function Progress() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();

  // Redirect unauthenticated users
  if (!isAuthenticated || !user) {
    navigate("/");
    return null;
  }

  // Get user's data
  const { data: userNotes = [] } = trpc.notes.list.useQuery();
  const { data: userQuizzes = [] } = trpc.quizzes.list.useQuery();
  const { data: quizResponses = [] } = trpc.quizResponses.list.useQuery();

  // Calculate statistics
  const totalNotes = userNotes.length;
  const totalQuizzes = userQuizzes.length;
  const totalQuizzesCompleted = quizResponses.length;
  const averageScore = quizResponses.length > 0
    ? Math.round(
        quizResponses.reduce((sum: number, r: any) => sum + (r.score / r.totalQuestions) * 100, 0) /
          quizResponses.length
      )
    : 0;

  // Prepare chart data
  const scoreData = quizResponses.slice(-10).map((response: any, index: number) => ({
    name: `Quiz ${index + 1}`,
    score: Math.round((response.score / response.totalQuestions) * 100),
  }));

  const activityData = [
    { name: "Mon", notes: 2, quizzes: 1 },
    { name: "Tue", notes: 3, quizzes: 2 },
    { name: "Wed", notes: 1, quizzes: 3 },
    { name: "Thu", notes: 4, quizzes: 2 },
    { name: "Fri", notes: 2, quizzes: 4 },
    { name: "Sat", notes: 1, quizzes: 1 },
    { name: "Sun", notes: 0, quizzes: 0 },
  ];

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Progress Tracker</h1>
          <p className="text-gray-600 mt-1">
            Monitor your study activity and performance
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Notes Uploaded</p>
                <p className="text-3xl font-bold text-gray-900">{totalNotes}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <BookOpen className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Quizzes Created</p>
                <p className="text-3xl font-bold text-gray-900">{totalQuizzes}</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <Brain className="w-6 h-6 text-purple-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Quizzes Completed</p>
                <p className="text-3xl font-bold text-gray-900">{totalQuizzesCompleted}</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Award className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-600 text-sm mb-1">Average Score</p>
                <p className="text-3xl font-bold text-gray-900">{averageScore}%</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Score Trend */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Quiz Scores</h2>
            {scoreData.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={scoreData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="score"
                    stroke="#2563eb"
                    strokeWidth={2}
                    dot={{ fill: "#2563eb" }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-500">
                No quiz data yet
              </div>
            )}
          </Card>

          {/* Activity */}
          <Card className="p-6">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Weekly Activity</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={activityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="notes" fill="#3b82f6" />
                <Bar dataKey="quizzes" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card className="p-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Recent Quiz Results</h2>
          {quizResponses.length === 0 ? (
            <p className="text-gray-600">No quiz results yet. Start taking quizzes to see your progress!</p>
          ) : (
            <div className="space-y-3">
              {quizResponses.slice(-5).reverse().map((response: any, index: number) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
                >
                  <div>
                    <p className="font-medium text-gray-900">Quiz {index + 1}</p>
                    <p className="text-sm text-gray-600">
                      {new Date(response.completedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-gray-900">
                      {response.score}/{response.totalQuestions}
                    </p>
                    <p className="text-sm text-gray-600">
                      {Math.round((response.score / response.totalQuestions) * 100)}%
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
}
