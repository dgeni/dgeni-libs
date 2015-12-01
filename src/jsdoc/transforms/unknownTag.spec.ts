import chai = require('chai');
let expect = chai.expect;

import {unknownTag} from './unknownTag';
import {Tag} from '../lib/Tag';

describe("unknown-tag transform", () => {
  it("should add an error to the tag if it has no tagDef", () => {
    var doc = {}, tag = new Tag(null, 'badTag');
    unknownTag(doc, tag, '');
    expect(tag.errors).to.eql(['Unknown tag: badTag']);
  });
});