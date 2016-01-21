'use strict';

var assert = require('chai').assert;
var errs = require('../lib/errors');
var ApiHttpError = errs.ApiHttpError;
var OAuthError = errs.OAuthError;
var ApiParseError = errs.ApiParseError;
var ApiError = errs.ApiError;
var IdentifiedApiError = errs.IdentifiedApiError;
var RequestError = errs.RequestError;

describe('API HTTP Error', function() {

	it('uses the response body as the message', function() {
		var msg = 'You have exceeded your daily request limit of 4000';
		var err = new ApiHttpError(401, msg);

		assert.equal(err.message, msg);
	});

	it('uses the status code as the message when the body is empty',
		function() {

		var err = new ApiHttpError(401, '');

		assert.equal(err.message, 'Unexpected 401 status code');
	});

	it('uses the status code as the message when the response is not defined',
		function() {

		var err = new ApiHttpError(401);

		assert.equal(err.message, 'Unexpected 401 status code');
	});

	it('has a stack trace', function() {
		var err = new ApiHttpError(401);

		assert(err.stack);
	});

	it('is an identified API error', function() {
		var err = new ApiHttpError(400);
		assert.instanceOf(err, IdentifiedApiError,
			'expected instance of IdentifiedApiError');
	});
});

describe('API Parse Error', function () {

	it('uses the passed message as the message', function () {
		var err = new ApiParseError('my message', 'my response');

		assert.equal(err.message, 'my message');
	});

	it('sets the passed raw response as a property', function () {
		var err = new ApiParseError('my message', 'my raw response');

		assert.equal(err.response, 'my raw response');
	});

	it('has a stack trace', function() {
		var err = new ApiParseError();

		assert(err.stack);
	});

	it('is an identified API error', function() {
		var err = new ApiParseError();
		assert.instanceOf(err, IdentifiedApiError,
			'expected instance of IdentifiedApiError');
	});
});

describe('OAuthError', function () {
	it('is an identified API error', function() {
		var err = new OAuthError({
			errorMessage: 'api error message',
			code: 1234
		});
		assert.instanceOf(err, IdentifiedApiError,
			'expected instance of IdentifiedApiError');
	});
});

describe('Api Response Error', function () {

	it('uses error message returned from the api as the message', function () {
		var err = new ApiError({
			errorMessage: 'api error message',
			code: 1234
		});

		assert.equal(err.message, 'api error message');
	});

	it('sets the api response code as a property', function () {
		var err = new ApiError({
			errorMessage: 'api error message',
			code: 1234
		});

		assert.equal(err.code, 1234);
	});

	it('has a stack trace', function() {
		var err = new ApiError({
			errorMessage: 'api error message',
			code: 1234
		});

		assert(err.stack);
	});

	it('is an identified API error', function() {
		var err = new ApiError({
			errorMessage: 'api error message',
			code: 1234
		});
		assert.instanceOf(err, IdentifiedApiError,
			'expected instance of IdentifiedApiError');
	});
});

describe('RequestError', function () {
	it('works with encoded URLs', function () {
		var e;

		assert.doesNotThrow(function createRequestError() {
			e = new RequestError(new Error('root error'),
				'http://someserver/some%20encoded_url');
		}, 'error is constructed');

		assert.equal(e.toString(),
			'RequestError: for url http://someserver/some%20encoded_url: root error',
			'error message');
	});
});
