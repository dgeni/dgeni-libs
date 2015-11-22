import chai = require('chai');
let expect = chai.expect;

var Tag = require('./Tag');

describe("Tag", function() {
  it("should put constructor parameters into member properties", function() {
    var tagDef = {};
    var tag = new Tag(tagDef, 'someName', 'a load of content', 12);
    expect(tag.tagDef).to.equal(tagDef);
    expect(tag.tagName).to.equal('someName');
    expect(tag.description).to.equal('a load of content');
    expect(tag.startingLine).to.equal(12);
  });
});