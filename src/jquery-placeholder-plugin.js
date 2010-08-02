(function($) {
    // check browser support for placeholder
    $.support.placeholder = 'placeholder' in document.createElement('input');

    // plugin code
    $.fn.placeholder = function(opts) {
        opts = $.extend({
			blurClass: 'placeholderBlur',
			activeClass: 'placeholderFocus',
			overrideSupport: false
		}, opts);

		// we don't have to do anything if the browser supports placeholder
		if(!opts.overrideSupport && $.support.placeholder)
		    return this;

        return this.each(function() {
            var $el = $(this);

            // skip if we do not have the placeholder attribute
            if(!$el.is('[placeholder]'))
                return;

            // we cannot do password fields, but supported browsers can
            if($el.is(':password'))
                return;

            $el.focus(function(){
                var $el = $(this);
                if($el.val() == $el.attr('placeholder'))
                    $el.val('')
                       .removeClass(opts.blurClass)
                       .addClass(opts.activeClass);
            });
            $el.blur(function(){
                var $el = $(this);
                if($el.val() == '')
                  $el.val($el.attr('placeholder'))
                     .removeClass(opts.activeClass)
                     .addClass(opts.blurClass);
            });
            $el.triggerHandler('blur');
        });
    };
})(jQuery);