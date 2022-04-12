// Netlify (AWS) Types
import { HandlerEvent, HandlerResponse } from '@netlify/functions';

// Project Types
import { FAUNA_COLLECTION_USERS } from '../types/faunaVars';

// Helpers
import { dbHelper } from '../utils/dbHelper';
import { messageHelper } from '../utils/messageHelper';

/**
 * @route       GET /api/auth/user
 * @access      private
 * @param       event 
 * @returns     HandlerResponse
 * @description Access the current user's public information
 */

const readUser = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Try/catch because async
  try {
    // 2. Define responseData for later use
    let responseData: object;

    // 3. Time to bring in the private fauna helper then destructure
    let fauna = new dbHelper();
    const { client, q } = fauna;

    // 4a. Only proceed if accessing this URL via GET method
    if (event.httpMethod === 'GET') {

      // 5a. Query: Identify current user
      await client.query(
        q.CurrentIdentity()
      )
      // 5b. Then:
      .then(async res => {
          // 6a. Query: Get the current user's public data
          await client.query(
            q.Get(
              q.Ref(
                q.Collection(FAUNA_COLLECTION_USERS),
                res.id
              )
            )
          // 6b. Then set responseData to the query's returned data
          ).then(res => {
            responseData = res.data;
          });
        })
        // 5c. Catch: Set responseData as error object
        .catch(err => {
          responseData = {
            name: err.name,
            description: err.description
          };
        });
    } else {
      // 4b. Otherwise scare the user lul TODO: logger function
      return messageHelper('Invalid access. Attempt has been logged.', 500);
    }
    // 7. Return HandlerResponse with responseData as body data
    return {
      statusCode: 200,
      body: JSON.stringify(responseData)
    };
  } catch (error) {
    console.log(error);
    return messageHelper('Server error.', 500);
  }
};

// 8. Do it live
export default readUser;
