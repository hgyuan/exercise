const test = require('ava');
const {statement,statementByHtml} = require('../src/statement');

test('test should earned 0 credits when statement given empty performances', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': []
  };
  const plays = [];

  const result = statement(invoice, plays);

  t.is(result, 'Statement for richard\n' +
    'Amount owed is $0.00\n' +
    'You earned 0 credits \n');
});

test('test should throw undefined when statement given performances and empty plays', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      }
    ]
  };
  const plays = [];

  try{
    statement(invoice, plays);
    t.fail();
  }catch (e) {
    t.is(e.measure,undefined);
  }
});

test('test should throw undefined when statement given performances with play type no in plays', t => {
  const plays = {
    'othello': {
      'name': 'Othello',
      'type': 'tragedy1',
    },
  };
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'othello',
        'audience': 40,
      },
    ],
  };



  try {
    statement(invoice, plays);
    t.fail();
  }
  catch (e) {
    t.is(e.message, 'unknown type: tragedy1');
  }
});

test('test should earned 25 credits when statement given performances with play type is tragedy and audience > 30', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      }
    ]
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for richard\n' +
    ' Hamlet: $650.00 (55 seats)\n' +
    'Amount owed is $650.00\n' +
    'You earned 25 credits \n');
});

test('test should earned 0 credits when statement given performances with play type is tragedy and audience < 30', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 29,
      }
    ]
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for richard\n' +
    ' Hamlet: $400.00 (29 seats)\n' +
    'Amount owed is $400.00\n' +
    'You earned 0 credits \n');
});

test('test should earned 5 credits when statement given performances with play type is comedy and audience > 20', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 29,
      }
    ]
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for richard\n' +
    ' As You Like It: $532.00 (29 seats)\n' +
    'Amount owed is $532.00\n' +
    'You earned 5 credits \n');
});

test('test should earned 2 credits when statement given performances with play type is comedy and audience < 20', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 10,
      }
    ]
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for richard\n' +
    ' As You Like It: $330.00 (10 seats)\n' +
    'Amount owed is $330.00\n' +
    'You earned 2 credits \n');
});

test('test should earned 2 credits when statement given performances with play type is comedy and audience < 20 and play type is tragedy and audience < 30', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 10,
      },
      {
        'playID': 'hamlet',
        'audience': 10,
      }
    ]
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for richard\n' +
    ' As You Like It: $330.00 (10 seats)\n' +
    ' Hamlet: $400.00 (10 seats)\n' +
    'Amount owed is $730.00\n' +
    'You earned 2 credits \n');
});

test('test should earned 28 credits when statement given performances with play type is comedy and audience > 20 and play type is tragedy and audience > 30', t => {
  //given
  const invoice = {
    'customer': 'richard',
    'performances': [
      {
        'playID': 'as-like',
        'audience': 40,
      },
      {
        'playID': 'hamlet',
        'audience': 40,
      }
    ]
  };

  const result = statement(invoice, plays);

  t.is(result, 'Statement for richard\n' +
    ' As You Like It: $620.00 (40 seats)\n' +
    ' Hamlet: $500.00 (40 seats)\n' +
    'Amount owed is $1,120.00\n' +
    'You earned 28 credits \n');
});

test('test should earned 47 credits by html layout when statement given performances with play type is hamlet and audience = 55 and play type is othello and audience = 40 and play type is as-like and audience = 35 ', t => {
  //given
  const invoice = {
    'customer': 'BigCo',
    'performances': [
      {
        'playID': 'hamlet',
        'audience': 55,
      },
      {
        'playID': 'as-like',
        'audience': 35,
      },
      {
        'playID': 'othello',
        'audience': 40,
      }
    ]
  };

  const result = statementByHtml(invoice, plays,"html");

  t.is(result, '<h1>Statement for BigCo</h1>\n' +
    '<table>\n' +
    '<tr><th>play</th><th>seats</th><th>cost</th></tr>' +
    ' <tr><td>Hamlet</td><td>55</td><td>$650.00</td></tr>\n' +
    ' <tr><td>As You Like It</td><td>35</td><td>$580.00</td></tr>\n' +
    ' <tr><td>Othello</td><td>40</td><td>$500.00</td></tr>\n' +
    '</table>\n' +
    '<p>Amount owed is <em>$1,730.00</em></p>\n' +
    '<p>You earned <em>47</em> credits</p>\n');

});


const plays = {
  'hamlet': {
    'name': 'Hamlet',
    'type': 'tragedy',
  },
  'as-like': {
    'name': 'As You Like It',
    'type': 'comedy',
  },
  'othello': {
    'name': 'Othello',
    'type': 'tragedy',
  },
};