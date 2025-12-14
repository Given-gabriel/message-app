import { Router } from "express";
import { sendMessage } from "../controllers/Message.controller";
import { isProtected } from "../middlewares/auth.middleware";

const router = Router();

router.post("/:receiverId", isProtected, sendMessage);

export default router;
