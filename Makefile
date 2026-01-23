.PHONY: help dev dist updatetheme downloadtheme 
.DEFAULT_GOAL := help

help:
	@echo "   Available targets:"
	@echo "  	dev           run the dev server"
	@echo "  	dist          build the final target for deployment"
	@echo "  	updatetheme   update the theme via git submodule"
	@echo "  	downloadtheme download the theme via git submodule"

dev:
	hugo serve -D -w --disableFastRender

dist:
	hugo --minify --baseURL "https://priyakdey.com"

updatetheme:
	git submodule update --remote --merge

downloadtheme:
	git submodule update --init --recursive
