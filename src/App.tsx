import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { I18nProvider } from "@/hooks/useI18n";
import { CoachToneProvider } from "@/hooks/useCoachTone";
import LandingPage from "./pages/LandingPage";
import AuthPage from "./pages/AuthPage";
import OnboardingPage from "./pages/OnboardingPage";
import DashboardPage from "./pages/DashboardPage";
import CoursesPage from "./pages/CoursesPage";
import BooksPage from "./pages/BooksPage";
import AnalyticsPage from "./pages/AnalyticsPage";
import AIMentorPage from "./pages/AIMentorPage";
import CommunityPage from "./pages/CommunityPage";
import ProfilePage from "./pages/ProfilePage";
import LeaderboardPage from "./pages/LeaderboardPage";
import PricingPage from "./pages/PricingPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import BuddiesPage from "./pages/BuddiesPage";
import MethodsPage from "./pages/MethodsPage";
import CalmPage from "./pages/CalmPage";
import CharactersPage from "./pages/CharactersPage";
import CognitiveDrillsPage from "./pages/CognitiveDrillsPage";
import CommandModePage from "./pages/CommandModePage";
import FocusLockPage from "./pages/FocusLockPage";
import ChatPage from "./pages/ChatPage";
import HealthPage from "./pages/HealthPage";
import TimeLeakPage from "./pages/TimeLeakPage";
import OutputsPage from "./pages/OutputsPage";
import FailLogPage from "./pages/FailLogPage";
import DuelsPage from "./pages/DuelsPage";
import TrajectoryPage from "./pages/TrajectoryPage";
import AdminPage from "./pages/AdminPage";
import DecisionHubPage from "./pages/DecisionHubPage";
import ContractsPage from "./pages/ContractsPage";
import ContractDetailPage from "./pages/ContractDetailPage";
import RootCausePage from "./pages/RootCausePage";
import DailyFeedbackPage from "./pages/DailyFeedbackPage";
import WorkoutsPage from "./pages/WorkoutsPage";
import NutritionPage from "./pages/NutritionPage";
import IdentityQuizPage from "./pages/IdentityQuizPage";
import LifeScorePage from "./pages/LifeScorePage";
import WarRoomPage from "./pages/WarRoomPage";
import WinsWallPage from "./pages/WinsWallPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nProvider>
        <CoachToneProvider>
        <AuthProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/auth" element={<AuthPage />} />
                <Route path="/onboarding" element={<OnboardingPage />} />
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/courses" element={<CoursesPage />} />
                <Route path="/books" element={<BooksPage />} />
                <Route path="/analytics" element={<AnalyticsPage />} />
                <Route path="/ai-mentor" element={<AIMentorPage />} />
                <Route path="/community" element={<CommunityPage />} />
                <Route path="/profile" element={<ProfilePage />} />
                <Route path="/leaderboard" element={<LeaderboardPage />} />
                <Route path="/pricing" element={<PricingPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/buddies" element={<BuddiesPage />} />
                <Route path="/methods" element={<MethodsPage />} />
                <Route path="/calm" element={<CalmPage />} />
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/drills" element={<CognitiveDrillsPage />} />
                <Route path="/command" element={<CommandModePage />} />
                <Route path="/focus" element={<FocusLockPage />} />
                <Route path="/chat/:id" element={<ChatPage />} />
                <Route path="/health" element={<HealthPage />} />
                <Route path="/time-leak" element={<TimeLeakPage />} />
                <Route path="/outputs" element={<OutputsPage />} />
                <Route path="/fail-log" element={<FailLogPage />} />
                <Route path="/duels" element={<DuelsPage />} />
                <Route path="/trajectory" element={<TrajectoryPage />} />
                <Route path="/decision-hub" element={<DecisionHubPage />} />
                <Route path="/admin" element={<AdminPage />} />
                <Route path="/contracts" element={<ContractsPage />} />
                <Route path="/contracts/:id" element={<ContractDetailPage />} />
                <Route path="/root-cause" element={<RootCausePage />} />
                <Route path="/feedback" element={<DailyFeedbackPage />} />
                <Route path="/workouts" element={<WorkoutsPage />} />
                <Route path="/nutrition" element={<NutritionPage />} />
                <Route path="/identity-quiz" element={<IdentityQuizPage />} />
                <Route path="/life-score" element={<LifeScorePage />} />
                <Route path="/war-room" element={<WarRoomPage />} />
                <Route path="/wins" element={<WinsWallPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
        </CoachToneProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
