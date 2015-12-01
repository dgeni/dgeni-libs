import {Tag} from '../lib/Tag';

// Matches:
// name, [name], [name=default], name text, [name] text, [name=default] text, name - text, [name] - text or [name=default] - text
var NAME_AND_DESCRIPTION = /^\s*(\[([^\]=]+)(?:=([^\]]+))?\]|\S+)((?:[ \t]*\-\s*|\s+)(\S[\s\S]*))?\s*$/;

export interface NamedTag extends Tag {
  name? : string;
  optional? : boolean;
  defaultValue? : string;
  alias? : string;
} 

/**
 * Extract the name information from a tag
 * @param  {Tag} tag The tag to process
 */
export function extractName(doc : any, tag : Tag, value : string) : string {
  
  let namedTag : NamedTag = tag;

  namedTag.description = value.replace(NAME_AND_DESCRIPTION, function(match, name, optionalName, defaultValue, description, dashDescription) {
    
    namedTag.name = optionalName || name;

    if ( optionalName ) {
      namedTag.optional = true;
    }

    if ( defaultValue ) {
      namedTag.defaultValue = defaultValue;
    }

    var aliasParts = namedTag.name.split('|');
    namedTag.name = aliasParts[0];
    namedTag.alias = aliasParts[1];
    return dashDescription || description || '';
  });

  return namedTag.description;
};