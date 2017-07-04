module.exports = {
  expected: {
    members: [
      'date',
      'messages',
      'parameters',
      'parameters.0',
      'parameters.1',
      'text',
      'timestamp',
    ]
  },
  object: {
    date: new Date(),
    messages: [
      'message1',
      'message2',
    ],
    parameters: {
      '0': [1, 2, 3, 4, 5],
      '1': 'test',
    },
    text: 'The quick brown fox jumped over the moon.',
    timestamp: Date.now(),
  }
}
