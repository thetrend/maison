import { Handler } from '@netlify/functions';
import urlHelper, { urlObject } from '../utils/urlHelper';
import message from '../utils/messageHelper';

const handler: Handler = async (event) => {
  let ApiUrl = new urlHelper(event);
  const { endpoint }: urlObject = ApiUrl;
  
  switch (endpoint) {
    case 'signup':
    case 'login':
    case 'logout':
      return message(endpoint);
    default:
      return message('Server Error', 500);
  }
};

export { handler };
