// ┌───────────────────────────────────────────────────────────────────────────┐
// | SCRIPTS/zoom_target.js                               _TAG (260804:20h:07) ●
// ├───────────────────────────────────────────────────────────────────────────┤
// │                              STYLE/details.css STYLE/kb.css STYLE/ecc.css │
// │ @see                           $AHK/DOC/HIDCONTROL/SCRIPTS/zoom_target.js │
// │ @see $INPUTDIR/TWIDDLER/GitHub/Twiddler3-Layout/javascript/zoom_target.js │
// └───────────────────────────────────────────────────────────────────────────┘
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true {{{*/

/* globals console, setTimeout, clearTimeout, performance, navigator */
/* globals js_store */
/* globals js_xpath */

/* exported zoom_target_js */

/*}}}*/
let zoom_target_js = (function() {
"use strict";
const SCRIPT_ID = "zoom_target_js";
let log_this = false;
let tag_this = false;
let log_debug= false;

//{{{

const bg1 = "background-color : rgba(150,  75,   0, .9); color : #FFF; padding: 0 1em;";
const bg2 = "background-color : rgba(255,   0,   0, .9); color : #FFF; padding: 0 1em;";
const bg3 = "background-color : rgba(255, 165,   0, .9); color : #000; padding: 0 1em;";
const bg4 = "background-color : rgba(255, 255,   0, .9); color : #000; padding: 0 1em;";
const bg5 = "background-color : rgba(154, 205,  50, .9); color : #000; padding: 0 1em;";
const bg6 = "background-color : rgba(100, 149, 237, .9); color : #000; padding: 0 1em;";
const bg7 = "background-color : rgba(238, 130, 238, .9); color : #000; padding: 0 1em;";
const bg8 = "background-color : rgba(160, 160, 160, .9); color : #000; padding: 0 1em;";
const bg9 = "background-color : rgba(255, 255, 255, .9); color : #000; padding: 0 1em;";
const bg0 = "background-color : rgba(  0,   0,   0, .9); color : #FFF; padding: 0 1em;";

//}}}

// ┌────┬───────────────────────────────┐
// │ 🔘 │ zoom_target ● set ● release   │
// └────┴───────────────────────────────┘
/*  set_zoom_target {{{*/
//{{{
let     zoom_of;
let     zoom_bb;
let     zoom_cp;

let     zoom_target;
let     zoom_holder;
//}}}
let set_zoom_target = function(e)
{
//{{{
if(log_this) console_clr("SELECT");
if(log_this) console.log("%c ● set_zoom_target("+(e ? e.target.tagName : "")+")", bg5);

//}}}
    /* JUST LOADED {{{*/
    if( !styleElement )
    {
        init_zoom_target_style();
        init_default_listeners();

if(log_debug) set_debug_divs();
    }
    /*}}}*/
    /* PICK A NEW [zoom_target] ● INIT [LISTEN DOWN MOVE UP CLICK STYLE DEBUG] {{{*/
    let no_new_target   = !e || (e.type == "toggle");

    let new_zoom_target = no_new_target ? null : select_zoom_target( e );

    /*}}}*/
    /* RELEASE OLD TARGET {{{*/
    if( zoom_target )
        release_zoom_target(e, "set_zoom_target");

    zoom_target = new_zoom_target;
    /*}}}*/
    /*  RETURN WHEN NO [zoom_target] SELECTED {{{*/
    if(!zoom_target)
    {
if(log_this) console.log("%c ● set_zoom_target: NONE", bg8);

        return;
    }
    /*}}}*/
    /* ○ TRACK IN PLACE BOUNDING BOX {{{*/
    let in_place_bb = zoom_target.getBoundingClientRect();

    /*}}}*/
    /* ○ SAVE TOP CONTAINER SCROLLTOP {{{*/
//  scroll_container.save( zoom_target );

    /*}}}*/
    /* ○ LOAD LAST SAVED ZOOM ATTRIBUTES {{{*/
    if(!zoom_target.zoom_attr )
        load_zoom_target_zoom_attr();

    /*}}}*/
    /* ● SAVE OLD PARRENT AND DEFAULT XPath {{{*/
    let cs = window.getComputedStyle( zoom_target ); // effective for stepper_div
    if(!zoom_target.default_position)
        zoom_target.default_position           = cs.position;
    if( zoom_target.default_position == "fixed") {
        zoom_target.default_top                = cs.top;
        zoom_target.default_left               = cs.left;
    }
    else {
        zoom_target.default_parentElement      = zoom_target.parentElement;
        zoom_target.default_xpath              = js_xpath.get_nodeXPath( zoom_target );
        zoom_target.default_nextElementSibling = zoom_target.nextElementSibling || null;
    }
    /*}}}*/
    /* ● [zoom_holder] {{{*/
    if(!zoom_holder) {
        zoom_holder                = document.createElement("DIV");
        zoom_holder.id             = "zoom_holder";
    }
    /*}}}*/
    /* ● replace [fixed zoom_target] with a [static zoom_holder] to preserve page content geometry {{{*/
    /* INSERT [zoom_holder] into parent */
    if( zoom_target.default_position != "fixed")
    {
        if( zoom_target.default_parentElement ) {
            zoom_target.default_parentElement.insertBefore(zoom_holder, zoom_target.default_nextElementSibling || null);
            document.body.insertBefore(zoom_target, null);
        }
        zoom_holder.style.width    = zoom_target.offsetWidth  +"px";
        zoom_holder.style.height   = zoom_target.offsetHeight +"px";
        zoom_holder.style.display  = zoom_target.style.display;
    }
    /* ● ADD ZOOM TARGET STYLE {{{*/
    zoom_target.classList.add("zoom_target");

    /*}}}*/
    /* MAGNIFY fixed IMG */
    if( zoom_target.classList.contains("default_zoom_target") )
    {
        /* EXTRACT [zoom_target] from parent */
        let doc_el = document.documentElement;
        let body   = document.querySelector("BODY");
        doc_el.insertBefore(zoom_target, body);
    }
    zoom_target.style.position = "fixed";
    zoom_target.classList.add("magnified");

    /* cancel reflow-scroll side-effect */
//  scroll_container.restore( zoom_target );
    /*}}}*/
    /* ● ADD EVENT LISTENERS {{{*/
    check_behavior_TOUCH_ELSE_DESKTOP();

    if(!zoom_target.classList.contains("default_zoom_target")) {
        if( behavior_TOUCH_ELSE_DESKTOP ) {
            zoom_target.addEventListener("touchstart" , zt_on_down       );
if(tag_this) console.log("%c touchstart", bg7);
        }
        else {
            zoom_target.addEventListener("pointerdown", zt_on_down       );  // already persistent
if(tag_this) console.log("%c pointerdown", bg4);
        }
        zoom_target    .addEventListener("click"      , zt_on_click      );  // already persistent

        // set random container opacity ● do not wait for a first click to pin
        zoom_target.classList.add("freezed");
    }
//  zoom_target        .addEventListener("mouseover"  , zt_on_over  );
    zoom_target        .addEventListener("mouseout"   , zt_on_out   );
    zoom_target        .addEventListener("wheel"      , zt_on_wheel );
    /*}}}*/
    /* ● RESTORE LAST SAVED ZOOM ATTRIBUTES {{{*/
    if(   (zoom_target.default_position != "fixed")
        && zoom_target.zoom_attr
      ) {
//{{{
if(log_this) console.log("%c set_zoom_target ● RESTORING zoom_attr:"
                +"\n● cp_w      \t: "+ zoom_target.zoom_attr.cp_w
                +"\n● clipPath  \t: "+ zoom_target.zoom_attr.clipPath
                +"\n● transform \t: "+ zoom_target.zoom_attr.transform
                +"\n● translate \t: "+ zoom_target.zoom_attr.translate
               , bg5);
//}}}

        zoom_target.cp_w            = zoom_target.zoom_attr.cp_w      ||  0;
        zoom_target.style.clipPath  = zoom_target.zoom_attr.clipPath  || "";
        zoom_target.style.transform = zoom_target.zoom_attr.transform || "";
//  if( zoom_target.classList.contains("default_zoom_target") )//FIXME
        zoom_target.style.translate = zoom_target.zoom_attr.translate || "";
    }
    else {
if(log_this) console.log("%c RESTORING ● zoom_attr NONE", bg8);
    }
    /*}}}*/
    bring_into_view( e );
if(log_this) console.log("set_zoom_target:", zoom_target);
};
/*}}}*/
/*_ bring_into_view {{{*/
let bring_into_view = function(e)
{
    if(!zoom_target ) return;

    let {   bb,   bb_OTV, BB_OTV
        , clip, clip_OTV, CL_OTV } = get_clip_out_of_view();
    if( clip_OTV ) {
        /* MOVE INTO VIEW [fixed] {{{*/
        if( zoom_target.classList.contains("default_zoom_target") )
        {
            move_clip_into_view(bb, clip);
        }
        /*}}}*/
        /* MOVE INTO VIEW [static] {{{*/
        else {
            let clip_top_left_OTV
                =   (clip.x < 0)
                 || (clip.y < 0)
                 || (clip.x > (window.innerWidth  * 0.80))
                 || (clip.y > (window.innerHeight * 0.80))
            ;
            if( clip_top_left_OTV )
                move_clip_into_view(bb, clip);
        }
        /*}}}*/
    }
};
/*}}}*/
/*_ get_clip_out_of_view {{{*/
let VIEW_MARGIN = 10;
let get_clip_out_of_view = function()
{
    let view_w = window.innerWidth  - VIEW_MARGIN;
    let view_h = window.innerHeight - VIEW_MARGIN;
    /* BOUNDINGS */
    let bb    = zoom_target.getBoundingClientRect();
        bb.x       = parseInt( bb.x      );
        bb.y       = parseInt( bb.y      );
        bb.width   = parseInt( bb.width  );
        bb.height  = parseInt( bb.height );
    let bb_OTV     = ((bb.x            ) < VIEW_MARGIN)
        ||           ((bb.y            ) < VIEW_MARGIN)
        ||           ((bb.y            ) > view_h     )
        ||           ((bb.x            ) > view_w     )
        ||           ((bb.x + bb.width ) > view_w     )
        ||           ((bb.y + bb.height) > view_h     )
    ;
    let BB_OTV     = bb_OTV   ? " ■■■ " : "     ";

    /* CLIP */
    let urdl  = get_clipPath_urdl();
    let scale = get_scale();
    let    w  =      parseInt( Math.min(bb.width, bb.height) - (2 * zoom_target.cp_w * scale) );
    let clip  = { x: bb.x + parseInt(urdl.l * scale)
        ,         y: bb.y + parseInt(urdl.u * scale)
        ,     width: w
        ,    height: w
    };
    let clip_OTV   = ((clip.x              ) < VIEW_MARGIN)
        ||           ((clip.y              ) < VIEW_MARGIN)
        ||           ((clip.y              ) > view_h     )
        ||           ((clip.x              ) > view_w     )
        ||           ((clip.x + clip.width ) > view_w     )
        ||           ((clip.y + clip.height) > view_h     )
    ;
    let CL_OTV     = clip_OTV ? " ■■■ " : "     ";

    return {   bb,   bb_OTV, BB_OTV
        ,    clip, clip_OTV, CL_OTV };
};
/*}}}*/
/*_ move_clip_into_view {{{*/
let move_clip_into_view = function(bb, clip)
{
if(log_this) console.log("move_clip_into_view");
if(log_this) console.log( log_zoom_target() );

if(log_debug) {
    zb_update("move_clip_into_view", CHAR_CODE_O); // DEBUG
    setTimeout(do_move_clip_into_view, 500, bb, clip);
}
else {
    do_move_clip_into_view(bb, clip);
}

};
/*}}}*/
/*_ do_move_clip_into_view {{{*/
let do_move_clip_into_view = function(bb, clip)
{
if(log_debug) console.log("do_move_clip_into_view");
//{{{
//console.log("bb:"  );
//console.dir( bb    );
//console.log("clip:");
//console.dir( clip  );
//}}}

    let view_w = window.innerWidth  - VIEW_MARGIN;
    let view_h = window.innerHeight - VIEW_MARGIN;

    let dx = 0;
    let dy = 0;

    if     ((clip.x              ) < VIEW_MARGIN)  dx =  (VIEW_MARGIN          - clip.x);
//  else if((clip.x              ) > view_w     )  dx = -(clip.x               - view_w);
    else if((clip.x + clip.width ) > view_w     )  dx = -(clip.x + clip.width  - view_w);

    if     ((clip.y              ) < VIEW_MARGIN)  dy =  (VIEW_MARGIN          - clip.y);
//  else if((clip.y              ) > view_h     )  dy = -(clip.y               - view_h);
    else if((clip.y + clip.height) > view_h     )  dy = -(clip.y + clip.width  - view_h);


//{{{
//    if(zoom_target.style.position != "fixed") //FIXME
//    {
//        let scale = get_scale();
//        dx        = parseInt(dx * scale);
//        dy        = parseInt(dy * scale);
//    }
//}}}

    let t      = get_translate();
        t.x   += dx;
        t.y   += dy;

    zoom_target.style.translate = t.x+"px "+ t.y+"px";

if(log_debug) zb_update("move_clip_into_view"); // DEBUG
};
/*}}}*/
/*_ release_zoom_target {{{*/
let release_zoom_target = function(e,_caller)
{
if(log_this) console.log("_ release_zoom_target("+(e ? e.target.tagName : "")+") ● "+ _caller);

    if(!zoom_target) return null;

    /* ● REMOVE EVENT LISTENERS */
    if(!zoom_target.classList.contains("default_zoom_target")) {
        zoom_target.removeEventListener("pointerdown", zt_on_down  );
        zoom_target.removeEventListener("touchstart" , zt_on_down  );
        zoom_target.removeEventListener("click"      , zt_on_click );
    }
//  zoom_target    .removeEventListener("mouseover"  , zt_on_over  );
    zoom_target    .removeEventListener("mouseout"   , zt_on_out   );
    zoom_target    .removeEventListener("wheel"      , zt_on_wheel );

    /* ● CLEAR ZOOMING TRANSCIENT STATE */
    if(zoom_target.classList.contains("zoom_target"))
        clr_zoom_target("set_zoom_target");

    /* SET NO CURRENT [zoom_target] */
    let zoom_target_released = zoom_target;

    zoom_target = null;
    check_behavior_TOUCH_ELSE_DESKTOP();

    return zoom_target_released;
};
/*}}}*/
/*_ clr_zoom_target {{{*/
let clr_zoom_target = function(_caller)
{
//{{{
if(log_this) console.log("● clr_zoom_target "+ _caller +" "+ zoom_target.tagName);
//}}}
    if( log_debug ) clr_debug_divs();
    /* BACK TO PAGE PARENT {{{*/
    if(zoom_target.default_position == "fixed") {
        zoom_target.style.top      = zoom_target.default_top;
        zoom_target.style.left     = zoom_target.default_left;
    }
    else if(zoom_target.default_parentElement)
    {
        if( zoom_holder && zoom_holder.parentElement)
            zoom_holder.parentElement.removeChild( zoom_holder );

        zoom_target.default_parentElement.insertBefore(zoom_target, zoom_target.default_nextElementSibling || null);
    }
    /*}}}*/
    /* SAVE [zoom_target.zoom_attr] {{{*/
    if(zoom_target.classList.contains("zoom_target"))
    {
        save_zoom_target_zoom_attr("clr_zoom_target");

    }
    /*}}}*/
    /* CLEAR STYLE {{{*/
    delete zoom_target.cp_w;
    zoom_target.style.clipPath  = "";
//  zoom_target.style.left      = "";
//  zoom_target.style.top       = "";
if(zoom_target.default_position != "fixed")
{
    zoom_target.style.position  = zoom_target.default_position;
    zoom_target.style.transform = "";
    zoom_target.style.translate = "";
}
    /*}}}*/
    /* CLEAR CLASS {{{*/
    zoom_target.classList.remove("zoom_target");
    zoom_target.classList.remove("freezed"    );
    zoom_target.classList.remove("magnified"  );

    /*}}}*/
    /* Call [zoom_target.zoom_target_released_CB] {{{*/
    if(zoom_target.zoom_target_released_CB)
    {
if(log_this) console.log("...typeof zoom_target.zoom_target_released_CB = "+ typeof zoom_target.zoom_target_released_CB);
        if( zoom_target.zoom_target_released_CB )
            zoom_target.zoom_target_released_CB();
    }
    /*}}}*/
};
/*}}}*/
/*_ select_zoom_target {{{*/
let select_zoom_target = function(e)
{
//{{{
if(log_this) console.log("%c ● select_zoom_target("+(e ? e.target.tagName : "")+")", bg5);
    /* ┌────────────────────────────────────────────────────────────────────────────┐ */
    /* │ reselecting current zoom_target: falls back to select inline .zoom_target  │ */
    /* └────────────────────────────────────────────────────────────────────────────┘ */
//}}}

    // ┌────────────────────────────────────────────────────────────────────────┐
    // │ [EMBEDDED-IMG] ● [FIRST-TARGET] ● [TOGGLE-CURRENT]                     │
    // └────────────────────────────────────────────────────────────────────────┘
    let selecting_default_zoom_target
        =   e
        && !e.target.classList.contains("zoom_target_em" )
        &&  e.target.classList.contains("default_zoom_target")
    ;

    let nextContainer
        =  get_nextContainer( e.target );                 // USER [nextElementSibling]
    let    reselecting_current_target
        =  e
        && !e.target.classList.contains("zoom_target_em" )
        && !selecting_default_zoom_target
        &&  zoom_target
        &&  zoom_target.default_parentElement
        && (zoom_target.default_parentElement == e.target.parentElement)
    ;
//{{{
if(log_this) {                            let msg;                               let l_x;
//  if     (        selecting_first_target) { msg =     " ● selecting_first_target"; l_x = bg2; }
    if     (    reselecting_current_target) { msg =    "reselecting_current_target"; l_x = bg3; }
    else if( selecting_default_zoom_target) { msg = "selecting_default_zoom_target"; l_x = bg4; }
    else                                    { msg =                "next_container"; l_x = bg5; }
//{{{
if(tag_this) console.log("%c SELECTING %c"+ msg, bg5, l_x);
//}}}
}
//}}}

    // ┌────────────────────────────────────────────────────────────────────────┐
    // │ INIT ● [LISTEN DOWN MOVE UP CLICK] ● STYLE ● DEBUG                     │
    // └────────────────────────────────────────────────────────────────────────┘
//{{{
//    if( selecting_first_target )
//    {
//        init_zoom_target_style();
//        init_default_listeners();

//if(log_debug) set_debug_divs();
//    }
//}}}

    // ┌────────────────────────────────────────────────────────────────────────┐
    // │ [EMBEDDED-IMG] ● [FIRST-TARGET OR TOGGLE-CURRENT] ● [SELECTED-BY-USER] │
    // └────────────────────────────────────────────────────────────────────────┘
    let new_zoom_target = null;

    if(     selecting_default_zoom_target) new_zoom_target =  e.target;                                      // CLICKED  ● [EMBEDDED-IMG]
//  else if(   reselecting_current_target) new_zoom_target =  document.querySelector(".default_zoom_target") // FALLBACK ● [EMBEDDED-IMG]
    else if(   reselecting_current_target) new_zoom_target =  null;                                          // ➔ NO [zoom_target]
  //else if(e)                             new_zoom_target =  e.target.nextElementSibling;                   // USER [nextElementSibling]
    else if(e)                             new_zoom_target =      nextContainer            ;                 // USER [nextElementSibling]

//  if(!new_zoom_target)                   new_zoom_target = (e && (e.target.parentElement == document.body)) ? e.target : null; // i.e. stepper_div
    if(new_zoom_target == zoom_holder    ) new_zoom_target =  null;                                          // ➔ NO [zoom_target]

if(log_this) console.log("%c...return "+  (new_zoom_target ? new_zoom_target.tagName : "NO [new_zoom_target]"), bg5);
    return new_zoom_target;
};
/*}}}*/
/*_ get_nextContainer {{{*/
let get_nextContainer = function(el)
{
    // RETURN NEXT CONTAINER SIBLING ELEMENT
    while(   (el.tagName != "DIV"  )
          && (el.tagName != "TABLE")
          && (el.tagName != "PRE"  )
          && (el.tagName != "P"    )
          && (el.nextElementSibling)
    )
        el  = el.nextElementSibling;

    return    el;
};
/*}}}*/

// ┌───────┬────────────────────────────┐
// │ EVENT │     ● wheel ● down move up │
// └───────┴────────────────────────────┘
//{{{
const CLICK_MS    = 500;
const MOVE_MIN    =  20;

let wasDragging   = false;
let pointerMoved  = false;

let onDown_XY     = { x: 0 , y: 0 };
let onDown_TR     = { x: 0 , y: 0 };
let onDown_MS     = 0;
let onUp_MS       = 0;

let clipping;
let scaling;

//}}}
/*  zt_on_down {{{*/
//{{{
let onDown_DIST;
let onDown_SCALE;
let onDown_CP_W;
let onDown_LONG_PRESS_timeout;
//}}}
let zt_on_down = function(e)
{
if(log_this) console_clr("DOWN");
if(log_this) console.log("zt_on_down");

    zt_log("DOWN", bg1);

    clipping    = false;
    scaling     = false;

    wasDragging = false;

    // ┌───────────────────────────────────────────────────────────────────────┐
    // │ onDown                                                                │
    // └───────────────────────────────────────────────────────────────────────┘
    let       x     = ((e.touches) ? e.touches[0].clientX : e.x).toFixed();
    let       y     = ((e.touches) ? e.touches[0].clientY : e.y).toFixed();
    onDown_XY.x     =   x;
    onDown_XY.y     =   y;

    onDown_MS       = performance.now();
    onUp_MS         = 0;

    onDown_SCALE    = get_scale();

    onDown_CP_W     = zoom_target ? zoom_target.cp_w : undefined;

    let       t     = get_translate();
    onDown_TR.x     = t.x;
    onDown_TR.y     = t.y;

    onDown_DIST     = undefined;

    // ┌───────────────────────────────────────────────────────────────────────┐
    // │ ✌TOUCH ● centroid ● distance                                         │
    // └───────────────────────────────────────────────────────────────────────┘
    if(e.touches && (e.touches.length == 2))
    {
        onDown_XY = get_centroid( e );

        if(e.touches.length == 2) {
            let      dx =   e.touches[0].clientX - e.touches[1].clientX;
            let      dy =   e.touches[0].clientY - e.touches[1].clientY;
            onDown_DIST = Math.hypot(dx,dy).toFixed();
        }
    }

    /* START LONG-PRESS-CLIP TIMEOUT */
    if(e.touches && (e.touches.length == 1))
    {
        onDown_LONG_PRESS_timeout = setTimeout(toggle_touch_shiftKey, 1000);
        zt_log("onDown_LONG_PRESS_timeout", bg1);
    }

    // ┌───────────────────────────────────────────────────────────────────────┐
    // │ freeze any sticky zoom_target click handler                           │
    // └───────────────────────────────────────────────────────────────────────┘
    if(zoom_target && !zoom_target.classList.contains("sticky") && e.preventDefault)
        e.preventDefault();
};
/*}}}*/
/*  zt_on_move ● (drag clip-path) {{{*/
let zt_on_move = function(e)
{
    if( !zoom_target )  return;

    let e_shiftKey =      e.shiftKey
        || (e.touches && (e.touches.length == 2))
        ||                  touch_shiftKey_state;

    let e_ctrlKey  =      e.ctrlKey
        ||                  touch_ctrlKey_state;

    if(!onDown_MS && !e_shiftKey)  return; // MOVE no onDown

    if( onUp_MS   && !e_shiftKey)  return; // RELEASE onUp

if(log_this) console.log("zt_on_move ● onDown_XY=["+ (onDown_XY && (onDown_XY.x +" "+ onDown_XY.y)) +"]");

//zt_log("zt_on_move");

    /* recenter on cursor zoom transformOrigin */
    let              x  = e.touches ? e.touches[0].clientX : e.x;
    let              y  = e.touches ? e.touches[0].clientY : e.y;
    let             dx  = x - onDown_XY.x;
    let             dy  = y - onDown_XY.y;
    if((Math.abs(dx) > MOVE_MIN) || (Math.abs(dy) > MOVE_MIN))
    {
        pointerMoved    = true;

        /* CLEAR LONG-PRESS-CLIP TIMEOUT ● ON MOVE */
        if(onDown_LONG_PRESS_timeout) clearTimeout( onDown_LONG_PRESS_timeout );
    }

    // ┌────────────────┐
    // │ scale, clip or │
    // └────────────────┘
    if(e_shiftKey || e_ctrlKey)
    {
        zt_on_wheel( e );
    }
    // ┌────────────────┐
    // │ move           │
    // └────────────────┘
    else {
        wasDragging         = true; // has effectively moved
        zoom_target.style.translate = (onDown_TR.x + dx)+"px "+(onDown_TR.y + dy)+"px";

        if(e.touches) zt_log("TOUCH_MOVE", bg2);
        else          zt_log("MOVE"      , bg2);
    }

if(log_debug) zb_update("DRAG"); // DEBUG
};
/*}}}*/
/*  zt_on_up {{{*/
let zt_on_up = function(e)
{
    /* CLEAR LONG-PRESS-CLIP TIMEOUT ● ON UP */
    if(onDown_LONG_PRESS_timeout) clearTimeout( onDown_LONG_PRESS_timeout );

    // HANDLE ONLY THE FIRST RELEASE SINCE ONDOWN (i.e. multi-touch)
    if( onUp_MS ) return;

    onUp_MS   = performance.now();

    setTimeout(() => onDown_MS = 0, 0); // so it survives click handler call

if(log_this) console_clr("UP");
if(log_this) console.log("zt_on_up");

    /* reset one-time-used modifiers */
    if(   (e.target.id != "set_zoom_ctrlKey_em" )
       && (e.target.id != "set_zoom_shiftKey_em")
    ) {
        if(touch_shiftKey_state) toggle_touch_shiftKey();
        if(touch_ctrlKey_state ) toggle_touch_ctrlKey ();
    }

    if( zoom_target )
        save_zoom_target_zoom_attr("zt_on_up");
};
/*}}}*/
/*  zt_on_click {{{*/
let zt_on_click = function(e)
{
if(log_this) console_clr("CLICK");

    /* [wasDragging]    ● return {{{*/
    if( wasDragging )
    {
if(log_this) console.log("%c ●●● zt_on_click: wasDragging", bg8);

        return;
    }
    /*}}}*/
    /* [LONG CLICK]     ● return {{{*/
    if((e.timeStamp - onDown_MS) > CLICK_MS)
    {
if(log_this) console.log("%c ●●● zt_on_click: NOT A CLICK ● "+   parseInt(e.timeStamp - onDown_MS) +"ms > "+CLICK_MS+"ms", bg8);

        return;
    }
    /*}}}*/
    /* [IMG]            ● magnified ➔ freezed ➔ release {{{*/
    if( e.target.classList.contains("default_zoom_target") )
    {
if(log_this) console.log("... default_zoom_target");
        /* SELECT [default_parentElement] ➔ [zoom_target MAGNIFIED] */
        if( !e.target.classList.contains("zoom_target") )
        {
if(log_this) console.log("%c ... zoom_target ➔ MAGNIFIED"                  , bg7);
            set_zoom_target( e );
            e.target.classList.add("magnified");
            return;
        }
        else if(zoom_target.classList.contains("magnified"))
        {
            /* TRANSITION [MAGNIFIED ➔ FREEZED] */
            if(!zoom_target.classList.contains("freezed")) {
if(log_this) console.log("%c ... zoom_target MAGNIFIED ➔ FREEZED"          , bg7);

                zoom_target.classList.add("freezed");
            }
            /* TRANSITION [MAGNIFIED FREEZED ➔ RELEASE] */
            else {
if(log_this) console.log("%c ... zoom_target MAGNIFIED + FREEZED ➔ RELEASE", bg7);

                release_zoom_target(e, "zt_on_click");
            }
        }
        else {
if(log_this) console.log("%c ... zoom_target: className["+ zoom_target.className +"]", bg7);
        }
    }
    /*}}}*/
    /* random container ● dismiss .. return {{{*/
    else {
if(log_this) console.log("%c ●●● zt_on_click: NOT A [default_zoom_target]"  , bg8);

      //zoom_target.classList.toggle("freezed");
      //release_zoom_target(e, "zt_on_click");
        set_zoom_target();
        return;
    }
    /*}}}*/
    save_zoom_target_zoom_attr("zt_on_click");
};
/*}}}*/
///*  zt_on_over {{{*/
//let zt_on_over  = function(e)
//{
//if(log_this) console_clr("MOUSEOVER")
//if(log_this) console.log("zt_on_over");
//    if(!zoom_target.classList.contains("freezed"  ))
//        zoom_target.classList.toggle("magnified");
//};
///*}}}*/
/*  zt_on_out {{{*/
let zt_on_out = function(e)
{
    if((e.timeStamp - onDown_MS) < CLICK_MS)
    {
if(log_this) console.log("%c ●●● zt_on_out: TOO QUICK ● "+  parseInt(e.timeStamp - onDown_MS) +"ms < "+CLICK_MS+"ms", bg8);

        return;
    }

    if(    zoom_target.classList.contains("default_zoom_target")
       && !zoom_target.classList.contains("freezed"            )
      ) {
        release_zoom_target(e, "zt_on_out");
    }
    else {
if(log_this) console.log("%c ○○○ zt_on_out: FREEZED [default_zoom_target]", bg0);
    }
};
/*}}}*/
/*  zt_on_wheel 🔘 {{{*/
let zt_on_wheel = function(e)
{
if(e.cancelable && e.preventDefault ) e.preventDefault();
//{{{
if(log_this) console_clr("zt_on_wheel");
if(log_this) console.log("● e.type              \t\t: "+ e.type                           +"\n"
                        +"● e.touches           \t\t: "+(e.touches ? e.touches.length : 0)+"\n"
                        +"● e.shiftKey          \t\t: "+ e.shiftKey                       +"\n"
                        +"● e.ctrlKey           \t\t: "+ e.ctrlKey                        +"\n"
                        +"● touch_shiftKey_state  \t: "+ touch_shiftKey_state             +"\n"
                        +"● touch_ctrlKey_state   \t: "+ touch_ctrlKey_state              +"\n"
                        );

    let consumed_by;
//}}}
    /* DRIFT or DIST {{{*/
    let drift2 = 0;
    let pinch2 = 0;
    if(e.touches && onDown_DIST)
    {
        let  mid_x  = (e.touches[0].clientX + e.touches[1].clientX) / 2;
        let  mid_y  = (e.touches[0].clientY + e.touches[1].clientY) / 2;
        let drag_x  =  Math.abs  ( mid_x - onDown_XY.x).toFixed();
        let drag_y  =  Math.abs  ( mid_y - onDown_XY.y).toFixed();
        drift2      = (Math.abs  (drag_x - drag_y         ) < 10); // x and y moved together

        let dist_x  = (e.touches[0].clientX - e.touches[1].clientX).toFixed();
        let dist_y  = (e.touches[0].clientY - e.touches[1].clientY).toFixed();
        let dist    =  Math.hypot(dist_x , dist_y         ).toFixed();
        pinch2      = (Math.abs  (dist - onDown_DIST) > 10);
    }
    /*}}}*/
    /* ORIGIN {{{*/
    if((e.type == "wheel") && !e.shiftKey)
    {
        set_transformOrigin(e.x, e.y);
    }
    else if(e.touches && (e.touches.length == 2))
    {
        set_transformOrigin(onDown_XY.x , onDown_XY.y);
    }
    /*}}}*/
    /* 🔘 WHEEL_SCALE {{{*/
    if(!consumed_by && (e.type == "wheel") && !e.shiftKey)
    {
        let deltaY = e.deltaY;
        let factor = (deltaY < 0) ? 1.05 : 0.95;

//{{{
if(tag_this) console.log("%c WHEEL SCALE("+deltaY+"%c"+factor+") %c"+ e.type , bg4, (factor > 1) ? bg9:bg8, bg0);
//}}}

        set_scale(factor * get_scale());
        consumed_by =   "WHEEL_SCALE";
        zt_log(consumed_by, bg1);
    }
    /*}}}*/
    /* 🔘 WHEEL_CLIP {{{*/
    if(!consumed_by && (e.type == "wheel") &&  e.shiftKey)
    {
        let      x = e.x;
        let      y = e.y;
        let     dx = e.deltaX;
        let     dy = e.deltaY;
        let   step_sign = (Math.abs(dx) > Math.abs(dy)) ? dx : dy;
//{{{
if(tag_this) console.log("%c WHEEL CLIP(step_sign "+ (step_sign ? step_sign : "✗") +" %c"+ e.type , bg1, bg0);
//}}}
        set_clipPath_xy_wh({ x , y , step_sign });  // RESIZE clipPath + MOVE clipPath to onDown_XY
        consumed_by =   "WHEEL_CLIP";
        zt_log(consumed_by, bg2);
    }
    /*}}}*/
    /* 🔘 DRAG_CLIP {{{*/
    if(!consumed_by && (e.type != "wheel") && !e.touches &&  e.shiftKey)
    {
        let      x = e.x;
        let      y = e.y;
        set_clipPath_xy_wh({ x , y });              // MOVE clipPath
        consumed_by =   "DRAG_CLIP";
        zt_log(consumed_by, bg3);
    }
    /*}}}*/
    /* ✌ TOUCH_SCALE {{{*/
    if(!consumed_by && e.touches && (e.touches.length == 2))
    {
        let      dx = e.touches[0].clientX - e.touches[1].clientX;
        let      dy = e.touches[0].clientY - e.touches[1].clientY;
        let    dist = Math.hypot(dx,dy);
        let  factor = (dist   / onDown_DIST ).toPrecision(2);
        let   scale = (factor * onDown_SCALE).toPrecision(2);
/*{{{*/
if(tag_this) console.log("● drift2    \t: "+ drift2 +"\n"
                    +"● pinch2    \t: "+ pinch2 +"\n"
                    +"● factor    \t: "+ factor +"\n"
                    +"● scale     \t: "+ scale  +"\n"
                    +"● onDown_XY \t: "+ onDown_XY.x+"@"+onDown_XY.y +"\n"
                    );
/*}}}*/
        set_scale( scale );
        consumed_by =   "TOUCH_SCALE";
        zt_log(consumed_by, bg4);
    }
    /*}}}*/
    // ✌ TOUCH_CLIP {{{*/
    if(!consumed_by /*&& e.touches*//*&& touch_shiftKey_state*/)
    {
        let   x  =  onDown_XY.x                                  ;
        let   y  =  onDown_XY.y                                  ;
        let   dx = (onDown_XY.x - e.touches[0].clientX).toFixed();
        let   dy = (onDown_XY.y - e.touches[0].clientY).toFixed();
        let step_sign = (Math.abs(dx) > Math.abs(dy)) ? dx : dy;
if(tag_this) console.log("● x @ y     \t\t: "+ x+"@"+y     +"\n"
                        +"● step_sign  \t: "+ step_sign  +"\n"
                        );

        set_clipPath_xy_wh({ x , y , step_sign });   // RESIZE clipPath + MOVE clipPath to onDown_XY
        consumed_by =   "TOUCH_CLIP";
        zt_log(consumed_by, bg5);
    }
    /*}}}*/
if(!consumed_by) zt_log("NOT_CONSUMED", bg9);
};
/*}}}*/
// ┌───────┬────────────────────────────┐
// │ EVENT │                   handling │
// └───────┴────────────────────────────┘
/*_ get_centroid {{{*/
let get_centroid = function(e)
{
    let x = 0; Array.from(e.touches).forEach((t) => x += t.clientX);
    let y = 0; Array.from(e.touches).forEach((t) => y += t.clientY);

    x = (x / e.touches.length).toFixed();
    y = (y / e.touches.length).toFixed();

    return { x,y };
};
/*}}}*/

// ┌────┬───────────────────────────────┐
// │ 🔲 │ transform translate clip-path │
// └────┴───────────────────────────────┘
/*  set_scale               ● SCALE {{{*/
//{{{
const SCALE_MAX = 5.0;
const SCALE_MIN = 0.2;
//}}}
let set_scale = function(scale)
{

//  let scale = factor * get_scale();
    scale     = Math.min(scale, SCALE_MAX);
    scale     = Math.max(scale, SCALE_MIN);

    if(Math.abs(1.0 - scale) < 0.01) scale = 1.0;

    zoom_target.style.transform = "scale("+scale+")";

if(log_debug) zb_update("WHEEL"); // DEBUG
};
/*}}}*/
/*_ get_scale {{{*/
let get_scale = function()
{
    if(!zoom_target) return undefined;
/*{{{
    let transform = zoom_target.style.transform || "1.0";
    return          parseFloat( transform.replace(/[^0-9\.]/g, "") );
}}}*/
//  let currentScaleMatch = zoom_target.style.transform.match(/scale\(([\d.]+)\)/);
    let currentScaleMatch = zoom_target.style.transform.match(/(scale|matrix)\(([\d.]+)/);
    let             scale = currentScaleMatch ? parseFloat(currentScaleMatch[2]) : 1;
//if(log_this) console.log("➔ get_scale transform=["+zoom_target.style.transform+"] ...return ["+scale+"]");
    return scale;
};
/*}}}*/
/*  set_transformOrigin     ● ORIGIN {{{*/
//{{{
let last_transformOrigin;
//}}}
let set_transformOrigin = function(x,y)
{
//console.log("set_transformOrigin=( "+x+" "+y+" )");//FIXME
    /* spamming onDown_XY unchanged value ? {{{*/
    if(    last_transformOrigin
       && (last_transformOrigin.x == x)
       && (last_transformOrigin.y == y)) return;

    last_transformOrigin     = { x , y };
    /*}}}*/

    /* current to */
   let      to = get_transformOrigin();

    /* adjust transformOrigin */
    let  rect = zoom_target.getBoundingClientRect();
    let scale = get_scale();
    let    dx = parseInt((  x - rect.x) / scale);
    let    dy = parseInt((  y - rect.y) / scale);
    zoom_target.style.transformOrigin = `${dx}px ${dy}px`;

    /* to delta */
    let      t1 = get_transformOrigin();
    let tx = t1.x - to.x;
    let ty = t1.y - to.y;

    /* translate back ● [cancel transform-origin-side-effect] */
    let t    = get_translate();
        t.x -= parseInt(tx * (1 - scale));
        t.y -= parseInt(ty * (1 - scale));
    zoom_target.style.translate = t.x +"px "+ t.y +"px";

if(log_debug) zb_update("ORIGIN"); // DEBUG

};
/*}}}*/
/*_ get_transformOrigin {{{*/
let get_transformOrigin = function()
{
    let              cs = window.getComputedStyle( zoom_target );
    let transformOrigin = (cs.transformOrigin +"").replace(/[^0-9\. -]/g, "");

    if(!transformOrigin )              transformOrigin  = "0 0";
    if(!transformOrigin.includes(" ")) transformOrigin +=  " 0";

    let         matches = transformOrigin.match(/([0-9\.-]+) +([0-9\.-]+)/);
    let               x = parseInt( matches[1] );
    let               y = parseInt( matches[2] );

//if(log_this) console.log("get_transformOrigin ...return["+x+" , "+y+"]")
    return { x , y };
};
/*}}}*/
/*_ get_translate {{{*/
let get_translate     = function()
{
    if( !zoom_target ) return { x:0 , y:0 };

    let              cs = window.getComputedStyle( zoom_target );
    let       translate = (cs.translate       +"").replace(/[^0-9\. -]/g, "");

    if(!translate       )              translate        = "0 0";
    if(!translate      .includes(" ")) translate       +=  " 0";

    let         matches = translate      .match(/([0-9\.-]+) +([0-9\.-]+)/);
    let               x = parseInt( matches[1] );
    let               y = parseInt( matches[2] );

//if(log_this) console.log("get_translate ...return["+x+" , "+y+"]")
    return { x , y };
};
/*}}}*/
/*  set_clipPath_xy_wh            ● CLIP {{{*/
let set_clipPath_xy_wh = function(args) //(x,y,step_sign=0)
{
    // [rect]           ● [zoom_target boudings] clip rectangle to move and/or resize {{{
    let  bcr  = zoom_target.getBoundingClientRect();

    let  rect = { x: parseInt( bcr.x     )
        ,         y: parseInt( bcr.y     )
        ,     width: parseInt( bcr.width )
        ,    height: parseInt( bcr.height) };
    //}}}
    /* SET [cp_w+delta] ● [zoom_target.cp_w]...return if(0 i.e. clipPath removed) {{{*/
    zoom_target.cp_w
        = (typeof args.step_sign != "undefined")
        ?  get_cp_w_step_up_or_down( (args.step_sign > 0) ? -1:1 )
        :  (zoom_target.cp_w || 0);

    if(     zoom_target.cp_w == 0)
    {
        if( zoom_target.style.clipPath != "" ) {
            zoom_target.style.clipPath  = "";

if(log_debug) zb_update("NO CLIP PATH"); // DEBUG
        }
        return;
    }
    /*}}}*/
    /* [clip WH]        ● ...square shape {{{*/
    let scale = get_scale();
    let     w = parseInt( Math.min(rect.width, rect.height) - (2 * zoom_target.cp_w * scale) );
    let  clip = { width  : w
        ,         height : w
    };
    /*}}}*/
    /* [clip XY]        ● ...center around pointer {{{*/
    let po
        = (typeof args.x != "undefined")
        ? { x: (args.x - rect.x               ) , y: (args.y - rect.y                ) }
        : { x: (         rect.x + rect.width/2) , y: (         rect.y + rect.height/2) }
    ;

    clip.top  = (po.y - clip.height / 2);
    clip.left = (po.x - clip.width  / 2);
    /*}}}*/
    /* [boundary WH]    ● ...<= CLIP_WIDTH_MIN {{{*/
    clip.width  = Math.max(clip.width , CLIP_WIDTH_MIN); //clip.width  = Math.min(clip.width , rect.width  - 2 * zoom_target.cp_w);
    clip.height = Math.max(clip.height, CLIP_WIDTH_MIN); //clip.height = Math.min(clip.height, rect.height - 2 * zoom_target.cp_w);
    //}}}
    /* [boundary XY]    ● ...within zoom_target boundaries {{{*/
    if((clip.top               ) < 0          ) clip.top  = 0;
    if((clip.top  + clip.height) > rect.height) clip.top  = rect.height - clip.height;
    if((clip.left              ) < 0          ) clip.left = 0;
    if((clip.left + clip.width ) > rect.width ) clip.left = rect.width  - clip.width ;
    //}}}
    /* SET [clip-path]  ● [zoom_target.scale.clip] {{{*/

    let cp_U      =               clip.top               ;
    let cp_R      = rect.width  - clip.left - clip.width ;
    let cp_D      = rect.height - clip.top  - clip.height;
    let cp_L      =               clip.left              ;

    cp_U          = parseInt(cp_U / scale);
    cp_R          = parseInt(cp_R / scale);
    cp_D          = parseInt(cp_D / scale);
    cp_L          = parseInt(cp_L / scale);

    let clipPath  = "inset("+cp_U+"px "+cp_R+"px "+cp_D+"px "+cp_L+"px)";
    if( clipPath != zoom_target.style.clipPath)
    {
        zoom_target.style.clipPath = clipPath;

if(log_debug) zb_update("CLIP PATH"); // DEBUG
//{{{
// if(log_debug) {
//   console.log("[zoom_target.cp_w "+zoom_target.cp_w+"] .. rect [ XY "+ rect.x    +" "+ rect.y   +" .. WH "+ rect.width +" "+ rect.height +" ]");
//   console.log("[zoom_target.cp_w "+zoom_target.cp_w+"] .. clip [ XY "+ clip.left +" "+ clip.top +" .. WH "+ clip.width +" "+ clip.height +" ]");
//   console.log("[zoom_target.cp_w "+zoom_target.cp_w+"] .. URDL [ "+ cp_U +" "+ cp_R +" "+ cp_D +" "+ cp_L +" ]");
 //console.log("translate=["+zoom_target.style.translate+"] .. po=["+po.x+" "+po.y+"] .. zoom_target.cp_w=["+zoom_target.cp_w+"] .. clipPath=["+clipPath+"]");
// }
//}}}
    }
    /*}}}*/
};
/*}}}*/
/*_ get_cp_w_step_up_or_down {{{*/
let get_cp_w_step_up_or_down = function(step_sign)
{
    /* GET */
    let cp_w  = zoom_target.cp_w || 0;

    /* SET */
    let clip_path_step = get_clip_path_step();
    /* OFFSET SIZE */
    let  rect = { x: zoom_target.offsetLeft
        ,         y: zoom_target.offsetTop
        ,     width: zoom_target.offsetWidth
        ,    height: zoom_target.offsetHeight };

    /* TOO SMALL */
    let small_side = Math.min(rect.width, rect.height);
    if( small_side < (CLIP_WIDTH_MIN + 2*clip_path_step)) {
        cp_w       = 0;
    }
    /* ADJUST CLIP */
    else {
        cp_w      += clip_path_step * step_sign;

        if( cp_w   < clip_path_step)
        {
            cp_w   = 0;
        }
        else {
            let clip_max
                   = parseInt((small_side - CLIP_WIDTH_MIN) / 2); // max we can crop
            cp_w
                   = Math.min(cp_w, clip_max);
        }
    }
    return cp_w;
};
/*}}}*/
/*_ get_clipPath_urdl {{{*/
let get_clipPath_urdl = function()
{
    let u=0, r=0, d=0, l=0;
    let           cp = zoom_target.style.clipPath;
    let matches = cp.match(/([0-9\.-]+)px ([0-9\.-]+)px ([0-9\.-]+)px ([0-9\.-]+)px/);
    if( matches ) {
        u = parseInt( matches[1] );
        r = parseInt( matches[2] );
        d = parseInt( matches[3] );
        l = parseInt( matches[4] );
    }
    return { u , r , d , l };
};
/*}}}*/
/*_ get_clip_path_step {{{*/
//{{{
const CLIP_DESKTOP_STEP = 12;
const CLIP_ANDROID_STEP =  2;
const CLIP_WIDTH_MIN    = 10 * CLIP_DESKTOP_STEP;

//}}}
let get_clip_path_step = function()
{
    if(behavior_TOUCH_ELSE_DESKTOP == undefined)
        check_behavior_TOUCH_ELSE_DESKTOP();

    return behavior_TOUCH_ELSE_DESKTOP
        ?      CLIP_ANDROID_STEP
        :      CLIP_DESKTOP_STEP;
};
/*}}}*/

// ┌────────────────────────────────────┐
// │ scroll_container ● save .. restore │
// └────────────────────────────────────┘
/*  scroll_container {{{*/
let scroll_container = (function() {
"use strict"; /* eslint-disable-line strict */

let save = function( el )
{
if(log_this) console.log("scroll_container.save:");
    do {
        if(  el.scrollTop ) {
             el.saved_scrollTop = el.scrollTop;
//{{{
if(tag_this) console.log("scroll_container.save:\t"+ js_xpath.get_nodeXPath(el) +" "+ el.saved_scrollTop);
//}}}
        }
        el = el.parentElement;
    }
    while(   el
          && el.parentElement
          && el.parentElement.tagName !== "BODY"
         );

};

let restore = function(el)
{
if(log_this) console.log("scroll_container.restore:");
    if( el          && el.saved_scrollTop) {
        el.scrollTo(0, el.saved_scrollTop);
//{{{
if(tag_this) console.log("scroll_container.restore:\t"+ js_xpath.get_nodeXPath(el) +" "+ el.saved_scrollTop);
//}}}
        delete         el.saved_scrollTop ;
    }
};
return { name: "scroll_container"
    ,    save
    ,    restore
};
})();
/*}}}*/

// ┌────────────────────────────────────┐
// │ SAVE-LOAD [zoom_target_attr]       │
// └────────────────────────────────────┘
/*○ save_zoom_target_zoom_attr {{{*/
let save_zoom_target_zoom_attr = function(_caller)
{
if(log_this) console.log("%c ● save_zoom_target_zoom_attr %c"+ _caller, bg5, bg6);

    if(!zoom_target) return;

    zoom_target.zoom_attr
        = {   cp_w      : zoom_target.cp_w
            , clipPath  : zoom_target.style.clipPath
            , transform : zoom_target.style.transform
            , translate : zoom_target.style.translate
        };


    let zoom_target_key = get_zoom_target_key();
//{{{
if(log_this)
    console.log("%c save_zoom_target_zoom_attr ● SAVING zoom_attr:"
               +"\n● zoom_target_key \t: "+ zoom_target_key
               +"\n● cp_w          \t\t: "+ zoom_target.zoom_attr.cp_w
               +"\n● clipPath      \t\t: "+ zoom_target.zoom_attr.clipPath
               +"\n● transform     \t\t: "+ zoom_target.zoom_attr.transform
               +"\n● translate     \t\t: "+ zoom_target.zoom_attr.translate
               , bg5);
//}}}
    if( zoom_target_key )
    {
        let key = zoom_target_key+"_attr";
        js_store.localStorage_setItem(key, JSON.stringify( zoom_target.zoom_attr ));
    }
};
/*}}}*/
/*○ load_zoom_target_zoom_attr {{{*/
let load_zoom_target_zoom_attr = function()
{
if(log_this) console.log("%c ● load_zoom_target_zoom_attr", bg6);

    let zoom_target_key = get_zoom_target_key();
    if( zoom_target_key )
    {
        let key = zoom_target_key+"_attr";
        let val = js_store.localStorage_getItem(key);
//console.log("val=["+ val +"]");

        let zoom_attr = JSON.parse( val );
//console.dir(zoom_target.zoom_attr);

        if(!zoom_attr) return;

        zoom_target.zoom_attr = zoom_attr;
//{{{
if(log_this) console.log("%c zoom_attr:\n"
                         +". cp_w      \t: "+ zoom_target.zoom_attr.cp_w      +"\n"
                         +". cliPath   \t: "+ zoom_target.zoom_attr.cliPath   +"\n"
                         +". transform \t: "+ zoom_target.zoom_attr.transform +"\n"
                         +". translate \t: "+ zoom_target.zoom_attr.translate
                         , bg6);
//}}}
    }
else debugger;//FIXME
};
/*}}}*/
/*_ open_details_parent {{{*/
let open_details_parent = function()
{
    let    pe = zoom_target.parentElement;
    while( pe ) {
        if(pe.tagName == "DETAILS") pe.open = true;
        pe = pe.parentElement;
    }
};
/*}}}*/
/*_ get_zoom_target_key {{{*/
let get_zoom_target_key = function()
{
    /* ...return cached first result {{{*/
    let zoom_target_key = "";
    if( zoom_target.zoom_target_key )
        zoom_target_key
            = zoom_target.zoom_target_key;

    /*}}}*/
    /* 1/4 zoom_target.id {{{*/
    if( zoom_target.id )
        zoom_target_key
            = zoom_target.id;

    /*}}}*/
    /* 2/4 IMG.scr file name {{{*/
    if( zoom_target.src )
        zoom_target_key
            = zoom_target.src.replace(/.*\/(\w+)\..*$/ , "$1");

    /*}}}*/
    /* 3/4 HTMLEvents XPath {{{*/
    if(!zoom_target_key) {
        zoom_target_key
            = js_xpath.get_nodeXPath_as_key( zoom_target );
//          = js_xpath.get_nodeXPath( zoom_target )
//        //.  replace(/.html.body.(.*).table/, "$1")
//          .  replace(/.html.body.(.*)/      , "$1")
//          .  replace(/[^\w]+/g              ,  "_")
//          .  replace(/(^_)|(_$)/            ,   "") ;
    }
    /*}}}*/
    /* 4/4 CONTENT WORDS {{{*/
    if(!zoom_target_key)
    {
        let  str = zoom_target.textContent.replace(/\W+/g," ").trim();
        if( !str ) {
            open_details_parent();
            str  = zoom_target.textContent.replace(/\W+/g," ").trim();
        }
        let      array = str.split(/\W+/);

        zoom_target_key = (array[0] ? (     array[0]) : "")
              + (array[1] ? ("_"+ array[1]) : "")
              + (array[2] ? ("_"+ array[2]) : "")
//            + (array[3] ? ("_"+ array[3]) : "")
//            + (array[4] ? ("_"+ array[4]) : "")
        ;
    }
    /*}}}*/
    /* ...save first result cache {{{*/
    zoom_target.zoom_target_key
        = zoom_target_key;

    /*}}}*/
if(log_this)
    console.log("%c get_zoom_target_key %c"+ zoom_target_key, bg5, bg6);
    return zoom_target_key;
};
/*}}}*/

// ┌────────────────────────────────────┐
// │ INIT ● STYLE ● DOWN UP CLICK       │
// └────────────────────────────────────┘
//{{{ ZOOM_TARGET_STYLE
const ZOOM_TARGET_STYLE = `
    .zoom_target {
      cursor                : grab;
      user-select           : none;
      outline               : groove 3px red;
/*    border                : groove 3px red; */
/*    margin                : 0 0; */
/*    transition            : transform 0.1s ease; */
    }
    .zoom_target * {
        pointer-events: none;
    }
    .zoom_target:active {
      cursor: grabbing;
    }
    #zoom_holder {
        background-color: #F004;
        outline         : 3px solid #AAA4;
        border-radius   : 0.5em;
    }
    .zoom_target_em   {  cursor: zoom-in; }

    .default_zoom_target.zoom_target {
        position            : fixed;
        top                 : 0;
        left                : 0;
    }
    .magnified {
        z-index: 100;
        cursor : zoom-out;
        opacity: 0.7;
    }
/*  .magnified.freezed { opacity: 1.0; } */
              .freezed { opacity: 1.0; }
              .freezed { background-color: black !important; }

    #zoom_of,
    #zoom_bb,
    #zoom_cp {
        z-index              :        1000;
        position             :       fixed;
        pointer-events       :        none;
        outline-width        :         5px;
        outline-style        :       solid;
        background-color     : transparent;
    }
    #zoom_of { outline-color :   red; background-color : #F001; } /* red   */
    #zoom_bb { outline-color : green; background-color : #0F01; } /* green */
    #zoom_cp { outline-color :  cyan; background-color : #0FF1; } /* cyan  */
`;
//}}} </style>
/*  init_zoom_target_style {{{*/
let styleElement;
let init_zoom_target_style = function()
{
if(log_this) console.log("%c ● init_zoom_target_style", bg2);

    /* create */
    styleElement           = document.createElement("STYLE");
    styleElement.type      = "text/css";
    styleElement.innerHTML = ZOOM_TARGET_STYLE;

    /* insert */
    let doc_el = document.documentElement;
    let body   = document.querySelector("BODY");
    doc_el.insertBefore(styleElement, body);
};
/*}}}*/
/*  init_default_listeners {{{*/
let init_default_listeners = function()
{
if(log_this) console.log("%c ● init_default_listeners", bg2);

    check_behavior_TOUCH_ELSE_DESKTOP();

    /* [PAGE] ● [HOVER ENTER LEAVE] ● [DRAG START END] */
    if( behavior_TOUCH_ELSE_DESKTOP ) {
        document.removeEventListener("pointermove", zt_on_move );
        document.removeEventListener("pointerup"  , zt_on_up   );
        document.addEventListener   ("touchmove"  , zt_on_move , CAPTURE_TRUE_PASSIVE_FALSE);
        document.addEventListener   ("touchend"   , zt_on_up   , CAPTURE_TRUE_PASSIVE_FALSE);
    }
    else {
        document.removeEventListener("touchmove"  , zt_on_move , CAPTURE_TRUE_PASSIVE_FALSE);
        document.removeEventListener("touchend"   , zt_on_up   , CAPTURE_TRUE_PASSIVE_FALSE);
        document.addEventListener   ("pointermove", zt_on_move );
        document.addEventListener   ("pointerup"  , zt_on_up   );
    }
    /* [DEFAULT TARGETS] */
    document.querySelectorAll(".default_zoom_target").forEach((img) => {
        if( behavior_TOUCH_ELSE_DESKTOP ) {
            img .removeEventListener("pointerdown", zt_on_down     );
            img .addEventListener   ("touchstart" , zt_on_down     );
        }
        else {
            img .removeEventListener("touchstart" , zt_on_down     );
            img .addEventListener   ("pointerdown", zt_on_down     );
        }
        img     .addEventListener   ("click"      , zt_on_click    );
    });
};
/*}}}*/

// ┌────────────────────────────────────┐
// │ LOAD ● UNLOAD                      │
// └────────────────────────────────────┘
/*● onload {{{*/
let onload = function(e)
{
/*{{{*/
if(log_this) console.log(SCRIPT_ID+" onload");

/*}}}*/

    window  .addEventListener("beforeunload", save_zoom_target);
    window  .addEventListener("resize"      , bring_into_view );

    //┌─────────────────────────────────────────────────────────┐
    //│ @see also: SCRIPTS/details.js details_onload            │
    //└─────────────────────────────────────────────────────────┘

    // ● RESTORE LAST SESSION OPENED DETAILS STATE
    setTimeout(load_zoom_target, 0);

    zoom_target_js.set_zoom_target();
};
/*}}}*/
/*○ save_zoom_target {{{*/
let save_zoom_target = function()
{
let caller = "save_zoom_target";
    //┌───────────────────────────────────────────────────────────────┐
    //│ SAVE    ● zoom_target XPath               into [localStorage] │
    //└───────────────────────────────────────────────────────────────┘
    let el  = document.querySelector(".zoom_target");

    let key = "zoom_target_xpath";
    let val = el && el.default_xpath
        ?     JSON.stringify( el.default_xpath ) // as saved by set_zoom_target()
        :     "";

    /* add zoom_target or clear localStorage */
    if( val ) js_store.localStorage_setItem( key , val);
    else      js_store.localStorage_delItem( key );

if(tag_this && el ) console.log("%c"+caller+"%c"+el.tagName+" "+el.id+" "+el.className, bg0,bg3);
if(tag_this && val) console.log("%c"+caller+"%c"+val                                  , bg0,bg8);
};
/*}}}*/
/*○ load_zoom_target {{{*/
let load_zoom_target = function()
{
let caller = "load_zoom_target";
    //┌───────────────────────────────────────────────────────────────┐
    //│ RESTORE ● zoom_target                     from [localStorage] │
    //└───────────────────────────────────────────────────────────────┘
    let val = js_store.localStorage_getItem("zoom_target_xpath");
    if(!val) return;

    let zoom_target_xpath = JSON.parse( val );

    let el = js_xpath.get_nodeXPath_target( zoom_target_xpath );
    if( el ) set_zoom_target({ target: el });
if(tag_this && el ) console.log("%c"+caller+"%c"+el.tagName+" "+el.id+" "+el.className, bg0,bg3);
if(tag_this && val) console.log("%c"+caller+"%c"+val                                  , bg0,bg8);
};
/*}}}*/
/*○ check_behavior_TOUCH_ELSE_DESKTOP {{{*/
//{{{
let behavior_TOUCH_ELSE_DESKTOP;

//}}}
let check_behavior_TOUCH_ELSE_DESKTOP = function()
{
    // ┌─────────────────────────────────────────────────────────┐
    // │ MUST RELOAD WHEN USING Devtools [Toggle Device Toolbar] │
    // └─────────────────────────────────────────────────────────┘
    let appVersion = navigator.appVersion.toLowerCase();
//console.log("appVersion=["+appVersion+"]");

    behavior_TOUCH_ELSE_DESKTOP
        =  !appVersion.includes("windows")
        && !appVersion.includes("hp"     )
        && !appVersion.includes("mac"    )
        && !appVersion.includes("sunos"  );
//{{{
if(tag_this) {
    if( behavior_TOUCH_ELSE_DESKTOP )
        console.log("%c "+SCRIPT_ID+" behavior %c TOUCH "  , bg0,bg6);
    else
        console.log("%c "+SCRIPT_ID+" behavior %c DESKTOP ", bg0,bg3);
}
//}}}

    if( behavior_TOUCH_ELSE_DESKTOP )
    {
        let el;
            el = document.getElementById("set_zoom_shiftKey_em");
        if( el ) el.style.display      = zoom_target ? "inline-block" : "none";

            el = document.getElementById("set_zoom_ctrlKey_em");
        if( el ) el.style.display      = zoom_target ? "inline-block" : "none";
    }
};
/*}}}*/
/*● toggle_touch_shiftKey {{{*/
//{{{
let touch_shiftKey_state;
//}}}
let toggle_touch_shiftKey = function(e)
{
    /* USER CLICK */
    if(e && e.target)
    {
        // tri-state
        if     (e.target.classList.contains("locked")) { e.target.classList.remove("locked"); e.target.classList.remove("active"); touch_shiftKey_state = false; }
        else if(touch_shiftKey_state                 )   e.target.classList.add   ("locked");
        else    touch_shiftKey_state                 =   e.target.classList.toggle("active");
        if(     touch_shiftKey_state )  zt_log("SHIFT"+(e.target.classList.contains("locked") ? "✔":""));
        else                            zt_log("");
    }
    else {
        let e_target  =  document.getElementById("set_zoom_shiftKey_em");
        if( e_target && !e_target.classList.contains("locked"))
            touch_shiftKey_state    = e_target.classList.toggle   ("active");
    }

    if(e && e.cancelable) {
        if( e.stopPropagation          ) e.stopPropagation         (); /* capturing and bubbling phases */
        if( e.stopImmediatePropagation ) e.stopImmediatePropagation(); /* other listeners of the same event */
        if( e.preventDefault           ) e.preventDefault          (); /* browser agent default .. (checkbox toggle) */
    }

//{{{
if(tag_this) console.log("%c touch_shiftKey_state %c "+touch_shiftKey_state, bg0, (touch_shiftKey_state ? bg4:bg8));
//}}}
};
/*}}}*/
/*● toggle_touch_ctrlKey {{{*/
//{{{
let touch_ctrlKey_state;
//}}}
let toggle_touch_ctrlKey = function(e)
{
    /* USER CLICK */
    if(e && e.target)
    {
        // tri-state
        if     (e.target.classList.contains("locked")) { e.target.classList.remove("locked"); e.target.classList.remove("active"); touch_ctrlKey_state = false; }
        else if(touch_ctrlKey_state                  )   e.target.classList.add   ("locked");
        else    touch_ctrlKey_state                  =   e.target.classList.toggle("active");
        if(     touch_ctrlKey_state )   zt_log("CNTRL" +(e.target.classList.contains("locked") ? "✔":""));
        else                            zt_log("");
    }
    else {
        let e_target  =  document.getElementById("set_zoom_ctrlKey_em");
        if( e_target && !e_target.classList.contains("locked"))
            touch_ctrlKey_state     = e_target.classList.toggle   ("active");
    }

    if(e && e.cancelable) {
        if( e.stopPropagation          ) e.stopPropagation         (); /* capturing and bubbling phases */
        if( e.stopImmediatePropagation ) e.stopImmediatePropagation(); /* other listeners of the same event */
        if( e.preventDefault           ) e.preventDefault          (); /* browser agent default .. (checkbox toggle) */
    }

//{{{
if(tag_this) console.log("%c touch_ctrlKey_state %c "+touch_ctrlKey_state, bg0, (touch_ctrlKey_state ? bg4:bg8));
//}}}
};
/*}}}*/

// ┌────────────────────────────────────┐
// │ LOG                                │
// └────────────────────────────────────┘
/*_ zt_log({{{*/
/*{{{*/
let set_zoom_target_em;
let fold_pane2;
/*}}}*/
let zt_log = function(msg,bgx=bg0)
{
if(tag_this || log_this)
    console.log("%c zt_log %c "+msg, bg0,bgx);//FIXME

    if(!set_zoom_target_em ) set_zoom_target_em           = document.getElementById("set_zoom_target_em");
    if( set_zoom_target_em ) set_zoom_target_em.style.setProperty("--after-content", "'"+msg+"'");

//  if(!fold_pane2         ) fold_pane2                   = document.getElementById("fold_pane2");
//  if( fold_pane2         ) fold_pane2.value             = msg;
};
/*}}}*/

// DEBUG {{{
// ┌─────────────────────────────────────┐
// │ [obc] to activate border hilighting │
// │  zb ●  zoom border                  │
// │  of ●  offset                       │
// │  bb ●  bounding box                 │
// │  cp ●  clip-path                    │
// └─────────────────────────────────────┘
/*_ set_debug_divs {{{*/
let set_debug_divs = function()
{
    zoom_of    = document.createElement("DIV");
    zoom_bb    = document.createElement("DIV");
    zoom_cp    = document.createElement("DIV");

    zoom_of.id = "zoom_of";
    zoom_bb.id = "zoom_bb";
    zoom_cp.id = "zoom_cp";

    let doc_el = document.documentElement;
    let body   = document.querySelector("BODY");

    doc_el.insertBefore(zoom_of, body);
    doc_el.insertBefore(zoom_bb, body);
    doc_el.insertBefore(zoom_cp, body);

    window.zo = zoom_of;
    window.zb = zoom_bb;
    window.zc = zoom_cp;

    add_debug_key_listener();
};
/*}}}*/
/*_ clr_debug_divs {{{*/
let clr_debug_divs = function()
{
    window.zt = zoom_target;

    last_charCode = null;
    zoom_of.style.display = "none";
    zoom_bb.style.display = "none";
    zoom_cp.style.display = "none";
};
/*}}}*/
/*_ add_debug_key_listener [ o b c ] {{{*/
// CHAR_CODE {{{
const CHAR_CODE_O = 79;
const CHAR_CODE_B = 66;
const CHAR_CODE_C = 67;
const CHAR_CODE_ARRAY = [
      CHAR_CODE_O
    , CHAR_CODE_B
    , CHAR_CODE_C
];
let   last_charCode;

const CAPTURE_TRUE_PASSIVE_FALSE  = { capture:true , passive:false };
//}}}
let add_debug_key_listener = function(e)
{
if(log_debug) console.log("%c log_debug ●●● add_debug_key_listener", CS);

    document.body.addEventListener("keydown", key_listener, CAPTURE_TRUE_PASSIVE_FALSE);
    document.body.addEventListener("keyup"  , key_listener, CAPTURE_TRUE_PASSIVE_FALSE);
};

let key_listener = function(e)
{
    if(e.type != "keydown") return;

    let charCode = (e.keyCode) ? e.keyCode : e.which;
    if(!CHAR_CODE_ARRAY.includes( charCode ))
        return;

if(log_debug) console_clr("KEY");

        let key = String.fromCharCode( e.keyCode );
if(log_debug) console.log("●○○ key_listener("+ key +") DOWN");

        last_charCode = (e.keyCode) ? e.keyCode : e.which;
if(log_debug) zb_update("KEY "+ key);

    if(e.cancelable) {
        if( e.stopPropagation          ) e.stopPropagation         (); /* capturing and bubbling phases */
        if( e.stopImmediatePropagation ) e.stopImmediatePropagation(); /* other listeners of the same event */
        if( e.preventDefault           ) e.preventDefault          (); /* browser agent default .. (checkbox toggle) */
    }
};
/*}}}*/
/*_ zb_update {{{*/
let zb_update = function(action,set_last_charCode="")
{
    if(set_last_charCode) last_charCode = set_last_charCode;

    if( !last_charCode ) return;    // DEBUG NOT YET ACTIVATED

if(log_debug) console_clr("DEBUG");
if(log_debug) console.log("○●○ zb_update ● "+ action);

    zoom_of.style.display = "";
    zoom_bb.style.display = "";
    zoom_cp.style.display = "";

    if( zoom_target )
    {
        zb_of(); // offset
        zb_bb(); // BoundingClientRect
        zb_cp(); // clip-path
    }
};
/*}}}*/
/*_ zb_of {{{*/
let zb_of = function()
{
    if(!zoom_target) return;

if(log_debug) console.log("○○● zb_of");
    let  rect = { left: zoom_target.offsetLeft
        ,          top: zoom_target.offsetTop
        ,        width: zoom_target.offsetWidth
        ,       height: zoom_target.offsetHeight };

    zoom_of.style.top    = (rect.top    )+"px";
    zoom_of.style.left   = (rect.left   )+"px";
    zoom_of.style.width  = (rect.width  )+"px";
    zoom_of.style.height = (rect.height )+"px";
};
/*}}}*/
/*_ zb_bb {{{*/
let zb_bb = function()
{
    if(!zoom_target) return;

if(log_debug) console.log("○○● zb_bb");
    let rect = zoom_target.getBoundingClientRect();
    //  rect.top    = parseInt( rect.top    );
    //  rect.left   = parseInt( rect.left   );
    //  rect.width  = parseInt( rect.width  );
    //  rect.height = parseInt( rect.height );

    zoom_bb.style.top    = parseInt(rect.top    )+"px";
    zoom_bb.style.left   = parseInt(rect.left   )+"px";
    zoom_bb.style.width  = parseInt(rect.width  )+"px";
    zoom_bb.style.height = parseInt(rect.height )+"px";
};
/*}}}*/
/*_ zb_cp {{{*/
let zb_cp = function()
{
    if(!zoom_target) return;

if(log_debug) console.log("○○● zb_cp");

//  let rect = zoom_target.getBoundingClientRect();
    let rect = {  top: zoom_target.offsetTop
        ,        left: zoom_target.offsetLeft
        ,       width: zoom_target.offsetWidth
        ,      height: zoom_target.offsetHeight };

    let  urdl = get_clipPath_urdl();
    let inset = (   (urdl.u != 0)
                 || (urdl.r != 0)
                 || (urdl.d != 0)
                 || (urdl.l != 0))
        ? { top    : (urdl.u         )
          , left   : (urdl.l         )
          , width  : (urdl.l + urdl.r)
          , height : (urdl.u + urdl.d)
        }
        : { top    : (urdl.u         )
          , left   : (urdl.l         )
          , width  : (rect.width  - 8)
          , height : (rect.height - 8)
        };

    zoom_cp.style.top    = parseInt(rect.top    + inset.top   ) +"px";
    zoom_cp.style.left   = parseInt(rect.left   + inset.left  ) +"px";
    zoom_cp.style.width  = parseInt(rect.width  - inset.width ) +"px";
    zoom_cp.style.height = parseInt(rect.height - inset.height) +"px";
};
/*}}}*/
/*_ console_clr {{{*/
/*{{{*/
const CONSOLE_CLEAR_COOLDOWN_DELAY = 1000;

const SHV = "\u26A1"; /* HIGH VOLTAGE SIGN ⚡*/
const CS  = "font-size:200%; color: gray; background:black; border:3px solid gray; border-radius:1em; padding:0 1em; font-style:oblique;";

const lbH = "font-weight:900; line-height:1.5em; border:1px solid gray; margin:   0 1ex 1ex   0; padding:0 .5em 0 .5em; border-radius:1em 1em 1em 1em; background:linear-gradient(to bottom, #555 0%, #223 80%, #454 100%);";
const lf8 = "color:#A0A0A0;";

let console_clear_cooldown_timeout;
let msg_prev;
/*}}}*/
let console_clr        = function(msg=null) { console_clear_post(msg); };
let console_clear_post = function(msg=null)
{
    if( console_clear_cooldown_timeout && (msg != msg_prev))
    {
        if( msg )
            console.log("%c cleared by "+SHV+msg+SHV+" %c LOG PRESERVED FOR "+CONSOLE_CLEAR_COOLDOWN_DELAY+"ms", CS, lbH+lf8);
    }
    else {
        console.clear();
        if( msg ) {
            console.log("%c cleared by "+SHV+msg+SHV, CS);
            msg_prev = msg;
        }

        console_clear_cooldown_timeout
            = setTimeout( function() { console_clear_cooldown_timeout = null; }
                        , CONSOLE_CLEAR_COOLDOWN_DELAY);
    }
};
/*}}}*/
/*_ log_zoom_target {{{*/
let log_zoom_target = function()
{
    if(!zoom_target) return "NO CURRENT [zoom_target]";

    /* offset */
    let of    = { x: zoom_target.offsetLeft
        ,         y: zoom_target.offsetTop
        ,     width: zoom_target.offsetWidth
        ,    height: zoom_target.offsetHeight
    };

    /* origin */
    let to                              = get_transformOrigin();

    /* translate */
    let t                               = get_translate();

    /* clip */
    let {   bb,   bb_OTV, BB_OTV
        , clip, clip_OTV, CL_OTV } = get_clip_out_of_view();

    /* clip-path */
    let urdl  = get_clipPath_urdl();

    /* log */
  //return            "zoom_target " +  zoom_target.tagName + " 🔎"  + get_scale().toPrecision(2)   + " .. "
    return                            get_zoom_target_key() + " 🔎"  + get_scale().toPrecision(2)   +  "🔍 "
  //return             js_xpath.get_nodeXPath( zoom_target) + " 🔎"  + get_scale().toPrecision(2)   +  "🔍 "
        +                      "of ["+     of.x +" "+  of.y + " ■■ " + of.width   +" "+ of.height   +"] .. "
        +                      "BB ["+     bb.x +" "+  bb.y + BB_OTV + bb.width   +" "+ bb.height   +"] .. "
        +                    "clip ["+  clip.x +" "+ clip.y + CL_OTV + clip.width +" "+ clip.height +"] .. "
        +               "translate ["+                  t.x +  " "   + t.y                          +"] .. "
        +                      "TO ["+                 to.x +  " "   + to.y                         +"] .. "
        + "cp "+zoom_target.cp_w+" ["+   urdl.u+" "+ urdl.r +  " "   + urdl.d     +" "+ urdl.l      +"]"
    ;

};
/*}}}*/

// ┌────────────────────────────────────────────────────────────────────────────┐
// │ DEBUG ● Devtools live expression:                                          │
// ├────────────────────────────────────────────────────────────────────────────┤
// │ ● [zoom_target_js.log_zoom_target()]                                       │
// │ ● [(document.querySelector(".zoom_target") || {}).className]               │
// └────────────────────────────────────────────────────────────────────────────┘
// @see $BROWSEEXT/RTabsExtension/stylesheet/dom_host.css

//}}}

/* EXPORT ● set_zoom_target {{{*/
return { name : SCRIPT_ID
        , onload
        , set_zoom_target
        , release_zoom_target
        , log_zoom_target
    // DEBUG
    , bring_into_view
    , check_behavior_TOUCH_ELSE_DESKTOP
    , load_zoom_target
    , save_zoom_target
    , set_scale
    , toggle_touch_ctrlKey
    , toggle_touch_shiftKey

    , set_clipPath_xy_wh
};

/*}}}*/
}());
document.addEventListener("DOMContentLoaded", zoom_target_js.onload);
