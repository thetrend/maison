// Netlify (AWS) Functions
import { HandlerResponse } from '@netlify/functions';

// Import NPM dependencies
import jwt from 'jsonwebtoken';

// Helpers
import { messageHelper } from './messageHelper';

/**
 * @function      authHelper(event:HandlerEvent,response:HandlerResponse)
 * @description   Helper function to modify headers once user is authorized
 * @returns       {HandlerResponse}
 */

export const authHelper = async (event, response) => {
  // 1. Define responseData
  let responseData: HandlerResponse;
  // 2. Define hashedToken (saved to environment during Login process)
  let hashedToken: string = process.env['TOKEN'];

  // 3. Attempt to verify JWT
  await jwt.verify(hashedToken, process.env['NETLIFY_JWT_SECRET'], (err) => {
    // 4a. Gatekeeping: don't even return the authenticated page if the user is unauthorized
    //     Instead, just define responseData as a messageHelper
    if (err) {
      responseData = messageHelper('Unauthorized: Please login.');
    } else {
    // 4b. Else set event headers to include the hashedToken (JWT)
      event.headers = {
        ...event.headers,
        "Authorization": `Bearer ${hashedToken}`,
      }
    // 4c. Define responseData as the response function defined in the main auth handler
    //     while passing event to that function
      responseData = response(event);
    }
  });
  // 5. Return
  return responseData;
};
