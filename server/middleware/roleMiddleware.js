const requireRole = (...allowedRoles) => {
  return (req, res, next) => {
    const userRole = req.user && req.user.role;

    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ message: "Access denied" });
    }

    return next();
  };
};

module.exports = { requireRole };
