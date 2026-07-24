import { mkdir, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";

const root = process.cwd();
const contentRoot = join(root, "content");
const verified = "2026-07-23";
const reviewDue = "2027-07-01";
const contentVersion = "1.0.0";
const schemaVersion = "1.0.0";
const owner = "family_content_editor";

const meta = (extra = {}) => ({
  schemaVersion,
  contentVersion,
  lastVerified: verified,
  nextReviewDue: reviewDue,
  maintenanceOwnerRole: owner,
  ...extra,
});

const collection = (records, extra = {}) => ({ meta: meta(extra), records });

const source = (id, title, publisher, url, sourceType, extra = {}) => ({
  id,
  title,
  publisher,
  url,
  sourceType,
  lastVerified: verified,
  nextReviewDue: reviewDue,
  maintenanceOwnerRole: owner,
  ...extra,
});

const sources = [
  source("uc-first-year-requirements", "First-year requirements", "University of California Admissions", "https://admission.universityofcalifornia.edu/admission-requirements/first-year-requirements/", "official_uc", { effectiveTerm: "Current as of 2026-07-23" }),
  source("uc-ag-requirements", "A–G subject requirements", "University of California Admissions", "https://admission.universityofcalifornia.edu/admission-requirements/first-year-requirements/subject-requirement-a-g.html", "official_uc", { effectiveTerm: "Current as of 2026-07-23" }),
  source("uc-gpa-requirement", "GPA requirement and calculation", "University of California Admissions", "https://admission.universityofcalifornia.edu/admission-requirements/first-year-requirements/gpa-requirement.html", "official_uc", { effectiveTerm: "Current as of 2026-07-23" }),
  source("uc-comprehensive-review", "How first-year applications are reviewed", "University of California Admissions", "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/how-applications-are-reviewed.html", "official_uc"),
  source("uc-piq", "Personal insight questions", "University of California Admissions", "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/personal-insight-questions.html", "official_uc"),
  source("uc-dates", "First-year dates and deadlines", "University of California Admissions", "https://admission.universityofcalifornia.edu/how-to-apply/applying-as-a-first-year/dates-and-deadlines.html", "official_uc", { notes: "The fall 2028 enrollment cycle was not yet published when verified. Do not infer 2027 deadlines." }),
  source("uc-major-checker", "Check majors", "University of California Admissions", "https://admission.universityofcalifornia.edu/campuses-majors/majors/", "official_uc", { effectiveTerm: "Fall 2026 search available when verified" }),
  source("uc-admit-data", "First-year admit data", "University of California Admissions", "https://admission.universityofcalifornia.edu/campuses-majors/first-year-admit-data.html", "official_uc", { publishedOrUpdated: "2025-06", effectiveTerm: "Fall 2025", notes: "Campus data are general guides, not predictions. Grouped college data may mask differences among majors." }),
  source("uc-cost", "Tuition and cost of attendance", "University of California Admissions", "https://admission.universityofcalifornia.edu/tuition-financial-aid/tuition-cost-of-attendance/", "official_uc"),
  source("uc-aid", "Estimate your aid", "University of California Admissions", "https://admission.universityofcalifornia.edu/tuition-financial-aid/estimate-your-aid.html", "official_uc"),
  source("uc-calendar", "Campus academic calendars", "University of California Office of the President", "https://www.ucop.edu/academic-personnel-programs/compensation/academic-pay-schedules/campus-academic-calendars.html", "official_uc"),
  source("uc-application-guide", "Presenting yourself on the UC application: first year", "University of California Admissions", "https://admission.universityofcalifornia.edu/counselors/_files/documents/presenting-yourself-on-the-uc-application-first-year.pdf", "official_uc", { publishedOrUpdated: "2025" }),
  source("catalog-berkeley", "UC Berkeley undergraduate degree programs", "University of California, Berkeley", "https://catalog.berkeley.edu/undergraduate/degree-programs/", "campus_catalog", { effectiveTerm: "2026-27 or current catalog" }),
  source("catalog-davis", "UC Davis departments, programs, and degrees", "University of California, Davis", "https://catalog.ucdavis.edu/departments-programs-degrees/", "campus_catalog", { effectiveTerm: "2026-27" }),
  source("catalog-irvine", "UC Irvine undergraduate majors and minors", "University of California, Irvine", "https://catalogue.uci.edu/undergraduatedegrees/", "campus_catalog", { effectiveTerm: "2026-27 or current catalog" }),
  source("catalog-ucla", "UCLA General Catalog", "University of California, Los Angeles", "https://catalog.registrar.ucla.edu/", "campus_catalog", { effectiveTerm: "2026-27" }),
  source("catalog-merced", "UC Merced majors, minors, and programs", "University of California, Merced", "https://admissions.ucmerced.edu/academics/majors-minors", "campus_catalog", { effectiveTerm: "Current as of 2026-07-23" }),
  source("catalog-riverside", "UC Riverside majors", "University of California, Riverside", "https://admissions.ucr.edu/majors", "campus_catalog", { effectiveTerm: "2026-27 or current catalog" }),
  source("catalog-san-diego", "UC San Diego undergraduate degrees offered", "University of California, San Diego", "https://catalog.ucsd.edu/undergraduate/degrees-offered/index.html", "campus_catalog", { effectiveTerm: "2026-27 or current catalog" }),
  source("catalog-santa-barbara", "UC Santa Barbara programs", "University of California, Santa Barbara", "https://catalog.ucsb.edu/programs", "campus_catalog", { effectiveTerm: "2025-26/current catalog" }),
  source("catalog-santa-cruz", "UC Santa Cruz bachelor's degrees", "University of California, Santa Cruz", "https://catalog.ucsc.edu/en/current/general-catalog/academic-programs/bachelors-degrees/", "campus_catalog", { effectiveTerm: "2025-26/current catalog" }),
  ...[
    ["berkeley", "Berkeley"], ["davis", "Davis"], ["irvine", "Irvine"], ["ucla", "UCLA"],
    ["merced", "Merced"], ["riverside", "Riverside"], ["san-diego", "San Diego"],
    ["santa-barbara", "Santa Barbara"], ["santa-cruz", "Santa Cruz"],
  ].map(([slug, name]) => source(`uc-admit-${slug}`, `${name}: first-year admit data`, "University of California Admissions", `https://admission.universityofcalifornia.edu/campuses-majors/${slug}/first-year-admit-data.html`, "official_uc", { publishedOrUpdated: "2025-06", effectiveTerm: "Fall 2025", notes: "Campus-wide data only; not a major-level rate and not an admission prediction." })),
  source("aamc-admission-requirements", "Medical school admission requirements", "Association of American Medical Colleges", "https://students-residents.aamc.org/medical-school-admission-requirements/admission-requirements", "professional_association"),
  source("aamc-premed-competencies", "Premed competencies for entering medical students", "Association of American Medical Colleges", "https://students-residents.aamc.org/real-stories-demonstrating-premed-competencies/premed-competencies-entering-medical-students", "professional_association", { publishedOrUpdated: "2026" }),
  source("aamc-med-timeline", "Timeline for application and admission to medical school", "Association of American Medical Colleges", "https://students-residents.aamc.org/applying-medical-school/timeline-application-and-admission-medical-school", "professional_association"),
  source("aamc-med-school", "What to expect in medical school", "Association of American Medical Colleges", "https://students-residents.aamc.org/choosing-medical-career/what-expect-medical-school", "professional_association"),
  source("aamc-training-years", "Medical education pathway and well-being", "Association of American Medical Colleges", "https://students-residents.aamc.org/medical-student-well-being/arrival-fallacy-medical-education-and-pursuit-happiness", "professional_association", { notes: "AAMC student perspective describing four years college, four years medical school, 3–7 years residency, and possible fellowship." }),
  source("aapa-pa-path", "Become a PA", "American Academy of Physician Associates", "https://www.aapa.org/career-central/become-a-pa/", "professional_association"),
  source("bls-physicians", "Physicians and surgeons", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/healthcare/physicians-and-surgeons.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-physician-assistants", "Physician assistants", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/healthcare/physician-assistants.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-epidemiologists", "Epidemiologists", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/life-physical-and-social-science/epidemiologists.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-statisticians", "Mathematicians and statisticians", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/math/mathematicians-and-statisticians.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-medical-scientists", "Medical scientists", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/life-physical-and-social-science/medical-scientists.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-data-scientists", "Data scientists", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/math/data-scientists.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-or-analysts", "Operations research analysts", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/math/operations-research-analysts.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-biomedical-engineers", "Bioengineers and biomedical engineers", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/architecture-and-engineering/biomedical-engineers.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("bls-health-managers", "Medical and health services managers", "U.S. Bureau of Labor Statistics", "https://www.bls.gov/ooh/management/medical-and-health-services-managers.htm", "government", { publishedOrUpdated: "2025-08-28", effectiveTerm: "2024 employment and wages; 2024–34 projections" }),
  source("onet-bioinformatics", "Bioinformatics scientists", "O*NET OnLine", "https://www.onetonline.org/link/details/19-1029.01", "government", { publishedOrUpdated: "2026" }),
  source("onet-genetic-counselors", "Genetic counselors", "O*NET OnLine", "https://www.onetonline.org/link/summary/29-9092.00", "government", { publishedOrUpdated: "2026" }),
  source("onet-human-factors", "Human factors engineers and ergonomists", "O*NET OnLine", "https://www.onetonline.org/link/summary/17-2112.01", "government", { publishedOrUpdated: "2026" }),
  source("onet-health-informatics", "Health informatics specialists", "O*NET OnLine", "https://www.onetonline.org/link/details/15-1211.01", "government", { publishedOrUpdated: "2026" }),
  source("wef-future-jobs", "Future of Jobs Report 2025", "World Economic Forum", "https://www.weforum.org/publications/the-future-of-jobs-report-2025/digest/", "forecast", { publishedOrUpdated: "2025", notes: "Employer forecast only; do not present as certainty." }),
  source("nih-sickle-cell", "Sickle cell disease", "MedlinePlus Genetics, U.S. National Library of Medicine", "https://medlineplus.gov/genetics/condition/sickle-cell-disease/", "government"),
  source("nih-lungs", "How the lungs work", "National Heart, Lung, and Blood Institute", "https://www.nhlbi.nih.gov/health/lungs", "government", { publishedOrUpdated: "2022-03-24" }),
  source("ncbi-co2-buffer", "Physiology, carbon dioxide transport", "NCBI Bookshelf, U.S. National Library of Medicine", "https://www.ncbi.nlm.nih.gov/books/NBK532988/", "research", { publishedOrUpdated: "2023-07-04" }),
];

const programFamilies = [
  ["computing-data-ai", "Computing, data, and AI", "Use computation, statistics, and data to understand systems and support decisions.", ["data-science", "statistics"]],
  ["engineering-physical-systems", "Engineering and physical systems", "Design, test, and improve devices, processes, and physical systems.", ["bioengineering", "operations-research"]],
  ["biology-life-sciences", "Biology and life sciences", "Study living systems from molecules and cells to organisms and ecosystems.", ["biology", "biochemistry"]],
  ["medicine-health-public-health", "Medicine, health, and public health", "Improve health through patient care, prevention, systems, research, and policy.", ["public-health"]],
  ["psych-neuro-cognitive", "Psychology, neuroscience, and cognitive science", "Study mind, brain, behavior, learning, and interaction with technology.", ["cognitive-science"]],
  ["math-stat-physical", "Mathematics, statistics, and physical sciences", "Build and apply abstract and quantitative models.", ["statistics", "operations-research"]],
  ["economics-business-operations", "Economics, business, and operations", "Study choices, incentives, organizations, and resource allocation.", ["operations-research"]],
  ["environment-climate-agriculture", "Environment, climate, and agriculture", "Understand and improve natural and human environmental systems.", []],
  ["social-government-policy", "Social sciences, government, and public policy", "Study people, institutions, communities, and policy choices.", ["public-health"]],
  ["humanities-languages-philosophy", "Humanities, languages, and philosophy", "Interpret human experience, ideas, values, language, and culture.", []],
  ["design-media-arts", "Design, media, and the arts", "Create experiences, communications, and expressive work.", []],
  ["education-human-development", "Education and human development", "Understand learning and help people develop across settings and life stages.", ["cognitive-science"]],
].map(([id, name, summary, featuredProgramIds], index) => ({
  id,
  slug: id,
  name,
  summary,
  featuredProgramIds,
  order: index + 1,
  sourceIds: [],
  ...meta(),
}));

const intensity = (mathematics, coding, laboratory, writing, memorization, abstractTheory, teamwork, peopleInteraction) => ({
  mathematics, coding, laboratory, writing, memorization, abstractTheory, teamwork, peopleInteraction,
});

const prep = (label, text) => ({ label, text });

const programs = [
  {
    id: "biology", slug: "biology", name: "Biology", familyIds: ["biology-life-sciences", "medicine-health-public-health"],
    summary: "Biology investigates how living systems work, change, interact, and respond—from molecules and cells to organisms and ecosystems.",
    coreQuestions: ["How do cells maintain life?", "How do genes and environments shape traits?", "How do organisms and ecosystems change over time?"],
    typicalWork: ["Plan and interpret experiments", "Analyze biological evidence", "Learn mechanisms and terminology", "Write lab reports and scientific explanations"],
    representativeCourses: ["Cell biology", "Genetics", "Evolution", "Ecology", "Physiology", "Laboratory methods"],
    commonAssignments: ["Laboratory reports", "Evidence-based explanations", "Data interpretation", "Research-paper reading"],
    intensities: intensity(3, 2, 5, 3, 4, 3, 3, 2),
    codingReality: "Coding is not usually the center of a general biology major, but data analysis and computational tools increasingly appear in research and advanced courses.",
    rewarding: ["Connecting mechanisms across levels of life", "Hands-on discovery", "Applying science to health or environment"],
    frustrating: ["Large vocabulary", "Experiments that fail or produce ambiguous results", "Graduate education is common for independent research careers"],
    mayEnjoy: ["Asking why living systems behave as they do", "Combining observation with evidence", "Learning through labs and diagrams"],
    adjacentProgramIds: ["biochemistry", "public-health", "bioengineering"],
    careerIds: ["physician", "epidemiologist", "bioinformatics-scientist", "genetic-counselor"],
    premedCompatibility: { level: "high", note: "Many requirements overlap, but the major itself does not guarantee completion of every medical-school prerequisite." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "Complete the UC A–G science requirement."), prep("recommended_academic_preparation", "If offered and sustainable, continue biology and chemistry and build quantitative confidence."), prep("optional_exploration", "Try a short lab, ecology observation, genetics case, or research conversation."), prep("verify_with_counselor_or_institution", "Confirm each high-school course's A–G category on the official course list.")],
    tryNow: [{ id: "try-biology-genetics", title: "Trace a DNA change to a protein and cell effect", minutes: 8 }],
    sourceIds: ["catalog-davis", "catalog-san-diego", "nih-sickle-cell"],
  },
  {
    id: "biochemistry", slug: "biochemistry", name: "Biochemistry", familyIds: ["biology-life-sciences", "math-stat-physical"],
    summary: "Biochemistry studies the molecular reactions and structures that make life possible, connecting chemistry with cell biology and medicine.",
    coreQuestions: ["How do proteins and enzymes work?", "How do cells store and use energy?", "How can molecular changes lead to disease?"],
    typicalWork: ["Reason about molecular structure and reactions", "Run chemistry and biology laboratories", "Interpret spectra, assays, and experimental data"],
    representativeCourses: ["General and organic chemistry", "Biochemistry", "Molecular biology", "Physical chemistry", "Analytical or laboratory methods"],
    commonAssignments: ["Mechanism problems", "Quantitative problem sets", "Laboratory notebooks and reports", "Molecular-model interpretation"],
    intensities: intensity(4, 2, 5, 3, 4, 4, 3, 1),
    codingReality: "Programming is not usually central, but computation is increasingly used for molecular modeling, genomics, and laboratory data.",
    rewarding: ["Explaining health and disease at a molecular level", "Integrating chemistry and biology", "Precise laboratory investigation"],
    frustrating: ["Dense prerequisite chains", "Heavy lab schedules", "Simultaneous conceptual and memorization demands"],
    mayEnjoy: ["Chemistry reactions and biological mechanisms", "Detailed causal explanations", "Laboratory measurement"],
    adjacentProgramIds: ["biology", "bioengineering", "data-science"],
    careerIds: ["physician", "bioinformatics-scientist", "biomedical-engineer"],
    premedCompatibility: { level: "high", note: "Substantial prerequisite overlap is common, but requirements vary by medical school." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "Complete UC A–G laboratory science requirements."), prep("recommended_academic_preparation", "Continue chemistry and mathematics if available and sustainable; biology is also useful."), prep("optional_exploration", "Model enzyme behavior or investigate how pH affects a biological system."), prep("verify_with_counselor_or_institution", "Verify A–G certification and senior-course prerequisites.")],
    tryNow: [{ id: "try-biochem-buffer", title: "Explore carbon dioxide and the blood buffer system", minutes: 8 }],
    sourceIds: ["catalog-ucla", "catalog-santa-barbara", "ncbi-co2-buffer"],
  },
  {
    id: "data-science", slug: "data-science", name: "Data Science", familyIds: ["computing-data-ai", "math-stat-physical"],
    summary: "Data science combines statistics, programming, data management, and domain knowledge to draw defensible conclusions from data.",
    coreQuestions: ["What can the data support?", "How uncertain is a conclusion?", "How can messy information become a useful model?"],
    typicalWork: ["Clean and organize data", "Write code for analysis", "Build and evaluate statistical or machine-learning models", "Explain limitations"],
    representativeCourses: ["Programming", "Calculus", "Linear algebra", "Probability", "Statistics", "Machine learning", "Data ethics"],
    commonAssignments: ["Coding notebooks", "Model comparisons", "Data projects", "Written interpretation and presentations"],
    intensities: intensity(5, 5, 1, 3, 2, 4, 4, 2),
    codingReality: "Meaningful programming is a core part of most data-science degrees and jobs. AI can assist with code, but students still need to understand, test, debug, and defend analyses.",
    rewarding: ["Finding structure in messy evidence", "Applying quantitative tools across domains", "Turning analysis into decisions"],
    frustrating: ["Debugging", "Ambiguous or biased data", "Pressure to explain uncertainty to people who want a simple answer"],
    mayEnjoy: ["Statistics and modeling", "Open-ended problem solving", "Using evidence across biology, health, business, or policy"],
    adjacentProgramIds: ["statistics", "operations-research", "cognitive-science"],
    careerIds: ["data-scientist", "clinical-data-scientist", "operations-research-analyst", "bioinformatics-scientist"],
    premedCompatibility: { level: "possible_with_planning", note: "It can build valuable quantitative skills, but science laboratories and other prerequisites often require additional scheduling." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "Meet UC A–G mathematics requirements; coding is not a systemwide UC eligibility requirement."), prep("recommended_academic_preparation", "Continue mathematics and, if willing, try a small data analysis using a beginner-friendly language or spreadsheet."), prep("optional_exploration", "Analyze a small health or biology dataset and explain one limitation."), prep("verify_with_counselor_or_institution", "Check whether a campus admits directly to the major and whether switching is constrained.")],
    tryNow: [{ id: "try-data-evidence", title: "Compare two explanations for a small health dataset", minutes: 8 }],
    sourceIds: ["catalog-berkeley", "bls-data-scientists", "wef-future-jobs"],
  },
  {
    id: "statistics", slug: "statistics", name: "Statistics", familyIds: ["math-stat-physical", "computing-data-ai"],
    summary: "Statistics develops methods for learning from variable and incomplete data while measuring uncertainty.",
    coreQuestions: ["How should evidence be collected?", "What pattern could be chance?", "How confident should a conclusion be?"],
    typicalWork: ["Design studies", "Build probability models", "Estimate effects", "Test assumptions", "Communicate uncertainty"],
    representativeCourses: ["Calculus", "Linear algebra", "Probability", "Statistical inference", "Regression", "Experimental design"],
    commonAssignments: ["Proofs and problem sets", "Statistical computing", "Study critiques", "Applied analysis reports"],
    intensities: intensity(5, 4, 1, 3, 2, 5, 3, 2),
    codingReality: "Statistical computing is common. The emphasis is usually on analysis and reasoning rather than building software products.",
    rewarding: ["Separating signal from noise", "Working across medicine, science, policy, and business", "Making uncertainty explicit"],
    frustrating: ["Abstract probability", "Subtle assumptions", "Results that remain uncertain after careful work"],
    mayEnjoy: ["Mathematical reasoning", "Designing fair comparisons", "Questioning claims made from data"],
    adjacentProgramIds: ["data-science", "operations-research", "public-health"],
    careerIds: ["biostatistician", "data-scientist", "epidemiologist", "operations-research-analyst"],
    premedCompatibility: { level: "possible_with_planning", note: "Statistics supports research and evidence literacy; laboratory science prerequisites must be scheduled separately." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "Meet UC A–G mathematics requirements using courses certified for the applicable term."), prep("recommended_academic_preparation", "Continue mathematics through the strongest sustainable sequence available."), prep("optional_exploration", "Critique a study or design a fair experiment."), prep("verify_with_counselor_or_institution", "Because UC math-course classification guidance changes, verify the school's certified course list.")],
    tryNow: [{ id: "try-statistics-study", title: "Spot bias in a study design", minutes: 7 }],
    sourceIds: ["catalog-santa-barbara", "bls-statisticians", "uc-ag-requirements"],
  },
  {
    id: "cognitive-science", slug: "cognitive-science", name: "Cognitive Science", familyIds: ["psych-neuro-cognitive", "computing-data-ai"],
    summary: "Cognitive science studies mind and intelligence using psychology, neuroscience, linguistics, philosophy, computation, and experimental methods.",
    coreQuestions: ["How do people perceive, learn, remember, and decide?", "How can mental processes be tested?", "How do people interact with technology?"],
    typicalWork: ["Design behavioral studies", "Analyze data", "Read competing theories", "Model cognition", "Conduct user or laboratory research"],
    representativeCourses: ["Cognitive psychology", "Neuroscience", "Research methods", "Statistics", "Linguistics", "Computation or philosophy"],
    commonAssignments: ["Experiment reports", "Theory comparisons", "Data analysis", "Research presentations"],
    intensities: intensity(3, 3, 2, 4, 3, 4, 4, 4),
    codingReality: "Coding varies by track. Computational cognition and data-heavy research can involve substantial programming; human-centered tracks may involve less.",
    rewarding: ["Connecting biology, behavior, and technology", "Designing studies about people", "Multiple ways to approach one question"],
    frustrating: ["Interdisciplinary breadth can feel diffuse", "Human evidence is noisy", "Some career paths require graduate training"],
    mayEnjoy: ["Psychology and biology together", "Asking how people think", "Research with human participants or behavior data"],
    adjacentProgramIds: ["biology", "data-science", "statistics"],
    careerIds: ["ux-researcher", "data-scientist", "physician"],
    premedCompatibility: { level: "possible_with_planning", note: "Behavioral and neuroscience courses may be relevant, but chemistry, physics, biology, and laboratory prerequisites require deliberate scheduling." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "No cognitive-science-specific course is a systemwide UC eligibility requirement."), prep("recommended_academic_preparation", "Continue mathematics; biology, psychology, writing, or computer science can each be useful depending on the track."), prep("optional_exploration", "Run a simple memory or perception study without collecting identifying data."), prep("verify_with_counselor_or_institution", "Compare BA and BS requirements and campus-specific admission context.")],
    tryNow: [{ id: "try-cognition-memory", title: "Design a fair memory comparison", minutes: 8 }],
    sourceIds: ["catalog-irvine", "catalog-merced", "onet-human-factors"],
  },
  {
    id: "public-health", slug: "public-health", name: "Public Health", familyIds: ["medicine-health-public-health", "social-government-policy"],
    summary: "Public health improves the health of populations through prevention, evidence, community partnership, policy, and health systems.",
    coreQuestions: ["Why do health outcomes differ across groups and places?", "Which prevention strategy works?", "How should limited resources be used?"],
    typicalWork: ["Analyze population data", "Design and evaluate programs", "Study social and environmental causes", "Communicate with communities and policymakers"],
    representativeCourses: ["Epidemiology", "Biostatistics", "Environmental health", "Health policy", "Behavioral science", "Program evaluation"],
    commonAssignments: ["Community or policy briefs", "Data interpretation", "Program plans", "Group projects"],
    intensities: intensity(3, 2, 1, 5, 3, 3, 5, 5),
    codingReality: "Coding varies. Epidemiology and biostatistics tracks can use R, Python, SAS, or similar tools; policy and community tracks may use less.",
    rewarding: ["Preventing problems at scale", "Combining evidence and human context", "Working across science, policy, and community needs"],
    frustrating: ["Outcomes depend on complex systems", "Policy change can be slow", "Entry roles vary and graduate education is common for specialized work"],
    mayEnjoy: ["Health plus statistics or policy", "Systems thinking", "Community-level problem solving"],
    adjacentProgramIds: ["biology", "statistics", "operations-research"],
    careerIds: ["epidemiologist", "public-health-analyst", "healthcare-operations-analyst", "biostatistician"],
    premedCompatibility: { level: "possible_with_planning", note: "The major offers useful population-health perspective, but medical-school science prerequisites may not all be included." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "Meet the general UC A–G requirements; public health has no systemwide high-school prerequisite."), prep("recommended_academic_preparation", "Build biology, statistics, writing, and social-science skills within a sustainable schedule."), prep("optional_exploration", "Investigate a local health pattern using public, non-identifying data."), prep("verify_with_counselor_or_institution", "Some campus public-health majors require later application or are selective; verify the current policy.")],
    tryNow: [{ id: "try-public-health", title: "Choose evidence for a fictional prevention program", minutes: 8 }],
    sourceIds: ["catalog-san-diego", "catalog-ucla", "bls-epidemiologists"],
  },
  {
    id: "bioengineering", slug: "bioengineering", name: "Bioengineering", familyIds: ["engineering-physical-systems", "biology-life-sciences", "medicine-health-public-health"],
    summary: "Bioengineering applies engineering, mathematics, computing, and biology to devices, diagnostics, therapeutics, and biological systems.",
    coreQuestions: ["How can a device measure or support the body?", "How can biological systems be modeled or redesigned?", "How do safety and design tradeoffs interact?"],
    typicalWork: ["Solve engineering problem sets", "Build and test prototypes", "Run laboratories", "Model systems", "Work in design teams"],
    representativeCourses: ["Calculus", "Physics", "Chemistry", "Biology", "Programming", "Circuits or mechanics", "Physiology", "Design"],
    commonAssignments: ["Engineering calculations", "Laboratory reports", "Prototype and capstone projects", "Team presentations"],
    intensities: intensity(5, 3, 4, 3, 3, 4, 5, 2),
    codingReality: "Most programs include some programming or computational modeling, although it is one tool among mathematics, physical science, biology, and design.",
    rewarding: ["Creating tangible health technology", "Combining multiple sciences", "Team-based design"],
    frustrating: ["Dense prerequisite load", "Less room for electives", "Design must satisfy safety, cost, regulatory, and technical constraints"],
    mayEnjoy: ["Math and biology together", "Building and testing", "Solving constrained real-world problems"],
    adjacentProgramIds: ["biology", "biochemistry", "operations-research"],
    careerIds: ["biomedical-engineer", "physician", "bioinformatics-scientist"],
    premedCompatibility: { level: "possible_but_demanding", note: "It can prepare students well scientifically, but the engineering workload and medical-school prerequisites require careful planning." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "Meet UC A–G requirements; campus engineering admission policies may differ."), prep("recommended_academic_preparation", "Continue mathematics, chemistry, biology, and physics when available and sustainable."), prep("optional_exploration", "Redesign a simple health-monitoring device around a user need."), prep("verify_with_counselor_or_institution", "Verify direct-admission and change-of-major constraints before using an alternate-major strategy.")],
    tryNow: [{ id: "try-bioengineering", title: "Compare two sensor designs for a fictional patient need", minutes: 9 }],
    sourceIds: ["catalog-san-diego", "catalog-merced", "bls-biomedical-engineers"],
  },
  {
    id: "operations-research", slug: "operations-research", name: "Operations Research and Systems Analytics", familyIds: ["engineering-physical-systems", "math-stat-physical", "economics-business-operations"],
    summary: "Operations research uses mathematical models, optimization, simulation, and data to improve decisions in complex systems.",
    coreQuestions: ["How should scarce resources be allocated?", "What schedule or route works best?", "How robust is a decision when conditions change?"],
    typicalWork: ["Build optimization models", "Simulate systems", "Analyze tradeoffs", "Work with decision makers", "Translate constraints into mathematics"],
    representativeCourses: ["Calculus", "Linear algebra", "Probability", "Optimization", "Simulation", "Programming", "Economics"],
    commonAssignments: ["Modeling problem sets", "Coding projects", "Case analyses", "Team presentations"],
    intensities: intensity(5, 4, 1, 3, 2, 5, 4, 3),
    codingReality: "Programming is commonly used to solve models and analyze scenarios, but the role centers on decisions and systems rather than software development.",
    rewarding: ["Finding practical improvements", "Clear tradeoffs and constraints", "Applications in healthcare, transport, supply chains, policy, and business"],
    frustrating: ["Real constraints are messy", "Models simplify reality", "Stakeholders may value competing outcomes"],
    mayEnjoy: ["Mathematical puzzles with practical consequences", "Systems thinking", "Explaining recommendations"],
    adjacentProgramIds: ["statistics", "data-science", "bioengineering"],
    careerIds: ["operations-research-analyst", "healthcare-operations-analyst", "data-scientist"],
    premedCompatibility: { level: "possible_with_substantial_planning", note: "The major can support healthcare systems work, but premed laboratory sciences are usually outside the core." },
    highSchoolPreparation: [prep("uc_eligibility_requirement", "Meet UC A–G mathematics requirements."), prep("recommended_academic_preparation", "Continue mathematics and practice translating real situations into constraints and tradeoffs."), prep("optional_exploration", "Optimize a fictional clinic schedule with competing goals."), prep("verify_with_counselor_or_institution", "The field may appear under industrial engineering, analytics, applied mathematics, or management science; compare exact curricula.")],
    tryNow: [{ id: "try-or-clinic", title: "Improve a fictional clinic schedule", minutes: 8 }],
    sourceIds: ["catalog-berkeley", "bls-or-analysts"],
  },
].map((record) => ({ ...record, ...meta() }));

