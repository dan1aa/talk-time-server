const axios = require('axios');
const qs = require('qs');
require('dotenv').config()
const { MAIL_CLIENT_ID, MAIL_CLIENT_SECRET, MAIL_REFRESH_TOKEN } = process.env;

class GmailApi {
    getAccessToken = async () => {
        let data = qs.stringify({
            'client_id': MAIL_CLIENT_ID,
            'client_secret': MAIL_CLIENT_SECRET,
            'refresh_token': MAIL_REFRESH_TOKEN,
            'grant_type': 'refresh_token'
        });
        const AUTH_CONFIG = {
            method: 'post',
            url: 'https://accounts.google.com/o/oauth2/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            data: data
        };

        let accessToken = '';

        await axios(AUTH_CONFIG)
            .then(async function (response) {
                accessToken = await response.data.access_token;
            })
            .catch(function (error) {
                console.log(error);
            });

        return accessToken;
    }


    searchGmail = async (searchItem) => {
        let READ_CONFIG = {
            method: 'get',
            url: `https://www.googleapis.com/gmail/v1/users/me/messages?q=${searchItem}`,
            headers: {
                Authorization: `Bearer ${await this.getAccessToken()}`
            }
        };

        let allIds = '';

        await axios(READ_CONFIG)
            .then(async response => {
                allIds = await response.data["messages"];
            })
            .catch(error => {
                console.log(error)
            })

            return allIds;
    }

    readGmailContent = async (messageId) => {
         let READ_TEXT_CONFIG = {
            method: 'GET',
            url: `https://gmail.googleapis.com/gmail/v1/users/me/messages/${messageId}`,
            headers: {
                Authorization: `Bearer ${await this.getAccessToken()}`
            }
         }

         let data = {}

         await axios(READ_TEXT_CONFIG)
         .then(async response => {
            data = await response.data;
         })
         .catch(err => {
            throw new Error(err)
         })

         return data;
    }

}

module.exports = new GmailApi()