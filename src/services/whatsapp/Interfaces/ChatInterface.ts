import { MessageInterface } from "./MessageInterface";

export interface ChatInterface {
    getMessages(): MessageInterface[];

    addMessage(message: MessageInterface, timeoutCallback?: () => {}): void;

    getLastMessage(): MessageInterface | undefined;

    clearTimeoutChat(): void;
}
