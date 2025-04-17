import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "./pages/Index";
import { Toaster } from "sonner";


const App = () => (
  <TooltipProvider>
    <Toaster richColors />
    <Index />
  </TooltipProvider>
);

export default App;
