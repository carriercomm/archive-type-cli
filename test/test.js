'use strict';

var archiveType = require('../');
var fs = require('fs');
var path = require('path');
var spawn = require('child_process').spawn;
var test = require('ava');

test('detect archive type from Buffer', function (t) {
	t.plan(4);

	fs.readFile(path.join(__dirname, 'fixtures/test.tar'), function (err, buf) {
		t.assert(!err, err);
		t.assert(archiveType(buf) === 'tar');

		fs.readFile(path.join(__dirname, 'fixtures/test.zip'), function (err, buf) {
			t.assert(!err, err);
			t.assert(archiveType(buf) === 'zip');
		});
	});
});

test('detect archive type from Buffer using CLI', function (t) {
	t.plan(2);

	var src = fs.createReadStream(path.join(__dirname, 'fixtures/test.tar'));
	var cp = spawn(path.join(__dirname, '../cli.js'));

	cp.stdout.setEncoding('utf8');
	cp.stdout.on('data', function (data) {
		t.assert(data);
		t.assert(data.trim() === 'tar');
	});

	src.pipe(cp.stdin);
});