const labor = (socCode, medianAnnualUsd, growthPercent, education, sourceIds, extra = {}) => ({
  socCode,
  baseYear: 2024,
  projectionEndYear: 2034,
  medianAnnualUsd,
  growthPercent,
  typicalEntryEducation: education,
  geography: "United States",
  sourceIds,
  ...extra,
});

const careers = [
  {
    id: "physician", slug: "physician", name: "Physician", summary: "Physicians diagnose, treat, and help prevent illness while carrying responsibility for complex decisions and patient communication.",
    typicalWeek: ["Review histories and symptoms", "Examine patients", "Interpret tests", "Discuss options and uncertainty", "Document care", "Coordinate with healthcare teams"],
    workEnvironment: ["Clinics", "Hospitals", "Community health settings", "Research, government, or industry roles"],
    intensities: { quantitative: 3, coding: 1, writing: 4, laboratory: 2, peopleInteraction: 5, emotionalLoad: 5 },
    educationPath: "Usually four years of college, four years of medical school, and roughly 3–7 or more years of residency depending on specialty; fellowship may add training.",
    relatedProgramIds: ["biology", "biochemistry", "cognitive-science", "public-health", "bioengineering", "data-science", "statistics"],
    adjacentCareerIds: ["physician-assistant", "genetic-counselor", "epidemiologist"],
    laborData: labor("29-1210", 239200, 3, "Doctoral or professional degree plus residency", ["bls-physicians"], { medianQualifier: "at_least" }),
    aiImpact: { routineTasks: ["Drafting notes", "Information retrieval", "Administrative triage"], augmentedTasks: ["Imaging and pattern review", "Decision support", "Patient monitoring"], humanCenter: ["Accountability", "Physical examination and procedures", "Trust", "Context-sensitive judgment"], confidence: "medium" },
    tryNow: "Compare evidence in a fictional case, then reflect on whether uncertainty and patient communication feel engaging.",
    sourceIds: ["bls-physicians", "aamc-training-years", "aamc-med-school"],
  },
  {
    id: "physician-assistant", slug: "physician-assistant", name: "Physician Assistant", summary: "PAs examine, diagnose, and treat patients in physician-led or collaborative healthcare teams, with scope varying by state and setting.",
    typicalWeek: ["Obtain histories", "Examine patients", "Order and interpret tests", "Treat and educate patients", "Coordinate with physicians and other clinicians"],
    workEnvironment: ["Physician offices", "Hospitals", "Outpatient clinics", "Surgical and specialty settings"],
    intensities: { quantitative: 2, coding: 1, writing: 4, laboratory: 2, peopleInteraction: 5, emotionalLoad: 5 },
    educationPath: "A bachelor's degree and patient-care experience are common before an accredited PA master's program, typically about 27 months, followed by certification and state licensure.",
    relatedProgramIds: ["biology", "biochemistry", "public-health"],
    adjacentCareerIds: ["physician", "genetic-counselor"],
    laborData: labor("29-1071", 133260, 20, "Master's degree", ["bls-physician-assistants"]),
    aiImpact: { routineTasks: ["Documentation", "Scheduling support", "Reference lookup"], augmentedTasks: ["Clinical decision support", "Remote monitoring"], humanCenter: ["Hands-on care", "Communication", "Team accountability"], confidence: "medium" },
    tryNow: "Interview or observe a PA through an approved school or family connection and compare the role with a physician.",
    sourceIds: ["bls-physician-assistants", "aapa-pa-path"],
  },
  {
    id: "epidemiologist", slug: "epidemiologist", name: "Epidemiologist", summary: "Epidemiologists study patterns and causes of disease and injury in populations and evaluate ways to prevent harm.",
    typicalWeek: ["Design or review studies", "Analyze surveillance data", "Investigate outbreaks", "Write reports", "Coordinate with public agencies or health systems"],
    workEnvironment: ["Government", "Universities", "Hospitals", "Research organizations", "Occasional field response"],
    intensities: { quantitative: 4, coding: 3, writing: 4, laboratory: 1, peopleInteraction: 4, emotionalLoad: 3 },
    educationPath: "A master's degree in public health, epidemiology, or a related field is typical; some roles require a doctoral or medical degree.",
    relatedProgramIds: ["public-health", "statistics", "biology", "data-science"],
    adjacentCareerIds: ["biostatistician", "public-health-analyst", "physician"],
    laborData: labor("19-1041", 83980, 16, "Master's degree", ["bls-epidemiologists"]),
    aiImpact: { routineTasks: ["Data cleaning", "Report templates", "Signal screening"], augmentedTasks: ["Surveillance anomaly detection", "Literature synthesis", "Forecast scenarios"], humanCenter: ["Study design", "Causal judgment", "Public communication", "Ethics"], confidence: "medium" },
    tryNow: "Use a small fictional outbreak table to decide which additional evidence matters.",
    sourceIds: ["bls-epidemiologists"],
  },
  {
    id: "biostatistician", slug: "biostatistician", name: "Biostatistician", summary: "Biostatisticians design studies and analyze health and biological data while making uncertainty and limitations explicit.",
    typicalWeek: ["Plan experiments or trials", "Write analysis code", "Check assumptions", "Meet with scientists or clinicians", "Explain results"],
    workEnvironment: ["Pharmaceutical and biotech firms", "Universities", "Hospitals", "Government", "Research organizations"],
    intensities: { quantitative: 5, coding: 4, writing: 4, laboratory: 1, peopleInteraction: 3, emotionalLoad: 2 },
    educationPath: "A master's degree is typical for many statistician roles; research leadership often favors doctoral training.",
    relatedProgramIds: ["statistics", "data-science", "public-health", "biology"],
    adjacentCareerIds: ["epidemiologist", "data-scientist", "bioinformatics-scientist"],
    laborData: labor("15-2041", 103300, 9, "Master's degree typical; some bachelor's-entry roles", ["bls-statisticians"]),
    aiImpact: { routineTasks: ["Code scaffolding", "Standard tables", "Diagnostic summaries"], augmentedTasks: ["Model exploration", "Reproducibility checks"], humanCenter: ["Study design", "Method choice", "Regulatory explanation", "Uncertainty"], confidence: "medium" },
    tryNow: "Design a fair comparison for a fictional treatment study and list possible confounders.",
    sourceIds: ["bls-statisticians"],
  },
  {
    id: "bioinformatics-scientist", slug: "bioinformatics-scientist", name: "Bioinformatics Scientist", summary: "Bioinformatics scientists develop and use computational methods to analyze genomic, molecular, and other biological information.",
    typicalWeek: ["Write analysis software", "Manage scientific data", "Develop algorithms", "Interpret results with biologists", "Document reproducible workflows"],
    workEnvironment: ["Biotechnology", "Pharmaceuticals", "Universities", "Medical research", "Government laboratories"],
    intensities: { quantitative: 5, coding: 5, writing: 3, laboratory: 2, peopleInteraction: 3, emotionalLoad: 2 },
    educationPath: "Advanced research roles commonly require graduate training; related bachelor's degrees can lead to analyst or technical roles with strong computational experience.",
    relatedProgramIds: ["data-science", "statistics", "biology", "biochemistry"],
    adjacentCareerIds: ["biostatistician", "data-scientist", "biomedical-engineer"],
    laborData: labor("19-1029.01", 100590, 9, "No exact BLS category; medical-scientist proxy often requires a doctoral degree", ["onet-bioinformatics", "bls-medical-scientists"], { isProxy: true, limitation: "Pay and growth use the broader medical scientists category; bioinformatics-specific national estimates are not directly comparable." }),
    aiImpact: { routineTasks: ["Code generation", "Annotation lookup", "Pipeline configuration"], augmentedTasks: ["Pattern discovery", "Protein and sequence modeling", "Literature linkage"], humanCenter: ["Biological interpretation", "Experimental design", "Validation", "Data stewardship"], confidence: "medium" },
    tryNow: "Compare two short DNA sequences and explain what additional biological evidence would be needed.",
    sourceIds: ["onet-bioinformatics", "bls-medical-scientists"],
  },
  {
    id: "data-scientist", slug: "data-scientist", name: "Data Scientist", summary: "Data scientists use programming, statistics, and domain knowledge to extract useful and defensible insight from data.",
    typicalWeek: ["Clean data", "Write code", "Build and test models", "Meet with domain experts", "Present findings and limitations"],
    workEnvironment: ["Technology", "Research", "Consulting", "Insurance", "Healthcare", "Government"],
    intensities: { quantitative: 5, coding: 5, writing: 3, laboratory: 1, peopleInteraction: 3, emotionalLoad: 2 },
    educationPath: "A bachelor's degree is typical for entry, although some employers prefer a master's or doctoral degree.",
    relatedProgramIds: ["data-science", "statistics", "operations-research", "cognitive-science"],
    adjacentCareerIds: ["biostatistician", "operations-research-analyst", "bioinformatics-scientist"],
    laborData: labor("15-2051", 112590, 34, "Bachelor's degree", ["bls-data-scientists"]),
    aiImpact: { routineTasks: ["Code scaffolding", "Data documentation", "Baseline models"], augmentedTasks: ["Feature exploration", "Model prototyping", "Natural-language interfaces"], humanCenter: ["Problem framing", "Data quality judgment", "Evaluation", "Accountability"], confidence: "medium" },
    tryNow: "Analyze a small dataset and write what it cannot tell you.",
    sourceIds: ["bls-data-scientists", "wef-future-jobs"],
  },
  {
    id: "clinical-data-scientist", slug: "clinical-data-scientist", name: "Clinical Data Scientist", summary: "Clinical data scientists apply data methods to healthcare or research while working within privacy, safety, and clinical constraints.",
    typicalWeek: ["Prepare clinical data", "Build and validate analyses", "Work with clinicians", "Document methods", "Review privacy and bias risks"],
    workEnvironment: ["Health systems", "Life-science companies", "Research organizations", "Health technology"],
    intensities: { quantitative: 5, coding: 5, writing: 4, laboratory: 1, peopleInteraction: 4, emotionalLoad: 3 },
    educationPath: "Requirements vary; strong statistics and computing are essential, and graduate or domain-specific training is common.",
    relatedProgramIds: ["data-science", "statistics", "public-health", "biology"],
    adjacentCareerIds: ["data-scientist", "biostatistician", "healthcare-operations-analyst"],
    laborData: labor("15-2051", 112590, 34, "Data-scientist category used as a proxy", ["bls-data-scientists", "onet-health-informatics"], { isProxy: true, limitation: "Clinical data scientist is not a single BLS occupation; figures use the broader data scientist category." }),
    aiImpact: { routineTasks: ["Documentation drafts", "Code assistance", "Initial charting"], augmentedTasks: ["Risk-model evaluation", "Text and imaging analysis"], humanCenter: ["Clinical relevance", "Safety validation", "Privacy", "Bias assessment"], confidence: "medium" },
    tryNow: "Review a fictional model result and identify the patient-safety questions that remain.",
    sourceIds: ["bls-data-scientists", "onet-health-informatics"],
  },
  {
    id: "operations-research-analyst", slug: "operations-research-analyst", name: "Operations Research Analyst", summary: "Operations research analysts use mathematics and models to help organizations allocate resources and improve complex decisions.",
    typicalWeek: ["Define objectives and constraints", "Analyze operational data", "Build optimization or simulation models", "Test scenarios", "Present recommendations"],
    workEnvironment: ["Consulting", "Government", "Manufacturing", "Finance", "Logistics", "Healthcare"],
    intensities: { quantitative: 5, coding: 4, writing: 3, laboratory: 1, peopleInteraction: 4, emotionalLoad: 2 },
    educationPath: "A bachelor's degree is typical; some employers prefer graduate education.",
    relatedProgramIds: ["operations-research", "statistics", "data-science"],
    adjacentCareerIds: ["data-scientist", "healthcare-operations-analyst"],
    laborData: labor("15-2031", 91290, 21, "Bachelor's degree", ["bls-or-analysts"]),
    aiImpact: { routineTasks: ["Scenario generation", "Code assistance", "Report drafts"], augmentedTasks: ["Large-scale optimization", "Simulation", "Sensitivity analysis"], humanCenter: ["Choosing objectives", "Negotiating constraints", "Implementation judgment"], confidence: "medium" },
    tryNow: "Balance wait time, staffing, and cost in a fictional clinic schedule.",
    sourceIds: ["bls-or-analysts"],
  },
  {
    id: "ux-researcher", slug: "ux-researcher", name: "UX Researcher and Human-Factors Specialist", summary: "UX and human-factors researchers study how people use products and systems so designs better support performance, safety, and well-being.",
    typicalWeek: ["Plan interviews or usability studies", "Observe behavior", "Analyze qualitative and quantitative evidence", "Work with designers and engineers", "Present findings"],
    workEnvironment: ["Technology", "Healthcare", "Consulting", "Consumer products", "Transportation and safety-critical systems"],
    intensities: { quantitative: 3, coding: 2, writing: 5, laboratory: 2, peopleInteraction: 5, emotionalLoad: 2 },
    educationPath: "Entry routes vary; psychology, cognitive science, human factors, design research, and related graduate training are common.",
    relatedProgramIds: ["cognitive-science", "statistics", "data-science"],
    adjacentCareerIds: ["data-scientist", "biomedical-engineer"],
    laborData: labor("17-2112.01", 102440, null, "No single UX-research BLS category", ["onet-human-factors"], { isProxy: true, limitation: "O*NET maps wage data to the broader industrial engineers category; do not present as UX-research-specific pay or growth." }),
    aiImpact: { routineTasks: ["Transcription", "Coding assistance", "Theme suggestions"], augmentedTasks: ["Prototype generation", "Large-scale feedback synthesis"], humanCenter: ["Research ethics", "Study design", "Observation", "Interpreting context"], confidence: "medium" },
    tryNow: "Watch someone use an everyday object, ask neutral questions, and identify one design assumption.",
    sourceIds: ["onet-human-factors"],
  },
  {
    id: "biomedical-engineer", slug: "biomedical-engineer", name: "Biomedical Engineer", summary: "Biomedical engineers design and test devices, equipment, software, and systems that address biological and healthcare needs.",
    typicalWeek: ["Develop requirements", "Model or prototype", "Test performance", "Work with clinicians and manufacturers", "Document safety and design decisions"],
    workEnvironment: ["Medical-device companies", "Research laboratories", "Hospitals", "Engineering services", "Manufacturing"],
    intensities: { quantitative: 5, coding: 3, writing: 3, laboratory: 4, peopleInteraction: 3, emotionalLoad: 2 },
    educationPath: "A bachelor's degree is typical; research and some advanced roles require graduate education.",
    relatedProgramIds: ["bioengineering", "biology", "biochemistry", "data-science"],
    adjacentCareerIds: ["bioinformatics-scientist", "physician", "ux-researcher"],
    laborData: labor("17-2031", 106950, 5, "Bachelor's degree", ["bls-biomedical-engineers"]),
    aiImpact: { routineTasks: ["Draft documentation", "Simulation setup", "Code assistance"], augmentedTasks: ["Design search", "Imaging analysis", "Predictive maintenance"], humanCenter: ["Safety verification", "Physical testing", "Regulatory responsibility", "Clinical context"], confidence: "medium" },
    tryNow: "Compare two fictional wearable-sensor designs and decide what must be tested before use.",
    sourceIds: ["bls-biomedical-engineers"],
  },
  {
    id: "public-health-analyst", slug: "public-health-analyst", name: "Public Health Analyst", summary: "Public health analysts use evidence, policy, and program evaluation to help organizations improve population health.",
    typicalWeek: ["Analyze program data", "Review evidence", "Write policy or evaluation briefs", "Meet with community and agency partners", "Track implementation"],
    workEnvironment: ["Government", "Nonprofits", "Health systems", "Consulting", "Research organizations"],
    intensities: { quantitative: 3, coding: 2, writing: 5, laboratory: 1, peopleInteraction: 5, emotionalLoad: 3 },
    educationPath: "Requirements vary; bachelor's-entry roles exist, while specialized analysis often favors an MPH or related graduate degree.",
    relatedProgramIds: ["public-health", "statistics", "data-science"],
    adjacentCareerIds: ["epidemiologist", "healthcare-operations-analyst"],
    laborData: labor("19-1041", 83980, 16, "No single BLS category; epidemiologist proxy", ["bls-epidemiologists"], { isProxy: true, limitation: "Public health analyst titles span multiple occupations. Figures use epidemiologists only as a related benchmark." }),
    aiImpact: { routineTasks: ["Document summaries", "Data cleanup", "Draft charts"], augmentedTasks: ["Literature scanning", "Program monitoring", "Scenario exploration"], humanCenter: ["Community context", "Policy judgment", "Equity", "Communication"], confidence: "medium" },
    tryNow: "Choose measures for a fictional school-health program and explain whose perspective is missing.",
    sourceIds: ["bls-epidemiologists"],
  },
  {
    id: "genetic-counselor", slug: "genetic-counselor", name: "Genetic Counselor", summary: "Genetic counselors assess inherited-condition risk and help individuals and families understand information and make informed decisions.",
    typicalWeek: ["Review family and medical histories", "Explain testing", "Discuss uncertainty and options", "Coordinate with healthcare teams", "Support informed decision-making"],
    workEnvironment: ["Hospitals", "Clinics", "Laboratories", "Research", "Telehealth"],
    intensities: { quantitative: 3, coding: 1, writing: 4, laboratory: 1, peopleInteraction: 5, emotionalLoad: 5 },
    educationPath: "A specialized master's degree and professional credentialing are typical; verify current accreditation and state requirements.",
    relatedProgramIds: ["biology", "biochemistry", "cognitive-science", "public-health"],
    adjacentCareerIds: ["physician", "physician-assistant", "epidemiologist"],
    laborData: labor("29-9092.00", null, null, "Master's degree typical", ["onet-genetic-counselors"], { limitation: "O*NET identifies the occupation, but this package does not publish a directly comparable national median or growth rate." }),
    aiImpact: { routineTasks: ["Pedigree drafting", "Reference lookup", "Educational material drafts"], augmentedTasks: ["Variant information retrieval", "Risk calculations"], humanCenter: ["Consent", "Emotional support", "Uncertainty communication", "Values-sensitive decisions"], confidence: "medium" },
    tryNow: "Explain a fictional recessive inheritance result in plain language without telling the family what decision to make.",
    sourceIds: ["onet-genetic-counselors"],
  },
  {
    id: "healthcare-operations-analyst", slug: "healthcare-operations-analyst", name: "Healthcare Operations Analyst", summary: "Healthcare operations analysts improve patient flow, staffing, capacity, quality, and cost using data and systems thinking.",
    typicalWeek: ["Analyze wait times or capacity", "Map workflows", "Build dashboards or models", "Meet with clinical and administrative teams", "Evaluate changes"],
    workEnvironment: ["Hospitals", "Clinics", "Health systems", "Consulting", "Government"],
    intensities: { quantitative: 4, coding: 3, writing: 4, laboratory: 1, peopleInteraction: 4, emotionalLoad: 3 },
    educationPath: "Bachelor's-entry analyst roles exist; advancement may favor healthcare, analytics, operations, or management graduate education and experience.",
    relatedProgramIds: ["operations-research", "public-health", "statistics", "data-science"],
    adjacentCareerIds: ["operations-research-analyst", "public-health-analyst", "clinical-data-scientist"],
    laborData: labor("11-9111", 117960, 23, "Medical and health services managers used as a later-career proxy", ["bls-health-managers", "bls-or-analysts"], { isProxy: true, limitation: "Analyst titles do not map to one BLS occupation. Pay and growth shown for medical and health services managers may reflect more experienced roles." }),
    aiImpact: { routineTasks: ["Dashboard narratives", "Scheduling suggestions", "Report drafts"], augmentedTasks: ["Demand forecasting", "Capacity simulation", "Anomaly detection"], humanCenter: ["Workflow context", "Safety and equity tradeoffs", "Implementation", "Stakeholder alignment"], confidence: "medium" },
    tryNow: "Improve a fictional emergency-department flow while protecting urgent patients and staff workload.",
    sourceIds: ["bls-health-managers", "bls-or-analysts"],
  },
].map((record) => ({ ...record, ...meta() }));

