const { default: mongoose, Schema } = require("mongoose");


const urlSchema = new Schema({
    shortId: {
        type: String,
        required: true,
        unique: true
    },
    redirectUrl: {
        type: String,
        required: true
    },
    visitHistory: [
        {
            type: String
        }
    ]
}, { timestamps: true });


const URL = mongoose.model('URL', urlSchema);

module.exports = URL;