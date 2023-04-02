import {Router} from "express";
import testController from "../controllers/test.controller";

const testRouter = Router();

testRouter.get("/", testController.webhook);

export default testRouter;