const institutions = [
  ["uc-berkeley", "University of California, Berkeley", "UC Berkeley", "Berkeley", "semester", "urban", "https://www.berkeley.edu", "https://financialaid.berkeley.edu/how-aid-works/student-budgets-cost-of-attendance/"],
  ["uc-davis", "University of California, Davis", "UC Davis", "Davis", "quarter", "college_town", "https://www.ucdavis.edu", "https://financialaid.ucdavis.edu/undergraduate/cost"],
  ["uc-irvine", "University of California, Irvine", "UC Irvine", "Irvine", "quarter", "suburban", "https://uci.edu", "https://www.ofas.uci.edu/cost/"],
  ["ucla", "University of California, Los Angeles", "UCLA", "Los Angeles", "quarter", "urban", "https://www.ucla.edu", "https://financialaid.ucla.edu/undergraduate/cost-of-attendance"],
  ["uc-merced", "University of California, Merced", "UC Merced", "Merced", "semester", "small_city", "https://www.ucmerced.edu", "https://financialaid.ucmerced.edu/cost-attendance"],
  ["uc-riverside", "University of California, Riverside", "UC Riverside", "Riverside", "quarter", "suburban", "https://www.ucr.edu", "https://financialaid.ucr.edu/cost"],
  ["uc-san-diego", "University of California, San Diego", "UC San Diego", "La Jolla / San Diego", "quarter", "suburban_coastal", "https://ucsd.edu", "https://fas.ucsd.edu/cost-of-attendance/"],
  ["uc-santa-barbara", "University of California, Santa Barbara", "UC Santa Barbara", "Santa Barbara / Goleta", "quarter", "suburban_coastal", "https://www.ucsb.edu", "https://www.finaid.ucsb.edu/cost-of-attendance"],
  ["uc-santa-cruz", "University of California, Santa Cruz", "UC Santa Cruz", "Santa Cruz", "quarter", "small_city_coastal", "https://www.ucsc.edu", "https://financialaid.ucsc.edu/cost-to-attend/"],
].map(([id, name, shortName, city, calendarSystem, setting, officialUrl, costUrl], index) => ({
  id, collectionId: "uc-system", providerId: "uc", name, shortName,
  location: { city, state: "California", country: "United States" },
  calendarSystem, setting, officialUrl, costUrl,
  financialAidUrl: "https://admission.universityofcalifornia.edu/tuition-financial-aid/estimate-your-aid.html",
  undergraduateCampus: true,
  prehealthNote: "Premed is a preparation pathway rather than a UC undergraduate major. Verify campus advising and current opportunities directly.",
  researchNote: "Research access varies by department, lab, prerequisites, and student initiative; campus presence alone does not guarantee access.",
  sourceIds: [[
    "catalog-berkeley", "catalog-davis", "catalog-irvine", "catalog-ucla", "catalog-merced",
    "catalog-riverside", "catalog-san-diego", "catalog-santa-barbara", "catalog-santa-cruz",
  ][index], "uc-calendar", "uc-cost", "uc-aid"],
  ...meta(),
}));

