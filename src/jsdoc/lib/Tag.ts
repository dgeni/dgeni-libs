export interface TransformFunction {
  (doc, tag : Tag, value: string) : any
}
export interface DefaultFunction {
  (doc) : any
}

export interface TagDefinition {
  name : string;
  aliases? : Array<string>;
  multi?: boolean;
  docProperty?: string;
  transforms? : TransformFunction | Array<TransformFunction>;
  defaultFn? : DefaultFunction;
}

export class Tag {
  constructor(
    public tagDef : TagDefinition,
    public tagName : string,
    public description? : string,
    public lineNumber? : number) {    
  }
}

