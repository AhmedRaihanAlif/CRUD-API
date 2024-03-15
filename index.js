const express = require("express");
const cors = require("cors");
const app = express();

//app using middlewares
app.use(express.json());
app.use(cors());

//routing api
const CrudApi = require("./crud_express");
app.use("/crudapi", CrudApi);
