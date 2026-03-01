import { motion } from "motion/react";
import { Gavel, Ban, FileX, Merge, Languages, Calendar, Lightbulb } from "lucide-react";

export default function GuidelinesPage() {
  const guidelines = [
    {
      title: "Disallowed Words",
      icon: <Ban className="text-red-500 size-10" />,
      bg: "bg-red-50 dark:bg-red-900/20",
      border: "border-red-100 dark:border-red-800/30",
      innerBg: "bg-red-50 dark:bg-red-900/10",
      innerBorder: "border-red-100 dark:border-red-800/20",
      desc: "Certain words are strictly prohibited in titles to maintain public order and decency. Titles containing these terms will be automatically rejected by the system.",
      points: [
        "Words implying government affiliation (e.g., 'Police', 'Crime', 'Corruption').",
        "Terms related to national emblems or symbols without authorization.",
        "Offensive, obscene, or derogatory language."
      ]
    },
    {
      title: "Rejecting Titles",
      icon: <FileX className="text-amber-500 size-10" />,
      bg: "bg-amber-50 dark:bg-amber-900/20",
      border: "border-amber-100 dark:border-amber-800/30",
      innerBg: "bg-amber-50 dark:bg-amber-900/10",
      innerBorder: "border-amber-100 dark:border-amber-800/20",
      desc: "Titles that are too generic, misleading, or lack distinctiveness are subject to rejection. The goal is to ensure every publication has a unique identity.",
      points: [
        "Generic terms like 'News', 'Daily', 'Weekly' used alone.",
        "Titles that are confusingly similar to existing famous publications.",
        "Misleading descriptors that do not match the content nature."
      ]
    },
    {
      title: "Preventing Combinations",
      icon: <Merge className="text-blue-500 size-10" />,
      bg: "bg-blue-50 dark:bg-blue-900/20",
      border: "border-blue-100 dark:border-blue-800/30",
      innerBg: "bg-blue-50 dark:bg-blue-900/10",
      innerBorder: "border-blue-100 dark:border-blue-800/20",
      desc: "Combining existing titles or adding simple prefixes/suffixes to verified titles is not a valid strategy for uniqueness.",
      points: [
        "Adding 'The', 'New', 'Daily' to an already registered title.",
        "Merging two distinct titles to form a new one (e.g., 'Times' + 'Herald').",
        "Phonetic variations that sound identical to existing combinations."
      ]
    },
    {
      title: "Cross-Language Similarity",
      icon: <Languages className="text-purple-500 size-10" />,
      bg: "bg-purple-50 dark:bg-purple-900/20",
      border: "border-purple-100 dark:border-purple-800/30",
      innerBg: "bg-purple-50 dark:bg-purple-900/10",
      innerBorder: "border-purple-100 dark:border-purple-800/20",
      desc: "Verification checks extend across languages. A title registered in English cannot be simply translated or transliterated into another regional language if it conflicts.",
      points: [
        "Direct translations of protected titles (e.g., 'Times of India' to Hindi).",
        "Transliterations that sound the same but use different scripts.",
        "Regional variations that infringe on established brand identities."
      ]
    },
    {
      title: "Periodicity",
      icon: <Calendar className="text-emerald-500 size-10" />,
      bg: "bg-emerald-50 dark:bg-emerald-900/20",
      border: "border-emerald-100 dark:border-emerald-800/30",
      innerBg: "bg-emerald-50 dark:bg-emerald-900/10",
      innerBorder: "border-emerald-100 dark:border-emerald-800/20",
      desc: "The frequency of publication (periodicity) must be clearly defined and consistent with the title application.",
      points: [
        "Must specify Daily, Weekly, Fortnightly, Monthly, etc.",
        "Changes in periodicity require a fresh verification process.",
        "Title availability may vary based on the proposed periodicity in the same region."
      ]
    },
    {
      title: "Conceptual Themes",
      icon: <Lightbulb className="text-indigo-500 size-10" />,
      bg: "bg-indigo-50 dark:bg-indigo-900/20",
      border: "border-indigo-100 dark:border-indigo-800/30",
      innerBg: "bg-indigo-50 dark:bg-indigo-900/10",
      innerBorder: "border-indigo-100 dark:border-indigo-800/20",
      desc: "Titles must reflect the conceptual theme of the publication. Misalignment between the title and the content theme can lead to rejection.",
      points: [
        "Scientific journals must have titles reflecting scientific content.",
        "Political news outlets should avoid titles that suggest purely entertainment content.",
        "Specialized niche publications must have relevant descriptive titles."
      ]
    }
  ];

  return (
    <main className="flex flex-col items-center w-full">
      <section className="w-full max-w-[1280px] px-6 md:px-20 py-12 md:py-20 flex flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-4xl flex flex-col items-center text-center gap-6 mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider w-fit">
            <Gavel className="size-4" />
            Regulatory Compliance
          </div>
          <h1 className="text-slate-900 dark:text-white text-4xl md:text-5xl font-black leading-tight tracking-tight">
            Verification Guidelines & Rules
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-lg md:text-xl font-normal leading-relaxed max-w-[700px]">
            Review the mandatory criteria for title verification under the Press & Registration of Periodicals Act. Ensure your publication adheres to these standards to avoid rejection.
          </p>
        </motion.div>

        <div className="w-full max-w-4xl flex flex-col gap-8">
          {guidelines.map((item, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, scale: 0.9, y: 40 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card rounded-2xl p-8 md:p-10 flex flex-col md:flex-row gap-8 items-start"
            >
              <div className="flex-shrink-0">
                <div className={`w-16 h-16 rounded-xl ${item.bg} flex items-center justify-center border ${item.border}`}>
                  {item.icon}
                </div>
              </div>
              <div className="flex flex-col gap-4">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">{item.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  {item.desc}
                </p>
                <div className={`${item.innerBg} border ${item.innerBorder} rounded-lg p-4`}>
                  <ul className="list-disc list-inside space-y-2 text-sm text-slate-700 dark:text-slate-300">
                    {item.points.map((point, pIdx) => (
                      <li key={pIdx}>{point}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}
