import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ProductGrid } from "@/components/ProductGrid";
import { MySubscriptions } from "@/components/MySubscriptions";
import { Button } from "@/components/ui/button";
import { Bell, Package } from "lucide-react";

const queryClient = new QueryClient();

function AppContent() {
  const [view, setView] = useState<"browse" | "alerts">("browse");
  const [email, setEmail] = useState(
    () => localStorage.getItem("amul_email") || ""
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="bg-primary text-primary-foreground">
        <div className="max-w-5xl mx-auto px-4 py-6 text-center">
          <h1 className="text-2xl font-bold flex items-center justify-center gap-2">
            <Bell className="h-6 w-6" />
            Amul Restock
          </h1>
          <p className="text-primary-foreground/80 text-sm mt-1">
            Get notified when Amul products are back in stock
          </p>
          <nav className="flex gap-2 justify-center mt-4">
            <Button
              variant={view === "browse" ? "outline" : "ghost"}
              size="sm"
              onClick={() => setView("browse")}
              className={
                view === "browse"
                  ? "bg-white text-primary hover:bg-white/90 border-white"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
              }
            >
              <Package className="h-4 w-4" />
              Products
            </Button>
            <Button
              variant={view === "alerts" ? "outline" : "ghost"}
              size="sm"
              onClick={() => setView("alerts")}
              className={
                view === "alerts"
                  ? "bg-white text-primary hover:bg-white/90 border-white"
                  : "text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
              }
            >
              <Bell className="h-4 w-4" />
              My Alerts
            </Button>
          </nav>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 py-6">
        {view === "browse" ? (
          <ProductGrid email={email} setEmail={setEmail} />
        ) : (
          <MySubscriptions email={email} setEmail={setEmail} />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-border text-center py-4 text-xs text-muted">
        Not affiliated with Amul · Data from{" "}
        <a
          href="https://shop.amul.com"
          target="_blank"
          rel="noopener"
          className="text-primary hover:underline"
        >
          shop.amul.com
        </a>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}
