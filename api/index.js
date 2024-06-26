require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Thay thế 'YOUR_TELEGRAM_BOT_TOKEN' bằng token của bot của bạn
const token = process.env.TELEGRAM_BOT_TOKEN;
const telegramApiUrl = `https://api.telegram.org/bot${token}`;

const URL_TEST = 'https://23b8-42-118-79-54.ngrok-free.app'
// Tạo ứng dụng Express
const app = express();
app.use(bodyParser.json());
const keyboard = {
    inline_keyboard: [
        [
            { text: 'Tỷ giá JPY', callback_data: 'tygia_jpy' },
            { text: 'Giá DCOM', callback_data: 'gia_dcom' },
            { text: 'Vietcombank', callback_data: 'vietcombank' }
        ],
        [
            { text: 'Giá Coin', callback_data: 'gia_coin' },
            { text: 'Binance P2P', callback_data: 'binance_p2p' },
            // { text: 'Tygia.Vn', url: 'https://tygia.vn' }
        ]
    ]
};

// Hàm để gửi tin nhắn với các button
const sendStartMessage = async (chatId) => {
    const message = 'Please choose:';


    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        reply_markup: JSON.stringify(keyboard)
    });
};


// Hàm cham cong
const sendMessageChamCong = async (data) => {

    console.log(data)
    const message = `${data.from.first_name} ${data.from.last_name || ''} đã chấm công`;
    const chatId = data.chat.id

    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        reply_markup: JSON.stringify(keyboard)
    });
};


// Hàm để gửi tin nhắn tỷ giá JPY
const sendTygiaJpyMessage = async (chatId) => {
    const rate = 110; // Ví dụ tỷ giá
    const message = `Tỷ giá hiện tại của JPY: ${rate} VND`;
    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
        reply_markup: JSON.stringify(keyboard)
    });
};

// Hàm để gửi giá DCOM
const sendGiaDcomMessage = async (chatId) => {
    const price = 200000; // Ví dụ giá
    const message = `Giá hiện tại của DCOM: ${price} VND`;
    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message
    });
};

// Hàm để gửi giá Vietcombank
const sendVietcombankMessage = async (chatId) => {
    const info = "Thông tin Vietcombank..."; // Ví dụ thông tin
    const message = `Thông tin Vietcombank: ${info}`;
    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message
    });
};

// Hàm để gửi giá Coin
const sendGiaCoinMessage = async (chatId) => {
    const price = 50000; // Ví dụ giá
    const message = `Giá hiện tại của Coin: ${price} VND`;
    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message
    });
};

// Hàm để xử lý các cập nhật từ Telegram
const processUpdate = async (update) => {

    let textUpdate = update?.message?.text || ''
    
    console.log(update.message)
    if (update.message && update.message.text === '/start') {
        await sendStartMessage(update.message.chat.id);
    }
    if (update.message && textUpdate.includes('/chamcong')) {
        await sendMessageChamCong(update.message)
    }
    else if (update.callback_query) {
        const chatId = update.callback_query.message.chat.id;
        const data = update.callback_query.data;

        if (data === 'tygia_jpy') {
            await sendTygiaJpyMessage(chatId);
        } else if (data === 'gia_dcom') {
            await sendGiaDcomMessage(chatId);
        } else if (data === 'vietcombank') {
            await sendVietcombankMessage(chatId);
        } else if (data === 'gia_coin') {
            await sendGiaCoinMessage(chatId);
        } else if (data === 'binance_p2p') {
            // Xử lý callback cho Binance P2P nếu cần
        }
    }
};

// Endpoint để Telegram gửi các cập nhật
app.post(`/api/${token}`, (req, res) => {
    const update = req.body;
    processUpdate(update);
    res.send(`WelcomeWelcome to Telegram Bot! ${JSON.stringify(update)}`);
});

// Thiết lập webhook
const setWebhook = async () => {
    const url = `${URL_TEST}/api/${token}`
    // const url = `https://exchange-rate-eight.vercel.app/api/${token}`; //  URL của ứng dụng Express
    let setWebhooks = await axios.get(`${telegramApiUrl}/setWebhook?url=${url}`,);

};

// Khởi động máy chủ Express
const port = process.env.PORT || 8000;
app.listen(port, async () => {
    console.log(`Server is running on port ${port}`);
    await setWebhook();
});

module.exports = app;
