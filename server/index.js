const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const auth = require("./middlewares/auth")
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

app.listen(port, '0.0.0.0', () => {
  console.log(`Server is running on http://localhost:${port}`);
});

//routes
const apiPrefix = "/api"
const ingredientsRoute = require("./routes/ingredientsRoute")
const mealLogsRoute = require("./routes/mealLogsRoute")
const reactionRoute = require("./routes/reactionRoute")
const unsafeFoodsRoute = require("./routes/unsafeFoodsRoute")
const brandedFoodRoute = require("./routes/brandedFoodRoute")
const crossReactionRoute = require("./routes/crossReactionsRoute")
const symptomRoute = require("./routes/symptomRoute")

app.use(`${apiPrefix}/ingredients`, /*auth,*/ ingredientsRoute);
app.use(`${apiPrefix}/meallogs`, /*auth,*/ mealLogsRoute);
app.use(`${apiPrefix}/reactions`, /*auth,*/ reactionRoute);
app.use(`${apiPrefix}/unsafefood`, /*auth,*/ unsafeFoodsRoute);
app.use(`${apiPrefix}/brandedfood`, /*auth,*/ brandedFoodRoute);
app.use(`${apiPrefix}/crossReaction`, /*auth,*/ crossReactionRoute);
app.use(`${apiPrefix}/symptoms`, /*auth,*/ symptomRoute);
app.use(`${apiPrefix}/admin`, require("./routes/adminRoute"));
