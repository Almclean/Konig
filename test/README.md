Konig Tests
=====

The package contains two types of tests, Unit and Integration

Unit Test
==========

These are tests for the server side layer of Konig. They will test the individual functions to ensure the behave as 
expected

Integration Test
==========

These are tests that invoke the services and run black box tests. This is achieved by mocking out the components 
required to fulfill the service calls e.g. db calls

Executing tests
==========

There are two ways to run these, command line (grunt) or in Webstorm

The standard grunt command can be used to run these on the command line 

> grunt test

In Webstorm configure a standard Mocha test BDD, see [here](http://visionmedia.github.io/mocha/#interfaces) test runner, 
set the folder to this one and make suer to include sub folders