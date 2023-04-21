import { config } from "dotenv";
config();
import { OpenIAService } from "../../../src/services/openIA/OpenIAService";
import fs from "fs";
import {join} from "path";

describe("Test chatGptService", () => {
    const service = new OpenIAService(String(process.env.OPENAI_KEY || ""));

    it("should return a string", async () => {
        const answer = await service.getResponse(["Hello, how are you?"]);

        expect(typeof answer).toBe("string");
        expect(answer.length).toBeGreaterThan(0);
    });
});
