interface ApplicationConfiguration {
    port: number;
    urlPrefix: string;
    applicationNamespace: string;
    mongodb: string;
    chipsDatabase: {
        username: string;
        password: string;
        connectionString: string;
    };
    staffwareDatabase : {
        username: string;
        password: string;
        connectionString: string;
    };
    fesDatabase : {
        username: string;
        password: string;
        connectionString: string;
    };
    session: {
        cookieName: string;
        cookieSecret: string;
        cookieDomain: string;
        cacheServer: string;
        cookieSecure: string;
        timeOut: number;
    };
}

export default ApplicationConfiguration;