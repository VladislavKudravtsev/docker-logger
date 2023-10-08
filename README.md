
# Docker logger

CLI app for listening container logs

## Prerequisites

- Node.js >= 18
- Docker

## Run Locally

Clone the project.

```bash
  git clone https://github.com/VladislavKudravtsev/docker-logger.git
```

Go to the project directory

```bash
  cd docker-logger
```

Install dependencies

```bash
  npm ci
```

If you dont have running containers, you can use docker image for demo in `demo` folder, check [Demo containers](#demo-containers)

Start service

```bash
  npm run start
```

### Demo containers
You can use bash script `demo.sh` that will build image and create 3 demo containers or do it manually

#### Demo Script
make sure that script is executable

Run Script

```bash
  ./demo.sh
```

Clean up containers
```bash
  docker rm $(docker stop $(docker ps -a -q --filter ancestor=logger-demo:latest --format="{{.ID}}"))
```

#### Manual
Build demo image

```bash
  docker build -f demo/Dockerfile -t logger-demo demo
```

Create container

```bash
  docker run -d logger-demo:latest
```