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
import NotFound from "./pages/NotFound";

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
