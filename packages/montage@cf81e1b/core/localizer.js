var Montage=require("./core").Montage,MessageFormat=require("./messageformat"),logger=require("./logger").logger("localizer"),Serializer=require("./serialization").Serializer,Deserializer=require("./serialization").Deserializer,Promise=require("./promise").Promise,Bindings=require("./bindings").Bindings,PropertyChanges=require("collections/listen/property-changes"),FrbBindings=require("frb/bindings"),stringify=require("frb/stringify"),expand=require("frb/expand"),Scope=require("frb/scope");MessageFormat.locale=require("./messageformat-locale");var KEY_KEY="key",DEFAULT_MESSAGE_KEY="default",LOCALE_STORAGE_KEY="montage_locale",LOCALES_DIRECTORY="locale",MESSAGES_FILENAME="messages",MANIFEST_FILENAME="manifest.json",EMPTY_STRING_FUNCTION=function(){return""},reLanguageTagValidator=/^[a-zA-Z]+(?:-[a-zA-Z0-9]+)*$/,Localizer=exports.Localizer=Montage.specialize({constructor:{value:function Localizer(){this.super()}},init:{value:function(e){return this.locale=e||defaultLocalizer.locale,this}},initWithMessages:{value:function(e,t){return this.locale=e,this.messages=t,this}},messageFormat:{serializable:!1,value:null},_messages:{value:null},messages:{get:function(){return this._messages},set:function(e){if(this._messages!==e){if(null!=e&&"object"!=typeof e)throw new TypeError(e," is not an object");this._messages=e}}},messagesPromise:{serializable:!1,value:null},_locale:{value:null},locale:{get:function(){return this._locale},set:function(e){if(!reLanguageTagValidator.test(e))throw new TypeError("Language tag '"+e+"' is not valid. It must match http://tools.ietf.org/html/rfc5646 (alphanumeric characters separated by hyphens)");this._locale!==e&&(this._locale=e,this.messageFormat=new MessageFormat(e))}},_availableLocales:{value:null},availableLocales:{get:function(){return this._availableLocales?this._availableLocales:this._availableLocales=this._manifest.get("files").get(LOCALES_DIRECTORY).get("files").then(function(e){return Object.keys(e)})}},_require:{value:"undefined"!=typeof global?global.require:"undefined"!=typeof window?window.require:null},require:{serializable:!1,get:function(){return this._require},set:function(e){this._require!==e&&(this.__manifest=null,this._require=e)}},__manifest:{value:null},_manifest:{depends:["require"],get:function(){var e=this.require;return e.packageDescription.manifest===!0?this.__manifest?this.__manifest:this.__manifest=e.async(MANIFEST_FILENAME):Promise.reject(Error("Package has no manifest. "+e.location+'package.json must contain "manifest": true and '+e.location+MANIFEST_FILENAME+" must exist"))}},loadMessages:{value:function(e,t){if(!this.require)throw Error("Cannot load messages as",this,"require is not set");null===e&&(e=5e3),this.messages=null;var n=this;this.require;var r=this._manifest;return e&&(r=r.timeout(e)),this.messagesPromise=r.get("files").then(function(e){return n._loadMessageFiles(e)}).then(function(e){return n._collapseMessages(e)}).fail(function(e){throw console.error("Could not load messages for '"+n.locale+"': "+e),e}).then(function(e){return"function"==typeof t&&t(e),e})}},_loadMessageFiles:{value:function(e){var t=this.require;if(!e)return Promise.reject(Error(t.location+MANIFEST_FILENAME+" does not contain a 'files' property"));var n,r,i,a,o=[];if(!(LOCALES_DIRECTORY in e))return Promise.reject(Error("Package does not contain a '"+LOCALES_DIRECTORY+"' directory"));for(n=e[LOCALES_DIRECTORY].files,r=this._locale;""!==r;)n.hasOwnProperty(r)&&(i=n[r].files,(a=MESSAGES_FILENAME+".js")in i||(a=MESSAGES_FILENAME+".json")in i?o.push(t.async(LOCALES_DIRECTORY+"/"+r+"/"+a)):logger.isDebug&&logger.debug(this,"Warning: '"+LOCALES_DIRECTORY+"/"+r+"/' does not contain '"+MESSAGES_FILENAME+".json' or '"+MESSAGES_FILENAME+".js'")),r=r.substring(0,r.lastIndexOf("-"));if(!o.length)return Promise.reject(Error("Could not find any "+MESSAGES_FILENAME+".json or "+MESSAGES_FILENAME+".js files"));var s=Promise.all(o);if(logger.isDebug){var u=this;s=s.then(function(e){return logger.debug(u,"loaded "+e.length+" message files"),e})}return s}},_collapseMessages:{value:function(e){for(var t={},n=0,r=e.length;r>n;n++){var i=e[n];for(var a in i)a in t||(t[a]=i[a])}return this.messages=t,t}},_compiledMessageCache:{value:Object.create(null)},localizeSync:{value:function(e,t){var n,r,i;if(!e&&!t)throw Error("Key or default message must be truthy, not "+e+" and "+t);if(this._messages&&e in this._messages){if(n=this._messages[e],r=typeof n,"function"===r)return n;if("object"===r){if(!("message"in n))throw Error(n,"does not contain a 'message' property");n=n.message}}else n=t;if(n||(console.warn("No message or default message for key '"+e+"'"),n=e),n in this._compiledMessageCache)return this._compiledMessageCache[n];var a=this.messageFormat.parse(n);return a.program&&a.program.statements&&1===a.program.statements.length&&"string"===a.program.statements[0].type?(i=function(){return n},i.toString=i):i=Function("MessageFormat","return "+this.messageFormat.precompile(a))(MessageFormat),this._compiledMessageCache[n]=i,i}},localize:{value:function(e,t,n,r){var i,a=this;if(n=n===void 0?!0:n,!this.messagesPromise)return i=Promise.resolve(this.localizeSync(e,t)),i.then(r),i;var o=function(){var n=a.localizeSync(e,t);return"function"==typeof r&&r(n),n};return n?this.messagesPromise.then(o,o):this.messagesPromise.then(o)}}}),DefaultLocalizer=Localizer.specialize({init:{value:function(){var e=this.callDelegateMethod("getDefaultLocale");return e||"undefined"==typeof window||(window.localStorage&&(e=window.localStorage.getItem(LOCALE_STORAGE_KEY)),e=e||window.navigator.userLanguage||window.navigator.language),e=e||"en",this.locale=e,this.loadMessages().done(),this}},_delegate:{value:null},delegate:{get:function(){return this._delegate},set:function(e){this._delegate!==e&&(this._delegate=e,this.init())}},locale:{get:function(){return this._locale},set:function(e){try{Object.getPropertyDescriptor(Localizer,"locale").set.call(this,e)}catch(t){e="en",Object.getPropertyDescriptor(Localizer,"locale").set.call(this,e)}"undefined"!=typeof window&&window.localStorage&&window.localStorage.setItem(LOCALE_STORAGE_KEY,e)}},reset:{value:function(){return"undefined"!=typeof window&&window.localStorage&&window.localStorage.removeItem(LOCALE_STORAGE_KEY),this.init(),this._locale}}}),defaultLocalizer=exports.defaultLocalizer=(new DefaultLocalizer).init();exports.localize=defaultLocalizer.localize.bind(defaultLocalizer);var Message=exports.Message=Montage.specialize({constructor:{value:function(){this.defineBinding("_data",{"<-":"_dataObject.toMap()"}),this._data.addMapChangeListener(this,"data")}},init:{value:function(e,t,n){return e&&(this.key=e),t&&(this.defaultMessage=t),n&&(this.data=n),this}},_localizer:{value:defaultLocalizer},localizer:{get:function(){return this._localizer},set:function(e){this._localizer!=e&&(this._localizer=e,this._localize())}},_key:{value:null},key:{get:function(){return this._key},set:function(e){this._key!==e&&(this._key=e,this._localize())}},_defaultMessage:{value:null},defaultMessage:{get:function(){return this._defaultMessage},set:function(e){this._defaultMessage!==e&&(this._defaultMessage=e,this._localize())}},_isLocalizeQueued:{value:!1},_localize:{value:function(){if(!this._isLocalizeQueued){this._isLocalizeQueued=!0;var e=this,t=Promise.defer();this._messageFunction=t.promise,this.localized=this._messageFunction.then(function(t){return t(e._data.toObject())}),Promise.nextTick(function(){return e._isLocalizeQueued=!1,e._key||e._defaultMessage?(t.resolve(e._localizer.localize(e._key,e._defaultMessage)),void 0):(console.warn("Both key and default message are falsey for",e,"If this is in a repetition this warning can be ignored"),t.resolve(EMPTY_STRING_FUNCTION),void 0)})}}},_messageFunction:{value:Promise.resolve(EMPTY_STRING_FUNCTION)},_dataObject:{value:null},_data:{value:null},data:{get:function(){return this._data},set:function(e){this._dataObject!==e&&(this._dataObject=e)}},__localizedResolved:{value:""},_localizedDeferred:{value:Promise.defer()},localized:{get:function(){return this._localizedDeferred.promise},set:function(e){if(e!==this._localized){var t=this,n=Promise.defer();this._localizedDeferred.resolve(n.promise),e.then(n.resolve,n.reject),n.promise.then(function(e){return t.__localizedResolved=e}).done(),this._localizedDeferred=n}}},handleDataMapChange:{value:function(){this.localized=this._messageFunction.fcall(this._data.toObject())}},serializeSelf:{value:function(){var e={_bindingDescriptors:this._bindingDescriptors};return e.key=this._key,e.defaultMessage=this._defaultMessage,this._localizer!==defaultLocalizer&&(e.localizer=this._localizer),e}},serializeForLocalizations:{value:function(e){var t,n,r={};n=FrbBindings.getBindings(this),n&&n.key?(r[KEY_KEY]={},this._serializeBinding(this,r[KEY_KEY],n.key,e)):r[KEY_KEY]=this._key,n&&n.defaultMessage?(r[DEFAULT_MESSAGE_KEY]={},this._serializeBinding(this,r[DEFAULT_MESSAGE_KEY],n.defaultMessage,e)):r[DEFAULT_MESSAGE_KEY]=this._defaultMessage;var i=FrbBindings.getBindings(this._data);t=this._data.toObject();for(var a in t)!t.hasOwnProperty(a)||i&&i[".get('"+a+"')"]||(r.data||(r.data={}),r.data[a]=t[a]);for(var o in i){var s=/\.get\('([^']+)'\)/.exec(o)[1];r.data||(r.data={}),r.data[s]={},this._serializeBinding(this._data,r.data[s],i[o],e)}return r}},_serializeBinding:{value:function(e,t,n,r){if(!("serializable"in n)||n.serializable){var i=n.sourceSyntax;if(n.source!==e){var a=r.addObjectReference(n.source),o=new Scope({type:"component",label:a["@"]});o.components=r,i=expand(i,o)}var o=new Scope;o.components=r;var s=stringify(i,o);n.twoWay?t["<->"]=s:t["<-"]=s,n.converter?t.converter=n.converter:(t.convert=n.convert,t.revert=n.revert),n.trace&&(t.trace=!0)}}}}),createMessageBinding=function(e,t,n,r,i,a){var o=new Message;for(var s in i)"string"==typeof i[s]?o.data.set(s,i[s]):Bindings.defineBinding(o.data,".get('"+s+"')",i[s],{components:a});"object"==typeof n?Bindings.defineBinding(o,"key",n,{components:a}):o.key=n,"object"==typeof r?Bindings.defineBinding(o,"defaultMessage",r,{components:a}):o.defaultMessage=r,Bindings.defineBinding(e,t,{"<-":"__localizedResolved",source:o,serializable:!1})};Serializer.defineSerializationUnit("localizations",function(e,t){var n=FrbBindings.getBindings(t);if(n){var r;for(var i in n){var a=n[i];if(Message.prototype.isPrototypeOf(a.source)){r||(r={});var o=a.source;r[i]=o.serializeForLocalizations(e)}}return r}}),Deserializer.defineDeserializationUnit("localizations",function(e,t,n){for(var r in n){var i,a,o=n[r];KEY_KEY in o?(!logger.isDebug||DEFAULT_MESSAGE_KEY in o||logger.debug(this,"Warning: localized property '"+r+"' does not contain a default message property ("+DEFAULT_MESSAGE_KEY+"), in ",t),i=o[KEY_KEY],a=o[DEFAULT_MESSAGE_KEY],createMessageBinding(t,r,i,a,o.data,e)):console.error("localized property '"+r+"' must contain a key property ("+KEY_KEY+"), in ",n[r])}});