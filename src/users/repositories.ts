import { FullUser, User } from "./models/User";
import { Token, TokenType } from "./models/Token";

export type DeleteByIdRepository = (id: string) => Promise<void>;

//* User

export type CreateUserRepository<SignupParams> = (
  data: SignupParams
) => Promise<FullUser>;

export type FindUserByEmailRepository = (
  email: string
) => Promise<FullUser | null>;

export type UpdateEmailVerifiedByUserIdRepository = (
  userId: string
) => Promise<FullUser | null>;

export type UpdateUserRepository = (data: { userId: string }) => Promise<User>;

export type UpdateUserPasswordRepository<T> = (data: {
  userId: string;
  hashedPassword: string;
}) => Promise<T | User>;

//* Tokens
export type CreateTokenRepository<TT extends TokenType> = (data: {
  expiresAt: Date;
  type: TT;
  userId: string;
}) => Promise<Token>;

export type FindTokenRepository<T = Token> = T extends Token
  ? (token: string) => Promise<T | null>
  : (token: string) => Promise<Token | null>;

export type DeleteTokenRepository = (token: string) => Promise<void>;
