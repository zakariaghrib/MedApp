import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LoginPage } from "./features/auth/pages/LoginPage";
import { RegisterPage } from "./features/auth/pages/RegisterPage";
import { DashboardLayout } from "./features/dashboard/layout/DashboardLayout";
import { DashboardPage } from "./features/dashboard/pages/DashboardPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Auth routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        
        {/* Dashboard routes */}
        <Route path="/" element={<DashboardLayout />}>
          <Route index element={<DashboardPage />} />
          {/* We'll add /patients, /agenda, etc. here later */}
          <Route path="patients" element={<div>Patients Page Placeholder</div>} />
          <Route path="agenda" element={<div>Agenda Page Placeholder</div>} />
          <Route path="consultations" element={<div>Consultations Page Placeholder</div>} />
          <Route path="facturation" element={<div>Facturation Page Placeholder</div>} />
          <Route path="settings" element={<div>Settings Page Placeholder</div>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;