export const normalizeEmail = (email: string): string => {
  const normalized = email.trim().toLowerCase();
  const [localPart, domain] = normalized.split('@');

  if (domain === 'gmail.com' || domain === 'googlemail.com')
    return `${localPart.replaceAll('.', '')}@gmail.com`;

  return normalized;
};
