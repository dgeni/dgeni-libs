import chai = require('chai');
let expect = chai.expect;

import {Tag} from './Tag';

describe('Tag', () => {
  it('should put constructor parameters into member properties', () => {
    var tagDef = {name: 'someTag'};
    var tag = new Tag(tagDef, 'someName', 'a load of content', 12);
    expect(tag.tagDef).to.equal(tagDef);
    expect(tag.tagName).to.equal('someName');
    expect(tag.description).to.equal('a load of content');
    expect(tag.startingLine).to.equal(12);
    expect(tag.errors).to.deep.equal([]);
  });
  
  it('should use the tagDef name if no tagName is passed', () => {
    var tagDef = {name: 'someTag'};
    var tag = new Tag(tagDef);
    expect(tag.tagName).to.equal(tagDef.name);    
  });
});