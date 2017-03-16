export class GraphDynamicOptions{
  constructor(title?: string, valueField?: string){
    this.title = title || null;
    this.valueField = valueField || null;
  }
  title: string;
  valueField: string;
}
