import { motion, AnimatePresence } from "motion/react";
import { Link } from "react-router-dom";
import { Verified, Shield, Network, BarChart3, Sparkles, Search } from "lucide-react";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

const typewriterWords = [
  "Phonetic Matching",
  "Semantic Analysis",
  "PRGI Compliance",
  "Title Verification",
  "Press Registrar",
];

function Typewriter() {
  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [reverse, setReverse] = useState(false);

  useEffect(() => {
    if (subIndex === typewriterWords[index].length + 1 && !reverse) {
      setTimeout(() => setReverse(true), 2000);
      return;
    }

    if (subIndex === 0 && reverse) {
      setReverse(false);
      setIndex((prev) => (prev + 1) % typewriterWords.length);
      return;
    }

    const timeout = setTimeout(() => {
      setSubIndex((prev) => prev + (reverse ? -1 : 1));
    }, Math.max(reverse ? 75 : subIndex === typewriterWords[index].length ? 1000 : 150, parseInt((Math.random() * 100).toString())));

    return () => clearTimeout(timeout);
  }, [subIndex, index, reverse]);

  return (
    <span className="inline-block min-w-[200px]">
      {typewriterWords[index].substring(0, subIndex)}
      <span className="inline-block w-[2px] h-[1em] bg-primary ml-1 animate-pulse align-middle" />
    </span>
  );
}

