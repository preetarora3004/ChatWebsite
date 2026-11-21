import { SessionVerifyController } from "./presentation/controller/session-verify.controller";
import { SessionCreation } from "./application/service/create-session";
import { VerifySession } from "./application/service/verify-session";
import { SessionActiveRepository } from "./infrastructure/repository/session-active.repository";
import { SessionVerifyRepository } from "./infrastructure/repository/session-verify.repository";
import { SessionCreationRepository } from "./infrastructure/repository/session-creation.repository";
import { prisma } from "@workspace/db";

const verifySessionRepository = new SessionVerifyRepository(prisma);
export const verifyService = new VerifySession(verifySessionRepository);

const sessionCreationRepository = new SessionCreationRepository(prisma);
const sessionActiveRepository = new SessionActiveRepository(prisma);

export const sessionVerifyController = new SessionVerifyController(
    verifyService,
);
export const sessionCreationService = new SessionCreation(
    sessionActiveRepository,
    sessionCreationRepository,
);
