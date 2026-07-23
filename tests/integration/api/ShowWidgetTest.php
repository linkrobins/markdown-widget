<?php

/*
 * This file is part of linkrobins/markdown-widget.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace LinkRobins\MarkdownWidget\Tests\integration\api;

use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ShowWidgetTest extends TestCase
{
    public function setUp(): void
    {
        parent::setUp();

        $this->extension('linkrobins-markdown-widget');
    }

    #[Test]
    public function guests_get_the_configured_content(): void
    {
        $this->setting('linkrobins-markdown-widget.title', 'Welcome');
        $this->setting('linkrobins-markdown-widget.icon', 'fas fa-star');
        $this->setting('linkrobins-markdown-widget.body', '<p>Hello</p>');
        $this->setting('linkrobins-markdown-widget.backgroundColor', '#ff8800');

        $response = $this->send(
            $this->request('GET', '/api/linkrobins-markdown-widget')
        );

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(
            ['title' => 'Welcome', 'icon' => 'fas fa-star', 'body' => '<p>Hello</p>', 'backgroundColor' => '#ff8800'],
            json_decode($response->getBody()->getContents(), true)
        );
        $this->assertEquals(
            'public, max-age=300, stale-while-revalidate=60',
            $response->getHeaderLine('Cache-Control')
        );
    }

    #[Test]
    public function an_unconfigured_widget_serves_empty_strings(): void
    {
        $response = $this->send(
            $this->request('GET', '/api/linkrobins-markdown-widget')
        );

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(
            ['title' => '', 'icon' => '', 'body' => '', 'backgroundColor' => ''],
            json_decode($response->getBody()->getContents(), true)
        );
    }
}
