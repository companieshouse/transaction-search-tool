import ParentDao from "../ParentDao";
import config from "../../config";
import { createLogger } from "ch-structured-logging";

const logger = createLogger(config.applicationNamespace);

class FesDao extends ParentDao {

    constructor() {
        super();
        this.user = config.fesDatabase.username;
        this.password = config.fesDatabase.password;
        this.connectionString = config.fesDatabase.connectionString;
    }

    public async makeQuery(query: string, bindParams: Array<string>) {
        await this.setupConnection();
        var result: any;
        try {
            result = await this.connection.execute(query, bindParams);
        } catch (err: any) {
            logger.error("Error in make query: " + err);
            result = null;
        } finally {
            await this.connection.close();
        }
        return result;
    }
}

export default FesDao;