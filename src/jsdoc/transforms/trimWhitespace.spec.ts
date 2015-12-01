import chai = require('chai');
let expect = chai.expect;

import {Tag} from '../lib/Tag'; 
import {trimWhitespace} from './trimWhitespace';

describe("trimWhitespace", function() {
  
  var tagDef = { name: 'param' };

  it("should trim newlines and whitespace from the end of the description", function() {
    expect(trimWhitespace({}, new Tag(tagDef), 'myId\n\nsome other text  \n  \n')).to.eql('myId\n\nsome other text');
  });

  it("should not do anything if the value is not a string", function() {
    var someNonStringObject = null;
    expect(trimWhitespace({}, new Tag(tagDef), someNonStringObject)).to.eql(someNonStringObject);
  });
});
