const express = require('express');
const path = require('path');
const { v4: uuidv4 } = require('uuid');
const PORT = 3001;
const db = require('./db/db.json');
const fs = require('fs');
const util = require('util');
const app = express();
const { readAndAppend, readFromFile } = require('./helpers/readWrite');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));


app.get('/', (req, res) => res.send('public/index.html'))


app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => {
  readFromFile('./db/db.json').then((data) => res.json(JSON.parse(data)));
});


app.post('/api/notes', (req, res) => {

  const { title, text } = req.body;
  console.log(req.body)
  if (req.body) {
    const newNote = {
      title,
      text,
      id: uuidv4()
    };

    readAndAppend(newNote, './db/db.json');
    res.json('new tip added');
  }
})

app.delete('/api/notes/:id', (req, res) => {
  const notes = JSON.parse((fs.readFileSync('./db/db.json', 'utf8')));
  const Id = req.params.id;
  const removedNote = notes.splice(notes.findIndex(value => value.id === Id), 1);
  fs.writeFileSync('./db/db.json', JSON.stringify(notes, null, 2));
  res.json(notes);
  console.log(`Note deleted ${JSON.stringify(removedNote, null, 2)}`);
});


app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
); 