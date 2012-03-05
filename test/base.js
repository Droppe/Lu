$(function() {

	var socket = io.connect('http://localhost');
		failedTests = [],
		currTest = {},
		unit_tests = [],
		currentIndex = 0,

		$BODY  = $(document.body),
		$TEST_CONTAINER  = $('#test-container');

	var tester = {
		/**
		* Initialize the test harness
		* @param {Array} $tests A collection of test files
		*/
		init: function(tests) {
			tester.configureQUnit();
    		unit_tests = tests;
			tester.runNextTest();
		},
		configureQUnit: function() {

			// Triggers whenever an assertion is run
			function onLog(obj) {
				if (!obj.result) {
					currTest.message = obj.message;
					failedTests.push(currTest);
				}
			}

			// Triggers when a set of assertions in a given test is done
			function onTestDone(obj) {
				if (obj.failed > 0) {
					currTest.module = obj.module;
					currTest.name = obj.name;
				}
			}

			// Triggers when the entire unit test is done
			function unitTestDone(obj) {
				var result = {
					file: unit_tests[currentIndex-1],
					failed: obj.failed,
					passed: obj.passed,
					runTime: obj.runTime,
					total: obj.total,
					failedTests: failedTests
				}
				
				console.log('DONE!', result);
				socket.emit('done', result);
				failedTests = [];

				if (currentIndex === unit_tests.length) {
					console.log('COMPLETE');
					return;
				}

				tester.runNextTest();
			}

			QUnit.config.autostart = false;

			QUnit.log(onLog);
			QUnit.testDone(onTestDone);
			QUnit.done(unitTestDone);
		},
		clear: function() {
			$TEST_CONTAINER.html('');
			QUnit.reset();
			QUnit.init();
		},
		runNextTest: function() {
			var testName = unit_tests[currentIndex];

			console.log('loading', 'unit-tests/' + testName)

			tester.clear();

			$TEST_CONTAINER
				.one('luExecuted', function() {
					socket.emit('executing', testName);
					run();
					QUnit.start();	
				})
				.load('unit-tests/' + testName, function () {
					window.lu.execute($TEST_CONTAINER);
				});

			currentIndex++;
		}
	}

    require.clearCache();
    require.ensure( ['lu'], function() {
    	$.getJSON('getTests', function(tests) {
    		tester.init(tests);
		});
    });

});