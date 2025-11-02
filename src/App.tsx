import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Splash from "./pages/Splash";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Profile from "./pages/Profile";
import Labs from "./pages/Labs";
import BranchSelector from "./pages/BranchSelector";
import LabList from "./pages/LabList";
import LabEntrance from "./pages/LabEntrance";
import Workplace from "./pages/Workplace";
import ExperimentResults from "./pages/ExperimentResults";
import Multiplayer from "./pages/Multiplayer";
import Shop from "./pages/Shop";
import LabProgressTracker from "./pages/LabProgressTracker";
import LabRecommendations from "./pages/LabRecommendations";
import LabHistory from "./pages/LabHistory";
import LabNotes from "./pages/LabNotes";
import LabChallenges from "./pages/LabChallenges";
import AppLayout from "./components/layout/AppLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Entry points */}
          <Route path="/splash" element={<Splash />} />
          <Route path="/login" element={<Login />} />
          
          {/* Main app with layout */}
          <Route element={<AppLayout />}>
            <Route path="/home" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/labs" element={<Labs />} />
            <Route path="/branch-selector" element={<BranchSelector />} />
            <Route path="/lab-list/:branchId" element={<LabList />} />
            <Route path="/lab-entrance/:labId" element={<LabEntrance />} />
            <Route path="/workplace/:labId" element={<Workplace />} />
            <Route path="/results/:labId" element={<ExperimentResults />} />
            <Route path="/progress-tracker" element={<LabProgressTracker />} />
            <Route path="/progress-tracker/:branchId" element={<LabProgressTracker />} />
            <Route path="/recommendations" element={<LabRecommendations />} />
            <Route path="/recommendations/:branchId" element={<LabRecommendations />} />
            <Route path="/history" element={<LabHistory />} />
            <Route path="/history/:branchId" element={<LabHistory />} />
            <Route path="/notes" element={<LabNotes />} />
            <Route path="/challenges" element={<LabChallenges />} />
            <Route path="/multiplayer" element={<Multiplayer />} />
            <Route path="/shop" element={<Shop />} />
          </Route>
          
          {/* Redirects */}
          <Route path="/" element={<Navigate to="/splash" replace />} />
          
          {/* 404 */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
