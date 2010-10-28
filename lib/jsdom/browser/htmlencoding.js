
/* {{{ Encoding Methods borrowed from PHP.js
http://phpjs.org/pages/license/#MIT

 * More info at: http://phpjs.org
 *
 * This is version: 3.09
 * php.js is copyright 2010 Kevin van Zonneveld.
 *
 * Portions copyright Brett Zamir (http://brett-zamir.me), Kevin van Zonneveld
 * (http://kevin.vanzonneveld.net), Onno Marsman, Theriault, Michael White
 * (http://getsprink.com), Waldo Malqui Silva, Paulo Ricardo F. Santos, Jack,
 * Jonas Raoni Soares Silva (http://www.jsfromhell.com), Philip Peterson,
 * Legaev Andrey, Ates Goral (http://magnetiq.com), Alex, Ratheous, Martijn
 * Wieringa, Nate, Philippe Baumann, lmeyrick
 * (https://sourceforge.net/projects/bcmath-js/), Enrique Gonzalez,
 * Webtoolkit.info (http://www.webtoolkit.info/), Jani Hartikainen, travc, Ole
 * Vrijenhoek, Ash Searle (http://hexmen.com/blog/), Carlos R. L. Rodrigues
 * (http://www.jsfromhell.com), d3x,
 * http://stackoverflow.com/questions/57803/how-to-convert-decimal-to-hex-in-javascript,
 * pilus, stag019, WebDevHobo (http://webdevhobo.blogspot.com/), Michael
 * Grier, Erkekjetter, T.Wild, Andrea Giammarchi
 * (http://webreflection.blogspot.com), marrtins, GeekFG
 * (http://geekfg.blogspot.com), Johnny Mast (http://www.phpvrouwen.nl),
 * gorthaur, Michael White, majak, Steve Hilder, Oleg Eremeev, Martin
 * (http://www.erlenwiese.de/), gettimeofday, Joris, Steven Levithan
 * (http://blog.stevenlevithan.com), Tim de Koning (http://www.kingsquare.nl),
 * KELAN, Arpad Ray (mailto:arpad@php.net), Breaking Par Consulting Inc
 * (http://www.breakingpar.com/bkp/home.nsf/0/87256B280015193F87256CFB006C45F7),
 * Josh Fraser
 * (http://onlineaspect.com/2007/06/08/auto-detect-a-time-zone-with-javascript/),
 * Chris, Marc Palau, Public Domain (http://www.json.org/json2.js), saulius,
 * Aman Gupta, Pellentesque Malesuada, Mailfaker (http://www.weedem.fr/), Caio
 * Ariede (http://caioariede.com), Thunder.m, Alfonso Jimenez
 * (http://www.alfonsojimenez.com), AJ, mdsjack (http://www.mdsjack.bo.it),
 * Lars Fischer, Kankrelune (http://www.webfaktory.info/), Felix Geisendoerfer
 * (http://www.debuggable.com/felix), Tyler Akins (http://rumkin.com), Mirek
 * Slugen, Robin, Karol Kowalski, Paul Smith, Sakimori, David, noname, Marco,
 * Douglas Crockford (http://javascript.crockford.com), Scott Cariss,
 * class_exists, marc andreu, Steve Clay, Francois, nobbler, David James,
 * Arno, madipta, Fox, mktime, ger, Nathan, felix, Frank Forte, Slawomir
 * Kaniecki, john (http://www.jd-tech.net), Nick Kolosov (http://sammy.ru),
 * Mateusz "loonquawl" Zalega, ReverseSyntax, nord_ua, T. Wild, Thiago Mata
 * (http://thiagomata.blog.com), Linuxworld, lmeyrick
 * (https://sourceforge.net/projects/bcmath-js/this.), Jon Hohle, Pyerre,
 * MeEtc (http://yass.meetcweb.com), Peter-Paul Koch
 * (http://www.quirksmode.org/js/beat.html), T0bsn, Soren Hansen, djmix,
 * Lincoln Ramsay, Sanjoy Roy, sankai, Denny Wardhana, 0m3r, Subhasis Deb,
 * Bayron Guevara, paulo kuong, duncan, Gilbert, Brad Touesnard, Tim Wiel,
 * Marc Jansen, Francesco, Stoyan Kyosev (http://www.svest.org/), J A R, Paul,
 * Ole Vrijenhoek (http://www.nervous.nl/), Raphael (Ao RUDLER), kenneth, Hyam
 * Singer (http://www.impact-computing.com/), LH, JB, JT, Thomas Beaucourt
 * (http://www.webapp.fr), David Randall, Bryan Elliott, date, Ozh, Eugene
 * Bulkin (http://doubleaw.com/), Der Simon
 * (http://innerdom.sourceforge.net/), echo is bad, XoraX
 * (http://www.xorax.info), Matt Bradley, Itsacon (http://www.itsacon.net/),
 * Saulo Vallory, Kristof Coomans (SCK-CEN Belgian Nucleair Research Centre),
 * Pierre-Luc Paour, Kirk Strobeck, Martin Pool, Christoph, Daniel Esteban,
 * Artur Tchernychev, Wagner B. Soares, Valentina De Rosa, strftime, Jason
 * Wong (http://carrot.org/), Brant Messenger
 * (http://www.brantmessenger.com/), Rick Waldron, Bug?, Anton Ongson, Simon
 * Willison (http://simonwillison.net), Marco van Oort, Gabriel Paderni, Blues
 * (http://tech.bluesmoon.info/), Luke Godfrey, rezna, Mick@el, Tomasz
 * Wesolowski, Eric Nagel, Pul, Bobby Drake, uestla, Alan C, Ulrich, Yves
 * Sucaet, sowberry, Norman "zEh" Fuchs, hitwork, Zahlii, johnrembo, Nick
 * Callen, ejsanders, Aidan Lister (http://aidanlister.com/), Brian Tafoya
 * (http://www.premasolutions.com/), Philippe Jausions
 * (http://pear.php.net/user/jausions), Rob, Orlando, HKM, metjay, strcasecmp,
 * strcmp, Taras Bogach, jpfle, ChaosNo1, Alexander Ermolaev
 * (http://snippets.dzone.com/user/AlexanderErmolaev), dptr1988, kilops, Le
 * Torbi, James, DxGx, Pedro Tainha (http://www.pedrotainha.com), Philipp
 * Lenssen, penutbutterjelly, FGFEmperor, baris ozdil, Greg Frazier, Alexander
 * M Beedie, Tod Gentille, gabriel paderni, Yannoo, Maximusya, Atli Þór,
 * daniel airton wermann (http://wermann.com.br), jakes, 3D-GRAF, Riddler
 * (http://www.frontierwebdev.com/), T.J. Leahy, Matteo, stensi, Billy, Jalal
 * Berrami, vlado houba, Victor, fearphage
 * (http://http/my.opera.com/fearphage/), Luis Salazar
 * (http://www.freaky-media.com/), FremyCompany, Tim de Koning, taith, Cord,
 * Manish, davook, Benjamin Lupton, Russell Walker (http://www.nbill.co.uk/),
 * Garagoth, Andrej Pavlovic, rem, Dino, Jamie Beck (http://www.terabit.ca/),
 * DtTvB (http://dt.in.th/2008-09-16.string-length-in-bytes.html), Michael,
 * Christian Doebler, setcookie, YUI Library:
 * http://developer.yahoo.com/yui/docs/YAHOO.util.DateLocale.html, Andreas,
 * Blues at http://hacks.bluesmoon.info/strftime/strftime.js, meo, Greenseed,
 * Luke Smith (http://lucassmith.name), Rival, Diogo Resende, Allan Jensen
 * (http://www.winternet.no), Howard Yeend, Kheang Hok Chin
 * (http://www.distantia.ca/), Jay Klehr, Leslie Hoare, mk.keck, Ben Bryan,
 * booeyOH, Amir Habibi (http://www.residence-mixte.com/), Cagri Ekin
 *
 * Dual licensed under the MIT (MIT-LICENSE.txt)
 * and GPL (GPL-LICENSE.txt) licenses.
 *
 * Permission is hereby granted, free of charge, to any person obtaining a
 * copy of this software and associated documentation files (the
 * "Software"), to deal in the Software without restriction, including
 * without limitation the rights to use, copy, modify, merge, publish,
 * distribute, sublicense, and/or sell copies of the Software, and to
 * permit persons to whom the Software is furnished to do so, subject to
 * the following conditions:
 *
 * The above copyright notice and this permission notice shall be included
 * in all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
 * OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
 * MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 * IN NO EVENT SHALL KEVIN VAN ZONNEVELD BE LIABLE FOR ANY CLAIM, DAMAGES
 * OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE,
 * ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR
 * OTHER DEALINGS IN THE SOFTWARE.
 */

