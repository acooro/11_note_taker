const express = require('express');
const path = require('path');
const uuid = require('./helpers/uuid');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(express.static('public'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


//homepage//
app.get('/', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/index.html')));


//notes//
app.get('/notes', (req, res) =>
  res.sendFile(path.join(__dirname, 'public/notes.html')));

app.get('/api/notes', (req, res) => {
  const filePath = './db/db.json';
  const file = fs.readFileSync(filePath);
  const fileContents = file.toString();
  let jsonResponse = JSON.parse(fileContents);
  res.json(jsonResponse)
 }
);

app.post('/api/notes', (req, res) => {
  const jsonNewNote = JSON.stringify(req.body);
  const filename = "./db/db.json";
  const oldFile = fs.readFileSync(filename);
  const oldData = JSON.parse(oldFile);
  req.body.id = uuid();
  const newData = [...oldData, req.body];

  fs.writeFileSync('./db/db.json', JSON.stringify(newData))
  res.json(jsonNewNote)

})

//remove notes//
app.delete('/api/notes/:id', (req, res) => {
  fs.readFile("./db/db.json", function (err, result) {
    const oldData = JSON.parse(result);

    const newNotes = [];
    for (let i = 0; i < oldData.length; i++) {
      const element = oldData[i];

      if (oldData[i].id != req.params.id) {
        newNotes.push(oldData[i])
      }
    }
    fs.writeFile("./db/db.json", JSON.stringify(newNotes), (err, result) => { res.json(newNotes) })
  })

})



app.listen(PORT, () => console.log(`Listening at http://localhost:${PORT}`));
