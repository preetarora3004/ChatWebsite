import { prisma } from "@workspace/db"
import { AuthService } from "./auth-service"
import { AuthRepository } from "./auth-repository"
import { AuthController } from "./auth-controller"

const repository = new AuthRepository(prisma)
const service = new AuthService(repository)

export const controller = new AuthController(service)


