import validator from 'validator';
import { HandlerEvent, HandlerResponse } from "@netlify/functions";
import messageHelper from "../utils/messageHelper";
import publicDbHelper from '../utils/publicDbHelper';
import { FAUNA_USERS_TABLE } from '../types/faunaTables';

/**
 * 
 * @param event 
 * @returns HandlerResponse messageHelper
 * 
 * This code borrows heavily (if not at least 90%) from my previous project,
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
      username?: string;
      password?: string;
      verifiedPassword?: string;
    };

    // Define a reusable denial message using the message helper
    const denyMessage: HandlerResponse = messageHelper('Server error', 500);

    /** 
     * Check whether the Signup API endpoint is being hit directly via POST method
     * Or whether there is an event body being sent
     * If false for either, return the denyMessage defined above
     */
    if (event.httpMethod !== 'POST' || !event.body) {
      return denyMessage;
    }

    // Next: destructure from event.body now that we know it exists
    const { email, username, password, verifiedPassword }: NewUser = JSON.parse(event.body);

    const loweredEmail: string = email.toLowerCase();

    // Define an Email Errors flag variable to be used later
    let noEmailErrors: boolean | undefined;

    // Now that email is defined, check for an empty value -- this is the only required value
    if (!email) {
      noEmailErrors = false;
      return denyMessage;
    } else {
      noEmailErrors = true;
    }

    // Proceed since the required email is set; the next several statements depend on email
    const savedEmailAddresses: string[] = (process.env['FAUNADB_AUTHORIZED_USERS']).split(',');
    
    // Verify whether the username being registered matches the predetermined email addresses on file
    if (noEmailErrors && !savedEmailAddresses.includes(loweredEmail)) {
      return messageHelper('You are not an authorized user of this app.');
    }

    // Validate username
    if (noEmailErrors && username && !validator.matches(username, /^[0-9a-zA-Z_-\s]+$/)) {
      return messageHelper('Username can only contain letters, numbers, underscores, hyphens, and spaces.');
    }

    // Validate password
    if (noEmailErrors && password && !validator.isStrongPassword(password)) {
      return messageHelper('Weak password');
    } else {
      // Continue password/verifiedPassword validation once the above test passes
      if (noEmailErrors && verifiedPassword && verifiedPassword !== password) {
        return messageHelper('Passwords don\'t match!');
      }
    }

    // Error checks complete. Proceed.

    // Instantiate a new Fauna Client
    let fauna = new publicDbHelper();
    const { client, q } = fauna;
    
  } catch (error) {
    return messageHelper('Fatal error', 500);
  }
};

export default signup;
