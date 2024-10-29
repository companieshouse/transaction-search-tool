# Transaction Search Tool

Administration tool for Front End Scanned (FES) documents to enable users to monitor, audit and investigate the routing, status and journey of Front End Scanned document submissions.

## Requirements

- [Node](https://nodejs.org/en)
- [Git](https://git-scm.com/downloads)
- [docker-chs-development](https://github.com/companieshouse/docker-chs-development)

## Getting started

### How to Build

For building and running with Docker:

* Run `docker_chs modules enable transaction`
* Run `docker_chs up`

To enable local development run `docker_chs development enable transaction-search-tool`.

N.B. use `docker_chs` and `chs-dev` interchangeably, where the former may be run from any directory and the latter from `docker-chs-development` root.

Build in the command line locally using `make build`. See the [Makefile](Makefile) for additional `make` commands.

## Other useful Information

Local access is via `http://chs.local`:

| URL                                                       |
|-----------------------------------------------------------|
| http://chs.local/transactionsearch/                       |
| http://chs.local/transactionsearch/search?search=03347220 |
| http://chs.local/transactionsearch/search?search=Y995YN8J |
