var COOKIE_DAYS = 2;

function toggle_div(ttl,id) // {{{
{
    set_wrap_div_top_visibility(id);

    var  div = document.getElementById("div_"+id);
    if( !div ) return;
    div.className = (div.className == "expanded") ? "collapsed" : "expanded";

    if(div.className == "expanded") {
	cache_expanded(div);
	createCookie("expanded", id, COOKIE_DAYS);
    }

    // mark read
    if(ttl) {
  	ttl.style.opacity = (div.className == "expanded") ? "1.0" : "0.5";
//	ttl.style.opacity = "0.5";
    }

} // }}}
function expand_div(id) // {{{
{
    set_wrap_div_top_visibility(id);

    if(id=="top") eraseCookie("expanded");

    var div = document.getElementById("div_"+id);
    var nothing_to_expand = (div == null) || ((div != null) && (div.className == "expanded"));

    collapse_expanded();

    if(nothing_to_expand) {
	id = readCookie("expanded");
	div               = (id) ? document.getElementById("div_"+id) : null;
	nothing_to_expand = (div == null) || ((div != null) && (div.className == "expanded"));
	if(nothing_to_expand)
	    return;

	set_wrap_div_top_visibility(id);
    }
    else {
	createCookie("expanded", id, COOKIE_DAYS);
    }

    // expand parent chain
    while(div != null) {
	if(div.className == "collapsed") {
	    div.className = "expanded";
	    cache_expanded(div);
	}
	div = div.parentNode;
    }

} // }}}

function set_wrap_div_top_visibility(id) // {{{
{
    // ignore missing targets
    if(id != "top") {
	var div = document.getElementById("div_"+id);
	if(!div) return;
    }

    // hide top most wrap_div when done
    var wrap_div_top = document.getElementById("wrap_div_top");
    if(wrap_div_top)
	wrap_div_top.style.visibility = (id == "top") ? "hidden" : "visible";
}
// }}}

var ExpandedArray = new Array();
function cache_expanded(div) // {{{
{
    var i;
    for(i = 0; i < ExpandedArray.length; ++i) {
	if(ExpandedArray[i] == div)
	    break;
    }
    if(i == ExpandedArray.length) ExpandedArray[i] = div;
}
// }}}
function collapse_expanded() // {{{
{
    var div, i;
    for(i = 0; i < ExpandedArray.length; ++i) {
	div = ExpandedArray[i];
	if(div.className == "expanded")
	    div.className = "collapsed";
    }
}
// }}}

