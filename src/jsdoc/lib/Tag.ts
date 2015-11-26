import {TagDefinition} from './TagDefinition';

export class Tag {
  
  errors: string[] = [];
  
  constructor(
    public tagDef : TagDefinition,
    public tagName : string,
    public description? : string,
    public startingLine? : number,    
    public endingLine? : number) {    
  }
}

