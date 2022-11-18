"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const specializedController_1 = require("../controllers/specializedController");
const router = (0, express_1.Router)();
router.get('/', specializedController_1.getAllSpecialized);
exports.default = router;
