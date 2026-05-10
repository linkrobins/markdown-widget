'use strict';

(function () {

    var MARKED_URL = 'https://cdnjs.cloudflare.com/ajax/libs/marked/16.3.0/lib/marked.umd.min.js';

    var _markedPromise = null;

    function loadMarked() {
        if (window.marked && typeof window.marked.parse === 'function') {
            return Promise.resolve(window.marked);
        }
        if (_markedPromise) return _markedPromise;

        _markedPromise = new Promise(function (resolve, reject) {
            var s = document.createElement('script');
            s.src   = MARKED_URL;
            s.async = true;
            s.onload  = function () {
                if (window.marked && typeof window.marked.parse === 'function') {
                    resolve(window.marked);
                } else {
                    reject(new Error('marked.js loaded but window.marked is missing'));
                }
            };
            s.onerror = function () { reject(new Error('failed to load marked.js from ' + MARKED_URL)); };
            document.head.appendChild(s);
        });
        return _markedPromise;
    }

    app.initializers.add('linkrobins/markdown-widget', function () {
        if (!app.widgets) return;

        var Component = flarum.reg.get('core', 'common/Component');
        if (!Component) return;

        class MarkdownWidget extends Component {

            oninit(vnode) {
                super.oninit(vnode);
                this.markedReady = !!(window.marked && typeof window.marked.parse === 'function');
                this.markedError = null;

                if (!this.markedReady) {
                    var self = this;
                    loadMarked()
                        .then(function () {
                            self.markedReady = true;
                            m.redraw();
                        })
                        .catch(function (err) {
                            self.markedError = err && err.message ? err.message : String(err);
                            console.error('[linkrobins/markdown-widget]', err);
                            m.redraw();
                        });
                }
            }

            renderBody(body) {
                if (!body) return '';
                if (this.markedError) {
                    return '<p><em>Markdown renderer failed to load. ' +
                           'Body shown below as plain text.</em></p><pre>' +
                           this._escape(body) + '</pre>';
                }
                if (!this.markedReady) {
                    return '';
                }
                try {
                    return window.marked.parse(body);
                } catch (e) {
                    console.error('[linkrobins/markdown-widget] parse failed:', e);
                    return '<pre>' + this._escape(body) + '</pre>';
                }
            }

            _escape(s) {
                return String(s)
                    .replace(/&/g, '&amp;')
                    .replace(/</g, '&lt;')
                    .replace(/>/g, '&gt;')
                    .replace(/"/g, '&quot;')
                    .replace(/'/g, '&#39;');
            }

            view() {
                var title = app.forum.attribute('linkrobinsMarkdownWidgetTitle') || '';
                var icon  = app.forum.attribute('linkrobinsMarkdownWidgetIcon')  || '';
                var body  = app.forum.attribute('linkrobinsMarkdownWidgetBody')  || '';

                var titleNode = null;
                if (title || icon) {
                    var titleChildren = [];
                    if (icon) {
                        titleChildren.push(
                            m('span', { className: 'FofWidgets-Widget-title-icon' },
                                m('i', { className: icon }))
                        );
                    }
                    if (title) {
                        titleChildren.push(
                            m('span', { className: 'FofWidgets-Widget-title-label' }, title)
                        );
                    }
                    titleNode = m('div', { className: 'FofWidgets-Widget-title' }, titleChildren);
                }

                var contentNode = m('div', { className: 'FofWidgets-Widget-content' },
                    m.trust(this.renderBody(body))
                );

                return m('div', { className: 'FofWidgets-Widget LinkRobinsMarkdownWidget' },
                    titleNode,
                    contentNode
                );
            }
        }

        app.widgets.add({
            key:        'linkrobins-markdown-widget',
            component:  MarkdownWidget,
            placement:  'start_top',
            isUnique:   true,
            isDisabled: false,
        }, 'linkrobins-markdown-widget');
    });

})();

module.exports = {};
