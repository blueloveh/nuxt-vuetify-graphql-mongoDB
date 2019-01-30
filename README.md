<p align="center"><img align="center" style="width:320px" src="http://www.uwyo.edu/reslife-dining/_files/re-design-images/dining-logos/rendezvouslogo_2016.png"/></p><br/>
<p align="center">
  <a href="https://circleci.com/gh/nuxt/nuxt.js"><img src="https://badgen.net/circleci/github/nuxt/nuxt.js/dev" alt="Build Status"></a>
  <a href="https://dev.azure.com/nuxt/nuxt.js/_build/latest?definitionId=1"><img src="https://dev.azure.com/nuxt/nuxt.js/_apis/build/status/nuxt.js" alt="Azure Build Status"></a>
  <a href="https://codecov.io/gh/nuxt/nuxt.js"><img src="https://badgen.net/codecov/c/github/nuxt/nuxt.js/dev" alt="Coverage Status"></a>
  <a href="https://www.npmjs.com/package/nuxt"><img src="https://badgen.net/npm/dm/nuxt" alt="Downloads"></a>
  <a href="https://www.npmjs.com/package/nuxt"><img src="https://badgen.net/npm/v/nuxt" alt="Version"></a>
  <a href="https://www.npmjs.com/package/nuxt"><img src="https://badgen.net/npm/license/nuxt" alt="License"></a>
  <a href="https://discord.nuxtjs.org/"><img src="https://badgen.net/badge/Discord/join-us/7289DA" alt="Discord"></a>
 </p>
 <p align="center">
  <a href="#partners" alt="Partner on Open Collective"><img src="https://opencollective.com/nuxtjs/tiers/partner/badge.svg" /></a>
  <a href="#sponsors" alt="Sponsors on Open Collective"><img src="https://opencollective.com/nuxtjs/tiers/sponsors/badge.svg" /></a>
  <a href="#backers" alt="Backers on Open Collective"><img src="https://opencollective.com/nuxtjs/tiers/backers/badge.svg" /></a>
  <a href="https://oc.nuxtjs.org/"><img src="https://img.shields.io/badge/Support%20us-Open%20Collective-41B883.svg" alt="Support us"></a>
</p>
<p align="center">
  <a href="https://otechie.com/nuxt?ref=badge"><img src="https://api.otechie.com/consultancy/nuxt/badge.svg" alt="Hire Nuxt"></a>
</p>

> *쉽고, 빠르게!* 인증(회원가입/로그인)과 사용자 권한 기능이 구현된 Nuxt.js 기반의 상용구 코드.

## Nuxt Links

