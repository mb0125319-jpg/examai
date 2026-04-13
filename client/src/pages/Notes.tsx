import { useAuth } from "@/_core/hooks/useAuth";
import { useLocation } from "wouter";
import DashboardLayout from "@/components/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { BookOpen, Plus, Trash2, Zap, Loader2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

export default function Notes() {
  const { user, isAuthenticated } = useAuth();
  const [, navigate] = useLocation();
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [subject, setSubject] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Redirect unauthenticated users
  if (!isAuthenticated || !user) {
    navigate("/");
    return null;
  }

  // Get user's notes
  const { data: userNotes = [], isLoading: notesLoading, refetch } = trpc.notes.list.useQuery();
  const createNoteMutation = trpc.notes.create.useMutation();
  const deleteNoteMutation = trpc.notes.delete.useMutation();
  const generateSummaryMutation = trpc.summaries.generate.useMutation();

  const handleCreateNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsLoading(true);
    try {
      await createNoteMutation.mutateAsync({
        title,
        content,
        subject: subject || undefined,
      });
      toast.success("Note created successfully!");
      setTitle("");
      setContent("");
      setSubject("");
      setShowForm(false);
      refetch();
    } catch (error) {
      toast.error("Failed to create note");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteNote = async (noteId: number) => {
    try {
      await deleteNoteMutation.mutateAsync({ id: noteId });
      toast.success("Note deleted");
      refetch();
    } catch (error) {
      toast.error("Failed to delete note");
    }
  };

  const handleGenerateSummary = async (noteId: number) => {
    try {
      await generateSummaryMutation.mutateAsync({ noteId });
      toast.success("Summary generated!");
      refetch();
    } catch (error) {
      toast.error("Failed to generate summary");
    }
  };

  return (
    <DashboardLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Notes</h1>
            <p className="text-gray-600 mt-1">
              Upload and manage your study materials
            </p>
          </div>
          <Button
            onClick={() => setShowForm(!showForm)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-5 h-5 mr-2" />
            New Note
          </Button>
        </div>

        {/* Create Note Form */}
        {showForm && (
          <Card className="p-6 border-2 border-blue-200 bg-blue-50">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Create New Note</h2>
            <form onSubmit={handleCreateNote} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Title *
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Biology Chapter 5 - Photosynthesis"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subject
                </label>
                <Input
                  type="text"
                  placeholder="e.g., Biology"
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  disabled={isLoading}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Content *
                </label>
                <Textarea
                  placeholder="Paste your study notes here..."
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  rows={8}
                  disabled={isLoading}
                />
              </div>

              <div className="flex gap-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                  Create Note
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowForm(false)}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </Card>
        )}

        {/* Notes List */}
        {notesLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          </div>
        ) : userNotes.length === 0 ? (
          <Card className="p-12 text-center">
            <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No notes yet
            </h3>
            <p className="text-gray-600 mb-4">
              Create your first note to get started with AI-powered summaries and quizzes
            </p>
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Create Your First Note
            </Button>
          </Card>
        ) : (
          <div className="grid gap-6">
            {userNotes.map((note: any) => (
              <Card key={note.id} className="p-6 hover:shadow-lg transition-shadow">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-lg font-bold text-gray-900">{note.title}</h3>
                    {note.subject && (
                      <p className="text-sm text-gray-600 mt-1">{note.subject}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(note.uploadedAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleGenerateSummary(note.id)}
                      disabled={generateSummaryMutation.isPending}
                    >
                      <Zap className="w-4 h-4 mr-1" />
                      Summarize
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteNote(note.id)}
                      disabled={deleteNoteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <p className="text-gray-600 line-clamp-3 mb-4">
                  {note.content}
                </p>

                <div className="flex gap-2">
                  <Button
                    size="sm"
                    className="bg-blue-600 hover:bg-blue-700"
                    onClick={() => navigate(`/quizzes?noteId=${note.id}`)}
                  >
                    Generate Quiz
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
