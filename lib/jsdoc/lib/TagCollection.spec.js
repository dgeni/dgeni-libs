var chai = require('chai');
var expect = chai.expect;
var TagCollection_1 = require('./TagCollection');
var Tag_1 = require('./Tag');
describe("TagCollection", function () {
    var tags;
    beforeEach(function () { tags = new TagCollection_1.TagCollection(); });
    it("should set up the object properties", function () {
        expect(tags.tags.size).to.equal(0);
        expect(tags.badTags).to.be.empty;
        // We clone so that to.equal works with our "bare" object
        expect(tags.tags.size).to.equal(0);
        expect(tags.description).to.equal('');
    });
    describe("addTag", function () {
        it("should add a good tag to the tags", function () {
            var goodTag = new Tag_1.Tag({ name: 'param' }, 'param');
            tags.addTag(goodTag);
            expect(tags.getTag('param')).to.equal(goodTag);
            expect(tags.badTags).to.be.empty;
        });
        it("should add a bad tag to the badTags properties", function () {
            var badTag = { tagDef: { name: 'param' }, errors: [{}] };
            tags.addTag(badTag);
            expect(tags.badTags[0]).to.equal(badTag);
            expect(tags.tags.size).to.equal(0);
        });
    });
    describe("removeTag", function () {
        it("should remove the tag from both the tags and the tagsByName", function () {
            var tag = { tagDef: { name: 'param' } };
            tags.addTag(tag);
            tags.removeTag(tag);
            expect(tags.getTags('param')).to.be.empty;
        });
    });
    describe("getTag", function () {
        it("should get the first tag that matches the tagDef", function () {
            var tagDef = { name: 'param' };
            var tag1 = new Tag_1.Tag(tagDef, 'param', '...', 0);
            var tag2 = new Tag_1.Tag(tagDef, 'param', '...', 100);
            tags.addTag(tag1);
            tags.addTag(tag2);
            expect(tags.getTag(tagDef.name)).to.equal(tag1);
        });
    });
    describe("getTags", function () {
        it("should get the tags by name", function () {
            var tagDef = { name: 'param' };
            var tag1 = new Tag_1.Tag(tagDef, 'param', '...', 0);
            var tag2 = new Tag_1.Tag(tagDef, 'param', '...', 100);
            tags.addTag(tag1);
            tags.addTag(tag2);
            expect(tags.getTags(tagDef.name)).to.deep.equal([tag1, tag2]);
        });
    });
});
//# sourceMappingURL=TagCollection.spec.js.map