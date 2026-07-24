/* TRANSCRIPT EVENTS */
//{{{
var TX_id="transcript2";
var TX_el=null;
var TX_xy;

var dx = 0;
var dy = 0;
var sx = 0;
var sy = 0;

/* window.onload = addListeners; */ /* set at BODY HTML ELEMENT level instead */
//}}}

function addListeners() //{{{
{
    window.addEventListener("orientationchange", orientationchange, false);
    window.addEventListener("resize"           , windowsizechange , false);
    window.addEventListener("mouseup"          , mouseUp          , false);

    TX_el = document.getElementById(TX_id); if(!TX_el) return;
    TX_el.addEventListener("mousedown" , mouseDown , false);
    TX_el.addEventListener("touchstart", touchstart, false);
    TX_el.addEventListener("touchend"  , touchend  , false);

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

    if(!TX_el) return;

    var MARGIN = 30;
    var x_max = screen.width  - TX_el.clientWidth  - MARGIN;
    var y_max = screen.height - TX_el.clientHeight - MARGIN;

    /* confine TX_el to screen area */
    TX_xy = getPosition(TX_el);

    if(TX_xy.x > x_max) TX_el.style.left = x_max+"px";
    if(TX_xy.y > y_max) TX_el.style.top  = y_max+"px";

} //}}}


function mouseDown(e) //{{{
{
    log_msg("mouseDown");
    if(!TX_el) return;

    TX_xy = get_targetXY_to_mouseXY(e);
    TX_el.style.position = "absolute";

    window.addEventListener("mousemove", divMove, true);
    e.preventDefault();
} //}}}
function touchstart(e) //{{{
{
    log_msg("touchstart");
    if(!TX_el) return;

    TX_xy = getPosition(TX_el);                     /* XY MObject ACTION_DOWN */
    sx    = parseInt(e.changedTouches[0].clientX);  /* X  MOUSE   ACTION_DOWN */
    sy    = parseInt(e.changedTouches[0].clientY);  /* Y  MOUSE   ACTION_DOWN */

    TX_el.addEventListener("touchmove" , touchmove , false);
    e.preventDefault();
} //}}}

function divMove(e) //{{{
{
//  log_msg("mouseMove");
    if(!TX_el) return;

    var x = e.clientX - TX_xy.x ;
    var y = e.clientY - TX_xy.y ;
    TX_el.style.left  = x+"px";
    TX_el.style.top   = y+"px";

    e.preventDefault();
    log_screen_info("divMove");
} //}}}
function touchmove(e) //{{{
{
    log_msg("touchmove");
    if(!TX_el) return;

    dx               = parseInt(e.changedTouches[0].clientX) - sx;  /* SINCE ACTION_DOWN DX   */
    dy               = parseInt(e.changedTouches[0].clientY) - sy;  /* SINCE ACTION_DOWN DY   */
    var x = (TX_xy.x + dx);                                         /* SINCE ACTION_DOWN LEFT */
    var y = (TX_xy.y + dy);                                         /* SINCE ACTION_DOWN TOP  */
    TX_el.style.left = x +"px";
    TX_el.style.top  = y +"px";

    e.preventDefault();
    log_screen_info("touchmove");
} //}}}

function mouseUp(e) //{{{
{
    log_msg("mouseUp");
    if(!TX_el) return;

    window.removeEventListener("mousemove", divMove, true);
    e.preventDefault();
} //}}}
function touchend(e) //{{{
{
    log_msg("touchend");
    if(!TX_el) return;

    TX_el.removeEventListener("touchmove", touchmove, false);
    e.preventDefault();
} //}}}


function log_screen_info(caller) //{{{
{
    var el_xy = (TX_el) ? TX_el.style.left +" "+ TX_el.style.top : "";

    var be = document.getElementById("body");
    var b_wh = be.clientWidth+"x"+body.clientHeight;

    var s_wh = screen.width+"x"+screen.height;

    log_msg(caller +": "+ el_xy+" &nbsp; "+b_wh+" &nbsp; "+s_wh);

} //}}}
function log_msg(msg) //{{{
{
    var el = document.getElementById("browser_info");
    if(!el) return;

    var color    = (screen.width > screen.height) ? "#002" : "#020";

  //el.innerHTML = "<div style='padding:1px; background-color:"+color+";'>"+msg+"<br>"+el.innerHTML+"</div>";
    el.innerHTML = "<div style='padding:1px; background-color:"+color+";'>"+msg                    +"</div>";

} //}}}
function log_clear() //{{{
{
    var el = document.getElementById("browser_info");
    if(!el) return;

    el.innerText = "";

} //}}}

