/**
 * Thrown by library-level code (e.g. conflict resolution) when the user declines
 * to continue. The CLI command layer catches it and exits cleanly, instead of the
 * library calling `process.exit` directly — which would silently kill any program
 * that consumes the Node API.
 */
export class CliAbortError extends Error {
  constructor(message = 'Operation aborted by user') {
    super(message);
    this.name = 'CliAbortError';
  }
}
