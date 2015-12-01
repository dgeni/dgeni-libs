import chai = require('chai');
let expect = chai.expect;

import {extractType} from './extractType';
import {Tag} from '../lib/Tag';

describe("extractType transform", function() {

  let doc, tagDef, tag;

  beforeEach(function() {
    doc = {};
    tagDef = { name: 'param' };
    tag = new Tag(tagDef, 'param');
  });

  it("should extract the type from the description", function() {

    let value = ' {string} paramName - Some description  \n Some more description';
    value = extractType(doc, tag, value);

    expect(tag.typeList).to.eql(['string']);
    expect(value).to.equal('paramName - Some description  \n Some more description');
  });

  it("should return the description if no type is found", function() {
    let value = 'paramName - Some description  \n Some more description';
    value = extractType(doc, tag, value);
    expect(value).to.equal('paramName - Some description  \n Some more description');
  });

  it("should handle record types", function() {
    let value = '{{x:number, y:number}} paramName - Some description';
    value = extractType(doc, tag, value);
    expect(tag.typeList).to.eql(['{x:number, y:number}']);
  });
});