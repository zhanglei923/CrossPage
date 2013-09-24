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


### Query
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
                page: "../"
                ,iframe: "#1b -> #2a -> #3b -> #4a"
        });				
        $.crosspage.getWin({ 
                page: "//"
                ,iframe: "#1b -> #2a -> #3b -> #4a"
        });
        $.crosspage.getWin({ 
                page: "top"
                ,iframe: "#1b -> #2a -> #3b -> #4a"
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
                page: "../"
                ,iframe: "#1b -> #2a -> #3b -> #4a"
        });				
        $.crosspage.getFrame({ 
                page: "//"
                ,iframe: "#1b -> #2a -> #3b -> #4a"
        });
        $.crosspage.getFrame({ 
                page: "top"
                ,iframe: "#1b -> #2a -> #3b -> #4a"
        });

### Run

Implement a method in assigned iframe:

        $.crosspage.run({page: '../', iframe:'#right -> #north'}, 'saveUser', userData);
        $.crosspage.run({page: '../', iframe:'#right -> #middle'}, 'util.saveUser', userData);
        $.crosspage.run({
                        page: '../'
                        ,iframe: '#right -> #south'
                        ,pluginQuery: "#usergrid"
                        ,pluginRole: "datagrid"
                        ,pluginFnName: "appendRow"
                }
                , userData
        );
        
        
### Broadcast

Broadcast event between iframes:

1, bind event handles in each local pages:

        $.crosspage.bindEvent('myEvent', function (){
                alert('red alarm!');
        });

2, or, clean them:

        $.crosspage.cleanEvent('myEvent');

3, broadcast(trigger) an event to frames:

        //all iframes including 'top' will trigger this event
        $.crosspage.broadcast('myEvent');
        
        //trigger this event begin from an assigned iframe
        $.crosspage.broadcast({page: '../', iframe:'#right -> #north'}, 'myEvent');

