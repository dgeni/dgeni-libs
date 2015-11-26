import {TagDefinition} from './TagDefinition';
import {Tag} from './Tag';

/**
 * A collection of tags that can be looked up by their tagDefinition.
 */
export class TagCollection {
  tags = new Map<String, Tag[]>();
  badTags : Tag[] = [];
     

  /**
   * The description contains text that was not explicitly assigned to a tag in a jsdoc)
   */
  public description = '';

  /**
   * Add a new tag to the collection.
   * @param {Tag} tag The tag to add
   */
  addTag(tag : Tag) {
    if ( !tag.errors.length && tag.tagDef ) {
      let tags = this.tags.get(tag.tagDef.name);
      if (!tags) {
        tags = [];
        this.tags.set(tag.tagDef.name, tags);
      }
      tags.push(tag);
    } else {
      this.badTags.push(tag);
    }
  }

  /**
   * Remove a tag from the collection
   * @param  {Tag} tag The tag to remove
   */
  removeTag(tag : Tag) {
    var name = tag.tagDef.name;
    var tags = this.tags.get(name) || [];
    tags = tags.filter((t) => t !== tag);
    if (tags.length) {
      this.tags.set(name, tags);
    } else {
      this.tags.delete(name);
    }
  }

  /**
   * Get the first tag in the collection that has the specified tag definition
   * @param  {string} name The name of the tag definition whose tag we should get
   * @return {Tag}
   */
  getTag(name : string) : Tag {
    return this.getTags(name)[0];
  }

  /**
   * Get the tags in the collection that have the specified tag definition
   * @param  {string} name The name of the tag definition whose tags we should get
   * @return {Array}
   */
  getTags(name : string) : Tag[] {
    return this.tags.get(name) || [];
  }
  
  /**
   * Get the tags in the collection that are in error
   */
  getBadTags() : Tag[] {
    return this.badTags;
  }
}