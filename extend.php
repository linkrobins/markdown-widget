<?php

use Flarum\Extend;
use LinkRobins\MarkdownWidget\Api\Controller\ShowWidgetController;

return [
    (new Extend\Frontend('forum'))
        ->js(__DIR__ . '/js/dist/forum.js')
        ->css(__DIR__ . '/less/forum.less'),

    (new Extend\Frontend('admin'))
        ->js(__DIR__ . '/js/dist/admin.js'),

    new Extend\Locales(__DIR__ . '/locale'),

    // Widget content is fetched on demand from this endpoint when the widget
    // renders, rather than serialised into the forum payload on every request.
    (new Extend\Routes('api'))
        ->get('/linkrobins-markdown-widget', 'linkrobins-markdown-widget.show', ShowWidgetController::class),

    (new Extend\Settings())
        ->default('linkrobins-markdown-widget.title', '')
        ->default('linkrobins-markdown-widget.icon',  '')
        ->default('linkrobins-markdown-widget.body',  ''),
];
