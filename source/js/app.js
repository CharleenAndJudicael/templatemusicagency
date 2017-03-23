// This is the custom javascript file 

jQuery(document).ready(function($) {
    "use strict";

    // === Header Menu Button ===
    $('#menu-button').on('click',function(e){
        e.preventDefault();
        $(this).toggleClass('close-icon');
        $('#main-nav').toggleClass('fade');
    });
    $('#main-nav').on('click',function(){
        $('#menu-button').removeClass('close-icon');
        $('#main-nav').removeClass('fade');
    });

 

    // === Sidebar Instagram Widget ===
    var feedSidebar = new Instafeed({
        //get: 'tagged',
        //tagName: 'NichifyPerspectives', // place your tage here
        get: 'user',
        userId: 2143300160,
        sortBy: 'most-liked',
        clientId: 'b65a53a5cc0540769b7cf79ea333348c', // place the client id here
        template: '<li><a href="{{link}}" target="_blank"><img class="img-responsive" src="{{image}}" /></a></li>',
        target: 'instagram-sidebar-widget',
        limit: 8,
        resolution: 'low_resolution',
    });
    if ($('#instagram-sidebar-widget').length>0) {
        feedSidebar.run();
    }

    
    
    

    // === ScrollTo annimation ===
    $('.scrollTo').on('click',function (e) {
        e.preventDefault();
        var target = this.hash,
        $target = $(target);
        if ($(target).length>0) {
            $('body, html').stop().animate({
                'scrollTop': $(target).offset().top-0
            }, 1000, 'swing', 
            function() {
                window.location.hash = target;
            });
        }
    }); // End Click  

    // === Go to top ===
    $('.go-to-top').click(function(){
        $('html, body').animate({scrollTop:0}, 'slow');
        return false;
    }); 

    // === Header Nav BG ===
    $(window).scroll(function(){
        if($(document).scrollTop() > 150)
        {    
            $('.navigation-bar').addClass('scroll-BG');
        }
        else
        {  
           $('.navigation-bar').removeClass('scroll-BG');
        }
    });

    // === Header Parallax Image Style ===
    $(window).on('scroll', function(){
        var curPos = $(window).scrollTop();
        $('.header-parallax-image').css('background-position', 'right bottom -' + curPos * .8 + 'px');
        //fadePanels(curPos);
    }).scroll();

});// END READY