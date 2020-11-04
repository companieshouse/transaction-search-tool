import ApplicationConfiguration from "./ApplicationConfiguration";

const config: ApplicationConfiguration = {
    port: parseInt(process.env.TRANSACTION_SEARCH_TOOL_PORT as string),
    urlPrefix: "transactionsearch",
    applicationNamespace: "transaction-search-tool",
    chipsDatabase: {
        username: process.env.CHIPS_DB_USER as string,
        password: process.env.CHIPS_DB_PASSWORD as string,
        connectionString: process.env.CHIPS_DB_CONNECTIONSTRING as string
    }
};

export default config;