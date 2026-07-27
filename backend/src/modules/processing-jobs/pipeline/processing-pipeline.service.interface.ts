export interface IProcessingPipelineService {
  process(jobId: string): Promise<void>;
}
