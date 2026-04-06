
export const validateRecord = (req, res, next) => {
  const { amount, type, category, status, date } = req.body;

  if (!amount || isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      message: "Amount must be a positive number"
    });
  }

  if (!["income", "expense"].includes(type)) {
    return res.status(400).json({
      message: "Invalid transaction type"
    });
  }

  if (!category || category.trim().length < 2) {
    return res.status(400).json({
      message: "Category is required"
    });
  }

  if (!["Success", "Pending", "Failed"].includes(status)) {
    return res.status(400).json({
      message: "Invalid status"
    });
  }

  if (!date || isNaN(new Date(date))) {
    return res.status(400).json({
      message: "Invalid date"
    });
  }

  next();
};