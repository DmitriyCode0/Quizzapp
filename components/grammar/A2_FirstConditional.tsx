
import React from 'react';
import { useTranslation } from '../../hooks/useTranslation';

const A2_FirstConditional: React.FC = () => {
  const { language } = useTranslation();
  const isUkr = language === 'uk';

  const text = {
    intro: isUkr 
        ? "Перший умовний спосіб (First Conditional) — це структура, яку ми використовуємо, коли говоримо про можливості в сьогоденні або в майбутньому." 
        : "The First Conditional is a structure we use when talking about possibilities in the present or in the future.",
    intro2: isUkr 
        ? "Він описує ситуації, які є цілком реальними і можуть статися." 
        : "It describes situations that are very real and likely to happen.",

    // Core Concept
    coreTitle: isUkr ? "Основна концепція: «План А»" : "The Core Concept: \"Plan A\"",
    coreDesc: isUkr
        ? "First Conditional говорить про реальну можливість у майбутньому. Це не фантазія. Це причинно-наслідковий зв'язок."
        : "The First Conditional talks about a real possibility in the future. It is not a fantasy. It is a cause-and-effect relationship.",
    coreFormula: isUkr ? "\"Якщо станеться X, то Y станеться як результат.\"" : "\"If X happens, then Y will happen as a result.\"",
    
    // The Problem
    probTitle: isUkr ? "Українська проблема" : "The Ukrainian Problem",
    probDesc: isUkr
        ? "В українській мові, коли ви говорите про майбутню умову та результат, ви використовуєте майбутній час в **обох** частинах речення."
        : "In Ukrainian, when you talk about the future condition and result, you use the future tense in **both** parts of the sentence.",
    probEx: isUkr 
        ? "Українська думка: \"Якщо завтра * буде * гарна погода, ми *підемо* на пікнік.\" (Майбутній + Майбутній)"
        : "Ukrainian thought: \"Якщо завтра *буде* гарна погода, ми *підемо* на пікнік.\" (Future + Future)",

    // The Rule
    ruleTitle: isUkr ? "Англійське правило" : "The English Rule",
    ruleDesc: isUkr
        ? "Англійська суворіша. В англійській є золоте правило для умовних речень:"
        : "English is stricter. English has a golden rule for conditionals:",
    ruleGolden: isUkr 
        ? "Ви не можете використовувати майбутній час відразу після «If»."
        : "You cannot use future tense immediately after \"If\".",
    ruleExpl: isUkr
        ? "Навіть якщо ви говорите про завтра, ви повинні використовувати граматику **Present Simple** для частини з умовою."
        : "Even though you are talking about tomorrow, you must use **Present Simple** grammar for the condition part.",

    // Structure
    structTitle: isUkr ? "Будова (Structure)" : "The Structure",
    structDesc: isUkr ? "Умовне речення складається з двох частин:" : "A conditional sentence has two parts:",
    structP1: isUkr ? "1. Частина з «If» (Умова/Причина)" : "1. The \"If\" clause (The condition/cause)",
    structP2: isUkr ? "2. Головна частина (Результат/Наслідок)" : "2. The Main clause (The result/effect)",
    structFormula: isUkr ? "Ось формула. Запам'ятайте цей шаблон:" : "Here is the formula. Memorize this pattern:",
    
    thIf: isUkr ? "Частина «If» (Умова)" : "The \"If\" Clause (Condition)",
    thMain: isUkr ? "Головна частина (Результат)" : "The Main Clause (Result)",
    tdIfMeta: isUkr ? "(Граматично теперішній час, але значення майбутнього)" : "(Present Grammar, Future Meaning)",
    tdMainMeta: isUkr ? "(Майбутній простий час)" : "(Future Simple)",

    // Variations
    varTitle: isUkr ? "Важливі варіації" : "Important Variations",
    var1Title: isUkr ? "1. Зміна порядку" : "1. Changing the Order",
    var1Desc: isUkr 
        ? "Ви можете поміняти місцями дві половини речення. Значення не змінюється."
        : "You can swap the two halves of the sentence. The meaning does not change.",
    var1Comma: isUkr
        ? "Якщо ви починаєте з частини «If», потрібна кома. Якщо ви починаєте з результату, кома не потрібна."
        : "If you start with the \"If\" part, you need a comma. If you start with the result part, you do not need a comma.",
    
    var2Title: isUkr ? "2. \"IF\" проти \"WHEN\"" : "2. \"IF\" vs. \"WHEN\"",
    var2Desc: isUkr ? "Обидва слідують тим самим граматичним правилам, але рівень впевненості різний." : "Both follow the same grammar rules, but the level of certainty is different.",
    var2If: isUkr ? "Є сумнів. Можливо так, можливо ні (шанс 50/50)." : "There is a doubt. Maybe yes, maybe no (50/50 chance).",
    var2When: isUkr ? "Впевненість. Ви впевнені, що це станеться (шанс 100%)." : "Certainty. You are sure it will happen (100% chance).",

    var3Title: isUkr ? "3. Використання модальних дієслів замість \"Will\"" : "3. Using Modals instead of \"Will\"",
    var3Desc: isUkr 
        ? "Іноді результат не є чітким «will». Це може бути можливість або порада. У цьому випадку ви можете використовувати *can, might* або *should* у частині результату."
        : "Sometimes the result isn't a definite \"will\". It might be a possibility or advice. In this case, you can use *can, might,* or *should* in the result part.",

    // Mistake
    mistakeTitle: isUkr ? "Помилка №1 українських студентів" : "The #1 Mistake Ukrainian Speakers Make",
    mistakeDesc: isUkr
        ? "Це, мабуть, найпоширеніша граматична помилка, яку роблять носії слов'янських мов на середньому рівні."
        : "This is perhaps the most common grammar mistake made by Slavic speakers in intermediate English.",
    mistakeRule: isUkr ? "Не ставте \"will\" після \"If\"." : "Do not put \"will\" after \"If\".",
    mistakeExpl: isUkr
        ? "Оскільки ваш мозок перекладає прямо з української («Якщо я *буду* мати час...»), ви хочете сказати \"If I *will* have time...\". **Це неправильно в англійській.**"
        : "Because your brain translates directly from Ukrainian (\"Якщо я *буду* мати час...\"), you want to say \"If I *will* have time...\". **This is incorrect in English.**",
    mnemonicTitle: isUkr ? "Мнемонічне правило:" : "The Mnemonic Rule:",
    mnemonic: isUkr
        ? "Уявіть, що слово **«IF»** має алергію на слово **«WILL»**. Вони не можуть перебувати в одній кімнаті (в одній частині речення) разом."
        : "Imagine that the word **\"IF\"** is allergic to the word **\"WILL\"**. They cannot be in the same room (the same clause) together.",

    // Summary
    summaryTitle: isUkr ? "Підсумок" : "Summary",
    summaryIntro: isUkr ? "Коли говорите про реальну можливість у майбутньому:" : "When talking about a real future possibility:",
    sum1: isUkr ? "Умова починається з **IF**." : "The condition starts with **IF**.",
    sum2: isUkr ? "Дієслово відразу після IF має бути в **Present Simple** (навіть якщо означає майбутнє)." : "The verb immediately after IF must be **Present Simple** (even though it means future).",
    sum3: isUkr ? "Результат використовує **WILL** (або can/might/should)." : "The result uses **WILL** (or can/might/should).",
  };

  return (
    <div className="space-y-12 text-slate-700 dark:text-slate-300 leading-relaxed">
      
      {/* Intro */}
      <section>
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <p className="text-lg mb-2 text-slate-800 dark:text-slate-200">{text.intro}</p>
            <p className="text-lg font-medium text-slate-900 dark:text-white">{text.intro2}</p>
        </div>
      </section>

      {/* Core Concept */}
      <section className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{text.coreTitle}</h3>
          <p className="mb-4 text-slate-700 dark:text-slate-300">{text.coreDesc}</p>
          <div className="bg-indigo-50 dark:bg-indigo-900/30 p-4 rounded-lg border-l-4 border-indigo-500 dark:border-indigo-400 font-medium text-indigo-900 dark:text-indigo-200 italic">
              {text.coreFormula}
          </div>
      </section>

      {/* Problem vs Rule */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <section className="bg-rose-50 dark:bg-rose-900/20 p-6 rounded-xl border border-rose-100 dark:border-rose-800 shadow-sm">
              <h3 className="text-lg font-bold text-rose-800 dark:text-rose-300 mb-2">{text.probTitle}</h3>
              <p className="text-sm text-rose-900 dark:text-rose-100 mb-4">{text.probDesc}</p>
              <div className="bg-white dark:bg-slate-800 p-3 rounded border border-rose-100 dark:border-rose-800 text-sm italic text-slate-600 dark:text-slate-400">
                  {text.probEx}
              </div>
          </section>

          <section className="bg-emerald-50 dark:bg-emerald-900/20 p-6 rounded-xl border border-emerald-100 dark:border-emerald-800 shadow-sm">
              <h3 className="text-lg font-bold text-emerald-800 dark:text-emerald-300 mb-2">{text.ruleTitle}</h3>
              <p className="text-sm text-emerald-900 dark:text-emerald-100 mb-4">{text.ruleDesc}</p>
              <div className="bg-white dark:bg-slate-800 p-4 rounded border border-emerald-100 dark:border-emerald-800 shadow-sm">
                  <strong className="block text-emerald-700 dark:text-emerald-400 mb-1 uppercase text-xs tracking-bold">{isUkr ? "Золоте Правило" : "Golden Rule"}</strong>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{text.ruleGolden}</p>
              </div>
              <p className="text-xs text-emerald-800 dark:text-emerald-200 mt-3">{text.ruleExpl}</p>
          </section>
      </div>

      {/* Structure Table */}
      <section>
          <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-4">{text.structTitle}</h3>
          <p className="mb-4 text-slate-600 dark:text-slate-400">{text.structDesc}</p>
          <ul className="list-none space-y-1 mb-6 pl-4 border-l-2 border-slate-200 dark:border-slate-700">
              <li>{text.structP1}</li>
              <li>{text.structP2}</li>
          </ul>
          
          <p className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">{text.structFormula}</p>
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700">
                    <tr>
                        <th className="px-6 py-4 font-bold text-indigo-600 dark:text-indigo-400 w-1/2">{text.thIf}</th>
                        <th className="px-6 py-4 font-bold text-emerald-600 dark:text-emerald-400 w-1/2 border-l border-slate-200 dark:border-slate-700">{text.thMain}</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-slate-800 divide-y divide-slate-100 dark:divide-slate-700">
                    <tr>
                        <td className="px-6 py-4 align-top">
                            <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">If + Present Simple</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 italic">{text.tdIfMeta}</div>
                        </td>
                        <td className="px-6 py-4 border-l border-slate-100 dark:border-slate-700 align-top">
                            <div className="text-lg font-bold text-slate-900 dark:text-white mb-1">Subject + will + verb</div>
                            <div className="text-xs text-slate-400 dark:text-slate-500 italic">{text.tdMainMeta}</div>
                        </td>
                    </tr>
                </tbody>
            </table>
          </div>

          <div className="mt-6 space-y-3">
              <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex-1">
                      <span className="text-slate-900 dark:text-slate-100 text-lg"><strong className="text-indigo-600 dark:text-indigo-400">If</strong> it <strong className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-600">rains</strong> tomorrow,</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">(Якщо завтра піде дощ,)</p>
                  </div>
                  <div className="flex-1 md:border-l md:border-slate-100 dark:md:border-slate-700 md:pl-4">
                      <span className="text-slate-900 dark:text-slate-100 text-lg">I <strong className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-600">will stay</strong> at home.</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">(я залишуся вдома.)</p>
                  </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex-1">
                      <span className="text-slate-900 dark:text-slate-100 text-lg"><strong className="text-indigo-600 dark:text-indigo-400">If</strong> I <strong className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-600">have</strong> enough money,</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">(Якщо у мене буде достатньо грошей,)</p>
                  </div>
                  <div className="flex-1 md:border-l md:border-slate-100 dark:md:border-slate-700 md:pl-4">
                      <span className="text-slate-900 dark:text-slate-100 text-lg">I <strong className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-600">will buy</strong> a ticket.</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">(я куплю квиток.)</p>
                  </div>
              </div>
              <div className="flex flex-col md:flex-row gap-3 bg-white dark:bg-slate-800 p-4 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm">
                  <div className="flex-1">
                      <span className="text-slate-900 dark:text-slate-100 text-lg"><strong className="text-indigo-600 dark:text-indigo-400">If</strong> she <strong className="text-indigo-600 dark:text-indigo-400 underline decoration-indigo-300 dark:decoration-indigo-600">doesn't study</strong>,</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">(Якщо вона не буде вчитися,)</p>
                  </div>
                  <div className="flex-1 md:border-l md:border-slate-100 dark:md:border-slate-700 md:pl-4">
                      <span className="text-slate-900 dark:text-slate-100 text-lg">she <strong className="text-emerald-600 dark:text-emerald-400 underline decoration-emerald-300 dark:decoration-emerald-600">won't pass</strong> the exam.</span>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1">(вона не складе іспит.)</p>
                  </div>
              </div>
          </div>
      </section>

      {/* Variations */}
      <section className="space-y-6">
          <h3 className="text-xl font-bold text-slate-900 dark:text-white border-b border-slate-200 dark:border-slate-700 pb-2">{text.varTitle}</h3>
          
          {/* V1 */}
          <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{text.var1Title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{text.var1Desc} <br/> {text.var1Comma}</p>
              <div className="bg-slate-50 dark:bg-slate-700/50 p-3 rounded-lg border border-slate-200 dark:border-slate-600 text-sm font-mono text-slate-700 dark:text-slate-300">
                  [If I see him<strong className="text-rose-500 dark:text-rose-400 bg-rose-100 dark:bg-rose-900/50 px-1 rounded mx-0.5">,</strong>] [I will tell him.]
                  <br/>
                  [I will tell him] [if I see him.]
              </div>
          </div>

          {/* V2 */}
          <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{text.var2Title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{text.var2Desc}</p>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                      <span className="font-bold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-900/30 px-2 rounded">IF ({isUkr ? 'Якщо' : 'If'})</span>
                      <span>= {text.var2If}</span>
                  </li>
                  <li className="flex items-start gap-2">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-900/30 px-2 rounded">WHEN ({isUkr ? 'Коли' : 'When'})</span>
                      <span>= {text.var2When}</span>
                  </li>
              </ul>
          </div>

          {/* V3 */}
          <div>
              <h4 className="font-bold text-slate-800 dark:text-slate-200 mb-1">{text.var3Title}</h4>
              <p className="text-sm text-slate-600 dark:text-slate-300 mb-2">{text.var3Desc}</p>
              <ul className="space-y-2 text-sm text-slate-700 dark:text-slate-300">
                  <li>If you finish your homework, you <strong className="text-slate-900 dark:text-white">can</strong> watch TV. (Permission)</li>
                  <li>If the traffic is bad, I <strong className="text-slate-900 dark:text-white">might</strong> be late. (Possibility)</li>
                  <li>If you visit Lviv, you <strong className="text-slate-900 dark:text-white">should</strong> go to a coffee shop. (Advice)</li>
              </ul>
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
        <p className="mb-4 text-rose-900 dark:text-rose-100 font-medium text-sm">
            {text.mistakeDesc}
        </p>
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-rose-100 dark:border-rose-800 shadow-sm text-center mb-6">
            <strong className="text-lg text-rose-600 dark:text-rose-400">{text.mistakeRule}</strong>
        </div>
        <p className="text-sm text-rose-800 dark:text-rose-200 mb-4">{text.mistakeExpl}</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-rose-100 dark:border-rose-800 flex flex-col gap-1">
                <span className="font-bold text-rose-500 dark:text-rose-400 text-xs uppercase">WRONG (Direct Translation)</span>
                <span className="text-slate-400 dark:text-slate-500 line-through decoration-rose-400 dark:decoration-rose-500">If I <strong>will see</strong> him...</span>
                <span className="text-slate-400 dark:text-slate-500 line-through decoration-rose-400 dark:decoration-rose-500">If the weather <strong>will be</strong> good...</span>
            </div>
            <div className="bg-white dark:bg-slate-800 p-3 rounded border border-emerald-100 dark:border-emerald-800 flex flex-col gap-1">
                <span className="font-bold text-emerald-500 dark:text-emerald-400 text-xs uppercase">CORRECT (English Grammar)</span>
                <span className="text-slate-800 dark:text-slate-200">If I <strong>see</strong> him...</span>
                <span className="text-slate-800 dark:text-slate-200">If the weather <strong>is</strong> good...</span>
            </div>
        </div>

        <div className="mt-6 p-4 bg-rose-100/50 dark:bg-rose-900/30 rounded-lg border border-rose-100 dark:border-rose-800">
            <strong className="block text-rose-800 dark:text-rose-200 mb-1 text-xs uppercase tracking-wide">{text.mnemonicTitle}</strong>
            <p className="text-rose-900 dark:text-rose-100 text-sm italic">{text.mnemonic}</p>
        </div>
      </section>

      {/* Summary */}
      <section className="bg-gradient-to-br from-indigo-600 to-blue-600 p-8 rounded-2xl shadow-lg text-white">
        <h4 className="text-indigo-200 font-bold uppercase tracking-widest mb-4 text-xs">{text.summaryTitle}</h4>
        <p className="text-sm text-indigo-100 mb-4">{text.summaryIntro}</p>
        <ol className="list-decimal list-inside space-y-3 text-lg font-medium">
            <li dangerouslySetInnerHTML={{ __html: text.sum1.replace('IF', '<span class="bg-white/20 px-2 py-0.5 rounded">IF</span>') }}></li>
            <li dangerouslySetInnerHTML={{ __html: text.sum2.replace('Present Simple', '<span class="text-white underline decoration-2 underline-offset-4">Present Simple</span>') }}></li>
            <li dangerouslySetInnerHTML={{ __html: text.sum3.replace('WILL', '<span class="bg-white/20 px-2 py-0.5 rounded">WILL</span>') }}></li>
        </ol>
      </section>

    </div>
  );
};

export default A2_FirstConditional;
