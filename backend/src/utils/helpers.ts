export const sanitizeUser = <T extends Record<string, any>>(user: T) => {
  const { password, two_fa_secret, ...rest } = user;
  return rest;
};

export const normalizeEmail = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw new Error('Email is required');
  }
  const normalized = value.trim().toLowerCase();
  if (!normalized) {
    throw new Error('Email is required');
  }
  return normalized;
};

export const normalizeString = (value: unknown, field: string): string => {
  if (typeof value !== 'string') {
    throw new Error(`${field} is required`);
  }
  const normalized = value.trim();
  if (!normalized) {
    throw new Error(`${field} is required`);
  }
  return normalized;
};

export const normalizeUuid = (value: unknown): string => {
  if (typeof value !== 'string') {
    throw new Error('Valid UUID is required');
  }
  const trimmed = value.trim();
  if (!trimmed) {
    throw new Error('Valid UUID is required');
  }
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(trimmed)) {
    throw new Error('Invalid UUID format');
  }
  return trimmed;
};