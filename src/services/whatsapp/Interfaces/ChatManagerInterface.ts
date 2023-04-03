import { ChatInterface } from "./ChatInterface";

export interface ChatManagerInterface {
    getChatByNumber(phone: string): ChatInterface|undefined;
    addChat(phone: string): ChatInterface;
    removeChat(phone: string): void;
}