require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");

const app = express();

// ==============================
//  MIDDLEWARE
// ==============================
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

morgan.token("body", (req, res) => JSON.stringify(req.body));
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :body")
);

// ==============================
// ENDPOINTS
// ==============================

app.get("/", (request, response) => {
  response.send("<h1>Hello world!</h1>");
});

// ==============================
// Error handlers
// ==============================

// This should be the final "normal" (i.e. not error handler) route/middleware added to express
const unknownEndpointHandler = (request, response, next) => {
  response.status(404).send({ error: "unknown endpoint" });
};
app.use(unknownEndpointHandler);

// First error handler (extra param for error). Should be added AFTER all middlewares/routes
const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  }

  next(error);
};
app.use(errorHandler);

// ==============================
// Application start
// ==============================

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
