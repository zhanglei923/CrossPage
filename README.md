About
=======

If your page is made by iframes or including iframe page, you can use CrossPage to simplify your developing which can let your function invoking as easy as in one single page.

CrossPage is designed to work in nested iframes, it's another useful ability is to broadcast customized events from one frame to other frames, no matter how deep it is.

Browser Support: IE6+, FireFox, Chrome, Opera, Safari and more.

License
=======
MIT: [http://www.opensource.org/licenses/mit-license.php](http://www.opensource.org/licenses/mit-license.php)


How to use:
=======
Make sure ALL of your iframe pages included this file, then have try the power of cross page!

        <script src="/crosspage-latest.min.js"></script>
        


API
=======

### Invoke

Invoke function from a target iframe assigned by selector(see 'selector' below for details):

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

### Set url:
        
        $.crosspage.setSrc(Selector, 'http://my-url.com');


### Selector defination:
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


### Get object
Get target frame window by selector:

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

