
const VALID_TYPES    = ["income", "expense"];
const VALID_STATUSES = ["Success", "Pending", "Failed"];

export const validateRecord = (req, res, next) => {
    const errors = [];
    const { amount, type, category, status, date } = req.body;

    const parsedAmount = Number(amount);
    if (amount === undefined || amount === null || amount === "") {
        errors.push("Amount is required");
    } else if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
        errors.push("Amount must be a positive number");
    }

    if (!type) {
        errors.push("Type is required");
    } else if (!VALID_TYPES.includes(type)) {
        errors.push(`Type must be one of: ${VALID_TYPES.join(", ")}`);
    }

    if (!category || category.trim().length < 2) {
        errors.push("Category must be at least 2 characters");
    }

    if (status !== undefined && !VALID_STATUSES.includes(status)) {
        errors.push(`Status must be one of: ${VALID_STATUSES.join(", ")}`);
    }

    if (date !== undefined && date !== null && date !== "") {
        const parsed = new Date(date);
        if (isNaN(parsed.getTime())) {
            errors.push("Date is not a valid date");
        }
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            code: "VALIDATION_ERROR",
            errors,
        });
    }

    req.body.amount = parsedAmount;
    if (category) req.body.category = category.trim();

    next();
};

export { VALID_TYPES, VALID_STATUSES };