export const agCategoryIds = ["a", "b", "c", "d", "e", "f", "g"];

export const gradeLabels = {
  A: "A",
  B: "B",
  C: "C",
  D: "D",
  F: "F",
};

function clampNumber(value, minimum, maximum) {
  return Number.isFinite(value)
    ? Math.min(maximum, Math.max(minimum, value))
    : minimum;
}

function normalizeGrade(value) {
  if (typeof value !== "string") return null;
  const grade = value.trim().toUpperCase().charAt(0);
  return Object.hasOwn(gradeLabels, grade) ? grade : null;
}

function normalizeUnits(value) {
  return clampNumber(Number(value), 0, 20);
}

function normalizeCategory(value) {
  return agCategoryIds.includes(value) ? value : null;
}

function categoryRulesById(agRules) {
  return Object.fromEntries(
    agRules.categories.map((category) => [category.id, category]),
  );
}

function courseUnits(course) {
  return normalizeUnits(course.units ?? course.years ?? 1);
}

function isCompletedCourse(course) {
  return course.status === "completed" || !course.status;
}

function isFutureCourse(course) {
  return course.status === "current" || course.status === "planned";
}

export function buildCoursesFromAgProgress(agProgress) {
  const courses = [];

  for (const categoryId of agCategoryIds) {
    const progress = agProgress?.[categoryId] ?? {};
    for (const status of ["completed", "current", "planned"]) {
      const units = normalizeUnits(progress[status] ?? 0);
      if (units > 0) {
        courses.push({
          id: `${categoryId}-${status}`,
          name: `${categoryId.toUpperCase()} ${status}`,
          agCategory: categoryId,
          status,
          units,
        });
      }
    }

    const unresolved = normalizeUnits(progress.unresolved ?? 0);
    if (unresolved > 0) {
      courses.push({
        id: `${categoryId}-unresolved`,
        name: `${categoryId.toUpperCase()} needs counselor classification`,
        agCategory: null,
        intendedAgCategory: categoryId,
        status: "completed",
        units: unresolved,
      });
    }
  }

  return courses;
}

export function calculateAgAudit(courses, agRules) {
  const rules = categoryRulesById(agRules);
  const categories = agCategoryIds.map((categoryId) => {
    const rule = rules[categoryId];
    const categoryCourses = courses.filter(
      (course) => course.agCategory === categoryId,
    );
    const unresolvedCourses = courses.filter(
      (course) =>
        !course.agCategory && course.intendedAgCategory === categoryId,
    );
    const completedYears = categoryCourses
      .filter(isCompletedCourse)
      .reduce((total, course) => total + courseUnits(course), 0);
    const futureYears = categoryCourses
      .filter(isFutureCourse)
      .reduce((total, course) => total + courseUnits(course), 0);
    const possibleYears = completedYears + futureYears;

    return {
      id: categoryId,
      name: rule.name,
      requiredYears: rule.yearsRequired,
      recommendedYears: rule.yearsRecommended,
      completedYears,
      futureYears,
      possibleYears,
      remainingYears: Math.max(0, rule.yearsRequired - possibleYears),
      unresolvedYears: unresolvedCourses.reduce(
        (total, course) => total + courseUnits(course),
        0,
      ),
      status:
        possibleYears >= rule.yearsRequired
          ? "on_track"
          : unresolvedCourses.length
            ? "needs_classification"
            : "possible_gap",
    };
  });

  const completedCourseCount = courses
    .filter((course) => course.agCategory && isCompletedCourse(course))
    .reduce((total, course) => total + courseUnits(course), 0);
  const futureCourseCount = courses
    .filter((course) => course.agCategory && isFutureCourse(course))
    .reduce((total, course) => total + courseUnits(course), 0);
  const unresolvedCourseCount = courses
    .filter((course) => !course.agCategory)
    .reduce((total, course) => total + courseUnits(course), 0);

  return {
    ruleId: agRules.meta.ruleId,
    categories,
    completedCourseCount,
    futureCourseCount,
    possibleCourseCount: completedCourseCount + futureCourseCount,
    unresolvedCourseCount,
    totalCoursesMinimum: agRules.totalCoursesMinimum,
    coursesBeforeSeniorYearMinimum: agRules.coursesBeforeSeniorYearMinimum,
    status: categories.some((category) => category.status === "possible_gap")
      ? "possible_gap"
      : categories.some((category) => category.status === "needs_classification")
        ? "needs_classification"
        : "on_track",
  };
}

function includedForGpa(course) {
  const gradeLevel = Number(course.gradeLevel);
  return (
    normalizeCategory(course.agCategory) &&
    isCompletedCourse(course) &&
    (gradeLevel === 10 || gradeLevel === 11) &&
    normalizeGrade(course.grade)
  );
}