const offeringRows = [
  ["berkeley-integrative-biology-ba", "uc-berkeley", "biology", "Integrative Biology", "BA", "College of Letters and Science"],
  ["berkeley-mcb-ba", "uc-berkeley", "biology", "Molecular and Cell Biology", "BA", "College of Letters and Science"],
  ["berkeley-data-science-ba", "uc-berkeley", "data-science", "Data Science", "BA", "College of Computing, Data Science, and Society"],
  ["berkeley-statistics-ba", "uc-berkeley", "statistics", "Statistics", "BA", "College of Computing, Data Science, and Society"],
  ["berkeley-cognitive-science-ba", "uc-berkeley", "cognitive-science", "Cognitive Science", "BA", "College of Letters and Science"],
  ["berkeley-public-health-ba", "uc-berkeley", "public-health", "Public Health", "BA", "College of Letters and Science"],
  ["berkeley-bioengineering-bs", "uc-berkeley", "bioengineering", "Bioengineering", "BS", "College of Engineering"],
  ["berkeley-ieor-bs", "uc-berkeley", "operations-research", "Industrial Engineering and Operations Research", "BS", "College of Engineering"],
  ["davis-biological-sciences-bs", "uc-davis", "biology", "Biological Sciences", "BS", "College of Biological Sciences"],
  ["davis-biochem-molecular-bs", "uc-davis", "biochemistry", "Biochemistry and Molecular Biology", "BS", "College of Biological Sciences"],
  ["davis-data-science-bs", "uc-davis", "data-science", "Data Science", "BS", "College of Letters and Science"],
  ["davis-statistics-ab", "uc-davis", "statistics", "Statistics", "BA", "College of Letters and Science"],
  ["davis-statistics-bs", "uc-davis", "statistics", "Statistics", "BS", "College of Letters and Science"],
  ["davis-cognitive-science-ab", "uc-davis", "cognitive-science", "Cognitive Science", "BA", "College of Letters and Science"],
  ["davis-cognitive-science-bs", "uc-davis", "cognitive-science", "Cognitive Science", "BS", "College of Letters and Science"],
  ["davis-biomedical-engineering-bs", "uc-davis", "bioengineering", "Biomedical Engineering", "BS", "College of Engineering"],
  ["irvine-biological-sciences-bs", "uc-irvine", "biology", "Biological Sciences", "BS", "Charlie Dunlop School of Biological Sciences"],
  ["irvine-biochem-molecular-bs", "uc-irvine", "biochemistry", "Biochemistry and Molecular Biology", "BS", "Charlie Dunlop School of Biological Sciences"],
  ["irvine-data-science-bs", "uc-irvine", "data-science", "Data Science", "BS", "Donald Bren School of Information and Computer Sciences"],
  ["irvine-cognitive-sciences-bs", "uc-irvine", "cognitive-science", "Cognitive Sciences", "BS", "School of Social Sciences"],
  ["irvine-public-health-policy-ba", "uc-irvine", "public-health", "Public Health Policy", "BA", "Joe C. Wen School of Population and Public Health"],
  ["irvine-public-health-sciences-bs", "uc-irvine", "public-health", "Public Health Sciences", "BS", "Joe C. Wen School of Population and Public Health"],
  ["irvine-biomedical-engineering-bs", "uc-irvine", "bioengineering", "Biomedical Engineering", "BS", "Samueli School of Engineering"],
  ["ucla-biology-bs", "ucla", "biology", "Biology", "BS", "College of Letters and Science"],
  ["ucla-biochemistry-bs", "ucla", "biochemistry", "Biochemistry", "BS", "College of Letters and Science"],
  ["ucla-data-theory-bs", "ucla", "data-science", "Data Theory", "BS", "College of Letters and Science"],
  ["ucla-stat-data-science-bs", "ucla", "statistics", "Statistics and Data Science", "BS", "College of Letters and Science"],
  ["ucla-cognitive-science-bs", "ucla", "cognitive-science", "Cognitive Science", "BS", "College of Letters and Science"],
  ["ucla-public-health-ba", "ucla", "public-health", "Public Health", "BA", "Jonathan and Karin Fielding School of Public Health"],
  ["ucla-public-health-bs", "ucla", "public-health", "Public Health", "BS", "Jonathan and Karin Fielding School of Public Health"],
  ["ucla-bioengineering-bs", "ucla", "bioengineering", "Bioengineering", "BS", "Samueli School of Engineering"],
  ["merced-biological-sciences-ba", "uc-merced", "biology", "Biological Sciences", "BA", "School of Natural Sciences"],
  ["merced-biological-sciences-bs", "uc-merced", "biology", "Biological Sciences", "BS", "School of Natural Sciences"],
  ["merced-biochemistry-bs", "uc-merced", "biochemistry", "Biochemistry", "BS", "School of Natural Sciences"],
  ["merced-data-science-analytics-ba", "uc-merced", "data-science", "Data Science and Analytics", "BA", "School of Engineering"],
  ["merced-cognitive-science-ba", "uc-merced", "cognitive-science", "Cognitive Science", "BA", "School of Social Sciences, Humanities and Arts"],
  ["merced-cognitive-science-bs", "uc-merced", "cognitive-science", "Cognitive Science", "BS", "School of Social Sciences, Humanities and Arts"],
  ["merced-public-health-ba", "uc-merced", "public-health", "Public Health", "BA", "School of Social Sciences, Humanities and Arts"],
  ["merced-public-health-bs", "uc-merced", "public-health", "Public Health", "BS", "School of Social Sciences, Humanities and Arts"],
  ["merced-bioengineering-bs", "uc-merced", "bioengineering", "Bioengineering", "BS", "School of Engineering"],
  ["riverside-biology-bs", "uc-riverside", "biology", "Biology", "BS", "College of Natural and Agricultural Sciences"],
  ["riverside-biochemistry-bs", "uc-riverside", "biochemistry", "Biochemistry", "BS", "College of Natural and Agricultural Sciences"],
  ["riverside-data-science-bs", "uc-riverside", "data-science", "Data Science", "BS", "Bourns College of Engineering or College of Natural and Agricultural Sciences"],
  ["riverside-statistics-bs", "uc-riverside", "statistics", "Statistics", "BS", "College of Natural and Agricultural Sciences"],
  ["riverside-bioengineering-bs", "uc-riverside", "bioengineering", "Bioengineering", "BS", "Bourns College of Engineering"],
  ["sandiego-general-biology-bs", "uc-san-diego", "biology", "General Biology", "BS", "School of Biological Sciences"],
  ["sandiego-molecular-cell-biology-bs", "uc-san-diego", "biology", "Molecular and Cell Biology", "BS", "School of Biological Sciences"],
  ["sandiego-biochemistry-bs", "uc-san-diego", "biochemistry", "Biochemistry", "BS", "School of Physical Sciences"],
  ["sandiego-data-science-bs", "uc-san-diego", "data-science", "Data Science", "BS", "Halıcıoğlu Data Science Institute"],
  ["sandiego-math-statistics-bs", "uc-san-diego", "statistics", "Mathematics—Statistics", "BS", "School of Physical Sciences"],
  ["sandiego-cognitive-science-ba", "uc-san-diego", "cognitive-science", "Cognitive Science", "BA", "School of Social Sciences"],
  ["sandiego-cognitive-science-bs", "uc-san-diego", "cognitive-science", "Cognitive Science", "BS", "School of Social Sciences"],
  ["sandiego-public-health-bs", "uc-san-diego", "public-health", "Public Health", "BS", "Herbert Wertheim School of Public Health and Human Longevity Science"],
  ["sandiego-public-health-biostat-bs", "uc-san-diego", "public-health", "Public Health with Concentration in Biostatistics", "BS", "Herbert Wertheim School of Public Health and Human Longevity Science"],
  ["sandiego-bioengineering-bs", "uc-san-diego", "bioengineering", "Bioengineering", "BS", "Jacobs School of Engineering"],
  ["sandiego-bioengineering-bioinformatics-bs", "uc-san-diego", "bioengineering", "Bioengineering: Bioinformatics", "BS", "Jacobs School of Engineering"],
  ["santabarbara-biological-sciences-ba", "uc-santa-barbara", "biology", "Biological Sciences", "BA", "College of Letters and Science"],
  ["santabarbara-biological-sciences-bs", "uc-santa-barbara", "biology", "Biological Sciences", "BS", "College of Letters and Science"],
  ["santabarbara-biochemistry-bs", "uc-santa-barbara", "biochemistry", "Biochemistry", "BS", "College of Letters and Science"],
  ["santabarbara-biochem-molecular-bs", "uc-santa-barbara", "biochemistry", "Biochemistry—Molecular Biology", "BS", "College of Letters and Science"],
  ["santabarbara-stat-data-science-ba", "uc-santa-barbara", "statistics", "Statistics and Data Science", "BA", "College of Letters and Science"],
  ["santabarbara-stat-data-science-bs", "uc-santa-barbara", "statistics", "Statistics and Data Science", "BS", "College of Letters and Science"],
  ["santacruz-biology-ba", "uc-santa-cruz", "biology", "Biology", "BA", "Physical and Biological Sciences Division"],
  ["santacruz-biology-bs", "uc-santa-cruz", "biology", "Biology", "BS", "Physical and Biological Sciences Division"],
  ["santacruz-biochem-molecular-bs", "uc-santa-cruz", "biochemistry", "Biochemistry and Molecular Biology", "BS", "Physical and Biological Sciences Division"],
  ["santacruz-cognitive-science-bs", "uc-santa-cruz", "cognitive-science", "Cognitive Science", "BS", "Social Sciences Division"],
  ["santacruz-biomolecular-eng-bioinfo-bs", "uc-santa-cruz", "bioengineering", "Biomolecular Engineering and Bioinformatics", "BS", "Baskin School of Engineering"],
];

