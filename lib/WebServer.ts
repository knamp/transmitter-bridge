import * as EventEmitter from "events";

import * as express from "express";
import * as bodyParser from "body-parser";
import * as cors from "cors";
import * as uuid from "uuid";

import ConfigInterface from "./interfaces/ConfigInterface";
import ProducerPayloadInterface from "./interfaces/ProducerPayloadInterface";
import Producer from "./kafka/Producer";

export default class WebServer extends EventEmitter {
    private producer: Producer;
    private config: ConfigInterface;
    private server?: any;

    constructor(config: ConfigInterface){
        super();

        this.producer = new Producer(config);
        this.config = config;
        this.server = null;

        this.producer.on("error", this.handleError.bind(this));
    }

    async start(): Promise<void> {

        await this.producer.connect();

        const app = express();

        app.use(cors());
        app.use(bodyParser.json());

        app.get("/admin/health", (req, res) => {
            res.status(200).json({
                status: "UP"
            });
        });

        app.get("/admin/healthcheck", (req, res) => {
            res.status(200).end();
        });

        app.post("/produce", async (req, res) => {
            
            const url = req.body.url;

            if(!url){
                return res.status(404).json({
                    error: "Missing 'url' field on body."
                });
            }

            const key = uuid.v4();

            const payload: ProducerPayloadInterface = {
                url
            };

            await this.producer.produce(key, payload);

            super.emit("request", {key, url});

            res.status(201).json({
                key
            });
        });

        this.server = await (new Promise((resolve, reject) => {
            let server = undefined;
            server = app.listen(this.config.webserver.port, (error) => {

                if(error){
                    return reject(error);
                }

                resolve(server);
            });
        }));
    }

    public close(): void {

        if(this.producer){
            this.producer.close();
        }

        if(this.server){
            this.server.close();
        }
    }

    /**
     * If there is an error, please report it
    */
    private handleError(error: Error): void {
        super.emit("error", error);
    }
}