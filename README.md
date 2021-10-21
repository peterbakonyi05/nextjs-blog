This is a starter template for [Learn Next.js](https://nextjs.org/learn).

# TODOs

- [done] finish official next.js tutorial (at this point lighthouse is 100/100 for statically generated pages)
  - This was almost one day including reading all the documentation and checking many articles, source code, trying many examples in the source code, playing around a bit with Vercel
- [done] add redux observable example with CSR
  - This was easy, only took 1-2 hours to have a basic example
- investigate redux observable usage with SSR (i.e.: prerender books when a query string is present)
  - This was a really complex task mainly because there isn't an official way of implementing SSR with `redux-observable`
  - [done] initial setup (at this point lighthouse is 99/100 for SSR page)
  - [done] integrate query param handling to have a client-side fallback (in case SSR fails/disabled for logged in users and also to test how to change query param runtime on the client)
  - [done] refactor solution to make it nicer (extract completion handling to a util, find a nicer way to wrapper, possibly introduce inversifyJS at this point??)
  - make sure observables are clean up/completed when response is sent to client (test with another effect that has a timer)
  - document alternative approaches and link to useful exampels and github issues
- [done] add bundle analyzer to webpack config and inspect bundle size
- example for lazy-loaded redux slices
- example of handling startup config (GA key, Contentful API key etc..)
- example of integrating a legacy system (i.e.: lazy-loaded AngularJS application on certain routes)

Important but not needed part of POC:

- check more how to prepopulate the most popular products: https://vercel.com/docs/concepts/next.js/incremental-static-regeneration
- Sentry integration

# Knowledge sharing

- create a new page from scratch to implement rendering of books
- explain how an action may be missed / not missed (ping/pong example)
