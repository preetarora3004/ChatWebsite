import { controller } from "../dependency/dependency";
import { Router } from "express";

const router = Router();

router.post("/cache-user", controller.storeCache.bind(controller));
router.get("/cache-user", controller.getCache.bind(controller));
router.delete("/cache-user", controller.deleteCache.bind(controller));

router.post("/session-user", controller.storeCache.bind(controller));
router.get("/session-user/:token", controller.verifySession.bind(controller));

export default router;
