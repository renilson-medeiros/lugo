import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Register from "./pages/Register";
import PropertyDetail from "./pages/PropertyDetail";
import Dashboard from "./pages/dashboard/Dashboard";
import PropertiesList from "./pages/dashboard/PropertiesList";
import PropertyForm from "./pages/dashboard/PropertyForm";
import TenantsList from "./pages/dashboard/TenantsList";
import TenantForm from "./pages/dashboard/TenantForm";
import ReceiptsList from "./pages/dashboard/ReceiptsList";
import ReceiptForm from "./pages/dashboard/ReceiptForm";
import Settings from "./pages/dashboard/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/registro" element={<Register />} />
          <Route path="/imovel/:id" element={<PropertyDetail />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/imoveis" element={<PropertiesList />} />
          <Route path="/dashboard/imoveis/novo" element={<PropertyForm />} />
          <Route path="/dashboard/imoveis/:id/editar" element={<PropertyForm />} />
          <Route path="/dashboard/imoveis/:propertyId/inquilino" element={<TenantForm />} />
          <Route path="/dashboard/inquilinos" element={<TenantsList />} />
          <Route path="/dashboard/inquilinos/novo" element={<TenantForm />} />
          <Route path="/dashboard/comprovantes" element={<ReceiptsList />} />
          <Route path="/dashboard/comprovantes/novo" element={<ReceiptForm />} />
          <Route path="/dashboard/configuracoes" element={<Settings />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
