.PHONY: all

all:
	$(eval version = $(shell npm version minor))
	docker image build -t ghcr.io/nais/testrig:${version} .
	docker image push ghcr.io/nais/testrig:${version}
	echo "git: unstaging all files"
	git reset
	git add package.json package-lock.json
	git commit -m 'bump to version ${version}'
	git push
