import bcrypt from "bcrypt";

export const hash = async (value: string, salt?: string) => {
  return await bcrypt.hash(value, salt || 10);
};

export const compareHash = async (plainValue: string, hashValue: string) => {
  return await bcrypt.compare(plainValue, hashValue);
};
