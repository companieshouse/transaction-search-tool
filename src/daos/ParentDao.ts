import * as oracledb from "oracledb";

oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;

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
            console.log("Error setting up connection: " + err);
        }
        return
    }
}

export default ParentDao;