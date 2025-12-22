# VocabCrafter Optimization Roadmap

This document outlines the step-by-step technical plan to optimize the architecture, performance, and maintainability of the VocabCrafter AI application.

## Phase 1: Service Layer & Safety
**Goal:** Reduce code duplication in API calls and prevent runtime crashes caused by malformed AI responses.

### Task 1.1: Generic API Wrapper
**File:** `services/geminiService.ts`
**Description:**
Currently, every generation function (`generateMcqQuiz`, `generateGapFill`, etc.) manually calls `ai.models.generateContent`, handles retries, and parses JSON.
**Action:**
Create a `generateContent<T>` function that handles:
1.  Calling the API.
2.  Implementing the `withRetry` logic.
3.  Parsing the JSON string.
4.  Validating the result against a schema (runtime validation).

### Task 1.2: Runtime Type Guards
**File:** `services/validation.ts` (New File)
**Description:**
TypeScript types disappear at runtime. If the AI returns an object missing the `correctAnswer` field, the app crashes.
**Action:**
Create Type Guard functions (e.g., `isValidQuestion(obj: any): obj is Question`). Use these in the service layer to ensure data integrity before it reaches the UI.

---

## Phase 2: Component Abstraction (DRY)
**Goal:** Remove duplicate logic across quiz screens and unify the visual layout.

### Task 2.1: `useQuizLogic` Hook
**File:** `hooks/useQuizLogic.ts` (New File)
**Description:**
`QuizScreen`, `GapFillQuizScreen`, and `TranslationQuizScreen` all manage:
- `currentIndex`
- `isAnswered`
- `timeLeft` (Timer)
- `isPaused`
- Score tracking
**Action:**
Extract this logic into a hook:
```typescript
const {
  currentQuestion,
  status, // 'idle' | 'answered' | 'finished'
  timer,
  actions: { submitAnswer, nextQuestion, togglePause }
} = useQuizLogic({ questions, isTimed, onComplete });
```

### Task 2.2: `QuizLayout` Component
**File:** `components/QuizLayout.tsx` (New File)
**Description:**
All quiz screens share the same visual structure: A dark card, a progress bar, a timer icon, and a pause overlay.
**Action:**
Create a wrapper component:
```tsx
<QuizLayout
  progress={...}
  timer={...}
  onPause={...}
>
  {/* Specific content (MCQ options, Input field) goes here */}
</QuizLayout>
```

---

## Phase 3: State Architecture (The Core Refactor)
**Goal:** Simplify `App.tsx` and prevent "stale state" bugs.

### Task 3.1: Define Activity State
**File:** `types.ts`
**Description:**
Instead of `questions: []`, `gapFillQuestions: []`, `translationQuestions: []` living side-by-side, we define a discriminated union.
**Action:**
```typescript
type ActivityState =
  | { status: 'IDLE' }
  | { status: 'LOADING'; message: string }
  | { status: 'ACTIVE'; type: 'MCQ'; data: Question[]; userAnswers: UserAnswer[] }
  | { status: 'ACTIVE'; type: 'GAP_FILL'; data: GapFillQuestion[]; ... }
  | { status: 'RESULTS'; ... };
```

### Task 3.2: Implement `AppReducer`
**File:** `reducers/appReducer.ts` (New File)
**Description:**
Move state transition logic out of `App.tsx`.
**Action:**
Handle actions:
- `START_GENERATION`: Sets loading state.
- `GENERATION_SUCCESS`: Sets active state with data.
- `SUBMIT_ANSWER`: Updates `userAnswers` in the active state.
- `RESET`: Clears everything to IDLE.

### Task 3.3: Integrate Reducer
**File:** `App.tsx`
**Description:**
Replace the 15+ `useState` hooks with `const [state, dispatch] = useReducer(appReducer, initialState);`. Update `handleGenerate` and `renderContent` to use the new state structure.

---

## Phase 4: Performance & Audio (Bonus)
**Goal:** Improve the responsiveness of audio playback.

### Task 4.1: `AudioContext` Provider
**File:** `context/AudioContext.tsx` (New File)
**Description:**
Currently, `AudioButton` manages its own state. If a user clicks three buttons quickly, they might overlap or behave unpredictably.
**Action:**
Create a context that manages a **single** `SpeechSynthesisUtterance` instance. When a new audio is requested, it guarantees the previous one is cancelled immediately.
