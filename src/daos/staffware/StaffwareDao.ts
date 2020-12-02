import ParentDao from "../ParentDao";
import config from "../../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

class StaffwareDao extends ParentDao {

    constructor() {
        super();
        this.user = config.staffwareDatabase.username;
        this.password = config.staffwareDatabase.password;
        this.connectionString = config.staffwareDatabase.connectionString;
    }
}

export default StaffwareDao;