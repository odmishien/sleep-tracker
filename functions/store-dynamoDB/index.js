exports.handler = async (event) => {
  var AWS = require('aws-sdk');

  var ddb = new AWS.DynamoDB.DocumentClient({ region: 'ap-northeast-1' });
  var params = {
    TableName: 'sleepTime',
    Item: {
      totalSleepTime: event['totalSleepTime'],
      deepSleepTime: event['deepSleepTime'],
      shallowSleepTime: event['shallowSleepTime'],
      remSleepTime: event['remSleepTime'],
      awakeTime: event['awakeTime'],
      createdAt: event['date'],
    },
  };

  try {
    await ddb.put(params).promise();
    return {
      statusCode: 200,
      body: 'OK!',
    };
  } catch (error) {
    return {
      statusCode: error.statusCode,
      body: error.message,
    };
  }
};
