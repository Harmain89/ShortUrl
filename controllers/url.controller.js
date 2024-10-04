const shortid = require('shortid');
const URL = require('../models/url.model.js');

const handleGenerateNewShortUrl = async (req, res) => {

    const body = req.body;
    if(!body.url) return res.status(400).json({ error: 'Url is required.' })

    const shortId = shortid();

    await URL.create({
        shortId,
        redirectUrl: body.url,
        visitHistory: []
    });

    res.status(200).json({
        shortId: shortId
    })

}

const handleRedirectUrl = async (req, res) => {

    try {
        
        const { shortId } = req.params;
        
        const updated = await URL.findOneAndUpdate(
            {
                shortId: shortId
            },
            {
                $push: {
                    visitHistory: Date.now()
                }
            }
        )

        if(!updated) {
            res.status(404).json({
                error: 'Shorten Url not found'
            })
        }

        res.redirect(updated.redirectUrl)
        // res.status(201).json(updated)
    } catch (error) {
        console.log(error.message);
    }
}

const handleAnalytics = async (req, res) => {

    try {
        
        const { shortId } = req.params;

        const findUrl = await URL.find({
            shortId: shortId
        })

        if(!findUrl) {
            res.status(404).json({
                error: 'Shorten Url not found'
            })
        }
        
        const historyCounts = await URL.aggregate([
            {
                $match: {
                    shortId: shortId
                }
            },
            {
                $project: {
                    _id: 0,
                    redirectUrl: 1,
                    visits: {
                        $size: "$visitHistory"
                    }
                }
            }
        ])

        // console.log(historyCounts[0].visitHistory);

        res.status(200).json({
            // visitHistory: historyCounts[0].visitHistory > 0 ? historyCounts[0].visitHistory : 0
            visitHistory: historyCounts
        })

        // res.status(201).json(historyCounts)
    } catch (error) {
        console.log(error.message);
    }
}

const handleTesting = async(req, res) => {
    const urls = await URL.find({});
    // return res.send(urls);
    return res.end(
        `
        <!DOCTYPE html>
        <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Document</title>
            </head>
            <body>
                <ol>
                    ${urls.map((url) => `<li>${url?.shortId} - ${url?.redirectUrl} - ${url?.visitHistory.length}</li>`).join("")}
                </ol>
            </body>
        </html>
        `
    );
}


module.exports = {
    handleGenerateNewShortUrl,
    handleRedirectUrl,
    handleAnalytics,
    handleTesting
}