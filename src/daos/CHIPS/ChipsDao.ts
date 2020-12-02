import ParentDao from "../ParentDao";
import config from "../../config";

class ChipsDao extends ParentDao {

    constructor() {
        super();
        this.user = config.chipsDatabase.username;
        this.password = config.chipsDatabase.password;
        this.connectionString = config.chipsDatabase.connectionString;
    }
}

export default ChipsDao;