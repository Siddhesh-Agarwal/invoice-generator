import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router";
import "./index.css";
import { TooltipProvider } from "./components/ui/tooltip.tsx";
import Index from "./pages/Index.tsx";
import { Toaster } from "sonner";
import HistoryPage from "./pages/History.tsx";
import { StrictMode } from "react";
import Header from "./components/Header.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <main className="min-h-screen bg-background">
        <Header />
        <Index />
        <Toaster richColors />
      </main>
    ),
  },
  {
    path: "/history",
    element: (
      <main className="min-h-screen bg-background">
        <Header />
        <HistoryPage />
        <Toaster richColors />
      </main>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <TooltipProvider>
      <RouterProvider router={router} />
    </TooltipProvider>
  </StrictMode>
);