export default function LandingPage() {
  const { t } = useTranslation();
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <main className="flex flex-col items-center overflow-hidden">
      {/* Hero Section */}
      <section className="w-full max-w-[1280px] px-6 md:px-20 py-12 md:py-32">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col gap-10 order-2 lg:order-1"
          >
            <div className="flex flex-col gap-6">
              <motion.div
                variants={itemVariants}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.15em] w-fit border border-primary/20"
              >
                <Verified className="size-4" />
                {t("landing.officialSystem")}
              </motion.div>
              
              <motion.div variants={itemVariants} className="space-y-2">
                <h1 className="text-slate-900 dark:text-white text-5xl md:text-7xl font-black leading-[1.05] tracking-tight">
                  {t("landing.ensureYour")} <br />
                  <span className="text-primary">{t("landing.publication")}</span> <br />
                  <span className="relative">
                    {t("landing.identity")}
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1.2, duration: 1, ease: "circOut" }}
                      className="absolute -bottom-2 left-0 h-2 bg-primary/20 rounded-full"
                    />
                  </span>
                </h1>
                <div className="h-8 md:h-10 mt-4">
                  <p className="text-primary font-bold text-xl md:text-2xl tracking-tight">
                    <Typewriter />
                  </p>
                </div>
              </motion.div>

              <motion.p
                variants={itemVariants}
                className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium leading-relaxed max-w-[580px]"
              >
                {t("landing.subtitle")}
              </motion.p>
            </div>
            
            <motion.div variants={itemVariants} className="flex flex-col sm:flex-row gap-5">
              <Link
                to="/dashboard"
                className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-2xl h-16 px-8 bg-primary text-white text-lg font-black shadow-xl shadow-primary/30 hover:translate-y-[-4px] hover:shadow-2xl hover:shadow-primary/40 transition-all duration-300"
              >
                {t("landing.getStarted")}
              </Link>
              <Link
                to="/guidelines"
                className="flex min-w-[200px] cursor-pointer items-center justify-center rounded-2xl h-16 px-8 bg-white dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-slate-100 text-lg font-bold hover:bg-slate-50 dark:hover:bg-slate-700 hover:translate-y-[-4px] transition-all duration-300"
              >
                {t("landing.viewGuidelines")}
              </Link>
            </motion.div>
          </motion.div>

          {/* Visual Element */}
          <motion.div
            initial={{ opacity: 0, x: 40, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
            className="order-1 lg:order-2 relative"
          >
            <div className="absolute -inset-4 bg-gradient-to-tr from-primary/20 to-cyan-500/20 blur-3xl rounded-full animate-pulse" />
            <div className="relative w-full aspect-square rounded-[2.5rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)] dark:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] group border border-white/20">
              <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-cyan-500/10 z-10"></div>
              <div className="w-full h-full bg-slate-50 dark:bg-slate-900 flex items-center justify-center relative bg-[url('https://www.transparenttextures.com/patterns/pinstriped-suit.png')]">
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.8, duration: 1 }}
                  className="relative z-20 flex flex-col items-center gap-8 p-10 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md rounded-[2rem] border border-slate-200 dark:border-slate-700 shadow-2xl w-[88%]"
                >
                  <div className="w-full space-y-6">
                    <div className="flex items-center justify-between">
                      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                      <div className="flex gap-1.5">
                        <div className="size-2 rounded-full bg-red-400" />
                        <div className="size-2 rounded-full bg-amber-400" />
                        <div className="size-2 rounded-full bg-emerald-400" />
                      </div>
                    </div>
                    
                    <div className="h-14 w-full bg-primary/5 rounded-2xl flex items-center px-5 border-2 border-primary/20 relative overflow-hidden">
                      <div className="flex items-center gap-3">
                        <Search className="size-5 text-primary" />
                        <span className="text-primary font-black text-base tracking-wide">"The Daily Post"</span>
                      </div>
                      <motion.div 
                        animate={{ x: ["0%", "100%"] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                        className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-primary/10 to-transparent"
                      />
                    </div>
                    
                    <div className="space-y-4">
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.5, duration: 0.6 }}
                        className="flex justify-between items-center p-4 rounded-2xl bg-white dark:bg-slate-800 border-l-4 border-red-500 shadow-lg"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Direct Match</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">"Daily Post"</span>
                        </div>
                        <span className="text-xs bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 px-3 py-1.5 rounded-full font-black">98% MATCH</span>
                      </motion.div>
                      
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 1.8, duration: 0.6 }}
                        className="flex justify-between items-center p-4 rounded-2xl bg-white dark:bg-slate-800 border-l-4 border-amber-500 shadow-lg"
                      >
                        <div className="flex flex-col gap-0.5">
                          <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Semantic Similarity</span>
                          <span className="text-sm font-bold text-slate-700 dark:text-slate-200">"Everyday Mail"</span>
                        </div>
                        <span className="text-xs bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-400 px-3 py-1.5 rounded-full font-black">HIGH RISK</span>
                      </motion.div>
                    </div>
                  </div>
                </motion.div>
                
                {/* Floating Elements */}
                <motion.div 
                  animate={{ y: [0, -15, 0] }}
                  transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute top-12 right-12 p-5 glass-card rounded-3xl shadow-2xl hidden md:flex items-center justify-center border border-white/40 z-30"
                >
                  <Sparkles className="text-emerald-500 size-10" />
                </motion.div>
                
                <motion.div 
                  animate={{ y: [0, 15, 0] }}
                  transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                  className="absolute bottom-12 left-12 p-5 glass-card rounded-3xl shadow-2xl hidden md:flex items-center justify-center border border-white/40 z-30"
                >
                  <BarChart3 className="text-primary size-10" />
                </motion.div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="w-full bg-white dark:bg-slate-900/50 py-32 px-6 md:px-20">
        <div className="max-w-[1280px] mx-auto">
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="flex flex-col items-center text-center gap-6 mb-20"
          >
            <motion.h2 variants={itemVariants} className="text-primary text-sm font-black uppercase tracking-[0.3em]">Core Capabilities</motion.h2>
            <motion.h3 variants={itemVariants} className="text-slate-900 dark:text-white text-4xl md:text-6xl font-black tracking-tight max-w-[800px]">
              Advanced Verification Technology
            </motion.h3>
            <motion.p variants={itemVariants} className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-medium max-w-[700px]">
              Our system employs cutting-edge algorithms to maintain the integrity of the Indian press landscape through multi-layered analysis.
            </motion.p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {[
              {
                title: "Phonetic Matching",
                desc: "Detects similar-sounding titles across different languages and scripts to prevent brand confusion and intentional misspellings.",
                icon: (
                  <div className="relative flex items-center gap-1">
                    <div className="w-1.5 h-8 bg-cyan-400 rounded-full animate-pulse"></div>
                    <div className="w-1.5 h-12 bg-blue-500 rounded-full animate-pulse [animation-delay:200ms]"></div>
                    <div className="w-1.5 h-6 bg-cyan-300 rounded-full animate-pulse [animation-delay:400ms]"></div>
                    <div className="w-1.5 h-10 bg-blue-600 rounded-full animate-pulse [animation-delay:600ms]"></div>
                    <div className="w-1.5 h-7 bg-cyan-500 rounded-full animate-pulse [animation-delay:800ms]"></div>
                  </div>
                )
              },
              {
                title: "Semantic Analysis",
                desc: "Uses natural language processing to identify conceptually identical titles even when synonyms or different phrasing is used.",
                icon: (
                  <div className="relative">
                    <Network className="text-primary size-12 animate-pulse" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-blue-400 rounded-full blur-[2px]"></div>
                    <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-cyan-400 rounded-full blur-[2px]"></div>
                  </div>
                )
              },
              {
                title: "Compliance Enforcement",
                desc: "Automated checks against PRGI regulatory frameworks to ensure every application meets mandatory legal and administrative standards.",
                icon: (
                  <div className="relative flex items-center justify-center">
                    <Shield className="text-slate-800 dark:text-white size-12" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                      <Verified className="text-amber-400 size-6 fill-amber-400" />
                    </div>
                  </div>
                )
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ delay: idx * 0.15, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="group flex flex-col gap-8 p-10 rounded-[2.5rem] glass-card border-slate-200 dark:border-slate-700 hover:border-primary/50 transition-all duration-500 shadow-sm hover:shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] hover:translate-y-[-12px]"
              >
                <div className="w-24 h-24 rounded-3xl glass-card flex items-center justify-center shadow-xl group-hover:bg-primary/5 transition-colors duration-500">
                  {item.icon}
                </div>
                <div className="flex flex-col gap-4">
                  <h4 className="text-slate-900 dark:text-white text-2xl font-black tracking-tight">{item.title}</h4>
                  <p className="text-slate-600 dark:text-slate-400 text-lg font-medium leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="w-full px-6 md:px-20 py-32">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-[1200px] mx-auto rounded-[3rem] bg-slate-900 dark:bg-primary p-12 md:p-24 relative overflow-hidden flex flex-col items-center text-center gap-10 shadow-[0_48px_96px_-24px_rgba(0,0,0,0.3)]"
        >
          <div className="absolute -top-24 -right-24 w-96 h-96 bg-primary/20 rounded-full blur-[100px]"></div>
          <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-cyan-500/20 rounded-full blur-[100px]"></div>
          
          <div className="relative z-10 space-y-6">
            <h2 className="text-white text-4xl md:text-6xl font-black leading-tight tracking-tight">
              Ready to verify your <br /> publication title?
            </h2>
            <p className="text-white/70 text-lg md:text-2xl font-medium max-w-[720px] mx-auto leading-relaxed">
              Join thousands of publishers using the PRGI automated system for instant title clearance and hassle-free registration.
            </p>
          </div>

          <div className="relative z-10 flex flex-col sm:flex-row gap-6 pt-6">
            <Link
              to="/dashboard"
              className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-2xl h-20 px-10 bg-white text-slate-900 text-xl font-black shadow-2xl hover:scale-105 hover:translate-y-[-4px] transition-all duration-300"
            >
              Get Started Now
            </Link>
            <Link
              to="/support"
              className="flex min-w-[240px] cursor-pointer items-center justify-center rounded-2xl h-20 px-10 border-2 border-white/20 bg-white/5 text-white text-xl font-bold backdrop-blur-md hover:bg-white/10 hover:translate-y-[-4px] transition-all duration-300"
            >
              Contact Support
            </Link>
          </div>
          
          <motion.p 
            animate={{ opacity: [0.4, 0.8, 0.4] }}
            transition={{ duration: 3, repeat: Infinity }}
            className="relative z-10 text-white/50 text-base font-bold tracking-wide"
          >
            Processing time reduced by 70% compared to manual verification.
          </motion.p>
        </motion.div>
      </section>
    </main>
  );
}
