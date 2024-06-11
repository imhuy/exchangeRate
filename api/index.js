require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

// Thay thế 'YOUR_TELEGRAM_BOT_TOKEN' bằng token của bot của bạn
const token = process.env.TELEGRAM_BOT_TOKEN;
const telegramApiUrl = `https://api.telegram.org/bot${token}`;

const URL_TEST = 'https://c4b6-2405-4802-4909-a3a0-71c7-5a8a-c425-b044.ngrok-free.app'


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

// Hàm để gửi tin nhắn 
const sendStartMessage = async (chatId) => {
    const message = 'Hello girl';
    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text: message,
    });
};

// Hàm để xử lý các cập nhật từ Telegram
const processUpdate = async (update) => {

    let textUpdate = update?.message?.text || ''
    let chatId = update?.message?.chat?.id

    console.log('processUpdate',update)

    if (update.callback_query) {
        const chatId = update.callback_query.message.chat.id;
        const data = update.callback_query.data;
        await sendMessageGetPrice(chatId, data)
        return;
    }

    if (update.message && update.message.text === '/start') {
        await sendStartMessage(update.message.chat.id);
        return;
    }

    if (update.message && textUpdate.includes('/check')) {
        await sendMessageCheckToken(chatId, textUpdate)
        return;
    }

    if (update.message && textUpdate.includes('/price')) {
        await sendMessageGetPrice(chatId, textUpdate)
        return;
    }
    
};

// Endpoint để Telegram gửi các cập nhật
app.post(`/api/${token}`, (req, res) => {
    const update = req.body;
    processUpdate(update);
    res.send(`WelcomeWelcome to Telegram Bot! ${JSON.stringify(update)}`);
});

// hàm send message 
const sendMessage = async (chatId, message, returnKeyboard = null) => {

    console.log('returnKeyboard',returnKeyboard)
    const keyboard = returnKeyboard ?  {
        inline_keyboard: returnKeyboard.map(element => {
            return [{
                text: `${element.symbol} - ${element.name}`, callback_data:`/price ${element.id}`,
            }]
        })
    }: null ;
    console.log('sendMessage',keyboard)
    await axios.post(`${telegramApiUrl}/sendMessage`, {
        chat_id: chatId,
        text:  message,
        reply_markup: keyboard ? JSON.stringify(keyboard) : ''
    });
}

// -----

// Hàm check giá token

const sendMessageGetPrice = async (chatId, messageUpdate) => {
    let message = 'hi'
    let tokenId = messageUpdate?.split(' ')[1]
    // # URL của CoinGecko API
    let url = 'https://api.coingecko.com/api/v3/simple/price'

    // # Tham số truy vấn
    let params = {
        'ids': tokenId,  
        'vs_currencies': 'usd'  
    }

    axios.get(url, { params })
        .then(response => {
            if (response.status === 200) {
                const data = response.data;
                const price = data[tokenId].usd;
                message = `Giá hiện tại của ${tokenId}: $${price}`
                sendMessage(chatId, message)
            } else {
                message = `Yêu cầu thất bại với mã lỗi: ${response.status}`
                sendMessage(chatId, message)
            }
        })
            .catch(error => {
                message = `Lỗi khi gửi yêu cầu: ${error.message}`;
                sendMessage(chatId, message)
        });
}

const sendMessageCheckToken = async (chatId, data) => {
    console.log("sendMessageCheckToken",data)

    let tokenCheck = data?.split(' ')[1]

    await getFullTokenName(tokenCheck,chatId)

};

const getFullTokenName = async (tokenCode, chatId) => {
    
    console.log('getFullTokenName',chatId)
    // URL của CoinGecko API để lấy danh sách coin
    const url = 'https://api.coingecko.com/api/v3/coins/list';

    // Gửi yêu cầu GET để lấy danh sách coin
    axios.get(url)
        .then(  response => {
            if (response.status === 200) {
                const coins = response.data;
                const tokenName = coins.filter(coin => coin.symbol === tokenCode);
                if (!tokenName) {
                    console.log(`Không tìm thấy coin với mã ${tokenCode}.`);
                    return;
                }
                if (tokenName.length === 1) {
                    sendMessageGetPrice(chatId,`/price ${tokenName[0].id}`)
                } else if (tokenName.length >= 1) {
                     sendMessage(chatId,'Chose your token',tokenName)
                }
            } else {
                console.log(`Yêu cầu thất bại với mã lỗi: ${response.status}`);
            }
        })
        .catch(error => {
            console.error(`Lỗi khi gửi yêu cầu: ${error.message}`);
        });
}


module.exports = app;
