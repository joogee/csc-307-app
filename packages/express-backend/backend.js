// backend.js
import express from "express";
import cors from "cors";
import userservice from "./services/user-service.js";
import dotenv from "dotenv";
import mongoose from "mongoose";

const users = {
  users_list: [
    {
      id: "xyz789",
      name: "Charlie",
      job: "Janitor",
    },
    {
      id: "abc123",
      name: "Mac",
      job: "Bouncer",
    },
    {
      id: "ppp222",
      name: "Mac",
      job: "Professor",
    },
    {
      id: "yat999",
      name: "Dee",
      job: "Aspring actress",
    },
    {
      id: "zap555",
      name: "Dennis",
      job: "Bartender",
    },
  ],
};

dotenv.config();

const { MONGO_CONNECTION_STRING } = process.env;

mongoose.set("debug", true);
mongoose.connect(MONGO_CONNECTION_STRING).catch((error) => console.log(error));

const app = express();
const port = 8000;

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.get("/users", async (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  userservice.getUsers(name, job).then((result) => res.send(result));
});

app.get("/users/:id", async (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userservice.findUserById(id).then((result) => {
    if (result === undefined) {
      res.status(404).send("Resource not found.");
    } else {
      res.send(result);
    }
  });
});

function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

app.post("/users", async (req, res) => {
  const userToAdd = req.body;
  // userToAdd.id = generateID();
  userservice.addUser(userToAdd).then(() => res.status(201).send(userToAdd));
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  userservice
    .findUserByIdAndDelete(id)
    .then((result) => {
      res.status(204).send();
    })
    .catch((error) => {
      res.status(404).send("Resource not found.");
    });
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
