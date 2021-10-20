This is a starter template for [Learn Next.js](https://nextjs.org/learn).

# TODOs
* [done] finish official next.js tutorial (at this point lighthouse is 100/100 for statically generated pages)
* [done] add redux observable example with CSR
* investigate redux observable usage with SSR (i.e.: prerender books when a query string is present)
    * [done] initial setup (at this point lighthouse is 99/100 for SSR page)
    * integrate query param handling to have a client-side fallback (in case SSR fails/disabled for logged in users etc...)
    * make sure observables are clean up/completed when response is sent to client
    * refactor solution to make it nicer (extract completion handling to a util, find a nicer way to wrapper)
* add bundle analyzer to webpack config and inspect bundle size
* example of handling startup config (GA key, Contentful API key etc..)
* example of integrating a legacy system (i.e.: lazy-loaded AngularJS application on certain routes)
* check more how to prepopulate the most popular products: https://vercel.com/docs/concepts/next.js/incremental-static-regeneration