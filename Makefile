artifact_name := transaction-search-tool

.PHONY: build
build: clean
	npm run build-scss
	npm run build

.PHONY: clean
clean:
	rm -rf dist/app dist/static

.PHONY: npm-install
npm-install:
	npm i

.PHONY: gulp-install
gulp-install:
	npm install gulp-cli -g

.PHONY: init
init: npm-install gulp-install build-static