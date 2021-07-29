import config from "../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

class ErrorHandler {
    public handleError(className:string, functionName: string, err: Error, res?) {
        logger.error("Error in " + className + " function " + functionName+ ": " + err.message);
        res?.status(500);
        res?.render("error", {
            errorMessage: err.stack
        });
    }
}

export const errorHandler = new ErrorHandler();