export function calculateUcGpa(courses, gpaRules, residency = "california") {
  const policy =
    residency === "nonresident"
      ? gpaRules.nonresident
      : gpaRules.californiaResident;
  const includedCourses = courses.filter(includedForGpa);
  const excludedCourses = courses.filter(
    (course) => course.grade || course.gradeLevel || course.agCategory,
  ).filter((course) => !includedForGpa(course));

  let basePoints = 0;
  let units = 0;
  let honorsEligibleUnits = 0;
  let grade10HonorsEligibleUnits = 0;

  for (const course of includedCourses) {
    const courseUnit = courseUnits(course);
    const grade = normalizeGrade(course.grade);
    basePoints += gpaRules.gradePoints[grade] * courseUnit;
    units += courseUnit;

    const honorsType = course.honorsType ?? "none";
    const earnsHonorsPoint =
      policy.honorsEligibleTypes.includes(honorsType) &&
      gpaRules.honorsPointGradeEligibility.includes(grade);

    if (earnsHonorsPoint) {
      honorsEligibleUnits += courseUnit;
      if (Number(course.gradeLevel) === 10) {
        grade10HonorsEligibleUnits += courseUnit;
      }
    }
  }

  const grade10HonorsPoints = Math.min(
    grade10HonorsEligibleUnits,
    policy.honorsPointCapGrade10,
  );
  const grade11HonorsPoints = Math.max(
    0,
    Math.min(
      honorsEligibleUnits - grade10HonorsEligibleUnits,
      policy.honorsPointCapTotal - grade10HonorsPoints,
    ),
  );
  const honorsPoints = grade10HonorsPoints + grade11HonorsPoints;
  const estimatedGpa = units > 0 ? (basePoints + honorsPoints) / units : null;

  return {
    ruleId: gpaRules.meta.ruleId,
    residency,
    minimum: policy.minimum,
    includedCourseCount: units,
    excludedCourseCount: excludedCourses.reduce(
      (total, course) => total + courseUnits(course),
      0,
    ),
    basePoints,
    honorsEligibleUnits,
    honorsPoints,
    estimatedGpa,
    status:
      estimatedGpa === null
        ? "not_enough_information"
        : estimatedGpa >= policy.minimum
          ? "meets_minimum_estimate"
          : "below_minimum_estimate",
    assumptions: [
      gpaRules.includedWindow,
      "Plus and minus signs are ignored.",
      "This is an eligibility-style estimate, not an admission prediction.",
    ],
  };
}

export function buildCoursesFromGpaSummary(summary) {
  const courses = [];
  let index = 0;

  for (const grade of ["A", "B", "C", "D", "F"]) {
    const count = normalizeUnits(summary?.grades?.[grade] ?? 0);
    for (let item = 0; item < count; item += 1) {
      courses.push({
        id: `gpa-${grade}-${index}`,
        name: `A-G ${grade} course`,
        agCategory: "g",
        status: "completed",
        grade,
        gradeLevel: item % 2 === 0 ? 10 : 11,
        units: 1,
        honorsType: "none",
      });
      index += 1;
    }
  }

  for (const gradeLevel of [10, 11]) {
    const honorsCount = normalizeUnits(summary?.honors?.[gradeLevel] ?? 0);
    for (let item = 0; item < honorsCount; item += 1) {
      courses.push({
        id: `gpa-honors-${gradeLevel}-${item}`,
        name: `Honors/AP/IB ${gradeLevel}`,
        agCategory: "g",
        status: "completed",
        grade: "A",
        gradeLevel,
        units: 1,
        honorsType: "ap",
      });
    }
  }

  return courses;
}

