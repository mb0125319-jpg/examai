import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Notes from "./pages/Notes";
import Quizzes from "./pages/Quizzes";
import Progress from "./pages/Progress";
import ExamPredictor from "./pages/ExamPredictor";
import SmartQuiz from "./pages/SmartQuiz";
import Flashcards from "./pages/Flashcards";
import WeaknessAnalyzer from "./pages/WeaknessAnalyzer";
import StudyPlanner from "./pages/StudyPlanner";
import Pricing from "./pages/Pricing";

function Router() {
  // make sure to consider if you need authentication for certain routes
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/dashboard"} component={Dashboard} />
      <Route path={"/notes"} component={Notes} />
      <Route path={"/quizzes"} component={Quizzes} />
      <Route path={"/progress"} component={Progress} />
      <Route path={"/pricing"} component={Pricing} />
      <Route path={"/exam-predictor"} component={ExamPredictor} />
      <Route path={"/smart-quiz"} component={SmartQuiz} />
      <Route path={"/flashcards"} component={Flashcards} />
      <Route path={"/weakness-analyzer"} component={WeaknessAnalyzer} />
      <Route path={"/study-planner"} component={StudyPlanner} />
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

// NOTE: About Theme
// - First choose a default theme according to your design style (dark or light bg), than change color palette in index.css
//   to keep consistent foreground/background color across components
// - If you want to make theme switchable, pass `switchable` ThemeProvider and use `useTheme` hook

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
