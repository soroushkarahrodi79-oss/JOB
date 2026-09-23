import {
  availabilityExcludes,
  deriveWorkerTrust,
  distanceKey,
  evaluateAvailability,
  evaluateEligibility,
  evaluateTravelBoundary,
  locationExcludes,
  type AttestationStrength,
  type AvailabilityEvaluation,
  type EligibilityEvaluation,
  type EligibilityReason,
  type EligibilityRequirement,
  type LocationEvaluation,
  type OpportunityTerms,
  type ProvenanceLevel,
  type SyntheticDemoWorld,
  type Worker,
} from '@platform/domain';
import { orderingSkillIds, requirementById } from './requirement-catalogue';

// E-04's read model — the matching pipeline, as a pure function of the shared world and one
// published opportunity.
//
// THE PIPELINE IS THE PRODUCT (docs/product/experience/matching.md). Seven stages in a fixed order:
//
//   1 Eligibility    ┐
//   2 Availability   ├─ hard filters. Decide who is a candidate at all.
//   3 Location       ┘  (Location filters only where a travel boundary is recorded; else it orders.)
//   4 Skill fit      ┐
//   5 Reliability    ├─ ordering. Decide only where a candidate sits. Never introduce or remove one.
//   6 Prior relation ┤
//   7 Preferences    ┘
//
// Stages 1–3 partition the workers into included and excluded; stages 4–7 order ONLY the included
// set. No ordering stage can move a worker across that partition — domain invariant 4, and the
// GATE 4 requirement that "no ordering stage may reintroduce an excluded candidate or exclude an
// eligible one". The comparator below is a lexicographic comparison of named, openable facts, in
// priority order; it is deliberately NOT a composite score, because a single number is the one
// thing this product refuses to put on the screen (matching.md rule 4).
//
// Every inclusion, exclusion and ordering statement is derived from a recorded fact — an
// attestation, an engagement event, a declared availability, a recorded distance — and each carries
// that fact's provenance. A clause that cannot name its source is not produced (matching.md rule 1).
//
// Pay is NOT an input anywhere. The charter rules out competing on price, so the offered amount can
// neither include, exclude, nor order a candidate.

/** Maps an attestation's strength to the provenance level the Evidence Margin renders. */
export function provenanceOfStrength(strength: AttestationStrength): ProvenanceLevel {
  switch (strength) {
    case 'ProviderVerifiedSimulated':
      return 'VerifiedSimulated';
    case 'EmployerConfirmed':
      return 'Observed';
    case 'SelfDeclared':
      return 'SelfDeclared';
  }
}

export type ExclusionStage = 'Eligibility' | 'Availability' | 'Location';
export type OrderingStageId = 'SkillFit' | 'Reliability' | 'PriorRelationship' | 'Preferences';

/** The ordering stages, in the fixed order the ladder DISPLAYS them (matching.md stages 4–7). */
export const ORDERING_STAGES: readonly OrderingStageId[] = [
  'SkillFit',
  'Reliability',
  'PriorRelationship',
  'Preferences',
];

export interface SkillFitFact {
  readonly id: string;
  readonly label: string;
  readonly provenance: ProvenanceLevel;
}

export interface ReliabilityFact {
  readonly completed: number;
  readonly onTimeArrivals: number;
  readonly cancellations: number;
}

export interface PriorRelationshipFact {
  readonly completedWithEmployer: number;
  readonly preferredCrew: boolean;
}

/**
 * One ordering rung for one candidate. `acted` is whether this stage found any positive fact for
 * this worker; a stage that found nothing renders as a neutral "nothing recorded" line, never as a
 * penalty. Provenance is the mark of the fact the rung names.
 */
export interface OrderingSignal {
  readonly stage: OrderingStageId;
  readonly acted: boolean;
  readonly provenance: ProvenanceLevel;
  readonly skillFit?: readonly SkillFitFact[];
  readonly reliability?: ReliabilityFact;
  readonly priorRelationship?: PriorRelationshipFact;
}

