import { Handler } from '@netlify/functions';

// Helpers
import urlHelper, { urlObject } from '../utils/urlHelper';
import messageHelper from '../utils/messageHelper';

// Auth Functions
import signup from './signup';

const handler: Handler = async (event, context, callback) => {
  let ApiUrl = new urlHelper(event);
  const { endpoint }: urlObject = ApiUrl;

  try {
    switch (endpoint) {
      case 'signup':
        return signup(event);
      case 'login':
      case 'logout':
        return messageHelper(endpoint);
    }
  } catch (error) {
    callback(null, error);
  }
};

export { handler };
