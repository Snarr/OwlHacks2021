const { promisify } = require('util');
const cheerio = require('cheerio');
const { LastFmNode } = require('lastfm');
const tumblr = require('tumblr.js');
const { Octokit } = require('@octokit/rest');
const Twitter = require('twitter-lite');
const stripe = require('stripe')(process.env.STRIPE_SKEY);
const twilio = require('twilio')(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);
const paypal = require('paypal-rest-sdk');
const crypto = require('crypto');
const lob = require('lob')(process.env.LOB_KEY);
const ig = require('instagram-node').instagram();
const axios = require('axios');
const { google } = require('googleapis');
const Quickbooks = require('node-quickbooks');
const validator = require('validator');

Quickbooks.setOauthVersion('2.0');

/**
 * GET /api
 * List of API examples.
 */
exports.getApi = (req, res) => {
  res.render('api/index', {
    title: 'API Examples'
  });
};

/**
 * GET /api/scraping
 * Web scraping example using Cheerio library.
 */
exports.getScraping = (req, res, next) => {
  axios.get('https://news.ycombinator.com/')
    .then((response) => {
      const $ = cheerio.load(response.data);
      const links = [];
      $('.title a[href^="http"], a[href^="https"]').slice(1).each((index, element) => {
        links.push($(element));
      });
      res.render('api/scraping', {
        title: 'Web Scraping',
        links
      });
    })
    .catch((error) => next(error));
};

/**
 * GET /api/upload
 * File Upload API example.
 */

exports.getFileUpload = (req, res) => {
  res.render('api/upload', {
    title: 'File Upload'
  });
};

exports.postFileUpload = (req, res) => {
  req.flash('success', { msg: 'File was uploaded successfully.' });
  res.redirect('/api/upload');
};

exports.getGoogleDrive = (req, res) => {
  const token = req.user.tokens.find((token) => token.kind === 'google');
  const authObj = new google.auth.OAuth2({
    access_type: 'offline'
  });
  authObj.setCredentials({
    access_token: token.accessToken
  });

  const drive = google.drive({
    version: 'v3',
    auth: authObj
  });

  drive.files.list({
    fields: 'files(iconLink, webViewLink, name)'
  }, (err, response) => {
    if (err) return console.log(`The API returned an error: ${err}`);
    res.render('api/google-drive', {
      title: 'Google Drive API',
      files: response.data.files,
    });
  });
};

exports.getGoogleSheets = (req, res) => {
  const token = req.user.tokens.find((token) => token.kind === 'google');
  const authObj = new google.auth.OAuth2({
    access_type: 'offline'
  });
  authObj.setCredentials({
    access_token: token.accessToken
  });

  const sheets = google.sheets({
    version: 'v4',
    auth: authObj
  });

  const url = 'https://docs.google.com/spreadsheets/d/12gm6fRAp0bC8TB2vh7sSPT3V75Ug99JaA9L0PqiWS2s/edit#gid=0';
  const re = /spreadsheets\/d\/([a-zA-Z0-9-_]+)/;
  const id = url.match(re)[1];

  sheets.spreadsheets.values.get({
    spreadsheetId: id,
    range: 'Class Data!A1:F',
  }, (err, response) => {
    if (err) return console.log(`The API returned an error: ${err}`);
    res.render('api/google-sheets', {
      title: 'Google Sheets API',
      values: response.data.values,
    });
  });
};
