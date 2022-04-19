# [TranslateWith.Wiki](https://translatewith.wiki)

![logo](https://marienraat.nl/blog/translatewith-wiki/logo.svg)

This web app lets you translate any term or concept using Wikipedia
language links! Check it out live at
[https://translatewith.wiki](https://translatewith.wiki) or read my
[blog post to learn more](https://marienraat.nl/blog/posts/translatewith-wiki/). All
the code is open source, you are free to use it under the GNU Affero
General Public License version 3 or (at your option) any later
version.

## The problem

Although machine translation is far from perfect, over the past years
services like [Google Translate](https://translate.google.com) and
[DeepL](https://www.deepl.com/translator) have made it possible to at
least catch the gist of a huge number of texts that would otherwise be
unavailable to non speakers. These kind of machine translation
services use deep learning to translate whole texts and do a great job
at translating large texts. However, when faced with single concepts
or terms they fail quite often, usually by translating a term much too
literally.

![Google Translate translates the Dutch term "Mexicaanse griep" to "Mexican flu" in english](https://marienraat.nl/blog/translatewith-wiki/mexicaanse-griep-gt.png)


For example the
[2009 swine flu pandemic](https://en.wikipedia.org/wiki/2009_swine_flu_pandemic)
was known in the Netherlands as the
[Mexicaanse griep](https://nl.wikipedia.org/wiki/Mexicaanse_griep),
refering to the country where it was first detected. However, as you
can see in the screenshot above, Google Translate would translate
"Mexicaanse Griep" completely literally as "Mexican flu". This can be
very confusing when communicating with someone from another culture,
so when I want to translate a concept like this I usually go to
[Wikipedia](https://www.wikipedia.org), search for the concept and
select the language I want to translate to from the "Other languages"
feature. However, this is quite some work, a lot of scrolling and
clicking.

## The solution

What if we could make this a bit easier? If we have an interface
similar to Google Translate, but with the accuracy of Wikipedia
translations? That's what I've tried to make with
[TranslateWith.Wiki](https://translatewith.wiki).

![TranslateWith.Wiki gives the correct translation for "Mexicaanse griep"](https://marienraat.nl/blog/translatewith-wiki/mexicaanse-griep-translatewith.png)

You simply enter the term that you want to translate and a search is
done on Wikipedia. The site then shows matching articles and the
language links of those articles are then used to translate the term
into the language of your choice. Some contextual information and nice
images are also shown, to help you understand the translation. I even
implemented that nice *Detect language* feature that Google Translate
and DeepL also have, so you don't have to bother choosing the input
language usually!

![TranslateWith.Wiki also has a "Detect language" feature](https://marienraat.nl/blog/translatewith-wiki/translatewith-detect-feature.png)

## The implementation

So how did I make [TranslateWith.Wiki](https://translatewith.wiki)?
Well, it is open source, so you can see so for yourself on
[Github](https://github.com/raatmarien/translatewith-wiki).

It was made with React and NodeJS, I really like the straight forward
set up of React for simple web apps like this. I used TypeScript and
sass to keep it all nice and tidy. The backend only needs to serve the
layouts and scripts to the frontend, because all logic is handled on
the frontend.

For our communication with Wikipedia, we can use the awesome
[MediaWiki API](https://www.mediawiki.org/wiki/API:Main_page) that all
the different Wikipedia languages implement. When the user wants to
translate a term, we call the API of the source language Wikipedia
from the local browser. We simply search for the term they enter and
display the results below. We automatically select the first one and
find the language links associated with this article. From nthose
language links we can simply get the right article in the destination
language and display the result.

The only tricky thing here was to parallelize all the requests
properly so that the user has to wait as little as possible. After
all, the whole goal of this website is convenience and convenience is
speed!

### Detecting the language

I struggled with how I could detect the language of the term most
efficiently. I believe this feature is crucial to save the user a tiny
bit of time. My first idea was to predict the language of the word
using some machine learning, but this is simply not accurate enough
for the short prompts that users would input. Furthermore, quite often
one same spelling of a word can exist in multiple languages with
different meanings and it would be impossible with this method to
distinguish between those.

My second idea was to simply search all the different Wikipedias with
the search string and chose the one that matches best. But there are
too many languages in the world and searching on all of them just
takes too long!

But then I found
[Wikidata](https://www.wikidata.org/wiki/Wikidata:Main_Page), which
stores all structured data from all the wikipedias. And this also has
a search function. On Wikidata we can search all the different
Wikipedias at the same time! Now we can just show the different
results in the different languages and the user can pick the one that
they meant. Only downside here is that this search can only be over
the metadata that is actually in Wikidata, which is not that much. So
when you use the *Detect language* feature, the input needs to be
pretty close to some Wikipedia article, otherwise it just won't be
found. Still, I think it works great for the most important concepts.

## Conclusion

In the end, [TranslateWith.Wiki](https://translatewith.wiki) is at
least something that I will use. It might save me a few seconds a week
on clicking through Wikipedia, so that is totally worth the hours it
took me to make right?

![XKCD comic about not saving time with automation](https://imgs.xkcd.com/comics/automation.png)

*Relevant [xkcd](https://xkcd.com/1319/), used under the Creative
Commons Attribution-NonCommercial 2.5 License.*

Anyway, maybe someone else finds it helpful as well. If you have any
suggestions on how to improve it, feel free to let me know by
[emailing me](mailto:contact@marienraat.nl), creating an issue on
[Github](https://github.com/raatmarien/translatewith-wiki) or simply
improving it yourself by writing a patch.
