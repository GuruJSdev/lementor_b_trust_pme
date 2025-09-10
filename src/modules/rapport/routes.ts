import { Router } from "express";
import { RapportController } from "./controller/rapport.controller"
const router = Router();

// Routes CRUD
router.get("/", RapportController.getAll);
router.get("/:id", RapportController.getLastByUser);
// router.post("/", RapportController.create);
router.put("/:id", RapportController.update);
router.delete("/:id", RapportController.delete);

export default router;