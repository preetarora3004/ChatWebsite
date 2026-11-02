import { prisma } from "@workspace/db"
import { cacheClient } from "../dependency/dependency"
import { AuthService } from "./auth-service"
import { AuthRepository } from "./auth-repository"
import { AuthController } from "./auth-controller"

const repository = new AuthRepository(prisma)
const service = new AuthService(repository, cacheClient)

export const controller = new AuthController(service)


