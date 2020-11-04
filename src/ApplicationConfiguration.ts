interface ApplicationConfiguration {
    port: number;
    urlPrefix: string;
    applicationNamespace: string;
    chipsDatabase: {
        username: string;
        password: string;
        connectionString: string;
    };
}

export default ApplicationConfiguration;