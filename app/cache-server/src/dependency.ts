import { Repository } from "../repository/repository";
import { Service } from "../service/service";
import { Controller } from "../controller/controller";

const repository = new Repository();
const service = new Service(repository);

export const controller = new Controller(service);
