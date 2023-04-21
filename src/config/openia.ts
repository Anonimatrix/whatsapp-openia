import { CreateChatCompletionRequest } from "openai";

export const configuration: Partial<CreateChatCompletionRequest> = {
    model: "gpt-3.5-turbo",
    temperature: 0.6,
};

export const options = {
    language: "es",
}
