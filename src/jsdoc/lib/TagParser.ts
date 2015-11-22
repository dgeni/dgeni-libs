import {Tag, TagDefinition} from './Tag';
import {TagCollection} from './TagCollection';
import {log, createDocMessage} from '../../utils/log';

export class TagParser {
  static END_OF_LINE = /\r?\n/;
  static TAG_MARKER = /^\s*@(\S+)\s*(.*)$/;
  static CODE_FENCE = /^\s*```(?!.*```)/;

  tagDefinitions = new Map<string, TagDefinition>();

  constructor(tagDefinitions : Array<TagDefinition>) {
    tagDefinitions.forEach((tagDefinition) => {
      
      this.tagDefinitions.set(tagDefinition.name, tagDefinition);
      
      if ( tagDefinition.aliases ) {
        tagDefinition.aliases.forEach((alias) => {
          this.tagDefinitions.set(alias, tagDefinition);
        });
      }
    });
  }

  parse(content : string, startingLine : number) {
    let lines = content.split(TagParser.END_OF_LINE);
    let lineNumber = 0;
    let line, match, tagDef;
    let descriptionLines = [];
    let description = '';
    let current;                                      // The current that that is being extracted
    let inCode = false;                               // Are we inside a fenced, back-ticked, code block
    let tags : TagCollection = new TagCollection();   // Contains all the tags that have been found

    // Extract the description block
    do {
      line = lines[lineNumber];

      if ( TagParser.CODE_FENCE.test(line) ) {
        inCode = !inCode;
      }

      // We ignore tags if we are in a code block
      match = TagParser.TAG_MARKER.exec(line);
      tagDef = match && this.tagDefinitions.get(match[1]);
      if ( !inCode && match && ( !tagDef || !tagDef.ignore ) ) {
        // Only store tags that are unknown or not ignored
        current = new Tag(tagDef, match[1], match[2], startingLine + lineNumber);
        break;
      }

      lineNumber += 1;
      descriptionLines.push(line);

    } while(lineNumber < lines.length);
    description = descriptionLines.join('\n');

    lineNumber += 1;

    // Extract the tags
    while(lineNumber < lines.length) {
      line = lines[lineNumber];

      if ( TagParser.CODE_FENCE.test(line) ) {
        inCode = !inCode;
      }

      // We ignore tags if we are in a code block
      match = TagParser.TAG_MARKER.exec(line);
      tagDef = match && this.tagDefinitions.get(match[1]);
      if ( !inCode && match && (!tagDef || !tagDef.ignore) ) {
        tags.addTag(current);
        current = new Tag(tagDef, match[1], match[2], startingLine + lineNumber);
      } else {
        current.description = current.description ? (current.description + '\n' + line) : line;
      }

      lineNumber += 1;
    }
    if ( current ) {
      tags.addTag(current);
    }

    return tags;
  };
}