// Package imports
import faunadb from 'faunadb';

/**
 * @function      dbHelper(isAuthenticated:boolean)
 * @description   Helper function to access Fauna DB via saved auth secret or public server secret
 * @returns       {void}
 */

export function dbHelper(isAuthenticated: boolean = true): void {
  this.client = new faunadb.Client({
    secret: isAuthenticated ? process.env['AUTH_SECRET'] : process.env['FAUNADB_SERVER_SECRET'],
    keepAlive: isAuthenticated,
  });
  this.q = faunadb.query;
};
