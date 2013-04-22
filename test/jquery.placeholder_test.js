/*global QUnit:false, module:false, test:false, asyncTest:false, expect:false*/
/*global start:false, stop:false ok:false, equal:false, notEqual:false, deepEqual:false*/
/*global notDeepEqual:false, strictEqual:false, notStrictEqual:false, raises:false*/
(function ($) {

  module('jQuery#placeholder', {
    setup: function () {
      // find the test elements
      this.elems = $('#qunit-fixture');
      this["placeholder-text-foo"] = this.elems.find("#placeholder-text-foo").first();
      this["placeholder-password-foo"] = this.elems.find("#placeholder-password-foo").first();
      this["no-placeholder"] = this.elems.find("#no-placeholder").first();
    }
  });

  test('is chainable', 1, function () {
    strictEqual(this.elems.placeholder(), this.elems, 'should be chaninable');
  });

  test("test default", 14, function () {
    var el = this["placeholder-text-foo"].placeholder({
      overrideSupport: true
    });

    // should set the value to the placeholder
    strictEqual(el.attr('value'), 'foo');
    strictEqual(el.attr('autocomplete'), 'off');

    // should have the default class
    ok(el.hasClass('placeholder'));
    ok(!el.hasClass('placeholderFocus'));

    // test on focus
    el.focus();

    strictEqual(el.attr('value'), '');
    ok(!el.hasClass('placeholder'));
    ok(el.hasClass('placeholderFocus'));

    // and unfocus (blur) again
    el.blur();

    strictEqual(el.attr('value'), 'foo');
    ok(el.hasClass('placeholder'));
    ok(!el.hasClass('placeholderFocus'));

    // now set the value to something else
    el.val('bar');

    strictEqual(el.attr('value'), 'bar');
    ok(!el.hasClass('placeholder'));

    // and clear it again
    el.val('');

    strictEqual(el.attr('value'), '');
    ok(!el.hasClass('placeholderFocus'));
  });

  test("test set classes", 4, function () {
    // class names
    var activeClass = 'myactiveclass';
    var focusClass = 'myfocusclass';

    // run placeholder
    var el = this["placeholder-text-foo"].placeholder({
      overrideSupport: true,
      activeClass: activeClass,
      focusClass: focusClass
    });

    // should have the default class
    ok(el.hasClass(activeClass));
    ok(!el.hasClass(focusClass));

    // test on focus
    el.focus();

    ok(!el.hasClass(activeClass));
    ok(el.hasClass(focusClass));
  });

  // https://github.com/andrewrjones/jquery-placeholder-plugin/issues/5
  test("test issue 5", 2, function () {
    var value = 'test';
    var element1 = '#placeholder-text-value-foo';
    var element2 = '#placeholder-text-value-bar';

    $('#issue5').find(element1).val(value).end().find(element2).val(value);

    strictEqual($(element1).val(), value, element1 + ' not equal to ' + value);
    strictEqual($(element2).val(), value, element2 + ' not equal to ' + value);
  });

  test("test no placeholder", 2, function () {
    var el = this["no-placeholder"].placeholder({
      overrideSupport: true
    });

    // should not set value
    ok(!el.attr('value'));

    // should not set class
    ok(!el.hasClass('placeholder'));
  });

  test("test password placeholder", 2, function () {
    var el = this["placeholder-password-foo"].placeholder({
      overrideSupport: true
    });

    // should not set value
    ok(!el.attr('value'));

    // should not set class
    ok(!el.hasClass('placeholder'));
  });

  test("test preventRefreshIssues false", 1, function () {
    var el = this["placeholder-text-foo"].placeholder({
      overrideSupport: true,
      preventRefreshIssues: false
    });

    // should not set autocomplete
    ok(!el.attr('autocomplete'));
  });

  test("test set value", 2, function () {
    var el = this["placeholder-text-foo"].placeholder({
      overrideSupport: true
    });

    // default value should be placeholder
    strictEqual(el.attr('value'), 'foo');

    // set the value
    el.val('bar');

    // value should now be bar
    strictEqual(el.attr('value'), 'bar');
  });

  test("test submit form", 1, function () {
    ok("TODO: test submiting a form, ensuring that the default placeholder is not sent through");
  });

}(jQuery));