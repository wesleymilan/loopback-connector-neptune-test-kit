#!/usr/bin/env bash

docker rm -f neptune_gremlin
docker build --no-cache -t neptune_gremlin -f docker/neptune/Dockerfile .
#docker build -t neptune_gremlin -f docker/neptune/Dockerfile .
