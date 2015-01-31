
function toggle_div(id) // {{{
{
    var  div = document.getElementById("div_"+id);
    if( !div ) return;
    div.className = (div.className == "expanded") ? "collapsed" : "expanded";

} // }}}

function swipe_img(dir) // {{{
{
    var from = (dir > 0) ? 1 : 8;
    var to   = (dir > 0) ? 9 : 0;
    var crnt = 0;

    for(var n= from; n != to; n += dir) {
	img  = document.getElementById("img"+n);
	if(img) {
	    if(crnt) {
		img = document.getElementById("img"+n);
		if(img) {
		    img.style.display = "block";    // show next
		crnt = n;
		}
		break;
	    }

	    if( img.style.display != "none") {	    // hide current
		img_next  = document.getElementById("img"+(n+dir));
		if(!img_next)			    // but keep last
		    break;
		img.style.display  = "none";
		crnt = n
	    }
	}
    }
    if(crnt) {
	var title, swpL, swpR, last;

	last = true;
	{   title = "";	img	    = document.getElementById("img"+(crnt-1)); if(img) title = img.title; last= false; }
	if(!title)  {	img	    = document.getElementById("img"+(crnt  )); if(img) title = img.title; last=  true; }
	swpL			    = document.getElementById("swpL");
	if(swpL)    {	swpL.title  = title; swpL.className = (last) ? "endL" : "swpL"; }

	last = true;
	{   title = "";	img	    = document.getElementById("img"+(crnt+1)); if(img) title = img.title; last= false; }
	if(!title)  {	img	    = document.getElementById("img"+(crnt  )); if(img) title = img.title; last=  true; }
	swpR			    = document.getElementById("swpR");
	if(swpR)    {	swpR.title  = title; swpR.className = (last) ? "endL" : "swpR"; }

    }

} // }}}

function keypress(e,el) // {{{
{
    var keycode = (e.keyCode) ? e.keyCode : e.which;
    var c       = String.fromCharCode(keycode);

    if(c == "a") swipe_img(-1);
    if(c == "d") swipe_img( 1);

} // }}}

