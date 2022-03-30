import { Event } from "@netlify/functions/dist/function/event";



function urlHelper(event: Event) {
  const path: string = event.path.replace(/\/api\/+/, '');
  const segments: string[] = path.split('/').filter(segment => segment);
  const func: string = segments[0];
  const endpoint: string = segments[segments.length - 1];

  this.path = path;
  this.segments = segments;
  this.func = func;
  this.endpoint = endpoint;
}

module.exports = { urlHelper };
