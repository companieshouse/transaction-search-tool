artifact_name := transaction-search-tool
export JAVA_HOME=/usr/lib/jvm/java-21-amazon-corretto.x86_64

.PHONY: build
build: clean init submodules
	npm run build

.PHONY: submodules
submodules:
	git submodule init
	git submodule update

.PHONY: clean
clean:
	rm -rf dist/app dist/static

.PHONY: npm-install
npm-install:
	npm i

.PHONY: test
test: test-unit

.PHONY: test-unit
test-unit:
	npm run test

.PHONY: lint
lint:
	npm i lint

.PHONY: sonar
sonar: test dependency-check
	npm run analyse-code

.PHONY: package
package: init build
ifndef version
	$(error No version given. Aborting)
endif
	$(info Packaging version: $(version))
	$(eval tmpdir := $(shell mktemp -d build-XXXXXXXXXX))
	cp -r ./dist $(tmpdir)
	cp -r ./package.json $(tmpdir)
	cp -r ./package-lock.json $(tmpdir)
	cd $(tmpdir) && npm i --production
	rm $(tmpdir)/package.json $(tmpdir)/package-lock.json
	cd $(tmpdir) && zip -r ../$(artifact_name)-$(version).zip .
	rm -rf $(tmpdir)

.PHONY: init
init: npm-install

.PHONY: security-check
security-check: dependency-check

.PHONY: dependency-check
dependency-check:
	npm run dependency-check
