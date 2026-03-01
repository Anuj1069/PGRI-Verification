import { motion } from "motion/react";
import { ShieldCheck, Loader2 } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

export default function SignInPage() {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/google/url");
      const { url } = await response.json();
      
      const width = 500;
      const height = 600;
      const left = window.screenX + (window.outerWidth - width) / 2;
      const top = window.screenY + (window.outerHeight - height) / 2;
      
      const popup = window.open(
        url,
        "google_auth",
        `width=${width},height=${height},left=${left},top=${top}`
      );

      if (!popup) {
        alert("Popup blocked! Please allow popups for this site.");
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Failed to start Google Sign-In:", error);
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.data?.type === "OAUTH_AUTH_SUCCESS") {
        navigate("/dashboard");
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [navigate]);

  return (
    <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-12">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.98 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-[480px]"
      >
        <div className="glass-card rounded-2xl p-8 md:p-[48px] flex flex-col gap-8 shadow-2xl">
          <div className="flex flex-col items-center text-center gap-4">
            <div className="size-14 flex items-center justify-center bg-primary/10 rounded-2xl mb-2">
              <ShieldCheck className="text-primary size-10" />
            </div>
            <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Sign in to PRGI</h1>
            <p className="text-base text-slate-500 dark:text-slate-400">Welcome back! Please enter your details.</p>
          </div>

          <button 
            onClick={handleGoogleSignIn}
            disabled={isLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 py-3.5 px-4 text-base font-semibold text-slate-700 dark:text-slate-200 transition-all hover:bg-slate-50 dark:hover:bg-slate-700 hover:shadow-md active:scale-[0.99] disabled:opacity-50"
          >
            {isLoading ? (
              <Loader2 className="size-5 animate-spin" />
            ) : (
              <svg aria-hidden="true" className="h-5 w-5" viewBox="0 0 24 24">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"></path>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"></path>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"></path>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"></path>
              </svg>
            )}
            Continue with Google
          </button>

          <div className="relative flex items-center py-2">
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
            <span className="flex-shrink-0 mx-4 text-xs font-medium text-slate-400 uppercase tracking-wide">or</span>
            <div className="flex-grow border-t border-slate-200 dark:border-slate-700"></div>
          </div>

          <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="email">Email Address</label>
              <input
                className="w-full rounded-xl border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 px-4 py-3.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all"
                id="email"
                placeholder="name@publication.com"
                type="email"
              />
            </div>
            <div className="flex flex-col gap-2">
              <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 ml-1" htmlFor="password">Password</label>
              <input
                className="w-full rounded-xl border-slate-300 dark:border-slate-600 bg-white/50 dark:bg-slate-900/50 px-4 py-3.5 text-base outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 dark:text-white placeholder:text-slate-400 transition-all"
                id="password"
                placeholder="••••••••"
                type="password"
              />
            </div>
            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary/20" type="checkbox" />
                <span className="text-sm text-slate-600 dark:text-slate-400 group-hover:text-slate-900 dark:group-hover:text-slate-200 transition-colors">Remember me</span>
              </label>
              <Link to="#" className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors">Forgot Password?</Link>
            </div>
            <button
              className="mt-4 w-full rounded-xl bg-primary py-3.5 text-base font-bold text-white shadow-lg shadow-primary/30 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-[0.98] active:shadow-sm"
              type="button"
            >
              Sign In
            </button>
          </form>

          <div className="text-center text-sm text-slate-600 dark:text-slate-400 mt-2">
            Don't have an account?{" "}
            <Link to="#" className="font-bold text-primary hover:underline decoration-2 underline-offset-2 transition-all">Sign Up</Link>
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-10 text-center"
        >
          <p className="text-xs text-slate-400 dark:text-slate-600">
            © 2024 PRGI Verification. All rights reserved.
          </p>
          <div className="mt-3 flex justify-center gap-6 text-xs text-slate-400 dark:text-slate-600 font-medium">
            <Link to="#" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <span>•</span>
            <Link to="#" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </motion.div>
      </motion.div>
    </main>
  );
}
