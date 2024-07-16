const router = require('express').Router()
const Controller = require('../controllers/Controller')

router.post("/google-login", Controller.googleLogin)

router.get("/login", Controller.login)

router.get("/callback", Controller.callback);

router.get("/refresh-token", Controller.refreshToken);

router.get("/generate-recommendations", Controller.generateRecommendations);

router.get("/logout", Controller.logout);

router.get("/profile/:id", Controller.readProfile)

router.put("/profile/:id", Controller.updateProfile)

router.get("/library/:id", Controller.readLibrary)

router.post("/add-to-library", Controller.addToLibrary)

router.delete("/remove-from-library/:id", Controller.deleteFromLibrary)

module.exports = router