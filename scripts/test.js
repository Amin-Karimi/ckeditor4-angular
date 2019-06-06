const { spawn } = require( 'child_process' );
const options = parseArguments( process.argv.slice( 2 ) );
const env = Object.create( process.env );

// This file is a workaround for Angular CLI not allowing to run tests with custom options.
// Manually running `karma start ./src/karma.conf.js` doesn't work either.
// Some of the plugins check if test is run by Angular CLI, and if not, they throw.
// https://github.com/angular/angular-cli/issues/12305

env.CK_OPTIONS = JSON.stringify( options );

spawn( 'ng', [ 'test' ], {
	stdio: 'inherit',
	env
} );

/**
 * @param {Array.<String>} args CLI arguments and options.
 * @returns {Object} options
 * @returns {Boolean} options.url `ckeditor.js` url to be included by karma.
 */
function parseArguments( args ) {
	const minimist = require( 'minimist' );

	const config = {
		string: [
			'url'
		],

		alias: {
			u: 'url'
		}
	};

	const options = minimist( args, config );

	// Delete all aliases because we don't want to use them in the code.
	// They are useful when calling command but useless after that.
	for ( const alias of Object.keys( config.alias ) ) {
		delete options[ alias ];
	}

	return options;
}
