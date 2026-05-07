import express from "express";
import { getKategori } from "../controllers/kategoriController.mjs";
import {
  getAllStudios,
  getStudioDetail,
} from "../controllers/studioController.mjs";

const router = express.Router();

router.get("/studios", getAllStudios);
router.get("/studios/:id", getStudioDetail);
router.get("/categories", getKategori);

export default router;
