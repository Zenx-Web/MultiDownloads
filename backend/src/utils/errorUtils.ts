export const GENERIC_SERVER_ERROR = 'An unexpected server error occurred. Please try again later.';
export const JOB_FAILURE_MESSAGE = 'This job failed due to a server error. Please try again later.';

export const logAndExtractError = (context: string, error: unknown): string => {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[${context}]`, message, error);
  return message;
};
