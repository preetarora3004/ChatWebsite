import { controller } from "./auth-dependency";
import { Router } from "express";
import { asyncHandler } from "@workspace/http";

const router = Router();

router.post("/register", asyncHandler(controller.createAccount.bind(controller)));
router.get("/login", asyncHandler(controller.login.bind(controller)))
router.get("/verify", asyncHandler(controller.verifySession.bind(controller)))

export default router;
