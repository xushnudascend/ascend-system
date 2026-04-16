import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import { Eye, EyeOff, ArrowRight, Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { signUp, signIn } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (isLogin) {
      const { error } = await signIn(email, password);
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        navigate("/dashboard");
      }
    } else {
      const { error } = await signUp(email, password, name);
      if (error) {
        toast({ title: "Xatolik", description: error.message, variant: "destructive" });
      } else {
        toast({ title: "Muvaffaqiyat!", description: "Emailingizni tekshiring yoki dashboardga o'ting." });
        navigate("/onboarding");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <Link to="/" className="font-heading text-3xl font-bold">
            ASCEND<span className="text-primary">.</span>
          </Link>
          <p className="text-muted-foreground mt-2">
            {isLogin ? "Tizimga kiring" : "Ro'yxatdan o'ting"}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="p-6 rounded-2xl border border-border bg-card space-y-4">
            {!isLogin && (
              <div>
                <label className="text-xs text-muted-foreground">Ism</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ismingiz"
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                />
              </div>
            )}
            <div>
              <label className="text-xs text-muted-foreground">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@misol.com"
                required
                className="w-full mt-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              />
            </div>
            <div>
              <label className="text-xs text-muted-foreground">Parol</label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                  minLength={6}
                  className="w-full mt-1 px-4 py-3 rounded-xl border border-border bg-background text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 mt-0.5 text-muted-foreground"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-primary text-primary-foreground font-heading font-bold glow-box hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <>
                  {isLogin ? "Kirish" : "Ro'yxatdan o'tish"}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </div>
        </form>

        <p className="text-center text-sm text-muted-foreground mt-6">
          {isLogin ? "Hisobingiz yo'qmi? " : "Hisobingiz bormi? "}
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-primary hover:underline font-medium"
          >
            {isLogin ? "Ro'yxatdan o'ting" : "Kirish"}
          </button>
        </p>
      </motion.div>
    </div>
  );
}
