export function LocalStorage() {
    return function(target: Object, propertyName: string, descriptor?: PropertyDescriptor) {
        if (!!descriptor) { // already have a descriptor <-------WARN not tested
            //saving prop getter and setter
            target.constructor.prototype["->set-" + propertyName] = descriptor.set;
            target.constructor.prototype["->get-" + propertyName] = descriptor.get;
            //now overriding 'em
            descriptor.set = function(value) {
                //calling the old setter
                this["->get-" + propertyName](value);
                if (this[propertyName]) {
                    localStorage.setItem(this.constructor.name + "." + propertyName, JSON.stringify(this[propertyName])); //saving into localStorage
                }else{
                    localStorage.removeItem(this.constructor.name + "." + propertyName);
                }

            }
            descriptor.get = function() {
                if (this["->get-" + propertyName]() === undefined)  {
                    this["->get-" + propertyName] = JSON.parse(localStorage.getItem(this.constructor.name + "." + propertyName));
                }
                return this["->get-" + propertyName]();
            }
        } else {
            //there's no descriptor yet
            let pName = "_" + propertyName;
            Object.defineProperty(target.constructor.prototype, propertyName, {
                get: function() {
                    if (this[pName] === undefined) {
                        this[pName] = JSON.parse(localStorage.getItem(this.constructor.name + "." + propertyName));
                    }
                    return this[pName];
                },
                set: function(value) {
                    this[pName] = value;
                    if (this[pName]) {
                        localStorage.setItem(this.constructor.name + "." + propertyName, JSON.stringify(this[pName])); //saving into localStorage
                    }else{
                        localStorage.removeItem(this.constructor.name + "." + propertyName);
                    }
                }
            })
        }
    }
}
