import * as dotenv from "dotenv";
dotenv.config();

import app from "./app";

const PORT: number = parseInt(process.env.PORT as string) || 4210;

app.listen(PORT, () => {
  console.log(`App is running on ${PORT}`);
});
