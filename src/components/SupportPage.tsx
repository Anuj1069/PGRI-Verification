import { motion } from "motion/react";
import { Headset, Mail, Phone, MapPin } from "lucide-react";

export default function SupportPage() {
  return (
    <main className="flex flex-col items-center justify-center grow py-12 md:py-24 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]">
      <section className="w-full max-w-4xl px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative w-full rounded-3xl overflow-hidden shadow-2xl glass-card"
        >
          <div className="min-h-[600px] bg-white/50 dark:bg-slate-900/50 p-8 md:p-16">
            <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit mb-6">
                <Headset className="size-4" />
                Support Center
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-2">How can we help you?</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-10">Fill out the form below and our compliance team will get back to you within 24 hours.</p>
            </div>

            <form className="space-y-6 max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block text-left" htmlFor="fullname">Full Name</label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 py-3 text-sm focus:border-primary focus:ring-primary dark:text-white placeholder-slate-400"
                    id="fullname"
                    placeholder="Enter your full name"
                    type="text"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block text-left" htmlFor="email">Email Address</label>
                  <input
                    className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 py-3 text-sm focus:border-primary focus:ring-primary dark:text-white placeholder-slate-400"
                    id="email"
                    placeholder="name@publication.com"
                    type="email"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block text-left" htmlFor="subject">Subject</label>
                <select className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 py-3 text-sm focus:border-primary focus:ring-primary dark:text-white text-slate-500">
                  <option>Title Verification Inquiry</option>
                  <option>Compliance Appeal</option>
                  <option>Technical Support</option>
                  <option>Other</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-700 dark:text-slate-300 block text-left" htmlFor="message">Message</label>
                <textarea
                  className="w-full rounded-xl border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-800/80 px-4 py-3 text-sm focus:border-primary focus:ring-primary dark:text-white placeholder-slate-400 min-h-[120px]"
                  id="message"
                  placeholder="Describe your issue or question in detail..."
                ></textarea>
              </div>
              <div className="flex justify-center pt-2">
                <button
                  className="w-full md:w-auto px-10 py-3 bg-primary hover:bg-blue-700 text-white font-bold rounded-xl shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5"
                  type="button"
                >
                  Send Message
                </button>
              </div>
            </form>

            <div className="flex flex-col md:flex-row justify-center items-center gap-8 md:gap-16 mt-16 pt-10 border-t border-slate-200 dark:border-slate-700/50 max-w-3xl mx-auto">
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <Mail className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Email Us</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">support@prgi.gov.in</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <Phone className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Call Us</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">+91 11-2338-0000</span>
                </div>
              </div>
              <div className="flex flex-col items-center gap-2 text-center">
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-1">
                  <MapPin className="size-6" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">Visit</span>
                  <span className="text-sm font-medium text-slate-700 dark:text-slate-200">New Delhi, India</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
