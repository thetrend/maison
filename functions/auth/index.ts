import { Handler } from '@netlify/functions';
let urlHelper = require('../utils/urlHelper');

const handler: Handler = async (event) => {
  let ApiUrl = new urlHelper.ApiUrl(event);

  const { path, segments, func, endpoint } = ApiUrl;

  return {
    statusCode: 200,
    body: JSON.stringify({ segments: segments.filter(segment => segment !== func), funcName: func, endpoint, path })
  };
};

export { handler };
