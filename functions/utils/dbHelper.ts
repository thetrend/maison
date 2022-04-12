// Import NPM dependencies
import faunadb from 'faunadb';

/**
 * @function      dbHelper(isAuthenticated:boolean)
 * @description   Helper function to access Fauna DB via saved auth secret
 * @returns       {void}
 */

export function dbHelper(isAuthenticated: boolean = true): void {
  // Create a new Fauna connection using secret depending on isAuthenticated value and pass client and secret
  this.client = new faunadb.Client({
    secret: isAuthenticated ? process.env['AUTH_SECRET'] : process.env['FAUNADB_SERVER_SECRET'],
    keepAlive: isAuthenticated
  });
  this.q = faunadb.query;
};
