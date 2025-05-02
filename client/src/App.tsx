import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import HomePage from "@/pages/home-page";
import NotFound from "@/pages/not-found";
import AuthPage from "@/pages/auth-page";
import MarketAnalysisPage from "@/pages/market-analysis-page";
import CompetitorIntelligencePage from "@/pages/competitor-intelligence-page";
import OpportunitiesPage from "@/pages/opportunities-page";
import ForecastingPage from "@/pages/forecasting-page";
import ReportsPage from "@/pages/reports-page";
import AlertsPage from "@/pages/alerts-page";
import SettingsPage from "@/pages/settings-page";
import { ProtectedRoute } from "./lib/protected-route";
import { AuthProvider } from "@/hooks/use-auth";

function Router() {
  return (
    <Switch>
      <ProtectedRoute path="/" component={HomePage} />
      <ProtectedRoute path="/market-analysis" component={MarketAnalysisPage} />
      <ProtectedRoute path="/competitor-intelligence" component={CompetitorIntelligencePage} />
      <ProtectedRoute path="/opportunities" component={OpportunitiesPage} />
      <ProtectedRoute path="/forecasting" component={ForecastingPage} />
      <ProtectedRoute path="/reports" component={ReportsPage} />
      <ProtectedRoute path="/alerts" component={AlertsPage} />
      <ProtectedRoute path="/settings" component={SettingsPage} />
      <Route path="/auth" component={AuthPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
