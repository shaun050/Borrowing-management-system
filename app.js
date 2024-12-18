require("dotenv").config();

const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const methodOverride = require("method-override");
const connectDB = require("./server/config/db");

const session = require("express-session");
const flash = require("connect-flash");

const app = express();
const port = process.env.PORT || 4000;

// Connect to Database
connectDB();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride("_method"));

// Static files
app.use(express.static("public"));

// Express Session
app.use(
  session({
    secret: "secret",
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

// Flash Messages
app.use(flash({ sessionKeyName: "flashMessage" }));

// Templating engine with express-ejs-layouts
app.use(expressLayouts);
app.set("layout", "layouts/main"); // Remove the "./" in the layout path
app.set("view engine", "ejs");

// Routes
app.use("/", require("./server/routes/equipment"));
app.use("/", require("./server/routes/employee"));

// Handle 404
app.get("*", (req, res) => {
  res.status(404).render("404");
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
