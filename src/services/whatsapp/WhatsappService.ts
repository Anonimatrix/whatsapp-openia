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

    async parseMessage(entry: any) {

        const change = entry[0].changes[0].value;
        const phone_number_id = change.metadata.phone_number_id;
        const message = change.messages[0];

        const from = message.from.replace(
            "549",
            "54"
        );

        const msg_body = message.text?.body || "";

        const image_id = message.image?.id || "";

        const media_link = image_id ? await this.getMediaUrl(image_id) : "";

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

    async getMediaUrl(media_id: string) {
        const res = await axios.get(
            `https://graph.facebook.com/v16.0/${media_id}/messages`,
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${process.env.WHATSAPP_TOKEN}`,
                },
            }
        );

        const media_link = res.data.url;

        return media_link;
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
