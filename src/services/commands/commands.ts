import { ChatManager } from "../whatsapp/Items/ChatManager";
import { WhatsappService } from "../whatsapp/WhatsappService";

interface CommandsInterface {
    [key: string]: (wppService: WhatsappService, chatManager: ChatManager, from: string, args: Array<string>) => Promise<any>;
}

export const commands: CommandsInterface = {
    init: async (wppService: WhatsappService, chatManager: ChatManager, from: string) => {
        wppService.sendMessage(from, "Hola, conversación iniciada, puede empezar a escribir");
        return chatManager.getChatByNumber(from) || chatManager.addChat(from);
    },
    close: async (wppService: WhatsappService, chatManager: ChatManager, from: string) => {
        wppService.sendMessage(from, "Conversacion finalizada");
        return chatManager.getChatByNumber(from) && chatManager.removeChat(from);
    }
}