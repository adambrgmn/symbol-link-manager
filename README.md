# 👉 symbol-link-manager

`symbol-link-manager` can manage your projects symbolic links to ease your
developer life a little.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

* [The problem](#the-problem)
* [The solution](#the-solution)
* [Installation](#installation)
* [Usage](#usage)
* [Setup](#setup)
* [Contributors](#contributors)
* [License](#license)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## The problem

Let me explain why I needed this.

I started develop a site for a client, a WordPress site. And I found it tiresome
to open up all levels of folders and jump between the themes and plugins that I
used.

Even though I used [`roots/bedrock`](https://github.com/roots/bedrock) the
folders structure is still a bit too deep.

So I wanted to place them themes and plugins closer to the project root, and
decided to symlink them into the correct folders.

But I needed a simple solution to manage these links.

Enter `symbol-link-manager`.

## The solution

`symbol-link-manager` uses a central config and will automatically create your
symlinks upon executing the cli command.

In my use case it's best used alongside a `build`-script or after install.

## Installation

Install the cli useing `npm` or `yarn`.

```sh
$ npm i --save-dev symbol-link-manager
$ yarn add --dev symbol-link-manager
```

## Usage

After [creating the config file](#setup), `.symlinkrc`, you can run the
`symbol-link-manager` cli-command, either directly from the terminal, or as a
script inside `package.json`.

From terminal:

```sh
# From terminal
$ ./node_modules/.bin/symbol-link-manager
```

As script:

```json
{
  "scripts": {
    "setup-links": "symbol-link-manager"
  }
}
```

```sh
# And the from terminal
$ npm run setup-links
$ yarn run setup-links
```

**Tip:** Setup `symbol-link-manager` as a script that runs for example after
`install`:

```json
{
  "scripts": {
    "postinstall": "symbol-link-manager"
  }
}
```

## Setup

`symbol-link-manager` requires a root config file, named `.symlinkrc` to be set
up in the root of your project, alongside your `package.json`.

Inside it you defined the targets and the location of the links as key-values
formatted as JSON. The paths must be either absolute or relative to the root of
your project.

Example:

```json
{
  "./themes/{dir}": "./wp/wp-content/themes/{dir}",
  "./plugins/{dir}": "./wp/wp-content/plugins/{dir}"
}
```

This setup will create links for all directories inside `./themes` into
`./wp/wp-content/themes`, the same for `./plugins`.

**Note** that `symbol-link-manager` wont overwrite any existing files or links.
Instead the CLI command will present a simple overview of which link where
created and which were ignored.

### Options

There aren't much options to use. But you can tell `symbol-link-manager` to link
only folders, files or all using simple filter.

You use them inside the path strings inside `.symlinkrc`:

```json
{
  "./path1/{dir}": "./link1/{dir}", // Links only directories
  "./path2/{file}": "./link2/{file}", // Links only files
  "./path3/{all}": "./link3/{all}" // Links both directories and files
}
```

## Contributors

Thanks goes to these wonderful people
([emoji key](https://github.com/kentcdodds/all-contributors#emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->

<!-- prettier-ignore -->
| [<img src="https://avatars1.githubusercontent.com/u/13746650?v=4" width="100px;"/><br /><sub><b>Adam Bergman</b></sub>](http://fransvilhelm.com)<br />[💻](https://github.com/adambrgmn/symbol-link-manager/commits?author=adambrgmn "Code") [📖](https://github.com/adambrgmn/symbol-link-manager/commits?author=adambrgmn "Documentation") [🤔](#ideas-adambrgmn "Ideas, Planning, & Feedback") |
| :---: |

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the
[all-contributors](https://github.com/kentcdodds/all-contributors)
specification. Contributions of any kind welcome!

## License

MIT
