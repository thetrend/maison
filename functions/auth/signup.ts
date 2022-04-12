// Netlify (AWS) Types
import { HandlerEvent, HandlerResponse } from '@netlify/functions';

// Import NPM dependencies
import validator from 'validator';

// Project types
import { FAUNA_COLLECTION_USERS, FAUNA_INDEX_USERS_EMAIL } from '../types/faunaVars';
import { NewUser } from '../types/authTypes';

// Helpers
import { dbHelper } from '../utils/dbHelper';
import { messageHelper } from '../utils/messageHelper';

/**
 * @route       POST /api/auth/signup
 * @access      public
 * @param       event 
 * @returns     HandlerResponse
 * @description 
 * @todo        write the description lul | create the logger helper | move types
 */

const signup = async (event: HandlerEvent): Promise<HandlerResponse> => {
  // Try/catch because async
  try {
    // 1a. Only proceed if accessing this URL via POST method
    if (event.httpMethod === 'POST') {
      // 2. Destructure post data from event.body
      let { email, username, password, verifiedPassword }: NewUser = JSON.parse(event.body);

      // 3. Create an empty Errors array for use later
      let errorsArray: object[] = [];

      // 4. Create an array from the string of whitelisted emails
      const whitelistEmails: string[] = (process.env['FAUNADB_AUTHORIZED_USERS'])?.split(',');

      // 5a. Validate email and return an object to add to errorsArray if there are any problems
      if (!email) {
        errorsArray.push({ emailError: 'Email address is required.' });
      } else {
        if (!whitelistEmails.includes(email.toLowerCase())) {
          errorsArray.push({ emailError: 'You are not an authorized user.' });
        }
      }

      // 5b. Validate username and do the same
      if (!username) {
        errorsArray.push({ usernameError: 'Username is required.' });
      } else {
        // Minimum length requirement and validate username against regexp
        if (username.length < 2 || !validator.matches(username, /^[0-9a-zA-Z_-\s]+$/)) {
          errorsArray.push({ usernameError: 'Username must be at least 2 characters long and can only contain letters, numbers, underscores, hyphens, and spaces.' });
        }
      }

      // 5c. Validate password and do the same
      if (!password) {
        errorsArray.push({ passwordError: 'Password is required.' });
      } else {
        if (!validator.isStrongPassword(password)) {
          // See https://www.npmjs.com/package/validator for minimum requirements
          errorsArray.push({ passwordError: 'Password is too weak. See minimum requirements.' });
        }
      }

      // 5d. Validate verifiedPassword and do the same
      if (!verifiedPassword || verifiedPassword !== password) {
        errorsArray.push({ verifyPWError: 'Passwords do not match.' });
      }

      // 6. Now check if errorsArray is not empty and return it
      if (errorsArray.length > 0) {
        return {
          statusCode: 200,
          body: JSON.stringify(errorsArray)
        };
      }

      // 7. Time to bring in the public fauna helper then destructure (dbHelper set to false)
      let fauna = new dbHelper(false);
      const { client, q } = fauna;

      // 8. Create the Users Collection in Fauna if it doesn't exist
      //    See credit: https://github.com/fauna-labs/todo-vanillajs/blob/main/index.html for an example of this
      await client.query(
        q.If(
          q.Exists(q.Collection(FAUNA_COLLECTION_USERS)),
          null,
          q.CreateCollection({ name: FAUNA_COLLECTION_USERS })
        )
      );

      // 9. Create a public index for the users collection
      await client.query(
        q.If(
          q.Exists(q.Index(FAUNA_INDEX_USERS_EMAIL)),
          null,
          q.CreateIndex({
            name: FAUNA_INDEX_USERS_EMAIL,
            permissions: { read: 'public' },
            source: q.Collection(FAUNA_COLLECTION_USERS),
            terms: [{
              field: ['data', 'email']
            }],
            unique: true,
          })
        )
      );

      // 10. Declare responseData, which will take in the result of the below Fauna query as either response or error
      let responseData: any;
      let signupSuccess: boolean;
      let payload: HandlerResponse;

      // 11a. Query: Create a user
      await client.query(
        q.Create(
          q.Collection(FAUNA_COLLECTION_USERS),
          {
            credentials: { password },
            data: {
              email,
              username,
              registerDate: Date.now()
            }
          }
        )
      )
      // 11b. Then set variables as...
        .then(res => {
          responseData = res.data.email;
          signupSuccess = true;
        })
      // 11c. Or set variables as...
        .catch(err => {
          responseData = err.message;
          signupSuccess = false;
        })
      // 11d. Define payload
        .finally(() => {
          if (signupSuccess) {
            payload = {
              statusCode: 200,
              body: JSON.stringify({ email: responseData }),
            };
          } else {
            payload = messageHelper(responseData);
          }
        });
      // 12. Return payload
      return payload;
    } else {
      // 1b. Otherwise scare the user lul TODO: logger function
      // event.headers['client-ip'] ...
      return messageHelper('Invalid access. Attempt has been logged.', 500);
    }
  } catch (error) {
    console.log(error);
    return messageHelper('Server error.', 500);
  }
};

// 13. Do it live
export default signup;
