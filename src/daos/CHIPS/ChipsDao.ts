import ParentDao from "../ParentDao";

class ChipsDao extends ParentDao {

    constructor() {
        super();
        this.user = process.env.CHIPS_DB_USER;
        this.password = process.env.CHIPS_DB_PASSWORD;
        this.connectionString = process.env.CHIPS_DB_CONNECTIONSTRING;
    }

    public async makeQuery(query: string, bindValues: Array<string>) {
        await this.setupConnection();
        var result;
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