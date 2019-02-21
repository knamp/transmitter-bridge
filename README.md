# Transmitter Bridge

[![Greenkeeper badge](https://badges.greenkeeper.io/knamp/transmitter-bridge.svg)](https://greenkeeper.io/)

Produce POST requests to Apache Kafka topic and trigger the Content-Transmitter.

## Usage

Install via yarn

    yarn install knamp-transmitter-bridge

Then configure it and use it

```javascript
import TransmitterBridge from "knamp-transmitter-bridge";

(async () => {

  const server = await TransmitterBridge({
    clientName: "transmitter-client",
    groupId: "transmitter-group",
    produceTo: "transmitter-consume",
    webserver: {
        port: 8844
    }
  });

  server.on("error", (error) => {
    console.error(error);
  });

  server.on("request", data => {
    console.log(data);
  });
})();
```

## Uses

* [Sinek](https://github.com/nodefluent/node-sinek), consuming and producing messages to and from Apache Kafka

## License

This project is under [MIT](./LICENSE).