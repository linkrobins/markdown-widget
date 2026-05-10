<?php

use Flarum\Extend;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/admin.js'),

    new Extend\Locales(__DIR__ . '/locale'),

    (new Extend\Settings())
        ->default('linkrobins-markdown-widget.title', '')
        ->default('linkrobins-markdown-widget.icon',  '')
        ->default('linkrobins-markdown-widget.body',  '')
        ->serializeToForum('linkrobinsMarkdownWidgetTitle', 'linkrobins-markdown-widget.title')
        ->serializeToForum('linkrobinsMarkdownWidgetIcon',  'linkrobins-markdown-widget.icon')
        ->serializeToForum('linkrobinsMarkdownWidgetBody',  'linkrobins-markdown-widget.body'),
];
