import { Event } from "@netlify/functions/dist/function/event";

export type urlObject = {
  path: string;
  segments: string[];
  func: string;
  endpoint: string;
}

/**
 * @function urlHelper
 * @param event
 * @returns object
 */

function urlHelper(event: Event): void {
  const path = event.path.replace(/\/api\/+/, '');
  const segments = path.split('/').filter(segment => segment);
  const func = segments[0];
  const endpoint = segments[segments.length - 1];

  this.path = path;
  this.segments = segments.filter(segment => segment !== func);
  this.func = func;
  this.endpoint = endpoint;
}

export default urlHelper;
