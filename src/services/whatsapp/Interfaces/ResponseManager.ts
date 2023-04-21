export interface ResponseManagerInterface {
    getResponse(messages: string[]): Promise<string>;
}
