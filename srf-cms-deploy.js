// ==UserScript==
// @name         Jenkins-Deployment-Beautifier
// @namespace    http://tampermonkey.net/
// @version      0.2
// @description  Make CMS Deployments easily searchable
// @author       SRFCMS
// @match        */job/cms-deployment-*/*/console*
// @grant        none
// @require      https://code.jquery.com/jquery-3.3.1.min.js
// ==/UserScript==

(() => {
    $(() => {
        const ACTIVE_CLASS = "srf-interesting-span--marked";

        let button = $('<button class="srf-btn srf-btn--init">Help me!</button>');
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
            $('span[style*="color: #CD0000"]').addClass("srf-interesting-span");
        };

        let markInterestingSpan = ($span) => {
            $span.addClass(ACTIVE_CLASS);
            $span.focus();

            $('html, body').animate({
                scrollTop: $span.offset().top
            }, 1000);
        };

        let onPrevClick = () => {
            let $markedSpan = $(`.${ACTIVE_CLASS}`);

            if ($markedSpan.length === 0) {
                markInterestingSpan($(".srf-interesting-span").last());
            } else {
                let $prevElem = $markedSpan.prevAll(".srf-interesting-span").first();
                if ($prevElem.length > 0) {
                    markInterestingSpan($prevElem);
                    $markedSpan.removeClass(ACTIVE_CLASS);
                }
            }
        };

        let onNextClick = () => {
            let $markedSpan = $(`.${ACTIVE_CLASS}`);

            if ($markedSpan.length === 0) {
                markInterestingSpan($(".srf-interesting-span").first());
            } else {
                let $nextElem = $markedSpan.nextAll(".srf-interesting-span").first();
                if ($nextElem.length > 0) {
                    markInterestingSpan($nextElem);
                    $markedSpan.removeClass(ACTIVE_CLASS);
                }
            }
        };

        let onTopClick = () => {
            $("html, body").animate({ scrollTop: 0 }, 500);
        };

        let onBottomClick = () => {
            $("html, body").animate({ scrollTop: $(document).height() }, 500);
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
