.PHONY := dist

dev:
	hugo serve -D -w --disableFastRender

dist:
	hugo --minify --baseURL "https://priyakdey.com"

updatetheme:
	git submodule update --remote --merge