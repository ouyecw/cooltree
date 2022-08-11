
//----------------------------------------- SystemType -----------------------------------------

SystemType={};

SystemType.OS_PC = "pc";
SystemType.OS_IPHONE = "iphone";
SystemType.OS_IPOD = "ipod";
SystemType.OS_IPAD = "ipad";
SystemType.OS_ANDROID = "android";
SystemType.OS_BLACK_BERRY = "blackberry";
SystemType.OS_WINDOWS_PHONE = "windows phone";

/**
 * 纵向显示
 */
SystemType.LANDSCAPE = "landscape";

/**
 * 横向显示
 */
SystemType.PORTRAIT = "portrait";

SystemType.NONE = "none";

//----------------------------------------- json2 -----------------------------------------

/*
    json2.js
    2015-05-03

    Public Domain.

    NO WARRANTY EXPRESSED OR IMPLIED. USE AT YOUR OWN RISK.

    See http://www.JSON.org/js.html


    This code should be minified before deployment.
    See http://javascript.crockford.com/jsmin.html

    USE YOUR OWN COPY. IT IS EXTREMELY UNWISE TO LOAD CODE FROM SERVERS YOU DO
    NOT CONTROL.


    This file creates a global JSON object containing two methods: stringify
    and parse. This file is provides the ES5 JSON capability to ES3 systems.
    If a project might run on IE8 or earlier, then this file should be included.
    This file does nothing on ES5 systems.

        JSON.stringify(value, replacer, space)
            value       any JavaScript value, usually an object or array.

            replacer    an optional parameter that determines how object
                        values are stringified for objects. It can be a
                        function or an array of strings.

            space       an optional parameter that specifies the indentation
                        of nested structures. If it is omitted, the text will
                        be packed without extra whitespace. If it is a number,
                        it will specify the number of spaces to indent at each
                        level. If it is a string (such as '\t' or '&nbsp;'),
                        it contains the characters used to indent at each level.

            This method produces a JSON text from a JavaScript value.

            When an object value is found, if the object contains a toJSON
            method, its toJSON method will be called and the result will be
            stringified. A toJSON method does not serialize: it returns the
            value represented by the name/value pair that should be serialized,
            or undefined if nothing should be serialized. The toJSON method
            will be passed the key associated with the value, and this will be
            bound to the value

            For example, this would serialize Dates as ISO strings.

                Date.prototype.toJSON = function (key) {
                    function f(n) {
                        // Format integers to have at least two digits.
                        return n < 10 
                            ? '0' + n 
                            : n;
                    }

                    return this.getUTCFullYear()   + '-' +
                         f(this.getUTCMonth() + 1) + '-' +
                         f(this.getUTCDate())      + 'T' +
                         f(this.getUTCHours())     + ':' +
                         f(this.getUTCMinutes())   + ':' +
                         f(this.getUTCSeconds())   + 'Z';
                };

            You can provide an optional replacer method. It will be passed the
            key and value of each member, with this bound to the containing
            object. The value that is returned from your method will be
            serialized. If your method returns undefined, then the member will
            be excluded from the serialization.

            If the replacer parameter is an array of strings, then it will be
            used to select the members to be serialized. It filters the results
            such that only members with keys listed in the replacer array are
            stringified.

            Values that do not have JSON representations, such as undefined or
            functions, will not be serialized. Such values in objects will be
            dropped; in arrays they will be replaced with null. You can use
            a replacer function to replace those with JSON values.
            JSON.stringify(undefined) returns undefined.

            The optional space parameter produces a stringification of the
            value that is filled with line breaks and indentation to make it
            easier to read.

            If the space parameter is a non-empty string, then that string will
            be used for indentation. If the space parameter is a number, then
            the indentation will be that many spaces.

            Example:

            text = JSON.stringify(['e', {pluribus: 'unum'}]);
            // text is '["e",{"pluribus":"unum"}]'


            text = JSON.stringify(['e', {pluribus: 'unum'}], null, '\t');
            // text is '[\n\t"e",\n\t{\n\t\t"pluribus": "unum"\n\t}\n]'

            text = JSON.stringify([new Date()], function (key, value) {
                return this[key] instanceof Date 
                    ? 'Date(' + this[key] + ')' 
                    : value;
            });
            // text is '["Date(---current time---)"]'


        JSON.parse(text, reviver)
            This method parses a JSON text to produce an object or array.
            It can throw a SyntaxError exception.

            The optional reviver parameter is a function that can filter and
            transform the results. It receives each of the keys and values,
            and its return value is used instead of the original value.
            If it returns what it received, then the structure is not modified.
            If it returns undefined then the member is deleted.

            Example:

            // Parse the text. Values that look like ISO date strings will
            // be converted to Date objects.

            myData = JSON.parse(text, function (key, value) {
                var a;
                if (typeof value === 'string') {
                    a =
/^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(value);
                    if (a) {
                        return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4],
                            +a[5], +a[6]));
                    }
                }
                return value;
            });

            myData = JSON.parse('["Date(09/09/2001)"]', function (key, value) {
                var d;
                if (typeof value === 'string' &&
                        value.slice(0, 5) === 'Date(' &&
                        value.slice(-1) === ')') {
                    d = new Date(value.slice(5, -1));
                    if (d) {
                        return d;
                    }
                }
                return value;
            });


    This is a reference implementation. You are free to copy, modify, or
    redistribute.
*/

/*jslint 
    eval, for, this 
*/

/*property
    JSON, apply, call, charCodeAt, getUTCDate, getUTCFullYear, getUTCHours,
    getUTCMinutes, getUTCMonth, getUTCSeconds, hasOwnProperty, join,
    lastIndex, length, parse, prototype, push, replace, slice, stringify,
    test, toJSON, toString, valueOf
*/


// Create a JSON object only if one does not already exist. We create the
// methods in a closure to avoid creating global variables.

if (typeof JSON !== 'object') {
    JSON = {};
}

(function () {
    'use strict';
    
    var rx_one = /^[\],:{}\s]*$/,
        rx_two = /\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g,
        rx_three = /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g,
        rx_four = /(?:^|:|,)(?:\s*\[)+/g,
        rx_escapable = /[\\\"\u0000-\u001f\u007f-\u009f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        rx_dangerous = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g;

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 
            ? '0' + n 
            : n;
    }
    
    function this_value() {
        return this.valueOf();
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function () {

            return isFinite(this.valueOf())
                ? this.getUTCFullYear() + '-' +
                        f(this.getUTCMonth() + 1) + '-' +
                        f(this.getUTCDate()) + 'T' +
                        f(this.getUTCHours()) + ':' +
                        f(this.getUTCMinutes()) + ':' +
                        f(this.getUTCSeconds()) + 'Z'
                : null;
        };

        Boolean.prototype.toJSON = this_value;
        Number.prototype.toJSON = this_value;
        String.prototype.toJSON = this_value;
    }

    var gap,
        indent,
        meta,
        rep;


    function quote(string) {

// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.

        rx_escapable.lastIndex = 0;
        return rx_escapable.test(string) 
            ? '"' + string.replace(rx_escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string'
                    ? c
                    : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' 
            : '"' + string + '"';
    }


    function str(key, holder) {

// Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
        case 'string':
            return quote(value);

        case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

            return isFinite(value) 
                ? String(value) 
                : 'null';

        case 'boolean':
        case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

            return String(value);

// If the type is 'object', we might be dealing with an object or an array or
// null.

        case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

            if (!value) {
                return 'null';
            }

// Make an array to hold the partial results of stringifying this object value.

            gap += indent;
            partial = [];

// Is the value an array?

            if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                length = value.length;
                for (i = 0; i < length; i += 1) {
                    partial[i] = str(i, value) || 'null';
                }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                v = partial.length === 0
                    ? '[]'
                    : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                gap = mind;
                return v;
            }

// If the replacer is an array, use it to select the members to be stringified.

            if (rep && typeof rep === 'object') {
                length = rep.length;
                for (i = 0; i < length; i += 1) {
                    if (typeof rep[i] === 'string') {
                        k = rep[i];
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            } else {

// Otherwise, iterate through all of the keys in the object.

                for (k in value) {
                    if (Object.prototype.hasOwnProperty.call(value, k)) {
                        v = str(k, value);
                        if (v) {
                            partial.push(quote(k) + (
                                gap 
                                    ? ': ' 
                                    : ':'
                            ) + v);
                        }
                    }
                }
            }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

            v = partial.length === 0
                ? '{}'
                : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
            gap = mind;
            return v;
        }
    }

// If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        };
        JSON.stringify = function (value, replacer, space) {

// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value});
        };
    }


// If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            rx_dangerous.lastIndex = 0;
            if (rx_dangerous.test(text)) {
                text = text.replace(rx_dangerous, function (a) {
                    return '\\u' +
                            ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (
                rx_one.test(
                    text
                        .replace(rx_two, '@')
                        .replace(rx_three, ']')
                        .replace(rx_four, '')
                )
            ) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

//----------------------------------------- rgbcolor -----------------------------------------

/**
 * A class to parse color values
 * @author Stoyan Stefanov <sstoo@gmail.com>
 * @link   http://www.phpied.com/rgb-color-parser-in-javascript/
 * @license Use it if you like it
 */
 
(function ( global ) {
 
	function RGBColor(color_string)
	{
		this.ok = false;

		// strip any leading #
		if (color_string.charAt(0) == '#') { // remove # if any
			color_string = color_string.substr(1,6);
		}

		color_string = color_string.replace(/ /g,'');
		color_string = color_string.toLowerCase();

		// before getting into regexps, try simple matches
		// and overwrite the input
		var simple_colors = {
			aliceblue: 'f0f8ff',
			antiquewhite: 'faebd7',
			aqua: '00ffff',
			aquamarine: '7fffd4',
			azure: 'f0ffff',
			beige: 'f5f5dc',
			bisque: 'ffe4c4',
			black: '000000',
			blanchedalmond: 'ffebcd',
			blue: '0000ff',
			blueviolet: '8a2be2',
			brown: 'a52a2a',
			burlywood: 'deb887',
			cadetblue: '5f9ea0',
			chartreuse: '7fff00',
			chocolate: 'd2691e',
			coral: 'ff7f50',
			cornflowerblue: '6495ed',
			cornsilk: 'fff8dc',
			crimson: 'dc143c',
			cyan: '00ffff',
			darkblue: '00008b',
			darkcyan: '008b8b',
			darkgoldenrod: 'b8860b',
			darkgray: 'a9a9a9',
			darkgreen: '006400',
			darkkhaki: 'bdb76b',
			darkmagenta: '8b008b',
			darkolivegreen: '556b2f',
			darkorange: 'ff8c00',
			darkorchid: '9932cc',
			darkred: '8b0000',
			darksalmon: 'e9967a',
			darkseagreen: '8fbc8f',
			darkslateblue: '483d8b',
			darkslategray: '2f4f4f',
			darkturquoise: '00ced1',
			darkviolet: '9400d3',
			deeppink: 'ff1493',
			deepskyblue: '00bfff',
			dimgray: '696969',
			dodgerblue: '1e90ff',
			feldspar: 'd19275',
			firebrick: 'b22222',
			floralwhite: 'fffaf0',
			forestgreen: '228b22',
			fuchsia: 'ff00ff',
			gainsboro: 'dcdcdc',
			ghostwhite: 'f8f8ff',
			gold: 'ffd700',
			goldenrod: 'daa520',
			gray: '808080',
			green: '008000',
			greenyellow: 'adff2f',
			honeydew: 'f0fff0',
			hotpink: 'ff69b4',
			indianred : 'cd5c5c',
			indigo : '4b0082',
			ivory: 'fffff0',
			khaki: 'f0e68c',
			lavender: 'e6e6fa',
			lavenderblush: 'fff0f5',
			lawngreen: '7cfc00',
			lemonchiffon: 'fffacd',
			lightblue: 'add8e6',
			lightcoral: 'f08080',
			lightcyan: 'e0ffff',
			lightgoldenrodyellow: 'fafad2',
			lightgrey: 'd3d3d3',
			lightgreen: '90ee90',
			lightpink: 'ffb6c1',
			lightsalmon: 'ffa07a',
			lightseagreen: '20b2aa',
			lightskyblue: '87cefa',
			lightslateblue: '8470ff',
			lightslategray: '778899',
			lightsteelblue: 'b0c4de',
			lightyellow: 'ffffe0',
			lime: '00ff00',
			limegreen: '32cd32',
			linen: 'faf0e6',
			magenta: 'ff00ff',
			maroon: '800000',
			mediumaquamarine: '66cdaa',
			mediumblue: '0000cd',
			mediumorchid: 'ba55d3',
			mediumpurple: '9370d8',
			mediumseagreen: '3cb371',
			mediumslateblue: '7b68ee',
			mediumspringgreen: '00fa9a',
			mediumturquoise: '48d1cc',
			mediumvioletred: 'c71585',
			midnightblue: '191970',
			mintcream: 'f5fffa',
			mistyrose: 'ffe4e1',
			moccasin: 'ffe4b5',
			navajowhite: 'ffdead',
			navy: '000080',
			oldlace: 'fdf5e6',
			olive: '808000',
			olivedrab: '6b8e23',
			orange: 'ffa500',
			orangered: 'ff4500',
			orchid: 'da70d6',
			palegoldenrod: 'eee8aa',
			palegreen: '98fb98',
			paleturquoise: 'afeeee',
			palevioletred: 'd87093',
			papayawhip: 'ffefd5',
			peachpuff: 'ffdab9',
			peru: 'cd853f',
			pink: 'ffc0cb',
			plum: 'dda0dd',
			powderblue: 'b0e0e6',
			purple: '800080',
			red: 'ff0000',
			rosybrown: 'bc8f8f',
			royalblue: '4169e1',
			saddlebrown: '8b4513',
			salmon: 'fa8072',
			sandybrown: 'f4a460',
			seagreen: '2e8b57',
			seashell: 'fff5ee',
			sienna: 'a0522d',
			silver: 'c0c0c0',
			skyblue: '87ceeb',
			slateblue: '6a5acd',
			slategray: '708090',
			snow: 'fffafa',
			springgreen: '00ff7f',
			steelblue: '4682b4',
			tan: 'd2b48c',
			teal: '008080',
			thistle: 'd8bfd8',
			tomato: 'ff6347',
			turquoise: '40e0d0',
			violet: 'ee82ee',
			violetred: 'd02090',
			wheat: 'f5deb3',
			white: 'ffffff',
			whitesmoke: 'f5f5f5',
			yellow: 'ffff00',
			yellowgreen: '9acd32'
		};
		for (var key in simple_colors) {
			if (color_string == key) {
				color_string = simple_colors[key];
			}
		}
		// emd of simple type-in colors

		// array of color definition objects
		var color_defs = [
			{
				re: /^rgb\((\d{1,3}),\s*(\d{1,3}),\s*(\d{1,3})\)$/,
				example: ['rgb(123, 234, 45)', 'rgb(255,234,245)'],
				process: function (bits){
					return [
						parseInt(bits[1]),
						parseInt(bits[2]),
						parseInt(bits[3])
					];
				}
			},
			{
				re: /^(\w{2})(\w{2})(\w{2})$/,
				example: ['#00ff00', '336699'],
				process: function (bits){
					return [
						parseInt(bits[1], 16),
						parseInt(bits[2], 16),
						parseInt(bits[3], 16)
					];
				}
			},
			{
				re: /^(\w{1})(\w{1})(\w{1})$/,
				example: ['#fb0', 'f0f'],
				process: function (bits){
					return [
						parseInt(bits[1] + bits[1], 16),
						parseInt(bits[2] + bits[2], 16),
						parseInt(bits[3] + bits[3], 16)
					];
				}
			}
		];

		// search through the definitions to find a match
		for (var i = 0; i < color_defs.length; i++) {
			var re = color_defs[i].re;
			var processor = color_defs[i].process;
			var bits = re.exec(color_string);
			if (bits) {
				channels = processor(bits);
				this.r = channels[0];
				this.g = channels[1];
				this.b = channels[2];
				this.ok = true;
			}

		}

		// validate/cleanup values
		this.r = (this.r < 0 || isNaN(this.r)) ? 0 : ((this.r > 255) ? 255 : this.r);
		this.g = (this.g < 0 || isNaN(this.g)) ? 0 : ((this.g > 255) ? 255 : this.g);
		this.b = (this.b < 0 || isNaN(this.b)) ? 0 : ((this.b > 255) ? 255 : this.b);

		// some getters
		this.toRGB = function () {
			return 'rgb(' + this.r + ', ' + this.g + ', ' + this.b + ')';
		}
		this.toHex = function () {
			var r = this.r.toString(16);
			var g = this.g.toString(16);
			var b = this.b.toString(16);
			if (r.length == 1) r = '0' + r;
			if (g.length == 1) g = '0' + g;
			if (b.length == 1) b = '0' + b;
			return '#' + r + g + b;
		}

		// help
		this.getHelpXML = function () {

			var examples = new Array();
			// add regexps
			for (var i = 0; i < color_defs.length; i++) {
				var example = color_defs[i].example;
				for (var j = 0; j < example.length; j++) {
					examples[examples.length] = example[j];
				}
			}
			// add type-in colors
			for (var sc in simple_colors) {
				examples[examples.length] = sc;
			}

			var xml = document.createElement('ul');
			xml.setAttribute('id', 'rgbcolor-examples');
			for (var i = 0; i < examples.length; i++) {
				try {
					var list_item = document.createElement('li');
					var list_color = new RGBColor(examples[i]);
					var example_div = document.createElement('div');
					example_div.style.cssText =
							'margin: 3px; '
							+ 'border: 1px solid black; '
							+ 'background:' + list_color.toHex() + '; '
							+ 'color:' + list_color.toHex()
					;
					example_div.appendChild(document.createTextNode('test'));
					var list_item_value = document.createTextNode(
						' ' + examples[i] + ' -> ' + list_color.toRGB() + ' -> ' + list_color.toHex()
					);
					list_item.appendChild(example_div);
					list_item.appendChild(list_item_value);
					xml.appendChild(list_item);

				} catch(e){}
			}
			return xml;

		}

	}

    // export as AMD...
    if ( typeof define !== 'undefined' && define.amd ) {
        define( function () { return RGBColor; });
    }

    // ...or as browserify
    else if ( typeof module !== 'undefined' && module.exports ) {
        module.exports = RGBColor;
    }

    global.RGBColor = RGBColor;

}( typeof window !== 'undefined' ? window : this ));
//----------------------------------------- canvg -----------------------------------------

/*
 * canvg.js - Javascript SVG parser and renderer on Canvas
 * MIT Licensed
 * Gabe Lerner (gabelerner@gmail.com)
 * http://code.google.com/p/canvg/
 *
 * Requires: rgbcolor.js - http://www.phpied.com/rgb-color-parser-in-javascript/
 */
 (function ( global, factory ) {

	'use strict';

	// export as AMD...
	if ( typeof define !== 'undefined' && define.amd ) {
		define('canvgModule', [ 'rgbcolor', 'stackblur' ], factory );
	}

	// ...or as browserify
	else if ( typeof module !== 'undefined' && module.exports ) {
		module.exports = factory( require( 'rgbcolor' ), require( 'stackblur' ) );
	}

	global.canvg = factory( global.RGBColor, global.stackBlur );

}( typeof window !== 'undefined' ? window : this, function ( RGBColor, stackBlur ) {
 
	// canvg(target, s)
	// empty parameters: replace all 'svg' elements on page with 'canvas' elements
	// target: canvas element or the id of a canvas element
	// s: svg string, url to svg file, or xml document
	// opts: optional hash of options
	//		 ignoreMouse: true => ignore mouse events
	//		 ignoreAnimation: true => ignore animations
	//		 ignoreDimensions: true => does not try to resize canvas
	//		 ignoreClear: true => does not clear canvas
	//		 offsetX: int => draws at a x offset
	//		 offsetY: int => draws at a y offset
	//		 scaleWidth: int => scales horizontally to width
	//		 scaleHeight: int => scales vertically to height
	//		 renderCallback: function => will call the function after the first render is completed
	//		 forceRedraw: function => will call the function on every frame, if it returns true, will redraw
	var canvg = function (target, s, opts) {
		// no parameters
		if (target == null && s == null && opts == null) {
			var svgTags = document.querySelectorAll('svg');
			for (var i=0; i<svgTags.length; i++) {
				var svgTag = svgTags[i];
				var c = document.createElement('canvas');
				c.width = svgTag.clientWidth;
				c.height = svgTag.clientHeight;
				svgTag.parentNode.insertBefore(c, svgTag);
				svgTag.parentNode.removeChild(svgTag);
				var div = document.createElement('div');
				div.appendChild(svgTag);
				canvg(c, div.innerHTML);
			}
			return;
		}

		if (typeof target == 'string') {
			target = document.getElementById(target);
		}

		// store class on canvas
		if (target.svg != null) target.svg.stop();
		var svg = build(opts || {});
		// on i.e. 8 for flash canvas, we can't assign the property so check for it
		if (!(target.childNodes.length == 1 && target.childNodes[0].nodeName == 'OBJECT')) target.svg = svg;

		var ctx = target.getContext('2d');
		if (typeof(s.documentElement) != 'undefined') {
			// load from xml doc
			svg.loadXmlDoc(ctx, s);
		}
		else if (s.substr(0,1) == '<') {
			// load from xml string
			svg.loadXml(ctx, s);
		}
		else {
			// load from url
			svg.load(ctx, s);
		}
	}

	// see https://developer.mozilla.org/en-US/docs/Web/API/Element.matches
	var matchesSelector;
	if (typeof(Element.prototype.matches) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.matches(selector);
		};
	} else if (typeof(Element.prototype.webkitMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.webkitMatchesSelector(selector);
		};
	} else if (typeof(Element.prototype.mozMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.mozMatchesSelector(selector);
		};
	} else if (typeof(Element.prototype.msMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.msMatchesSelector(selector);
		};
	} else if (typeof(Element.prototype.oMatchesSelector) != 'undefined') {
		matchesSelector = function(node, selector) {
			return node.oMatchesSelector(selector);
		};
	} else {
		// requires Sizzle: https://github.com/jquery/sizzle/wiki/Sizzle-Documentation
		// or jQuery: http://jquery.com/download/
		// or Zepto: http://zeptojs.com/#
		// without it, this is a ReferenceError

		if (typeof jQuery === 'function' || typeof Zepto === 'function') {
			matchesSelector = function (node, selector) {
				return $(node).is(selector);
			};
		}

		if (typeof matchesSelector === 'undefined') {
			matchesSelector = Sizzle.matchesSelector;
		}
	}

	// slightly modified version of https://github.com/keeganstreet/specificity/blob/master/specificity.js
	var attributeRegex = /(\[[^\]]+\])/g;
	var idRegex = /(#[^\s\+>~\.\[:]+)/g;
	var classRegex = /(\.[^\s\+>~\.\[:]+)/g;
	var pseudoElementRegex = /(::[^\s\+>~\.\[:]+|:first-line|:first-letter|:before|:after)/gi;
	var pseudoClassWithBracketsRegex = /(:[\w-]+\([^\)]*\))/gi;
	var pseudoClassRegex = /(:[^\s\+>~\.\[:]+)/g;
	var elementRegex = /([^\s\+>~\.\[:]+)/g;
	function getSelectorSpecificity(selector) {
		var typeCount = [0, 0, 0];
		var findMatch = function(regex, type) {
			var matches = selector.match(regex);
			if (matches == null) {
				return;
			}
			typeCount[type] += matches.length;
			selector = selector.replace(regex, ' ');
		};

		selector = selector.replace(/:not\(([^\)]*)\)/g, '     $1 ');
		selector = selector.replace(/{[^]*/gm, ' ');
		findMatch(attributeRegex, 1);
		findMatch(idRegex, 0);
		findMatch(classRegex, 1);
		findMatch(pseudoElementRegex, 2);
		findMatch(pseudoClassWithBracketsRegex, 1);
		findMatch(pseudoClassRegex, 1);
		selector = selector.replace(/[\*\s\+>~]/g, ' ');
		selector = selector.replace(/[#\.]/g, ' ');
		findMatch(elementRegex, 2);
		return typeCount.join('');
	}

	function build(opts) {
		var svg = { opts: opts };

		svg.FRAMERATE = 30;
		svg.MAX_VIRTUAL_PIXELS = 30000;

		svg.log = function(msg) {};
		if (svg.opts['log'] == true && typeof(console) != 'undefined') {
			svg.log = function(msg) { console.log(msg); };
		};

		// globals
		svg.init = function(ctx) {
			var uniqueId = 0;
			svg.UniqueId = function () { uniqueId++; return 'canvg' + uniqueId;	};
			svg.Definitions = {};
			svg.Styles = {};
			svg.StylesSpecificity = {};
			svg.Animations = [];
			svg.Images = [];
			svg.ctx = ctx;
			svg.ViewPort = new (function () {
				this.viewPorts = [];
				this.Clear = function() { this.viewPorts = []; }
				this.SetCurrent = function(width, height) { this.viewPorts.push({ width: width, height: height }); }
				this.RemoveCurrent = function() { this.viewPorts.pop(); }
				this.Current = function() { return this.viewPorts[this.viewPorts.length - 1]; }
				this.width = function() { return this.Current().width; }
				this.height = function() { return this.Current().height; }
				this.ComputeSize = function(d) {
					if (d != null && typeof(d) == 'number') return d;
					if (d == 'x') return this.width();
					if (d == 'y') return this.height();
					return Math.sqrt(Math.pow(this.width(), 2) + Math.pow(this.height(), 2)) / Math.sqrt(2);
				}
			});
		}
		svg.init();

		// images loaded
		svg.ImagesLoaded = function() {
			for (var i=0; i<svg.Images.length; i++) {
				if (!svg.Images[i].loaded) return false;
			}
			return true;
		}

		// trim
		svg.trim = function(s) { return s.replace(/^\s+|\s+$/g, ''); }

		// compress spaces
		svg.compressSpaces = function(s) { return s.replace(/[\s\r\t\n]+/gm,' '); }

		// ajax
		svg.ajax = function(url) {
			var AJAX;
			if(window.XMLHttpRequest){AJAX=new XMLHttpRequest();}
			else{AJAX=new ActiveXObject('Microsoft.XMLHTTP');}
			if(AJAX){
			   AJAX.open('GET',url,false);
			   AJAX.send(null);
			   return AJAX.responseText;
			}
			return null;
		}

		// parse xml
		svg.parseXml = function(xml) {
			if (typeof(Windows) != 'undefined' && typeof(Windows.Data) != 'undefined' && typeof(Windows.Data.Xml) != 'undefined') {
				var xmlDoc = new Windows.Data.Xml.Dom.XmlDocument();
				var settings = new Windows.Data.Xml.Dom.XmlLoadSettings();
				settings.prohibitDtd = false;
				xmlDoc.loadXml(xml, settings);
				return xmlDoc;
			}
			else if (window.DOMParser)
			{
				var parser = new DOMParser();
				return parser.parseFromString(xml, 'text/xml');
			}
			else
			{
				xml = xml.replace(/<!DOCTYPE svg[^>]*>/, '');
				var xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
				xmlDoc.async = 'false';
				xmlDoc.loadXML(xml);
				return xmlDoc;
			}
		}

		svg.Property = function(name, value) {
			this.name = name;
			this.value = value;
		}
			svg.Property.prototype.getValue = function() {
				return this.value;
			}

			svg.Property.prototype.hasValue = function() {
				return (this.value != null && this.value !== '');
			}

			// return the numerical value of the property
			svg.Property.prototype.numValue = function() {
				if (!this.hasValue()) return 0;

				var n = parseFloat(this.value);
				if ((this.value + '').match(/%$/)) {
					n = n / 100.0;
				}
				return n;
			}

			svg.Property.prototype.valueOrDefault = function(def) {
				if (this.hasValue()) return this.value;
				return def;
			}

			svg.Property.prototype.numValueOrDefault = function(def) {
				if (this.hasValue()) return this.numValue();
				return def;
			}

			// color extensions
				// augment the current color value with the opacity
				svg.Property.prototype.addOpacity = function(opacityProp) {
					var newValue = this.value;
					if (opacityProp.value != null && opacityProp.value != '' && typeof(this.value)=='string') { // can only add opacity to colors, not patterns
						var color = new RGBColor(this.value);
						if (color.ok) {
							newValue = 'rgba(' + color.r + ', ' + color.g + ', ' + color.b + ', ' + opacityProp.numValue() + ')';
						}
					}
					return new svg.Property(this.name, newValue);
				}

			// definition extensions
				// get the definition from the definitions table
				svg.Property.prototype.getDefinition = function() {
					var name = this.value.match(/#([^\)'"]+)/);
					if (name) { name = name[1]; }
					if (!name) { name = this.value; }
					return svg.Definitions[name];
				}

				svg.Property.prototype.isUrlDefinition = function() {
					return this.value.indexOf('url(') == 0
				}

				svg.Property.prototype.getFillStyleDefinition = function(e, opacityProp) {
					var def = this.getDefinition();

					// gradient
					if (def != null && def.createGradient) {
						return def.createGradient(svg.ctx, e, opacityProp);
					}

					// pattern
					if (def != null && def.createPattern) {
						if (def.getHrefAttribute().hasValue()) {
							var pt = def.attribute('patternTransform');
							def = def.getHrefAttribute().getDefinition();
							if (pt.hasValue()) { def.attribute('patternTransform', true).value = pt.value; }
						}
						return def.createPattern(svg.ctx, e);
					}

					return null;
				}

			// length extensions
				svg.Property.prototype.getDPI = function(viewPort) {
					return 96.0; // TODO: compute?
				}

				svg.Property.prototype.getEM = function(viewPort) {
					var em = 12;

					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					if (fontSize.hasValue()) em = fontSize.toPixels(viewPort);

					return em;
				}

				svg.Property.prototype.getUnits = function() {
					var s = this.value+'';
					return s.replace(/[0-9\.\-]/g,'');
				}

				// get the length as pixels
				svg.Property.prototype.toPixels = function(viewPort, processPercent) {
					if (!this.hasValue()) return 0;
					var s = this.value+'';
					if (s.match(/em$/)) return this.numValue() * this.getEM(viewPort);
					if (s.match(/ex$/)) return this.numValue() * this.getEM(viewPort) / 2.0;
					if (s.match(/px$/)) return this.numValue();
					if (s.match(/pt$/)) return this.numValue() * this.getDPI(viewPort) * (1.0 / 72.0);
					if (s.match(/pc$/)) return this.numValue() * 15;
					if (s.match(/cm$/)) return this.numValue() * this.getDPI(viewPort) / 2.54;
					if (s.match(/mm$/)) return this.numValue() * this.getDPI(viewPort) / 25.4;
					if (s.match(/in$/)) return this.numValue() * this.getDPI(viewPort);
					if (s.match(/%$/)) return this.numValue() * svg.ViewPort.ComputeSize(viewPort);
					var n = this.numValue();
					if (processPercent && n < 1.0) return n * svg.ViewPort.ComputeSize(viewPort);
					return n;
				}

			// time extensions
				// get the time as milliseconds
				svg.Property.prototype.toMilliseconds = function() {
					if (!this.hasValue()) return 0;
					var s = this.value+'';
					if (s.match(/s$/)) return this.numValue() * 1000;
					if (s.match(/ms$/)) return this.numValue();
					return this.numValue();
				}

			// angle extensions
				// get the angle as radians
				svg.Property.prototype.toRadians = function() {
					if (!this.hasValue()) return 0;
					var s = this.value+'';
					if (s.match(/deg$/)) return this.numValue() * (Math.PI / 180.0);
					if (s.match(/grad$/)) return this.numValue() * (Math.PI / 200.0);
					if (s.match(/rad$/)) return this.numValue();
					return this.numValue() * (Math.PI / 180.0);
				}

			// text extensions
				// get the text baseline
				var textBaselineMapping = {
					'baseline': 'alphabetic',
					'before-edge': 'top',
					'text-before-edge': 'top',
					'middle': 'middle',
					'central': 'middle',
					'after-edge': 'bottom',
					'text-after-edge': 'bottom',
					'ideographic': 'ideographic',
					'alphabetic': 'alphabetic',
					'hanging': 'hanging',
					'mathematical': 'alphabetic'
				};
				svg.Property.prototype.toTextBaseline = function () {
					if (!this.hasValue()) return null;
					return textBaselineMapping[this.value];
				}

		// fonts
		svg.Font = new (function() {
			this.Styles = 'normal|italic|oblique|inherit';
			this.Variants = 'normal|small-caps|inherit';
			this.Weights = 'normal|bold|bolder|lighter|100|200|300|400|500|600|700|800|900|inherit';

			this.CreateFont = function(fontStyle, fontVariant, fontWeight, fontSize, fontFamily, inherit) {
				var f = inherit != null ? this.Parse(inherit) : this.CreateFont('', '', '', '', '', svg.ctx.font);
				return {
					fontFamily: fontFamily || f.fontFamily,
					fontSize: fontSize || f.fontSize,
					fontStyle: fontStyle || f.fontStyle,
					fontWeight: fontWeight || f.fontWeight,
					fontVariant: fontVariant || f.fontVariant,
					toString: function () { return [this.fontStyle, this.fontVariant, this.fontWeight, this.fontSize, this.fontFamily].join(' ') }
				}
			}

			var that = this;
			this.Parse = function(s) {
				var f = {};
				var d = svg.trim(svg.compressSpaces(s || '')).split(' ');
				var set = { fontSize: false, fontStyle: false, fontWeight: false, fontVariant: false }
				var ff = '';
				for (var i=0; i<d.length; i++) {
					if (!set.fontStyle && that.Styles.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontStyle = d[i]; set.fontStyle = true; }
					else if (!set.fontVariant && that.Variants.indexOf(d[i]) != -1) { if (d[i] != 'inherit') f.fontVariant = d[i]; set.fontStyle = set.fontVariant = true;	}
					else if (!set.fontWeight && that.Weights.indexOf(d[i]) != -1) {	if (d[i] != 'inherit') f.fontWeight = d[i]; set.fontStyle = set.fontVariant = set.fontWeight = true; }
					else if (!set.fontSize) { if (d[i] != 'inherit') f.fontSize = d[i].split('/')[0]; set.fontStyle = set.fontVariant = set.fontWeight = set.fontSize = true; }
					else { if (d[i] != 'inherit') ff += d[i]; }
				} if (ff != '') f.fontFamily = ff;
				return f;
			}
		});

		// points and paths
		svg.ToNumberArray = function(s) {
			var a = svg.trim(svg.compressSpaces((s || '').replace(/,/g, ' '))).split(' ');
			for (var i=0; i<a.length; i++) {
				a[i] = parseFloat(a[i]);
			}
			return a;
		}
		svg.Point = function(x, y) {
			this.x = x;
			this.y = y;
		}
			svg.Point.prototype.angleTo = function(p) {
				return Math.atan2(p.y - this.y, p.x - this.x);
			}

			svg.Point.prototype.applyTransform = function(v) {
				var xp = this.x * v[0] + this.y * v[2] + v[4];
				var yp = this.x * v[1] + this.y * v[3] + v[5];
				this.x = xp;
				this.y = yp;
			}

		svg.CreatePoint = function(s) {
			var a = svg.ToNumberArray(s);
			return new svg.Point(a[0], a[1]);
		}
		svg.CreatePath = function(s) {
			var a = svg.ToNumberArray(s);
			var path = [];
			for (var i=0; i<a.length; i+=2) {
				path.push(new svg.Point(a[i], a[i+1]));
			}
			return path;
		}

		// bounding box
		svg.BoundingBox = function(x1, y1, x2, y2) { // pass in initial points if you want
			this.x1 = Number.NaN;
			this.y1 = Number.NaN;
			this.x2 = Number.NaN;
			this.y2 = Number.NaN;

			this.x = function() { return this.x1; }
			this.y = function() { return this.y1; }
			this.width = function() { return this.x2 - this.x1; }
			this.height = function() { return this.y2 - this.y1; }

			this.addPoint = function(x, y) {
				if (x != null) {
					if (isNaN(this.x1) || isNaN(this.x2)) {
						this.x1 = x;
						this.x2 = x;
					}
					if (x < this.x1) this.x1 = x;
					if (x > this.x2) this.x2 = x;
				}

				if (y != null) {
					if (isNaN(this.y1) || isNaN(this.y2)) {
						this.y1 = y;
						this.y2 = y;
					}
					if (y < this.y1) this.y1 = y;
					if (y > this.y2) this.y2 = y;
				}
			}
			this.addX = function(x) { this.addPoint(x, null); }
			this.addY = function(y) { this.addPoint(null, y); }

			this.addBoundingBox = function(bb) {
				this.addPoint(bb.x1, bb.y1);
				this.addPoint(bb.x2, bb.y2);
			}

			this.addQuadraticCurve = function(p0x, p0y, p1x, p1y, p2x, p2y) {
				var cp1x = p0x + 2/3 * (p1x - p0x); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp1y = p0y + 2/3 * (p1y - p0y); // CP1 = QP0 + 2/3 *(QP1-QP0)
				var cp2x = cp1x + 1/3 * (p2x - p0x); // CP2 = CP1 + 1/3 *(QP2-QP0)
				var cp2y = cp1y + 1/3 * (p2y - p0y); // CP2 = CP1 + 1/3 *(QP2-QP0)
				this.addBezierCurve(p0x, p0y, cp1x, cp2x, cp1y,	cp2y, p2x, p2y);
			}

			this.addBezierCurve = function(p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y) {
				// from http://blog.hackers-cafe.net/2009/06/how-to-calculate-bezier-curves-bounding.html
				var p0 = [p0x, p0y], p1 = [p1x, p1y], p2 = [p2x, p2y], p3 = [p3x, p3y];
				this.addPoint(p0[0], p0[1]);
				this.addPoint(p3[0], p3[1]);

				for (i=0; i<=1; i++) {
					var f = function(t) {
						return Math.pow(1-t, 3) * p0[i]
						+ 3 * Math.pow(1-t, 2) * t * p1[i]
						+ 3 * (1-t) * Math.pow(t, 2) * p2[i]
						+ Math.pow(t, 3) * p3[i];
					}

					var b = 6 * p0[i] - 12 * p1[i] + 6 * p2[i];
					var a = -3 * p0[i] + 9 * p1[i] - 9 * p2[i] + 3 * p3[i];
					var c = 3 * p1[i] - 3 * p0[i];

					if (a == 0) {
						if (b == 0) continue;
						var t = -c / b;
						if (0 < t && t < 1) {
							if (i == 0) this.addX(f(t));
							if (i == 1) this.addY(f(t));
						}
						continue;
					}

					var b2ac = Math.pow(b, 2) - 4 * c * a;
					if (b2ac < 0) continue;
					var t1 = (-b + Math.sqrt(b2ac)) / (2 * a);
					if (0 < t1 && t1 < 1) {
						if (i == 0) this.addX(f(t1));
						if (i == 1) this.addY(f(t1));
					}
					var t2 = (-b - Math.sqrt(b2ac)) / (2 * a);
					if (0 < t2 && t2 < 1) {
						if (i == 0) this.addX(f(t2));
						if (i == 1) this.addY(f(t2));
					}
				}
			}

			this.isPointInBox = function(x, y) {
				return (this.x1 <= x && x <= this.x2 && this.y1 <= y && y <= this.y2);
			}

			this.addPoint(x1, y1);
			this.addPoint(x2, y2);
		}

		// transforms
		svg.Transform = function(v) {
			var that = this;
			this.Type = {}

			// translate
			this.Type.translate = function(s) {
				this.p = svg.CreatePoint(s);
				this.apply = function(ctx) {
					ctx.translate(this.p.x || 0.0, this.p.y || 0.0);
				}
				this.unapply = function(ctx) {
					ctx.translate(-1.0 * this.p.x || 0.0, -1.0 * this.p.y || 0.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
				}
			}

			// rotate
			this.Type.rotate = function(s) {
				var a = svg.ToNumberArray(s);
				this.angle = new svg.Property('angle', a[0]);
				this.cx = a[1] || 0;
				this.cy = a[2] || 0;
				this.apply = function(ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(this.angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.unapply = function(ctx) {
					ctx.translate(this.cx, this.cy);
					ctx.rotate(-1.0 * this.angle.toRadians());
					ctx.translate(-this.cx, -this.cy);
				}
				this.applyToPoint = function(p) {
					var a = this.angle.toRadians();
					p.applyTransform([1, 0, 0, 1, this.p.x || 0.0, this.p.y || 0.0]);
					p.applyTransform([Math.cos(a), Math.sin(a), -Math.sin(a), Math.cos(a), 0, 0]);
					p.applyTransform([1, 0, 0, 1, -this.p.x || 0.0, -this.p.y || 0.0]);
				}
			}

			this.Type.scale = function(s) {
				this.p = svg.CreatePoint(s);
				this.apply = function(ctx) {
					ctx.scale(this.p.x || 1.0, this.p.y || this.p.x || 1.0);
				}
				this.unapply = function(ctx) {
					ctx.scale(1.0 / this.p.x || 1.0, 1.0 / this.p.y || this.p.x || 1.0);
				}
				this.applyToPoint = function(p) {
					p.applyTransform([this.p.x || 0.0, 0, 0, this.p.y || 0.0, 0, 0]);
				}
			}

			this.Type.matrix = function(s) {
				this.m = svg.ToNumberArray(s);
				this.apply = function(ctx) {
					ctx.transform(this.m[0], this.m[1], this.m[2], this.m[3], this.m[4], this.m[5]);
				}
				this.unapply = function(ctx) {
					var a = this.m[0];
					var b = this.m[2];
					var c = this.m[4];
					var d = this.m[1];
					var e = this.m[3];
					var f = this.m[5];
					var g = 0.0;
					var h = 0.0;
					var i = 1.0;
					var det = 1 / (a*(e*i-f*h)-b*(d*i-f*g)+c*(d*h-e*g));
					ctx.transform(
						det*(e*i-f*h),
						det*(f*g-d*i),
						det*(c*h-b*i),
						det*(a*i-c*g),
						det*(b*f-c*e),
						det*(c*d-a*f)
					);
				}
				this.applyToPoint = function(p) {
					p.applyTransform(this.m);
				}
			}

			this.Type.SkewBase = function(s) {
				this.base = that.Type.matrix;
				this.base(s);
				this.angle = new svg.Property('angle', s);
			}
			this.Type.SkewBase.prototype = new this.Type.matrix;

			this.Type.skewX = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, 0, Math.tan(this.angle.toRadians()), 1, 0, 0];
			}
			this.Type.skewX.prototype = new this.Type.SkewBase;

			this.Type.skewY = function(s) {
				this.base = that.Type.SkewBase;
				this.base(s);
				this.m = [1, Math.tan(this.angle.toRadians()), 0, 1, 0, 0];
			}
			this.Type.skewY.prototype = new this.Type.SkewBase;

			this.transforms = [];

			this.apply = function(ctx) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].apply(ctx);
				}
			}

			this.unapply = function(ctx) {
				for (var i=this.transforms.length-1; i>=0; i--) {
					this.transforms[i].unapply(ctx);
				}
			}

			this.applyToPoint = function(p) {
				for (var i=0; i<this.transforms.length; i++) {
					this.transforms[i].applyToPoint(p);
				}
			}

			var data = svg.trim(svg.compressSpaces(v)).replace(/\)([a-zA-Z])/g, ') $1').replace(/\)(\s?,\s?)/g,') ').split(/\s(?=[a-z])/);
			for (var i=0; i<data.length; i++) {
				var type = svg.trim(data[i].split('(')[0]);
				var s = data[i].split('(')[1].replace(')','');
				var transform = new this.Type[type](s);
				transform.type = type;
				this.transforms.push(transform);
			}
		}

		// aspect ratio
		svg.AspectRatio = function(ctx, aspectRatio, width, desiredWidth, height, desiredHeight, minX, minY, refX, refY) {
			// aspect ratio - http://www.w3.org/TR/SVG/coords.html#PreserveAspectRatioAttribute
			aspectRatio = svg.compressSpaces(aspectRatio);
			aspectRatio = aspectRatio.replace(/^defer\s/,''); // ignore defer
			var align = aspectRatio.split(' ')[0] || 'xMidYMid';
			var meetOrSlice = aspectRatio.split(' ')[1] || 'meet';

			// calculate scale
			var scaleX = width / desiredWidth;
			var scaleY = height / desiredHeight;
			var scaleMin = Math.min(scaleX, scaleY);
			var scaleMax = Math.max(scaleX, scaleY);
			if (meetOrSlice == 'meet') { desiredWidth *= scaleMin; desiredHeight *= scaleMin; }
			if (meetOrSlice == 'slice') { desiredWidth *= scaleMax; desiredHeight *= scaleMax; }

			refX = new svg.Property('refX', refX);
			refY = new svg.Property('refY', refY);
			if (refX.hasValue() && refY.hasValue()) {
				ctx.translate(-scaleMin * refX.toPixels('x'), -scaleMin * refY.toPixels('y'));
			}
			else {
				// align
				if (align.match(/^xMid/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width / 2.0 - desiredWidth / 2.0, 0);
				if (align.match(/YMid$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height / 2.0 - desiredHeight / 2.0);
				if (align.match(/^xMax/) && ((meetOrSlice == 'meet' && scaleMin == scaleY) || (meetOrSlice == 'slice' && scaleMax == scaleY))) ctx.translate(width - desiredWidth, 0);
				if (align.match(/YMax$/) && ((meetOrSlice == 'meet' && scaleMin == scaleX) || (meetOrSlice == 'slice' && scaleMax == scaleX))) ctx.translate(0, height - desiredHeight);
			}

			// scale
			if (align == 'none') ctx.scale(scaleX, scaleY);
			else if (meetOrSlice == 'meet') ctx.scale(scaleMin, scaleMin);
			else if (meetOrSlice == 'slice') ctx.scale(scaleMax, scaleMax);

			// translate
			ctx.translate(minX == null ? 0 : -minX, minY == null ? 0 : -minY);
		}

		// elements
		svg.Element = {}

		svg.EmptyProperty = new svg.Property('EMPTY', '');

		svg.Element.ElementBase = function(node) {
			this.attributes = {};
			this.styles = {};
			this.stylesSpecificity = {};
			this.children = [];

			// get or create attribute
			this.attribute = function(name, createIfNotExists) {
				var a = this.attributes[name];
				if (a != null) return a;

				if (createIfNotExists == true) { a = new svg.Property(name, ''); this.attributes[name] = a; }
				return a || svg.EmptyProperty;
			}

			this.getHrefAttribute = function() {
				for (var a in this.attributes) {
					if (a == 'href' || a.match(/:href$/)) {
						return this.attributes[a];
					}
				}
				return svg.EmptyProperty;
			}

			// get or create style, crawls up node tree
			this.style = function(name, createIfNotExists, skipAncestors) {
				var s = this.styles[name];
				if (s != null) return s;

				var a = this.attribute(name);
				if (a != null && a.hasValue()) {
					this.styles[name] = a; // move up to me to cache
					return a;
				}

				if (skipAncestors != true) {
					var p = this.parent;
					if (p != null) {
						var ps = p.style(name);
						if (ps != null && ps.hasValue()) {
							return ps;
						}
					}
				}

				if (createIfNotExists == true) { s = new svg.Property(name, ''); this.styles[name] = s; }
				return s || svg.EmptyProperty;
			}

			// base render
			this.render = function(ctx) {
				// don't render display=none
				if (this.style('display').value == 'none') return;

				// don't render visibility=hidden
				if (this.style('visibility').value == 'hidden') return;

				ctx.save();
				if (this.style('mask').hasValue()) { // mask
					var mask = this.style('mask').getDefinition();
					if (mask != null) mask.apply(ctx, this);
				}
				else if (this.style('filter').hasValue()) { // filter
					var filter = this.style('filter').getDefinition();
					if (filter != null) filter.apply(ctx, this);
				}
				else {
					this.setContext(ctx);
					this.renderChildren(ctx);
					this.clearContext(ctx);
				}
				ctx.restore();
			}

			// base set context
			this.setContext = function(ctx) {
				// OVERRIDE ME!
			}

			// base clear context
			this.clearContext = function(ctx) {
				// OVERRIDE ME!
			}

			// base render children
			this.renderChildren = function(ctx) {
				for (var i=0; i<this.children.length; i++) {
					this.children[i].render(ctx);
				}
			}

			this.addChild = function(childNode, create) {
				var child = childNode;
				if (create) child = svg.CreateElement(childNode);
				child.parent = this;
				if (child.type != 'title') { this.children.push(child);	}
			}
			
			this.addStylesFromStyleDefinition = function () {
				// add styles
				for (var selector in svg.Styles) {
					if (selector[0] != '@' && matchesSelector(node, selector)) {
						var styles = svg.Styles[selector];
						var specificity = svg.StylesSpecificity[selector];
						if (styles != null) {
							for (var name in styles) {
								var existingSpecificity = this.stylesSpecificity[name];
								if (typeof(existingSpecificity) == 'undefined') {
									existingSpecificity = '000';
								}
								if (specificity > existingSpecificity) {
									this.styles[name] = styles[name];
									this.stylesSpecificity[name] = specificity;
								}
							}
						}
					}
				}
			};

			if (node != null && node.nodeType == 1) { //ELEMENT_NODE
				// add attributes
				for (var i=0; i<node.attributes.length; i++) {
					var attribute = node.attributes[i];
					this.attributes[attribute.nodeName] = new svg.Property(attribute.nodeName, attribute.value);
				}
				
				this.addStylesFromStyleDefinition();

				// add inline styles
				if (this.attribute('style').hasValue()) {
					var styles = this.attribute('style').value.split(';');
					for (var i=0; i<styles.length; i++) {
						if (svg.trim(styles[i]) != '') {
							var style = styles[i].split(':');
							var name = svg.trim(style[0]);
							var value = svg.trim(style[1]);
							this.styles[name] = new svg.Property(name, value);
						}
					}
				}

				// add id
				if (this.attribute('id').hasValue()) {
					if (svg.Definitions[this.attribute('id').value] == null) {
						svg.Definitions[this.attribute('id').value] = this;
					}
				}

				// add children
				for (var i=0; i<node.childNodes.length; i++) {
					var childNode = node.childNodes[i];
					if (childNode.nodeType == 1) this.addChild(childNode, true); //ELEMENT_NODE
					if (this.captureTextNodes && (childNode.nodeType == 3 || childNode.nodeType == 4)) {
						var text = childNode.value || childNode.text || childNode.textContent || '';
						if (svg.compressSpaces(text) != '') {
							this.addChild(new svg.Element.tspan(childNode), false); // TEXT_NODE
						}
					}
				}
			}
		}

		svg.Element.RenderedElementBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.setContext = function(ctx) {
				// fill
				if (this.style('fill').isUrlDefinition()) {
					var fs = this.style('fill').getFillStyleDefinition(this, this.style('fill-opacity'));
					if (fs != null) ctx.fillStyle = fs;
				}
				else if (this.style('fill').hasValue()) {
					var fillStyle = this.style('fill');
					if (fillStyle.value == 'currentColor') fillStyle.value = this.style('color').value;
					if (fillStyle.value != 'inherit') ctx.fillStyle = (fillStyle.value == 'none' ? 'rgba(0,0,0,0)' : fillStyle.value);
				}
				if (this.style('fill-opacity').hasValue()) {
					var fillStyle = new svg.Property('fill', ctx.fillStyle);
					fillStyle = fillStyle.addOpacity(this.style('fill-opacity'));
					ctx.fillStyle = fillStyle.value;
				}

				// stroke
				if (this.style('stroke').isUrlDefinition()) {
					var fs = this.style('stroke').getFillStyleDefinition(this, this.style('stroke-opacity'));
					if (fs != null) ctx.strokeStyle = fs;
				}
				else if (this.style('stroke').hasValue()) {
					var strokeStyle = this.style('stroke');
					if (strokeStyle.value == 'currentColor') strokeStyle.value = this.style('color').value;
					if (strokeStyle.value != 'inherit') ctx.strokeStyle = (strokeStyle.value == 'none' ? 'rgba(0,0,0,0)' : strokeStyle.value);
				}
				if (this.style('stroke-opacity').hasValue()) {
					var strokeStyle = new svg.Property('stroke', ctx.strokeStyle);
					strokeStyle = strokeStyle.addOpacity(this.style('stroke-opacity'));
					ctx.strokeStyle = strokeStyle.value;
				}
				if (this.style('stroke-width').hasValue()) {
					var newLineWidth = this.style('stroke-width').toPixels();
					ctx.lineWidth = newLineWidth == 0 ? 0.001 : newLineWidth; // browsers don't respect 0
			    }
				if (this.style('stroke-linecap').hasValue()) ctx.lineCap = this.style('stroke-linecap').value;
				if (this.style('stroke-linejoin').hasValue()) ctx.lineJoin = this.style('stroke-linejoin').value;
				if (this.style('stroke-miterlimit').hasValue()) ctx.miterLimit = this.style('stroke-miterlimit').value;
				if (this.style('stroke-dasharray').hasValue() && this.style('stroke-dasharray').value != 'none') {
					var gaps = svg.ToNumberArray(this.style('stroke-dasharray').value);
					if (typeof(ctx.setLineDash) != 'undefined') { ctx.setLineDash(gaps); }
					else if (typeof(ctx.webkitLineDash) != 'undefined') { ctx.webkitLineDash = gaps; }
					else if (typeof(ctx.mozDash) != 'undefined' && !(gaps.length==1 && gaps[0]==0)) { ctx.mozDash = gaps; }

					var offset = this.style('stroke-dashoffset').numValueOrDefault(1);
					if (typeof(ctx.lineDashOffset) != 'undefined') { ctx.lineDashOffset = offset; }
					else if (typeof(ctx.webkitLineDashOffset) != 'undefined') { ctx.webkitLineDashOffset = offset; }
					else if (typeof(ctx.mozDashOffset) != 'undefined') { ctx.mozDashOffset = offset; }
				}

				// font
				if (typeof(ctx.font) != 'undefined') {
					ctx.font = svg.Font.CreateFont(
						this.style('font-style').value,
						this.style('font-variant').value,
						this.style('font-weight').value,
						this.style('font-size').hasValue() ? this.style('font-size').toPixels() + 'px' : '',
						this.style('font-family').value).toString();
				}

				// transform
				if (this.style('transform', false, true).hasValue()) {
					var transform = new svg.Transform(this.style('transform', false, true).value);
					transform.apply(ctx);
				}

				// clip
				if (this.style('clip-path', false, true).hasValue()) {
					var clip = this.style('clip-path', false, true).getDefinition();
					if (clip != null) clip.apply(ctx);
				}

				// opacity
				if (this.style('opacity').hasValue()) {
					ctx.globalAlpha = this.style('opacity').numValue();
				}
			}
		}
		svg.Element.RenderedElementBase.prototype = new svg.Element.ElementBase;

		svg.Element.PathElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.path = function(ctx) {
				if (ctx != null) ctx.beginPath();
				return new svg.BoundingBox();
			}

			this.renderChildren = function(ctx) {
				this.path(ctx);
				svg.Mouse.checkPath(this, ctx);
				if (ctx.fillStyle != '') {
					if (this.style('fill-rule').valueOrDefault('inherit') != 'inherit') { ctx.fill(this.style('fill-rule').value); }
					else { ctx.fill(); }
				}
				if (ctx.strokeStyle != '') ctx.stroke();

				var markers = this.getMarkers();
				if (markers != null) {
					if (this.style('marker-start').isUrlDefinition()) {
						var marker = this.style('marker-start').getDefinition();
						marker.render(ctx, markers[0][0], markers[0][1]);
					}
					if (this.style('marker-mid').isUrlDefinition()) {
						var marker = this.style('marker-mid').getDefinition();
						for (var i=1;i<markers.length-1;i++) {
							marker.render(ctx, markers[i][0], markers[i][1]);
						}
					}
					if (this.style('marker-end').isUrlDefinition()) {
						var marker = this.style('marker-end').getDefinition();
						marker.render(ctx, markers[markers.length-1][0], markers[markers.length-1][1]);
					}
				}
			}

			this.getBoundingBox = function() {
				return this.path();
			}

			this.getMarkers = function() {
				return null;
			}
		}
		svg.Element.PathElementBase.prototype = new svg.Element.RenderedElementBase;

		// svg element
		svg.Element.svg = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseClearContext = this.clearContext;
			this.clearContext = function(ctx) {
				this.baseClearContext(ctx);
				svg.ViewPort.RemoveCurrent();
			}

			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				// initial values and defaults
				ctx.strokeStyle = 'rgba(0,0,0,0)';
				ctx.lineCap = 'butt';
				ctx.lineJoin = 'miter';
				ctx.miterLimit = 4;
				if (typeof(ctx.font) != 'undefined' && typeof(window.getComputedStyle) != 'undefined') {
					ctx.font = window.getComputedStyle(ctx.canvas).getPropertyValue('font');
				}

				this.baseSetContext(ctx);

				// create new view port
				if (!this.attribute('x').hasValue()) this.attribute('x', true).value = 0;
				if (!this.attribute('y').hasValue()) this.attribute('y', true).value = 0;
				ctx.translate(this.attribute('x').toPixels('x'), this.attribute('y').toPixels('y'));

				var width = svg.ViewPort.width();
				var height = svg.ViewPort.height();

				if (!this.attribute('width').hasValue()) this.attribute('width', true).value = '100%';
				if (!this.attribute('height').hasValue()) this.attribute('height', true).value = '100%';
				if (typeof(this.root) == 'undefined') {
					width = this.attribute('width').toPixels('x');
					height = this.attribute('height').toPixels('y');

					var x = 0;
					var y = 0;
					if (this.attribute('refX').hasValue() && this.attribute('refY').hasValue()) {
						x = -this.attribute('refX').toPixels('x');
						y = -this.attribute('refY').toPixels('y');
					}

					if (this.attribute('overflow').valueOrDefault('hidden') != 'visible') {
						ctx.beginPath();
						ctx.moveTo(x, y);
						ctx.lineTo(width, y);
						ctx.lineTo(width, height);
						ctx.lineTo(x, height);
						ctx.closePath();
						ctx.clip();
					}
				}
				svg.ViewPort.SetCurrent(width, height);

				// viewbox
				if (this.attribute('viewBox').hasValue()) {
					var viewBox = svg.ToNumberArray(this.attribute('viewBox').value);
					var minX = viewBox[0];
					var minY = viewBox[1];
					width = viewBox[2];
					height = viewBox[3];

					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value,
									svg.ViewPort.width(),
									width,
									svg.ViewPort.height(),
									height,
									minX,
									minY,
									this.attribute('refX').value,
									this.attribute('refY').value);

					svg.ViewPort.RemoveCurrent();
					svg.ViewPort.SetCurrent(viewBox[2], viewBox[3]);
				}
			}
		}
		svg.Element.svg.prototype = new svg.Element.RenderedElementBase;

		// rect element
		svg.Element.rect = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function(ctx) {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				var rx = this.attribute('rx').toPixels('x');
				var ry = this.attribute('ry').toPixels('y');
				if (this.attribute('rx').hasValue() && !this.attribute('ry').hasValue()) ry = rx;
				if (this.attribute('ry').hasValue() && !this.attribute('rx').hasValue()) rx = ry;
				rx = Math.min(rx, width / 2.0);
				ry = Math.min(ry, height / 2.0);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(x + rx, y);
					ctx.lineTo(x + width - rx, y);
					ctx.quadraticCurveTo(x + width, y, x + width, y + ry)
					ctx.lineTo(x + width, y + height - ry);
					ctx.quadraticCurveTo(x + width, y + height, x + width - rx, y + height)
					ctx.lineTo(x + rx, y + height);
					ctx.quadraticCurveTo(x, y + height, x, y + height - ry)
					ctx.lineTo(x, y + ry);
					ctx.quadraticCurveTo(x, y, x + rx, y)
					ctx.closePath();
				}

				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.rect.prototype = new svg.Element.PathElementBase;

		// circle element
		svg.Element.circle = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function(ctx) {
				var cx = this.attribute('cx').toPixels('x');
				var cy = this.attribute('cy').toPixels('y');
				var r = this.attribute('r').toPixels();

				if (ctx != null) {
					ctx.beginPath();
					ctx.arc(cx, cy, r, 0, Math.PI * 2, true);
					ctx.closePath();
				}

				return new svg.BoundingBox(cx - r, cy - r, cx + r, cy + r);
			}
		}
		svg.Element.circle.prototype = new svg.Element.PathElementBase;

		// ellipse element
		svg.Element.ellipse = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.path = function(ctx) {
				var KAPPA = 4 * ((Math.sqrt(2) - 1) / 3);
				var rx = this.attribute('rx').toPixels('x');
				var ry = this.attribute('ry').toPixels('y');
				var cx = this.attribute('cx').toPixels('x');
				var cy = this.attribute('cy').toPixels('y');

				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(cx, cy - ry);
					ctx.bezierCurveTo(cx + (KAPPA * rx), cy - ry,  cx + rx, cy - (KAPPA * ry), cx + rx, cy);
					ctx.bezierCurveTo(cx + rx, cy + (KAPPA * ry), cx + (KAPPA * rx), cy + ry, cx, cy + ry);
					ctx.bezierCurveTo(cx - (KAPPA * rx), cy + ry, cx - rx, cy + (KAPPA * ry), cx - rx, cy);
					ctx.bezierCurveTo(cx - rx, cy - (KAPPA * ry), cx - (KAPPA * rx), cy - ry, cx, cy - ry);
					ctx.closePath();
				}

				return new svg.BoundingBox(cx - rx, cy - ry, cx + rx, cy + ry);
			}
		}
		svg.Element.ellipse.prototype = new svg.Element.PathElementBase;

		// line element
		svg.Element.line = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.getPoints = function() {
				return [
					new svg.Point(this.attribute('x1').toPixels('x'), this.attribute('y1').toPixels('y')),
					new svg.Point(this.attribute('x2').toPixels('x'), this.attribute('y2').toPixels('y'))];
			}

			this.path = function(ctx) {
				var points = this.getPoints();

				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(points[0].x, points[0].y);
					ctx.lineTo(points[1].x, points[1].y);
				}

				return new svg.BoundingBox(points[0].x, points[0].y, points[1].x, points[1].y);
			}

			this.getMarkers = function() {
				var points = this.getPoints();
				var a = points[0].angleTo(points[1]);
				return [[points[0], a], [points[1], a]];
			}
		}
		svg.Element.line.prototype = new svg.Element.PathElementBase;

		// polyline element
		svg.Element.polyline = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			this.points = svg.CreatePath(this.attribute('points').value);
			this.path = function(ctx) {
				var bb = new svg.BoundingBox(this.points[0].x, this.points[0].y);
				if (ctx != null) {
					ctx.beginPath();
					ctx.moveTo(this.points[0].x, this.points[0].y);
				}
				for (var i=1; i<this.points.length; i++) {
					bb.addPoint(this.points[i].x, this.points[i].y);
					if (ctx != null) ctx.lineTo(this.points[i].x, this.points[i].y);
				}
				return bb;
			}

			this.getMarkers = function() {
				var markers = [];
				for (var i=0; i<this.points.length - 1; i++) {
					markers.push([this.points[i], this.points[i].angleTo(this.points[i+1])]);
				}
				markers.push([this.points[this.points.length-1], markers[markers.length-1][1]]);
				return markers;
			}
		}
		svg.Element.polyline.prototype = new svg.Element.PathElementBase;

		// polygon element
		svg.Element.polygon = function(node) {
			this.base = svg.Element.polyline;
			this.base(node);

			this.basePath = this.path;
			this.path = function(ctx) {
				var bb = this.basePath(ctx);
				if (ctx != null) {
					ctx.lineTo(this.points[0].x, this.points[0].y);
					ctx.closePath();
				}
				return bb;
			}
		}
		svg.Element.polygon.prototype = new svg.Element.polyline;

		// path element
		svg.Element.path = function(node) {
			this.base = svg.Element.PathElementBase;
			this.base(node);

			var d = this.attribute('d').value;
			// TODO: convert to real lexer based on http://www.w3.org/TR/SVG11/paths.html#PathDataBNF
			d = d.replace(/,/gm,' '); // get rid of all commas
			// As the end of a match can also be the start of the next match, we need to run this replace twice.
			for(var i=0; i<2; i++)
				d = d.replace(/([MmZzLlHhVvCcSsQqTtAa])([^\s])/gm,'$1 $2'); // suffix commands with spaces
			d = d.replace(/([^\s])([MmZzLlHhVvCcSsQqTtAa])/gm,'$1 $2'); // prefix commands with spaces
			d = d.replace(/([0-9])([+\-])/gm,'$1 $2'); // separate digits on +- signs
			// Again, we need to run this twice to find all occurances
			for(var i=0; i<2; i++)
				d = d.replace(/(\.[0-9]*)(\.)/gm,'$1 $2'); // separate digits when they start with a comma
			d = d.replace(/([Aa](\s+[0-9]+){3})\s+([01])\s*([01])/gm,'$1 $3 $4 '); // shorthand elliptical arc path syntax
			d = svg.compressSpaces(d); // compress multiple spaces
			d = svg.trim(d);
			this.PathParser = new (function(d) {
				this.tokens = d.split(' ');

				this.reset = function() {
					this.i = -1;
					this.command = '';
					this.previousCommand = '';
					this.start = new svg.Point(0, 0);
					this.control = new svg.Point(0, 0);
					this.current = new svg.Point(0, 0);
					this.points = [];
					this.angles = [];
				}

				this.isEnd = function() {
					return this.i >= this.tokens.length - 1;
				}

				this.isCommandOrEnd = function() {
					if (this.isEnd()) return true;
					return this.tokens[this.i + 1].match(/^[A-Za-z]$/) != null;
				}

				this.isRelativeCommand = function() {
					switch(this.command)
					{
						case 'm':
						case 'l':
						case 'h':
						case 'v':
						case 'c':
						case 's':
						case 'q':
						case 't':
						case 'a':
						case 'z':
							return true;
							break;
					}
					return false;
				}

				this.getToken = function() {
					this.i++;
					return this.tokens[this.i];
				}

				this.getScalar = function() {
					return parseFloat(this.getToken());
				}

				this.nextCommand = function() {
					this.previousCommand = this.command;
					this.command = this.getToken();
				}

				this.getPoint = function() {
					var p = new svg.Point(this.getScalar(), this.getScalar());
					return this.makeAbsolute(p);
				}

				this.getAsControlPoint = function() {
					var p = this.getPoint();
					this.control = p;
					return p;
				}

				this.getAsCurrentPoint = function() {
					var p = this.getPoint();
					this.current = p;
					return p;
				}

				this.getReflectedControlPoint = function() {
					if (this.previousCommand.toLowerCase() != 'c' &&
					    this.previousCommand.toLowerCase() != 's' &&
						this.previousCommand.toLowerCase() != 'q' &&
						this.previousCommand.toLowerCase() != 't' ){
						return this.current;
					}

					// reflect point
					var p = new svg.Point(2 * this.current.x - this.control.x, 2 * this.current.y - this.control.y);
					return p;
				}

				this.makeAbsolute = function(p) {
					if (this.isRelativeCommand()) {
						p.x += this.current.x;
						p.y += this.current.y;
					}
					return p;
				}

				this.addMarker = function(p, from, priorTo) {
					// if the last angle isn't filled in because we didn't have this point yet ...
					if (priorTo != null && this.angles.length > 0 && this.angles[this.angles.length-1] == null) {
						this.angles[this.angles.length-1] = this.points[this.points.length-1].angleTo(priorTo);
					}
					this.addMarkerAngle(p, from == null ? null : from.angleTo(p));
				}

				this.addMarkerAngle = function(p, a) {
					this.points.push(p);
					this.angles.push(a);
				}

				this.getMarkerPoints = function() { return this.points; }
				this.getMarkerAngles = function() {
					for (var i=0; i<this.angles.length; i++) {
						if (this.angles[i] == null) {
							for (var j=i+1; j<this.angles.length; j++) {
								if (this.angles[j] != null) {
									this.angles[i] = this.angles[j];
									break;
								}
							}
						}
					}
					return this.angles;
				}
			})(d);

			this.path = function(ctx) {
				var pp = this.PathParser;
				pp.reset();

				var bb = new svg.BoundingBox();
				if (ctx != null) ctx.beginPath();
				while (!pp.isEnd()) {
					pp.nextCommand();
					switch (pp.command) {
					case 'M':
					case 'm':
						var p = pp.getAsCurrentPoint();
						pp.addMarker(p);
						bb.addPoint(p.x, p.y);
						if (ctx != null) ctx.moveTo(p.x, p.y);
						pp.start = pp.current;
						while (!pp.isCommandOrEnd()) {
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, pp.start);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'L':
					case 'l':
						while (!pp.isCommandOrEnd()) {
							var c = pp.current;
							var p = pp.getAsCurrentPoint();
							pp.addMarker(p, c);
							bb.addPoint(p.x, p.y);
							if (ctx != null) ctx.lineTo(p.x, p.y);
						}
						break;
					case 'H':
					case 'h':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point((pp.isRelativeCommand() ? pp.current.x : 0) + pp.getScalar(), pp.current.y);
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'V':
					case 'v':
						while (!pp.isCommandOrEnd()) {
							var newP = new svg.Point(pp.current.x, (pp.isRelativeCommand() ? pp.current.y : 0) + pp.getScalar());
							pp.addMarker(newP, pp.current);
							pp.current = newP;
							bb.addPoint(pp.current.x, pp.current.y);
							if (ctx != null) ctx.lineTo(pp.current.x, pp.current.y);
						}
						break;
					case 'C':
					case 'c':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'S':
					case 's':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var p1 = pp.getReflectedControlPoint();
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, p1);
							bb.addBezierCurve(curr.x, curr.y, p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.bezierCurveTo(p1.x, p1.y, cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'Q':
					case 'q':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getAsControlPoint();
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'T':
					case 't':
						while (!pp.isCommandOrEnd()) {
							var curr = pp.current;
							var cntrl = pp.getReflectedControlPoint();
							pp.control = cntrl;
							var cp = pp.getAsCurrentPoint();
							pp.addMarker(cp, cntrl, cntrl);
							bb.addQuadraticCurve(curr.x, curr.y, cntrl.x, cntrl.y, cp.x, cp.y);
							if (ctx != null) ctx.quadraticCurveTo(cntrl.x, cntrl.y, cp.x, cp.y);
						}
						break;
					case 'A':
					case 'a':
						while (!pp.isCommandOrEnd()) {
						    var curr = pp.current;
							var rx = pp.getScalar();
							var ry = pp.getScalar();
							var xAxisRotation = pp.getScalar() * (Math.PI / 180.0);
							var largeArcFlag = pp.getScalar();
							var sweepFlag = pp.getScalar();
							var cp = pp.getAsCurrentPoint();

							// Conversion from endpoint to center parameterization
							// http://www.w3.org/TR/SVG11/implnote.html#ArcImplementationNotes
							// x1', y1'
							var currp = new svg.Point(
								Math.cos(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.sin(xAxisRotation) * (curr.y - cp.y) / 2.0,
								-Math.sin(xAxisRotation) * (curr.x - cp.x) / 2.0 + Math.cos(xAxisRotation) * (curr.y - cp.y) / 2.0
							);
							// adjust radii
							var l = Math.pow(currp.x,2)/Math.pow(rx,2)+Math.pow(currp.y,2)/Math.pow(ry,2);
							if (l > 1) {
								rx *= Math.sqrt(l);
								ry *= Math.sqrt(l);
							}
							// cx', cy'
							var s = (largeArcFlag == sweepFlag ? -1 : 1) * Math.sqrt(
								((Math.pow(rx,2)*Math.pow(ry,2))-(Math.pow(rx,2)*Math.pow(currp.y,2))-(Math.pow(ry,2)*Math.pow(currp.x,2))) /
								(Math.pow(rx,2)*Math.pow(currp.y,2)+Math.pow(ry,2)*Math.pow(currp.x,2))
							);
							if (isNaN(s)) s = 0;
							var cpp = new svg.Point(s * rx * currp.y / ry, s * -ry * currp.x / rx);
							// cx, cy
							var centp = new svg.Point(
								(curr.x + cp.x) / 2.0 + Math.cos(xAxisRotation) * cpp.x - Math.sin(xAxisRotation) * cpp.y,
								(curr.y + cp.y) / 2.0 + Math.sin(xAxisRotation) * cpp.x + Math.cos(xAxisRotation) * cpp.y
							);
							// vector magnitude
							var m = function(v) { return Math.sqrt(Math.pow(v[0],2) + Math.pow(v[1],2)); }
							// ratio between two vectors
							var r = function(u, v) { return (u[0]*v[0]+u[1]*v[1]) / (m(u)*m(v)) }
							// angle between two vectors
							var a = function(u, v) { return (u[0]*v[1] < u[1]*v[0] ? -1 : 1) * Math.acos(r(u,v)); }
							// initial angle
							var a1 = a([1,0], [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry]);
							// angle delta
							var u = [(currp.x-cpp.x)/rx,(currp.y-cpp.y)/ry];
							var v = [(-currp.x-cpp.x)/rx,(-currp.y-cpp.y)/ry];
							var ad = a(u, v);
							if (r(u,v) <= -1) ad = Math.PI;
							if (r(u,v) >= 1) ad = 0;

							// for markers
							var dir = 1 - sweepFlag ? 1.0 : -1.0;
							var ah = a1 + dir * (ad / 2.0);
							var halfWay = new svg.Point(
								centp.x + rx * Math.cos(ah),
								centp.y + ry * Math.sin(ah)
							);
							pp.addMarkerAngle(halfWay, ah - dir * Math.PI / 2);
							pp.addMarkerAngle(cp, ah - dir * Math.PI);

							bb.addPoint(cp.x, cp.y); // TODO: this is too naive, make it better
							if (ctx != null) {
								var r = rx > ry ? rx : ry;
								var sx = rx > ry ? 1 : rx / ry;
								var sy = rx > ry ? ry / rx : 1;

								ctx.translate(centp.x, centp.y);
								ctx.rotate(xAxisRotation);
								ctx.scale(sx, sy);
								ctx.arc(0, 0, r, a1, a1 + ad, 1 - sweepFlag);
								ctx.scale(1/sx, 1/sy);
								ctx.rotate(-xAxisRotation);
								ctx.translate(-centp.x, -centp.y);
							}
						}
						break;
					case 'Z':
					case 'z':
						if (ctx != null) ctx.closePath();
						pp.current = pp.start;
					}
				}

				return bb;
			}

			this.getMarkers = function() {
				var points = this.PathParser.getMarkerPoints();
				var angles = this.PathParser.getMarkerAngles();

				var markers = [];
				for (var i=0; i<points.length; i++) {
					markers.push([points[i], angles[i]]);
				}
				return markers;
			}
		}
		svg.Element.path.prototype = new svg.Element.PathElementBase;

		// pattern element
		svg.Element.pattern = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.createPattern = function(ctx, element) {
				var width = this.attribute('width').toPixels('x', true);
				var height = this.attribute('height').toPixels('y', true);

				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['width'] = new svg.Property('width', width + 'px');
				tempSvg.attributes['height'] = new svg.Property('height', height + 'px');
				tempSvg.attributes['transform'] = new svg.Property('transform', this.attribute('patternTransform').value);
				tempSvg.children = this.children;

				var c = document.createElement('canvas');
				c.width = width;
				c.height = height;
				var cctx = c.getContext('2d');
				if (this.attribute('x').hasValue() && this.attribute('y').hasValue()) {
					cctx.translate(this.attribute('x').toPixels('x', true), this.attribute('y').toPixels('y', true));
				}
				// render 3x3 grid so when we transform there's no white space on edges
				for (var x=-1; x<=1; x++) {
					for (var y=-1; y<=1; y++) {
						cctx.save();
						tempSvg.attributes['x'] = new svg.Property('x', x * c.width);
						tempSvg.attributes['y'] = new svg.Property('y', y * c.height);
						tempSvg.render(cctx);
						cctx.restore();
					}
				}
				var pattern = ctx.createPattern(c, 'repeat');
				return pattern;
			}
		}
		svg.Element.pattern.prototype = new svg.Element.ElementBase;

		// marker element
		svg.Element.marker = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.baseRender = this.render;
			this.render = function(ctx, point, angle) {
				ctx.translate(point.x, point.y);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(angle);
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(ctx.lineWidth, ctx.lineWidth);
				ctx.save();

				// render me using a temporary svg element
				var tempSvg = new svg.Element.svg();
				tempSvg.attributes['viewBox'] = new svg.Property('viewBox', this.attribute('viewBox').value);
				tempSvg.attributes['refX'] = new svg.Property('refX', this.attribute('refX').value);
				tempSvg.attributes['refY'] = new svg.Property('refY', this.attribute('refY').value);
				tempSvg.attributes['width'] = new svg.Property('width', this.attribute('markerWidth').value);
				tempSvg.attributes['height'] = new svg.Property('height', this.attribute('markerHeight').value);
				tempSvg.attributes['fill'] = new svg.Property('fill', this.attribute('fill').valueOrDefault('black'));
				tempSvg.attributes['stroke'] = new svg.Property('stroke', this.attribute('stroke').valueOrDefault('none'));
				tempSvg.children = this.children;
				tempSvg.render(ctx);

				ctx.restore();
				if (this.attribute('markerUnits').valueOrDefault('strokeWidth') == 'strokeWidth') ctx.scale(1/ctx.lineWidth, 1/ctx.lineWidth);
				if (this.attribute('orient').valueOrDefault('auto') == 'auto') ctx.rotate(-angle);
				ctx.translate(-point.x, -point.y);
			}
		}
		svg.Element.marker.prototype = new svg.Element.ElementBase;

		// definitions element
		svg.Element.defs = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.render = function(ctx) {
				// NOOP
			}
		}
		svg.Element.defs.prototype = new svg.Element.ElementBase;

		// base for gradients
		svg.Element.GradientBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.stops = [];
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'stop') this.stops.push(child);
			}

			this.getGradient = function() {
				// OVERRIDE ME!
			}
			
			this.gradientUnits = function () {
				return this.attribute('gradientUnits').valueOrDefault('objectBoundingBox');
			}
			
			this.attributesToInherit = ['gradientUnits'];
			
			this.inheritStopContainer = function (stopsContainer) {
				for (var i=0; i<this.attributesToInherit.length; i++) {
					var attributeToInherit = this.attributesToInherit[i];
					if (!this.attribute(attributeToInherit).hasValue() && stopsContainer.attribute(attributeToInherit).hasValue()) {
						this.attribute(attributeToInherit, true).value = stopsContainer.attribute(attributeToInherit).value;
					}
				}
			}

			this.createGradient = function(ctx, element, parentOpacityProp) {
				var stopsContainer = this;
				if (this.getHrefAttribute().hasValue()) {
					stopsContainer = this.getHrefAttribute().getDefinition();
					this.inheritStopContainer(stopsContainer);
				}

				var addParentOpacity = function (color) {
					if (parentOpacityProp.hasValue()) {
						var p = new svg.Property('color', color);
						return p.addOpacity(parentOpacityProp).value;
					}
					return color;
				};

				var g = this.getGradient(ctx, element);
				if (g == null) return addParentOpacity(stopsContainer.stops[stopsContainer.stops.length - 1].color);
				for (var i=0; i<stopsContainer.stops.length; i++) {
					g.addColorStop(stopsContainer.stops[i].offset, addParentOpacity(stopsContainer.stops[i].color));
				}

				if (this.attribute('gradientTransform').hasValue()) {
					// render as transformed pattern on temporary canvas
					var rootView = svg.ViewPort.viewPorts[0];

					var rect = new svg.Element.rect();
					rect.attributes['x'] = new svg.Property('x', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['y'] = new svg.Property('y', -svg.MAX_VIRTUAL_PIXELS/3.0);
					rect.attributes['width'] = new svg.Property('width', svg.MAX_VIRTUAL_PIXELS);
					rect.attributes['height'] = new svg.Property('height', svg.MAX_VIRTUAL_PIXELS);

					var group = new svg.Element.g();
					group.attributes['transform'] = new svg.Property('transform', this.attribute('gradientTransform').value);
					group.children = [ rect ];

					var tempSvg = new svg.Element.svg();
					tempSvg.attributes['x'] = new svg.Property('x', 0);
					tempSvg.attributes['y'] = new svg.Property('y', 0);
					tempSvg.attributes['width'] = new svg.Property('width', rootView.width);
					tempSvg.attributes['height'] = new svg.Property('height', rootView.height);
					tempSvg.children = [ group ];

					var c = document.createElement('canvas');
					c.width = rootView.width;
					c.height = rootView.height;
					var tempCtx = c.getContext('2d');
					tempCtx.fillStyle = g;
					tempSvg.render(tempCtx);
					return tempCtx.createPattern(c, 'no-repeat');
				}

				return g;
			}
		}
		svg.Element.GradientBase.prototype = new svg.Element.ElementBase;

		// linear gradient element
		svg.Element.linearGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.attributesToInherit.push('x1');
			this.attributesToInherit.push('y1');
			this.attributesToInherit.push('x2');
			this.attributesToInherit.push('y2');

			this.getGradient = function(ctx, element) {
				var bb = this.gradientUnits() == 'objectBoundingBox' ? element.getBoundingBox() : null;

				if (!this.attribute('x1').hasValue()
				 && !this.attribute('y1').hasValue()
				 && !this.attribute('x2').hasValue()
				 && !this.attribute('y2').hasValue()) {
					this.attribute('x1', true).value = 0;
					this.attribute('y1', true).value = 0;
					this.attribute('x2', true).value = 1;
					this.attribute('y2', true).value = 0;
				 }

				var x1 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('x1').numValue()
					: this.attribute('x1').toPixels('x'));
				var y1 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('y1').numValue()
					: this.attribute('y1').toPixels('y'));
				var x2 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('x2').numValue()
					: this.attribute('x2').toPixels('x'));
				var y2 = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('y2').numValue()
					: this.attribute('y2').toPixels('y'));

				if (x1 == x2 && y1 == y2) return null;
				return ctx.createLinearGradient(x1, y1, x2, y2);
			}
		}
		svg.Element.linearGradient.prototype = new svg.Element.GradientBase;

		// radial gradient element
		svg.Element.radialGradient = function(node) {
			this.base = svg.Element.GradientBase;
			this.base(node);
			
			this.attributesToInherit.push('cx');
			this.attributesToInherit.push('cy');
			this.attributesToInherit.push('r');
			this.attributesToInherit.push('fx');
			this.attributesToInherit.push('fy');

			this.getGradient = function(ctx, element) {
				var bb = element.getBoundingBox();

				if (!this.attribute('cx').hasValue()) this.attribute('cx', true).value = '50%';
				if (!this.attribute('cy').hasValue()) this.attribute('cy', true).value = '50%';
				if (!this.attribute('r').hasValue()) this.attribute('r', true).value = '50%';

				var cx = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('cx').numValue()
					: this.attribute('cx').toPixels('x'));
				var cy = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('cy').numValue()
					: this.attribute('cy').toPixels('y'));

				var fx = cx;
				var fy = cy;
				if (this.attribute('fx').hasValue()) {
					fx = (this.gradientUnits() == 'objectBoundingBox'
					? bb.x() + bb.width() * this.attribute('fx').numValue()
					: this.attribute('fx').toPixels('x'));
				}
				if (this.attribute('fy').hasValue()) {
					fy = (this.gradientUnits() == 'objectBoundingBox'
					? bb.y() + bb.height() * this.attribute('fy').numValue()
					: this.attribute('fy').toPixels('y'));
				}

				var r = (this.gradientUnits() == 'objectBoundingBox'
					? (bb.width() + bb.height()) / 2.0 * this.attribute('r').numValue()
					: this.attribute('r').toPixels());

				return ctx.createRadialGradient(fx, fy, 0, cx, cy, r);
			}
		}
		svg.Element.radialGradient.prototype = new svg.Element.GradientBase;

		// gradient stop element
		svg.Element.stop = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.offset = this.attribute('offset').numValue();
			if (this.offset < 0) this.offset = 0;
			if (this.offset > 1) this.offset = 1;

			var stopColor = this.style('stop-color', true);
			if (stopColor.value === '') stopColor.value = '#000';
			if (this.style('stop-opacity').hasValue()) stopColor = stopColor.addOpacity(this.style('stop-opacity'));
			this.color = stopColor.value;
		}
		svg.Element.stop.prototype = new svg.Element.ElementBase;

		// animation base element
		svg.Element.AnimateBase = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			svg.Animations.push(this);

			this.duration = 0.0;
			this.begin = this.attribute('begin').toMilliseconds();
			this.maxDuration = this.begin + this.attribute('dur').toMilliseconds();

			this.getProperty = function() {
				var attributeType = this.attribute('attributeType').value;
				var attributeName = this.attribute('attributeName').value;

				if (attributeType == 'CSS') {
					return this.parent.style(attributeName, true);
				}
				return this.parent.attribute(attributeName, true);
			};

			this.initialValue = null;
			this.initialUnits = '';
			this.removed = false;

			this.calcValue = function() {
				// OVERRIDE ME!
				return '';
			}

			this.update = function(delta) {
				// set initial value
				if (this.initialValue == null) {
					this.initialValue = this.getProperty().value;
					this.initialUnits = this.getProperty().getUnits();
				}

				// if we're past the end time
				if (this.duration > this.maxDuration) {
					// loop for indefinitely repeating animations
					if (this.attribute('repeatCount').value == 'indefinite'
					 || this.attribute('repeatDur').value == 'indefinite') {
						this.duration = 0.0
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'freeze' && !this.frozen) {
						this.frozen = true;
						this.parent.animationFrozen = true;
						this.parent.animationFrozenValue = this.getProperty().value;
					}
					else if (this.attribute('fill').valueOrDefault('remove') == 'remove' && !this.removed) {
						this.removed = true;
						this.getProperty().value = this.parent.animationFrozen ? this.parent.animationFrozenValue : this.initialValue;
						return true;
					}
					return false;
				}
				this.duration = this.duration + delta;

				// if we're past the begin time
				var updated = false;
				if (this.begin < this.duration) {
					var newValue = this.calcValue(); // tween

					if (this.attribute('type').hasValue()) {
						// for transform, etc.
						var type = this.attribute('type').value;
						newValue = type + '(' + newValue + ')';
					}

					this.getProperty().value = newValue;
					updated = true;
				}

				return updated;
			}

			this.from = this.attribute('from');
			this.to = this.attribute('to');
			this.values = this.attribute('values');
			if (this.values.hasValue()) this.values.value = this.values.value.split(';');

			// fraction of duration we've covered
			this.progress = function() {
				var ret = { progress: (this.duration - this.begin) / (this.maxDuration - this.begin) };
				if (this.values.hasValue()) {
					var p = ret.progress * (this.values.value.length - 1);
					var lb = Math.floor(p), ub = Math.ceil(p);
					ret.from = new svg.Property('from', parseFloat(this.values.value[lb]));
					ret.to = new svg.Property('to', parseFloat(this.values.value[ub]));
					ret.progress = (p - lb) / (ub - lb);
				}
				else {
					ret.from = this.from;
					ret.to = this.to;
				}
				return ret;
			}
		}
		svg.Element.AnimateBase.prototype = new svg.Element.ElementBase;

		// animate element
		svg.Element.animate = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var p = this.progress();

				// tween value linearly
				var newValue = p.from.numValue() + (p.to.numValue() - p.from.numValue()) * p.progress;
				return newValue + this.initialUnits;
			};
		}
		svg.Element.animate.prototype = new svg.Element.AnimateBase;

		// animate color element
		svg.Element.animateColor = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var p = this.progress();
				var from = new RGBColor(p.from.value);
				var to = new RGBColor(p.to.value);

				if (from.ok && to.ok) {
					// tween color linearly
					var r = from.r + (to.r - from.r) * p.progress;
					var g = from.g + (to.g - from.g) * p.progress;
					var b = from.b + (to.b - from.b) * p.progress;
					return 'rgb('+parseInt(r,10)+','+parseInt(g,10)+','+parseInt(b,10)+')';
				}
				return this.attribute('from').value;
			};
		}
		svg.Element.animateColor.prototype = new svg.Element.AnimateBase;

		// animate transform element
		svg.Element.animateTransform = function(node) {
			this.base = svg.Element.AnimateBase;
			this.base(node);

			this.calcValue = function() {
				var p = this.progress();

				// tween value linearly
				var from = svg.ToNumberArray(p.from.value);
				var to = svg.ToNumberArray(p.to.value);
				var newValue = '';
				for (var i=0; i<from.length; i++) {
					newValue += from[i] + (to[i] - from[i]) * p.progress + ' ';
				}
				return newValue;
			};
		}
		svg.Element.animateTransform.prototype = new svg.Element.animate;

		// font element
		svg.Element.font = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();

			this.isRTL = false;
			this.isArabic = false;
			this.fontFace = null;
			this.missingGlyph = null;
			this.glyphs = [];
			for (var i=0; i<this.children.length; i++) {
				var child = this.children[i];
				if (child.type == 'font-face') {
					this.fontFace = child;
					if (child.style('font-family').hasValue()) {
						svg.Definitions[child.style('font-family').value] = this;
					}
				}
				else if (child.type == 'missing-glyph') this.missingGlyph = child;
				else if (child.type == 'glyph') {
					if (child.arabicForm != '') {
						this.isRTL = true;
						this.isArabic = true;
						if (typeof(this.glyphs[child.unicode]) == 'undefined') this.glyphs[child.unicode] = [];
						this.glyphs[child.unicode][child.arabicForm] = child;
					}
					else {
						this.glyphs[child.unicode] = child;
					}
				}
			}
		}
		svg.Element.font.prototype = new svg.Element.ElementBase;

		// font-face element
		svg.Element.fontface = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.ascent = this.attribute('ascent').value;
			this.descent = this.attribute('descent').value;
			this.unitsPerEm = this.attribute('units-per-em').numValue();
		}
		svg.Element.fontface.prototype = new svg.Element.ElementBase;

		// missing-glyph element
		svg.Element.missingglyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);

			this.horizAdvX = 0;
		}
		svg.Element.missingglyph.prototype = new svg.Element.path;

		// glyph element
		svg.Element.glyph = function(node) {
			this.base = svg.Element.path;
			this.base(node);

			this.horizAdvX = this.attribute('horiz-adv-x').numValue();
			this.unicode = this.attribute('unicode').value;
			this.arabicForm = this.attribute('arabic-form').value;
		}
		svg.Element.glyph.prototype = new svg.Element.path;

		// text element
		svg.Element.text = function(node) {
			this.captureTextNodes = true;
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);

				var textBaseline = this.style('dominant-baseline').toTextBaseline();
				if (textBaseline == null) textBaseline = this.style('alignment-baseline').toTextBaseline();
				if (textBaseline != null) ctx.textBaseline = textBaseline;
			}

			this.getBoundingBox = function () {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
				return new svg.BoundingBox(x, y - fontSize, x + Math.floor(fontSize * 2.0 / 3.0) * this.children[0].getText().length, y);
			}

			this.renderChildren = function(ctx) {
				this.x = this.attribute('x').toPixels('x');
				this.y = this.attribute('y').toPixels('y');
				if (this.attribute('dx').hasValue()) this.x += this.attribute('dx').toPixels('x');
				if (this.attribute('dy').hasValue()) this.y += this.attribute('dy').toPixels('y');
				this.x += this.getAnchorDelta(ctx, this, 0);
				for (var i=0; i<this.children.length; i++) {
					this.renderChild(ctx, this, i);
				}
			}

			this.getAnchorDelta = function (ctx, parent, startI) {
				var textAnchor = this.style('text-anchor').valueOrDefault('start');
				if (textAnchor != 'start') {
					var width = 0;
					for (var i=startI; i<parent.children.length; i++) {
						var child = parent.children[i];
						if (i > startI && child.attribute('x').hasValue()) break; // new group
						width += child.measureTextRecursive(ctx);
					}
					return -1 * (textAnchor == 'end' ? width : width / 2.0);
				}
				return 0;
			}

			this.renderChild = function(ctx, parent, i) {
				var child = parent.children[i];
				if (child.attribute('x').hasValue()) {
					child.x = child.attribute('x').toPixels('x') + parent.getAnchorDelta(ctx, parent, i);
					if (child.attribute('dx').hasValue()) child.x += child.attribute('dx').toPixels('x');
				}
				else {
					if (child.attribute('dx').hasValue()) parent.x += child.attribute('dx').toPixels('x');
					child.x = parent.x;
				}
				parent.x = child.x + child.measureText(ctx);

				if (child.attribute('y').hasValue()) {
					child.y = child.attribute('y').toPixels('y');
					if (child.attribute('dy').hasValue()) child.y += child.attribute('dy').toPixels('y');
				}
				else {
					if (child.attribute('dy').hasValue()) parent.y += child.attribute('dy').toPixels('y');
					child.y = parent.y;
				}
				parent.y = child.y;

				child.render(ctx);

				for (var i=0; i<child.children.length; i++) {
					parent.renderChild(ctx, child, i);
				}
			}
		}
		svg.Element.text.prototype = new svg.Element.RenderedElementBase;

		// text base
		svg.Element.TextElementBase = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.getGlyph = function(font, text, i) {
				var c = text[i];
				var glyph = null;
				if (font.isArabic) {
					var arabicForm = 'isolated';
					if ((i==0 || text[i-1]==' ') && i<text.length-2 && text[i+1]!=' ') arabicForm = 'terminal';
					if (i>0 && text[i-1]!=' ' && i<text.length-2 && text[i+1]!=' ') arabicForm = 'medial';
					if (i>0 && text[i-1]!=' ' && (i == text.length-1 || text[i+1]==' ')) arabicForm = 'initial';
					if (typeof(font.glyphs[c]) != 'undefined') {
						glyph = font.glyphs[c][arabicForm];
						if (glyph == null && font.glyphs[c].type == 'glyph') glyph = font.glyphs[c];
					}
				}
				else {
					glyph = font.glyphs[c];
				}
				if (glyph == null) glyph = font.missingGlyph;
				return glyph;
			}

			this.renderChildren = function(ctx) {
				var customFont = this.parent.style('font-family').getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var fontStyle = this.parent.style('font-style').valueOrDefault(svg.Font.Parse(svg.ctx.font).fontStyle);
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");

					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						var scale = fontSize / customFont.fontFace.unitsPerEm;
						ctx.translate(this.x, this.y);
						ctx.scale(scale, -scale);
						var lw = ctx.lineWidth;
						ctx.lineWidth = ctx.lineWidth * customFont.fontFace.unitsPerEm / fontSize;
						if (fontStyle == 'italic') ctx.transform(1, 0, .4, 1, 0, 0);
						glyph.render(ctx);
						if (fontStyle == 'italic') ctx.transform(1, 0, -.4, 1, 0, 0);
						ctx.lineWidth = lw;
						ctx.scale(1/scale, -1/scale);
						ctx.translate(-this.x, -this.y);

						this.x += fontSize * (glyph.horizAdvX || customFont.horizAdvX) / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							this.x += dx[i];
						}
					}
					return;
				}

				if (ctx.fillStyle != '') ctx.fillText(svg.compressSpaces(this.getText()), this.x, this.y);
				if (ctx.strokeStyle != '') ctx.strokeText(svg.compressSpaces(this.getText()), this.x, this.y);
			}

			this.getText = function() {
				// OVERRIDE ME
			}

			this.measureTextRecursive = function(ctx) {
				var width = this.measureText(ctx);
				for (var i=0; i<this.children.length; i++) {
					width += this.children[i].measureTextRecursive(ctx);
				}
				return width;
			}

			this.measureText = function(ctx) {
				var customFont = this.parent.style('font-family').getDefinition();
				if (customFont != null) {
					var fontSize = this.parent.style('font-size').numValueOrDefault(svg.Font.Parse(svg.ctx.font).fontSize);
					var measure = 0;
					var text = this.getText();
					if (customFont.isRTL) text = text.split("").reverse().join("");
					var dx = svg.ToNumberArray(this.parent.attribute('dx').value);
					for (var i=0; i<text.length; i++) {
						var glyph = this.getGlyph(customFont, text, i);
						measure += (glyph.horizAdvX || customFont.horizAdvX) * fontSize / customFont.fontFace.unitsPerEm;
						if (typeof(dx[i]) != 'undefined' && !isNaN(dx[i])) {
							measure += dx[i];
						}
					}
					return measure;
				}

				var textToMeasure = svg.compressSpaces(this.getText());
				if (!ctx.measureText) return textToMeasure.length * 10;

				ctx.save();
				this.setContext(ctx);
				var width = ctx.measureText(textToMeasure).width;
				ctx.restore();
				return width;
			}
		}
		svg.Element.TextElementBase.prototype = new svg.Element.RenderedElementBase;

		// tspan
		svg.Element.tspan = function(node) {
			this.captureTextNodes = true;
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.text = svg.compressSpaces(node.value || node.text || node.textContent || '');
			this.getText = function() {
				// if this node has children, then they own the text
				if (this.children.length > 0) { return ''; }
				return this.text;
			}
		}
		svg.Element.tspan.prototype = new svg.Element.TextElementBase;

		// tref
		svg.Element.tref = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.getText = function() {
				var element = this.getHrefAttribute().getDefinition();
				if (element != null) return element.children[0].getText();
			}
		}
		svg.Element.tref.prototype = new svg.Element.TextElementBase;

		// a element
		svg.Element.a = function(node) {
			this.base = svg.Element.TextElementBase;
			this.base(node);

			this.hasText = node.childNodes.length > 0;
			for (var i=0; i<node.childNodes.length; i++) {
				if (node.childNodes[i].nodeType != 3) this.hasText = false;
			}

			// this might contain text
			this.text = this.hasText ? node.childNodes[0].value : '';
			this.getText = function() {
				return this.text;
			}

			this.baseRenderChildren = this.renderChildren;
			this.renderChildren = function(ctx) {
				if (this.hasText) {
					// render as text element
					this.baseRenderChildren(ctx);
					var fontSize = new svg.Property('fontSize', svg.Font.Parse(svg.ctx.font).fontSize);
					svg.Mouse.checkBoundingBox(this, new svg.BoundingBox(this.x, this.y - fontSize.toPixels('y'), this.x + this.measureText(ctx), this.y));
				}
				else if (this.children.length > 0) {
					// render as temporary group
					var g = new svg.Element.g();
					g.children = this.children;
					g.parent = this;
					g.render(ctx);
				}
			}

			this.onclick = function() {
				window.open(this.getHrefAttribute().value);
			}

			this.onmousemove = function() {
				svg.ctx.canvas.style.cursor = 'pointer';
			}
		}
		svg.Element.a.prototype = new svg.Element.TextElementBase;

		// image element
		svg.Element.image = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			var href = this.getHrefAttribute().value;
			if (href == '') { return; }
			var isSvg = href.match(/\.svg$/)

			svg.Images.push(this);
			this.loaded = false;
			if (!isSvg) {
				this.img = document.createElement('img');
				if (svg.opts['useCORS'] == true) { this.img.crossOrigin = 'Anonymous'; }
				var self = this;
				this.img.onload = function() { self.loaded = true; }
				this.img.onerror = function() { svg.log('ERROR: image "' + href + '" not found'); self.loaded = true; }
				this.img.src = href;
			}
			else {
				this.img = svg.ajax(href);
				this.loaded = true;
			}

			this.renderChildren = function(ctx) {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');

				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				if (width == 0 || height == 0) return;

				ctx.save();
				if (isSvg) {
					ctx.drawSvg(this.img, x, y, width, height);
				}
				else {
					ctx.translate(x, y);
					svg.AspectRatio(ctx,
									this.attribute('preserveAspectRatio').value,
									width,
									this.img.width,
									height,
									this.img.height,
									0,
									0);
					ctx.drawImage(this.img, 0, 0);
				}
				ctx.restore();
			}

			this.getBoundingBox = function() {
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');
				return new svg.BoundingBox(x, y, x + width, y + height);
			}
		}
		svg.Element.image.prototype = new svg.Element.RenderedElementBase;

		// group element
		svg.Element.g = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.getBoundingBox = function() {
				var bb = new svg.BoundingBox();
				for (var i=0; i<this.children.length; i++) {
					bb.addBoundingBox(this.children[i].getBoundingBox());
				}
				return bb;
			};
		}
		svg.Element.g.prototype = new svg.Element.RenderedElementBase;

		// symbol element
		svg.Element.symbol = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.render = function(ctx) {
				// NO RENDER
			};
		}
		svg.Element.symbol.prototype = new svg.Element.RenderedElementBase;

		// style element
		svg.Element.style = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			// text, or spaces then CDATA
			var css = ''
			for (var i=0; i<node.childNodes.length; i++) {
			  css += node.childNodes[i].data;
			}
			css = css.replace(/(\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*+\/)|(^[\s]*\/\/.*)/gm, ''); // remove comments
			css = svg.compressSpaces(css); // replace whitespace
			var cssDefs = css.split('}');
			for (var i=0; i<cssDefs.length; i++) {
				if (svg.trim(cssDefs[i]) != '') {
					var cssDef = cssDefs[i].split('{');
					var cssClasses = cssDef[0].split(',');
					var cssProps = cssDef[1].split(';');
					for (var j=0; j<cssClasses.length; j++) {
						var cssClass = svg.trim(cssClasses[j]);
						if (cssClass != '') {
							var props = svg.Styles[cssClass] || {};
							for (var k=0; k<cssProps.length; k++) {
								var prop = cssProps[k].indexOf(':');
								var name = cssProps[k].substr(0, prop);
								var value = cssProps[k].substr(prop + 1, cssProps[k].length - prop);
								if (name != null && value != null) {
									props[svg.trim(name)] = new svg.Property(svg.trim(name), svg.trim(value));
								}
							}
							svg.Styles[cssClass] = props;
							svg.StylesSpecificity[cssClass] = getSelectorSpecificity(cssClass);
							if (cssClass == '@font-face') {
								var fontFamily = props['font-family'].value.replace(/"/g,'');
								var srcs = props['src'].value.split(',');
								for (var s=0; s<srcs.length; s++) {
									if (srcs[s].indexOf('format("svg")') > 0) {
										var urlStart = srcs[s].indexOf('url');
										var urlEnd = srcs[s].indexOf(')', urlStart);
										var url = srcs[s].substr(urlStart + 5, urlEnd - urlStart - 6);
										var doc = svg.parseXml(svg.ajax(url));
										var fonts = doc.getElementsByTagName('font');
										for (var f=0; f<fonts.length; f++) {
											var font = svg.CreateElement(fonts[f]);
											svg.Definitions[fontFamily] = font;
										}
									}
								}
							}
						}
					}
				}
			}
		}
		svg.Element.style.prototype = new svg.Element.ElementBase;

		// use element
		svg.Element.use = function(node) {
			this.base = svg.Element.RenderedElementBase;
			this.base(node);

			this.baseSetContext = this.setContext;
			this.setContext = function(ctx) {
				this.baseSetContext(ctx);
				if (this.attribute('x').hasValue()) ctx.translate(this.attribute('x').toPixels('x'), 0);
				if (this.attribute('y').hasValue()) ctx.translate(0, this.attribute('y').toPixels('y'));
			}

			var element = this.getHrefAttribute().getDefinition();

			this.path = function(ctx) {
				if (element != null) element.path(ctx);
			}

			this.getBoundingBox = function() {
				if (element != null) return element.getBoundingBox();
			}

			this.renderChildren = function(ctx) {
				if (element != null) {
					var tempSvg = element;
					if (element.type == 'symbol') {
						// render me using a temporary svg element in symbol cases (http://www.w3.org/TR/SVG/struct.html#UseElement)
						tempSvg = new svg.Element.svg();
						tempSvg.type = 'svg';
						tempSvg.attributes['viewBox'] = new svg.Property('viewBox', element.attribute('viewBox').value);
						tempSvg.attributes['preserveAspectRatio'] = new svg.Property('preserveAspectRatio', element.attribute('preserveAspectRatio').value);
						tempSvg.attributes['overflow'] = new svg.Property('overflow', element.attribute('overflow').value);
						tempSvg.children = element.children;
					}
					if (tempSvg.type == 'svg') {
						// if symbol or svg, inherit width/height from me
						if (this.attribute('width').hasValue()) tempSvg.attributes['width'] = new svg.Property('width', this.attribute('width').value);
						if (this.attribute('height').hasValue()) tempSvg.attributes['height'] = new svg.Property('height', this.attribute('height').value);
					}
					var oldParent = tempSvg.parent;
					tempSvg.parent = null;
					tempSvg.render(ctx);
					tempSvg.parent = oldParent;
				}
			}
		}
		svg.Element.use.prototype = new svg.Element.RenderedElementBase;

		// mask element
		svg.Element.mask = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, element) {
				// render as temp svg
				var x = this.attribute('x').toPixels('x');
				var y = this.attribute('y').toPixels('y');
				var width = this.attribute('width').toPixels('x');
				var height = this.attribute('height').toPixels('y');

				if (width == 0 && height == 0) {
					var bb = new svg.BoundingBox();
					for (var i=0; i<this.children.length; i++) {
						bb.addBoundingBox(this.children[i].getBoundingBox());
					}
					var x = Math.floor(bb.x1);
					var y = Math.floor(bb.y1);
					var width = Math.floor(bb.width());
					var	height = Math.floor(bb.height());
				}

				// temporarily remove mask to avoid recursion
				var mask = element.attribute('mask').value;
				element.attribute('mask').value = '';

					var cMask = document.createElement('canvas');
					cMask.width = x + width;
					cMask.height = y + height;
					var maskCtx = cMask.getContext('2d');
					this.renderChildren(maskCtx);

					var c = document.createElement('canvas');
					c.width = x + width;
					c.height = y + height;
					var tempCtx = c.getContext('2d');
					element.render(tempCtx);
					tempCtx.globalCompositeOperation = 'destination-in';
					tempCtx.fillStyle = maskCtx.createPattern(cMask, 'no-repeat');
					tempCtx.fillRect(0, 0, x + width, y + height);

					ctx.fillStyle = tempCtx.createPattern(c, 'no-repeat');
					ctx.fillRect(0, 0, x + width, y + height);

				// reassign mask
				element.attribute('mask').value = mask;
			}

			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.mask.prototype = new svg.Element.ElementBase;

		// clip element
		svg.Element.clipPath = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx) {
				var oldBeginPath = CanvasRenderingContext2D.prototype.beginPath;
				CanvasRenderingContext2D.prototype.beginPath = function () { };

				var oldClosePath = CanvasRenderingContext2D.prototype.closePath;
				CanvasRenderingContext2D.prototype.closePath = function () { };

				oldBeginPath.call(ctx);
				for (var i=0; i<this.children.length; i++) {
					var child = this.children[i];
					if (typeof(child.path) != 'undefined') {
						var transform = null;
						if (child.style('transform', false, true).hasValue()) {
							transform = new svg.Transform(child.style('transform', false, true).value);
							transform.apply(ctx);
						}
						child.path(ctx);
						CanvasRenderingContext2D.prototype.closePath = oldClosePath;
						if (transform) { transform.unapply(ctx); }
					}
				}
				oldClosePath.call(ctx);
				ctx.clip();

				CanvasRenderingContext2D.prototype.beginPath = oldBeginPath;
				CanvasRenderingContext2D.prototype.closePath = oldClosePath;
			}

			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.clipPath.prototype = new svg.Element.ElementBase;

		// filters
		svg.Element.filter = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, element) {
				// render as temp svg
				var bb = element.getBoundingBox();
				var x = Math.floor(bb.x1);
				var y = Math.floor(bb.y1);
				var width = Math.floor(bb.width());
				var	height = Math.floor(bb.height());

				// temporarily remove filter to avoid recursion
				var filter = element.style('filter').value;
				element.style('filter').value = '';

				var px = 0, py = 0;
				for (var i=0; i<this.children.length; i++) {
					var efd = this.children[i].extraFilterDistance || 0;
					px = Math.max(px, efd);
					py = Math.max(py, efd);
				}

				var c = document.createElement('canvas');
				c.width = width + 2*px;
				c.height = height + 2*py;
				var tempCtx = c.getContext('2d');
				tempCtx.translate(-x + px, -y + py);
				element.render(tempCtx);

				// apply filters
				for (var i=0; i<this.children.length; i++) {
					if (typeof(this.children[i].apply) === 'function') {
						this.children[i].apply(tempCtx, 0, 0, width + 2*px, height + 2*py);
					}
				}

				// render on me
				ctx.drawImage(c, 0, 0, width + 2*px, height + 2*py, x - px, y - py, width + 2*px, height + 2*py);

				// reassign filter
				element.style('filter', true).value = filter;
			}

			this.render = function(ctx) {
				// NO RENDER
			}
		}
		svg.Element.filter.prototype = new svg.Element.ElementBase;

		svg.Element.feMorphology = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, x, y, width, height) {
				// TODO: implement
			}
		}
		svg.Element.feMorphology.prototype = new svg.Element.ElementBase;

		svg.Element.feComposite = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.apply = function(ctx, x, y, width, height) {
				// TODO: implement
			}
		}
		svg.Element.feComposite.prototype = new svg.Element.ElementBase;

		svg.Element.feColorMatrix = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			var matrix = svg.ToNumberArray(this.attribute('values').value);
			switch (this.attribute('type').valueOrDefault('matrix')) { // http://www.w3.org/TR/SVG/filters.html#feColorMatrixElement
				case 'saturate':
					var s = matrix[0];
					matrix = [0.213+0.787*s,0.715-0.715*s,0.072-0.072*s,0,0,
							  0.213-0.213*s,0.715+0.285*s,0.072-0.072*s,0,0,
							  0.213-0.213*s,0.715-0.715*s,0.072+0.928*s,0,0,
							  0,0,0,1,0,
							  0,0,0,0,1];
					break;
				case 'hueRotate':
					var a = matrix[0] * Math.PI / 180.0;
					var c = function (m1,m2,m3) { return m1 + Math.cos(a)*m2 + Math.sin(a)*m3; };
					matrix = [c(0.213,0.787,-0.213),c(0.715,-0.715,-0.715),c(0.072,-0.072,0.928),0,0,
							  c(0.213,-0.213,0.143),c(0.715,0.285,0.140),c(0.072,-0.072,-0.283),0,0,
							  c(0.213,-0.213,-0.787),c(0.715,-0.715,0.715),c(0.072,0.928,0.072),0,0,
							  0,0,0,1,0,
							  0,0,0,0,1];
					break;
				case 'luminanceToAlpha':
					matrix = [0,0,0,0,0,
							  0,0,0,0,0,
							  0,0,0,0,0,
							  0.2125,0.7154,0.0721,0,0,
							  0,0,0,0,1];
					break;
			}

			function imGet(img, x, y, width, height, rgba) {
				return img[y*width*4 + x*4 + rgba];
			}

			function imSet(img, x, y, width, height, rgba, val) {
				img[y*width*4 + x*4 + rgba] = val;
			}

			function m(i, v) {
				var mi = matrix[i];
				return mi * (mi < 0 ? v - 255 : v);
			}

			this.apply = function(ctx, x, y, width, height) {
				// assuming x==0 && y==0 for now
				var srcData = ctx.getImageData(0, 0, width, height);
				for (var y = 0; y < height; y++) {
					for (var x = 0; x < width; x++) {
						var r = imGet(srcData.data, x, y, width, height, 0);
						var g = imGet(srcData.data, x, y, width, height, 1);
						var b = imGet(srcData.data, x, y, width, height, 2);
						var a = imGet(srcData.data, x, y, width, height, 3);
						imSet(srcData.data, x, y, width, height, 0, m(0,r)+m(1,g)+m(2,b)+m(3,a)+m(4,1));
						imSet(srcData.data, x, y, width, height, 1, m(5,r)+m(6,g)+m(7,b)+m(8,a)+m(9,1));
						imSet(srcData.data, x, y, width, height, 2, m(10,r)+m(11,g)+m(12,b)+m(13,a)+m(14,1));
						imSet(srcData.data, x, y, width, height, 3, m(15,r)+m(16,g)+m(17,b)+m(18,a)+m(19,1));
					}
				}
				ctx.clearRect(0, 0, width, height);
				ctx.putImageData(srcData, 0, 0);
			}
		}
		svg.Element.feColorMatrix.prototype = new svg.Element.ElementBase;

		svg.Element.feGaussianBlur = function(node) {
			this.base = svg.Element.ElementBase;
			this.base(node);

			this.blurRadius = Math.floor(this.attribute('stdDeviation').numValue());
			this.extraFilterDistance = this.blurRadius;

			this.apply = function(ctx, x, y, width, height) {
				if (typeof(stackBlur.canvasRGBA) == 'undefined') {
					svg.log('ERROR: StackBlur.js must be included for blur to work');
					return;
				}

				// StackBlur requires canvas be on document
				ctx.canvas.id = svg.UniqueId();
				ctx.canvas.style.display = 'none';
				document.body.appendChild(ctx.canvas);
				stackBlur.canvasRGBA(ctx.canvas.id, x, y, width, height, this.blurRadius);
				document.body.removeChild(ctx.canvas);
			}
		}
		svg.Element.feGaussianBlur.prototype = new svg.Element.ElementBase;

		// title element, do nothing
		svg.Element.title = function(node) {
		}
		svg.Element.title.prototype = new svg.Element.ElementBase;

		// desc element, do nothing
		svg.Element.desc = function(node) {
		}
		svg.Element.desc.prototype = new svg.Element.ElementBase;

		svg.Element.MISSING = function(node) {
			svg.log('ERROR: Element \'' + node.nodeName + '\' not yet implemented.');
		}
		svg.Element.MISSING.prototype = new svg.Element.ElementBase;

		// element factory
		svg.CreateElement = function(node) {
			var className = node.nodeName.replace(/^[^:]+:/,''); // remove namespace
			className = className.replace(/\-/g,''); // remove dashes
			var e = null;
			if (typeof(svg.Element[className]) != 'undefined') {
				e = new svg.Element[className](node);
			}
			else {
				e = new svg.Element.MISSING(node);
			}

			e.type = node.nodeName;
			return e;
		}

		// load from url
		svg.load = function(ctx, url) {
			svg.loadXml(ctx, svg.ajax(url));
		}

		// load from xml
		svg.loadXml = function(ctx, xml) {
			svg.loadXmlDoc(ctx, svg.parseXml(xml));
		}

		svg.loadXmlDoc = function(ctx, dom) {
			svg.init(ctx);

			var mapXY = function(p) {
				var e = ctx.canvas;
				while (e) {
					p.x -= e.offsetLeft;
					p.y -= e.offsetTop;
					e = e.offsetParent;
				}
				if (window.scrollX) p.x += window.scrollX;
				if (window.scrollY) p.y += window.scrollY;
				return p;
			}

			// bind mouse
			if (svg.opts['ignoreMouse'] != true) {
				ctx.canvas.onclick = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onclick(p.x, p.y);
				};
				ctx.canvas.onmousemove = function(e) {
					var p = mapXY(new svg.Point(e != null ? e.clientX : event.clientX, e != null ? e.clientY : event.clientY));
					svg.Mouse.onmousemove(p.x, p.y);
				};
			}

			var e = svg.CreateElement(dom.documentElement);
			e.root = true;
			e.addStylesFromStyleDefinition();

			// render loop
			var isFirstRender = true;
			var draw = function() {
				svg.ViewPort.Clear();
				if (ctx.canvas.parentNode) svg.ViewPort.SetCurrent(ctx.canvas.parentNode.clientWidth, ctx.canvas.parentNode.clientHeight);

				if (svg.opts['ignoreDimensions'] != true) {
					// set canvas size
					if (e.style('width').hasValue()) {
						ctx.canvas.width = e.style('width').toPixels('x');
						ctx.canvas.style.width = ctx.canvas.width + 'px';
					}
					if (e.style('height').hasValue()) {
						ctx.canvas.height = e.style('height').toPixels('y');
						ctx.canvas.style.height = ctx.canvas.height + 'px';
					}
				}
				var cWidth = ctx.canvas.clientWidth || ctx.canvas.width;
				var cHeight = ctx.canvas.clientHeight || ctx.canvas.height;
				if (svg.opts['ignoreDimensions'] == true && e.style('width').hasValue() && e.style('height').hasValue()) {
					cWidth = e.style('width').toPixels('x');
					cHeight = e.style('height').toPixels('y');
				}
				svg.ViewPort.SetCurrent(cWidth, cHeight);

				if (svg.opts['offsetX'] != null) e.attribute('x', true).value = svg.opts['offsetX'];
				if (svg.opts['offsetY'] != null) e.attribute('y', true).value = svg.opts['offsetY'];
				if (svg.opts['scaleWidth'] != null || svg.opts['scaleHeight'] != null) {
					var xRatio = null, yRatio = null, viewBox = svg.ToNumberArray(e.attribute('viewBox').value);

					if (svg.opts['scaleWidth'] != null) {
						if (e.attribute('width').hasValue()) xRatio = e.attribute('width').toPixels('x') / svg.opts['scaleWidth'];
						else if (!isNaN(viewBox[2])) xRatio = viewBox[2] / svg.opts['scaleWidth'];
					}

					if (svg.opts['scaleHeight'] != null) {
						if (e.attribute('height').hasValue()) yRatio = e.attribute('height').toPixels('y') / svg.opts['scaleHeight'];
						else if (!isNaN(viewBox[3])) yRatio = viewBox[3] / svg.opts['scaleHeight'];
					}

					if (xRatio == null) { xRatio = yRatio; }
					if (yRatio == null) { yRatio = xRatio; }

					e.attribute('width', true).value = svg.opts['scaleWidth'];
					e.attribute('height', true).value = svg.opts['scaleHeight'];
					e.style('transform', true, true).value += ' scale('+(1.0/xRatio)+','+(1.0/yRatio)+')';
				}

				// clear and render
				if (svg.opts['ignoreClear'] != true) {
					ctx.clearRect(0, 0, cWidth, cHeight);
				}
				e.render(ctx);
				if (isFirstRender) {
					isFirstRender = false;
					if (typeof(svg.opts['renderCallback']) == 'function') svg.opts['renderCallback'](dom);
				}
			}

			var waitingForImages = true;
			if (svg.ImagesLoaded()) {
				waitingForImages = false;
				draw();
			}
			svg.intervalID = setInterval(function() {
				var needUpdate = false;

				if (waitingForImages && svg.ImagesLoaded()) {
					waitingForImages = false;
					needUpdate = true;
				}

				// need update from mouse events?
				if (svg.opts['ignoreMouse'] != true) {
					needUpdate = needUpdate | svg.Mouse.hasEvents();
				}

				// need update from animations?
				if (svg.opts['ignoreAnimation'] != true) {
					for (var i=0; i<svg.Animations.length; i++) {
						needUpdate = needUpdate | svg.Animations[i].update(1000 / svg.FRAMERATE);
					}
				}

				// need update from redraw?
				if (typeof(svg.opts['forceRedraw']) == 'function') {
					if (svg.opts['forceRedraw']() == true) needUpdate = true;
				}

				// render if needed
				if (needUpdate) {
					draw();
					svg.Mouse.runEvents(); // run and clear our events
				}
			}, 1000 / svg.FRAMERATE);
		}

		svg.stop = function() {
			if (svg.intervalID) {
				clearInterval(svg.intervalID);
			}
		}

		svg.Mouse = new (function() {
			this.events = [];
			this.hasEvents = function() { return this.events.length != 0; }

			this.onclick = function(x, y) {
				this.events.push({ type: 'onclick', x: x, y: y,
					run: function(e) { if (e.onclick) e.onclick(); }
				});
			}

			this.onmousemove = function(x, y) {
				this.events.push({ type: 'onmousemove', x: x, y: y,
					run: function(e) { if (e.onmousemove) e.onmousemove(); }
				});
			}

			this.eventElements = [];

			this.checkPath = function(element, ctx) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (ctx.isPointInPath && ctx.isPointInPath(e.x, e.y)) this.eventElements[i] = element;
				}
			}

			this.checkBoundingBox = function(element, bb) {
				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					if (bb.isPointInBox(e.x, e.y)) this.eventElements[i] = element;
				}
			}

			this.runEvents = function() {
				svg.ctx.canvas.style.cursor = '';

				for (var i=0; i<this.events.length; i++) {
					var e = this.events[i];
					var element = this.eventElements[i];
					while (element) {
						e.run(element);
						element = element.parent;
					}
				}

				// done running, clear
				this.events = [];
				this.eventElements = [];
			}
		});

		return svg;
	};

	if (typeof(CanvasRenderingContext2D) != 'undefined') {
		CanvasRenderingContext2D.prototype.drawSvg = function(s, dx, dy, dw, dh) {
			canvg(this.canvas, s, {
				ignoreMouse: true,
				ignoreAnimation: true,
				ignoreDimensions: true,
				ignoreClear: true,
				offsetX: dx,
				offsetY: dy,
				scaleWidth: dw,
				scaleHeight: dh
			});
		}
	}

	return canvg;

}));

//----------------------------------------- MathUtil -----------------------------------------

MathUtil={}

MathUtil.int=function(number)
{
	if(typeof(number)=="string"){
		number=StringUtil.trim(StringUtil.remove(number,"px"));
	}
	
	number=Number(number);
	return Math.floor(number);
}

MathUtil.format=function(number,digit)
{
	digit=digit|| 2;
	return Number(Number(number).toFixed(digit));
}

MathUtil.randomInt=function(max)
{
	max=max || 100;
	return MathUtil.int(max*Math.random());
}

MathUtil.clamp=function(number,min,max)
{
	if (number < min)
		return min;
	if (number > max)
		return max;
	return number;
}

/**
 * 弧度转角度
 * @param {Number} radians
 */
MathUtil.getDegreesFromRadians=function(radians)
{
	return radians * 180 / Math.PI;
}

/**
 * 获取树形数据数组的最大分支数
 * @param {Array} array  树形数据数组
 * @param {String} attribute 子节点数据对象属性 为null表示整个都是子节点数据
 */
MathUtil.countTreeMax=function(array,attribute,num)
{
	var i,c,l=array.length;
	var length=(l>0) ? 1 : 0;
	var num=(num==null) ? length : num;
	
	for (i = 0;i<l;i++) {
		c=(attribute==null) ? array[i] : array[i][attribute];
		
		if(c && (c instanceof Array) && c.length>0){
			length=Math.max(length,num+MathUtil.countTreeMax(c,attribute,num));
		}
	}
	
	return length;
}

/**
 * 角度转弧度
 * @param {Number} degrees
 */
MathUtil.getRadiansFromDegrees=function(degrees)
{
	return degrees % 360 / 180 * Math.PI ;
}

MathUtil.getAngle=function(x1,y1,x2,y2)
{
	var radians=Math.atan2((y2 - y1), (x2 - x1));
	return radians<0 ? (radians+2*Math.PI) : radians;
}

MathUtil.isEquivalent=function(a,b)
{
	var epsilon=0.0001;
	return (a - epsilon < b) && (a + epsilon > b);
}

/**
 * 根据框架尺寸获得缩放比例
 * @param {Number} img_width
 * @param {Number} img_height
 * @param {Number} frame_width
 * @param {Number} frame_height
 * @param {Boolean} fit
 */
MathUtil.getSizeScale=function(img_width,img_height,frame_width,frame_height,fit)
{
	fit=(fit==undefined) ? true : fit;
	var scale1=img_width/img_height;
	var scale2=frame_width/frame_height;
	
	if(fit ? scale1>scale2 : scale1<scale2) return MathUtil.format(frame_width/img_width);
	return MathUtil.format(frame_height/img_height);
}

MathUtil.isNumber = function (value) {
    return typeof (value) === "number" && !isNaN(value);
};

/**
 * 得到对应角度值的sin近似值
 * @param value {number} 角度值
 * @returns {number} sin值
 */
MathUtil.sin = function (value) {
    var valueFloor = Math.floor(value);
    var valueCeil = valueFloor + 1;
    var resultFloor = MathUtil.sinInt(valueFloor);
    var resultCeil = MathUtil.sinInt(valueCeil);
    return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
};

MathUtil.sinInt = function (value) {
    value = value % 360;
    if (value < 0) {
        value += 360;
    }
    if (value < 90) {
        return MathUtil._sin_map[value];
    }
    if (value < 180) {
        return MathUtil._cos_map[value - 90];
    }
    if (value < 270) {
        return -MathUtil._sin_map[value - 180];
    }
    return -MathUtil._cos_map[value - 270];
};
/**
 * 得到对应角度值的cos近似值
 * @param value {number} 角度值
 * @returns {number} cos值
 */
MathUtil.cos = function (value) {
    var valueFloor = Math.floor(value);
    var valueCeil = valueFloor + 1;
    var resultFloor = MathUtil.cosInt(valueFloor);
    var resultCeil = MathUtil.cosInt(valueCeil);
    return (value - valueFloor) * resultCeil + (valueCeil - value) * resultFloor;
};

MathUtil.cosInt = function (value) {
    value = value % 360;
    if (value < 0) {
        value += 360;
    }
    if (value < 90) {
        return MathUtil._cos_map[value];
    }
    if (value < 180) {
        return -MathUtil._sin_map[value - 90];
    }
    if (value < 270) {
        return -MathUtil._cos_map[value - 180];
    }
    return MathUtil._sin_map[value - 270];
};

MathUtil._sin_map={};
MathUtil._cos_map={};

for (var NumberUtils_i = 0; NumberUtils_i <= 90; NumberUtils_i++) {
    MathUtil._sin_map[NumberUtils_i] = Math.sin(MathUtil.getRadiansFromDegrees(NumberUtils_i));
    MathUtil._cos_map[NumberUtils_i] = Math.cos(MathUtil.getRadiansFromDegrees(NumberUtils_i));
}

//----------------------------------------- DoubleClick -----------------------------------------


DoubleClick={};
DoubleClick._time=0;
DoubleClick._interval=300;

DoubleClick.check=function()
{
	var now=(new Date()).getTime();
	var delay=now-DoubleClick._time;
	DoubleClick._time=now;
	
	if(delay<DoubleClick._interval){
		DoubleClick._time=0;
		return true;
	}
	
	return false;
}

//----------------------------------------- ClassUtil -----------------------------------------

ClassUtil={};
ClassUtil.__getDefinitionByName__cache={};

var __global = __global || this;

ClassUtil.getQualifiedClassName=function (value) 
{
	var prototype;
	
	try{
		prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
	}
    catch(e){
    	trace("[ERROR] ClassUtil.getQualifiedClassName",e);
    	return;
    }
    
    if (prototype.hasOwnProperty("__class__")) {
        return prototype["__class__"];
    }
    var constructorString = prototype.constructor.toString();
    var index = constructorString.indexOf("(");
    var className = constructorString.substring(9, index);
    Object.defineProperty(prototype, "__class__", {
        value: className,
        enumerable: false,
        writable: true
    });
    return className;
}

ClassUtil.getQualifiedSuperclassName=function (value) 
{
    var prototype = value.prototype ? value.prototype : Object.getPrototypeOf(value);
    if (prototype.hasOwnProperty("__superclass__")) {
        return prototype["__superclass__"];
    }
    var superProto = Object.getPrototypeOf(prototype);
    if (superProto == null)
        return null;
    var superClass = ClassUtil.getQualifiedClassName(superProto.constructor);
    if (!superClass)
        return null;
    Object.defineProperty(prototype, "__superclass__", {
        value: superClass,
        enumerable: false,
        writable: true
    });
    return superClass;
}

ClassUtil.getDefinitionByName=function (name) 
{
    if (StringUtil.isEmpty(name)) return null;
    var definition = ClassUtil.__getDefinitionByName__cache[name];
    
    if (definition) {
        return definition;
    }
    
    var paths = name.split(".");
    var length = paths.length;
    definition = __global;
    
    for (var i = 0; i < length; i++) {
        var path = paths[i];
        definition = definition[path];
        if (!definition) {
            return null;
        }
    }
    
    ClassUtil.__getDefinitionByName__cache[name] = definition;
    return definition;
}

//----------------------------------------- ObjectUtil -----------------------------------------

ObjectUtil={};

ObjectUtil.getType=function(o) 
{
	if(o==null || o==undefined) return "null";
	var _t;
	return ((_t = typeof(o)) == "object" ? o == null && "null" || Object.prototype.toString.call(o).slice(8, -1) : _t).toLowerCase();
}

ObjectUtil.toString=function(obj)
{
	return obj ? JSON.stringify(obj) : (ObjectUtil.getType(obj)=="boolean" ? "false" : "null");
}

ObjectUtil.getLabels=function(obj)
{
	if(obj==null) return null;
	var i,labels=[];
	
	for(i in obj) labels.push(i);
	return labels;
}

/**
 * 清除其它属性
 * @param {Object} target
 * @param {array} attributes
 * @param {array} functions
 */
ObjectUtil.clearAttribute=function(target,attributes,functions)
{
	if(target==null || attributes==null || attributes.length<1) return;
	var i,b;
	
	for(i in target){
		b=(typeof(target[i])=="function");
		if((b && (functions==null || functions.indexOf(i)>=0)) || (!b && (attributes==null || attributes.indexOf(i)>=0))) continue;
		delete target[i];
	}
}

/**
 * @param {Object} target
 * @param {Object} data
 * @param {Boolean} must
 * @param {array} miss
 * @param {Boolean} clone
 */
ObjectUtil.copyAttribute=function(target,data,must,miss,clone)
{
	if(target==null || data==null) return;
	
	var i;
	var item;
	var type;
	var bool;
	
	for(i in data){
		item=data[i];
		if((must && !target.hasOwnProperty(i)) || (miss && miss.indexOf(i)>=0)) continue;
		
		try{
			type=typeof(target[i]);
		}
		catch(err){continue};
		
		type=(type=="null" || type=="undefined") ? typeof(item) : type;
		
		switch(type){
			case "number":
			    target[i]=isNaN(item) ? item : Number(item);
			    break;
			    
			case "boolean":
			    target[i]=(item!=undefined && (typeof(item)=="string" ? (item=="true") : item));
			    break;
 
			case "string":
			    target[i]=item;
			    break;
			    
			default:
			   target[i]=(item==null || typeof(item)=="string" || !clone) ? item : ObjectUtil.cloneObj(item);
			   break;
		}
	}
	
	return target;
}

ObjectUtil.cloneObj=function(obj)
{
	if(obj==null || obj==null) return;
	var type=ClassUtil.getQualifiedClassName(obj);
	var result=(type=="Object") ? {} : (type=="Array") ? [] : ClassUtil.getDefinitionByName(type);
	return ObjectUtil.copyAttribute(result,obj,false);
}

//----------------------------------------- StringUtil -----------------------------------------

StringUtil={}

StringUtil.ltrim=function(string)
{
	for(var i = 0; i < string.length; i++)
	{
		if(string.charCodeAt(i) > 32)
		{
			return string.substring(i);
		}
	}
	return "";
}

StringUtil.rtrim=function(string)
{
	for(var i = string.length; i >0; i--)
	{
		if(string.charCodeAt(i - 1) > 32)
		{
			return string.substring(0, i);
		}
	}
	return "";
}

StringUtil.trim=function(string)
{
	return StringUtil.ltrim(StringUtil.rtrim(string))
}

StringUtil.isEmpty=function(string)
{
	if(string==undefined) return true;
	string=StringUtil.trim(string);
	return (string.length==0 || string=="null");
}

StringUtil.substitute=function(string,array)
{
	if(StringUtil.isEmpty(string) || array==undefined || ObjectUtil.getType(array)!="array" ||array.length==0) return string;
	for(var i = 0; i < array.length; i++)
	{
		string=string.replace(new RegExp("\\{"+i+"\\}", "g"),array[i]);
	}
	return string;
}

StringUtil.countToString=function(total,count)
{
	var num=String(total).length-String(count).length;
	var str="";
			
	while(num>0) {
		str+="0";
		num--;
	}
			
	return (str+count);
}

StringUtil.validateEmail=function(Email)
{
	var reg = /^([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+@([a-zA-Z0-9]+[_|\_|\.]?)*[a-zA-Z0-9]+\.[a-zA-Z]{2,3}$/;
	return reg.test(Email);
}

StringUtil.replace=function(targetString,oldString,newString)
{
	if(targetString!=undefined && targetString!=null && targetString!="")
		return targetString.split(oldString).join(newString);
}

StringUtil.remove=function(targetString,removeString)
{
	return StringUtil.replace(targetString, removeString, "");
}

StringUtil.replaceAll=function(targetString,oldArray,newArray)
{
	if(oldArray==null || newArray==null) return targetString;
	
	var i;
	var len=Math.min(oldArray.length,newArray.length);
	
	for(i=0;i<len;i++)  targetString=StringUtil.replace(targetString,oldArray[i],newArray[i]);
	return targetString;
}

StringUtil.exist=function(string)
{
	if(arguments.length<=1 || StringUtil.isEmpty(string)) return false;
	
	var i;
	var sub;
	var len=arguments.length;
	
	for(i=1;i<len;i++){
		sub=arguments[i];
		if(!StringUtil.isEmpty(sub) && string.indexOf(sub)!=-1) return true;
	}
	
	return false;
}

StringUtil.getNumber=function(string)
{
	if(StringUtil.isEmpty(string)) return [""];
	
	var total="",len=string.length;
	var num=string.substr(--len,1);
	
	while(!isNaN(num) && len>1){
		total=num+total;
		num=string.substr(--len,1);
	}
	
	return StringUtil.isEmpty(total) ? [string] : [StringUtil.rtrim(string.slice(0,++len)),Number(total)];
}

StringUtil.getPathExt=function(path)
{
	var tempArr = path.split(".");
	var tempStr = tempArr[tempArr.length-1];
	tempStr=tempStr.split("?")[0];
	return tempStr.toLowerCase();
}

StringUtil.getBase64Type=function(data)
{
	if(StringUtil.isEmpty(data)) return ;
	var list=data.split(";");
	return (list[0]).split("/")[1];
}

StringUtil.getFileName=function(path,index)
{
	index=index || 2;
	var name = path.replace(/%20/g, " "); 
	name = name.split("?")[0]; 
	var matches = /(.*[\\\/])?(.+)(\.[\w]{1,4})/.exec(name);
	if (matches && matches.length == 4) return matches[index];
	return "";
}

StringUtil.escapeXML=function(input)
{
	var str=input;
	str= str.replace(/&/ig, "&amp;");
	
	while (str.indexOf("<") != -1) {
		str = str.replace("<", "&lt;");
	};
	
	while (str.indexOf(">") != -1) {
		str = str.replace(">", "&gt;");
	};
	
	return str;
}

StringUtil.htmlEncode=function(input)
{
	input = StringUtil.replace(input,"&","&amp;");
	input = StringUtil.replace(input,"\"","&quot;");
	input = StringUtil.replace(input,"'","&apos;");
	input = StringUtil.replace(input,"<","&lt;");
	input = StringUtil.replace(input,">","&gt;");
	return input;
}

StringUtil.htmlDecode=function(input)
{
	input = StringUtil.replace(input,"&amp;","&");
	input = StringUtil.replace(input,"&quot;","\"");
	input = StringUtil.replace(input,"&apos;","'");
	input = StringUtil.replace(input,"&lt;","<");
	input = StringUtil.replace(input,"&gt;",">");
	return input;
}

StringUtil.formatTime=function(time,style)
{
	style=style || 0;
	
	var second=String(time%60);
	var minute=String(MathUtil.int(time/60)%60);
	var hour=String(MathUtil.int(time/(60*60))%60);
	
	if(second.length<2) second="0"+second;
	if(minute.length<2) minute="0"+minute;
	if(hour.length<2)   hour="0"+hour;
	
	if(style==3)      return (second);
	else if(style==2) return (minute+":"+second);
	else if(style==1) return (hour+":"+minute);
	else              return (hour+":"+minute+":"+second);
	
	return "";
}

StringUtil.parseParams=function(str)
{
	if(StringUtil.isEmpty(str)) return {};
	var i,l,datas,params=str.split("&"),data={};
	
	for(i=0,l=params.length;i<l;i++)
	{
		datas=params[i];
		if(StringUtil.isEmpty(datas) || datas.indexOf("=")<0) continue;
		datas=datas.split("=");
		data[StringUtil.trim(datas[0])]=(datas.length<2 || StringUtil.isEmpty(datas[1])) ? null : StringUtil.trim(datas[1]);
	}
	
	return data;
}

StringUtil.buildParams=function(obj)
{
	if(obj==null) return "";
	
	var i,b=false,str="";
	for (i in obj){
		if(b) str+="&";
		str+=i+"="+obj[i];
		b=true;
	}
	
	return str;
}

//----------------------------------------- ColorUtil -----------------------------------------

ColorUtil={}

ColorUtil.getRed=function(color)
{
	return (color >> 16) & 0xFF;
}

ColorUtil.getGreen=function(color)
{
	return (color >> 8) & 0xFF;
}

ColorUtil.getBlue=function(color)
{
	return color & 0xFF;
}

ColorUtil.getAlpha=function(color)
{
	return (color >> 24) & 0xFF;
}

ColorUtil.darkenColor=function (color, factor)
{
	var red   = Math.min(255, ColorUtil.getRed(color)*factor);
	var green = Math.min(255, ColorUtil.getGreen(color)*factor);
	var blue  = Math.min(255, ColorUtil.getBlue(color)*factor);

	return ColorUtil.toInt(red,green,blue);
}

ColorUtil.colorToRGBA=function (color, alpha)
{
	var c=ColorUtil.toColor(color);
	var g=ColorUtil.getGreen(c);
	var b=ColorUtil.getBlue(c);
	var r=ColorUtil.getRed(c);
	return alpha==undefined ? "rgb("+r+","+g+","+b+")" : "rgba("+r+","+g+","+b+","+MathUtil.clamp(alpha,0,1)+")";
}

ColorUtil.toInt=function (red,green,blue)
{
	return (red << 16) | (green << 8) | (blue);
} 
		
ColorUtil.toInt32=function (red,green,blue,alpha)
{
	return (alpha << 24) | (red << 16) | (green << 8) | (blue);
}

ColorUtil.RGBtoHex=function (rgb)
{
  var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
  
  if(/^(rgb|RGB)/.test(rgb)){  
        var aColor = rgb.replace(/(?:||rgb|RGB)*/g,"").split(",");  
        var strHex = "#";  
        for(var i=0; i<aColor.length; i++){  
            var hex = Number(aColor[i]).toString(16);  
            if(hex === "0"){  
                hex += hex;   
            }  
            strHex += hex;  
        }  
        if(strHex.length !== 7){  
            strHex = rgb;    
        }  
        return strHex;  
    }else if(reg.test(rgb)){  
        var aNum = rgb.replace(/#/,"").split("");  
        if(aNum.length === 6){  
            return rgb;      
        }else if(aNum.length === 3){  
            var numHex = "#";  
            for(var i=0; i<aNum.length; i+=1){  
                numHex += (aNum[i]+aNum[i]);  
            }  
            return numHex;  
        }  
    }else{  
        return rgb;      
    }   
}

ColorUtil.toColor=function(color)
{
	color=String(color);
	if(StringUtil.isEmpty(color)) return;
	color=StringUtil.replaceAll(color,["0x","0X","#"],["","",""]);
	return Number("0x"+color);
}

ColorUtil.formatColor=function(color)
{
	if(isNaN(Number(color))) {
		if(StringUtil.exist(String(color),"0x","0X")){
			color=StringUtil.replaceAll(color,["0x","0X"],["#","#"]);
		}
	}
	
	else return "#"+color.toString(16);
	return color;
}

/**
 * 创建线性渐变
 * 
 * args=[x0,y0,x1,y1]
 * x0	渐变开始点的 x 坐标
 * y0	渐变开始点的 y 坐标
 * x1	渐变结束点的 x 坐标
 * y1	渐变结束点的 y 坐标
 * 
 * colors=[[percent,color],[0.9,"#FFFFFF"]];
 * percent 0~1
 * color   0xFFFFFF #FFFFFF
 * 
 * @param {CanvasRenderingContext2D} context
 * @param {Array} args
 * @param {Array} colors
 */
ColorUtil.getLinearGradient=function(context,args,colors)
{
	var gradient=context.createLinearGradient.apply(context,args);
	var i,color,len=colors.length;
	
	for(i=0;i<len;i++){
		color=colors[i];
		if(color==null || color.length<2) continue;
		gradient.addColorStop(color[0],ColorUtil.formatColor(color[1]));
	}
	
	return gradient;
}

/**
 * 创建圆形放射渐变
 * 
 * args=[x0,y0,r0,x1,y1,r1]
 * x0	渐变的开始圆的 x 坐标
 * y0	渐变的开始圆的 y 坐标
 * r0	开始圆的半径
 * x1	渐变的结束圆的 x 坐标
 * y1	渐变的结束圆的 y 坐标
 * r1	结束圆的半径
 * 
 * colors=[[percent,color],[0.9,"#FFFFFF"]];
 * percent 0~1
 * color   0xFFFFFF #FFFFFF
 * 
 * @param {Object} context
 * @param {Object} args
 * @param {Object} colors
 */
ColorUtil.getRadialGradient=function(context,args,colors)
{
	var gradient=context.createRadialGradient.apply(context,args);
	var i,color,len=colors.length;
	
	for(i=0;i<len;i++){
		color=colors[i];
		if(color==null || color.length<2) continue;
		gradient.addColorStop(color[0],ColorUtil.formatColor(color[1]));
	}
	
	return gradient;
}

/**
 * @param {Number} fromColor
 * @param {Number} toColor
 * @param {Number} progress 0~1
 */
ColorUtil.interpolateColor=function(fromColor, toColor, progress)
{
	if(fromColor==undefined || toColor==undefined || progress==undefined) return 0;
	
	progress=(progress>1) ? 0.01*progress : progress;
	fromColor=ColorUtil.toColor(fromColor);
	toColor=ColorUtil.toColor(toColor);
	
	var q = 1-progress;
	var fromA = (fromColor >> 24) & 0xFF;
	var fromR = (fromColor >> 16) & 0xFF;
	var fromG = (fromColor >>  8) & 0xFF;
	var fromB =  fromColor        & 0xFF;

	var toA = (toColor >> 24) & 0xFF;
	var toR = (toColor >> 16) & 0xFF;
	var toG = (toColor >>  8) & 0xFF;
	var toB =  toColor        & 0xFF;
	
	var resultA = fromA*q + toA*progress;
	var resultR = fromR*q + toR*progress;
	var resultG = fromG*q + toG*progress;
	var resultB = fromB*q + toB*progress;
	var resultColor = resultA << 24 | resultR << 16 | resultG << 8 | resultB;
	
	return resultColor;		
}


//----------------------------------------- CanvasUtil -----------------------------------------


CanvasUtil={}

CanvasUtil.create=function(t)
{
	var s = t||{};
	
	if (!s.canvas) {
		s.canvas = document.createElement("canvas");
		s.context = s.canvas.getContext("2d");
	}
	
	return s;
}

CanvasUtil.getCache=function(image,type)
{
	var target=CanvasUtil.create();
	target.canvas.width=image.width;
	target.canvas.height=image.height;
	target.context.drawImage(image, 0, 0, image.width, image.height);
	return target.canvas.toDataURL(type || "image/png");
}

/**
 * canvas to Image
 * @param {HTMLCanvasElement} canvas 
 * @param {String} type 参数type在image/png，image/jpeg,image/svg+xml等 MIME类型中选择（可以不填，默认是image/png）。
 */
CanvasUtil.toImage=function(canvas,type)
{
	if(canvas==null) return;
	var image    = new Image();
	image.src    = canvas.toDataURL(type || "image/png");
	image.height = MathUtil.int(canvas.height);
	image.width  = MathUtil.int(canvas.width);
	return image;
}

CanvasUtil.toCanvas=function(img,target,clear)
{
	if(img==null) return;
	
	clear=(clear==undefined || clear==true);
	target= target||CanvasUtil.create();
	
	if(clear) target.context.clearRect(0, 0, target.canvas.width, target.canvas.height);
	target.canvas.height = img.height;
	target.canvas.width  = img.width;
	
	target.context.drawImage(img, 0, 0);
	return target.canvas;
}

CanvasUtil.getPixelAphla=function(context,x,y)
{
	if(context==null || x>context.width || y>context.height) return 255;
	return context.getImageData(x,y,1,1).data[3];
}

CanvasUtil.clearContext=function(context)
{
	if(context) context.clear(0,0,context.width,context.height);
}

/**
 * @param {DisplayObjectContainer} container
 */
CanvasUtil.containerToImage=function(container,type)
{
	if(container==undefined) return;
	var target=CanvasUtil.create();
	target.canvas.width=Math.ceil(container.width);
	target.canvas.height=Math.ceil(container.height);
	CanvasUtil._renderContainer(target,container,container);
	return type ? target.canvas.toDataURL(type|| "image/png") : CanvasUtil.toImage(target.canvas);
}

CanvasUtil._renderContainer=function(target,self,container)
{
	var i,c,l;
	for (i = 0,l=self._children.length;i<l;i++) {
		c = self._children[i];
		if(c instanceof DisplayObjectContainer){
			try{
				CanvasUtil._renderContainer(target,c,container)
			}catch(err){
				trace(err);
			}
			continue;
		}
		
		target.context.save();
		c._render(target,false,container);
		target.context.restore();
	}
}

/**
 * @param {Context} context
 * @param {Rectangle} rect
 * @param {ColorTransform} colorTransform
 * @param {Context} display
 * @param {Rectangle} rect2
 */
CanvasUtil.colorTransform=function(context,rect,colorTransform,display,rect2)
{
	var x = rect.x >> 0, y = rect.y >> 0, w = rect.width >> 0, h = rect.height >> 0;
	var temp = (display && rect2) ? display.getImageData(rect2.x,rect2.y,rect2.width,rect2.height).data : null;
	
	var img = context.getImageData(x,y,w,h);
	var data = img.data;
	
	for (var i = 0, l = data.length; i < l; i += 4) {
		var r = i, g = i + 1, b = i + 2, a = i + 3;
		if((temp && temp[a]<1) || data[a]<1) continue;

		data[r] = data[r] * colorTransform.redMultiplier   + colorTransform.redOffset;
		data[g] = data[g] * colorTransform.greenMultiplier + colorTransform.greenOffset;
		data[b] = data[b] * colorTransform.blueMultiplier  + colorTransform.blueOffset;
		data[a] = data[a] * colorTransform.alphaMultiplier + colorTransform.alphaOffset;
	}
	
	context.putImageData(img,x,y,0,0,w,h);
}

//----------------------------------------- WordUtil -----------------------------------------

Language={};

/**
 * 简体中文
 */
Language.CN="zh";

/**
 * 日语
 */
Language.JA="ja";

/**
 * 英语
 */
Language.EN="en";

/**
 * 繁体中文
 */
Language.TW="zh-tw";
Language.HK="zh-hk";

/**
 * 法语
 */
Language.FR="fr";

/**
 * 德语
 */
Language.DE="de";

/**
 * 韩语
 */
Language.KO="ko";

/**
 * 西班牙语
 */
Language.ES="es";

/**
 * 瑞典语
 */
Language.SV="sv";

/**
 * 意大利语
 */
Language.IT="it";

WordUtil={}
WordUtil.dic={};
WordUtil.language=Language.CN;

WordUtil.set=function(label,word,language)
{
	if(StringUtil.isEmpty(label) || StringUtil.isEmpty(word)) return;
	language=(language==undefined) ? WordUtil.language : language;
	if(!WordUtil.dic.hasOwnProperty(language)) WordUtil.dic[language]={};
	WordUtil.dic[language][label]=word;
}

WordUtil.get=function(label,language)
{
	language=(language==undefined) ? WordUtil.language : language;
	if(!WordUtil.dic.hasOwnProperty(language) || WordUtil.dic[language]==null || !(WordUtil.dic[language]).hasOwnProperty(label)) return "";
	return WordUtil.dic[language][label];
}

WordUtil.format=function(language)
{
	language=language.toLowerCase();
	if(language==Language.TW || language==Language.HK) return language;
	return language.split("-")[0];
}

WordUtil.clear=function()
{
	WordUtil.dic={};
}

//----------------------------------------- DOMUtil -----------------------------------------


DOMUtil={};

/**
 * 根据id获得DOM对象。
 * @param {String} id DOM对象的id。
 * @return {HTMLElement} DOM对象。
 */
DOMUtil.getDOM = function(id)
{
	return document.getElementById(id);
};

/**
 * 创建一个指定类型type和属性props的DOM对象。
 * @param {String} type 指定DOM的类型。比如canvas，div等。
 * @param {Object} props 指定生成的DOM的属性对象。
 * @return {HTMLElement} 新生成的DOM对象。
 */
DOMUtil.createDOM = function(type, props)
{
	var dom = document.createElement(type);
	if(props==undefined) return dom;
	
	for(var p in props) 
	{
		var val = props[p];
		if(p == "style")
		{
			for(var s in val) dom.style[s] = val[s];
		}else
		{
			dom[p] = val;
		}
	}
	return dom;
};

/**
 * 创建一个可渲染的DOM，可指定tagName，如canvas或div。
 * @param {Object} disObj 一个DisplayObject或类似的对象。
 * @param {Object} imageObj 指定渲染的image及相关设置，如绘制区域rect。
 * @return {HTMLElement} 新创建的DOM对象。
 */
DOMUtil.createDOMDrawable = function(disObj, imageObj)
{
	var tag = disObj.tagName || "div";
	var img = imageObj.image;
	var w = disObj.width || (img && img.width);
	var h =  disObj.height || (img && img.height);

	var elem = DOMUtil.createDOM(tag);
	if(disObj.id) elem.id = disObj.id;
	elem.style.position = "absolute";
	elem.style.left = (disObj.left || 0) + "px";
	elem.style.top = (disObj.top || 0) + "px";
	elem.style.width = w + "px";
	elem.style.height = h + "px";

	if(tag == "canvas")
	{
		elem.width = w;
		elem.height = h;
		if(img)
		{
			var ctx = elem.getContext("2d");
			var rect = imageObj.rect || [0, 0, w, h];		
			ctx.drawImage(img, rect[0], rect[1], rect[2], rect[3], 
						 (disObj.x || 0), (disObj.y || 0), 
						 (disObj.width || rect[2]), 
						 (disObj.height || rect[3]));
		}
	}else
	{
		elem.style.opacity = disObj.alpha != undefined ? disObj.alpha : 1;
		elem.style.overflow = "hidden";
		if(img && img.src)
		{
			elem.style.backgroundImage = "url(" + img.src + ")";
			var bgX = disObj.rectX || 0, bgY = disObj.rectY || 0;
			elem.style.backgroundPosition = (-bgX) + "px " + (-bgY) + "px";
		}
	}
	return elem;
};

/**
 * 获取某个DOM元素在页面中的位置偏移量。格式为:{left: leftValue, top: topValue}。
 * @param {HTMLElement} elem DOM元素。
 * @return {Object} 指定DOM元素在页面中的位置偏移。格式为:{left: leftValue, top: topValue}。
 */
DOMUtil.getElementOffset = function(elem)
{
	var left = elem.offsetLeft, top = elem.offsetTop;
	while((elem = elem.offsetParent) && elem != document.body && elem != document)
	{
		left += elem.offsetLeft;
		top += elem.offsetTop;
	}
	return {left:left, top:top};
};

//----------------------------------------- ObjectPool -----------------------------------------

ObjectPool={};
ObjectPool.max=50;
ObjectPool._dic={};
ObjectPool.COUNT=0;

/**
 * 创建一个对象
 * @param {Object} value class
 * @param {Array} args  params
 */
ObjectPool.create=function(value,args)
{
	var type=ClassUtil.getQualifiedClassName(value);
	var list=ObjectPool._dic[type];
	
	if (list)
	{
		var obj = list.pop();
		if (list.length == 0)
			delete ObjectPool._dic[type];
			
		return obj;
	}
	else{
		var item=new value();
		if(args==undefined) return item;
		value.prototype.constructor.apply(item,args);
		return item;
	}
}

/**
 * 回收一个对象
 * 
 */
ObjectPool.remove=function(obj)
{
	if(obj==null) return;
	var str,type=ClassUtil.getQualifiedClassName(obj);
	
	if (!ObjectPool._dic[type])
		ObjectPool._dic[type] = [];
		
	if(obj.hasOwnProperty("name") && !StringUtil.isEmpty(obj.name)){
		str=obj.name;
		str=str.split("_");
		str.pop();
		
		if(ObjectPool.COUNT>10000) ObjectPool.COUNT=0;
		else   ObjectPool.COUNT++;
		
		str.push("pool"+ObjectPool.COUNT);
		str=str.join("_");
	}
			
	try{
		obj.reset();
	}
	catch(e){
		try{
			obj.dispose();
		}
		catch(e) {
			trace("[WARN] ObjectPool.remove dispose class by",type);
			return false;
		}
	}
	
	if(ObjectPool.max>0 && (ObjectPool._dic[type]).length>=ObjectPool.max){
		try{
			obj.dispose();
		}
		catch(e) {};
		
		obj=null;
		return false;
	}
			
	if((ObjectPool._dic[type]).indexOf(obj)==-1) {
		if(!StringUtil.isEmpty(str)) obj.name=str;
		(ObjectPool._dic[type]).push(obj);
	}	
	
	return true;
}

/**
 * 清除缓存
 * 
 */
ObjectPool.clear=function (value)
{
	if(value==undefined){
		ObjectPool._dic={};
	}else{
		var type=ClassUtil.getQualifiedClassName(value);
		delete ObjectPool._dic[type];
	}
}

ObjectPool.getInfo=function()
{
	var name,str="[";
	for(name in ObjectPool._dic) str+=name+":"+ObjectPool._dic[name].length+"; ";
	return str+"]";
}

//----------------------------------------- CollisionUtil -----------------------------------------


CollisionUtil={};

/**
 * 检测显示对象obj是否与点x，y发生了碰撞。
 * @param {DisplayObject} obj 要检测的显示对象 或者数据。
 * @param {Number} x 指定碰撞点的x坐标。
 * @param {Number} y 指定碰撞点的y坐标。
 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
 * @return {Number} 如果点x，y在对象obj内为1，在外为-1，在边上为0。
 */
CollisionUtil.hitTestPoint = function(obj, x, y, usePolyCollision)
{
	var b = (obj instanceof DisplayBase) ? obj.getBounds(obj.stage) : obj, len = b.length;
	var hit = x >= b.x && x <= b.x + b.width && y >= b.y && y <= b.y + b.height;
	
	if(hit && usePolyCollision)
	{
		var cross = 0, onBorder = false, minX, maxX, minY, maxY;		
		for(var i = 0; i < len; i++)
		{
			var p1 = b[i], p2 = b[(i+1)%len];			
			
			if(p1.y == p2.y && y == p1.y)
			{
				p1.x > p2.x ? (minX = p2.x, maxX = p1.x) : (minX = p1.x, maxX = p2.x);
				if(x >= minX && x <= maxX)
				{
					onBorder = true;
					continue;
				}
			}
			
			p1.y > p2.y ? (minY = p2.y, maxY = p1.y) : (minY = p1.y, maxY = p2.y);
			if(y < minY || y > maxY) continue;
			
			var nx = (y - p1.y)*(p2.x - p1.x) / (p2.y - p1.y) + p1.x;
			if(nx > x) cross++;
			else if(nx == x) onBorder = true;			
		}
		
		if(onBorder) return 0;
		else if(cross % 2 == 1) return 1;
		return -1;
	}
	return hit ? 1 : -1;
};

/**
 * 检测显示对象obj1和obj2是否发生了碰撞。
 * @param {DisplayObject} obj1 要检测的显示对象。
 * @param {DisplayObject} obj2 要检测的显示对象。
 * @param {Boolean} usePolyCollision 指定是否采用多边形碰撞。默认为false。
 * @return {Boolean} 发生碰撞为true，否则为false。
 */
CollisionUtil.hitTestObject = function(obj1, obj2, usePolyCollision)
{
	var b1 = obj1.getBounds(obj1.stage), b2 = obj2.getBounds(obj2.stage);
	var hit = b1.x <= b2.x + b2.width && b2.x <= b1.x + b1.width && 
				   b1.y <= b2.y + b2.height && b2.y <= b1.y + b1.height;
	
	if(hit && usePolyCollision)
	{
		hit = CollisionUtil.polygonCollision(b1, b2);
		return hit !== false;
	}
	return hit;
};

/**
 * 采用Separating Axis Theorem(SAT)的多边形碰撞检测方法。
 * @private
 * @param {Array} poly1 多边形顶点组成的数组。格式如：[{x:0, y:0}, {x:10, y:0}, {x:10, y:10}, {x:0, y:10}]。
 * @param {Array} poly2 多边形顶点组成的数组。格式与参数poly1相同。
 * @param {Boolean} 发生碰撞为true，否则为false。 
 */
CollisionUtil.polygonCollision = function(poly1, poly2)
{	
	var result = CollisionUtil._doSATCheck(poly1, poly2, {overlap:-Infinity, normal:{x:0, y:0}});
	if(result) return CollisionUtil._doSATCheck(poly2, poly1, result);
	return false;
};

CollisionUtil._doSATCheck = function (poly1, poly2, result)
{
	var len1 = poly1.length, len2 = poly2.length, currentPoint, nextPoint, distance, min1, max1, min2, max2, dot, overlap, normal = {x:0, y:0};
	
	for(var i = 0; i < len1; i++)
	{
		currentPoint = poly1[i];
		nextPoint = poly1[(i < len1-1 ? i+1 : 0)];
		
		normal.x = currentPoint.y - nextPoint.y;
		normal.y = nextPoint.x - currentPoint.x;
		
		distance = Math.sqrt(normal.x * normal.x + normal.y * normal.y);
		normal.x /= distance;
		normal.y /= distance;
		
		min1 = max1 = poly1[0].x * normal.x + poly1[0].y * normal.y;		
		for(var j = 1; j < len1; j++)
		{
			dot = poly1[j].x * normal.x + poly1[j].y * normal.y;
			if(dot > max1) max1 = dot;
			else if(dot < min1) min1 = dot;
		}
		
		min2 = max2 = poly2[0].x * normal.x + poly2[0].y * normal.y;		
		for(j = 1; j < len2; j++)
		{
			dot = poly2[j].x * normal.x + poly2[j].y * normal.y;
			if(dot > max2) max2 = dot;
			else if(dot < min2) min2 = dot;
		}
		
		if(min1 < min2)
		{
			overlap = min2 - max1;
			normal.x = -normal.x;
			normal.y = -normal.y;
		}else
		{
			overlap = min1 - max2;
		}
		
		if(overlap >= 0)
		{
			return false;
		}else if(overlap > result.overlap)
		{
			result.overlap = overlap;
			result.normal.x = normal.x;
			result.normal.y = normal.y;
		}
	}
	
	return result;
};

//----------------------------------------- PropUtil -----------------------------------------



PropUtil={}

PropUtil.parseProperties=function(data)
{
	var currentMap = {};
    var newData = data.replace(/[\r\n]/g,"\n");
	var dateArray = newData.split("\n");
	
	var i,str,index,key,val;
			
	for(i=0;i<dateArray.length;i++)
	{
		str=dateArray[i];
		
		if(str == null || str.length < 3) 
		{
			continue;
		}
		
		if(str.charAt(0) == "#") 
		{
			continue;
		}
		
		index=dateArray[i].indexOf("=");
		if(index < 0) 
		{
			continue;
		}
		
		key = StringUtil.trim(str.substring(0,index));
		val = StringUtil.trim(str.substring(index+1,str.length));
		
		currentMap[key]=val;
	}
	
	return currentMap;
}

//----------------------------------------- SVGUtil -----------------------------------------


SVGUtil={};

SVGUtil.ns    = 'http://www.w3.org/2000/svg';
SVGUtil.xlink = 'http://www.w3.org/1999/xlink';
SVGUtil.xmlns = 'http://www.w3.org/2000/xmlns/';

/**
 * return (base_width,base_height,anim_width,anim_height);
 * @param {Object} xml
 */
SVGUtil.getRect=function(xml)
{
	if(xml==undefined) return null;
	var xml_doc=xml.documentElement ? xml.documentElement : xml;
	
	var w=xml_doc.width;
	var h=xml_doc.height;
	
	var w_bool=(w instanceof SVGAnimatedLength);
	var h_bool=(h instanceof SVGAnimatedLength);
	
	return new Rectangle(w_bool ? w.baseVal.value : 0,h_bool ? h.baseVal.value : 0,w_bool ? w.animVal.value :MathUtil.int(w),h_bool ? h.animVal.value :MathUtil.int(h));
}

SVGUtil.getElement=function(xml)
{
	if(xml==undefined) return null;
	
	var map=ObjectPool.create(DOMDisplay);
	var rect=SVGUtil.getRect(xml);
   	var svg=DOMUtil.createDOM("div",{style:{width:rect.width+"px",height:rect.height+"px"}});
   	
   	try{
   		svg.innerHTML=new XMLSerializer().serializeToString(xml);
   	}
   	catch(err){
   		svg.innerHTML=xml;
   	}
   	
   	map.element=svg;
   	return map;
}

SVGUtil.create = function(type, props)
{
	if(type==undefined) return;
	var dom = document.createElementNS(SVGUtil.ns, type);
	
	if(props==undefined) props={};
	if(type.toLowerCase()=="svg" && !props.hasOwnProperty("xmlns")) props.xmlns=SVGUtil.ns;
	
	for(var p in props) 
	{
		var val = props[p];
		if(p == "style")
		{
			for(var s in val) dom.style[s] = val[s];
		}else
		{
			dom.setAttribute(p, val);
		}
	}
	return dom;
};

SVGUtil.supported = function() 
{
	return !! document.createElementNS && !! document.createElementNS(SVGUtil.ns,'svg').createSVGRect;
}

//----------------------------------------- LayoutUtil -----------------------------------------


LayoutUtil={};

/**
 * item UI数组排列平铺
 * 
 * @param {Array} array
 * 全部UI数组列表
 * 
 * @param {Number} num
 * UI 列表排列个数
 * 
 * @param {Boolean} isX
 * UI 列表扩展方向 是X方向
 * 
 * @param {Rectangle} rect
 * list标准化矩形
 * x,y 起始点坐标
 * width，height 格式化每item尺寸
 * 
 * @param {Point} space
 * Xspace X方向间隙 
 * Yspace Y方向间隙
 * 例如new Point(Xspace,Yspace);
 * 
 * @param {Point} focus
 * item焦点描述
 * x 坐标 0~1
 * y 坐标 0~1
 * 例如中心点  new Point(0.5,0.5);
 * 
 * @param {Boolean} isForward
 * UI 列表 是否正向扩展
 */
LayoutUtil.tile=function(array,num,isX,rect,space,focus,isForward)
{
	if(array==undefined || array.length<1 || num==undefined || num<1)return;
	if(isX==true) LayoutUtil._row(array,num,rect,space,focus,isForward);
	else  LayoutUtil._tier(array,num,rect,space,focus,isForward);
}

/**
 * line X orientation
 */
LayoutUtil._row=function(array,tier,rect,space,focus,isForward)
{
	focus=(focus==undefined) ? {x:0,y:0} : focus;
	var i,item,_width,_height,length=array.length;
	
	var _x=(rect==undefined ? 0 : rect.x);
	var _y=(rect==undefined ? 0 : rect.y);

	var Xspace=(space==undefined ? 0 : space.x);
	var Yspace=(space==undefined ? 0 : space.y);
	
	var reverseHeight=(isForward==undefined || !isForward) ? 0 : LayoutUtil._countSize(array,rect,(tier-1),Yspace);
	
	for(i=0;i<length;i++)
	{
		item=array[i];
		if(item==null || !((item.hasOwnProperty("_x") && item.hasOwnProperty("_y")) || (item.hasOwnProperty("x") && item.hasOwnProperty("y")))) continue;
		
	    _width=(rect==undefined || rect.width==0) ? item.getWidth() : rect.width;
	    _height=(rect==undefined || rect.height==0) ? item.getHeight() : rect.height;
		
		item.x=Math.round(_x+_width*focus.x); 
		item.y=Math.round(reverseHeight==0 ? _y : (_y+reverseHeight));
	    
	    _y+=(reverseHeight==0) ? Math.round(_width+Yspace) : Math.round((_width+Yspace)*-1);
		
	    if((i+1)%tier==0){
			_y=(rect==undefined ? 0 : rect.y);
			_x+=Math.round(_width*(1-focus.x)+Xspace);
		}
	    
	}
}

/**
 * line Y orientation
 */
LayoutUtil._tier=function(array,row,rect,space,focus,isForward)
{
	focus=(focus==undefined) ? {x:0,y:0} : focus;
	var i,item,_width,_height,length=array.length;
	
	var _x=(rect==undefined ? 0 : rect.x);
	var _y=(rect==undefined ? 0 : rect.y);

	var Xspace=(space==undefined ? 0 : space.x);
	var Yspace=(space==undefined ? 0 : space.y);
	
	var reverseWidth=(isForward==undefined || !isForward) ? 0 : LayoutUtil._countSize(array,rect,(row-1),Xspace,true);
	    
	for(i=0;i<length;i++)
	{
		item=array[i];
	    if(item==null || !((item.hasOwnProperty("_x") && item.hasOwnProperty("_y")) || (item.hasOwnProperty("x") && item.hasOwnProperty("y")))) continue;
		
	    _width=(rect==undefined || rect.width==0) ? item.getWidth() : rect.width;
	    _height=(rect==undefined || rect.height==0) ? item.getHeight() : rect.height;
		
		item.x=Math.round(reverseWidth==0 ? _x : (_x+reverseWidth)); 
		item.y=Math.round(_y+_height*focus.y);
	    
	    _x+=(reverseWidth==0) ? Math.round(_width+Xspace) : Math.round((_width+Xspace)*-1);
		
	    if((i+1)%row==0){
	    	_x=(rect==undefined ? 0 : rect.x);
	    	_y+=Math.round(_height*(1-focus.y)+Yspace);
	    }
	    
	}
}

LayoutUtil._countSize=function(array,rect,n,space,isWidth)
{
	if(n<1) return 0;
			
	if(isWidth && rect && rect.width!=0) return Math.round(Math.abs(rect.width*n+(n-1)*space));
	if(!isWidth && rect && rect.height!=0) return Math.round(Math.abs(rect.height*n+(n-1)*space));
	
	var i,size=0;
	for(i=0;i<n;i++)
	{
		size+=isWidth ? Math.round(array[i].width) : Math.round(array[i].height);
		size+=space;
	}
	
	return size;
}

//----------------------------------------- UIOrientation -----------------------------------------

UIOrientation={};

UIOrientation.isX=1;
UIOrientation.isY=2;
UIOrientation.isXY=3;
UIOrientation.isNone=0;

//----------------------------------------- BaseObject -----------------------------------------

/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
BaseObject Class
===================================================================
**/

function BaseObject()
{
}

Object.defineProperty(BaseObject.prototype,"data",{
    set: function (value) {
        if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
    },
    enumerable: true,
    configurable: true
});

BaseObject.prototype.toString=function()
{
	return 'BaseObject';
}
//----------------------------------------- Point -----------------------------------------

/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Point Class
===================================================================
**/

function Point(x_, y_)
{
	this.x = x_||0;
	this.y = y_||0;
}

Object.defineProperty(Point.prototype,"data",{
	get: function (){
		var str=this.toString();
		return JSON.parse(str);
	},
    set: function (value) {
        if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Point.prototype,"radians",{
	get: function ()
	{
		return Math.atan2(this.y,this.x);
	},
	enumerable: true,
    configurable: true
});
	
Point.prototype.rotation=function(radians)
{
	if(radians==0) return;
	radians+=this.radians;
	var value=this.length();
	this.x=MathUtil.format(Math.cos(radians)*value);
	this.y=MathUtil.format(Math.sin(radians)*value);
}

Point.prototype.clone= function() 
{
	return new Point(this.x, this.y);
}

Point.prototype.add= function(v) 
{
	this.x += v.x;
	this.y += v.y;
}

Point.prototype.subtract= function(v) 
{
	this.x -= v.x;
	this.y -= v.y;
	return this;
}

Point.prototype.multiply= function(a) 
{
	this.x *= a;
	this.y *= a;
}

Point.prototype.offset= function(dx,dy) 
{
	this.x += dx;
	this.y += dy;
}

Point.prototype.abs= function() 
{
	this.x = Math.abs(this.x);
	this.y = Math.abs(this.y);
}

Point.prototype.length=function()
{
	return MathUtil.format(Math.sqrt(this.x * this.x + this.y * this.y));
}

Point.prototype.normalize= function() 
{
	var length = this.length();
	if (length < Number.MIN_VALUE) {
		return 0.0;
	}
	var invLength = 1.0 / length;
	this.x *= invLength;
	this.y *= invLength;

	return MathUtil.format(length);
}

Point.prototype.min= function(b) 
{
	this.x = this.x < b.x ? this.x : b.x;
	this.y = this.y < b.y ? this.y : b.y;
}

Point.prototype.max= function(b) 
{
	this.x = this.x > b.x ? this.x : b.x;
	this.y = this.y > b.y ? this.y : b.y;
}

Point.prototype.reset= function(x,y) 
{
	this.x = x;
	this.y = y;
}

Point.prototype.equals=function(point)
{
	return (this.x==pt.x && this.y==pt.y);
}

Point.prototype.toString=function ()
{
	return String('{"x":'+this.x+',"y":'+this.y+'}');
}

Point.prototype.dispose=function ()
{
	this.x=this.y=0;
}

//****************************************
// Static Function
//****************************************

Point.distance=function(pointA,pointB)
{
	pointB=pointB||new Point();
	return MathUtil.format(Math.sqrt((pointA.x-pointB.x)*(pointA.x-pointB.x)+(pointA.y-pointB.y)*(pointA.y-pointB.y)));
};

Point.toPoint=function(str)
{
	if(StringUtil.isEmpty(str)) return null;
	
	str=str.toLocaleLowerCase();
	if(str.indexOf("x")==-1) str=StringUtil.replaceAll(str,['(',')','{',','],['{','}','{"x":',',"y":']);
		else str=StringUtil.replaceAll(str,['(',')','x','y','='],['{','}','"x"','"y"',':']);
		
	var obj;
	try{
		obj=JSON.parse(str);
	}catch(e){}
	
	return obj ? new Point(obj.x,obj.y) : null;
};

Point.getMiddlePoint=function(point1,point2)
{
	return new Point((point1.x+point2.x)*0.5,(point1.y+point2.y)*0.5);
};

Point.clamp=function(point,min,max)
{
	if(min>0 && (Math.abs(point.x)<min || Math.abs(point.y)<min)){
		if(Math.abs(point.x)<Math.abs(point.y)){
			point.y=point.y*min/Math.abs(point.x);
			point.x=(point.x>=0 ? 1 :-1)*min;
		}else{
			point.x=point.x*min/Math.abs(point.y);
			point.y=(point.y>=0 ? 1 :-1)*min;
		}
	}
	
	if(max>0 && (Math.abs(point.x)>max || Math.abs(point.y)>max)){
		if(Math.abs(point.x)>Math.abs(point.y)){
			point.y=point.y*max/Math.abs(point.x);
			point.x=(point.x>=0 ? 1 :-1)*max;
		}else{
			point.x=point.x*max/Math.abs(point.y);
			point.y=(point.y>=0 ? 1 :-1)*max;
		}
	}
	
	return point;
}

//----------------------------------------- Rectangle -----------------------------------------

/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Rectangle Class
===================================================================
**/

function Rectangle(x_, y_,width_,height_) 
{
	this.x = MathUtil.format(x_||0);
	this.y = MathUtil.format(y_||0);
	
	this.width  = Math.abs(MathUtil.format(width_ || 0));
	this.height = Math.abs(MathUtil.format(height_|| 0));
}

Object.defineProperty(Rectangle.prototype,"data",{
	get: function (){
		var str=this.toString();
		return JSON.parse(str);
	},
    set: function (value) {
        if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Rectangle.prototype,"topLeft",{
   /**
	矩形的左上角点
	return Point
	*/
    get: function () {
        return new Point(this.x,this.y);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Rectangle.prototype,"bottomRight",{
   /**
	矩形的右下角点
	return Point
	*/
    get: function () {
        return new Point(this.x+this.width,this.y+this.height);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Rectangle.prototype,"right",{
   /**
	 * 矩形右边界
	 */
    get: function () {
        return this.x+this.width;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Rectangle.prototype,"bottom",{
   /**
	 * 矩形底部
	 */
    get: function () {
        return this.y+this.height;
    },
    enumerable: true,
    configurable: true
});

Rectangle.prototype.move=function(offset,y)
{
	this.x=MathUtil.format(y==undefined ? offset.x : offset+this.x);
	this.y=MathUtil.format(y==undefined ? offset.y : y+this.y);
}
	
Rectangle.prototype.add=function(rect)
{
	this.x=MathUtil.format(rect.x+this.x);
	this.y=MathUtil.format(rect.y+this.y);
	this.width=MathUtil.format(rect.width+this.width);
	this.height=MathUtil.format(rect.height+this.height);
}

Rectangle.prototype.multiply=function(ratioX,ratioY)
{
	ratioY=ratioY || ratioX;
	this.x=MathUtil.format(this.x*ratioX);
	this.y=MathUtil.format(this.y*ratioY);
	this.width=MathUtil.format(this.width*ratioX);
	this.height=MathUtil.format(this.height*ratioY);
}

/**
矩形是否包括坐标点或者矩形
return boolean
*/
Rectangle.prototype.contains=function(p,y)
{
	if(p==null) return false;
	
	if(p instanceof Point)
	return this.x<=p.x && this.y<=p.y && p.x<=this.right && p.y<=this.bottom;
	
	else if(p instanceof Rectangle)
	return this.x<=p.x && this.y<=p.y && p.right<=this.right && p.bottom<=this.bottom;
	
	else if(y!=undefined)
	return this.x<=p && this.y<=y && p<=this.right && y<=this.bottom;
	
	return false;
}

/**
两个矩形是否相交
return boolean
*/
Rectangle.prototype.intersects=function(r)
{
	return this.x<=r.x+r.width && this.y<=r.y+r.height && r.x<=this.x+this.width && r.y<=this.y+this.height;
}

/**
返回两个矩形相交的交集矩形
return Rectangle
*/
Rectangle.prototype.intersection=function (r)
{
	if(!this.intersects(r)) return new Rectangle();
	
	var max_x=Math.max(this.x,r.x);
	var max_y=Math.max(this.y,r.y);
	
	var min_w=Math.min(this.x+this.width,r.x+r.width)-max_x;
	var min_h=Math.min(this.y+this.height,r.y+r.height)-max_y;
	
	return new Rectangle(max_x,max_y,min_w,min_h);
}

/**
返回四个点坐标的数组
return Array
*/
Rectangle.prototype.getPoints=function()
{
	return [new Point(this.x,this.y),new Point(this.x+this.width,this.y),new Point(this.x+this.width,this.y+this.height),new Point(this.x,this.y+this.height)];
}

/**
 * 返回四个点坐标的数组 
 * return Array
 * @param {Number} radians
 * @param {Object} point
 * @param {Object} offset
 */
Rectangle.prototype.rotation=function(radians,point,offset)
{
	point=(point ? point : new Point());
	var array=this.getPoints();
	var sin,cos,i,r,l;
	
    for(i=0;i<array.length;i++){
    	array[i].subtract(point);
    	l=array[i].length();
    	r=array[i].radians;
    	
    	sin=Math.sin(r+radians);
    	cos=Math.cos(r+radians);
    	
    	array[i].x=point.x+l*cos+(offset ? offset.x : 0);
    	array[i].y=point.y+l*sin+(offset ? offset.y : 0);
    }
	
	return array;
}


/**
返回两个矩形两个矩形组合在一起的最大矩形
return Rectangle
*/
Rectangle.prototype.union=function(r)
{
	var min_x=Math.min(this.x,r.x);
	var min_y=Math.min(this.y,r.y);
	
	var max_w=Math.max(this.x+this.width,r.x+r.width)-min_x;
	var max_h=Math.max(this.y+this.height,r.y+r.height)-min_y;
	
	return new Rectangle(min_x,min_y,max_w,max_h);
}

Rectangle.prototype.clone=function()
{
	return new Rectangle(this.x,this.y,this.width,this.height);
}

Rectangle.prototype.dispose=function()
{
	delete this.x;
	delete this.y;
	delete this.width;
	delete this.height;
}

Rectangle.prototype.toArray=function(b)
{
	return [this.x,this.y,b ? this.right : this.width,b ? this.bottom :this.height];
}

Rectangle.prototype.toString=function()
{
	return '{"x":'+this.x+',"y":'+this.y+',"width":'+this.width+',"height":'+this.height+'}';
}

//****************************************
// Static Function
//****************************************

/**
 * 字符串转换为矩形
 * @param {String} str 
 */
Rectangle.toRectangle=function(str)
{
	if(StringUtil.isEmpty(str)) return null;
	
	str=str.toLowerCase();
	if(!StringUtil.exist(str,"x","y","w","h",":","=")){
		
		str=StringUtil.replaceAll(str,['(',')','{','}'],["","","",""]);
		var array=str.split(",");
		
		return (array.length<4) ? null :new Rectangle(Number(array[0]),Number(array[1]),Number(array[2]),Number(array[3]));
	}
	
	str=StringUtil.replaceAll(str,['(',')'],['{','}']);
	str=(str.indexOf('height')==-1) ? StringUtil.replace(str,'h','height') : str;
	str=(str.indexOf('width')==-1) ? StringUtil.replace(str,'w','width') : str;
	str=(!StringUtil.exist(str,'"',"'",":")) ? StringUtil.replaceAll(str,['=','x','y','width','height'],[':','"x"','"y"','"width"','"height"']) : str;
	
	var obj;
	try{
		obj=JSON.parse(str);
	}catch(e){}
	
	return obj ? ObjectUtil.copyAttribute(new Rectangle(),obj,true) : null;
};

/**
 * 获得矩形内部点 (按照百分比)
 * @param {Rectangle} rect
 * @param {Number} percentX
 * @param {Number} percentY
 */
Rectangle.getRectanglePoint=function(rect,percentX,percentY)
{
	percentX=percentX||0.5;
	percentY=percentY||0.5;
	return rect ? new Point(MathUtil.format(rect.x+rect.width*percentX),MathUtil.format(rect.y+rect.height*percentY)) :null;
};

/**
 * 设置矩形中心点 (可以设置百分比)
 * @param {Rectangle} rect
 * @param {Point} center
 * @param {Number} percentX
 * @param {Number} percentY
 */
Rectangle.setRectangleCenter=function(rect,center,percentX,percentY)
{
	if(rect==null || center==null) return;
	
	percentX=percentX||0.5;
	percentY=percentY||0.5;
	
	rect.x=MathUtil.format(center.x-rect.width*percentX);
	rect.y=MathUtil.format(center.y-rect.height*percentY);
};

/**
 * 获得一个矩形内部点坐标
 * @param {Rectangle} rect
 * @param {Point} point
 */
Rectangle.innerPoint=function(rect,point)
{
	if(rect==null || point==null) return;
	
	point.x=MathUtil.clamp(point.x,rect.x,rect.right);
	point.y=MathUtil.clamp(point.y,rect.y,rect.bottom);
	
	return point;
}

/**
 * 根据2-4个点确定一个矩形
 * @param {Point} posA
 * @param {Point} posB
 * @param {Point} posC
 * @param {Point} posD
 */
Rectangle.createRectangle=function(posA,posB,posC,posD)
{
	posC=posC||posA;
	posD=posD||posB;
	
	var minX = Math.min(posA.x,posB.x,posC.x,posD.x);
	var maxX = Math.max(posA.x,posB.x,posC.x,posD.x);
	
	var minY = Math.min(posA.y,posB.y,posC.y,posD.y);
	var maxY = Math.max(posA.y,posB.y,posC.y,posD.y);
	
	return {x:minX,y:minY,width:maxX-minX,height:maxY-minY};
}

/**
 * 旋转一个矩形获得最大边框
 * @param {Rectangle} rect
 * @param {Number} radians
 * @param {Object} point
 */
Rectangle.rectangleByRadians=function(rect,radians,point)
{
	if(radians==0) return rect.clone();
    var points=rect.rotation(radians,point);
    ObjectUtil.copyAttribute(points,Rectangle.createRectangle(points[0],points[1],points[2],points[3]));
	return points;
}


//----------------------------------------- Matrix -----------------------------------------

/**
===================================================================
Matrix Class
===================================================================
**/

function Matrix(a, b, c, d, tx, ty)
{
	this.setup(a, b, c, d, tx, ty);
}

Object.defineProperty(Matrix.prototype,"data",{
	get: function(){
		return JSON.parse(this.toString());
	},
    set: function (value) {
        if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,true);
    },
    enumerable: true,
    configurable: true
});

Matrix.prototype.setup=function(a, b, c, d, tx, ty)
{
	this.a=a != undefined ? a : 1;
	this.b=b != undefined ? b : 0;
	this.c=c != undefined ? c : 0;
	this.d=d != undefined ? d : 1;
	this.tx=tx != undefined ? tx : 0;
	this.ty=ty != undefined ? ty : 0;
}

Matrix.prototype.concatTransform=function(posX, posY,scaleX,scaleY,rotation,regX,regY,skewX,skewY)
{
	var cos = 1, sin = 0;
	if(rotation%360 != 0)
	{
		cos = MathUtil.cos(rotation);
		sin = MathUtil.sin(rotation);
	}
	
	if(regX != 0) this.tx -= regX;
	if(regY != 0) this.ty -= regY;

    if (skewX || skewY) {
        this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, 0, 0);
        this.prepend(MathUtil.cos(skewY), MathUtil.sin(skewY), -MathUtil.sin(skewX), MathUtil.cos(skewX), posX, posY);
    }
    else this.prepend(cos * scaleX, sin * scaleX, -sin * scaleY, cos * scaleY, posX, posY);
}

Matrix.prototype.prepend = function (a, b, c, d, tx, ty) 
{
    var tx1 = this.tx;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
        var a1 = this.a;
        var c1 = this.c;
        this.a = a1 * a + this.b * c;
        this.b = a1 * b + this.b * d;
        this.c = c1 * a + this.d * c;
        this.d = c1 * b + this.d * d;
    }
    this.tx = tx1 * a + this.ty * c + tx;
    this.ty = tx1 * b + this.ty * d + ty;
    return this;
};

Matrix.prototype.append = function (a, b, c, d, tx, ty) 
{
    var a1 = this.a;
    var b1 = this.b;
    var c1 = this.c;
    var d1 = this.d;
    if (a != 1 || b != 0 || c != 0 || d != 1) {
        this.a = a * a1 + b * c1;
        this.b = a * b1 + b * d1;
        this.c = c * a1 + d * c1;
        this.d = c * b1 + d * d1;
    }
    this.tx = tx * a1 + ty * c1 + this.tx;
    this.ty = tx * b1 + ty * d1 + this.ty;
    return this;
};

Matrix.prototype.concat = function(m)
{
	var ma = m.a;
    var mb = m.b;
    var mc = m.c;
    var md = m.d;
    var tx1 = this.tx;
    var ty1 = this.ty;

    if (ma != 1 || mb != 0 || mc != 0 || md != 1) {
        var a1 = this.a;
        var b1 = this.b;
        var c1 = this.c;
        var d1 = this.d;

        this.a = a1 * ma + b1 * mc;
        this.b = a1 * mb + b1 * md;
        this.c = c1 * ma + d1 * mc;
        this.d = c1 * mb + d1 * md;
    }
    this.tx = tx1 * ma + ty1 * mc + m.tx;
    this.ty = tx1 * mb + ty1 * md + m.ty;
	return this;
};

Matrix.prototype.rotate = function(angle)
{
	var cos = 1, sin = 0;
	
	if(angle%360 != 0)
	{
		cos = MathUtil.cos(angle);
		sin = MathUtil.sin(angle);
	}
	
	var a = this.a;
	var c = this.c;
	var tx = this.tx;
	
	this.a = a * cos - this.b * sin;
	this.b = a * sin + this.b * cos;
	this.c = c * cos - this.d * sin;
	this.d = c * sin + this.d * cos;
	this.tx = tx * cos - this.ty * sin;
	this.ty = tx * sin + this.ty * cos;
	return this;
};

Matrix.prototype.scale = function(sx, sy)
{
	this.a *= sx;
	this.d *= sy;
	this.tx *= sx;
	this.ty *= sy;
	return this;
};

Matrix.prototype.translate = function(dx, dy)
{
	this.tx += dx;
	this.ty += dy;
	return this;
};

Matrix.prototype.invert = function()
{
	var a = this.a;
	var b = this.b;
	var c = this.c;
	var d = this.d;
	var tx = this.tx;
	var i = a * d - b * c;
	
	this.a = d / i;
	this.b = -b / i;
	this.c = -c / i;
	this.d = a / i;
	this.tx = (c * this.ty - d * tx) / i;
	this.ty = -(a * this.ty - b * tx) / i;
	return this;
};

Matrix.prototype.transformPoint = function(point, round, returnNew)
{
	var x = point.x * this.a + point.y * this.c + this.tx;
	var y =	point.x * this.b + point.y * this.d + this.ty;
	if(round)
	{
		x = x + 0.5 >> 0;
		y = y + 0.5 >> 0;
	}
	if(returnNew) return new Point(x,y);
	point.x = x;
	point.y = y;
	return point;
};

/**
 * @param {DisplayBase} target
 */
Matrix.prototype.applyDisplay = function(target)
{
	if(target==undefined) target={};
	
    var mSkewX = Math.atan(-this.c / this.d);
    var mSkewY = Math.atan( this.b / this.a);
    
    target.x=this.tx;
	target.y=this.ty;

	target.scaleX=(mSkewY > -Matrix.PI_Q && mSkewY < Matrix.PI_Q) ?  this.a / Math.cos(mSkewY) :  this.b / Math.sin(mSkewY);
	target.scaleY=(mSkewX > -Matrix.PI_Q && mSkewX < Matrix.PI_Q) ?  this.d / Math.cos(mSkewX) : -this.c / Math.sin(mSkewX);
	target.rotation=MathUtil.isEquivalent(mSkewX, mSkewY) ? MathUtil.getDegreesFromRadians(mSkewX) : 0;
	return target;
}

Matrix.prototype.clone=function()
{
	var copy=ObjectPool.create(Matrix);
	copy.setup(this.a, this.b, this.c, this.d, this.tx, this.ty);
	return copy;
}

Matrix.prototype.toString=function()
{
	return '{"a":' + this.a + ',"b":' + this.b + ',"c":' + this.c + ',"d":' + this.d + ',"tx":' + this.tx + ',"ty":' + this.ty + "}";
}

Matrix.prototype.reset=function()
{
	this.a = this.d = 1;
	this.b = this.c = this.tx = this.ty = 0;
	return this;
}

Matrix.prototype.dispose=function()
{
	delete this.a, this.b, this.c, this.d, this.tx, this.ty;
}

Matrix.PI_Q = Math.PI / 4.0;
//----------------------------------------- Global -----------------------------------------

/**
===================================================================
Global Object
===================================================================
**/

Global={};
Global.canvas=Global.context=null;

/**
 * canvas深度（z方向）
 */
Global.layer=5;

/**
 * debug模式
 */
Global.debug=true;

/**
 * 操作系统
 */
Global.os=SystemType.OS_PC;

/**
 * IOS系统
 */
Global.ios=false;

/**
 * Android系统
 */
Global.android=false;

/**
 * Checks whether this is a broken Android implementation.
 */
Global.isBrokenAndroid=false;

/**
 * IE 浏览器
 */
Global.isIE=false;

/**
 * firefox 浏览器
 */
Global.isFirefox=false;

/**
 * Opera 浏览器
 */
Global.isOpera=false;

/**
 * WebKit 浏览器
 */
Global.isWebKit=false;

/**
 * Chrome 浏览器
 */
Global.isChrome=false;

/**
 * Safari 浏览器
 */
Global.isSafari=false;

/**
 * QQ 浏览器
 */
Global.isQQBrowser=false;

/**
 * 是否触摸屏
 */
Global.canTouch=false;

/**
 * 舞台方向
 */
Global.aspectRatio=SystemType.NONE;

/**
 * 全局字体
 */
Global.font="Helvetica,Arial";

/**
 * 是否SVG图形 动画
 */
Global.supportSVG = false;


/**
 * 是否支持触摸屏
 */
Global.supportTouch = false;

/**
 * 是否支持画布
 */
Global.supportCanvas = false;

/**
 * 是否支持本地存储
 */
Global.supportStorage = false;

/**
 * 是否支持重力感应
 */
Global.supportOrientation = false;

/**
 * 是否支持震动
 */
Global.supportDeviceMotion = false;

/**
 * 是否CSS矩阵转换
 */
Global.supportTransform=false;

/**
 * CSS前缀
 */
Global.cssPrefix="";

/**
 * 页面内部输出调试
 */
Global.htmlDebug=false;

/**
 * 打断页面鼠标事件
 */
Global.breakTouch=false;

/**
 * 语言
 */
Global.language;

/**
 * 容器
 */
Global.div;

/**
 * 字体大小
 */
Global.fontSize=8;

/**
 * 使用画布
 */
Global.useCanvas=true;

/**
 * 全局宽度
 */
Global.width=0;

/**
 * 全局高度
 */
Global.height=0;

/**
 * 自适应图形尺寸
 */
Global.autoShapeSize=true;

Global.setup=function(n)
{
	if(StringUtil.isEmpty(n)) return;
	n=n.toLowerCase();

	if (n.indexOf(SystemType.OS_IPHONE) > 0) {
		Global.os = SystemType.OS_IPHONE;
		Global.canTouch = true;
		Global.ios = true;
	} else if (n.indexOf(SystemType.OS_IPOD) > 0) {
		Global.os = SystemType.OS_IPOD;
		Global.canTouch = true;
		Global.ios = true;
	} else if (n.indexOf(SystemType.OS_IPAD) > 0) {
		Global.os = SystemType.OS_IPAD;
		Global.ios = true;
		Global.canTouch = true;
	} else if (n.indexOf(SystemType.OS_ANDROID) > 0) {
		Global.os = SystemType.OS_ANDROID;
		Global.canTouch = true;
		Global.android = true;
		Global.isBrokenAndroid=(n.match(/android 2\.[12]/)!== null);
	} else if (n.indexOf(SystemType.OS_WINDOWS_PHONE) > 0) {
		Global.os = SystemType.OS_WINDOWS_PHONE;
		Global.canTouch = true;
	} else if (n.indexOf(SystemType.OS_BLACK_BERRY) > 0) {
		Global.os = SystemType.OS_BLACK_BERRY;
		Global.canTouch = true;
	}
	
	Global.isQQBrowser=(/qqbrowser/i).test(n);
	Global.isWebKit = (/webkit/i).test(n);
	Global.isOpera = (/opera/i).test(n);
	Global.isIE = (/msie/i).test(n);
	Global.isFirefox = (/firefox/i).test(n);
	Global.isChrome = (/chrome/i).test(n);
	Global.isSafari = (/safari/i).test(n) && !Global.isChrome;
	Global.cssPrefix = Global.isWebKit ? "webkit" : Global.isFirefox ? "Moz" : Global.isOpera ? "O" : Global.isIE ? "ms" : "";
	
	Global.supportStorage = "localStorage" in window;
	Global.supportOrientation = "orientation" in window;
	Global.supportDeviceMotion = "ondevicemotion" in window;
	Global.supportTouch = "ontouchstart" in window;
	
	Global.supportCanvas = document.createElement("canvas").getContext != null;
	Global.useCanvas=Global.supportCanvas;
	
	var testElem = document.createElement("div");
    Global.supportTransform = (testElem.style[Global.cssPrefix + "Transform"] != undefined);
    Global.supportSVG = (!! document.createElementNS && !! document.createElementNS('http://www.w3.org/2000/svg','svg').createSVGRect);
    Global.language = navigator.language || navigator.browserLanguage || navigator.systemLanguage || navigator.userLanguage || "";
    if(!StringUtil.isEmpty(Global.language)) WordUtil.language=WordUtil.format(Global.language);
}

Global.setup(navigator.userAgent);

Global.reszie=function(w,h)
{
	Global.width=w=Math.floor(w);
	Global.height=h=Math.floor(h);
	
	if(Global.div){
		Global.div.style.height=h + "px";
		Global.div.style.width=w + "px";
	}
	
	if(Global.canvas){
		Global.canvas.width=w;
    	Global.canvas.height=h;
	}
	
	if(Stage.current && Global.autoShapeSize){
		Stage.current.dispatchEvent(Factory.c("ev",[StageEvent.UPDATE]));
	}
}

/**
 * 获得屏幕分辨率的宽
 */
Global.getScreenWidth=function()
{
	return window.screen.width;
}

/**
 * 获得屏幕分辨率的高
 */
Global.getScreenHeight=function()
{
	return window.screen.height;
}


/*
 * 获得页面参数
 */
Global.GetQueryString=function(name)
{
     var reg = new RegExp("(^|&)"+ name +"=([^&]*)(&|$)");
     var r = window.location.search.substr(1).match(reg);
     if(r!=null)return  unescape(r[2]); return null;
}

/**
 * 调试输出
 */
Global.trace=function()
{
	if(!Global.debug) return;
	
	var str="";
	var i;
	
	for(i=0; i<arguments.length;i++){
		str+=arguments[i]+" ";
	}
	
	if(console != undefined && typeof console.log == "function" && !Global.htmlDebug){
		console.log(str);
	}else{
		if(Global.output==undefined) {
			Global.output = document.createElement("div");
			Global.output.style.position="absolute";
			Global.output.style.zIndex=Global.layer+10;
			Global.output.style.height=Math.ceil((Global.canvas ? Global.canvas.height : window.innerHeight)*0.5)+"px";
			Global.output.style.width=Math.ceil((Global.canvas ? Global.canvas.width: window.innerWidth)*0.5)+"px";
			Global.output.style.fontSize=Global.fontSize+"px";
			Global.output.style.color="#880000";
			Global.output.style.left="3px";
		}
		
		if(Global.output_list==undefined) Global.output_list=[];
		Global.output_list.push("<br>"+str+"</br>");
		if(Global.output_list.length>12) Global.output_list.shift();
		Global.output.innerHTML=Global.output_list.join(" ");
		
		if(Global.output.parentNode==undefined){
			if(Global.div){
				Global.output.style.position="relative";
				Global.div.appendChild(Global.output);
			}else{
				document.body.appendChild(Global.output);
			}
		}    
	}
}

/*
@param object Object 代理对象
@param target Object 代理目标
@param property String 目标属性
@param property String 代理属性
*/
Global.proxy=function(o,t,p,d)
{
	o[p]=function()
	{
		return t[p].apply(t, arguments) || o;
	}
	
	d && (o[d]=o[p]);
}

var emptyConstructor = function() {};

Global.inherit=function(childClass, parentClass,attributes) 
{
  	emptyConstructor.prototype = parentClass.prototype;
  	childClass.superClass = parentClass.prototype;
  	childClass.prototype = new emptyConstructor();
  	childClass.prototype.constructor = childClass;
	
	if(attributes==undefined || attributes==null) return;
	for (var i in attributes){
		childClass.prototype[i]=attributes[i];
	}
}

/**
 * 改变func函数的作用域scope，即this的指向。
 * @param {Function} func 要改变函数作用域的函数。
 * @param {Object} self 指定func函数的作用对象。
 * @return {Function} 一个作用域为参数self的功能与func相同的新函数。
 */
Global.delegate = function(func, self)
{
	var context = self || window;
  	if (arguments.length > 2) 
  	{
    	var args = Array.prototype.slice.call(arguments, 2);    	
    	return function() 
    	{
      		var newArgs = Array.prototype.concat.apply(args, arguments);
      		return func.apply(context, newArgs);
    	};
  	}else 
  	{
    	return function() {return func.apply(context, arguments);};
  	}
};

Global._gc_list=["StageEvent","Event","DisplayObjectContainer","Graphics","DisplayObject","DOMDisplay","MovieClip","DOMMovie","Matrix","Source","Effect","BoxShape"];

Global.gc=function(obj)
{
	var type=ClassUtil.getQualifiedClassName(obj);
	if(Global._gc_list.indexOf(type)==-1) return false;
	return ObjectPool.remove(obj);
}

Global.local=function()
{
	var local=window.localStorage;
	local=(local==undefined || local==null) ? window.sessionStorage : local;
	
	if(local==undefined || local==null){
		if(Global.__local_cache==undefined) {
			Global.__local_cache={};
			Global.__local_cache._cache={};
			Global.__local_cache.setItem=function(label,data){Global.__local_cache._cache[label]=data};
			Global.__local_cache.getItem=function(label){ return Global.__local_cache._cache[label]};
		    Global.__local_cache.clear=function(){Global.__local_cache._cache={}};
		}
		
		local = Global.__local_cache;
	}
	
	return local;
}

Global.copy = function(a, b, d, f) 
{
	if (typeof a != "object") return a;
	var c = a.valueOf();
	if (a != c) return new a.constructor(c);
	if (a instanceof a.constructor && a.constructor !== Object) {
		var c = b ? ObjectPool.create(b) : Global.clone(a.constructor.prototype),
			e;
			
		for (e in a){
			if(!f && typeof(a[e])=="function") continue;
			if (b || a.hasOwnProperty(e)) c[e] = a[e]
		}
			
	} else
		for (e in c = {}, a) c[e] = a[e]; if (d)
		for (e in d) c[e] = d[e];
	return c
}

Global.clone = function(a) 
{
	Global._cloneFunc.prototype = a;
	return new Global._cloneFunc
}

Global._cloneFunc = function() {}

if(window.trace == undefined) window.trace = Global.trace;
//----------------------------------------- BitmapFont -----------------------------------------


function BitmapFont()
{
	this.name;
	this.info={};
	this.common={};
	this.chars,this.pages,this.images;
	
	BaseObject.call(this);
}

Global.inherit(BitmapFont, BaseObject);

BitmapFont.prototype.dispose=function()
{
	if(this.chars && this.chars.length>0){
		var i,l;
		for(i=0,l=this.chars.length;i<l;i++){
			ObjectPool.remove(this.chars[i]);
		}
	}
	
	delete this.name,this.info,this.common,this.chars,this.pages,this.images;
}

//----------------------------------------- Event -----------------------------------------

/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
Event Class
===================================================================
**/

function Event(type,params,label,target)
{
	this.setup(type,params,label,target);
}

Event.PLAY_OVER="play_over";
Event.COMPLETE="complete";
Event.RESIZE="resize";
Event.ERROR="error";
Event.CLOSE="close";
Event.INIT="init";

Event.prototype.setup=function(type,params,label,target)
{
	this.type   = type;
	this.label  = label;
	this.params = params;
	this.target = target;
}

Event.prototype.clone=function()
{
	return Factory.c("ev",[this.type,this.params,this.label,this.target]);
}

Event.prototype.reset=function()
{
	ObjectUtil.clearAttribute(this,["type","label","params","target"],["setup","clone","reset","dispose","toString"]);
	this.type=this.label=this.params=this.target=null;
}

Event.prototype.dispose=function()
{
	this.reset();
	delete this.type, this.target, this.params,this.label;
}

Event.prototype.toString=function()
{
	return '{"type":' + this.type + ',label":' + this.label ? this.label.toString() :'' + ',"target":' +this.target ? this.target.toString() : ''+ ',"params":' +this.params ? this.params.toString() :''+'}';
}


//----------------------------------------- EventDispatcher -----------------------------------------

/**
Shine Chen 
s_c@live.com 2015/05/04

===================================================================
EventDispatcher Class
===================================================================
**/

function EventDispatcher()
{
	this.caches=null;
	this.listeners={};
}

EventDispatcher.prototype.reset=function()
{
	this.caches=null;
	this.listeners={};
}

EventDispatcher.prototype.hasEventListener=function(eventType,id)
{
	if(!StringUtil.isEmpty(id) && this.caches){
		return (this.caches[eventType+"#"+id]!=undefined);
	}
	
	return (this.listeners && this.listeners[eventType] != undefined);
}

EventDispatcher.prototype.addEventListener=function(eventType, func,id)
{
	if(!(typeof eventType=="string" && typeof func=="function")) return;
	if(!StringUtil.isEmpty(id) && this.hasEventListener(eventType,id)) return;
	
	if(this.listeners[eventType] == undefined) this.listeners[eventType]=[];
	if(this.listeners[eventType].indexOf(func)==-1) this.listeners[eventType].push(func);
	
	if(id){
		this.caches=this.caches || {};
		this.caches[eventType+"#"+id]=func;
	}
}

EventDispatcher.prototype.removeEventListener=function(eventType, func,id)
{
	if(this.listeners==undefined || this.listeners[eventType] == undefined) return;
	
	if(func==undefined){
		if(StringUtil.isEmpty(id) || this.caches==undefined){
			delete this.listeners[eventType];
			return;
		}
		
		func=this.caches[eventType+"#"+id];
		delete this.caches[eventType+"#"+id];
	}
	
	if(ObjectUtil.getType(func)!="function") return;
	
	var len=this.listeners[eventType].length;
	for(var i=0; i<len ;i++)
	{
		var sub_func=this.listeners[eventType][i];
		if(sub_func==func){
			this.listeners[eventType].splice(i, 1);
			len--;
			i--;
			break;
		}
	}
	
	if(this.listeners[eventType].length==0) {
		delete this.listeners[eventType];
		if(this.caches==undefined) return;
		
		for (var i in this.caches){
			if(i.indexOf(eventType)==0) delete this.caches[i];
		}
	}
}

EventDispatcher.prototype.dispatchEvent=function(eventObj)
{
	var list=this.listeners;
	if(eventObj== undefined || !eventObj.hasOwnProperty("type") || list==undefined || list[eventObj.type] == undefined) {
//		if(eventObj && !Global.gc(eventObj)){
//			try{
//				eventObj.dispose();
//			}
//			catch(e){}
//		}
		return;
	}
	
	if(eventObj.target==null) eventObj.target=this;

	var arr=list[eventObj.type].slice();
	
	for(var i in arr)
	{
		arr[i].call(this,eventObj);
	}
	
//	if(!Global.gc(eventObj)){
//		try{
//			eventObj.dispose();
//		}
//		catch(e){}
//	}
}

EventDispatcher.prototype.dispose=function()
{
	this.caches=null;
	if(this.listeners==undefined) return;
	for(var type in this.listeners) delete this.listeners[type];
	delete this.listeners,this.caches;
}

EventDispatcher.prototype.toString=function()
{
	return '{"listeners":'+ObjectUtil.toString(this.listeners)+'}';
}
//----------------------------------------- MovieManager -----------------------------------------


MovieManager={}

MovieManager._dic={}
MovieManager._cache={}

/**
 * 添加动画资源列表
 * @param {Array} sources
 */
MovieManager.addSources=function(sources)
{
	if(sources==null || sources.length<1) return;
	var i,len,source;
	var asset=[];
	
	for(i=0,len=sources.length;i<len;i++){
		source=sources[i];
		
		if(source.width==0){
			asset.push(source);
			continue;
		}
		
		if(!MovieManager._dic.hasOwnProperty(source.animation)){
			MovieManager._dic[source.animation]=StringUtil.isEmpty(source.label) ? [] : {};
		    MovieManager._cache[source.animation]=[];
		}
		
		if(!StringUtil.isEmpty(source.label) && !(MovieManager._dic[source.animation]).hasOwnProperty(source.label)){
			(MovieManager._dic[source.animation])[source.label]=[];
			MovieManager._cache[source.animation].push(source.label);
		}
		
		(!StringUtil.isEmpty(source.label) ? (MovieManager._dic[source.animation])[source.label] : MovieManager._dic[source.animation]).push(source);
	}
	
	if(asset.length>0) AssetManager.addSources(asset);
}

MovieManager.getInstance=function(label,animation,dom,length,begin)
{
	var mc=Factory.c("mc",null,dom);
	var frames=MovieManager.getData(label,animation);
	
	if(length!=undefined || begin!=undefined){
		length=(length==null) ? frames.length : Math.min(frames.length,Math.abs(length));
		begin=(begin==null) ? 0 : MathUtil.clamp(begin,0,length);
		frames=frames.slice(begin,length);
	}
	
	mc.setFrames(frames);
	return mc;
}

MovieManager.getData=function(label,animation)
{
	animation=animation || "";
	
	if(!StringUtil.isEmpty(label) && !StringUtil.isEmpty(animation) && MovieManager._dic.hasOwnProperty(animation)) 
		return (MovieManager._dic[animation])[label];
	
	animation=StringUtil.isEmpty(animation) ? "" : animation;
	
	var temp=MovieManager._dic[animation];
	if(temp==null || temp instanceof Array) return temp;
	
	label=StringUtil.isEmpty(label) ? ObjectUtil.getLabels(temp)[0] : label;
	var datas=MovieManager._dic[animation][label];
	if(datas==undefined || datas==null) return null;
	
	return datas;
}

MovieManager.removeData=function(label,animation)
{
	animation=animation || "";
	if(!StringUtil.isEmpty(label) && !StringUtil.isEmpty(animation)) {
		delete (MovieManager._dic[animation])[label];
		return;
	} 
	
	animation=StringUtil.isEmpty(animation) ? ObjectUtil.getLabels(MovieManager._cache)[0] : animation;
	
	var temp=MovieManager._dic[animation];
	if(temp==undefined) return;
	
	if(StringUtil.isEmpty(label)) {
		delete MovieManager._dic[animation];
		delete MovieManager._cache[animation];
		return;
    }
	
	delete (MovieManager._dic[animation])[label];
}

MovieManager.clear=function()
{
	MovieManager._dic={};
    MovieManager._cache={};
}

//----------------------------------------- BlurFilter -----------------------------------------

function BlurFilter (radius)
{
	this.mul_table = [ 512, 512, 456, 512, 328, 456, 335, 512, 405, 328, 271, 456, 388, 335, 292, 512, 454, 405, 364, 328, 298, 271, 496, 456, 420, 388, 360, 335, 312, 292, 273, 512, 482, 454, 428, 405, 383, 364, 345, 328, 312, 298, 284, 271, 259, 496, 475, 456, 437, 420, 404, 388, 374, 360, 347, 335, 323, 312, 302, 292, 282, 273, 265, 512, 497, 482, 468, 454, 441, 428, 417, 405, 394, 383, 373, 364, 354, 345, 337, 328, 320, 312, 305, 298, 291, 284, 278, 271, 265, 259, 507, 496, 485, 475, 465, 456, 446, 437, 428, 420, 412, 404, 396, 388, 381, 374, 367, 360, 354, 347, 341, 335, 329, 323, 318, 312, 307, 302, 297, 292, 287, 282, 278, 273, 269, 265, 261, 512, 505, 497, 489, 482, 475, 468, 461, 454, 447, 441, 435, 428, 422, 417, 411, 405, 399, 394, 389, 383, 378, 373, 368, 364, 359, 354, 350, 345, 341, 337, 332, 328, 324, 320, 316, 312, 309, 305, 301, 298, 294, 291, 287, 284, 281, 278, 274, 271, 268, 265, 262, 259, 257, 507, 501, 496, 491, 485, 480, 475, 470, 465, 460, 456, 451, 446, 442, 437, 433, 428, 424, 420, 416, 412, 408, 404, 400, 396, 392, 388, 385, 381, 377, 374, 370, 367, 363, 360, 357, 354, 350, 347, 344, 341, 338, 335, 332, 329, 326, 323, 320, 318, 315, 312, 310, 307, 304, 302, 299, 297, 294, 292, 289, 287, 285, 282, 280, 278, 275, 273, 271, 269, 267, 265, 263, 261, 259 ];
    this.shg_table = [ 9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];
    this._radius = radius;
    this._has_update =true;
}

Object.defineProperty(BlurFilter.prototype,"radius",{
	get: function () {
        return this._radius;
    },

    set: function (value) {
        if(this._radius==value) return;
	
		this._radius=MathUtil.int(value);
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(BlurFilter.prototype,"update",{
	get: function () {
        return this._has_update;
    },

    set: function (value) {
		this._has_update=value;
    },
    enumerable: true,
    configurable: true
});

BlurFilter.prototype.show=function(context,width,height)
{
	if (isNaN(this._radius) || this._radius < 1 || context==undefined || width<1 || height<1 || !this._has_update) return;
	var imageData;
	
	try {
        imageData = context.getImageData(0, 0, width, height);
    } catch (e) {
    	trace("[BlurFilter] unable to access local image data: " + e);
    	return;
    }
    
    var pixels = imageData.data;
    var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, r_out_sum, g_out_sum, b_out_sum, a_out_sum, r_in_sum, g_in_sum, b_in_sum, a_in_sum, pr, pg, pb, pa, rbs;
    var div = this._radius + this._radius + 1;
    var w4 = width << 2;
    var widthMinus1 = width - 1;
    var heightMinus1 = height - 1;
    var radiusPlus1 = this._radius + 1;
    var sumFactor = radiusPlus1 * (radiusPlus1 + 1) / 2;
    var stackStart = new BlurStack();
    var stack = stackStart;
    
    for (i = 1; i < div; i++) {
        stack = stack.next = new BlurStack();
        if (i == radiusPlus1) var stackEnd = stack;
    }
    stack.next = stackStart;
    
    var stackIn = null;
    var stackOut = null;
    yw = yi = 0;
    
    var mul_sum = this.mul_table[this._radius];
    var shg_sum = this.shg_table[this._radius];
    
    for (y = 0; y < height; y++) {
        r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        for (i = 1; i < radiusPlus1; i++) {
            p = yi + ((widthMinus1 < i ? widthMinus1 : i) << 2);
            r_sum += (stack.r = pr = pixels[p]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[p + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[p + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[p + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
        }
        stackIn = stackStart;
        stackOut = stackEnd;
        for (x = 0; x < width; x++) {
            pixels[yi + 3] = pa = a_sum * mul_sum >> shg_sum;
            if (pa != 0) {
                pa = 255 / pa;
                pixels[yi] = (r_sum * mul_sum >> shg_sum) * pa;
                pixels[yi + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                pixels[yi + 2] = (b_sum * mul_sum >> shg_sum) * pa;
            } else {
                pixels[yi] = pixels[yi + 1] = pixels[yi + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p = yw + ((p = x + this._radius + 1) < widthMinus1 ? p : widthMinus1) << 2;
            r_in_sum += stackIn.r = pixels[p];
            g_in_sum += stackIn.g = pixels[p + 1];
            b_in_sum += stackIn.b = pixels[p + 2];
            a_in_sum += stackIn.a = pixels[p + 3];
            r_sum += r_in_sum;
            g_sum += g_in_sum;
            b_sum += b_in_sum;
            a_sum += a_in_sum;
            stackIn = stackIn.next;
            if(stackOut==undefined) continue;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += 4;
        }
        yw += width;
    }
    for (x = 0; x < width; x++) {
        g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
        yi = x << 2;
        r_out_sum = radiusPlus1 * (pr = pixels[yi]);
        g_out_sum = radiusPlus1 * (pg = pixels[yi + 1]);
        b_out_sum = radiusPlus1 * (pb = pixels[yi + 2]);
        a_out_sum = radiusPlus1 * (pa = pixels[yi + 3]);
        r_sum += sumFactor * pr;
        g_sum += sumFactor * pg;
        b_sum += sumFactor * pb;
        a_sum += sumFactor * pa;
        stack = stackStart;
        for (i = 0; i < radiusPlus1; i++) {
            stack.r = pr;
            stack.g = pg;
            stack.b = pb;
            stack.a = pa;
            stack = stack.next;
        }
        yp = width;
        for (i = 1; i <= this._radius; i++) {
            yi = yp + x << 2;
            r_sum += (stack.r = pr = pixels[yi]) * (rbs = radiusPlus1 - i);
            g_sum += (stack.g = pg = pixels[yi + 1]) * rbs;
            b_sum += (stack.b = pb = pixels[yi + 2]) * rbs;
            a_sum += (stack.a = pa = pixels[yi + 3]) * rbs;
            r_in_sum += pr;
            g_in_sum += pg;
            b_in_sum += pb;
            a_in_sum += pa;
            stack = stack.next;
            if (i < heightMinus1) {
                yp += width;
            }
        }
        yi = x;
        stackIn = stackStart;
        stackOut = stackEnd;
        for (y = 0; y < height; y++) {
            p = yi << 2;
            pixels[p + 3] = pa = a_sum * mul_sum >> shg_sum;
            if (pa > 0) {
                pa = 255 / pa;
                pixels[p] = (r_sum * mul_sum >> shg_sum) * pa;
                pixels[p + 1] = (g_sum * mul_sum >> shg_sum) * pa;
                pixels[p + 2] = (b_sum * mul_sum >> shg_sum) * pa;
            } else {
                pixels[p] = pixels[p + 1] = pixels[p + 2] = 0;
            }
            r_sum -= r_out_sum;
            g_sum -= g_out_sum;
            b_sum -= b_out_sum;
            a_sum -= a_out_sum;
            r_out_sum -= stackIn.r;
            g_out_sum -= stackIn.g;
            b_out_sum -= stackIn.b;
            a_out_sum -= stackIn.a;
            p = x + ((p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1) * width << 2;
            r_sum += r_in_sum += stackIn.r = pixels[p];
            g_sum += g_in_sum += stackIn.g = pixels[p + 1];
            b_sum += b_in_sum += stackIn.b = pixels[p + 2];
            a_sum += a_in_sum += stackIn.a = pixels[p + 3];
            stackIn = stackIn.next;
            if(stackOut==undefined) continue;
            r_out_sum += pr = stackOut.r;
            g_out_sum += pg = stackOut.g;
            b_out_sum += pb = stackOut.b;
            a_out_sum += pa = stackOut.a;
            r_in_sum -= pr;
            g_in_sum -= pg;
            b_in_sum -= pb;
            a_in_sum -= pa;
            stackOut = stackOut.next;
            yi += width;
        }
    }
    context.putImageData(imageData, 0, 0);
    this._has_update=false;
}

function BlurStack() {
    this.r = 0;
    this.g = 0;
    this.b = 0;
    this.a = 0;
    this.next = null;
}
//----------------------------------------- DropShadowFilter -----------------------------------------


function DropShadowFilter (distance, angle, blur, color, alpha, radius)
{
	this.shadowColor = (color==undefined) ? ColorUtil.formatColor(color) : "#000000";
	this.distance = (distance==undefined) ? distance : 0;
	this.shadowBlur = (blur==undefined) ? blur : 20;
	this.radius = (radius==undefined) ? radius : 0;
	this.angle = (angle==undefined) ? angle : 0;
	this.alpha = (alpha==undefined) ? alpha : 1;
	this.setShadowOffset();
}

DropShadowFilter.prototype.setDistance = function (distance) 
{
	this.distance = distance;
	this.setShadowOffset();
}

DropShadowFilter.prototype.setShadowOffset=function()
{
	var r=MathUtil.getRadiansFromDegrees(this.angle);
	this.shadowOffsetX = MathUtil.format(this.distance * Math.cos(r));
	this.shadowOffsetY = MathUtil.format(this.distance * Math.sin(r));
}

DropShadowFilter.prototype.show=function(context)
{
	if(context==undefined) return;
	var color=(this.alpha<1) ? ColorUtil.colorToRGBA(this.shadowColor,this.alpha) : this.shadowColor;
	
	if(ClassUtil.getQualifiedClassName(context)=="CanvasRenderingContext2D"){
		if(this.distance==0 && this.shadowBlur==0) return;
		context.shadowOffsetX = this.shadowOffsetX;
		context.shadowOffsetY = this.shadowOffsetY;
		context.shadowBlur    = this.shadowBlur;
		context.shadowColor   = color;
	}
	else{
		var text_type=ClassUtil.getQualifiedClassName(context);
		var text_bool=(text_type=="HTMLParagraphElement" || text_type=="HTMLInputElement" || text_type=="HTMLTextAreaElement");
		var shadow_property=Global.cssPrefix+(text_bool ? 'TextShadow' : 'BoxShadow');
		context.style[Global.cssPrefix+"BorderRadius"]=this.radius+ 'px';
		context.style[shadow_property]=this.shadowOffsetX + 'px ' + this.shadowOffsetY + 'px ' + this.shadowBlur + 'px '+color;
	}
}

DropShadowFilter.prototype.clone=function()
{
	return new DropShadowFilter (this.distance, this.angle, this.color, this.blur,this.alpha,this.radius);
}

//----------------------------------------- AssetManager -----------------------------------------

AssetManager={};

AssetManager._cache={};

AssetManager.addFiles=function(files)
{
	if(files==null) return;
	var i,f,x,s,j,b;
	
	for(i in files){
		f=files[i];
		j=i.split("@")[0];
		if(f==undefined) continue;
		
		if(f instanceof Image){
			if(files.hasOwnProperty(j+"@xml") || files.hasOwnProperty(j+"@json")){
				
				b=files.hasOwnProperty(j+"@xml");
				x=files[j+(b ? "@xml" : "@json")];
				
				if(x==undefined) {
					AssetManager._cache[i]=f;
					continue;
				}
				
				s=AssetUtil.parseSheet(f,x,b);
				if(s==undefined || s.length<=0) {
					AssetManager._cache[i]=f;
					continue;
				}
				
				if(b){
					if(AssetManager._cache.hasOwnProperty(j+"@xml")){
						delete AssetManager._cache[j+"@xml"];
					}
				}
				else{
					if(AssetManager._cache.hasOwnProperty(j+"@json")){
						delete AssetManager._cache[j+"@json"];
					}
				}
				
				if(s[0].width>0) MovieManager.addSources(s);
				else             AssetManager.addSources(s);
			}
			else AssetManager._cache[i]=f;
		}
		else if(String(i.split("@")[1]).toLowerCase()=="fnt"){
			s=AssetUtil.parseFont(f);
			if(s==undefined)continue;
			FontManager.add(s);
		}
		else if(f instanceof URLLoader){
			AssetManager._cache[i]=f.content;
		}
		else AssetManager._cache[i]=f;
	}
}

AssetManager.addSources=function(sources)
{
	if(sources==null || sources.length<1) return;
	var i,len,source;
	var movie=[];
	
	for(i=0,len=sources.length;i<len;i++){
		source=sources[i];
		if(source==undefined || !(source instanceof Source)) continue;
		
		if(source.width>0) {
			movie.push(source);
			continue;
		}
		
		AssetManager._cache[source.name]=source;
	}
	
	if(movie.length>0) MovieManager.addSources(movie);
}

AssetManager.getSource=function(label)
{
	if(!AssetManager._cache.hasOwnProperty(label)) return null;
    var source=AssetManager._cache[label];
    
    if(source==undefined){
    	source=MovieManager.getData(label);
    	source=(source.length==1) ? source[0] : null;              
    }
    
	return source;
}

AssetManager.removeSource=function(label)
{
	if(!AssetManager._cache.hasOwnProperty(label)) return;
	if(typeof AssetManager._cache[label].dispose=="function") AssetManager._cache[label].dispose();
	delete AssetManager._cache[label];
}

AssetManager.clear=function()
{
	AssetManager._cache={};
}

//----------------------------------------- Address -----------------------------------------

/**
===================================================================
Address Class
===================================================================
**/

function Address()
{
	EventDispatcher.call(this);
	this.name="address_handler";
	this._target=this._onHashChange,this._value=null;
}

Global.inherit(Address,EventDispatcher);

Object.defineProperty(Address.prototype,"target",{
	get: function (){
		return this._target;
	},
    set: function (value) {
    	if(value && value==this._target) return;
    	
    	if(this._onHashChange==undefined){
    		this._onHashChange=Global.delegate(this._hashChangeHandler,this);
    	}
    	
    	if(this._target){
    		this._target.removeEventListener("hashchange",this._onHashChange);
    	}
    	
		this._target=value;
		if(value==undefined) return;
		this._target.addEventListener("hashchange",this._onHashChange);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Address.prototype,"value",{
	get: function (){
		if(this._value==undefined) this._value=window.location.hash.replace("#","");
		return this._value;
	},
    set: function (value) {
    	if(value==undefined || value==this._value) return;
    	this._value=value;
    	window.location.hash=value;
    },
    enumerable: true,
    configurable: true
});	

Address.prototype._hashChangeHandler=function()
{
	var str=window.location.hash.replace("#","");
	if(str==this._value) return;
	
	this._value=str;
	this.dispatchEvent(Factory.c("ev",[Address.CHANGE,this._value]));
}

Address.prototype.dispose=function()
{
	this.target=null;
	this._onHashChange=this._value=null;
	Address.superClass.dispose.call(this);
	delete this._target,this._onHashChange,this._value,this.name;
}

Address.CHANGE="addressValueChange";

Address._instance;
Address.getInstance=function()
{
	if(Address._instance) return Address._instance;
	Address._instance=new Address();
	Address._instance.target=window;
	return Address._instance;
}

//----------------------------------------- BlendMode -----------------------------------------

function BlendMode () 
{
	throw "BlendMode cannot be instantiated";
}

/**
 * 新图形绘制于已有图形的顶部。这是默认的行为。
 */
BlendMode.SOURCE_OVER = "source-over";

/**
 * 只有在新图形和已有内容重叠的地方，才绘制新图形。
 */
BlendMode.SOURCE_ATOP = "source-atop";

/**
 * 在新图形以及已有内容重叠的地方，新图形才绘制。所有其他内容成为透明。
 */
BlendMode.SOURCE_IN = "source-in";

/**
 * 只有在和已有图形不重叠的地方，才绘制新图形。
 */
BlendMode.SOURCE_OUT = "source-out";

/**
 * 新图形绘制于已有内容的后面。
 */
BlendMode.DESTINATION_OVER = "destination-over";

/**
 * 已有的内容只有在它和新的图形重叠的地方保留。新图形绘制于内容之后。
 */
BlendMode.DESTINATION_ATOP = "destination-atop";

/**
 * 在新图形以及已有画布重叠的地方，已有内容都保留。所有其他内容成为透明的。
 */
BlendMode.DESTINATION_IN = "destination-in";

/**
 * 在已有内容和新图形不重叠的地方，已有内容保留。所有其他内容成为透明。
 */
BlendMode.DESTINATION_OUT = "destination-out";

/**
 * 在图形重叠的地方，颜色由两种颜色值的加值来决定。
 */
BlendMode.LIGHTER = "lighter";

/**
 * 在图形重叠的地方，其颜色由两个颜色值相减后决定
 */
BlendMode.DARKER = "darker";

/**
 * 只绘制新图形，删除其他所有内容。
 */
BlendMode.COPY = "copy";

/**
 * 在重叠和正常绘制的其他地方，图形都成为透明的。
 */
BlendMode.XOR = "xor";

/**
 * 不使用混合模式。
 */
BlendMode.NONE = null;

//----------------------------------------- ColorTransform -----------------------------------------

/**
===================================================================
ColorTransform Class
===================================================================
**/

function ColorTransform (redMultiplier, greenMultiplier, blueMultiplier, alphaMultiplier, redOffset, greenOffset, blueOffset, alphaOffset)
{
	this.redMultiplier = redMultiplier;
	this.greenMultiplier = greenMultiplier;
	this.blueMultiplier = blueMultiplier;
	this.alphaMultiplier = alphaMultiplier;
	this.redOffset = redOffset;
	this.greenOffset = greenOffset;
	this.blueOffset = blueOffset;
	this.alphaOffset = alphaOffset;
	
	this._update=true;
}

Object.defineProperty(ColorTransform.prototype,"update",{
	get: function () {
		var bool=this._update;
		if(this._update) this._update=false;
        return bool;
    },

    set: function (value) {
        if(this._update==value) return;
		this._update=value;
    },
    enumerable: true,
    configurable: true
});

ColorTransform.prototype.setColor=function(color,add)
{
	add=add || 0;
	color=ColorUtil.toColor(color);
	this.redMultiplier=this.greenMultiplier=this.blueMultiplier=this.alphaMultiplier=add;
	
	this.redOffset   = ColorUtil.getRed(color);
	this.greenOffset = ColorUtil.getGreen(color);
	this.blueOffset  = ColorUtil.getBlue(color);
	this.alphaOffset = ColorUtil.getAlpha(color);
	this._update=true;
}

ColorTransform.prototype.toString = function()
{
	return '{"redOffset":'+this.redOffset+',"greenOffset":'+this.greenOffset+',"blueOffset":'+this.blueOffset+',"alphaOffset":'+this.alphaOffset+
	       ',"redMultiplier":'+this.redMultiplier+',"greenMultiplier":'+this.greenMultiplier+',"blueMultiplier":'+this.blueMultiplier+',"alphaMultiplier":'+this.alphaMultiplier+'}';
}
//----------------------------------------- FontManager -----------------------------------------


FontManager={}
FontManager._cache={};

/**
 * 添加位图字体资源
 * @param {BitmapFont} font
 */
FontManager.add=function(font)
{
	if(font==undefined || font==null) return;
	
	FontManager.remove(font.name);
	FontManager._cache[font.name]=font;
}

/**
 * 删除位图字体资源
 * @param {String} name
 */
FontManager.remove=function(name)
{
	if(!FontManager._cache.hasOwnProperty(name)) return;
	FontManager._cache[name].dispose();
	delete FontManager._cache[name];
}

/**
 * 是否含有对应名称的位图字体资源
 * @param {String} name
 */
FontManager.has=function(name)
{
	return (!StringUtil.isEmpty(name) && FontManager._cache[name]!=undefined);
}

/**
 * 获取位图字体资源
 * @param {String} name
 * @param {Number} charCode
 */
FontManager.get=function(name,charCode)
{
	if(StringUtil.isEmpty(name)){
		for(name in FontManager._cache) break;
	}
	
	if(StringUtil.isEmpty(name)) return null;
	if(charCode==undefined || charCode<0) return FontManager._cache[name];
	
	return FontManager._cache[name].chars[charCode];
}

/**
 * 清除所有位图字体资源
 */
FontManager.clear=function()
{
	var i;
	
	for(i in FontManager._cache){
		FontManager._cache[i].dispose();
		delete FontManager._cache[i];
	}
}

//----------------------------------------- Timer -----------------------------------------

/**
===================================================================
Timer Class
===================================================================
**/

function Timer(r)
{
	EventDispatcher.call(this);
	
	this._start_time=0;
	this._is_start=false;
	this._interval_id=null;
	this._frame_rate=(r==undefined) ? Timer.fps : r;
}

Global.inherit(Timer,EventDispatcher);
Timer.TIME="time";
Timer.fps=30;

Timer.prototype.setFrameRate=function(rate)
{
	this._frame_rate=rate;
	if(this._is_start) this.start();
}

Timer.prototype.getFrameRate=function()
{
	return this._frame_rate;
}

Timer.prototype.isStart=function()
{
	return this._is_start;
}

Timer.prototype._onTimeHandler=function()
{
	this.dispatchEvent(Factory.c("ev",[Timer.TIME]));
}

Timer.prototype.start=function()
{
	if(this._frame_rate<=0) return;
	if(this._interval_id!=null) clearInterval(this._interval_id);
	this._interval_id=setInterval(Global.delegate(this._onTimeHandler,this),1000/this._frame_rate);
    this._start_time=(new Date()).getTime();
    this._is_start=true;
}

Timer.prototype.stop=function()
{
	if(this._interval_id!=null) clearInterval(this._interval_id);
	this._interval_id=null;
	this._is_start=false;
	this._start_time=0;
}

Timer.prototype.dispose=function()
{
	Timer.superClass.dispose.call(this);
	stop();
	delete this._start_time,this._interval_id,this._frame_rate,this._is_start;
}

Timer.prototype.toString=function()
{
	return "Timer";
}

Timer.delayCall=function(second,callback,params,target)
{
	if(second<=0 || callback==undefined) return;
	
	var id=setInterval(function(){
		clearInterval(id);
		callback.apply(target,params);
	},1000*second);
}

//----------------------------------------- Source -----------------------------------------

/**
===================================================================
Source Class
===================================================================
**/

function Source(img,obj)
{
	if(obj) this.setup(img,obj);
}

Source.prototype.setup=function (img,obj,isJson)
{
	isJson=(isJson==true);
	
	var bool=isJson ? !(obj.sourceSize.w==obj.spriteSourceSize.w && obj.sourceSize.h==obj.spriteSourceSize.h) : false;
	var labels=String(isJson && obj.name.indexOf(".")>=0 ? StringUtil.replaceAll(obj.name,[".png",".jpg",".gif"],["","",""]) : obj.name).split("|");
	
	this.animation=labels.length>1 ? labels[0] : "";
	this.name=labels.length>1 ? labels[1] : labels[0];
	
	labels=StringUtil.getNumber(this.name);
	this.label=labels.length>0 ? labels[0] : "";
	this.index=labels.length>1 ? MathUtil.int(labels[1]) : 0;
	
	this.rect=new Rectangle(MathUtil.format(isJson ? obj.frame.x : obj.x),MathUtil.format(isJson ? obj.frame.y : obj.y),MathUtil.format(isJson ? obj.frame.w : obj.width),MathUtil.format(isJson ? obj.frame.h : obj.height));
	
	this.width=isJson ? (bool ? obj.sourceSize.w : 0) :(obj.hasOwnProperty("frameWidth") ? MathUtil.format(obj.frameWidth) : 0);
	this.height=isJson ? (bool ? obj.sourceSize.h : 0) :(obj.hasOwnProperty("frameHeight") ? MathUtil.format(obj.frameHeight) : 0);
	
	this.reg=new Point(MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.width>0 ? this.width : this.rect.width) : -obj.spriteSourceSize.x) : obj.frameX),MathUtil.format(isJson ? (obj.hasOwnProperty("pivot") ? Number(obj.pivot)*(this.height>0 ? this.height : this.rect.height) : -obj.spriteSourceSize.y) : obj.frameY));
	
	this.image=img || new Image();
	this.url=this.image.src;
	this.isClone=false;
}

Source.prototype.clone=function()
{
	var copy=ObjectPool.create(Source);
	copy.animation=this.animation;
	copy.name=this.name;
	copy.label=this.label;
	copy.index=this.index;
	copy.reg=this.reg.clone();
	copy.rect=this.rect.clone();
	copy.image=this.image;
	copy.width=this.width;
	copy.height=this.height;
	copy.url=this.url;
	copy.isClone=true;
	
	return copy;
}

Source.prototype.reset=function()
{
	this.name=this.animation=this.label=this.url=null;
	this.reg=this.rect=this.image=null;
	this.index=this.width=this.height=0;
	this.isClone=false;
}

Source.prototype.dispose=function()
{
	this.reset();
	delete this.name,this.animation,this.label,this.url,this.reg,this.rect,this.image,this.index,this.width,this.height,this.isClone;
}

Source.prototype.toString=function()
{
	var str="{";
	str+='"name":'+this.name+',';
	str+='"animation":'+this.animation+',';
	str+='"label":'+this.label+',';
	str+='"index":'+this.index+',';
	str+='"width":'+this.width+',';
	str+='"height":'+this.height+',';
	str+='"reg":'+this.reg.toString()+',';
	str+='"rect":'+this.rect.toString()+',';
	str+='"url":'+this.url;
	return str+"}";
}

//----------------------------------------- AssetUtil -----------------------------------------

AssetUtil={}

AssetUtil.parseSheet=function(image,data,isXML)
{
	return isXML ? AssetUtil._xml2sheet(image,data) : AssetUtil._json2sheet(image,data.content);
}

AssetUtil._xml2sheet=function(image,xml)
{
	if(image==null || xml==null) return;
	
	var array=[];
	
	var xmlDoc=xml.documentElement.childNodes;
	var source;
	var datas;
	var temp;
	var item;
	var len;
	
	var i;
	var j;
	
	for(i=0 ,len=xmlDoc.length; i<len;i++){
		
		datas=xmlDoc[i].attributes;
		if(datas==undefined || datas.length<=0) continue;
		
		temp={};
		for(j=0;j<datas.length;j++){
		 	item=datas[j];
		 	temp[item.nodeName]=item.value;
		}
		
		source=ObjectPool.create(Source);
		source.setup(image,temp);
		array.push(source);
	}
	
	return array;
}

AssetUtil._json2sheet=function(image,json)
{
	if(image==null || json==null) return;
	var i,str,temp,source,datas,old,array=[];
	
	for(str in json){
		if(str=="meta") continue;
		datas=json[str];
		
		for(i in datas){
			temp=datas[i];
			temp.name=i;
			
			source=ObjectPool.create(Source);
			source.setup(image,temp,true);

			if(source.width==0 && source.height==0 && !StringUtil.isEmpty(source.label) && old && source.label==old.label){
				
				source.height=source.rect.height;
				source.width=source.rect.width;
				
				if(old.width==0 && old.height==0){
					old.height=old.rect.height;
					old.width=old.rect.width;
				}
			}
			
			array.push(source);
			old=source;
		}
	}
	
	return array;
}

AssetUtil.parseFont=function(fnt)
{
	if(fnt==null) return null;
	
	var font=new BitmapFont();
	var xmlDoc=URLLoader.parseXML(fnt,"text/xml");
	var info=xmlDoc.getElementsByTagName("info")[0];
	var common=xmlDoc.getElementsByTagName("common")[0];
	var pnode=xmlDoc.getElementsByTagName("pages");
	
	if(pnode.length<=0) {
		if(xmlDoc.body) trace("[ERROR] AssetUtil.parseFont() "+xmlDoc.body.innerText);
		return null;
	}
	
	var pages=pnode[0].childNodes;
	var chars =xmlDoc.getElementsByTagName("chars")[0].childNodes;
	
	AssetUtil.copyAttributes(font.info,info);
	AssetUtil.copyAttributes(font.common,common);
	
	var source,data,i,str,index,obj,img,len=pages.length;
	font.info.size=Math.abs(font.info.size);
	font.name=font.info.face;
	
	font.chars={};
	font.pages=[];
	font.images=[];
	
	for(i=0 ; i<len;i++){
		data=pages[i];
		if(data.nodeName!="page") continue;
		
		index=Number(data.getAttribute("id"));
		str=data.getAttribute("file");
		if(StringUtil.isEmpty(str)) continue;
		font.pages[index]=str;
		
		str=Loader.getName(str);
		
		if(!StringUtil.isEmpty(str) && AssetManager._cache.hasOwnProperty(str)){
			font.images[index]=AssetManager._cache[str];
			delete AssetManager._cache[str];
		}else{
			trace("[ERROR] AssetUtil.parseFont can't find asset of "+str);
		}
	}
	
	for(i=0,len=chars.length; i<len;i++){
		data=chars[i];
		if(data.nodeName!="char") continue;
		
		obj=AssetUtil.copyAttributes({},data);
		obj.name=font.name+"|"+obj.xadvance+" "+obj.id;
		obj.frameX=-obj.xoffset;
		obj.frameY=-obj.yoffset;
		
		img=font.images[obj.page];
		if(img==undefined) continue;
		
		source=ObjectPool.create(Source);
		source.setup(img,obj);
		source.label=Number(source.label);
		font.chars[source.index]=source;
	}
	
	return font;
}

AssetUtil.copyAttributes=function(obj,node)
{
	var i,l,d,t,datas=node.attributes;
	
	for(i=0 ,l=datas.length; i<l;i++){
		d=datas[i];
		t=d.value;
		obj[d.name]=isNaN(t) ? t : Number(t);
	}
	
	return obj;
}

//----------------------------------------- Ajax -----------------------------------------

/**
 * =========================================
 *  Ajax Class
 * =========================================
 */

function Ajax()
{
	this.responseType = null;
	this._responseType= null;
}

Ajax.TEXT = "text";
Ajax.JSON = "json";
Ajax.BLOB = "blob";
Ajax.PROP = "prop";
Ajax.ARRAY_BUFFER = "arraybuffer";

Ajax.prototype.get = function (url, data, oncomplete, onerror) 
{
	this.getRequest("GET", url, data, oncomplete, onerror);
}

Ajax.prototype.post = function (url, data, oncomplete, onerror) 
{
	this.getRequest("POST", url, data, oncomplete, onerror);
}

Ajax.prototype.getHttp = function () 
{
	if (typeof XMLHttpRequest != undefined) {
		return new XMLHttpRequest();
	}  
	try {
		return new ActiveXObject("Msxml2.XMLHTTP");
	} catch (e) {
		try {
			return new ActiveXObject("Microsoft.XMLHTTP");
		} catch (e) {
			if (!this.err) {
				this.err(e);
			}
		}
	}
	return false;
}

Ajax.prototype.getRequest = function (t, url, d, oncomplete, err) 
{
	var s = this, k, data = "", a = "",block=false,sub,st;
	s.err = err;
	var ajax = s.getHttp();
	if (!ajax) {
		return;
	}
	if (d) {
		for (k in d) {
			sub=d[k];
			st=ObjectUtil.getType(sub)
			
			if(st!="number" && (st!="string" || (sub.indexOf("data:")==0 && sub.indexOf(";base64,")>0))){
				block=true;
				break;
			}
			
			data += (a + k + "=" + sub);
			a = "&";	
		}
		
		if(block){
			data=new FormData();
			for (k in d) {
				sub=d[k];
				st=(typeof sub);
				
				if(st=="string" && (sub.indexOf("data:")==0 && sub.indexOf(";base64,")>0)){
					sub=sub.split(",");
					sub.shift();
					sub=sub.join(",");
				}
				
				data.append(k, sub);
			}
		}
	}
	if (t.toLowerCase() == "get" && data.length > 0) {
		url += ((url.indexOf('?') >= 0 ? '&' : '?') + data);
		data = null;
	}
	ajax.open(t, url, true);
	
	ajax._responseType=StringUtil.getPathExt(url);
	
	if (s.responseType) {
		if(s.responseType == Ajax.JSON){
			try{
				ajax.responseType = s.responseType;
			}catch(e){
				ajax.responseType = Ajax.TEXT;
				ajax._responseType = "json";
			}
		}else{
			ajax.responseType = s.responseType;
		}
		s.responseType = Ajax.TEXT;
	}
	
	if(!block) ajax.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
	ajax.onreadystatechange = function () {
		if (ajax.readyState == 4) {
			if (ajax.status >= 200 && ajax.status < 300 || ajax.status === 304) {
				if (oncomplete) {
					if(ajax._responseType == Ajax.JSON){
						oncomplete(JSON.parse(ajax.responseText));
					}
					else if(ajax._responseType == Ajax.PROP){
						oncomplete(PropUtil.parseProperties(ajax.responseText));
					}
					else if (ajax.responseType == Ajax.ARRAY_BUFFER || ajax.responseType == Ajax.BLOB || ajax.responseType == Ajax.JSON) {
						oncomplete(ajax.response);
					} 
					else if (ajax.responseText.length > 0) {
						oncomplete(ajax.responseText);
					} 
					else {
						oncomplete(null);
					}
				}
			} else {
				if (err) {
					err(ajax);
				}
			}
 		}
	};
	ajax.send(data);
}

//----------------------------------------- Graphics -----------------------------------------

/**
===================================================================
Graphics Class
===================================================================
**/

function Graphics()
{
	CanvasUtil.create(this);
	
	this.canvas.width=Global.canvas.width;
	this.canvas.height=Global.canvas.height;
	
	Global.proxy( this , this.context , "beginPath");
	Global.proxy( this , this.context , "closePath");
	Global.proxy( this , this.context , "stroke");
	Global.proxy( this , this.context , "fill");
	Global.proxy( this , this.context , "moveTo");
	Global.proxy( this , this.context , "lineTo");
	Global.proxy( this , this.context , "arcTo");
	Global.proxy( this , this.context , "arc");
	Global.proxy( this , this.context , "rect");
	Global.proxy( this , this.context , "clip");
	Global.proxy( this , this.context , "quadraticCurveTo", "curveTo");
	Global.proxy( this , this.context , "createPattern");
	Global.proxy( this , this.context , "bezierCurveTo");
	Global.proxy( this , this.context , "createLinearGradient");
	Global.proxy( this , this.context , "createRadialGradient");
	
	this.lineStyle();
}

/**
定义图形线条类型
@param thickness number 线条宽度>0
@param style String 颜色值 或者 CanvasGradient 对象 或 CanvasPattern 对象
@param alpha number 线条透明度=>0
@param cap String 线条的末端形状 "butt" 短直角 "round" 圆形 "square"长直角
@param joint String 线条的接头方式 "round" 圆角 "bevel" 斜角（外边缘相交填充的三角形） "miter" 直角相交（外边缘一直扩展到它们相交）
@param miterLimit number joint=="miter"时候斜连接长度和线条宽度的最大比率
*/
Graphics.prototype.lineStyle=function(thickness,style,alpha,cap,joint,miterLimit)
{
	this.line_cap=cap || "butt";
	this.stroke_style=style || "0";
	this.line_join=joint || "miter";
	this.line_alpha=(alpha==undefined) ? 1 : alpha;
	this.line_width=(thickness==undefined) ? 1 : thickness;
	this.miter_limit=(miterLimit==undefined) ? 10 : miterLimit;
	
	this.line_width=this.line_width<=0 ? 0.1 : this.line_width;
	this.stroke_style=this.stroke_style+"";
	
	this.context.lineCap=this.line_cap;
	this.context.lineJoin=this.line_join;
	this.context.lineWidth=this.line_width;
	this.context.miterLimit=this.miter_limit;
	this.context.strokeStyle=this.stroke_style;
}

/**
清除定义图形
*/
Graphics.prototype.clear=function()
{
	this.rectangle=this.rectangle || new Rectangle(0,0,this.context.canvas.width,this.context.canvas.height);
	this.context.clearRect(this.rectangle.x,this.rectangle.y,this.rectangle.width,this.rectangle.height);
	this.context.restore();
}

Graphics.prototype.beginFill=function(style, alpha)
{
	this.fill_alpha=(alpha==undefined) ? 1 : alpha;
	this.fill_style=style || "#FFFFFF";
	this.context.fillStyle=this.fill_style;
	return this;
}

Graphics.prototype.endFill=function()
{
	if (this.stroke_style)
	{
		this.context.strokeStyle=this.stroke_style;
		this.context.globalAlpha=this.line_alpha;
		this.context.stroke();
	}
	
	if (this.fill_style)
	{
		this.context.fillStyle=this.fill_style;
		this.context.globalAlpha=this.fill_alpha;
		this.context.fill();
	}
}

/**
图片填充
@param image Image 贴图 Image 对象或一个 Canvas 元素

@param repetitionStyle
•"repeat" - 在各个方向上都对图像贴图。默认值。
•"repeat-x" - 只在 X 方向上贴图。
•"repeat-y" - 只在 Y 方向上贴图。
•"no-repeat" - 不贴图，只使用它一次。
*/
Graphics.prototype.beginBitmapFill=function(image, repetitionStyle)
{
	this.fill_style=this.createPattern(image, repetitionStyle || "no-repeat");
}

/**
线性颜色渐变图形填充
@param xStart, yStart number 渐变的起始点的坐标。
@param xEnd, yEnd number 渐变的结束点的坐标。
@param offsetlist,colorList Array 
offset >=0 And <=1 表示渐变的开始点和结束点之间的范围百分比
color 颜色字符串
*/		
Graphics.prototype.LinearGradientFill=function(xStart, yStart, xEnd, yEnd, offsetlist, colorList)
{
	var fillStyle=this.createLinearGradient(xStart, yStart, xEnd, yEnd);
    var len=Math.min(offsetlist.length,colorList.length);
	for (var i=0 ; i<len ; i++) fillStyle.addColorStop(offsetlist[i], colorList[i]+"");
	this.fill_style=fillStyle;
	return fillStyle;
}

/**
放射颜色渐变图形填充
@param xStart, yStart number 开始圆的圆心的坐标。 
@param radiusStart number 开始圆的直径。
@param xEnd, yEnd number 结束圆的圆心的坐标。
@param radiusEnd number 结束圆的直径。
@param offsetlist,colorList Array 
offset >=0 And <=1 表示渐变的开始点和结束点之间的范围百分比
color 颜色字符串
*/
Graphics.prototype.radialGradientFill=function(xStart, yStart, radiusStart, xEnd, yEnd, radiusEnd, offsetlist, colorList)
{
	var fillStyle=this.createRadialGradient(xStart, yStart, radiusStart, xEnd, yEnd, radiusEnd);
	var len=Math.min(offsetlist.length,colorList.length);
	for (var i=0 ; i<len ; i++) fillStyle.addColorStop(offsetlist[i], colorList[i]+"");
	this.fill_style=fillStyle;
	return fillStyle;
}

/**
绘制矩形路径
*/
Graphics.prototype.drawRect=function(x, y, width, height)
{
	this.beginPath();
	this.rect(x, y, width, height);
	this.closePath();
	this.endFill();
}

/**
绘制圆角矩形路径
@param ellipseRadius number 圆角半径
*/
Graphics.prototype.drawRoundRect=function(x, y, width, height, ellipseRadius)
{
	this.beginPath();
	this.moveTo(x + ellipseRadius, y);
	this.lineTo(x + width - ellipseRadius, y);
	this.arc(x + width - ellipseRadius, y + ellipseRadius, ellipseRadius, -Math.PI / 2, 0, false);
	this.lineTo(x + width, y + height - ellipseRadius);
	this.arc(x + width - ellipseRadius, y + height - ellipseRadius, ellipseRadius, 0, Math.PI / 2, false);
	this.lineTo(x + ellipseRadius, y + height);
	this.arc(x + ellipseRadius, y + height - ellipseRadius, ellipseRadius, Math.PI / 2, Math.PI, false);
	this.lineTo(x, y + ellipseRadius);
	this.arc(x + ellipseRadius, y + ellipseRadius, ellipseRadius, Math.PI, Math.PI * 3 / 2, false);
	this.closePath();
	this.endFill();
}

/**
 * 绘制路径
 * @param {Array} array
 * @param {Boolean} isClose
 */
Graphics.prototype.drawPath=function(array,isClose)
{
	if(array==undefined || array.length<2) return;
	
	this.beginPath();
	this.moveTo(array[0].x, array[0].y);
	
	for (var i=1;i<array.length;i++){
		this.lineTo(array[i].x, array[i].y);
	}
	
	if(isClose) this.closePath();
	this.endFill();
}

/**
绘制圆形路径
*/
Graphics.prototype.drawCircle=function(x, y, radius)
{
	this.beginPath();
	this.arc(x + radius, y + radius, radius, 0, Math.PI * 2, 0);
	this.closePath();
	this.endFill();
}

/**
绘制椭圆形路径
*/
Graphics.prototype.drawEllipse=function(x, y, width, height)
{
	if (width == height) return this.drawCircle(x, y, width/2);
	
	width=width / 2;
	height=height / 2;
	
	var dw=0.5522847498307933 * width; 
	var dh=0.5522847498307933 * height;
	
	x+=width;
	y+=height;
	
	this.beginPath();
	this.moveTo(x + width, y);
	this.bezierCurveTo(x + width, y - dh, x + dw, y - height, x, y - height);
	this.bezierCurveTo(x - dw, y - height, x - width, y - dh, x - width, y);
	this.bezierCurveTo(x - width, y + dh, x - dw, y + height, x, y + height);
	this.bezierCurveTo(x + dw, y + height, x + width, y + dh, x + width, y);
	this.closePath();
	this.endFill();
}

/**
 * n边形
 * @param {Number} x
 * @param {Number} y
 * @param {Number} radius
 * @param {Number} n
 */
Graphics.prototype.createPolygon=function(x, y,radius,n) 
{
	if(n<3) return;
	
    var dx,dy,i;
    this.beginPath();
    dx = Math.sin(0);
    dy = Math.cos(0);
    
    var dig = Math.PI / n * ((n%2==0) ? 2 : (n-1));
    
    for (i = 0; i < n; i++) {
        dx = Math.sin(i * dig);
        dy = Math.cos(i * dig);
        this.lineTo(x + dx * radius, y + dy * radius);
    }
    
    this.closePath();
    this.endFill();
}

/**
 * 根据参数指定的SVG数据绘制一条路径。
 * 代码示例: 
 * <p>var path = "M250 150 L150 350 L350 350 Z";</p>
 * <p>var shape = new Graphics();</p>
 * <p>shape.drawSVGPath(path).beginFill("#0ff").endFill();</p>
 */
Graphics.prototype.drawSVGPath = function(pathData)
{
	var path = pathData.split(/,| (?=[a-zA-Z])/);
	
	this.beginPath();
	for(var i = 0, len = path.length; i < len; i++)
	{
		var str = path[i], cmd = str[0].toUpperCase(), p = str.substring(1).split(/,| /);
		if(p[0].length == 0) p.shift();

		switch(cmd)
		{
			case "M":
				this.moveTo(p[0], p[1]);
				break;
			case "L":
				this.lineTo(p[0], p[1]);
				break;
			case "C":
				this.bezierCurveTo(p[0], p[1], p[2], p[3], p[4], p[5]);
				break;
			case "Z":
				this.closePath();
				break;
			default:
				break;
		}
	}
	return this;
};

Graphics.prototype.reset=function()
{
	this.clear();
	
	if(this.canvas && this.canvas.parentNode) {
		this.canvas.parentNode.removeChild(this.canvas);
	}
	
	if(this.rectangle) this.rectangle.dispose();
	this.rectangle=null;
	
	this.canvas.width=Global.canvas.width;
	this.canvas.height=Global.canvas.height;
    this.lineStyle();
}

Graphics.prototype.dispose=function()
{
	this.reset();
	delete this.rectangle,this.line_cap,this.line_join,this.line_alpha,this.stroke_style,this.line_width,this.miter_limit,this.fill_alpha,this.fill_style,this.context,this.canvas;
}

Graphics.prototype.toString=function()
{
	var rect_string="";
	
	if(this.rectangle){
		try{
			rect_string=this.rectangle.toString();
		}
		catch(e){}
	}
	
	return '{"line_cap":'+this.line_cap+',"rect":'+rect_string+',"line_join":'+this.line_join+',"line_alpha":'+this.line_alpha+',"stroke_style":'+this.stroke_style+',"line_width":'+this.line_width+',"miter_limit":'+this.miter_limit+',"fill_alpha":'+this.fill_alpha+',"fill_style":'+this.fill_style+'}';
}
//----------------------------------------- StageEvent -----------------------------------------

/**
===================================================================
StageEvent Class
===================================================================
**/

function StageEvent(type,params,label,target)
{
	Event.call(this,type,params,label,target);
	this.delta = this.mouseY = this.mouseX = 0;
	this.length=this.touchs = null;
}

Global.inherit(StageEvent,Event);

StageEvent.ENTER_FRAME = "enterframe";
StageEvent.MOUSE_WHEEL = "mousewheel";
StageEvent.MOUSE_CLICK = "mouseclick";
StageEvent.MOUSE_DOWN  = "mousedown";
StageEvent.MOUSE_MOVE  = "mousemove";
StageEvent.MOUSE_OVER  = "mouseover";
StageEvent.MOUSE_TAP   = "mousetap";
StageEvent.MOUSE_OUT   = "mouseout";
StageEvent.MOUSE_UP    = "mouseup";
StageEvent.RESIZE      = "resize";

StageEvent.DRAG_MOVE = "drag_move";
StageEvent.KEY_DOWN  = "keydown";
StageEvent.KEY_UP    = "keyup";
StageEvent.UPDATE    = "update";

StageEvent.prototype.setup=function(type,params,label,target,mouseX,mouseY,delta,length,touchs)
{
	this.type   = type;
	this.label  = label;
	this.params = params;
	this.target = target;
	
	this.length = length;
	this.touchs = touchs;
	
	this.delta  = (delta==null ? 0 : delta);
	this.mouseY = (mouseY==null ? 0 : mouseY);
	this.mouseX = (mouseX==null ? 0 : mouseX);
}

StageEvent.prototype.clone=function()
{
	return Factory.c("se",[this.type,this.params,this.label,this.target,mouseX,mouseY,delta,length,touchs]);
}

StageEvent.prototype.reset=function()
{
	ObjectUtil.clearAttribute(this,["type","label","params","target","delta","mouseX","mouseY","length","touchs"],["setup","clone","reset","dispose","toString"]);
	this.type=this.label=this.params=this.target=null;
	this.delta = this.mouseY = this.mouseX = 0;
	this.length=this.touchs = null;
}

StageEvent.prototype.dispose=function()
{
	StageEvent.superClass.dispose.call(this);
	delete this.delta,this.mouseY,this.mouseX,this.length,this.touchs;
}

StageEvent.prototype.toString = function() 
{
	return "[StageEvent length="+this.length+", type=" + this.type + ", mouseX=" + this.mouseX + ", mouseY=" + this.mouseY + ", delta="+this.delta+"]";
}

StageEvent.supportTouch = function() 
{
	return (Global.canTouch && Global.supportTouch) ;
}
//----------------------------------------- Factory -----------------------------------------

/**
 * 实例化工厂
 * @param {Object} generator class
 * @param {Object} properties
 * @param {Array}  params
 */
function Factory(generator,properties,params)
{
	this.generator = (typeof(generator)=="string") ? ClassUtil.getDefinitionByName(generator) : generator;
	this.properties = properties;
	this.params = params;
}

Factory.prototype.newInstance=function()
{
	if(this.generator==null) return null;
	
	var p,instance = ObjectPool.create(this.generator,this.params);
	
    if (this.properties != null)
    {
    	for (p in this.properties)
		{
    		instance[p] = this.properties[p];
		}
   	}
    
   	return instance;
}

/**
 * create Instance 获得对应实例
 * @param {String} type
 * dc DisplayObjectContainer
 * tf TextField
 * mc MovieClip
 * do DisplayObject
 * vp VideoPlayer
 * ef Effect
 * bs BoxShape
 * se StageEvent
 * ev Event
 * @param {Object || Array} properties
 * @param {Boolean} useCanvas
 */
Factory.c=function(type,properties,useCanvas)
{
	if(StringUtil.isEmpty(type)) return null;
	useCanvas=(useCanvas==undefined) ? Global.useCanvas : useCanvas;
	
	var instance;
	
	switch (type) {
		case "dc":
		    instance=ObjectPool.create(DisplayObjectContainer);
			break;
		case "do":
		    instance=ObjectPool.create(useCanvas ? DisplayObject : DOMDisplay);
			break;
		case "mc":
		    instance=ObjectPool.create(useCanvas ? MovieClip : DOMMovie);
			break;
		case "vp":
		    instance=useCanvas ? new VideoPlayer() : new VideoPlayerII();
			break;
		case "bs":
			instance=ObjectPool.create(BoxShape);
			
			if(properties && ObjectUtil.getType(properties)=="array"){
				instance.setup.apply(instance,properties);
				return instance;
			}
			break;
		case "tf":
		    if(properties==undefined) return null;
		    
			if(properties.font && FontManager.has(properties.font)){
				instance=new BitmapText();
				instance.setup(properties.text,properties.font,properties.lineWidth,properties.align);
			}else{
				instance=useCanvas ? new TextField(properties.text,properties.font,properties.color,properties.size) : new InputText(properties.isInput,properties.multiline);
			}
			break;
		case "ef":
		    instance=ObjectPool.create(Effect);
			if(properties ==undefined || properties.length==undefined || properties.length==0) return instance;
			instance.setup.apply(instance,properties);
			return instance;
		case "se":
			instance=ObjectPool.create(StageEvent);
			instance.setup.apply(instance,properties);
			return instance;
		case "ev":
			instance=ObjectPool.create(Event);
			instance.setup.apply(instance,properties);
			return instance;
	}
	
	if(instance && properties) ObjectUtil.copyAttribute(instance,properties,false);
	return instance;
}

//----------------------------------------- DisplayBase -----------------------------------------

/**
===================================================================
DisplayBase Class
===================================================================
**/

function DisplayBase()
{
	EventDispatcher.call(this);
	this.name=this.register_point=this._parent=this._temp_matrix=this._matrix=this.polyArea=this._stage=this._bounds=null;
	this._height=this._width=this._y=this._x=this._rotation=this._skewX=this._skewY=this._minX=this._minY=0;
	this._scaleY=this._scaleX=this._alpha=this._parent_alpha=1;
	this._resize=this.mouseEnabled=this.buttonMode=false;
	this.usePolyCollision=false;
	this._updateMatrix=true;
	this.breakTouch=false;
	this._draggable=false;
	this._visible=true;
}

Global.inherit(DisplayBase,EventDispatcher);

Object.defineProperty(DisplayBase.prototype,"resize",{
	get: function (){
		return this._resize;
	},
    set: function (value) {
		this._resize=value;
		
		if(this._resize){
			this.dispatchEvent(Factory.c("ev",[DisplayBase.RESIZE]));
		}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		this._stage=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"visible",{
	get: function (){
		return this._visible;
	},
    set: function (value) {
        if(this._visible==value) return;
		this._visible=value;
		this.__checkDisplayUpdate();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"parent",{
	get: function (){
		return this._parent;
	},
    set: function (value) {
        if(this._parent==value) return;
		this._parent=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"alpha",{
	get: function (){
		return this._alpha;
	},
    set: function (value) {
        if(this._alpha==value || isNaN(value)) return;
		this._alpha=Math.min(1,value);
		this.__checkDisplayUpdate();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"updateMatrix",{
	get: function (){
		return this._updateMatrix;
	},
    set: function (value) {
    	if(value) this.__checkDisplayUpdate();
    	
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
		
		if(value && this._bounds) this._bounds.width=this._bounds.heigth=0;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"skewX",{
	get: function (){
		return this._skewX;
	},
    set: function (value) {
        if(this._skewX==value||isNaN(value)) return;
              
		this._skewX=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"skewY",{
	get: function (){
		return this._skewY;
	},
    set: function (value) {
        if(this._skewY==value || isNaN(value)) return;
              
		this._skewY=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"x",{
	get: function (){
		return this._x;
	},
    set: function (value) {
        if(this._x==value|| isNaN(value))return;
        
		this._x=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"y",{
	get: function (){
		return this._y;
	},
    set: function (value) {
        if(this._y==value|| isNaN(value))return;
          
		this._y=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"width",{
	get: function (){
		return this._width;
	},
    set: function (value) {
        if(this._width==value || isNaN(value)) return;     
        
		this._width=value;
		this.updateMatrix=true;
		this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"height",{
	get: function (){
		return this._height;
	},
    set: function (value) {
        if(this._height==value || isNaN(value)) return;  
            
		this._height=value;
		this.updateMatrix=true;
		this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"scaleX",{
	get: function (){
		return this._scaleX;
	},
    set: function (value) {
        if(this._scaleX==value|| isNaN(value)) return;
            
		this._scaleX=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"scaleY",{
	get: function (){
		return this._scaleY;
	},
    set: function (value) {
        if(this._scaleY==value || isNaN(value)) return;
              
		this._scaleY=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"rotation",{
	get: function (){
		return this._rotation;
	},
    set: function (value) {
        if(this._rotation==value || isNaN(value)) return;
              
		this._rotation=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"data",{
	get: function (){
		var str=DisplayBase.toString(this);
		return JSON.parse(str);
	},
    set: function (value) {
        if(value==undefined || value==null) return;
		ObjectUtil.copyAttribute(this,value,false);
		this.updateMatrix=true;
		this.resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"origin",{
    get: function () {
    	if(this.register_point==undefined) this.register_point=new Point();
        return this.register_point;
    },
    set: function (value) {
        if(value==undefined || value==null) return;
        if(this.register_point==undefined) this.register_point=new Point();
        if(this.register_point.x==value.x || this.register_point.y==value.y) return;
        
		this.register_point.x=value.x;
		this.register_point.y=value.y;
		
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"matrix",{
    get: function () {
        return this._matrix || this.getMatrix();
    },
    set: function (value) {
        if(value==undefined || value==null || !(value instanceof Matrix) ) return;
		var mtx1=this.getMatrix().clone();
		var mtx2=this.getMatrix(this);
		
		mtx1.invert();
		mtx1.concat(mtx2);
		
		value.concat(mtx1);
		ObjectPool.remove(mtx1);
		value.applyDisplay(this);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"scale",{
	get: function (){
		return (this._scaleX==this._scaleY) ? this._scaleX : NaN;
	},
    set: function (value) {
        if(value==undefined || value==null || isNaN(value)) return;
        
		this._scaleX=this._scaleY=value;
		this.updateMatrix=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayBase.prototype,"draggable",{
    get: function () {
        return this._draggable;
    },
    set: function (value) {
        if(value==undefined || value==null || this._draggable==value) return;
		this._draggable=value;
		this.breakTouch=this.mouseEnabled=value;
    },
    enumerable: true,
    configurable: true
});

DisplayBase.prototype.__checkDisplayUpdate= function()
{
	if(this._stage && !this._stage.auto_fresh) this._stage.auto_fresh=true;
}

DisplayBase.prototype.setSize=function(w,h)
{
	if(w==undefined || isNaN(w) || h==undefined || isNaN(h) || (this._width==w && this._height==h)) return;
	
	this._width=w;
	this._height=h;
	
	this.resize=true;
	this.updateMatrix=true;
}

DisplayBase.prototype.getMatrix = function(target,isDraw)
{
	if(this._matrix && !this.updateMatrix && target==undefined) 
		return this._matrix;
	
	if(this._temp_matrix==undefined) this._temp_matrix=ObjectPool.create(Matrix);
	else this._temp_matrix.reset();
	
	if(target && target==this) {}
	else if(this.parent) {
		for(obj=this; obj!=null && !(target && target==obj); obj=obj.parent)
		{	
	        this._temp_matrix.concatTransform(obj.x, obj.y, obj.scaleX, obj.scaleY, obj.rotation, obj.origin.x, obj.origin.y,obj.skewX,obj.skewY);
		}
    }
	
	if(this.updateMatrix && target==undefined && isDraw) {
		if(this._matrix==undefined) this._matrix=this._temp_matrix.clone();
		else this._matrix.setup(this._temp_matrix.a, this._temp_matrix.b, this._temp_matrix.c, this._temp_matrix.d, this._temp_matrix.tx, this._temp_matrix.ty);
		this.updateMatrix=false;
	}
	
	return this._temp_matrix;
}

DisplayBase.prototype.addEventListener=function(eventType, func,id)
{
	if(this.listeners==undefined) this.listeners={};
	DisplayBase.superClass.addEventListener.call(this,eventType,func,id);
}

DisplayBase.prototype.localToGlobal = function(posX, posY)
{
	if(posY==undefined && (posX instanceof Point)){
		posY=posX.y;
		posX=posX.x;
	}

	var matrix=this.getMatrix();
	var mtx=ObjectPool.create(Matrix);
	mtx.setup(1, 0, 0, 1, posX, posY);
	mtx.concat(matrix);
	var point=new Point(mtx.tx, mtx.ty);
	ObjectPool.remove(mtx);
	return point;
}
		
DisplayBase.prototype.globalToLocal = function(posX, posY)
{
	if(posY==undefined && (posX instanceof Point)){
		posY=posX.y;
		posX=posX.x;
	}
		
	var matrix=this.getMatrix();
	matrix.invert();
	var mtx=ObjectPool.create(Matrix);
	mtx.setup(1, 0, 0, 1, posX, posY);
	mtx.concat(matrix);
    var point=new Point(mtx.tx, mtx.ty);
	ObjectPool.remove(mtx);
	
	return point;
}

DisplayBase.prototype.localToTarget = function(posX, posY,target)
{
	if(target==undefined || target==null) return this.localToGlobal(posX, posY);
	
	var point=this.localToGlobal(posX, posY);
	return target.globalToLocal(point.x, point.y);
}

DisplayBase.prototype.getWidth = function()
{
	return Math.ceil(Math.abs(this.width * this.scaleX));
}
		
DisplayBase.prototype.getHeight = function()
{
	return Math.ceil(Math.abs(this.height * this.scaleY));
}

DisplayBase.prototype.getBounds = function(target)
{
	var w = (this.getWidth()/Math.abs(this.scaleX));
	var h = (this.getHeight()/Math.abs(this.scaleY));
	
	var posX=this._minX;
	var posY=this._minY;
	var i,poly,bool=(target==undefined && this._bounds);
	
	if(this.polyArea){
		if(this._bounds==undefined) this._bounds=ObjectUtil.cloneObj(this.polyArea);
		else{
			for(i=0;i<this.polyArea.length;i++){
				this._bounds[i].x=this.polyArea[i].x;
				this._bounds[i].y=this.polyArea[i].y;
			}
		}
		
		poly=this._bounds;
	}
	else if(bool){
		if(this._bounds.width>0 && this._bounds.height>0) return this._bounds;
		
		this._bounds[0].x=posX;this._bounds[0].y=posY;
		this._bounds[1].x=posX+w;this._bounds[1].y=posY;
		this._bounds[2].x=posX+w;this._bounds[2].y=posY+h;
		this._bounds[3].x=posX;this._bounds[3].y=posY+h;
	}
	
	var mtx = this.getMatrix(target);
	poly = poly || (bool ? this._bounds : [{x:posX, y:posY}, {x:posX+w, y:posY}, {x:posX+w, y:posY+h}, {x:posX, y:posY+h}]);
	
	var vertexs =bool ? this._bounds : [],len = poly.length, v, minX, maxX, minY, maxY;	
	v = mtx.transformPoint(poly[0], true, false);
	
	minX = maxX = v.x;
	minY = maxY = v.y;
	vertexs[0] = v;
	
	for(var i = 1; i < len; i++)
	{
		v = mtx.transformPoint(poly[i], true, false);
		if(minX > v.x) minX = v.x;
		else if(maxX < v.x) maxX = v.x;
		if(minY > v.y) minY = v.y;
		else if(maxY < v.y) maxY = v.y;
		vertexs[i] = v;
	}
	
	vertexs.x = minX;
	vertexs.y = minY;
	vertexs.width = maxX - minX;
	vertexs.height = maxY - minY;
	
	if(target==undefined && this._bounds==undefined) this._bounds=vertexs;
	return vertexs;
}

DisplayBase.prototype.getIndex=function()
{
	if(this.parent==null || !this.parent.contains(this)) return -1;
	return this.parent._children.indexOf(this);
}

DisplayBase.prototype.toTop=function()
{
	if(this.parent==null || !this.parent.contains(this)) return;
	this.parent.setChildIndex(this,this.parent.numChildren);
}

DisplayBase.prototype.toBottom=function()
{
	if(this.parent==null || !this.parent.contains(this)) return;
	this.parent.setChildIndex(this,0);
}

DisplayBase.prototype.moveTo=function(x,y)
{
	if(y==undefined && (x instanceof Point)){
		y=x.y;
		x=x.x;
	}
	
	if((this._x==x && this._y==y) || isNaN(x) || isNaN(y))  return;
	
	this._x=x;
	this._y=y;
	
	this.updateMatrix=true;
}

DisplayBase.prototype.render  = function(){}

DisplayBase.prototype.removeFromParent = function(bool)
{
	if(this.parent==null || !this.parent.contains(this)) {
		if(bool && !Global.gc(this)) this.dispose();
		return;
	}
	
	this.parent.removeChild(this);
	if(bool && !Global.gc(this)) this.dispose();
}

DisplayBase.prototype.reset = function()
{
	if(this._parent) this.removeFromParent(false);
	if(this._matrix) ObjectPool.remove(this._matrix);
	if(this._temp_matrix) ObjectPool.remove(this._temp_matrix);
	if(DisplayBase.superClass) DisplayBase.superClass.reset.call(this);
	
	this.stage=null;
	this._visible=this._updateMatrix=true;
	this._scaleY=this._scaleX=this._alpha=this._parent_alpha=1;
	this._bounds=this._matrix=this._temp_matrix=this.register_point=this.parent=this.polyArea=this.name=null;
    this._minX=this._minY=this._skewX=this._skewY=this._height=this._width=this._y=this._x=this._rotation=0;
    this._resize=this.mouseEnabled=this.buttonMode=this.usePolyCollision=this.breakTouch=this._draggable=false;
}

DisplayBase.prototype.dispose = function()
{
	this.reset();
	if(DisplayBase.superClass) DisplayBase.superClass.dispose.call(this);
	delete this._bounds,this._minX,this._minY,this._temp_matrix,this.breakTouch,this._resize,this._skewX,this._skewY,this._stage,this._updateMatrix,this.polyArea,this._draggable,this.usePolyCollision,this._matrix,this.register_point,this._height,this._width,this._y,this._x,this._rotation,this._scaleY,this._scaleX,this._alpha,this.mouseEnabled,this._visible,this.name,this._parent,this.buttonMode,this._parent_alpha;
}

DisplayBase.RESIZE="display_base_resize";
DisplayBase.RESET_INSTANCE = "display_reset_instance";

DisplayBase.toString = function(obj)
{
	var str="{";
	str+='"_x":'+obj._x+',';
	str+='"_y":'+obj._y+',';
	str+='"_width":'+obj._width+',';
	str+='"_height":'+obj._height+',';
	str+='"_rotation":'+obj._rotation+',';
	str+='"_scaleX":'+obj._scaleX+',';
	str+='"_scaleY":'+obj._scaleY+',';
	str+='"_skewX":'+obj._skewX+',';
	str+='"_skewY":'+obj._skewY+',';
	str+='"_minX":'+obj._minX+',';
	str+='"_minY":'+obj._minY+',';
	str+='"origin":'+(obj.origin==null ? '""' : obj.origin.toString())+',';
	str+='"mouseEnabled":'+obj.mouseEnabled+',';
	str+='"_visible":'+obj._visible+',';
	str+='"name":"'+obj.name+'",';
	str+='"breakTouch":"'+obj.breakTouch+'",';
	str+='"alpha":'+obj.alpha+',';
	str+='"_draggable":'+obj._draggable+',';
	str+='"buttonMode":'+obj.buttonMode+',';
	if(this.polyArea) str+='"polyArea":'+obj.polyArea.toString()+',';
	str+='"usePolyCollision":'+obj.usePolyCollision+',';
	str+='"matrix":'+(obj._matrix ? obj._matrix.toString() : '""');
	return str+"}";
}
//----------------------------------------- DOMDisplay -----------------------------------------

/**
===================================================================
DOMDisplay Class
===================================================================
**/

DOMDisplay.COUNT=0;
DOMDisplay._depth_count=0;

function DOMDisplay()
{
	DisplayBase.call(this);
	this.instance=this._rect=this._mask=this._parent_node=this._element=null;
	this._global_visible=true;
	this._layer=this._depth=0;
	this._cursor="";
	this.filters=[];
	
	DOMDisplay.COUNT=(DOMDisplay.COUNT>999) ? 0 : DOMDisplay.COUNT;
	this.name="dom_display_"+(DOMDisplay.COUNT++);
}

Global.inherit(DOMDisplay,DisplayBase);

Object.defineProperty(DOMDisplay.prototype,"layer",{
	get: function (){
		return this._layer || this._depth;
	},
    set: function (value) {
        if(this._layer==value) return;
		this._layer=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"visible",{
	get: function (){
		return this._visible;
	},
    set: function (value) {
        if(this._visible==value) return;
		this._visible=value;
		
		if(this._element) 
			this._element.style.display = !this._visible ? "none" : "";
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
    	if(value==null) this._global_visible=true;
        if(this._stage==value) return;
		this._stage=value;
		this._display(value!=null);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"element",{
	get: function (){
		return this._element;
	},
    set: function (value) {
        if(value==undefined || value==null) return;
        var node;

        if(this._element && this._element.parentNode){
        	node=this._element.parentNode;
        	node.removeChild(this._element);
        }
        else if(this._stage) 
        	node=this._parent_node ? this._parent_node : Global.div;
        	
        if(value.parentNode){
        	value.parentNode.removeChild(value);
        }
        
		this._element=value;
		this._element.id=this.name;
		
		this.width=(this._element.width==undefined || typeof(this._element.width)!="number") ? (StringUtil.isEmpty(this._element.style.width) ? this.width : MathUtil.int(this._element.style.width)) : this._element.width;
		this.height=(this._element.height==undefined || typeof(this._element.height)!="number") ? (StringUtil.isEmpty(this._element.style.height) ? this.height :MathUtil.int(this._element.style.height)) : this._element.height;

		if(node) node.appendChild(this._element);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"mask",{
	get: function (){
		return this._mask;
	},
    set: function (value) {
        if(value==undefined || value==null) return;
		this._mask=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DOMDisplay.prototype,"parentNode",{
	get: function (){
		return this._parent_node;
	},
    set: function (value) {
        if(this._parent_node==value) return;
		this._parent_node=value;
		
		if(this._element==null || this._element.parentNode==this._parent_node) return;
		
		if(this._element && this._stage) {
		   if(this._element.parentNode) this._element.parentNode.removeChild(this._element);
		   this._display(true);
	    }
    },
    enumerable: true,
    configurable: true
});

DOMDisplay.prototype.render  = function(object)
{
	if(this._element==null) return;
	this._depth=this._layer ? this._layer : (++DOMDisplay._depth_count);
	this._transform(object);
}

DOMDisplay.prototype._render = function(target,initial,package){}

DOMDisplay.prototype.setInstance=function(target)
{
	if(target==undefined || target==null || this.instance==target) return target;
	
	var temp;
	this._rect=null;
	
    if(target instanceof HTMLImageElement){
    	target.style.display = "none";
    	this.element=target;
    }
    else if(target instanceof HTMLCanvasElement){
    	this.element=CanvasUtil.toImage(target);
    }
    else if(target instanceof DisplayObject){
    	this.setInstance(target.canvas ? target.canvas : target.instance);
    	this.data=target.data;
    }
    else if(target instanceof Source){
    	this.register_point=(target.hasOwnProperty("reg")) ? target.reg : new Point();
    	this._rect=target.rect;
    	
    	if(this._element==undefined) this.element=DOMUtil.createDOM("div",{id:this.name,style:{width:target.rect.width+"px",height:target.rect.height+"px",backgroundImage:"url(" + target.image.src+ ")",backgroundRepeat:"no-repeat"}});
    	else if(this.instance.image!=target.image) {
    		this._element.style.backgroundImage="url(" + target.image.src+ ")";
    	}
    }
    else if(target instanceof Graphics){
    	this.setInstance(target.canvas);
    }
    else if(target instanceof HTMLDivElement){
    	this.element=target;
    }
    else if(target instanceof SVGSVGElement){
    	this.element=target;
    }
    else {
    	trace("DOMDisplay:: set instance with a invalid value.",ClassUtil.getQualifiedClassName(target),"-",ObjectUtil.getType(target));
    	return null;
    }
    
    this.instance=target;
    
    if(this._element && this._stage){
    	this._display(true);
    }
    
    this._updateMatrix=true;
    this.__checkDisplayUpdate();
    this.dispatchEvent(Factory.c("ev",[DisplayBase.RESET_INSTANCE]));
    return this.instance;
}

DOMDisplay.prototype._transform=function(target)
{
	var bool=(this._visible && this._global_visible);
	
	this._element.style.display = bool ? "" : "none";
	if(!bool) return;
	
	var hasUpdate=this._updateMatrix;
	var matrix=this.getMatrix(target,true);
	
	var prefix = Global.cssPrefix, 
		origin = prefix + "TransformOrigin", 
		transform = prefix + "Transform";
//		select = prefix + "UserSelect";
	
    this._element.style.opacity = this._alpha*this._parent_alpha;
    
    this._element.style.position="absolute";//"relative";
    this._element.style.overflow = "hidden";
	  this._element.style.zIndex = Global.layer+this._depth;
	
	if(this._rect){
		this.width=this._rect.width;
		this.height=this._rect.height;
		this._element.style.backgroundPosition = (-this._rect.x) + "px " + (-this._rect.y) + "px";
	}

	this._element.style.width =(this.width>0 ? this.width + "px" : "100%");
    this._element.style.height = (this.height>0 ? this.height + "px": "100%");
	
	if(hasUpdate){
		if(Global.supportTransform){
			this._element.style[origin] = "0% 0%";//Math.round(this.register_point.x) + "px " + Math.round(this.register_point.y) + "px";
	    	var css ="matrix("+matrix.a+","+matrix.b+","+matrix.c+","+matrix.d+","+matrix.tx+","+matrix.ty+")";
	    	this._element.style[transform] = css;
	    }else{
	    	this._element.style.top=matrix.ty+"px";
			this._element.style.left=matrix.tx+"px";
	    }
	}
	
	if(this._mask){
		var isSource=(this._mask instanceof Source);
		this._element.style[prefix + "MaskImage"] =  "url("+(isSource ? this._mask.image : this._mask).src+ ")";
		this._element.style[prefix + "MaskRepeat"] = "no-repeat";
		this._element.style[prefix + "MaskPosition"] = matrix.tx + "px " + matrix.ty + "px";
	}
	
	if(this.filters && this.filters.length>0){
		var filter;
		for (var i = 0, l = this.filters.length; i < l; i++)
		{
			filter=this.filters[i];
			if(filter==undefined) continue;
			filter.show(this._element);
		}
	}
    
    this._element.style.cursor = this.buttonMode ? "pointer" : this._cursor;
    this._element.style.pointerEvents = this.mouseEnabled ? "auto" : "none" ;
}

DOMDisplay.prototype._update_visible=function()
{
	if(this.parent==null) return;
	var bool=true,obj=this;
	
	for(obj=obj.parent; obj!=null; obj=obj.parent)
	{
		bool=(bool && obj.visible);
		if(!bool) break;
	}
	
	this._global_visible=bool;
}

DOMDisplay.prototype.hitTestPoint = function(x, y, usePolyCollision)
{
	return CollisionUtil.hitTestPoint(this, x, y, this.usePolyCollision)>0;
};

DOMDisplay.prototype.hitTestObject = function(object, usePolyCollision)
{
	return CollisionUtil.hitTestObject(this, object, this.usePolyCollision)>0;
};

DOMDisplay.prototype._display=function(bool)
{
	if(bool){
		try{
			if(this._element && this._element.parentNode==null){
				(this._parent_node ? this._parent_node : (Global.div ? Global.div : Global.canvas.parentNode)).appendChild(this._element);
			}
		}
		catch(err){
			trace("[ERROR]DOMDisplay _display()",this.name,err.message);
		}
	}else{
		if(this._element && this._element.parentNode) {
		   this._element.parentNode.removeChild(this._element);
	    }
	}
}

DOMDisplay.prototype.reset=function()
{
	if(this._parent){
		this.removeFromParent(false);
	}
	
	if(this._element && this._element.parentNode) {
		this._element.parentNode.removeChild(this._element);
	}
	
	if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
		ObjectPool.remove(this.instance);
	}
	
	this.instance=this._rect=this._mask=this._parent_node=this._element=null;
	this._global_visible=true;
	this._layer=this._depth=0;
	this.filters=[];
	this._cursor="";
	
	if(DOMDisplay.superClass) DOMDisplay.superClass.reset.call(this);
}

DOMDisplay.prototype.dispose = function()
{
	this.reset();
	if(DOMDisplay.superClass) DOMDisplay.superClass.dispose.call(this);
	delete this._cursor,this._global_visible,this.filters,this._layer,this.instance,this._rect,this._depth,this._element,this._parent_node,this._mask;
}

DOMDisplay.prototype.toString=function()
{
	return ["DOMDisplay"];
}

//----------------------------------------- DOMMovie -----------------------------------------

/**
===================================================================
DOMMovie Class
===================================================================
**/

function DOMMovie(s)
{
	DOMDisplay.call(this);
	
	this.label;
	this._frames=[];
	this._paused=true;
	this._replay_time=0;
	this._reverse_play=false;
	this._frame=this._current_frame=1;
	
	if(s) this.setFrames(s);
}

Global.inherit(DOMMovie,DOMDisplay);

DOMMovie.prototype.clearAllFrames=function()
{
	if(this._frames==undefined) return;
	
	var value;
	while(this._frames.length>0){
		value=this._frames.pop();
		this._remove_frame(value);
	}
	
	this._frame=this._current_frame=1;
	this._paused=true;
}

DOMMovie.prototype.setFrames=function(data)
{
	if(data==null) return;
	for(var i in data) this.addFrame(data[i]);
	if(this._frames.length>0) this.gotoAndPlay(1);
}

DOMMovie.prototype.addFrame=function (f,i)
{
	if(f==undefined || f==null || !(f instanceof Source)) return;
	
	if(i==undefined) this._frames.push(f);
	else             this._frames.splice(i, 0, f);
	
	this.width=Math.max(this.width,f.rect ? f.rect.width : 0,f.width);
	this.height=Math.max(this.height,f.rect ? f.rect.height : 0,f.height);
}

DOMMovie.prototype.getFrame=function (i)
{
	return (i>=0 && i<this._frames.length) ? this._frames[i] : null;
}

Object.defineProperty(DOMMovie.prototype,"totalFrame",{
    get: function () {
        return this._frames.length;
    },
    enumerable: true,
    configurable: true
});

/**
 * remove frame 
 * @param {Number} i
 */
DOMMovie.prototype.removeFrame=function (i)
{
	if(i<0 || i>=this._frames.length) return;
	var frame=this._frames.splice(i, 1);
	this._remove_frame(frame);
}

DOMMovie.prototype._remove_frame=function(frame)
{
	if(frame==undefined || frame==null) return;
	
	if(frame instanceof Source && frame.isClone){
		ObjectPool.remove(frame);
	}
	else if(frame instanceof DisplayObject){
		frame.removeFromParent(true);
	}
}

DOMMovie.prototype.play=function(time)
{
	this._replay_time=(time==undefined) ? 0 : time;
	this._paused=false;
}

DOMMovie.prototype.stop=function()
{
	this._paused=true;
}
	
DOMMovie.prototype.gotoAndStop=function(index)
{
	if(this._frames==undefined) return;
	
	if( typeof index == "string"){
		var i;
		var len=this._frames.length;
		
		for(i=0;i<len;i++){
			if(this._frames[i] && this._frames[i].label==index){
				index=Number(i)+1;
				break;
			}
		}
	}
	
	if(index<1 || index>this._frames.length) return;
	this._frame=index;
	this._paused=true;
}

DOMMovie.prototype.gotoAndPlay=function(index)
{
	this.gotoAndStop(index);
	this._paused=false;
}

DOMMovie.prototype.nextFrame=function()
{
	this._frame=this._reverse_play ? (this._current_frame<=1 ? this._frames.length : (this._current_frame-1)) : (this._current_frame>=this._frames.length ? 1 : (this._current_frame+1));
}

DOMMovie.prototype.render=function(object)
{
	if (!this.visible || this.alpha <= 0) {
		DOMMovie.superClass.render.call(this,object);
		return;
	}
	
	if((!this._paused || this.instance==null || (this._frame!=this._current_frame)) && this._frames.length>0) {
		this._current_frame=this._frame;
		var target=this._frames[this._current_frame-1];
		this.setInstance(target);
		this.label=target.animation+(StringUtil.isEmpty(target.label) ? "" :(":"+target.label));
		
		if(!this._paused){
			this.nextFrame();
			
			if(((this._reverse_play && this._current_frame<=1)||(!this._reverse_play && this._current_frame>=this._frames.length)) && this._replay_time>0){
				this._replay_time--;
				if(this._replay_time==0) {
					this._paused=true;
					this.dispatchEvent(Factory.c("ev",[Event.PLAY_OVER]));
				}
			}
		}
	}

	DOMMovie.superClass.render.call(this,object);
}

Object.defineProperty(DOMMovie.prototype,"reverse",{
    get: function () {
        return this._reverse_play;
    },
    /**
     * movie reverse play
     * @param {Boolean} value
     */
    set: function (value) {
        if(value==undefined || value==null || value==this._reverse_play) return;
		this._reverse_play=value;
    },
    enumerable: true,
    configurable: true
});

DOMMovie.prototype.reset=function()
{
	this.clearAllFrames();
	
	this.label=null;
	this._paused=true;
	this._replay_time=0;
	this._reverse_play=false;
	this._frame=this._current_frame=1;
	DOMMovie.superClass.reset.call(this);
}

DOMMovie.prototype.dispose=function()
{
	this.reset();
	DOMMovie.superClass.dispose.call(this);
	delete this._frame,this._reverse_play,this._frames,this._paused,this._current_frame,this.label,this._replay_time;
}

DOMMovie.prototype.toString=function()
{
	return ["DOMMovie"];
}

//----------------------------------------- DisplayObject -----------------------------------------

/**
===================================================================
DisplayObject Class
===================================================================
**/

DisplayObject.COUNT=0;

function DisplayObject()
{
	DisplayBase.call(this);
	
	this.filters=[];
	this._hitTestTolerance=100;
	this._usePixelTrace=false;
	this._useContext=false;
	this._repeat=false;
	this._mask=null;
	
	DisplayObject.COUNT=(DisplayObject.COUNT>9999) ? 0 : DisplayObject.COUNT;
	this.name="display_object_"+(DisplayObject.COUNT++);
	this.colorTransform=null;
	this._graphics=null;
	this.blendMode=null;
	this.polyArea=null;
}

Global.inherit(DisplayObject,DisplayBase);

Object.defineProperty(DisplayObject.prototype,"useContext",{
	get: function () {
	    return this._useContext;
    },

    set: function (value) {
    	if(value==undefined || this._useContext==value) return;
        this._useContext=value;
        
        if(this._useContext ) this._catchToContext();
        else this.context=this.canvas=null;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObject.prototype,"mask",{
	get: function () {
	    return this._mask;
    },

    set: function (value) {
    	if(value==undefined || value==null){
    		if(this._mask && this._graphics && this._graphics.context==this._mask) {
    			this._graphics.clear();
    		}
    		this._mask=null;
    		return;
    	}
    	
    	if(this._mask==value) return;
    	if(value instanceof DisplayObject && !value.useContext) value.useContext=true;
    	
    	if(value instanceof CanvasRenderingContext2D) this._mask=value;
    	else if(value instanceof Source)              this._mask=value;
    	else if(value.hasOwnProperty("context") && value.context) {
    		this._mask=value.context;
    	}
    	
    	if(this._mask) {
    		if(this._useContext) this._catchToContext();
    		else this.useContext=true;
    	}
    },
    enumerable: true,
    configurable: true
});

/**
 * repeat display
 * @param {Number} w
 * @param {Number} h
 * @param {String} t repeat|repeat-x|repeat-y|no-repeat
 */
DisplayObject.prototype.repeat= function(w,h,t)
{
	if(this.instance==undefined || t=="no-repeat" || this.instance.rect==undefined || (w<=this.instance.rect.width && h<=this.instance.rect.height)){
		this._repeat=false;
		return;
	}
	
	t = t || "repeat";
	
	this.width=w;
	this.height=h;
	this._repeat=true;
	
	if(this.canvas!=undefined){
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	}
	else CanvasUtil.create(this);
	
	this.canvas.height = this.height;
	this.canvas.width  = this.width;
		
	var ptrn=this.context.createPattern(this.instance.image,t);
	this.context.fillStyle = ptrn;
    this.context.fillRect(0,0,this.width,this.height);
}

DisplayObject.prototype._transform = function(target,obj)
{
	var _temp_context=(obj==undefined ? Global.context : obj.context);
	var mtx=this.getMatrix(target,true);
     _temp_context.transform(mtx.a, mtx.b, mtx.c, mtx.d, mtx.tx, mtx.ty);
	if(this.alpha>=0) _temp_context.globalAlpha*=this._alpha*this._parent_alpha;
}

DisplayObject.prototype.setInstance=function(target)
{
	if(target==undefined || target==null || this.instance==target) return target;
	
	if(target instanceof Image || ClassUtil.getQualifiedClassName(target)=="HTMLImageElement"){
		var temp=target;
		target=ObjectPool.create(Source);
		target.image=temp;
		target.isClone=true;
		target.reg=new Point();
		target.width=temp.width;
		target.height=temp.height;
		target.name=""+MathUtil.randomInt();
		target.rect=new Rectangle(0,0,temp.width,temp.height);
	}
	
	if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
		ObjectPool.remove(this.instance);
	}
	
	this.instance=target;
	this.name=target.name;
	this.register_point=(target.hasOwnProperty("reg")) ? target.reg : new Point();
	
	if(this._useContext) this._catchToContext();
	
	this.width=this.instance.rect.width;
	this.height=this.instance.rect.height;
	
	this._updateMatrix=true;
	this.__checkDisplayUpdate();
	this.dispatchEvent(Factory.c("ev",[DisplayBase.RESET_INSTANCE]));
	return this.instance;
}

Object.defineProperty(DisplayObject.prototype,"graphics",{
	get: function () {
        this._graphics =(this._graphics==undefined) ? ObjectPool.create(Graphics) : this._graphics;
	    return this._graphics;
    },

    set: function (value) {
    	if(value==undefined) return;
        this._graphics =value;
    },
    enumerable: true,
    configurable: true
});

DisplayObject.prototype._catchToContext=function()
{
	if(this.canvas!=undefined) this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	else CanvasUtil.create(this);
	
	if(this.instance==undefined) return;
	
	this.width = this.canvas.height = this.instance.rect.height;
	this.height = this.canvas.width  = this.instance.rect.width;
	
	if(this._mask) {
		var w=(this._mask instanceof Source) ? this._mask.rect.width : this._mask.canvas.width;
		var h=(this._mask instanceof Source) ? this._mask.rect.height : this._mask.canvas.height;
		
		this.canvas.width = Math.max(w,this.canvas.width);
		this.canvas.height = Math.max(h,this.canvas.height);
		
	    if (this._mask instanceof Source)  this.context.drawImage(this._mask.image,this._mask.rect.x,this._mask.rect.y,w,h,0,0,w,h);
	    else                               this.context.drawImage(this._mask.canvas,0,0);
        this.context.globalCompositeOperation = 'source-in';
        
        this.width = Math.min(w,this.width);
        this.height = Math.min(h,this.height);
	}
	
	this._render(this,true);
	if(!this._usePixelTrace) return;
	var temp=this.instance.clone();
	ObjectPool.remove(this.instance);
	this.instance=temp;
	
	this.instance.rect.x=this.instance.rect.y=0;
	this.instance.image=CanvasUtil.toImage(this.canvas);
}

/**
 * 刷新呈现
 * @param {CanvasRenderingContext2D} context
 * @param {Boolean} initial
 * @param {DisplayObjectContainer} package
 */
DisplayObject.prototype._render = function(target,initial,package)
{
	if (!this.visible || this.alpha <= 0) 
		return;
	
	var normal= initial || (!this._repeat && this._mask==undefined);
	var offset;
	
	if (target==undefined){
		Global.context.save();
	}
	
	if(initial==undefined || initial==false) this._transform(package,target);
	
	if(target==undefined){
		Global.context.globalCompositeOperation=this.blendMode;
	}
	
	if(target==undefined && this.filters && this.filters.length>0){
		var filter;
		for (var i = 0, l = this.filters.length; i < l; i++)
		{
			filter=this.filters[i];
			if(filter==undefined) continue;
			
			if(ClassUtil.getQualifiedClassName(filter)=="BlurFilter" && this._useContext) {
				if(this.canvas==undefined || this.context==undefined || this.instance==undefined || filter.radius<1) continue;
				normal=false;
				if(!filter.update) continue;
				this.context.drawImage(this.instance.image,this.instance.rect.x,this.instance.rect.y,this.instance.rect.width,this.instance.rect.height,0,0,this.instance.rect.width,this.instance.rect.height);
				filter.show(this.context,this.canvas.width,this.canvas.height);
                continue;
			}
			
			filter.show(Global.context);
		}
	}
	
	if(this.instance!=undefined && normal){
		(target!=undefined ? target.context : Global.context).drawImage(
			                 this.instance.image,
	                         this.instance.rect.x,
	                         this.instance.rect.y,
	                         this.instance.rect.width,
	                         this.instance.rect.height,
	                         0,0,this.instance.rect.width,
	                         this.instance.rect.height);
	    
	}
	
	else if(this.canvas!=undefined){
		(target!=undefined ? target.context : Global.context).drawImage(this.canvas,0,0);
	}
	
	if(this.colorTransform && target==undefined){
		var posX=this.origin.x;
		var posY=this.origin.y;
		var rectangle=new Rectangle(0,0,this.width,this.height);
		CanvasUtil.colorTransform(Global.context,new Rectangle(this.x-posX,this.y-posY,this.width,this.height),this.colorTransform,this.context,rectangle);
	}

	if(this._graphics!=undefined && this._graphics.context!=this._mask){
		(target!=undefined ? target.context : Global.context).drawImage(this._graphics.canvas,0,0);
	}
	
	if (target==undefined) Global.context.restore();
}

DisplayObject.prototype.render = function()
{
	this._render.apply(this,arguments);
}

/**
 * 碰撞点测试 (注意是全局坐标)
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} usePixelTrace
 */
DisplayObject.prototype.hitTestPoint = function(x,y, usePixelTrace) 
{
	var bool=CollisionUtil.hitTestPoint(this,x,y, this.usePolyCollision)>0 ;
	
	if ((this.context==undefined && this._graphics==undefined) || !usePixelTrace  || !this._usePixelTrace || !bool) {
		return bool;
	}

	var locale = this.globalToLocal(x, y);
	var pixel_aphla=CanvasUtil.getPixelAphla(this.context ? this.context : this._graphics.context ,locale.x,locale.y);
    bool=(pixel_aphla >= this._hitTestTolerance);
	return bool;
}

/**
 * 碰撞测试
 * @param {displayObject} obj
 * @param {Boolean} usePixelTrace
 */
DisplayObject.prototype.hitTestObject = function(obj, usePixelTrace) 
{
	if(obj==null || !(obj instanceof DisplayBase) ) return false;
	if(obj==this) return true;
	
	this.stage=(this.stage==undefined) ? Stage.current : this.stage;
	
	var f = this.getBounds(this.stage),
		g = obj.getBounds(this.stage),
		e = this._hitTestTolerance;
		
	var bool = CollisionUtil.hitTestObject(this,obj,this.usePolyCollision);

	if ((this.context==undefined && this._graphics==undefined) || !usePixelTrace || !this._usePixelTrace || !bool || this.usePolyCollision) return bool;
	
	f = f.intersection(g);
	var temp;

	if (f && f.width > 0 && f.height > 0) {
		try {
           var locale=this.globalToLocal(f.x,f.y);
           if(this.scaleX<0) locale.x-=this.getWidth();
	       if(this.scaleY<0) locale.y-=this.getHeight();
           
           if(this.context==undefined){
           	    temp=CanvasUtil.create();
                this._render(temp,true);
                temp=temp.context;
           }
           else temp=this.context;
           
			var h = temp.getImageData(locale.x, locale.y, f.width, f.height).data;

		    locale= obj.globalToLocal(f.x,f.y);
		    if(obj.scaleX<0) locale.x-=obj.getWidth();
	        if(obj.scaleY<0) locale.y-=obj.getHeight();
		    
		    if(obj.context==undefined){
           	    temp=CanvasUtil.create();
                obj._render(temp,true);
                temp=temp.context;
           }
           else temp=obj.context;
           
		    var j = temp.getImageData(locale.x, locale.y, f.width, f.height).data;
		    
			for (var b = 0; b < h.length;b +=4) {
				if ((h[b] > 0 || h[b + 1] > 0 || h[b + 2] > 0 || h[b + 3] >= e) && (j[b] > 0 || j[b + 1] > 0 || j[b + 2] > 0 || j[b + 3] >= e)) {
					return true;
				}
			}
		} 
		catch (err) {};
	}
	
	return false;
}

DisplayObject.prototype.reset =function()
{	
	if(this._parent){
		this.removeFromParent(false);
	}
	
	if(this.canvas && this.canvas.parentNode) {
		this.canvas.parentNode.removeChild(this.canvas);
	}
	
	if(this.instance && (this.instance instanceof Source) && this.instance.isClone){
		ObjectPool.remove(this.instance);
	}
	
	if(this._mask && this._mask instanceof Source){
		ObjectPool.remove(this._mask);
	}
	
	if(this._graphics)  {
        ObjectPool.remove(this._graphics);
	}
	
	this.mask=this.instance=this._graphics=this.colorTransform=this.context=this.canvas=this.blendMode=null;
	this._usePixelTrace=this._useContext=this._repeat=false;
	this._hitTestTolerance=100;
	this.filters=[];
	
	if(DisplayObject.superClass) DisplayObject.superClass.reset.call(this);
}

DisplayObject.prototype.dispose = function()
{
	this.reset();
	if(DisplayObject.superClass) DisplayObject.superClass.dispose.call(this);
	delete this._useContext,this._repeat,this.filters,this._mask,this.instance,this.colorTransform,this.blendMode,this.context,this.canvas,this._usePixelTrace,this._hitTestTolerance;
}

DisplayObject.prototype.toString = function()
{
	return "DisplayObject";
}


//----------------------------------------- Media -----------------------------------------

/**
===================================================================
Media Class
===================================================================
**/

Media.Container = {
	ll_save : 0,
	time : 0,
	list : [],
	enterFrame : function () {
		var c = Media.Container;
		var t = (new Date()).getTime();
		c.time = t - (c.ll_save ? c.ll_save : t);
		c.ll_save = t;
		var l = c.list;
		for (var i = l.length - 1; i >= 0; i--) {
			if (l[i]) {
				l[i].ll_check();
			}
		}
	},
	add : function (obj) {
		if (Media.Container.list.indexOf(obj) >= 0) {
			return;
		} 
		Media.Container.list.push(obj);
	},
	remove : function (obj) {
		var l = Media.Container.list;
		for (var i = l.length -1; i >= 0; i--) {
			if (l[i] == obj) {
				l.splice(i,1);
				break;
			}
		}
	},
	stopOther : function (obj) {
		var l = Media.Container.list;
		for (var i = l.length - 1; i >= 0; i--) {
			if (l[i]!= obj) {
				l[i].stop();
			}
		}
	},
	muteAll : function (bool){
		var l = Media.Container.list;
		for (var i = l.length - 1; i >= 0; i--) {
			l[i].setVolume(bool ? 0 : 1);
		}
	}
};

function Media()
{
	DisplayObject.call(this);
	
	this.buffer_count = 0;
	this.buffer_total = 600;
	this.loadFail     = false;
	
	this.length = 0;
	this.loopIndex = 0;
	this.loopLength = 1;
	this.playing = false;
	this.oncomplete = null;
	this.onsoundcomplete = null;
	this.currentStart = 0;
	Media.Container.add(this);
};

Global.inherit(Media,DisplayObject);

Media.MEDIA_LOAD_COMPLETE="mediaLoadComplete";
Media.MEDIA_PLAY_COMPLETE="mediaPlayComplete";

Media.prototype.onload =function () 
{
	if (this.element.readyState || this.loadFail) {
		this.buffer_count=0;
		this.length = this.loadFail ? 0 : this.element.duration - (Global.android ? 0.1 : 0);
		this.dispatchEvent(Factory.c("ev",[Media.MEDIA_LOAD_COMPLETE]));
		this.removeEventListener(Media.MEDIA_LOAD_COMPLETE);
		return;
	}
	
	this.element.addEventListener("oncanplay", Global.delegate(this.onload, this), false);
};

Media.prototype._onended = function () 
{
	var s = this, i, l;

	if (++s.loopIndex < s.loopLength) {
		i = s.loopIndex;
		l = s.loopLength;
		s.close();
		s.play(s.currentStart, s.loopLength, s.currentTimeTo);
		s.loopIndex = i;
	} else {
		s.close();
	}
	
	s.dispatchEvent(Factory.c("ev",[Media.MEDIA_PLAY_COMPLETE]));
};

Media.prototype.load = function (u) 
{
	var s = this;
	if (Object.prototype.toString.apply(u) == "[object HTMLAudioElement]") {
		s.element = u;
		s.onload();
		return;
	}
	var a, b, c, k, d, q = {"mov" : ["quicktime"], "3gp" : ["3gpp"], "midi" : ["midi"], "mid" : ["midi"], "ogv" : ["ogg"], "m4a" : ["acc"], "mp3" : ["mpeg"], "wav" : ["wav", "x-wav", "wave"], "wave" : ["wav", "x-wav", "wave"], "aac" : ["mp4", "aac"]};
	a = u.split(',');
	for (k = 0; k < a.length; k++) {
		b = a[k].split("?")[0];
		b = b.split('.');
		d = b[b.length - 1];
		if (q[d]) {
			d = q[d];
		} else {
			d = [d];
		}
		c = d.some(function (name, index, array) {
			return s.element.canPlayType(s._type + "/" + name);
		});
		
		if (c || (!StringUtil.isEmpty(a[k]) && a[k].indexOf("blob:")==0)) {
			s.element.src = a[k];
			
			s.onload();
			s.element.load();
			return;
		} else {
			trace( "Not support " + b[b.length - 1] + " : " + a[k]);
			s.dispatchEvent(Factory.c("ev",[Media.MEDIA_LOAD_COMPLETE]));
		}
	}
	if (s.oncomplete) {
		s.oncomplete({});
	}
};

Media.prototype.getCurrentTime = function () 
{
	return this.element.currentTime;
};

Media.prototype.setVolume = function (v) 
{
	if(this.element.volume == v) return;
	this.element.volume = v;
};

Media.prototype.getVolume = function ()
{
	return this.element.volume;
};

Media.prototype.play = function (c, l, to) 
{
	var s = this;
	if (s.length == 0) {
		return;
	}
	if (Global.android) {
		Media.Container.stopOther(this);
	}
	if (c != undefined) {
		try{
			s.element.currentTime = c;
		}
		catch(err){}
		
		s.currentStart = c;
	}
	if (l != undefined) {
		s.loopLength = l;
	}
	if (to !== undefined) {
		s.currentTimeTo = to > s.length ? s.length : to;
	} else {
		s.currentTimeTo = s.length;
	}

	if (s.timeout) {
		clearTimeout(s.timeout);
		delete s.timeout;
	}
	s.timeout = setTimeout(function(){
		s._onended();
	}, (s.currentTimeTo - s.element.currentTime) * 1000);
	
	s.element.loop = false;
	s.loopIndex = 0;
	s.playing = true;
	s.element.play();
};

Media.prototype.stop = function () 
{
	var s = this;
	if (!s.playing) {
		return;
	}
	if (s.timeout) {
		clearTimeout(s.timeout);
		delete s.timeout;
	}
	s.playing = false;
	s.element.pause();
};

Media.prototype.close = function () 
{
	var s = this;
//	if (!s.playing) {
//		return;
//	}
	if (s.timeout) {
		clearTimeout(s.timeout);
		delete s.timeout;
	}
	s.playing = false;
	
	try{
		s.element.currentTime = 0;
	}
	catch(err){}
	
	s.element.pause();
	
	try{
		s.element.src=s.element.src;
	}
	catch(err){}
};

Media.prototype.ll_check = function () 
{
	var s = this;
	if (!s.playing) {
		if(s.hasEventListener(Media.MEDIA_LOAD_COMPLETE)) {
			if(s.element.readyState>1 || s.buffer_count>=s.buffer_total){
				this.loadFail=(s.buffer_count>=s.buffer_total);
				s.onload();
			}
			else s.buffer_count++;
		}
		return;
	}
	if(s.element.duration != s._ll_duration){
		s._ll_duration = s.element.duration;
		s.length = s.element.duration - (Global.android ? 0.1 : 0);
	}
	if (s.currentTimeTo < s.element.currentTime + Media.Container.time * 0.005) {
		s._onended();
	}
};

Media.prototype.dispose = function () 
{
	var s = this;
	if (s.timeout) {
		clearTimeout(s.timeout);
		delete s.timeout;
	}
	
	if(Media.superClass) Media.superClass.dispose.call(this);
	Media.Container.remove(this);
	delete this.element;
};

//----------------------------------------- Video -----------------------------------------

/**
===================================================================
Video Class
===================================================================
**/


function Video()
{
	Media.call(this);
	this._type="video";

    this.element = document.createElement("video");
//	this.element.style.display = "none";
	
	Video.COUNT=Video.COUNT>999 ? 0 : Video.COUNT;
    this.name="video_"+(Video.COUNT++);
    this.element.id=this.name;
	this.element.width  = "100%";
	this.element.height = "100%";
	
//	this.element.loop     = "loop";
//	this.element.autoplay = "autoplay";
	this.element.controls = "controls";
	this.element.preload  = "auto";//none、metadata、auto
	
	if(Video.POSTER){
		this.element.poster=Video.POSTER;
	}
	
	this.canvas = this.element;
}

Global.inherit(Video,Media);

Video.prototype.getWidth = function()
{
	return MathUtil.format(Math.abs(this.element.videoWidth * this.scaleX));
}
		
Video.prototype.getHeight = function()
{
	return MathUtil.format(Math.abs(this.element.videoHeight * this.scaleY));
}

Video.prototype.dispose = function()
{
	if(this.element && this.element.parentNode){
		this.element.parentNode.removeChild(this.element);
		delete this.element;
	}
	
	this.canvas=null;
	Video.superClass.dispose.call(this);
}

Video.POSTER;
Video.COUNT=0;

//----------------------------------------- Sound -----------------------------------------

/**
===================================================================
Sound Class
===================================================================
**/

function Sound()
{
	Media.call(this);
	this._type="audio";
	
	this.element = document.createElement("audio");
//	this.element.autoplay = "autoplay";
//	this.element.loop     = "loop";
}

Global.inherit(Sound,Media);

//----------------------------------------- DisplayObjectContainer -----------------------------------------

/**
===================================================================
DisplayObjectContainer Class
===================================================================
**/
function DisplayObjectContainer()
{
	DisplayBase.call(this);
	
	DisplayObjectContainer.COUNT=(DisplayObjectContainer.COUNT>9999) ? 0 : DisplayObjectContainer.COUNT;
	this.name="container_"+(DisplayObjectContainer.COUNT++);
	this.mouseChildren=true;
	this.autoSize = false;
	this._parentNode=null;
	this._children=[];
}

DisplayObjectContainer.COUNT=0;
DisplayObjectContainer._num_canvas_target=0;
Global.inherit(DisplayObjectContainer,DisplayBase);

Object.defineProperty(DisplayObjectContainer.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		this._stage=value;
		
		if(this._children==undefined || this._children.length<1) return;
		var i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.stage=value;
		}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObjectContainer.prototype,"alpha",{
	get: function (){
		return this._alpha;
	},
    set: function (value) {
        if(this._alpha==value) return;
		this._alpha=value;
		this.__checkDisplayUpdate();
		this._update_parent_alpha();
    },
    enumerable: true,
    configurable: true
});

DisplayObjectContainer.prototype._update_parent_alpha=function()
{
	if(this._children.length<1) return;
	var i,c,l;
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		c._parent_alpha=this._alpha*this._parent_alpha;
		if(c instanceof DisplayObjectContainer) c._update_parent_alpha();
	}
}

Object.defineProperty(DisplayObjectContainer.prototype,"visible",{
	get: function (){
		return this._visible;
	},
    set: function (value) {
        if(this._visible==value) return;
		this._visible=value;
		this.__checkDisplayUpdate();
		
		if(this._children.length<1) return;
		this._update_child_visible();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObjectContainer.prototype,"updateMatrix",{
	get: function (){
		return this._updateMatrix;
	},
    set: function (value) {
        if(value) this.__checkDisplayUpdate();
    	
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
		
		if(value && this._bounds) this._bounds.width=this._bounds.heigth=0;
		
		if(!value || this._children.length<1) return;
		var i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.updateMatrix=true;
		}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObjectContainer.prototype,"parentNode",{
	get: function (){
		return this._parentNode;
	},
    set: function (value) {
        if(this._parentNode==value) return;
		this._parentNode=value;
		
		if(this._children.length<1) return;
		var i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			if(!(c instanceof DisplayObject)) c.parentNode=value;
		}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(DisplayObjectContainer.prototype,"numChildren",{
	get: function (){
		return this._children.length;
	},
    enumerable: true,
    configurable: true
});

DisplayObjectContainer.prototype._update_child_visible=function()
{
	var i,c,l;
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		
		if(c instanceof DisplayObjectContainer)
			c._update_child_visible();
		else if(c instanceof DOMDisplay) 
			c._update_visible();
	}
}

DisplayObjectContainer.prototype.addChild=function(displayObject)
{
	if(displayObject==undefined) return ;
	return this.addChildAt(displayObject,this._children.length);
}

DisplayObjectContainer.prototype.addChildAt=function(displayObject,index)
{
	if(displayObject==undefined) return ;
	
	displayObject.parent && displayObject.parent.removeChild(displayObject);
	this._children.splice(index, 0, displayObject);
	
	if(displayObject instanceof DisplayObject) DisplayObjectContainer._num_canvas_target++;
	else displayObject.parentNode=this._parentNode;
	
	displayObject._parent_alpha=this._alpha*this._parent_alpha;
	displayObject.updateMatrix=true;
	displayObject.stage=this.stage;
	displayObject.parent=this;
	
	if(this.autoSize) {
		this._updateSize();
	}else{
		this.width=Math.max(this.width,displayObject.getWidth());
		this.height=Math.max(this.height,displayObject.getHeight());
	}
	
	return displayObject;
}

DisplayObjectContainer.prototype._updateSize=function()
{
	if(this._children==undefined || this._children.length==0) return;
	
	var i,c,l, bounds,rect=new Rectangle();
	
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		bounds= c.getBounds(this);
		rect=rect.union(bounds);
	}
	
	this._minX=Math.floor(rect.x);
	this._minY=Math.floor(rect.y);
	
	this._width=Math.ceil(rect.width);
	this.height=Math.ceil(rect.height);
}

DisplayObjectContainer.prototype.removeChild=function(displayObject)
{
	return this.removeChildAt(this._children.indexOf(displayObject));
}

DisplayObjectContainer.prototype.removeChildAt=function(index)
{
	if (index < 0 || index > (this._children.length - 1)) return null;
	var displayObject=this._children[index];
	displayObject.stage=displayObject.parent=null;
	this._children.splice(index,1);
	displayObject._parent_alpha=1;
	
	if(this._children.length==0) this.width=this.height=0;
	else if(this.autoSize)  this._updateSize();
	
	if(displayObject instanceof DisplayObject) DisplayObjectContainer._num_canvas_target--;
	else displayObject.parentNode=null;
	
	return displayObject;
}

DisplayObjectContainer.prototype.getChildByName=function(name)
{
	if(StringUtil.isEmpty(name)) return;
	
	var i;
	var len=this._children.length;
	
	for (i=0; i < len; i++) 
	{
		if (this._children[i].name == name) return this._children[i];
	}
	return null;
}

DisplayObjectContainer.prototype.getChildAt=function(index)
{
	if (index < 0 || index > (this._children.length - 1)) return null;
	return this._children[index];
}

DisplayObjectContainer.prototype.removeAllChildren=function(bool)
{
	if(this._children==undefined || this._children.length<1) return;
	
	var i,c,l;
	for (i = 0,l=this._children.length;i<l;i++) {
		c = this._children[i];
		c.stage=c.parent=null;
		c._parent_alpha=1;
		
		if(c instanceof DisplayObject) DisplayObjectContainer._num_canvas_target--;
		else c.parentNode=null;
		
		if(bool && !Global.gc(c)){
			try{
				c.dispose();
			}
			catch(e){}
		}
		
	}
	
	this._children=[];
	this.width=this.height=0;
}

DisplayObjectContainer.prototype.contains=function(displayObject)
{
	return this._children.indexOf(displayObject)!=-1;
}

DisplayObjectContainer.prototype.render=function()
{
	if(this._children==undefined || this._children.length==0) return;
	
	var i,child;
	
	for (i=0; i < this._children.length; i++) {
		child=this._children[i];
		if(this.visible || (child instanceof DOMDisplay)) child.render.apply(child,arguments)
	}
	
	this._updateMatrix=false;
}

DisplayObjectContainer.prototype.swapChildrenAt=function(index1, index2)
{
	var len=this._children.length;
	if(len==0 || index1>=len || index1<0) return;
	
	index2=index2<0 ? 0 :(index2>=len ? len-1 : index2);
    var temp=this._children[index1];
    this._children[index1]=this._children[index2];
    this._children[index2]=temp;
}

DisplayObjectContainer.prototype.setChildIndex=function(child, index)
{
	var pos=this._children.indexOf(child);
	if(child==null || pos<0 || pos==index) return;
	this.addChildAt(child, index);
}

/**
 * 点碰撞子对象 
 * all true-返回所以碰撞列表  false-返回最上层碰撞对象
 * @param {Number} x
 * @param {Number} y
 * @param {Boolean} usePixelTrace
 * @param {Boolean} all
 */
DisplayObjectContainer.prototype.getObjectUnderPoint = function(x, y, usePixelTrace,all) 
{
	if (all) var g = [];
	
	for (var i = this._children.length - 1; i >= 0; i--) {
		var h = this._children[i];
		if (h == null || !h.visible) continue;
		
		if ((h instanceof DisplayObjectContainer) && h.mouseChildren && h.numChildren > 0) {
			var j = h.getObjectUnderPoint(x, y, usePixelTrace, all);
			if (j){
				if (!all) return j;
				if(j.length > 0) g = g.concat(j);
			}else if (h.mouseEnabled && h.hitTestPoint(x, y, usePixelTrace)){
				if (!all) return h;
				g.push(h);
			}
		} else if (h.mouseEnabled && h.hitTestPoint(x,y, usePixelTrace)){
			if (!all) return h;
			g.push(h);
		}
	}
	
	return all ? g : null;
}

DisplayObjectContainer.prototype.hitTestPoint = function(x,y, usePixelTrace) 
{
	if(this._children.length<=0) return false;
	
	if(!this.mouseChildren && this.autoSize){
		return CollisionUtil.hitTestPoint(this,x,y, this.usePolyCollision)>0 ;
	}
	
	for (var i = this._children.length - 1; i >= 0; i--) {
		var h = this._children[i];
		if(this.usePolyCollision && !h.usePolyCollision) h.usePolyCollision=true;
		if(h.hitTestPoint(x,y, usePixelTrace)) return true;
	}
	
	return false;
}

DisplayObjectContainer.prototype.hitTestObject = function(obj, usePixelTrace) 
{
	var i,h,j,g;
	
	for (i = this._children.length - 1; i >= 0; i--) {
		h = this._children[i];
		if(!(obj instanceof DisplayObjectContainer)) {
			if(h.hitTestObject(obj,usePixelTrace)) return true;
			continue;
		}
		
		for (j = obj._children.length - 1; j >= 0; j--) {
		    g = obj._children[i];
		    if(h.hitTestObject(g,usePixelTrace)) return true;
		}
	}
	
	return false;
}

DisplayObjectContainer.prototype.catchAsImage=function ()
{
	if(this._children.length<=1) return;
	
	this._updateSize();
	var image=CanvasUtil.containerToImage(this);
	this.removeAllChildren(true);
	
	var display_obj=Factory.c("do");
	display_obj.setInstance(image);
	this.addChild(display_obj);
}

DisplayObjectContainer.prototype.reset=function()
{
	this.parentNode=null;
	this.removeAllChildren(true);
	
	this.name=null;
	this.autoSize = false;
	this.mouseChildren=true;
	
	DisplayObjectContainer.superClass.reset.call(this);
}

DisplayObjectContainer.prototype.dispose=function()
{
	DisplayObjectContainer.superClass.dispose.call(this);
	delete this._parentNode,this.autoSize,this._children,this.mouseChildren;
}

DisplayObjectContainer.prototype.toString=function()
{
	return ["DisplayObjectContainer"];
}
//----------------------------------------- Sprite -----------------------------------------


function Sprite()
{
	DisplayObjectContainer.call(this);
	this._mask=this.div=null;
}

Global.inherit(Sprite, DisplayObjectContainer);

Object.defineProperty(Sprite.prototype,"parentNode",{
	get: function (){
		return this._parentNode;
	},
    set: function (value) {
        if(this._parentNode==value) return;
		this._parentNode=value;
		
		if(this._parentNode && this.div){
			if(this.div.parentNode) this.div.parentNode.removeChild(this.div);
			this._parentNode.appendChild(this.div);
		}
	},
    enumerable: true,
    configurable: true
});

Object.defineProperty(Sprite.prototype,"parent",{
	get: function (){
		return this._parent;
	},
    set: function (value) {
        if(this._parent==value) return;
		this._parent=value;
		
		if(Global.useCanvas) return;
		
		if(this._parent==undefined){
			if(this.div && this.div.parentNode) this.div.parentNode.removeChild(this.div);
			return;
		}

		if(this.div==undefined){
			this.div=DOMUtil.createDOM("div",{id: "sprite_"+this.name});
		}
		
		this.div.style.position="absolute";
		(this._parentNode ? this._parentNode : (this._parent.parentNode ? this._parent.parentNode : (this._parent.div ? this._parent.div : Global.div))).appendChild(this.div);
		
		if(this._mask && this.div){
    		this.div.style.width=this.width+"px";
    		this.div.style.height=this.height+"px";
    		this.div.style.overflow="hidden";
    	}
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(Sprite.prototype,"mask",{
	get: function () {
	    return this._mask;
    },

    set: function (value) {
    	if(value==undefined || value==null){
    		this._mask=null;
    		return;
    	}
    	
    	if((value && !(value instanceof Rectangle))) return;
        this._mask=value;
        
        if(this._mask==undefined) {
        	if(this.div){
        		this.div.style.overflow="auto";
			}
        	return;
        }
        
    	this.autoSize=false;
    	this.width=Math.ceil(this._mask.width);
    	this.height=Math.ceil(this._mask.height);
    	
    	if(!Global.useCanvas){
    		this._mask.x=this._mask.y=0;
    		
    		if(this.div==undefined) return;
    		this.div.style.width=this.width+"px";
    		this.div.style.height=this.height+"px";
    		this.div.style.overflow="hidden";
    	}
    },
    enumerable: true,
    configurable: true
});

Sprite.prototype.addChildAt=function(displayObject,index)
{
	var obj=Sprite.superClass.addChildAt.call(this,displayObject,index);
	if(Global.useCanvas) return obj;
	
	if(this.div==undefined){
		this.div=DOMUtil.createDOM("div",{id: "sprite_"+this.name});
	}
	
	if(obj) obj.parentNode=this.div;
	return obj;
}

Sprite.prototype.render=function(object)
{
	if(this._children==undefined || this._children.length==0) return;
	
	if(!this.visible){
		if(this.div) this.div.style.display="none";
		return;
	}
	
	var i,len;
	
	if(this._mask && Global.useCanvas){
		var obj=this.getMatrix().applyDisplay();
		var copy=this._mask.clone();
		copy.multiply(obj.scaleX,obj.scaleY);
		var offset,points,radians=MathUtil.getRadiansFromDegrees(obj.rotation);
		
		Global.context.save();
		Global.context.beginPath();
		
		points=copy.rotation(radians,this.origin,{x:obj.x,y:obj.y});
		Global.context.moveTo(points[0].x, points[0].y);
		len=points.length;
		
		for (i=1;i<len;i++)
			Global.context.lineTo(points[i].x, points[i].y);

		Global.context.closePath();
		Global.context.clip();
	}
	
	if(!Global.useCanvas){
		DOMDisplay._depth_count++;
		
		if(this.div){
			this.div.style.display="";
			this.div.style.zIndex = Global.layer+DOMDisplay._depth_count;
			
			var prefix = Global.cssPrefix, 
				origin = prefix + "TransformOrigin", 
				transform = prefix + "Transform";
		
		    var hasUpdate=this._updateMatrix;
			var matrix=this.getMatrix(object);
			
			if(Global.supportTransform){
				this.div.style[origin] = "0% 0%";
		    	var css ="matrix("+matrix.a+","+matrix.b+","+matrix.c+","+matrix.d+","+matrix.tx+","+matrix.ty+")";
		    	this.div.style[transform] = css;
		    }else{
		    	this.div.style.top=matrix.ty+"px";
				this.div.style.left=matrix.tx+"px";
		    }
		}
	}
	
	len=this._children.length;
	
	for (i=0; i < len; i++) {
		this._children[i].render.apply(this._children[i],[(!Global.useCanvas && this.div) ? this : object])
	}
	
	if(this._mask && Global.useCanvas){
		Global.context.restore();
	}
	
	this._updateMatrix=false;
}

Sprite.prototype.getObjectUnderPoint = function(x, y, usePixelTrace,all) 
{
	if(this._mask && this._checkTouch(x, y)) return null;
	return Sprite.superClass.getObjectUnderPoint.call(this,x, y, usePixelTrace,all);
}

Sprite.prototype.hitTestPoint = function(x,y, usePixelTrace) 
{
	if(this._mask && this._checkTouch(x, y)) return false;
	return Sprite.superClass.hitTestPoint.call(this,x, y, usePixelTrace);
}

Sprite.prototype._checkTouch=function(x,y)
{
	var pos=this.localToGlobal(this._mask.x,this._mask.y);
	var obj=this.getMatrix().applyDisplay();
	var rect=new Rectangle(pos.x,pos.y,this._mask.width*obj.scaleX,this._mask.height*obj.scaleY);
	var radians=MathUtil.getRadiansFromDegrees(360+obj.rotation);
	if(radians==0 || !this.usePolyCollision) return !rect.contains(x,y);
	var data=Rectangle.rectangleByRadians(rect,radians,this.origin);
	return CollisionUtil.hitTestPoint(data, x, y, radians!=0)<0;
}

Sprite.prototype.dispose=function()
{	
	if(this.div && this.div.parentNode){
		this.div.parentNode.removeChild(this.div);
	}
	
	this.mask=null;
	Sprite.superClass.dispose.call(this);
	delete this._mask,this.div,this.svg;
}
//----------------------------------------- UIBase -----------------------------------------


function UIBase()
{
	Sprite.call(this);
	this._auto_dispose=true;
	this._register_instance=null;
}

Global.inherit(UIBase, Sprite);

Object.defineProperty(UIBase.prototype,"instance",{
	get: function () {
	    return this._register_instance;
    },

    set: function (value) {
    	var depth=0;
    	
    	if(this._register_instance!=null) {
    		depth=this._register_instance.getIndex();
    		depth=Math.max(0,depth);
    		
			this._register_instance.removeFromParent(this._auto_dispose);
			this._register_instance =null;
		}
    	
    	if(value==null) return;
    	
        this._register_instance =value;
        this.addChildAt(this._register_instance,depth);
        
        this._updateSize();
        this.initialize();
    },
    enumerable: true,
    configurable: true
});

UIBase.prototype.initialize=function()
{	
}

UIBase.prototype.dispose=function()
{	
	this._register_instance.removeFromParent(true);
	this._register_instance=null;
	UIBase.superClass.dispose.call(this);
	delete this._register_instance,this._auto_dispose;
}

UIBase.prototype.toString = function()
{
	return "UIBase";
}
//----------------------------------------- UIContainer -----------------------------------------


function UIContainer()
{
	UIBase.call(this);
	
	/**
	 * 超出范围后 弹回的时间
	 */
	this.back_time=0.16;
	
	/**
	 * 允许超出范围的百分比
	 */
	this.out_percent=0.5;
	
	/**
	 * 时间系数 越大惯性移动越平滑
	 */
	this.time_ratio=0.0014;
	
	/**
	 * 惯性移动的速度系数 越大越敏感
	 */
	this.inertia_ratio=1.2;
	
	/**
	 * 惯性移动的长度 最大与最小值
	 */
	this.min_migration_length=1;
	this.max_migration_length=10;
	
	/**
	 * 缓动效果
	 */
	this.back_ease="easeoutquad";
	
	this._orientation=0;
	this._overflow=false;
	
	this._press_point=null;
	this._drag_area=null;
	this._inertia=false;
	this._drag_time=0;
	
	this._initial_width=this._initial_height=this._mask_width=this._mask_height=0;
}

Global.inherit(UIContainer, UIBase);

UIContainer.DRAG_MOVE="drag_container";

/**
 * 设置显示范围
 * @param {Number} w
 * @param {Number} h
 * @param {Number} orientation (UIOrientation) 允许拖拽的方向
 * @param {Boolean} overflow 是否支持超出范围拖拽
 * @param {Boolean} inertia  是否支持拖拽惯性移动
 */
UIContainer.prototype.setDimension=function(w,h,orientation,overflow,inertia)
{
	this._initial_width=this._mask_width=w;
	this._initial_height=this._mask_height=h;
	
	this._inertia=inertia;
	this._overflow=overflow;
	this.max_migration_length=Math.floor(Math.max(w,h)*1.2);
	
	if(orientation!=undefined) this._orientation=orientation;
	if(this._register_instance!=undefined) this._control_orientation();
}

UIContainer.prototype.initialize=function()
{	
	if(this._register_instance && (this._register_instance instanceof DisplayObjectContainer)) this._register_instance._updateSize();
	if(this._register_instance!=undefined && this._mask_width>0 && this._mask_height>0) this._control_orientation();
}

UIContainer.prototype._control_orientation=function()
{	
	if(this._mask_width>0 && this._mask_height>0) {
		var rect=this._mask ? this._mask : new Rectangle();
		rect.height=this._mask_height;
		rect.width=this._mask_width;
		this.mask=rect;
	}
	
	if(this._orientation==0) return;
	this._register_instance.addEventListener(DisplayBase.RESIZE,Global.delegate(this._reset_hold_control,this),this.name);
	this._reset_hold_control(null);
}

UIContainer.prototype._reset_hold_control=function(e)
{
	var bool=(((this._orientation==UIOrientation.isX || this._orientation==UIOrientation.isXY) && this._register_instance.width>this._mask_width) || ((this._orientation==UIOrientation.isY || this._orientation==UIOrientation.isXY) && this._register_instance.height>this._mask_height));
	this.mouseEnabled=this._register_instance.mouseEnabled=bool;
	
	if(bool) {
		if(!this._register_instance.hasEventListener(StageEvent.MOUSE_DOWN))
			this._register_instance.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_drag_handler,this),this.name);
    }
	else {
		this._register_instance.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);
		this._register_instance.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
	}
}

UIContainer.prototype._mouse_drag_handler=function(e)
{
	var pos=this.localToGlobal(0,0);
	var pos2=this._register_instance.localToGlobal(0,0);
	
	var w=(this._orientation==UIOrientation.isY) ? 0 : Math.max(0,this._register_instance.getWidth()-this._mask_width);
	var h=(this._orientation==UIOrientation.isX) ? 0 : Math.max(0,this._register_instance.getHeight()-this._mask_height);

    var free;
    if(this._overflow){
    	free=new Rectangle(w>0 ? pos.x-w : pos2.x,h>0 ? pos.y-h : pos2.y,w,h);
    }
    
	w=w>0 ? w+(this._overflow ? this._mask_width*this.out_percent : 0) : 0;
	h=h>0 ? h+(this._overflow ? this._mask_height*this.out_percent : 0) : 0;
	
	var rect=new Rectangle(w>0 ? pos.x-w : pos2.x,h>0 ? pos.y-h : pos2.y,w>0 ? w+(this._overflow ? this._mask_width*this.out_percent : 0) : 0,h>0 ? h+(this._overflow ? this._mask_height*this.out_percent : 0) : 0);
	
	if(this._inertia){
		this._drag_area=free ? free : rect;
    	this._drag_time=new Date().getTime();
		this._press_point=new Point(e.mouseX,e.mouseY);
    }

	TweenLite.remove(this._register_instance);
	this._register_instance.addEventListener(StageEvent.DRAG_MOVE,Global.delegate(this._drag_move_handler,this),this.name);
	
	Stage.current.startDrag(this._register_instance,rect,false,free);
	Stage.current.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_handler,this),this.name);
}

UIContainer.prototype._drag_move_handler=function(e)
{
	this.dispatchEvent(Factory.c("ev",[UIContainer.DRAG_MOVE]));
}

UIContainer.prototype._mouse_up_handler=function(e)
{
	if(e){
		var bool=true,posX,posY;
		
		if(this._overflow){
			posX=this._register_instance.x>=0 ? 0 : (this._register_instance.x<(this._mask_width-this._register_instance.getWidth()) ? (this._mask_width-this._register_instance.getWidth()) : this._register_instance.x);
			posY=this._register_instance.y>=0 ? 0 : (this._register_instance.y<(this._mask_height-this._register_instance.getHeight()) ? (this._mask_height-this._register_instance.getHeight()) : this._register_instance.y);
			
			if(posX!=this._register_instance.x || posY!=this._register_instance.y) {
				bool=false;
				TweenLite.to(this._register_instance,this.back_time,{ease:this.back_ease,x:posX,y:posY});
			}
		}
		
	    if(this._inertia && bool){
	    	posX=e.mouseX-this._press_point.x;
	    	posY=e.mouseY-this._press_point.y;
	    	
	    	var length=MathUtil.format(Math.sqrt(posX*posX+posY*posY));
	    	var time=new Date().getTime()-this._drag_time;
	    	var speed=length/time;
	    	
	    	if(length>8){
	    		var data=this._count_speed(posX,posY,speed);
	    		TweenLite.to(this._register_instance,data.time,{ease:this.back_ease,x:data.x,y:data.y});
	    	}
	    }
	}
	else if(this._overflow){
		TweenLite.remove(this._register_instance);
	}
	
	this._drag_time=0;
	this._drag_area=null;
	this._press_point=null;
	
	Stage.current.stopDrag();
	Stage.current.mouseTarget=null;
	Stage.current.removeEventListener(StageEvent.MOUSE_UP,null,this.name);
	this._register_instance.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);
}

UIContainer.prototype._count_speed=function(offsetX,offsetY,speed)
{
	var data={};
	
	speed=MathUtil.clamp(speed,0.3,4.5);
	data.x=offsetX*speed*this.inertia_ratio;
	data.y=offsetY*speed*this.inertia_ratio;
	
	Point.clamp(data,this.min_migration_length,this.max_migration_length);
	data.x=MathUtil.format(this._register_instance.x+data.x);
	data.y=MathUtil.format(this._register_instance.y+data.y);
	
	if(this._drag_area) {
		var point=this.globalToLocal(Rectangle.innerPoint(this._drag_area,this.localToGlobal(data.x,data.y)));
	    data.x=MathUtil.format(point.x);
	    data.y=MathUtil.format(point.y);
	}
	
	var length=Math.sqrt((data.x-this._register_instance.x)*(data.x-this._register_instance.x)+(data.y-this._register_instance.y)*(data.y-this._register_instance.y));
	data.time=Math.min(1,MathUtil.format((length/speed)*this.time_ratio));

	return data;
}

UIContainer.prototype.moveTo=function(x,y)
{
	UIContainer.superClass.moveTo.call(this,x,y);
	if(this._register_instance) this._register_instance.dispatchEvent(Factory.c("ev",[Event.RESIZE,{w:this._mask_width,h:this._mask_height},{x:this.x,y:this.y}]));
}

UIContainer.prototype.render  = function()
{
	if((this.scaleX!=1 && this.scaleX!=0) || (this.scaleY!=1 && this.scaleY!=0)) {
		this._recovery_scale(true);
	}
	
	UIContainer.superClass.render.apply(this,arguments);
}

UIContainer.prototype._recovery_pos=function()
{
	if(this._register_instance.x<0 && (this._register_instance.getWidth()+this._register_instance.x)<this._mask_width){
		this._register_instance.x=this._mask_width-this._register_instance.getWidth();
	}else if(this._register_instance.x>0 && (this._register_instance.getWidth()+this._register_instance.x)>this._mask_width){
		this._register_instance.x=0;
	}
	
	if(this._register_instance.y<0 && (this._register_instance.getHeight()+this._register_instance.y)<this._mask_height){
		this._register_instance.y=this._mask_height-this._register_instance.getHeight();
	}else if(this._register_instance.y>0 && (this._register_instance.getHeight()+this._register_instance.y)>this._mask_height){
		this._register_instance.y=0;
	}
}

UIContainer.prototype._recovery_scale=function(bool)
{
	this._mask_width=MathUtil.format(this._initial_width*this.scaleX);
	this._mask_height=MathUtil.format(this._initial_height*this.scaleY);
	
	if(bool) this.scaleX=this.scaleY=1;
	this._recovery_pos();
	
	if(this._mask){
		this._mask.width=this._mask_width;
		this._mask.height=this._mask_height;
		this.mask=this._mask;
	}
	
    if(this._register_instance!=undefined) {
    	this._reset_hold_control(null);
    	this._register_instance.resize=true;
    	this._register_instance.dispatchEvent(Factory.c("ev",[Event.RESIZE,{w:this._mask_width,h:this._mask_height},{x:this.x,y:this.y}]));
    }
}

UIContainer.prototype.updateSizeInArea=function(area_width,area_height)
{
	this._initial_height=this.instance.getHeight();
	this._initial_width=this.instance.getWidth();
	var count=0;
	
	if(this._initial_width>area_width){
		this.scaleX=area_width/this._initial_width;
		count+=1;
	}
	
	if(this._initial_height>area_height){
		this.scaleY=area_height/this._initial_height;
		count+=2;
	}
	
	if(count<3 && count!=1) this._mask_width=this._initial_width;
	if(count<3 && count!=2) this._mask_height=this._initial_height;
	if(count==0) this._recovery_scale();
}

UIContainer.prototype.dispose=function()
{	
	if(this._register_instance){
		if(this._register_instance.hasEventListener(StageEvent.MOUSE_DOWN)){
			this._mouse_up_handler(null);
			this._register_instance.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
		}
		
		if(this._register_instance.hasEventListener(DisplayBase.RESIZE)){
			this._register_instance.removeEventListener(DisplayBase.RESIZE,null,this.name);
		}
	}
	
	UIContainer.superClass.dispose.call(this);
	delete this._initial_width,this._initial_height,this.time_ratio,this.min_migration_length,this.max_migration_length,this.inertia_ratio,this._drag_area,this._press_point,this._inertia,this._drag_time,this.back_ease,this.out_percent,this.back_time,this._orientation,this._overflow,this._mask_width,this._mask_height;
}
//----------------------------------------- BoxShape -----------------------------------------


function BoxShape() 
{
	this._redius=0;
	this._thickness=0;
	this._fill_alpha=1;
	this.autoSize=true;
	this.instance=this._stroke=this._pattern=this._color=null;
	
	DisplayObjectContainer.call(this);
	this.repeat="repeat";
	this.mouseChildren=false;
}

Global.inherit(BoxShape, DisplayObjectContainer);

/**
 * 圆角矩形
 * @param {String} c 颜色
 * @param {Number} w 宽度
 * @param {Number} h 高度
 * @param {Number} r 圆角半径
 * @param {Number} t 边框线条粗细
 * @param {String} s 边框线条颜色
 * @param {Number} a 填充颜色的透明度
 */
BoxShape.prototype.setup =function(c,w,h,r,t,s,a)
{
	this.height=h;
	this.width=w;
	
	this._redius=r||0;
	this._color=c;
	
	this._thickness=t||0;
	this._stroke=s||"#000000";
	this._fill_alpha=(a==undefined) ? this._fill_alpha : a;
	
	if(this.instance==null){
		this.instance=Factory.c("do");
		this.addChild(this.instance);
	}
	else this.instance.moveTo(0,0);
	this._resize=true;
}

Object.defineProperty(BoxShape.prototype,"pattern",{
	get: function () {
	    return this._pattern;
    },

    set: function (value) {
    	if(value && !(value instanceof Image)) return;
    	
    	if(this._pattern && this._pattern.parentNode){
    		this._pattern.parentNode.removeChild(this._pattern);
    	}
    	
    	var svg=SVGUtil.supported();
    	this._pattern=value ? (Global.useCanvas ? this.instance.graphics.context.createPattern(value,this.repeat) : (svg ? SVGUtil.create("pattern",{id:this.name+"_pattern",width:1,height:1}) : value)) : value;
    	
    	if(value && !Global.useCanvas && svg && this.instance.element){
    		var image=SVGUtil.create("image",{x:0,y:0,width:value.width,height:value.height});
    		image.setAttributeNS(SVGUtil.xlink,"href", value.src); 
    		this._pattern.appendChild(image);
    		
    		var defs=this.instance.element.getElementsByTagName('defs')[0];
    		if(defs==undefined){
    			defs=SVGUtil.create("defs");
    			this.instance.element.appendChild(defs);
    		}
    		defs.appendChild(this._pattern);
    	}
    	
    	this._resize=true;
    	this.__checkDisplayUpdate();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(BoxShape.prototype,"redius",{
	get: function () {
	    return this._redius;
    },

    set: function (value) {
    	if(value==null) return;
    	value=Math.min(value,Math.ceil(Math.min(this.width,this.height)*0.5));
    	
    	if(value==this._redius) return;
    	this._redius=value;
    	this._resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(BoxShape.prototype,"color",{
	get: function () {
	    return this._color;
    },

    set: function (value) {
    	if(value==null || value==this._color) return;
    	if(StringUtil.isEmpty(value)) this._fill_alpha=0;
    	else if(this._fill_alpha==0)  this._fill_alpha=1;
    	
    	this._color=value;
    	this._resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(BoxShape.prototype,"strokeColor",{
	get: function () {
	    return this._stroke;
    },

    set: function (value) {
    	if(value==null || value==this._stroke) return;
    	if(StringUtil.isEmpty(value)) this.thickness=0;
    	this._stroke=value;
    	this._resize=true;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(BoxShape.prototype,"thickness",{
	get: function () {
	    return this._thickness;
    },

    set: function (value) {
    	if(value==null || value==this._thickness) return;
    	var old=this._thickness;
    	this._thickness=value;
    	this.instance.moveTo(-this._thickness*0.5,-this._thickness*0.5);
    	this.height=this.height+(this._thickness-old)*2;
    	this.width=this.width+(this._thickness-old)*2;
    	this._resize=true;
    },
    enumerable: true,
    configurable: true
});

BoxShape.prototype.redraw=function()
{
	this.__checkDisplayUpdate();
	this.instance.width=this.width;
	this.instance.height=this.height;
	
	if(Global.useCanvas){
		this.instance.graphics.clear();
		
		if(this.width>this.instance.graphics.canvas.width) {
			this.instance.graphics.canvas.width=this.width;
			this.instance.graphics.rectangle.width=this.width;
		}
		
		if(this.height>this.instance.graphics.canvas.height) {
			this.instance.graphics.canvas.height=this.height;
			this.instance.graphics.rectangle.height=this.height;
		}
		
		if(this._thickness>0){
			this.instance.graphics.lineStyle(this._thickness,this._stroke);
		}else this.instance.graphics.stroke_style=null;
		this.instance.graphics.beginFill(this._pattern ? this._pattern : this._color,this._fill_alpha);
		if(this._redius>0) this.instance.graphics.drawRoundRect(this._thickness,this._thickness,this.width,this.height,this._redius);
		else              this.instance.graphics.drawRect(this._thickness,this._thickness,this.width,this.height);
		this.instance.graphics.endFill();
		return;
	}
	
	if(!SVGUtil.supported()){
		if(this.instance.element==undefined) this.instance.element=DOMUtil.createDOM("div",{style:{backgroundColor:this._color,width:this.width+"px",height:this.height+"px"}});
		else {
			this.instance.element.style.backgroundColor=this._color;
			this.instance.element.style.backgroundImage=this._pattern ? "url(" + this._pattern.src + ")" : "";
			this.instance.element.style.backgroundRepeat=this.repeat;
		}
		return;
	}
		
	var rect;
	if(this.instance.element==undefined) {
		this.instance.element=SVGUtil.create("svg",{style:{width:this.width+"px",height:this.height+"px"}});
		rect=SVGUtil.create("rect",{x:0,y:0,rx:this._redius,ry:this._redius,width:this.width,height:this.height,style:{fill:this._color,fillOpacity:this._fill_alpha,stroke:this._stroke,strokeWidth:this._thickness}});
	    this.instance.element.appendChild(rect);
	    return;
	}
	
	rect=this.instance.element.getElementsByTagName('rect')[0];
	
	rect.style.fill=this._pattern ? 'url(#' + this._pattern.id + ')' : this._color;
	rect.style.fillOpacity=this._fill_alpha;
	rect.style.strokeWidth=this._thickness;
	rect.style.stroke=this._stroke;
	
	rect.setAttribute("height", this.height);
	rect.setAttribute("width", this.width);
	rect.setAttribute("ry", this._redius);
	rect.setAttribute("rx", this._redius);
	
	if(this._parent && this._parent.autoSize) this._parent._updateSize();
}

Object.defineProperty(BoxShape.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		if(this._stage) this._stage.removeEventListener(StageEvent.UPDATE,null,this.name);
		
		this._stage=value;
		if(this._stage) this._stage.addEventListener(StageEvent.UPDATE,Global.delegate(this.__update_size,this),this.name);
        
        if(this._children==undefined || this._children.length<1) return;
		var i,c,l;
		for (i = 0,l=this._children.length;i<l;i++) {
			c = this._children[i];
			c.stage=value;
		}
    },
    enumerable: true,
    configurable: true
});

BoxShape.prototype.__update_size=function(e)
{
	if(Global.useCanvas && (Global.canvas.width>(this.instance.graphics.canvas.width+1) ||  Global.canvas.height>(this.instance.graphics.canvas.height+1))){
		this._resize=true;
	}
}

BoxShape.prototype.clone  = function()
{
	var copy=ObjectPool.create(BoxShape);
	copy.data=this.data;
	
	copy.setup(this._color,this.width,this.height,this._redius,this._thickness,this._stroke,this._fill_alpha);
	if(this._pattern) copy.pattern=this._pattern;
	return copy;
}

BoxShape.prototype.render  = function()
{
	if(this._resize) this.redraw();
	BoxShape.superClass.render.apply(this,arguments);
	this._resize=false;
}

BoxShape.prototype.reset=function()
{
	this._redius=0;
	this._thickness=0;
	this._fill_alpha=1;
	this.autoSize=true;
	this._stroke=this._pattern=this._color=null;
	
	if(this.instance){
		this.instance.removeFromParent(true);
		this.instance=null;
	}
	
	BoxShape.superClass.reset.call(this);
}

BoxShape.prototype.dispose =function()
{
	BoxShape.superClass.dispose.call(this);
	delete this._fill_alpha,this._thickness,this._stroke,this._color,this._redius,this._pattern,this.repeat;
}

BoxShape.prototype.toString = function()
{
	return "BoxShape";
}

//----------------------------------------- VideoPlayer -----------------------------------------

/**
===================================================================
VideoPlayer Class
===================================================================
**/

function VideoPlayer()
{
	DisplayObjectContainer.call(this);
	this.tf=this.video=this.playBtn=null;
	this.isStop=false;
	this.seedTime=0;
	this.stepTime=20;
	this.fullScreen=false;
	this._black=this._record_info=null;
	this.mouseEnabled=true;
}

VideoPlayer.volume_label="video_volume";
VideoPlayer.rewind_label="video_rewind";
VideoPlayer.forward_label="video_forward";
VideoPlayer.full_screen_label="full_screen";
VideoPlayer.normal_screen_label="normal_screen";

Global.inherit(VideoPlayer,DisplayObjectContainer);

VideoPlayer.prototype.setVideo=function(video)
{
	if(video==null) return;
	
	this.video=video;
	this.addChild(video);
	this.video.breakTouch=true;
	this.video.mouseEnabled=true;
	video.element.style.display = "none";
	
	this.playBtn=this._createBtn();
	this.playBtn.moveTo((this.video.getWidth()-this.playBtn.getWidth())*0.5,(this.video.getHeight()-this.playBtn.getHeight())*0.5);
	this.playBtn.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._onPlayHandler,this));

	this.video.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this._onPlayOver,this));
	this.video.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._onMouseDown,this));    

    this.width=this.video.getWidth();
    this.height=this.video.getHeight();
    
    this.tf=new TextField("",Global.font,"#FFFFFF",32);
    this.tf.width=250;
    this.tf.height=90;
    this.tf.moveTo((this.width-160)*0.5,(this.height-40)*0.5);
}

VideoPlayer.prototype.setVolume=function(value)
{
	if(this.video && value) this.video.setVolume(value);
}

VideoPlayer.prototype.stop=function()
{
	if(this.video==undefined) return;	
	this.seedTime=this.video.getCurrentTime();
	this.video.stop();
	if(!this.contains(this.playBtn)) this.addChild(this.playBtn);
}

VideoPlayer.prototype.play=function()
{
	this._onPlayHandler();
}

VideoPlayer.prototype._tweenOver=function()
{
	if(this.contains(this.tf)) this.removeChild(this.tf);
}

VideoPlayer.prototype.render= function()
{
	VideoPlayer.superClass.render.apply(this,arguments);
	if(this.video && this.video.playing) this.__checkDisplayUpdate();
}

VideoPlayer.prototype._changeScreen=function()
{
	if(!target.fullScreen && this._record_info==null) return;

	if(target.fullScreen){
		this._record_info={scale:this.scaleX,parent:this.parent,rotation:this.rotation,alpha:this.alpha,x:this.x,y:this.y};
		
		var w=Global.canvas.width;
	    var h=Global.canvas.height;
	    
	    if(this._black==null){
	    	this._black=ObjectPool.create(DisplayObject);
	    	this._black.graphics.stroke_style=null;
	    	this._black.graphics.beginFill("#000000",1);
	    	this._black.graphics.drawRect(0,0,w,h);
	    }
	    
	    Stage.current.addChild(this._black);
	    this.rotation=0;
	    this.alpha=1;
	    
	    this.scaleX=this.scaleY=MathUtil.getSizeScale(this.width,this.height,w,h,true);
	    this.moveTo(Math.round((w-this.getWidth())*0.5),Math.round((h-this.getHeight())*0.5));
	    Stage.current.addChild(this);

	}else{
		if(this._black) this._black.removeFromParent(false);
		 this.scaleX=this.scaleY=this._record_info.scale;
		 this.rotation=this._record_info.rotation;
		 this.alpha=this._record_info.alpha;
		 this.moveTo(this._record_info.x,this._record_info.y);
		 this._record_info.parent.addChild(this);
		 this._record_info=null;
	}
	
	var label=WordUtil.get(target.fullScreen ? VideoPlayer.full_screen_label : VideoPlayer.normal_screen_label);
	this._showVideoText(label);
}

VideoPlayer.prototype._showVideoText=function(label)
{
	if(StringUtil.isEmpty(label)) return;
	TweenLite.remove(this.tf);  
	    
    if(!this.contains(this.tf)) this.addChild(this.tf);
    this.tf.text=label;
    this.tf.alpha=1;
	    
    TweenLite.to(this.tf,0.5,{alpha:0,delay:0.5,onComplete:Global.delegate(this._tweenOver,this)});
}

VideoPlayer.prototype._onMouseDown=function(e)
{
	if(this.playBtn && this.contains(this.playBtn)) return;
	if(this.stage==null) this.stage=this.getStage();
	
	var start_point=new Point(e.mouseX,e.mouseY);
	var double_finger=(e.touchs && e.touchs.length==1);
	
	if(double_finger){
		var start_point2=new Point(e.touchs[0].mouseX,e.touchs[0].mouseY);
		var ids=[e.touchs[0].id,e.id];
		var distance=Point.distance(start_point,start_point2);
	}
	
	var bool,offset,volume,label,text_string;
	var has_volume=false;
	var target=this;
	
	target._onMouseUp=function(event){
		var end_point=new Point(event.mouseX,event.mouseY);
		
		if(double_finger){
			if(!(event.touchs && event.touchs.length==1)) return;
			var touch=event.touchs[0];
			if(touch==null || ids.indexOf(touch.id)==-1 || ids.indexOf(event.id)==-1 || touch.type==StageEvent.MOUSE_DOWN) return;
			var distance2=Point.distance(end_point,new Point(touch.mouseX,touch.mouseY));
			bool=(distance<distance2);
			if(distance==distance2 || (bool && target.fullScreen) || (!bool && !target.fullScreen)) return;
			target.fullScreen=bool;
			target._changeScreen();
			return;
		}
		
		target.seedTime=target.video.getCurrentTime();
		
		target.stage.removeEventListener(StageEvent.MOUSE_MOVE,target._onMouseMove);
		target.stage.removeEventListener(StageEvent.MOUSE_UP,target._onMouseUp);
		
		delete target._onMouseMove;
		delete target._onMouseUp;
		bool=false;
		
		var offsetX=Math.abs(end_point.x-start_point.x);
		var offsetY=Math.abs(end_point.y-start_point.y);
		
		if(has_volume){
			bool=true;
		}
		else if(Point.distance(start_point,end_point)<9){
			if(!target.contains(target.playBtn)) target.addChild(target.playBtn);
			target.video.stop();
			bool=true;
		}
		else if(offsetX<offsetY || (offsetX/offsetY)<2 || !target.video.playing) {
			bool=true;
		}
		
		if(bool){
			if(target.contains(target.tf) && target.tf.alpha>0) TweenLite.to(target.tf,0.5,{alpha:0,onComplete:Global.delegate(target._tweenOver,target)});
			return;
		}
		
		bool=end_point.x>start_point.x;
		offset=Math.round(Math.max(offsetX*0.008,1)*target.stepTime);
		offset=target.seedTime+offset*(bool ? 1 : -1);
		
		if(offset>=target.video.length){
			target._onPlayOver(null);
			return;
		}
		
		offset=(offset<0) ? 0 : offset;

		if(target.video && target.video.element && !Global.isQQBrowser) {
			target.video.element.currentTime = offset;
			text_string=WordUtil.get(bool ? VideoPlayer.forward_label : VideoPlayer.rewind_label);
	        if(StringUtil.isEmpty(text_string)) return;
	        text_string=StringUtil.substitute(text_string,[String(Math.ceil(100*offset/target.video.length))]);
	        target._showVideoText(text_string);
	   }
	}
	
	target._onMouseMove=function(event)
	{
		if(double_finger) return;
		
		var _point=new Point(event.mouseX,event.mouseY);
		var posX=Math.abs(_point.x-start_point.x);
		var posY=Math.abs(_point.y-start_point.y);
		
		if(posX<posY && (posY/posX)>2){
			bool=_point.y>start_point.y;
			offset=(posY/target.stepTime)*0.02;
			volume=target.video.getVolume();
			target.setVolume(MathUtil.clamp(volume+(bool ? 1 : -1)*offset,0,1));
		   
		    start_point.x=_point.x;
		    start_point.y=_point.y;
		   
		    label=WordUtil.get(VideoPlayer.volume_label);
		    if(StringUtil.isEmpty(label)) return;
		    
		    volume=target.video.getVolume();
		    TweenLite.remove(target.tf);
		    
		    if(!target.contains(target.tf)) target.addChild(target.tf);
		    target.tf.text=(StringUtil.substitute(label,[String(Math.ceil(volume*100))]));
		    target.tf.alpha=1;
		    has_volume=true;
		}
	}
	
	target.stage.addEventListener(StageEvent.MOUSE_UP,target._onMouseUp);
	target.stage.addEventListener(StageEvent.MOUSE_MOVE,target._onMouseMove);
}

VideoPlayer.prototype._onPlayOver=function(e)
{
	this.isStop=true;
	this.video.stop();
	if(!this.contains(this.playBtn)) this.addChild(this.playBtn);
}

VideoPlayer.prototype._onPlayHandler=function(e)
{
	this.seedTime=this.isStop ? 0 : this.seedTime;
	this.video.play(this.seedTime);
	if(this.contains(this.playBtn)) this.removeChild(this.playBtn);
	this.isStop=false;
}

VideoPlayer.prototype._createBtn=function()
{
	var btn_out=this._createSprite("#808080","#d9d9d9");
	var btn_over=this._createSprite("#FFF000","#d9d9d9");
	var btn_out2=this._createSprite("#808080","#d9d9d9");
	var btn_over2=this._createSprite("#FFF000","#d9d9d9");
	var btn=new Button();
	btn.setup(btn_out,btn_over,btn_over2,btn_out2);
	btn.width=btn.height=88;
	return btn;
}

VideoPlayer.prototype._createSprite=function(side,bg)
{
	var btn=ObjectPool.create(DisplayObject);
	btn.graphics.lineStyle(1,bg,0);
	btn.graphics.beginPath();
	btn.graphics.beginFill(bg);
	btn.graphics.moveTo(88, 6);
	btn.graphics.lineTo(88, 82);
	btn.graphics.curveTo(88, 88, 82, 88);
	btn.graphics.lineTo(6, 88);
	btn.graphics.curveTo(0, 88, 0, 82);
	btn.graphics.lineTo(0, 6);
	btn.graphics.curveTo(0, 0, 6, 0);
	btn.graphics.lineTo(82, 0);
	btn.graphics.curveTo(88, 0, 88, 6);
	btn.graphics.moveTo(30, 27.7);
	btn.graphics.lineTo(30, 60.1);
	btn.graphics.lineTo(61.7, 43.7);
	btn.graphics.lineTo(61.7, 43.2);
	btn.graphics.lineTo(30, 27.7);
	btn.graphics.closePath();
	btn.graphics.endFill();
	
	btn.graphics.beginPath();
	btn.graphics.beginFill(side);
	btn.graphics.moveTo(30, 27.7);
	btn.graphics.lineTo(61.7, 43.2);
	btn.graphics.lineTo(61.7, 43.7);
	btn.graphics.lineTo(30, 60.2);
	btn.graphics.lineTo(30, 27.7);
	btn.graphics.closePath();
	btn.graphics.endFill();
	btn.width=btn.height=88;
	return btn;
}

VideoPlayer.prototype.dispose=function()
{
	if(this.tf) TweenLite.remove(this.tf);
	if(this.video) this.video.removeFromParent(true);
	delete this.video;
	
	VideoPlayer.superClass.dispose.call(this);
	
	delete this.playBtn,this.isStop,this.seedTime,this._record_info,this.tf;
}

//----------------------------------------- VideoPlayerII -----------------------------------------

/**
===================================================================
VideoPlayerII Class
===================================================================
**/

function VideoPlayerII()
{
	DOMDisplay.call(this);
	
	this._touch_handler=this.video=this.playBtn=null;
	
	this.isStop=false;
	this._is_init=false;
	
	this._video_layer=1;
	this._btn_layer=2;
	this.seedTime=0;
	this.mouseEnabled=true;
}

Global.inherit(VideoPlayerII,DOMDisplay)

VideoPlayerII.prototype.init=function()
{
	if(this._is_init) return;
	this._is_init=true;
	
	this._video_layer=Global.layer+3;
	this._btn_layer=Global.layer+5;
	
	if(this.playBtn) {
		if(this._parent) this._parent.addChild(this.playBtn);
		this._touch_handler=Global.delegate(this.play, this);
		this.playBtn.addEventListener(StageEvent.CLICK , this._touch_handler);
	}
}

VideoPlayerII.prototype.fullscreen=function()
{
	if(this.video==undefined || this.video==null) return;
	
	var label=(this.video.element[Global.cssPrefix+'EnterFullScreen'] ? Global.cssPrefix+'EnterFullScreen' : (this.video.element[Global.cssPrefix+'RequestFullScreen'] ? Global.cssPrefix+'RequestFullScreen' : 'requestFullScreen'));
	this.video.element[label]();
}

VideoPlayerII.prototype.normalscreen=function()
{
	if(this.video==undefined || this.video==null) return;
	this.video.element[StringUtil.isEmpty(Global.cssPrefix) ? "cancelFullScreen" : Global.cssPrefix+"CancelFullScreen"]();
}

VideoPlayerII.prototype.setVideo=function(video)
{
	this.video=video;
	this.element=this.video.element;
	this.width=this.video.getWidth();
    this.height=this.video.getHeight();
    this.video.addEventListener(Media.MEDIA_PLAY_COMPLETE,Global.delegate(this._onPlayOver,this));
}

VideoPlayerII.prototype.setVolume=function(value)
{
	if(this.video && value) this.video.setVolume(value);
}

VideoPlayerII.prototype.stop=function()
{
	if(this.video==undefined) return;	
	this.seedTime=this.video.getCurrentTime();
	this.video.stop();
}

VideoPlayerII.prototype.play=function(e)
{
	if(e){
		if(StageEvent.supportTouch()){
			if(!(e.touches && e.touches.length>0 && e.touches[0] && e.touches[0].type=="touchend")) return;
		}else{
			if(e.type!=StageEvent.MOUSE_UP) return;
		}
	}
	
	this.seedTime=this.isStop ? 0 : this.seedTime;
	this.video.play(this.seedTime);
	this.isStop=false;
}

VideoPlayerII.prototype._onPlayOver=function(e)
{
	this.isStop=true;
	this.video.stop();
}

VideoPlayerII.prototype.updateSize=function(e)
{
	if(this.parent==undefined) return;
	
	if(this.video.element){
		if(this.video.element.ended || this.video.element.paused) this._display(true,true);
		else this._display(false,true);
	}
	
	this._transform(this.container);
	
	if(this.playBtn) {
		this.playBtn.scale=0.4;
		this.playBtn.layer=this._btn_layer;
		this.playBtn.moveTo(this.x+(this.width-this.playBtn.getWidth())*0.5,this.y+(this.height-this.playBtn.getHeight())*0.5)
	}
}

VideoPlayerII.prototype._display=function(bool,only)
{
	if(bool){
		this.init();
		
		if(this.playBtn && this.playBtn.parent==null && this._parent){
			this._parent.addChild(this.playBtn);
		}
		
		if(only==undefined){
			if(this._element && this._element.parentNode==null){
				(this._parent_node ? this._parent_node : (Global.div ? Global.div : Global.canvas.parentNode)).appendChild(this._element);
			}
		}
		return;
	}
	
	if(this.playBtn&& this.playBtn.parent) {
		this.playBtn.removeFromParent(false);
	}
	
	if(only==undefined ){
		if(this._element && this._element.parentNode) {
		   this._element.parentNode.removeChild(this._element);
	    }
	}
}

VideoPlayerII.prototype.dispose=function()
{
	if(this.playBtn && this._touch_handler){
		this.playBtn.removeEventListener(StageEvent.CLICK , this._touch_handler);
	}
	
	if(this.playBtn) {
		this.playBtn.removeFromParent(true);
	}
	
	if(this.video){
		try{
			this.video.dispose();
		}
		catch(err){}
	}
	
	if(VideoPlayerII.superClass) VideoPlayerII.superClass.dispose.call(this);
	delete this._touch_handler,this._is_init,this.video,this.playBtn,this.isStop,this.seedTime,this._video_layer,this._btn_layer;
}
//----------------------------------------- URLLoader -----------------------------------------

/**
 * ================================================
 *  URLLoader class
 * ================================================
 * Shine Chen s_c@live.com 2015/05/04
 */

function URLLoader ()
{
	this.content = null;
	this.type = null;
	EventDispatcher.call(this);
}

Global.inherit(URLLoader,EventDispatcher);
URLLoader.TYPE_TEXT = "text";
URLLoader.TYPE_JSON = "json";
URLLoader.TYPE_PROP = "prop";

URLLoader.TYPE_CSS = "css";
URLLoader.TYPE_JS  = "js";

URLLoader.prototype.load = function (u) 
{
	var target=this;
	var ext = StringUtil.getPathExt(u);
	
	if (ext == "txt") {
		type = URLLoader.TYPE_TEXT;
	} else if (ext == "json") {
		type = URLLoader.TYPE_JSON;
	}else if (ext == "js") {
		type = URLLoader.TYPE_JS;
	}else if (ext == "prop") {
		type = URLLoader.TYPE_PROP;
	}else if (ext == "css") {
		type = URLLoader.TYPE_CSS;
	}
	else retrun;

	if (type == URLLoader.TYPE_TEXT || type == URLLoader.TYPE_JSON || type == URLLoader.TYPE_PROP) {
		var ajax = new Ajax();
		ajax.get(u, {}, function (data) {
			target.content = data;
			target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));
			target.removeEventListener(Event.COMPLETE);
			target.removeEventListener(Event.ERROR);
		},function (a){
			target.content = null;
			target.dispatchEvent(Factory.c("ev",[Event.ERROR]));
			target.removeEventListener(Event.COMPLETE);
			target.removeEventListener(Event.ERROR);
		});
	}
    else if (type == URLLoader.TYPE_JS) {
		target.content = document.createElement("script");
		target.content.onload = function () {
			target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));
			target.removeEventListener(Event.COMPLETE);
            target.removeEventListener(Event.ERROR);
		};
		
		target.content.onerror = function () {
			target.dispatchEvent(Factory.c("ev",[Event.ERROR]));
			target.removeEventListener(Event.COMPLETE);
			target.removeEventListener(Event.ERROR);
		};
		
		target.content.src = u;
		target.content.type = "text/javascript";
		document.querySelector('head').appendChild(target.content);
	}
	else if (type == URLLoader.TYPE_CSS) {
		target.content = document.createElement("link");
		target.content.rel = "stylesheet";
		target.content.type = "text/css";
		
		target.content.onload = function () {
			target.dispatchEvent(Factory.c("ev",[Event.COMPLETE]));
			target.removeEventListener(Event.COMPLETE);
			target.removeEventListener(Event.ERROR);
		}
		
		target.content.onerror = function () {
			target.dispatchEvent(Factory.c("ev",[Event.ERROR]));
			target.removeEventListener(Event.COMPLETE);
			target.removeEventListener(Event.ERROR);
		};
		
		target.content.href = u;
		document.querySelector('head').appendChild(target.content);
	}
}

/**
 * @param {Object} data
 * @param {String} type svg "image/svg+xml" xml "text/xml"
 */
URLLoader.parseXML = function(data, type) 
{
	var n = null;

	if(window.DOMParser){
		try{
			n = (new DOMParser).parseFromString(data, type);
		}catch(e){}
	}
	else if(window.ActiveXObject){
		var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
		for(var i=0;i<xmlDomVersions.length;i++){
			try{
				n = new ActiveXObject(xmlDomVersions[i]);
				break;
			}catch(e){}
		}
		
		if(n){
			n.async = false;
			n.loadXML(data);
		}
	}
	
	return n;
//	return window.DOMParser ? n = (new DOMParser).parseFromString(data, type) : (n = new ActiveXObject("Microsoft.XMLDOM"), n.async = !1, n.loadXML(data)), n;
}

//----------------------------------------- Loader -----------------------------------------

/**
===================================================================
Loader Class
===================================================================
**/

function Loader(data,locale,callback,target)
{
	EventDispatcher.call(this);
	this.reset();
	
	this.locale=locale;
	if(data) this.parse(data,callback,target);
}

Global.inherit(Loader,EventDispatcher);

Loader.LOAD_PROCESS="loadProcess";
Loader.LOAD_COMPLETE="loadComplete";

Loader.STEP_ERROR="stepError";
Loader.STEP_COMPLETE="stepComplete";

Loader.prototype.parse=function(data,callback,target)
{
	if(data==undefined) return;
	
	if(data instanceof Array){
		this._list=data;
		this._total=this._list.length;
		return;
	}
	
	if(callback && typeof data=="string"){
		if(this.load(data)) this._feedback=(typeof callback=="string") ? callback : {c:callback,t:target};
		return;
	}
	
	this._data=data;
}

Loader.prototype.errorHandler=function(e)
{
	if(e){
		if(e.target instanceof Image){
			delete this._files[this._current_name];
			e.target.onerror=null;
			e.target.onload=null;
		}else if(e.target instanceof URLLoader){
			e.target.removeEventListener(Event.ERROR,this.__error_handler);
			e.target.removeEventListener(Event.COMPLETE,this.__load_handler);
		}else{
			e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
		}
	}
	
	if(this._list.length>0){
		this.dispatchEvent(Factory.c("ev",[Loader.STEP_ERROR,this._current_name,this._current_label]));
		trace("[ERROR] Loading path by",this._current_name);
		this._loaded++;
		this.load();
		return;
	}
	
	this.dispatchEvent(Factory.c("ev",[Loader.LOAD_COMPLETE,this._files,this._current_label]));
}

Loader.prototype.loadHandler=function(e)
{
	this._loaded++;
	if(this._list==undefined) return;
	
	if(e){
		if(e.target instanceof Image){
			e.target.onload=null;
			e.target.onerror=null;
		}else if(e.target instanceof URLLoader){
			e.target.removeEventListener(Event.ERROR,this.__error_handler);
			e.target.removeEventListener(Event.COMPLETE,this.__load_handler);
		}else{
			e.target.removeEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
		}
	}
	
	var temp,fb;
	
	if(this._list.length>0){
		if(this.hasEventListener(Loader.LOAD_PROCESS)) 
		     this.dispatchEvent(Factory.c("ev",[Loader.LOAD_PROCESS,Math.ceil(100*this._loaded/this._total)]));
		
		while(!this.load() && this._list.length>0) {
			trace("[WARM] Loader miss path by",this._current_name);
			this._loaded++;
			this.load();
		}
		
		temp=this._files[this._current_name];
		
		if(temp) this.dispatchEvent(Factory.c("ev",[Loader.STEP_COMPLETE,temp,this._current_label]));
		else     this.dispatchEvent(Factory.c("ev",[Loader.STEP_ERROR,this._current_name,this._current_label]));
	}else{
		if(this._feedback==null) this.dispatchEvent(Factory.c("ev",[Loader.LOAD_COMPLETE,this._files,this._current_label]));
		else{
			fb=this._feedback;
			if(typeof this._feedback=="string"){
				temp=this._files[this._current_name].content;
				this.reset(true);
				this.parse(temp);
				this.load(fb);
				return;
			}else{
				temp=this._files[this._current_name];
				this.reset(true);
				
				try{
					fb.c.call(fb.t,temp,this);
					return;
				}catch(error){
					trace("[ERROR] Loader:loadHandler()",error);
				}
			}
		}
		
		if(this._data==null) this.dispose();
		else if(e)           this.reset(true);
	}
}

Loader.prototype.loadXML=function(xmlUrl,name,local)
{
	var xmlObj;
	if (window.ActionXObject) {
		var activexName = ["Microsoft.XMLHTTP","Miscrosoft.XmlDom","MSXML.DOMDocument"];
		
		for (var i = 0; i < activexName.length; i++) {
			try {
				xmlObj = new ActionXObject(activexName[i]);
				break;
			} catch (e) {}
		}
	} else if (window.XMLHttpRequest) {
		xmlObj = new XMLHttpRequest();
	}
	
	if (xmlObj==undefined) return;
	
	 xmlObj.onreadystatechange=function()
     {
	     if (xmlObj.readyState!=4) return;
	     
	     if (xmlObj.status==200) 
	     {
	     	local._files[name]=xmlObj.responseXML ? xmlObj.responseXML : xmlObj.response;
	     }
	           
	     local.loadHandler();
     };
	 xmlObj.open("GET",xmlUrl,true);
	 xmlObj.send(null);
}

Loader.prototype.load=function(data)
{
	if(data==undefined && this._list==null) return false;
	
	if(typeof data == "string"){
		this._loaded=0;
		if(this._data && this._data.hasOwnProperty(data)){
			this._list=this._data[data];
			this._total=this._list.length;
			this._current_label=data;
		}else if(!StringUtil.isEmpty(data) && data.indexOf(".")>0){
			this._list=[data];
			this._total=1;
		}
	}else{
		this.parse(data);
	}
	
	if(this._list==null) return false;
	
	if(this._list.length==0){
		this.dispatchEvent(Factory.c("ev",[Loader.LOAD_COMPLETE,this._files,this._current_label]));
		return false;
	}
	
	if(this.__load_handler==null){
		this.__load_handler=Global.delegate(this.loadHandler,this);
	}
	
	if(this.__error_handler==null){
		this.__error_handler=Global.delegate(this.errorHandler,this);
	}
	
	var url,name,type,temp=this._list.shift();
	
	if(ObjectUtil.getType(temp)=="object"){
		url=(temp.hasOwnProperty("url")) ? temp.url : temp.data;
		type=StringUtil.getPathExt(url);
		name=(temp.hasOwnProperty("label")) ? temp.label : temp.name;
		name=StringUtil.isEmpty(name) ? Loader.getName(url) : name;
	}else{
		url=String(temp);
		type=StringUtil.getPathExt(url);
		name=Loader.getName(url);
	}
	
	if(StringUtil.isEmpty(url)) return false;
	url=(this.locale && !StringUtil.exist(url,"http://","https://")) ? this.locale+url : url;
	trace("[LOADING]",name,"("+(this._loaded+1)+"/"+this._total+")");
	this._current_name=name;
	
	var url_loader;
	var xmlDoc;
	var sound;
	var video;
	var img;
	
	switch(type){
		case "mp3":
		case "wav":
		case "wave":
			sound=new Sound();
			this._files[name]=sound;
		    sound.addEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
			sound.load(url);
			break;
			
		case "xml":
		case "fnt":
		case "svg":
			this.loadXML(url,name,this);
			break;
			
		case "json":
		case "txt":
		case "js":
		case "css":
		case "prop":
			url_loader=new URLLoader();
			this._files[name]=url_loader;
			url_loader.addEventListener(Event.ERROR,this.__error_handler);
			url_loader.addEventListener(Event.COMPLETE,this.__load_handler);
			url_loader.load(url);
			break;
			
		case "mp4":
		case "webm":
		case "ogg":
		case "mov":
		    video=new Video();
			this._files[name]=video;
		    video.addEventListener(Media.MEDIA_LOAD_COMPLETE,this.__load_handler);
			video.load(url);
			break;
		
		case "jpeg":
		case "jpg":
		case "gif":
		case "png":
		case "webp":
		case "bmp":
			img=new Image;
			img.style.display="none";
		    img.onload=this.__load_handler;
		    img.onerror=this.__error_handler;
		    img.src=url;
		    this._files[name]=img;
		    break;
	}
	
	return true;
}

Loader.prototype.reset=function(part)
{
	this._files={};
	this._total=this._loaded=0;
	this._feedback=this._list=this._current_name=this._current_label=null;
	
	if(part) return;
	this.__error_handler=this.locale=this._data=this.__load_handler=null;
}

Loader.prototype.dispose=function()
{
	Loader.superClass.dispose.call(this);
	this.reset();
	
	delete this.__error_handler;
	delete this._current_label;
	delete this.__load_handler;
	delete this._current_name;
	delete this._feedback;
	delete this._loaded;
	delete this._total;
	delete this._files;
	delete this.locale;
	delete this._list;
	delete this._data;
}

Loader.getName=function(url)
{
	if(StringUtil.isEmpty(url)) return null;
	
	var arr,bool=false;
	
	try{
		arr=StringUtil.getFileName(url,1).split("/");
	}catch(err){
		bool=true;
		trace("[WARN] Loader.getName by",url);
	}
	
	if(arr==null || bool) 
		return StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);
	
	var str=arr.pop();
	while(StringUtil.isEmpty(str) && arr.length>0) str=arr.pop();
	return str+"_"+StringUtil.getFileName(url)+"@"+StringUtil.getPathExt(url);
}

//----------------------------------------- InputText -----------------------------------------

/**
===================================================================
InputText Class
===================================================================
**/

/**
 * 
 * @param {Boolean} isInput
 * @param {Boolean} multiline
 * @param {Number} tabindex
 * @param {Boolean} password
 */
function InputText(isInput,multiline,tabindex,password)
{
	DOMDisplay.call(this);
	this.isInput=(isInput==true);
	this.tabindex=tabindex || "-1";
	this.password=password || false;
	this.multiline=multiline || false;
	this.element=this._init();
	this._lineWidth=this.width=this.height=0;
	
	this._size=8;
	this._leading=1;
	this._maxChars=0;
	this._font="Microsoft YaHei,Arial";
	this._color="#000000";
	this._textAlign="left";
	this._verticalAlign="top";
	this._selectable=true;
	
	this._enable=true;
	this.autoSize=true;
	this._writingMode=false;
	this._underline=this._bold=this._italic=false;
	
	this.selectable=this.mouseEnabled=this.isInput;
}

Global.inherit(InputText, DOMDisplay);

/**
 * Event type
 */
InputText.CHANGE="updateText";
InputText.FOCUS_OUT="focusOut";
InputText.FOCUS_IN="focusIn";

Object.defineProperty(InputText.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(value==null || this._enable==value) return;
    	this._enable=value;
    	if(this.isInput) this._element.disabled=this._enable ? "" : "disabled";
    },
    enumerable: true,
    configurable: true
});

InputText.prototype._init=function()
{
	var inputElement;
	
	if(!this.isInput){
		inputElement = document.createElement("span");
		inputElement.contenteditable=false;
		inputElement.draggable=false;
		return inputElement;
	}
	else if (this.multiline) {
        inputElement = document.createElement("textarea");
        inputElement.style["resize"] = "none";
    }
    else {
        inputElement = document.createElement("input");
    }
    
    this._cursor="text";
    inputElement.type=this.password ? "password" : "text";
    inputElement.setAttribute("tabindex", this.tabindex);
    
    inputElement.style.border = "none";
    inputElement.style.outline = "thin";
    inputElement.style.overflow = "hidden";
    inputElement.style.autofocus = "autofocus";
    inputElement.style.wordBreak = "break-all";
    inputElement.style.background = "none";
    inputElement.style.color=this._color;
    inputElement.style[Global.cssPrefix+"WritingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
    
    var target=this;
    inputElement.oninput = function () {
        target.dispatchEvent(Factory.c("ev",[InputText.CHANGE,inputElement.value]));
    };
    
    inputElement.onfocus = function () {
    	target.dispatchEvent(Factory.c("ev",[InputText.FOCUS_IN]));
    }
    
    inputElement.onblur = function () {
    	target.dispatchEvent(Factory.c("ev",[InputText.FOCUS_OUT]));
    }
    
    return inputElement;
}

Object.defineProperty(InputText.prototype,"selectable",{
	get: function () {
        return this._selectable;
    },

    set: function (value) {
        if(value==null || this._selectable==value) return;
        this._selectable=value;
        this._cursor=value ? "text" : "default";
        this.element.style[Global.cssPrefix+"UserSelect"]=this._selectable ? "text" : "none" ;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
}); 

InputText.prototype._display=function(bool)
{
	InputText.superClass._display.call(this,bool);
	if(bool) this.updateSize();
}

InputText.prototype.updateSize=function()
{
	this.__checkDisplayUpdate();
	if(!this.autoSize || this.isInput || this._element==undefined || this._element.offsetHeight==0 ) return;
	this.height=this._element.offsetHeight+this._size;
	this.width=this._lineWidth ? this._lineWidth : this.height*this.text.length;
	if(this._lineWidth>0) this.height=MathUtil.format(this.height*this.height*this.text.length/this._lineWidth);
}

/**
 * @param {String} s
 */
Object.defineProperty(InputText.prototype,"text",{
	get: function () {
        return this.element ? (this.isInput ? this.element.value : this.element.innerHTML) : "";
    },

    set: function (value) {
        if(this.element==undefined || (this.isInput && this.element.value==value) || (!this.isInput && this.element.innerHTML==value)) return;
		this.isInput ? this.element.value=value : this.element.innerHTML=value;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 是否竖排(默认 否)
 * @param {Boolean} 
 * lr-tb | rl-tb | tb-rl | bt-rl | tb-lr | bt-lr | lr-bt | rl-bt | lr | rl | tb
 * lr-tb：从左向右，从上往下
 * tb-rl：从上往下，从右向左
 */
Object.defineProperty(InputText.prototype,"writingMode",{
	get: function () {
        return this._writingMode;
    },

    set: function (value) {
        if(this.element==undefined || this._writingMode==value) return;
	
		this._writingMode=value;
		this.element.style[Global.cssPrefix+"WritingMode"]=this._writingMode ? "tb-rl" : "lr-tb";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 斜体
 * @param {Boolean} i
 */
Object.defineProperty(InputText.prototype,"italic",{
	get: function () {
        return this._italic;
    },

    set: function (value) {
        if(this.element==undefined || this._italic==value) return;
	
		this._italic=value;
		this.element.style.fontStyle=this._italic ? "italic" : "normal";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});


/**
 * 粗体
 * @param {Boolean} b
 */
Object.defineProperty(InputText.prototype,"bold",{
	get: function () {
        return this._bold;
    },

    set: function (value) {
        if(this.element==undefined || this._bold==value) return;
	
		this._bold=value;
		this.element.style.fontWeight=this._bold ? "bold" : "normal";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体 例如 "14"
 * @param {Number} z
 */
Object.defineProperty(InputText.prototype,"size",{
	get: function () {
        return this._size;
    },

    set: function (value) {
        if(this.element==undefined || this._size==value) return;
	
		this._size=value;
		this.element.style.fontSize=this.element.style.lineHeight=this._size+ "px";
		this.updateSize();
		
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体颜色 0xFFFFFF "#FFFFFF"
 * @param {Number} {String} c
 */
Object.defineProperty(InputText.prototype,"color",{
	get: function () {
        return this._color;
    },

    set: function (value) {
    	value=ColorUtil.formatColor(value);
        if(this.element==undefined || this._color==value) return;
	
		this._color=value;
		this.element.style.color=this._color;
    },
    enumerable: true,
    configurable: true
});

/**
 * 例如 "微软雅黑"
 * @param {String} f
 */
Object.defineProperty(InputText.prototype,"font",{
	get: function () {
        return this._font;
    },

    set: function (value) {
        if(this.element==undefined || this.element.style.fontFamily==value) return;
	
		this._font=value;
		this.element.style.fontFamily=this._font;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * left、right、center
 */
Object.defineProperty(InputText.prototype,"align",{
	get: function () {
        return this._textAlign;
    },

    set: function (value) {
        if(this.element==undefined || this._textAlign==value) return;
	
		this._textAlign=value;
		this.element.style.textAlign=this._textAlign;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(InputText.prototype,"underline",{
	get: function () {
        return this._underline;
    },

    set: function (value) {
        if(this.element==undefined || this._underline==value) return;
	
		this._underline=value;
		this.element.style.textDecoration=this._underline ? "underline" :"none";
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * top、hanging、middle、alphabetic、ideographic、bottom
 * 垂直对齐方式
 */
Object.defineProperty(InputText.prototype,"verticalAlign",{
	get: function () {
        return this._verticalAlign;
    },

    set: function (value) {
        if(this.element==undefined || this._verticalAlign==value) return;
	
		this._verticalAlign=value;
		this.element.style.verticalAlign=this._verticalAlign;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 最多可包含的字符数
 */
Object.defineProperty(InputText.prototype,"maxChars",{
	get: function () {
        return this._maxChars;
    },

    set: function (value) {
        if(this.element==undefined || this._maxChars==value) return;
	
		this._maxChars=value;
		if(this._maxChars>0) {
			if(this.multiline) this.element.style.maxlength=this._maxChars;
			else this.element.style.max=this._maxChars;
		}
		
    },
    enumerable: true,
    configurable: true
});

/**
 * 字间距
 * @param {Object} a
 */
Object.defineProperty(InputText.prototype,"leading",{
	get: function () {
        return this._leading;
    },

    set: function (value) {
        if(this.element==undefined || this._leading==value) return;
	
		this._leading=value;
		this.element.style.letterSpacing=this._leading;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 行宽
 * @param {Number} l
 */
Object.defineProperty(InputText.prototype,"lineWidth",{
	get: function () {
        return this._lineWidth;
    },

    set: function (value) {
        if(this._lineWidth==value) return;
	
		this._lineWidth=value;
		this.updateSize();
    },
    enumerable: true,
    configurable: true
});

/**
 * 背景颜色
 * @param {Object} a
 */
Object.defineProperty(InputText.prototype,"bgColor",{
	get: function () {
        return this.element ? this.element.style.backgroundColor : "";
    },

    set: function (value) {
        this.element.style.backgroundColor=value;
    },
    enumerable: true,
    configurable: true
});

InputText.prototype.render=function()
{
	InputText.superClass.render.apply(this,arguments)
}

InputText.prototype.dispose=function()
{
	InputText.superClass.dispose.call(this);
	delete this.autoSize,this._selectable,this._enable,this._underline,this._writingMode,this.isInput,this.tabindex,this.password,this.multiline,this._lineWidth,this._size,this._leading,this._maxChars,this._font,this._color,this._textAlign,this._verticalAlign,this._bold,this._italic;
}


//----------------------------------------- MoveBar -----------------------------------------

function MoveBar()
{
	DisplayObjectContainer.call(this);
	
	this._enable=this.isInitialized=this.useUpdate=this.isY=false;
	this._min=this._max=this._value=0;
	this.mouseEnabled=this.mouseChildren=true;
	this._mousePos=this.bar=this.bottom=null;
	this.isOrder=true;
}

Global.inherit(MoveBar, DisplayObjectContainer);

/**
 * 设置参数
 * @param {Number} min       最小值
 * @param {Number} max       最大值
 * @param {Number} value     初始值
 * @param {DisplayBase} bar   移动条
 * @param {DisplayBase} bottom 底板
 * @param {Boolean} isY        方向
 * @param {Boolean} update     是否实时更新
 */
MoveBar.prototype.setup=function(min,max,value,bar,bottom,isY,update)
{
	this.bar=bar;
	this.bottom=bottom;
	
	this._min=min;
	this._max=max;
	this._value=value;
	
	this.isY=isY || false;
	this.useUpdate=update || false;
	
	if(this.bar && this.bottom) this.initialize();
}

MoveBar.prototype.initialize=function()
{	
	if(!this.contains(this.bottom)) this.addChild(this.bottom);
	if(!this.contains(this.bar))    this.addChild(this.bar);
	
	if(!this.isY){
		this.bar.x=this.bottom.x+this.bar.getWidth()/2;
		this.bar.y=this.bottom.y+(this.bottom.getHeight()-this.bar.getHeight())*0.5;
	}else{
		this.bar.x=this.bottom.x+(this.bottom.getWidth()-this.bar.getWidth())*0.5;
		this.bar.y=this.bottom.y+this.bottom.getHeight()-this.bar.getHeight()/2;
	}
	
	this.enable=this.isInitialized=true;
	this.barSync();
}

Object.defineProperty(MoveBar.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(value==null || value==this._enable) return;
    	this._enable=value;
    	this._activate_bar(this._enable);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MoveBar.prototype,"min",{
	get: function () {
	    return this._min;
    },

    set: function (value) {
    	if(value==null || value==this._min) return;
    	this._min=value;
    	this.barSync();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MoveBar.prototype,"max",{
	get: function () {
	    return this._max;
    },

    set: function (value) {
    	if(value==null || value==this._max) return;
    	this._max=value;
    	this.barSync();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MoveBar.prototype,"value",{
	get: function () {
	    return this._value;
    },

    set: function (value) {
    	if(value==null || value==undefined) return;
    	value=MathUtil.clamp(value,this._min,this._max);
    	
    	if(value==this._value) return;
    	this._value=value;
    	
    	this.barSync();
//  	this.dispatchEvent(Factory.c("ev",[MoveBar.CHANGE,this._value]));
    },
    enumerable: true,
    configurable: true
});

MoveBar.prototype._activate_bar=function(bool)
{
	if(this.bar==undefined ||  this.bottom==undefined) return;
	this.bar.mouseEnabled=this.bottom.mouseEnabled=this.bar.buttonMode=bool;
	this.bar.breakTouch=bool;
	
	if(bool){
		this.bar.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_down_bar, this));
		if(this.bottom.alpha>0 && this.bottom.visible) this.bottom.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._mouse_move_handler, this));
		return;
	}
	
	this.bar.removeEventListener(StageEvent.MOUSE_DOWN);
	this.bottom.removeEventListener(StageEvent.MOUSE_DOWN);
}

MoveBar.prototype._mouse_down_bar=function(e)
{
	this._mousePos=this.bar.globalToLocal(e.mouseX,e.mouseY);
	Stage.current.addEventListener(StageEvent.MOUSE_MOVE,Global.delegate(this._mouse_move_handler, this),this.name);
	Stage.current.addEventListener(StageEvent.MOUSE_UP,Global.delegate(this._mouse_up_bar, this),this.name);
}

MoveBar.prototype._mouse_up_bar=function(e)
{
	Stage.current.removeEventListener(StageEvent.MOUSE_MOVE,null,this.name);
	Stage.current.removeEventListener(StageEvent.MOUSE_UP,null,this.name);
	
	this._mousePos=null;
	this.dataSync();
}

MoveBar.prototype._mouse_move_handler=function(e)
{
	var offset;
	
	if(this._mousePos){
		offset=this._mousePos.subtract(this.bar.origin);
	}
	
	var pos=this.globalToLocal((e ? e.mouseX : Stage.current.mouseX)-(offset ? offset.x : 0),(e ? e.mouseY : Stage.current.mouseY)-(offset ? offset.y : 0))
	var xmouse=pos.x,ymouse=pos.y;
	
	if(this.isY){
		if(ymouse<=this.bottom.y){
			this.bar.y=this.bottom.y;
		}else if( ymouse>=(this.bottom.y+this.bottom.getHeight()-this.bar.getHeight())){
			this.bar.y=(this.bottom.y+this.bottom.getHeight()-this.bar.getHeight());
		}else{
			this.bar.y+=ymouse-this.bar.y;
		}
		
	}else{
		if(xmouse<=this.bottom.x){
			this.bar.x=this.bottom.x;
		}else if(xmouse>=(this.bottom.x+this.bottom.getWidth()-this.bar.getWidth())){
			this.bar.x=(this.bottom.x+this.bottom.getWidth()-this.bar.getWidth());
		}else{
			this.bar.x+=xmouse-this.bar.x;	
		}
	}
	
	if(this.useUpdate || (e.target==this.bottom)) this.dataSync();
}

MoveBar.prototype.dataSync=function()
{
	var value=0;
	if(this.isY){
	    value=Math.round(((this.bar.y-this.bottom.y)/(this.bottom.getHeight()-this.bar.getHeight()))*(this._max-this._min));
	}else{
		value=Math.round(((this.bar.x-this.bottom.x)/(this.bottom.getWidth()-this.bar.getWidth()))*(this._max-this._min));
	}
	
	if(this.isOrder){
		this._value=(this._min+value)>=this._max ? this._max : (this._min+value);
	}else{
		this._value=(this._max-value)<=this._min ? this._min : (this._max-value);
	}

	this.dispatchEvent(Factory.c("ev",[MoveBar.CHANGE,this._value,(this._mousePos==null)]));
}

MoveBar.prototype.barSync=function()
{
	if(!this.isInitialized || this.bar==undefined ||  this.bottom==undefined) return;
	var value=0;
	
	if(this.isOrder){
		value=this._value-this._min;
	}else{
		value=this._max-this._value;
	}
	
	if(this.isY){
	    this.bar.y=((value/(this._max-this._min))*(this.bottom.getHeight()-this.bar.getHeight()))+this.bottom.y;
	}else{
		this.bar.x=((value/(this._max-this._min))*(this.bottom.getWidth()-this.bar.getWidth()))+this.bottom.x;
	}
}

MoveBar.prototype.dispose=function()
{	
	this.enable=false;
	MoveBar.superClass.dispose.call(this);
	delete this._mousePos,this._enable,this.isInitialized,this.useUpdate,this.isY,this._min,this._max,this._value,this.bar,this.bottom,this.isOrder;
}

MoveBar.CHANGE="moveBarChange";

//----------------------------------------- SlideBar -----------------------------------------


function SlideBar()
{
	MoveBar.call(this);
	
	this.space=0;
	this.delta=0.05;
	this.minSize=12;
	this.useWheel=this.isScale=this.autoVisible=true;
	this._offset=this._rect=this._target=this._up_btn=this._down_btn=null;
}

Global.inherit(SlideBar, MoveBar);

Object.defineProperty(SlideBar.prototype,"upBtn",{
	get: function () {
	    return this._up_btn;
    },

    set: function (value) {
    	if(value==null || value==this._up_btn) return;
    	this._up_btn=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(SlideBar.prototype,"downBtn",{
	get: function () {
	    return this._down_btn;
    },

    set: function (value) {
    	if(value==null || value==this._down_btn) return;
    	this._down_btn=value;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(SlideBar.prototype,"target",{
	get: function () {
	    return this._target;
    },

    set: function (value) {
    	if(value==null || value==this._target) return;
    	var bool=this.enable;
    	
    	this.enable=false;
    	this._target=value;
    	
    	this._target.x=this._rect.x;
	    this._target.y=this._rect.y;
	    
	    this.enable=bool;
	    this.dataSync(true);
    },
    enumerable: true,
    configurable: true
});

/**
 * @param {DisplayBase} target
 * @param {Rectangle} rect
 * @param {DisplayBase} bar
 * @param {DisplayBase} bottom
 * @param {Boolean} isY
 * @param {Boolean} isScale
 * @param {Point} offset
 * @param {DisplayBase} upBtn
 * @param {DisplayBase} downBtn
 */
SlideBar.prototype.setup=function(target,rect,bar,bottom,isY,isScale,offset,upBtn,downBtn)
{
	this._rect=rect;
	this._target=target;
	
	if(this.useWheel){
		this._target.mouseEnabled=true;
		this._target.breakTouch=true;
	}
	
	this.bar=bar;
	this.bottom=bottom;
	this._offset=offset;
	
	this.useUpdate=true;
	this.isY=isY || false;
	this.isScale=isScale || false;
	
	if(upBtn) this._up_btn=upBtn;
	if(downBtn) this._down_btn=downBtn;
	
	this._min=0;
	this._value=0;
	this.resetRange();
	this.initLayout(this._offset);
}

SlideBar.prototype.resetRange=function(e)
{
	this.max=Math.max(0,Math.ceil(this.isY ? this._target.getHeight()-this._rect.height : this._target.getWidth()-this._rect.width));
    
    var bool=!(this._max==0 && this.autoVisible);
	this.bottom.visible=this.bar.visible=bool;
	
    if(this._down_btn) this._down_btn.visible=bool;
    if(this._up_btn) this._up_btn.visible=bool;
    
    if(e) this.updataSync();
}

SlideBar.prototype.initLayout=function(offset)
{
	this._target.x=this._rect.x;
	this._target.y=this._rect.y;
	
	var w=this._up_btn ? this._up_btn.getWidth() : 0;
	var h=this._up_btn ? this._up_btn.getHeight() : 0;
	
	this.bottom.x=(this.isY ? (this._rect.x + this._rect.width + this.space) : this._rect.x + w)+(offset ? offset.x : 0);
	this.bottom.y=(this.isY ? this._rect.y+h : this._rect.y+ this._rect.height+ this.space)+(offset ? offset.y : 0);
	
	if(this.isY) this.bottom.height=this._rect.height-2*h;
	else         this.bottom.width=this._rect.width-2*w;
	
	this.initialize();
	
	if(this._up_btn){
		if(!this.contains(this._up_btn)) this.addChild(this._up_btn);
		this._up_btn.moveTo((this.isY ? (this._rect.x + this._rect.width+ this.space) : this._rect.x)+(offset ? offset.x : 0),(this.isY ? this._rect.y : this._rect.y+ this._rect.height+ this.space)+(offset ? offset.y : 0));
	}
	
	if(this._down_btn){
		if(!this.contains(this._down_btn)) this.addChild(this._down_btn);
		this._down_btn.moveTo((this.isY ? (this._rect.x + this._rect.width+ this.space) : this._rect.x + this._rect.width-w)+(offset ? offset.x : 0),(this.isY ? this._rect.y+ this._rect.height-h : this._rect.y+ this._rect.height+ this.space)+(offset ? offset.y : 0));
	}
}

SlideBar.prototype._reset_handler=function(e)
{
	if(e.params){
		this._rect.width=(e.params.hasOwnProperty("w") ? e.params.w : this._rect.width);
		this._rect.height=(e.params.hasOwnProperty("h") ? e.params.h : this._rect.height);
	}
	
	if(e.label){
		this._offset=(this._offset==undefined ? new Point() : this._offset);
		this._offset.x=(e.label.hasOwnProperty("x") ? e.label.x : this._offset.x);
		this._offset.y=(e.label.hasOwnProperty("y") ? e.label.y : this._offset.y);
	}
	
	this.initLayout(this._offset);
}

SlideBar.prototype._activate_bar=function(bool)
{
	SlideBar.superClass._activate_bar.call(this,bool);
	
	if(bool){
		if(this._target) {
			this._target.addEventListener(Event.RESIZE,Global.delegate(this._reset_handler,this),this.name);
			this._target.addEventListener(DisplayBase.RESIZE,Global.delegate(this.resetRange,this),this.name);
			this._target.addEventListener(StageEvent.DRAG_MOVE,Global.delegate(this.dragHandler,this),this.name);
			this._target.addEventListener(DisplayBase.RESET_INSTANCE,Global.delegate(this.resetRange,this),this.name);
			if(this.useWheel) this._target.addEventListener(StageEvent.MOUSE_WHEEL,Global.delegate(this.wheelHandler,this),this.name);
		}
		
		if(this._up_btn) this._up_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._clickUpBtn,this));
		if(this._down_btn) this._down_btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._clickDownBtn,this));
		return;
	}
	
	if(this._target) {
		this._target.removeEventListener(Event.RESIZE,null,this.name);
		this._target.removeEventListener(DisplayBase.RESIZE,null,this.name);
		this._target.removeEventListener(StageEvent.DRAG_MOVE,null,this.name);
		this._target.removeEventListener(StageEvent.MOUSE_WHEEL,null,this.name);
		this._target.removeEventListener(DisplayBase.RESET_INSTANCE,null,this.name);
	}
	
	if(this._up_btn) this._up_btn.removeEventListener(StageEvent.MOUSE_CLICK);
	if(this._down_btn) this._down_btn.removeEventListener(StageEvent.MOUSE_CLICK);
}

SlideBar.prototype.dragHandler=function(e)
{
	this.value=this.isY ? this._rect.y-this._target.y : this._rect.x-this._target.x;
}

SlideBar.prototype.wheelHandler=function(e)
{
	this.updataSync(this._value+(e.delta<0 ? 1 : -1)*Math.max(1,Math.ceil(this.delta*this._max)));
}

SlideBar.prototype.barSync=function()
{
	if(this.isScale){
		if(this.isY) this.bar.height=Math.max(this.bottom.height*(1-this.max/this.bottom.height),this.minSize);
		else         this.bar.width=Math.max(this.bottom.width*(1-this.max/this.bottom.width),this.minSize);
	}
	
	SlideBar.superClass.barSync.call(this);
}

SlideBar.prototype.dataSync=function(bool)
{
	if(bool==undefined) SlideBar.superClass.dataSync.call(this);
	
	if(this.isY) this._target.y=this._rect.y-this._value;
	else         this._target.x=this._rect.x-this._value;
}

SlideBar.prototype.updataSync=function(v)
{
	this.value=(v==undefined) ? (this.isY ? this._rect.y-this._target.y : this._rect.x-this._target.x) : v;
	this.dataSync(true);
}

SlideBar.prototype._clickUpBtn=function(e)
{
	this.updataSync(this._value-Math.max(1,Math.ceil(this.delta*this._max*2)));
}

SlideBar.prototype._clickDownBtn=function(e)
{
	this.updataSync(this._value+Math.max(1,Math.ceil(this.delta*this._max*2)));
}

SlideBar.prototype.dispose=function()
{
	SlideBar.superClass.dispose.call(this);
	delete this._offset,this._target,this._up_btn,this._down_btn,this._rect;
	delete this.useWheel,this.space,this.delta,this.minSize,this.isScale,this.autoVisible;
}

//----------------------------------------- BitmapText -----------------------------------------


function BitmapText()
{
	Sprite.call(this);
	this.mouseEnabled=this.mouseChildren=false;
	
	this._is_init=false;
	this._has_update=true;
	
	this._lineSpacing = 0;
	this._lineWidth = 0;
	this._leading = 0;
	this._size = 0;
	
	this._color = "";
	this._text = "";
    this._font = "";
    this._textAlign = "start";
    
    this.name = "bitmap_text_"+this.name;
    this._ct=this._fonts=this._instance=null;
}

Global.inherit(BitmapText, Sprite);

/**
 * 内容
 * @param {String} text
 */
Object.defineProperty(BitmapText.prototype,"text",{
	get: function () {
        return this._text;
    },

    set: function (value) {
        if(!this._is_init || this._text==value) return;
	
		this._text=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 例如 "微软雅黑,宋体"
 * @param {String} font
 */
Object.defineProperty(BitmapText.prototype,"font",{
	get: function () {
        return this._font;
    },

    set: function (value) {
        if(!this._is_init || this._font==value) return;
	
		this._font=value;
		this._fonts=FontManager.get(this._font);
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体颜色 0xFFFFFF "#FFFFFF"
 * @param {Number} {String} c
 */
Object.defineProperty(BitmapText.prototype,"color",{
	get: function () {
        return this._color;
    },

    set: function (value) {
    	value=ColorUtil.formatColor(value);
        if(this._color==value) return;
	
		this._color=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 行间距
 * @param {Number} lineWidth
 */
Object.defineProperty(BitmapText.prototype,"lineSpacing",{
	get: function () {
        return this._lineSpacing;
    },

    set: function (value) {
        if(!this._is_init || this._lineSpacing==value) return;
	
		this._lineSpacing=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字间距
 * @param {Number} leading
 */
Object.defineProperty(BitmapText.prototype,"leading",{
	get: function () {
        return this._leading;
    },

    set: function (value) {
        if(!this._is_init || this._leading==value) return;
	
		this._leading=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体大小 （不建议使用）
 * @param {Number} 
 */
Object.defineProperty(BitmapText.prototype,"size",{
	get: function () {
        return this._size;
    },

    set: function (value) {
        if(this._size==Number(value) || isNaN(value)) return;
	
	    value=Number(value);
		this.scale=this.scale*MathUtil.format(value/this._size);
		this._size=value;
    },
    enumerable: true,
    configurable: true
});


/**
 * 行宽
 * @param {Number} lineWidth
 */
Object.defineProperty(BitmapText.prototype,"lineWidth",{
	get: function () {
        return this._lineWidth;
    },

    set: function (value) {
        if(!this._is_init || this._lineWidth==value) return;
	
		this.width=this._lineWidth=Math.min(100,value);
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * start、end、right、center
 */
Object.defineProperty(BitmapText.prototype,"align",{
	get: function () {
        return this._textAlign;
    },

    set: function (value) {
        if(!this._is_init || this._textAlign==value) return;
	
		this._textAlign=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 设置
 * @param {String} t text
 * @param {String} f font
 * @param {Number} w lineWidth
 * @param {String} c color
 * @param {String} a align
 */
BitmapText.prototype.setup=function(t,f,w,c,a)
{
	this._text=t || this._text;
	this._font=f || this._font;
	this._color=c || this._color;
	
	this.width=this._lineWidth=w || this._lineWidth;
	this._textAlign=a || this._textAlign;
	this._fonts=FontManager.get(this._font);
	if(this._fonts==undefined) return;
	
	this._size=Math.abs(Number(this._fonts.info.size));
	
	if(this._instance==undefined && Global.useCanvas){
		this._instance=ObjectPool.create(DisplayObject);
		this.addChild(this._instance);
	}
	
	this._is_init=this._has_update=true;
	if(this._fonts) this._update();
}

BitmapText.prototype._update=function()
{
	this.__checkDisplayUpdate();
	
//	var array=this._fonts.info.padding.split(",");
	var spacing=this._fonts.info.spacing.split(",");
	
	var space_left=Number(spacing[0]);
	var space_up=Number(spacing[1]);
	
	var i,countX=space_left,countY=space_up;
	var item,char,pos,len = this._text.length, charCode = -1,h=0,w=0;
	var old=new Point();
	var miss="";
	
	if(Global.useCanvas){
		this._instance._catchToContext();
		this._instance.canvas.width=Global.canvas.width;
		this._instance.canvas.heigth=Global.canvas.height;
	}else{
		this.removeAllChildren(true);
	}
	
	for (i = 0; i < len; i++) {
		charCode = this._text.charCodeAt(i);
		char = this._fonts.chars[charCode];
		
		if(char==undefined) {
			miss+='"'+this._text.charAt(i)+'" ';
			continue;
		}
		
		if(Global.useCanvas){
			pos=char.reg;
			this._instance.context.translate(countX-pos.x-old.x, countY-pos.y-old.y);
			this._instance.context.drawImage(char.image,char.rect.x,char.rect.y,char.rect.width,char.rect.height,0,0,char.rect.width,char.rect.height);
			old.reset(countX-pos.x,countY-pos.y);
		}else{
			item=ObjectPool.create(DOMDisplay);
			item.setInstance(char);
			item.moveTo(countX,countY);
			this.addChild(item);
			pos=item.origin;
		}
		
	    if(h==0) h=char.rect.height;
	    else     h=Math.max(h,char.rect.height);
	    
	    countX+=char.rect.width+this._leading+space_left;
	    
	    if(countX>=(this._lineWidth<=0 ? Global.canvas.width : this._lineWidth)-char.rect.width){
	    	if(i+1 < len){
	    		charCode = this._text.charCodeAt(i+1);
	    		if(charCode>=65 && charCode<123) continue;
	    	}
	    	
	    	w=Math.max(w,countX);
	    	countX=space_left;
	    	countY+=this._lineSpacing+(h ? Math.ceil(h) : 0)+space_up;
	    	h=0;
	    }
	}
	
	w=Math.ceil(Math.max(w,countX));
	countY=Math.ceil(countY+h+space_up);
	
	this.width=w;
	this.height=countY;
	this._has_update=false;
	
	if(Global.useCanvas) {
		this._instance.width=w;
		this._instance.height=countY;
	}
	
	if(!StringUtil.isEmpty(miss)) 
	      trace("[WARN] BitmapText.prototype._update miss fonts ["+miss+"]");
	
//	if(StringUtil.isEmpty(this._color)) return;
//	
//	if(Global.useCanvas) {
//      if(this._ct==undefined) this._ct=new ColorTransform();
//      this._ct.setColor(this._color);
//      CanvasUtil.colorTransform(this._instance.context,{x:0,y:0,width:w,height:countY},this._ct);
//      return;
//	}
//	
}

BitmapText.prototype.render=function()
{
	if(StringUtil.isEmpty(this._text)) return;
	if(this._has_update) this._update();
	BitmapText.superClass.render.apply(this,arguments);
}

BitmapText.prototype.dispose=function()
{
	if(this._instance) this._instance.removeFromParent(true);
	BitmapText.superClass.dispose.call(this);
	
	delete  this._size,this._ct,this._color,this._is_init,this._has_update,this._lineSpacing,this._lineWidth,this._leading,this._text,this._font,this._textAlign,this._instance;
}

//----------------------------------------- TextField -----------------------------------------

/**
===================================================================
TextField Class
===================================================================
**/

/**
 * s text,f font,c color,z size,t type
 * @param {String} string_content
 * @param {String} font_name
 * @param {String} color 
 * @param {Number} size 
 * @param {String} type ( 'fill' 'both' 'stroke')
 * @param {String} stroke_color
 * @param {Number} leading
 */
function TextField(s,f,c,z,t,c2,l)
{
	DisplayObject.call(this);
	this._text = s || "";
    this._font = f || "Microsoft YaHei,Arial";
    this._color= (c==undefined ? "#000000" : ColorUtil.formatColor(c));
    this._color2 = c2 || this._color;
    this._size = z || 12;
	this._textAlign = "left";
    this._textBaseline = "top";
	this._type=t || "fill";
	this._has_update=true;
	this._leading=l || 1;
	this._underline=this._italic=this._bold=false;
	
	this._maxWidth = 0;
	this._lineWidth = null;
	this._fontMetrics = null;
	
	this.autoSize=true;
	this.mouseEnabled=false;
	this._writingMode=false;
	
	this.width=0;
	if(!StringUtil.isEmpty(this._text)) this._update();
}

Global.inherit(TextField,DisplayObject);

/**
 * 行宽
 * @param {Number} l
 */
Object.defineProperty(TextField.prototype,"lineWidth",{
	get: function () {
        return this._lineWidth;
    },

    set: function (value) {
        if(this._lineWidth==value) return;
	
		this._lineWidth=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 斜体
 * @param {Boolean} i
 */
Object.defineProperty(TextField.prototype,"italic",{
	get: function () {
        return this._italic;
    },

    set: function (value) {
        if(this._italic==value) return;
	
		this._italic=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 是否竖排(默认 否)
 * @param {Boolean} 
 */
Object.defineProperty(TextField.prototype,"writingMode",{
	get: function () {
        return this._writingMode;
    },

    set: function (value) {
        if(this._writingMode==value) return;
	
		this._writingMode=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 下划线
 */
Object.defineProperty(TextField.prototype,"underline",{
	get: function () {
        return this._underline;
    },

    set: function (value) {
        if(this._underline==value) return;
		this._underline=value;
    },
    enumerable: true,
    configurable: true
});

/**
 * 粗体
 * @param {Boolean} b
 */
Object.defineProperty(TextField.prototype,"bold",{
	get: function () {
        return this._bold;
    },

    set: function (value) {
        if(this._bold==value) return;
	
		this._bold=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 内容
 * @param {String} s
 */
Object.defineProperty(TextField.prototype,"text",{
	get: function () {
        return this._text;
    },

    set: function (value) {
        if(this._text==value) return;
	
		this._text=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体 例如 "14px/30px"
 * @param {Number} {String} z
 */
Object.defineProperty(TextField.prototype,"size",{
	get: function () {
        return this._size;
    },

    set: function (value) {
        if(this._size==value) return;
	
		this._size=value;
		this._has_update=true;
		this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
    },
    enumerable: true,
    configurable: true
});

/**
 * 字体颜色 0xFFFFFF "#FFFFFF"
 * @param {Number} {String} c
 */
Object.defineProperty(TextField.prototype,"color",{
	get: function () {
        return this._color;
    },

    set: function (value) {
    	if(StringUtil.isEmpty(value)) return;
    	value=ColorUtil.formatColor(value);
        if(this._color==value) return;
	
		this._color=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 文字描边颜色
 * @param  {Number} {String} c
 */
Object.defineProperty(TextField.prototype,"strokeColor",{
	get: function () {
        return this._color2;
    },

    set: function (value) {
    	value=ColorUtil.formatColor(value);
        if(this._color2==value) return;
	
		this._color2=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});


/**
 * 例如 "微软雅黑,宋体"
 * @param {String} f
 */
Object.defineProperty(TextField.prototype,"font",{
	get: function () {
        return this._font;
    },

    set: function (value) {
        if(this._font==value) return;
	
		this._font=value;
		this._has_update=true;
		this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
    },
    enumerable: true,
    configurable: true
});

/**
 * fill both stroke
 * @param {String} t
 */
Object.defineProperty(TextField.prototype,"type",{
	get: function () {
        return this._type;
    },

    set: function (value) {
        if(this._type==value) return;
	
		this._type=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});


/**
 * start、end、right、center
 */
Object.defineProperty(TextField.prototype,"align",{
	get: function () {
        return this._textAlign;
    },

    set: function (value) {
        if(this._textAlign==value) return;
	
		this._textAlign=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * 字间距
 * @param {Object} a
 */
Object.defineProperty(TextField.prototype,"leading",{
	get: function () {
        return this._leading;
    },

    set: function (value) {
        if(this._leading==value) return;
	
		this._leading=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});

/**
 * top、hanging、middle、alphabetic、ideographic、bottom
 */
Object.defineProperty(TextField.prototype,"baseLine",{
	get: function () {
        return this._textBaseline;
    },

    set: function (value) {
        if(this._textBaseline==value) return;
	
		this._textBaseline=value;
		this._has_update=true;
    },
    enumerable: true,
    configurable: true
});


/**
 * 获得字体框宽度
 */
Object.defineProperty(TextField.prototype,"textWidth",{
	get: function () {
        return (StringUtil.isEmpty(this._text)) ? 0 : (this.context==null ? Global.context :this.context).measureText(this._text).width;
    },
    enumerable: true,
    configurable: true
});

TextField.prototype._update=function()
{
	if(this.canvas==null) CanvasUtil.create(this);
	this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
	
	if(Global.canvas.height>this.canvas.height || this.height>this.canvas.height) this.canvas.height=Math.max(Global.canvas.height,this.height);
	if(Global.canvas.width>this.canvas.width || this.width>this.canvas.width) this.canvas.width=Math.max(Global.canvas.width,this.width);

	this.context.font = (this._italic ? "italic " : "")+(this._bold ? "bold " : "")+(ObjectUtil.getType(this._size)=="number" ? this._size+"px " : this._size+" ")+this._font;
	this.context.textAlign = this._textAlign!=null ? this._textAlign : "left";
    this.context.textBaseline = this._textBaseline!=null ? this._textBaseline: "top";
	
	if(this._writingMode) this._vertical_text();
	else   this._horizontal_text();
	
	this._has_update=false;
	this.__checkDisplayUpdate();
}

TextField.prototype._vertical_text=function()
{
	if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
	
	var texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
	var i,line,l=texts.length, width,dy = 0,my=Math.max(this._lineWidth,this.height), sy=(this._textAlign=="right" || this._textAlign=="end" ? my : (this._textAlign=="center"? my*0.5 : 0)), lineHeight = this._fontMetrics.height + this._leading;
    var by=0,mw=0,mx=Math.max(this._lineWidth,this.width);
	
	for (i=0;i<l;i++){
		line=texts[i];
		width=0;
		by=sy;
		
		for(var j = 0, wlen = line.length; j < wlen; j++)
		{
			var word = line.charAt(j);
			if(!word || word.length == 0) continue;
			width=this.context.measureText(word).width;
			mw=Math.max(mw,width);
			
			if(sy+dy<my){
				this._draw(word, by+dy,mx-width);
				dy=dy+(this._textAlign=="right" || this._textAlign=="end" ? -lineHeight : lineHeight);
			}else{
				dy=0;
				mx-=mw+this._leading;
			}
			
			by=0;
		}
		
		dy=0;
		mx-=mw+this._leading;
	}
}

TextField.prototype._horizontal_text=function()
{
	if(this._fontMetrics == null) this._fontMetrics = TextField.getFontMetrics(this.font,this.size);
	
	var texts=this._text.split(/\r\n|\r|\n|<br(?:[ \/])*>/);
	var i,line,width,l=texts.length, dy = 0,lineHeight = this._fontMetrics.height + this._leading;
	if(this.autoSize) this.width = this._lineWidth ;
	
	for (i=0;i<l;i++){
		line=texts[i];
		width = this.context.measureText(line).width;
		
		if(this._lineWidth == null || width < this._lineWidth)
		{
			if(width > this.width && this.autoSize) this.width = width;
			this._draw(line, dy);
			dy += lineHeight;
			continue;
		}

		var words = line.split(/([^\x00-\xff]|\b)/), str = words[0];
		for(var j = 1, wlen = words.length; j < wlen; j++)
		{
			var word = words[j];
			if(!word || word.length == 0) continue;

			var newWidth = this.context.measureText(str + word).width;
			if(newWidth > this._lineWidth)
			{
				this._draw(str, dy);
				dy += lineHeight;
				str = word;
			}else
			{
				str += word;
			}
		}

		this._draw(str, dy);
		dy += lineHeight;
	}

	if(this.autoSize) this.height = dy;
}

TextField.prototype._draw=function(str,posY,posX)
{
	posX =(posX==undefined) ? 0 : posX;
	posY =(posY==undefined) ? 0 : posY;
	
	if(!this._writingMode) {
		switch(this._textAlign)
		{
			case "center":
				posX = this.width*0.5;
				break;
			case "right":
			case "end":
				posX = this.width;
				break;
		};
	}
	
	switch(this._type) 
	{
		case "fill":
	   
		   this.context.fillStyle = this._color;
	   
		   this.context.fillText  (str,  posX, posY,this._maxWidth || 0xFFFF);
	   
		   break;
	   
		case "stroke":
	   
		   this.context.strokeStyle = this._color2;
	   
		   this.context.strokeText  (str, posX, posY,this._maxWidth || 0xFFFF);
	   
		   break;
	   
		case "both":
	   
		   this.context.fillStyle = this._color;
	   
		   this.context.fillText  (str, posX, posY,this._maxWidth || 0xFFFF);
	   
		   this.context.strokeStyle = this._color2;
	   
		   this.context.strokeText (str, posX, posY,this._maxWidth || 0xFFFF);
	   
		   break;
        
	}
}

Object.defineProperty(TextField.prototype,"stage",{
	get: function (){
		return this._stage;
	},
    set: function (value) {
        if(this._stage==value) return;
		if(this._stage) this._stage.removeEventListener(StageEvent.UPDATE,null,this.name);
		
		this._stage=value;
		if(this._stage) this._stage.addEventListener(StageEvent.UPDATE,Global.delegate(this.__update_size,this),this.name);
    },
    enumerable: true,
    configurable: true
});

TextField.prototype.__update_size=function(e)
{
	if(this.canvas==null) return;
	if(Global.canvas.width>(this.canvas.width+1) ||  Global.canvas.height>(this.canvas.height+1)){
		this._has_update=true;
	}
}

TextField.prototype._render=function(target,initial,package)
{
	if(StringUtil.isEmpty(this._text)) return;
	if(this._has_update) this._update();
	TextField.superClass._render.call(this,target,initial,package);
}

TextField.prototype.dispose=function()
{
	TextField.superClass.dispose.call(this);
	delete this.autoSize,this._underline,this._writingMode,this._text,this._font,this._color,this._color2,this._size,this._textAlign,this._textBaseline,this._type,this._has_update,this._leading,this._italic,this._bold,this._maxWidth,this._lineWidth,this._fontMetrics,this.mouseEnabled;
}

TextField.prototype.toString=function()
{
	return ["TextField"];
}

TextField.getFontMetrics = function(font,size)
{
	var metrics = { };
	var elem = DOMUtil.createDOM("div", {style:{fontFamily:font,fontSize:size+"px", position:"absolute"}, innerHTML:"M"});
	document.body.appendChild(elem);
	
	metrics.height = elem.offsetHeight;
	elem.innerHTML = '<div style="display:inline-block; width:1px; height:1px;"></div>';
	var baseline = elem.childNodes[0];
	metrics.ascent = baseline.offsetTop + baseline.offsetHeight;
	metrics.descent = metrics.height - metrics.ascent;
	
	document.body.removeChild(elem);
	return metrics;
};
//----------------------------------------- Stage -----------------------------------------

/**
===================================================================
Stage Class
===================================================================
**/
function Stage()
{
	DisplayObjectContainer.call(this);

	this.usePixelTrace = this.traceMouseTarget = true;
	this.timer=this.dragTarget = this.mouseTarget = this._mouseDownTarget =null;
	this.stageX=this.stageY=0;
	this.mouseX=this.mouseY=0;
	this.auto_clear=true;
	this.last_fresh=true;
	this.auto_fresh=true;
	this.block_ratio=0.05;
	
	this._dragMouseX=this._dragMouseY=0;
	this.name="stage"+Stage.COUNT++;
	this._parent_node=null;
	this._isTap=false;
	this._block=null;
	this._area=null;
	this._layer=-1;
	this.stage=this;
	
	this.context;
	this.canvas;
	this.div;

	if(Stage.current) return;
	Stage.current=this;
}

Global.inherit(Stage,DisplayObjectContainer);

/**
 * 设置全局画布
 * @param {Number} w
 * @param {Number} h
 * @param {HTMLCanvasElement} c embed html canvas element
 * @param {Boolean} e 是否可编辑
 */
Stage.prototype.initCanvas=function(w,h,c,e)
{
	var err=false;
	this.canvas=c;
	
	if(c==undefined){ 
		try{
			this.canvas=document.createElement("canvas");
		}
		catch(error){
			err=true;
			this.canvas={style:{},context:{}};
			trace("[WARN] Stage initCanvas()",error);
		}
		
		this.canvas.width=w;
		this.canvas.height=h;
		
		if(e) this.canvas.contenteditable=this.canvas.draggable=this.canvas.dropzone=true;
		
		this.canvas.offsetLeft=this.canvas.offsetTop=0;
		this.canvas.tabindex=0;
		
		this.canvas.style.position="absolute";
		this.canvas.style.zIndex=Global.layer;
		this.canvas.style.padding=0;
		this.canvas.style.margin=0;
		
		if(this.div==undefined){
			this.div=DOMUtil.createDOM("div",{id: "container_"+this.name,style:
			{
				overflow : "hidden",
				position: "absolute",
				height: h + "px",
				width: w + "px",
				padding:"0",
				margin:"0",
				cursor:""
			}});
			document.body.appendChild(this.div);
			this._parentNode=this.div;
		}
		
        if(!err) this.div.appendChild(this.canvas);
	}

	this.context=err ? this.canvas.context : this.canvas.getContext("2d");
	this.updatePosition(err || !Global.useCanvas);
	
	if(Stage.current!=this) return;
	Global.height=h;
	Global.width=w;
	
	Global.context=this.context;
	Global.canvas=this.canvas;
	Global.div=this.div;
	this.enable(true);
}

Stage.prototype.enable=function(bool)
{
	this.__touch_handler = this.__touch_handler ? this.__touch_handler : Global.delegate(this._touchHandler, this);
	this.__mouse_handler = this.__mouse_handler ? this.__mouse_handler : Global.delegate(this._mouseHandler, this);
	this.__key_handler = this.__key_handler ? this.__key_handler : Global.delegate(this._keyHandler, this);
	this.__enter_frame = this.__enter_frame ? this.__enter_frame : Global.delegate(this._enterFrame, this);
	this.timer=this.timer ? this.timer : new Timer();
	
	var body=this.div ? this.div : document;
	
	if (StageEvent.supportTouch())
	{
		if(bool){
			body.addEventListener("touchstart", this.__touch_handler, false);
			body.addEventListener("touchmove", this.__touch_handler, false);
			document.addEventListener("touchend", this.__touch_handler, false);
		}else{
			body.removeEventListener("touchstart", this.__touch_handler);
			body.removeEventListener("touchmove", this.__touch_handler);
			document.removeEventListener("touchend", this.__touch_handler);
		}
	}
	else
	{
		if(bool){
			body.addEventListener(Global.isFirefox ? "DOMMouseScroll" : "mousewheel", this.__mouse_handler, false);
			body.addEventListener("mousedown", this.__mouse_handler, false);
			body.addEventListener("mousemove", this.__mouse_handler, false);
			document.addEventListener("mouseup", this.__mouse_handler, false);
		}else{
			body.removeEventListener(Global.isFirefox ? "DOMMouseScroll" : "mousewheel", this.__mouse_handler);
			body.removeEventListener("mousedown", this.__mouse_handler);
			body.removeEventListener("mousemove", this.__mouse_handler);
			document.removeEventListener("mouseup", this.__mouse_handler);
		}
	}
	
	if(bool){
		body.addEventListener("keydown", this.__key_handler, false);
		body.addEventListener("keyup", this.__key_handler, false);
		
		this.timer.addEventListener(Timer.TIME,this.__enter_frame, false);
   		this.timer.start();
   		
	}else{
		
		body.removeEventListener("keydown", this.__key_handler);
	    body.removeEventListener("keyup", this.__key_handler);
	    
	    this.timer.removeEventListener(Timer.TIME,this.__enter_frame);
    	this.timer.stop();
	}
}

Stage.prototype.resize = function(w,h) 
{
	this.dispatchEvent(Factory.c("ev",[StageEvent.RESIZE,{width:w,height:h}]));
}

Stage.prototype._enterFrame = function(e) 
{
	if(this.auto_clear && (DisplayObjectContainer._num_canvas_target>0 || this.last_fresh)) {
		if(this.auto_fresh) this.clear();
		
		if(!DisplayObjectContainer._num_canvas_target>0 && this.last_fresh) {
			this.last_fresh=false;
			
			if(this.canvas) {
				var temp=this._parent_node;
				this._parent_node=this.canvas.parentNode;
				if(this._parent_node) this._parent_node.removeChild(this.canvas);
				else this._parent_node=temp ? temp : this.div;
			}
		}
	}

	if(this.numChildren>0) this.render();
	if(Media.Container.list.length>0) Media.Container.enterFrame();
	this.dispatchEvent(Factory.c("ev",[StageEvent.ENTER_FRAME]));
}

Stage.prototype.render = function()
{
	if(!this.last_fresh && DisplayObjectContainer._num_canvas_target>0) {
		this.last_fresh=true;
		
		if(this.canvas && this._parent_node) {
			this._parent_node.appendChild(this.canvas);
		}
	}

	DOMDisplay._depth_count=0;
	
	if(this.auto_fresh) {
		this.auto_fresh=false;
		Stage.superClass.render.call(this);
	}
//	else trace("[PAUSE]");
}

Stage.prototype._dragHandler=function ()
{	
	var posX = this._dragMouseX;
	var posY = this._dragMouseY;
	
	var pos = this.dragTarget.origin;
	var pos2 = this.dragTarget.localToGlobal(pos);
	pos = this.dragTarget.localToGlobal(posX,posY);
	
	posX = Math.round(this.mouseX - (pos.x-pos2.x));
	posY = Math.round(this.mouseY - (pos.y-pos2.y));
	
	var point;
	
	if(this._block && !this._block.contains(posX,posY)){
		point=this.dragTarget.localToGlobal(0,0);
		
		posX = point.x+(posX-point.x)*this.block_ratio;
		posY = point.y+(posY-point.y)*this.block_ratio;
	}
	
	if(this._area){
		point=new Point(posX,posY);
		point=Rectangle.innerPoint(this._area,point);
		
		posX=point.x;
		posY=point.y;
	}
	
	pos = this.dragTarget.parent.globalToLocal(posX,posY);
	this.dragTarget.x = pos.x;
	this.dragTarget.y = pos.y;
	
	if(!this._isTap) this.dragTarget.dispatchEvent(Factory.c("ev",[StageEvent.DRAG_MOVE]));
}

Stage.prototype.clear = function()
{
	if(this.context) this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
}

Stage.prototype._touchHandler=function(e)
{	
	var a = e.touches && e.touches.length>0 ? e.touches[0] : (e.changedTouches && e.changedTouches.length>0 ? e.changedTouches[0] : null);
	
	if (a) {
		this.mouseX = (a.pageX || a.clientX || a.screenX) - this.stageX;
		this.mouseY = (a.pageY || a.clientY || a.screenY) - this.stageY;
	}
	
	if(this.traceMouseTarget ) this._getMouseTarget(e);
	
	a = {
		id    : (a ? a.identifier : 0),
		target: this.mouseTarget || this,
		mouseX: this.mouseX,
		mouseY: this.mouseY,
        button: 0
	};
	
	a.type=Stage.translationType(e.type);
	a = Global.copy(e, StageEvent, a);
	
	if (this.mouseTarget && this.mouseTarget.onMouseEvent && (this.mouseTarget.onMouseEvent(a), a.type == StageEvent.MOUSE_UP)) 
		this.mouseTarget.onMouseEvent(Global.copy(e, StageEvent, {type: StageEvent.MOUSE_OUT}));
	
	if(e.touches.length>0){
		a.touchs=[];
		var i,t,mx,my,l=e.touches.length;
		
	    for (i=0;i<l;i++){
	    	t=e.touches[i];
	    	
	    	if(Global.useCanvas){
	    		if(t.target!=this.canvas) continue;
	    	}else{
	    		if(this.div && t.target!=this.div) continue;
	    	}
			
	    	mx=(t.pageX || t.clientX || t.screenX) - this.canvas.offsetLeft;
	    	my=(t.pageY || t.clientY || t.screenY) - this.canvas.offsetTop;
	    	a.touchs.push({mouseX:mx,mouseY:my,type:Stage.translationType(t.type),id:t.identifier});
	    }
	}
	
	a.length=a.touchs ? a.touchs.length : 0;
	if (a.type==StageEvent.MOUSE_MOVE && this.dragTarget) this._dragHandler();
	
	var bool=a.target.breakTouch;
	var copy=(a.target!=this) ?  Global.copy(a,StageEvent) : null;
	
	var bt=this._checkMouseClick(a);
	a.target.dispatchEvent(a);
	
	if(copy) this.dispatchEvent(copy);
	if(!(Global.breakTouch || bool || bt)) return;
	
	e.preventDefault();
	e.stopPropagation();
}

Stage.prototype._mouseHandler=function(e)
{
	var mx = e.pageX - this.stageX;
	var my = e.pageY - this.stageY;
	
	var a = Global.copy(e,StageEvent);
	var b = (mx==this.mouseX && my==this.mouseY);
	
	if(b && e.type==StageEvent.MOUSE_MOVE){
		a.type=StageEvent.MOUSE_OVER;
	}
	
	if(e.type=="DOMMouseScroll"){
		a.type=StageEvent.MOUSE_WHEEL;
	}
	
	this.mouseX = mx;
	this.mouseY = my;
	
	if(this.traceMouseTarget && e.type==StageEvent.MOUSE_MOVE) this._getMouseTarget(e);

	a.target = this.mouseTarget || this;
	a.mouseX = this.mouseX;
	a.mouseY = this.mouseY;
	a.delta = e.wheelDelta ? (e.wheelDelta / 120) : (- e.detail / 3); 
	
	if (this.mouseTarget && this.mouseTarget.onMouseEvent) this.mouseTarget.onMouseEvent(a);
	this.setCursor(this.mouseTarget && this.mouseTarget.buttonMode ? "pointer" : "");
	if (a.type==StageEvent.MOUSE_MOVE && this.dragTarget) this._dragHandler();
	
	var bool=a.target.breakTouch;
	var copy=(a.target!=this) ?  Global.copy(a,StageEvent) : null;
	
	var bt=this._checkMouseClick(a,b);
	a.target.dispatchEvent(a);
	
	if(copy) this.dispatchEvent(copy);
	if(!(Global.breakTouch || bool || bt)) return;
	
	e.preventDefault();
	e.stopPropagation();
}

Stage.prototype._checkMouseClick =function (a,b)
{
	if(a.type==StageEvent.MOUSE_DOWN && this.mouseTarget){
		this._mouseDownTarget = this.mouseTarget;
		this._isTap=true;
	}
	
	if(a.type==StageEvent.MOUSE_UP){
		if(this._mouseDownTarget!=null && a.target!=this && a.target==this._mouseDownTarget){
			a.target.dispatchEvent(this.__copyStageEvent(a,this._mouseDownTarget,StageEvent.MOUSE_CLICK));
			
		    if(this._isTap) {
		    	var evt=this.__copyStageEvent(a,this._mouseDownTarget,StageEvent.MOUSE_TAP);
		    	this.__transmitEvent(evt);
		    	a.target.dispatchEvent(evt);
		    }
		}
		
		this._mouseDownTarget = null;
		this._isTap=false;
	}
	
	if(a.type==StageEvent.MOUSE_MOVE && !b) {
		this._isTap=false;
		return false;
	}
	
	if(a.target==this) return false;
	return this.__transmitEvent(a);
}

Stage.prototype.__transmitEvent = function(a)
{
	if(a==undefined || a.target==undefined) return;
	
	var bt=false;
	var bool,obj=a.target;
	
	for(obj=obj.parent; obj!=null && obj!=this; obj=obj.parent)
	{
		if(obj.breakTouch) bt=true;
		if(!obj.mouseEnabled) continue;
		
		if(a.type==StageEvent.MOUSE_OVER || a.type==StageEvent.MOUSE_OUT){
			bool=obj.hitTestPoint(this.mouseX,this.mouseY);
			if((a.type==StageEvent.MOUSE_OVER && bool) || (a.type==StageEvent.MOUSE_OUT && !bool)){
				obj.dispatchEvent(this.__copyStageEvent(a,obj));
			}
		}
		else obj.dispatchEvent(this.__copyStageEvent(a,obj));
	}
	
	return bt;
}

Stage.prototype.__copyStageEvent =function(a,o,t)
{
	var e = Global.copy(a,StageEvent);
	e.target = o;
	e.type= t ? t : e.type;
	return e;
}

Stage.prototype._getMouseTarget = function(e) 
{
	var s,a = this.getObjectUnderPoint(this.mouseX, this.mouseY, this.usePixelTrace,false);
	var	c = this.mouseTarget;
		
	this.mouseTarget = a;

	if (c && c != a) 
	{
		s = Global.copy(e, StageEvent);
		s.target = c;
		s.mouseX = this.mouseX;
		s.mouseY = this.mouseY;
		s.type = StageEvent.MOUSE_OUT;
		
		this.__transmitEvent(s);
		if(c.onMouseEvent)  c.onMouseEvent(s);
		if(c.dispatchEvent) c.dispatchEvent(s);
		
		if(this._mouseDownTarget==c) 
			this._mouseDownTarget=null;
	}
	
	if(a && c != a){
		s = Global.copy(e, StageEvent);
		s.target = a;
		s.mouseX = this.mouseX;
		s.mouseY = this.mouseY;
		s.type = StageEvent.MOUSE_OVER;
		
		this.__transmitEvent(s);
		if(a.onMouseEvent)  a.onMouseEvent(s);
		if(a.dispatchEvent) a.dispatchEvent(s);
	}
}

/**
 * @param {DisplayBase} b target
 * @param {Rectangle} r Rectangle of area
 * @param {Boolean} l useLayer
 * @param {Rectangle} f area allow free to move
 */
Stage.prototype.startDrag = function(b,r,l,f) 
{
	if(b==undefined || b.parent==undefined) return;
	if(this.dragTarget) this.stopDrag();
	
	this.dragTarget = b;
	
	if(l){
		this._layer=b.getIndex();
		this.dragTarget.toTop();
	}
	else this._layer=-1;
	
	this._area=(r && r instanceof Rectangle) ? r : null;
	this._block=(f && f instanceof Rectangle) ? f : null;
	var p = this.dragTarget.globalToLocal(this.mouseX, this.mouseY);

	this._dragMouseX = p.x;
	this._dragMouseY = p.y;
}

Stage.prototype.stopDrag = function() 
{
	if(this.dragTarget==null || this.dragTarget==undefined) return;
	
	if(this._layer>=0 && this.dragTarget && this.dragTarget.parent){
		this.dragTarget.parent.addChildAt(this.dragTarget,this._layer);
	}
	
	this._dragMouseX = this._dragMouseY = 0;
	this.dragTarget = null;
	this._block = null;
	this._area = null;
	this._layer=-1;
}

Stage.prototype._keyHandler=function(e)
{
	this.dispatchEvent(Factory.c("ev",[e.type,(e||window.event).keyCode]));
}

Stage.prototype.setCursor = function(style) 
{
	this.div.style.cursor =style;
}

Stage.prototype.updatePosition = function(bool)
{
	var offset = DOMUtil.getElementOffset(bool ? this.div : this.canvas);
	this.stageX = offset.left;
	this.stageY = offset.top;
};

Stage.prototype.getStageWidth = function() 
{
	return this.canvas.width;
}

Stage.prototype.getStageHeight = function() 
{
	return this.canvas.height;
}

Stage.prototype.toString=function()
{
	return ["Stage"];
}

Stage.prototype.dispose=function()
{
	this.enable(false);
	if( this.timer) this.timer.dispose();
	if(Stage.current==this) Stage.current=null;
	
	this.stage=this.context=this.canvas=this.div=null;
	Stage.superClass.dispose.call(this);
	
	delete this.traceMouseTarget,this._parent_node,this.dragTarget,this.mouseTarget,this._mouseDownTarget,this.timer;
	delete this.stageX,this.stageY,this.mouseX,this.mouseY,this._dragMouseX,this._dragMouseY;
	delete this.__touch_handler,this.__mouse_handler,this.__key_handler,this.__enter_frame;
	delete this.block_ratio,this._block,this.context,this.canvas,this.div,this.auto_clear,this.last_fresh,this.auto_fresh;
}

/*********************************
 * Static Function
 *********************************
 */

Stage.COUNT=0;
Stage.current=null;

Stage.translationType=function(t)
{
	switch (t) {
		case "touchstart":
			return StageEvent.MOUSE_DOWN;
			break;
		case "touchmove":
			return StageEvent.MOUSE_MOVE;
			break;
		case "touchend":
			return StageEvent.MOUSE_UP;
	}
	
	return "";
}
//----------------------------------------- MovieClip -----------------------------------------

/**
===================================================================
MovieClip Class
===================================================================
**/
function MovieClip(s)
{
	DisplayObject.call(this);
	
	this.label;
	this._frames=[];
	this._paused=true;
	
	this._replay_time=0;
	this._reverse_play=false;
	this._count=this._rate=1;
	
	this._frame=1;
	this._current_frame=1;
	if(s) this.setFrames(s);
}

Global.inherit(MovieClip,DisplayObject);

MovieClip.prototype.clearAllFrames=function()
{
	if(this._frames==undefined) return;
	
	var value;
	while(this._frames.length>0){
		value=this._frames.pop();
		this._remove_frame(value);
	}
	
	this._frame=this._current_frame=1;
	this._paused=true;
}

MovieClip.prototype.setFrames=function(data)
{
	if(data==null || !(data instanceof Array) || data.length<=0) return;
	
	var i,l=data.length;
	for(i=0;i<l;i++) this.addFrame(data[i]);
	if(this._frames.length>0) this.gotoAndPlay(1);
}

MovieClip.prototype.addFrame=function (f,i)
{
	if(f==undefined || f==null) return;
	if(!(f instanceof Source) && !(f instanceof DisplayObject)) return;
	if(i==undefined) this._frames.push(f);
	else             this._frames.splice(i, 0, f);
	
	var bool=(f instanceof DisplayObject);	
	this.width=bool ? f.width : Math.max(this.width,f.rect ? f.rect.width : 0,f.width);
	this.height=bool ? f.height : Math.max(this.height,f.rect ? f.rect.height : 0,f.height);
	this.name=bool ? this.name : f.animation+(StringUtil.isEmpty(f.label) ? "" :(":"+f.label));
}

MovieClip.prototype.getFrame=function (i)
{
	return (i>=0 && i<this._frames.length) ? this._frames[i] : null;
}

/**
 * remove frame 
 * @param {Number} i
 */
MovieClip.prototype.removeFrame=function (i)
{
	if(i<0 || i>=this._frames.length) return;
	var frame=this._frames.splice(i, 1);
	this._remove_frame(frame);
}

MovieClip.prototype._remove_frame=function(frame)
{
	if(frame==undefined || frame==null) return;
	
	if(frame instanceof Source && frame.isClone){
		ObjectPool.remove(frame);
	}
	else if(frame instanceof DisplayObject){
		frame.removeFromParent(true);
	}
}

MovieClip.prototype.play=function(time)
{
	this._replay_time=(time==undefined) ? 0 : time;
	this._paused=false;
}

MovieClip.prototype.stop=function()
{
	this._paused=true;
}
	
MovieClip.prototype.gotoAndStop=function(index)
{
	if(this._frames==undefined) return;
	
	if( typeof index == "string"){
		var i;
		var len=this._frames.length;
		
		for(i=0;i<len;i++){
			if(this._frames[i] && this._frames[i].label==index){
				index=Number(i)+1;
				break;
			}
		}
	}
	
	if(index<1 || index>this._frames.length) return;
	this._frame=index;
	this._paused=true;
}

MovieClip.prototype.gotoAndPlay=function(index)
{
	this.gotoAndStop(index);
	this._paused=false;
}

MovieClip.prototype.nextFrame=function()
{
	this._frame=this._reverse_play ? (this._current_frame<=1 ? this._frames.length : (this._current_frame-1)) : (this._current_frame>=this._frames.length ? 1 : (this._current_frame+1));
}

Object.defineProperty(MovieClip.prototype,"totalFrame",{
    get: function () {
        return this._frames.length;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MovieClip.prototype,"currentFrame",{
    get: function () {
       return this._current_frame;
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MovieClip.prototype,"rate",{
    get: function () {
        return this._rate;
    },
    set: function (value) {
        if(value==undefined || value==null || value<=1 || value==this._rate) return;
		this._rate=MathUtil.int(value);
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(MovieClip.prototype,"reverse",{
    get: function () {
        return this._reverse_play;
    },
    /**
     * movie reverse play
     * @param {Boolean} value
     */
    set: function (value) {
        if(value==undefined || value==null || value==this._reverse_play) return;
		this._reverse_play=value;
    },
    enumerable: true,
    configurable: true
});

MovieClip.prototype.render=function()
{
	if (!this.visible || this.alpha <= 0) return;
	
	if((!this._paused || this.instance==null || (this._frame!=this._current_frame)) && this._frames.length>0) {
		this.label=this.name;
		this._current_frame=this._frame;
		var target=this._frames[this._current_frame-1];
		
		if(target && (target instanceof DisplayObject)){
			this.setInstance(target.instance);
			
			this.height=target.getHeight();
			this.width=target.getWidth();
	    }else{
	    	this._frames[this._current_frame-1]=this.setInstance(target);
	    }
	    
		var temp=this.label;
		this.label=this.name;
		this.name=temp;
		
		if(!this._paused){
			this._count--;
		
			if(this._count<=0 ){
				this.nextFrame();
				
				if(((this._reverse_play && this._current_frame<=1)||(!this._reverse_play && this._current_frame>=this._frames.length)) && this._replay_time>0){
					this._replay_time--;
					if(this._replay_time==0) {
						this._paused=true;
						this.dispatchEvent(Factory.c("ev",[Event.PLAY_OVER]));
					}
				}
			}
			
			this._count=(this._count<=0) ? this._rate : this._count;
		}
	}
	
	MovieClip.superClass.render.apply(this,arguments);
}

MovieClip.prototype.reset=function()
{
	this.clearAllFrames();
	
	this.label=null;
	this._paused=true;
	this._replay_time=0;
	this._reverse_play=false;
	this._frame=this._count=this._rate=this._current_frame=1;
	MovieClip.superClass.reset.call(this);
}

MovieClip.prototype.dispose=function()
{
	this.reset();
	MovieClip.superClass.dispose.call(this);
	delete this._frame,this._count,this._rate,this._reverse_play,this._replay_time,this._frames,this._paused,this._current_frame,this.label;
}

MovieClip.prototype.toString=function()
{
	return ["MovieClip"];
}

//----------------------------------------- Button -----------------------------------------


function Button() 
{
	UIBase.call(this);
	this.autoSize=true;
	this._auto_dispose=false;
	
	this.name = "button_"+this.name;
	this.state = "";
	
	this.mouseChildren = false;
	this.mouseEnabled=true;
	this.buttonMode=true;
	this._enable = true;
	this.over_color;
	this.out_color;
	this.tf=null;
	this.frames={};
};

Global.inherit(Button, UIBase);

Button.state = {
	UP: "up",
	OVER: "over",
	DOWN: "down",
	DISABLED: "disabled"
};

Button.prototype.setup =function(up, over, down, disabled)
{
	up && this.setupState(up,Button.state.UP);
	over && this.setupState(over,Button.state.OVER);
	down && this.setupState(down,Button.state.DOWN);
	disabled && this.setupState(disabled,Button.state.DISABLED);
	
	this.setState(Button.state.UP);
}

/**
 * align 0 center 1 left 2 right
 * @param {String} label
 * @param {String} font
 * @param {String} color
 * @param {Number} size
 * @param {Boolean} blod
 * @param {String} color2
 * @param {Number} align
 * @param {Number} w width  of textField
 * @param {Number} h height of textField
 */
Button.prototype.setLabel = function(label,font,color,size,blod,color2,align,w,h)
{
	if(StringUtil.isEmpty(label) && this.tf){
		this.tf.removeFromParent(true);
		return;
	}
	
	align=(align==undefined) ? 0 : align;
	
	if(this.tf==undefined) {
		this.tf=Factory.c("tf",{text:label,font:font,color:color,size:size,isInput:false});
		this.tf.mouseEnabled=false;
		this.addChild(this.tf);
	}else{
		this.tf.text=(this.label);
		if(font!=undefined)  this.tf.font=(font);
		if(color!=undefined) this.tf.color=(color);
		if(size!=undefined)  this.tf.size=(size);
	}
	
	this.out_color=color;
	this.over_color=color2;
	this.tf.bold=(blod==true);
	
	w=w ? w : this.tf.getWidth();
	h=h ? h : this.tf.getHeight();

	this.tf.moveTo(align==0 ? MathUtil.int((this.instance.getWidth()-w)*0.5) : (align==2 ? (this.instance.getWidth()-w) : (align==1 ? 0 : w)), align==1 ? (align>2 ? h : 0) :MathUtil.int((this.instance.getHeight()-h)*0.5));
}

Button.prototype.getLabel=function()
{
	return this.tf ? this.tf.text : "";
}

Button.prototype.setupState = function(obj,label)
{
	if(this.frames==undefined || obj==undefined || StringUtil.isEmpty(label) || (!(obj instanceof Source) && !(obj instanceof DisplayBase) && !(obj instanceof Effect) && !(obj instanceof Array))) return;
    
    if(this.frames[label] && this.frames[label] instanceof DisplayBase){
    	this.frames[label].removeFromParent(true);
    }
    
    if(obj instanceof Source){
    	var temp=Factory.c("do");
    	temp.setInstance(obj);
    	obj=temp;
    }
    
    this.frames[label]=obj;
}

Object.defineProperty(Button.prototype,"enable",{
    get: function () {
        return this._enable;
    },
    set: function (value) {
        if(value==undefined || value==null || value==this._enable) return;
		this._enable=value;
		this.mouseEnabled=this.buttonMode=value;
		if(!this._enable) this.setState(Button.state.DISABLED) || this.setState(Button.state.DOWN) || this.setState(Button.state.OVER);
        else this.setState(Button.state.UP);
    },
    enumerable: true,
    configurable: true
});

/**
 * @param {String} b label
 * @param {Boolean} p pass
 */
Button.prototype.setState = function(b,p) 
{
	if (this.state == b && (p==undefined || ! p)) return false;
	this.state = b;
//	this.enable=(this.state!=Button.state.DISABLED);
	if(this.over_color!=undefined && this.tf) this.tf.color=(this.state==Button.state.OVER || this.state==Button.state.OVER ? this.over_color : this.out_color);
	
	if(this.frames.hasOwnProperty(this.state) && this.frames[b]) {
		if(this.frames[b] instanceof DisplayBase) this.instance=this.frames[b];
		else if(this.instance==undefined) return;
		else if(this.frames[b] instanceof Effect || this.frames[b] instanceof Array){
			Effect.run(this.instance,this.frames[b]);
		}
	}
    else return false;
    
    this.__checkDisplayUpdate();
	return true;
};

Button.prototype.onMouseEvent = function(b) 
{
	if (!this._enable)  return;
	switch (b.type) {
		case "mousemove":
			this.setState(Button.state.OVER);
			break;
		case "mouseout":
			this.setState(Button.state.UP);
			break;
		case "mousedown":
			if(!this.setState(Button.state.DOWN)) this.setState(Button.state.OVER);
			break;
		case "mouseup":
			(this.state ==Button.state.OVER) ? this.setState(Button.state.OVER) : this.setState(Button.state.UP);
	}
};

Button.prototype.dispose=function()
{
	if(this.frames){
		var i,j,obj;
		for(i in this.frames){
			obj=this.frames[i];
			if(obj) {
				if(obj instanceof DisplayBase) obj.removeFromParent(true);
				else if(obj instanceof Effect) ObjectPool.remove(obj);
				else if(obj instanceof Array){
					for(j=0;j<obj.length;j++) ObjectPool.remove(obj[j]);
				}
			}
			delete this.frames[i];
		}
	}
	
	Button.superClass.dispose.call(this);
	delete this.frames,this.tf,this.is_reversal,this.state,this.over_color,this.out_color;
}

Button.prototype.toString=function()
{
	return "Button";
}

//----------------------------------------- File -----------------------------------------

/**
===================================================================
File Class
===================================================================
**/

/**
 * @param {Boolean} multiple
 * @param {String} accept image/gif,image/jpeg,image/png,text/html,text/txt,audio/mp3,video/mp4
 */
function File(multiple,accept)
{
	DOMDisplay.call(this);
	this.name="file"+(File.__count++);
	this._btn=this._reader=this._cancel_handler=this._file_select_handler=null;
	
	this.alpha=0;
	this.layer=995;
	this.auto_parse=true;
	this.image_to_base64=false;
	this.buttonMode=this.mouseEnabled=true;
	if(this.supported) this._browseForOpen("openFile",multiple,accept);
}

File.__count=0;
Global.inherit(File,DOMDisplay);
File.COMPLETE="file_select_complete";

Object.defineProperty(File.prototype,"target",{
    set: function (value) {
        if(value==undefined || value==null || !(value instanceof DisplayBase)) return;
		this.width=value.width;
		this.height=value.height;
		this.matrix=value.matrix;
		if(value instanceof Button) this._btn=value;
    },
    enumerable: true,
    configurable: true
});

File.prototype.open=function(cache)
{
	if(!cache) this._clearInputFile();
	if(this.element) this.element.click();
}

File.prototype.onMouseEvent = function(b) 
{
	if (this._btn==null || !this._btn.enable)  return;
	
	switch (b.type) {
		case "mousemove":
			this._btn.setState(Button.state.OVER);
			break;
		case "mouseout":
			this._btn.setState(Button.state.UP);
			break;
		case "mousedown":
			this._btn.setState(Button.state.OVER);
			break;
		case "mouseup":
			(this._btn.state ==Button.state.OVER) ? this._btn.setState(Button.state.OVER) : this._btn.setState(Button.state.UP);
	}
};

File.prototype._clearInputFile=function()
{
	if(!this.supported || this.element==null) return;
	this._element.removeEventListener('change', this._file_select_handler);
	var multiple=this._element.multiple;
	var accept=this._element.accept;
	
	this._display(false);
	this._element=null;
	this._browseForOpen("openFile",multiple,accept);
}

File.prototype._browseForOpen=function(name,multiple,accept)
{	
	multiple=multiple || false;
	
	if(this._element==undefined){
		this.element=DOMUtil.createDOM("input",{type:"file",multiple:multiple,id:this.name,name:name,style:{position: "absolute"}});
	}else{	
		this._element.multiple=multiple;
		this._element.name=name;
	}
	
	if(!StringUtil.isEmpty(accept)){
		this._element.accept=accept;
	}
	
	if(this._file_select_handler==undefined){
		this._cancel_handler=Global.delegate(this._cancelHandle,this);
		this._file_select_handler=Global.delegate(this._fileSelectHandle,this);
	}
	
	this._element.addEventListener('change', this._file_select_handler, false);
}

File.prototype._fileSelectHandle=function(e)
{	
	var i,f,t,p,files = e.target.files,list=[],target=this,URL = window.URL || window.webkitURL;
	
	if(!this.auto_parse){
		target.dispatchEvent(Factory.c("ev",[File.COMPLETE,files]));
		return;
	}
	
	for (i = 0; f = files[i]; i++) {
		if(f==undefined) continue;
		if (f.type.indexOf("image") == 0) {
			
			p=URL.createObjectURL(f);
			
			if(!StringUtil.isEmpty(p) && !this.image_to_base64){
				t=new Image();
				t.name= f.name;
				t.src = p;
				t.onload = function(e) {
				   URL.revokeObjectURL(t.src);
				   list.push(t);
				   if(i>=files.length-1) target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));
				}
				continue;
			}
			
			target._reader = new FileReader();
			target._reader.onload = function(evt) {
				if(target.image_to_base64){
					list.push(evt.target.result);
				}else{
					t=new Image();
					t.name=evt.target.name;
					t.src=evt.target.result;
					list.push(t);
				}
				if(i>=files.length-1) target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));
			}
			target._reader.readAsDataURL(f);
		}
		else if (f.type.indexOf("text") == 0) {
			target._reader = new FileReader();
			target._reader.onload = function(evt) {
				t=DOMUtil.createDOM("p",{id:evt.target.name,innerHTML:"<pre>"+evt.target.result.replace(/</g, "&lt;").replace(/>/g, "&gt;")+"</pre>"});
				list.push(t);
				if(i>=files.length-1) target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));
			}
			target._reader.readAsText(f);
		}else {
			target._reader = new FileReader();
			target._reader.onload = function(evt) {
				list.push(evt.target.result);
				if(i>=files.length-1) target.dispatchEvent(Factory.c("ev",[File.COMPLETE,list]));
			}
			target._reader.readAsBinaryString(f);
		}
	}
}

File.prototype.render  = function()
{
	File.superClass.render.apply(this,arguments)
}

Object.defineProperty(File.prototype,"updateMatrix",{
	get: function (){
		return this._updateMatrix;
	},
    set: function (value) {
        if(this._updateMatrix==value) return;
		this._updateMatrix=value;
    },
    enumerable: true,
    configurable: true
});

File.prototype.abortRead=function()
{
	if(this._reader) try{
		this._reader.abort();
	}catch(e){};
}

Object.defineProperty(File.prototype,"supported",{
	get: function (){
		return (window.File && window.FileReader && window.FileList);
	},
    enumerable: true,
    configurable: true
});	

File.prototype.dispose=function()
{
	if(this._element){
		this._element.removeEventListener('change', this._file_select_handler);
	}
	
	File.superClass.dispose.call(this);
	delete this.image_to_base64,this.auto_parse,this._btn,this._cancel_handler,this._file_select_handler,this._file,this._reader,this.name;
}

//----------------------------------------- Effect -----------------------------------------


function Effect(type,value,time,align,tween)
{
	this.setup(type,value,time,align,tween);
}

/**
 * 设置特效
 * @param {String} type
 * @param {Number || String} value
 * @param {Number} time
 * @param {Number} align
 * @param {String} tween
 */
Effect.prototype.setup=function(type,value,time,align,tween)
{
	this.type=type;
	this.time=time || 0;
	
	this.value=value;
	this.align=align || 0;
	this.tween=tween;
}

Effect.prototype.clone=function()
{
	var copy=ObjectPool.create(Effect);
	
	copy.value=this.value;
	copy.align=this.align;
	copy.tween=this.tween;
	
	copy.type=this.type;
	copy.time=this.time;
	
	return copy;
}

Effect.prototype.reset=function()
{
	this.type=this.value=this.time=this.align=this.tween=null;
}

Effect.prototype.dispose=function()
{
	delete this.type,this.value,this.time,this.align,this.tween;
}

/**
 * type
 */
Effect.MOVE="move";
Effect.COLOR="color";
Effect.SCALE="scale";
Effect.ALPHA="alpha";
Effect.OFFSET="offset";
Effect.SHADOW="shadow";

/**
 * align
 */
Effect.CENTER=1;

Effect.run=function(instance,effect)
{
	if(instance==undefined || effect==undefined) return;
	TweenLite.remove(instance);
	
	if(effect instanceof Effect){
		Effect._execute(instance,effect);
		return;
	}
	
	if(effect instanceof Array){
		var i,l;
		for(i=0,l=effect.length;i<l;i++){
			Effect._execute(instance,effect[i]);
		}
	}
}

Effect._execute=function(instance,effect)
{
	if(instance==undefined || effect==undefined) return;
	
	if(effect.align==Effect.CENTER){
		instance.origin={x:instance.width*0.5,y:instance.height*0.5};
	}
	
	var obj,num,pos,bool=(effect.type==Effect.SHADOW);
	
	if(effect.type==Effect.MOVE || effect.type==Effect.OFFSET){
		pos=Point.toPoint(effect.value);
		if(effect.type==Effect.OFFSET) pos.offset(instance.x,instance.y);
		bool=true;
	}
	
	if(instance[effect.type]==undefined && !bool) return;
    
    if(effect.time<=0) {
    	if(bool) instance.moveTo(pos.x,pos.y);
    	else instance[effect.type]=effect.value;
    }
    
    if(instance.parent && instance.parent.autoSize) instance._parent._updateSize();
    if(effect.time<=0) return;
    
    if(effect.type==Effect.COLOR){
    	num=instance.color;
    	instance.__temp_num=0;
    	TweenLite.to(instance,effect.time,{ease:effect.tween,__temp_num:1,onUpdate:function(){
    		instance.__checkDisplayUpdate();
    		instance.color=ColorUtil.formatColor(ColorUtil.interpolateColor(num,effect.value,instance.__temp_num));
    	},onComplete:function(){
    		instance.__checkDisplayUpdate();
    		instance.color=effect.value;
    	}});
    	return;
    }
    
    if(effect.type==Effect.SHADOW){
    	if(instance.filters == undefined) {
    		if((instance instanceof DisplayObjectContainer) && instance.numChildren==1 && (instance.getChildAt(0).filters)){
    			instance=instance.getChildAt(0);
    		}
    		else return;
    	}
    	
    	if((typeof effect.value)=="string"){
    		pos=JSON.parse(effect.value);
    	}
    	else pos=effect.value;
    	
    	if(instance.filters.length==0){
    		obj=new DropShadowFilter(0,0,0);
    		instance.filters.push(obj);
    	}else{
    		for(var filter,i=0,l=instance.filters.length;i<l;i++){
    			filter=instance.filters[i];
    			if(filter && ClassUtil.getQualifiedClassName(filter)=="DropShadowFilter"){
    				obj=filter;
    				continue;
    			}
    		}
    	}
    	
    	if(obj == undefined || pos==undefined || pos.length==undefined || pos.length<1) return;
    	
    	if((pos.length==1 && pos[0]==obj.distance) ||
    	   (pos.length==2 && pos[0]==obj.distance && pos[1]==obj.angle) ||
    	   (pos.length==3 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur) ||
    	   (pos.length==4 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur && pos[3]==obj.shadowColor) ||
    	   (pos.length==5 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur && pos[3]==obj.shadowColor && pos[4]==obj.alpha) ||
    	   (pos.length==6 && pos[0]==obj.distance && pos[1]==obj.angle && pos[2]==obj.shadowBlur && pos[3]==obj.shadowColor && pos[4]==obj.alpha && pos[5]==obj.radius)) return;
    	
    	instance.__temp_num=0;
    	TweenLite.to(instance,effect.time,{ease:effect.tween,__temp_num:1,onUpdateParams:[obj,pos,obj.distance,obj.angle,obj.shadowColor,obj.shadowBlur,obj.alpha,obj.radius],onUpdate:function(o,t,d,a,c,b,p,r){
    		o.distance=MathUtil.format(d+(t[0]-d)*instance.__temp_num);
    		if(t.length>1) o.angle=MathUtil.format(a+(t[1]-a)*instance.__temp_num);
    		if(t.length>2) o.shadowBlur=MathUtil.format(b+(t[2]-b)*instance.__temp_num);
    		if(t.length>3) o.shadowColor=ColorUtil.formatColor(ColorUtil.interpolateColor(c,t[3],instance.__temp_num));
    		if(t.length>4) o.alpha=MathUtil.format(p+(t[4]-p)*instance.__temp_num);
    		if(t.length>5) o.radius=MathUtil.format(r+(t[5]-r)*instance.__temp_num);
    		if(t.length>1) o.setShadowOffset();
    		instance.__checkDisplayUpdate();
    	},onCompleteParams:[obj,pos],onComplete:function(o,t){
    		o.distance=t[0];
    		if(t.length>1) o.angle=t[1];
    		if(t.length>2) o.shadowBlur=t[2];
    		if(t.length>3) o.shadowColor=t[3];
    		if(t.length>4) o.alpha=t[4];
    		if(t.length>5) o.radius=t[5];
    		if(t.length>1) o.setShadowOffset();
    		instance.__checkDisplayUpdate();
    	}});
    	return;
    }
    
    obj={ease:effect.tween};
    
    if(bool || effect.type==Effect.SCALE) 
    	obj.onUpdate=function(){if(instance.parent && instance.parent.autoSize) instance._parent._updateSize()};
    
    if(bool) {
    	obj.x=pos.x;
    	obj.y=pos.y;
    }
    else obj[effect.type]=effect.value;
    TweenLite.to(instance,effect.time,obj);
}


//----------------------------------------- Transformer -----------------------------------------


function Transformer()
{
	/**
	 * 需要绘制线框时 线框的宽度
	 */
	this.lineWidth=2;
	
	/**
	 * 默认按钮的半径
	 */
	this.round=16;
	
	/**
	 * 是否允许拖拽旋转对象角度
	 */
	this.rotate=true;
	
	/**
	 * 是否允许拖拽变形拉伸对象（前提是this.rotate为false）
	 */
	this.is_free=false;
	
	/**
	 * 相对坐标的百分比 默认中心点
	 */
	this.pos_percent={x:0.5,y:0.5};
	
	/**
	 * 相对转换数据 {rotation:0,scaleX:1,scaleY:1}
	 */
	this.relative_data;
	
	this._center=this._target=this._btn=this._redraw=this._canvas=this._color=this._point=null;
	this._target_center=this._move_point=this._target_angle=this._target_rotation=this._target_scaleX=this._target_scaleY=this._target_distance=this._target_offsetX=this._target_offsetY=null;
	DisplayObjectContainer.call(this);
	this.mouseEnabled=true;
	this._state=0;
}

Transformer.MOVE="transformer_move";
Transformer.SCALE="transformer_scale";
Transformer.DOUBLE_CLICK="transformer_double_click";

Global.inherit(Transformer, DisplayObjectContainer);

/**
 * 设置
 * @param {DisplayBase} target 需要变形对象
 * @param {Button}      btn    控制变形按钮
 * @param {Boolean}     redraw 是否绘制线框
 * @param {String}      color  绘制线框颜色
 */
Transformer.prototype.setup=function(target,btn,redraw,color)
{
	this._btn=(btn || QuickUI.getButton(this.round));
	this._redraw=redraw;
	this._color=color || "#888888";
	this.target=target;
}

Object.defineProperty(Transformer.prototype,"target",{
	get: function (){
		return this._target;
	},
    set: function (value) {
    	if(this._target==value) return;
        this._target=value;
        this.visible=(value!=null);
        
        if(this._target && (this._target instanceof DisplayBase)) this._init_transformer();
        else this._clear_transformer();
    },
    enumerable: true,
    configurable: true
});

Transformer.prototype._init_transformer=function()
{
	this._clear_transformer();
	this._target_rect=this._target.getBounds(this._target);
	
	this._point = new Point(this._target_rect.x + this._target_rect.width,  this._target_rect.y + this._target_rect.height);
	this._center = new Point(this._target_rect.x + this._target_rect.width*this.pos_percent.x,  this._target_rect.y + this._target_rect.height*this.pos_percent.y);
	
	if(this._canvas==undefined) this._canvas=Factory.c("bs");
	this._canvas.setup("#FFFFFF",this._target.width,this._target.height,0,this._redraw ? (Global.useCanvas ? this.lineWidth : this.lineWidth*2) :0,this._color,0);
	if(Global.useCanvas) this._canvas.instance.moveTo(-this.lineWidth,-this.lineWidth);
	if(!this.contains(this._canvas)) this.addChild(this._canvas);
	
	this._canvas.usePolyCollision=true;
	this._canvas.mouseEnabled=true;
	this._canvas.breakTouch=true;
	
	if(!this.contains(this._btn)) {
		this._btn.breakTouch=true;
		this.addChild(this._btn);
	}
	
	this._btn.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._trans_mouse_down,this),this.name);
    this._canvas.addEventListener(StageEvent.MOUSE_DOWN,Global.delegate(this._drag_mouse_down,this),this.name);

	this._canvas.matrix=this._target.matrix;
	this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point)));
}

Transformer.prototype._drag_mouse_down=function(e)
{
	this._state=1;
	Stage.current.startDrag(this._canvas);
	Stage.current.addEventListener(StageEvent.MOUSE_UP, Global.delegate(this._drag_mouse_up,this),this.name);
	Stage.current.addEventListener(StageEvent.MOUSE_MOVE, Global.delegate(this._drag_mouse_move,this),this.name);
}

Transformer.prototype._drag_mouse_move=function(e)
{
	this._target.moveTo(this._target.parent.globalToLocal(this._canvas.localToGlobal(0,0)));
	this._btn.moveTo(this.globalToLocal(this._canvas.localToGlobal(this._point)));
}

Transformer.prototype._trans_mouse_down=function(e)
{
	this._target_center=this._canvas.localToGlobal(this._center);
	this._move_point=this._canvas.localToGlobal(this._point);
	
	this._target_scaleX = this._canvas.scaleX;
	this._target_scaleY = this._canvas.scaleY;
	
	this._target_offsetX = Math.max( 0, this._move_point.x-this._target_center.x);
	this._target_offsetY = Math.max( 0, this._move_point.y-this._target_center.y);
	
	this._target_distance=Point.distance(this._target_center,new Point(this._move_point.x, this._move_point.y));
	this._target_rotation=this._canvas.rotation;
	this._target_angle=MathUtil.getAngle(this._target_center.x,this._target_center.y,this._move_point.x, this._move_point.y);
	
	Stage.current.addEventListener(StageEvent.MOUSE_UP, Global.delegate(this._drag_mouse_up,this),this.name);
	Stage.current.addEventListener(StageEvent.MOUSE_MOVE, Global.delegate(this._trans_mouse_move,this),this.name);
}

Transformer.prototype._trans_mouse_move=function(e)
{
	var pos = new Point(e.mouseX, e.mouseY);
	
	if(this.rotate){
		var rad = MathUtil.getAngle(this._target_center.x,this._target_center.y,pos.x, pos.y);
		this._canvas.rotation=MathUtil.format(this._target_rotation+MathUtil.getDegreesFromRadians(rad-this._target_angle));
	}
	
	var offX,offY,dis;
	if(!this.rotate && this.is_free){
		offX=Math.max( 0, (pos.x-this._target_center.x))/this._target_offsetX;
		offY=Math.max( 0, (pos.y-this._target_center.y))/this._target_offsetY;
	}
	else {
		dis= Point.distance(this._target_center,pos);
		offX=offY= dis/this._target_distance;
	}
	
	offX=MathUtil.format(this._target_scaleX*offX);
	offY=MathUtil.format(this._target_scaleY*offY);
	
	if(!(!this.rotate && this.is_free && (offX==0 || offY==0))){
		this._canvas.scaleX=offX;
		this._canvas.scaleY=offY;
	}
	
	var cen = this._canvas.localToGlobal(this._center);
	this._btn.moveTo(this.rotate || (this.is_free && offX!=0 && offY!=0) ? this.globalToLocal(e.mouseX, e.mouseY) : this.globalToLocal(this._canvas.localToGlobal(this._point)));
	this._canvas.moveTo(MathUtil.format(this._canvas.x+this._target_center.x-cen.x),MathUtil.format(this._canvas.y+this._target_center.y-cen.y));
	DisplayUtil.copyTransform(this._canvas,this._target,this.relative_data);
	this._state=2;
	
	if(!this.rotate && this.is_free){
		this._btn.x=Math.max(this._target_center.x,this._btn.x);
		this._btn.y=Math.max(this._target_center.y,this._btn.y);
	}
}

Transformer.prototype._drag_mouse_up=function(e)
{
	Stage.current.stopDrag();
	Stage.current.removeEventListener(StageEvent.MOUSE_UP, null,this.name);
	Stage.current.removeEventListener(StageEvent.MOUSE_MOVE, null,this.name);
	this._target_center=this._move_point=this._target_scaleX = this._target_scaleY = this._target_distance=this._target_rotation=this._target_angle=null;
    
    if(this._state==1 && DoubleClick.check()) this.dispatchEvent(Factory.c("ev",[Transformer.DOUBLE_CLICK]));
    else if(this._state>0) this.dispatchEvent(Factory.c("ev",[(this._state==1 ? Transformer.MOVE : Transformer.SCALE)]));
    
    this._state=0;
}

Transformer.prototype._clear_transformer=function()
{
	if(this._canvas) {
		if( this.contains(this._canvas))this._canvas.removeFromParent(false);
	 	this._canvas.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
	 	this._canvas.reset();
	}
	  
	if(this._btn){
		this._btn.removeEventListener(StageEvent.MOUSE_DOWN,null,this.name);
		if(this.contains(this._btn)) this._btn.removeFromParent(false);
	}
	
	this._drag_mouse_up(null);
}

Transformer.prototype.dispose=function()
{
	Transformer.superClass.dispose.call(this);
	delete this._state,this.relative_data,this._center,this._color,this._target,this._btn,this._redraw,this._canvas;
	delete this.is_free,this.pos_percent,this.rotate,this.round,this.lineWidth,this._target_center,this._move_point,this._target_angle,this._target_rotation,this._target_scaleX,this._target_scaleY,this._target_distance,this._target_offsetX,this._target_offsetY;
}

//----------------------------------------- QuickUI -----------------------------------------

QuickUI={}

/**
 * 快速创建默认样式按钮
 * @param {Number} r 圆半径
 * @param {Number} w 宽度
 * @param {Number} h 高度
 * @param {String} c1 颜色（渐变1/初始）
 * @param {String} c2 颜色（渐变2/结束）
 * @param {Number} t  边线粗细
 * @param {Number} c3 边线颜色
 * @param {Number} s  按钮样式
 */
QuickUI.getButton=function(r,w,h,c1,c2,t,c3,s)
{
	r=(r==undefined) ? 0 : r;
	w=(w==undefined) ? 0 : w;
	h=(h==undefined) ? 0 : h;
	
	c1=(c1==undefined) ? "#FF9E26" : ColorUtil.formatColor(c1);
	c2=(c2==undefined) ? "#FF7C0D" : ColorUtil.formatColor(c2);
	
	var btn=new Button();
    var shape=Factory.c("bs");
    var bool=(w==0 && h==0);
    
    w=Math.max(r*2 , w);
	h=Math.max(r*2 , h);
	
	var color=Global.useCanvas ? (bool ? (new Graphics()).radialGradientFill(r,r,r*0.25,r,r,r,[0.1,1],[c1,c2]) : (new Graphics()).LinearGradientFill(0,0,0,h,[0.1,0.9],[c1,c2])) : c1;
    shape.setup(color,w,h,r,t,c3);
    shape.origin={x:w*0.5,y:h*0.5};
    btn.instance=shape;
    
    if(Global.os==SystemType.OS_PC && (s==undefined || s==0)){
    	if(Global.useCanvas) btn.setup([Factory.c("ef",[Effect.MOVE,"{0,0}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[4,70,10,"#222222",0.5],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],[Factory.c("ef",[Effect.MOVE,"{0,3}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[0,70,0,"#000000",0.5],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])]);
	    else btn.setup([Factory.c("ef",[Effect.COLOR,c1,0.15]),Factory.c("ef",[Effect.MOVE,"{0,0}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[4,70,8,"#222222",0.8,r],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],
	    [Factory.c("ef",[Effect.COLOR,c2,0]),Factory.c("ef",[Effect.MOVE,"{0,3}",0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)]),Factory.c("ef",[Effect.SHADOW,[0,70,0,"#000000",0.8,r],0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])]);
    }else{
    	if(Global.useCanvas) btn.setup([Factory.c("ef",[Effect.SCALE,1,0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],null,[Factory.c("ef",[Effect.SCALE,0.89,0.11,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.OUT)])]);
	    else btn.setup([Factory.c("ef",[Effect.COLOR,c1,0.15]),Factory.c("ef",[Effect.SCALE,1,0.15,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.IN)])],
	    [Factory.c("ef",[Effect.COLOR,c2,0])],
	    [Factory.c("ef",[Effect.COLOR,c2,0.11]),Factory.c("ef",[Effect.SCALE,0.89,0.11,0,TweenLite.getEaseName(TweenLite.CIRC,TweenLite.OUT)])]);
    }
    return btn;
}

//----------------------------------------- DrawUtil -----------------------------------------


DrawUtil={};

DrawUtil.rect=function(rect,target,color,alpha)
{
	var bool = (target==undefined);
	var temp;
	
	if(!bool){
		if(!(target instanceof DisplayObject) && !(target instanceof Graphics)) return;
		
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	}

	target = target || new Graphics();
	color  = color || "#000000";
	alpha  = alpha || 1;
	
	target.clear();
	target.lineStyle(1,color,alpha);
	target.beginFill(color,alpha);
	target.drawRect(rect.hasOwnProperty("x") ? rect.x : 0,rect.hasOwnProperty("y") ? rect.y : 0,rect.width,rect.height);
	target.endFill();
	
	if(!bool) return temp || target;
	return CanvasUtil.toImage(target.canvas);
}

DrawUtil.roundRect=function(rect,radius,target,color,alpha)
{
	var bool = (target==undefined);
	var temp;
	
	if(!bool){
		if(!(target instanceof DisplayObject) && !(target instanceof Graphics)) return;
		
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	}

	target = target || new Graphics();
	color  = color || "#000000";
	alpha  = alpha || 1;
	
	target.clear();
	target.lineStyle(1,color,alpha);
	target.beginFill(color,alpha);
	target.drawRoundRect(rect.hasOwnProperty("x") ? rect.x : 0,rect.hasOwnProperty("y") ? rect.y : 0,rect.width,rect.height,radius);
	target.endFill();
	
	if(!bool) return temp || target;
	return CanvasUtil.toImage(target.canvas);
}

DrawUtil.circle=function(point,radius,target,color,alpha)
{
	var bool = (target==undefined);
	var temp;
	
	if(!bool){
		if(!(target instanceof DisplayObject) && !(target instanceof Graphics)) return;
		
		if(target instanceof DisplayObject) {
			temp=target;
			target=target.graphics;
		}
	}

	target = target || new Graphics();
	color  = color || "#000000";
	alpha  = alpha || 1;
	
	target.clear();
	target.lineStyle(1,color,alpha);
	target.beginFill(color,alpha);
	target.drawCircle(point.hasOwnProperty("x") ? point.x : 0,point.hasOwnProperty("y") ? point.y : 0,radius);
	target.endFill();
	
	if(!bool) return temp || target;
	return CanvasUtil.toImage(target.canvas);
}

//----------------------------------------- DisplayUtil -----------------------------------------

DisplayUtil={};

DisplayUtil.copyTransform = function(obj,target,data)
{
	if(obj==undefined || target==undefined || target.parent==undefined) return;
	target.rotation=obj.rotation+(data && data.hasOwnProperty("rotation") ? data.rotation : 0);
	target.scaleX=obj.scaleX*(data && data.hasOwnProperty("scaleX") ? data.scaleX : 1);
	target.scaleY=obj.scaleY*(data && data.hasOwnProperty("scaleY") ? data.scaleY : 1);
	target.moveTo(target.parent.globalToLocal(obj.localToGlobal(new Point())));
}

/**
 * @param {Object} gt get target
 * @param {Object} ct container target
 */
DisplayUtil.equalOrContain = function (gt,ct)
{
	if(gt==null || ct==null) return false;
	if(!(ct instanceof DisplayObjectContainer)) return (gt==ct);
	for(var obj=gt; obj!=null; obj=obj.parent)
	{
		if(obj==ct) return true;
	}
    return false;
}

//----------------------------------------- Easing -----------------------------------------


Easing={}

Easing.easeNone = function (t, b, c, d, p_params) 
{
	return c*t/d + b;
}
	
Easing.easeInQuad = function (t, b, c, d, p_params) 
{
	return c*(t/=d)*t + b;
}

Easing.easeOutQuad = function (t, b, c, d, p_params) 
{
	return -c *(t/=d)*(t-2) + b;
}

Easing.easeInOutQuad = function (t, b, c, d, p_params) 
{
	if ((t/=d/2) < 1) return c/2*t*t + b;
	return -c/2 * ((--t)*(t-2) - 1) + b;
}

Easing.easeOutInQuad = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutQuad (t*2, b, c/2, d, p_params);
	return Easing.easeInQuad((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInCubic = function (t, b, c, d, p_params) 
{
	return c*(t/=d)*t*t + b;
}

Easing.easeOutCubic = function (t, b, c, d, p_params) 
{
	return c*((t=t/d-1)*t*t + 1) + b;
}

Easing.easeInOutCubic = function (t, b, c, d, p_params) 
{
	if ((t/=d/2) < 1) return c/2*t*t*t + b;
	return c/2*((t-=2)*t*t + 2) + b;
}

Easing.easeOutInCubic = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutCubic (t*2, b, c/2, d, p_params);
	return Easing.easeInCubic((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInQuart = function (t, b, c, d, p_params) 
{
	return c*(t/=d)*t*t*t + b;
}

Easing.easeOutQuart = function (t, b, c, d, p_params) 
{
	return -c * ((t=t/d-1)*t*t*t - 1) + b;
}

Easing.easeInOutQuart = function (t, b, c, d, p_params) 
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t + b;
	return -c/2 * ((t-=2)*t*t*t - 2) + b;
}

Easing.easeOutInQuart = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutQuart (t*2, b, c/2, d, p_params);
	return Easing.easeInQuart((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInQuint = function (t, b, c, d, p_params) 
{
	return c*(t/=d)*t*t*t*t + b;
}

Easing.easeOutQuint = function (t, b, c, d, p_params) 
{
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
}

Easing.easeInOutQuint = function (t, b, c, d, p_params) 
{
	if ((t/=d/2) < 1) return c/2*t*t*t*t*t + b;
	return c/2*((t-=2)*t*t*t*t + 2) + b;
}

Easing.easeOutInQuint = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutQuint (t*2, b, c/2, d, p_params);
	return Easing.easeInQuint((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInSine = function (t, b, c, d, p_params) 
{
	return -c * Math.cos(t/d * (Math.PI/2)) + c + b;
}

Easing.easeOutSine = function (t, b, c, d, p_params) 
{
	return c * Math.sin(t/d * (Math.PI/2)) + b;
}

Easing.easeInOutSine = function (t, b, c, d, p_params) 
{
	return -c/2 * (Math.cos(Math.PI*t/d) - 1) + b;
}

Easing.easeOutInSine = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutSine (t*2, b, c/2, d, p_params);
	return Easing.easeInSine((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInExpo = function (t, b, c, d, p_params) 
{
	return (t==0) ? b : c * Math.pow(2, 10 * (t/d - 1)) + b - c * 0.001;
}

Easing.easeOutExpo = function (t, b, c, d, p_params) 
{
	return (t==d) ? b+c : c * 1.001 * (-Math.pow(2, -10 * t/d) + 1) + b;
}

Easing.easeInOutExpo = function (t, b, c, d, p_params) 
{
	if (t==0) return b;
	if (t==d) return b+c;
	if ((t/=d/2) < 1) return c/2 * Math.pow(2, 10 * (t - 1)) + b - c * 0.0005;
	return c/2 * 1.0005 * (-Math.pow(2, -10 * --t) + 2) + b;
}

Easing.easeOutInExpo = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutExpo (t*2, b, c/2, d, p_params);
	return Easing.easeInExpo((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInCirc = function (t, b, c, d, p_params) 
{
	return -c * (Math.sqrt(1 - (t/=d)*t) - 1) + b;
}

Easing.easeOutCirc = function (t, b, c, d, p_params) 
{
	return c * Math.sqrt(1 - (t=t/d-1)*t) + b;
}

Easing.easeInOutCirc = function (t, b, c, d, p_params) 
{
	if ((t/=d/2) < 1) return -c/2 * (Math.sqrt(1 - t*t) - 1) + b;
	return c/2 * (Math.sqrt(1 - (t-=2)*t) + 1) + b;
}

Easing.easeOutInCirc = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutCirc (t*2, b, c/2, d, p_params);
	return Easing.easeInCirc((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInElastic = function (t, b, c, d, p_params) 
{
	if (t==0) return b;
	if ((t/=d)==1) return b+c;
	var p = !Boolean(p_params) || isNaN(p_params.period) ? d*.3 : p_params.period;
	var s;
	var a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	return -(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
}

Easing.easeOutElastic = function (t, b, c, d, p_params) 
{
	if (t==0) return b;
	if ((t/=d)==1) return b+c;
	var p = !Boolean(p_params) || isNaN(p_params.period) ? d*.3 : p_params.period;
	var s;
	var a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	return (a*Math.pow(2,-10*t) * Math.sin( (t*d-s)*(2*Math.PI)/p ) + c + b);
}

Easing.easeInOutElastic = function (t, b, c, d, p_params) 
{
	if (t==0) return b;
	if ((t/=d/2)==2) return b+c;
	var p = !Boolean(p_params) || isNaN(p_params.period) ? d*(.3*1.5) : p_params.period;
	var s;
	var a = !Boolean(p_params) || isNaN(p_params.amplitude) ? 0 : p_params.amplitude;
	if (!Boolean(a) || a < Math.abs(c)) {
		a = c;
		s = p/4;
	} else {
		s = p/(2*Math.PI) * Math.asin (c/a);
	}
	if (t < 1) return -.5*(a*Math.pow(2,10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )) + b;
	return a*Math.pow(2,-10*(t-=1)) * Math.sin( (t*d-s)*(2*Math.PI)/p )*.5 + c + b;
}

Easing.easeOutInElastic = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutElastic (t*2, b, c/2, d, p_params);
	return Easing.easeInElastic((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInBack = function (t, b, c, d, p_params) 
{
	var s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
	return c*(t/=d)*t*((s+1)*t - s) + b;
}

Easing.easeOutBack = function (t, b, c, d, p_params) 
{
	var s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
	return c*((t=t/d-1)*t*((s+1)*t + s) + 1) + b;
}

Easing.easeInOutBack = function (t, b, c, d, p_params) 
{
	var s = !Boolean(p_params) || isNaN(p_params.overshoot) ? 1.70158 : p_params.overshoot;
	if ((t/=d/2) < 1) return c/2*(t*t*(((s*=(1.525))+1)*t - s)) + b;
	return c/2*((t-=2)*t*(((s*=(1.525))+1)*t + s) + 2) + b;
}

Easing.easeOutInBack = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutBack (t*2, b, c/2, d, p_params);
	return Easing.easeInBack((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInBounce = function (t, b, c, d, p_params) 
{
	return c - Easing.easeOutBounce (d-t, 0, c, d) + b;
}

Easing.easeOutBounce = function (t, b, c, d, p_params) 
{
	if ((t/=d) < (1/2.75)) {
		return c*(7.5625*t*t) + b;
	} else if (t < (2/2.75)) {
		return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
	} else if (t < (2.5/2.75)) {
		return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
	} else {
		return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
	}
}

Easing.easeInOutBounce = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeInBounce (t*2, 0, c, d) * .5 + b;
	else return Easing.easeOutBounce (t*2-d, 0, c, d) * .5 + c*.5 + b;
}

Easing.easeOutInBounce = function (t, b, c, d, p_params) 
{
	if (t < d/2) return Easing.easeOutBounce (t*2, b, c/2, d, p_params);
	return Easing.easeInBounce((t*2)-d, b+c/2, c/2, d, p_params);
}

Easing.easeInStrong= function (t, b, c, d, p_params) 
{
	return c*(t/=d)*t*t*t*t + b;
}

Easing.easeOutStrong= function (t, b, c, d, p_params) 
{
	return c*((t=t/d-1)*t*t*t*t + 1) + b;
}

Easing.easeInOutStrong= function (t, b, c, d, p_params) 
{
	if ((t/=d*0.5) < 1) return c*0.5*t*t*t*t*t + b;
	return c*0.5*((t-=2)*t*t*t*t + 2) + b;
}

//----------------------------------------- TweenLite -----------------------------------------

/***
 * =========================================================
 * TweenLite 
 * =========================================================
 */

TweenLite={}

/**
 * course name
 */
TweenLite.NONE="none";
TweenLite.LINEAR="linear";
TweenLite.QUAD="quad";
TweenLite.CUBIC="cubic";
TweenLite.QUART="quart";
TweenLite.QUINT="quint";
TweenLite.SINE="sine";
TweenLite.CIRC="circ";
TweenLite.EXPO="expo";
TweenLite.ELASTIC="elastic";
TweenLite.BACK="back";
TweenLite.BOUNCE="bounce";
TweenLite.STRONG="strong";

/**
 * mode
 */
TweenLite.IN="in";
TweenLite.OUT="out";
TweenLite.IN_OUT="inout";
TweenLite.OUT_IN="outin";

TweenLite._timer;
TweenLite._tweens = [];
TweenLite._inited = false;
TweenLite._transitionList = {};	

TweenLite.init=function()
{
	TweenLite._inited = true;
	
	TweenLite.register("easenone",			Easing.easeNone);
	TweenLite.register("linear",			Easing.easeNone);		
	
	TweenLite.register("easeinquad",		Easing.easeInQuad);	
	TweenLite.register("easeoutquad",		Easing.easeOutQuad);	
	TweenLite.register("easeinoutquad",		Easing.easeInOutQuad);	
	TweenLite.register("easeoutinquad",		Easing.easeOutInQuad);
	
	TweenLite.register("easeincubic",		Easing.easeInCubic);
	TweenLite.register("easeoutcubic",		Easing.easeOutCubic);
	TweenLite.register("easeinoutcubic",	Easing.easeInOutCubic);
	TweenLite.register("easeoutincubic",	Easing.easeOutInCubic);
	
	TweenLite.register("easeinquart",		Easing.easeInQuart);
	TweenLite.register("easeoutquart",		Easing.easeOutQuart);
	TweenLite.register("easeinoutquart",	Easing.easeInOutQuart);
	TweenLite.register("easeoutinquart",	Easing.easeOutInQuart);
	
	TweenLite.register("easeinquint",		Easing.easeInQuint);
	TweenLite.register("easeoutquint",		Easing.easeOutQuint);
	TweenLite.register("easeinoutquint",	Easing.easeInOutQuint);
	TweenLite.register("easeoutinquint",	Easing.easeOutInQuint);
	
	TweenLite.register("easeinsine",		Easing.easeInSine);
	TweenLite.register("easeoutsine",		Easing.easeOutSine);
	TweenLite.register("easeinoutsine",		Easing.easeInOutSine);
	TweenLite.register("easeoutinsine",		Easing.easeOutInSine);
	
	TweenLite.register("easeincirc",		Easing.easeInCirc);
	TweenLite.register("easeoutcirc",		Easing.easeOutCirc);
	TweenLite.register("easeinoutcirc",		Easing.easeInOutCirc);
	TweenLite.register("easeoutincirc",		Easing.easeOutInCirc);
	
	TweenLite.register("easeinexpo",		Easing.easeInExpo);		
	TweenLite.register("easeoutexpo", 		Easing.easeOutExpo);		
	TweenLite.register("easeinoutexpo", 	Easing.easeInOutExpo);		
	TweenLite.register("easeoutinexpo", 	Easing.easeOutInExpo);
	
	TweenLite.register("easeinelastic", 	Easing.easeInElastic);		
	TweenLite.register("easeoutelastic", 	Easing.easeOutElastic);	
	TweenLite.register("easeinoutelastic", 	Easing.easeInOutElastic);	
	TweenLite.register("easeoutinelastic", 	Easing.easeOutInElastic);
	
	TweenLite.register("easeinback", 		Easing.easeInBack);		
	TweenLite.register("easeoutback", 		Easing.easeOutBack);		
	TweenLite.register("easeinoutback", 	Easing.easeInOutBack);		
	TweenLite.register("easeoutinback", 	Easing.easeOutInBack);
	
	TweenLite.register("easeinbounce", 		Easing.easeInBounce);		
	TweenLite.register("easeoutbounce", 	Easing.easeOutBounce);		
	TweenLite.register("easeinoutbounce", 	Easing.easeInOutBounce);	
	TweenLite.register("easeoutinbounce", 	Easing.easeOutInBounce);
	
	TweenLite.register("easeinstrong", 		Easing.easeInStrong);		
	TweenLite.register("easeoutstrong", 	Easing.easeOutStrong);		
	TweenLite.register("easeinoutstrong", 	Easing.easeInOutStrong);	
}

TweenLite.register=function(p_name, p_function)
{
	TweenLite._transitionList[p_name] = p_function;
}

TweenLite.count=function(name,mode,start_value,target_value,min,max,param)
{
	if (!TweenLite._inited) TweenLite.init();
	var p_name=TweenLite.getEaseName(name,mode);
	return TweenLite._tween(p_name,min, target_value, target_value-start_value, max, param);
}

TweenLite.getEaseName=function(name,mode)
{
	return (name==TweenLite.LINEAR) ? TweenLite.LINEAR : ("ease"+(name==TweenLite.NONE ? TweenLite.NONE : (mode+name)));
}

TweenLite._tween=function(ease,start_value,target_value,min,max,param)
{
	if (!TweenLite._inited) TweenLite.init();
	if(!TweenLite._transitionList.hasOwnProperty(ease)) return target_value;
	return TweenLite._transitionList[ease](min, start_value, target_value, max, param);
}

/**
 * default params : "delay","ease","easeParams","onStart","onStartParams","onUpdate","onUpdateParams","onComplete","onCompleteParams"
 * @param {Object} target
 * @param {Number} duration
 * @param {Object} vars
 */
TweenLite.to = function (target, duration, vars) 
{
	if(target==undefined || duration<=0 || vars==undefined) return;
	
	if(TweenLite._tweens.length==0){
		if(Stage.current){
			Stage.current.addEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);
		}else{
			if(TweenLite._timer==null) TweenLite._timer=new Timer();
			TweenLite._timer.addEventListener(Timer.TIME,TweenLite._enterFrame);
			TweenLite._timer.start();
		}
	}
	
	var data={target : target, duration : duration, vars : vars};
	data.max=Math.ceil(duration*1000/Timer.fps);
	data.min=0;
	
	if(data.vars.hasOwnProperty("delay") && data.vars["delay"]){
		data.delay=Math.ceil(Number(data.vars["delay"])*1000/Timer.fps);
		delete data.vars["delay"];
	}else {
		data.delay=0;
	}
	
	if(data.vars.hasOwnProperty("ease") && data.vars["ease"]){
		data.ease=data.vars["ease"];
		delete data.vars["ease"];
	}else{
		data.ease="easeoutquad";
	}
	
	if(data.vars.hasOwnProperty("easeParams") && data.vars["easeParams"]){
		data.easeParams=data.vars["easeParams"];
		delete data.vars["easeParams"];
	}
	
	if(data.vars.hasOwnProperty("onStart") && data.vars["onStart"]){
		data.onStart=data.vars["onStart"];
		delete data.vars["onStart"];
	}
	
	if(data.vars.hasOwnProperty("onStartParams") && data.vars["onStartParams"]){
		data.onStartParams=data.vars["onStartParams"];
		delete data.vars["onStartParams"];
	}
	
	if(data.vars.hasOwnProperty("onUpdate") && data.vars["onUpdate"]){
		data.onUpdate=data.vars["onUpdate"];
		delete data.vars["onUpdate"];
	}
	
	if(data.vars.hasOwnProperty("onUpdateParams") && data.vars["onUpdateParams"]){
		data.onUpdateParams=data.vars["onUpdateParams"];
		delete data.vars["onUpdateParams"];
	}
	
	if(data.vars.hasOwnProperty("onComplete") && data.vars["onComplete"]){
		data.onComplete=data.vars["onComplete"];
		delete data.vars["onComplete"];
	}
	
	if(data.vars.hasOwnProperty("onCompleteParams") && data.vars["onCompleteParams"]){
		data.onCompleteParams=data.vars["onCompleteParams"];
		delete data.vars["onCompleteParams"];
	}
	
	var k;
	for (k in data.vars) {
		if(data.first==undefined) data.first={};
		data.first[k]=(target[k]==undefined) ? 0 : target[k];
		data.vars[k]-=data.first[k];
	}
	
	TweenLite._tweens.push(data);
}

TweenLite.pause = function () 
{
	if(TweenLite._timer && TweenLite._timer.isStart()) {
		TweenLite._timer.stop();
		TweenLite._timer.removeEventListener(Timer.TIME,TweenLite._enterFrame);
	}
	else if(Stage.current){
		Stage.current.removeEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);
	}
}

TweenLite.resume = function () 
{
	if(TweenLite._timer && TweenLite._tweens.length>0  && !TweenLite._timer.isStart()) {
		TweenLite._timer.addEventListener(Timer.TIME,TweenLite._enterFrame);
		TweenLite._timer.start();
	}
	else if(Stage.current){
		Stage.current.addEventListener(StageEvent.ENTER_FRAME,TweenLite._enterFrame);
	}
}

TweenLite.remove = function (target) 
{
	if(target==undefined || TweenLite._tweens.length==0) return;
	
	var i,tween;
	var len=TweenLite._tweens.length;
	
	for (i=0;i<len;i++) {
		tween=TweenLite._tweens[i];
	    
	    if(tween.target==target){
	    	TweenLite._tweens.splice(i,1);
	    	len--;
	    	i--;
	    }
	}
	
	if(TweenLite._tweens.length==0) TweenLite.pause();
}

TweenLite._enterFrame=function(e)
{
	if(TweenLite._tweens.length==0) return;
	TweenLite._default_params
	
	var i,tween;
	var len=TweenLite._tweens.length;
	
	for (i=0;i<len;i++) {
		tween=TweenLite._tweens[i];
		TweenLite._setAttribute(tween);
	}
}

TweenLite._setAttribute=function(tween)
{
	if(tween==undefined) return;
	
	var k,twname;
	var target=tween["target"]; 
	
	if(tween.min==0 && tween.hasOwnProperty("onStart") && tween["onStart"]){
		try{
			tween["onStart"].apply(null,tween.hasOwnProperty("onStartParams") ? tween["onStartParams"] : null);
		}
		catch(err){
			twname=twname || target.name+"("+ClassUtil.getQualifiedClassName(target)+")";
			trace("[ERROR] TweenLite._setAttribute:onStart "+twname+"{"+err+"}");
		}
		
		delete tween["onStartParams"];
		delete tween["onStart"];
	}
	
	if(tween.delay>0) {
		tween.delay--;
		return;
	}
	else tween.min++;
	
	for (k in tween.vars) {
		target[k] = (tween.min>=tween.max) ? (tween.vars[k]+tween.first[k]) : TweenLite._tween(tween.ease,tween.first[k],tween.vars[k],tween.min,tween.max,tween.easeParams);
	}
	
	if(tween.min>=tween.max){
		if(tween.hasOwnProperty("onComplete") && tween["onComplete"]){
			try{
				tween["onComplete"].apply(null,tween.hasOwnProperty("onCompleteParams") ? tween["onCompleteParams"] : null);
			}
			catch(err){
				twname=twname || target.name+"("+ClassUtil.getQualifiedClassName(target)+")";
				trace("[ERROR] TweenLite._setAttribute:onComplete "+twname+"{"+err+"}");
			}
		}
		
		var index=TweenLite._tweens.indexOf(tween);
		TweenLite._tweens.splice(index,1);
		
		if(TweenLite._tweens.length==0) TweenLite.pause();
		return;
	}
	
	if(tween.hasOwnProperty("onUpdate") && tween["onUpdate"]){
	    try{
			tween["onUpdate"].apply(null,tween.hasOwnProperty("onUpdateParams") ? tween["onUpdateParams"] : null);
		}
		catch(err){
			twname=twname || target.name+"("+ClassUtil.getQualifiedClassName(target)+")";
			trace("[ERROR] TweenLite._setAttribute:onUpdate "+twname+"{"+err+"}");
		}
	}
}

//----------------------------------------- ComboList -----------------------------------------


function ComboList()
{
	DisplayObjectContainer.call(this);
	this._value=this._current=this._btn=this._datas=this._tf=this._sprite=this._bar=this._container=this._control=this._list=null;
	this._btn_height=this._timeID=this._list_width=this._list_height=0;
	this._downspread=this._init=this._enable=false;
	
	this.delay_time=1000;
	this.item_rect=null;
	this.item_height=23;
	this.font_size=16;
	this.bar_width=4;
	this.space=1;
}

ComboList.SELECT="combo_list_select";
ComboList.SPREAD="combo_list_spread";

Global.inherit(ComboList,DisplayObjectContainer);

Object.defineProperty(ComboList.prototype,"enable",{
	get: function () {
	    return this._enable;
    },

    set: function (value) {
    	if(!this._init) return;
    	this._enable=value;
    	this._btn.enable=value;
    	if(!value) this._closeList();
    },
    enumerable: true,
    configurable: true
});

Object.defineProperty(ComboList.prototype,"value",{
	get: function () {
	    return this._value;
   },
    enumerable: true,
    configurable: true
});

Object.defineProperty(ComboList.prototype,"current",{
	get: function () {
	    return this._current;
   },
	set: function (value) {
    	if(!this._init || value==undefined || this._datas==undefined || value<0 || value>=this._datas.length) return;
    	var bool=(this._current!=value);
    	
    	var old_item=this._datas[this._current];
    	if(old_item) old_item.enable=true;
    	var new_item=this._datas[value];
    	
    	if(new_item) {
    		new_item.enable=false;
    		this._value=new_item.datas;
    		this._tf.text=new_item.getLabel();
    	}
    	
    	this._current=value;
    	if(bool) this.dispatchEvent(Factory.c("ev",[ComboList.SELECT,this._value])); 
    },
    enumerable: true,
    configurable: true
});

ComboList.prototype.select=function(d)
{
	if(d==null || !this._init || this._datas==null || this._datas.length<1) return false;
	for(var btn,i=0,l=this._datas.length;i<l;i++){
		btn=this._datas[i];
		if(btn && btn.datas==d) {
			this.current=(btn.index-1);
			return true;
		}
	}
	return false;
}

ComboList.prototype.initialize=function()
{
	if(this._init) return;
	this._init=true;
	
	this._datas=[];
	this._list=Factory.c("dc");
	this._container=Factory.c("dc");
	this._container.setSize(this._list_width-this.bar_width*2,this._list_height);
	
	this._control=new UIContainer();
	this._control.setDimension(this._list_width-this.bar_width*2,this._list_height,UIOrientation.isY,true,false);
	this._control.instance=this._container;
	this._list.addChild(this._control);
	
	var bar_mc=Factory.c("bs");
    var bottom=Factory.c("bs");

    bar_mc.setup("#999999",this.bar_width*2,this._list_height,this.bar_width);
    bottom.setup("#E0E0E0",this.bar_width*2,this.bar_width);
  
	this._bar=new SlideBar();
	this._bar.setup(this._container,this._control.mask,bar_mc,bottom,true,true,{x:this._control.x,y:this._control.y});
	this._list.addChild(this._bar);
	
	this._sprite=new Sprite();
	this._sprite.addChild(this._list);
	this._sprite.mask=new Rectangle(0,0,this._list_width,this._list_height);
	this.addChild(this._sprite);
	
	this._tf=Factory.c("tf",{text:"",size:this.font_size,color:"#666666"});
	this._tf.width=this._tf.lineWidth=this._list_width-this._btn.getWidth();
	this._tf.height=this._btn_height;
	
	var shape=Factory.c("bs",["#FFFFFF",this._tf.width,this._tf.height]);
	shape.alpha=0;
	this._btn.addChild(shape);
	shape.moveTo(-this._tf.width,(this._tf.height-(this.font_size+4))*0.5);
	
	this.addChild(this._btn);
	this.moveTo(this._btn.x,this._btn.y);
	this._btn.moveTo(this._tf.width,0);
	this._sprite.moveTo(0,this._tf.height);
	this._btn._updateSize();
	
	this._tf.moveTo(0,(this._tf.height-(this.font_size+4))*0.5);
	this.addChild(this._tf);
	
	this._list.mouseEnabled=true;
	this._list.addEventListener(StageEvent.MOUSE_OVER,Global.delegate(this._stopCountTime,this),this.name);
	this._list.addEventListener(StageEvent.MOUSE_OUT,Global.delegate(this._startCountTime,this),this.name);
	
	this._btn.addEventListener(StageEvent.MOUSE_CLICK,Global.delegate(this._onClickHandler,this),this.name);
    this._btn.addEventListener(StageEvent.MOUSE_OVER,Global.delegate(this._stopCountTime,this),this.name);
	this._btn.addEventListener(StageEvent.MOUSE_OUT,Global.delegate(this._startCountTime,this),this.name);
    this._sprite.visible=false;
}

ComboList.prototype._onClickHandler=function(e)
{
	if(!this._sprite.visible) this._openList(); 
	else this._closeList();
}

ComboList.prototype.setup=function(datas,w,h,btn,current)
{
	this._btn=btn;
	this._list_width=w;
	this._list_height=h;
	this._btn_height=btn.getHeight();
	this._current=(current==undefined) ? 0: current;
	
	if(!this._init) this.initialize();
	if(datas==undefined || datas.length==undefined || datas.length<1) return;
	
	for(var i=0,l=datas.length;i<l;i++){
		this.addItem(datas[i],false);
	}
	
	this._refresh();
	this.current=this._current;
}

ComboList.prototype.addItem=function(data,noRefresh)
{
	if(data==undefined) return;
	if(this.item_rect==null) this.item_rect=new Rectangle(0,0,this._list_width-this.bar_width*2,this.item_height);
	
	var v=(data.hasOwnProperty("value") || data.value) ? data.value : data;
	var l=(data.hasOwnProperty("label") || data.label) ? data.label : v;
	
	var btn=new Button();
    var shape=Factory.c("bs");
    
    shape.setup("#FFFFFF",this._list_width-this.bar_width*2,this.item_height,0,1,"#CCCCCC");
    
    btn.instance=shape;
    btn.setup([Factory.c("ef",[Effect.COLOR,"#FFFFFF",0.15])],[Factory.c("ef",[Effect.COLOR,"#E6F4AC",0.15])]);
    
    btn.setLabel(l,"Microsoft YaHei,Arial","#CCCCCC",this.font_size,false,"#666666",0,shape.width,shape.height);
    btn.datas=v;
    
	this._container.addChild(btn);
	btn.index=this._datas.push(btn);

	btn.setSize(shape.width,shape.height);
	btn.addEventListener(StageEvent.MOUSE_TAP,Global.delegate(this._onTapHandler,this),this.name);
	
	if(noRefresh==undefined) this._refresh();
}

ComboList.prototype._refresh=function()
{
	if(this._datas==undefined || this._datas.length<1) return;
	
	LayoutUtil.tile(this._datas,1,false,this.item_rect);
	this._container._updateSize();
	this._control._recovery_scale();
	this._bar.barSync();
}

ComboList.prototype._onTapHandler=function(e)
{
	var btn=e.target;
	if(btn==undefined) return;
	this.current=(btn.index-1);
	this._closeList();
}

ComboList.prototype._startCountTime=function(e)
{  
	if(!this._sprite.visible) return;
	if(this._timeID>0) clearInterval(  this._timeID );
	this._timeID=setInterval(Global.delegate(this._closeList,this),this.delay_time) 
}

ComboList.prototype._stopCountTime=function(e)
{  
	clearInterval(  this._timeID );
}
		
ComboList.prototype._openList=function() 
{
	var pos=this.localToGlobal(0,0);
	this._downspread=(pos.y-this._list_height<0);
	var h=Math.min(this._list_height,this._container.height);
	var d=Math.max(0,this._list_height-this._container.height);
	
	this._sprite.visible=true;
	this._sprite.moveTo(0,this._downspread ? this._btn_height+this.space : -this.space-h-d);
	this._list.y=this._downspread ? -this._list.height : h;
	
	TweenLite.remove(this._list);
	TweenLite.to(this._list,0.5,{y:this._downspread ? 0 :d,onComplete:Global.delegate(this._outCompleteHandle,this)});
}

ComboList.prototype._closeList=function()
{
	if(!this._sprite.visible) return;

	this._stopCountTime();
	TweenLite.remove(this._list);
	TweenLite.to(this._list,0.4,{y:this._downspread ? -this._list_height : this._list_height,onComplete:Global.delegate(this._inCompleteHandle,this)}); 
}

ComboList.prototype._inCompleteHandle=function()
{
	this._sprite.visible=false;
	this.dispatchEvent(Factory.c("ev",[ComboList.SPREAD,false]));
}

ComboList.prototype._outCompleteHandle=function()
{
	this.dispatchEvent(Factory.c("ev",[ComboList.SPREAD,true]));
}

ComboList.prototype.dispose=function()
{
	this._closeList();
	this._stopCountTime();
	
	if(this._btn){
		this._btn.removeEventListener(StageEvent.MOUSE_CLICK,null,this.name);
   		this._btn.removeEventListener(StageEvent.MOUSE_OVER,null,this.name);
	    this._btn.removeEventListener(StageEvent.MOUSE_OUT,null,this.name);
	}
	
	ComboList.superClass.dispose.call(this);
	
	delete this._value,this._current,this._btn,this._datas,this._tf,this._sprite,this._bar,this._container,this._control,this._list;
	delete this._btn_height,this._timeID,this._list_width,this._list_height,this._downspread,this._init,this._enable;
	delete this.delay_time,this.item_rect,this.item_height,this.font_size,this.bar_width;
}