var IMG_MAX = 8;
function browse_img(dir) // {{{
{

    // get current image
    var crnt = get_current_img();

    // get next image
    var img_next = document.getElementById("img"+(crnt+dir));
    if(img_next) {
        // hide current image {{{
        if(crnt) {
            var img = document.getElementById("img"+(crnt));
            img.style.display = "none";
        }
        //}}}
        img_next.style.display = "block";
    }
    // cursor, title
    update_title_and_cursor(crnt+dir);

} // }}}
function show_img(num) // {{{
{
    // get current image
    var crnt = get_current_img();

    // get next image
    var img_next = document.getElementById("img"+(num     ));
    if(img_next) {
        // hide current image {{{
        if(crnt) {
            var img = document.getElementById("img"+(crnt));
            img.style.display = "none";
        }
        //}}}
        img_next.style.display = "block";
    }
    // cursor, title
    update_title_and_cursor(num);

} // }}}
function keypress(e) // {{{
{
    var keycode = (e.keyCode) ? e.keyCode : e.which;
    var c       = String.fromCharCode(keycode);

    if(     c == 'a') browse_img(-1);
    else if(c == 'd') browse_img( 1);
    if(     c == '-') browse_img(-1);
    else if(c == '+') browse_img( 1);
    else if(c == '=') browse_img( 1);

    else if(c == '1') show_img( 1);
    else if(c == '2') show_img( 2);
    else if(c == '3') show_img( 3);
    else if(c == '4') show_img( 4);
    else if(c == '5') show_img( 5);
    else if(c == '6') show_img( 6);
    else if(c == '7') show_img( 7);
    else if(c == '8') show_img( 8);
    else if(c == '9') show_img( 9);

} // }}}
function get_current_img() // {{{
{
    var crnt = 0;
    for(var n= 1; n <= IMG_MAX; n += 1) {
        img = document.getElementById("img"+n);
        if(img) {
            if(img.style.display != "none") {
                crnt = n
                break;
            }
        }
    }
    return crnt;
} // }}}
function update_title_and_cursor( crnt ) // {{{
{
    var title, swpL, swpR, last;

    last = true;
    {   title = ""; img = document.getElementById("img"+(crnt-1)); if(img )        title = img.title; last= false; }
    if(!title)    { img = document.getElementById("img"+(crnt  )); if(img )        title = img.title; last=  true; }
    swpL =                document.getElementById("swpL");         if(swpL) { swpL.title =     title; swpL.className = (last) ? "endC" : "swpL"; }
    curL =                document.getElementById("curL");         if(curL) {                         curL.className = (last) ? "endC" : "curL"; }

    last = true;
    {   title = ""; img = document.getElementById("img"+(crnt+1)); if(img )        title = img.title; last= false; }
    if(!title)    { img = document.getElementById("img"+(crnt  )); if(img )        title = img.title; last=  true; }
    swpR =                document.getElementById("swpR");         if(swpR) { swpR.title =     title; swpR.className = (last) ? "endC" : "swpR"; }
    curR =                document.getElementById("curR");         if(curR) {                         curR.className = (last) ? "endC" : "curR"; }

} // }}}

var compare_target_num = 0;
function compare_target() // {{{
{
    // get current image
    var crnt = get_current_img();

    if(compare_target_num == 0)
	compare_target_num = crnt;

    if(crnt != compare_target_num) {
	show_img( compare_target_num );
	compare_target_num = crnt;
    }

    var el = document.getElementById("span_compare_target_num");
    if(el) el.innerHTML = compare_target_num;

} // }}}

/* COOKIES */
function createCookie(cName, value, days)// {{{
{
try {
    if(days) {
        var date    = new Date();

        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));

        var expires = "; expires=" + date.toGMTString();
    }
    else {
        var expires = "";
    }
    document.cookie = cName + "=" + value + expires + "; path=/";
} catch(ex) {}

}
// }}}
function readCookie(cName) // {{{
{
    var value   = "";
try {
    var nameEQ  = cName + "=";
    var ca      = document.cookie.split(';');
    for(var i= 0; i < ca.length; ++i)
    {
        var s   = ca[ i ];

        while(s.charAt(0) == ' ')
            s = s.substring(1, s.length);

        if(s.indexOf(nameEQ) == 0) {
            value = s.substring(nameEQ.length, s.length);
            //break;
        }
    }
} catch(ex) {}

    return value;
}
// }}}
function eraseCookie(cName)// {{{
{
    createCookie(cName, "", -1);

}
// }}}

