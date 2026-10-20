<?php

/*
 * This file is part of linkrobins/markdown-widget.
 *
 * For detailed copyright and license information, please view the
 * LICENSE file that was distributed with this source code.
 */

namespace LinkRobins\MarkdownWidget\Tests\integration\api;

use Flarum\Testing\integration\RetrievesAuthorizedUsers;
use Flarum\Testing\integration\TestCase;
use PHPUnit\Framework\Attributes\Test;

class ShowWidgetTest extends TestCase
{
    use RetrievesAuthorizedUsers;

    public function setUp(): void
    {
        parent::setUp();

        $this->extension('linkrobins-markdown-widget');
    }

    #[Test]
    public function guests_get_the_configured_content(): void
    {
        $this->setting('linkrobins-markdown-widget.title', 'Welcome');
        $this->setting('linkrobins-markdown-widget.description', 'Read first');
        $this->setting('linkrobins-markdown-widget.icon', 'fas fa-star');
        $this->setting('linkrobins-markdown-widget.body', '<p>Hello</p>');
        $this->setting('linkrobins-markdown-widget.backgroundColor', '#ff8800');

        $response = $this->send(
            $this->request('GET', '/api/linkrobins-markdown-widget')
        );

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(
            ['title' => 'Welcome', 'description' => 'Read first', 'icon' => 'fas fa-star', 'body' => '<p>Hello</p>', 'backgroundColor' => '#ff8800'],
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
            ['title' => '', 'description' => '', 'icon' => '', 'body' => '', 'backgroundColor' => ''],
            json_decode($response->getBody()->getContents(), true)
        );
    }

    /**
     * "View forum" set to Members: guests lose the permission, members keep it.
     */
    private function makeForumPrivate(): void
    {
        $this->prepareDatabase([
            'users' => [$this->normalUser()],
            'group_permission' => [['permission' => 'viewForum', 'group_id' => 3]],
        ]);

        $this->setting('linkrobins-markdown-widget.title', 'Welcome');
        $this->setting('linkrobins-markdown-widget.body', '<p>Members only</p>');

        // Boots the app, so the settings above must come first.
        $this->database()->table('group_permission')
            ->where('permission', 'viewForum')
            ->where('group_id', 2)
            ->delete();
    }

    #[Test]
    public function guests_get_nothing_on_a_private_forum(): void
    {
        $this->makeForumPrivate();

        $response = $this->send(
            $this->request('GET', '/api/linkrobins-markdown-widget')
        );

        $this->assertEquals(200, $response->getStatusCode());
        $this->assertEquals(['hidden' => true], json_decode($response->getBody()->getContents(), true));
        $this->assertEquals('private, no-store', $response->getHeaderLine('Cache-Control'));
    }

    #[Test]
    public function members_still_get_the_content_on_a_private_forum(): void
    {
        $this->makeForumPrivate();

        $response = $this->send(
            $this->request('GET', '/api/linkrobins-markdown-widget', ['authenticatedAs' => 2])
        );

        $this->assertEquals(200, $response->getStatusCode());
        $body = json_decode($response->getBody()->getContents(), true);
        $this->assertEquals('Welcome', $body['title']);
        $this->assertEquals('<p>Members only</p>', $body['body']);
        $this->assertEquals(
            'private, max-age=300, stale-while-revalidate=60',
            $response->getHeaderLine('Cache-Control')
        );
    }
}
