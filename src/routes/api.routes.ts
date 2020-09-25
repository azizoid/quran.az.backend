import { Router } from 'express'

import { querySearch, soorahSearch, ayahSearch, randomSearch } from "../controllers/quranaz"

const router = Router();

router.get("/api/search/:query", querySearch);

router.get("/api/:soorah(\\d+)", soorahSearch);

router.get("/api/:soorah(\\d+)/:ayah(\\d+)", ayahSearch);

router.get("/api/random/:limit(\\d+)?/:query?", randomSearch);

export default router;

