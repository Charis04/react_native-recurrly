const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export type AuthFieldErrors = {
  emailAddress?: string;
  password?: string;
  confirmation?: string;
  code?: string;
  form?: string;
};

export function validateEmail(emailAddress: string): string | undefined {
  const email = emailAddress.trim().toLowerCase();
  if (!email) return "Enter your email address.";
  if (!EMAIL_PATTERN.test(email)) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(password: string): string | undefined {
  if (!password) return "Enter your password.";
  if (password.length < 8) return "Use at least 8 characters.";
  return undefined;
}

export function validatePasswordConfirmation(password: string, confirmation: string): string | undefined {
  if (!confirmation) return "Confirm your password.";
  if (password !== confirmation) return "Passwords do not match.";
  return undefined;
}

export function validateCode(code: string): string | undefined {
  if (!/^\d{6}$/.test(code.trim())) return "Enter the 6-digit code.";
  return undefined;
}

export function getClerkErrorMessage(error: unknown, fallback: string): string {
  if (typeof error === "object" && error !== null) {
    const clerkError = error as { longMessage?: string; message?: string };
    return clerkError.longMessage || clerkError.message || fallback;
  }

  return fallback;
}
