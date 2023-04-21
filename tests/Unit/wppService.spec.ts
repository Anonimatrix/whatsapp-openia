import { services } from "../../src/config/services";
import { mockInvalidEntry, mockValidEntry } from "../mocks/Whatsapp/basics";
import { commands } from "../../src/services/commands/commands";
const wppService = services.wpp;

describe("WhatsApp Service", () => {
    it("isValidMessage should return true if is valid", () => {
        const isValid = wppService.isValidMessage(mockValidEntry);
        expect(isValid).toBe(true);
    });

    it("isValidMessage should return false if is invalid", () => {
        const isValid = wppService.isValidMessage(mockInvalidEntry);
        expect(isValid).toBe(false);
    });

    it("parseMessage should return the correct object", () => {
        const parsedMessage = wppService.parseMessage(mockValidEntry);
        const changeValue = mockValidEntry[0].changes[0].value;
        const message = changeValue.messages[0];

        expect(parsedMessage).toEqual({
            phone_number_id: changeValue.metadata.phone_number_id,
            from: message.from,
            msg_body: message.text.body,
        });
    });

    it("isCommand should return false if isn´t a command", () => {
        const isCommand = wppService.isCommand("Hola");
        console.log(isCommand);
        expect(isCommand).toBeFalsy();
    });

    it("isCommand should return true if is a command", () => {
        const command = wppService.getCommandPrefix() + "init";
        const isCommand = wppService.isCommand(command);
        expect(isCommand).toBeTruthy();
    });

    it("validateToken should return true if is valid", () => {
        process.env.WHATSAPP_VERIFY_TOKEN = "token";
        const isValid = wppService.verificateToken("subscribe", "token");
        expect(isValid).toBeTruthy();
    });

    it("validateToken should return false if is invalid", () => {
        process.env.WHATSAPP_VERIFY_TOKEN = "token";
        const isValid = wppService.verificateToken("subscribe", "1234");
        expect(isValid).toBeFalsy();
    });

    it("getCommand should return the correct object", () => {
        const command = wppService.getCommandPrefix() + "init";
        const commandObject = wppService.getCommand(command);
        expect(commandObject).toEqual({
            commandName: "init",
            commandFunction: commands.init,
            args: [],
        });
    });

    it("getCommand should return the correct object with args", () => {
        const command = wppService.getCommandPrefix() + "init arg1 arg2";
        const commandObject = wppService.getCommand(command);
        expect(commandObject).toEqual({
            commandName: "init",
            commandFunction: commands.init,
            args: ["arg1", "arg2"],
        });
    });

    it("getCommand return null in commandFunction if command doesn´t exist", () => {
        const command = wppService.getCommandPrefix() + "invalid";
        const commandObject = wppService.getCommand(command);
        expect(commandObject).toEqual({
            commandName: "invalid",
            commandFunction: null,
            args: [],
        });
    });
});
