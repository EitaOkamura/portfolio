# portfolio の操作をひとつの語彙にまとめる。
SHELL := /bin/bash
.DEFAULT_GOAL := help

.PHONY: help
help: ## このヘルプを出す
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN{FS=":.*?## "};{printf "  \033[36m%-12s\033[0m %s\n", $$1, $$2}'

.PHONY: setup
setup: ## 依存をインストールする
	npm ci

.PHONY: dev
dev: ## 開発サーバを起動する
	npm run dev

.PHONY: check
check: lint typecheck test build infra ## コミット前に通すべきものを全部
	@echo "✅ check 通過"

.PHONY: test
test: ## テスト
	npm test

.PHONY: lint
lint: ## 静的検査
	npx oxlint

.PHONY: typecheck
typecheck: ## 型検査
	npx tsc -b

.PHONY: fmt
fmt: ## 自動修正
	npx oxlint --fix

.PHONY: build
build: ## 本番ビルド
	npm run build

.PHONY: infra
infra: ## CloudFormation テンプレートの構文を確認する
	node scripts/validate-infra.mjs

.PHONY: images
images: ## 取得済み画像を WebP にして public/ へ置く (SRC=<ディレクトリ>)
	@test -n "$(SRC)" || (echo "SRC=<取得済み画像のディレクトリ> を指定してください" && exit 1)
	node scripts/optimize-images.mjs "$(SRC)"