export interface RankedCandidate {
  readonly workerId: string;
  readonly name: string;
  readonly neighbourhood: string;
  readonly distanceKilometres?: number;
  readonly rank: number;
  readonly eligibility: EligibilityEvaluation;
  readonly availability: AvailabilityEvaluation;
  readonly location: LocationEvaluation;
  readonly ordering: readonly OrderingSignal[];
  /** The single ordering stage named on the row header, or null when nothing is yet recorded. */
  readonly topOrderingStage: OrderingStageId | null;
}

export interface ExcludedCandidate {
  readonly workerId: string;
  readonly name: string;
  readonly neighbourhood: string;
  readonly distanceKilometres?: number;
  readonly stage: ExclusionStage;
  readonly eligibility: EligibilityEvaluation;
  readonly availability: AvailabilityEvaluation;
  readonly location: LocationEvaluation;
  /** The one unmet requirement, when the exclusion is eligibility. Never more than one. */
  readonly unmetRequirement?: EligibilityReason;
}

export interface CandidateListModel {
  readonly opportunityId: string;
  readonly ranked: readonly RankedCandidate[];
  readonly excluded: readonly ExcludedCandidate[];
  /** Present only when the eligible list is empty: the requirement that removed the most people. */
  readonly emptyReason?: {
    readonly requirementId: string;
    readonly requirementLabel: string;
    readonly count: number;
  };
  readonly hasTravelBoundary: boolean;
}

export interface CandidateOpportunity {
  readonly id: string;
  readonly employerId: string;
  readonly terms: OpportunityTerms;
  readonly requirements: readonly EligibilityRequirement[];
}

function skillFitFor(worker: Worker, orderingIds: readonly string[]): readonly SkillFitFact[] {
  const relevant = new Set(orderingIds);
  return worker.attestations
    .filter(
      (attestation) => attestation.state === 'Satisfied' && relevant.has(attestation.criterionId),
    )
    .map((attestation) => ({
      id: attestation.criterionId,
      label: requirementById(attestation.criterionId)?.label ?? attestation.criterionId,
      provenance: provenanceOfStrength(attestation.strength),
    }));
}

function reliabilityFor(world: SyntheticDemoWorld, workerId: string): ReliabilityFact {
  // Derived from the event record, never seeded (demo-dataset.md; truth-matrix row 14).
  const trust = deriveWorkerTrust(workerId, world.engagementRecords, []);
  return {
    completed: trust.completed,
    onTimeArrivals: trust.onTimeArrivals,
    cancellations: trust.cancellations,
  };
}

function priorRelationshipFor(
  world: SyntheticDemoWorld,
  workerId: string,
  employerId: string,
): PriorRelationshipFact {
  // Employer-specific, always: a relationship with a different employer confers nothing here
  // (explanation.md rule 4). Both facts are read only for THIS employer.
  const completedWithEmployer = world.engagementRecords.filter(
    (record) =>
      record.workerId === workerId &&
      record.employerId === employerId &&
      (record.engagementState === 'Completed' || record.engagementState === 'Settled'),
  ).length;
  const preferredCrew = world.preferredCrew.some(
    (link) => link.workerId === workerId && link.employerId === employerId,
  );
  return { completedWithEmployer, preferredCrew };
}

