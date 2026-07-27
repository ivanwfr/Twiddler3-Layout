// ┌───────────────────────────────────────────────────────────────────────────┐
// | SCRIPTS/js_xpath.js                                  _TAG (260722:16h:36) ●
// └───────────────────────────────────────────────────────────────────────────┘
/* jshint esversion: 9, laxbreak:true, laxcomma:true, boss:true {{{*/

/* eslint-disable no-unused-vars */

/* globals console */

/* exported js_xpath */

const SCRIPT_ID  = "js_xpath";
/*}}}*/
let js_xpath = (function() {
"use strict";
/*➔ get_nodeXPath {{{*/
let get_nodeXPath = function(node)
{
    if(node ==         window  ) return "window";
    if(node instanceof Document) return "window.document";

    let  node_type_pos_array;
    for( node_type_pos_array = []
    ;    node && !(node instanceof Document)
    ;    node =   (node.nodeType == Node.ATTRIBUTE_NODE)
              ?    node.ownerElement
              :    node.parentNode
    ) {
        let node_type_pos = {};

        /* TYPE */
        switch( node.nodeType ) {
            case Node.TEXT_NODE                   : node_type_pos.name =                   "text"; break;
            case Node.ATTRIBUTE_NODE              : node_type_pos.name =      "@" + node.nodeName; break;
            case Node.PROCESSING_INSTRUCTION_NODE : node_type_pos.name = "processing-instruction"; break;
            case Node.COMMENT_NODE                : node_type_pos.name =                "comment"; break;
            case Node.ELEMENT_NODE                : node_type_pos.name =            node.nodeName; break;
        }

        /* POS */
        node_type_pos.position = get_sibling_rank( node );

        node_type_pos_array.push( node_type_pos );
    }

    let xpath = "";
    for(let i=node_type_pos_array.length-1; i >= 0; i -= 1)
    {
        let node_type_pos   = node_type_pos_array[i];
        xpath += node_type_pos.name ? ("/"+node_type_pos.name) : ".";
        if((node_type_pos.position != null) && (node_type_pos.position != "1"))
            xpath += "["+ node_type_pos.position+"]";
    }

    xpath = xpath.toLowerCase();

//  if( xpath_base && xpath.startsWith( xpath_base ))
//      xpath =        xpath.substring( xpath_base.length+1 );

    return xpath;
};
/*}}}*/
/*_ get_nodeXPath_as_key {{{*/
let get_nodeXPath_as_key = function(node)
{
    let key = get_nodeXPath( node )
        .      replace(/.html.body.(.*)/,  "$1")
        .      replace(/[^\w]+/g        ,   "_")
        .      replace(/(^_)|(_$)/      ,    "");

    return key;
};
/*}}}*/
/*➔ get_nodeXPath_target {{{*/
let get_nodeXPath_target = function(nodeXPath)
{
    let first_node;
    try {

        let evaluator  = new XPathEvaluator();
        let expression = evaluator.createExpression(nodeXPath);

        let result     = expression.evaluate(document, XPathResult.ORDERED_NODE_ITERATOR_TYPE);

        let node;
        while(node = result.iterateNext())
        {
            if(!first_node)
                first_node = node;
        }

    }
    catch(ex) {
        console.log(ex);
    }
    return first_node;
};
/*}}}*/
/*_ get_sibling_rank {{{*/
let get_sibling_rank = function(node)
{
    if(node.nodeType == Node.ATTRIBUTE_NODE) return null;

    let rank = 1;
    for(let prev_node =      node.previousElementSibling
    ;       prev_node
    ;       prev_node = prev_node.previousElementSibling
    ) {
        if(prev_node.nodeName == node.nodeName)
            rank += 1;
    }
    return rank;
 };
/*}}}*/
/* EXPORT {{{*/
return {  name : SCRIPT_ID
    ,            get_nodeXPath
    ,            get_nodeXPath_as_key
    ,            get_nodeXPath_target
};
/*}}}*/
})();
