// Netlify (AWS) Types
import { HandlerResponse } from '@netlify/functions';

/**
 * @function      messageHelper(message:string,code:number)
 * @description   Helper function to return arguments as a HandlerResponse object
 * @returns       {HandlerResponse}
 */

export function messageHelper(message: string, code: number = 200): HandlerResponse {
  return {
    statusCode: code,
    body: JSON.stringify({
      message
    })
  }
};
