const {getPrintOrderModel} = require('../src/printOrderModel');
const {getPrintAmountOwedAndEarnedModel} = require('../src/printAmountOwedAndEarnedModel');
const {getPrintStatementModel} = require('../src/printStatementModel');


function calculateAmount(play, perf) {
  let thisAmount = 0;
  switch (play.type) {
    case 'tragedy':
      thisAmount = 40000;
      if (perf.audience > 30) {
        thisAmount += 1000 * (perf.audience - 30);
      }
      break;
    case 'comedy':
      thisAmount = 30000;
      if (perf.audience > 20) {
        thisAmount += 10000 + 500 * (perf.audience - 20);
      }
      thisAmount += 300 * perf.audience;
      break;
    default:
      throw new Error(`unknown type: ${play.type}`);
  }
  return thisAmount;
}

function addCredits(volumeCredits, perf, play) {
  // add volume credits
  volumeCredits += Math.max(perf.audience - 30, 0);
  // add extra credit for every ten comedy attendees
  if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
  return volumeCredits;
}

function printOrder(result, play, format, thisAmount, perf, type) {
  return result = getPrintOrderModel(type, result, play, format, thisAmount, perf);
}

function printAmountOwedAndEarned(result, format, totalAmount, volumeCredits, type) {
  return getPrintAmountOwedAndEarnedModel(type, result, format, totalAmount, volumeCredits);
}

function formatNumberWithMinimumFractionDigitsOf2() {
  const format = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format;
  return format;
}

function printStatement(invoice,result, type) {
  return getPrintStatementModel(type,result, invoice);
}

function statementByCondition(invoice, plays, type) {
  let totalAmount = 0;
  let volumeCredits = 0;
  let result = "";
  result = printStatement(invoice,result, type);
  const format = formatNumberWithMinimumFractionDigitsOf2();
  for (let perf of invoice.performances) {
    const play = plays[perf.playID];
    let thisAmount = calculateAmount(play, perf);
    volumeCredits = addCredits(volumeCredits, perf, play);
    result = printOrder(result, play, format, thisAmount, perf, type);
    totalAmount += thisAmount;
  }
  result = printAmountOwedAndEarned(result, format, totalAmount, volumeCredits, type);
  return result;
}

function statement(invoice, plays) {
  return statementByCondition(invoice, plays, "txt");
}

function statementByHtml(invoice, plays) {
  return statementByCondition(invoice, plays, "html");
}

module.exports = {
  statement,
  statementByHtml
};