function orderingSignals(
  world: SyntheticDemoWorld,
  worker: Worker,
  opportunity: CandidateOpportunity,
  orderingIds: readonly string[],
): readonly OrderingSignal[] {
  const skillFit = skillFitFor(worker, orderingIds);
  const reliability = reliabilityFor(world, worker.id);
  const prior = priorRelationshipFor(world, worker.id, opportunity.employerId);
  return [
    {
      stage: 'SkillFit',
      acted: skillFit.length > 0,
      // Skill fit names declared/verified skills; provenance is the strongest present, or self-declared.
      provenance: skillFit.some((fact) => fact.provenance === 'VerifiedSimulated')
        ? 'VerifiedSimulated'
        : 'SelfDeclared',
      skillFit,
    },
    {
      stage: 'Reliability',
      acted: reliability.completed > 0 || reliability.cancellations > 0,
      provenance: 'Derived',
      reliability,
    },
    {
      stage: 'PriorRelationship',
      acted: prior.completedWithEmployer > 0 || prior.preferredCrew,
      provenance: 'Observed',
      priorRelationship: prior,
    },
    {
      // No soft preferences are recorded in the prototype, so this stage never acts. It is rendered
      // so the ladder is honestly seven rungs, not silently six.
      stage: 'Preferences',
      acted: false,
      provenance: 'Observed',
    },
  ];
}

function signal(candidate: RankedCandidate, stage: OrderingStageId): OrderingSignal | undefined {
  return candidate.ordering.find((entry) => entry.stage === stage);
}

/**
 * The ranking comparator. Prior relationship, reliability and skill fit are compared as named
 * facts; where all recorded ordering signals tie, soft distance breaks the tie ONLY if no travel
 * boundary was set. A recorded travel boundary remains a hard location filter, not an ordering
 * advantage. Missing distance is never read as zero or used to exclude: candidates with unknown
 * distance follow known distances at this final soft tie-break and remain explicitly unknown.
 * Stable worker ID is the final total-order tie-breaker. No composite score is produced.
 */
function compareCandidates(a: RankedCandidate, b: RankedCandidate): number {
  const priorA = signal(a, 'PriorRelationship')?.priorRelationship;
  const priorB = signal(b, 'PriorRelationship')?.priorRelationship;
  const priorScore = (fact?: PriorRelationshipFact) =>
    fact === undefined ? 0 : (fact.preferredCrew ? 1_000 : 0) + fact.completedWithEmployer;
  const byPrior = priorScore(priorB) - priorScore(priorA);
  if (byPrior !== 0) return byPrior;

  const relA = signal(a, 'Reliability')?.reliability;
  const relB = signal(b, 'Reliability')?.reliability;
  const byCompleted = (relB?.completed ?? 0) - (relA?.completed ?? 0);
  if (byCompleted !== 0) return byCompleted;
  const byOnTime = (relB?.onTimeArrivals ?? 0) - (relA?.onTimeArrivals ?? 0);
  if (byOnTime !== 0) return byOnTime;
  const byCancellations = (relA?.cancellations ?? 0) - (relB?.cancellations ?? 0);
  if (byCancellations !== 0) return byCancellations;

  const bySkill =
    (signal(b, 'SkillFit')?.skillFit?.length ?? 0) - (signal(a, 'SkillFit')?.skillFit?.length ?? 0);
  if (bySkill !== 0) return bySkill;

  if (a.location.kind === 'NoBoundary' && b.location.kind === 'NoBoundary') {
    // Unknown stays unknown; it must not acquire a fake 0 km distance or a hard exclusion.
    if (a.distanceKilometres === undefined && b.distanceKilometres !== undefined) return 1;
    if (b.distanceKilometres === undefined && a.distanceKilometres !== undefined) return -1;
    if (a.distanceKilometres !== undefined && b.distanceKilometres !== undefined) {
      const byDistance = a.distanceKilometres - b.distanceKilometres;
      if (byDistance !== 0) return byDistance;
    }
  }
  return a.workerId.localeCompare(b.workerId);
}

/** The stage named on the row header: the highest-priority ordering stage that acted, or null. */
function topOrderingStage(signals: readonly OrderingSignal[]): OrderingStageId | null {
  const priority: readonly OrderingStageId[] = ['PriorRelationship', 'Reliability', 'SkillFit'];
  for (const stage of priority) {
    if (signals.find((entry) => entry.stage === stage)?.acted) return stage;
  }
  return null;
}

