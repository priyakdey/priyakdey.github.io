.PHONY := dist

dist:
	hugo --minify --baseURL "https://priyakdey.com"
