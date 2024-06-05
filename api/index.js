require('dotenv').config();

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const url = 'https://api.telegram.org/bot';
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
    if (!message) {
        res.send('Nạp tiền không thành công');
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

    console.log(req?.body);
    await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
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
