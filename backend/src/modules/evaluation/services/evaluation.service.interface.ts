export interface IEvaluationService {
  evaluateAttempt(attemptId: string): Promise<number>;
}
