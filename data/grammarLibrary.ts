
import { CEFRLevel, GrammarTopicConfig } from '../types';
import { grammarPools } from './grammarData';

// Hand-crafted entries with specific descriptions and examples
const manualEntries: GrammarTopicConfig[] = [
    // A1
    {
        id: 'a1-to-be',
        title: "Verb 'To Be' (Present Simple)",
        level: 'A1',
        description: "The most basic verb in English. Used to describe identity, feelings, and location.",
        example: "I am happy. She is a teacher. They are at home.",
        tags: ['verbs', 'present', 'basics'],
        searchKey: "Verb 'To Be'"
    },
    {
        id: 'a1-this-that-these-those',
        title: "This / That / These / Those",
        level: 'A1',
        description: "Demonstrative pronouns. Learn how to point at things: here vs there, one vs many.",
        example: "This is my car. That is your house.",
        tags: ['pronouns', 'basics', 'demonstratives'],
        searchKey: "This / That / These / Those"
    },
    {
        id: 'a1-present-simple',
        title: "Present Simple",
        level: 'A1',
        description: "Used for facts, habits, and daily routines.",
        example: "I work in an office. He plays football.",
        tags: ['tenses', 'present', 'habits'],
        searchKey: "Present Simple"
    },
    {
        id: 'a1-present-continuous',
        title: "Present Continuous",
        level: 'A1',
        description: "Used for actions happening right now.",
        example: "I am reading a book. She is sleeping.",
        tags: ['tenses', 'present', 'actions'],
        searchKey: "Present Continuous"
    },
    {
        id: 'a1-can',
        title: "Can / Can't",
        level: 'A1',
        description: "Modal verbs used to express ability or permission.",
        example: "I can swim. You can't park here.",
        tags: ['modals', 'ability'],
        searchKey: "Can / Can't"
    },
    
    // A2
    {
        id: 'a2-past-simple',
        title: "Past Simple vs Continuous",
        level: 'A2',
        description: "Distinguishing between finished actions and background actions in progress.",
        example: "I was reading (continuous) when he arrived (simple).",
        tags: ['tenses', 'past'],
        searchKey: "Past Simple vs Continuous"
    },
    {
        id: 'a2-present-perfect',
        title: "Present Perfect Basics",
        level: 'A2',
        description: "Introduction to Present Perfect: experiences and recent changes.",
        example: "I have been to London. She has just arrived.",
        tags: ['tenses', 'present perfect'],
        searchKey: "Present Perfect Basics"
    },
    {
        id: 'a2-comparatives',
        title: "Comparatives & Superlatives",
        level: 'A2',
        description: "Used to compare two or more things.",
        example: "This car is faster than that one. It is the fastest car in the world.",
        tags: ['adjectives', 'comparison'],
        searchKey: "Comparatives & Superlatives"
    },
    {
        id: 'a2-first-conditional',
        title: "First Conditional",
        level: 'A2',
        description: "Talking about real possibilities in the future. Learn why 'If I will go' is wrong.",
        example: "If it rains, I will stay at home.",
        tags: ['conditionals', 'future', 'mistakes'],
        searchKey: "First Conditional",
        aiConfig: {
            systemRule: "The exercise must strictly test the First Conditional structure: 'If + Present Simple, ... will + Infinitive'. Ensure the distinction between the condition (present tense) and result (future tense) is clear.",
            difficultyConfig: {
                Basic: "Keep the 'If' clause at the beginning of the sentence. Use standard 'will'. Example: 'If it rains, I will stay home.'",
                Standard: "Mix the order of clauses (Result first, If second). Example: 'I will stay home if it rains.'",
                Advanced: "Introduce negatives ('unless', 'won't') and use modal verbs in the result clause ('might', 'can', 'should') instead of just 'will'."
            }
        }
    },

    // B1
    {
        id: 'b1-past-simple-or-present-perfect',
        title: "Past Simple vs Present Perfect",
        level: 'B1',
        description: "The ultimate guide for Ukrainian speakers. Learn to distinguish between finished history and present results.",
        example: "I lost my keys (Past) vs I have lost my keys (Present Result).",
        tags: ['tenses', 'tricky', 'comparison', 'ukrainian-focus'],
        searchKey: "Past Simple vs Present Perfect",
        aiConfig: {
            systemRule: "The exercise must strictly test the distinction between Past Simple (finished time/history) and Present Perfect (unfinished time/result). Ensure a 50/50 mix of both tenses in the generated content.",
            difficultyConfig: {
                Basic: "Use explicit and obvious time markers to signal the tense (e.g., 'yesterday', 'in 1999' vs 'just', 'already', 'yet'). Use simple, high-frequency verbs.",
                Standard: "Use a mix of time markers and context. Sentences should be compound (e.g., 'I lost my keys, so I can't enter').",
                Advanced: "Avoid obvious time markers where possible. The distinction must rely on the context provided in the sentence (e.g., 'Shakespeare wrote' [dead] vs 'King has written' [alive]). Use complex sentence structures."
            }
        }
    },
    {
        id: 'b1-second-conditional',
        title: "Second Conditional",
        level: 'B1',
        description: "Used for unreal or hypothetical situations in the present.",
        example: "If I were you, I would accept the job.",
        tags: ['conditionals', 'hypothetical'],
        searchKey: "Second Conditional" 
    },
    {
        id: 'b1-passive',
        title: "Passive Voice",
        level: 'B1',
        description: "Used when the action is more important than the person doing it.",
        example: "The bridge was built in 1990. The letter has been sent.",
        tags: ['passive', 'verbs'],
        searchKey: "Passive Voice (Intermediate)"
    },
    
    // B2
    {
        id: 'b2-narrative-tenses',
        title: "Narrative Tenses",
        level: 'B2',
        description: "A combination of past tenses used to tell stories (Past Continuous, Past Perfect, etc.).",
        example: "The sun was shining when I left, but I had forgotten my umbrella.",
        tags: ['tenses', 'storytelling', 'past'],
        searchKey: "Narrative Tenses",
        aiConfig: {
            systemRule: "The exercise must test 'Narrative Tenses' (Past Continuous, Past Perfect, Past Perfect Continuous) in contrast with Past Simple. The sentences must tell a mini-story or describe a sequence of events.",
            difficultyConfig: {
                Basic: "Focus on the contrast between Past Simple and Past Continuous. Example: 'I was eating when he called.'",
                Standard: "Introduce Past Perfect for earlier actions. Example: 'When I arrived, the train had already left.'",
                Advanced: "Use a mix of all narrative tenses including Past Perfect Continuous. Example: 'He had been driving for hours when the car broke down.'"
            }
        }
    },
    {
        id: 'b2-wishes',
        title: "Wishes and Regrets",
        level: 'B2',
        description: "Structures to express regrets about the past or wishes for the present.",
        example: "I wish I hadn't said that. If only I were taller.",
        tags: ['conditionals', 'regret'],
        searchKey: "Wishes & Regrets (I wish / If only)"
    },
    {
        id: 'b2-causative',
        title: "Causative (Have something done)",
        level: 'B2',
        description: "Used when we arrange for someone else to do something for us.",
        example: "I had my hair cut yesterday. She is going to get her car fixed.",
        tags: ['verbs', 'passive', 'structure'],
        searchKey: "Causative (Have something done)"
    },

    // C1
    {
        id: 'c1-inversion',
        title: "Inversion",
        level: 'C1',
        description: "Used for emphasis or dramatic effect, usually with negative adverbials.",
        example: "Never have I seen such a thing. Rarely do we go there.",
        tags: ['style', 'emphasis'],
        searchKey: "Inversion (Negative Adverbials)",
        aiConfig: {
            systemRule: "The exercise must test 'Inversion' with negative adverbials. The sentence must begin with the adverbial followed by an inverted auxiliary verb and subject (e.g., 'Never have I...').",
            difficultyConfig: {
                Basic: "Use common inverted structures like 'Never have I...' or 'Rarely do we...'.",
                Standard: "Use 'Not only... but also' or 'No sooner... than' structures.",
                Advanced: "Use complex prepositional phrases like 'On no account', 'Under no circumstances' combined with advanced vocabulary."
            }
        }
    },
    {
        id: 'c1-mixed-conditionals',
        title: "Mixed Conditionals",
        level: 'C1',
        description: "Combining different times in if-clauses (e.g. Past condition, Present result).",
        example: "If I had studied harder, I would have a better job now.",
        tags: ['conditionals', 'complex'],
        searchKey: "Mixed Conditionals",
        aiConfig: {
            systemRule: "The exercise must test 'Mixed Conditionals', combining different timeframes in the 'if' clause and the main clause.",
            difficultyConfig: {
                Basic: "Focus on Past Action -> Present Result (Type 3 'if' + Type 2 result). Example: 'If I had studied (past), I would be happy (now).'",
                Standard: "Focus on Present State -> Past Result (Type 2 'if' + Type 3 result). Example: 'If I were smarter (generally), I wouldn't have done that (past).'",
                Advanced: "Mix with other modal verbs like 'might' or 'could' and use inverted word order ('Had I known...')."
            }
        }
    },
    {
        id: 'c1-cleft-sentences',
        title: "Cleft Sentences",
        level: 'C1',
        description: "Used to add emphasis by splitting the sentence into two parts.",
        example: "It was John who broke the window. What I need is a good sleep.",
        tags: ['style', 'emphasis', 'structure'],
        searchKey: "Cleft Sentences (It was... / What I need...)"
    }
];

