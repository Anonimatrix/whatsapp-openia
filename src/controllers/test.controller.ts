import { Request, Response } from "express"

const webhook = async (req: Request, res: Response) => {
    const { body } = req;
    console.log(body);
    res.send("Hello World");
}


export default {
    webhook
}