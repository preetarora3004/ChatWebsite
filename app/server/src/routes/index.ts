import { Router } from "express";
import AuthRoutes from "@workspace/server/auth/presentation/routes/auth.routes";
import UserRoutes from "@workspace/server/user/presentation/routes/user-routes";

export function registerRoutes(): Router {
    const router = Router();

    router.use("/auth", AuthRoutes);
    router.use("/user", UserRoutes);

    return router;
}
