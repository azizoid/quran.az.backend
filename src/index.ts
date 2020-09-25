import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT: number = parseInt(process.env.PORT as string) || 4210;
const DB_HOST: string = process.env.DB_HOST as string;

app.listen(PORT, () => {
  console.log(`App is running on ${PORT} , ${DB_HOST}`);
});
