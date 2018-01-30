// ==UserScript==
// @name         New Userscript
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  try to take over the world!
// @author       You
// @match        https://cms-ci-1.zrh.test.srf.mpc/job/cms-deployment-*/*/console*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(() => {
    $(() => {
        const ACTIVE_CLASS = "srf-interesting-span--marked";

        let button = $('<button>Help me!</button>');
        $('.build-caption.page-headline').append(button);

        button.on('click', () => {
            let consoleContent = $('.console-output').html();

            collectInterestingSpans();
            createJumpButtons();
        });

        let redSpans = $('span[style*="color: #CD0000"]');

        let createJumpButtons = () => {
            let $prevBtn = $('<button class="srf-btn srf-btn--prev">Previous</button>');
            let $nextBtn = $('<button class="srf-btn srf-btn--next">Next</button>');

            $prevBtn.on("click", () => {
                let $markedSpan = $(`.${ACTIVE_CLASS}`);

                if ($markedSpan.length === 0) {
                    markInterestingSpan($(".srf-interesting-span").last());
                } else {
                    let $prevElem = $markedSpan.prev(".srf-interesting-span");
                    if ($prevElem) {
                        markInterestingSpan($prevElem);
                        $markedSpan.removeClass(ACTIVE_CLASS);
                    }
                }
            });

            $nextBtn.on("click", () => {
                let $markedSpan = $(`.${ACTIVE_CLASS}`);

                if ($markedSpan.length === 0) {
                    markInterestingSpan($(".srf-interesting-span").first());
                } else {
                    let $nextElem = $markedSpan.next(".srf-interesting-span");
                    if ($nextElem) {
                        markInterestingSpan($nextElem);
                        $markedSpan.removeClass(ACTIVE_CLASS);
                    }
                }
            });

            $('body').append($prevBtn);
            $('body').append($nextBtn);
        };

        let collectInterestingSpans = () => {
            $('span[style*="color: #CD0000"]').addClass("srf-interesting-span");
        };

        let markInterestingSpan = ($span) => {
            $span.addClass(ACTIVE_CLASS);
            $span.focus();

            $('html, body').animate({
                scrollTop: $span.offset().top
            }, 1000);
        };





        let addCss = (cssString) => {
            var head = document.getElementsByTagName('head')[0];
            if(!head) return;

            var newCss = document.createElement('style');
            newCss.type = "text/css";
            newCss.innerHTML = cssString;
            head.appendChild(newCss);
        };

        addCss (
            `
            .srf-interesting-span--marked {
                border: 1px solid red;
                padding: 3px;
                display: inline-block;
            }
            .srf-btn {
                position: fixed;
                top: 40px;
                right: 100px;
                padding: 8px 16px;
            }
            
            .srf-btn--prev {
                right: 180px;
            }
            `
        );
    });
})();