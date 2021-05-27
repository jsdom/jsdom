SHELL=/bin/bash -o pipefail
.PHONY: local remote deploy review

remote: index.bs
	@ (HTTP_STATUS=$$(curl https://api.csswg.org/bikeshed/ \
	                       --output index.html \
	                       --write-out "%{http_code}" \
	                       --header "Accept: text/plain, text/html" \
	                       -F die-on=warning \
	                       -F md-Text-Macro="COMMIT-SHA LOCAL COPY" \
	                       -F file=@index.bs) && \
	[[ "$$HTTP_STATUS" -eq "200" ]]) || ( \
		echo ""; cat index.html; echo ""; \
		rm -f index.html; \
		exit 22 \
	);

local: index.bs
	bikeshed spec index.bs index.html --md-Text-Macro="COMMIT-SHA LOCAL COPY"

deploy: index.bs
	curl --remote-name --fail https://resources.whatwg.org/build/deploy.sh
	EXTRA_FILES="demos/* demos/**/*" \
	bash ./deploy.sh

review: index.bs
	curl --remote-name --fail https://resources.whatwg.org/build/review.sh
	bash ./review.sh
