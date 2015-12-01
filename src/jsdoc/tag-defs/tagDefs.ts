import {createDocMessage} from '../../utils/log';
import {extractType} from '../transforms/extractType';
import {extractName} from '../transforms/extractName';
import {wholeTag} from '../transforms/wholeTag';

var spdxLicenseList = require('spdx-license-list/spdx-full');

export var animationsTag = { name: 'animations' };
export var classTag = { name: 'class' };
export var classdescTag = { name: 'classdesc' };
export var constructorTag = { name: 'constructor' };
export var deprecatedTag = { name: 'deprecated' };
export var descriptionTag = {
  name: 'description',
  transforms: (doc, tag, value) => {
    if ( doc.tags.description ) {
      value = doc.tags.description + '\n' + value;
    }
    return value;
  },
  defaultFn: (doc) => {
    return doc.tags.description;
  }
};
export var functionTag = { name: 'function' };
export var globalTag = { name: 'global' };
export var kindTag = { name: 'kind' };
export var licenseTag = {
  name: 'license',
  transforms: (doc, tagName, value) => {
    if (spdxLicenseList[value]) doc.licenseDescription = spdxLicenseList[value];
    return value;
  }
};
export var memberofTag = {
  name: 'memberof',
  defaultFn: function(doc) {
    if ( doc.docType === 'event' || doc.docType === 'property' || doc.docType === 'method' ) {
      throw new Error(createDocMessage('Missing tag "@memberof" for doc of type "'+ doc.docType, doc));
    }
  },
  transforms: function(doc, tag, value) {
    if ( !(doc.docType === 'event' || doc.docType === 'property' || doc.docType === 'method') ) {
      throw new Error(createDocMessage('"@'+ tag.name +'" tag found on non-'+ doc.docType +' document', doc));
    }
    return value;
  }
} 
export var methodTag = { name: 'method' };
export var moduleTag = { name: 'module' };
export var nameTag = { name: 'name' };
export var namespaceTag = { name: 'namespace' };
export var paramTag = {
  name: 'param',
  multi: true,
  docProperty: 'params',
  transforms: [ extractType, extractName, wholeTag ]
}
export var privateTag = { name: 'private', transforms: () => true };
export var propertyTag = {
  name: 'property',
  multi: true,
  docProperty: 'properties',
  transforms: [ extractType, extractName, wholeTag ]
}
export var requiresTag = { name: 'requires', multi: true };
export var returnsTag = {
  name: 'returns',
  aliases: ['return'],
  transforms: [ extractType, wholeTag ]
};
export var seeTag = { name: 'see', multi: true };
export var typeTag = {
  name: 'type',
  transforms: [ extractType, wholeTag ]
};
export var usageTag = { name: 'usage' };
