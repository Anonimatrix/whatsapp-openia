import {Router} from "express";
import testController from "../controllers/test.controller";

const testRouter = Router();

testRouter.get("/webhook", testController.webhook);

export default testRouter;