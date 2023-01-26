import { z } from "zod";
import { validationErrorMessages } from ".";

const LoginValidate = z.object({
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
});

export type LoginValidationParams = z.infer<typeof LoginValidate>;

export const loginValidation = (param: LoginValidationParams) => {
  return LoginValidate.parse(param);
};
