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
>[put](#put),
>[get](#get),
>[getByIndex](#getByIndex),
>[has](#has),
>[getKeys](#getKeys),
>[getKeyIndex](#getKeyIndex),
>[getKeysByVal](#getKeysByVal),
>[putAll](#putAll),
>[each](#each),
>[size](#size),
>[remove](#remove),
>[clean](#clean)


### put()<span id="put"></span>
Put any type of content into the map, even a 'null' or an 'undefined' is acceptable:

        var map = new FancyMap();
        map.put('a', 1);
        map.put('b', 2);
        map.put('c', null);
        map.put('d', 'hello');
        map.put('e', undefined);
        
        alert(map.size());//alert is 5
        alert(map.has('c'));//alert is true

Content with a duplicated key will be replaced by the last one:

        var map = new FancyMap();
        map.put('a', 1);
        map.put('b', 2);
        map.put('a', 3);//<--duplicate
        
        alert(map.get('a'));//alert is 3


