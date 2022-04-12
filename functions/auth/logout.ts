// Netlify (AWS) Types
import { HandlerEvent, HandlerResponse } from '@netlify/functions';

// Helpers
import { dbHelper } from '../utils/dbHelper';
import { messageHelper } from '../utils/messageHelper';

/**
 * @route       GET /api/auth/logout
 * @access      private
 * @param       event
 * @returns     HandlerResponse
 * @description Logs out the currently authenticated user and deletes the associated
 *              process environment variables.
 */

const logout = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Try/catch because async
  try {
    // 1. Define responseData outside of the if statement below
    let responseData: boolean | object;
    // 2a. Only proceed if accessing this URL via GET method
    if (event.httpMethod === 'GET') {
      // 3. Time to bring in the private fauna helper then destructure
      const { client, q } = new dbHelper();

      // 4a. Query: Logout the authenticated user
      await client.query(
        q.Logout(false)
      )
      // 4b. Then set responseData and delete the appropriate environment variables
        .then(res => {
          responseData = res;
          delete process.env['TOKEN'];
          delete process.env['AUTH_SECRET'];
        })
      // 4c. Or set responseData as...
        .catch(err => {
          responseData = {
            name: err.name,
            description: err.description
          };
        });
    } else {
    // 2b. Otherwise scare the user lul TODO: logger function
      return messageHelper('Invalid access. Attempt has been logged.', 500);
    }
    // 5. Define response depending on the type of responseData
    let response = (typeof responseData === 'boolean') ? { isAuthenticated: !responseData } : responseData;

    // 6. Return HandlerResponse with response as the body
    return {
      statusCode: 200,
      body: JSON.stringify(response)
    };
  } catch (error) {
    console.log(error);
    return messageHelper('Server error.', 500);
  }
};

// 7. Do it live
export default logout;
