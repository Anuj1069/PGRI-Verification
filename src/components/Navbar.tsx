import { Link, useLocation, useNavigate } from "react-router-dom";
import { BookOpen, Menu, X, LogOut, Globe, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTranslation } from "react-i18next";

interface UserData {
  name: string;
  email: string;
  picture: string;
}

export default function Navbar() {
  const { t, i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  const languages = [
    { code: 'en', name: 'English' },
    { code: 'hi', name: 'हिन्दी' },
    { code: 'bn', name: 'বাংলা' },
    { code: 'te', name: 'తెలుగు' },
    { code: 'mr', name: 'मराठी' },
    { code: 'ta', name: 'தமிழ்' },
    { code: 'gu', name: 'ગુજરાતી' },
    { code: 'ur', name: 'اردو' },
    { code: 'kn', name: 'ಕನ್ನಡ' },
    { code: 'ml', name: 'മലയാളം' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ' },
    { code: 'es', name: 'Español' },
    { code: 'fr', name: 'Français' },
    { code: 'de', name: 'Deutsch' },
    { code: 'zh', name: '中文' },
    { code: 'ja', name: '日本語' },
    { code: 'ar', name: 'العربية' },
    { code: 'ru', name: 'Русский' },
    { code: 'pt', name: 'Português' },
    { code: 'it', name: 'Italiano' },
    { code: 'ko', name: '한국어' },
    { code: 'tr', name: 'Türkçe' }
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    setIsLangOpen(false);
  };

  useEffect(() => {
    fetch("/api/auth/me")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) setUser(data.user);
      })
      .catch(() => setUser(null));
  }, [location]);

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" });
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const navLinks = [
    { name: t("nav.compliance"), href: "/compliance" },
    { name: t("nav.guidelines"), href: "/guidelines" },
    { name: t("nav.support"), href: "/support" },
  ];

  return (
    <header className="flex items-center justify-between whitespace-nowrap border-b border-solid border-slate-200 dark:border-slate-800 px-6 md:px-20 py-4 bg-white/80 dark:bg-background-dark/80 backdrop-blur-md sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-4 text-primary">
        <div className="size-8 flex items-center justify-center bg-primary/10 rounded-lg">
          <BookOpen className="text-primary size-5" />
        </div>
        <h2 className="text-slate-900 dark:text-slate-100 text-xl font-bold leading-tight tracking-tight">
          {t("nav.siteName")}
        </h2>
      </Link>

      <div className="hidden md:flex flex-1 justify-end gap-8">
        <div className="flex items-center gap-9">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              to={link.href}
              className={`text-sm font-medium transition-colors hover:text-primary ${
                location.pathname === link.href
                  ? "text-primary"
                  : "text-slate-700 dark:text-slate-300"
              }`}
            >
              {link.name}
            </Link>
          ))}
        </div>
        <div className="flex gap-3 items-center">
          <div className="relative">
            <button
              onClick={() => setIsLangOpen(!isLangOpen)}
              className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm active:scale-95"
            >
              <Globe className="size-4 text-primary" />
              <span className="uppercase tracking-wider">{i18n.language.split('-')[0]}</span>
              <ChevronDown className={`size-3 opacity-50 transition-transform duration-300 ${isLangOpen ? 'rotate-180' : ''}`} />
            </button>
            <AnimatePresence>
              {isLangOpen && (
                <>
                  <div className="fixed inset-0 z-50" onClick={() => setIsLangOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 10 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 10 }}
                    className="absolute right-0 mt-3 w-56 max-h-[400px] overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] z-[60] flex flex-col"
                  >
                    <div className="p-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Select Language</span>
                    </div>
                    <div className="overflow-y-auto custom-scrollbar p-2">
                      <div className="grid grid-cols-1 gap-1">
                        {languages.map((lang) => (
                          <button
                            key={lang.code}
                            onClick={() => changeLanguage(lang.code)}
                            className={`w-full text-left px-4 py-2.5 text-sm rounded-lg transition-all flex items-center justify-between group ${
                              i18n.language === lang.code 
                                ? 'bg-primary/10 text-primary font-bold' 
                                : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                            }`}
                          >
                            <span>{lang.name}</span>
                            {i18n.language === lang.code && <div className="size-1.5 rounded-full bg-primary animate-pulse" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {user ? (
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800 rounded-full border border-slate-200 dark:border-slate-700">
                <img src={user.picture} alt={user.name} className="size-6 rounded-full" referrerPolicy="no-referrer" />
                <span className="text-sm font-bold text-slate-700 dark:text-slate-200">{user.name}</span>
              </div>
              <button
                onClick={handleLogout}
                className="p-2 text-slate-500 hover:text-red-500 transition-colors"
                title="Logout"
              >
                <LogOut className="size-5" />
              </button>
            </div>
          ) : (
            <>
              <Link
                to="/dashboard"
                className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-primary text-white text-sm font-bold transition-all hover:bg-primary/90"
              >
                Get Started
              </Link>
              <Link
                to="/signin"
                className="flex min-w-[100px] cursor-pointer items-center justify-center rounded-lg h-10 px-5 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 text-sm font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-all"
              >
                Login
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="md:hidden flex items-center">
        <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 dark:text-slate-100">
          {isOpen ? <X /> : <Menu />}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-full left-0 w-full bg-white dark:bg-background-dark border-b border-slate-200 dark:border-slate-800 p-6 flex flex-col gap-4 md:hidden shadow-xl"
          >
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                onClick={() => setIsOpen(false)}
                className="text-lg font-medium text-slate-700 dark:text-slate-300 hover:text-primary"
              >
                {link.name}
              </Link>
            ))}
            <hr className="border-slate-200 dark:border-slate-800" />
            {user ? (
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
                  <img src={user.picture} alt={user.name} className="size-10 rounded-full" referrerPolicy="no-referrer" />
                  <div className="flex flex-col">
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{user.name}</span>
                    <span className="text-xs text-slate-500">{user.email}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 rounded-lg h-12 bg-red-50 dark:bg-red-900/10 text-red-600 font-bold"
                >
                  <LogOut className="size-5" /> Logout
                </button>
              </div>
            ) : (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-lg h-12 bg-primary text-white font-bold"
                >
                  Get Started
                </Link>
                <Link
                  to="/signin"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center rounded-lg h-12 bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 font-bold"
                >
                  Login
                </Link>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
