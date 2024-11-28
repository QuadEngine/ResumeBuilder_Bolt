export class ExtractorError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ExtractorError';
  }
}

export class ProcessingError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ProcessingError';
  }
}

export class APIError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'APIError';
  }
}