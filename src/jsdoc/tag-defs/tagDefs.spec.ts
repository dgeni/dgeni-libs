import chai = require('chai');
let expect = chai.expect;

import {Tag} from '../lib/Tag';
import * as tagDefs from './tagDefs';

describe('tag definitions', () => {
  
  describe("description", () => {
    var descriptionTag = tagDefs.descriptionTag;
    
    describe('transforms', () => {
      it("should prepend any non-tag specific description found in the jsdoc comment", () => {
        var doc = { tags: { description: 'general description'} };
        var tag = {};
        var value = "tag specific description";
        expect(descriptionTag.transforms(doc, tag, value)).to.equal('general description\ntag specific description');
      });
    });
    
    describe("defaultFn", () => {
      it("should get the contents of the non-tag specific description", () => {
        var doc = { tags: { description: 'general description'} };
        expect(descriptionTag.defaultFn(doc)).to.equal('general description');
      });
    });
  });
  
  describe("license tag-def", function() {
    var licenseTag = tagDefs.licenseTag;
    it('should pull in the license detail if it matches the SPDX License List', function() {
      interface License {
        name: string;
        url: string;
        osiApproved: boolean;
        license: string;
      }
      var doc : { licenseDescription? : License } = {};
      var result = licenseTag.transforms(doc, 'license', 'Apache-2.0');
      expect(result).to.equal('Apache-2.0');
      expect(doc.licenseDescription).to.contain({
        name: "Apache License 2.0",
        url: "http://www.apache.org/licenses/LICENSE-2.0\nhttp://www.opensource.org/licenses/Apache-2.0",
        osiApproved: true
      });
  
      expect(doc.licenseDescription.license).to.contain('Apache License\nVersion 2.0, January 2004');
    });
  });  
});
