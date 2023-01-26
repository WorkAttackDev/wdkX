export type APP = {
  NAME: string;
  HOST: string;
  API_SECRET: string;
  DOMAIN: string;
  IS_PRODUCTION: boolean;
  REFRESH_TOKEN_COOKIE_NAME: string;
  ACCESS_TOKEN_COOKIE_NAME: string;
  HASH_SALT?: string;
};

export const initializeApp = ({
  API_SECRET,
  DOMAIN,
  IS_PRODUCTION,
  REFRESH_TOKEN_COOKIE_NAME,
  HOST,
  ACCESS_TOKEN_COOKIE_NAME,
  NAME,
  HASH_SALT,
}: APP): APP => {
  return {
    HOST,
    NAME,
    API_SECRET,
    DOMAIN,
    IS_PRODUCTION,
    REFRESH_TOKEN_COOKIE_NAME,
    ACCESS_TOKEN_COOKIE_NAME,
    HASH_SALT,
  };
};
