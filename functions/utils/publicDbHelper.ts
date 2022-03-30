import faunadb from 'faunadb';

export default function publicDbHelper(): void {
  const q = faunadb.query;
  const client = new faunadb.Client({
    secret: process.env['FAUNADB_SERVER_SECRET']
  });

  this.q = q;
  this.client = client;
};
