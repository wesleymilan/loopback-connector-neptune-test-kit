#!/usr/bin/env bash

mkdir library && cd library && git clone https://github.com/wesleymilan/loopback-connector-neptune.git

cd www/gremlin-visualizer
npm install
cd ../../

cd www/loopback
npm install
cd ../../

cd library/loopback-connector-neptune
npm install
cd ../../

./docker/neptune/build.sh
./docker/loopback/build.sh
