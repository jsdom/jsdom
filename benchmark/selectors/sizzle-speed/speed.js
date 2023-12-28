/*
 * Performance test suite using benchmark.js
 */
require( [
	"../external/benchmark/benchmark",
	"../external/requirejs-domready/domReady!",
	"../external/requirejs-text/text!selectors.css"
],
function( Benchmark, document, selectors ) {
	"use strict";

	// Convert selectors to an array
	selectors = ( function() {
		var s = selectors.split( "\n" ),
			i = 0;

		for ( ; i < s.length; i++ ) {
			if ( !s[ i ] ) {
				s.splice( i--, 1 );
			}
		}
		return s;
	} )();

	var // Used to indicate whether console profiling is begin run
		profiling,
		trim,

		// Class manipulation
		// IE doesn't match non-breaking spaces with \s
		rtrim = /\S/.test( "\xA0" ) ? ( /^[\s\xA0]+|[\s\xA0]+$/g ) : /^\s+|\s+$/g,
		rspaces = /\s+/,
		ptrim = String.prototype.trim,

		// Test HTML file name in the data folder
		testHtml = "selector",

		// Construct search parameters object
		urlParams = ( function() {
			var parts, value, paramValue,
				params = {},
				search = window.location.search.substring( 1 ).split( "&" ),
				i = 0,
				len = search.length;

			for ( ; i < len; i++ ) {
				parts = search[ i ].split( "=" );
				value = parts[ 1 ];

				// Cast booleans and treat no value as true
				if ( !value || value === "true" ) {
					paramValue = true;
				} else {
					paramValue = value === "false" ?
						false :
						decodeURIComponent( value );
				}
				params[ decodeURIComponent( parts[ 0 ] ) ] = paramValue;
			}

			return params;
		} )(),

		// Whether to allow the use of QSA by the selector engines
		useQSA = urlParams.qsa || false,

		// Benchmark options
		maxTime = 0.5,
		minSamples = 3,

		// Keep track of all iframes
		iframes = {},

		// Keeps track of which benches had errors
		errors = {},

		// Selector engines
		engines = {

			// "qsa":                  "d.querySelectorAll( s )",
			"jquery-1.7.2/jquery": "jQuery.find( s, d )",

			// "jquery-1.8.3/jquery":  "jQuery.find( s, d )",
			"sizzle-old/sizzle": "Sizzle( s, d )",
			"sizzle": "Sizzle( s, d )",

			// "dojo/dojo":            "dojo.query( s, d )",
			"mootools-slick/slick": "Slick.search( d, s )",
			"nwmatcher/nwmatcher": "NW.Dom.select( s, d )"
		},

		// Keeps track of overall scores
		scores = ( function() {
			var engine,
				scores = {};
			for ( engine in engines ) {
				scores[ engine ] = 0;
			}
			return scores;
		} )(),

		// Keeps track of the number of elements returned
		returned = ( function() {
			var engine,
				returned = {};
			for ( engine in engines ) {
				returned[ engine ] = {};
			}
			return returned;
		} )(),

		// Just counts the engines
		numEngines = ( function() {
			var engine, // eslint-disable-line no-unused-vars
				count = 0;

			for ( engine in engines ) {
				count++;
			}
			return count;
		} )(),

		selectorIndex = 0;

	// Expose iframeCallbacks
	window.iframeCallbacks = {};

	/**
	 * Trim leading and trailing whitespace
	 *
	 * @private
	 * @param {String} str The string to trim
	 */
	trim = ptrim ?
		function( str ) {
			return ptrim.call( str );
		} :
		function( str ) {
			return str.replace( rtrim, "" );
		};

	/**
	 * A shortcut for getElementById
	 *
	 * @private
	 * @param {String} id The ID with which to query the DOM
	 */
	function get( id ) {
		return document.getElementById( id );
	}

	/**
	 * Adds the given class to the element if it does not exist
	 *
	 * @private
	 * @param {Element} elem The element on which to add the class
	 * @param {String} classStr The class to add
	 */
	function addClass( elem, classStr ) {
		classStr = classStr.split( rspaces );
		var c,
			cls = " " + elem.className + " ",
			i = 0,
			len = classStr.length;
		for ( ; i < len; ++i ) {
			c = classStr[ i ];
			if ( c && cls.indexOf( " " + c + " " ) < 0 ) {
				cls += c + " ";
			}
		}
		elem.className = trim( cls );
	}

	/**
	 * Removes a given class on the element
	 *
	 * @private
	 * @param {Element} elem The element from which to remove the class
	 * @param {String} classStr The class to remove
	 */
	function removeClass( elem, classStr ) {
		var cls, len, i;

		if ( classStr !== undefined ) {
			classStr = classStr.split( rspaces );
			cls = " " + elem.className + " ";
			i = 0;
			len = classStr.length;
			for ( ; i < len; ++i ) {
				cls = cls.replace( " " + classStr[ i ] + " ", " " );
			}
			cls = trim( cls );
		} else {

			// Remove all classes
			cls = "";
		}

		if ( elem.className !== cls ) {
			elem.className = cls;
		}
	}

	/**
	 * Runs the console profiler if available
	 *
	 * @param {String} name The name of the profile
	 */
	function profile( name ) {
		if ( window.console && typeof console.profile !== "undefined" && !profiling ) {
			profiling = true;
			console.profile( name );
		}
	}

	/**
	 * Stops console profiling if available
	 *
	 * @param {String} name The name of the profile
	 */
	function profileEnd( name ) {
		if ( profiling ) {
			profiling = false;
			console.profileEnd( name );
		}
	}

	/**
	 * Retrieves the position of the first column
	 *  of the row that has just been tested
	 */
	function firstTestedColumn() {
		return selectorIndex * ( numEngines + 1 ) + 1;
	}

	/**
	 * Add random number to the url to stop caching
	 *
	 * @private
	 * @param {String} value The url to which to add cache control
	 * @returns {String} Returns the new url
	 *
	 * @example url("data/test.html")
	 * // => "data/test.html?10538358428943"
	 *
	 * @example url("data/test.php?foo=bar")
	 * // => "data/test.php?foo=bar&10538358345554"
	 */
	function url( value ) {
		return value + ( /\?/.test( value ) ? "&" : "?" ) + new Date().getTime() + "" + parseInt( Math.random() * 100000, 10 );
	}

	/**
	 * Gets the Hz, i.e. operations per second, of `bench` adjusted for the
	 *  margin of error.
	 *
	 * @private
	 * @param {Object} bench The benchmark object.
	 * @returns {Number} Returns the adjusted Hz.
	 */
	function getHz( bench ) {
		return 1 / ( bench.stats.mean + bench.stats.moe );
	}

	/**
	 * Determines the common number of elements found by the engines.
	 *   If there are only 2 engines, this will just return the first one.
	 *
	 * @private
	 * @param {String} selector The selector for which to check returned elements
	 */
	function getCommonReturn( selector ) {
		var engine, count, common,
			max = 0,
			counts = {};

		for ( engine in returned ) {
			count = returned[ engine ][ selector ];
			if ( count ) {
				count = count.length;
				counts[ count ] = ( counts[ count ] || 0 ) + 1;
			}
		}

		for ( count in counts ) {
			if ( counts[ count ] > max ) {
				max = counts[ count ];
				common = count;
			}
		}

		return +common;
	}

	/**
	 * Adds all of the necessary headers and rows
	 *   for all selector engines
	 *
	 * @private
	 */
	function buildTable() {
		var engine,
			i = 0,
			len = selectors.length,
			headers = "<th class='small selector'>selectors</th>",
			emptyColumns = "",
			rows = "";

		// Build out headers
		for ( engine in engines ) {
			headers += "<th class='text-right'>" + engine.match( /^[^/]+/ )[ 0 ] + "</th>";
			emptyColumns += "<td class='text-right' data-engine='" + engine + "'>&nbsp;</td>";
		}

		// Build out initial rows
		for ( ; i < len; i++ ) {
			rows += "<tr><td id='selector" + i + "' class='small selector'><span>" +
				selectors[ i ] + "</span></td>" + emptyColumns + "</tr>";
		}
		rows += "<tr><td id='results' class='bold'>Total (more is better)</td>" +
			emptyColumns + "</tr>";

		get( "perf-table-headers" ).innerHTML = headers;
		get( "perf-table-body" ).innerHTML = rows;
	}

	/**
	 * Creates an iframe for use in testing a selector engine
	 *
	 * @private
	 * @param {String} engine Indicates which selector engine to load in the fixture
	 * @param {String} suite Name of the Benchmark Suite to use
	 * @param {Number} callbackIndex Index of the iframe callback for this iframe
	 * @returns {Element} Returns the iframe
	 */
	function createIframe( engine, suite, callbackIndex ) {
		var src = url( "./data/" + testHtml + ".html?engine=" + encodeURIComponent( engine ) +
				"&suite=" + encodeURIComponent( suite ) +
				"&callback=" + callbackIndex +
				"&qsa=" + useQSA ),
			iframe = document.createElement( "iframe" );
		iframe.setAttribute( "src", src );
		iframe.style.cssText = "width: 500px; height: 500px; position: absolute; " +
			"top: -600px; left: -600px; visibility: hidden;";
		document.body.appendChild( iframe );
		iframes[ suite ].push( iframe );
		return iframe;
	}

	/**
	 * Runs a Benchmark suite from within an iframe
	 *  then destroys the iframe
	 * Each selector is tested in a fresh iframe
	 *
	 * @private
	 * @param {Object} suite Benchmark Suite to which to add tests
	 * @param {String} selector The selector being tested
	 * @param {String} engine The selector engine begin tested
	 * @param {Function} iframeLoaded Callback to call when the iframe has loaded
	 */
	function addTestToSuite( suite, selector, engine, iframeLoaded ) {

		/**
		 * Run selector tests with a particular engine in an iframe
		 *
		 * @param {Function} r Require in the context of the iframe
		 * @param {Object} document The document of the iframe
		 */
		function test( document ) {
			var win = this,
				select = new Function(
					"w",
					"s",
					"d",
					"return " + ( engine !== "qsa" ? "w." : "" ) + engines[ engine ]
				);
			suite.add( engine, function() {
				returned[ engine ][ selector ] = select( win, selector, document );
			} );
			if ( typeof iframeLoaded !== "undefined" ) {
				iframeLoaded();
			}
		}

		// Called by the iframe
		var index,
			name = suite.name,
			callbacks = window.iframeCallbacks[ name ];

		index = callbacks.push( function() {
			var self = this,
				args = arguments;
			window.setTimeout( function() {
				test.apply( self, args );
			}, 0 );
		} ) - 1;

		// Load fixture in iframe and add it to the list
		createIframe( engine, name, index );
	}

	/**
	 * Tests a selector in all selector engines
	 *
	 * @private
	 * @param {String} selector Selector to test
	 */
	function testSelector( selector ) {
		var engine,
			suite = Benchmark.Suite( selector ),
			name = suite.name,
			count = numEngines;

		/**
		 * Called when an iframe has loaded for a test.
		 *   Need to wait until all iframes
		 *   have loaded to run the suite
		 */
		function loaded() {

			// Run the suite
			if ( --count === 0 ) {
				suite.run();
			}
		}

		// Add spots for iframe callbacks and iframes
		window.iframeCallbacks[ name ] = [];
		iframes[ name ] = [];

		// Add the tests to the new suite
		for ( engine in engines ) {
			addTestToSuite( suite, selector, engine, loaded );
		}
	}

	/**
	 * Adds the bench to the list of failures to indicate
	 *   failure on cycle. Aborts and returns false.
	 *
	 * @param {Object} event Benchmark.Event instance
	 */
	function onError() {
		errors[ this.id ] = true;
		this.abort();
		return false;
	}

	/**
	 * Callback for the start of each test
	 * Adds the `pending` class to the selector column
	 */
	function onStart() {
		profile( selectors[ selectorIndex ] );
		var selectorElem = get( "selector" + selectorIndex );
		addClass( selectorElem, "pending" );
	}

	/**
	 * Adds the Hz result or "FAILURE" to the corresponding column for the engine
	 */
	function onCycle( event ) {
		var i = firstTestedColumn(),
			len = i + numEngines,
			tableBody = get( "perf-table-body" ),
			tds = tableBody.getElementsByTagName( "td" ),
			bench = event.target,
			hasError = errors[ bench.id ],
			textNode = document.createTextNode(
				hasError ?
					"FAILED" :
					Benchmark.formatNumber( getHz( bench ).toFixed( 2 ) ) + "o/s | " +
						returned[ bench.name ][ selectors[ selectorIndex ] ].length +
						" found"
			);

		// Add the result to the row
		for ( ; i < len; i++ ) {
			if ( tds[ i ].getAttribute( "data-engine" ) === bench.name ) {
				tds[ i ].appendChild( textNode );
				if ( hasError ) {
					addClass( tds[ i ], "black" );
				}
				break;
			}
		}
	}

	/**
	 * Called after each test
	 *   - Removes the `pending` class from the row
	 *   - Adds the totals to the `scores` object
	 *   - Highlights the corresponding row appropriately
	 *   - Removes all iframes and their callbacks from memory
	 *   - Calls the next test OR finishes up by:
	 *     * adding the `complete` class to body
	 *     * adding the totals to the table
	 *     * determining the fastest overall and slowest overall
	 */
	function onComplete() {
		profileEnd( selectors[ selectorIndex ] );
		var fastestHz, slowestHz, elem, attr, j, jlen, td, ret,
			i = firstTestedColumn(),

			// Determine different elements returned
			selector = selectors[ selectorIndex ],
			common = getCommonReturn( selector ),
			len = i + numEngines,
			selectorElem = get( "selector" + selectorIndex ),
			tableBody = get( "perf-table-body" ),
			tds = tableBody.getElementsByTagName( "td" ),
			fastest = this.filter( "fastest" ),
			slowest = this.filter( "slowest" );

		removeClass( selectorElem, "pending" );

		// Add up the scores
		this.forEach( function( bench ) {
			if ( errors[ bench.id ] ) {

				// No need to store this error anymore
				delete errors[ bench.id ];
			} else {
				scores[ bench.name ] += getHz( bench );
			}
		} );

		// Highlight different returned yellow, fastest green, and slowest red
		for ( ; i < len; i++ ) {
			td = tds[ i ];
			attr = td.getAttribute( "data-engine" );
			ret = returned[ attr ][ selector ];
			if ( ret && ret.length !== common ) {
				addClass( td, "yellow" );
				continue;
			}
			for ( j = 0, jlen = slowest.length; j < jlen; j++ ) {
				if ( slowest[ j ].name === attr ) {
					addClass( td, "red" );
				}
			}
			for ( j = 0, jlen = fastest.length; j < jlen; j++ ) {
				if ( fastest[ j ].name === attr ) {
					addClass( td, "green" );
				}
			}
		}

		// Remove all added iframes for this suite
		for ( i = 0, len = iframes[ this.name ].length; i < len; i++ ) {
			document.body.removeChild( iframes[ this.name ].pop() );
		}
		delete iframes[ this.name ];

		// Remove all callbacks on the window for this suite
		window.iframeCallbacks[ this.name ] = null;
		try {

			// Errors in IE
			delete window.iframeCallbacks[ this.name ];
		} catch ( e ) {}

		if ( ++selectorIndex < selectors.length ) {
			testSelector( selectors[ selectorIndex ] );
		} else {
			addClass( document.body, "complete" );

			// Get the fastest and slowest
			slowest = fastest = undefined;
			fastestHz = 0;
			slowestHz = Infinity;
			for ( i in scores ) {
				if ( scores[ i ] > fastestHz ) {
					fastestHz = scores[ i ];
					fastest = i;
				} else if ( scores[ i ] < slowestHz ) {
					slowestHz = scores[ i ];
					slowest = i;
				}

				// Format scores for display
				scores[ i ] = Benchmark.formatNumber( scores[ i ].toFixed( 2 ) ) + "o/s";
			}

			// Add conclusion to the header
			elem = document.createElement( "h3" );
			elem.innerHTML = "The fastest is <i>" + fastest + " (" +
				scores[ fastest ] + ")</i>. " +
				"The slowest is <i>" + slowest + " (" +
				scores[ slowest ] + ")</i>.";
			get( "header" ).appendChild( elem );

			// Add totals to table
			i = firstTestedColumn();
			while ( ( elem = tds[ i++ ] ) ) {
				attr = elem.getAttribute( "data-engine" );
				if ( attr === fastest ) {
					addClass( elem, "green" );
				} else if ( attr === slowest ) {
					addClass( elem, "red" );
				}

				elem.appendChild(
					document.createTextNode( scores[ attr ] )
				);
			}
		}
	}

	/* Benchmark Options
	---------------------------------------------------------------------- */

	Benchmark.options.async = true;
	Benchmark.options.maxTime = maxTime;
	Benchmark.options.minSamples = minSamples;
	Benchmark.options.onError = onError;

	/* Benchmark Suite Options
	---------------------------------------------------------------------- */
	Benchmark.Suite.options.onStart = onStart;
	Benchmark.Suite.options.onCycle = onCycle;
	Benchmark.Suite.options.onComplete = onComplete;

	// Kick it off
	buildTable();
	testSelector( selectors[ selectorIndex ] );

} );
