
import { CEFRLevel } from '../types';

export const grammarPools: Record<Exclude<CEFRLevel, 'A1 ukr'>, string[]> = {
    'A1': [
        // Present
        "Verb 'To Be'",
        "Present Simple",
        "Present Continuous",
        "Have got",
        
        // Past & Future
        "Was / Were",
        "Past Simple",
        "Future: Going to",
        "Future: Will",
        
        // Modals & Verbs
        "Can / Can't",
        "Imperatives",
        "Would like",
        "Verb Patterns (Inf/Ger)",
        
        // Nouns & Pronouns
        "Articles & Plurals",
        "Pronouns",
        "Object Pronouns",
        "Possessives",
        "This / That / These / Those",
        "Quantifiers",
        "There is / There are",
        
        // Adjectives & Adverbs
        "Adjectives",
        "Comparatives",
        "Superlatives",
        "Adverbs",
        
        // Prepositions & Structure
        "Prepositions: Time",
        "Prepositions: Place",
        "Prepositions: Position",
        "Conjunctions",
        "Question Words",
        "Word Order"
    ],
    'A2': [
        // Tenses
        "Present Simple vs Continuous",
        "Past Simple vs Continuous",
        "Present Perfect Basics",
        "Present Perfect vs Past Simple",
        "Past Perfect",
        
        // Future
        "Future: Will vs Going to",
        "Future: Present Continuous",
        
        // Modals
        "Must / Have to",
        "Should / Shouldn't",
        "May / Might (Possibility)",
        "Used to (Past Habits)",
        
        // Conditionals
        "First Conditional",
        "Second Conditional",
        
        // Verbs
        "Passive Voice (Simple)",
        "Gerunds & Infinitives",
        "Stative vs Dynamic Verbs",
        "Phrasal Verbs Basics",
        "Do vs Make",
        "Uses of 'Get'",
        
        // Nouns etc
        "Indefinite Pronouns",
        "Quantifiers (Much, Many, Some, Any)",
        "Too / Enough",
        "Possessive Pronouns",
        
        // Adjectives
        "Comparatives & Superlatives",
        "So / Neither (Agreement)",
        
        // Sentence
        "Relative Clauses (Defining)",
        "Connectors (However, Although, Because)",
        "Purpose (to / for)",
        "Subject Questions",
        "Prepositions of Movement"
    ],
    'B1': [
        // Tenses
        "Past Simple vs Present Perfect",
        "Present Perfect Continuous",
        "Past Perfect",

        // Future
        "Future Forms Review",

        // Modals & Habits
        "Obligation & Advice (Must, Should, Ought to)",
        "Ability (Can, Could, Be able to)",
        "Deduction (Must, Might, Can't)",
        "Had better / Would rather",
        "Used to / Be used to / Get used to",

        // Conditionals
        "Zero & First Conditional",
        "Second Conditional",
        "Third Conditional",

        // Passive & Reported
        "Passive Voice (Intermediate)",
        "Reported Speech (Statements)",
        "Reported Speech (Questions)",

        // Verbs
        "Gerund vs Infinitive",
        "Phrasal Verbs (Common)",
        "Verb + Preposition",

        // Nouns etc
        "Articles (Definite, Indefinite, Zero)",
        "Quantifiers (All, Both, Either, Neither)",
        "Reflexive Pronouns",

        // Adj/Adv
        "Adjectives ending in -ed / -ing",
        "So vs Such",
        "Comparison (Advanced)",

        // Structure
        "Relative Clauses (Defining vs Non-defining)",
        "Question Tags",
        "Connectors of Purpose & Reason"
    ],
    'B2': [
        // Complex Tenses
        "Narrative Tenses",
        "Future Continuous",
        "Future Perfect",
        
        // Past Modals
        "Past Modals (Should have / Could have)",
        "Deduction (Must have / Can't have)",
        "Habits (Will / Would for habits)",
        
        // Conditionals & Wishes
        "Third Conditional (Review)",
        "Mixed Conditionals",
        "Wishes & Regrets (I wish / If only)",
        
        // Passive & Causative
        "Passive (Advanced Structures)",
        "Causative (Have something done)",
        "Reporting Verbs (Passive)",
        
        // Verbs & Patterns
        "Gerund vs Infinitive (Meaning Change)",
        "Verbs of the Senses",
        "Participle Clauses (Reduced)",
        
        // Adjectives & Quantifiers
        "Adjective Order",
        "Gradable vs Non-gradable Adjectives",
        "Quantifiers (Advanced)",
        
        // Sentence Structure
        "Relative Clauses (Non-defining)",
        "Connectors of Contrast (Despite / In spite of)",
        "Inversion (Introduction)",
        "Cleft Sentences (What I need is...)"
    ],
    'C1': [
        // Future & Tenses
        "Future in the Past",
        "Wishes & Unreal Past (It's time / I'd rather)",

        // Modals
        "Speculation & Deduction (Advanced)",

        // Conditionals
        "Mixed Conditionals",
        "Inverted Conditionals (Should / Had / Were)",
        "Alternatives to 'If' (Provided / Unless)",

        // Passive & Causative
        "Passive with Reporting Verbs (It is said that...)",
        "Passive with Two Objects",

        // Verbs & Patterns
        "Complex Gerunds & Infinitives",
        "Subjunctive Mood",

        // Nouns & Pronouns
        "Compound Nouns & Possessives",
        "Reflexive & Reciprocal Pronouns",

        // Adjectives & Adverbs
        "Compound Adjectives",
        "Modifying Comparatives (Far / Way / Slightly)",

        // Sentence Structure & Style
        "Inversion (Negative Adverbials)",
        "Cleft Sentences (It was... / What I need...)",
        "Participle Clauses",
        "Ellipsis & Substitution",
        "Discourse Markers"
    ],
    'C2': [
        "Advanced conditional forms (e.g., with inversion without 'if')",
        "Advanced passive structures (e.g., double passives)",
        "Participle clauses (e.g., fronted participles for stylistic effect)",
        "Complex noun phrases with multiple modifiers",
        "Subtle modal verb usage (e.g., 'might have been doing')",
        "Highly idiomatic phrasing and collocations",
        "Use of rhetorical devices like inversion for emphasis",
        "Nuanced use of aspect (perfect vs. continuous)",
        "Prepositional phrases with abstract nouns",
        "Advanced discourse markers for cohesion and flow"
    ]
};
