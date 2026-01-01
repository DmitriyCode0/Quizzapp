
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const A1_PresentSimpleToDo: React.FC = () => {
  const { language } = useTranslation();
  const isUkr = language === 'uk';

  const text = {
    introTitle: isUkr ? "Чому це важко?" : "Why is it hard?",
    introDesc: isUkr 
        ? "В українській мові є лише один теперішній час. «Я працюю» може означати і професію (взагалі), і дію прямо зараз."
        : "In Ukrainian, there is only one present tense. \"Я працюю\" can mean both a profession (in general) and an action happening right now.",
    conflict: isUkr
        ? "Головний конфлікт: Ми звикли просто додавати «не» або змінювати інтонацію. В англійській з'являються помічники DO/DOES, які ламають цю логіку."
        : "The main conflict: You are used to simply adding \"not\" or changing intonation. English adds helper verbs DO/DOES, which break this logic.",
    
    metaphorTitle: isUkr ? "Метафора: Якір ⚓️" : "Metaphor: The Anchor ⚓️",
    metaphorDesc: isUkr
        ? "Уявіть, що Present Simple — це важкий якір. Він тримає корабель на одному місці. Це стабільність: ваше ім'я, робота, розклад автобуса, схід сонця."
        : "Imagine Present Simple as a heavy anchor. It holds the ship in one place. It represents stability: your name, job, bus schedule, sunrise.",
    goldenRule: isUkr
        ? "Використовуй Present Simple, коли кажеш про те, що відбувається РЕГУЛЯРНО, або про факти, які є правдою ЗАВЖДИ."
        : "Use Present Simple when talking about REGULAR actions or facts that are ALWAYS true.",
    
    tableTitle: isUkr ? "Таблиця: Структура" : "Structure Table",
    
    mistakeTitle: isUkr ? "Червоні прапорці (Помилки) 🚩" : "Red Flags (Mistakes) 🚩",
    mistake1: isUkr ? "1. Забуте -S" : "1. The Forgotten -S",
    mistake1Desc: isUkr ? "Ми кажемо «He work». Треба «He works»." : "We say 'He work'. Must be 'He works'.",
    mistake2: isUkr ? "2. Пряме заперечення" : "2. Direct Negation",
    mistake2Desc: isUkr ? "«I no work» — це неправильно. Потрібен охоронець: «I DON'T work»." : "'I no work' is wrong. You need a guard: 'I DON'T work'.",
    mistake3: isUkr ? "3. Дублювання -S" : "3. Double -S",
    mistake3Desc: isUkr ? "Коли приходить DOES, він «з’їдає» закінчення -s у дієслова." : "When DOES arrives, it 'eats' the -s ending of the main verb.",
    
    cheatsheetTitle: isUkr ? "Шпаргалка" : "Cheatsheet",
    tipTitle: isUkr ? "Порада від тьютора 💡" : "Tutor's Tip 💡",
    tipDesc: isUkr 
        ? "Це абсолютно нормально — забувати про закінчення -s на початку. Головне — навчитися «чути» цю помилку і виправляти себе."
        : "It is absolutely normal to forget the -s ending at the start. The main thing is to learn to 'hear' this mistake and correct yourself.",
  };

  return (
    <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed">
      
      {/* Intro Section */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">{text.introTitle}</h2>
          <p className="mb-4 text-lg">{text.introDesc}</p>
          <div className="bg-rose-50 dark:bg-rose-900/20 p-4 rounded-lg border-l-4 border-rose-500 dark:border-rose-400 text-rose-900 dark:text-rose-100 font-medium">
              {text.conflict}
          </div>
      </section>

      {/* Metaphor Section */}
      <section className="bg-indigo-50 dark:bg-indigo-900/20 p-8 rounded-2xl border border-indigo-100 dark:border-indigo-800 text-center">
          <div className="text-6xl mb-4">⚓️</div>
          <h3 className="text-2xl font-extrabold text-indigo-900 dark:text-indigo-200 mb-4">{text.metaphorTitle}</h3>
          <p className="text-lg text-indigo-800 dark:text-indigo-300 mb-6 max-w-2xl mx-auto">
              {text.metaphorDesc}
          </p>
          <div className="inline-block bg-white dark:bg-slate-900 px-6 py-3 rounded-xl shadow-sm border border-indigo-200 dark:border-indigo-700">
              <strong className="text-indigo-600 dark:text-indigo-400 uppercase text-xs tracking-widest block mb-1">Golden Rule</strong>
              <span className="font-bold text-slate-900 dark:text-white">{text.goldenRule}</span>
          </div>
      </section>

      {/* Structure Table */}
      <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">{text.tableTitle}</h3>
          
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="bg-slate-100 dark:bg-slate-900 text-xs uppercase text-slate-500 dark:text-slate-400">
                        <th className="p-4 border-b border-r border-slate-200 dark:border-slate-700 w-1/3">Type</th>
                        <th className="p-4 border-b border-r border-slate-200 dark:border-slate-700 w-1/3">I / You / We / They</th>
                        <th className="p-4 border-b border-slate-200 dark:border-slate-700 w-1/3 text-indigo-600 dark:text-indigo-400 font-bold">He / She / It (+S)</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 text-sm md:text-base">
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="p-4 border-r border-slate-100 dark:border-slate-700 font-bold text-emerald-600 dark:text-emerald-400">(+) Statement</td>
                        <td className="p-4 border-r border-slate-100 dark:border-slate-700">
                            I <strong className="text-slate-900 dark:text-white">work</strong> everyday.
                        </td>
                        <td className="p-4 bg-indigo-50/30 dark:bg-indigo-900/10">
                            She <strong className="text-indigo-600 dark:text-indigo-400">works</strong> everyday.
                        </td>
                    </tr>
                    <tr className="border-b border-slate-100 dark:border-slate-700">
                        <td className="p-4 border-r border-slate-100 dark:border-slate-700 font-bold text-rose-600 dark:text-rose-400">(-) Negative</td>
                        <td className="p-4 border-r border-slate-100 dark:border-slate-700">
                            I <strong className="text-rose-600 dark:text-rose-400">don't</strong> work.
                        </td>
                        <td className="p-4 bg-indigo-50/30 dark:bg-indigo-900/10">
                            She <strong className="text-rose-600 dark:text-rose-400">doesn't</strong> work.
                        </td>
                    </tr>
                    <tr>
                        <td className="p-4 border-r border-slate-100 dark:border-slate-700 font-bold text-amber-600 dark:text-amber-400">(?) Question</td>
                        <td className="p-4 border-r border-slate-100 dark:border-slate-700">
                            <strong className="text-amber-600 dark:text-amber-400">Do</strong> you work?
                        </td>
                        <td className="p-4 bg-indigo-50/30 dark:bg-indigo-900/10">
                            <strong className="text-amber-600 dark:text-amber-400">Does</strong> she work?
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>
      </section>

      {/* Red Flags */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold text-rose-600 dark:text-rose-400 mb-6 flex items-center gap-2">
              {text.mistakeTitle}
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                  <span className="text-4xl mb-2 block">😶</span>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{text.mistake1}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{text.mistake1Desc}</p>
                  <div className="text-xs bg-white dark:bg-slate-800 p-2 rounded text-center">
                      ❌ He work <br/> ✅ <strong>He works</strong>
                  </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                  <span className="text-4xl mb-2 block">🛑</span>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{text.mistake2}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{text.mistake2Desc}</p>
                  <div className="text-xs bg-white dark:bg-slate-800 p-2 rounded text-center">
                      ❌ I no work <br/> ✅ <strong>I don't work</strong>
                  </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700">
                  <span className="text-4xl mb-2 block">🐍</span>
                  <h4 className="font-bold text-slate-900 dark:text-white mb-2">{text.mistake3}</h4>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">{text.mistake3Desc}</p>
                  <div className="text-xs bg-white dark:bg-slate-800 p-2 rounded text-center">
                      ❌ Does she likes? <br/> ✅ <strong>Does she like?</strong>
                  </div>
              </div>
          </div>
      </section>

      {/* Cheatsheet Graphic */}
      <section className="bg-slate-900 text-slate-200 p-6 rounded-xl font-mono text-sm overflow-x-auto shadow-lg">
          <pre className="whitespace-pre mx-auto w-fit">
{`╔════════════════════════════════════════════════════════════╗
║                PRESENT SIMPLE: THE ROUTINE                 ║
╠════════════════════════════════════════════════════════════╣
║  WHEN? 📅 (Habits, Facts, Timetables)                      ║
║  Always, Usually, Often, Sometimes, Never, Every day       ║
╠════════════════════════════════════════════════════════════╣
║      I / You / We / They      ║       He / She / It        ║
║ ───────────────────────────── ║ ────────────────────────── ║
║  (+) Verb (work)              ║  (+) Verb + S (works)      ║
║  (-) don't + Verb             ║  (-) doesn't + Verb        ║
║  (?) Do ... + Verb?           ║  (?) Does ... + Verb?      ║
╚════════════════════════════════════════════════════════════╝
          ⚠️ DOES kills the -S ending! ⚠️`}
          </pre>
      </section>

      {/* Tutor Tip */}
      <section className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border-l-4 border-emerald-500 dark:border-emerald-400">
          <h4 className="font-bold text-emerald-800 dark:text-emerald-300 mb-2">{text.tipTitle}</h4>
          <p className="text-emerald-900 dark:text-emerald-200 italic">
              "{text.tipDesc}"
          </p>
      </section>

    </div>
  );
};

export default A1_PresentSimpleToDo;
