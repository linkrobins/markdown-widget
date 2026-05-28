import { marked } from 'marked';
import DOMPurify from 'dompurify';

/**
 * Builds the Markdown widget class.
 *
 * The fof Widget base class is passed in (resolved at initializer time, not at
 * module load) so the class isn't defined against an `ext:` binding that may
 * not be registered yet during cross-bundle load -- which previously left the
 * component undefined and crashed fof's renderer.
 *
 * - marked + DOMPurify are bundled into the build (no CDN at runtime).
 * - Rendered HTML is always sanitised by DOMPurify before reaching m.trust().
 * - Content is fetched on demand when the widget mounts, so it is not
 *   serialised into the forum payload on every request.
 */
export default function makeMarkdownWidget(Widget) {
  return class MarkdownWidget extends Widget {
    oninit(vnode) {
      super.oninit(vnode);

      this.loading = true;
      this.data = { title: '', icon: '', body: '' };

      app
        .request({
          method: 'GET',
          url: app.forum.attribute('apiUrl') + '/linkrobins-markdown-widget',
        })
        .then((data) => {
          if (data) this.data = data;
          this.loading = false;
          m.redraw();
        })
        .catch((e) => {
          this.loading = false;
          console.error('[linkrobins/markdown-widget] failed to load content:', e);
          m.redraw();
        });
    }

    view(vnode) {
      // Don't render the widget shell until the content has loaded, to avoid a
      // flash of an empty widget while the request is in flight.
      if (this.loading) return null;
      return super.view(vnode);
    }

    className() {
      return 'LinkRobinsMarkdownWidget';
    }

    icon() {
      return this.data.icon || '';
    }

    title() {
      return this.data.title || '';
    }

    content() {
      const body = this.data.body || '';
      if (!body) return null;
      return m.trust(this.renderBody(body));
    }

    renderBody(body) {
      try {
        return DOMPurify.sanitize(marked.parse(body));
      } catch (e) {
        console.error('[linkrobins/markdown-widget] render failed:', e);
        return '<pre>' + this.escape(body) + '</pre>';
      }
    }

    escape(s) {
      return String(s)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }
  };
}