/* MOUSE */
function fold_onclick(num, url) { // {{{
    for(var n=1; n<=8; ++n) {
	// HTML ELEMENTS {{{
	if(n != num) continue; // leave others alone

	var fold_div   = document.getElementById("fold_div"+n);
	var fold_grip  = document.getElementById("fold_grip"+n);
	var fold_pane  = document.getElementById("fold_pane"+n);
	var transcript = document.getElementById("transcript"+n);
	if(!fold_div || !fold_pane)
	    continue;

	//}}}
	// Hide-Show [url] {{{
	show_hide = (fold_pane.className != "fold_show");

	if( show_hide ) {
	    if(url.indexOf("http") == 0)
		if(fold_pane.src != url) fold_pane.src = url;
	}

	//}}}
        // update {{{

        if(fold_div  ) fold_div .className         = (show_hide) ? "fold_show" : "fold_dim";
	if(fold_pane ) fold_pane.className         = (show_hide) ? "fold_show" : "fold_hide";

//      if(fold_grip ) fold_grip.style.display     = (show_hide) ? "none"      : "inline";
        if(transcript) transcript.style.visibility = (show_hide) ? "visible"   : "hidden";

        // PANE focus-blur
        if(fold_pane) if(show_hide) fold_pane.focus();

        //}}}
    }
} // }}}
function getPosition(el) { //{{{
    var xPosition = 0;
    var yPosition = 0;
      
    while (el) {
        xPosition += (el.offsetLeft - el.scrollLeft + el.clientLeft);
        yPosition += (el.offsetTop  - el.scrollTop  + el.clientTop);
	el = el.offsetParent;
    }
    return { x: xPosition, y: yPosition };
} //}}}
    function fold_stopEventPropagation(e, el) { //{{{
	if(!e) e = window.event;
	if(e.preventDefault ) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();
	else                  e.cancelBubble = true;
    } // }}}

