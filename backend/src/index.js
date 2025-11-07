import express from "express";
import mongoose from "mongoose";
import routes from "./routes/api.js";

const app = express();
const port = 3001;
app.use(express.json());

const start = async () => {
    const connectionDb = await mongoose.connect("mongodb+srv://Pavan:Pavan2811@cluster0.fx2fn5c.mongodb.net/?appName=Cluster0");
    console.log(`MONGO CONNECTED DB HOST : ${connectionDb.connection.host}`);

};
start();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.use("/api", routes);

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
});