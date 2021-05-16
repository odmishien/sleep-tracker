const axios = require('axios');
const qs = require('querystring');

const LINE_NOTIFY_API_URL = 'https://notify-api.line.me/api/notify';
const LINE_NOTIFY_TOKENS = process.env.LINE_NOTIFY_TOKENS.split(',');
exports.handler = async (event) => {
  for (let i = 0; i < LINE_NOTIFY_TOKENS.length; i++) {
    let params = {
      url: LINE_NOTIFY_API_URL,
      method: 'post',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${LINE_NOTIFY_TOKENS[i]}`,
      },
      data: qs.stringify({
        message: `\r\n合計睡眠時間: ${event['totalSleepTime']}\r\n深い睡眠時間: ${event['deepSleepTime']}\r\n浅い睡眠時間: ${event['shallowSleepTime']}\r\nレム睡眠時間: ${event['remSleepTime']}`,
      }),
    };
    try {
      const res = await axios(params);
    } catch (e) {
      console.log('error!');
      return {
        statusCode: e.statusCode,
        body: e.message,
      };
    }
  }
  // TODO: use Promise.all
  return {
    statusCode: 200,
    body: 'OK!',
  };
};
