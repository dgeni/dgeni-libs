import chai = require('chai');
let expect = chai.expect;

import {TagCollection} from './TagCollection';
import {Tag} from './Tag';

describe("TagCollection", () => {
  var tags : TagCollection;

  beforeEach(() => { tags = new TagCollection() });

  it("should set up the object properties", () => {
    expect(tags.tags.size).to.equal(0);
    expect(tags.badTags).to.be.empty;
    // We clone so that to.equal works with our "bare" object
    expect(tags.tags.size).to.equal(0);
    expect(tags.description).to.equal('');
  });

  describe("addTag", () => {
    it("should add a good tag to the tags", () => {
      var goodTag = new Tag({name:'param'}, 'param');
      tags.addTag(goodTag);
      expect(tags.getTag('param')).to.equal(goodTag);
      expect(tags.badTags).to.be.empty;
    });

    it("should add a bad tag to the badTags properties", () => {
      var badTag = new Tag({ name: 'param'}, 'param');
      badTag.errors.push('some error');
      tags.addTag(badTag);
      expect(tags.badTags[0]).to.equal(badTag);
      expect(tags.tags.size).to.equal(0);
    });
  });

  describe("removeTag", () => {
    it("should remove the tag from both the tags and the tagsByName", () => {
      var tag = new Tag({name: 'param'}, 'param');
      tags.addTag(tag);
      tags.removeTag(tag);
      expect(tags.getTags('param')).to.be.empty;
    });
  });

  describe("getTag", () => {
    it("should get the first tag that matches the tagDef", () => {
      var tagDef = { name: 'param' };
      var tag1 = new Tag(tagDef, 'param', '...', 0);
      var tag2 = new Tag(tagDef, 'param', '...', 100);
      tags.addTag(tag1);
      tags.addTag(tag2);
      expect(tags.getTag(tagDef.name)).to.equal(tag1);
    });
  });

  describe("getTags", () => {
    it("should get the tags by name", () => {
      var tagDef = { name: 'param' };
      var tag1 = new Tag(tagDef, 'param', '...', 0);
      var tag2 = new Tag(tagDef, 'param', '...', 100);
      tags.addTag(tag1);
      tags.addTag(tag2);
      expect(tags.getTags(tagDef.name)).to.deep.equal([tag1,tag2]);
    });
  });

});