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
const app = express();
const mongoose = require("mongoose");
require("dotenv").config();

const { add } = require("./utils");
const authMiddleware = require("./middleware/auth");
const adminMiddleware = require("./middleware/admin");
// const User = require("./utils");
const productMock = require("./mock/data.json");
const productRoute = require("./routes/product");

const mongoURL = `mongodb+srv://${process.env.MONGO_DB_USER_NAME}:${process.env.MONGO_DB_PASSWORD}@cluster0.8c3vhn6.mongodb.net/${process.env.MONGO_DB_NAME}?appName=Cluster0`;

//Middleware
app.use(express.json());
// app.use(authMiddleware);

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
  res.status(404).json({ error: "Page not found URL!" });
});
// Connect to MongoDB
mongoose
  .connect(mongoURL)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(3000, () => {
      console.log("server running at 3000");
      //   process.exit(0);
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error);
  });

//Server
