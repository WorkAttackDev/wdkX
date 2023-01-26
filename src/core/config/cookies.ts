export type CookiesInstance = {
  readCookie: (name: string) => string | undefined;
  cleanCookie: (name: string) => void;
  writeCookie: ({
    value,
    maxAge,
    name,
  }: {
    value: string;
    maxAge: number;
    name: string;
  }) => void;
};
