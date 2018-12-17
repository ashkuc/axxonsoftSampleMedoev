const http = require('http');
const {
    username,
    password,
    host: axxonsoftHost,
    port: axxonsoftPort
} = require('./axxonsoftConfig');

let cache = {};
const authHeader = 'Basic ' + Buffer.from(username + ':' + password).toString('base64');


function handleCommonRequest(request, response) {
    const cached = cache[request.url];

    if (cached) {
        console.log('cache hit!');

        response.writeHead(200, cached.headers);
        response.write(cached.buffer);
        response.end();
    } else {
        if (Object.keys(cache).length > 100) {
            cache = {};

            console.log('cache cleared');
        }

        return makeBackendRequest(request, response);
    }
}

function makeBackendRequest(request, response) {

    // Authorization header is case sensitive somehow
    if (request.headers.authorization) {
        request.headers.Authorization = request.headers.authorization;
        delete request.headers.authorization;
    } else if(!request.headers.Authorization) {
        request.headers.Authorization = authHeader;
    }

    const options = {
        host:    axxonsoftHost,
        port:    axxonsoftPort,
        path:    request.url,
        method:  request.method,
        headers: request.headers
    };

    const backendRequest = http.request(options, function(backendResponse) {
        response.writeHead(backendResponse.statusCode, backendResponse.headers);

        const buffersArray = [];

        const successfulImageResponse = backendResponse.headers['content-type']
            && backendResponse.headers['content-type'].includes('image')
            && backendResponse.statusCode === 200;

        backendResponse.on('data', function(chunk) {
            if(successfulImageResponse) {
                buffersArray.push(chunk)
            }

            response.write(chunk);
        });

        backendResponse.on('end', function() {
            if(successfulImageResponse) {
                cache[request.url] = {
                    buffer: Buffer.concat(buffersArray),
                    headers: backendResponse.headers
                };
            }

            response.end();
        });
    });

    request.on('data', function(chunk) {
        backendRequest.write(chunk);
    });

    request.on('end', function() {
        backendRequest.end();
    });
}

const handleOptionsRequest = (request, response) => {
    response.writeHead(
        200,
        {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "GET,HEAD,OPTIONS,POST,PUT",
            "Access-Control-Allow-Headers": "Origin, X-Requested-With, Content-Type, Accept, Authorization"
        }
    );
    response.end();
};

const requestHandler = (request, response) => request.method === 'OPTIONS'
    ? handleOptionsRequest(request, response)
    : handleCommonRequest(request, response);

module.exports = {
    requestHandler
};
