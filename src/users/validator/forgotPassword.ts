import { z } from "zod";
import { validationErrorMessages } from ".";

const forgotPasswordValidator = z.object({
  email: z
    .string({
      required_error: validationErrorMessages.required("e-mail"),
      invalid_type_error: validationErrorMessages.invalidType(
        "e-mail",
        "string"
      ),
    })
    .email(validationErrorMessages.email)
    .max(200, validationErrorMessages.max("e-mail", 200))
    .min(5, validationErrorMessages.min("e-mail", 5)),
});

export type ForgotPasswordParams = z.infer<typeof forgotPasswordValidator>;

export const forgotPasswordValidation = (param: ForgotPasswordParams) => {
  return forgotPasswordValidator.parse(param);
};
