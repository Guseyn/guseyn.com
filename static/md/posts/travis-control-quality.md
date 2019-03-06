# How I Control Quality of NPM Packages via TravisCI
<div class="date">6 March 2019</div>

<div class="tags">
  <a class="tag" href="/../tags/npm">npm</a>
  <a class="tag" href="/../tags/travisci">Travis CI</a>
</div>

Let's say you want to create an open source JS library and publish it to **npm** and also release it to **github**. You can do it manually, but it's not convinient and you'll not be able to control quality of your project. I've created a solution that can help to automatize the whole process and allows to catch problems in code before it's released. In this article I'll share my variation of configuration that I use in [Travis CI](https://travis-ci.org/) and try to explain in details how it works. You might find it very useful, especially if you use restricted master branch in your repo.

Let's consider following *git flow* that you can use for your project:

1. Before making changes in your library you create *release branch* for your next release. It's better to name it in format `release-1.2.3` using next npm version of your library. Since that moment you work only in this branch, and your goal is to merge this branch into `master` when everything is ready.

2. Your commits in release branch can be devided into two groups: *regular commits* and *release commit*. The message of your **release commit** must be a number of your release, i.e. like `1.2.3`.

3. You need to use static analysis, unit tests and test coverage tool for controlling quality of your code. And you need to be able to build your package via one command such as `npm run build` which runs all checks. Your build must fail if any of these checks fails.

4. You have to add rules for your `master` branch in order to protect it from merging broken code. So, before being merged your code must pass all checks.

5. After *release commit* you have to create a pull request that triggers Travis CI to build your library.

6. If everything is ok, you can merge your code into `master`. If not, you have to fix the problems and create again release commit in the end.

7. After merging your code into master branch, Travis CI will be triggered again and will detect your release commit. It means that it must deploy your library to npm and create release in github.

For js libraries I would recommend [eslint](https://github.com/eslint/eslint) for static analysis, [test-executor](https://github.com/Guseyn/node-test-executor) for running unit tests and [nyc](https://github.com/istanbuljs/nyc) as a tool for test coverage.

So, for the *git flow* that has been described above I use a configuration (*.travis.yml* in the root of repo) with following sections: `language`, `install`, `script`, `branches`, `before_deploy`, and `deploy`.

**language**

Here we indicate that we use last version of node (you can specify the version).

```bash
language: node_js
node_js:
- lts/*
```

**install**

In this section, we install all dependencies of project and also [codecov](https://github.com/codecov/codecov-node) module (we need it for badge with test coverage information).

```bash
install: |-
  npm ci
  npm install -g codecov
```

**script**

This section runs our build. If our build fails we terminate Travis CI process via command `travis_terminate 1`. It guarantees that if something is wrong in our build, Travis does not exit with success code `0`. Then we generate `nyc` report and invoke codecov to process the report. And finally, we get change log using Travis variable `$TRAVIS_COMMIT_RANGE`(we will use it as information for github release).

```bash
script: |-
  npm run build || travis_terminate 1
  ./node_modules/.bin/nyc report --reporter lcovonly -- -R spec
  codecov
  log=$(git log $TRAVIS_COMMIT_RANGE --oneline)
  echo $'**Change log:**<br/>'${log//$'\n'/<br/>}
```

**branches**

Here we tell Travis to trigger only on changes in `master` branch. Also, you have to configure Travis to build pushed pull requests(in the settings of your project).

```bash
branches:
  only:
    - master
```

<img style="max-width: 280px;" src="/../../image/build-pushed-pr.png">

**before_deploy**

Here we just export `tag` and `body` as changelog (all new commits in `master` branch) our future release in bash variables.

```bash
before_deploy: |-
  log=$(git log $TRAVIS_COMMIT_RANGE --oneline)
  export TAG=$'v'$TRAVIS_COMMIT_MESSAGE
  export BODY=$'**Change log:**<br/>'${log//$'\n'/<br/>}
```

Notice that we have to replace all `'\n'` with `'<br/>'` in `body`. Otherwise, github wouldn't show it properly.

**deploy**

Use following commands to setup deploy for **npm** and **github** respectively:

```bash
travis setup npm
travis setup releases
```

This is a deploy provider for github releases:

```bash
deploy:
  - provider: releases
    skip_cleanup: true
    api_key:
      secure: <your_encoded_key>
    file: README.md
    name: Release $TRAVIS_COMMIT_MESSAGE
    tag_name: $TAG
    body: $BODY
    on:
      repo: <your_repo_name>
      branch:
        - master
      condition: $TRAVIS_COMMIT_MESSAGE =~ ^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$
```

Remember that you deploy your package if only your master branch contains new release commit. Aslo, we create here new release tag.

And that's a deploy provider for npm:

```bash
deploy:
  - provider: npm
      email: <your_email>
      api_key:
        secure: <your_encoded_key>
      on:
        repo: <your_repo_name>
        branch:
          - master
        condition: $TRAVIS_COMMIT_MESSAGE =~ ^([0-9]{1,3}).([0-9]{1,3}).([0-9]{1,3})$
```

You can use command [`npm version`](https://docs.npmjs.com/cli/version.html) for creating release commit.

As a result you get github releases that look something like this:

![git-release](/../../image/git-release.png)

You might ask, why don't I use git tags for deploying? Well, for some strange reason tags disappear after merging `release branch` into `master` and deployment does not run. I tried find out why this is happening, but with no results. If you have any ideas on this, please share in the comments.

[Here](/../../yml/travis.yml) is complete configuration.

So, that's it. I hope you found this article useful.
