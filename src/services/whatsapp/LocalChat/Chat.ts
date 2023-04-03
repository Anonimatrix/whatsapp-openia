import { MessageInterface } from "../Interfaces/MessageInterface";
import { ChatInterface } from "../Interfaces/ChatInterface";

export class LocalChat implements ChatInterface{
    protected messages: MessageInterface[] = [];

    public getMessages(): MessageInterface[] {
        return this.messages;
    }

    public addMessage(message: MessageInterface): void {
        this.messages.push(message);
    }

    public getLastMessage(): MessageInterface|undefined {
        return this.messages[this.messages.length - 1];
    }
}