/* KEYBOARD */
var KEY_TIC = 0;
function fold_keydown(e, el) { //{{{
    // :!start explorer "http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes"
    // EVENT {{{
    if(e.stopImmediatePropagation) e.stopImmediatePropagation();
    if(e.stopPropagation         ) e.stopPropagation();
    if(e.preventDefault          ) e.preventDefault();
    //if(e.defaultPrevented) return; // Should do nothing if the key event was already consumed.
    if(e.repeat) return;

    //}}}
    // value {{{

    var charCode = (e.keyCode) ? e.keyCode : e.which;
    var value                     = "<undefined_charCode>"
	// [   0-  15] {{{

	if     (charCode ==    0) value = "<NUL>"           ; // +^@ YES
	else if(charCode ==    1) value = "<SOH>"           ; //  ^A XXX
	else if(charCode ==    2) value = "<STX>"           ; //  ^B
	else if(charCode ==    3) value = "<ETX>"           ; //  ^C

	else if(charCode ==    4) value = "<EOT>"           ; //  ^D
	else if(charCode ==    5) value = "<ENQ>"           ; //  ^E
	else if(charCode ==    6) value = "<ACK>"           ; //  ^F
	else if(charCode ==    7) value = "<BEL>"           ; //  ^G
	else if(charCode ==    8) value = "<BS>"            ; //  ^H


	else if(charCode ==    9) value = "<TAB>"           ; //  ^I
	else if(charCode ==   10) value = "<LF>"            ; //  ^J
	else if(charCode ==   11) value = "<VT>"            ; //  ^K
	else if(charCode ==   12) value = "<FF>"            ; //  ^L

	else if(charCode ==   13) value = "<ENTER>"         ; //  ^M
	else if(charCode ==   14) value = "<SO>"          ; //  ^N
	else if(charCode ==   15) value = "<SI>"          ; //  ^O

    //}}}
    // [  16-  31] {{{
	else if(charCode ==   16) value = "<SHIFT>"         ;
	else if(charCode ==   17) value = "<CTRL>"          ;
	else if(charCode ==   18) value = "<ALT>"           ;
	else if(charCode ==   19) value = "<BREAK>"         ;

	else if(charCode ==   20) value = "<CAPSLOCK>"      ;
	else if(charCode ==   21) value = "<NAK>"         ; //  ^U
	else if(charCode ==   22) value = "<SYN>"         ; //  ^V
	else if(charCode ==   23) value = "<ETB>"         ; //  ^W

	else if(charCode ==   24) value = "<CAN>"         ; //  ^X
	else if(charCode ==   25) value = "<EM>"          ; //  ^Y
	else if(charCode ==   26) value = "<SUB>"         ; //  ^Z
	else if(charCode ==   27) value = "<ESCAPE>"        ;

	else if(charCode ==   28) value = "<FS>"          ; //  ^\
	else if(charCode ==   29) value = "<GS>"          ; //  ^]
	else if(charCode ==   30) value = "<RS>"          ; //  ^^
	else if(charCode ==   31) value = "<US>"          ; //  ^_

    //}}}
    // [  32-  48] {{{
	else if(charCode ==  32) value = " "                ;
	else if(charCode ==  33) value = "<PGUP>"           ;
	else if(charCode ==  34) value = "<PGDOWN>"         ;
	else if(charCode ==  35) value = "<END>"            ;
	else if(charCode ==  36) value = "<HOME>"           ;
	else if(charCode ==  37) value = "<LEFT>"           ;
	else if(charCode ==  38) value = "<UP>"             ;
	else if(charCode ==  39) value = "<RIGHT>"          ;
	else if(charCode ==  40) value = "<DOWN>"           ;

    //}}}
    // [  48-  64] {{{

	else if(charCode ==  45) value = "<INSERT>"        ;
	else if(charCode ==  46) value = "<DELETE>"        ;

    //}}}
    // [  64-  80] {{{

    //}}}
    // [  80-  96] {{{

	else if(charCode ==  91) value = "<LWIN>"          ;
	else if(charCode ==  92) value = "<RWIN>"          ;
	else if(charCode ==  93) value = "<SELECT>"        ;
	else if(charCode ==  96) value = "<KP0>"           ;
	else if(charCode ==  97) value = "<KP1>"           ;
	else if(charCode ==  98) value = "<KP2>"           ;
	else if(charCode ==  99) value = "<KP3>"           ;
	else if(charCode == 100) value = "<KP4>"           ;

    //}}}
    // [  96- 112] {{{

	else if(charCode == 101) value = "<KP5>"           ;
	else if(charCode == 102) value = "<KP6>"           ;
	else if(charCode == 103) value = "<KP7>"           ;
	else if(charCode == 104) value = "<KP8>"           ;
	else if(charCode == 105) value = "<KP9>"           ;
	else if(charCode == 106) value = "*"             ;
	else if(charCode == 107) value = "+"             ;
	else if(charCode == 109) value = "-"             ;
	else if(charCode == 110) value = "."             ;
	else if(charCode == 111) value = "/"             ;

    //}}}
    // [ 112- 128] {{{
	else if(charCode == 112) value = "<F1>"          ;
	else if(charCode == 113) value = "<F2>"          ;
	else if(charCode == 114) value = "<F3>"          ;
	else if(charCode == 115) value = "<F4>"          ;

	else if(charCode == 116) value = "<F5>"          ;
	else if(charCode == 117) value = "<F6>"          ;
	else if(charCode == 118) value = "<F7>"          ;
	else if(charCode == 119) value = "<F8>"          ;

	else if(charCode == 120) value = "<F9>"          ;
	else if(charCode == 121) value = "<F10>"         ;
	else if(charCode == 122) value = "<F11>"         ;
	else if(charCode == 123) value = "<F12>"         ;
	else if(charCode == 127) value = "<DEL>"         ;

    //}}}
    // [ 128- 144] {{{

	else if(charCode == 144) value = "<NUMLOCK>"       ;
	else if(charCode == 145) value = "<SCROLLLOCK>"    ;

    //}}}
    // [ 144- 160] {{{

    //}}}
    // [ 160- 176] {{{

    //}}}
    // [ 176- 192] {{{

	else if(charCode == 186) value = ";"             ;
	else if(charCode == 187) value = "="             ;
	else if(charCode == 188) value = ","             ;
	else if(charCode == 189) value = "-"             ;
	else if(charCode == 190) value = "."             ;
	else if(charCode == 191) value = "/"             ;
	else if(charCode == 192) value = "`"             ;

    //}}}
    // [ 192- 208] {{{

    //}}}
    // [ 208- 224] {{{

	else if(charCode == 219) value = "["             ;
	else if(charCode == 220) value = "\\"            ;
	else if(charCode == 221) value = "]"             ;
	else if(charCode == 222) value = "'"             ;

    //}}}
	else                   value = String.fromCharCode(charCode).toLowerCase();

    //}}}
    // CONTROL {{{
    var controlled_value =  "";
    var controlled_stroke=  "";

    if(e.ctrlKey) {

	if     (value == "@") controlled_value =    "<NUL>"; // 0
	else if(value == "a") controlled_value =    "<SOH>"; // 1
	else if(value == "b") controlled_value =    "<STX>"; // 2
	else if(value == "c") controlled_value =    "<ETX>"; // 3
	else if(value == "d") controlled_value =    "<EOT>"; // 4
	else if(value == "e") controlled_value =    "<ENQ>"; // 5
	else if(value == "f") controlled_value =    "<ACK>"; // 6
	else if(value == "g") controlled_value =    "<BEL>"; // 7
	else if(value == "h") controlled_value =     "<BS>"; // 8
	else if(value == "i") controlled_value =    "<TAB>"; // 9

	else if(value == "j") controlled_value =     "<LF>"; // 10
	else if(value == "k") controlled_value =     "<VT>"; // 11
	else if(value == "l") controlled_value =     "<FF>"; // 12
	else if(value == "m") controlled_value =  "<ENTER>"; // 13
	else if(value == "n") controlled_value =     "<SO>"; // 14
	else if(value == "o") controlled_value =     "<SI>"; // 15
	else if(value == "p") controlled_value =    "<DLE>"; // 16
	else if(value == "q") controlled_value =    "<DC1>"; // 17
	else if(value == "r") controlled_value =    "<DC2>"; // 18
	else if(value == "s") controlled_value =    "<DC3>"; // 19

	else if(value == "t") controlled_value =    "<DC4>"; // 20
	else if(value == "u") controlled_value =    "<NAK>"; // 21
	else if(value == "v") controlled_value =    "<SYN>"; // 22
	else if(value == "w") controlled_value =    "<ETB>"; // 23
	else if(value == "x") controlled_value =    "<CAN>"; // 24
	else if(value == "y") controlled_value =     "<EM>"; // 25
	else if(value == "z") controlled_value =    "<SUB>"; // 26
	else if(value == "[") controlled_value = "<ESCAPE>"; // 27
	else if(value =="\\") controlled_value =     "<FS>"; // 28
	else if(value == "]") controlled_value =     "<GS>"; // 29

	if(e.shiftKey) {
	    if     (value == "6") controlled_value = "<RS>"; // <c-s-6> = <c-^> = 30
	    else if(value == "-") controlled_value = "<US>"; // <c-s--> = <c-_> = 31
	}

	if(controlled_value != "")
	    controlled_stroke = value;

    }
    //}}}
    // SHIFT {{{
    var shifted_value =  "";
    //	var shifted_stoke =  "";

    if(e.shiftKey) {

	// CONTROLLED SHIFTED-KEYS
	if(e.ctrlKey) {
	    if	   (value == "<RS>")        shifted_value = "^"; // <c-s-6> = <c-^> = 30
	    else if(value == "<US>")        shifted_value = "_"; // <c-s--> = <c-_> = value
	}
	else {

	    if	(value ==    "-")           shifted_value = "_";

	    else if	(value ==    "1")   shifted_value = "!";
	    else if	(value ==    "2")   shifted_value = "@";
	    else if	(value ==    "3")   shifted_value = "#";
	    else if	(value ==    "4")   shifted_value = "$";
	    else if	(value ==    "5")   shifted_value = "%";

	    else if	(value ==    "`")   shifted_value = "~";

	    else if	(value ==    "6")   shifted_value = "^";
	    else if	(value ==    "7")   shifted_value = "&";
	    else if	(value ==    "8")   shifted_value = "*";
	    else if	(value ==    "9")   shifted_value = "(";
	    else if	(value ==    "0")   shifted_value = ")";

	    else if	(value ==    "=")   shifted_value = "+";

	    else if	(value ==    "[")   shifted_value = "{";
	    else if	(value ==    "]")   shifted_value = "}";

	    else if	(value ==    ";")   shifted_value = ":";
	    else if	(value ==    ",")   shifted_value = "<";
	    else if	(value ==    ".")   shifted_value = ">";
	    else if	(value ==    "'")   shifted_value = '"';

	    else if	(value ==   "\\")   shifted_value = "|";
	    else if	(value ==    "/")   shifted_value = "?";
	}

	// UPPERCASE
	if((shifted_value == "") && (value.length == 1)) {
	    value = value.toUpperCase();
	}
    }
    else {
	// LOWERCASE
	if((value.length == 1))
	    value = value.toLowerCase();
    }

    //	if(shifted_value != "") {
    //	    shifted_stoke = value;
    //	    value = shifted_value;
    //	}

    //}}}
    // KEYEVENT (ID CODE MODIFIERS) {{{

    var is_modifier = (value=="<CTRL>") || (value=="<SHIFT>") || (value=="<ALT>") || (value=="<META>");
    var is_space    = (value==" ");
    var mod = "";
    if(!is_modifier && !is_space) {
	if(controlled_value == "") {	// not ASCII first column
	    if(e.metaKey                           )    mod = mod+"m-";
	    if(e.altKey                            )    mod = mod+"a-";
	    if(e.ctrlKey                           )    mod = mod+"c-";
	    if(shifted_value == "") {	// not an already shifted values
		if(e.shiftKey) {
		    if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(value) < 0)
			mod = mod+"s-";
		}
	    }
	}
    }

    var v;
    if     (controlled_stroke != "")    v = controlled_value;
    else if(shifted_value     != "")    v = shifted_value;
    else				v = value;
    if(mod != "") {
	if(v.charAt(0) == "<") v =  v.substring(1, v.length-1);
	v = "<"+mod+v+">";
	v = v.toUpperCase();
    }

    //}}}
    // COMMAND {{{
    var transcript = document.getElementById("transcript2");
    //---- backspace {{{
    if(     v == "<BS>"    ) {
	if(el.value.substring(el.value.length-1, el.value.length) == ">")
	    el.value = el.value.substring(0, el.value.lastIndexOf("<"));
	else
	    el.value = el.value.substring(0, el.value.length-1);
    }
    //}}}
    //---- clear {{{
    else if(v == "<ESCAPE>") {
	KEY_TIC = 0;
	if(el.value=="") { // extra escape
	    if(transcript)
		transcript.style.visibility = (transcript.style.visibility != "visible") ? "visible" : "hidden";
	}
	el.value = "";
	v="";
    }
    //}}}
    //---- append [auto-clear] {{{
    else if((charCode !=   16)   // Shift
	&&  (charCode !=   17)   // Ctrl
	&&  (charCode !=   18)   // Alt
	)
    {
	if(el.value.length > 60) el.value = "";
	if(v) el.value += v;
    }
    //}}}
    //---- layout browse image {{{
    if(     v == "<c-=>") {
	browse_img( 1);
    }
    else if(v == "<c-->") {
	browse_img(-1);
    }
    //}}}
    //}}}
    // TRANSCRIPT {{{
    if(transcript) {
	// KEY-VALUE {{{
	if(v==" ") v = "<SPACE>";
	v = v.replace(/&/g,"&amp;"); // ...must be first!
	v = v.replace(/</g, "&lt;");
	v = v.replace(/>/g, "&gt;");

	//}}}
	// KEY-STROKE  {{{
	var k;
	if     (controlled_stroke != "") k = controlled_stroke;
	else if(shifted_value     != "") k = shifted_value;
	else				 k = value;
	mod = "";
	if(!is_modifier && !is_space) { // no jumpt to ASCII first column
	    if(e.metaKey                           )    mod = mod+"m-";
	    if(e.altKey                            )    mod = mod+"a-";
	    if(e.ctrlKey                           )    mod = mod+"c-";
	    if(shifted_value == "") {	// not an already shifted values
		if(e.shiftKey) {
		    if("ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(value) < 0)
			mod = mod+"s-";
		}
	    }
	}
	if(mod != "") {
	    if(k.charAt(0) == "<") k =  k.substring(1, k.length-1);
	    k = mod+k;
	    k = k.toLowerCase();
	}

	if(k==" ") k = "<SPACE>";

	k = k.replace(/&/g,"&amp;"); // ...must be first!
	k = k.replace(/</g, "&lt;");
	k = k.replace(/>/g, "&gt;");

	//}}}
	// CONTROLLED VALUE {{{
	var cv = controlled_value;
	cv = cv.replace(/&/g,"&amp;");
	cv = cv.replace(/</g, "&lt;");
	cv = cv.replace(/>/g, "&gt;");

	//}}}
	// SHIFTED VALUE {{{
	var sv = shifted_value;
	sv = sv.replace(/&/g,"&amp;");
	sv = sv.replace(/</g, "&lt;");
	sv = sv.replace(/>/g, "&gt;");

	//}}}
	// KEY_TIC {{{
	if(!is_modifier)
	    KEY_TIC += (v) ? 1 : 0;
	var m1 = ((KEY_TIC+1) % 8) ? "." : "o";
	var m2 = ((KEY_TIC+2) % 8) ? "." : "o";
	var m3 = ((KEY_TIC+3) % 8) ? "." : "o";
	var m4 = ((KEY_TIC+4) % 8) ? "." : "o";
	var m5 = ((KEY_TIC+5) % 8) ? "." : "o";
	var m6 = ((KEY_TIC+6) % 8) ? "." : "o";
	var m7 = ((KEY_TIC+7) % 8) ? "." : "o";
	var m8 = ((KEY_TIC+8) % 8) ? "." : "o";

	//}}}
	// MODIFIERS STATE {{{
	var i =  e.keyIdentifier;
	var o =  charCode;
	var m =  e.metaKey                          ? "m" : "&nbsp;";
	var a =  e.altKey                           ? "a" : "&nbsp;";
	var c =  e.ctrlKey                          ? "c" : "&nbsp;";
	var s = (e.shiftKey && (shifted_value=="")) ? "s" : "&nbsp;";

	//}}}
	// TRANSCRIPT {{{
	transcript.innerHTML    = ""
	    +"<div>"
	    + "<table>"

	    +"<tr><th>     ALT            </th><th>     SHIFT      </th><th>     CTRL       </th><th>     META       </th></tr>"
	    +"<tr><td>"+   a            +"</td><td>"+   s        +"</td><td>"+   c        +"</td><td>"+   m        +"</td></tr>"

	    +"<tr><th>     keyIdentifier  </th><th>   charCode     </th><th>     cv         </th><th>     sv         </th></tr>"
	    +"<tr><td>"+   i            +"</tn><td>"+ charCode   +"</td><td>"+   cv       +"</td><td>"+   sv       +"</td></tr>"

	    +"<tr><th          colspan=2>   value               </th><th>     key        </th><th>    KEY_TIC     </th></tr>"
	    +"<tr><td id='vtd' colspan=2>"+ v        +"</td><td id='ktd'>"+   k        +"</td><td>"+" "+m8+" "+m7+" "+m6+" "+m5+"<br>"+KEY_TIC+"<br>"+m4+" "+m3+" "+m2+" "+m1+"</td></tr>"

	    +"</table>" 
	    +"</div>" 
	    ;

	//}}}
    }
    //}}}
} // }}}
function fold_keypress(e,el) { //{{{
//    var el = document.getElementById("fold_pane1");
//    el.value = el.value+"fold_keypress ";
    fold_stopEventPropagation(e,el);
} // }}}
function fold_keyup(e,el) { //{{{
    //el = document.getElementById("vtd");
    //if(el) el.innerHTML = "";

    //el = document.getElementById("ktd");
    //if(el) el.innerHTML = "";

    fold_stopEventPropagation(e,el);
} // }}}

