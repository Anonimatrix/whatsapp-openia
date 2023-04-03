import { Request, Response } from "express";
import { services } from "../config/services";
import { ChatManager } from "../services/whatsapp/Items/ChatManager";
import { commands } from "../services/commands/commands";

const chatManager = new ChatManager();

const webhookVerification = async (req: Request, res: Response) => {
    // Parse params from the webhook verification request
    let mode = String(req.query["hub.mode"] || "");
    let token = String(req.query["hub.verify_token"] || "");
    let challenge = String(req.query["hub.challenge"] || "");

    if(!services.wpp.verificateToken(mode, token))
    {
        
        // Respond with '403 Forbidden' if verify tokens do not match
        return res.sendStatus(403);
    } 

    // Respond with the challenge token from the request
    return res.status(200).send(challenge);
}

const webhook = async (req: Request, res: Response) => {
    const { entry, object } = req.body;
  
    if (object) {
      if (
        services.wpp.isValidMessage(entry)
      ) {
        // Parsing all information from the message
        const {from, msg_body} = services.wpp.parseMessage(entry);
        
        if(await services.wpp.isCommand(msg_body))
        {
            const {commandName, args} = await services.wpp.getCommand(msg_body);

            if(commands[commandName]) { 
              commands[commandName](services.wpp, chatManager, from, args);
            };
        }

        // Getting the chat by the phone number
        const chat = chatManager.getChatByNumber(from);

        // If the chat does not exist, return a 200
        if(!chat)
        {
          return res.send(200);
        }

        await services.wpp.sendMessage(from, "Respuesta");
      }
      res.sendStatus(200);
    } else {
      // Return a '404 Not Found' if event is not from a WhatsApp API
      res.sendStatus(404);
    }
}


export default {
    webhookVerification,
    webhook
}