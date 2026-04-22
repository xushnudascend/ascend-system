import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { ThemeProvider } from "@/hooks/useTheme";
import { I18nProvider } from "@/hooks/useI18n";
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
import FriendsPage from "./pages/FriendsPage";
import SettingsPage from "./pages/SettingsPage";
import NotFound from "./pages/NotFound";
import BuddiesPage from "./pages/BuddiesPage";
import MethodsPage from "./pages/MethodsPage";
import CalmPage from "./pages/CalmPage";
import CharactersPage from "./pages/CharactersPage";
import DecisionHubPage from "./pages/DecisionHubPage";
import CognitiveDrillsPage from "./pages/CognitiveDrillsPage";
import IdentityPage from "./pages/IdentityPage";
import LifeSimulationPage from "./pages/LifeSimulationPage";
import CommandModePage from "./pages/CommandModePage";
import ExperimentLabPage from "./pages/ExperimentLabPage";
import FocusLockPage from "./pages/FocusLockPage";
import ChatPage from "./pages/ChatPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <I18nProvider>
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
                <Route path="/friends" element={<FriendsPage />} />
                <Route path="/settings" element={<SettingsPage />} />
                <Route path="/buddies" element={<BuddiesPage />} />
                <Route path="/methods" element={<MethodsPage />} />
                <Route path="/calm" element={<CalmPage />} />
                <Route path="/characters" element={<CharactersPage />} />
                <Route path="/decision-hub" element={<DecisionHubPage />} />
                <Route path="/drills" element={<CognitiveDrillsPage />} />
                <Route path="/identity" element={<IdentityPage />} />
                <Route path="/simulation" element={<LifeSimulationPage />} />
                <Route path="/command" element={<CommandModePage />} />
                <Route path="/lab" element={<ExperimentLabPage />} />
                <Route path="/focus" element={<FocusLockPage />} />
                <Route path="/chat/:id" element={<ChatPage />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </AuthProvider>
      </I18nProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
