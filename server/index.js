const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();


mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.log(err));

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({}));

const port = 4000;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//routes
const apiPrefix = "/api"
const ingredientsRoutes = require("./routes/ingredientsRoute")
const mealLogsRoutes = require("./routes/mealLogRoute")
const reactionRoutes = require("./routes/reactionRoute")

app.use(`${apiPrefix}/ingredients`, ingredientsRoutes);
app.use(`${apiPrefix}/meallogs`, mealLogsRoutes);
app.use(`${apiPrefix}/reactions`, reactionRoutes);