export const isValidEmail = (value: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());

export const isValidPassword = (value: string): boolean => value.trim().length >= 6;

export const isValidAge = (value: string): boolean => {
  const age = Number(value);
  return Number.isInteger(age) && age >= 12 && age <= 99;
};

export const isValidCity = (value: string): boolean => value.trim().length >= 2;

export const isValidSocialUrl = (value: string): boolean =>
  value.trim().length === 0 || /^https?:\/\/.+/.test(value.trim());
