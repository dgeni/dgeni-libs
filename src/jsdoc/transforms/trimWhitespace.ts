import {Tag} from '../lib/Tag';

/**
 * Trim excess whitespace from the value
 */
export function trimWhitespace(doc : any, tag : Tag, value : string) {
  if (!value) return value;
  return value.trim();
}