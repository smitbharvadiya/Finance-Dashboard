import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import connectDB from "./src/config/db.js";
import cookieParser from 'cookie-parser';
import authRoutes from './src/routes/auth.js';
import recordRoutes from './src/routes/record.js';
import summaryRoutes from './src/routes/analytics.js';
import errorHandler from './src/middleware/errorHandler.js';

connectDB();

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use("/auth", authRoutes);
app.use("/record", recordRoutes);
app.use("/summary", summaryRoutes);

app.get('/', (req, res) => {
    res.send("Backend dashboard");
});

app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
});

app.use(errorHandler);

app.listen(process.env.PORT, () => {
    console.log("The server is running on port 3000");
});