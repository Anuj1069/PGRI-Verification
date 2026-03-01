import { motion } from "motion/react";
import { ShieldAlert, Settings2, BarChart, History, Gavel, ArrowRight, Mic2 } from "lucide-react";
import { Link } from "react-router-dom";

export default function ComplianceLogicPage() {
  const features = [
    {
      title: "Phonetic Verification",
      desc: "Utilizes Soundex and Metaphone algorithms to detect titles that sound identical despite different spellings.",
      icon: <Mic2 className="text-white size-8" />,
      delay: 0,
      example: (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 text-xs font-mono text-slate-500 border border-slate-200 dark:border-slate-700">
          <span className="text-red-500">Namaskar</span> vs <span className="text-red-500">Namascar</span><br />
          <span className="text-green-600">Match Detected (98%)</span>
        </div>
      )
    },
    {
      title: "Prefix & Suffix Handling",
      desc: "Automatically strips and evaluates disallowed descriptors to prevent circumvention of uniqueness rules.",
      icon: <Settings2 className="text-white size-8" />,
      delay: 0.2,
      example: (
        <div className="bg-slate-100 dark:bg-slate-800/50 rounded-lg p-3 text-xs font-mono text-slate-500 border border-slate-200 dark:border-slate-700">
          Ignored: "The", "India", "News"<br />
          <span className="text-primary">"The India Times" → "Times"</span>
        </div>
      )
    },
    {
      title: "Verification Probability",
      desc: "Proprietary scoring engine calculates approval likelihood based on aggregate similarity metrics.",
      icon: <BarChart className="text-white size-8" />,
      delay: 0.4,
      example: (
        <div className="space-y-2">
          <div className="w-full bg-slate-200 dark:bg-slate-700 rounded-full h-2.5">
            <div className="bg-red-500 h-2.5 rounded-full w-[20%]"></div>
          </div>
          <p className="text-xs text-slate-500">80% Similarity = <span className="font-bold text-red-500">Max 20% Approval Chance</span></p>
        </div>
      )
    },
    {
      title: "Historical Search",
      desc: "Deep cross-referencing against the master database of verified titles dating back decades.",
      icon: <History className="text-white size-8" />,
      delay: 0.6,
      example: (
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black text-slate-900 dark:text-white">160,000+</span>
          <span className="text-xs font-medium text-slate-500 uppercase tracking-wide">Registered Titles Scanned</span>
        </div>
      )
    }
  ];

  return (
    <main className="flex-grow w-full max-w-7xl mx-auto px-6 md:px-12 py-12 md:py-20 flex flex-col items-center">
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 1.5, ease: [0.2, 0.8, 0.2, 1] }}
        className="text-center max-w-3xl mb-16"
      >
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit mb-4">
          <ShieldAlert className="size-4" />
          Compliance Framework
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
          Regulatory Standards & <span className="text-primary">Validation Logic</span>
        </h1>
        <p className="text-lg text-slate-600 dark:text-slate-400 leading-relaxed">
          Our comprehensive verification engine ensures strict adherence to PRGI guidelines, analyzing phonetic similarity, linguistic patterns, and regulatory constraints in real-time.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full mb-16">
        {features.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: item.delay, ease: [0.2, 0.8, 0.2, 1] }}
            className="glass-card rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-2"
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: idx * 0.5 }}
              className="w-16 h-16 rounded-xl flex items-center justify-center relative bg-gradient-to-br from-navy-blue to-royal-blue shadow-lg"
            >
              {item.icon}
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{item.title}</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed mb-4">
                {item.desc}
              </p>
              {item.example}
            </div>
          </motion.div>
        ))}

        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.8, ease: [0.2, 0.8, 0.2, 1] }}
          className="glass-card rounded-2xl p-8 flex flex-col gap-6 transition-all duration-300 hover:-translate-y-2 md:col-span-2 lg:col-span-2"
        >
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-center">
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.2 }}
              className="w-16 h-16 rounded-xl flex-shrink-0 flex items-center justify-center relative bg-gradient-to-br from-navy-blue to-royal-blue shadow-lg"
            >
              <Gavel className="text-white size-8" />
            </motion.div>
            <div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Regulatory Enforcement</h3>
              <p className="text-slate-600 dark:text-slate-300 text-sm leading-relaxed max-w-xl">
                Automated blocking of restricted and sensitive terms to maintain national integrity and prevent misuse of authority. This system proactively flags applications containing words reserved for state use.
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 mt-2">
            {["Police", "Army", "CBI", "Government"].map((tag) => (
              <span key={tag} className="px-3 py-1 bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 rounded-md text-xs font-bold border border-red-200 dark:border-red-800 flex items-center gap-1">
                <ShieldAlert className="size-3" /> {tag}
              </span>
            ))}
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 1 }}
      >
        <Link
          to="/dashboard"
          className="group relative flex min-w-[240px] cursor-pointer items-center justify-center rounded-xl h-14 px-8 bg-primary text-white text-base font-bold shadow-lg shadow-primary/30 hover:shadow-primary/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
        >
          <span>Start Verifying</span>
          <ArrowRight className="ml-2 size-5 transition-transform group-hover:translate-x-1" />
        </Link>
      </motion.div>
    </main>
  );
}
