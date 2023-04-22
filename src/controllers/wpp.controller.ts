import { Request, Response } from "express";
import { services } from "../config/services";
import { Readable } from "stream";

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

    try {
        const status = await services.requestManager.manage(entry);

        return res.sendStatus(status);
    } catch (e) {
        console.log(e instanceof Error ? e.message : "Unknown Error");
        return res.sendStatus(500);
    }
};

const viewMedia = async (req: Request, res: Response) => {
    const { media_id } = req.params;

    if (!media_id) {
        return res.sendStatus(404);
    }

    const mediaUrl = await services.wpp.getMediaUrl(media_id);
    const buffer = await services.wpp.getMedia(mediaUrl);

    res.setHeader("Content-Type", "image/jpeg");
    res.setHeader("Content-Length", buffer.length);

    return Readable.from(buffer).pipe(res);
};

export default {
    webhookVerification,
    webhook,
    viewMedia
};
