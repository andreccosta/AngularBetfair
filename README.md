# Angular Betfair Client

> Due to recent gambling law changes in my country as of 14th of July Betfair has announced it is suspending all activity by the 31st of July and until a license is granted.

After trading Betfair markets for couple years using GT I was constantly expecting to see a lightweight browser-based solution come up (RT is not the answer). It never happened so I decided to start developing something like one myself.

> Keep in mind this is just a proof of concept. Meaning that if you were to use it in your browser *as is* you would run into issues due to cross-origin requests.
Here's a [good blog post](https://jvaneyck.wordpress.com/2014/01/07/cross-domain-requests-in-javascript/) about what they are, why your browser blocks them and possible *solutions*.

### Concept

The idea is to develop a good solid and fast trading application. Since running it inside your browser is pointless due to security restrictions one possible solution is to use something like [AppJS](http://appjs.com/), [Chromium Embedded](https://bitbucket.org/chromiumembedded/cef), [Brackets Sheell](https://github.com/adobe/brackets-shell) or even [node-webkit](https://github.com/nwjs/nw.js) in order to *convert* this into a native app (without sacrifing compatibility or speed).
