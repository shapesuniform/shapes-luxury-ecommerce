<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="2.0"
    xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:sitemap="http://www.sitemaps.org/schemas/sitemap/0.9"
    xmlns:image="http://www.google.com/schemas/sitemap-image/1.1"
    exclude-result-prefixes="sitemap image">
    <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes"/>
    <xsl:template match="/">
        <html lang="en">
            <head>
                <meta charset="UTF-8"/>
                <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
                <meta name="robots" content="noindex, follow"/>
                <title>Sitemap - Shapes By Satiinder Kaur</title>
                <link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400;600&amp;family=Montserrat:wght@300;400;500;600&amp;display=swap" rel="stylesheet"/>
                <style>
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
body{background:#0f0f0f;color:#FAF6EE;font-family:Montserrat,sans-serif;font-size:13px;line-height:1.6;min-height:100vh}
.hdr{background:linear-gradient(135deg,#111 0%,#1a1a1a 100%);border-bottom:1px solid rgba(197,160,89,.25);padding:2.5rem 2rem;text-align:center}
.brand{font-family:'Cormorant Garamond',serif;font-size:2.2rem;font-weight:300;letter-spacing:.25em;color:#C5A059;text-transform:uppercase;margin-bottom:.3rem}
.sub{font-size:10px;letter-spacing:.18em;text-transform:uppercase;color:rgba(197,160,89,.55);margin-bottom:1rem}
.meta{display:inline-flex;gap:1.5rem;background:rgba(197,160,89,.06);border:1px solid rgba(197,160,89,.2);border-radius:100px;padding:.5rem 1.5rem;font-size:11px;color:rgba(255,255,255,.5)}
.meta strong{color:#C5A059}
.note{margin-top:.8rem;font-size:10px;color:rgba(255,255,255,.22);letter-spacing:.05em}
.body{max-width:900px;margin:2.5rem auto;padding:0 1.5rem 4rem}
.stitle{font-family:'Cormorant Garamond',serif;font-size:1.1rem;letter-spacing:.15em;text-transform:uppercase;color:rgba(197,160,89,.7);margin-bottom:1rem;padding-bottom:.5rem;border-bottom:1px solid rgba(197,160,89,.12)}
.card{background:rgba(255,255,255,.025);border:1px solid rgba(197,160,89,.1);border-radius:6px;padding:1rem 1.2rem;margin-bottom:.6rem;display:grid;grid-template-columns:1fr auto;align-items:center;gap:1rem;transition:border-color .25s}
.card:hover{border-color:rgba(197,160,89,.4);background:rgba(197,160,89,.04)}
.card a{color:#C5A059;text-decoration:none;font-size:12px;font-weight:500;word-break:break-all}
.card a:hover{text-decoration:underline}
.lm{font-size:10px;color:rgba(255,255,255,.3);margin-top:3px}
.badges{display:flex;gap:6px;flex-wrap:wrap;justify-content:flex-end;flex-shrink:0}
.badge{font-size:9px;font-weight:600;letter-spacing:.08em;text-transform:uppercase;padding:3px 8px;border-radius:100px;white-space:nowrap}
.bh{background:rgba(197,160,89,.2);color:#C5A059;border:1px solid rgba(197,160,89,.4)}
.bm{background:rgba(100,149,237,.15);color:#8ab0f5;border:1px solid rgba(100,149,237,.3)}
.bl{background:rgba(255,255,255,.06);color:rgba(255,255,255,.4);border:1px solid rgba(255,255,255,.1)}
.bf{background:rgba(37,211,102,.1);color:#25D366;border:1px solid rgba(37,211,102,.25)}
.imgs{margin-top:8px;padding-top:8px;border-top:1px solid rgba(255,255,255,.05);grid-column:1/-1;font-size:10px;color:rgba(255,255,255,.3)}
.foot{text-align:center;padding-top:2rem;border-top:1px solid rgba(197,160,89,.1);font-size:10px;color:rgba(255,255,255,.2)}
.foot a{color:rgba(197,160,89,.5);text-decoration:none}
.foot a:hover{color:#C5A059}
@media(max-width:600px){.card{grid-template-columns:1fr}.badges{justify-content:flex-start}.brand{font-size:1.5rem}}
                </style>
            </head>
            <body>
                <div class="hdr">
                    <div class="brand">Shapes By Satiinder Kaur</div>
                    <div class="sub">XML Sitemap &#8212; Search Engine Index</div>
                    <div class="meta">
                        <span><strong><xsl:value-of select="count(sitemap:urlset/sitemap:url)"/></strong> pages indexed</span>
                        <span>Updated: <strong>2026-08-23</strong></span>
                        <span>Domain: <strong>shapesbysatinderkaur.com</strong></span>
                    </div>
                    <div class="note">This sitemap is read by Google, Bing and other search engines. Submitted via Google Search Console.</div>
                </div>
                <div class="body">
                    <div class="stitle">&#10022; Indexed Pages</div>
                    <xsl:for-each select="sitemap:urlset/sitemap:url">
                        <xsl:variable name="p" select="sitemap:priority"/>
                        <div class="card">
                            <div>
                                <a href="{sitemap:loc}" target="_blank" rel="noopener"><xsl:value-of select="sitemap:loc"/></a>
                                <div class="lm">Last modified: <xsl:value-of select="sitemap:lastmod"/></div>
                                <xsl:if test="image:image">
                                    <div class="imgs">
                                        <xsl:for-each select="image:image">
                                            <div>&#x1F5BC; <xsl:value-of select="image:title"/></div>
                                        </xsl:for-each>
                                    </div>
                                </xsl:if>
                            </div>
                            <div class="badges">
                                <xsl:choose>
                                    <xsl:when test="number($p) &gt;= 0.9"><span class="badge bh">Priority <xsl:value-of select="$p"/></span></xsl:when>
                                    <xsl:when test="number($p) &gt;= 0.6"><span class="badge bm">Priority <xsl:value-of select="$p"/></span></xsl:when>
                                    <xsl:otherwise><span class="badge bl">Priority <xsl:value-of select="$p"/></span></xsl:otherwise>
                                </xsl:choose>
                                <span class="badge bf"><xsl:value-of select="sitemap:changefreq"/></span>
                            </div>
                        </div>
                    </xsl:for-each>
                    <div class="foot">
                        <a href="https://shapesbysatinderkaur.com/">&#8592; Return to Shapes By Satiinder Kaur</a>
                        &#160;&#183;&#160;
                        <a href="https://search.google.com/search-console" target="_blank">Submit to Google Search Console</a>
                    </div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>