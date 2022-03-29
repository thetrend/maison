import { Handler } from '@netlify/functions';

const handler: Handler = async (event) => {
  const path: string = event.path.replace(/\/api\/+/, '');
  const segments: string[] = path.split('/').filter(segment => segment);
  const func: string = segments[0];
  const endpoint: string = segments[segments.length - 1];
  return {
    statusCode: 200,
    body: JSON.stringify({ segments: segments.filter(segment => segment !== func), func, endpoint })
  };
};

export { handler };
