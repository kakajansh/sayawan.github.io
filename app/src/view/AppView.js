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

    var WorksView = require('view/WorksView');
    var AboutView = require('view/AboutView');

    var items = [
        { title: 'My lab', icon: 'ios-flask', color: 'white' },
        { title: 'Portfolio', icon: 'images', color: 'white' },
        { title: 'About', icon: 'person', color: 'white' },
        { title: 'Blog', icon: 'social-wordpress', color: 'white' },
        { title: 'Contact', icon: 'android-drafts', color: 'white' }
    ];

    function AppView(options) {
        View.apply(this, arguments);

        _createImageBack.call(this);
        _createImage.call(this);
        _createName.call(this);
        _createCity.call(this);
        _createRenderController.call(this);
        this.nodes = [];
        this.open  = false;
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
        image: 'https://avatars3.githubusercontent.com/u/7093483?v=3&s=460',
        name: 'Mervas Dayi',
        city: '<div class="icon ion-ios-location"> Istanbul, Turkey</div>'
    };

    function _createBack() {
        var imageSurface = new BkImageSurface({
            content: 'content/images/bg.jpg',
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
        var worksView = new WorksView();
        this.surfaces.push(worksView);

        var aboutView = new AboutView();
        this.surfaces.push(aboutView);

        this._eventInput.on('goster', function(id) {
            this.renderController.show(this.surfaces[0]);
            this.surfaces[0].trigger('deployed');
        }.bind(this));

        this.add(this.renderController.state).add(this.renderController);
    }

    function _createImageBack() {
        this.iback = new Surface({ classes: ['weave'] });

        this.iback.topacity = new Transitionable(1);

        this.iback.state = new Modifier({
            size: [124, 124],
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity: this.iback.topacity,
            transform: Transform.translate(0, -60, -1)
        });

        this.add(this.iback.state).add(this.iback);   
    }

    function _createImage() {
        this.image = new BkImageSurface({
            content: this.options.image,
            sizeMode: BkImageSurface.SizeMode.ASPECTFILL,
            // classes: ['weave'],
            properties: {
                borderRadius: '50%'
            }
        });

        this.image.tsize = new Transitionable([116, 116]);
        this.image.talign = new Transitionable([0.5, 0.5]);
        this.image.torigin = new Transitionable([0.5, 0.5]);
        this.image.topacity = new Transitionable(1);
        this.image.ttransform = new Transitionable(Transform.translate(0, -60, 1));

        this.image.state = new Modifier({
            size: this.image.tsize,
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
                color: '#FFCC66',
                fontSize: '1.8em',
                textAlign: 'center',
                fontWeight: '400'
                // backgroundColor: '#FA5C4F'
            }
        });

        this.name.talign = new Transitionable([0.5, 0.5]);
        this.name.torigin = new Transitionable([0.5, 0.5]);
        this.name.topacity = new Transitionable(1);
        this.name.ttransform = new Transitionable(Transform.translate(0, 50, 0));

        this.name.state = new Modifier({
            align: this.name.talign,
            origin: this.name.torigin,
            opacity: this.name.topacity,
            transform: this.name.ttransform
        });

        this.add(this.name.state).add(this.name);
    }

    function _createCity() {
        this.city = new Surface({
            size: [true, true],
            content: this.options.city,
            classes: [],
            properties: {
                color: '#FFCC66',
                fontSize: '1em',
                textAlign: 'center',
                fontWeight: '400'
                // backgroundColor: '#FA5C4F'
            }
        });

        this.city.topacity = new Transitionable(0.6);

        this.city.state = new Modifier({
            align: [0.5, 0.5],
            origin: [0.5, 0.5],
            opacity: this.city.topacity,
            transform: Transform.translate(0, 80, 0)
        });

        this.add(this.city.state).add(this.city);
    }

    function _createSurf(item, i) {

        var surf = new Surface({
            // size: [60, 60],
            content: '<div class="icon large ion-'+item.icon+'"></div>' + item.title,
            classes: ['back'],
            properties: {
                color: 'white',
                textAlign: 'center',
                padding: '2px'
                // lineHeight: '30px'
                // backgroundColor: item.color
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
            console.log(self.open);
            if (self.open) {
                self.renderController.show(self.surfaces[1]);
            } else {
                self.open = !self.open;
                surf.tsize.set([40, 40], ease, function() {
                    // box
                    surf.ttransform.set(Transform.translate(0, 0), ease);
                    surf.tsize.set([window.innerWidth, window.innerHeight-100], ease, function() {});
                    // name
                    self.name.ttransform.set(Transform.translate(100, 35), ease);
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
                // RESETTING
                // name
                self.name.talign.set([0, 0]);
                self.name.torigin.set([0, 0]);
                self.name.topacity.set(0);
                self.name.ttransform.set(Transform.translate(200, 35));
                // city
                self.city.topacity.set(0);
                // imageback
                self.iback.topacity.set(0);
                // image
                self.image.tsize.set([80, 80]);
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
                            child.setContent('');
                            continue;
                        };

                        var sayi = check === true ? i-1 : i;
                        // child.setContent(sayi);

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
            }
        });

        return surf;
    }

    module.exports = AppView;
});
