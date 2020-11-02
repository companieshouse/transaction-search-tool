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

.PHONY: test-unit
test-unit:
	npm run test

.PHONY: package
package: init build 
ifndef version
	$(error No version given. Aborting)
endif
	$(info Packaging version: $(version))
	$(eval tmpdir := $(shell mktemp -d build-XXXXXXXXXX))
	cp -r ./app $(tmpdir)
	cp -r ./dist $(tmpdir)
	cp -r ./views $(tmpdir)
	cp -r ./package.json $(tmpdir)
	cp -r ./package-lock.json $(tmpdir)
	cp ./start.sh $(tmpdir)
	cp ./routes.yaml $(tmpdir)
	cd $(tmpdir) && npm i --production
	rm $(tmpdir)/package.json $(tmpdir)/package-lock.json
	cd $(tmpdir) && zip -r ../$(artifact_name)-$(version).zip .
	rm -rf $(tmpdir)

.PHONY: init
init: npm-install gulp-install build-static