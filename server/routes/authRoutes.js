const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
    registerUser,
    loginUser,
    verifyEmail,
    refreshToken
} = require("../controllers/authController");

router.post("/register", registerUser);
router.get("/verify", verifyEmail);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);


/*router.get("/", auth, (req, res) => {
    res.json({ message: "Authorized!", userId: req.user });
});*/

module.exports = router;
