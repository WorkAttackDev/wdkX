import { z } from "zod";
import { validationErrorMessages } from ".";

const LoginWithGoogleValidate = z.object({
  sub: z
    .string({
      required_error: validationErrorMessages.required("sub id"),
      invalid_type_error: validationErrorMessages.invalidType(
        "sub id",
        "string"
      ),
    })
    .max(100, validationErrorMessages.max("sub id", 100))
    .min(10, validationErrorMessages.min("sub id", 10)),
  picture: z
    .string({
      required_error: validationErrorMessages.required("imagem"),
      invalid_type_error: validationErrorMessages.invalidType(
        "imagem",
        "string"
      ),
    })
    .max(300, validationErrorMessages.max("imagem", 300))
    .min(10, validationErrorMessages.min("imagem", 10)),
  name: z
    .string({
      required_error: validationErrorMessages.required("name"),
      invalid_type_error: validationErrorMessages.invalidType("name", "string"),
    })
    .max(100, validationErrorMessages.max("name", 100))
    .min(2, validationErrorMessages.min("name", 2)),
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
  email_verified: z.boolean({
    required_error: validationErrorMessages.required("e-mail verificado"),
    invalid_type_error: validationErrorMessages.invalidType(
      "e-mail verificado",
      "boolean"
    ),
  }),
});

export type LoginWithGoogleValidationParams = z.infer<
  typeof LoginWithGoogleValidate
>;

export const loginWithGoogleValidation = (
  param: LoginWithGoogleValidationParams
) => {
  return LoginWithGoogleValidate.parse(param);
};