/* MOVE */
//{{{
var MO_id="transcript2";
var MO_el=null;
var LG_el=null;
var MO_cp;

var dx = 0;
var dy = 0;
var sx = 0;
var sy = 0;

window.onload = addListeners;

function addListeners()
{
    MO_el = document.getElementById(MO_id);
    if(!MO_el) return;

    MO_el .addEventListener("mousedown", mouseDown , false);
    window.addEventListener("mouseup"  , mouseUp   , false);
    MO_el.addEventListener("touchstart", touchstart, false);
    MO_el.addEventListener("touchend"  , touchend  , false);

    window.addEventListener("orientationchange", orientationchange  , false);
}

// :!start explorer "http://davidwalsh.name/orientation-change"
function orientationchange() {
    if(!MO_el) return;

    setTimeout(updateOrientation, 200); // wait for new window geometry
}

function updateOrientation() {
    if(!MO_el) return;

    MO_cp = getPosition(MO_el);


    var MARGIN = 30;
    var x_max = screen.width  - MO_el.clientWidth  - MARGIN;
    var y_max = screen.height - MO_el.clientHeight - MARGIN;

/*
    alert(""
    +"screen.width =["+ screen.width  +"]\n"
    +"screen.height=["+ screen.height +"]\n"
    +"MO_el.style.left  =["+ MO_el.style.left   +"]\n"
    +"MO_el.style.top   =["+ MO_el.style.top    +"]\n"
    +"MO_el.clientWidth =["+ MO_el.clientWidth  +"]\n"
    +"MO_el.clientHeight=["+ MO_el.clientHeight +"]\n"
    +"MO_cp.x           =["+ MO_cp.x            +"]\n"
    +"MO_cp.y           =["+ MO_cp.y            +"]\n"
    +"      x_max       =["+       x_max        +"]\n"
    +"      y_max       =["+       y_max        +"]\n"
    )
*/

    if(MO_cp.x > x_max) MO_el.style.left = x_max+"px";
    if(MO_cp.y > y_max) MO_el.style.top  = y_max+"px";

}

