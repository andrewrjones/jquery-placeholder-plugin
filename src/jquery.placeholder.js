(function ($) {
  "use strict";

  $.extend({
    placeholder: {
      settings: {
        focusClass: 'placeholderFocus',
        activeClass: 'placeholder',
        overrideSupport: false,
        preventRefreshIssues: true
      }
    }

  });

  // check browser support for placeholder
  $.support.placeholder = 'placeholder' in document.createElement('input');

  // Replace the val function to never return placeholders
  $.fn.plVal = $.fn.val;
  $.fn.val = function (value) {
    if (typeof value === 'undefined') {
      return $.fn.plVal.call(this);
    } else {
      var el = $(this[0]);
      var currentValue = el.plVal();
      var returnValue = $(this).plVal(value);
      if (el.hasClass($.placeholder.settings.activeClass) && currentValue === el.attr('placeholder')) {
        el.removeClass($.placeholder.settings.activeClass);
        return returnValue;
      }

      if (el.hasClass($.placeholder.settings.activeClass) && el.plVal() === el.attr('placeholder')) {
        return '';
      }

      return $.fn.plVal.call(this, value);
    }
  };

  // Clear placeholder values upon page reload
  $(window).bind('beforeunload.placeholder', function () {
    var els = $('input.' + $.placeholder.settings.activeClass);
    if (els.length > 0) {
      els.val('').attr('autocomplete', 'off');
    }
  });


  // plugin code
  $.fn.placeholder = function (opts) {
    opts = $.extend({}, $.placeholder.settings, opts);

    // we don't have to do anything if the browser supports placeholder
    if (!opts.overrideSupport && $.support.placeholder) {
      return this;
    }

    return this.each(function () {
      var $el = $(this);

      // skip if we do not have the placeholder attribute
      if (!$el.is('[placeholder]')) {
        return;
      }

    // Prevent values from being reapplied on refresh
      if (opts.preventRefreshIssues) {
        $el.attr('autocomplete', 'off');
      }

      // duplicate password field with fake text field
      if ($el.is(':password')) {
    // var check if a placeholder input exists before trying to create another
    if ((!this.id) || (!document.getElementById(this.id + '--placeholder'))) {
      var $placeholderInput = $("<input type='text' />");
      
      // copy the attributes over
      var attrObj = {};
      for (var i = this.attributes.length - 1; i >= 0; i--) {
        var thisAttr = this.attributes[i];
        if (thisAttr.specified && thisAttr.nodeName && (thisAttr.nodeName !== 'type')) {
          attrObj[thisAttr.nodeName] = thisAttr.nodeValue;
        }
      }

      // set default id if none exists
      var thisId = $.trim($(this).attr('id'));
      if (thisId === '') thisId = new Date().getTime();
      attrObj['id'] = thisId + '--placeholder';
      attrObj['data-linkedid'] = thisId;
      // set id with placeholder tag
      $placeholderInput
        .attr(attrObj)
        .addClass('placeholderPassword')
        .insertBefore(this);

      if ($.trim(this.value) === '') {
        $placeholderInput.show();
        $(this).hide();
      }
    }
      }

      $el.bind('focus.placeholder', function () {
        var $el = $(this);
        if (this.value === $el.attr('placeholder') && $el.hasClass(opts.activeClass)) {
          $el.val('').removeClass(opts.activeClass).addClass(opts.focusClass);
        }
        // password field handler
        if ($el.hasClass('placeholderPassword')) {
          $el.hide();
          $('#' + $el.data('linkedid')).show().focus();
        }
      });

      $el.bind('blur.placeholder', function () {
        var $el = $(this);

        $el.removeClass(opts.focusClass);

        if (this.value === '') {
          $el.val($el.attr('placeholder')).addClass(opts.activeClass);
          // password field handler
          if ($el.is(':password')) {
            var $placeholderInput = $('#' + $el.attr('id') + '--placeholder');
            if ($placeholderInput.length) {
              $el.hide();
              $placeholderInput.show();
            }
            
          }
        }
      });

      $el.triggerHandler('blur');

      // Prevent incorrect form values being posted
      $el.parents('form').submit(function () {
        $el.triggerHandler('focus.placeholder');
      });

    });
  };
}(jQuery));