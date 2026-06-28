// const http = require("http");
// const server = http.createServer((req, res) => {
//   //   res.writeHead(200, { "content-type": "text/plain" });

//   //   res.end("Hello from Node.js");
//   console.log(req, "this is req");
//   if (req.url === "/") {
//     res.writeHead(200, { "content-type": "application/json" });
//     return res.end(JSON.stringify({ message: "Welcome to the homepage" }));
//   } else {
//     res.writeHead(404, { "content-type": "application/json" });
//     res.end(JSON.stringify({ error: "Page not found!" }));
//   }
// });

// server.listen(3000, () => {
//   console.log("server running at 3000");
// });

//Import
const express = require("express");
const session = require("express-session");
const morgan = require("morgan");
const path = require("path");
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const logger = require("./utils/logger/logger");
const { add } = require("./utils");
const { protect: authMiddleware } = require("./middleware/auth");
const adminMiddleware = require("./middleware/admin");
const productController = require("./controllers/productController");
const upload = require("./middleware/multer");
// const User = require("./utils");
const productMock = require("./mock/data.json");
const productRoute = require("./routes/product");
const uploadRoute = require("./routes/upload");
const authRoute = require("./routes/auth");
const viewRoute = require("./routes/view");
const mongoURL = `mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.8c3vhn6.mongodb.net/${process.env.MONGO_DB_NAME}?appName=Cluster0`;

//Middleware
//template intialized
app.set("view engine", "pug");
app.set("views", path.join(__dirname, "views")); //'./views
//logger initialized
app.use(morgan("combined", { stream: logger.stream }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  session({
    secret: process.env.SESSION_SECRET || "shopping-secret",
    resave: false,
    saveUninitialized: false,
    cookie: { httpOnly: true, maxAge: 1000 * 60 * 60 }
  })
);
app.use((req, res, next) => {
  logger.info(`Incoming request: ${req.method} ${req.originalUrl}`);
  next();
});
app.use("/auth", authRoute);

app.use(viewRoute);
app.use("/upload", authMiddleware, uploadRoute);
app.use("/products", productRoute);

//.................................

//Routes
//methods
// app.get();
// app.post();
// app.delete();
// app.patch();
// app.put()

app.post("/update", adminMiddleware, (req, res) => {
  //   const user = new User("Alice", "alice@example.com");
  //   console.log(user.greet());
  //   console.log(PI);
  console.log("console logged");
  console.log(req.body);
  res.json({ message: "Welcome to the homepage admin" });
});

// app.get("/product", (req, res) => {
//   res.json({ products: productMock.products });
// });

app.use("/products", productRoute);
//................................

//Error handling
app.use((req, res) => {
  logger.warn(`Route not found: ${req.method} ${req.originalUrl}`);
  res.status(404).json({ error: "Page not found URL!" });
});

app.use((err, req, res, next) => {
  logger.error(`Unhandled error: ${err.message}`, {
    stack: err.stack,
    url: req.originalUrl
  });
  res.status(err.status || 500).json({ error: "Internal server error" });
});
// Connect to MongoDB
mongoose
  .connect(mongoURL)
  .then(() => {
    logger.info("Connected to MongoDB");
    app.listen(3000, () => {
      logger.info("server running at 3000");
      //   process.exit(0);
    });
  })
  .catch((error) => {
    logger.error("Error connecting to MongoDB", {
      error: error.message,
      stack: error.stack
    });
  });

// function connectToDb() {
//   try {
//     mongoose.connect(mongoURL).then(() => {
//       console.log("Connected to MongoDB");
//       app.listen(3000, () => {
//         console.log("server running at 3000");
//         //   process.exit(0);
//       });
//     });
//   } catch (error) {
//     console.error("Error connecting to MongoDB:", error);
//   }
// }
// connectToDb();
//Server
