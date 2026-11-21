import { LoginService } from "./application/service/login-service";
import { RegisterAccountService } from "./application/service/register-service";
import { RegisterUserRepository } from "./infrastructure/repository/create-user.repository";
import { GetUserRepository } from "./infrastructure/repository/get-user.repository";
import { UserRegisterController } from "./presentation/controller/user-register.controller";
import { UserLoginController } from "./presentation/controller/user-login.controller";
import { GetDashboardService } from "./application/service/get-dashboard.service";
import { GetDashboardRepository } from "./infrastructure/repository/get-dashboard.repository";
import { GetDashboardController } from "./presentation/controller/get-dashboard.controller";
import { sessionCreationService } from "../auth/auth-compsition";
import { prisma } from "@workspace/db";

const getUserRepository = new GetUserRepository(prisma);
const loginService = new LoginService(
    getUserRepository,
    sessionCreationService,
);

const registerUserRepository = new RegisterUserRepository(prisma);
const registerUserService = new RegisterAccountService(
    registerUserRepository,
    sessionCreationService,
);

const getDashboardRepository = new GetDashboardRepository(prisma);
const getDashboardService = new GetDashboardService(getDashboardRepository);

export const userLoginController = new UserLoginController(loginService);
export const getDashboardController = new GetDashboardController(
    getDashboardService,
);
export const userRegisterController = new UserRegisterController(
    registerUserService,
);
