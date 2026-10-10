# Publish and promote nyassar.com

These steps follow production deployment of the SEO branch. DNS and live redirects were not verified during implementation.

1. In Netlify **Domain management**, set `nyassar.com` as the primary domain. Confirm its DNS checks and HTTPS certificate succeed. Keep the existing working DNS setup. Confirm `www.nyassar.com` redirects to `https://nyassar.com/`.
2. Review the branch and preview, then authorize merging and deployment. Confirm the production build command is `npm run build` and publish directory is `dist`.
3. Check production: the homepage returns HTTP 200, both HTTP and HTTPS Netlify-domain URLs permanently redirect to the custom domain, and query parameters such as `?work=analytics` survive. Check `robots.txt`, `sitemap.xml`, and `social-preview.png` return the intended files. Unknown paths should return 404; do not add a blanket SPA rewrite for this single-page site.
4. In [Google Search Console](https://search.google.com/search-console), add a **Domain** property for `nyassar.com`. Copy Google's TXT record into your active DNS provider, then click **Verify**. Keep the TXT record after verification.
5. In **Sitemaps**, submit `https://nyassar.com/sitemap.xml`.
6. Inspect `https://nyassar.com/`, run **Test live URL**, check the rendered portfolio, and click **Request indexing**. Once indexed, check that Google's selected canonical is the custom-domain homepage. Indexing and rankings are not guaranteed.
7. Add `https://nyassar.com/` to LinkedIn contact information and Featured, GitHub profile and profile README, CV, and email signature. Use the same address in applications and introductions.
8. Review Search Console weekly initially: indexing, impressions, clicks, queries, and countries. Improve content using observed searches and reader needs. No country targeting is configured; the English portfolio is intended for a worldwide audience.

Production must not send a `noindex` meta tag or `X-Robots-Tag` header. Netlify Deploy Previews normally send `X-Robots-Tag: noindex`; verify it on the review preview. If branch deploys are enabled, protect those separately because they do not receive the same automatic exclusion.

Sources: [Netlify domain management](https://docs.netlify.com/domains/manage-domains/manage-multiple-domains/), [Google domain verification](https://support.google.com/webmasters/answer/34592?hl=en), [Google URL Inspection](https://support.google.com/webmasters/answer/9012289?hl=en), [Netlify previews](https://docs.netlify.com/deploy/deploy-types/deploy-previews/).
