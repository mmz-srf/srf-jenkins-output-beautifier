// ==UserScript==
// @name         Jenkins-Deployment-Beautifier
// @namespace    http://tampermonkey.net/
// @version      0.3
// @description  Make CMS Deployments easily searchable
// @author       SRFCMS
// @match        */job/cms-deployment-*/*/console*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(() => {
    $(() => {
        const ACTIVE_CLASS = "srf-interesting-span--marked";
        const INTERESTING_CLASS = "srf-interesting-span";

        let $button = $('<button class="srf-btn srf-btn--init">Help me!</button>');
        $('.build-caption.page-headline').append($button);

        $button.on('click', () => {
            let consoleContent = $('.console-output').html();

            collectInterestingSpans();
            createJumpButtons();

            markInterestingSpan($(`.${INTERESTING_CLASS}`).first());

            $button.remove();
        });

        let createJumpButtons = () => {
            let $prevBtn = $('<button class="srf-btn srf-btn--prev">Previous</button>');
            let $nextBtn = $('<button class="srf-btn srf-btn--next">Next</button>');
            let $topBtn = $('<button class="srf-btn srf-btn--top">Jump to top</button>');
            let $bottomBtn = $('<button class="srf-btn srf-btn--bottom">Jump to bottom</button>');

            $prevBtn.on("click", onPrevClick);
            $nextBtn.on("click", onNextClick);
            $topBtn.on("click", onTopClick);
            $bottomBtn.on("click", onBottomClick);

            $('body').append($prevBtn, $nextBtn, $topBtn, $bottomBtn);
        };

        let collectInterestingSpans = () => {
            // Add more criteria here
            $('span[style*="color: #CD0000"]').addClass(INTERESTING_CLASS);
        };

        let markInterestingSpan = ($span) => {
            $span.addClass(ACTIVE_CLASS);
            $span.focus();

            scrollTo($span.offset().top);
        };

        let onPrevClick = () => {
            let $markedSpan = $(`.${ACTIVE_CLASS}`);

            if ($markedSpan.length === 0) {
                markInterestingSpan($(`.${INTERESTING_CLASS}`).last());
            } else {
                let $prevElem = $markedSpan.prevAll(`.${INTERESTING_CLASS}`).first();
                if ($prevElem.length > 0) {
                    markInterestingSpan($prevElem);
                    $markedSpan.removeClass(ACTIVE_CLASS);
                }
            }
        };

        let onNextClick = () => {
            let $markedSpan = $(`.${ACTIVE_CLASS}`);

            if ($markedSpan.length === 0) {
                markInterestingSpan($(`.${INTERESTING_CLASS}`).first());
            } else {
                let $nextElem = $markedSpan.nextAll(`.${INTERESTING_CLASS}`).first();
                if ($nextElem.length > 0) {
                    markInterestingSpan($nextElem);
                    $markedSpan.removeClass(ACTIVE_CLASS);
                }
            }
        };

        let onTopClick = () => {
            scrollTo(0);
        };

        let onBottomClick = () => {
            scrollTo($(document).height());
        };

        let scrollTo = (targetHeight) => {
            $("html, body").stop(true, true).animate({ scrollTop: targetHeight }, 500);
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
            .${ACTIVE_CLASS} {
                border: 1px solid red;
                padding: 3px;
                display: inline-block;
            }
            .srf-btn {
                z-index: 1000;
                position: fixed;
                top: 80px;
                right: 100px;
                padding: 8px 16px;
            }
            .srf-btn--prev {
                right: 180px;
            }
            .srf-btn--init {
                position: initial;
                margin-left: 24px;
            }
            .srf-btn--top {
                top: 40px;
            }
            .srf-btn--bottom {
                top: 120px;
            }
            `
        );
    });
})();
