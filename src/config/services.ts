import { ExpressServer } from "../services/server/ExpressServer";
import { ServerInterface } from "../services/server/Interfaces/ServerInterface";
import { ChatManager } from "../services/whatsapp/LocalChat/ChatManager";
import { ChatManagerInterface } from "../services/whatsapp/Interfaces/ChatManagerInterface";
import { WhatsappService } from "../services/whatsapp/WhatsappService";
import { OpenIAService } from "../services/openIA/OpenIAService";
import { ResponseManagerInterface } from "../services/whatsapp/interfaces/ResponseManager";
import { RequestManager } from "../services/whatsapp/RequestManager";
import { RequestManagerInterface } from "../services/whatsapp/Interfaces/RequestManager";

interface ServicesInterface {
    server: ServerInterface;
    wpp: WhatsappService;
    chatManager: ChatManagerInterface;
    responseManager: ResponseManagerInterface;
    requestManager: RequestManagerInterface;
}

export const services: ServicesInterface = {
    server: new ExpressServer(),
    wpp: new WhatsappService(),
    chatManager: new ChatManager(),
    responseManager: new OpenIAService(process.env.OPENAI_KEY || ""),
    requestManager: new RequestManager(),
};
