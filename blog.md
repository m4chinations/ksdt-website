---
layout: page
title: Blog
permalink: /blog/
---


<ul class="post-list">
{% for post in site.posts %}
  <li>
    <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>

    <h2>
      <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
    </h2>
    <span class='excerpt'>{{ post.excerpt }}</span><span class='readmore'><a href = '{{ post.url | prepend: site.baseurl }}'>...read more</a></span>
  </li>
{% endfor %}
</ul>

<p class="rss-subscribe">subscribe <a href="{{ "/feed.xml" | prepend: site.baseurl }}">via RSS</a></p>