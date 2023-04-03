import { MessageInterface } from "./MessageInterface";

export interface ChatInterface 
{
    getMessages(): MessageInterface[];

    addMessage(message: MessageInterface): void;

    getLastMessage(): MessageInterface | undefined;
}