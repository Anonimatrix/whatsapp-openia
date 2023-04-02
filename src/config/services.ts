import { ExpressServer } from "../services/server/ExpressServer";
import { ServerInterface } from "../services/server/Interfaces/ServerInterface";

interface ServicesInterface {
    server: ServerInterface;
}

export const services: ServicesInterface = {
    server: new ExpressServer()
}