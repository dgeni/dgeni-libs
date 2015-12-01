import chai = require('chai');
let expect = chai.expect;

import {wholeTag} from './wholeTag';
import {Tag} from '../lib/Tag';

describe("whole-tag transform", () => {
  it("should return the whole tag", () => {
    var doc = {}, tag = new Tag({ name: 'someTag' }), value = {};
    expect(wholeTag(doc, tag, value)).to.equal(tag);
  });
});