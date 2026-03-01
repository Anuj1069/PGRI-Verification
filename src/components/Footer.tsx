import { Link } from "react-router-dom";
import { BookOpen, Github, Twitter, Linkedin, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="w-full bg-white dark:bg-background-dark border-t border-slate-200 dark:border-slate-800 pt-16 pb-8 px-6 md:px-20">
      <div className="max-w-[1280px] mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
        <div className="col-span-1 md:col-span-1 flex flex-col gap-6">
          <Link to="/" className="flex items-center gap-3 text-primary">
            <div className="size-10 flex items-center justify-center bg-primary/10 rounded-xl">
              <BookOpen className="text-primary size-6" />
            </div>
            <h2 className="text-slate-900 dark:text-slate-100 text-xl font-black tracking-tight">
              PRGI Verification
            </h2>
          </Link>
          <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
            Ensuring the unique identity of the Indian press through advanced NLP and automated compliance verification.
          </p>
          <div className="flex gap-4">
            {[Twitter, Github, Linkedin, Mail].map((Icon, idx) => (
              <Link key={idx} to="#" className="size-10 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-slate-400 hover:text-primary hover:bg-primary/10 transition-all">
                <Icon className="size-5" />
              </Link>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs">Resources</h4>
          <div className="flex flex-col gap-4">
            <Link to="/guidelines" className="text-sm text-slate-500 hover:text-primary transition-colors">Verification Rules</Link>
            <Link to="/compliance" className="text-sm text-slate-500 hover:text-primary transition-colors">Compliance Logic</Link>
            <Link to="/support" className="text-sm text-slate-500 hover:text-primary transition-colors">Support Center</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-primary transition-colors">API Documentation</Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs">Legal</h4>
          <div className="flex flex-col gap-4">
            <Link to="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Terms of Service</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Cookie Policy</Link>
            <Link to="#" className="text-sm text-slate-500 hover:text-primary transition-colors">Accessibility</Link>
          </div>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="text-slate-900 dark:text-white font-bold uppercase tracking-widest text-xs">Newsletter</h4>
          <p className="text-sm text-slate-500">Get updates on new PRGI regulations and system features.</p>
          <div className="flex gap-2">
            <input 
              type="email" 
              placeholder="Email address" 
              className="flex-1 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-primary transition-all"
            />
            <button className="bg-primary text-white p-2 rounded-lg hover:bg-primary/90 transition-all">
              <ArrowRight className="size-5" />
            </button>
          </div>
        </div>
      </div>
      
      <div className="max-w-[1280px] mx-auto pt-8 border-t border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
        <p className="text-xs text-slate-400 font-medium">
          © 2024 Press Registrar General of India. All rights reserved.
        </p>
        <div className="flex items-center gap-2">
          <div className="size-2 bg-emerald-500 rounded-full animate-pulse"></div>
          <span className="text-xs text-slate-400 font-bold uppercase tracking-widest">System Status: Operational</span>
        </div>
      </div>
    </footer>
  );
}

import { ArrowRight } from "lucide-react";
