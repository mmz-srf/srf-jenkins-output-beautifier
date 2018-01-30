// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cms-ci-1.zrh.test.srf.mpc/job/cms-deployment-*/*/console*
// @grant        none
// @require http://code.jquery.com/jquery-latest.js
// ==/UserScript==

(function() {
    $(function() {

        var button = $('<button>Help me!</button>');
        $('.build-caption.page-headline').append(button);
        button.on('click', function(){
            console.log($('.console-output').html());
        })
    });
})();