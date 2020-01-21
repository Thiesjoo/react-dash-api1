const loadtest = require('loadtest');

const object = {
    email: "test@gmail.com",
    // password: "yeetA1",
    platform: "Ubuntu",
    useragent: "loadtest"
}

const options = {
    url: 'http://localhost:8090/user/login',
    maxRequests: 10,
    concurrency: 10,
    method: "POST",
    contentType: "application/json",
    insecure: true,
    body: object
};

console.time("LoadTest")

loadtest.loadTest(options, function(error, result)
{
    if (error)
    {
        return console.error('Got an error: %s', error);
    }
    console.log('Tests run successfully', result);
    console.timeEnd("LoadTest")
});