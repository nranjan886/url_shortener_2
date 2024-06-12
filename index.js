const express = require('express')
const { connectToMongoDB } = require('./connect')
const URL = require('./models/url')
const routes = require('./routes/url')
const port = 8001
const app = express()

connectToMongoDB("mongodb://localhost:27017/short-url")

app.use(express.json())

app.use('/url', routes)

app.get("/:shortId", async (req, res) => {
  const shortId = req.params.shortId;
  const entry = await URL.findOneAndUpdate(
    {
      shortId,
    },
    {
      $push: {
        visitHistory: {
            timestamp: Date.now()
        },
      },
    }
  );
  res.redirect(entry.redirectURL);
});

app.listen(port, ()=> console.log(`Server Started at PORT: ${port}`))