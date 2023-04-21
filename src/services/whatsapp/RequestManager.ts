import { config } from "../../config/chats";
import { services } from "../../config/services";
import { RequestManagerInterface } from "./Interfaces/RequestManager";

export class RequestManager implements RequestManagerInterface {
    async manage(entry: any) {
        // Checking if the message is valid and returning a 400 if it is not
        if (!services.wpp.isValidMessage(entry)) {
            return 400;
        }

        // Parsing all information from the message
        const { from, msg_body } = services.wpp.parseMessage(entry);

        //Checking if the message is a command and executing it
        await this.manageCommand(from, msg_body);

        // Getting the chat by the phone number
        const chat = services.chatManager.getChatByNumber(from);

        // If the chat does not exist, return a 200
        if (!chat) {
            return 400;
        }

        //Adding message and setting the timeout to remove chat if the timeout is reached
        chat.addMessage(msg_body, async () => {
            await services.wpp.sendMessage(from, config.timeoutMessage);
            services.chatManager.removeChat(from);
        });
        // Getting all messages
        const messages = chat.getMessages().map((message) => message.body);

        try {
            // Getting the response from the message
            const response = await services.responseManager.getResponse(
                messages
            );

            // Sending the response
            await services.wpp.sendMessage(from, response);
        } catch (e) {
            throw e;
        }

        return 200;
    }

    /**
     * Executes the command if it exists
     * @param from Phone number
     * @param msg_body Message body
     */
    async manageCommand(from: string, msg_body: string) {
        if (await services.wpp.isCommand(msg_body)) {
            const { commandFunction, args } = await services.wpp.getCommand(
                msg_body
            );

            if (commandFunction) {
                commandFunction(services.wpp, services.chatManager, from, args);
            }
        }
    }
}