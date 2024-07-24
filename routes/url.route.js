const { Router } = require("express");
const { handleGenerateNewShortUrl, handleRedirectUrl, handleAnalytics } = require("../controllers/url.controller.js");


const router = Router();

router.route('/').get(handleGenerateNewShortUrl);
router.route('/re/:shortId').get(handleRedirectUrl);
router.route('/analytics/:shortId').get(handleAnalytics);


module.exports = router;