jQuery Placeholder Plugin
=========================

This is a small jQuery plugin that emulates the placeholder attribute in web browsers that do not support it. If the browser does support it, the plugin does nothing.

To use the plugin, add the JS and CSS files to your page and do the following:

```js
jQuery(document).ready(function($) {
    $(":input[placeholder]").placeholder();
});
```

Then, in your HTML you can use the placeholder plugin as documented in the HTML5 spec:

```html
<input type="search" placeholder="Search..." />
```

For more information and some demos, see http://andrew-jones.com/jquery-placeholder-plugin

Contributing
------------

I really appreciate any and all contributions.

I use [Grunt](http://gruntjs.com/) to build this plugin. Once you have installed with `npm install`, run `grunt --help` to see the available tasks.

If you are contibuting code, please tidy the code by running `grunt tidy`. This helps ensure the pull request only shows relevant changes and keeps the code readable and in one style.

Ensure the unit tests pass by running `grunt test`. Please also try to add new tests where it helps.

Thanks again for contributing to this plugin!

Build status
------------

[![Build Status](https://secure.travis-ci.org/andrewrjones/jquery-placeholder-plugin.png)](http://travis-ci.org/andrewrjones/jquery-placeholder-plugin)
