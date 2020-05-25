// ==UserScript==
// @name         Get me Old Youtube
// @namespace    http://greasyfork.org/en/scripts/32906
// @version      1.2.5
// @description  Sets a Cookie which loads the old Youtube layout (as long as available)
// @author       Artain
// @match        *://www.youtube.com/*
// @exclude      *://www.youtube.com/tv*
// @exclude      *://www.youtube.com/embed/*
// @exclude      *://www.youtube.com/live_chat*
// @exclude      *://www.youtube.com/feed/subscriptions?flow=2*
// @require      https://gist.github.com/raw/2625891/waitForKeyElements.js
// @require      https://code.jquery.com/jquery-2.x-git.min.js
// @run-at       document-start
// @homepageURL  http://greasyfork.org/en/scripts/32906
// @license      https://creativecommons.org/licenses/by-sa/4.0/
// @grant        none
// ==/UserScript==
// Based on 1.2.4 - removes the "Going away soon" banner.
// Enables only if Cookie value is set.
(function() {
    'use strict';
   // if ($('.alerts-wrapper')){$('.alerts-wrapper').remove();}
    function start() {
        var cookie = getPref(),
            pref = "f6=8";
        if(cookie === "fIsAlreadySet") {
            waitForKeyElements(".alerts-wrapper", function(){$('.alerts-wrapper').remove()});
            return;
        } else if(cookie !== "noPref"){
            for(var i = 0; i < cookie.length; ++i) {
                pref = pref + "&" + cookie[i].key + "=" + cookie[i].value;
            }
        }
        changePref(pref);
    }

    function changePref(values) {
        var d = new Date();
        d.setTime(d.getTime() + (100*24*60*60*1000));
        var expires = "expires="+ d.toUTCString();
        document.cookie = "PREF=" + values + ";" + expires + ";domain=.youtube.com;hostonly=false;path=/";
        location.reload();
    }

    function getPref() {
        var cookie = document.cookie,
            splitC = cookie.split(";");
        for(var i = 0; i < splitC.length; ++i) {
            if(splitC[i].trim().indexOf("PREF") === 0) {
                if(splitC[i].trim().indexOf("f6=8") > -1) {
                    return "fIsAlreadySet";
                }
                var c = [],
                    splitValues = splitC[i].trim().substring(5).split("&");
                for(var k = 0; k < splitValues.length; ++k) {
                    var splitV = splitValues[k].split("=");
                    if(splitV[0] !== "f6") {
                        var kv = {};
                        kv.key = splitV[0];
                        kv.value = splitV[1];
                        c.push(kv);
                    }
                }
                return c;
            }
        }
        return "noPref";
    }
    start();
})();