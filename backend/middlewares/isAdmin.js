const isAdmin = (req, res, next) => {
  console.log(req.user); // This should log the user object

  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ message: "Access denied: Admins only" });
  }
};

module.exports = isAdmin;
