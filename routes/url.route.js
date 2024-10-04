const { Router } = require("express");
const { handleGenerateNewShortUrl, handleRedirectUrl, handleAnalytics, handleTesting } = require("../controllers/url.controller.js");


const router = Router();

router.route('/').get(handleGenerateNewShortUrl);
router.route('/re/:shortId').get(handleRedirectUrl);
router.route('/analytics/:shortId').get(handleAnalytics);
router.route('/test').get(handleTesting);


module.exports = router;