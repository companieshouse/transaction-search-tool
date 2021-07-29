import config from "../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

class ErrorHandler {
    public handleError(name:string, functionName: string, description: string, res?) {
        logger.error("Error in " + name + " function " + functionName+ ": " + description);
        res?.status(500);
    }
}

export const errorHandler = new ErrorHandler();