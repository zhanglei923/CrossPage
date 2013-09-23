About
=======
CrossPage is light javascript util focusing on iframe access.

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


