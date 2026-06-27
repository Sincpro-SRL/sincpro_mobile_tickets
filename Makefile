.DEFAULT_GOAL := help

APP := sincpro-mobile-tickets

# Paths to sibling library repos (relative to this Makefile)
UI_PATH   := ../sincpro_mobile_ui
CORE_PATH := ../sincpro_mobile
ODOO_PATH := ../sincpro_mobile_odoo

help:
	@echo "$(APP) — comandos:"
	@echo "  init                       prepare-environment + instala dependencias"
	@echo "  start / web                expo start (dev) / web"
	@echo "  android / ios              expo run:android | run:ios"
	@echo "  prebuild                   expo prebuild (genera ios/android nativos)"
	@echo "  typecheck / lint / check   tsc / expo lint / ambos"
	@echo "  verify                     TODOS los guardrails (read-only): lint + tipos + formato"
	@echo "  format / format-check      prettier (escribe / sólo valida)"
	@echo "  clean                      borra node_modules, .expo, ios, android"
	@echo "  link-local                 build ui+core+odoo desde las carpetas hermanas y cablea dist/ a node_modules (test local sin publicar)"

prepare-environment:
	@pipx install pre-commit
	@pipx ensurepath
	@pre-commit install

init: prepare-environment
	@echo "Installing dependencies..."
	@yarn install

start:
	@npx expo start

web:
	@npx expo start --web

android:
	@npx expo run:android

ios:
	@npx expo run:ios

update:
	@npx expo-doctor --verbose
	@npx expo install --check

prebuild:
	@npx expo prebuild

typecheck:
	@npx tsc --noEmit

format:
	@echo "🔤 Ordenando imports + auto-fix (eslint)..."
	@npx eslint . --fix
	@npx prettier  --experimental-cli --write "**/*.{ts,tsx,js,jsx,json}" --ignore-path .gitignore
	@make typecheck

doctor:
	@bash scripts/doctor.sh

verify-format: format doctor
	@if ! git diff --quiet; then \
	  echo >&2 "✘ El formateo ha modificado archivos. Por favor agrégalos al commit."; \
	  git --no-pager diff --name-only HEAD -- >&2; \
	  exit 1; \
	fi
	@echo "✓ Format verification passed"


test:
	@echo "Running tests..."


deploy:
	@echo "Deploying application..."

publish:
	@echo "Publishing application..."

link-local:
	@echo "🔨 Building @sincpro/mobile-ui..."
	@$(MAKE) -C $(UI_PATH) build
	@echo "🔗 Wiring @sincpro/mobile-ui → core + odoo (para que compilen contra la versión local)..."
	@rm -rf $(CORE_PATH)/node_modules/@sincpro/mobile-ui/dist && cp -r $(UI_PATH)/dist $(CORE_PATH)/node_modules/@sincpro/mobile-ui/
	@rm -rf $(ODOO_PATH)/node_modules/@sincpro/mobile-ui/dist && cp -r $(UI_PATH)/dist $(ODOO_PATH)/node_modules/@sincpro/mobile-ui/
	@echo "🔨 Building @sincpro/mobile (core)..."
	@$(MAKE) -C $(CORE_PATH) build
	@echo "🔗 Wiring @sincpro/mobile → odoo (para que compile contra la versión local)..."
	@rm -rf $(ODOO_PATH)/node_modules/@sincpro/mobile/dist && cp -r $(CORE_PATH)/dist $(ODOO_PATH)/node_modules/@sincpro/mobile/
	@echo "🔨 Building @sincpro/mobile-odoo..."
	@$(MAKE) -C $(ODOO_PATH) build
	@echo "🔗 Wiring dist/ → tickets/node_modules (clean copy)..."
	@rm -rf node_modules/@sincpro/mobile-ui/dist && cp -r $(UI_PATH)/dist node_modules/@sincpro/mobile-ui/
	@rm -rf node_modules/@sincpro/mobile/dist && cp -r $(CORE_PATH)/dist node_modules/@sincpro/mobile/
	@rm -rf node_modules/@sincpro/mobile-odoo/dist && cp -r $(ODOO_PATH)/dist node_modules/@sincpro/mobile-odoo/
	@echo "✓ Local builds wired. NOTA: yarn install sobreescribe el cableado — corré 'make link-local' DESPUÉS de yarn install."

clean:
	@rm -rf node_modules .expo ios android
	@echo "✓ Cleaned"

update-version:
ifndef VERSION
	$(error VERSION is required. Usage: make update-version VERSION=1.2.3)
endif
	@echo "Updating version to $(VERSION)..."
	@sed -i.bak 's/"version": "[^"]*"/"version": "$(VERSION)"/g' package.json && rm package.json.bak
	@sed -i.bak 's/"version": "[^"]*"/"version": "$(VERSION)"/g' app.json && rm app.json.bak
	@sed -i.bak 's/"runtimeVersion": "[^"]*"/"runtimeVersion": "$(VERSION)"/g' app.json && rm app.json.bak
	@echo "✅ Version updated successfully to $(VERSION)"
	@echo "Updated files:"
	@echo "  - package.json"
	@echo "  - app.json (version and runtimeVersion)"

publish:
	@echo "Needs integration with Fastlane or EAS for publishing."
	# @yarn build:prod

.PHONY: help prepare-environment init start web android ios prebuild typecheck lint check verify format format-check clean test deploy link-local
