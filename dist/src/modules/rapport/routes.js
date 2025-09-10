"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const rapport_controller_1 = require("./controller/rapport.controller");
const router = (0, express_1.Router)();
// Routes CRUD
router.get("/", rapport_controller_1.RapportController.getAll);
router.get("/:id", rapport_controller_1.RapportController.getOne);
router.post("/", rapport_controller_1.RapportController.create);
router.put("/:id", rapport_controller_1.RapportController.update);
router.delete("/:id", rapport_controller_1.RapportController.delete);
exports.default = router;
