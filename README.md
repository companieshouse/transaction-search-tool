# Transaction Search Tool

Administration tool for Front End Scanned (FES) documents to enable users to monitor, audit and investigate the routing, status and journey of Front End Scanned document submissions.

## Requirements

- [Node](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
- [docker-chs-development](https://github.com/companieshouse/docker-chs-development)

## Getting Started

Note that `docker_chs` and `chs-dev` below are interchangeable, where the former may be run from any directory and the latter from `docker-chs-development` root.

### How to Run
For building and running with Docker:

* Run `docker_chs modules enable transaction` to enable the module.
* Run `docker_chs up` to start.
* Navigate to `http://chs.local/transactionsearch` ( sign in with `admin*demo@ch.gov.uk` if redirected )

### How to Build
* Enable local development by running `docker_chs development enable transaction-search-tool`.
* After you make changes to the code, run `docker_chs reload transaction-search-tool`.

### How to view logs
* Run `docker_chs logs transaction-search-tool`
* Or use an alternative logs viewer such as Docker Desktop or Dockermon.

## Other useful Information

Here is a list of endpoints:

| URL                                              | CRUD Operation | Example / Information                                     |
|--------------------------------------------------|----------------|-----------------------------------------------------------|
| http://chs.local/transactionsearch/healthcheck   | GET            | Returns 200, and text "OK"                                |
| http://chs.local/transactionsearch/              | GET            |                                                           |
| http://chs.local/transactionsearch/signin        | GET            |                                                           |
| http://chs.local/transactionsearch/search        | GET            | http://chs.local/transactionsearch/search?search=03347220 |
| http://chs.local/transactionsearch/barcodeSearch | GET            |                                                           |


## Environment Variables
### Hosts and URLS
| Name           | Description                             |
|----------------|-----------------------------------------|
| CDN_HOST       | Address of chs styling for the frontend |
| COOKIE_DOMAIN  |                                         |
| CACHE_SERVER   | Required for storing values in memory   |

### Default Values
| Name                       | Description                                             |
|----------------------------|---------------------------------------------------------|
| ENV_REGION_AWS             | AWS Region                                              |
| COOKIE_NAME                |                                                         |
| COOKIE_SECURE_ONLY         | Determines whether cookie is sent via a secure protocol |
| DEFAULT_SESSION_EXPIRATION | Default session expiration in seconds                   |
| NODE_PORT                  |                                                         |
| CACHE_DB                   | The cache database number (integer)                     |

### Misc Config
| Name        | Description                       |
|-------------|-----------------------------------|
| LOG_LEVEL   | e.g. DEBUG, INFO                  |
| HUMAN_LOG   | For human readable logs (integer) |

## Note on the removal of the `start` and `start:watch` script commands

The `start` and `start:watch` script commands have been removed from the `package.json` file. These commands were 
previously used to start the app up for local development and testing on the host machine (i.e. not in a container).

There are two reasons why they have been removed. The first is that to get them to actually function in a meaningful 
way for such testing requires considerable knowledge of the set up of the app (and CHS) and its dependencies, 
all of which is already encapsulated in the `docker-chs-development` environment. The second reason is that it requires 
changes to the implementation of the application itself so that the app can interact with the Oracle database it uses 
outside of the container environment too.

### Details of the script commands removed (for the record)

#### Non-functioning commands as previously configured

```aiignore
    "start": "NODE_ENV=development ./dist/app.js",
    "start:watch": "NODE_ENV=development nodemon",
```

#### Reconfigured commands and altered app code to be able to run up and test the app on the host machine

##### Script commands

```aiignore
    "start": "NODE_ENV=development PORT=18580 CACHE_SERVER=localhost:6379 ts-node ./dist/app/app.js",
    "start:watch": "NODE_ENV=development PORT=18580 CACHE_SERVER=localhost:6379 nodemon",
```

##### Altered code in `app.ts`

This line in `app.ts` was changed from:

```typescript
oracledb.initOracleClient();
```

to 

```typescript
// This example runs in both node-oracledb Thin and Thick modes.
//
// Optionally run in node-oracledb Thick mode
if (process.env.NODE_ORACLEDB_DRIVER_MODE === 'thick') {

    // Thick mode requires Oracle Client or Oracle Instant Client libraries.
    // On Windows and macOS Intel you can specify the directory containing the
    // libraries at runtime or before Node.js starts.  On other platforms (where
    // Oracle libraries are available) the system library search path must always
    // include the Oracle library path before Node.js starts.  If the search path
    // is not correct, you will get a DPI-1047 error.  See the node-oracledb
    // installation documentation.
    let clientOpts = {};
    if (process.platform === 'win32') {                                   // Windows
        clientOpts = { libDir: 'C:\\oracle\\instantclient_19_17' };
    } else if (process.platform === 'darwin' && process.arch === 'x64') { // macOS Intel
        clientOpts = { libDir: process.env.HOME + '/Downloads/instantclient_19_8' };
    }
    oracledb.initOracleClient(clientOpts);  // enable node-oracledb Thick mode
}
```

The replacement code was copied and pasted from an example provided in the `oracledb` node module. It could have 
been simplified, to remove the check on the `NODE_ORACLEDB_DRIVER_MODE` environment variable, as the Thick mode is 
always required to run the app correctly.

