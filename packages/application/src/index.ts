// The application layer's public surface (ADR-0013). Use cases, read models and the demo session.
// It composes the domain; it holds no rule of its own that the domain could hold instead.

export {
  parseTomanInput,
  toTomanInputValue,
  type TomanParseFailure,
  type TomanParseResult,
} from './money-input';
export {
  civilDateKey,
  minutesToClock,
  parseCivilDateKey,
  shiftDateOptions,
  shiftTimeOptions,
  tehranCivilDate,
  tehranInstant,
  tehranMinutesFromMidnight,
  type CivilDate,
} from './shift-window';
export {
  REQUIREMENT_CATALOGUE,
  areRequirementsBinaryEvaluable,
  requirementById,
  type RequirementOption,
} from './requirement-catalogue';
export {
  DEMO_NEIGHBOURHOODS,
  validateOpportunityForm,
  type AcceptanceMode,
  type DemoNeighbourhood,
  type FieldError,
  type OpportunityFieldName,
  type OpportunityFormValues,
  type OpportunityValidation,
  type PayBasis,
  type ValidatedOpportunityInput,
} from './opportunity-input';
export {
  FACTOR_QUESTIONS,
  NEVER_CAPTURED_FACTORS,
  captureClassificationFactors,
  deriveFactorsFromTerms,
  derivedFactorReadings,
  type DerivedFactorReading,
  type FactorAnswerKey,
  type FactorAnswers,
  type FactorQuestion,
} from './classification-capture';
export {
  DemoSessionConflictError,
  answerFactor,
  classificationSignalFor,
  createOpportunity,
  discardDraft,
  draftOpportunity,
  initialDemoSession,
  markClassificationShown,
  opportunityById,
  publishOpportunity,
  publishedOpportunities,
  selectActor,
  toOpportunity,
  type ActorKey,
  type DemoOpportunityRecord,
  type DemoSession,
} from './demo-session';
export {
  employerHomeModel,
  type EmployerHomeModel,
  type EmployerPlannedArea,
  type EmployerQueueItem,
} from './employer-home';
