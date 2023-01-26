import { z } from "zod";
import { validationErrorMessages } from ".";

const resetPasswordValidator = z.object({
  token: z
    .string({
      required_error: validationErrorMessages.required("token"),
      invalid_type_error: validationErrorMessages.invalidType(
        "token",
        "string"
      ),
    })
    .max(190, validationErrorMessages.max("token", 190))
    .min(5, validationErrorMessages.min("token", 5)),

  password: z
    .string({
      required_error: validationErrorMessages.required("password"),
      invalid_type_error: validationErrorMessages.invalidType(
        "password",
        "string"
      ),
    })
    .max(250, validationErrorMessages.max("password", 250))
    .min(8, validationErrorMessages.min("password", 8)),
  confirmPassword: z
    .string({
      required_error: validationErrorMessages.required("confirmPassword"),
      invalid_type_error: validationErrorMessages.invalidType(
        "confirmPassword",
        "string"
      ),
    })
    .max(250, validationErrorMessages.max("confirmPassword", 250))
    .min(8, validationErrorMessages.min("confirmPassword", 8))
    .optional(),
});

export type ResetPasswordParams = z.infer<typeof resetPasswordValidator>;

export const resetPasswordValidate = (param: ResetPasswordParams) => {
  return resetPasswordValidator.parse(param);
};
