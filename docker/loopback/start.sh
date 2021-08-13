#!/usr/bin/env bash

cd /app/www/loopback && npm run build && npm test

# pm2 start /app/www/loopback/pm2-development.json

cd /app/www/gremlin-visualizer
npm start

tail -f /dev/null
