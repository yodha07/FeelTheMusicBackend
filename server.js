const { default: axios } = require("axios");
const dotenvC = require("dotenv");
const express = require("express");
const cors = require("cors");

dotenvC.config();
const app = express();
app.use(cors());
app.use(express.json());

const SpotifyClientId = process.env.SPOTIFY_CLIENT_ID;
const SpotifyClientSecret = process.env.SPOTIFY_CLIENT_SECRET;
const RedirectUri = process.env.REDIRECT_URI;

app.get("/login", (req, res) => {
    const scope = "streaming user-read-email user-read-private user-read-playback-state user-modify-playback-state";
    const authUrl = `https://accounts.spotify.com/authorize?response_type=code&client_id=${SpotifyClientId}&redirect_uri=${RedirectUri}&scope=${scope}`;
    res.redirect(authUrl);
});

app.get("/callback", async (req, res) => {
    const code = req.query.code || null;

    try{
        const response = await axios.post("https://accounts.spotify.com/api/token",
      new URLSearchParams({
        grant_type: "authorization_code",
        code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
      }),
      { headers: { "Content-Type": "application/x-www-form-urlencoded" } }
    );

    // Send tokens to frontend
    res.json(response.data);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

app.get("/", (req, res) => {
    res.send("Welcome to the Music Visualizer API");
})

app.listen(5000, () => {
    console.log("App listening");
});