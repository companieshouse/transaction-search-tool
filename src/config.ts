import ApplicationConfiguration from "./ApplicationConfiguration";

const config: ApplicationConfiguration = {
    port: parseInt(process.env.PORT as string),
    urlPrefix: "transactionsearch",
    applicationNamespace: "transaction-search-tool",
    mongodb: process.env.MONGODB_URL as string,
    cdnUrl: process.env.CDN_HOST as string,
    
    chipsDatabase: {
        username: process.env.CHIPS_DB_USER as string,
        password: process.env.CHIPS_DB_PASSWORD as string,
        connectionString: process.env.CHIPS_DB_CONNECTIONSTRING as string
    },
    staffwareDatabase: {
        username: process.env.STAFFWARE_DB_USER as string,
        password: process.env.STAFFWARE_DB_PASSWORD as string,
        connectionString: process.env.STAFFWARE_DB_CONNECTIONSTRING as string
    },
    fesDatabase: {
        username: process.env.FES_DB_USER as string,
        password: process.env.FES_DB_PASSWORD as string,
        connectionString: process.env.FES_DB_CONNECTIONSTRING as string
    },
    session: {
        cookieName: process.env.COOKIE_NAME as string,
        cookieSecret: process.env.COOKIE_SECRET as string,
        cookieDomain: process.env.COOKIE_DOMAIN as string,
        cacheServer: process.env.CACHE_SERVER as string,
        cookieSecure: process.env.COOKIE_SECURE_ONLY as string,
        timeOut: parseInt(process.env.DEFAULT_SESSION_EXPIRATION as string)
    },
};

export default config;