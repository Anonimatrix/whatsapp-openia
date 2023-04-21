import {Router} from "express";
import testController from "../controllers/wpp.controller";

const wppRouter = Router();

//Verify webhook
wppRouter.get("/webhook", testController.webhookVerification);

//Receive messages
wppRouter.post("/webhook", testController.webhook);

//View media
wppRouter.get("/media/:media_id", testController.viewMedia);

export default wppRouter;