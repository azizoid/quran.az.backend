interface KnexConfig {
  [key: string]: object | string;
};

const config: KnexConfig = {
  client: "mysql",
  connection: {
    host: process.env.DB_HOST as string,
    user: process.env.DB_USERNAME as string,
    password: process.env.DB_PASSWORD as string,
    database: process.env.DB_DATABASE as string,
  },
};

export default config