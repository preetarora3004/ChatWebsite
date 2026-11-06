import { UserController } from "./user-controller";
import { UserService } from "./user-service";
import { UserRepository } from "./user-repository";
import { prisma } from "@workspace/db";

const respository = new UserRepository(prisma);
const service = new UserService(respository);

export const controller = new UserController(service);
