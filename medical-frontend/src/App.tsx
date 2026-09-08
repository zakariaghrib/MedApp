import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { DashboardLayout } from "./features/dashboard/layout/DashboardLayout";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";
import { PatientsPage } from "./features/patients/pages/PatientsPage";
import { PatientProfilePage } from "./features/patients/pages/PatientProfilePage";
import { AgendaPage } from "./features/appointments/pages/AgendaPage";

const queryClient = new QueryClient();

import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          {/* Auth routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* Dashboard routes */}
          <Route path="/" element={<DashboardLayout />}>
            <Route index element={<DashboardPage />} />
            {/* Patients route */}
            <Route path="patients" element={<PatientsPage />} />
            <Route path="patients/:id" element={<PatientProfilePage />} />
            
            {/* Agenda route */}
            <Route path="agenda" element={<AgendaPage />} />
            
            <Route path="consultations" element={<div>Consultations Page Placeholder</div>} />
            <Route path="facturation" element={<div>Facturation Page Placeholder</div>} />
            <Route path="settings" element={<div>Settings Page Placeholder</div>} />
          </Route>
        </Routes>
      </BrowserRouter>
      <Toaster position="top-right" />
    </QueryClientProvider>
  );
}

export default App;