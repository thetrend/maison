import { Handler } from '@netlify/functions';
let urlHelper = require('../utils/urlHelper');
const handler: Handler = async (event) => {
  let ApiUrl = new urlHelper.ApiUrl(event);
  return {
    statusCode: 200,
    body: JSON.stringify({ segments: (ApiUrl.segments).filter(segment => segment !== ApiUrl.func), funcName: ApiUrl.func, endpoint: ApiUrl.endpoint })
  };
};

export { handler };
