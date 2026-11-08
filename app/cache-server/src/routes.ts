import { controller } from "./dependency";
import { Router } from "express";

const router = Router();

router.post("/cache-user/:userId", controller.storeCache.bind(controller));
router.get("/cache-user/:token", controller.getCache.bind(controller));
router.delete("/cache-user", controller.deleteCache.bind(controller));

router.post("/session-user", controller.cacheSession.bind(controller));
router.get("/session-user/:token", controller.verifySession.bind(controller));

router.post(
    "/participants-cache",
    controller.cacheParticipant.bind(controller),
);
router.get("/participant-cache/:chatId", controller.getParticipants.bind(controller));

export default router;
