# Introduction

This is a website to show my portfolio of projects, it features an admin page where I can manage my projects and add new ones.

Feel free to read more about this project on my [dev-blog](https://bats.li/project/010101)

[Live website](https://bats.li)

# Setup

The current projects are filled with some examples of mine, feel free to delete them and setup your own Spawnpoint instance
with docker or directly with nodejs.

The default admin password is "password444" and should immediately be changed, it is stored at `./app/database/config.json`

## docker-compose.yml

```yml
version: '3.8'

services:
  app:
    platform: linux/amd64
    image: ghcr.io/batscs/spawnpoint:dev  # change dev to your desired version, keep it at dev for newest
    working_dir: /usr/src/app
    volumes:
      - ./data:/usr/src/app/data  # Only mounting data directory
    ports:
      - "1234:3000"
    environment:
      NODE_ENV: development
    networks:
      - default
      - proxy
    labels:
      - "traefik.enable=true"
      - "traefik.docker.network=$TRAEFIK_NETWORK"
      - "traefik.http.routers.spawnpoint-http.rule=Host(`$DOMAIN`)"
      - "traefik.http.routers.spawnpoint-http.entryPoints=web"
      - "traefik.http.routers.spawnpoint-http.middlewares=spawnpoint-https-redirect"
      - "traefik.http.middlewares.spawnpoint-https-redirect.redirectscheme.scheme=https"
      - "traefik.http.routers.spawnpoint-https.rule=Host(`$DOMAIN`)"
      - "traefik.http.routers.spawnpoint-https.entryPoints=websecure"
      - "traefik.http.routers.spawnpoint-https.tls.certresolver=letsencrypt"
      - "traefik.http.routers.spawnpoint-https.tls=true"
      - "traefik.http.services.spawnpoint-https.loadbalancer.server.port=3000"

networks:
  default:
    driver: bridge
  proxy:
    external: true
    name: $TRAEFIK_NETWORK
 ```
