import { Switch, Route } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/context/AuthContext";
import LandingPage from "@/pages/LandingPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import ProfessionalsDirectoryPage from "@/pages/ProfessionalsDirectoryPage";
import ProfessionalProfilePage from "@/pages/ProfessionalProfilePage";
import BookingPage from "@/pages/BookingPage";
import PatientDashboardPage from "@/pages/PatientDashboardPage";
import ProfessionalDashboardPage from "@/pages/ProfessionalDashboardPage";
import AdminDashboardPage from "@/pages/AdminDashboardPage";
import NotFound from "@/pages/not-found";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 1, staleTime: 30_000 },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Switch>
          <Route path="/" component={LandingPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/professionals" component={ProfessionalsDirectoryPage} />
          <Route path="/professionals/:id" component={ProfessionalProfilePage} />
          <Route path="/book/:id" component={BookingPage} />
          <Route path="/dashboard" component={PatientDashboardPage} />
          <Route path="/dashboard/patient" component={PatientDashboardPage} />
          <Route path="/dashboard/professional" component={ProfessionalDashboardPage} />
          <Route path="/admin" component={AdminDashboardPage} />
          <Route component={NotFound} />
        </Switch>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
