require("dotenv").config();
const express = require("express");
const path = require("path");
const cors = require("cors");
const connection = require("./db");
const app = express();

connection();

app.use(express.json());
app.use(cors({
    origin: ['https://habits-development.netlify.app', 'http://localhost:3000', 'http://localhost:8080']
}));


app.use("/api/users", require("./routes/user"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/workout", require("./routes/workout"));
app.use("/api/calories", require("./routes/calorie"));
app.use("/api/calc", require("./routes/caloriecalc"));
app.use("/api/profile", require("./routes/profile"));
app.use("/api/AI", require("./routes/AI"));
app.use("/api/FitBit", require("./routes/FitBit"));


app.use(express.static(path.join(__dirname, '../../build')));

app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../../build', 'index.html')); // Adjusted path
});

const port = process.env.PORT || 8080;
app.listen(port, '0.0.0.0', () => console.log(`Listening on port ${port}...`));
