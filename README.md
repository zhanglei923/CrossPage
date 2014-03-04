About
=======
CrossPage is a jQuery plugin focusing on invoke functions between nested iframes, it's another useful ability is broadcast customized events cross iframes.

The goal of CrossPage is to let your iframe making page feels like one single page.

Browser Support: IE6+, FireFox, Chrome, Opera, Safari and more.

License
=======
MIT: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)


How to use:
=======
Download latest code and include it into your pages, and make sure ALL of your iframe pages included this file:

        <script src="/crosspage-latest.min.js"></script>


API
=======

### Selector:
A selector is the indicator to find the target page as the implementation context.

        'top'               //top page
        'parent'            //parent page
        'self'              //current page
        './'                //equals 'self'
        '//'                //equals 'top'
        '../'               //equals 'parent'
        '../../'            //parent's parent
        -------------------
        '#f0 -> #f1 -> #f2' //deeply find child iframe of each page devide by '->' 
        -------------------
        {page:'top'}        //top page
        {page:'top', iframe:'#f1'}                  //find #f1 in top
        {page:'top', iframe:'#f0 -> #f1 -> #f2'}    //deeply find child iframe by '->' indicator started from top page.
        {page:'../../', iframe:'#f0 -> #f1 -> #f2'} //deeply find child iframe by '->' indicator started from parent's parent page.


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
        
Get iframe object by selector of assigned iframe:
        
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
        
Change url:

        $.crosspage.setSrc({ 
                page: "top"
                ,iframe: "#1b -> #2a -> #3b -> #4a"
        }, 'http://my-url.com');

### Run

Implement a method in assigned iframe:

        $.crosspage.run(Selector, 'fnName');
        $.crosspage.run(Selector, 'fnName', arg0, arg1, arg2, ...);
        $.crosspage.run(Selector, 'fnName', [arg0, arg1, arg2, ... ]);
        $.crosspage.run(Selector, 'fnName', arg0, arg1);
        $.crosspage.run(Selector, {fnName: 'fnName', params:[arg0, arg1, arg2, ...]});


Broadcast:

        $.crosspage.bindEvent('myEvent', function (){
                alert('red alarm!');
        });
        
        $.crosspage.cleanEvent('myEvent');
        $.crosspage.broadcast('myEvent');
        $.crosspage.broadcast(Selector, 'myEvent');

Src:
        $.crosspage.setSrc(Selector, 'http://my-url.com');

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

