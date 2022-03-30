import { Handler } from '@netlify/functions';
let url = require('../utils/urlHelper');

const handler: Handler = async (event) => {
  let ApiUrl = new url.urlHelper(event);

  const { path, segments, func, endpoint } = ApiUrl;

  return {
    statusCode: 200,
    body: JSON.stringify({ segments, func, endpoint, path })
  };
};

export { handler };
