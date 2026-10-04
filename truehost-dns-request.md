# Domain verification for umojaverse.xyz

Checked on 4 October 2026. Vercel project: `umojaverse-site`.

Both `umojaverse.xyz` and `www.umojaverse.xyz` have been added to the project,
but Vercel requires DNS ownership verification before activating them. The
`www` domain is configured to redirect to the apex domain with HTTP 308.

The authoritative nameservers are currently `ns1.olitt.com`, `ns1.olitt.net`,
and `ns1.olitt.org`. Add the records in the DNS panel serving those nameservers.
Changing records in an inactive DNS zone will not verify the domain.

| Type | Host | Value | TTL |
| --- | --- | --- | --- |
| TXT | `_vercel` | `vc-domain-verify=umojaverse.xyz,55d93935891fad0ee9b8` | 300 |
| TXT | `_vercel` | `vc-domain-verify=www.umojaverse.xyz,d130919d7f720779ce67` | 300 |

These are public DNS verification challenges, not API credentials. Both TXT
records share the full name `_vercel.umojaverse.xyz`.

The apex A record currently resolves to `76.76.21.21`; `www` has a CNAME to
`cname.vercel-dns.com`. Preserve existing DNS, mail records, and nameservers.
After the TXT records propagate, verify both domains in Vercel's project domain
settings and confirm certificate issuance and HTTPS for both names.

Vercel fallback: https://umojaverse-site.vercel.app
