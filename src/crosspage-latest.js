/* 
 * CrossPage 0.2
 * https://github.com/zhanglei923/CrossPage/
 * Date: 2013-09-24 
 * 
 * Copyright (c) 2013 ZhangLei
 * 
 * Author: ZhangLei
 * Homepage: https://github.com/zhanglei923 
 * Email: zhang.lei.923@gmail.com 
 * 
 * Under the term of the MIT License
 * http://www.opensource.org/licenses/mit-license.php
*/
(function($) {
	var NAMESPACE = 'crosspage';
	var KEY = '' + Math.random();
	
	var me = $[NAMESPACE] = {};
	
	//
	var getDepth = function(){
		if(isTop()) return 0;
		var dep = 1;
		var p = parent;
		while(top.location != p.location){
			p = p.parent;
			dep++;
		}
		return dep;
	};
	var getWinOld = function(conStr, query){
		var conWin = getContainerWin(conStr);
		if(typeof query == 'undefined' || !query){
			return conWin;
		}else if(conWin && conWin.jQuery[NAMESPACE]){
			var w = (conWin.jQuery[NAMESPACE].getChildWin)(query);
			return w;
		}
	};
	var getKey = function (){
		return KEY;
	}
	me.getKey = getKey;
	
	var getFrameByKey = function (key){
		var frame;
		foreachFrame( function (f){
			var jq = f.contentWindow.jQuery;
			if(jq && (jq[NAMESPACE].getKey)() == key){
				frame = f;
			}
		});
		return frame;
	}
	me.getFrameByKey = getFrameByKey;
	
	var getFrameByWin = function (win){
		try{
			if(win && win.parent && win.parent.jQuery){
				var frame = win.parent.jQuery[NAMESPACE].getFrameByKey(win.jQuery[NAMESPACE].getKey());
				return frame;
			}
		}catch(e){
			throw new Error("getFrameByWin(): cross domain");
		}
		return null;
	}
	var getFrame = function (sel){
		if(!sel || typeof sel == 'undefined')return null;
		if(typeof sel == 'string')sel = $.trim(sel);
		if(getSelType(sel) == CONT_TYPE){//container
			var win = getContainerWin(sel);
			if(isTop(win))return null;//top has no frame
			return getFrameByWin(win);
		}
		if(getSelType(sel) == CHILD_TYPE){//child
			var win = getChildWin(sel);
			return getFrameByWin(win);
		}
		if(getSelType(sel) == MIX_TYPE){//mixed
			var con = sel.page;
			var page = sel.iframe;
			if(!con)con = 'self'
			var win = getWinOld(con, page);
			return getFrameByWin(win); 
		}
	};
	
	var getWin = function (sel){
		if(!sel)return null;
		if(typeof sel == 'undefined')return window;
		if(typeof sel == 'string')sel = $.trim(sel);
		
		if(getSelType(sel) == CONT_TYPE){//container
			var win = getContainerWin(sel);
			if(!win) throw 'can not find iframe window: "'+sel+'"';
			return win;
		}
		if(getSelType(sel) == CHILD_TYPE){//child
			var win = getChildWin(sel);
			if(!win) throw 'can not find iframe window: "'+sel+'"';
			return win;
		}
		if(getSelType(sel) == MIX_TYPE){//mixed
			var con = sel.page;
			var page = sel.iframe;
			if(!con)con = 'self';
			var win = getWinOld(con, page);
			if(!win) throw 'can not find iframe window at page:"'+con+'", iframe:"'+page+'"';
			return win;
		}
	}
	var CONT_TYPE = 'CON';
	var CHILD_TYPE = 'CHILD';
	var MIX_TYPE = 'MIX';
	
	var conKeys = [];
	conKeys['top'] = true;
	conKeys['parent'] = true;
	conKeys['self'] = true;
	conKeys['//'] = true;
	conKeys['./'] = true;
	
	var getSelType = function (sel){
		if(typeof sel == 'object')return MIX_TYPE;
		if(conKeys[sel])return CONT_TYPE;
		else if(sel && sel.indexOf('parent')>=0)return CONT_TYPE;
		else if(sel && sel.indexOf('./')>=0)return CONT_TYPE;
		else if(sel && sel.indexOf('->')>=0)return CHILD_TYPE;
		else return CHILD_TYPE;
	}
	var foreachFrame = function (fn){
		var list = document.getElementsByTagName("iframe");
		for(var i = 0, len = list.length; i < len; i++){
			try{
				(fn)( list[i] );
			}catch(e){
				throw new Error("foreachFrame(): cross domain");
			}
		}
	};
	var run = function (sel, fname){
		var args = arguments;
		var win = getWin(sel);
		return (win.jQuery[NAMESPACE].runFn)(sel, args);
	};
	var runFn = function (sel, args){
		if(sel.pluginQuery){
			return runAsPlugin(sel, args);
		}else{
			return runAsEval(sel, args);
		}
	};
	me.runFn = runFn;
	
	var runAsPlugin = function (sel, args){
		var query = sel.pluginQuery;
		var role = sel.pluginRole;
		var fname = sel.pluginFnName;
		
		var argstr = '';
		if(args.length > 1)
		for(i = 1, len = args.length; i < len; i++){
			//fargs[fargs.length] = args[i];
			argstr = argstr + ', args['+i+']';
		}
		var str = '$("'+query+'").'+role+'("'+fname+'"' + argstr + ');';
		
		eval('var result = '+str);
		return result;
	};
	var runAsEval = function (sel, args){
		//
		var sel = args[0];
		var fname = args[1];
		//
		var fargs = [];
		if(args.length > 2)
		for(i = 2, len = args.length; i < len; i++){
			//alert(i+','+arguments[i]);
			fargs[fargs.length] = args[i];
		}
		try{
			var result;
			eval('result = window.'+fname+'.apply(this, fargs);');
			return result;
		}catch(e){
			try{
				eval(fname);
			}catch(e){
				var err = "error when running: \"" + window.location.href + '\" '+fname+'();';
				throw err;
			}
		}
	};
	
	var getChildWin = function (query){
		var ARROW = '->';
		var arr = query.split(ARROW);
		if(arr.length == 0)return;//invalid
		
		var query_str = arr[0];
		query_str = $.trim(query_str);
		var iframe = $(window.document.body).find(query_str).get(0);
		if(!iframe)return;
		
		if(arr.length > 1){
			var i = query.indexOf(ARROW);
			var s = query.substring(i + ARROW.length);
			s = $.trim(s);
			var win = iframe.contentWindow;
			return (win.jQuery[NAMESPACE].getChildWin)(s);
		}else{
			return iframe ? iframe.contentWindow : null;
		}		
	};
	var isLoaded = function (){
		
	};
	var getContainerWin = function (str){
		if(!str)return;
		str = $.trim(str);
		if(str == './' || str == 'self')return window;
		if(str == '//' || str == 'top')return top;
		if(str == 'parent') return parent;
		var arr = str.split('../');
		if(arr.length == 0)return;//invalid
		
		var win = window;
		var count = arr.length-1;
		while(count > 0){
			if(isTop(win)){
				if(count >= 1)return;//reached top but not end
			}else{
				win = win.parent;
				count--;
			}
		}
		return win;
	};
	{//broadcast
		var ePool = [];
		
		var bindEvent = function (ename, fn){
			var fnarr = ePool[ename];
			if(!fnarr)fnarr = [];
			fnarr[fnarr.length] = fn;
			ePool[ename] = fnarr;
		};
		var fireEvent = function (ename){
			var fnarr = ePool[ename];
			if(fnarr && fnarr.length > 0){
				for(var i=0, len = fnarr.length; i < len; i++){
					var fn = fnarr[i];
					(fn)();
				}
			}
		};
		var cleanEvent = function (ename){
			ePool[ename] = [];
		};
		
		
		var broadcast = function (arg0, arg1){
			var sel, ename;
			if(typeof arg1 != 'undefined'){
				sel = arg0;
				ename = arg1;
			}else{
				sel = 'top';
				ename = arg0;
			}
			var win = getWin(sel);
			if(win)
			(win.jQuery[NAMESPACE].broadcastImpl)(ename);//assigned container
		};
		var broadcastImpl = function (ename){
			fireEvent(ename);//run
			//
			foreachFrame(function (frame){
				if(hasCross(frame)){
					var win = frame.contentWindow;
					(win.jQuery[NAMESPACE].broadcastImpl)(ename);
				}
			});
		};
		me.broadcastImpl = broadcastImpl;
	}
	
	{
		var isTop = function (win){
			if(typeof win == 'undefined')win = window;
			return (top.location == win.location);
		};

		var hasCross = function (frame){
			if(frame.contentWindow.jQuery && frame.contentWindow.jQuery[NAMESPACE]){
				return true;
			}else{
				return false;
			}
		};
	}
	
	//public
	me.getFrame = getFrame;
	me.getWin = getWin;
	//me.getWinOld = getWinOld;
	me.getChildWin = getChildWin;
	me.foreachFrame = foreachFrame;
	me.getDepth = getDepth;
	me.broadcast = broadcast;
	me.run = run;
	
	me.bindEvent = bindEvent;
	me.fireEvent = fireEvent;
	me.cleanEvent = cleanEvent;
})(jQuery);
