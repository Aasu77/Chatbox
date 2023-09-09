const mongoose = require("mongoose")

const chatSchema = new mongoose.Schema({
    members: Array,
    lastMessage: String,
    lastSenderId: String
},{
    timestamps: true,
}
);

const chatModel = mongoose.model("Chat", chatSchema);

module.exports = chatModel;