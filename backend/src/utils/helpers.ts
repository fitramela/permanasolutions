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

export const normalizeUserId = (value: unknown): number => {
  const id = Number(value);
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('Valid user id is required');
  }

  return id;
};
