import chai = require('chai');
import sinon = require("sinon");
import sinonChai = require("sinon-chai");

let expect = chai.expect;
chai.use(sinonChai);

import {TagExtractor} from './TagExtractor';
import {Tag} from './Tag';
import {TagCollection} from './TagCollection';

class TypedTag extends Tag {
  typeExpression: string
}

class TestTag extends Tag {
  b: any;
}

function createDoc(tags) : any {
  var tagCollection = new TagCollection();
  tags.forEach((tag) => tagCollection.addTag(tag));
  return {
    fileInfo: {
      filePath: 'some/file.js'
    },
    tags: tagCollection
  };
}

describe("TagExtractor", () => {

  it("should log a warning if the doc contains bad tags", () => {
      var badTag = new TypedTag({ name: 'bad1' }, 'bad1', 'bad tag 1', 123, 129);
      badTag.typeExpression = 'string';
      badTag.errors = [
        'first bad thing',
        'second bad thing'
      ]; 
      var doc = createDoc([badTag]);

      var tagExtractor = new TagExtractor([], []);
      var warningSpy = sinon.spy();
      tagExtractor.log.on('warning', warningSpy);
      
      tagExtractor.extract(doc, doc.tags);
      
      expect(warningSpy).to.have.been.calledWith('Invalid tags found - doc\n' +
        '@bad1 (lines 123-129) : bad tag 1\n' +
        '    * first bad thing\n' +
        '    * second bad thing\n\n');
  });

  describe('default tag-def', () => {
    it("should the extract the description property to a property with the name of the tagDef", () => {
      var tagDef = { name: 'a' };
      var tagExtractor = new TagExtractor([tagDef]);

      var tag = new Tag(tagDef, 'a', 'some content', 123);
      var doc = createDoc([tag]);

      tagExtractor.extract(doc, doc.tags);
      expect(doc.a).to.equal('some content');
    });
  });

  describe("tag-defs with docProperty", () => {
    it("should assign the extracted value to the docProperty", () => {
      var tagDef = { name: 'a', docProperty: 'b' };
      var tagExtractor = new TagExtractor([tagDef]);

      var tag = new Tag(tagDef, 'a', 'some content', 123, 123);
      var doc = createDoc([tag]);

      tagExtractor.extract(doc, doc.tags);
      expect(doc.a).to.be.undefined;
      expect(doc.b).to.equal('some content');
    });
  });

  describe("tag-defs with multi", () => {
    it("should assign the extracted value(s) to an array on the doc", () => {
      var tagDef = { name: 'a', multi: true };
      var tagExtractor = new TagExtractor([tagDef]);

      var tag1 = new Tag(tagDef, 'a', 'some content', 123);
      var tag2 = new Tag(tagDef, 'a', 'some other content', 256);
      var docA = createDoc([tag1]);
      var docB = createDoc([tag1, tag2]);

      tagExtractor.extract(docA, docA.tags);
      expect(docA.a).to.deep.equal(['some content']);

      tagExtractor.extract(docB, docB.tags);
      expect(docB.a).to.deep.equal(['some content', 'some other content']);
    });
  });

  describe("tag-defs with required", () => {
    it("should throw an error if the tag is missing", () => {
      var tagDef = { name: 'a', required: true };
      var tagExtractor = new TagExtractor([tagDef]);

      var doc = createDoc([]);
      expect(() => {
        tagExtractor.extract(doc, doc.tags);
      }).to.throw();
    });
  });

  describe("tag-defs with tagProperty", () => {
    it("should assign the specified tag property to the document", () => {

      var tagDef = { name: 'a', tagProperty: 'b' };
      var tagExtractor = new TagExtractor([tagDef]);
      
      var tag = new TestTag(tagDef, 'a', 'some content', 123);
      var tags = new TagCollection();
      tags.addTag(tag);
      tag.b = 'special value';
      var doc = createDoc([tag]);

      tagExtractor.extract(doc, tags)
      expect(doc.a).to.equal('special value');

    });
  });

  describe("tag-defs with defaultFn", () => {

    it("should run the defaultFn if the tag is missing", () => {
      var defaultFn = sinon.stub().returns('default value');
      var tagDef = { name: 'a', defaultFn: defaultFn };
      var tagExtractor = new TagExtractor([tagDef]);

      var doc = createDoc([]);

      tagExtractor.extract(doc, doc.tags);
      expect(doc.a).to.equal('default value');
      expect(defaultFn).to.have.been.called;
    });

    describe("and mult", () => {

      it("should run the defaultFn if the tag is missing", () => {
        var defaultFn = sinon.stub().returns(['default value']);
        var tagDef = { name: 'a', defaultFn: defaultFn, multi: true };

        var tagExtractor = new TagExtractor([tagDef]);
        var doc = createDoc([]);

        tagExtractor.extract(doc, doc.tags)
        expect(doc.a).to.deep.equal(['default value']);
        expect(defaultFn).to.have.been.called;
      });

    });

  });


  describe("transforms", () => {

    describe("(single)", () => {
      it("should apply the transform to the extracted value", () => {
        function addA(doc, tag, value) { return value + '*A*'; }
        var tagDef = { name: 'a', transforms: addA };

        var tagExtractor = new TagExtractor([tagDef]);

        var tag = new Tag(tagDef, 'a', 'some content', 123);
        var tags = new TagCollection();
        tags.addTag(tag);
        var doc = createDoc([tag]);

        tagExtractor.extract(doc, tags)
        expect(doc.a).to.equal('some content*A*');

      });

      it("should allow changes to tag and doc", () => {
        function transform(doc, tag, value) { doc.x = 'x'; tag.b = 'b'; return value; }
        var tagDef = { name: 'a', transforms: transform };

        var tagExtractor = new TagExtractor([tagDef]);
        
        var tag = new TestTag(tagDef, 'a', 'some content', 123);
        var tags = new TagCollection();
        tags.addTag(tag);
        var doc = createDoc([tag]);

        tagExtractor.extract(doc, tags)
        expect(doc.a).to.equal('some content');
        expect(doc.x).to.equal('x');
        expect(tag.b).to.equal('b');
      });
    });


    describe("(multiple)", () => {
      it("should apply the transforms to the extracted value", () => {
        function addA(doc, tag, value) { return value + '*A*'; }
        function addB(doc, tag, value) { return value + '*B*'; }
        var tagDef = { name: 'a', transforms: [ addA, addB ] };

        var tagExtractor = new TagExtractor([tagDef]);

        var tag = new Tag(tagDef, 'a', 'some content', 123);
        var tags = new TagCollection();
        tags.addTag(tag);
        var doc = createDoc([tag]);

        tagExtractor.extract(doc, tags)
        expect(doc.a).to.equal('some content*A**B*');

      });

      it("should allow changes to tag and doc", () => {
        function transform1(doc, tag, value) { doc.x = 'x'; return value; }
        function transform2(doc, tag, value) { tag.b = 'b'; return value; }
        var tagDef = { name: 'a', transforms: [transform1, transform2] };

        var tagExtractor = new TagExtractor([tagDef]);

        var tag = new TestTag(tagDef, 'a', 'some content', 123);
        var tags = new TagCollection();
        tags.addTag(tag);
        var doc = createDoc([tag]);

        tagExtractor.extract(doc, tags)
        expect(doc.a).to.equal('some content');
        expect(doc.x).to.equal('x');
        expect(tag.b).to.equal('b');
      });
    });
  });

  describe("default transforms", () => {

    it("should apply the default transformations to all tags", () => {
      var tagDef1 = { name: 'a' };
      var tagDef2 = { name: 'b' };
      function addA(doc, tag, value) { return value + '*A*'; }

      var tagExtractor = new TagExtractor([tagDef1, tagDef2], [addA]);

      var tag1 = new Tag(tagDef1, 'a', 'some content', 123);
      var tag2 = new Tag(tagDef2, 'b', 'some other content', 123);
      var doc = createDoc([tag1, tag2]);

      tagExtractor.extract(doc, doc.tags)
      expect(doc.a).to.equal('some content*A*');
      expect(doc.b).to.equal('some other content*A*');

    });


    it("should apply the default transformations after tag specific transforms", () => {
      function addA(doc, tag, value) { return value + '*A*'; }
      function addB(doc, tag, value) { return value + '*B*'; }
      var tagDef1 = { name: 'a', transforms: addA };

      var tagExtractor = new TagExtractor([tagDef1], [addB]);

      var tag = new Tag(tagDef1, 'a', 'some content', 123);
      var doc = createDoc([tag]);

      tagExtractor.extract(doc, doc.tags)
      expect(doc.a).to.equal('some content*A**B*');
    });
  });

});