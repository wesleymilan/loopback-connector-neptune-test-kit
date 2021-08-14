#!/usr/bin/env bash

docker rm -f neptune_loopback
docker build --no-cache -t neptune_loopback -f docker/loopback/Dockerfile .
#docker build -t neptune_loopback -f docker/loopback/Dockerfile .