- 📘 Documentation: [https://nuxtjs.org](https://nuxtjs.org)
- 👥 Community: [cmty.app/nuxt](https://cmty.app/nuxt)
- 🎬 Video: [1 minute demo](https://www.youtube.com/watch?v=kmf-p-pTi40)
- 🐦 Twitter: [@nuxt_js](https://twitter.nuxtjs.org/)
- 💬 Chat: [Discord](https://discord.nuxtjs.org/)
- 📦 [Nuxt.js Modules](https://github.com/nuxt-community/modules)
- 👉 [Play with Nuxt.js online](https://template.nuxtjs.org)

## Features

- Nuxt.js 기반( SSR, Module, Plugin, Middleware, Custom Layout, Static file serving ...)
- Node Application Server([Express](https://expressjs.com/))
- Query language for APIs([Graphql](https://graphql.org/), [Apollo](https://www.apollographql.com/))
- NoSQL Database([MongoDB](https://www.mongodb.com/))
- Material CSS Framework([vuetify](https://www.npmjs.com/package/vue-kindergarten))
- 토큰 기반 사용자 인증([Jwt](https://jwt.io/))
- 사용자/그룹 권한 관리([vue-kindergarten](https://www.npmjs.com/package/vue-kindergarten))
- 소셜 인증([Passport](http://www.passportjs.org/))
- 화면: 홈, 회원가입/로그인, 프로필, 어드민

## 설치

```
$ git clone https://github.com/she110ff/nuxt-vuetify-graphql-mongoDB.git
$ cd nuxt-vuetify-graphql-mongoDB
$ npm install
```

## 시작하기

```
$ npm run dev(or start)
```

## 테스트

```
$ npm test
```

참 쉽죠!

## nuxt.config.js 설정

```js
const VuetifyLoaderPlugin = require('vuetify-loader/lib/plugin')
const pkg = require('./package')

module.exports = {
  mode: 'universal',

  /*
  ** Headers of the page
  */
  head: {
    title: pkg.name,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: pkg.description }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
      {
        rel: 'stylesheet',
        href:
          'https://fonts.googleapis.com/css?family=Roboto:300,400,500,700|Material+Icons'
      }
    ]
  },

  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },

  /*
  ** Global CSS
  */
  css: ['~/assets/style/app.styl'],

  /*
  ** Plugins to load before mounting the App
  */
  plugins: ['@plugins/vuetify'],

  /*
  ** Nuxt.js modules
  */
  modules: [
    '@nuxtjs/pwa',
    [
      '@nuxtjs/apollo',
      {
        clientConfigs: {
          default: '~/graphql/apollo/defaultClient.js'
        }
      }
    ]
  ],

  router: {
    middleware: 'check-auth'
  },

  vendor: ['apollo-link-context'],
  /*
  ** Build configuration
  */
  build: {
    transpile: ['vuetify/lib'],
    plugins: [new VuetifyLoaderPlugin()],
    loaders: {
      stylus: {
        import: ['~assets/style/variables.styl']
      }
    },

    /*
    ** You can extend webpack config here
    */
    extend(config, ctx) {
      // Run ESLint on save
      if (ctx.isDev && ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}

```

Learn more: https://nuxtjs.org/guide/configuration

## .babelrc

You might want to use your own server with your configurations, your API and everything awesome your created with. That's why you can use nuxt.js as a middleware. It's recommended to use it at the end of your middleware since it will handle the rendering of your web application and won't call next().

```json
{
  "env": {
    "test": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "targets": {
              "node": "current"
            }
          }
        ],
        "@nuxt/babel-preset-app"
      ]
    }
  },
  "plugins": ["babel-plugin-transform-runtime", "transform-async-to-generator"]
}

```

Learn more: https://babeljs.io/docs/en/config-files#root-babelconfigjs-files

## Demo

 https://nuxtjs.org/examples

## Production deployment

To deploy, instead of running nuxt, you probably want to build ahead of time. Therefore, building and starting are separate commands:

```bash
nuxt build
nuxt start
```

For example, to deploy with [`now`](https://zeit.co/now) a `package.json` like follows is recommended:
```json
{
  "name": "my-app",
  "dependencies": {
    "nuxt": "latest"
  },
  "scripts": {
    "dev": "nuxt",
    "build": "nuxt build",
    "start": "nuxt start"
  }
}
```
Then run `now` and enjoy!

Note: we recommend putting `.nuxt` in `.npmignore` or `.gitignore`.

## Core team

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore -->
| [<img src="https://avatars2.githubusercontent.com/u/904724?v=4" width="120px;"/><br /><sub><b>Sébastien Chopin</b></sub>](https://github.com/atinux)<br />[📝](#blog-Atinux "Blogposts") [🐛](https://github.com/Atinux/Nuxt.js/issues?q=author%3AAtinux "Bug reports") [💻](https://github.com/Atinux/Nuxt.js/commits?author=Atinux "Code") [🎨](#design-Atinux "Design") [📖](https://github.com/Atinux/Nuxt.js/commits?author=Atinux "Documentation") [💬](#question-Atinux "Answering Questions") [👀](#review-Atinux "Reviewed Pull Requests") [📢](#talk-Atinux "Talks") |
| :---: | :---: | :---: | :---: |
<!-- ALL-CONTRIBUTORS-LIST:END -->

## Contributors

Thank you to all our [contributors](https://github.com/nuxt/nuxt.js/graphs/contributors)!

<a href="https://github.com/nuxt/nuxt.js/graphs/contributors"><img src="https://opencollective.com/nuxtjs/contributors.svg?width=890&button=false" /></a>

## Cross-browser testing

Thanks to BrowserStack!

<a href="http://browserstack.com"><img height="70" src="https://p3.zdusercontent.com/attachment/1015988/PWfFdN71Aung2evRkIVQuKJpE?token=eyJhbGciOiJkaXIiLCJlbmMiOiJBMTI4Q0JDLUhTMjU2In0..aUrNFb8clSXsFwgw5BUTcg.IJr5piuCen7PmSSBHSrOnqM9K5YZfxX3lvbp-5LCqoKOi4CjjgdA419iqjofs0nLtm26FMURvZ8JRTuKB4iHer6lGu5f8dXHtIkYAHjP5fXDWkl044Yg2mSdrhF6uPy62GdlBYoYxwvgkNrac8nN_In8GY-qOC7bYmlZyJT7tsTZUTYbNMQiXS86YA5LgdCEWzWreMvc3C6cvZtVXIrcVgpkroIhvsTQPm4vQA-Uq6iCbTPA4oX5cpEtMtrlg4jYBnnAE4BTw5UwU_dY83ep5g.7wpc1IKv0rSRGsvqCG_q3g" alt="BrowserStack"></a>


## License

[MIT](https://github.com/nuxt/nuxt.js/blob/dev/LICENSE)
