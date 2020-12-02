import ParentDao from "../ParentDao";
import config from "../../config";

class StaffwareDao extends ParentDao {

    constructor() {
        super();
        this.user = config.staffwareDatabase.username;
        this.password = config.staffwareDatabase.password;
        this.connectionString = config.staffwareDatabase.connectionString;
    }
}

export default StaffwareDao;