// :!start explorer "http://www.javascriptkit.com/javatutors/touchevents.shtml"
function touchstart(e) {
    MO_cp = getPosition(MO_el);
    sx    = parseInt(e.changedTouches[0].clientX);
    sy    = parseInt(e.changedTouches[0].clientY);
    MO_el.addEventListener("touchmove" , touchmove , false);
    e.preventDefault();
}
function touchmove(e) {
    dx               = parseInt(e.changedTouches[0].clientX) - sx;
    dy               = parseInt(e.changedTouches[0].clientY) - sy;
    MO_el.style.left = (MO_cp.x + dx) +"px";
    MO_el.style.top  = (MO_cp.y + dy) +"px";
    e.preventDefault();
}
function touchend(e) {
    MO_el.removeEventListener("touchmove", touchmove, false);
    e.preventDefault();
}



function mouseDown(e) {
    MO_cp = getClickPosition(e);
    MO_el.style.position = "absolute";
    window.addEventListener("mousemove", divMove, true);
}
function mouseUp() {
    window.removeEventListener("mousemove", divMove, true);
}
function divMove(e) {
    MO_el.style.left     = e.clientX - MO_cp.x +"px";
    MO_el.style.top      = e.clientY - MO_cp.y +"px";
}

function getClickPosition(e) {
    var parentPosition = getPosition(e.currentTarget);
    var xPosition      = e.clientX - parentPosition.x;
    var yPosition      = e.clientY - parentPosition.y;
    return { x: xPosition, y: yPosition };
}

//}}}
