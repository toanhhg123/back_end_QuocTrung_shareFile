"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const subjectController_1 = require("../controllers/subjectController");
const router = (0, express_1.Router)();
router.get('/', subjectController_1.getAllSubject);
router.get('/specialized/:id', subjectController_1.getAllSubjectsBySpecializedId);
exports.default = router;
