import axios, { AxiosError } from "axios";
import { commands } from "../commands/commands";

export class WhatsappService {
    protected readonly commandPrefix: string = "@";

    verificateToken(mode: string, token: string): boolean {
        const verify_token = process.env.WHATSAPP_VERIFY_TOKEN;

        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === "subscribe" && token === verify_token) {
                return true;
            }
        }

        return false;
    }

    isValidMessage(entry: any) {
        return Boolean(
            entry &&
                entry[0].changes &&
                entry[0].changes[0] &&
                entry[0].changes[0].value.messages &&
                entry[0].changes[0].value.messages[0]
        );
    }

    parseMessage(entry: any) {
        const phone_number_id =
            entry[0].changes[0].value.metadata.phone_number_id;

        const from = entry[0].changes[0].value.messages[0].from.replace(
            "549",
            "54"
        );

        const message = entry[0].changes[0].value.messages[0];

        const msg_body = entry[0].changes[0].value.messages[0].text?.body || "";

        const media_link = message.image?.link || message.video?.link || message.audio?.link || message.document?.link || "";

        return {
            phone_number_id,
            from,
            msg_body,
            media_link
        };
    }

    isCommand(msg_body: string) {
        return msg_body.startsWith(this.commandPrefix);
    }

    getCommand(msg_body: string) {
        const command = msg_body.replace(this.commandPrefix, "");
        const [commandName, ...args] = command.split(" ");
        const commandFunction = commands[commandName] || null;

        return {
            commandName,
            commandFunction,
            args,
        };
    }

    async sendMessage(phone: string, message: string) {
        try {
            return await axios.post(
                `https://graph.facebook.com/v16.0/${process.env.PHONE_ID}/messages`,
                {
                    messaging_product: "whatsapp",
                    to: phone,
                    type: "text",
                    text: {
                        preview_url: true,
                        body: message,
                    },
                },
                {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                    },
                }
            );
        } catch (e) {
            const msgError =
                e instanceof AxiosError
                    ? e.response?.data?.error.message
                    : e instanceof Error
                    ? e.message
                    : "Unknown error";

            throw new Error(msgError);
        }
    }

    getCommandPrefix() {
        return this.commandPrefix;
    }
}
