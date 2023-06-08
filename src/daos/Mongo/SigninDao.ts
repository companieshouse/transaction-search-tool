import config from "../../config";
import { createLogger } from "@companieshouse/structured-logging-node";
import { MongoClient } from "mongodb";

const logger = createLogger(config.applicationNamespace);

class SigninDao {

    public async checkSignin(username: string) {
        const client = new MongoClient(config.mongodb);
        var result;

        try {
            await client.connect();
            const database = client.db('account');
            const users = database.collection('users');

            result = await users.findOne({ email: username });
            logger.info(`result found for email: ${username}`);
        } catch(error){
            logger.error(error);
        }
        finally {
            await client.close();
        }
        return result;
    }
}

export default SigninDao;