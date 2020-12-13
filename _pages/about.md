---
layout: about
title: about
permalink: /
description: 

profile:
  align: left
  image: prof_pic.jpg
  address:

news: false  # includes a list of news items
selected_papers: false # includes a list of papers marked as "selected={true}"
social: false  # includes social icons at the bottom of the page
years: [2020, 2019, 2018, 2017]
---

<h2>
Mayank Rathee
</h2>

Email ~ mayankr at berkeley dot edu

<!--Write your biography here. Tell the world about yourself. Link to your favorite [subreddit](http://reddit.com){:target="\_blank"}. You can put a picture in, too. The code is already in, just name your picture `prof_pic.jpg` and put it in the `img/` folder.-->

<!--Put your address / P.O. box / other info right below your picture. You can also disable any these elements by editing `profile` property of the YAML header of your `_pages/about.md`. Edit `_bibliography/papers.bib` and Jekyll will render your [publications page](/al-folio/publications/) automatically.-->

<!--Link to your social media connections, too. This theme is set up to use [Font Awesome icons](http://fortawesome.github.io/Font-Awesome/){:target="\_blank"} and [Academicons](https://jpswalsh.github.io/academicons/){:target="\_blank"}, like the ones below. Add your Facebook, Twitter, LinkedIn, Google Scholar, or just disable all of them.-->
I am a first-year CS Ph.D. student at UC Berkeley.

From 2018-2020, I was a Research Fellow at Microsoft Research (MSR) India, where I worked closely with <a href="https://www.microsoft.com/en-us/research/people/nichandr/">Nishanth Chandran</a>, <a href="https://www.microsoft.com/en-us/research/people/digup/">Divya Gupta</a>, <a href="https://www.microsoft.com/en-us/research/people/rahsha/">Rahul Sharma</a> and <a href="https://www.microsoft.com/en-us/research/people/aseemr/">Aseem Rastogi</a> on the <a href="https://www.microsoft.com/en-us/research/project/ezpc-easy-secure-multi-party-computation/">EzPC</a> project.
I did my B.Tech. from the <a href="https://www.iitbhu.ac.in/">Indian Institute of Technology (Banaras Hindu University) Varanasi</a>. During my undergrad, I worked with <a href="http://chepurnoy.org/">Alexander Chepurnoy</a>, Prof. <a href="http://www.f.waseda.jp/tkoshiba/">Takeshi Koshiba</a>, <a href="http://t2r2.star.titech.ac.jp/cgi-bin/researcherinfo.cgi?lv=en&q_researcher_content_number=CTT100381367">Keisuke Tanaka</a> and <a href="https://iohk.io/en/team/mario-larangeira">Mario Larangeira</a>.


<br>
<br>
<br>


<div class="news">
  <h4>News</h4>
    <ul>
        <li><b>Jun 2020</b> ~ I have extended my stay at MSR until the end of this year and will be starting my Ph.D. at Berkeley in Spring 2021.</li>
        <li><b>Feb 2020</b> ~ I will be joining UC Berkeley as a Ph.D. student starting this Fall.</li>
    </ul>
</div>
<div class="publications">
  <h4>Publications</h4>
    {% for y in page.years %}
      <h6 class="year">{{y}}</h6>
      {% bibliography -f papers -q @*[year={{y}}]* %}
    {% endfor %}
</div>