const catalogByInstitution = {
  "uc-berkeley": "catalog-berkeley", "uc-davis": "catalog-davis", "uc-irvine": "catalog-irvine",
  ucla: "catalog-ucla", "uc-merced": "catalog-merced", "uc-riverside": "catalog-riverside",
  "uc-san-diego": "catalog-san-diego", "uc-santa-barbara": "catalog-santa-barbara", "uc-santa-cruz": "catalog-santa-cruz",
};

const offerings = offeringRows.map(([id, institutionId, canonicalProgramId, officialMajorName, degreeType, schoolOrCollege]) => {
  const selective = institutionId === "uc-san-diego" && ["sandiego-data-science-bs", "sandiego-bioengineering-bs", "sandiego-bioengineering-bioinformatics-bs", "sandiego-public-health-bs", "sandiego-public-health-biostat-bs"].includes(id);
  const laterApplication = ["ucla-public-health-ba", "ucla-public-health-bs"].includes(id);
  return {
    id, institutionId, canonicalProgramId, officialMajorName, degreeType, schoolOrCollege,
    firstYearAvailable: true,
    admissionContext: selective ? "direct_major" : "unknown",
    capacityStatus: selective ? "capacity_constrained" : laterApplication ? "capacity_constrained" : "unknown",
    publishedMajorAdmitData: "not_published",
    selectivityNote: selective ? "Official campus material identifies this as a selective major; verify current first-year and change-of-major rules." : laterApplication ? "The UCLA program requires a later competitive application; verify current pre-major and entry rules." : "No comparable major-level first-year admit rate is stored.",
    alternateMajorNote: "Verify the current UC application and campus policy for alternate majors.",
    changeMajorNote: selective || laterApplication ? "Changing into this program may be constrained; verify with the program before relying on a later switch." : "Policy varies by campus and term; verify before planning a switch.",
    officialUrl: sources.find((item) => item.id === catalogByInstitution[institutionId]).url,
    effectiveTerm: "Current catalog as verified 2026-07-23",
    sourceIds: [catalogByInstitution[institutionId], "uc-major-checker"],
    ...meta(),
  };
});

