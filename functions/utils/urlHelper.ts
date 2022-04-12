// Netlify (AWS) Types
import { Event } from '@netlify/functions/dist/function/event';

// Custom Helper Type
export type urlObject = {
  path: string;
  segments: string[];
  func: string;
  endpoint: string;
}

/**
 * @function      urlHelper(event:Event)
 * @description   Helper function to return the event as destructured variables
 * @returns       {void}
 */

export function urlHelper(event: Event): void {
  // Pass the following variables - don't remember why I structured it this way but it works for now
  this.path = event.path.replace(/\/api\/+/, '');
  const segments = this.path.split('/').filter(segment => segment);
  this.func = segments[0];
  this.segments = segments.filter(segment => segment !== this.func);
  this.endpoint = segments[segments.length - 1];
}
