import { MessageCreationRepository } from "./infrastructure/repository/message-creation.repository";
import { MessageCreationService } from "./application/service/message-creation.service";
import { prisma } from "@workspace/db";

const messageCreationRepository = new MessageCreationRepository(prisma);

export const messageCreationService = new MessageCreationService(
    messageCreationRepository,
);
