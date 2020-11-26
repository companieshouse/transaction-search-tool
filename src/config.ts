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
        username: 'SWPRO',
        password: 'SWPRO',
        connectionString: "(DESCRIPTION=(ADDRESS=(PROTOCOL=TCP)(HOST=chd-staffdb)(PORT=1521))(CONNECT_DATA=(SID=swdev)))"
    }
};

export default config;