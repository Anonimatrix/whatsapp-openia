import { Chat } from "./Chat";

interface ChatInterface {
    [key: string]: Chat;
}

export class ChatManager {
    protected chats: ChatInterface = {};

    public getChatByNumber(phone: string): Chat|undefined {
        return this.chats[phone];
    }

    public addChat(phone: string): Chat {
        const chat = new Chat();
        this.chats[phone] = chat;

        return this.chats[phone];
    }

    public removeChat(phone: string): void {
        delete this.chats[phone];
    }
}