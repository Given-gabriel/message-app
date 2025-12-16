import { Router } from "express";
import { getChatList, sendMessage } from "../controllers/Message.controller.js";
import { isProtected } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/:receiverId", isProtected, sendMessage);
router.get("/", isProtected, getChatList);

export default router;
