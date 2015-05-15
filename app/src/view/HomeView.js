define(function(require, exports, module) {
    'use strict';

    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');

    var FlexScrollView = require('famous-flex/FlexScrollView');
    var CollectionLayout = require('famous-flex/layouts/CollectionLayout');

    function HomeView(options) {
        View.apply(this, arguments);

        this._eventInput.on('deployed', function() {
            console.log('deployed');
        });

        _createScrollView.call(this);
        _createTitle.call(this);
        _createBody.call(this);
        // _createBack.call(this);
    }

    HomeView.prototype = Object.create(View.prototype);
    HomeView.prototype.constructor = HomeView;

    HomeView.DEFAULT_OPTIONS = {

    }

    function _createBack() {
        this.surf = new Surface({
            size: [undefined, undefined],
            content: 'Home View',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#CCCCCC'
            }
        });

        this.add(this.surf);
    }

    function _createTitle() {
        this.title = new Surface({
            // size: [true, true],
            content: 'Web developer',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                fontSize: '3em',
                backgroundColor: '#FA5C4F'
            }
        });

        this.title.state = new Modifier({
            proportions: [undefined, 0.2],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 0, 0)
        });

        this.add(this.title.state).add(this.title);
    }

    function _createBody() {
        this.body = new Surface({
            size: [true, true],
            content: 'Web Lorem ipsum dolor sit amet, consectetur adipisicing elit. A quia quos deleniti voluptates fuga mollitia eius, enim ullam, ratione repudiandae.',
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                fontSize: '2em',
                backgroundColor: '#FA5C4F'
            }
        });

        this.body.state = new Modifier({
            proportions: [undefined, 0.2],
            align: [0, 0],
            origin: [0, 0],
            transform: Transform.translate(0, 200, 0)
        });

        this.add(this.body.state).add(this.body);
    }

    function _createScrollView() {
        var scrollView = new FlexScrollView({
          layout: CollectionLayout,
          // autoPipeEvents: true,
          direction: 0,
            useContainer: true,
            container: { // options passed to the ContainerSurface
                properties: {
                    overflow: 'hidden'
                    // backgroundColor: 'blue'
                }
            },
          layoutOptions: {
            cells: [3, 1],
            // itemSize: [300, 500],    // item has width and height of 100 pixels
            margins: [10, 5, 10, 5], // outer margins
            spacing: [10, 10]        // spacing between items
          },
          dataSource: [
            new Surface({content: 'item 1', properties: { backgroundColor: '#00FF80' }}),
            new Surface({content: 'item 2', properties: { backgroundColor: '#00FF80' }}),
            new Surface({content: 'item 3', properties: { backgroundColor: '#00FF80' }}),
            new Surface({content: 'item 3', properties: { backgroundColor: '#00FF80' }}),
            new Surface({content: 'item 3', properties: { backgroundColor: '#00FF80' }}),
            new Surface({content: 'item 3', properties: { backgroundColor: '#00FF80' }}),
            new Surface({content: 'item 3', properties: { backgroundColor: '#00FF80' }})
          ]
        });

        scrollView.state = new Modifier({
            proportions: [undefined, 0.5],
            align: [1, 1],
            origin: [1, 1],
            transform: Transform.translate(0, 0, 0)
        });

        this.add(scrollView.state).add(scrollView);
    }

    module.exports = HomeView;
});
