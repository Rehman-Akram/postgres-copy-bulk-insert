import express from "express"

const app = express();

app.get("/", (req, res) => {
    res.json("Server is working fine. This is my health check end point.");
});

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});