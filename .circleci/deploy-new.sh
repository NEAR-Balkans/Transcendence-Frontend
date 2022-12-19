
ssh -p $SSH_PORT -T $SSH_USER@$SSH_HOST <<EOA
ssh -T $SSH_NESTED_HOST <<EOB

which aws;
if [[ ! $? == 0 ]];
  then
    echo "Installing AWS"
    sudo curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
    sudo unzip awscliv2.zip
    sudo ./aws/install
  else
    echo "AWS installed"
fi

aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin 801546505238.dkr.ecr.eu-central-1.amazonaws.com

if [[ $? == 0 ]];
then
  echo "Credentials exists"
else
  aws configure set aws_access_key_id $AWS_ACCESS_KEY_ID
  aws configure set aws_secret_access_key $AWS_SECRET_ACCESS_KEY
  aws configure set region $AWS_DEFAULT_REGION
  aws ecr get-login-password --region $AWS_DEFAULT_REGION | docker login --username AWS --password-stdin 801546505238.dkr.ecr.eu-central-1.amazonaws.com
fi

echo "Pulling image from alchemix-frontend"
docker pull 801546505238.dkr.ecr.eu-central-1.amazonaws.com/alchemix-frontend:$CIRCLE_BUILD_NUM 
docker tag 801546505238.dkr.ecr.eu-central-1.amazonaws.com/alchemix-frontend:$CIRCLE_BUILD_NUM alchemix-frontend:$CIRCLE_BUILD_NUM


#docker swarm init --advertise-addr 127.0.0.1
         docker service create -e NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL -e NEXT_PUBLIC_ONBOARD_API_KEY=$NEXT_PUBLIC_ONBOARD_API_KEY \
-e NEXT_PUBLIC_BITLY_KEY=$NEXT_PUBLIC_BITLY_KEY -e NEXT_PUBLIC_MATIC_RPC=$NEXT_PUBLIC_MATIC_RPC  \
-e NEXT_PUBLIC_CONTRACT_ADDRESS=$NEXT_PUBLIC_CONTRACT_ADDRESS -e NEXT_PUBLIC_BET_MAPPER_ADDRESS=$NEXT_PUBLIC_BET_MAPPER_ADDRESS  \
-e NEXT_PUBLIC_ADMIN_ADDRESS=$NEXT_PUBLIC_ADMIN_ADDRESS -e NEXT_PUBLIC_ENABLE_TESTNET=$NEXT_PUBLIC_ENABLE_TESTNET -e NEXT_PUBLIC_DEFAULT_TESTNET=$NEXT_PUBLIC_DEFAULT_TESTNET \
-e INFURA_API_KEY=$INFURA_API_KEY \
--name alchemix-service --publish 3300:3000 alchemix-frontend:$CIRCLE_BUILD_NUM \
| docker service update --env-add NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL --env-add NEXT_PUBLIC_ONBOARD_API_KEY=$NEXT_PUBLIC_ONBOARD_API_KEY \
--env-add NEXT_PUBLIC_BITLY_KEY=$NEXT_PUBLIC_BITLY_KEY --env-add NEXT_PUBLIC_MATIC_RPC=$NEXT_PUBLIC_MATIC_RPC  \
--env-add NEXT_PUBLIC_CONTRACT_ADDRESS=$NEXT_PUBLIC_CONTRACT_ADDRESS --env-add NEXT_PUBLIC_BET_MAPPER_ADDRESS=$NEXT_PUBLIC_BET_MAPPER_ADDRESS  \
--env-add NEXT_PUBLIC_ADMIN_ADDRESS=$NEXT_PUBLIC_ADMIN_ADDRESS --env-add NEXT_PUBLIC_ENABLE_TESTNET=$NEXT_PUBLIC_ENABLE_TESTNET \
--env-add NEXT_PUBLIC_DEFAULT_TESTNET=$NEXT_PUBLIC_DEFAULT_TESTNET --env-add INFURA_API_KEY=$INFURA_API_KEY \
--image alchemix-frontend:$CIRCLE_BUILD_NUM alchemix-service
EOB

EOA
