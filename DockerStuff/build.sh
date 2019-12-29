docker build -f DockerStuff/Dockerfile -t dashboardinfo/api1:latest . 
docker container prune --filter "until=24h" -f #Remove every container that is older than a day


# Remove all api1 tags:
# docker images | grep "dashboardinfo/api1" | grep -v "latest" | awk '{print $1 ":" $2}' | xargs docker rmi