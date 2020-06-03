require("dotenv").config();
const massive = require("massive");
const express = require("express");
const cors = require("cors");
const session = require("express-session");
const middleware = require("./middleware/middleware")
const authCtrl = require("./controllers/authController")

const { SERVER_PORT, CONNECTION_STRING, SESSION_SECRET } = process.env;

const app = express();

app.use(cors());
app.use(express.json());

app.use(
  session({
    resave: false,
    saveUninitialized: true,
    secret: SESSION_SECRET,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, //1 week
    },
  })
);

massive({
  connectionString: CONNECTION_STRING,
  ssl: { rejectUnauthorized: false },
}).then((db) => {
  app.set("db", db);
  console.log(`You are connected to the db`);
  app.listen(SERVER_PORT, () =>
    console.log(`Server connected at port ${SERVER_PORT}`)
  );
});

//Endpoints
app.post('/auth/register', middleware.checkUsername, authCtrl.register)
app.post('/auth/login', middleware.checkUsername, authCtrl.login)
app.post('/auth/logout', authCtrl.logout)
app.get('/auth/user', authCtrl.getUser)