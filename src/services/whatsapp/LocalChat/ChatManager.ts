import { ChatManagerInterface } from "../Interfaces/ChatManagerInterface";
import { LocalChat } from "./Chat";

interface ChatsInterface {
    [key: string]: LocalChat;
}

export class ChatManager implements ChatManagerInterface {
    protected chats: ChatsInterface = {};

    public getChatByNumber(phone: string): LocalChat | undefined {
        return this.chats[phone];
    }

    public addChat(phone: string): LocalChat {
        const chat = new LocalChat();
        this.chats[phone] = chat;

        return this.chats[phone];
    }

    public removeChat(phone: string): void {
        delete this.chats[phone];
    }
}
