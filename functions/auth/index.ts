import { Handler } from '@netlify/functions';
import urlHelper, { urlObject } from '../utils/urlHelper';

const handler: Handler = async (event) => {
  let ApiUrl = new urlHelper(event);
  const { path, segments, func, endpoint }: urlObject = ApiUrl;

  return {
    statusCode: 200,
    body: JSON.stringify({ segments, func, endpoint, path })
  };
};

export { handler };
