import app from 'flarum/admin/app';
import registerWidget from '../common/registerWidget';

app.initializers.add('linkrobins-markdown-widget', () => {
  // Register the widget so it appears (and previews) in the Forum Widgets editor.
  registerWidget(app);

  app.registry
    .for('linkrobins-markdown-widget')

    .registerSetting({
      setting: 'linkrobins-markdown-widget.title',
      type: 'text',
      label: app.translator.trans('linkrobins-markdown-widget.admin.settings.title_label'),
      help: app.translator.trans('linkrobins-markdown-widget.admin.settings.title_help'),
      placeholder: app.translator.trans('linkrobins-markdown-widget.admin.settings.title_placeholder'),
    })

    .registerSetting({
      setting: 'linkrobins-markdown-widget.icon',
      type: 'text',
      label: app.translator.trans('linkrobins-markdown-widget.admin.settings.icon_label'),
      help: app.translator.trans('linkrobins-markdown-widget.admin.settings.icon_help'),
      placeholder: 'fab fa-markdown',
    })

    .registerSetting(function () {
      const value = this.setting('linkrobins-markdown-widget.body', '');

      return m(
        'div',
        { className: 'Form-group' },
        m('label', app.translator.trans('linkrobins-markdown-widget.admin.settings.body_label')),
        m('textarea', {
          className: 'FormControl',
          rows: 14,
          value: value(),
          oninput: (e) => value(e.target.value),
          placeholder: '# Hello\n\nWrite **markdown** here.',
          style:
            'font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; font-size: 0.85rem;',
        }),
        m(
          'p',
          { className: 'helpText' },
          app.translator.trans('linkrobins-markdown-widget.admin.settings.body_help')
        )
      );
    }, 0, 'linkrobins-markdown-widget.body');
});
