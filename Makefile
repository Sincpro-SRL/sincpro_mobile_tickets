.DEFAULT_GOAL := help

APP := sincpro-mobile-tickets
VERSION := $(shell node -p "require('./package.json').version")

help:
	@echo "$(APP) — comandos:"
	@echo "  install                    yarn install"
	@echo "  init                       prepare-environment + install"
	@echo "  start / web                Metro. En el menú: a Android, i iOS"
	@echo "  android / ios              compila y pregunta qué dispositivo"
	@echo "  prebuild                   genera ios/ y android/ desde app.json"
	@echo "  lint / typecheck / check   eslint / tsc / ambos"
	@echo "  format / verify-format     escribe formato / lo exige limpio (CI y pre-commit)"
	@echo "  doctor                     expo install --check"
	@echo "  test / build               tests del host / typecheck"
	@echo "  clean                      borra node_modules, .expo, ios y android"
	@echo "                             después: make install"
	@echo "  eas-init                   vincula la app con expo.dev (una vez, tras npx eas-cli login)"
	@echo "  eas-android                build en EAS: APK interno"
	@echo "  eas-ios-simulator          build en EAS: app para el simulador de iOS"
	@echo "  eas-production             build en EAS para las tiendas (ambas plataformas)"
	@echo "  eas-builds                 últimos builds de EAS y cuánto tardó cada uno"

prepare-environment:
	@pipx install pre-commit
	@pipx ensurepath
	@pre-commit install

install:
	@echo "Installing Node.js dependencies..."
	@yarn install

init: prepare-environment install

start:
	@npx expo start

web:
	@npx expo start --web

android:
	@npx expo run:android --device

ios:
	@npx expo run:ios --device

prebuild:
	@npx expo prebuild

lint:
	@npx expo lint

typecheck:
	@npx tsc --noEmit

check: lint typecheck

format:
	@echo "🔤 Ordenando imports + auto-fix (eslint)..."
	@npx eslint . --fix
	@echo "🎨 Formateando (prettier)..."
	@npx prettier --experimental-cli --write "**/*.{ts,tsx,js,jsx,json}" --ignore-path .gitignore
	@echo "Check types after formatting..."
	@$(MAKE) typecheck

doctor:
	@CI=1 npx expo install --check

test:
	@echo "Tickets no tiene suite propia. El typecheck cubre el host."
	@$(MAKE) typecheck

verify: verify-format

verify-format: format
	@if ! git diff --quiet; then \
	  echo >&2 "✘ El formateo ha modificado archivos. Por favor agrégalos al commit."; \
	  git --no-pager diff --name-only HEAD -- >&2; \
	  exit 1; \
	fi
	@echo "✓ Format verification passed"

build: typecheck
	@echo "✓ Typecheck listo. El binario del teléfono se genera con make android o make ios."

update-version:
ifndef VERSION
	$(error VERSION is required. Usage: make update-version VERSION=1.2.3)
endif
	@CURRENT_VERSION=$$(node -p "require('./package.json').version"); \
	if [ "$$CURRENT_VERSION" = "$(VERSION)" ]; then \
		echo "✓ Version is already $(VERSION), skipping update"; \
	else \
		npm version $(VERSION) --no-git-tag-version && \
		node -e "const fs=require('fs'); const p='app.json'; const j=JSON.parse(fs.readFileSync(p,'utf8')); j.expo.version='$(VERSION)'; fs.writeFileSync(p, JSON.stringify(j,null,2)+'\n')" && \
		echo "✓ Version updated to $(VERSION)"; \
	fi

publish:
	@echo "Tickets no se publica en npm. El binario sale de make android o make ios."

deploy:
	@echo "Deploy not applicable for the host. Use make android or make ios."

clean:
	@rm -rf node_modules .expo ios android
	@echo "✓ Cleaned. Siguiente paso: make install"

eas-init:
	@npx eas-cli@latest init

eas-android:
	@npx eas-cli@latest build --platform android --profile preview

eas-ios-simulator:
	@npx eas-cli@latest build --platform ios --profile simulator

eas-production:
	@npx eas-cli@latest build --platform all --profile production

eas-builds:
	@npx eas-cli@latest build:list --limit 10 --json --non-interactive | node scripts/eas-build-times.mjs

.PHONY: help prepare-environment install init start web android ios prebuild lint typecheck check format doctor test verify verify-format build update-version publish deploy clean eas-init eas-android eas-ios-simulator eas-production eas-builds
