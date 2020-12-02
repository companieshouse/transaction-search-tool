import ParentDao from "../ParentDao";
import config from "../../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

class ChipsDao extends ParentDao {

    constructor() {
        super();
        this.user = config.chipsDatabase.username;
        this.password = config.chipsDatabase.password;
        this.connectionString = config.chipsDatabase.connectionString;
    }
}

export default ChipsDao;