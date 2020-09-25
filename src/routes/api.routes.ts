import { Router } from 'express'

import { querySearch, soorahSearch, ayahSearch, randomSearch } from "../controllers/quranaz"

const router = Router();

router.get("/api/search/:query", querySearch);

router.get("/api/:soorah(\\d+)", soorahSearch);

router.get("/api/:soorah(\\d+)/:ayah(\\d+)", ayahSearch);

router.get("/api/random/:limit(\\d+)?/:query?", randomSearch);

router.get("/api2", (req, res) => {
  const DB_HOST: string = process.env.DB_HOST as string;
  res.send(DB_HOST)
})

export default router;

