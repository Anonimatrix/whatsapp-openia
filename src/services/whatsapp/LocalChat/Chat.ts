import { MessageInterface } from "../Interfaces/MessageInterface";
import { ChatInterface } from "../Interfaces/ChatInterface";
import { config } from "../../../config/chats";

export class LocalChat implements ChatInterface {
    protected messages: MessageInterface[] = [];
    protected timeoutChat?: NodeJS.Timeout;

    public getMessages(): MessageInterface[] {
        return this.messages;
    }

    public addMessage(
        message: MessageInterface,
        timeoutCallback?: () => {}
    ): void {
        this.messages.push(message);
        if (timeoutCallback) this.setTimeoutChat(timeoutCallback);
    }

    public getLastMessage(): MessageInterface | undefined {
        return this.messages[this.messages.length - 1];
    }

    /**
     *  Sets a timeout to the chat and clears the previous one if it exists
     * @param timeoutCallback Callback to be executed when the timeout is reached
     */
    public setTimeoutChat(timeoutCallback: () => {}): void {
        this.clearTimeoutChat();
        this.timeoutChat = setTimeout(() => {
            timeoutCallback();
        }, config.timeoutChat);
    }

    public clearTimeoutChat(): void {
        if (this.timeoutChat) clearTimeout(this.timeoutChat);
    }
}
