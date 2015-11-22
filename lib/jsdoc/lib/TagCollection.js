/**
 * A collection of tags that can be looked up by their tagDefinition.
 */
var TagCollection = (function () {
    function TagCollection() {
        this.tags = new Map();
        this.badTags = [];
        /**
         * The description contains text that was not explicitly assigned to a tag in a jsdoc)
         */
        this.description = '';
    }
    /**
     * Add a new tag to the collection.
     * @param {Tag} tag The tag to add
     */
    TagCollection.prototype.addTag = function (tag) {
        if (!tag.errors && tag.tagDef) {
            var tags = this.tags.get(tag.tagDef.name);
            if (!tags) {
                tags = [];
                this.tags.set(tag.tagDef.name, tags);
            }
            tags.push(tag);
        }
        else {
            this.badTags.push(tag);
        }
    };
    /**
     * Remove a tag from the collection
     * @param  {Tag} tag The tag to remove
     */
    TagCollection.prototype.removeTag = function (tag) {
        var name = tag.tagDef.name;
        var tags = this.tags.get(name) || [];
        tags = tags.filter(function (t) { return t !== tag; });
        if (tags.length) {
            this.tags.set(name, tags);
        }
        else {
            this.tags.delete(name);
        }
    };
    /**
     * Get the first tag in the collection that has the specified tag definition
     * @param  {string} name The name of the tag definition whose tag we should get
     * @return {Tag}
     */
    TagCollection.prototype.getTag = function (name) {
        return this.getTags(name)[0];
    };
    /**
     * Get the tags in the collection that have the specified tag definition
     * @param  {string} name The name of the tag definition whose tags we should get
     * @return {Array}
     */
    TagCollection.prototype.getTags = function (name) {
        return this.tags.get(name) || [];
    };
    /**
     * Get the tags in the collection that are in error
     */
    TagCollection.prototype.getBadTags = function () {
        return this.badTags;
    };
    return TagCollection;
})();
exports.TagCollection = TagCollection;
//# sourceMappingURL=TagCollection.js.map