// Helper function to generate the full library from the data source
const generateLibrary = (): GrammarTopicConfig[] => {
    const allTopics: GrammarTopicConfig[] = [];
    const processedSearchKeys = new Set<string>();

    // 1. Add manual entries first
    manualEntries.forEach(entry => {
        allTopics.push(entry);
        processedSearchKeys.add(entry.searchKey);
    });

    // 2. Iterate over all pools in grammarData.ts
    (Object.keys(grammarPools) as Array<Exclude<CEFRLevel, 'A1 ukr'>>).forEach(level => {
        if (level === 'C2') return; // Temporarily comment out C2 from library generation

        const topics = grammarPools[level];
        if (!topics) return;

        topics.forEach(topicString => {
            // If we haven't processed this topic yet (no manual entry)
            if (!processedSearchKeys.has(topicString)) {
                // Generate a consistent ID
                const safeId = topicString
                    .toLowerCase()
                    .replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric with hyphen
                    .replace(/(^-|-$)/g, '');    // Trim leading/trailing hyphens
                
                const uniqueId = `${level.toLowerCase()}-${safeId}`;

                allTopics.push({
                    id: uniqueId,
                    title: topicString,
                    level: level,
                    description: `Practice the usage of: ${topicString}`,
                    example: "Example sentence coming soon...",
                    tags: [level, 'Grammar'],
                    searchKey: topicString
                });
                
                processedSearchKeys.add(topicString);
            }
        });
    });
    
    return allTopics;
};

export const grammarLibrary = generateLibrary();
