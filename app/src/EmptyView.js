define(function(require, exports, module) {
    'use strict';

    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');

    function EmptyView(options) {
        View.apply(this, arguments);
    }

    EmptyView.prototype = Object.create(View.prototype);
    EmptyView.prototype.constructor = EmptyView;

    EmptyView.DEFAULT_OPTIONS = {

    }

    module.exports = EmptyView;
});
