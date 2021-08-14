#!/usr/bin/env bash

mkdir library
cd library
git clone https://github.com/wesleymilan/loopback-connector-neptune.git
cd loopback-connector-neptune
npm install
cd ../../

cd www/gremlin-visualizer
npm install
cd ../../

cd www/loopback
npm install
cd ../../

./docker/neptune/build.sh
./docker/loopback/build.sh
