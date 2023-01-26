import { ZodError } from "zod";

//* UTILS
export const validationErrorMessages = {
  email: `campo e-mail inválido`,
  required: (fieldName: string) => `campo ${fieldName} é obrigatório`,
  invalidType: (fieldName: string, type: string) =>
    `campo ${fieldName} precisa ser do tipo ${type}`,
  max: (fieldName: string, max: number) =>
    `O campo ${fieldName} precisa ter até ${max} caracteres`,
  min: (fieldName: string, min: number) =>
    `O campo ${fieldName} precisa ter mais de ${min} caracteres`,
};

export type ValidationError = ZodError;
