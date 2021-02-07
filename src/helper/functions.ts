const chars: string = '0123456789';

export const generateRandomString = (
  length: number,
  initialChars: string
): string => {
  let result = '';
  for (let i = length; i > 0; --i)
    result += chars[Math.floor(Math.random() * chars.length)];
  return `${initialChars}-${result}`;
};
