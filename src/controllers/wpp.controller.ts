import { Request, Response } from "express";
import { services } from "../config/services";

const webhookVerification = async (req: Request, res: Response) => {
    // Parse params from the webhook verification request
    let mode = String(req.query["hub.mode"] || "");
    let token = String(req.query["hub.verify_token"] || "");
    let challenge = String(req.query["hub.challenge"] || "");

    if (!services.wpp.verificateToken(mode, token)) {
        // Respond with '403 Forbidden' if verify tokens do not match
        return res.sendStatus(403);
    }

    // Respond with the challenge token from the request
    return res.status(200).send(challenge);
};

const webhook = async (req: Request, res: Response) => {
    const { entry, object } = req.body;

    if (!object) {
        return res.sendStatus(404);
    }

    return await services.requestManager.manage(entry);
};

export default {
    webhookVerification,
    webhook,
};