for (const program of programs) {
  program.ucOfferingIds = offerings.filter((item) => item.canonicalProgramId === program.id).map((item) => item.id);
}

const admitMetrics = [
  ["uc-berkeley", 126836, 14451, 11.4, 4.15, 4.29, "uc-admit-berkeley"],
  ["uc-davis", 102980, 45963, 44.6, 4.00, 4.26, "uc-admit-davis"],
  ["uc-irvine", 124230, 35661, 28.7, 4.04, 4.27, "uc-admit-irvine"],
  ["ucla", 145070, 13660, 9.4, 4.20, 4.30, "uc-admit-ucla"],
  ["uc-merced", 49358, 46932, 95.1, 3.54, 4.15, "uc-admit-merced"],
  ["uc-riverside", 70862, 61718, 87.1, 3.65, 4.16, "uc-admit-riverside"],
  ["uc-san-diego", 136740, 38846, 28.4, 4.11, 4.28, "uc-admit-san-diego"],
  ["uc-santa-barbara", 110178, 42170, 38.3, 4.09, 4.28, "uc-admit-santa-barbara"],
  ["uc-santa-cruz", 66373, 48244, 72.7, 3.83, 4.20, "uc-admit-santa-cruz"],
].map(([institutionId, applicants, admits, overallAdmitRatePercent, gpa25, gpa75, sourceId]) => ({
  id: `${institutionId}-fall-2025-first-year`,
  institutionId,
  cohort: "Fall 2025 first-year applicants and admits",
  reportingAsOf: "2025-06",
  applicants,
  admits,
  overallAdmitRatePercent,
  admittedUcGpaMiddle50: { low: gpa25, high: gpa75 },
  comparability: "campus_wide_only",
  limitation: "This is campus-wide historical context, not a major-level rate, target, safety label, or prediction. Applicant pools and selection change each year.",
  sourceIds: [sourceId, "uc-admit-data"],
  ...meta(),
}));

const admissions = [
  {
    id: "uc-system-first-year",
    collectionId: "uc-system",
    applicationCycle: "Expected fall 2027 application for fall 2028 enrollment",
    cycleStatus: "not_yet_published",
    eligibility: {
      agCoursesMinimum: 15,
      agCoursesBeforeSeniorYearMinimum: 11,
      gradeFloor: "C",
      californiaResidentMinimumUcGpa: 3.0,
      nonresidentMinimumUcGpa: 3.4,
    },
    reviewModel: "comprehensive_review",
    standardizedTestPolicy: "Verify current UC policy before the application cycle; do not infer from this content package.",
    deadlineStatus: "Future cycle dates are intentionally not populated until UC publishes them.",
    noPredictionDisclaimer: "Meeting minimum requirements does not guarantee admission. Historical data do not predict an individual result.",
    majorDataPolicy: "Never infer major-level admission rates from campus or grouped-college data.",
    sourceIds: ["uc-first-year-requirements", "uc-gpa-requirement", "uc-comprehensive-review", "uc-dates", "uc-admit-data"],
    ...meta(),
  },
];

const agRules = {
  meta: meta({ ruleId: "uc-ag-2026-07-23" }),
  categories: [
    { id: "a", name: "History", yearsRequired: 2, yearsRecommended: null },
    { id: "b", name: "English", yearsRequired: 4, yearsRecommended: null },
    { id: "c", name: "Mathematics", yearsRequired: 3, yearsRecommended: 4 },
    { id: "d", name: "Science", yearsRequired: 2, yearsRecommended: 3 },
    { id: "e", name: "Language other than English or equivalent", yearsRequired: 2, yearsRecommended: 3 },
    { id: "f", name: "Visual and performing arts", yearsRequired: 1, yearsRecommended: null },
    { id: "g", name: "College-preparatory elective", yearsRequired: 1, yearsRecommended: null },
  ],
  totalCoursesMinimum: 15,
  coursesBeforeSeniorYearMinimum: 11,
  minimumGrade: "C",
  classificationPolicy: "Use the official school A–G course list when available. Unknown classifications remain unresolved, not failed.",
  warnings: ["Minimum eligibility is not a competitive target.", "Course certification and mathematics guidance may change; verify the effective term with a counselor and the official list."],
  sourceIds: ["uc-first-year-requirements", "uc-ag-requirements"],
};

const gpaRules = {
  meta: meta({ ruleId: "uc-gpa-eligibility-capped-2026-07-23" }),
  calculationType: "eligibility_capped_estimate",
  includedWindow: "A–G courses from summer after 9th grade through summer after 11th grade",
  gradePoints: { A: 4, B: 3, C: 2, D: 1, F: 0 },
  plusMinusIgnored: true,
  californiaResident: {
    minimum: 3.0,
    honorsEligibleTypes: ["uc_certified", "ap", "ib", "transferable_college"],
    honorsPointCapTotal: 8,
    honorsPointCapGrade10: 4,
  },
  nonresident: {
    minimum: 3.4,
    honorsEligibleTypes: ["ap", "ib"],
    honorsPointCapTotal: 8,
    honorsPointCapGrade10: 4,
  },
  honorsPointGradeEligibility: ["A", "B", "C"],
  rounding: "Do not round up or down.",
  resultLabel: "Estimate until UC calculates the official GPA from the application.",
  prohibitedUses: ["admission_probability", "campus_recommendation", "student_ranking"],
  sourceIds: ["uc-gpa-requirement"],
};

const comprehensiveReview = {
  meta: meta(),
  factors: [
    "Academic GPA in completed A–G courses, including eligible honors points",
    "Number, content, and performance in A–G courses beyond the minimum",
    "UC-approved honors, AP, IB, and transferable college coursework",
    "ELC identification when officially determined",
    "Quality of the planned or in-progress senior-year program",
    "Academic performance in context, including improvement",
    "Special talents, achievements, contributions, responsibilities, and experiences",
    "Accomplishments in light of opportunities and life circumstances",
  ],
  productRules: ["Do not score factors.", "Do not prescribe maximum rigor.", "Preserve school-opportunity and life context.", "Send school-specific questions to counselor verification."],
  sourceIds: ["uc-comprehensive-review"],
};

const roadmapTemplates = {
  meta: meta(),
  periods: [
    { id: "summer_before_11", title: "Now / summer before 11th grade", defaultMaxVisibleActions: 3 },
    { id: "fall_11", title: "Fall of 11th grade", defaultMaxVisibleActions: 3 },
    { id: "winter_11", title: "Winter of 11th grade", defaultMaxVisibleActions: 3 },
    { id: "spring_11", title: "Spring of 11th grade", defaultMaxVisibleActions: 3 },
    { id: "summer_before_12", title: "Summer before 12th grade", defaultMaxVisibleActions: 3 },
    { id: "fall_12", title: "Fall of 12th grade / application season", defaultMaxVisibleActions: 3 },
    { id: "after_application", title: "After application", defaultMaxVisibleActions: 3 },
  ],
  templates: [
    { id: "audit-ag", period: "fall_11", category: "required", title: "Review A–G progress", rationale: "Identify unresolved classifications early.", verificationNeeded: true },
    { id: "verify-gpa", period: "fall_11", category: "recommended", title: "Review the UC GPA estimate and assumptions", rationale: "Understand what is included without treating it as a prediction.", verificationNeeded: true },
    { id: "test-path", period: "fall_11", category: "exploration", title: "Test one program family through a short activity", rationale: "Use experience, not labels, to learn what holds attention." },
    { id: "senior-plan", period: "spring_11", category: "recommended", title: "Draft a sustainable senior schedule", rationale: "Balance A–G, preparation, mastery, and wellbeing.", verificationNeeded: true },
    { id: "counselor-sheet", period: "spring_11", category: "recommended", title: "Bring the discussion sheet to a counselor", rationale: "Resolve school-specific course and opportunity questions.", verificationNeeded: true },
    { id: "summer-experience", period: "spring_11", category: "exploration", title: "Choose one meaningful summer exploration", rationale: "Depth and learning matter more than résumé count." },
    { id: "portfolio", period: "summer_before_12", category: "recommended", title: "Refine campus-major combinations", rationale: "Compare fit, constraints, cost, and data limitations." },
    { id: "piq-bank", period: "summer_before_12", category: "recommended", title: "Build a PIQ story bank", rationale: "Preserve the student's own experiences and authorship." },
    { id: "verify-cycle", period: "summer_before_12", category: "required", title: "Load the published application dates", rationale: "Future-cycle dates were not available when this package was authored.", verificationNeeded: true },
    { id: "course-reporting", period: "fall_12", category: "required", title: "Verify course reporting before submission", rationale: "Resolve classifications and transcript details.", verificationNeeded: true },
  ],
  sourceIds: ["uc-first-year-requirements", "uc-dates", "uc-piq"],
};

const applicationMilestones = {
  meta: meta({ targetEnrollmentTerm: "Fall 2028", expectedApplicationPeriod: "Fall 2027", publicationStatus: "not_yet_published" }),
  milestones: [
    { id: "application-opens", expectedTiming: "Usually late summer before application submission", officialDate: null, status: "awaiting_official_cycle", action: "Verify on the official UC dates page before showing a date." },
    { id: "application-filing", expectedTiming: "Fall of 12th grade", officialDate: null, status: "awaiting_official_cycle", action: "Do not copy the prior cycle's dates forward." },
    { id: "financial-aid", expectedTiming: "Fall and winter of 12th grade", officialDate: null, status: "awaiting_official_cycle", action: "Verify FAFSA, California Dream Act, and Cal Grant dates for the applicable year." },
    { id: "decisions", expectedTiming: "Spring of 12th grade", officialDate: null, status: "awaiting_official_cycle", action: "Verify campus decision windows." },
    { id: "sir", expectedTiming: "Spring of 12th grade", officialDate: null, status: "awaiting_official_cycle", action: "Verify the Statement of Intent to Register deadline." },
    { id: "transcripts", expectedTiming: "Summer after 12th grade", officialDate: null, status: "awaiting_official_cycle", action: "Verify transcript and exam-result deadlines." },
  ],
  sourceIds: ["uc-dates"],
};

