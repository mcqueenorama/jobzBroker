jobzBroker
==========

Its similar to mongrel2.  Its http on the frontend and a publish queue on the backend (uses express and zeromq).

Its meant to be used like this.  Send an http request to the thing, and some subscriber job on the backend will pick it up and do something.

curl http://localhost/message?job=deployTrouncer

A job elsewhere is listening for messages named 'deployTrouncer', and it unpacks the tnetstring and gets busy with its work, otherwise it just waits for a message.  Its got a great many uses.

It passes stdin raw if a POST in the 'body'.  Arbitrary binary data can be passed, since its passed as a tnetstring.  Actually I haven't tested that part in this node-based implementation, but I expect that will work.  It doesn't care if its a GET/POST/DELETE/whatever.  It ignores the protocol verb and passes along the received data to the subscriber.

It passes the raw headers along, in the 'headers'.

It adds a job id, unique for each request, in 'jobId'.

It passes along the request path in the 'path'.

It passes along the query string in the 'query'.

Everything is sent in a tnetstring so it can be unpacked directly into an object easily.  The subscriber unpacks the body into an object and can 

Uses config module documented here:

http://lorenwest.github.io/node-config/latest/

CLI command override style:

node myApp.js --NODE_ENV=staging --NODE_APP_INSTANCE=3 '--NODE_CONFIG={"Customer":{"dbPort":5984}}'
