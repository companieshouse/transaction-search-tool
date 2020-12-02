import ParentDao from "../ParentDao";
import config from "../../config";

class FesDao extends ParentDao {

    constructor() {
        super();
        this.user = config.fesDatabase.username;
        this.password = config.fesDatabase.password;
        this.connectionString = config.fesDatabase.connectionString;
    }
}

export default FesDao;