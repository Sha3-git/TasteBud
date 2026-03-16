const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const {
    registerUser,
    loginUser,
    verifyEmail,
    refreshToken,
    resendVerificationEmail,
    checkVerificationStatus
} = require("../controllers/authController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/refresh", refreshToken);
router.post("/resend-verification", resendVerificationEmail);
router.post("/check-verification", checkVerificationStatus);


/*router.get("/", auth, (req, res) => {
    res.json({ message: "Authorized!", userId: req.user });
});*/

module.exports = router;
