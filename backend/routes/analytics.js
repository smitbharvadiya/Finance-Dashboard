import express from "express";
import mongoose from "mongoose";
import Record from "../models/record.js";
import verifyToken from "../middleware/verifyToken.js";

const router = express.Router();

function last7UtcDays() {
    const keys = [];
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    for (let i = 6; i >= 0; i--) {
        const d = new Date(today);
        d.setUTCDate(d.getUTCDate() - i);
        keys.push(d.toISOString().slice(0, 10));
    }
    return keys;
}

function fillWeek(keys, rows) {
    const map = new Map(rows.map((r) => [r._id, r]));
    return keys.map((period) => {
        const row = map.get(period);
        const income = row?.income ?? 0;
        const expense = row?.expense ?? 0;
        return { period, income, expense, net: income - expense };
    });
}

router.get("/", verifyToken, async (req, res) => {
    try {
        if (!mongoose.Types.ObjectId.isValid(req.userId)) {
            return res.status(400).json({ error: "Invalid user id" });
        }
        const userObjectId = new mongoose.Types.ObjectId(req.userId);
        const dayKeys = last7UtcDays();
        const weekStart = new Date(`${dayKeys[0]}T00:00:00.000Z`);

        const summary = await Record.aggregate([
            { $match: { createdBy: userObjectId } },
            {
                $facet: {
                    totals: [
                        {
                            $group: {
                                _id: null,
                                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                            }
                        },
                        {
                            $project: {
                                _id: 0,
                                totalIncome: "$income",
                                totalExpense: "$expense",
                                netBalance: { $subtract: ["$income", "$expense"] }
                            }
                        }
                    ],
                    categoryTotals: [
                        { $group: { _id: "$category", total: { $sum: "$amount" } } },
                        { $sort: { total: -1 } },
                        { $limit: 5 }
                    ],
                    weekBuckets: [
                        { $match: { date: { $gte: weekStart } } },
                        {
                            $group: {
                                _id: { $dateToString: { format: "%Y-%m-%d", date: "$date" } },
                                income: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                                expense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
                            }
                        },
                        { $sort: { _id: 1 } }
                    ],
                    recent: [{ $sort: { date: -1 } }, { $limit: 5 }]
                }
            }
        ]);

        const data = summary[0];
        res.status(200).json({
            metrics: data.totals[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0 },
            categories: data.categoryTotals,
            trends: fillWeek(dayKeys, data.weekBuckets),
            recentActivity: data.recent
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

export default router;
