let js_store = (function() {
"use strict";
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true {{{*/

/* eslint-disable no-unused-vars */

/* globals console */

/* exported js_store */

const SCRIPT_ID  = "js_store";
const SCRIPT_TAG = SCRIPT_ID+" (260701:19h:28)";
/*}}}*/

/* ● set ● get ● del {{{*/
let setItem = function(key, val) {          try { if(val)  localStorage.setItem   (key,val); else localStorage.removeItem(key); } catch(ex) {} return val; };
let getItem = function(key     ) { let val; try {    val = localStorage.getItem   (key    );                                    } catch(ex) {} return val; };
let delItem = function(key     ) {          try { /*...*/  localStorage.removeItem(key    );                                    } catch(ex) {} };
/*}}}*/

// ┌───────────────────────────────────────────────────────────────────────────┐
// │ Page title or URL signature                                               │
// └───────────────────────────────────────────────────────────────────────────┘
/*  get_page_prefix {{{*/
let     page_prefix = "";
let get_page_prefix = function()
{
    if(!page_prefix )
    {
        /* FROM PAGE TITLE */
        let title = document.querySelector("TITLE");
        if( title ) {
            page_prefix
                = title.textContent
                .  replace(/.*● */g,  "")
                .  replace(/\s/g   , "_")
            ;
        }

        /* FROM LOCATION */
        else {
            page_prefix
                = document.URL.replace(/(.*\/)|(\..*)/g,"");
        }

    }
    return page_prefix
};
/*}}}*/

/* EXPORT {{{*/
return {  name : SCRIPT_ID
    ,      tag : SCRIPT_TAG
    ,            localStorage_setItem : (key, val) => setItem(get_page_prefix() +"."+ key, val)
    ,            localStorage_getItem : (key     ) => getItem(get_page_prefix() +"."+ key     )
    ,            localStorage_delItem : (key     ) => delItem(get_page_prefix() +"."+ key     )
    // DEBUG
    , get_page_prefix
};
/*}}}*/
})();
