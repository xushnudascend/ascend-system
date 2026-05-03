import { useLocation } from "react-router-dom";
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="text-center max-w-md">
        <h1 className="font-heading text-7xl font-bold glow-text mb-2">404</h1>
        <p className="mb-6 text-muted-foreground">Bu sahifa topilmadi.</p>
        <a href="/dashboard" className="inline-flex items-center px-5 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium hover:opacity-90 transition">
          Dashboardga qaytish
        </a>
      </div>
    </div>
  );
};

export default NotFound;
