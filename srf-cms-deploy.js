// ==UserScript==
// @name         Jenkins-Deployment-Beautifier
// @namespace    http://tampermonkey.net/
// @version      0.6
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

        if ($(".build-caption.page-headline img").attr("alt") === "Failed") {
            $('.build-caption.page-headline').append($button);
        }

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

            let $hideStuffBtn = $('<button class="srf-btn srf-btn--hide-stuff">Hide Stuff</button>');

            $prevBtn.on("click", onPrevClick);
            $nextBtn.on("click", onNextClick);
            $topBtn.on("click", onTopClick);
            $bottomBtn.on("click", onBottomClick);
            $hideStuffBtn.on("click", onHideStuffClick);

            $('body').append($prevBtn, $nextBtn, $topBtn, $bottomBtn, $hideStuffBtn);
        };

        let collectInterestingSpans = () => {
            // Add more criteria here
            $('span[style*="color: #CD0000"]').addClass(INTERESTING_CLASS);
        };

        let collectBoringSpans = () => {
            $(".console-output span").not(`.${INTERESTING_CLASS}`).each((i, elem) => {
                if ($(elem).height() > 20) {
                    $(elem).addClass("srf-span--collapsable srf-span--collapsed");
                }
            });

            $(".srf-span--collapsable").on("click", (event) => {
                $(event.target).toggleClass("srf-span--collapsed");
            });
        };

        let markInterestingSpan = ($span) => {
            $span.addClass(ACTIVE_CLASS);
            $span.focus();

            scrollTo($span.offset().top);
        };

        let onHideStuffClick = () => {
            $(".srf-btn--hide-stuff").hide();
            collectBoringSpans();
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
            .srf-span--collapsable {
                position: relative;
                display: block;
                padding-left: 20px;
                margin-left: -20px;
            }
            .srf-span--collapsed {
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                max-width: 768px;
            }
            .srf-span--collapsable:before {
                content: "-";
                position: absolute;
                left: 0px;
                font-size: 24px;
                color: black;
            }
            .srf-span--collapsed:before {
                content: "+";
            }
            .srf-btn--hide-stuff {
                bottom: 20px;
                top: auto;
            }
            `
        );
    });
})();
