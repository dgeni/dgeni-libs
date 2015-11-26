import {Tag} from './Tag';

export interface TransformFunction {
  (doc, tag : Tag, value: string) : any
}
export interface DefaultFunction {
  (doc) : any
}

export type Transforms = TransformFunction | TransformFunction[]; 

export interface TagDefinition {
  name : string;
  aliases? : string[];
  ignore? : boolean;
  required? : boolean;
  multi?: boolean;
  docProperty?: string;
  tagProperty?: string;  
  transforms? : Transforms;
  defaultFn? : DefaultFunction;
}
