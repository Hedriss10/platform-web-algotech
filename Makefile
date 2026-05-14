PROJECT_NAME := platform-web-algotech

DOCKER_DEV_FILE := dockers/docker-compose.dev.yml
DOCKER_PROD_FILE := dockers/docker-compose.prod.yml

.PHONY: help dev-up dev-down dev-build dev-logs prod-up prod-down prod-build prod-logs deploy

DEPLOY_IMAGE := docker buildx build \
  --platform linux/amd64 \
  -f Dockerfile \
  -t hedris10/platform-web-algotech:latest \
  --push .

help:
	@echo "Targets disponíveis:"
	@echo "  dev-up      - sobe o ambiente de desenvolvimento (docker-compose.dev)"
	@echo "  dev-down    - derruba o ambiente de desenvolvimento"
	@echo "  dev-build   - builda a imagem de desenvolvimento"
	@echo "  dev-logs    - mostra logs do container web (dev)"
	@echo "  prod-up     - sobe o ambiente de produção (docker-compose.prod)"
	@echo "  prod-down   - derruba o ambiente de produção"
	@echo "  prod-build  - builda a imagem de produção"
	@echo "  prod-logs   - mostra logs do container web (prod)"
	@echo "  deploy      - builda e publica a imagem Docker"

dev-up:
	docker compose -f $(DOCKER_DEV_FILE) up -d --build

dev-down:
	docker compose -f $(DOCKER_DEV_FILE) down

dev-build:
	docker compose -f $(DOCKER_DEV_FILE) build

dev-logs:
	docker compose -f $(DOCKER_DEV_FILE) logs -f web

prod-up:
	docker compose -f $(DOCKER_PROD_FILE) up -d --build

prod-down:
	docker compose -f $(DOCKER_PROD_FILE) down

prod-build:
	docker compose -f $(DOCKER_PROD_FILE) build

prod-logs:
	docker compose -f $(DOCKER_PROD_FILE) logs -f web

deploy:
	$(DEPLOY_IMAGE)
