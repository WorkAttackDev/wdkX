import { FullUser } from "./User";

export const TokenType = {
  REFRESH_TOKEN: "REFRESH_TOKEN",
  VERIFICATION_TOKEN: "VERIFICATION_TOKEN",
  FORGET_TOKEN: "FORGET_TOKEN",
  ACTIVATION_TOKEN: "ACTIVATION_TOKEN",
} as const;

export type TokenType = typeof TokenType[keyof typeof TokenType];

export type Token = {
  id: string;
  type: TokenType;
  token: string;
  userId: string;
  owner?: FullUser;
  expiresAt: Date | string;
  createdAt: Date | string;
};
