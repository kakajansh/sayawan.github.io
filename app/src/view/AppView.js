define(function(require, exports, module) {
    'use strict';

    var View = require('famous/core/View');
    var Surface = require('famous/core/Surface');
    var Modifier = require('famous/core/Modifier');
    var Transform = require('famous/core/Transform');
    var RenderNode = require('famous/core/RenderNode');
    var RenderController = require('famous/views/RenderController');
    var Timer = require('famous/utilities/Timer');
    var Transitionable = require('famous/transitions/Transitionable');
    // var ContainerSurface = require('famous/surfaces/ContainerSurface');
    var Easing = require('famous/transitions/Easing');

    var BkImageSurface = require('famous-bkimagesurface');

    var HomeView = require('view/HomeView');

    var items = [
        { title: 'Home', icon: 'home' },
        { title: 'About', icon: 'about' },
        { title: 'Page', icon: 'about' },
        { title: 'Famous', icon: 'about' },
        { title: 'Shuut', icon: 'about' }
    ];

    function AppView(options) {
        View.apply(this, arguments);

        _createBack.call(this);
        _createImage.call(this);
        _createName.call(this);
        _createRenderController.call(this);
        this.nodes = [];
        for (var i = 0, surf; i < items.length; i++) {
            surf = _createSurf.call(this, items[i], i);
            var node = this.add(surf.state).add(surf);
            this.nodes.push(node);
        }

        // this.add(this.mainNode);
    }

    AppView.prototype = Object.create(View.prototype);
    AppView.prototype.constructor = AppView;

    AppView.DEFAULT_OPTIONS = {
        image: '/content/images/user.jpg',
        name: 'Mervas Dayi'
    };

    function _createBack() {
        var imageSurface = new BkImageSurface({
            content: '/content/images/bg.jpg',
            sizeMode: BkImageSurface.SizeMode.ASPECTFILL
        });
        this.add(imageSurface);
    }

    function _createRenderController() {
        this.renderController = new RenderController();
        this.renderController.state = new Modifier({
            size: [window.innerWidth, window.innerHeight-100],
            align: [0.5, 1],
            origin: [0.5, 1],
            transform: Transform.translate(0, 0, 0)
        });
        this.surfaces = [];
        var homeView = new HomeView();
        this.surfaces.push(homeView);

        this._eventInput.on('goster', function(id) {
            this.renderController.show(this.surfaces[0]);
            this.surfaces[0].trigger('deployed');
        }.bind(this));

        this.add(this.renderController.state).add(this.renderController);
    }

    function _createImage() {
        this.image = new BkImageSurface({
            content: this.options.image,
            sizeMode: BkImageSurface.SizeMode.ASPECTFILL
        });

        this.image.talign = new Transitionable([0.5, 0.5]);
        this.image.torigin = new Transitionable([0.5, 0.5]);
        this.image.topacity = new Transitionable(1);
        this.image.ttransform = new Transitionable(Transform.translate(0, 0, 0));

        this.image.state = new Modifier({
            size: [80, 80],
            align: this.image.talign,
            origin: this.image.torigin,
            opacity: this.image.topacity,
            transform: this.image.ttransform
        });

        this.add(this.image.state).add(this.image);
    }

    function _createName() {
        this.name = new Surface({
            size: [true, true],
            content: this.options.name,
            classes: [],
            properties: {
                color: 'white',
                fontSize: '1.5em',
                textAlign: 'center'
                // backgroundColor: '#FA5C4F'
            }
        });

        this.name.talign = new Transitionable([0.5, 0.5]);
        this.name.torigin = new Transitionable([0.5, 0.5]);
        this.name.topacity = new Transitionable(1);
        this.name.ttransform = new Transitionable(Transform.translate(0, 60, 0));

        this.name.state = new Modifier({
            align: this.name.talign,
            origin: this.name.torigin,
            opacity: this.name.topacity,
            transform: this.name.ttransform
        });

        this.add(this.name.state).add(this.name);
    }

    function _createSurf(item, i) {

        var surf = new Surface({
            // size: [60, 60],
            content: item.title + i,
            classes: [],
            properties: {
                color: 'white',
                textAlign: 'center',
                backgroundColor: '#FA5C4F'
            }
        });

        var m = items.length / 2;
        var n = m > i ? -100 : 100;
        var ii = m > i ? i : i - Math.floor(m);

        surf.tsize = new Transitionable([60, 60]);
        surf.torigin = new Transitionable([0.5, 1]);
        surf.talign = new Transitionable([0.5, 1]);
        surf.topacity = new Transitionable(1);
        surf.ttransform = new Transitionable(Transform.translate(ii * n, -100));

        surf.state = new Modifier({
            size: surf.tsize,
            align: surf.talign,
            origin: surf.torigin,
            opacity: surf.topacity,
            transform: surf.ttransform
        });

        var self = this;
        var ease = { duration: 600, curve: Easing.inOutQuint }
        // self.nodes.reverse();

        surf.on('click', function(e) {
            surf.tsize.set([40, 40], ease, function() {
                // box
                surf.ttransform.set(Transform.translate(0, 0), ease);
                surf.tsize.set([window.innerWidth, window.innerHeight-100], ease, function() {});
                // name
                self.name.ttransform.set(Transform.translate(100, 30), ease);
                self.name.topacity.set(1, ease);
                // image
                self.image.ttransform.set(Transform.translate(10, 10), ease);
                self.image.topacity.set(1, ease);
                // nodes
                var tnodes = [];

                for (var i = 0; i < self.nodes.length; i++) {
                    var child = self.nodes[i]._object;
                    if (child.tsize.get()[0] === 60) {
                        tnodes.push(child);
                    } else {
                        Timer.setTimeout(function() {
                            self._eventInput.trigger('goster', i)
                        }, 600);
                    };
                }

                var i = tnodes.length-1;
                function myLoop() {
                    Timer.setTimeout(function() {
                        var child = tnodes[i];
                        // child.setContent(i);

                        if (i == 0) {
                            ii = -20;
                        } else {
                            ii = i * -70 - 20;
                        }

                        child.topacity.set(1, ease);
                        child.ttransform.set(Transform.translate(ii, 20), ease);
                        i--;
                        if (i >= 0) {
                            myLoop();
                        }
                    }, i * 50);
                }

                myLoop();
            });
            // name
            self.name.talign.set([0, 0]);
            self.name.torigin.set([0, 0]);
            self.name.topacity.set(0);
            self.name.ttransform.set(Transform.translate(200, 30));
            // image
            self.image.talign.set([0, 0]);
            self.image.torigin.set([0, 0]);
            self.image.topacity.set(0);
            self.image.ttransform.set(Transform.translate(110, 10));
            // node
            Timer.setTimeout(function() {
                var check = false;
                for (var i = 0, child, ii; i < self.nodes.length; i++) {
                    child = self.nodes[i]._object;
                    if (child.tsize.get()[0] !== 60) {
                        check = true;
                        continue;
                    };

                    var sayi = check === true ? i-1 : i;
                    child.setContent(sayi);

                    if (sayi == 0) {
                        ii = 0;
                    } else {
                        ii = sayi * -70;
                    }

                    console.log(ii);
                    child.talign.set([1, 0]);
                    child.torigin.set([1, 0]);
                    child.topacity.set(0);
                    child.ttransform.set(Transform.translate(ii, 20));
                }
            }, 0);
        });

        return surf;
    }

    module.exports = AppView;
});
