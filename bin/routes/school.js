"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shoolController_1 = require("./../controllers/shoolController");
const router = (0, express_1.Router)();
router.get("/seed", shoolController_1.seedSchool);
router.get("/", shoolController_1.getAllSchool);
exports.default = router;
