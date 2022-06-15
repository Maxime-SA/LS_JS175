"use strict";

const HTML_START = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta char-set="utf-8" />
    <title>Loan Calculator</title>
    <style type="text/css">
      body {
        background: rgba(250, 250, 250);
        font-family: sans-serif;
        color: rgb(50, 50, 50);
      }

      article {
        width: 100%;
        max-width: 40rem;
        margin: 0 auto;
        padding: 1rem 2rem;
      }

      h1 {
        font-size: 2.5rem;
        text-align: center;
      }

      table {
        font-size: 2rem;
      }

      th {
        text-align: right;
      }

      a {
        font-size: 75%;
      }

      td {
        padding: 5px;
      }
    </style>
  </head>
  <body>
    <article>
      <h1>Loan Calculator</h1>
      <table>
        <tbody>`;

const HTML_END = `</tbody></table></article></body></html>`;

const HTTP = require('http');
const URL = require('url').URL;
const PORT = 3000;

function getParams(path) {
  const myURL = new URL(path, `http://localhost:${PORT}`);
  return myURL.searchParams;
}

function calculateLoanAmount(amount, duration, APR) {
  let monthlyInterest = ((1 + APR) ** (1 / 12)) - 1;
  return (amount / ((1 - ((1 + monthlyInterest) ** (-1 * duration))) / monthlyInterest)).toFixed(2);
}

function createLoanOffer(params) {
  const APR = 0.05;
  let amount = Number(params.get('amount'));
  let duration = Number(params.get('duration')) * 12;
  let monthlyPayment = calculateLoanAmount(amount, duration, APR);

  const HTML_MIDDLE = `<tr><th>Amount:</th><td><a href="/?amount=${amount - 100}&duration=${duration / 12}">- $100</a><td>$${amount}</td><td><a href="/?amount=${amount + 100}&duration=${duration / 12}">+ $100</a></td></tr>
    <tr><th>Duration:</th><td><a href="/?amount=${amount}&duration=${(duration / 12) - 1}">- 1 year</a></td><td>${duration / 12} years</td><td><a href="/?amount=${amount}&duration=${(duration / 12) + 1}">+ 1 year</a></td></tr>
    <tr><th>APR:</th><td colspan="3">${APR * 100}%</td></tr>
    <tr><th>Monthly Payment:</th><td colspan="3">$${monthlyPayment}</td></tr>`;

  return `${HTML_START}${HTML_MIDDLE}${HTML_END}`;
}

const SERVER = HTTP.createServer((req, res) => {
  let path = req.url;

  if (path === '/favicon.ico') {
    res.statusCode = 404;
    res.end();

  } else {
    let content = createLoanOffer(getParams(path));

    res.statusCode = 200;
    res.setHeader('Content-Type', 'text/html');
    res.write(`${content}\n`);
    res.end();
  }
});

SERVER.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}...`);
});