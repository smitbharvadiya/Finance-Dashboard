

export function requireRoles(...allowed) {
    return (req, res, next) => {

        const role = req.role;

        if (!role) {
            return res.status(403).json({ message: "Forbidden", code: "NO_ROLE" });
        }

        if (!allowed.includes(role)) {
            return res.status(403).json({ message: "Forbidden", code: "INSUFFICIENT_ROLE" });
        }
        
        next();
    };
}
