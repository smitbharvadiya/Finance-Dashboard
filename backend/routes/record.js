import express from 'express';
import Record from '../models/record.js';
import verifyToken from '../middleware/verifyToken.js';

const router = express.Router();

router.post("/add", verifyToken, async (req, res) => {
    const userId = req.userId;
    const recordData = req.body;

    try {

        await Record.create({
            createdBy: userId,
            amount: recordData.amount,
            type: recordData.type,
            category: recordData.category,
            status: recordData.status,
            date: recordData.date,
            note: recordData.note,
        });

        return res.status(201).json({ message: "Record added successfully" });

    } catch (err) {
        return res.status(400).json({ message: "Failed to add record" });
    }
});

router.get("/", verifyToken, async (req, res) => {

    try {
        const records = await Record.find({ createdBy: req.userId }).sort({ date: -1 });

        return res.status(200).json({
            records,
            message: "All Financial Records",
        });

    } catch (err) {
        return res.status(400).json({ message: "Failed to fetch records" });
    }

});

router.patch("/update/:id", verifyToken, async (req, res) => {
    const { id } = req.params;
    const { amount, type, category, status, date, note } = req.body;

    try {
        await Record.findOneAndUpdate(
            { _id: id, createdBy: req.userId },
            {
                amount,
                type,
                category,
                status,
                date,
                note,
            });

        return res.status(200).json({ message: "Record Updated Successfully" });

    } catch (err) {
        return res.status(400).json({ message: "Failed to update record" });
    }

});

router.delete("/delete/:id", verifyToken, async (req, res) => {
    const { id } = req.params;

    try {
        await Record.findOneAndDelete({ 
            _id: id, 
            createdBy: req.userId 
        });

        return res.status(200).json({ message: "Record Deleted Successfully" });

    } catch (err) {
        return res.status(400).json({ message: "Failed to delete record" });
    }

});

export default router;