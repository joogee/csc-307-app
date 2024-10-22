// src/MyApp.jsx
import React, { useState, useEffect } from "react";
import Table from "./Table";
import Form from "./Form";

function MyApp() {
  const [characters, setCharacters] = useState([]);
  function fetchUsers() {
    const promise = fetch("http://localhost:8000/users");
    return promise;
  }

  function removeOneCharacter(index) {
    const personToRemove = characters[index];
    deleteUser(personToRemove._id)
      .then((response) => {
        const updated = characters.filter((character, i) => {
          return i !== index;
        });
        setCharacters(updated);
      })
      .catch((error) => {
        console.log(error);
      });
  }

  useEffect(() => {
    fetchUsers()
      .then((res) => res.json())
      .then((json) => setCharacters(json))
      .catch((error) => {
        console.log(error);
      });
  }, []);

  function postUser(person) {
    const promise = fetch("Http://localhost:8000/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(person),
    }).then((response) => {
      if (response.status === 201) {
        return response.json();
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    });

    return promise;
  }

  function deleteUser(_id) {
    const promise = fetch(`Http://localhost:8000/users/${_id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }).then((response) => {
      if (response.status === 204) {
        return response;
      } else {
        throw new Error(`Request failed with status ${response.status}`);
      }
    });

    return promise;
  }

  function updateList(person) {
    postUser(person)
      .then((response) => setCharacters([...characters, response]))
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className="container">
      <Table characterData={characters} removeCharacter={removeOneCharacter} />
      <Form handleSubmit={updateList} />
    </div>
  );
}
export default MyApp;
