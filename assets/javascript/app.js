"use strict";

function dsmApp(){
    var that = this,
        isTouch,
        params = {};

    params.googleMapAddress = false;

    if(typeof dsmApp.instance === 'object'){
        return dsmApp.instance;
    }

    if(document.createTouch !== undefined){
        $('html').addClass('dsm-touch');
        $('body').attr('ontouchstart', '');
    }else{
        $('html').addClass('dsm-notouch');
    }

    isTouch = document.querySelector('.dsm-touch') || false;

    // Main menu hover states
    var menuTrigger = {
        hoverIn: function(){
            var $cur = $(this), $el = $cur.find('.b-menu_sub').first();
            if(!$cur.parent().hasClass('b-menu_sub')) {
                $cur.addClass('b-menu__item_js_hover');
            }
            else{
                $cur.addClass('b-menu__item_js_hover-ext');
            }
            $el.css({'display': 'block', 'height': 'auto', 'overflow': 'hidden'});
            var height = $el.outerHeight();
            $el.css('padding', '0px 0px');

            $el.css('height', 0);

            $el.velocity('stop');
            $el.velocity({
                paddingTop: 8,
                paddingBottom: 8,
                height: height
            }, {
                delay: ($cur.hasClass('b-menu__item_active') || $cur.parent().hasClass('b-menu_sub'))? 0 : 300,
                duration: 200,
                easing: 'ease-in',
                complete: function(){
                    $el.css('overflow', 'visible');
                }
            });
        },
        hoverOut: function(){
            var $sub = $(this).find('.b-menu_sub'),
                $el = $(this);
            if ($sub.length) {
                $sub.css('overflow', 'hidden');
                $sub.velocity('stop');
                $sub.velocity({
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: 0
                }, {
                    duration: 200,
                    easing: 'ease-in',
                    complete: function () {
                        $sub.removeAttr('style');
                        $el.removeClass('b-menu__item_js_hover');
                        $el.removeClass('b-menu__item_js_hover-ext');
                    }
                });
            } else {
                $el.removeClass('b-menu__item_js_hover');
                $el.removeClass('b-menu__item_js_hover-ext');
            }
        },
        initMenuTrigger: function(){
            if(!isTouch) {
                $('[data-trigger]').hover(menuTrigger.hoverIn, menuTrigger.hoverOut);
            }
        }
    }

    var slickCarousel = {
        init: function(){
            if(typeof $.fn.slick !== 'function'){
                throw new Error('Slick carousel is not defined');
            }

            $('[data-carousel]').slick({
                slidesToShow: 4,
                slidesToScroll: 1,
                swipe: true,
                dots: false,
                centerMode: false,
                focusOnSelect: false,
                centerPadding: '0px',
                infinite: false,
                variableWidth: true,
                prevArrow: $('[data-scroll-prev]'),
                nextArrow: $('[data-scroll-next]')
            });

        }
    }

    var googleMaps = {
        setAddress: function(val){
            params.googleMapAddress = val;
            return this;
        },

        init: function(){
            if(!params.googleMapAddress){
                throw new Error('Before call init set address please(googleMaps)')
            }
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'address': params.googleMapAddress }, function(results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    var mapEl = document.querySelector('[data-map]');
                    if(mapEl) {
                        var map = new google.maps.Map(mapEl, {
                            zoom: 18,
                            mapTypeId: google.maps.MapTypeId.ROADMAP
                        });
                        map.setCenter(results[0].geometry.location);
                        var marker = new google.maps.Marker({
                            map: map,
                            position: results[0].geometry.location
                        });
                    }
                }
            })
        }
    }

    var parallax = {
        init: function(){
            if(!isTouch){
                var s = skrollr.init();
            }
        }
    }

    that.initMenuTrigger = menuTrigger.initMenuTrigger;
    that.initSlick = slickCarousel.init;
    that.googleMap = googleMaps;
    that.parallaxInit = parallax.init;

    dsmApp.instance = that;
}

document.addEventListener( "DOMContentLoaded", function(){
    var app = new dsmApp();
    app.initMenuTrigger();
    app.initSlick();
    app.googleMap.setAddress('г. Владивосток ул. Русская 9б-602').init();
    app.parallaxInit();
}, false );