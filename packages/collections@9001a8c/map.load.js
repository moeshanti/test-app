montageDefine("9001a8c","map",{dependencies:["./shim","./set","./generic-collection","./generic-map","./listen/property-changes","map"],factory:function(e,t,n){"use strict";function i(e,t,n,a){return this instanceof i?(t=t||Object.equals,n=n||Object.hash,a=a||Function.noop,this.contentEquals=t,this.contentHash=n,this.getDefault=a,this.store=new r(void 0,function(e,n){return t(e.key,n.key)},function(e){return n(e.key)}),this.length=0,this.addEach(e),void 0):new i(e,t,n,a)}e("./shim");var r=e("./set"),a=e("./generic-collection"),s=e("./generic-map"),o=e("./listen/property-changes");n.exports=i,i.Map=i,Object.addEach(i.prototype,a.prototype),Object.addEach(i.prototype,s.prototype),Object.addEach(i.prototype,o.prototype),i.prototype.constructClone=function(e){return new this.constructor(e,this.contentEquals,this.contentHash,this.getDefault)},i.prototype.log=function(e,t,n,i){t=t||this.logNode,this.store.log(e,function(e,n,i){t(e.value.value,n,i)},n,i)},i.prototype.logNode=function(e,t){t(" key: "+e.key),t(" value: "+e.value)}}});