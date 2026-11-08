import { ChatRepository } from "./chat.repository";
import { ChatService } from "./chat.service";
import { prisma } from "@workspace/db";

const repository = new ChatRepository(prisma);
export const chatService = new ChatService(repository);
