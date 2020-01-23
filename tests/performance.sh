NOW=$(date +"%m-%d-%Y")

int_trap() {
    echo "Ctrl-C pressed"
    mv *.log ../tests/results
    cd ../tests/results

    node --prof-process --preprocess -j isolate*.log | flamebearer
    docker stop test-mongodb
}

trap int_trap INT


cd src
docker start test-mongodb || docker run --name test-mongodb -d -p 27017:27017 -v mongoData:/data/db mongo
NODE_ENV=production node --prof index.js