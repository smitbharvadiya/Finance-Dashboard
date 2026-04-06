import mongoose from "mongoose";

function classifyError(err) {

    if (err.statusCode) {
        return {
            status: err.statusCode,
            message: err.message,
            code: err.code || "CUSTOM_ERROR",
            errors: err.errors,
        };
    }

    if (err.name === "JsonWebTokenError") {
        return { status: 403, message: "Invalid token" };
    }
    if (err.name === "TokenExpiredError") {
        return { status: 401, message: "Token expired" };
    }

    if (err instanceof mongoose.Error.ValidationError) {
        return {
            status: 400,
            message: "Validation failed",
            errors: Object.values(err.errors).map(e => e.message),
        };
    }

    if (err instanceof mongoose.Error.CastError) {
        return {
            status: 400,
            message: `Invalid ${err.path}: ${err.value}`,
        };
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue || {})[0];
        return {
            status: 409,
            message: `${field} already exists`,
        };
    }

    return null;
}

const errorHandler = (err, req, res, next) => {

    if (res.headersSent) return next(err);

    const classified = classifyError(err);

    if (classified) {
        return res.status(classified.status).json({
            success: false,
            message: classified.message,
            ...(classified.errors && { errors: classified.errors }),
        });
    }

    console.error(`[${req.method}] ${req.originalUrl}`, err);

    return res.status(err.statusCode || 500).json({
        success: false,
        message: process.env.NODE_ENV === "production"
            ? "Internal Server Error"
            : err.message,
    });
};

export default errorHandler;