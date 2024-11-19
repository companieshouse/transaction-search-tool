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
        cookieName: process.env.COOKIE_NAME || "default_cookie_name_for_tests",
        cookieSecret: process.env.COOKIE_SECRET || "default_cookie_secret_for_tests",
        cookieDomain: process.env.COOKIE_DOMAIN || "default_cookie_domain_for_tests",
        cacheServer: process.env.CACHE_SERVER as string,
        cookieSecure: process.env.COOKIE_SECURE_ONLY as string,
        timeOut: parseInt(process.env.DEFAULT_SESSION_EXPIRATION as string)
    },
};

export default config;
