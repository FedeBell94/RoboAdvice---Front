export class AssetCache {
    constructor(){
        this.history = [];
        this.assetsName = [];
        this.raw = [];
        this.lastStoredDate = [];
    }
    raw: any[];
    lastStoredDate: string[];
    history: any[]; 
    assetsName: any[];
}
