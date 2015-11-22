var chai = require('chai');
var expect = chai.expect;
var TagParser_1 = require('./TagParser');
describe("TagParser", function () {
    var tagParser;
    var id = { name: 'id' };
    var description = { name: 'description' };
    var param = { name: 'param' };
    var other = { name: 'other-tag', ignore: true };
    var tagDefinitions = [id, description, param, other];
    beforeEach(function () {
        tagParser = new TagParser_1.TagParser(tagDefinitions);
    });
    it("should only return tags that are not ignored", function () {
        var content = 'Some initial content\n@id some.id\n' +
            '@description Some description\n@other-tag Some other tag\n' +
            '@param some param\n@param some other param';
        var tags = tagParser.parse(content, 10);
        expect(tags.getTag('id')).to.deep.equal({ tagName: 'id', description: 'some.id', lineNumber: 11, tagDef: id });
        //   // Not that the description tag contains what appears to be another tag but it was ignored so
        //   // is consumed into the description tag!
        // expect(doc.tags.tags[1]).toEqual(
        //   jasmine.objectContaining({ tagName: 'description', description: 'Some description\n@other-tag Some other tag', startingLine: 12})
        // );
        // expect(doc.tags.tags[2]).toEqual(
        //   jasmine.objectContaining({ tagName: 'param', description: 'some param', startingLine: 14 })
        // );
        // expect(doc.tags.tags[3]).toEqual(
        //   jasmine.objectContaining({ tagName: 'param', description: 'some other param', startingLine: 15 })
        // );
    });
    it("should cope with tags that have no 'description'", function () {
        var content = '@id\n@description some description';
        var tags = tagParser.parse(content, 123);
        expect(tags.getTag('id')).to.deep.equal({ tagName: 'id', description: '', tagDef: id });
        expect(tags.getTag('description')).to.deep.equal({ tagName: 'description', description: 'some description', tagDef: description });
    });
    it("should cope with empty content or no known tags", function () {
        expect(function () {
            tagParser.parse('', 123);
        }).not.to.throw;
        expect(function () {
            tagParser.parse('@unknownTag some text', 123);
        }).not.to.throw;
    });
    it("should ignore @tags inside back-ticked code blocks", function () {
        var a = { name: 'a' };
        var b = { name: 'b' };
        tagParser = new TagParser_1.TagParser([a, b]);
        var content = '@a some text\n\n' +
            '```\n' +
            '  some code\n' +
            '  @b not a tag\n' +
            '```\n\n' +
            'more text\n' +
            '@b is a tag';
        var tags = tagParser.parse(content);
        expect(tags.getTag('a').description).to.equal('some text\n\n' +
            '```\n' +
            '  some code\n' +
            '  @b not a tag\n' +
            '```\n\n' +
            'more text');
        expect(tags.getTags('b').length).to.equal(1);
        expect(tags.getTag('b').description).to.equal('is a tag');
    });
    it("should cope with single line back-ticked code blocks", function () {
        var a = { name: 'a' };
        var b = { name: 'b' };
        tagParser = new TagParser_1.TagParser([a, b]);
        var content = '@a some text\n\n' +
            '```some single line of code @b not a tag```\n\n' +
            'some text outside a code block\n' +
            '```\n' +
            '  some code\n' +
            '  @b not a tag\n' +
            '```\n';
        var tags = tagParser.parse(content);
        expect(tags.getTag('a').description).to.equal('some text\n\n' +
            '```some single line of code @b not a tag```\n\n' +
            'some text outside a code block\n' +
            '```\n' +
            '  some code\n' +
            '  @b not a tag\n' +
            '```\n');
        expect(tags.getTags('b')).to.be.empty;
    });
});
//# sourceMappingURL=TagParser.spec.js.map