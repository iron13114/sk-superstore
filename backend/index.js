const app = require("./app");
const { connectToDB } = require("./database/db");

app.get('/health', (req, res) => {
  res.status(200).send('OK');
});

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
    console.log(`server [STARTED] ~ port ${PORT}`);
});

connectToDB().then(() => {
    console.log("DB connected, starting seeds...");
}).catch(err => {
    console.error("DB connection failed:", err);
});