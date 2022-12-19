VERSION=$(
                     curl --silent "https://api.github.com/repos/goodwithtech/dockle/releases/latest" | \
                     grep '"tag_name":' | \
                     sed -E 's/.*"v([^"]+)".*/\1/' \
                    ) && curl -L -o dockle.deb https://github.com/goodwithtech/dockle/releases/download/v${VERSION}/dockle_${VERSION}_Linux-64bit.deb
                    sudo dpkg -i dockle.deb && rm dockle.deb
            echo 'Build alchemix-frontend image'
            docker build . -t alchemix-frontend
            echo 'Dockle image linting'
            sudo dockle -f json -o result.json  --exit-code 1 --exit-level fatal alchemix-frontend
            echo 'Storing the dockle .json result as artifact'
            mkdir /tmp/artifacts
            cp result.json /tmp/artifacts
            aws ecr get-login-password --region ${AWS_DEFAULT_REGION} | docker login --username AWS --password-stdin 801546505238.dkr.ecr.eu-central-1.amazonaws.com
            docker tag alchemix-frontend:latest 801546505238.dkr.ecr.eu-central-1.amazonaws.com/alchemix-frontend:${CIRCLE_BRANCH}
            docker push 801546505238.dkr.ecr.eu-central-1.amazonaws.com/alchemix-frontend:${CIRCLE_BRANCH}
