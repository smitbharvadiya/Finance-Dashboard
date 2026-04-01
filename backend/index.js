const express = require('express');

const app = express();

app.get('/', (req, res) => {
    res.send("Backend dashboard");
})

app.listen(3000, () => {
    console.log("The server is running on port 3000");
})