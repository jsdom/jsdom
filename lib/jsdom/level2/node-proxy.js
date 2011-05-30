cssom = require("cssom"),
cssom2 = require("cssom").CSSStyleDeclaration,
Proxy = require("node-proxy");

//modifew tmp
//modif - taken from old domtohtml.js

var singleTags = {
    area: 1,
    base: 1,
    basefont: 1,
    br: 1,
    col: 1,
    frame: 1,
    hr: 1,
    img: 1,
    input: 1,
    isindex: 1,
    link: 1,
    meta: 1,
    param: 1,
    embed: 1
};

var expr = {
  upperCaseChars: /([A-Z])/g,
  breakBetweenTags: /(<(\/?\w+).*?>)(?=<(?!\/\2))/gi,
  singleTag: (function() {
      var tags = [];
      for (var i in singleTags) {
          tags.push(i);
      }
      return new RegExp('<' + tags.join('|<'), 'i');
  })()
};

var uncanon = function(str, letter) {
    return '-' + letter.toLowerCase();
};

//modif

createProxyFunction = function(handlers, callTrap, constructorTrap) {

      return Proxy.createFunction({
	  
	  get: function (receiver, name){
	  console.log('get '+handlers.length+' '+name);
          if (!(name in handlers)) {
            return "undefined";
          };
		  return (handlers[name]|| "undefined");
        },
	  
        set: function (receiver, name, val){
		  if (name=='prototype') {
		  for (var n in val) {
		  handlers[n]=val[n];
		  }
		  } else {
		  console.log('set '+name.replace(expr.upperCaseChars, uncanon)+' '+val);
			try {
		  handlers.setProperty(name.replace(expr.upperCaseChars, uncanon),val);	
		  } catch(ee) {console.log('erreur '+ee.description);};
		  }
		  
          return true;
        }
      }, callTrap);
    }

console.log('node-proxy');

cssom.CSSStyleDeclaration=function() {console.log('new cssom');var tmp=createProxyFunction({length:0,_importants:{}},function() {});tmp.prototype=cssom2.prototype;return tmp};

//cssom.CSSStyleDeclaration.test='test';

//cssom.CSSStyleDeclaration.prototype=cssom2.prototype;

//var tmp=new cssom.CSSStyleDeclaration;

//console.log(tmp.setProperty);

//tmp.essai='essai';

console.log('proxy');






