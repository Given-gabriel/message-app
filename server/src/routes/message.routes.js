import { Router } from "express";
import { sendMessage } from "../controllers/Message.controller.js";
import { isProtected } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:receiverId", isProtected, sendMessage);

export default router;
