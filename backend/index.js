const express = require("express");
const cors = require("cors");
const mainRouter = require('./routes');



const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1",mainRouter);

const server = app.listen(3000,function(){
    console.log('express server listening on port ' + server.address().port);
     })