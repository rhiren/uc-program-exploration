"use client";

import Link from "next/link";
import {
  type ChangeEvent,
  type ReactNode,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createDiscoverProgress,
  discoverProgressStorageKey,
  parseDiscoverProgress,
  readDiscoverProgress,
  serializeDiscoverProgress,
} from "@/lib/discover/progress-store.mjs";
import { buildProgramRecommendations } from "@/lib/discover/recommendations.mjs";

type DiscoverStage = "onboarding" | "challenge" | "reflection" | "results";

type DiscoverProgress = {
  version: 1;
  updatedAt: string;
  stage: DiscoverStage;
  onboardingIndex: number;
  answers: Record<string, string>;
  challengeIndex: number;
  challengeAnswers: Record<string, string>;
  evidenceOrder: string[];
  reflectionStep: number;
  reflection: Record<string, string>;
  savedProgramIds: string[];
};

type OnboardingContent = {
  requiredBeforeFirstSampler: number;
  privacyNote: string;
  questions: Array<{
    id: string;
    prompt: string;
    choices: string[];
    skipAllowed: boolean;
  }>;
};

type ChallengeChoice = {
  id: string;
  text: string;
};

type ChallengeStep = {
  id: string;
  type: string;
  prompt: string;
  choices?: ChallengeChoice[];
  items?: string[];
  explanation?: string;
};

type ChallengeContent = {
  id: string;
  title: string;
  disclaimer: string;
  defaultMinutes: number;
  learningGoals: string[];
  steps: ChallengeStep[];
};

type ProgramView = {
  id: string;
  name: string;
  summary: string;
  codingUse: number | string;
};

type Recommendation = {
  slot: string;
  label: string;
  program: ProgramView;
  reason: string;
};

type DiscoverJourneyProps = {
  onboarding: OnboardingContent;
  challenge: ChallengeContent;
  programs: ProgramView[];
};

const reflectionPrompts = [
  {
    id: "experience",
    prompt: "How did tracing that mechanism feel?",
    choices: [
      "Interesting—I wanted to keep tracing it",
      "Fine, but not especially energizing",
      "Draining or too detailed",
      "I'm not sure yet",
    ],
  },
  {
    id: "more",
    prompt: "What would you rather try next?",
    choices: [
      "More molecular biology",
      "More patient-centered cases",
      "More data or quantitative problems",
      "Something completely different",
    ],
  },
] as const;

function ChoiceList({
  choices,
  selected,
  onSelect,
}: {
  choices: Array<{ id: string; label: string }>;
  selected?: string;
  onSelect: (id: string) => void;
}) {
  return (
    <div className="journey-choices">
      {choices.map((choice) => (
        <button
          aria-pressed={selected === choice.id}
          className="journey-choice"
          key={choice.id}
          onClick={() => onSelect(choice.id)}
          type="button"
        >
          <span aria-hidden="true" className="choice-marker" />
          {choice.label}
        </button>
      ))}
    </div>
  );
}

function JourneyFrame({
  currentStep,
  children,
  onBack,
}: {
  currentStep: number;
  children: ReactNode;
  onBack: () => void;
}) {
  const progressPercent = Math.round((currentStep / 10) * 100);

  return (
    <>
      <div className="journey-progress-row">
        <button className="text-button" onClick={onBack} type="button">
          ← Back
        </button>
        <span>Step {currentStep} of about 10</span>
        <Link href="/discover">Exit for now</Link>
      </div>
      <div
        aria-label={`Exploration progress: ${progressPercent}%`}
        aria-valuemax={100}
        aria-valuemin={0}
        aria-valuenow={progressPercent}
        className="journey-progress"
        role="progressbar"
      >
        <span style={{ width: `${progressPercent}%` }} />
      </div>
      {children}
    </>
  );
}

