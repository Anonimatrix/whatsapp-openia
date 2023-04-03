import { MessageInterface } from "../Interfaces/MessageInterface";

export class Chat {
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