/**
 * Evaluates every worker in the shared world against one published opportunity and returns the
 * candidate list: the eligible set in explained order, and the excluded set with each exclusion's
 * single reason. Pure and deterministic.
 */
export function candidateList(
  world: SyntheticDemoWorld,
  opportunity: CandidateOpportunity,
): CandidateListModel {
  const opportunityWindow = {
    startsAt: opportunity.terms.workStartsAt,
    endsAt: opportunity.terms.workEndsAt,
  };
  const orderingIds = orderingSkillIds(opportunity.requirements);

  const included: RankedCandidate[] = [];
  const excluded: ExcludedCandidate[] = [];

  for (const worker of world.workers) {
    const name = world.workerNames[worker.id] ?? worker.id;
    const neighbourhood = worker.location.neighbourhood;
    const distanceKilometres =
      world.distanceKilometres[
        distanceKey(opportunity.terms.location.neighbourhood, neighbourhood)
      ];

    const eligibility = evaluateEligibility(worker, opportunity.requirements);
    const availability = evaluateAvailability(
      world.availabilityByWorker[worker.id],
      opportunityWindow,
    );
    const location = evaluateTravelBoundary(opportunity.terms.travelBoundary, distanceKilometres);

    const common = {
      workerId: worker.id,
      name,
      neighbourhood,
      eligibility,
      availability,
      location,
    };
    const withDistance =
      distanceKilometres === undefined ? common : { ...common, distanceKilometres };

    // Hard gates, in pipeline order. The FIRST failing gate is the one recorded reason — never a
    // dossier of everything the worker lacks (matching.md rule 3; explanation.md exclusion).
    if (!eligibility.eligible) {
      excluded.push({
        ...withDistance,
        stage: 'Eligibility',
        ...(eligibility.exclusionReason === undefined
          ? {}
          : { unmetRequirement: eligibility.exclusionReason }),
      });
      continue;
    }
    if (availabilityExcludes(availability)) {
      excluded.push({ ...withDistance, stage: 'Availability' });
      continue;
    }
    if (locationExcludes(location)) {
      excluded.push({ ...withDistance, stage: 'Location' });
      continue;
    }

    const ordering = orderingSignals(world, worker, opportunity, orderingIds);
    included.push({
      ...withDistance,
      rank: 0,
      ordering,
      topOrderingStage: topOrderingStage(ordering),
    });
  }

  const ranked = [...included]
    .sort(compareCandidates)
    .map((candidate, index) => ({ ...candidate, rank: index + 1 }));

  return {
    opportunityId: opportunity.id,
    ranked,
    excluded,
    ...(ranked.length === 0 ? emptyReason(excluded, opportunity.requirements) : {}),
    hasTravelBoundary: opportunity.terms.travelBoundary !== undefined,
  };
}

/** Names the requirement that removed the most people, so an empty list can be acted on (matching.md rule 5). */
function emptyReason(
  excluded: readonly ExcludedCandidate[],
  requirements: readonly EligibilityRequirement[],
): Pick<CandidateListModel, 'emptyReason'> {
  const counts = new Map<string, number>();
  for (const candidate of excluded) {
    if (candidate.stage === 'Eligibility' && candidate.unmetRequirement !== undefined) {
      const id = candidate.unmetRequirement.requirementId;
      counts.set(id, (counts.get(id) ?? 0) + 1);
    }
  }
  let top: { requirementId: string; count: number } | undefined;
  for (const [requirementId, count] of counts) {
    if (top === undefined || count > top.count) top = { requirementId, count };
  }
  if (top === undefined) return {};
  const label =
    requirements.find((requirement) => requirement.id === top.requirementId)?.label ??
    top.requirementId;
  return {
    emptyReason: { requirementId: top.requirementId, requirementLabel: label, count: top.count },
  };
}
