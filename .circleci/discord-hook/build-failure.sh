curl -X POST -H 'Content-type: application/json' --data "{ \
                        \"content\": \"${CIRCLE_JOB} Job Failed\",  \
                        \"embeds\": [{ \
                          \"description\": \":red_circle: XXXXX | DevOps:${CIRCLE_PROJECT_REPONAME} CI pipeline\", \
                          \"color\": \"15555676\", \
                          \"fields\": [ \
                            { \
                              \"name\": \"Branch\", \
                              \"value\": \"${CIRCLE_BRANCH} \", \
                              \"inline\": true \
                            }, \
                            { \
                              \"name\": \"Job Number\", \
                              \"value\": \"${CIRCLE_BUILD_NUM} \", \
                              \"inline\": true \
                            }, \
                            { \
                              \"name\": \"Pull request\", \
                              \"value\": \"${CIRCLE_PR_USERNAME} *\", \
                              \"inline\": true \
                            }, \
                            { \
                              \"name\": \"Build-URL\", \
                              \"value\": \"${CIRCLE_BUILD_URL} *\", \
                              \"inline\": true \
                            } \
                          ] \
                        }] \
                        }" ${DISCORD_WEBHOOK}
