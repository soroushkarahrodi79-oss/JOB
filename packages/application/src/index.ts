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
  orderingSkillIds,
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
  engagementsForOpportunity,
  initialDemoSession,
  inviteWorker,
  isInvited,
  markClassificationShown,
  opportunityById,
  publishOpportunity,
  publishedOpportunities,
  selectActor,
  toOpportunity,
  type ActorKey,
  type DemoCompletionProof,
  type DemoEngagementRecord,
  type DemoNotification,
  type DemoOpportunityRecord,
  type DemoSession,
} from './demo-session';
export {
  ORDERING_STAGES,
  candidateList,
  provenanceOfStrength,
  type CandidateListModel,
  type CandidateOpportunity,
  type ExcludedCandidate,
  type ExclusionStage,
  type OrderingSignal,
  type OrderingStageId,
  type PriorRelationshipFact,
  type RankedCandidate,
  type ReliabilityFact,
  type SkillFitFact,
} from './candidate-list';
export {
  lastIdentityAttempt,
  recordSimulatedIdentityOutcome,
  type DemoIdentityAttempt,
  type IdentityDemoOutcome,
} from './worker-verification';
export {
  employerHomeModel,
  type EmployerHomeModel,
  type EmployerPlannedArea,
  type EmployerQueueItem,
} from './employer-home';

export { respondToInvitation, type WorkerInvitationDecision } from './worker-response';

export { checkInWorker, issueArrivalCode } from './worker-checkin';

export { submitCompletionProof } from './worker-completion';
