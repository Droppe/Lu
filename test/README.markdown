### To run the tests

#### From the test server

	node test-server.js

#### From the build script
	
	node build.js --test

### Command line options:

#### Specify the browser

By default, the unit tests will run on all the browsers specified in `config.js`.  To specify the browser, you can use the `-b` option

`node build.js --test -b chrome`

#### Keep browser open

By default, after all the unit tests have completed running on a browser, that browser session will close.  You can choose to keep the browser open with the `-k` option

`node build.js --test -b true`

#### How to specify which unit tests to run

Insert the unit tests to run after `--`

`node build.js --test -- button.html checkbox.html`