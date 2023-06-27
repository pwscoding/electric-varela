const dotenv = require("dotenv")
const express = require('express')
const path = require('path');
const cors = require('cors')
const app = express();
const cookieParser = require('cookie-parser')
app.use(cookieParser())

app.use(express.json())
app.use(require('./router/auth'))
app.use(cors())

dotenv.config({path: "./config.env"}) 
app.use("/uploads", express.static('./uploads'))
 
const PORT = process.env.PORT || 3001  // Getting from config.env file
require("./db/conn") // Connection File with Db


app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

app.listen(PORT, () => {
    console.log("Server is running on port 3001");
})