const premed = {
  meta: meta(),
  coreMessage: "Premed is generally a preparation pathway, not an undergraduate major.",
  principles: [
    "Students may major in a science or non-science field.",
    "Medical-school prerequisites vary by school.",
    "A four-year degree is generally required by medical schools.",
    "Common preparation includes biology, English, and chemistry through organic chemistry; other coursework varies.",
    "Medical schools also consider competencies and experiences, not coursework alone.",
    "UC undergraduate admission and medical-school admission are separate processes.",
  ],
  commonPreparationAreas: ["Biology", "General and organic chemistry", "English and writing", "Physics", "Mathematics or statistics", "Biochemistry", "Psychology", "Sociology"],
  verificationNote: "Use AAMC's school-specific resources and a college prehealth advisor; never assume one universal prerequisite list.",
  sourceIds: ["aamc-admission-requirements", "aamc-premed-competencies"],
};

const medicalPath = {
  meta: meta(),
  title: "Path to independent physician practice",
  stages: [
    { id: "high-school", title: "High-school exploration", typicalYears: null, note: "Explore science, service, teamwork, patient-facing environments, and the realities of long training without treating high school as premedical school." },
    { id: "undergraduate", title: "Undergraduate degree", typicalYears: 4, note: "Complete a bachelor's degree, major requirements, medical-school preparation, and meaningful experiences." },
    { id: "application", title: "MCAT and medical-school application", typicalYears: null, note: "Timing varies; gap years are common and not failures." },
    { id: "medical-school", title: "Medical school", typicalYears: 4, note: "Classroom, laboratory, clinical skills, and rotations lead toward residency." },
    { id: "residency", title: "Residency", typicalYearsRange: [3, 7], note: "Length varies by specialty; some sources describe longer training for selected paths." },
    { id: "fellowship", title: "Optional fellowship", typicalYearsRange: [1, 3], note: "Subspecialty training is optional and varies." },
    { id: "practice", title: "Licensure, practice, and continuing education", typicalYears: null, note: "Independent practice responsibilities and lifelong learning continue." },
  ],
  toggles: { gapYears: [0, 1, 2], fellowship: [false, true], specialtyCategory: ["primary_care", "medical", "surgical", "unsure"] },
  reflectionPrompts: ["Which parts of the work—not the title—appeal to you?", "How do you feel about repeated high-stakes learning and feedback?", "What would you want to observe in real clinical work before deciding?"],
  sourceIds: ["aamc-training-years", "aamc-med-school", "aamc-med-timeline", "bls-physicians"],
};

const medicalProfessions = {
  meta: meta(),
  records: [
    { id: "physician", name: "Physician", patientInteraction: "high", typicalPostBachelorTraining: "4 years medical school plus residency; fellowship optional", autonomy: "high after licensure; team-based", sourceIds: ["aamc-training-years", "bls-physicians"] },
    { id: "physician-assistant", name: "Physician Assistant", patientInteraction: "high", typicalPostBachelorTraining: "About 27 months for many accredited programs, then certification and licensure", autonomy: "varies by state and setting; collaborative practice", sourceIds: ["aapa-pa-path", "bls-physician-assistants"] },
    { id: "genetic-counselor", name: "Genetic Counselor", patientInteraction: "high", typicalPostBachelorTraining: "Specialized master's degree and credentialing are typical", autonomy: "specialized counseling within healthcare teams", sourceIds: ["onet-genetic-counselors"] },
    { id: "epidemiologist", name: "Epidemiologist", patientInteraction: "low_to_variable", typicalPostBachelorTraining: "Master's degree typical", autonomy: "independent analytical work within public-health and research teams", sourceIds: ["bls-epidemiologists"] },
    { id: "biomedical-engineer", name: "Biomedical Engineer", patientInteraction: "low_to_variable", typicalPostBachelorTraining: "Bachelor's degree typical; graduate education for some roles", autonomy: "engineering responsibility within multidisciplinary teams", sourceIds: ["bls-biomedical-engineers"] },
  ],
  comparisonWarning: "Training, scope, licensure, and work settings vary. Verify professional and state requirements before making decisions.",
};

const challengeBase = {
  schemaVersion, contentVersion, lastVerified: verified, nextReviewDue: reviewDue,
  maintenanceOwnerRole: "science_content_editor",
  disclaimer: "This is a fictional educational activity, not a diagnosis, aptitude test, or medical recommendation.",
  defaultMinutes: 8,
  optionalDeepDiveMinutes: 15,
  resultFields: ["perceivedDifficulty", "experience", "favoriteAspect", "wantsMore"],
};

const challenges = {
  "medical/challenges/bio-genetics.json": {
    ...challengeBase,
    id: "bio-genetics-protein",
    title: "How can one DNA change affect the body?",
    prerequisites: ["High-school biology", "Basic gene-to-protein idea"],
    learningGoals: ["Connect a gene variant to a protein change", "Trace effects from protein to cell and organism", "Distinguish evidence from assumption"],
    steps: [
      { id: "predict", type: "single_choice", prompt: "A gene provides instructions for part of hemoglobin. Which change is most directly downstream of a DNA variant?", choices: [{ id: "protein", text: "The amino-acid sequence or amount of a hemoglobin subunit" }, { id: "air", text: "The oxygen percentage in the room" }, { id: "heart", text: "The number of heart chambers" }], correctChoiceId: "protein", explanation: "A gene variant can change the sequence or production of the protein it encodes." },
      { id: "evidence", type: "evidence_sort", prompt: "Put the evidence chain in causal order.", items: ["HBB gene variant", "Altered beta-globin", "Hemoglobin S behavior", "Red-cell shape and flexibility changes", "Reduced blood flow or oxygen delivery in some conditions"], explanation: "The chain moves from genetic information to protein, cell behavior, and organism-level effects." },
      { id: "uncertainty", type: "multiple_choice", prompt: "What else would you need before predicting how severely one person is affected?", choices: [{ id: "genotype", text: "Which variants and copies are present" }, { id: "context", text: "Clinical and environmental context" }, { id: "both", text: "Both" }], correctChoiceId: "both", explanation: "A mechanism does not by itself determine one person's experience." },
    ],
    reflections: ["Was tracing the mechanism interesting, okay, or draining?", "Would you want a deeper molecular explanation or a more patient-centered case?"],
    sourceIds: ["nih-sickle-cell"],
  },
  "medical/challenges/chem-buffers.json": {
    ...challengeBase,
    id: "chem-blood-buffers",
    title: "Why can breathing affect blood pH?",
    prerequisites: ["High-school chemistry", "Acids, bases, and equilibrium"],
    learningGoals: ["Use equilibrium reasoning", "Connect carbon dioxide with bicarbonate buffering", "Explain direction of change without calculating a diagnosis"],
    steps: [
      { id: "predict", type: "single_choice", prompt: "If carbon dioxide builds up, which direction is expected for hydrogen-ion concentration?", choices: [{ id: "up", text: "Increase" }, { id: "down", text: "Decrease" }, { id: "none", text: "No relationship" }], correctChoiceId: "up", explanation: "CO₂ + H₂O ⇌ H⁺ + HCO₃⁻. More retained CO₂ can shift the system toward more H⁺ and lower pH." },
      { id: "revision", type: "single_choice", prompt: "Faster ventilation removes more CO₂. What direction would that tend to move pH, all else equal?", choices: [{ id: "higher", text: "Higher" }, { id: "lower", text: "Lower" }, { id: "unknown", text: "Direction cannot be reasoned about" }], correctChoiceId: "higher", explanation: "Removing CO₂ tends to reduce H⁺ through the buffer relationship, raising pH. Real physiology may involve multiple processes." },
      { id: "limits", type: "multiple_choice", prompt: "Why is this model not enough to advise a real patient?", choices: [{ id: "kidneys", text: "Kidneys also regulate acid–base balance" }, { id: "mixed", text: "Real disorders can be mixed and require measurements" }, { id: "both", text: "Both" }], correctChoiceId: "both", explanation: "A simplified equilibrium is useful for learning, not diagnosing or treating." },
    ],
    reflections: ["Was the chemistry-to-physiology connection interesting, okay, or draining?", "Would you rather do more equilibrium reasoning or examine experimental data?"],
    sourceIds: ["ncbi-co2-buffer"],
  },
  "medical/challenges/integrated-shortness-of-breath.json": {
    ...challengeBase,
    id: "integrated-shortness-breath",
    title: "Shortness of breath: which evidence matters?",
    prerequisites: ["High-school biology", "Basic respiration and circulation"],
    learningGoals: ["Connect ventilation, gas exchange, circulation, and oxygen delivery", "Prioritize evidence", "Remain comfortable with uncertainty"],
    fictionalScenario: "A fictional student in a supervised lab simulation feels short of breath after exertion. This is not a real person and you will not diagnose or treat anyone.",
    steps: [
      { id: "systems", type: "multiple_select", prompt: "Which systems could affect oxygen reaching tissues?", choices: [{ id: "lungs", text: "Ventilation and lung gas exchange" }, { id: "blood", text: "Hemoglobin and blood flow" }, { id: "heart", text: "Circulation" }, { id: "all", text: "All of these" }], correctChoiceIds: ["all"], explanation: "Oxygen delivery depends on air movement, gas exchange, blood oxygen-carrying capacity, and circulation." },
      { id: "evidence", type: "rank", prompt: "Rank the first evidence you would want in this fictional educational model.", items: ["Observed breathing pattern", "Oxygen saturation trend", "Heart-rate trend", "Context such as exertion and timing"], explanation: "There is no single perfect ordering. The point is to combine measurements with context rather than jump to a label." },
      { id: "conclusion", type: "single_choice", prompt: "What is the strongest conclusion from one abnormal measurement?", choices: [{ id: "diagnosis", text: "It proves one diagnosis" }, { id: "repeat", text: "It is evidence to verify and interpret with other information" }], correctChoiceId: "repeat", explanation: "Measurements can be noisy or incomplete; careful reasoning asks what else is needed." },
    ],
    reflections: ["Did integrating several systems feel interesting, okay, or draining?", "Did you enjoy choosing evidence despite uncertainty?"],
    sourceIds: ["nih-lungs"],
  },
};

const onboarding = {
  meta: meta(),
  requiredBeforeFirstSampler: 4,
  questions: [
    { id: "problem-style", prompt: "Which sounds most interesting right now?", choices: ["Explain how a living system works", "Find a pattern in evidence", "Improve a system with constraints", "Understand how people think", "I'm not sure"], skipAllowed: true },
    { id: "activity-style", prompt: "Which kind of activity would you rather sample?", choices: ["A biology mechanism", "A chemistry puzzle", "A data question", "A design or systems challenge", "Surprise me"], skipAllowed: true },
    { id: "people-systems", prompt: "Would you rather focus on one person, a population, a device, or a dataset?", choices: ["One person", "A population", "A device or process", "A dataset", "It depends"], skipAllowed: true },
    { id: "training", prompt: "How do you feel about careers that require graduate or professional education?", choices: ["Open to exploring", "Unsure", "Prefer a bachelor's-entry path", "I want to understand the tradeoff first"], skipAllowed: true },
  ],
  privacyNote: "No name, school, birth date, address, email, or other identifying information is requested.",
};

const pathProfiles = {
  meta: meta(),
  profiles: programs.map((program) => ({
    id: `profile-${program.id}`,
    programId: program.id,
    dimensions: {
      quantitativeReasoning: Math.max(program.intensities.mathematics, program.intensities.abstractTheory),
      coding: program.intensities.coding,
      laboratory: program.intensities.laboratory,
      writingCommunication: program.intensities.writing,
      peopleInteraction: program.intensities.peopleInteraction,
      systemsThinking: ["operations-research", "public-health", "bioengineering", "data-science"].includes(program.id) ? 5 : 3,
    },
    minimumIndependentSignalsForDevelopingEvidence: 3,
  })),
  diversityRule: ["evidence_supported", "adjacent", "discovery"],
  neverEliminateFromOneSampler: true,
};

