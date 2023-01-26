import { FullUser } from "../../models/User";

// Todo - add generic return type that not return the password
export const sanitizeUser = (user: FullUser) => {
  const { password, ...validUser } = user;
  return validUser;
};

export const slugify = (str: string) =>
  str
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^\w\-]+/g, "-");
