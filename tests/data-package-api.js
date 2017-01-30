'use strict';

var _ = require('lodash');
var assert = require('chai').assert;
var dataPackageApi = require('../app/front/scripts/services/data-package-api');

var data = require('./data');

describe('DataPackage API', function() {
  // Setup mocks
  before(function(done) {
    data.initMocks();
    done();
  });

  it('Should load settings', function(done) {
    dataPackageApi.loadConfig()
      .then(function(settings) {
        assert.deepEqual(settings, data.settings);
        done();
      })
      .catch(done);
  });

  it('Should load list of packages', function(done) {
    dataPackageApi.getDataPackages()
      .then(function(results) {
        assert.deepEqual(results, data.loadedPackages);
        done();
      })
      .catch(done);
  });

  it('Should create package model from raw data', function(done) {
    var packageModel = dataPackageApi.createPackageModel(
      'Package1', data.package1Package, data.package1Model.model);
    assert.deepEqual(packageModel, data.package1PackageModelBare);
    done();
  });

  it('Should create package model from loaded data', function(done) {
    dataPackageApi.getDataPackage('Package1')
      .then(function(packageModel) {
        var temp = _.cloneDeep(data.package1PackageModel);
        delete temp.seriesHierarchies;
        assert.deepEqual(packageModel, temp);
        done();
      })
      .catch(done);
  });
});
