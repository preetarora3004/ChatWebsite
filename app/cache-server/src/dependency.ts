import { Repository } from "./repository";
import { Service } from "./service";
import { Controller } from "./controller";

const repository = new Repository();
const service = new Service(repository);

export const controller = new Controller(service);
