require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const telegramApiUrl = `https://api.telegram.org/bot${process.env.BOT_TOKEN}`;
const cors = require('cors');
app.use(bodyParser.json());
app.use(cors());
app.use(express.static('public'));

app.get('/', function (req, res) {
    res.json({
        BOT_TOKEN: process.env.BOT_TOKEN,
        CHAT_ID: process.env.CHAT_ID,
    });
});

app.post('/', async (req, res) => {



    let message = req?.body?.message?.text;
    let chat_id = req?.body?.message?.chat?.id
    if (!message) {
        res.send('Lấy message không thành công');
        return;
    }

    if (!chat_id) {
        res.send('Lấy group_id không thành công');
        return;
    }

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
                { text: 'Tygia.Vn', url: 'https://tygia.vn' }
            ]
        ]
    };

    await axios.post(`${telegramApiUrl}/sendMessage`,
        {
            chat_id: chat_id,
            text: 'Helo from server Test',
            reply_markup: JSON.stringify(keyboard)
        })
        .then((response) => {
            console.log('Message posted');
        })
    res.status(200).send(req.body);
});




app.listen(8000, () => console.log('Server ready on port 8000.'));

module.exports = app;

// https://api.telegram.org/bot7474830816:AAFm_wrTSYJBEdzckyfs2fPNHrbFoBulKF0/setWebHook?url=https://051d-118-70-118-5.ngrok-free.app