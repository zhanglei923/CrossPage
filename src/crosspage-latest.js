/* 
 * CrossPage 0.51
 * https://github.com/zhanglei923/CrossPage/
 * Date: 2014-03-04 
 * 
 * Copyright (c) 2014 ZhangLei
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
	var ARROW = '->';
	
	var me = $[NAMESPACE] = {};
	
	{//id
		var getKey = function (){
			return KEY;
		}
	}
	{//win
		var getWinOld = function(conStr, query){
			var conWin = getContainerWin(conStr);
			if(typeof query == 'undefined' || !query){
				return conWin;
			}else if(conWin && conWin.jQuery[NAMESPACE]){
				var w = (conWin.jQuery[NAMESPACE].getChildWin)(query);
				return w;
			}
		};
		var getContainerWin = function (str){
			if(!str)return;
			str = trim(str);
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
		var getChildWin = function (query){
			var ARROW = '->';
			var arr = query.split(ARROW);
			if(arr.length == 0)return;//invalid
			
			var query_str = arr[0];
			query_str = trim(query_str);
			var iframe = $(window.document.body).find(query_str).get(0);
			if(!iframe)return;
			
			if(arr.length > 1){
				var i = query.indexOf(ARROW);
				var s = query.substring(i + ARROW.length);
				s = trim(s);
				var win = iframe.contentWindow;
				return (win.jQuery[NAMESPACE].getChildWin)(s);
			}else{
				return iframe ? iframe.contentWindow : null;
			}		
		};
		var getWin = function (sel){
			if(!sel)return null;
			if(typeof sel == 'undefined')return window;
			if(typeof sel == 'string')sel = trim(sel);
			
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
	}
	{//frame
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
		var foreachFrame = function (fn){
			var list = document.getElementsByTagName("iframe");
			var err = false;
			for(var i = 0, len = list.length; i < len; i++){
				try{
					(fn)( list[i] );
				}catch(e){
					//do not throw error, will block for looping which it should NOT
				}
			}
		};
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
			if(typeof sel == 'string')sel = trim(sel);
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
		var setSrc = function (sel, src){
			var f = getFrame(sel);
			if(f)f.src = src;
		};
	}
	{//run()
		var getUserArgs = function(args){
			if(args.length < 2){
				throw "invalid arguments: $.crosspage.getUserArgs.argument.length < 2";
				return;
			}
			//way1: fn(sel, fn_name, *arg0, *arg1, *arg2,...)
			//way2: fn(sel, fn_name, [arg0, arg1, arg2, ...])
			//way3: fn(sel, {*target: "widget1", *role:"datagrid", fnName: "add", params: ["param1", "param2"]})
			var user_args = [];
			var fn_name = '';
			var target;
			var role;
			
			if(!args[1].fnName){
				//way2:
				if(isArray(args[2]) && args.length == 3){
					fn_name = args[1];
					user_args = args[2];
				}else{
					//way1:
					fn_name = args[1];
					for(i = 2, len = args.length; i < len; i++){
						var a = args[i];
						user_args[user_args.length] = a;
					}
				}
			}
			//way3:
			if(args.length == 2 && args[1].fnName){
				
				var arg2 = args[1];
				target = arg2.target;
				fn_name = arg2.fnName;
				user_args = arg2.params;
				role = arg2.role;
			}
			return {
				  target: target
				, fname: fn_name
				, uargs: user_args
				, role: role
			};
		};
		var getStdSel = function(sel){
			if(typeof sel == 'string')sel = trim(sel);
			var std_sel = {};
			if(getSelType(sel) == CONT_TYPE){//container
				std_sel.page = sel;
				std_sel.iframe = null;
			}else if(getSelType(sel) == CHILD_TYPE){//child
				std_sel.page = null;
				std_sel.iframe = sel;
			}else if(getSelType(sel) == MIX_TYPE){//mixed
				std_sel = sel;
			}
			//trim
			if(std_sel.page)std_sel.page = trim(std_sel.page);
			if(std_sel.iframe)std_sel.iframe = trim(std_sel.iframe);
			//'null' means self
			if(std_sel.page == './')std_sel.page = null;
			if(std_sel.page == 'self')std_sel.page = null;
			if(std_sel.page == '//')std_sel.page = 'top';
			checkSel(sel);
			if(isTop())std_sel.page = null;			
			
			return std_sel;
		};
		function checkSel(sel){
			if(isTop() && sel.page){
				if(sel.page != 'top' && sel.page != '//'){
					throw 'error: reached top but still can not find: "' + sel.page+'"';
				}
			}
		}
		function getNextSel(sel){//get sel for next page, or return true if this page is already the target one
			var is = false;
			var page = trim(sel.page);
			var iframe = trim(sel.iframe);
			
			if(page == 'self')page = sel.page = null;//'null' means no need to find any more
			
			if(page){
				if(page == 'top'){
					if(isTop()){
						sel.page = null;
					}
					return sel;
				}else
				if(page == 'parent' || page == '../'){
					sel.page = null;
					return sel;
				}else
				if(page.indexOf('../') >= 0){
					var arr = page.split('../');
					var s = '';
					for(var i = 0 , len = arr.length - 2; i < len; i++){
						s = s + '../'
					}
					sel.page = s;
					return sel;
				}
			}else if(iframe){
					var arr = iframe.split(ARROW);
					if(arr.length == 0)return;//invalid
					for(var i = 1 , len = arr.length - 2; i < len; i++){
						s = s + '../'
					}
					return sel;
			}
		}
		//way1: invoke({page: '', iframe:'', target: "goalCardController", fnName: "add", params: ["param1", "param2"]});
		//way2: invoke({at: {page: '', iframe:''}, target: "goalCardController", fnName: "add", params: ["param1", "param2"]});
		var invoke = function (o){
			var sel = {};
			var info = {};
			if(o.at){//way2
				sel = o.at;
			}else{//way1
				sel.page = o.page;
				sel.iframe = o.iframe;
			}
			info.target = o.target;
			info.fnName = o.fnName;
			info.params = o.params ? o.params : [];
			run(sel, info);
		};
		var run = function (sel){
			var thisSel = getStdSel(sel);//standard
			var info = getUserArgs(arguments);
			//var fn_name = info.fname;
			//var user_args = info.uargs;
			return handleRun(thisSel, info);
		};
		function handleRun(sel, info){
			checkSel(sel);
			if(!sel.page && !sel.iframe){//self
				return runFn(sel, info);//(window[fn_name])();
			}
			if(sel.page){//go up
				var nextSel = getNextSel(sel);
				var p = parent;
				var jq = p.jQuery;
				var cp = jq[NAMESPACE];
				var fn = cp.handleRun;
				var result = (fn)(nextSel, info);
				var result0 = result;
				{
					fn = jq = cp = p = result = null;
					delete cp;
					delete fn;
					delete jq;
					delete p;
					delete result;
				}
				return result0;
			}else{//go down
				var nextSel = sel;
				var query = sel.iframe;				
				var obj = parseIframeQuery(query);				
				var ifObj = getIframe(obj.id);
				if(ifObj){
					nextSel.iframe = obj.next;
					var win = ifObj.contentWindow;
					var jq = win.jQuery;
					var cp = jq[NAMESPACE];
					var fn = cp.handleRun;
					var result = (fn)(nextSel, info);
					var result0 = result;
					{
						ifObj = fn = jq = cp = win = result = null;
						delete ifObj;
						delete fn;
						delete cp;
						delete jq;
						delete win;
						delete result;
					}
					return result0;
				}else{
					throw "can not find iframe at:" + (sel.page?sel.page:'') + ', ' + (sel.iframe?sel.iframe:'');
				}
			}
		};	
		var runFn = function (sel, info){
			if(info.target){
				return runAsPlugin(sel, info);
			}else{
				return runAsEval(sel, info);
			}
		};
		var targetExist = function(query){
			return ($(query).size()>0)? true:false;
		}
		var runAsPlugin = function (sel, info){
			var fn_name = info.fname;
			var args = info.uargs;
			if(!args)args = [];
			if(args && !isArray(args))args = [args];
			var target = info.target;
			if(!targetExist(target) && target.indexOf('#')<0)target = '#' + target;;
			var role = info.role;
			//alert(role);
			
			var argstr = '';
			var runstr = '';
			if(role){
				for(i = 0, len = args.length; i < len; i++)
				argstr = argstr + ', args['+i+']';
				runstr = '$("'+target+'").'+role+'("'+fn_name+'"' + argstr + ');';
			}else{
				for(i = 0, len = args.length; i < len; i++)
				argstr = argstr + (i==0?'':',') + ' args['+i+']';
				runstr = '$("'+target+'").'+fn_name+'(' + argstr + ');';
			}
			runstr = 'var result = '+runstr;
			eval(runstr);
			return result;
		};
		var runAsEval = function (sel, info){
			var fn_name = info.fname;
			var args = info.uargs;
			try{
				var result;
				eval('result = window.'+fn_name+'.apply(this, args);');
				return result;
			}catch(e){
				try{
					eval(fn_name);
				}catch(e){
					var err = "error when running: \"" + window.location.href + '\" '+fn_name+'();';
					throw err;
				}
			}
		};
	}
	{//sel
		var ARROW = '->';
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
		};
		function parseIframeQuery(str){//'XXX -> XXX -> XXX'
			var arr = str.split(ARROW);
			var id;
			var next;
			if(arr.length >= 2){
				id = trim(arr[0]);
				next = str.substring(str.indexOf(ARROW)+2, str.length);
				next = trim(next);
			}else{
				id = str;
				next = null;
			}
			return {
				id: id
				,next: next
			}
		};
	}
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
			run(sel, '$.crosspage.broadcastImpl', ename);
			//var win = getWin(sel);
			//if(win)
			//(win.jQuery[NAMESPACE].broadcastImpl)(ename);//assigned container
		};
		var broadcastImpl = function (ename){
			fireEvent(ename);//run
			//
			foreachFrame(function (frame){
				if(hasCross(frame)){
					var win = frame.contentWindow;
					var jq = win.jQuery;
					var jqcp = jq[NAMESPACE];
					var fn = jqcp.broadcastImpl;
					(fn)(ename);
					{
						win = jq = jqcp = fn = null;
						delete win;
						delete jq;
						delete jqcp;
						delete fn;
					}
				}
				frame = null;
				delete frame;
			});
		};
	}
	{
		function trim(str){
			if(!str)return str;
		    return str.replace(/(^\s*)|(\s*$)/g, "");
		}
		function ltrim(str){
			if(!str)return str;
		    return str.replace(/(^\s*)/g,"");
		}
		function rtrim(str){
			if(!str)return str;
		    return str.replace(/(\s*$)/g,"");
		}
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
		var isArray = function (o) {
			if(!o) return false;
	    	if(typeof o != 'object') return false;
	        return Object.prototype.toString.call(o) === '[object Array]';
	    };
	}
	function getIframe(id){
		id = getId(id);
		return document.getElementById(id);
	}
	function getId(id){
		if(!id)return;
		id = trim(id);
		if(id.indexOf('#')<0){
			id = id;
		}else{
			id = id.substring(1, id.length);
		}
		return id;
	}	
	
	function debug(s){
		alert($('button').html()+'\n'+s);
	}
	
	
	me.broadcast = broadcast;
	me.broadcastImpl = broadcastImpl;
	me.bind = me.bindEvent = bindEvent;
	me.fire = me.fireEvent = fireEvent;
	me.clean = me.cleanEvent = cleanEvent;
	
	
	//public
	me.getFrame = getFrame;
	me.getWin = getWin;
	me.getChildWin = getChildWin;
	me.foreachFrame = foreachFrame;
	
	me.run = run;
	me.invoke = invoke;
	me.runFn = runFn;
	me.handleRun = handleRun;
	
	me.getFrameByKey = getFrameByKey;
	me.getKey = getKey;
	
	me.setSrc = setSrc;
})(jQuery);