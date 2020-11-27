import ApplicationConfiguration from "./ApplicationConfiguration";

const config: ApplicationConfiguration = {
    port: parseInt(process.env.PORT as string),
    urlPrefix: "transactionsearch",
    applicationNamespace: "transaction-search-tool",
    chipsDatabase: {
        username: process.env.CHIPS_DB_USER as string,
        password: process.env.CHIPS_DB_PASSWORD as string,
        connectionString: process.env.CHIPS_DB_CONNECTIONSTRING as string
    },
    staffwareDatabase: {
        username: process.env.STAFFWARE_DB_USER as string,
        password: process.env.STAFFWARE_DB_PASSWORD as string,
        connectionString: process.env.STAFFWARE_DB_CONNECTIONSTRING as string
    }
};

export default config;