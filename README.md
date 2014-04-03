jobzBroker
==========

node based broker

Its similar to mongrel2.  Its http on the front end and a publish queue on the backend.

Its meant to be used like this.  Send an http request to the thing, and some subscriber job on the backend will pick it up and do something.

curl http://localhost/message?job=deployTrouncer

A job elsewhere is listening for messages named 'deployTrouncer', and it unpacks the tnetstring and gets busy with it.

It passes stdin raw if its a post in the 'body'.

It passes the raw headers along, in the 'headers'.

It adds a job id, unique for each request, in 'jobId'.

It passes along the request path in the 'path'.

Everything is sent in a tnetstring like this:

{jobId: uuid.v1(), path: broker.httpd.path, headers: req.headers, body: req.text}

I need to pass along the query string too.  It will be jammed into the object in the same way.

Uses config module documented here:

http://lorenwest.github.io/node-config/latest/

CLI command override style:

node myApp.js --NODE_ENV=staging --NODE_APP_INSTANCE=3 '--NODE_CONFIG={"Customer":{"dbPort":5984}}'
