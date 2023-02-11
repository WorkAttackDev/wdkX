import { deleteCookie, getCookie, setCookie } from "cookies-next";
import { IncomingMessage, ServerResponse } from "http";
import { APP } from "../../core";

export type CookiesInstance = {
  readCookie: (name: string) => string | undefined;
  cleanCookie: (name: string, path?: string) => void;
  writeCookie: (options: {
    value: string;
    maxAge: number;
    name: string;
    secure?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
    path?: string;
  }) => void;
};

export const nextJsCookieInstance = ({
  req,
  res,
  app,
  options,
}: {
  req: IncomingMessage;
  res: ServerResponse;
  app: APP;
  options?: {
    value?: string;
    maxAge?: number;
    name?: string;
    secure?: boolean;
    sameSite?: boolean | "lax" | "strict" | "none";
    path?: string;
  };
}): CookiesInstance => ({
  writeCookie: ({ value, maxAge, name, secure, sameSite, path }) => {
    setCookie(options?.name || name, options?.value || value, {
      req,
      res,
      httpOnly: true,
      secure: options?.secure || secure || false,
      maxAge: options?.maxAge ?? maxAge,
      expires: new Date(options?.maxAge ?? maxAge * 1000),
      path: options?.path || path || "/",
      domain: app.DOMAIN,
      sameSite: options?.sameSite || sameSite || "lax",
    });
  },
  cleanCookie: (name, path) =>
    deleteCookie(name, {
      req,
      res,
      path: options?.path || path || "/",
      domain: app.DOMAIN,
    }),
  readCookie: (name: string) => {
    const cookies = getCookie(name, { req, res });

    if (!cookies) throw new Error("cookie not found: " + name);
    return cookies.toString();
  },
});
