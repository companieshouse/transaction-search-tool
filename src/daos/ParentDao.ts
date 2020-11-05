import oracledb from "oracledb";
import config from "../config";
import { createLogger } from "ch-structured-logging";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

const logger = createLogger(config.applicationNamespace);

class ParentDao {

    protected user: string | undefined;
    protected password: string | undefined;
    protected connectionString: string | undefined;
    protected connection: any;

    public async setupConnection() {
        try {
            this.connection = await oracledb.getConnection({
                user : this.user,
                password : this.password,
                connectString : this.connectionString
            });
        } catch (err: any) {
            logger.error("Error setting up connection: " + err);
        }
        return
    }
}

export default ParentDao;