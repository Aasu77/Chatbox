const chatModel = require("../Models/chatModel");
const messageModel = require("../Models/messageModel");

//createMessage

const createMessage = async (req, res) => {
  const { chatId, senderId, text } = req.body;

  const message = new messageModel({
    chatId,
    senderId,
    text,
  });

  const chat = await chatModel.findById(chatId);
  chat.lastMessage = text;
  chat.lastSenderId = senderId;
  await chat.save();

  try {
    const response = await message.save();
    res.status(200).json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json(error);
  }
};

//getMessage
const getMessages = async(req, res)=>{
    const{ chatId } = req.params;

    try {
        const messages = await messageModel.find({ chatId });
        res.status(200).json(messages);
      } catch (error) {
        console.log(error);
        res.status(500).json(error);
      }
};

module.exports = {createMessage, getMessages};