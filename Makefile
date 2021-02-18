.PHONY: all

all:
	$(eval version = $(shell npm version major))
	docker image build -t ghcr.io/nais/testrig:${version} .
	docker image push ghcr.io/nais/testrig:${version}
	git push
