const express = require('express');
var cors = require('cors')
const connectToMongo=require('./db.js');

connectToMongo();
// const { Router } = require('express');
const app = express()
const port = 5000;

app.use(cors())

app.use(express.json())

// Availabel Routes
app.use('/api/auth',require('./routes/auth'))
app.use('/api/notes',require('./routes/notes'))

app.listen(port, () => {
  console.log(`iNotebook backend app listening on port ${port}`)
})
 