
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const A1_ThisThatTheseThose: React.FC = () => {
  const { language } = useTranslation();
  const isUkr = language === 'uk';

  const text = {
    intro: isUkr 
        ? "Ці чотири слова (This, That, These, Those) — це \"вказівні пальці\" в англійській мові. Вони допомагають нам вказати на предмет чи людей." 
        : "These four words (This, That, These, Those) are the \"pointing fingers\" of the English language. They help us point at objects or people.",
    
    questionsTitle: isUkr ? "Два простих питання" : "Two Simple Questions",
    q1: isUkr ? "1. Скільки? (Один чи багато?)" : "1. How many? (One or many?)",
    q2: isUkr ? "2. Де? (Близько чи далеко?)" : "2. Where? (Near or far?)",
    
    ruleTitle: isUkr ? "Головне правило" : "The Golden Rule",
    ruleDesc: isUkr ? "Уявіть собі відстань витягнутої руки." : "Imagine the distance of an arm's reach.",
    ruleNear: isUkr ? "Якщо ви можете торкнутися предмета рукою — це БЛИЗЬКО (NEAR)." : "If you can touch the object with your hand — it is NEAR.",
    ruleFar: isUkr ? "Якщо вам потрібно вказати пальцем через кімнату або на вулиці — це ДАЛЕКО (FAR)." : "If you need to point your finger across the room or down the street — it is FAR.",

    // Singular
    singTitle: isUkr ? "1. Однина (Один предмет)" : "1. Singular (One item)",
    thisTitle: "THIS",
    thisDesc: isUkr ? "Цей / Ця / Це (Близько)" : "This (Near)",
    thisExpl: isUkr ? "Використовуємо, коли предмет один і він тут, біля нас (ми можемо його торкнутися)." : "Use when there is one object and it is here, near us (we can touch it).",
    thisPron: isUkr ? "Вимова: [ðɪs] (короткий \"і\")" : "Pronunciation: [ðɪs] (short \"i\")",
    thisEx1: isUkr ? "(Тримаю в руці телефон) This is my phone. — Це мій телефон." : "(Holding phone) This is my phone.",
    thisEx2: isUkr ? "(Стою біля машини і торкаюся її) I like this car. — Мені подобається ця машина." : "(Touching a car) I like this car.",

    thatTitle: "THAT",
    thatDesc: isUkr ? "Той / Та / Те (Далеко)" : "That (Far)",
    thatExpl: isUkr ? "Використовуємо, коли предмет один, але він там, далеко від нас (треба вказувати пальцем)." : "Use when there is one object, but it is there, far from us (need to point).",
    thatEx1: isUkr ? "(Вказую на будинок через дорогу) That is my house. — Ото мій будинок." : "(Pointing at house across street) That is my house.",
    thatEx2: isUkr ? "(Дивлюся на літак у небі) Look at that plane! — Подивись на той літак!" : "(Looking at plane in sky) Look at that plane!",

    // Plural
    plurTitle: isUkr ? "2. Множина (Багато предметів)" : "2. Plural (Many items)",
    theseTitle: "THESE",
    theseDesc: isUkr ? "Ці (Близько)" : "These (Near)",
    theseExpl: isUkr ? "Використовуємо, коли предметів багато і вони тут, біля нас." : "Use when there are many objects and they are here, near us.",
    thesePron: isUkr ? "Вимова!: [ðiːz] (Дуже важливо: тут довгий звук \"і-і-і\" і в кінці чіткий звук \"з\". Не плутайте з коротким this)." : "Pronunciation!: [ðiːz] (Very important: long \"ee\" sound and clear \"z\" at the end. Don't confuse with short 'this').",
    theseEx1: isUkr ? "(Тримаю купу ключів у руці) These are my keys. — Це мої ключі." : "(Holding keys) These are my keys.",
    theseEx2: isUkr ? "(Дивлюся на свої нові туфлі на ногах) I love these shoes. — Я обожнюю ці туфлі." : "(Looking at shoes on feet) I love these shoes.",

    thoseTitle: "THOSE",
    thoseDesc: isUkr ? "Ті (Далеко)" : "Those (Far)",
    thoseExpl: isUkr ? "Використовуємо, коли предметів багато і вони там, далеко." : "Use when there are many objects and they are there, far away.",
    thoseEx1: isUkr ? "(Вказую на дітей на майданчику) Those are my children. — Ото мої діти." : "(Pointing at children) Those are my children.",
    thoseEx2: isUkr ? "(Вказую на птахів у небі) Look at those birds. — Подивись на тих пташок." : "(Pointing at birds) Look at those birds.",

    // Table
    tableTitle: isUkr ? "Підсумкова таблиця" : "Summary Table",
    colOne: isUkr ? "ОДИН (Singular)" : "ONE (Singular)",
    colMany: isUkr ? "БАГАТО (Plural)" : "MANY (Plural)",
    rowNear: isUkr ? "БЛИЗЬКО (Тут)" : "NEAR (Here)",
    rowFar: isUkr ? "ДАЛЕКО (Там)" : "FAR (There)",

    // Mistake
    mistakeTitle: isUkr ? "Типова помилка початківців" : "Common Beginner Mistake",
    mistakeDesc: isUkr ? "Плутати вимову This (короткий \"ис\") і These (довгий \"іііз\")." : "Confusing the pronunciation of This (short \"i\") and These (long \"ee\").",
    mistakeEx1: isUkr ? "I like this book. (Я люблю цю книгу — одну)." : "I like this book. (One book).",
    mistakeEx2: isUkr ? "I like these books. (Я люблю ці книги — багато)." : "I like these books. (Many books).",
  };

  return (
    <div className="space-y-10 text-slate-700 dark:text-slate-300 leading-relaxed">
      
      {/* Intro */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <p className="text-lg mb-4 text-slate-900 dark:text-slate-100">{text.intro}</p>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400">
              <h4 className="font-bold text-indigo-900 dark:text-indigo-200 mb-2">{text.questionsTitle}</h4>
              <ul className="space-y-1 text-indigo-800 dark:text-indigo-300 font-medium">
                  <li>{text.q1}</li>
                  <li>{text.q2}</li>
              </ul>
          </div>
      </section>

      {/* The Rule */}
      <section className="bg-amber-50 dark:bg-amber-900/20 p-6 rounded-xl border border-amber-100 dark:border-amber-800 shadow-sm">
          <h3 className="text-lg font-bold text-amber-800 dark:text-amber-200 mb-2 flex items-center gap-2">
              <span className="text-2xl">📏</span> {text.ruleTitle}
          </h3>
          <p className="text-amber-900 dark:text-amber-100 font-medium mb-3">{text.ruleDesc}</p>
          <ul className="space-y-2 text-sm text-amber-800 dark:text-amber-300">
              <li className="flex items-start gap-2">
                  <span>👇</span>
                  <span>{text.ruleNear}</span>
              </li>
              <li className="flex items-start gap-2">
                  <span>👉</span>
                  <span>{text.ruleFar}</span>
              </li>
          </ul>
      </section>

      {/* Singular */}
      <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">{text.singTitle}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* THIS */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                      <h4 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{text.thisTitle}</h4>
                      <span className="text-xs font-bold uppercase bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded">👇 Near</span>
                  </div>
                  <p className="text-emerald-900 dark:text-emerald-100 font-medium mb-2">{text.thisDesc}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{text.thisExpl}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300 font-mono bg-emerald-100/50 dark:bg-emerald-900/30 p-1.5 rounded mb-4">{text.thisPron}</p>
                  <ul className="mt-auto space-y-2 text-sm text-emerald-800 dark:text-emerald-200 italic">
                      <li>• {text.thisEx1}</li>
                      <li>• {text.thisEx2}</li>
                  </ul>
              </div>

              {/* THAT */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                      <h4 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">{text.thatTitle}</h4>
                      <span className="text-xs font-bold uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">👉 Far</span>
                  </div>
                  <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">{text.thatDesc}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{text.thatExpl}</p>
                  <ul className="mt-auto space-y-2 text-sm text-blue-800 dark:text-blue-200 italic">
                      <li>• {text.thatEx1}</li>
                      <li>• {text.thatEx2}</li>
                  </ul>
              </div>
          </div>
      </section>

      {/* Plural */}
      <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-6 border-b border-slate-200 dark:border-slate-700 pb-2">{text.plurTitle}</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* THESE */}
              <div className="bg-emerald-50 dark:bg-emerald-900/20 p-5 rounded-xl border border-emerald-100 dark:border-emerald-800 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                      <h4 className="text-2xl font-extrabold text-emerald-700 dark:text-emerald-400">{text.theseTitle}</h4>
                      <span className="text-xs font-bold uppercase bg-emerald-100 dark:bg-emerald-900/50 text-emerald-800 dark:text-emerald-200 px-2 py-1 rounded">👇👇 Near</span>
                  </div>
                  <p className="text-emerald-900 dark:text-emerald-100 font-medium mb-2">{text.theseDesc}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{text.theseExpl}</p>
                  <p className="text-xs text-emerald-600 dark:text-emerald-300 font-mono bg-emerald-100/50 dark:bg-emerald-900/30 p-1.5 rounded mb-4">{text.thesePron}</p>
                  <ul className="mt-auto space-y-2 text-sm text-emerald-800 dark:text-emerald-200 italic">
                      <li>• {text.theseEx1}</li>
                      <li>• {text.theseEx2}</li>
                  </ul>
              </div>

              {/* THOSE */}
              <div className="bg-blue-50 dark:bg-blue-900/20 p-5 rounded-xl border border-blue-100 dark:border-blue-800 flex flex-col h-full">
                  <div className="flex justify-between items-start mb-2">
                      <h4 className="text-2xl font-extrabold text-blue-700 dark:text-blue-400">{text.thoseTitle}</h4>
                      <span className="text-xs font-bold uppercase bg-blue-100 dark:bg-blue-900/50 text-blue-800 dark:text-blue-200 px-2 py-1 rounded">👉👉 Far</span>
                  </div>
                  <p className="text-blue-900 dark:text-blue-100 font-medium mb-2">{text.thoseDesc}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-300 mb-3">{text.thoseExpl}</p>
                  <ul className="mt-auto space-y-2 text-sm text-blue-800 dark:text-blue-200 italic">
                      <li>• {text.thoseEx1}</li>
                      <li>• {text.thoseEx2}</li>
                  </ul>
              </div>
          </div>
      </section>

      {/* Summary Table */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 text-center uppercase tracking-wider">{text.tableTitle}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-center">
                <thead className="bg-slate-50 dark:bg-slate-900 text-xs text-slate-500 dark:text-slate-400 uppercase">
                    <tr>
                        <th className="px-6 py-4 border-b border-r border-slate-200 dark:border-slate-700"></th>
                        <th className="px-6 py-4 border-b border-r border-slate-200 dark:border-slate-700 w-1/2">{text.colOne}</th>
                        <th className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 w-1/2">{text.colMany}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr>
                        <td className="px-4 py-6 font-bold text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">{text.rowNear} 👇</td>
                        <td className="px-4 py-6 border-r border-slate-100 dark:border-slate-700 bg-emerald-50/50 dark:bg-emerald-900/10">
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">THIS</span>
                            <span className="text-xs text-emerald-800 dark:text-emerald-300">{text.thisDesc}</span>
                        </td>
                        <td className="px-4 py-6 bg-emerald-50/50 dark:bg-emerald-900/10">
                            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 block">THESE</span>
                            <span className="text-xs text-emerald-800 dark:text-emerald-300">{text.theseDesc}</span>
                        </td>
                    </tr>
                    <tr>
                        <td className="px-4 py-6 font-bold text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700">{text.rowFar} 👉</td>
                        <td className="px-4 py-6 border-r border-slate-100 dark:border-slate-700 bg-blue-50/50 dark:bg-blue-900/10">
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">THAT</span>
                            <span className="text-xs text-blue-800 dark:text-blue-300">{text.thatDesc}</span>
                        </td>
                        <td className="px-4 py-6 bg-blue-50/50 dark:bg-blue-900/10">
                            <span className="text-2xl font-black text-blue-600 dark:text-blue-400 block">THOSE</span>
                            <span className="text-xs text-blue-800 dark:text-blue-300">{text.thoseDesc}</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </section>

      {/* Common Mistake */}
      <section className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-6 shadow-sm">
        <h3 className="text-lg font-bold text-rose-700 dark:text-rose-300 mb-2 flex items-center gap-2">
            ⚠️ {text.mistakeTitle}
        </h3>
        <p className="text-rose-900 dark:text-rose-100 mb-4">{text.mistakeDesc}</p>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-rose-100 dark:border-rose-800 space-y-2 text-sm text-slate-700 dark:text-slate-300">
            <p>🔊 <strong>This</strong> [ðɪs] — {text.mistakeEx1}</p>
            <p>🔊 <strong>These</strong> [ðiːz] — {text.mistakeEx2}</p>
        </div>
      </section>

    </div>
  );
};

export default A1_ThisThatTheseThose;
