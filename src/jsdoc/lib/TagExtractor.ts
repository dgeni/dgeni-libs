import {TagDefinition, Transforms, TransformFunction, DefaultFunction} from './TagDefinition';
import {Tag} from './Tag';
import {TagCollection} from './TagCollection';
import {createDocMessage} from '../../utils/log';
import {EventEmitter} from 'events';

interface ReadPropertyFn {
  (doc, tag : Tag[]) : any;
}

export class TagExtractor {
  log = new EventEmitter();
  tagDefinitions : Array<TagDefinition>;
	defaultTransformFn : TransformFunction;
  propertyExtractorMap: Map<TagDefinition, ReadPropertyFn>;
	 
	constructor(tagDefinitions : TagDefinition[], defaultTagTransforms? : Transforms) {
    this.tagDefinitions = tagDefinitions;
    this.defaultTransformFn = getTransformationFn(defaultTagTransforms);
    this.propertyExtractorMap = buildPropertyExtractorMap(tagDefinitions, this.defaultTransformFn);
  }

  extract(doc : any, tagCollection : TagCollection) {
    // Try to extract each of the tags defined in the tagDefs collection
    this.tagDefinitions.forEach((tagDef) => {
      try {
        var readProperty = this.propertyExtractorMap.get(tagDef);
        var tags = tagCollection.getTags(tagDef.name);
        var docProperty = tagDef.docProperty || tagDef.name;
        doc[docProperty] = readProperty(doc, tags);
      } catch(e) {
        throw new Error(createDocMessage(`Error extracting tag @${tagDef.name} : ${e.message}`, doc));
      }
    });
    if ( tagCollection.badTags.length > 0 ) {
      this.log.emit('warning', formatBadTagErrorMessage(doc));
    }
  }
}

function buildPropertyExtractorMap(tagDefinitions: TagDefinition[], defaultTransformFn : TransformFunction) : Map<TagDefinition, ReadPropertyFn> {
  let map = new Map<TagDefinition, ReadPropertyFn>();
  tagDefinitions.forEach((tagDef) => {
    map.set(tagDef, createReadPropertyFn(tagDef, defaultTransformFn));
  });
  return map;    
}

/**
  * Create a function to transform from the tag to doc property
  * @param  {function(doc, tag, value)|Array.<function(doc, tag, value)>} transform
  *         The transformation to apply to the tag
  * @return {function(doc, tag, value)} A single function that will do the transformation
  */
function getTransformationFn(transforms? : Transforms) : TransformFunction {
  // transform is a single function so just use that
  if (typeof transforms == 'function') return transforms as TransformFunction;
  // transform is an array then we will apply each in turn like a pipe-line
  if ( Array.isArray(transforms) ) {
    return (doc, tag, value) => {
      return transforms.reduce((value, transform) => transform(doc, tag, value), value);
    };
  }
  // no transform is specified so we just provide a default
  if ( !transforms ) return (doc, tag, value) => value;
  // transform is not valid
  throw new Error('Invalid transform - you must provide a function or an array of functions.');
}

function trim(text:string) {
  text = text || '';
  if (text.length > 20) text = text.substr(0, 20) + '...';
  return text;
}

function formatBadTagErrorMessage(doc) {
  let message = createDocMessage('Invalid tags found', doc) + '\n';
  doc.tags.badTags.forEach((badTag) => {
    let tagName = badTag.name || badTag.tagName;
    let description = trim(badTag.description);
    message += `@${tagName} (lines ${badTag.startingLine}-${badTag.endingLine}) : ${description}\n`;
    badTag.errors.forEach((error) => message += '    * ' + error + '\n');
  });

  return message + '\n';
}

function createReadPropertyFnSimple(tagProperty : string, transformFn : TransformFunction, defaultTransformFn : TransformFunction) : ReadPropertyFn {
  return (doc, tags : Tag[]) => {
    if (tags.length > 1) {
      throw new Error('only one tag allowed');
    }
    return defaultTransformFn(doc, tags[0], transformFn(doc, tags[0], tags[0][tagProperty]));
  };
}

function createReadPropertyFnMulti(tagProperty : string, transformFn : TransformFunction, defaultTransformFn : TransformFunction) : ReadPropertyFn {
  return (doc, tags : Tag[]) => tags.map(function(tag) {
    return defaultTransformFn(doc, tag, transformFn(doc, tag, tag[tagProperty]));
  });
}

function createReadPropertyFnRequired(readPropertyFn : ReadPropertyFn) : ReadPropertyFn {
  return (doc, tags : Tag[]) => {
    if ( tags.length === 0 ) {
      throw new Error(createDocMessage('required tag missing', doc));
    }
    return readPropertyFn(doc, tags);
  };
}

function createReadPropertyFnWithDefault(readPropertyFn : ReadPropertyFn, getDefaultValueFn : DefaultFunction) : ReadPropertyFn {
  return (doc, tags: Tag[]) => {
    return tags.length ? readPropertyFn(doc, tags) : getDefaultValueFn(doc);
  };
}

function createReadPropertyFn(tagDef : TagDefinition, defaultTransformFn : TransformFunction) : ReadPropertyFn {
  let transformFn = getTransformationFn(tagDef.transforms);
  let tagProperty = tagDef.tagProperty || 'description';
  let readPropertyFn = tagDef.multi ?
    createReadPropertyFnMulti(tagProperty, transformFn, defaultTransformFn) :
    createReadPropertyFnSimple(tagProperty, transformFn, defaultTransformFn);
  if (tagDef.required) {
    readPropertyFn = createReadPropertyFnRequired(readPropertyFn);
  } else if (tagDef.defaultFn) {
    readPropertyFn = createReadPropertyFnWithDefault(readPropertyFn, tagDef.defaultFn);
  }
  return readPropertyFn;
}