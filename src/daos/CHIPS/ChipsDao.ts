import ParentDao from "../ParentDao";
import config from "../../config";

class ChipsDao extends ParentDao {

    constructor() {
        super();
        this.user = config.chipsDatabase.username;
        this.password = config.chipsDatabase.password;
        this.connectionString = config.chipsDatabase.connectionString;
    }

    public async makeQuery(query: string, bindValues: Array<string>) {
        await this.setupConnection();
        var result: any;
        try {
            result = await this.connection.execute(query, bindValues);
        } catch (err: any) {
            console.log("Error in make query: " + err);
            result = null;
        } finally {
            await this.connection.close();
        }
        return result;
    }
}

export default ChipsDao;