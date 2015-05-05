/* LOAD */
function onload_hash() // {{{
{
    if(readCookie("logging") == "logging")
	log_toggle();
    if(logging) log("logging set by cookie in onload_hash()");

    var id = window.location.hash.substring(1);
    if( id.startsWith("div_") ) id = id.substring(4);
    expand_div("", id);

    // initialize objects
    letter_browse(null);

} // }}}

/* EXPAND-COLLAPSE */
//{{{
var COOKIE_DAYS = 2;

function toggle_div(el,id) // {{{
{
    mcc_animate();
    set_wrap_div_top_visibility(id);

    var  div = document.getElementById("div_"+id);
    if( !div ) return;
    div.className = (div.className == "expanded") ? "collapsed" : "expanded";

    if(el) el.style.boxShadow = "rgba(  0, 0, 0, 0.3) 0px 0px 20px inset";

    if(div.className == "expanded") {
	cache_expanded(div);
	createCookie("expanded", id, COOKIE_DAYS);
    }
    else {
	// collapsing session fold
	var expanded_cookie = readCookie("expanded");
	if(expanded_cookie == id) {
	    eraseCookie("expanded");
	}
    }

} // }}}
function expand_div(el,id) // {{{
{
    mcc_animate();
    set_wrap_div_top_visibility(id);

    if((id=="top") || (id=="bot")) {
	eraseCookie("expanded");
	if(window.location != window.location.pathname)
	    window.location = window.location.pathname;
    }

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
    var parent_div = div;
    while(parent_div != null) {
	if(parent_div.className == "collapsed") {
	    parent_div.className = "expanded";
	    cache_expanded(parent_div);
	}
	parent_div = parent_div.parentNode;
    }

    if(el) el.style.boxShadow = "rgba(  0, 0, 0, 0.3) 0px 0px 20px inset";

    // scrollTo target div
    var wh = window.innerHeight;
    var div_pos = getPosition(div);
    log("\nexpand_div("+id+")\n"
    +".......wh=["+       wh+"]\n"
    +"div_pos.x=["+div_pos.x+"]\n"
    +"div_pos.y=["+div_pos.y+"]\n"
    );

    var x = 0;
    var y = div_pos.y - 32;
    log("...scrollTo("+x+","+y+")");
    window.scrollBy(x, y);

    // look for a focus target
    var focus_target = get_child_tagName(div, "INPUT");
    if(focus_target) {
	log("...focus_target=["+focus_target.id+"]");
	focus_target.focus();
    }

    return false; // don't follow expanding anchors
} // }}}
function set_wrap_div_top_visibility(id) // {{{
{
    // ignore missing targets
    if((id!="top") && (id!="bot")) {
	var div = document.getElementById("div_"+id);
	if(!div) return;
    }

    // hide top and bottom wrap_div when they are the one clicked
    // show them when some other are expanding something
    var top_and_bot_visibility = ((id=="top") || (id=="bot")) ? "hidden" : "visible";

    var wrap_div_top = document.getElementById("wrap_div_top");
    if(wrap_div_top) wrap_div_top.style.visibility = top_and_bot_visibility;

    var wrap_div_bot = document.getElementById("wrap_div_bot");
    if(wrap_div_bot) wrap_div_bot.style.visibility = top_and_bot_visibility;
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
//}}}

/* ELEMENTS */
//{{{

function get_child_tagName(parent, tagName) // {{{
{
    if(! parent.children) return null;

    var child = null;
    for(var i= 0; i < parent.children.length; ++i) {
	if(parent.children[i].tagName == tagName)
	    child = parent.children[i];
	else
	    child = get_child_tagName(parent.children[i], tagName);
	if(child)
	    return child;
    }
    return null;
}
// }}}
function get_child_id(parent, id) //{{{
{
    for(var i= 0; i < parent.children.length-1; ++i) {
	var child = parent.children[i];
	if(child.id == id) {
//log("get_child_id("+parent.id+", "+id+") return ["+child.id+"]");
	    return child;
	}
    }
//log("get_child_id("+parent.id+", "+id+") return null");
    return null;
}
//}}}
function get_next_child_tagName(parent, current, tagName) // {{{
{
    if(!current) return get_child_tagName(parent, tagName);

    parent = current.parentElement;
    if(!parent.children) return null;

    var past_current = false;
    for(var i= 0; i < parent.children.length; ++i) {
	var child = parent.children[i];
	if(!past_current) {
	    if(child == current)	    past_current = true;    // look for current child
	} else {
	    if(child.tagName != tagName)    continue;		    // with same tagName
	    else			    return child;	    // return next sibling
	}
    }

    return null;
}
// }}}
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

//}}}

/* LETTERS BROWSER */
//{{{
// letter_browse_data {{{
var letter_browse_options  = "s";   // sequences
var letter_browse_selected = "";
var letter_browse_data = ""
+"<EM>th</EM>  ha     <EM>the</EM>  pro     tion  ance     ation  ments\n"
+"<EM>he</EM>  as     <EM>and</EM>  thi     atio  were     tions  rough\n"
+"<EM>in</EM>  ou     <EM>ing</EM>  wit     that  tive     which  ative\n"
+"<EM>er</EM>  io     ion  <EM CLASS='NB'>are</EM>     ther  over     ction  prese\n"
+"<EM>an</EM>  le     tio  ess     with  ding     other  feren\n"
+"re  ve     ent  not     ment  pres     their  hough\n"
+"<EM>on</EM>  co     <EM CLASS='NB'>ati</EM>  ive     ions  nter     there  ution\n"
+"<EM>at</EM>  me     for  was     this  comp     ition  roduc\n"
+"<EM>en</EM>  de     <EM CLASS='NB'>her</EM>  ect     here  able     ement  resen\n"
+"<EM>nd</EM>  <EM>hi</EM>     ter  rea     from  heir     inter  thoug\n"
+"ti  <EM>ri</EM>     hat  com     ould  thei     ional  press\n"
+"<EM>es</EM>  ro     tha  eve     ting  ally     ratio  first\n"
+"<EM>or</EM>  ic     ere  per     hich  ated     would  after\n"
+"<EM>te</EM>  ne     <EM CLASS='NB'>ate</EM>  int     whic  ring     tiona  cause\n"
+"<EM>of</EM>  <EM>ea</EM>     his  <EM CLASS='NB'>est</EM>     ctio  ture     these  where\n"
+"ed  ra     con  sta     ence  cont     state  tatio\n"
+"<EM>is</EM>  ce     <EM CLASS='NB'>res</EM>  cti     have  ents     natio  could\n"
+"<EM>it</EM>  li     ver  ica     othe  cons     thing  efore\n"
+"al  ch     all  <EM CLASS='NB'>ist</EM>     ight  rati     under  contr\n"
+"<EM>ar</EM>  ll     <EM CLASS='NB'>ons</EM>  ear     sion  thin     ssion  hould\n"
+"<EM>st</EM>  be     nce  <EM>ain</EM>     ever  part     ectio  shoul\n"
+"<EM>to</EM>  ma     men  one     ical  form     catio  tical\n"
+"nt  si     <EM CLASS='NB'>ith</EM>  our     they  ning     latio  gener\n"
+"ng  om     ted  iti     inte  ecti     about  esent\n"
+"se  ur     ers  rat     ough  some     count  great\n"
;

//}}}
function letter_browse_focus_dispatch(e,el) { //{{{
//log("letter_browse_focus_dispatch():");

    fold_stopEventPropagation(e, el);

    // clear
    var charCode = (e.keyCode) ? e.keyCode : e.which;
    if( charCode == 27) { letter_browse(null); return; } // escape
    if( charCode == 32) { letter_browse(null); return; } // space

    // options
    if( charCode ==  9)                    { letter_nxtopt();              return; } // tab
    if((charCode > 48) && (charCode < 58)) { letter_numopt(charCode - 48); return; } // digit

    // key
    var l = String.fromCharCode(charCode).toLowerCase();

    // identify button f(key)
    var div_letter_browser = document.getElementById("div_letter_browser");
    if(!div_letter_browser) return;

    // clear unhandled
    var err_letter_browser = document.getElementById("err_letter_browser");
    if( err_letter_browser )	err_letter_browser.innerHTML = "";

    var div = null; // pick first sub div
    do {
	div = get_next_child_tagName(div_letter_browser, div, "DIV");
	if(!div) break;

	var em = null; // pick first em
	do {
	    em = get_next_child_tagName(div, em, "EM");
	    if(!em) break;
	    if(em.innerHTML == l) {
		letter_browse(em);  // toggle button
		return;		    // done
	    }
	} while(em);

    } while(div);

    log("letter_browse_focus_dispatch():\n...["+l+"] symbol not handled");

    // show unhandled
    if( err_letter_browser )	err_letter_browser.innerHTML = l;

} // }}}
function letter_nxtopt() { //{{{
log("letter_nxtopt():");

    // identify next radio f(currently checked) {{{
    var div_letter_browser = document.getElementById("div_letter_browser");
    if(!div_letter_browser) return;

    var radio_first = null;
    var radio_next  = null;
    var radio       = null; // pick first sub input
    do {
	// look for next radio
	radio = get_next_child_tagName(div_letter_browser, radio, "INPUT");
	if(!radio) break;
	log("...["+radio.id+"].type=["+radio.type+"]");
	if(radio.type != "radio") continue;

	// first as default
	if(!radio_first) radio_first = radio;

	// pick next unchecked
	log("...["+radio.id+"].checked=["+radio.checked+"]");
	if(radio.checked) {
	    radio_next = get_next_child_tagName(div_letter_browser, radio, "INPUT");
	    if(radio_next) {
		if(radio_next.type != "radio") radio_next = null;
	    }
	}

    } while(radio && !radio_next);

    // defaut to first
    if(!radio_next)
	radio_next = radio_first;

    //}}}

    // check next
    if(radio_next) {
	radio_next.checked = true;
	log("===["+radio_next.id+"].checked=["+radio_next.checked+"]");
    }

    // check next
    if(radio_next) letter_browse(radio_next);

} // }}}
function letter_numopt(numopt) { //{{{
log("letter_numopt("+numopt+"):");

    // identify next radio f(currently checked) {{{
    var div_letter_browser = document.getElementById("div_letter_browser");
    if(!div_letter_browser) return;

    var radio_num   = 0;
    var radio_first = null;
    var radio_next  = null;
    var radio       = null; // pick first sub input
    do {
	// look for next radio
	radio = get_next_child_tagName(div_letter_browser, radio, "INPUT");
	if(!radio) break;
	log("...["+radio.id+"].type=["+radio.type+"]");
	if(radio.type != "radio") continue;

	// first as default
	if(!radio_first) radio_first = radio;

	// pick numopt
	if(++radio_num == numopt)
	    radio_next = radio;

    } while(radio && !radio_next);

    // defaut to first
    if(!radio_next)
	radio_next = radio_first;

    //}}}

    // check next
    if(radio_next) {
	radio_next.checked = true;
	log("===["+radio_next.id+"].checked=["+radio_next.checked+"]");
    }

    // check next
    if(radio_next) letter_browse(radio_next);

} // }}}
function letter_browse(input_el) //{{{
{
    // focus in first browser button
    var el = document.getElementById("lb_cmd_reset");
    if(el) el.focus();

    // commands / options {{{
    if(!input_el) {
	letter_browse_reset();

    }
    else if((input_el.tagName == "INPUT")) {
	log("letter_browse("+input_el.id+"):");
	// reset selection
	if(input_el.name == "reset") {
	    letter_browse_reset();
	}
	else {
	    letter_browse_options = input_el.value;
	    var o = input_el.value;
	}
    } //}}}
    // letters {{{
    else {
	var l = input_el.innerHTML;
	log("letter_browse("+l+"):");
	if(!l) return;

	// toggle letter selection
	var l_is_selected = (letter_browse_selected.indexOf(l) >= 0);
	if(l_is_selected)    letter_browse_selected = letter_browse_selected.replace(l,"");
	else		     letter_browse_selected = letter_browse_selected + l;

	// toggle input_el state
	if(l_is_selected)   del_className(input_el,"letter_browser_on");
	else		    add_className(input_el,"letter_browser_on");
    } //}}}
    // nothing selected {{{
    var pre_letter_browser = document.getElementById("pre_letter_browser");
    if(!pre_letter_browser) return;

    if(letter_browse_selected == "") {
	if(input_el) log("letter_browse(): nothing selected");
	pre_letter_browser.innerHTML = ""
	+ "<em id='regex' style='float:left; font-size:150%;'>&nbsp;</em>"
	+ "<br style='clear:both;'>"
	+ letter_browse_data
	return;
    }
    //}}}
    // regex for selected letters {{{
    var pattern	    = letter_browse_selected;	// take the whole set
    if(letter_browse_options.indexOf("s") < 0)	// ...sequence
    {
	pattern	    = pattern.replace(/(.)/g,"$1|");
	pattern	    = pattern.substring(0,pattern.length-1);
    }
    var highlight   = '<SPAN>$1</SPAN>';	// (uppercase matters!)

    if(letter_browse_options.indexOf("g") >= 0)	// ...as word
    {
	pattern	    = "("+pattern+")";
	var p	    = pattern;
	for(var i=1; i<letter_browse_selected.length; ++i)
	    pattern += p;
    }
    pattern = "("+pattern+")";

    //}}}
    // highlight selected letters {{{

    var re = new RegExp(pattern, "gm");
    pre_letter_browser.innerHTML    = ""
	+ "<em id='regex' style='float:left; font-size:150%;'>"+pattern.substring(1,pattern.length-1)+"</em>"
	+ "<br style='clear:both;'>"
	+ letter_browse_data.replace(re, highlight)
	;

    //}}}
} //}}}
function letter_browse_reset()// {{{
{
log("letter_browse_reset():");

    letter_browse_selected = "";

    var div_letter_browser = document.getElementById("div_letter_browser");
    if(!div_letter_browser) return;

    var div = null; // pick first sub div
    do {
	div = get_next_child_tagName(div_letter_browser, div, "DIV");
	if(!div) break;

	var em = null; // pick first em
	do {
	    em = get_next_child_tagName(div, em, "EM");
	    if(em)   del_className(em,"letter_browser_on");
	} while(em);

    } while(div);

    // clear unhandled
    var err_letter_browser = document.getElementById("err_letter_browser");
    if( err_letter_browser )	err_letter_browser.innerHTML = "";

} // }}}
//}}}

/* ANIMATION */
//{{{
var MCC_ANIMATE_LETTER_TIMOUT	= 500;

var mcc_animate_div	    = null;
var mcc_animate_timeOut	    = null;
var mcc_animate_letters	    = null;
var mcc_animate_ratio	    = null;
var mcc_animate_word_num    = 0;
var mcc_animate_words	    = null;

function mcc_animate(id) // {{{
{
//log("\nmcc_animate(["+id+"])");

    // stop
    if(mcc_animate_div) {
	var same_div = (id == mcc_animate_div.id);
	if(mcc_animate_div)  mcc_animate_stop();
	if(same_div)		return;
    }

    if(!id)			return;

    mcc_animate_div		= document.getElementById(id);
    if(!mcc_animate_div)	return;

    // start
    mcc_animate_start();

}
// }}}
function mcc_animate_start()// {{{
{
log("\nmcc_animate_start() ["+mcc_animate_div.id+"]");

    var data_mcc = mcc_animate_div.getAttribute("data-mcc");
    if(data_mcc) {
	mcc_animate_words = data_mcc.split(" ");
log("   "+mcc_animate_words.length+" words ["+data_mcc+"]");
    }

    mcc_animate_word_num = 0;
    mcc_animate_display_word();

}
// }}}
function mcc_animate_stop()// {{{
{
log("mcc_animate_stop() ["+mcc_animate_div.id+"]\n");

    // no active animation
    if(!mcc_animate_div) return;

    // stop animation
    if(mcc_animate_timeOut) { clearTimeout(mcc_animate_timeOut); mcc_animate_timeOut = null; }

    // hide animatoin overlay elements
    mcc_animate_reset();

    // undisplay magnified animation
    mcc_animate_div.style.transform = "scale(1,1)";
    del_className(mcc_animate_div,"magnified");

    mcc_animate_div     = null;
    mcc_animate_ratio   = null;
    mcc_animate_words	= null;

} // }}}

function mcc_animate_display_word()// {{{
{
    if(!mcc_animate_words) return;
    var word = trim(mcc_animate_words[mcc_animate_word_num]);
    if(!word) return;
    log("   .mcc_animate_display_word("+mcc_animate_word_num+"): ["+mcc_animate_words[mcc_animate_word_num]+"]");

    // animate first letter
    mcc_animate_letters = "";
    for(var i=0; i<word.length; ++i) {
	mcc_animate_letters += word[i];
    }
    if(mcc_animate_letters) {
//	var timeout = (mcc_animate_word_num == 0) ? MCC_ANIMATE_LETTER_TIMOUT : 2 * MCC_ANIMATE_LETTER_TIMOUT;
	mcc_animate_timeOut = setTimeout(mcc_animate_letter_CB, 2 * MCC_ANIMATE_LETTER_TIMOUT);
    }

} // }}}
function mcc_animate_letter_CB()// {{{
{

    // magnify
    if(!mcc_animate_ratio) mcc_animate_magnify();   // thread shared volatile
    if(!mcc_animate_div) return;

    // next letter
    if(mcc_animate_letters) {

	// hide previous word overlay elements f(first word letter)
	if(mcc_animate_letters.length == mcc_animate_words[mcc_animate_word_num].length) {
	    mcc_animate_reset();
	    var el = document.getElementById(mcc_animate_div.id+"_caption");
	    if(el)
		el.innerHTML = mcc_animate_words[mcc_animate_word_num];
	}

	// first word letter
	var letter = mcc_animate_letters.substring(0,1);

	// remainding letters
	mcc_animate_letters = mcc_animate_letters.substring(1);
	log("   ..mcc_animate_letter_CB("+letter+"):");

	// highlight letter overlay
	var     el = get_child_id(mcc_animate_div, "mcc_"+letter);
	if(!el) el = get_child_id(mcc_animate_div, "mcc_"+mcc_animate_words[mcc_animate_word_num]);
	if(el) add_className(el,"mcc_overlay_on");

	// delay next letter
	mcc_animate_timeOut = setTimeout(mcc_animate_letter_CB, MCC_ANIMATE_LETTER_TIMOUT);
    }
    // next word
    else if(mcc_animate_words) {
	mcc_animate_word_num = (mcc_animate_word_num+1) % mcc_animate_words.length;
	mcc_animate_display_word();
    }

} // }}}

function mcc_animate_reset()// {{{
{
//log("   ..mcc_animate_reset():");
    // hide overlay elements
    if(!mcc_animate_div) return;

    var el = null; // pick first
    do {
	el = get_next_child_tagName(mcc_animate_div, el, "DIV");
	if(el) del_className(el,"mcc_overlay_on");
    } while(el);

} // }}}
function mcc_animate_magnify()// {{{
{
log("***mcc_animate_magnify");
    if(!mcc_animate_div) return;
    var body = document.getElementById("body");
    mcc_animate_ratio = 0.5 * body.clientWidth / mcc_animate_div.clientWidth;
    mcc_animate_div.style.transform = "scale("+mcc_animate_ratio+","+mcc_animate_ratio+")";
    add_className(mcc_animate_div,"magnified");
log("***...body.clientWidth=["+body.clientWidth+"]");

} // }}}

//}}}

// CLASS
//{{{

function has_className(el, className)
{
//alert("has_className("+el.id+", "+className+"): return "+(el.className.indexOf(className) >= 0));
    return (el.className.indexOf(className) >= 0);
}

function add_className(el, className)
{
    del_className(   el,className);
    el.className += " "+className ;
}

function del_className(el, className)
{
    el.className =      el.className.replace(className,"");
    el.className = trim(el.className);
}

//}}}

// STRING
//{{{

function trim(string)
{
    return string.replace(/(^\s*)|(\s*$)/g,'');
}

//}}}

/* MOUSE */
//{{{
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
    function fold_stopEventPropagation(e, el) { //{{{
	if(!e) e = window.event;
	if(e.preventDefault ) e.preventDefault();
	if(e.stopPropagation) e.stopPropagation();
	else                  e.cancelBubble = true;
    } // }}}
//}}}

/* KEYBOARD */
//{{{
var mcc_key_el	    = null;
var mcc_key_el_hist = null;
var mcc_key_timeout = null;
var mcc_prev_time   = 0;
var mcc_this_time   = 0;
var mcc_key_delay   = 0;
function mcc_key(e, el) { //{{{

    // clear (by user)
    var charCode = (e.keyCode) ? e.keyCode : e.which;
    if(charCode == 27) { mcc_key_set_delay(el, mcc_key_delay); return; }

    // timer
    mcc_this_time = new Date().getTime();

    // key
    value = fold_keydown(e, el);

    // retrigger clear timeout
    if(mcc_key_timeout) clearTimeout(mcc_key_timeout);
    mcc_key_el = el;
    if(mcc_key_delay)
	mcc_key_timeout = setTimeout(mcc_key_clear_CB, mcc_key_delay);

    // display timings + key
    if(!mcc_key_el_hist) mcc_key_el_hist = document.getElementById("mcc_key_input_hist");
    if( mcc_key_el_hist) {
	var char_html = "<em class='mcc_hist_char'>"+value+"</em>";
	if(!mcc_prev_time) {
	    mcc_key_el_hist.innerHTML  = char_html;
	}
	else {
	    time_class                    = "mcc_hist_time";

	    var ms        = (mcc_this_time - mcc_prev_time);
	    if     (ms <  50)	time_class= "cc1";
	    else if(ms <  75)	time_class= "cc2";
	    else if(ms < 100)	time_class= "cc3";
	    else if(ms < 125)	time_class= "cc4";
	    else if(ms < 150)	time_class= "cc5";
	    else if(ms < 200)	time_class= "cc6";
	    else if(ms < 250)	time_class= "cc7";
	    else if(ms < 300)	time_class= "cc7";
	    else		time_class= "oo";

	    if(ms > 1000) mcc_key_el.value = "";

	    var time_html = (ms > 1000)
		? "<br>"
		: "<span class='"+time_class+"'>"+ms+"ms</span>";

	    mcc_key_el_hist.innerHTML += " "+time_html+" "+char_html;
	}
    }

    // wait for next input
    mcc_prev_time = mcc_this_time;

} // }}}
function mcc_key_clear_CB() { //{{{
    if(mcc_key_el) mcc_key_el.value = "";
    mcc_prev_time = 0;
} //}}}
//function mcc_key_clear() { //{{{
//    if(mcc_key_el     ) mcc_key_el.value          = "";
//    if(mcc_key_el_hist) mcc_key_el_hist.innerHTML = "";
//    mcc_prev_time = 0;
//} //}}}
function mcc_key_set_delay(el, ms) { //{{{
    mcc_key_delay = ms;
    if(mcc_key_el     ) mcc_key_el.value          = "";
    if(mcc_key_el_hist) mcc_key_el_hist.innerHTML = "";
    mcc_prev_time = 0;

    var button = null; // pick first delay-button
    do {
	button = get_next_child_tagName(el.parentElement, button, "INPUT");
	if(!button) break;
	if(button.type == "button") {
	    if(button == el)	button.style.border= "1px red dotted";
	    else		button.style.border= "0";
	}
    } while(button);

    // mcc_key_el and mcc_key_el_hist
    if(mcc_key_el_hist) mcc_key_el_hist.innerHTML = "<i>Escape to clear</i>";

    // focus in text input field
    if(!mcc_key_el) mcc_key_el = document.getElementById("mcc_key_input");
    if( mcc_key_el) mcc_key_el.focus();

} //}}}
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
    // KEY-VALUE {{{
    if(v==" ") v = "<SPACE>";
    v = v.replace(/&/g,"&amp;"); // ...must be first!
    v = v.replace(/</g, "&lt;");
    v = v.replace(/>/g, "&gt;");

    //}}}
    // TRANSCRIPT {{{
    if(transcript) {
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

	    +"<tr><td id='browser_info' colspan=4 style='border:0 !important; color:#888; font-size:80%;'></td></tr>"
	    +"</table>" 
	    +"</div>" 
	    ;

	    log_screen_info();
	//}}}
    }
    //}}}
    return v;
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
//}}}

/* LAYOUT */
//{{{
var IMG_MAX = 8;
var switch_layout_num = 0;
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
    var charCode = (e.keyCode) ? e.keyCode : e.which;
    var c       = String.fromCharCode(charCode);

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
function switch_layout() // {{{
{
    // get current image
    var crnt = get_current_img();

    if(switch_layout_num == 0)
	switch_layout_num = crnt;

    if(crnt != switch_layout_num) {
	show_img( switch_layout_num );
	switch_layout_num = crnt;
    }

    var el = document.getElementById("span_switch_layout_num");
    if(el) el.innerHTML = switch_layout_num;

} // }}}

//}}}

/* LOG */
//{{{
var logging = false;
function log(msg)
{
    var el = document.getElementById("pre_log");
    if(!el) return;
    if(logging) {
	el.style.visibility = "visible";
	if(!msg)
	    el.innerHTML    = "LOG";
	else {
	    msg = msg.replace(/&/g,"&amp;"); // ...must be first!
	    msg = msg.replace(/</g, "&lt;");
	    msg = msg.replace(/>/g, "&gt;");
	    msg = msg.replace(/\[/g, "<em>");
	    msg = msg.replace(/\]/g, "</em>");
	    el.innerHTML    = (el.innerHTML) ? el.innerHTML+"\n"+msg : msg;
	}
    } else {
	el.style.visibility = "hidden";
    }
}

function log_toggle()
{
    logging = logging ? false : true; log();
    var value = logging ? "logging" : "not logging";
    createCookie("logging", value, COOKIE_DAYS);

    var el = document.getElementById("log_toggle_el_id");
    if(el) el.style.backgroundColor = logging ? "red" : "initial";
}

//}}}

/* COOKIES */
//{{{
function createCookie(cName, value, days)
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

function readCookie(cName)
{
    //alert("readCookie("+cName+")");
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
    //if(value) alert("readCookie("+cName+") return ["+value+"]");
    return value;
}

function eraseCookie(cName)
{
//alert("eraseCookie("+cName+")");
    createCookie(cName, "", -1);

}

//}}}

/* EVENTS */
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

function addListeners() //{{{
{
    window.addEventListener("orientationchange", orientationchange  , false);
    window.addEventListener("resize"           , windowsizechange   , false);

    MO_el = document.getElementById(MO_id); if(!MO_el) return;

    MO_el .addEventListener("mousedown", mouseDown , false);
    window.addEventListener("mouseup"  , mouseUp   , false);

    MO_el.addEventListener("touchstart", touchstart, false);
    MO_el.addEventListener("touchend"  , touchend  , false);

} //}}}

function orientationchange() //{{{
{
log("orientationchange:");
    setTimeout(updateWindowGeometry, 200); // wait for new window geometry

} //}}}
function windowsizechange() //{{{
{
log("windowsizechange:");
    setTimeout(updateWindowGeometry, 200); // wait for new window geometry

} //}}}
function updateWindowGeometry() //{{{
{
log("updateWindowGeometry:");
    // sync animation
    mcc_animate_ratio = null;

    if(!MO_el) return;

    MO_cp = getPosition(MO_el);

    var MARGIN = 30;
    var x_max = screen.width  - MO_el.clientWidth  - MARGIN;
    var y_max = screen.height - MO_el.clientHeight - MARGIN;

    if(MO_cp.x > x_max) MO_el.style.left = x_max+"px";
    if(MO_cp.y > y_max) MO_el.style.top  = y_max+"px";

} //}}}

function touchstart(e) //{{{
{
    if(!MO_el) return;

    MO_cp = getPosition(MO_el);
    sx    = parseInt(e.changedTouches[0].clientX);
    sy    = parseInt(e.changedTouches[0].clientY);
    MO_el.addEventListener("touchmove" , touchmove , false);
    e.preventDefault();
} //}}}
function touchmove(e) //{{{
{
    if(!MO_el) return;

    dx               = parseInt(e.changedTouches[0].clientX) - sx;
    dy               = parseInt(e.changedTouches[0].clientY) - sy;
    var x = (MO_cp.x + dx);
    var y = (MO_cp.y + dy);
    MO_el.style.left = x +"px";
    MO_el.style.top  = y +"px";
    e.preventDefault();

    log_screen_info();
} //}}}
function touchend(e) //{{{
{
    if(!MO_el) return;

    MO_el.removeEventListener("touchmove", touchmove, false);
    e.preventDefault();

} //}}}

function mouseDown(e) //{{{
{
    if(!MO_el) return;

    MO_cp = getClickPosition(e);
    MO_el.style.position = "absolute";
    window.addEventListener("mousemove", divMove, true);
} //}}}
function mouseUp() //{{{
{
    window.removeEventListener("mousemove", divMove, true);
} //}}}
function divMove(e) //{{{
{
    if(!MO_el) return;

    var x = e.clientX - MO_cp.x ;
    var y = e.clientY - MO_cp.y ;
    MO_el.style.left  = x+"px";
    MO_el.style.top   = y+"px";

    log_screen_info();
} //}}}

function getClickPosition(e) //{{{
{
    var parentPosition = getPosition(e.currentTarget);
    var xPosition      = e.clientX - parentPosition.x;
    var yPosition      = e.clientY - parentPosition.y;
    return { x: xPosition, y: yPosition };
} //}}}
function log_screen_info() //{{{
{
    var el = document.getElementById("browser_info");
    if(el) {

	var ti = (MO_el) ?  MO_el.style.left +" "+ MO_el.style.top : "";

	var be = document.getElementById("body");
	var bi = be.clientWidth+"x"+body.clientHeight;

	var si = screen.width+"x"+screen.height;
	var color    = (screen.width > screen.height) ? "#002" : "#020";

	el.innerHTML = "<div style='padding:1px; background-color:"+color+";'>"+ti+" &nbsp; "+bi+" &nbsp; "+si+"</div>";
    }
} //}}}

//}}}
