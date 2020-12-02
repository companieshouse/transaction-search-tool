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
            logger.error("Error setting up connection: " + err +
            " username: " + this.user + " password: " + this.password + 
            " connectionString: " + this.connectionString);
        }
        return
    }

    public async makeQuery(query: string, bindParams: Array<any>) {
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

export default ParentDao;