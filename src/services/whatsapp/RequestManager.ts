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
        const { from, msg_body, media_id } = await services.wpp.parseMessage(entry);

        if(!msg_body && !media_id) {
            return 400;
        }

        //Checking if the message is a command and executing it
        await this.manageCommand(from, msg_body);

        // Getting the chat by the phone number
        const chat = services.chatManager.getChatByNumber(from);

        // If the chat does not exist, return a 200
        if (!chat) {
            return 400;
        }

        // If the message is a media, add in the message body
        const parsedMessage = this.createMessageWithMediaViewer(msg_body, media_id);

        //Adding message and setting the timeout to remove chat if the timeout is reached
        chat.addMessage({ body: parsedMessage }, async () => {
            await services.wpp.sendMessage(from, config.timeoutMessage);
            services.chatManager.removeChat(from);
        });

        // Getting all messages parsed and filtered from the chat
        const messages = chat.getMessages().map((message) => message.body)
            .filter((message) => !services.wpp.isCommand(message));

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
        if (services.wpp.isCommand(msg_body)) {
            const { commandFunction, args } = services.wpp.getCommand(
                msg_body
            );

            if (commandFunction) {
                commandFunction(services.wpp, services.chatManager, from, args);
            }
        }
    }

    createMessageWithMediaViewer(msg_body: string, media_id?: string) {
        const mediaUrl = String(process.env.BASE_WPP_MEDIA_URL) + `/${String(media_id)}`;
        const parsedMessage = 
            media_id ? 
                'El siguiente enlace tiene una imagen: ' + mediaUrl  + ' || ' + msg_body 
                : msg_body;

        return parsedMessage;
    }
}
