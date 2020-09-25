import express from "express";
import helmet from "helmet";
import cors from "cors";

import apiRouter from "./routes/api.routes"

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());
app.disable("x-powered-by");

app.use(apiRouter);

// app.use((err: Error, req: Request, res: Response) => {
//   res.status(500).json({ message: err.message })
// })

export default app;
