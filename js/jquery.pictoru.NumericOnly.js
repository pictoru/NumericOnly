/*
 * Copyright (c) 2012 Ciprian Voicu (http://www.modernism.ro)
 * Version: 0.1
 * License: Free your mind & just use it
 */

(function ($) {
    var defaults = {
        step: 1,
        float: true,
        minValue: null,
        maxValue: null,
        value: 0
    };

     var methods = {
        init: function(options){
            return this.each(function () {
                var $this = $(this),
                    $set = $.extend({}, defaults, options);

                $set.value = (typeof $set.value == 'number') ? $set.value : 0;

                if(typeof $set.minValue == 'number' && $set.value < $set.minValue){
                    $set.value = $set.minValue;
                }

                if(typeof $set.maxValue == 'number' && $set.value > $set.maxValue){
                    $set.value = $set.maxValue;
                }

                $this.val($set.value);

                $this.data("numericonly:defaults", $set);

                $this.keydown(function(event) {
                    var code = event.keyCode;

                    // Allow: backspace, delete, tab and escape
                    if ( code == 46 || code == 8 || code == 9 || code == 27 ||
                         // Allow: Ctrl+A
                        (code == 65 && event.ctrlKey === true) ||
                         // Allow: Ctrl+V
                         (code == 86 && event.ctrlKey === true) ||
                         // Allow: home, end, left, right
                        (code >= 35 && code <= 39 && code != 38) ||

                        ($set.float && (code == 110 || code == 190))){
                             // let it happen, don't do anything
                             return;
                    } else if(code == 38){
                        _increase($this);
                    } else if(code == 40){
                        _decrease($this);
                    } else if(code == 109 && ((typeof $set.minValue == 'number' && $set.minValue < 0) || (typeof $set.minValue != 'number'))){
                        _fixNegative($this, event);
                    }
                    else {
                        // Ensure that it is a number and stop the keypress
                        if ((code < 48 || code > 57) && (code < 96 || code > 105 )) {
                            event.preventDefault();
                        }
                    }
                }).blur(function(event){
                    _fixNumber($this);
                }).keyup(function(event){
                    var code = event.keyCode;
                    if((code > 47 && code < 58) || (code > 95 && code < 106)){
                        _fixNumber($this);
                    }
                });
            });
        }
    };

    function _fixNegative(inp, e){
        var v = inp.val().length ? parseFloat(inp.val()) : false,
            l = inp.val().length;

        if(l){e.preventDefault();}

        if(v){
            inp.val("-" + Math.abs(v)) ;
        }
    }

    function _increase(inp){
        var s = inp.data("numericonly:defaults"),
            v = parseFloat(inp.val()) + s.step;

        if((typeof s.maxValue != 'number') || (typeof s.maxValue == 'number' && v <= s.maxValue)){
            inp.val(v);
        }
    }

    function _decrease(inp){
        var s = inp.data("numericonly:defaults"),
            v = parseFloat(inp.val()) - s.step;

        if((typeof s.minValue != 'number') || (typeof s.minValue == 'number' && v >= s.minValue)){
            inp.val(v);
        }
    }

    function _fixNumber(inp){
        var s = inp.data("numericonly:defaults"),
            v = parseFloat(inp.val());

        if(typeof v != 'number' || isNaN(v)){
            inp.val(0);
            return;
        } else if(typeof s.minValue == 'number' && v < s.minValue){
            inp.val(s.minValue);
        } else if(typeof s.maxValue == 'number' && v > s.maxValue){
            inp.val(s.maxValue);
        } else {
            inp.val(v);
        }
    }

    $.fn.NumericOnly = function(method){

        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call(arguments, 1));
        } else if (typeof method === 'object' || !method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.NumericOnly');
        }
    };

})(jQuery);