// Netlify (AWS) Types
import { Handler, HandlerEvent } from '@netlify/functions';

// Helpers
import { urlHelper, urlObject } from '../utils/urlHelper';
import { messageHelper } from '../utils/messageHelper';
import { authHelper as authenticate } from '../utils/authHelper';

// Auth Functions
import signup from './signup';
import login from './login';
import logout from './logout';
import readUser from './readUser';

const handler: Handler = async (event: HandlerEvent) => {
  // 1. Create a new instance of URL Helper and destructure from it
  let ApiUrl = new urlHelper(event);
  const { endpoint }: urlObject = ApiUrl;

  // 2. Create an array of public endpoints
  let GuestLinks: string[] = ['signup', 'login'];
  // 3. Create an array of remaining whitelisted endpoints
  let whiteListLinks: string[] = ['logout','user'];
  // 4. Define an explicit "any" response
  let response: any;

  // 5. Loop through available endpoints and provide a default for any non-matching endpoints
  // 5a. Return response as the corresponding function for each endpoint
  switch (endpoint) {
    case 'signup':
      response = (event: HandlerEvent) => signup(event);
      break;
    case 'login':
      response = (event: HandlerEvent) => login(event);
      break;
    case 'logout':
      response = (event: HandlerEvent) => logout(event);
      break;
    case 'user':
      response = (event: HandlerEvent) => readUser(event);
      break;
    default:
      response = messageHelper('Invalid entry point', 404);
      break;
  }
  // 5b. If endpoint is public as defined in Guestlinks Array, return the response as is
  if (GuestLinks.includes(endpoint)) {
    return response(event);
  // 5c. Else if endpoint is whitelisted, authenticate the response
  } else if (whiteListLinks.includes(endpoint)) {
    return authenticate(event, response);
  }
  // 5d. Else return the response
  return response;
};

// Export time, follow Netlify TypeScript convention
export { handler };
