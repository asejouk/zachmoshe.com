/**
 * Main JS file for Casper behaviours
 */

/*globals jQuery, document */
(function ($) {
    "use strict";

    $(document).ready(function(){

        $(".post-content").fitVids();
        
        // Calculates Reading Time
        $('.post-content').readingTime({
            readingTimeTarget: '.post-reading-time',
            wordCountTarget: '.post-word-count',
        });
        
        // Creates Captions from Alt tags
        $(".post-content img").each(function() {
            // Let's put a caption if there is one
            if($(this).attr("alt"))
              $(this).wrap('<figure class="image"></figure>')
              .after('<figcaption>'+$(this).attr("alt")+'</figcaption>');
        });

        // activate sliders if any
        if ($(".bxSlider").size() > 0) { 
            $(".bxslider").bxSlider({
                mode: 'fade',
                infiniteLoop: false,
                hideControlOnEnd: true,
                responsive: false
            })
        }

        // hide all math after .showmath
        $(".showmath").next("p,mathpart").find("mathpart").hide()
        $(".showmath").click(function() { 
            $(this).next("p,mathpart").find("mathpart").slideToggle();
        })
        
    });

}(jQuery));