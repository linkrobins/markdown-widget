'use strict';

(function () {

    app.initializers.add('linkrobins/markdown-widget', function () {

        if (app.widgets) {
            app.widgets.add({
                key:        'linkrobins-markdown-widget',
                component:  { view: function () { return null; } },
                placement:  'start_top',
                isUnique:   true,
                isDisabled: false,
            }, 'linkrobins-markdown-widget');
        }

        app.registry
            .for('linkrobins-markdown-widget')

            .registerSetting({
                setting:     'linkrobins-markdown-widget.title',
                type:        'text',
                label:       app.translator.trans('linkrobins-markdown-widget.admin.settings.title_label'),
                help:        app.translator.trans('linkrobins-markdown-widget.admin.settings.title_help'),
                placeholder: 'Welcome to our community!',
            })

            .registerSetting({
                setting:     'linkrobins-markdown-widget.icon',
                type:        'text',
                label:       app.translator.trans('linkrobins-markdown-widget.admin.settings.icon_label'),
                help:        app.translator.trans('linkrobins-markdown-widget.admin.settings.icon_help'),
                placeholder: 'fab fa-markdown',
            })

            .registerSetting(function () {
                var page  = this;
                var value = page.setting('linkrobins-markdown-widget.body', '');

                return m('div', { className: 'Form-group' },
                    m('label', app.translator.trans('linkrobins-markdown-widget.admin.settings.body_label')),
                    m('textarea', {
                        className: 'FormControl',
                        rows:      14,
                        value:     value(),
                        oninput:   function (e) { value(e.target.value); },
                        placeholder: '# Hello\n\nWrite **markdown** here.',
                        style:     'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem;',
                    }),
                    m('p', { className: 'helpText' },
                        app.translator.trans('linkrobins-markdown-widget.admin.settings.body_help'))
                );
            }, 0, 'linkrobins-markdown-widget.body');

    });

})();

module.exports = {};
