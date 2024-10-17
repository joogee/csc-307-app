// backend.js
import express from "express";
import cors from "cors";

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
const app = express();
const port = 8000;

app.use(express.json());

app.use(cors());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

const findUserByName = (users, name) => {
  return users["users_list"].filter((user) => user["name"] === name);
};

const findUserByJob = (users, job) => {
  return users["users_list"].filter((user) => user["job"] === job);
};

app.get("/users", (req, res) => {
  const name = req.query.name;
  const job = req.query.job;
  var result = users;
  if (name != undefined) {
    result = findUserByName(result, name);
    result = { users_list: result };
  }
  if (job != undefined) {
    result = findUserByJob(result, job);
    result = { users_list: result };
  }
  res.send(result);
});

const findUserById = (id) =>
  users["users_list"].find((user) => user["id"] === id);

app.get("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(id);
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    res.send(result);
  }
});

const addUser = (user) => {
  users["users_list"].push(user);
  return user;
};

function generateID() {
  return Math.floor(Math.random() * 1000000000);
}

app.post("/users", (req, res) => {
  const userToAdd = req.body;
  userToAdd.id = generateID();
  addUser(userToAdd);
  res.status(201).send(userToAdd);
});

app.delete("/users/:id", (req, res) => {
  const id = req.params["id"]; //or req.params.id
  let result = findUserById(parseInt(id, 10));
  if (result === undefined) {
    res.status(404).send("Resource not found.");
  } else {
    users["users_list"] = users["users_list"].filter(
      (user) => user["id"] !== id
    );
  }
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
