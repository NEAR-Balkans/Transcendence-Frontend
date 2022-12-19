ssh -p $SSH_PORT -T $SSH_USER@$SSH_HOST <<EOA

ssh -T $SSH_NESTED_HOST <<EOB

#cd $BASE_PATH 

#if [ -d "$CIRCLE_PROJECT_REPONAME" ] 
#then
#    cd $CIRCLE_PROJECT_REPONAME && \
#    git fetch && \
#    git checkout $CIRCLE_BRANCH && \
#    git pull && \
#    docker-compose up -d --build
#else
#    git clone $CIRCLE_REPOSITORY_URL && \
#    cd $CIRCLE_PROJECT_REPONAME && \
#    git checkout $CIRCLE_BRANCH && \
#    docker-compose up -d --build
#fi
aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin 801546505238.dkr.ecr.eu-central-1.amazonaws.com
$BASE_PATH_3 && docker-compose -f develop-docker-compose.yml pull && docker-compose -f develop-docker-compose.yml up -d --build
ls
EOB

EOA
