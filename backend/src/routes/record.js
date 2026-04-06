// routes/record.js
import express from 'express';
import mongoose from 'mongoose';
import Record from '../models/record.js';
import verifyToken from '../middleware/verifyToken.js';
import { requireRoles } from '../middleware/roleMiddleware.js';
import { validateRecord, VALID_TYPES, VALID_STATUSES } from '../middleware/validateRecord.js';

const router = express.Router();


router.post("/add", verifyToken, requireRoles("admin"), validateRecord, async (req, res, next) => {
    try {
        const { amount, type, category, status, date, note } = req.body;

        await Record.create({
            createdBy: req.userId,
            amount,                             
            type,
            category,                          
            status: status || "Success",
            date: date ? new Date(date) : undefined,
            note: note?.trim() || undefined,
        });

        return res.status(201).json({ message: "Record added successfully" });

    } catch (err) {
        if (err.code === 11000) {
            return res.status(409).json({
                message: "A record with a duplicate key already exists",
                code: "DUPLICATE_KEY"
            });
        }
        next(err);
    }
});


router.get("/", verifyToken, requireRoles("viewer", "analyst", "admin"), async (req, res, next) => {
    try {

        const rawPage  = parseInt(req.query.page,  10);
        const rawLimit = parseInt(req.query.limit, 10);

        const page  = Number.isFinite(rawPage)  && rawPage  > 0 ? rawPage  : 1;
        const limit = Number.isFinite(rawLimit) && rawLimit > 0
            ? Math.min(rawLimit, 100)
            : 10;
        const skip = (page - 1) * limit;

        const filter = { createdBy: req.userId };

        if (req.query.type) {
            if (!VALID_TYPES.includes(req.query.type)) {
                return res.status(400).json({
                    message: `type must be one of: ${VALID_TYPES.join(", ")}`,
                    code: "INVALID_QUERY_PARAM"
                });
            }
            filter.type = req.query.type;
        }

        if (req.query.status) {
            if (!VALID_STATUSES.includes(req.query.status)) {
                return res.status(400).json({
                    message: `status must be one of: ${VALID_STATUSES.join(", ")}`,
                    code: "INVALID_QUERY_PARAM"
                });
            }
            filter.status = req.query.status;
        }

        if (req.query.search?.trim()) {
            const regex = new RegExp(req.query.search.trim(), "i");
            filter.$or = [{ category: regex }, { note: regex }];
        }

        const SORTABLE_FIELDS = ["date", "amount", "category"];
        const sortBy = SORTABLE_FIELDS.includes(req.query.sortBy) ? req.query.sortBy : "date";
        const order  = req.query.order === "asc" ? 1 : -1;

        const [total, records] = await Promise.all([
            Record.countDocuments(filter),
            Record.find(filter).sort({ [sortBy]: order }).skip(skip).limit(limit).lean()
        ]);

        const totalPages = Math.ceil(total / limit) || 1;

        return res.status(200).json({
            records,
            pagination: {
                total,
                totalPages,
                page,
                limit,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
            message: "Records retrieved successfully"
        });

    } catch (err) {
        next(err);
    }
});

router.patch("/update/:id", verifyToken, requireRoles("admin"), async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid record ID", code: "INVALID_ID" });
    }

    const { amount, type, category, status, date, note } = req.body;

    const hasPayload = [amount, type, category, status, date, note].some(v => v !== undefined);
    if (!hasPayload) {
        return res.status(400).json({ message: "No fields provided to update", code: "EMPTY_UPDATE" });
    }

    const errors = [];
    if (amount !== undefined) {
        const n = Number(amount);
        if (!Number.isFinite(n) || n <= 0) errors.push("Amount must be a positive number");
    }
    if (type !== undefined && !VALID_TYPES.includes(type)) {
        errors.push(`Type must be one of: ${VALID_TYPES.join(", ")}`);
    }
    if (category !== undefined && category.trim().length < 2) {
        errors.push("Category must be at least 2 characters");
    }
    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }
    if (date !== undefined && date !== "" && isNaN(new Date(date).getTime())) {
        errors.push("Date is not a valid date");
    }
    if (note !== undefined && note.length > 300) {
        errors.push("Note must be 300 characters or fewer");
    }

    if (errors.length > 0) {
        return res.status(400).json({ message: "Validation failed", code: "VALIDATION_ERROR", errors });
    }

    const updateFields = {};
    if (amount   !== undefined) updateFields.amount   = Number(amount);
    if (type     !== undefined) updateFields.type     = type;
    if (category !== undefined) updateFields.category = category.trim();
    if (status   !== undefined) updateFields.status   = status;
    if (date     !== undefined) updateFields.date     = new Date(date);
    if (note     !== undefined) updateFields.note     = note.trim();

    try {
        const updated = await Record.findOneAndUpdate(
            { _id: id, createdBy: req.userId },
            { $set: updateFields },
            { new: true }
        );

        if (!updated) {
            return res.status(404).json({
                message: "Record not found or you do not have permission to edit it",
                code: "NOT_FOUND"
            });
        }

        return res.status(200).json({ message: "Record updated successfully" });

    } catch (err) {
        next(err);
    }
});


router.delete("/delete/:id", verifyToken, requireRoles("admin"), async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({ message: "Invalid record ID", code: "INVALID_ID" });
    }

    try {
        const deleted = await Record.findOneAndDelete({ _id: id, createdBy: req.userId });

        if (!deleted) {
            return res.status(404).json({
                message: "Record not found or you do not have permission to delete it",
                code: "NOT_FOUND"
            });
        }

        return res.status(200).json({ message: "Record deleted successfully" });

    } catch (err) {
        next(err);
    }
});

export default router;