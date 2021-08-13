#!/usr/bin/env bash

/opt/gremlin-server/bin/gremlin-server.sh start

stopServices() {
  /opt/gremlin-server/bin/gremlin-server.sh stop
}

# setup handlers
# on callback, kill the last background process, which is `tail -f /dev/null` and execute the specified handler
trap 'stopServices' SIGINT

# wait forever
while true
do
  tail -f /dev/null & wait ${!}
done
