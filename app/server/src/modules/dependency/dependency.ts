import { CacheClient } from "@workspace/clients"
import { MessageService } from "../message/message.service";

export const cacheClient = new CacheClient();
export const messageService = new MessageService()
