import { ExpressServer } from "../services/server/ExpressServer";
import { ServerInterface } from "../services/server/Interfaces/ServerInterface";
import { ChatManager } from "../services/whatsapp/LocalChat/ChatManager";
import { ChatManagerInterface } from "../services/whatsapp/Interfaces/ChatManagerInterface";
import { WhatsappService } from "../services/whatsapp/WhatsappService";

interface ServicesInterface {
    server: ServerInterface;
    wpp: WhatsappService;
    chatManager: ChatManagerInterface;
}

export const services: ServicesInterface = {
    server: new ExpressServer(),
    wpp: new WhatsappService(),
    chatManager: new ChatManager(),
}