# joli.js demo project

[joli.js](https://github.com/xavierlacot/joli.js) is a javascript ORM for the
mobile applications framework [Appcelerator Titanium](http://www.appcelerator.com/).

This repository contains a simple example which demonstrates how to use joli.js. This ready-to-use project has been tested with Titanium 3.1.1.GA, and uses the unit tests framework [titanium-jasmine](https://github.com/guilhermechapiewski/titanium-jasmine), based on the excellent [Jasmine BDD framework](https://jasmine.github.io/).

## How to start the project

First, download the source code. Take care that joli.js itself is a submodule of this repository, so you may have to get it separately and put it in the `Resources/lib/vendor/joli.js` folder.

Go to the project root and type the command:

    $ titanium build --platform ios
