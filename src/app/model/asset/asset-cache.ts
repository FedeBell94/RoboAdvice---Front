export class AssetCache {
    constructor(){
        this.history = [];
        this.assetsName = [];
    }
    lastStoredDate: string;
    history: any[]; 
    assetsName: any[];
}
