var sys = require("sys"), sax = require("./sax");


parser = sax.parser(false);

sax.EVENTS.forEach(function (ev) {
    parser["on" + ev] = function() { sys.puts(sys.inspect(arguments)); };
});

parser.write("<span>Welcome,</span> to monkey land").close();
