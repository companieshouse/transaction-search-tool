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
