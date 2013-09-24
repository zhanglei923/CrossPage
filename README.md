About
=======
CrossPage is a jQuery plugin focusing on cross iframes access.

Browser Support: IE6+, FireFox, Chrome, Opera, Safari and more.

License
=======
MIT: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)


How to use:
=======
Download latest fancymap.js and include it into your page:

        <script src="/crosspage-latest.min.js"></script>


API
=======


### basic
Get window object by selector:

        $.crosspage.getWin("top");
        $.crosspage.getWin("parent");
        $.crosspage.getWin("self");
        $.crosspage.getWin("//");
        $.crosspage.getWin("./");
        $.crosspage.getWin("../");
        $.crosspage.getWin("../../");		
        $.crosspage.getWin("#1b -> #2a -> #3b -> #4a");
        
        
        $.crosspage.getWin({ 
                from: "../"
                ,page: "#1b -> #2a -> #3b -> #4a"
        });				
        $.crosspage.getWin({ 
                from: "//"
                ,page: "#1b -> #2a -> #3b -> #4a"
        });
        $.crosspage.getWin({ 
                from: "top"
                ,page: "#1b -> #2a -> #3b -> #4a"
        });
        
Get an iframe object by selector from assigned iframe:
        
        $.crosspage.getFrame("parent");
        $.crosspage.getFrame("self");
        $.crosspage.getFrame("//");
        $.crosspage.getFrame("./");
        $.crosspage.getFrame("../");
        $.crosspage.getFrame("../../");		
        $.crosspage.getFrame("#1b -> #2a -> #3b -> #4a");
        
                
        $.crosspage.getFrame({ 
                from: "../"
                ,page: "#1b -> #2a -> #3b -> #4a"
        });				
        $.crosspage.getFrame({ 
                from: "//"
                ,page: "#1b -> #2a -> #3b -> #4a"
        });
        $.crosspage.getFrame({ 
                from: "top"
                ,page: "#1b -> #2a -> #3b -> #4a"
        });

Implement a method in assigned iframe:

        $.crosspage.run({page: '../', iframe:'#right -> #north'}, 'saveUser', userData);
        $.crosspage.run({page: '../', iframe:'#right -> #middle'}, 'util.saveUser', userData);
        $.crosspage.run({
                        page: '../'
                        ,iframe:'#right -> #south'
                        ,pluginQuery: "#usergrid"
                        ,pluginRole: "datagrid"
                        ,pluginFnName: "appendRow"
                }
                , userData
        );
        
Broadcast event between iframes:

1, bind event handles in each local pages:

        $.crosspage.bindEvent('myEvent', function (){
                alert('red alarm!');
        });

2, or, clean them:

        $.crosspage.cleanEvent('myEvent');

3, broadcast(trigger) an event to frames:

        $.crosspage.broadcast('myEvent');//all iframes including 'top' will trigger this event
        $.crosspage.broadcast({page: '../', iframe:'#right -> #north'}, 'myEvent');//trigger this event begin from an assigned iframe

