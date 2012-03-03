$(function() {

	var socket = io.connect('http://localhost');
		failedTests = [],
		currTest = {},
		unit_tests = [],
		currentIndex = 0,

		$BODY  = $(document.body),
		$TEST_CONTAINER  = $('#test-container');

	var tester = {
		init: function(result) {
			tester.configureQUnit();
    		unit_tests = result;
			tester.runNextTest();
		},
		configureQUnit: function() {

			function onLog(obj) {
				if (!obj.result) {
					currTest.message = obj.message;
					failedTests.push(currTest);
				}
			}

			function onTestDone(obj) {
				if (obj.failed > 0) {
					currTest.module = obj.module;
					currTest.name = obj.name;
				}
			}

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
			QUnit.reset();
			QUnit.init();
		},
		runNextTest: function() {
			console.log('loading', 'unit-tests/' + unit_tests[currentIndex])
			
			tester.clear();

			$TEST_CONTAINER
				.one('luExecuted', function() {
					socket.emit('executing', unit_tests[currentIndex-1]);
					run();
					QUnit.start();	
				})
				.html('')
				.load('unit-tests/' + unit_tests[currentIndex], function () {
					window.lu.execute($TEST_CONTAINER);
				});

			currentIndex++;
		}
	}

    require.clearCache();
    require.ensure( ['lu'], function() {
    	$.getJSON('getTests', function(result) {
    		tester.init(result);
		});
    });

});