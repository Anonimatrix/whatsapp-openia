import { ResponseManagerInterface } from "../whatsapp/Interfaces/ResponseManager";
import { ChatCompletionRequestMessageRoleEnum, Configuration, OpenAIApi } from "openai";
import { configuration } from "../../config/openia";

export class OpenIAService implements ResponseManagerInterface {
    service: OpenAIApi;

    constructor(private readonly key: string) {
        this.service = this.config();
    }

    config() {
        const configuration = new Configuration({ apiKey: this.key });

        return new OpenAIApi(configuration);
    }

    async getResponse(messages: string[]): Promise<string> {
        // If messages is an array of strings, convert it to an array of ChatCompletionRequestMessage
        const parsedMessages = messages.map(
            (message) =>
                ({
                    content: message,
                    role: ChatCompletionRequestMessageRoleEnum.User,
                })
        );

        const res = await this.service.createChatCompletion({
            model: "gpt-3.5-turbo",
            ...configuration,
            messages: parsedMessages,
        });

        const response = res.data.choices[0].message?.content;

        if (!response) {
            throw new Error("No response");
        }

        return response;
    }
}
