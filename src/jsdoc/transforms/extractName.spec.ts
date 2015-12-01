import chai = require('chai');
let expect = chai.expect;

import {extractName} from './extractName';
import {Tag} from '../lib/Tag';

describe("extractName", function() {
  var doc, tag, value;

  beforeEach(function() {
    doc = {};
    tag = new Tag({name: 'param'}, 'param');
  });

  it("should extract the name from the description", function() {

    value = '   paramName - Some description  \n Some more description';
    value = extractName(doc, tag, value);

    expect(tag.name).to.equal('paramName');
    expect(value).to.equal('Some description  \n Some more description');
  });

  it("should extract an optional name", function() {
    value = '[someName]';
    value = extractName(doc, tag, value);
    expect(tag.name).to.equal('someName');
    expect(tag.optional).to.equal(true);
    expect(value).to.equal('');
  });

  it("should extract a name and its default value", function() {
    value = '[someName=someDefault]';
    value = extractName(doc, tag, value);
    expect(tag.name).to.equal('someName');
    expect(tag.optional).to.equal(true);
    expect(tag.defaultValue).to.equal('someDefault');
    expect(value).to.equal('');
  });

  it("should extract a param name alias", function() {
    value = 'paramName|aliasName some description';
    value = extractName(doc, tag, value);
    expect(tag.name).to.equal('paramName');
    expect(tag.alias).to.equal('aliasName');
    expect(value).to.equal('some description');
  });

});