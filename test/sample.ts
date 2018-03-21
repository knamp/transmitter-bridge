import TransmitterBridge from "../";

(async () => {

  // tslint:disable-next-line
  console.log("Transmitter-Bridge starting..");

  const server = await TransmitterBridge({
    clientName: "transmitter-client",
    groupId: "transmitter-group",
    produceTo: "transmitter-consume",
    webserver: {
        port: 8844
    }
  });

  server.on("error", (error) => {
    // tslint:disable-next-line
    console.error(error);
  });

  server.on("request", data => {
    console.log(data);
  });

  // tslint:disable-next-line
  console.log("Transmitter-Bridge running.");
})();