var htmlentities = function(string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   improved by: nobbler
    // +    tweaked by: Jack
    // +   bugfixed by: Onno Marsman
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Ratheous
    // -    depends on: get_html_translation_table
    // *     example 1: htmlentities('Kevin & van Zonneveld');
    // *     returns 1: 'Kevin &amp; van Zonneveld'
    // *     example 2: htmlentities("foo'bar","ENT_QUOTES");
    // *     returns 2: 'foo&#039;bar'

    string = string || "";

    var hash_map = {}, symbol, tmp_str = '', entity = '';
    tmp_str = string.toString();

    
    if (false === (hash_map = get_html_translation_table('HTML_SPECIALCHARS', quote_style))) {
        return false;
    }

    hash_map["'"] = '&#039;';
    delete hash_map["&"];

    tmp_str = tmp_str.split('&#39;').join("'");
    tmp_str = tmp_str.split('&#34;').join('"');
    tmp_str = tmp_str.split('&apos;').join("'");
    tmp_str = tmp_str.split('&quot;').join('"');

    // amended by ejones - get_html_translation_table no longer translates
    //   char codes by default

    //hash_map["'"] = '&#039;';
    delete hash_map['38']; // &
    tmp_str = tmp_str.split('&').join('&amp;');
    for (symbol in hash_map) {
        tmp_str = tmp_str
                .split(String.fromCharCode(symbol))
                .join(hash_map[symbol]);
    }

    return tmp_str;
};

