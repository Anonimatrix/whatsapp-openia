import { ExpressServer } from "../services/server/ExpressServer";
import { ServerInterface } from "../services/server/Interfaces/ServerInterface";
import { WhatsappService } from "../services/whatsapp/WhatsappService";

interface ServicesInterface {
    server: ServerInterface;
    wpp: WhatsappService;
}

export const services: ServicesInterface = {
    server: new ExpressServer(),
    wpp: new WhatsappService()
}