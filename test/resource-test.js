var proxyquire = require('proxyquire');
var assert = require('chai').assert;

describe('Resource', function () {
	var options;
	beforeEach(function () {
		options = {
			resourceDefinition: {
				resource: 'testresource',
				actions: [{
					apiCall: 'apiCall',
					methodName: 'methodName',
					method: 'GET'
				}]
			},
			logger: {
				silly: function () {},
				info: function () {}
			}
		};
	});

	['POST', 'PUT', 'DELETE'].forEach(function (verb) {
		it('uses the request based on the verb for ' + verb + ' requests',
		function () {
			var requestSpy = createSpy();
			var request = {
				postOrPut: requestSpy.spy
			};
			var Resource = proxyquire('../lib/resource', {
				'./request': request
			});
			options.resourceDefinition.actions[0].method = verb;
			var resource = new Resource(options, {});

			assert.isFunction(resource.methodName);
			resource.methodName();
			assert.lengthOf(requestSpy.calls, 1);
			assert.equal(requestSpy.calls[0][0], verb);
		});
	});
	it('uses the request based on the verb for GET requests', function () {
		var spy = createSpy();
		var request = {
			get: spy.spy
		};
		var Resource = proxyquire('../lib/resource', {
			'./request': request
		});
		options.resourceDefinition.actions[0].method = 'GET';
		var resource = new Resource(options, {});

		assert.isFunction(resource.methodName);
		resource.methodName();
		assert.lengthOf(spy.calls, 1);
	});
});

function createSpy () {
	var calls = [];
	return {
		spy: function () {
			calls.push(arguments);
		},
		calls: calls
	};
}
