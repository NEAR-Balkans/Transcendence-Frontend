#!/bin/bash
# rollback deployment incase if service update fails
# check if the alchemix-frontend service status
# if running or failed
# check the python version on the server 2 or 3
    python -v
    # code blocks runs, if the python version is 3
    if [[ ! $? == 0 ]];
    echo "Using python3"
      then
        docker service inspect alchemix-service > service_test.json
        python3 -c 'import json
with open("service_test.json") as file:
  data=json.load(file)
  for x in data:
    service_status=x["UpdateStatus"]["State"]
    f=open("service_status.txt", "a")
    f.write(service_status)
    f.close()'
    fi

a=$(cat service_status.txt) # | grep -ow paused
echo $a
if [[ $a == 'completed' ]];
then
  echo "Service running, no rollback action"
elif [[ $a == 'paused' ]];
then
  echo "Rollback Initiated!!!"
  docker service update --rollback alchemix-service
fi

rm service_test.json
rm service_status.txt
