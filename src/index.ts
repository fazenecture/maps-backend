import express from "express";
import dotenv from "dotenv";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import routes from "./routes/index.routes";
import client from "prom-client";
import { initMongo } from "./config/mongoose";
import morgan from "morgan";

dotenv.config();

const PORT = process.env.PORT || 3000;

const app = express();

app.use(express.json());
app.use(helmet());
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));
app.use(morgan("dev"));

client.collectDefaultMetrics();
app.get("/metrics", async (req, res) => {
  res.set("Content-Type", client.register.contentType);
  res.end(await client.register.metrics());
});

app.use("/api", routes);

const init = async () => {
  await initMongo();
  app.listen(PORT, () =>
    console.log(`Worker ${process.pid} running on port ${PORT}`)
  );
};

init();
