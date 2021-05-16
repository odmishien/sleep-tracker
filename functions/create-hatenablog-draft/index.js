const Blog = require('hatena-blog-api2').Blog;

const client = new Blog({
  type: 'oauth',
  userName: process.env.USERNAME,
  blogId: process.env.BLOG_ID,
  apiKey: process.env.API_KEY,
  consumerKey: process.env.CONSUMER_KEY,
  consumerSecret: process.env.CONSUMER_SECRET,
  accessToken: process.env.ACCESS_TOKEN,
  accessTokenSecret: process.env.ACCESS_TOKEN_SECRET,
});
// FIXME: now get 401
exports.handler = async (event) => {
  try {
    await client.postEntry({
      title: event['date'].replace(/-/g, ''),
      content: `合計睡眠時間: ${event['totalSleepTime']}\r\n深い睡眠時間: ${event['deepSleepTime']}\r\n浅い睡眠時間: ${event['shallowSleepTime']}\r\nレム睡眠時間: ${event['remSleepTime']}`,
      draft: true,
    });
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
