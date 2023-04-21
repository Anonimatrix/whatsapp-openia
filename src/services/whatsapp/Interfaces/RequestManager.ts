export interface RequestManagerInterface {
    /**
     *  Manages the request and sends the response
     * @param entry  Entry with the message and request information
     * @returns 200 if the message was sent successfully, 400 if the message was not sent
     */
    manage(entry: any): Promise<number>;
}