var html_entity_decode = function(string, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: john (http://www.jd-tech.net)
    // +      input by: ger
    // +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: Onno Marsman
    // +   improved by: marc andreu
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +      input by: Ratheous
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Nick Kolosov (http://sammy.ru)
    // +   bugfixed by: Fox
    // -    depends on: get_html_translation_table
    // *     example 1: html_entity_decode('Kevin &amp; van Zonneveld');
    // *     returns 1: 'Kevin & van Zonneveld'
    // *     example 2: html_entity_decode('&amp;lt;');
    // *     returns 2: '&lt;'

    string = string || "";

    var hash_map = {}, symbol, tmp_str = '', 
      entity = '', entity_to_char_code = {};
    tmp_str = string.toString();

    if (false === (hash_map = get_html_translation_table('HTML_ENTITIES', quote_style))) {
        return false;
    }

  
    // amended by ejones - more flexible recognition of entities
    for (symbol in hash_map) {
        entity_to_char_code[hash_map[symbol]] = symbol;
    }

    tmp_str = tmp_str.replace(/&([#a-z0-9]+);/gi, function( ent, ename ) {
        var char = entity_to_char_code[ent];
        if (char == null && ename === 'apos') char = 39;
        if (char == null && ename[0] === '#') {
            if (ename[1].toLowerCase() === 'x') {
                char = parseInt(ename.substring(2), 16);
            } else {
                char = parseInt(ename.substring(1), 10);
            };
            if (isNaN(char)) char = null;
        };
        return char != null ? String.fromCharCode(char) : ent;
    });

    return tmp_str;
};


var get_html_translation_table = function(table, quote_style) {
    // http://kevin.vanzonneveld.net
    // +   original by: Philip Peterson
    // +    revised by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
    // +   bugfixed by: noname
    // +   bugfixed by: Alex
    // +   bugfixed by: Marco
    // +   bugfixed by: madipta
    // +   improved by: KELAN
    // +   improved by: Brett Zamir (http://brett-zamir.me)
    // +   bugfixed by: Brett Zamir (http://brett-zamir.me)
    // +      input by: Frank Forte
    // +   bugfixed by: T.Wild
    // +      input by: Ratheous
    // %          note: It has been decided that we're not going to add global
    // %          note: dependencies to php.js, meaning the constants are not
    // %          note: real constants, but strings instead. Integers are also supported if someone
    // %          note: chooses to create the constants themselves.
    // *     example 1: get_html_translation_table('HTML_SPECIALCHARS');
    // *     returns 1: {'"': '&quot;', '&': '&amp;', '<': '&lt;', '>': '&gt;'}

    var entities = {}, hash_map = {}, decimal = 0, symbol = '';
    var constMappingTable = {}, constMappingQuoteStyle = {};
    var useTable = {}, useQuoteStyle = {};

    // Translate arguments
    constMappingTable[0]      = 'HTML_SPECIALCHARS';
    constMappingTable[1]      = 'HTML_ENTITIES';
    constMappingQuoteStyle[0] = 'ENT_NOQUOTES';
    constMappingQuoteStyle[2] = 'ENT_COMPAT';
    constMappingQuoteStyle[3] = 'ENT_QUOTES';

    useTable       = !isNaN(table) ? constMappingTable[table] : table ? table.toUpperCase() : 'HTML_SPECIALCHARS';
    useQuoteStyle = !isNaN(quote_style) ? constMappingQuoteStyle[quote_style] : quote_style ? quote_style.toUpperCase() : 'ENT_QUOTES';

    if (useTable !== 'HTML_SPECIALCHARS' && useTable !== 'HTML_ENTITIES') {
        throw new Error("Table: "+useTable+' not supported');
        // return false;
    }

    entities['38'] = '&amp;';
    if (useTable === 'HTML_ENTITIES') {
        entities['160'] = '&nbsp;';
        entities['161'] = '&iexcl;';
        entities['162'] = '&cent;';
        entities['163'] = '&pound;';
        entities['164'] = '&curren;';
        entities['165'] = '&yen;';
        entities['166'] = '&brvbar;';
        entities['167'] = '&sect;';
        entities['168'] = '&uml;';
        entities['169'] = '&copy;';
        entities['170'] = '&ordf;';
        entities['171'] = '&laquo;';
        entities['172'] = '&not;';
        entities['173'] = '&shy;';
        entities['174'] = '&reg;';
        entities['175'] = '&macr;';
        entities['176'] = '&deg;';
        entities['177'] = '&plusmn;';
        entities['178'] = '&sup2;';
        entities['179'] = '&sup3;';
        entities['180'] = '&acute;';
        entities['181'] = '&micro;';
        entities['182'] = '&para;';
        entities['183'] = '&middot;';
        entities['184'] = '&cedil;';
        entities['185'] = '&sup1;';
        entities['186'] = '&ordm;';
        entities['187'] = '&raquo;';
        entities['188'] = '&frac14;';
        entities['189'] = '&frac12;';
        entities['190'] = '&frac34;';
        entities['191'] = '&iquest;';
        entities['192'] = '&Agrave;';
        entities['193'] = '&Aacute;';
        entities['194'] = '&Acirc;';
        entities['195'] = '&Atilde;';
        entities['196'] = '&Auml;';
        entities['197'] = '&Aring;';
        entities['198'] = '&AElig;';
        entities['199'] = '&Ccedil;';
        entities['200'] = '&Egrave;';
        entities['201'] = '&Eacute;';
        entities['202'] = '&Ecirc;';
        entities['203'] = '&Euml;';
        entities['204'] = '&Igrave;';
        entities['205'] = '&Iacute;';
        entities['206'] = '&Icirc;';
        entities['207'] = '&Iuml;';
        entities['208'] = '&ETH;';
        entities['209'] = '&Ntilde;';
        entities['210'] = '&Ograve;';
        entities['211'] = '&Oacute;';
        entities['212'] = '&Ocirc;';
        entities['213'] = '&Otilde;';
        entities['214'] = '&Ouml;';
        entities['215'] = '&times;';
        entities['216'] = '&Oslash;';
        entities['217'] = '&Ugrave;';
        entities['218'] = '&Uacute;';
        entities['219'] = '&Ucirc;';
        entities['220'] = '&Uuml;';
        entities['221'] = '&Yacute;';
        entities['222'] = '&THORN;';
        entities['223'] = '&szlig;';
        entities['224'] = '&agrave;';
        entities['225'] = '&aacute;';
        entities['226'] = '&acirc;';
        entities['227'] = '&atilde;';
        entities['228'] = '&auml;';
        entities['229'] = '&aring;';
        entities['230'] = '&aelig;';
        entities['231'] = '&ccedil;';
        entities['232'] = '&egrave;';
        entities['233'] = '&eacute;';
        entities['234'] = '&ecirc;';
        entities['235'] = '&euml;';
        entities['236'] = '&igrave;';
        entities['237'] = '&iacute;';
        entities['238'] = '&icirc;';
        entities['239'] = '&iuml;';
        entities['240'] = '&eth;';
        entities['241'] = '&ntilde;';
        entities['242'] = '&ograve;';
        entities['243'] = '&oacute;';
        entities['244'] = '&ocirc;';
        entities['245'] = '&otilde;';
        entities['246'] = '&ouml;';
        entities['247'] = '&divide;';
        entities['248'] = '&oslash;';
        entities['249'] = '&ugrave;';
        entities['250'] = '&uacute;';
        entities['251'] = '&ucirc;';
        entities['252'] = '&uuml;';
        entities['253'] = '&yacute;';
        entities['254'] = '&thorn;';
        entities['255'] = '&yuml;';
    }

    if (useQuoteStyle !== 'ENT_NOQUOTES') {
        entities['34'] = '&quot;';
    }
    if (useQuoteStyle === 'ENT_QUOTES') {
        entities['39'] = '&#39;';
    }
    entities['60'] = '&lt;';
    entities['62'] = '&gt;';


       
    // removed by ejones - translation now done in encoding/decoding

    //// ascii decimals to real symbols
    //for (decimal in entities) {
    //    symbol = String.fromCharCode(decimal);
    //    hash_map[symbol] = entities[decimal];
    //}

    //return hash_map;

    return entities;
};

/* }}} */
exports.HTMLEncode = htmlentities;
exports.HTMLDecode = html_entity_decode;
