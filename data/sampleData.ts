
import { CEFRLevel } from '../types';

export const sampleVocabulary: Record<string, string> = {
    'A1': `family\tсім'я
friend\tдруг
happy\tщасливий
school\tшкола
work\tробота
color\tколір
listen\tслухати
speak\tговорити
water\tвода
house\tбудинок`,

    'A2': `describe\tописувати
journey\tподорож
clothes\tодяг
decide\tвирішувати
expensive\tдорогий
healthy\tздоровий
opinion\tдумка
invite\tзапрошувати
prepare\tготувати
simple\tпростий`,

    'B1': `achievement\tдосягнення
confident\tвпевнений
develop\tрозвивати
experience\tдосвід
improve\tпокращувати
opportunity\tможливість
necessary\tнеобхідний
suggest\tпропонувати
responsible\tвідповідальний
knowledge\tзнання`,

    'B2': `significant\tзначний
interpret\tтлумачити, інтерпретувати
consequently\tвнаслідок цього
potential\tпотенціал
emphasize\tнаголошувати
reluctant\tнеохочий
appropriate\tдоречний
capacity\tздатність, місткість
generate\tгенерувати
monitor\tконтролювати, стежити`,

    'C1': `inevitable\tнеминучий
ambiguous\tдвозначний, невизначений
resilient\tстійкий, життєрадісний
comprehensive\tвсебічний, вичерпний
fluctuation\tколивання
implement\tвпроваджувати
prevail\tпереважати
scrutinize\tретельно досліджувати
vulnerable\tвразливий
unprecedented\tбезпрецедентний`,

    'C2': `nuance\tнюанс
subtle\tтонкий, ледь помітний
implication\tпідтекст, наслідок
eloquent\tкрасномовний
articulate\tчітко висловлювати
pervasive\tвсепроникний
meticulous\tретельний
substantiate\tобґрунтувати
disseminate\tпоширювати
reiterate\tповторювати`,
};

export const getSampleForLevel = (level: CEFRLevel): string => {
    return sampleVocabulary[level] || sampleVocabulary['B1'];
};
