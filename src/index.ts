import cors from "cors";
import express from "express";
import path from "path";
import http from "http";
import fs from "fs";
import { router } from "./router/index.routes";
import { db } from "./db";
import { config } from "dotenv";
import { Genre, genres } from "./db/model/genre.model";
import { Author } from "./db/model/author.model";

config();

const app = express();

const server = http.createServer(app);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/uploads", express.static(path.join(__dirname, "..", "uploads")));

app.use(cors());
app.options("*", cors());

app.use("/", router);

app.use(express.static(path.join(__dirname, "..", "client", "build")));

app.use((_, res) => {
  res.sendFile(path.join(__dirname, "..", "client", "build", "index.html"));
});

const port = process.env.PORT || 8080;
const dev = process.env.NODE_ENV === "production" ? false : true;
const start = async () => {
  if (dev) {
    fs.rmSync("uploads", { force: true, recursive: true });
  }
  if (!fs.existsSync("uploads")) {
    fs.mkdirSync("uploads");
  }
  try {
    await db.authenticate({ logging: false });
    await db.sync({ force: dev, logging: false });
    genres.forEach(async (value) => {
      try {
        const genre = new Genre({ value });
        await genre.save();
      } catch (err) {
        console.log("No Created");
      }
    });

    server.listen(port, () => {
      console.log(`Server started on port ${port}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();

const ONEDAYINMS = 86400000;

setInterval(() => {
  (async () => {
    await Author.update(
      {
        reqCount: 0,
      },
      { where: {} }
    );
  })();
}, ONEDAYINMS);