export function DiscoverJourney({
  onboarding,
  challenge,
  programs,
}: DiscoverJourneyProps) {
  const [progress, setProgress] = useState<DiscoverProgress>(
    () => createDiscoverProgress() as DiscoverProgress,
  );
  const [isReady, setIsReady] = useState(false);
  const [storageMessage, setStorageMessage] = useState("");
  const importInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const restoreTimer = window.setTimeout(() => {
      setProgress(readDiscoverProgress(window.localStorage) as DiscoverProgress);
      setIsReady(true);
    }, 0);

    return () => window.clearTimeout(restoreTimer);
  }, []);

  useEffect(() => {
    if (!isReady) return;

    try {
      window.localStorage.setItem(
        discoverProgressStorageKey,
        serializeDiscoverProgress(progress),
      );
    } catch {
      window.setTimeout(
        () =>
          setStorageMessage(
            "This browser could not save progress. You can still finish this visit.",
          ),
        0,
      );
    }
  }, [isReady, progress]);

  const recommendations = useMemo(
    () =>
      buildProgramRecommendations(
        progress.answers,
        progress.reflection,
        programs,
      ) as Recommendation[],
    [progress.answers, progress.reflection, programs],
  );

  function updateProgress(
    update: (current: DiscoverProgress) => DiscoverProgress,
  ) {
    setProgress((current) => ({
      ...update(current),
      updatedAt: new Date().toISOString(),
    }));
  }

  function selectOnboardingAnswer(questionId: string, answer: string) {
    updateProgress((current) => ({
      ...current,
      answers: { ...current.answers, [questionId]: answer },
    }));
  }

  function continueOnboarding() {
    updateProgress((current) => {
      const isLast =
        current.onboardingIndex >= onboarding.questions.length - 1;
      return isLast
        ? { ...current, stage: "challenge", challengeIndex: 0 }
        : { ...current, onboardingIndex: current.onboardingIndex + 1 };
    });
  }

  function skipOnboarding(questionId: string) {
    updateProgress((current) => {
      const answers = { ...current.answers };
      delete answers[questionId];
      const isLast =
        current.onboardingIndex >= onboarding.questions.length - 1;
      return isLast
        ? {
            ...current,
            answers,
            stage: "challenge",
            challengeIndex: 0,
          }
        : {
            ...current,
            answers,
            onboardingIndex: current.onboardingIndex + 1,
          };
    });
  }

  function selectChallengeAnswer(stepId: string, answer: string) {
    updateProgress((current) => ({
      ...current,
      challengeAnswers: {
        ...current.challengeAnswers,
        [stepId]: answer,
      },
    }));
  }

  function getEvidenceOrder(step: ChallengeStep) {
    if (progress.evidenceOrder.length > 0) return progress.evidenceOrder;
    const items = step.items ?? [];
    const suggestedOrder = [2, 0, 4, 1, 3]
      .map((index) => items[index])
      .filter(Boolean);
    return suggestedOrder.length === items.length ? suggestedOrder : items;
  }

  function moveEvidence(step: ChallengeStep, itemIndex: number, direction: -1 | 1) {
    const currentOrder = [...getEvidenceOrder(step)];
    const destination = itemIndex + direction;
    if (destination < 0 || destination >= currentOrder.length) return;
    [currentOrder[itemIndex], currentOrder[destination]] = [
      currentOrder[destination],
      currentOrder[itemIndex],
    ];

    updateProgress((current) => ({
      ...current,
      evidenceOrder: currentOrder,
      challengeAnswers: {
        ...current.challengeAnswers,
        [step.id]: "",
      },
    }));
  }

  function revealEvidenceChain(step: ChallengeStep) {
    const currentOrder = getEvidenceOrder(step);
    updateProgress((current) => ({
      ...current,
      evidenceOrder: currentOrder,
      challengeAnswers: {
        ...current.challengeAnswers,
        [step.id]: currentOrder.join(" → "),
      },
    }));
  }

  function continueChallenge() {
    updateProgress((current) => {
      const isLast = current.challengeIndex >= challenge.steps.length - 1;
      return isLast
        ? { ...current, stage: "reflection", reflectionStep: 0 }
        : { ...current, challengeIndex: current.challengeIndex + 1 };
    });
  }

  function selectReflection(reflectionId: string, answer: string) {
    updateProgress((current) => ({
      ...current,
      reflection: { ...current.reflection, [reflectionId]: answer },
    }));
  }

  function continueReflection() {
    updateProgress((current) =>
      current.reflectionStep === 0
        ? { ...current, reflectionStep: 1 }
        : { ...current, stage: "results" },
    );
  }

  function goBack() {
    updateProgress((current) => {
      if (current.stage === "results") {
        return { ...current, stage: "reflection", reflectionStep: 1 };
      }
      if (current.stage === "reflection") {
        return current.reflectionStep > 0
          ? { ...current, reflectionStep: current.reflectionStep - 1 }
          : {
              ...current,
              stage: "challenge",
              challengeIndex: challenge.steps.length - 1,
            };
      }
      if (current.stage === "challenge") {
        return current.challengeIndex > 0
          ? { ...current, challengeIndex: current.challengeIndex - 1 }
          : {
              ...current,
              stage: "onboarding",
              onboardingIndex: onboarding.questions.length - 1,
            };
      }
      return {
        ...current,
        onboardingIndex: Math.max(0, current.onboardingIndex - 1),
      };
    });
  }

  function toggleSavedProgram(programId: string) {
    updateProgress((current) => ({
      ...current,
      savedProgramIds: current.savedProgramIds.includes(programId)
        ? current.savedProgramIds.filter((id) => id !== programId)
        : [...current.savedProgramIds, programId],
    }));
  }

  function exportProgress() {
    const file = new Blob([serializeDiscoverProgress(progress)], {
      type: "application/json",
    });
    const downloadUrl = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = downloadUrl;
    link.download = "uc-pathways-discover-progress.json";
    link.click();
    URL.revokeObjectURL(downloadUrl);
    setStorageMessage("Progress file downloaded.");
  }

  async function importProgress(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const parsed = parseDiscoverProgress(
        JSON.parse(await file.text()),
      ) as DiscoverProgress | null;
      if (!parsed) throw new Error("Invalid progress");
      setProgress(parsed);
      setStorageMessage("Progress restored from the selected file.");
    } catch {
      setStorageMessage(
        "That file is not a valid UC Pathways Discover progress file.",
      );
    } finally {
      event.target.value = "";
    }
  }

  function clearProgress() {
    if (
      !window.confirm(
        "Clear this Discover journey and its saved paths from this device?",
      )
    ) {
      return;
    }
    window.localStorage.removeItem(discoverProgressStorageKey);
    setProgress(createDiscoverProgress() as DiscoverProgress);
    setStorageMessage("Discover progress cleared.");
  }

  if (!isReady) {
    return (
      <section className="journey-card journey-loading" aria-live="polite">
        <p className="eyebrow">Discover</p>
        <h1>Restoring your private progress…</h1>
      </section>
    );
  }

  let currentStep = 1;
  if (progress.stage === "onboarding") {
    currentStep = progress.onboardingIndex + 1;
  } else if (progress.stage === "challenge") {
    currentStep = 5 + progress.challengeIndex;
  } else if (progress.stage === "reflection") {
    currentStep = 8 + progress.reflectionStep;
  } else {
    currentStep = 10;
  }

  const question = onboarding.questions[progress.onboardingIndex];
  const challengeStep = challenge.steps[progress.challengeIndex];
  const reflectionPrompt = reflectionPrompts[progress.reflectionStep];

  return (
    <JourneyFrame currentStep={currentStep} onBack={goBack}>
      <section className="journey-card">
        {progress.stage === "onboarding" && question && (
          <>
            <p className="eyebrow">
              A few clues · Question {progress.onboardingIndex + 1} of{" "}
              {onboarding.questions.length}
            </p>
            <h1>{question.prompt}</h1>
            <p className="journey-intro">
              Choose what feels closest today. This is not a personality or
              aptitude test, and any answer can change later.
            </p>
            <ChoiceList
              choices={question.choices.map((choice) => ({
                id: choice,
                label: choice,
              }))}
              onSelect={(answer) =>
                selectOnboardingAnswer(question.id, answer)
              }
              selected={progress.answers[question.id]}
            />
            <div className="journey-actions">
              <button
                className="button button-primary"
                disabled={!progress.answers[question.id]}
                onClick={continueOnboarding}
                type="button"
              >
                Continue →
              </button>
              {question.skipAllowed && (
                <button
                  className="text-button"
                  onClick={() => skipOnboarding(question.id)}
                  type="button"
                >
                  Skip this question
                </button>
              )}
            </div>
            <p className="privacy-note">{onboarding.privacyNote}</p>
          </>
        )}

        {progress.stage === "challenge" && challengeStep && (
          <>
            <div className="journey-heading-row">
              <div>
                <p className="eyebrow">Try the thinking · Genetics</p>
                <h1>{challenge.title}</h1>
              </div>
              <span className="time-chip">{challenge.defaultMinutes} min</span>
            </div>
            <p className="journey-intro">{challengeStep.prompt}</p>

            {challengeStep.type === "evidence_sort" ? (
              <>
                <ol className="evidence-order">
                  {getEvidenceOrder(challengeStep).map((item, index) => (
                    <li key={item}>
                      <span>{index + 1}</span>
                      <strong>{item}</strong>
                      <div>
                        <button
                          aria-label={`Move ${item} earlier`}
                          disabled={index === 0}
                          onClick={() =>
                            moveEvidence(challengeStep, index, -1)
                          }
                          type="button"
                        >
                          ↑
                        </button>
                        <button
                          aria-label={`Move ${item} later`}
                          disabled={
                            index === getEvidenceOrder(challengeStep).length - 1
                          }
                          onClick={() =>
                            moveEvidence(challengeStep, index, 1)
                          }
                          type="button"
                        >
                          ↓
                        </button>
                      </div>
                    </li>
                  ))}
                </ol>
                {!progress.challengeAnswers[challengeStep.id] && (
                  <button
                    className="button button-secondary"
                    onClick={() => revealEvidenceChain(challengeStep)}
                    type="button"
                  >
                    Show the reference chain
                  </button>
                )}
              </>
            ) : (
              <ChoiceList
                choices={(challengeStep.choices ?? []).map((choice) => ({
                  id: choice.id,
                  label: choice.text,
                }))}
                onSelect={(answer) =>
                  selectChallengeAnswer(challengeStep.id, answer)
                }
                selected={progress.challengeAnswers[challengeStep.id]}
              />
            )}

            {progress.challengeAnswers[challengeStep.id] && (
              <div className="learning-note" aria-live="polite">
                <p className="card-label">The idea to carry forward</p>
                {challengeStep.type === "evidence_sort" && (
                  <ol>
                    {(challengeStep.items ?? []).map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ol>
                )}
                <p>{challengeStep.explanation}</p>
              </div>
            )}

            <div className="journey-actions">
              <button
                className="button button-primary"
                disabled={!progress.challengeAnswers[challengeStep.id]}
                onClick={continueChallenge}
                type="button"
              >
                Continue →
              </button>
            </div>
            <p className="privacy-note">{challenge.disclaimer}</p>
          </>
        )}

        {progress.stage === "reflection" && reflectionPrompt && (
          <>
            <p className="eyebrow">Notice your reaction · No score</p>
            <h1>{reflectionPrompt.prompt}</h1>
            <p className="journey-intro">
              Your reaction is more useful here than whether every scientific
              step was right.
            </p>
            <ChoiceList
              choices={reflectionPrompt.choices.map((choice) => ({
                id: choice,
                label: choice,
              }))}
              onSelect={(answer) =>
                selectReflection(reflectionPrompt.id, answer)
              }
              selected={progress.reflection[reflectionPrompt.id]}
            />
            <div className="journey-actions">
              <button
                className="button button-primary"
                disabled={!progress.reflection[reflectionPrompt.id]}
                onClick={continueReflection}
                type="button"
              >
                {progress.reflectionStep === 0
                  ? "One more reflection →"
                  : "Show three paths →"}
              </button>
            </div>
          </>
        )}

        {progress.stage === "results" && (
          <>
            <p className="eyebrow">Three paths to investigate</p>
            <h1>Here is a wider map—not a final answer.</h1>
            <p className="journey-intro">
              These paths reflect a few choices from one short visit. Saving one
              means “I want to learn more,” not “this is my major.”
            </p>
            <div className="recommendation-grid">
              {recommendations.map((recommendation) => {
                const isSaved = progress.savedProgramIds.includes(
                  recommendation.program.id,
                );
                return (
                  <article key={recommendation.slot}>
                    <p className="card-label">{recommendation.label}</p>
                    <h2>{recommendation.program.name}</h2>
                    <p>{recommendation.program.summary}</p>
                    <p className="recommendation-reason">
                      {recommendation.reason}
                    </p>
                    <div className="recommendation-meta">
                      <span>
                        Coding use: {recommendation.program.codingUse}/5
                      </span>
                      <button
                        aria-pressed={isSaved}
                        onClick={() =>
                          toggleSavedProgram(recommendation.program.id)
                        }
                        type="button"
                      >
                        {isSaved ? "Saved ✓" : "Save to explore"}
                      </button>
                    </div>
                  </article>
                );
              })}
            </div>
            <div className="result-actions">
              <Link className="button button-primary" href="/discover">
                Browse all programs →
              </Link>
              <Link className="button button-secondary" href="/prepare">
                See how to prepare for UC
              </Link>
            </div>
          </>
        )}
      </section>

      <details className="progress-tools">
        <summary>Progress &amp; privacy</summary>
        <p>
          This journey is saved only in this browser. Downloading a progress
          file is the way to move it to another device.
        </p>
        <div>
          <button className="text-button" onClick={exportProgress} type="button">
            Download progress
          </button>
          <button
            className="text-button"
            onClick={() => importInput.current?.click()}
            type="button"
          >
            Import progress
          </button>
          <button className="text-button danger-text" onClick={clearProgress} type="button">
            Clear progress
          </button>
        </div>
        <input
          accept="application/json"
          className="visually-hidden"
          onChange={importProgress}
          ref={importInput}
          type="file"
        />
        {storageMessage && <p aria-live="polite">{storageMessage}</p>}
      </details>
    </JourneyFrame>
  );
}
