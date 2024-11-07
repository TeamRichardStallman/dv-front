const getEnvVar = (key: string, defaultValue: string) => {
  const value = process.env[key];
  if (!value) {
    if (defaultValue === undefined) {
      throw new Error(`Environment variable ${key} is required`);
    }
    return defaultValue;
  }
  return value;
};

export const Config = {
  NEXTAUTH_URL: getEnvVar("NEXT_PUBLIC_NEXTAUTH_URL", "http://localhost:3000"),
};
