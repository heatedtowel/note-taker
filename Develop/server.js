const express = require('express');
const path = require('path');
const app = express();
const PORT = 3001;
const db = require('./db/db.json');
const fs = require('fs');
const util = require('util');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

/* const writeToFile = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 4), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  ); */

const readData = () => {
  const data = JSON.parse(fs.readFileSync('./db/db.json', 'utf-8') || [])
  return data;
};

app.get('/', (req, res) => res.send('public/index.html'))

app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html'))
);

app.get('/api/notes', (req, res) => res.status(200).json(db));

app.post('/api/notes', (req, res) => {
  // Log that a POST request was received
  console.info(`${req.method} request received to add a note`);

  // Destructuring assignment for the items in req.body
  const { title, text } = req.body;

  // If all the required properties are present
  if (title && text) {
    // Variable for the object we will save
    const newNote = {
      title,
      text
    };

    /* note = readData(); */

    /* note.push(newNote); */
    storedNotes = readData()

    storedNotes.push(newNote);

    // Convert the data to a string so we can save it
    const noteString = JSON.stringify(storedNotes, null, 2);

    // Write the string to a file
    fs.writeFile(`./db/db.json`, noteString, (err) =>
      err
        ? console.error(err)
        : console.log(
          `success`
        )
    );



    /* writeToFile('./db/db.json', note); */

    const response = {
      status: 'success',
      body: newNote,
    };

    console.log(response);
    res.status(201).json(response);
  } else {
    res.status(500).json('Error in posting new note');
  }
});



app.listen(PORT, () =>
  console.log(`Example app listening at http://localhost:${PORT}`)
); 