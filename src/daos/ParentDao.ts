import { errorHandler } from './../utils/ErrorHandler';
import oracledb from "oracledb";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

class ParentDao {

    protected user: string | undefined;
    protected password: string | undefined;
    protected connectionString: string | undefined;
    protected connection: oracledb.Connection;

    public async setupConnection() {
        try {
            this.connection = await oracledb.getConnection({
                user : this.user,
                password : this.password,
                connectString : this.connectionString
            });
        } catch (err) {
            errorHandler.handleError(this.constructor.name, "setupConnection", err);
        }
        return
    }

    public async makeQuery(query: string, bindParams: Array<string> = []) {
        await this.setupConnection();
        let result: oracledb.Result | null;
        try {
            result = await this.connection.execute(query, bindParams);
        } catch (err) {
            errorHandler.handleError(this.constructor.name, "makeQuery", err);
            result = null;
        } finally {
            await this.connection.close().catch();
        }
        return result;
    }
}

export default ParentDao;
