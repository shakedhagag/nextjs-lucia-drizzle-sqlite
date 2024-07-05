export const AUTHENTICATION_ERROR_MESSAGE =
  "You must be logged in to view this content";

export const AuthenticationError = class AuthenticationError extends Error {
  constructor() {
    super(AUTHENTICATION_ERROR_MESSAGE);
    this.name = "AuthenticationError";
  }
};

export class RateLimitError extends Error {
  constructor() {
    super("Rate limit exceeded");
    this.name = "RateLimitError";
  }
}