export function buildReadinessSnapshot({
  baseline,
  courses,
  agRules,
  gpaRules,
  roadmapTemplates = [],
}) {
  const agAudit = calculateAgAudit(courses, agRules);
  const gpaEstimate = calculateUcGpa(
    buildCoursesFromGpaSummary(baseline.gpaSummary),
    gpaRules,
    baseline.residency,
  );
  const findings = [];

  if (agAudit.unresolvedCourseCount > 0) {
    findings.push({
      id: "unresolved-ag",
      severity: "verify",
      title: "Some A-G classifications need confirmation",
      detail:
        "Keep these as counselor questions until the official school A-G list confirms them.",
      nextActionId: "audit-ag",
    });
  }

  const possibleGaps = agAudit.categories.filter(
    (category) => category.status === "possible_gap",
  );
  if (possibleGaps.length > 0) {
    findings.push({
      id: "possible-ag-gap",
      severity: "plan",
      title: "A few A-G areas may need planned coursework",
      detail: possibleGaps
        .map((category) => `${category.id.toUpperCase()} ${category.name}`)
        .join(", "),
      nextActionId: "senior-plan",
    });
  }

  if (gpaEstimate.status === "not_enough_information") {
    findings.push({
      id: "gpa-missing",
      severity: "learn",
      title: "The UC GPA estimate needs grade information",
      detail:
        "Enter a rough grade summary when ready; the result should stay tied to assumptions.",
      nextActionId: "verify-gpa",
    });
  } else {
    findings.push({
      id: "gpa-estimate",
      severity:
        gpaEstimate.status === "meets_minimum_estimate" ? "context" : "verify",
      title: "UC GPA estimate is ready to review",
      detail: `${gpaEstimate.estimatedGpa.toFixed(2)} estimate using ${gpaEstimate.includedCourseCount} included courses. This is not a campus recommendation.`,
      nextActionId: "verify-gpa",
    });
  }

  if (baseline.seniorMathPlan === "not-sure") {
    findings.push({
      id: "senior-math",
      severity: "plan",
      title: "Senior-year math is worth discussing early",
      detail:
        "The right choice depends on school options, mastery, intended programs, and sustainability.",
      nextActionId: "counselor-sheet",
    });
  }

  if (baseline.explorationPriority) {
    findings.push({
      id: "exploration",
      severity: "explore",
      title: "One exploration thread is ready",
      detail: `Try a small ${baseline.explorationPriority} activity before adding more planning tasks.`,
      nextActionId: "test-path",
    });
  }

  const actionById = Object.fromEntries(
    roadmapTemplates.map((action) => [action.id, action]),
  );
  const nextActions = findings
    .map((finding) => actionById[finding.nextActionId])
    .filter(Boolean)
    .filter((action, index, actions) => {
      return actions.findIndex((item) => item.id === action.id) === index;
    })
    .slice(0, 3);

  return {
    createdAt: new Date().toISOString(),
    agAudit,
    gpaEstimate,
    findings,
    nextActions,
    disclaimer:
      "This snapshot organizes preparation questions. It does not predict admission or decide where the student should apply.",
  };
}

export function buildCounselorQuestions(snapshot, baseline = {}) {
  const questions = [];
  const unresolvedCategories = snapshot.agAudit.categories.filter(
    (category) => category.unresolvedYears > 0,
  );
  const gapCategories = snapshot.agAudit.categories.filter(
    (category) => category.status === "possible_gap",
  );

  for (const category of unresolvedCategories) {
    questions.push({
      id: `verify-${category.id}`,
      topic: "A-G verification",
      question: `Can we confirm whether my course counts for UC A-G category ${category.id.toUpperCase()} (${category.name})?`,
      reason: "Unknown classifications should stay unresolved until the official school A-G list or counselor confirms them.",
    });
  }

  if (gapCategories.length > 0) {
    questions.push({
      id: "plan-ag-gaps",
      topic: "Course planning",
      question: `Which current or senior-year courses would cover these possible A-G gaps: ${gapCategories
        .map((category) => `${category.id.toUpperCase()} ${category.name}`)
        .join(", ")}?`,
      reason: "Possible gaps are planning prompts, not automatic failures.",
    });
  }

  if (baseline.seniorMathPlan === "not-sure") {
    questions.push({
      id: "senior-math-plan",
      topic: "Senior-year math",
      question:
        "Given my current math path, intended program interests, and workload, which senior-year math option should I consider?",
      reason: "The plan should balance readiness, available school options, mastery, and sustainability.",
    });
  }

  if (snapshot.gpaEstimate.estimatedGpa !== null) {
    questions.push({
      id: "gpa-assumptions",
      topic: "UC GPA estimate",
      question:
        "Are the courses and honors points I included in this UC GPA estimate consistent with UC rules for my school and residency?",
      reason: "The estimate is only useful when the included courses and honors assumptions are correct.",
    });
  }

  return questions.slice(0, 5);
}

export function buildFirstActionPlan(snapshot, roadmapPeriods = []) {
  const periodById = Object.fromEntries(
    roadmapPeriods.map((period) => [period.id, period]),
  );

  return snapshot.nextActions.map((action) => ({
    ...action,
    periodTitle: periodById[action.period]?.title ?? "Next planning window",
    selected: true,
  }));
}

export function buildApplicationMilestonePreview(applicationMilestones = {}) {
  const milestones = Array.isArray(applicationMilestones.milestones)
    ? applicationMilestones.milestones
    : [];

  return milestones.slice(0, 4).map((milestone) => ({
    id: milestone.id,
    timing: milestone.expectedTiming,
    status: milestone.status,
    action: milestone.action,
    officialDate: milestone.officialDate,
  }));
}
