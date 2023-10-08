#!/bin/bash 
docker build -f demo/Dockerfile -t logger-demo demo

for value in {1..3}
do
  docker run -d logger-demo:latest
done