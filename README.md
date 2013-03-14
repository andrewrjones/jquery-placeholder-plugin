jQuery Placeholder Plugin
-------------------------

This is a jQuery plugin that emulates the placeholder attribute in web browsers that do not support it. If the browser does support it, the plugin does nothing.

Extra attention has been paid to make sure that elements behave correctly when used in conjunction with a full web application

* Placeholder elements return an empty string using the .val() method
* Forms with placeholder elements post empty strings, not the placeholder value
* Programmatically changing a placeholder element with .val('string') will remove the placeholder class
* With .placeholder({preventRefreshIssues:true}) a placeholder will be assigned autocomplete="off" to prevent browsers from filling an element with the placeholder text on refresh


## Usage

```javascript
$(function(){
  $('input[placeholder], textarea[placeholder]').placeholder();
});
```

Easy.

## Note

Initially forked from https://github.com/andrewrjones/jquery-placeholder-plugin/downloads

