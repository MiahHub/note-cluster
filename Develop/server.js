const express = require('express');
const path = require('path');
const fs = require('fs');
const util = require('util');

//async processes
const readFileAsync = util.promisify(fs.readFile);
const writeFileAsync = util.promisify(fs.writeFile);

//initialize server
const app = express();
const PORT = process.env.PORT || 8000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//middleware 
app.use(express.static("./develop/public"));

//API GET
app.get("/api/notes", function (req, res) {
  readFileAsync("./develop/db/db.json", "utf8").then(function (data) {
    notes = [].concat(JSON.parse(data))
    res.json(notes);
  })
});

// API POST
app.post("/api/notes", function (req, res) {
  const note = req.body;
  readFileAsync("./develop/db/db.json", "utf8").then(function (data) {
    const notes = [].concat(JSON.parse(data));
    note.id = notes.length + 1
    notes.push(note);
    return notes
  }).then(function (notes) {
    writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
    res.json(note);
  })
});

// API DELETE
app.delete("/api/notesid", function (req, res) {
  const idToDelete = parseInt(req.params.id);
  readFileAsync("./develop/db/db.json", "utf8").then(function (data) {
    const notes = [].concat(JSON.parse(data));
    const newNotesData = []
    for (let i = 0; i < notes.length; i++) {
      if (idToDelete !== notes[i].id) {
        newNotesData.push(notes[i])
      }
    }
    return newNotesData
  }).then(function (notes) {
    writeFileAsync("./develop/db/db.json", JSON.stringify(notes))
    res.send('Sucessfully saved');
  })
})

// HTML routes
app.get("/notes", function (req, res) {
  res.sendFile(path.join(__dirname, ".develop/public/index.html"));
});
app.get("/", function (req, res) {
  res.sendFile(path.join(__dirname, ".develop/public/index.html"));
});
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, ".develop/public/index.html"));
});

//port listening
app.listen(PORT, function () {
  console.log("app is listening on port " + PORT);
});
