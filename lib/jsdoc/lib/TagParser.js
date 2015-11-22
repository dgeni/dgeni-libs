var Tag_1 = require('./Tag');
var TagCollection_1 = require('./TagCollection');
var TagParser = (function () {
    function TagParser(tagDefinitions) {
        var _this = this;
        this.tagDefinitions = new Map();
        tagDefinitions.forEach(function (tagDefinition) {
            _this.tagDefinitions.set(tagDefinition.name, tagDefinition);
            if (tagDefinition.aliases) {
                tagDefinition.aliases.forEach(function (alias) {
                    _this.tagDefinitions.set(alias, tagDefinition);
                });
            }
        });
    }
    TagParser.prototype.parse = function (content, startingLine) {
        var lines = content.split(TagParser.END_OF_LINE);
        var lineNumber = 0;
        var line, match, tagDef;
        var descriptionLines = [];
        var description = '';
        var current; // The current that that is being extracted
        var inCode = false; // Are we inside a fenced, back-ticked, code block
        var tags = new TagCollection_1.TagCollection(); // Contains all the tags that have been found
        // Extract the description block
        do {
            line = lines[lineNumber];
            if (TagParser.CODE_FENCE.test(line)) {
                inCode = !inCode;
            }
            // We ignore tags if we are in a code block
            match = TagParser.TAG_MARKER.exec(line);
            tagDef = match && this.tagDefinitions.get(match[1]);
            if (!inCode && match && (!tagDef || !tagDef.ignore)) {
                // Only store tags that are unknown or not ignored
                current = new Tag_1.Tag(tagDef, match[1], match[2], startingLine + lineNumber);
                break;
            }
            lineNumber += 1;
            descriptionLines.push(line);
        } while (lineNumber < lines.length);
        description = descriptionLines.join('\n');
        lineNumber += 1;
        // Extract the tags
        while (lineNumber < lines.length) {
            line = lines[lineNumber];
            if (TagParser.CODE_FENCE.test(line)) {
                inCode = !inCode;
            }
            // We ignore tags if we are in a code block
            match = TagParser.TAG_MARKER.exec(line);
            tagDef = match && this.tagDefinitions.get(match[1]);
            if (!inCode && match && (!tagDef || !tagDef.ignore)) {
                tags.addTag(current);
                current = new Tag_1.Tag(tagDef, match[1], match[2], startingLine + lineNumber);
            }
            else {
                current.description = current.description ? (current.description + '\n' + line) : line;
            }
            lineNumber += 1;
        }
        if (current) {
            tags.addTag(current);
        }
        return tags;
    };
    ;
    TagParser.END_OF_LINE = /\r?\n/;
    TagParser.TAG_MARKER = /^\s*@(\S+)\s*(.*)$/;
    TagParser.CODE_FENCE = /^\s*```(?!.*```)/;
    return TagParser;
})();
exports.TagParser = TagParser;
//# sourceMappingURL=TagParser.js.map