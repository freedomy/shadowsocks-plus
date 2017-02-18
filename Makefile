BROWSERIFY := browserify
BABEL := babel
UGLIFYJS := uglifyjs

development: prepare backend frontend_development

production: prepare backend frontend_production

prepare:
	rm -rf build/backend build/frontend
	mkdir build/backend build/frontend

backend:
	$(BABEL) -d build/backend/ src/backend/

frontend_development:
	$(BROWSERIFY) -t babelify -o build/frontend/bundle.js src/frontend/index.js
	cp build/frontend/bundle.js web/js/bundle.min.js

frontend_production:
	NODE_ENV=production $(BROWSERIFY) -t babelify -o build/frontend/bundle.js src/frontend/index.js
	$(UGLIFYJS) -o build/frontend/bundle.min.js build/frontend/bundle.js -m
	cp build/frontend/bundle.min.js web/js/bundle.min.js
