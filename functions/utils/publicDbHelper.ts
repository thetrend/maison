import faunadb from 'faunadb';

export default function publicDbHelper(): void {
  const client = new faunadb.Client({
    secret: process.env['FAUNADB_SERVER_SECRET']
  });
  const q = faunadb.query;

  this.client = client;
  this.q = q;
};
