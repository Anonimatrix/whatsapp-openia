import axios from "axios";

export class WhatsappService {
    public readonly commandPrefix: string = "@";

    verificateToken(mode: string, token: string): boolean {
        const verify_token = process.env.VERIFY_TOKEN;

        if (mode && token) {
            // Check the mode and token sent are correct
            if (mode === "subscribe" && token === verify_token) {
                return true;
            }
        }

        return false;
    }

    isValidMessage(entry: any) {
        return (entry &&
            entry[0].changes &&
            entry[0].changes[0] &&
            entry[0].changes[0].value.messages &&
            entry[0].changes[0].value.messages[0]);
    }

    parseMessage(entry: any) {
        const phone_number_id = entry[0].changes[0].value.metadata.phone_number_id;
        const from = entry[0].changes[0].value.messages[0].from;
        const msg_body = entry[0].changes[0].value.messages[0].text.body;

        return {
            phone_number_id,
            from,
            msg_body
        }
    }

    async isCommand(msg_body: string) {
        return msg_body.startsWith(this.commandPrefix);
    }

    async getCommand(msg_body: string) {
        const command = msg_body.replace(this.commandPrefix, "");
        const [commandName, ...args] = command.split(" ");

        return {
            commandName,
            args
        }
    }

    async sendMessage(phone: string, message: string) {
        return await axios.post(`https://graph.facebook.com/v16.0/107795065612594/messages`, { 
            messaging_product: "whatsapp", 
            to: phone, 
            type: "text",
            text: {
                "preview_url": true,
                "body": message
            }
        },
        {
            headers: {
                "Content-Type": "application/json",
                'Authorization': `Bearer ${process.env.WHATSAPP_TOKEN}`
            }
        } 
        );
    }
}