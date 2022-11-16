"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authMiddleware_1 = require("../middlewares/authMiddleware");
const userController_1 = require("../controllers/userController");
const router = (0, express_1.Router)();
router.post("/login", userController_1.login);
router.post("/register", userController_1.register);
router.get("/getInfo", (0, authMiddleware_1.authorize)(["ADMIN", "USER"]), userController_1.getInfoUser);
router.post("/seedUser", userController_1.seedUser);
exports.default = router;
