
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const B1_PastSimpleVsPresentPerfect: React.FC = () => {
  const { language } = useTranslation();
  const isUkr = language === 'uk';

  const text = {
    intro: isUkr 
        ? "Це, мабуть, найпоширеніша трудність для тих, хто вивчає англійську мову." 
        : "This is perhaps the most common difficulty for English learners whose native language is Ukrainian (or Russian).",
    rootHeader: isUkr 
        ? "Ось корінь проблеми:" 
        : "Here is the root of the problem:",
    rootDesc: isUkr 
        ? "В українській мові ви зазвичай використовуєте один минулий час для обох ситуацій:" 
        : "In Ukrainian, you generally use one past tense for both situations:",
    rootConclusion: isUkr
        ? "В українській обидва дієслова — це просто «минуле». Але англійська змушує вас робити вибір на основі одного важливого питання:"
        : "In Ukrainian, both verbs are just \"past.\" But English forces you to make a choice based on one crucial question:",
    rootQuestion: isUkr
        ? "Чи пов'язана дія з теперішнім моментом, чи це повністю історія?"
        : "Is the action connected to the present moment, or is it completely history?",
    
    // Past Simple
    psMeta: isUkr 
        ? "Уявіть Past Simple як **Історію**. Це завершена дія в завершеному проміжку часу. Вона не має зв'язку з «зараз»." 
        : "Think of Past Simple as **History**. It is a finished action in a finished time period. It has no connection to \"now.\"",
    psRule: isUkr
        ? "Якщо ви кажете, *коли* саме щось сталося в минулому, ви МУСИТЕ використовувати Past Simple."
        : "If you say *when* exactly something happened in the past, you MUST use Past Simple.",
    psConceptTitle: isUkr ? "Ключова концепція: Закритий час 📦" : "Key Concept: Closed Time 📦",
    psConceptDesc: isUkr
        ? "Уявіть коробку з написом «Вчора» або «2023». Ви кладете дію всередину, закриваєте коробку і ставите її на полицю. Це зроблено."
        : "Imagine a box labeled \"Yesterday\" or \"2023.\" You put the action inside, close the box, and put it on a shelf. It’s done.",
    keywords: isUkr ? "Ключові слова (Маркери):" : "Keywords (Markers):",
    examples: isUkr ? "Приклади:" : "Examples:",

    // Present Perfect
    ppIntro: isUkr
        ? "Це найскладніша частина, тому що цього часу фактично немає у вашій граматиці."
        : "This is the hardest part for Ukrainians because it doesn't really exist in your grammar.",
    ppMeta: isUkr
        ? "Уявіть Present Perfect як **Міст 🌉**. Він з'єднує минулу дію з теперішнім моментом."
        : "Think of Present Perfect as a **Bridge 🌉**. It connects the past action to the present moment.",
    ppRule: isUkr
        ? "Якщо дія впливає на теперішню ситуацію, використовуйте Present Perfect."
        : "If the action affects the present situation, use Present Perfect.",
    ppConceptTitle: isUkr ? "Ключова концепція: Відкритий час 🕳️" : "Key Concept: Open Time 🕳️",
    ppConceptDesc: isUkr
        ? "Уявіть коробку з написом «Моє життя досі» або «Сьогодні». Коробка все ще відкрита. Ви все ще можете додавати туди речі."
        : "Imagine a box labeled \"My Life So Far\" or \"Today.\" The box is still open. You can still add things to it.",

    // Table
    tableTitle: isUkr ? "Порівняльна таблиця" : "The Ultimate Comparison Table",
    thScenario: isUkr ? "Сценарій" : "Scenario",
    thPs: isUkr ? "Past Simple (Історія)" : "Past Simple (History)",
    thPp: isUkr ? "Present Perfect (Результат зараз)" : "Present Perfect (Result Now)",
    
    scLosing: isUkr ? "Втрата ключів" : "Losing keys",
    explLosingPs: isUkr ? "Я загубив їх вчора. Можливо, знайшов пізніше. Історія." : "I lost them yesterday. Maybe I found them later. History.",
    explLosingPp: isUkr ? "У мене ЗАРАЗ немає ключів. Я не можу увійти. Актуальна проблема." : "I don't have my keys RIGHT NOW. I can't get in. Current problem.",
    
    scEating: isUkr ? "Їжа" : "Eating",
    explEatingPs: isUkr ? "Обід закінчився. Просто факт." : "Lunchtime is over. Just a fact.",
    explEatingPp: isUkr ? "Мій живіт болить ЗАРАЗ." : "My stomach hurts RIGHT NOW.",

    scExp: isUkr ? "Досвід" : "Experience",
    explExpPs: isUkr ? "Конкретна завершена поїздка." : "Specific finished trip.",
    explExpPp: isUkr ? "Життєвий досвід на цей момент." : "Life experience up to now.",

    // Mistake
    mistakeTitle: isUkr ? "Помилка №1 українських студентів" : "The #1 Mistake Ukrainian Speakers Make",
    mistakeDesc: isUkr 
        ? "Не змішуйте конкретні маркери минулого часу з Present Perfect. Для носія мови це звучить дуже неправильно."
        : "Do not mix specific past time markers with Present Perfect. This sounds very wrong to a native speaker.",
    
    // Summary
    summaryTitle: isUkr ? "Підсумок" : "Summary for a Ukrainian speaker",
    summaryIf: isUkr ? "Якщо ви можете запитати" : "If you can ask",
    summaryWhen: isUkr ? "\"Коли саме це сталося?\"" : "\"When exactly did it happen?\"",
    summaryDate: isUkr ? "і назвати дату" : "and give a date",
    summaryResult: isUkr ? "Якщо час не важливий, але" : "If the time doesn't matter, but the",
    summaryResultEnd: isUkr ? "результат важливий зараз" : "result matters now",

    downloadCheatsheet: isUkr ? "Завантажити шпаргалку" : "Download Cheatsheet",
  };

  return (
    <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed">
      
      {/* Intro */}
      <section>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="mb-4 text-lg text-slate-800 dark:text-slate-200">
                {text.intro}
            </p>
            <h3 className="font-bold text-slate-900 dark:text-white text-lg mb-2">{text.rootHeader}</h3>
            <p className="mb-4 text-slate-700 dark:text-slate-300">
                {text.rootDesc}
            </p>
            <ul className="list-disc list-inside space-y-3 ml-4 text-slate-700 dark:text-slate-300 mb-6 bg-slate-50 dark:bg-slate-700/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700">
                <li>"Я купив машину вчора." <span className="text-blue-600 dark:text-blue-400 font-bold bg-blue-50 dark:bg-blue-900/30 px-2 py-0.5 rounded">(Past Simple)</span></li>
                <li>"Я вже купив машину." <span className="text-amber-600 dark:text-amber-400 font-bold bg-amber-50 dark:bg-amber-900/30 px-2 py-0.5 rounded">(Present Perfect)</span></li>
            </ul>
            <p className="text-slate-700 dark:text-slate-300">
                {text.rootConclusion} 
                <br/>
                <strong className="text-slate-900 dark:text-white block mt-4 border-l-4 border-indigo-500 dark:border-indigo-400 pl-4 py-2 bg-indigo-50 dark:bg-indigo-900/30 text-lg shadow-sm">
                    {text.rootQuestion}
                </strong>
            </p>
        </div>
      </section>

      {/* Infographic Placeholder */}
      <div className="w-full flex flex-col items-center gap-4">
         <img 
            src="/infographics/past_vs_perfect.jpg" 
            alt="Past Simple vs Present Perfect Timeline" 
            className="rounded-xl shadow-lg max-w-full h-auto border border-slate-200 dark:border-slate-700"
            onError={(e) => {
                e.currentTarget.style.display = 'none';
            }}
         />
         <a 
            href="/infographics/past_vs_perfect.jpg" 
            download="PastSimple_vs_PresentPerfect_Cheatsheet.jpg"
            className="flex items-center gap-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg font-semibold transition-all shadow-sm hover:shadow group"
         >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-indigo-500 dark:text-indigo-400 group-hover:text-indigo-600 dark:group-hover:text-indigo-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            {text.downloadCheatsheet}
         </a>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Past Simple */}
          <section className="flex flex-col h-full">
            <div className="border-b-4 border-blue-500 dark:border-blue-400 pb-3 mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">1. Past Simple</h2>
                <span className="text-blue-600 dark:text-blue-400 text-sm font-bold uppercase tracking-wider">Минулий простий</span>
            </div>
            
            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-grow flex flex-col gap-4">
                <p className="text-slate-700 dark:text-slate-300" dangerouslySetInnerHTML={{ 
                    __html: text.psMeta.replace('**', '<strong class="text-slate-900 dark:text-white bg-blue-50 dark:bg-blue-900/30 px-1 rounded">').replace('**', '</strong>') 
                }} />
                
                <div className="bg-blue-50 dark:bg-blue-900/30 p-4 rounded-lg border border-blue-100 dark:border-blue-800 text-sm text-blue-900 dark:text-blue-100">
                    <strong className="text-blue-700 dark:text-blue-300 block mb-1 uppercase text-xs tracking-bold">{isUkr ? "Золоте правило:" : "The Golden Rule:"}</strong>
                    {text.psRule}
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">{text.psConceptTitle}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {text.psConceptDesc}
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{text.keywords}</h4>
                    <ul className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 dark:bg-blue-500 rounded-full"></span>Yesterday (вчора)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 dark:bg-blue-500 rounded-full"></span>Last week / year</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 dark:bg-blue-500 rounded-full"></span>In 2010 / in September</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-blue-400 dark:bg-blue-500 rounded-full"></span>When I was a child...</li>
                    </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">{text.examples}</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <span className="block text-slate-900 dark:text-white">I <strong>bought</strong> a new car <strong>yesterday</strong>.</span>
                            <span className="text-slate-500 dark:text-slate-400 italic mt-1 block">Я купив нову машину вчора.</span>
                        </li>
                        <li className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border-l-4 border-blue-500 dark:border-blue-400">
                            <span className="block text-slate-900 dark:text-white">I <strong>lived</strong> in Kyiv for 5 years <strong>when I was a student</strong>.</span>
                            <span className="text-slate-500 dark:text-slate-400 italic mt-1 block">Я жив у Києві 5 років, коли був студентом.</span>
                        </li>
                    </ul>
                </div>
            </div>
          </section>

          {/* Present Perfect */}
          <section className="flex flex-col h-full">
            <div className="border-b-4 border-amber-500 dark:border-amber-400 pb-3 mb-4">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">2. Present Perfect</h2>
                <span className="text-amber-600 dark:text-amber-400 text-sm font-bold uppercase tracking-wider">Теперішній доконаний</span>
            </div>

            <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm flex-grow flex flex-col gap-4">
                <p className="text-slate-700 dark:text-slate-300">
                    {text.ppIntro}
                    <br />
                    <span className="block mt-2" dangerouslySetInnerHTML={{ 
                        __html: text.ppMeta.replace('**', '<strong class="text-slate-900 dark:text-white bg-amber-50 dark:bg-amber-900/30 px-1 rounded">').replace('**', '</strong>') 
                    }} />
                </p>
                
                <div className="bg-amber-50 dark:bg-amber-900/30 p-4 rounded-lg border border-amber-100 dark:border-amber-800 text-sm text-amber-900 dark:text-amber-200">
                    <strong className="text-amber-700 dark:text-amber-300 block mb-1 uppercase text-xs tracking-bold">{isUkr ? "Золоте правило:" : "The Golden Rule:"}</strong>
                    {text.ppRule}
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">{text.ppConceptTitle}</h4>
                    <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                        {text.ppConceptDesc}
                    </p>
                </div>

                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white mb-2">{text.keywords}</h4>
                    <ul className="grid grid-cols-1 gap-2 text-sm text-slate-600 dark:text-slate-300">
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 dark:bg-amber-500 rounded-full"></span>Already (вже) / Yet (ще ні)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 dark:bg-amber-500 rounded-full"></span>Just (щойно)</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 dark:bg-amber-500 rounded-full"></span>Ever / Never</li>
                        <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-amber-400 dark:bg-amber-500 rounded-full"></span>Recently / lately</li>
                    </ul>
                </div>

                <div className="mt-auto pt-4 border-t border-slate-100 dark:border-slate-700">
                    <h4 className="font-bold text-slate-900 dark:text-white mb-3">{text.examples}</h4>
                    <ul className="space-y-3 text-sm">
                        <li className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border-l-4 border-amber-500 dark:border-amber-400">
                            <span className="block text-slate-900 dark:text-white">I <strong>have bought</strong> a new car! (Look at it!)</span>
                            <span className="text-slate-500 dark:text-slate-400 italic mt-1 block">Я купив нову машину!</span>
                        </li>
                        <li className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border-l-4 border-amber-500 dark:border-amber-400">
                            <span className="block text-slate-900 dark:text-white">I <strong>have lived</strong> in Kyiv for 5 years.</span>
                            <span className="text-slate-500 dark:text-slate-400 italic mt-1 block">Я живу у Києві вже 5 років. (Continuing)</span>
                        </li>
                    </ul>
                </div>
            </div>
          </section>
      </div>

      {/* Comparison Table */}
      <section className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="bg-slate-50 dark:bg-slate-700/50 p-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 text-center">{text.tableTitle}</h3>
        </div>
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-6 py-4 font-bold text-slate-700 dark:text-slate-300">{text.thScenario}</th>
                        <th className="px-6 py-4 text-blue-600 dark:text-blue-400 font-bold border-l border-slate-200 dark:border-slate-700 w-1/3">{text.thPs}</th>
                        <th className="px-6 py-4 text-amber-600 dark:text-amber-400 font-bold border-l border-slate-200 dark:border-slate-700 w-1/3">{text.thPp}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-800 dark:text-slate-200 align-top">{text.scLosing}</td>
                        <td className="px-6 py-5 border-l border-slate-100 dark:border-slate-700 align-top">
                            <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">"I <strong className="text-blue-600 dark:text-blue-400">lost</strong> my keys yesterday."</div>
                            <div className="text-slate-400 dark:text-slate-500 italic text-xs mb-2">(Я загубив ключі вчора.)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded">{text.explLosingPs}</div>
                        </td>
                        <td className="px-6 py-5 border-l border-slate-100 dark:border-slate-700 align-top">
                            <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">"I <strong className="text-amber-600 dark:text-amber-400">have lost</strong> my keys."</div>
                            <div className="text-slate-400 dark:text-slate-500 italic text-xs mb-2">(Я загубив ключі.)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded">{text.explLosingPp}</div>
                        </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-800 dark:text-slate-200 align-top">{text.scEating}</td>
                        <td className="px-6 py-5 border-l border-slate-100 dark:border-slate-700 align-top">
                            <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">"I <strong className="text-blue-600 dark:text-blue-400">ate</strong> too much lunch."</div>
                            <div className="text-slate-400 dark:text-slate-500 italic text-xs mb-2">(Я з'їв забагато на обід.)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded">{text.explEatingPs}</div>
                        </td>
                        <td className="px-6 py-5 border-l border-slate-100 dark:border-slate-700 align-top">
                            <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">"I <strong className="text-amber-600 dark:text-amber-400">have eaten</strong> too much."</div>
                            <div className="text-slate-400 dark:text-slate-500 italic text-xs mb-2">(Я переїв.)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded">{text.explEatingPp}</div>
                        </td>
                    </tr>
                    <tr className="hover:bg-slate-50/50 dark:hover:bg-slate-800/50 transition-colors">
                        <td className="px-6 py-5 font-bold text-slate-800 dark:text-slate-200 align-top">{text.scExp}</td>
                        <td className="px-6 py-5 border-l border-slate-100 dark:border-slate-700 align-top">
                            <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">"Did you go to France <strong className="text-blue-600 dark:text-blue-400">in 2019</strong>?"</div>
                            <div className="text-slate-400 dark:text-slate-500 italic text-xs mb-2">(Ти їздив до Франції у 2019?)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded">{text.explExpPs}</div>
                        </td>
                        <td className="px-6 py-5 border-l border-slate-100 dark:border-slate-700 align-top">
                            <div className="font-medium text-slate-800 dark:text-slate-200 mb-1">"<strong className="text-amber-600 dark:text-amber-400">Have</strong> you <strong className="text-amber-600 dark:text-amber-400">ever been</strong> to France?"</div>
                            <div className="text-slate-400 dark:text-slate-500 italic text-xs mb-2">(Ти коли-небудь бував у Франції?)</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed bg-slate-50 dark:bg-slate-800/50 p-2 rounded">{text.explExpPp}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
      </section>

      {/* The #1 Mistake */}
      <section className="bg-rose-50 dark:bg-rose-900/20 border border-rose-100 dark:border-rose-800 rounded-xl p-6 md:p-8 shadow-sm">
        <h3 className="text-xl font-bold text-rose-700 dark:text-rose-300 mb-4 flex items-center gap-3">
            <span className="bg-white dark:bg-slate-800 p-1.5 rounded-full shadow-sm border border-rose-100 dark:border-rose-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </span>
            {text.mistakeTitle}
        </h3>
        <p className="mb-6 text-rose-900 dark:text-rose-200 font-medium">
            {text.mistakeDesc}
        </p>
        <div className="space-y-3 bg-white dark:bg-slate-800 p-5 rounded-xl border border-rose-100 dark:border-rose-800 shadow-sm">
            <div className="flex items-start gap-3 text-rose-600 dark:text-rose-400 pb-3 border-b border-slate-100 dark:border-slate-700">
                <span className="font-bold text-lg mt-0.5">✕</span>
                <div>
                    <span className="font-bold text-xs uppercase tracking-wide block text-rose-400 dark:text-rose-400 mb-1">WRONG</span>
                    <span className="text-lg text-slate-900 dark:text-white">I <span className="underline decoration-rose-400 dark:decoration-rose-500 decoration-2 font-bold">have seen</span> this movie yesterday.</span>
                    <div className="text-sm text-slate-400 dark:text-slate-500 italic mt-1">(Я бачив цей фільм вчора.)</div>
                </div>
            </div>
            <div className="flex items-start gap-3 text-emerald-600 dark:text-emerald-400 pt-2">
                <span className="font-bold text-lg mt-0.5">✓</span>
                <div>
                    <span className="font-bold text-xs uppercase tracking-wide block text-emerald-400 mb-1">CORRECT (Past Simple)</span>
                    <span className="text-lg text-slate-900 dark:text-white">I <strong>saw</strong> this movie <strong>yesterday</strong>.</span>
                </div>
            </div>
            <div className="flex items-start gap-3 text-emerald-600 dark:text-emerald-400">
                <span className="font-bold text-lg mt-0.5">✓</span>
                <div>
                    <span className="font-bold text-xs uppercase tracking-wide block text-emerald-400 mb-1">CORRECT (Present Perfect)</span>
                    <span className="text-lg text-slate-900 dark:text-white">I <strong>have</strong> already <strong>seen</strong> this movie.</span>
                </div>
            </div>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-br from-indigo-600 to-blue-600 p-8 rounded-2xl shadow-lg text-center text-white">
        <h4 className="text-indigo-200 font-bold uppercase tracking-widest mb-4 text-xs">{text.summaryTitle}</h4>
        <p className="text-xl leading-relaxed font-medium">
            {text.summaryIf} <strong className="text-blue-200 dark:text-blue-100 border-b border-blue-400/50 dark:border-blue-300/50">{text.summaryWhen}</strong> {text.summaryDate}, {isUkr ? 'використовуйте' : 'use'} <strong className="bg-white/10 px-2 rounded">Past Simple</strong>.
            <br className="hidden md:block" />
            <span className="block mt-2">
            {text.summaryResult} <strong className="text-amber-200 dark:text-amber-100 border-b border-amber-400/50 dark:border-amber-300/50">{text.summaryResultEnd}</strong>, {isUkr ? 'використовуйте' : 'use'} <strong className="bg-white/10 px-2 rounded">Present Perfect</strong>.
            </span>
        </p>
      </section>

    </div>
  );
};

export default B1_PastSimpleVsPresentPerfect;