const journeyNodes = {
  meta: meta(),
  nodes: [
    { id: "home-choice", type: "choice", prompt: "What would help today?", choices: [{ id: "discover", label: "Discover my options", nextNodeId: "onboarding" }, { id: "prepare", label: "Prepare for UC", nextNodeId: "baseline-residency" }] },
    { id: "onboarding", type: "question_sequence", contentRef: "journey/onboarding.json", nextNodeId: "bio-genetics-protein" },
    { id: "bio-genetics-protein", type: "challenge", contentRef: "medical/challenges/bio-genetics.json", nextNodeId: "discovery-reflection" },
    { id: "discovery-reflection", type: "reflection", prompts: ["How did this feel?", "What part, if any, would you want more of?"], nextNodeId: "recommendation-reveal" },
    { id: "recommendation-reveal", type: "recommendation", requiredSlots: ["evidence_supported", "adjacent", "discovery"], nextNodeId: "save-discover" },
    { id: "save-discover", type: "save_exit", optionalNextNodeId: "baseline-residency" },
    { id: "baseline-residency", type: "question", prompt: "For UC requirement explanations, which applies?", choices: ["California", "Nonresident", "Unsure", "Skip"], nextNodeId: "baseline-courses" },
    { id: "baseline-courses", type: "progressive_course_entry", prompt: "Add one completed, current, or planned course—or continue with unknowns.", nextNodeId: "readiness-preview" },
    { id: "readiness-preview", type: "readiness_snapshot", maxNextActions: 3, nextNodeId: "save-prepare" },
    { id: "save-prepare", type: "save_exit", optionalNextNodeId: "onboarding" },
  ],
};

const piq = {
  meta: meta(),
  officialPromptPolicy: "Load or verify the current official prompts before the fall 2027 application cycle.",
  storyBankFields: ["experience", "challengeOrOpportunity", "actionsTaken", "growthOrImpact", "whyItMatters", "possibleThemes"],
  authorshipRules: ["Do not generate a final response.", "Do not imitate the student's voice.", "Keep brainstorming private and local.", "Use the official UC guidance and prompts."],
  sourceIds: ["uc-piq"],
};

const collectionRecord = {
  id: "uc-system",
  name: "University of California",
  providerId: "uc",
  institutionIds: institutions.map((item) => item.id),
  undergraduateCampusCount: 9,
  scopeNote: "UCSF is not an undergraduate campus and is excluded from undergraduate campus comparisons.",
  sourceIds: ["uc-major-checker", "uc-first-year-requirements"],
  ...meta(),
};

const providerUc = {
  meta: meta(),
  id: "uc",
  name: "University of California provider",
  collectionId: "uc-system",
  normalizedFiles: {
    institutions: "../../institutions/institutions.json",
    offerings: "../../institutions/offerings.json",
    admissions: "../../institutions/admissions.json",
    metrics: "../../institutions/metrics.json",
    sources: "../../sources.json",
  },
  runtimeNetworkRequired: false,
};

const outOfStateFixture = {
  meta: meta({ studentFacing: false, synthetic: true }),
  provider: { id: "fixture-provider", name: "Synthetic portability fixture" },
  institution: {
    id: "fixture-out-of-state-public",
    collectionId: "fixture-public-system",
    providerId: "fixture-provider",
    name: "Fixture State University",
    shortName: "FSU Fixture",
    location: { city: "Example City", state: "Outside California", country: "United States" },
    calendarSystem: "semester",
    undergraduateCampus: true,
    sourceIds: [],
  },
  offering: {
    id: "fixture-biological-sciences-bs",
    institutionId: "fixture-out-of-state-public",
    canonicalProgramId: "biology",
    officialMajorName: "Biological Sciences",
    degreeType: "BS",
    firstYearAvailable: true,
    admissionContext: "unknown",
    capacityStatus: "unknown",
    publishedMajorAdmitData: "unknown",
    sourceIds: [],
  },
  purpose: "Prove that page components and recommendation logic consume institution-neutral entities. Never display this synthetic record to the student.",
};

const dataContracts = {
  meta: meta(),
  collectionEnvelopeRequired: ["meta", "records"],
  sourceRequired: ["id", "title", "publisher", "url", "sourceType", "lastVerified", "nextReviewDue", "maintenanceOwnerRole"],
  programRequired: ["id", "slug", "name", "familyIds", "summary", "intensities", "codingReality", "careerIds", "premedCompatibility", "highSchoolPreparation", "sourceIds"],
  careerRequired: ["id", "slug", "name", "summary", "typicalWeek", "intensities", "educationPath", "relatedProgramIds", "laborData", "aiImpact", "sourceIds"],
  institutionRequired: ["id", "collectionId", "providerId", "name", "location", "calendarSystem", "officialUrl", "sourceIds"],
  offeringRequired: ["id", "institutionId", "canonicalProgramId", "officialMajorName", "degreeType", "firstYearAvailable", "admissionContext", "capacityStatus", "publishedMajorAdmitData", "officialUrl", "effectiveTerm", "sourceIds"],
  prohibitedOfferingFields: ["admitRate", "estimatedAdmitRate", "chanceOfAdmission"],
  enums: {
    degreeType: ["BA", "BS", "BFA", "other"],
    admissionContext: ["campus", "college", "direct_major", "unknown"],
    capacityStatus: ["selective", "capacity_constrained", "not_identified", "unknown"],
    publishedMajorAdmitData: ["available", "not_published", "not_comparable", "unknown"],
    preparationLabel: ["uc_eligibility_requirement", "published_institution_program_requirement", "recommended_academic_preparation", "optional_exploration", "verify_with_counselor_or_institution"],
  },
};

const collectionSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://local.uc-pathways.test/schemas/record-collection.schema.json",
  title: "UC Pathways versioned record collection",
  type: "object",
  required: ["meta", "records"],
  properties: {
    meta: {
      type: "object",
      required: ["schemaVersion", "contentVersion", "lastVerified", "nextReviewDue", "maintenanceOwnerRole"],
      properties: {
        schemaVersion: { type: "string" },
        contentVersion: { type: "string" },
        lastVerified: { type: "string", format: "date" },
        nextReviewDue: { type: "string", format: "date" },
        maintenanceOwnerRole: { type: "string", minLength: 1 },
      },
    },
    records: { type: "array", items: { type: "object", required: ["id"] } },
  },
};

const sourceSchema = {
  $schema: "https://json-schema.org/draft/2020-12/schema",
  $id: "https://local.uc-pathways.test/schemas/source-registry.schema.json",
  title: "UC Pathways source registry",
  type: "object",
  required: ["meta", "records"],
  properties: {
    meta: collectionSchema.properties.meta,
    records: {
      type: "array",
      items: {
        type: "object",
        required: ["id", "title", "publisher", "url", "sourceType", "lastVerified", "nextReviewDue", "maintenanceOwnerRole"],
        properties: {
          id: { type: "string", minLength: 1 },
          title: { type: "string", minLength: 1 },
          publisher: { type: "string", minLength: 1 },
          url: { type: "string", format: "uri" },
          sourceType: { enum: ["official_uc", "campus_catalog", "government", "professional_association", "research", "forecast"] },
          lastVerified: { type: "string", format: "date" },
          nextReviewDue: { type: "string", format: "date" },
          maintenanceOwnerRole: { type: "string", minLength: 1 },
        },
      },
    },
  },
};

const files = {
  "program-families.json": collection(programFamilies),
  "programs.json": collection(programs),
  "careers.json": collection(careers),
  "sources.json": collection(sources),
  "data-contracts.json": dataContracts,
  "institutions/collections.json": collection([collectionRecord]),
  "institutions/institutions.json": collection(institutions),
  "institutions/offerings.json": collection(offerings, { effectiveTerm: "Current catalogs as verified 2026-07-23" }),
  "institutions/admissions.json": collection(admissions),
  "institutions/metrics.json": collection(admitMetrics, { effectiveTerm: "Fall 2025" }),
  "providers/uc/provider.json": providerUc,
  "providers/fixtures/out-of-state-institution.json": outOfStateFixture,
  "medical/path.json": medicalPath,
  "medical/professions.json": medicalProfessions,
  "medical/premed.json": premed,
  ...challenges,
  "journey/onboarding.json": onboarding,
  "journey/nodes.json": journeyNodes,
  "journey/path-profiles.json": pathProfiles,
  "preparation/ag-rules.json": agRules,
  "preparation/gpa-rules.json": gpaRules,
  "preparation/comprehensive-review.json": comprehensiveReview,
  "preparation/roadmap-templates.json": roadmapTemplates,
  "preparation/application-milestones.json": applicationMilestones,
  "preparation/piq.json": piq,
  "schemas/record-collection.schema.json": collectionSchema,
  "schemas/source-registry.schema.json": sourceSchema,
};

const sourceIds = new Set(sources.map((item) => item.id));
const familyIds = new Set(programFamilies.map((item) => item.id));
const programIds = new Set(programs.map((item) => item.id));
const careerIds = new Set(careers.map((item) => item.id));
const institutionIds = new Set(institutions.map((item) => item.id));
const offeringIds = new Set(offerings.map((item) => item.id));

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

function unique(records, label) {
  const seen = new Set();
  for (const record of records) {
    assert(record.id && !seen.has(record.id), `${label}: missing or duplicate id ${record.id}`);
    seen.add(record.id);
  }
}

function validateSourceRefs(value, path = "root") {
  if (Array.isArray(value)) {
    value.forEach((item, index) => validateSourceRefs(item, `${path}[${index}]`));
    return;
  }
  if (!value || typeof value !== "object") return;
  if (Array.isArray(value.sourceIds)) {
    for (const id of value.sourceIds) assert(sourceIds.has(id), `${path}: unknown sourceId ${id}`);
  }
  for (const [key, child] of Object.entries(value)) {
    if (key !== "sourceIds") validateSourceRefs(child, `${path}.${key}`);
  }
}

unique(sources, "sources");
unique(programFamilies, "program families");
unique(programs, "programs");
unique(careers, "careers");
unique(institutions, "institutions");
unique(offerings, "offerings");

for (const item of programs) {
  item.familyIds.forEach((id) => assert(familyIds.has(id), `${item.id}: unknown family ${id}`));
  item.careerIds.forEach((id) => assert(careerIds.has(id), `${item.id}: unknown career ${id}`));
  item.ucOfferingIds.forEach((id) => assert(offeringIds.has(id), `${item.id}: unknown offering ${id}`));
}
for (const item of careers) {
  item.relatedProgramIds.forEach((id) => assert(programIds.has(id), `${item.id}: unknown program ${id}`));
}
for (const item of offerings) {
  assert(institutionIds.has(item.institutionId), `${item.id}: unknown institution`);
  assert(programIds.has(item.canonicalProgramId), `${item.id}: unknown program`);
  for (const prohibited of dataContracts.prohibitedOfferingFields) assert(!(prohibited in item), `${item.id}: prohibited field ${prohibited}`);
}
for (const item of admitMetrics) assert(institutionIds.has(item.institutionId), `${item.id}: unknown institution`);
for (const item of sources) {
  assert(item.maintenanceOwnerRole, `${item.id}: missing owner`);
  assert(item.nextReviewDue, `${item.id}: missing review date`);
}
for (const [path, data] of Object.entries(files)) validateSourceRefs(data, path);

const manifestFiles = Object.entries(files).map(([path, data]) => ({
  path,
  kind: path.startsWith("schemas/") ? "json_schema" : "content",
  recordCount: Array.isArray(data.records) ? data.records.length : 1,
}));
manifestFiles.push({
  path: "manifest.json",
  kind: "manifest",
  recordCount: 1,
});

const manifest = {
  meta: meta({ packageName: "UC Pathways Explorer version-1 content package" }),
  scope: {
    included: ["12 program families", "8 detailed programs", "12 primary career records plus one clinical-data supporting record", "9 UC undergraduate campuses", "verified initial UC offering mappings", "Fall 2025 campus-wide admission context", "UC preparation rules", "medical path and three challenges", "two short journey branches", "synthetic out-of-state portability fixture"],
    excluded: ["Exhaustive all-UC major mapping", "Nationwide student-facing content", "Fall 2027 application dates before official publication", "Invented major-level admit rates", "Personalized admission predictions"],
  },
  fileCount: manifestFiles.length,
  files: manifestFiles,
  validation: {
    generatedAt: `${verified}T00:00:00.000Z`,
    generationIsDeterministic: true,
    checks: ["JSON serialization", "unique identifiers", "source references", "program-family references", "program-career references", "institution-offering references", "prohibited major-admit fields", "maintenance owner and review date"],
  },
};

files["manifest.json"] = manifest;

for (const [relativePath, data] of Object.entries(files)) {
  const destination = join(contentRoot, relativePath);
  await mkdir(dirname(destination), { recursive: true });
  await writeFile(destination, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  contentRoot,
  filesWritten: Object.keys(files).length,
  counts: {
    sources: sources.length,
    programFamilies: programFamilies.length,
    programs: programs.length,
    careers: careers.length,
    institutions: institutions.length,
    offerings: offerings.length,
    campusMetrics: admitMetrics.length,
    challenges: Object.keys(challenges).length,
  },
}, null, 2));
