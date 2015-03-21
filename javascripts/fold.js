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

    var el = document.getElementById("span_compare_target_num");
    if(el) el.innerHTML = compare_target_num;

    if(crnt != compare_target_num) {
	show_img( compare_target_num );
	compare_target_num = crnt;
    }

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
//alert("fold_onclick(num=["+num+"], url=["+url+"]")
      for(var n=1; n<=8; ++n) {

       if(n != num) continue; // leave others alone

       var fold_div   = document.getElementById("fold_div"+n);
       var fold_pane  = document.getElementById("fold_pane"+n);
       var transcript = document.getElementById("transcript"+n);
       if(!fold_div || !fold_pane)
	continue;

       if(n == num) {
	   show_hide = (fold_pane.className != "fold_show");
       }
       else {
	    continue;
	   //show_hide = false;
       }

       if( show_hide ) {
	if(url.indexOf("http") == 0)
	 if(fold_pane.src != url) fold_pane.src = url;
       }

       fold_div.className		= (show_hide) ? "fold_show" : "fold_dim";
       fold_pane.className		= (show_hide) ? "fold_show" : "fold_hide";
       if(transcript)
	   transcript.style.visibility	= (show_hide) ? "visible"   : "hidden";

       if(show_hide) fold_pane1.focus();

//alert("fold_pane.className=["+fold_pane.className+"]")
      }
     } // }}}
    function fold_stopEventPropagation(e, el) { //{{{
	if(!e) e = window.event;
	if(e.preventDefault ) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();
	else                  e.cancelBubble = true;
    } // }}}
function getClickPosition(e) { //{{{
    var parentPosition = getPosition(e.currentTarget);
    var xPosition      = e.clientX - parentPosition.x;
    var yPosition      = e.clientY - parentPosition.y;
    return { x: xPosition, y: yPosition };
} //}}}
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

