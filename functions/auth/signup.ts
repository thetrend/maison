import validator from 'validator';
import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import messageHelper from "../utils/messageHelper";
import publicDbHelper from '../utils/publicDbHelper';
import { FAUNA_COLLECTION_USERS, FAUNA_INDEX_USERS_EMAIL } from '../types/faunaVars';

/**
 * 
 * @param event 
 * @returns HandlerResponse messageHelper
 * 
 * This code borrows heavily (if not at least 60%) from my previous project,
 * windermerepeaks.co, which is a dead project. I have modified and cleaned up
 * my code where possible as I become more comfortable with TypeScript.
 * That code is available through https://github.com/thetrend/windermerepeaks.co
 * 
 * Tested via Insomnia
 */

const signup = async (event: HandlerEvent): Promise<HandlerResponse> => {
  try {
    // TS: Define Signup input values
    interface NewUser {
      email: string;
      username: string;
      password: string;
      verifiedPassword: string;
    };

    // Only proceed if accessing this URL via POST method
    // Otherwise scare the user lul
    if (event.httpMethod === 'POST') {
      // Destructure from event.body
      let { email, username, password, verifiedPassword }: NewUser = JSON.parse(event.body);

      // Create an empty Errors array for use later
      let errorsArray: object[] = [];

      // Create an array from the string of whitelisted emails
      const whitelistEmails: string[] = (process.env['FAUNADB_AUTHORIZED_USERS']).split(',');

      // Validate email and return an object to add to errorsArray if there are any problems
      if (!email) {
        errorsArray.push({ emailError: 'Email address is required.' });
      } else {
        if (!whitelistEmails.includes(email.toLowerCase())) {
          errorsArray.push({ emailError: 'You are not an authorized user.' });
        }
      }

      // Validate username and do the same
      if (!username) {
        errorsArray.push({ usernameError: 'Username is required.' });
      } else {
        // Minimum length requirement and validate username against regexp
        if (username.length < 2 || !validator.matches(username, /^[0-9a-zA-Z_-\s]+$/)) {
          errorsArray.push({ usernameError: 'Username must be at least 2 characters long and can only contain letters, numbers, underscores, hyphens, and spaces.' });
        }
      }

      // Validate password and do the same
      if (!password) {
        errorsArray.push({ passwordError: 'Password is required.' });
      } else {
        if (!validator.isStrongPassword(password)) {
          // See https://www.npmjs.com/package/validator for minimum requirements
          errorsArray.push({ passwordError: 'Password is too weak. See minimum requirements.' });
        }
      }

      // Validate verifiedPassword and do the same
      if (!verifiedPassword || verifiedPassword !== password) {
        errorsArray.push({ passwordError: 'Passwords do not match.' });
      }

      // Now check if errorsArray is not empty and return it
      if (errorsArray.length > 0) {
        return {
          statusCode: 400,
          body: JSON.stringify({ errors: errorsArray })
        };
      }

      // time to create the user
      let fauna = new publicDbHelper();
      const { client, q } = fauna;

      // Create the Users Collection in Fauna if it doesn't exist
      // See credit: https://github.com/fauna-labs/todo-vanillajs/blob/main/index.html for an example of this
      await client.query(
        q.If(
          q.Exists(q.Collection(FAUNA_COLLECTION_USERS)),
          null,
          q.CreateCollection({ name: FAUNA_COLLECTION_USERS })
        )
      );

      // Create a public index for the users collection
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

      // Declare responseData, which will take in the result of the below Fauna query as either response or error
      let responseData: string;

      // Create a user
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
      .then(res => { responseData = res.data; })
      .catch(err => { responseData = err.description; });

      // declare statusCode depending on the content of responseData
      const statusCode = responseData.includes('document') ? 400 : 200;

      // Finally, return the message helper with responseData and statusCode
      return messageHelper(responseData, statusCode);
    } else {
      // TODO: actually log shit
      return messageHelper('Invalid access. Attempt has been logged.', 500);
    }
  } catch (error) {
    return messageHelper(error, 500);
  }
};

export default signup;
