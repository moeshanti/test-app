montageDefine("cf81e1b","ui/base/abstract-confirm",{dependencies:["./abstract-alert","../../core/promise"],factory:function(e,t){var n=e("./abstract-alert").AbstractAlert;e("../../core/promise").Promise;var r=t.AbstractConfirm=n.specialize({constructor:{value:function r(){if(this.constructor===r)throw Error("AbstractConfirm cannot be instantiated.")}},cancelButton:{value:null},title:{value:"Confirm"},okLabel:{value:"OK"},cancelLabel:{value:"Cancel"},enterDocument:{value:function(e){this.super(e),e&&this._cancelButton.addEventListener("action",this,!1)}},handleAction:{value:function(e){e.target===this._okButton&&(this._userActionDeferred.resolve(r.OKButton),this._userActionDeferred=null,this._overlay.hide()),e.target===this._cancelButton&&(this._userActionDeferred.resolve(r.CancelButton),this._userActionDeferred=null,this._overlay.hide())}}},{show:{value:function(e,t,n,r){var i,a=this;return this.hasOwnProperty("_instance")||this._setupInstance(),i=this._instance,this._nextMessagePromise=this._nextMessagePromise.then(function(){return i.title=t?t:a.prototype.title,i.message=e,i.okLabel=n?n:a.prototype.okLabel,i.cancelLabel=r?r:a.prototype.cancelLabel,i.show()})}},OKButton:{value:"ok"},CancelButton:{value:"cancel"}})}});