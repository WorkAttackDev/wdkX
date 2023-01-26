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
}: {
  req: IncomingMessage;
  res: ServerResponse;
  app: APP;
}): CookiesInstance => ({
  writeCookie: ({ value, maxAge, name, secure, sameSite, path }) => {
    setCookie(name, value, {
      req,
      res,
      httpOnly: true,
      secure: secure || false,
      maxAge: maxAge,
      path: path || "/",
      domain: app.DOMAIN,
      sameSite: sameSite || "lax",
    });
  },
  cleanCookie: (name, path) =>
    deleteCookie(name, {
      req,
      res,
      path: path || "/",
      domain: app.DOMAIN,
    }),
  readCookie: (name: string) => {
    const cookies = getCookie(name, { req, res });

    if (!cookies) throw new Error("cookie not found: " + name);
    return cookies.toString();
  },
});
