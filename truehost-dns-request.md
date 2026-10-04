# Domain setup for umojaverse.xyz

Verified on 4 October 2026. The current site runs in Vercel project
`umojatemplate`, team `griffins-projects-4324ce43`, using source from
`umojaversepeeps-commits/landingpage`. Domain ownership stays in this account.

| Address | Behavior |
| --- | --- |
| `https://umojaverse.xyz` | Serves the current site directly |
| `https://www.umojaverse.xyz` | HTTP 308 redirect to the apex, preserving paths |

DNS remains with OLITT: `ns1.olitt.com`, `ns1.olitt.net`, and `ns1.olitt.org`.
The apex A record is `76.76.21.21`; `www` is a CNAME to
`cname.vercel-dns.com`. No registrar, nameserver, mail, or DNS record changes
were required. No ownership-verification TXT records need to be added.

A new auto-renewing Vercel certificate covers both names. Its current validity
ends on 2 January 2027. HTTPS, public pages, admin redirects, and `www` redirects
were verified after deployment. The old redirect to `umojatemplate.vercel.app`
has been removed.

The separate deployment at https://umojaverse-site.vercel.app remains available.
