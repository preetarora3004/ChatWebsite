import { GetChatParticipantService } from "./application/service/get-chat-participant.service";
import { GetChatParticipantRepository } from "./infrastructure/prisma-repository/get-chat-participant.repository";
import { prisma } from "@workspace/db";

const getChatParticipantRepository = new GetChatParticipantRepository(prisma);

export const getChatParticipantService = new GetChatParticipantService(
    getChatParticipantRepository,
);
