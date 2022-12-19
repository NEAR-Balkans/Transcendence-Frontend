
echo "Check for curl installation on the server"
which curl;
if [[ $? = 0 ]];
  then
    (curl --version)
  else
    echo "curl not found on server" && exit 1
fi
if [[ ! ${DISCORD_WEBHOOK} ]];
  then
    echo "Define the discord webhook variable"
    exit 1
  else
  echo "Webhook found in .env"
  bash  .circleci/discord-hook/build-success.sh
fi