/* KEYBOARD */
    function fold_keydown(e, el) { //{{{

// :!start explorer "http://www.cambiaresearch.com/articles/15/javascript-char-codes-key-codes"

	var el_id = ""; try { el_id = el.id } catch(ex) {}
	//alert("el_id=["+el_id+"]")

	if(e.preventDefault ) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();
	//if(e.defaultPrevented) return; // Should do nothing if the key event was already consumed.

	if(e.repeat) return;

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
	else if(charCode ==  32) value = " "              ;
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
	else                   value = String.fromCharCode(charCode);

	var is_a_char = (value.length == 1) && (value != " ");

	// SHIFT {{{
	var shifted_value =  "";

	if(e.shiftKey && !e.ctrlKey) {

	    if     (value == "-") shifted_value = "_";

	    else if(value == "1") shifted_value = "!";
	    else if(value == "2") shifted_value = "@";
	    else if(value == "3") shifted_value = "#";
	    else if(value == "4") shifted_value = "$";
	    else if(value == "5") shifted_value = "%";

	    else if(value == "`") shifted_value = "~";

	    else if(value == "6") shifted_value = "^";
	    else if(value == "7") shifted_value = "&";
	    else if(value == "8") shifted_value = "*";
	    else if(value == "9") shifted_value = "(";
	    else if(value == "0") shifted_value = ")";

	    else if(value == "=") shifted_value = "+";

	    else if(value == "[") shifted_value = "{";
	    else if(value == "]") shifted_value = "}";

	    else if(value == ";") shifted_value = ":";
	    else if(value == ",") shifted_value = "<";
	    else if(value == ".") shifted_value = ">";
	    else if(value == "'") shifted_value = '"';

	    else if(value =="\\") shifted_value = "|";
	    else if(value == "/") shifted_value = "?";

	    if(shifted_value != "") {
		value     = shifted_value;
		is_a_char = false;
	    }
	}
	else {
	    if(is_a_char) value = value.toLowerCase();
	}

	//}}}
	// Prefix [+^!#] {{{
	var is_a_ctrl = (value=="<CTRL>") || (value=="<SHIFT>") || (value=="<ALT>") || (value=="<META>");
	if( !is_a_ctrl ) {
	    var mod = "";

	    if(e.metaKey ) mod = mod+"M-";
	    if(e.altKey  ) mod = mod+"A-";
	    if(e.ctrlKey ) mod = mod+"C-";
	    if(e.shiftKey && (shifted_value==""))
		mod = mod+"S-";

	    if(mod != "") {
		if(value.charAt(0) == '<')
		    value =  value.substring(1, value.length-1);
		value = "<"+mod+value.toUpperCase()+">";
	    }
	}

	//}}}
	// transcript {{{
	var transcript = document.getElementById("transcript1");
	if(transcript)

	    var a = e.altKey   ? "X" : "-";
	    var s = e.shiftKey ? "X" : "-";
	    var c = e.ctrlKey  ? "X" : "-";
	    var m = e.metaKey  ? "X" : "-";

	    var v = value;
	    if(v==" ") v = "SPACE";
	    v = v.replace(/&/g,"&amp;"); // ...must be first!
	    v = v.replace(/</g, "&lt;");
	    v = v.replace(/>/g, "&gt;");

	    transcript.innerHTML    = ""
		+"<div>"
		+ "<table>"

		+"<tr><th>     ALT            </th><th>     SHIFT       </th><th>     CTRL      </th><th>     META       </th></tr>"
		+"<tr><td>"+   a            +"</td><td>"+   s         +"</td><td>"+   c       +"</td><td>"+   m        +"</td></tr>"

		+"<tr><th>     keyIdentifier  </th><th>     which       </th><th>     keyCode   </th><th>     charCode   </th></tr>"
		+"<tr><td>"+ e.keyIdentifier+"</tn><td>"+ e.which     +"</td><td>"+ e.keyCode +"</td><td>"+   charCode +"</td></tr>"

		+"<tr><th>     value          </th><th>     is_a_char   </th><th>     repeat    </th>                         </tr>"
		+"<tr><td class='vtd'>"+ v  +"</td><td>"+   is_a_char +"</td><td>"+ e.repeat  +"</td>                         </tr>"

		+"</table>" 
		+"</div>" 
		;

//		+"               key=["+ e.key              +"]\n"
//		+"              code=["+ e.code	            +"]\n"
//		+"       isComposing=["+ e.isComposing      +"]\n"
//		+"  defaultPrevented=["+ e.defaultPrevented +"]\n"

	//}}}
	// COMMAND / APPEND {{{
	if(     value == "<ESCAPE>") {
	    el.value = "";
	    //if(transcript) transcript.innerHTML = ""
	}
	else if(value == "<BS>"    ) {
	    if(el.value.substring(el.value.length-1, el.value.length) == ">")
		el.value = el.value.substring(0, el.value.lastIndexOf("<"));
	    else
		el.value = el.value.substring(0, el.value.length-1);
	    //if(transcript) transcript.innerHTML = ""
	}
	else if((charCode !=   16)   // Shift
	    &&  (charCode !=   17)   // Ctrl
	    &&  (charCode !=   18)   // Alt
	    )
	{
	    if(el.value.length > 60) el.value = "";

	    el.value += value;
	}
	//}}}
    } // }}}

/* MOVE */
//{{{
var MO_el=null;
var MO_id="transcript1";
var MO_cp;

window.onload = addListeners;

function addListeners() {
    MO_el = document.getElementById(MO_id);

    MO_el .addEventListener('mousedown', mouseDown, false);
    window.addEventListener('mouseup'  , mouseUp  , false);
}

function mouseUp() {
    window.removeEventListener('mousemove', divMove, true);
}

function mouseDown(e) {
    MO_cp = getClickPosition(e);

    MO_el.style.position = 'absolute';

    window.addEventListener('mousemove', divMove, true);
}

function divMove(e){
    MO_el.style.left     = e.clientX - MO_cp.x +'px';
    MO_el.style.top      = e.clientY - MO_cp.y +'px';
}

//}}}

