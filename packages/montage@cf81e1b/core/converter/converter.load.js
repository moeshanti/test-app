montageDefine("cf81e1b","core/converter/converter",{dependencies:["../core"],factory:function(e,t){var n=e("../core").Montage,i="[object Number]",s=Object.prototype.toString,a=function(e){return s.call(e)===i};t.isNumber=a;var r=function(e){return e&&e!==void 0};t.isDef=r,t.Validator=n.specialize({validate:{value:null}}),t.Converter=n.specialize({allowPartialConversion:{value:!0},convert:{enumerable:!1,value:null},revert:{enumerable:!1,value:null}},{blueprintModuleId:e("../core")._blueprintModuleIdDescriptor,blueprint:e("../core")._blueprintDescriptor})}});