// Netlify (AWS) Types
import { HandlerEvent, HandlerResponse } from '@netlify/functions';

// Import NPM dependencies
import jwt from 'jsonwebtoken';

// Project types
import { FAUNA_INDEX_USERS_EMAIL } from '../types/faunaVars';
import { LoginUser } from '../types/authTypes';

// Helpers
import { dbHelper } from '../utils/dbHelper';
import { messageHelper } from '../utils/messageHelper';

/**
 * @route       POST /api/auth/login
 * @access      public
 * @param       event 
 * @returns     HandlerResponse
 * @description 
 * @todo        same as signup | move types
 */

const login = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Try/catch because async
  try {
    // 1a. Only proceed if accessing this URL via POST method
    if (event.httpMethod === 'POST') {
      // 2. Destructure post data from event.body
      let { email, password }: LoginUser = JSON.parse(event.body);

      // 3. Time to bring in the public fauna helper then destructure (dbHelper set to false)
      let fauna = new dbHelper(false);
      const { client, q } = fauna;

      // 4. Declare responseData, which will take in the result of the below Fauna query
      let responseData: string;
      let statusCode: number = 400 | 200;

      // 5a. Query: Login user using credentials
      await client.query(
        q.Login(
          q.Match(
            q.Index(FAUNA_INDEX_USERS_EMAIL),
            email
          ),
          {
            password: password
          }
        )
      )
      // 5b. Then set variables as...
        .then(res => { responseData = res.secret; statusCode = 200; })
      // 5c. Or set variables as...
        .catch(err => { responseData = err.message; statusCode = 400; })
      // 5d. Finally, return the message helper with responseData and statusCode
        .finally(() => {
          if (statusCode === 400) {
            return messageHelper('Login failed', statusCode);
          }
        });

      // 6. Sign the JWT
      process.env['TOKEN'] = jwt.sign({ faunaSecret: responseData }, process.env['NETLIFY_JWT_SECRET'], { expiresIn: '1h' });
      // 7. Set the Auth Secret to the responseData
      process.env['AUTH_SECRET'] = responseData;
      // 8. Return a HandlerResponse object
      return {
        statusCode: 200,
        body: JSON.stringify({ isAuthenticated: true })
      };
    } else {
      // 1b. Otherwise scare the user lul TODO: logger function
      return messageHelper('Invalid access. Attempt has been logged.', 500);
    }
  } catch (error) {
    console.log(error);
    return messageHelper('Server error.', 500);
  }
};

// 9. Do it live
export default login;
