'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.TIME_ANIMATION_SPEED = exports.BASE_SPEED = exports.FILTER_COMPONENTS = exports.PLOT_TYPES = exports.FILTER_TYPES = exports.TimestampStepMap = undefined;

var _extends2 = require('babel-runtime/helpers/extends');

var _extends3 = _interopRequireDefault(_extends2);

var _FILTER_TYPES$timeRan, _FILTER_TYPES$range, _SupportedPlotType, _FILTER_COMPONENTS;

exports.getDefaultfilter = getDefaultfilter;
exports.getFilterProps = getFilterProps;
exports.getFieldDomain = getFieldDomain;
exports.filterData = filterData;
exports.isDataMatchFilter = isDataMatchFilter;
exports.adjustValueToFilterDomain = adjustValueToFilterDomain;
exports.getNumericFieldDomain = getNumericFieldDomain;
exports.getTimestampFieldDomain = getTimestampFieldDomain;
exports.histogramConstruct = histogramConstruct;
exports.formatNumberByStep = formatNumberByStep;
exports.isInRange = isInRange;
exports.getTimeWidgetTitleFormatter = getTimeWidgetTitleFormatter;
exports.getTimeWidgetHintFormatter = getTimeWidgetHintFormatter;
exports.isValidFilterValue = isValidFilterValue;
exports.getFilterPlot = getFilterPlot;
exports.getDefaultFilterPlotType = getDefaultFilterPlotType;

var _moment = require('moment');

var _moment2 = _interopRequireDefault(_moment);

var _d3Array = require('d3-array');

var _keymirror = require('keymirror');

var _keymirror2 = _interopRequireDefault(_keymirror);

var _defaultSettings = require('../constants/default-settings');

var _dataUtils = require('./data-utils');

var _dataScaleUtils = require('./data-scale-utils');

var ScaleUtils = _interopRequireWildcard(_dataScaleUtils);

var _utils = require('./utils');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var TimestampStepMap = exports.TimestampStepMap = [{ max: 1, step: 0.05 }, { max: 10, step: 0.1 }, { max: 100, step: 1 }, { max: 500, step: 5 }, { max: 1000, step: 10 }, { max: 5000, step: 50 }, { max: Number.POSITIVE_INFINITY, step: 1000 }];

var durationSecond = 1000;
var durationMinute = durationSecond * 60;
var durationHour = durationMinute * 60;
var durationDay = durationHour * 24;
var durationWeek = durationDay * 7;
var durationYear = durationDay * 365;

var FILTER_TYPES = exports.FILTER_TYPES = (0, _keymirror2.default)({
  range: null,
  select: null,
  timeRange: null,
  multiSelect: null
});

var PLOT_TYPES = exports.PLOT_TYPES = (0, _keymirror2.default)({
  histogram: null,
  lineChart: null
});

var SupportedPlotType = (_SupportedPlotType = {}, _SupportedPlotType[FILTER_TYPES.timeRange] = (_FILTER_TYPES$timeRan = {
  default: 'histogram'
}, _FILTER_TYPES$timeRan[_defaultSettings.ALL_FIELD_TYPES.integer] = 'lineChart', _FILTER_TYPES$timeRan[_defaultSettings.ALL_FIELD_TYPES.real] = 'lineChart', _FILTER_TYPES$timeRan), _SupportedPlotType[FILTER_TYPES.range] = (_FILTER_TYPES$range = {
  default: 'histogram'
}, _FILTER_TYPES$range[_defaultSettings.ALL_FIELD_TYPES.integer] = 'lineChart', _FILTER_TYPES$range[_defaultSettings.ALL_FIELD_TYPES.real] = 'lineChart', _FILTER_TYPES$range), _SupportedPlotType);

var FILTER_COMPONENTS = exports.FILTER_COMPONENTS = (_FILTER_COMPONENTS = {}, _FILTER_COMPONENTS[FILTER_TYPES.select] = 'SingleSelectFilter', _FILTER_COMPONENTS[FILTER_TYPES.multiSelect] = 'MultiSelectFilter', _FILTER_COMPONENTS[FILTER_TYPES.timeRange] = 'TimeRangeFilter', _FILTER_COMPONENTS[FILTER_TYPES.range] = 'RangeFilter', _FILTER_COMPONENTS);

var BASE_SPEED = exports.BASE_SPEED = 600;
var TIME_ANIMATION_SPEED = exports.TIME_ANIMATION_SPEED = [{
  label: '1x',
  value: 1
}, {
  label: '2x',
  value: 2
}, {
  label: '4x',
  value: 4
}];

function getDefaultfilter(dataId) {
  return {
    // link to dataset Id
    dataId: dataId,
    // should allow to edit dataId
    freeze: false,
    id: (0, _utils.generateHashId)(4),
    enlarged: false,
    isAnimating: false,
    speed: 1,

    // field specific
    name: null,
    type: null,
    fieldIdx: null,
    domain: null,
    value: null,

    // plot
    plotType: PLOT_TYPES.histogram,
    yAxis: null,
    interval: null
  };
}

/**
 * Get default filter prop based on field type
 *
 * @param {Object[]} data
 * @param {object} field
 * @returns {object} default filter
 */
function getFilterProps(data, field) {
  var fieldType = field.type;
  var type = void 0;
  var value = void 0;

  var filterDomain = getFieldDomain(data, field);

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
      type = FILTER_TYPES.range;
      var typeOptions = [FILTER_TYPES.range];
      value = filterDomain.domain;
      return (0, _extends3.default)({}, filterDomain, {
        value: value,
        type: type,
        fieldType: fieldType,
        typeOptions: typeOptions
      });

    case _defaultSettings.ALL_FIELD_TYPES.boolean:
      type = FILTER_TYPES.select;
      value = true;
      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        value: value,
        fieldType: fieldType
      });

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      type = FILTER_TYPES.multiSelect;
      value = [];
      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        value: value,
        fieldType: fieldType
      });

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      type = FILTER_TYPES.timeRange;
      value = filterDomain.domain;

      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        value: value,
        fieldType: fieldType
      });

    default:
      type = fieldType;
      return (0, _extends3.default)({}, filterDomain, {
        type: type,
        fieldType: fieldType
      });
  }
}

/**
 * Calculate field domain based on field type and data
 *
 * @param {Object[]} data
 * @param {object} field
 * @returns {object} with domain as key
 */
function getFieldDomain(data, field) {
  var fieldIdx = field.tableFieldIndex - 1;
  var isTime = field.type === _defaultSettings.ALL_FIELD_TYPES.timestamp;
  var valueAccessor = _dataUtils.maybeToDate.bind(null, isTime, fieldIdx, field.format);
  var domain = void 0;

  switch (field.type) {
    case _defaultSettings.ALL_FIELD_TYPES.real:
    case _defaultSettings.ALL_FIELD_TYPES.integer:
      // calculate domain and step
      return getNumericFieldDomain(data, valueAccessor);

    case _defaultSettings.ALL_FIELD_TYPES.boolean:
      return { domain: [true, false] };

    case _defaultSettings.ALL_FIELD_TYPES.string:
    case _defaultSettings.ALL_FIELD_TYPES.date:
      domain = ScaleUtils.getOrdinalDomain(data, valueAccessor);
      return { domain: domain };

    case _defaultSettings.ALL_FIELD_TYPES.timestamp:
      return getTimestampFieldDomain(data, valueAccessor);

    default:
      return { domain: ScaleUtils.getOrdinalDomain(data, valueAccessor) };
  }
}

/**
 * Filter data based on an array of filters
 *
 * @param {Object[]} data
 * @param {string} dataId
 * @param {Object[]} filters
 * @returns {Object[]} data
 * @returns {Number[]} filteredIndex
 */
function filterData(data, dataId, filters) {
  if (!data || !dataId) {
    // why would there not be any data? are we over doing this?
    return { data: [], filteredIndex: [] };
  }

  if (!filters.length) {
    return { data: data, filteredIndex: data.map(function (d, i) {
        return i;
      }) };
  }

  var appliedFilters = filters.filter(function (d) {
    return d.dataId === dataId && d.fieldIdx > -1 && d.value !== null;
  });

  // we save a reference of allData index here to access dataToFeature
  // in geojson and hexgonId layer

  var _data$reduce = data.reduce(function (accu, d, i) {
    var matched = appliedFilters.every(function (filter) {
      return isDataMatchFilter(d, filter, i);
    });

    if (matched) {
      accu.filtered.push(d);
      accu.filteredIndex.push(i);
    }

    return accu;
  }, { filtered: [], filteredIndex: [] }),
      filtered = _data$reduce.filtered,
      filteredIndex = _data$reduce.filteredIndex;

  return { data: filtered, filteredIndex: filteredIndex };
}

/**
 * Check if value is in range of filter
 *
 * @param {Object[]} data
 * @param {Object} filter
 * @param {number} i
 * @returns {Boolean} - whether value falls in the range of the filter
 */
function isDataMatchFilter(data, filter, i) {
  var val = data[filter.fieldIdx];
  if (!filter.type) {
    return true;
  }

  switch (filter.type) {
    case FILTER_TYPES.range:
      return isInRange(val, filter.value);

    case FILTER_TYPES.timeRange:
      var timeVal = filter.mappedValue ? filter.mappedValue[i] : _moment2.default.utc(val).valueOf();
      return isInRange(timeVal, filter.value);

    case FILTER_TYPES.multiSelect:
      return filter.value.includes(val);

    case FILTER_TYPES.select:
      return filter.value === val;

    default:
      return true;
  }
}

/**
 * Call by parsing filters from URL
 * Check if value of filter within filter domain, if not adjust it to match
 * filter domain
 *
 * @param {string[] | string | number | number[]} value
 * @param {Array} filter.domain
 * @param {String} filter.type
 * @returns {*} - adjusted value to match filter or null to remove filter
 */

/* eslint-disable complexity */
function adjustValueToFilterDomain(value, _ref) {
  var domain = _ref.domain,
      type = _ref.type;

  if (!domain || !type) {
    return false;
  }

  switch (type) {
    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      if (!Array.isArray(value) || value.length !== 2) {
        return domain.map(function (d) {
          return d;
        });
      }

      return value.map(function (d, i) {
        return (0, _dataUtils.notNullorUndefined)(d) && isInRange(d, domain) ? d : domain[i];
      });

    case FILTER_TYPES.multiSelect:
      if (!Array.isArray(value)) {
        return [];
      }
      var filteredValue = value.filter(function (d) {
        return domain.includes(d);
      });
      return filteredValue.length ? filteredValue : [];

    case FILTER_TYPES.select:
      return domain.includes(value) ? value : true;

    default:
      return null;
  }
}
/* eslint-enable complexity */

/**
 * Calculate numeric domain and suitable step
 *
 * @param {Object[]} data
 * @param {function} valueAccessor
 * @returns {object} domain and step
 */
function getNumericFieldDomain(data, valueAccessor) {
  var domain = [0, 1];
  var step = 0.1;

  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];

  if (Array.isArray(data) && data.length > 1) {
    domain = ScaleUtils.getLinearDomain(mappedValue);
    var diff = domain[1] - domain[0];

    // in case equal domain, [96, 96], which will break quantize scale
    if (!diff) {
      domain[1] = domain[0] + 1;
    }

    step = getNumericStepSize(diff) || step;
    domain[0] = formatNumberByStep(domain[0], step, 'floor');
    domain[1] = formatNumberByStep(domain[1], step, 'ceil');
  }

  var _getHistogram = getHistogram(domain, mappedValue),
      histogram = _getHistogram.histogram,
      enlargedHistogram = _getHistogram.enlargedHistogram;

  return { domain: domain, step: step, histogram: histogram, enlargedHistogram: enlargedHistogram };
}

function getNumericStepSize(diff) {
  if (diff > 100) {
    return 1;
  } else if (diff < 20 && diff > 3) {
    return 0.01;
  } else if (diff <= 3) {
    return 0.001;
  }
}

/**
 * Calculate timestamp domain and suitable step
 *
 * @param {Object[]} data
 * @param {function} valueAccessor
 * @returns {object} domain and step
 */
function getTimestampFieldDomain(data, valueAccessor) {
  // to avoid converting string format time to epoch
  // every time we compare we store a value mapped to int in filter domain

  var mappedValue = Array.isArray(data) ? data.map(valueAccessor) : [];
  var domain = ScaleUtils.getLinearDomain(mappedValue);
  var step = 0.01;

  var diff = domain[1] - domain[0];
  var entry = TimestampStepMap.find(function (f) {
    return f.max >= diff;
  });
  if (entry) {
    step = entry.step;
  }

  var _getHistogram2 = getHistogram(domain, mappedValue),
      histogram = _getHistogram2.histogram,
      enlargedHistogram = _getHistogram2.enlargedHistogram;

  return { domain: domain, step: step, mappedValue: mappedValue, histogram: histogram, enlargedHistogram: enlargedHistogram };
}

function histogramConstruct(domain, mappedValue, bins) {
  return (0, _d3Array.histogram)().thresholds((0, _d3Array.ticks)(domain[0], domain[1], bins)).domain(domain)(mappedValue).map(function (bin) {
    return {
      count: bin.length,
      x0: bin.x0,
      x1: bin.x1
    };
  });
}
/**
 * Calculate histogram from domain and array of values
 *
 * @param {number[]} domain
 * @param {Object[]} mappedvalue
 * @returns {Array[]} histogram
 */
function getHistogram(domain, mappedValue) {
  var histogram = histogramConstruct(domain, mappedValue, 30);
  var enlargedHistogram = histogramConstruct(domain, mappedValue, 100);

  return { histogram: histogram, enlargedHistogram: enlargedHistogram };
}

/**
 * round number based on step
 *
 * @param {number} val
 * @param {number} step
 * @param {string} bound
 * @returns {number} rounded number
 */
function formatNumberByStep(val, step, bound) {
  if (bound === 'floor') {
    return Math.floor(val * (1 / step)) / (1 / step);
  }

  return Math.ceil(val * (1 / step)) / (1 / step);
}

function isInRange(val, domain) {
  if (!Array.isArray(domain)) {
    return false;
  }

  return val >= domain[0] && val <= domain[1];
}

function getTimeWidgetTitleFormatter(domain) {
  if (!Array.isArray(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0];
  return diff > durationYear ? 'MM/DD/YY' : diff > durationDay ? 'MM/DD hha' : 'MM/DD hh:mma';
}

function getTimeWidgetHintFormatter(domain) {
  if (!Array.isArray(domain)) {
    return null;
  }

  var diff = domain[1] - domain[0];
  return diff > durationYear ? 'MM/DD/YY' : diff > durationWeek ? 'MM/DD' : diff > durationDay ? 'MM/DD hha' : diff > durationHour ? 'hh:mma' : 'hh:mm:ssa';
}

/**
 * Sanity check on filters to prepare for save
 * @param {String} type - filter type
 * @param {*} value - filter value
 * @returns {boolean} whether filter is value
 */
function isValidFilterValue(_ref2) {
  var type = _ref2.type,
      value = _ref2.value;

  if (!type) {
    return false;
  }
  switch (type) {
    case FILTER_TYPES.select:
      return value === true || value === false;

    case FILTER_TYPES.range:
    case FILTER_TYPES.timeRange:
      return Array.isArray(value) && value.every(function (v) {
        return v !== null && !isNaN(v);
      });

    case FILTER_TYPES.multiSelect:
      return Array.isArray(value) && Boolean(value.length);

    case FILTER_TYPES.input:
      return Boolean(value.length);

    default:
      return true;
  }
}

function getFilterPlot(filter, allData) {
  if (filter.plotType === PLOT_TYPES.histogram || !filter.yAxis) {
    // histogram should be calculated when create filter
    return {};
  }

  var mappedValue = filter.mappedValue;
  var yAxis = filter.yAxis;

  // return lineChart

  var series = allData.map(function (d, i) {
    return {
      x: mappedValue[i],
      y: d[yAxis.tableFieldIndex - 1]
    };
  }).filter(function (_ref3) {
    var x = _ref3.x,
        y = _ref3.y;
    return Number.isFinite(x) && Number.isFinite(y);
  }).sort(function (a, b) {
    return (0, _d3Array.ascending)(a.x, b.x);
  });

  var yDomain = (0, _d3Array.extent)(series, function (d) {
    return d.y;
  });
  var xDomain = [series[0].x, series[series.length - 1].x];

  return { lineChart: { series: series, yDomain: yDomain, xDomain: xDomain }, yAxis: yAxis };
}

function getDefaultFilterPlotType(filter) {
  var filterPlotTypes = SupportedPlotType[filter.type];
  if (!filterPlotTypes) {
    return null;
  }

  if (!filter.yAxis) {
    return filterPlotTypes.default;
  }

  return filterPlotTypes[filter.yAxis.type] || null;
}
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uL3NyYy91dGlscy9maWx0ZXItdXRpbHMuanMiXSwibmFtZXMiOlsiZ2V0RGVmYXVsdGZpbHRlciIsImdldEZpbHRlclByb3BzIiwiZ2V0RmllbGREb21haW4iLCJmaWx0ZXJEYXRhIiwiaXNEYXRhTWF0Y2hGaWx0ZXIiLCJhZGp1c3RWYWx1ZVRvRmlsdGVyRG9tYWluIiwiZ2V0TnVtZXJpY0ZpZWxkRG9tYWluIiwiZ2V0VGltZXN0YW1wRmllbGREb21haW4iLCJoaXN0b2dyYW1Db25zdHJ1Y3QiLCJmb3JtYXROdW1iZXJCeVN0ZXAiLCJpc0luUmFuZ2UiLCJnZXRUaW1lV2lkZ2V0VGl0bGVGb3JtYXR0ZXIiLCJnZXRUaW1lV2lkZ2V0SGludEZvcm1hdHRlciIsImlzVmFsaWRGaWx0ZXJWYWx1ZSIsImdldEZpbHRlclBsb3QiLCJnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUiLCJTY2FsZVV0aWxzIiwiVGltZXN0YW1wU3RlcE1hcCIsIm1heCIsInN0ZXAiLCJOdW1iZXIiLCJQT1NJVElWRV9JTkZJTklUWSIsImR1cmF0aW9uU2Vjb25kIiwiZHVyYXRpb25NaW51dGUiLCJkdXJhdGlvbkhvdXIiLCJkdXJhdGlvbkRheSIsImR1cmF0aW9uV2VlayIsImR1cmF0aW9uWWVhciIsIkZJTFRFUl9UWVBFUyIsInJhbmdlIiwic2VsZWN0IiwidGltZVJhbmdlIiwibXVsdGlTZWxlY3QiLCJQTE9UX1RZUEVTIiwiaGlzdG9ncmFtIiwibGluZUNoYXJ0IiwiU3VwcG9ydGVkUGxvdFR5cGUiLCJkZWZhdWx0IiwiaW50ZWdlciIsInJlYWwiLCJGSUxURVJfQ09NUE9ORU5UUyIsIkJBU0VfU1BFRUQiLCJUSU1FX0FOSU1BVElPTl9TUEVFRCIsImxhYmVsIiwidmFsdWUiLCJkYXRhSWQiLCJmcmVlemUiLCJpZCIsImVubGFyZ2VkIiwiaXNBbmltYXRpbmciLCJzcGVlZCIsIm5hbWUiLCJ0eXBlIiwiZmllbGRJZHgiLCJkb21haW4iLCJwbG90VHlwZSIsInlBeGlzIiwiaW50ZXJ2YWwiLCJkYXRhIiwiZmllbGQiLCJmaWVsZFR5cGUiLCJmaWx0ZXJEb21haW4iLCJ0eXBlT3B0aW9ucyIsImJvb2xlYW4iLCJzdHJpbmciLCJkYXRlIiwidGltZXN0YW1wIiwidGFibGVGaWVsZEluZGV4IiwiaXNUaW1lIiwidmFsdWVBY2Nlc3NvciIsImJpbmQiLCJmb3JtYXQiLCJnZXRPcmRpbmFsRG9tYWluIiwiZmlsdGVycyIsImZpbHRlcmVkSW5kZXgiLCJsZW5ndGgiLCJtYXAiLCJkIiwiaSIsImFwcGxpZWRGaWx0ZXJzIiwiZmlsdGVyIiwicmVkdWNlIiwiYWNjdSIsIm1hdGNoZWQiLCJldmVyeSIsImZpbHRlcmVkIiwicHVzaCIsInZhbCIsInRpbWVWYWwiLCJtYXBwZWRWYWx1ZSIsInV0YyIsInZhbHVlT2YiLCJpbmNsdWRlcyIsIkFycmF5IiwiaXNBcnJheSIsImZpbHRlcmVkVmFsdWUiLCJnZXRMaW5lYXJEb21haW4iLCJkaWZmIiwiZ2V0TnVtZXJpY1N0ZXBTaXplIiwiZ2V0SGlzdG9ncmFtIiwiZW5sYXJnZWRIaXN0b2dyYW0iLCJlbnRyeSIsImZpbmQiLCJmIiwiYmlucyIsInRocmVzaG9sZHMiLCJjb3VudCIsImJpbiIsIngwIiwieDEiLCJib3VuZCIsIk1hdGgiLCJmbG9vciIsImNlaWwiLCJ2IiwiaXNOYU4iLCJCb29sZWFuIiwiaW5wdXQiLCJhbGxEYXRhIiwic2VyaWVzIiwieCIsInkiLCJpc0Zpbml0ZSIsInNvcnQiLCJhIiwiYiIsInlEb21haW4iLCJ4RG9tYWluIiwiZmlsdGVyUGxvdFR5cGVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7O1FBc0VnQkEsZ0IsR0FBQUEsZ0I7UUFnQ0FDLGMsR0FBQUEsYztRQXNFQUMsYyxHQUFBQSxjO1FBcUNBQyxVLEdBQUFBLFU7UUEyQ0FDLGlCLEdBQUFBLGlCO1FBdUNBQyx5QixHQUFBQSx5QjtRQXdDQUMscUIsR0FBQUEscUI7UUEwQ0FDLHVCLEdBQUFBLHVCO1FBbUJBQyxrQixHQUFBQSxrQjtRQWdDQUMsa0IsR0FB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LElBQXpCLENBQXhCO0FBQ0EsTUFBSSxDQUFDNEUsZUFBTCxFQUFzQjtBQUNwQixXQUFPLElBQVA7QUFDRDs7QUFFRCxNQUFJLENBQUNoRCxPQUFPeEIsS0FBWixFQUFtQjtBQUNqQixXQUFPd0UsZ0JBQWdCM0YsT0FBdkI7QUFDRDs7QUFFRCxTQUFPMkYsZ0JBQWdCaEQsT0FBT3hCLEtBQVAsQ0FBYUosSUFBN0IsS0FBc0MsSUFBN0M7QUFDRCIsImZpbGUiOiJmaWx0ZXItdXRpbHMuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgbW9tZW50IGZyb20gJ21vbWVudCc7XG5pbXBvcnQge2FzY2VuZGluZywgZXh0ZW50LCBoaXN0b2dyYW0gYXMgZDNIaXN0b2dyYW0sIHRpY2tzfSBmcm9tICdkMy1hcnJheSc7XG5pbXBvcnQga2V5TWlycm9yIGZyb20gJ2tleW1pcnJvcic7XG5cbmltcG9ydCB7QUxMX0ZJRUxEX1RZUEVTfSBmcm9tICcuLi9jb25zdGFudHMvZGVmYXVsdC1zZXR0aW5ncyc7XG5pbXBvcnQge21heWJlVG9EYXRlLCBub3ROdWxsb3JVbmRlZmluZWR9IGZyb20gJy4vZGF0YS11dGlscyc7XG5pbXBvcnQgKiBhcyBTY2FsZVV0aWxzIGZyb20gJy4vZGF0YS1zY2FsZS11dGlscyc7XG5pbXBvcnQge2dlbmVyYXRlSGFzaElkfSBmcm9tICcuL3V0aWxzJztcblxuZXhwb3J0IGNvbnN0IFRpbWVzdGFtcFN0ZXBNYXAgPSBbXG4gIHttYXg6IDEsIHN0ZXA6IDAuMDV9LFxuICB7bWF4OiAxMCwgc3RlcDogMC4xfSxcbiAge21heDogMTAwLCBzdGVwOiAxfSxcbiAge21heDogNTAwLCBzdGVwOiA1fSxcbiAge21heDogMTAwMCwgc3RlcDogMTB9LFxuICB7bWF4OiA1MDAwLCBzdGVwOiA1MH0sXG4gIHttYXg6IE51bWJlci5QT1NJVElWRV9JTkZJTklUWSwgc3RlcDogMTAwMH1cbl07XG5cbmNvbnN0IGR1cmF0aW9uU2Vjb25kID0gMTAwMDtcbmNvbnN0IGR1cmF0aW9uTWludXRlID0gZHVyYXRpb25TZWNvbmQgKiA2MDtcbmNvbnN0IGR1cmF0aW9uSG91ciA9IGR1cmF0aW9uTWludXRlICogNjA7XG5jb25zdCBkdXJhdGlvbkRheSA9IGR1cmF0aW9uSG91ciAqIDI0O1xuY29uc3QgZHVyYXRpb25XZWVrID0gZHVyYXRpb25EYXkgKiA3O1xuY29uc3QgZHVyYXRpb25ZZWFyID0gZHVyYXRpb25EYXkgKiAzNjU7XG5cbmV4cG9ydCBjb25zdCBGSUxURVJfVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICByYW5nZTogbnVsbCxcbiAgc2VsZWN0OiBudWxsLFxuICB0aW1lUmFuZ2U6IG51bGwsXG4gIG11bHRpU2VsZWN0OiBudWxsXG59KTtcblxuZXhwb3J0IGNvbnN0IFBMT1RfVFlQRVMgPSBrZXlNaXJyb3Ioe1xuICBoaXN0b2dyYW06IG51bGwsXG4gIGxpbmVDaGFydDogbnVsbFxufSk7XG5cbmNvbnN0IFN1cHBvcnRlZFBsb3RUeXBlID0ge1xuICBbRklMVEVSX1RZUEVTLnRpbWVSYW5nZV06IHtcbiAgICBkZWZhdWx0OiAnaGlzdG9ncmFtJyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLmludGVnZXJdOiAnbGluZUNoYXJ0JyxcbiAgICBbQUxMX0ZJRUxEX1RZUEVTLnJlYWxdOiAnbGluZUNoYXJ0J1xuICB9LFxuICBbRklMVEVSX1RZUEVTLnJhbmdlXToge1xuICAgIGRlZmF1bHQ6ICdoaXN0b2dyYW0nLFxuICAgIFtBTExfRklFTERfVFlQRVMuaW50ZWdlcl06ICdsaW5lQ2hhcnQnLFxuICAgIFtBTExfRklFTERfVFlQRVMucmVhbF06ICdsaW5lQ2hhcnQnXG4gIH1cbn07XG5cbmV4cG9ydCBjb25zdCBGSUxURVJfQ09NUE9ORU5UUyA9IHtcbiAgW0ZJTFRFUl9UWVBFUy5zZWxlY3RdOiAnU2luZ2xlU2VsZWN0RmlsdGVyJyxcbiAgW0ZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdF06ICdNdWx0aVNlbGVjdEZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMudGltZVJhbmdlXTogJ1RpbWVSYW5nZUZpbHRlcicsXG4gIFtGSUxURVJfVFlQRVMucmFuZ2VdOiAnUmFuZ2VGaWx0ZXInXG59O1xuXG5leHBvcnQgY29uc3QgQkFTRV9TUEVFRCA9IDYwMDtcbmV4cG9ydCBjb25zdCBUSU1FX0FOSU1BVElPTl9TUEVFRCA9IFt7XG4gIGxhYmVsOiAnMXgnLFxuICB2YWx1ZTogMVxufSwge1xuICBsYWJlbDogJzJ4JyxcbiAgdmFsdWU6IDJcbn0sIHtcbiAgbGFiZWw6ICc0eCcsXG4gIHZhbHVlOiA0XG59XTtcblxuZXhwb3J0IGZ1bmN0aW9uIGdldERlZmF1bHRmaWx0ZXIoZGF0YUlkKSB7XG4gIHJldHVybiB7XG4gICAgLy8gbGluayB0byBkYXRhc2V0IElkXG4gICAgZGF0YUlkLFxuICAgIC8vIHNob3VsZCBhbGxvdyB0byBlZGl0IGRhdGFJZFxuICAgIGZyZWV6ZTogZmFsc2UsXG4gICAgaWQ6IGdlbmVyYXRlSGFzaElkKDQpLFxuICAgIGVubGFyZ2VkOiBmYWxzZSxcbiAgICBpc0FuaW1hdGluZzogZmFsc2UsXG4gICAgc3BlZWQ6IDEsXG5cbiAgICAvLyBmaWVsZCBzcGVjaWZpY1xuICAgIG5hbWU6IG51bGwsXG4gICAgdHlwZTogbnVsbCxcbiAgICBmaWVsZElkeDogbnVsbCxcbiAgICBkb21haW46IG51bGwsXG4gICAgdmFsdWU6IG51bGwsXG5cbiAgICAvLyBwbG90XG4gICAgcGxvdFR5cGU6IFBMT1RfVFlQRVMuaGlzdG9ncmFtLFxuICAgIHlBeGlzOiBudWxsLFxuICAgIGludGVydmFsOiBudWxsXG4gIH07XG59XG5cbi8qKlxuICogR2V0IGRlZmF1bHQgZmlsdGVyIHByb3AgYmFzZWQgb24gZmllbGQgdHlwZVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZFxuICogQHJldHVybnMge29iamVjdH0gZGVmYXVsdCBmaWx0ZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldEZpbHRlclByb3BzKGRhdGEsIGZpZWxkKSB7XG4gIGNvbnN0IGZpZWxkVHlwZSA9IGZpZWxkLnR5cGU7XG4gIGxldCB0eXBlO1xuICBsZXQgdmFsdWU7XG5cbiAgY29uc3QgZmlsdGVyRG9tYWluID0gZ2V0RmllbGREb21haW4oZGF0YSwgZmllbGQpO1xuXG4gIHN3aXRjaCAoZmllbGQudHlwZSkge1xuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnJlYWw6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuaW50ZWdlcjpcbiAgICAgIHR5cGUgPSBGSUxURVJfVFlQRVMucmFuZ2U7XG4gICAgICBjb25zdCB0eXBlT3B0aW9ucyA9IFtGSUxURVJfVFlQRVMucmFuZ2VdO1xuICAgICAgdmFsdWUgPSBmaWx0ZXJEb21haW4uZG9tYWluO1xuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgdHlwZSxcbiAgICAgICAgZmllbGRUeXBlLFxuICAgICAgICB0eXBlT3B0aW9uc1xuICAgICAgfTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW46XG4gICAgICB0eXBlID0gRklMVEVSX1RZUEVTLnNlbGVjdDtcbiAgICAgIHZhbHVlID0gdHJ1ZTtcbiAgICAgIHJldHVybiB7XG4gICAgICAgIC4uLmZpbHRlckRvbWFpbixcbiAgICAgICAgdHlwZSxcbiAgICAgICAgdmFsdWUsXG4gICAgICAgIGZpZWxkVHlwZVxuICAgICAgfTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnN0cmluZzpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5kYXRlOlxuICAgICAgdHlwZSA9IEZJTFRFUl9UWVBFUy5tdWx0aVNlbGVjdDtcbiAgICAgIHZhbHVlID0gW107XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJEb21haW4sXG4gICAgICAgIHR5cGUsXG4gICAgICAgIHZhbHVlLFxuICAgICAgICBmaWVsZFR5cGVcbiAgICAgIH07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA6XG4gICAgICB0eXBlID0gRklMVEVSX1RZUEVTLnRpbWVSYW5nZTtcbiAgICAgIHZhbHVlID0gZmlsdGVyRG9tYWluLmRvbWFpbjtcblxuICAgICAgcmV0dXJuIHtcbiAgICAgICAgLi4uZmlsdGVyRG9tYWluLFxuICAgICAgICB0eXBlLFxuICAgICAgICB2YWx1ZSxcbiAgICAgICAgZmllbGRUeXBlXG4gICAgICB9O1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHR5cGUgPSBmaWVsZFR5cGU7XG4gICAgICByZXR1cm4ge1xuICAgICAgICAuLi5maWx0ZXJEb21haW4sXG4gICAgICAgIHR5cGUsXG4gICAgICAgIGZpZWxkVHlwZVxuICAgICAgfTtcbiAgfVxufVxuXG4vKipcbiAqIENhbGN1bGF0ZSBmaWVsZCBkb21haW4gYmFzZWQgb24gZmllbGQgdHlwZSBhbmQgZGF0YVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAqIEBwYXJhbSB7b2JqZWN0fSBmaWVsZFxuICogQHJldHVybnMge29iamVjdH0gd2l0aCBkb21haW4gYXMga2V5XG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRGaWVsZERvbWFpbihkYXRhLCBmaWVsZCkge1xuICBjb25zdCBmaWVsZElkeCA9IGZpZWxkLnRhYmxlRmllbGRJbmRleCAtIDE7XG4gIGNvbnN0IGlzVGltZSA9IGZpZWxkLnR5cGUgPT09IEFMTF9GSUVMRF9UWVBFUy50aW1lc3RhbXA7XG4gIGNvbnN0IHZhbHVlQWNjZXNzb3IgPSBtYXliZVRvRGF0ZS5iaW5kKG51bGwsIGlzVGltZSwgZmllbGRJZHgsIGZpZWxkLmZvcm1hdCk7XG4gIGxldCBkb21haW47XG5cbiAgc3dpdGNoIChmaWVsZC50eXBlKSB7XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMucmVhbDpcbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5pbnRlZ2VyOlxuICAgICAgLy8gY2FsY3VsYXRlIGRvbWFpbiBhbmQgc3RlcFxuICAgICAgcmV0dXJuIGdldE51bWVyaWNGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLmJvb2xlYW46XG4gICAgICByZXR1cm4ge2RvbWFpbjogW3RydWUsIGZhbHNlXX07XG5cbiAgICBjYXNlIEFMTF9GSUVMRF9UWVBFUy5zdHJpbmc6XG4gICAgY2FzZSBBTExfRklFTERfVFlQRVMuZGF0ZTpcbiAgICAgIGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0T3JkaW5hbERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKTtcbiAgICAgIHJldHVybiB7ZG9tYWlufTtcblxuICAgIGNhc2UgQUxMX0ZJRUxEX1RZUEVTLnRpbWVzdGFtcDpcbiAgICAgIHJldHVybiBnZXRUaW1lc3RhbXBGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4ge2RvbWFpbjogU2NhbGVVdGlscy5nZXRPcmRpbmFsRG9tYWluKGRhdGEsIHZhbHVlQWNjZXNzb3IpfTtcbiAgfVxufVxuXG4vKipcbiAqIEZpbHRlciBkYXRhIGJhc2VkIG9uIGFuIGFycmF5IG9mIGZpbHRlcnNcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge3N0cmluZ30gZGF0YUlkXG4gKiBAcGFyYW0ge09iamVjdFtdfSBmaWx0ZXJzXG4gKiBAcmV0dXJucyB7T2JqZWN0W119IGRhdGFcbiAqIEByZXR1cm5zIHtOdW1iZXJbXX0gZmlsdGVyZWRJbmRleFxuICovXG5leHBvcnQgZnVuY3Rpb24gZmlsdGVyRGF0YShkYXRhLCBkYXRhSWQsIGZpbHRlcnMpIHtcbiAgaWYgKCFkYXRhIHx8ICFkYXRhSWQpIHtcbiAgICAvLyB3aHkgd291bGQgdGhlcmUgbm90IGJlIGFueSBkYXRhPyBhcmUgd2Ugb3ZlciBkb2luZyB0aGlzP1xuICAgIHJldHVybiB7ZGF0YTogW10sIGZpbHRlcmVkSW5kZXg6IFtdfTtcbiAgfVxuXG4gIGlmICghZmlsdGVycy5sZW5ndGgpIHtcbiAgICByZXR1cm4ge2RhdGEsIGZpbHRlcmVkSW5kZXg6IGRhdGEubWFwKChkLCBpKSA9PiBpKX07XG4gIH1cblxuICBjb25zdCBhcHBsaWVkRmlsdGVycyA9IGZpbHRlcnMuZmlsdGVyKFxuICAgIGQgPT4gZC5kYXRhSWQgPT09IGRhdGFJZCAmJiBkLmZpZWxkSWR4ID4gLTEgJiYgZC52YWx1ZSAhPT0gbnVsbFxuICApO1xuXG4gIC8vIHdlIHNhdmUgYSByZWZlcmVuY2Ugb2YgYWxsRGF0YSBpbmRleCBoZXJlIHRvIGFjY2VzcyBkYXRhVG9GZWF0dXJlXG4gIC8vIGluIGdlb2pzb24gYW5kIGhleGdvbklkIGxheWVyXG4gIGNvbnN0IHtmaWx0ZXJlZCwgZmlsdGVyZWRJbmRleH0gPSBkYXRhLnJlZHVjZShcbiAgICAoYWNjdSwgZCwgaSkgPT4ge1xuICAgICAgY29uc3QgbWF0Y2hlZCA9IGFwcGxpZWRGaWx0ZXJzLmV2ZXJ5KGZpbHRlciA9PlxuICAgICAgICBpc0RhdGFNYXRjaEZpbHRlcihkLCBmaWx0ZXIsIGkpXG4gICAgICApO1xuXG4gICAgICBpZiAobWF0Y2hlZCkge1xuICAgICAgICBhY2N1LmZpbHRlcmVkLnB1c2goZCk7XG4gICAgICAgIGFjY3UuZmlsdGVyZWRJbmRleC5wdXNoKGkpO1xuICAgICAgfVxuXG4gICAgICByZXR1cm4gYWNjdTtcbiAgICB9LFxuICAgIHtmaWx0ZXJlZDogW10sIGZpbHRlcmVkSW5kZXg6IFtdfVxuICApO1xuXG4gIHJldHVybiB7ZGF0YTogZmlsdGVyZWQsIGZpbHRlcmVkSW5kZXh9O1xufVxuXG4vKipcbiAqIENoZWNrIGlmIHZhbHVlIGlzIGluIHJhbmdlIG9mIGZpbHRlclxuICpcbiAqIEBwYXJhbSB7T2JqZWN0W119IGRhdGFcbiAqIEBwYXJhbSB7T2JqZWN0fSBmaWx0ZXJcbiAqIEBwYXJhbSB7bnVtYmVyfSBpXG4gKiBAcmV0dXJucyB7Qm9vbGVhbn0gLSB3aGV0aGVyIHZhbHVlIGZhbGxzIGluIHRoZSByYW5nZSBvZiB0aGUgZmlsdGVyXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0RhdGFNYXRjaEZpbHRlcihkYXRhLCBmaWx0ZXIsIGkpIHtcbiAgY29uc3QgdmFsID0gZGF0YVtmaWx0ZXIuZmllbGRJZHhdO1xuICBpZiAoIWZpbHRlci50eXBlKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICBzd2l0Y2ggKGZpbHRlci50eXBlKSB7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMucmFuZ2U6XG4gICAgICByZXR1cm4gaXNJblJhbmdlKHZhbCwgZmlsdGVyLnZhbHVlKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIGNvbnN0IHRpbWVWYWwgPSBmaWx0ZXIubWFwcGVkVmFsdWVcbiAgICAgICAgPyBmaWx0ZXIubWFwcGVkVmFsdWVbaV1cbiAgICAgICAgOiBtb21lbnQudXRjKHZhbCkudmFsdWVPZigpO1xuICAgICAgcmV0dXJuIGlzSW5SYW5nZSh0aW1lVmFsLCBmaWx0ZXIudmFsdWUpO1xuXG4gICAgY2FzZSBGSUxURVJfVFlQRVMubXVsdGlTZWxlY3Q6XG4gICAgICByZXR1cm4gZmlsdGVyLnZhbHVlLmluY2x1ZGVzKHZhbCk7XG5cbiAgICBjYXNlIEZJTFRFUl9UWVBFUy5zZWxlY3Q6XG4gICAgICByZXR1cm4gZmlsdGVyLnZhbHVlID09PSB2YWw7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgcmV0dXJuIHRydWU7XG4gIH1cbn1cblxuLyoqXG4gKiBDYWxsIGJ5IHBhcnNpbmcgZmlsdGVycyBmcm9tIFVSTFxuICogQ2hlY2sgaWYgdmFsdWUgb2YgZmlsdGVyIHdpdGhpbiBmaWx0ZXIgZG9tYWluLCBpZiBub3QgYWRqdXN0IGl0IHRvIG1hdGNoXG4gKiBmaWx0ZXIgZG9tYWluXG4gKlxuICogQHBhcmFtIHtzdHJpbmdbXSB8IHN0cmluZyB8IG51bWJlciB8IG51bWJlcltdfSB2YWx1ZVxuICogQHBhcmFtIHtBcnJheX0gZmlsdGVyLmRvbWFpblxuICogQHBhcmFtIHtTdHJpbmd9IGZpbHRlci50eXBlXG4gKiBAcmV0dXJucyB7Kn0gLSBhZGp1c3RlZCB2YWx1ZSB0byBtYXRjaCBmaWx0ZXIgb3IgbnVsbCB0byByZW1vdmUgZmlsdGVyXG4gKi9cblxuLyogZXNsaW50LWRpc2FibGUgY29tcGxleGl0eSAqL1xuZXhwb3J0IGZ1bmN0aW9uIGFkanVzdFZhbHVlVG9GaWx0ZXJEb21haW4odmFsdWUsIHtkb21haW4sIHR5cGV9KSB7XG4gIGlmICghZG9tYWluIHx8ICF0eXBlKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMucmFuZ2U6XG4gICAgY2FzZSBGSUxURVJfVFlQRVMudGltZVJhbmdlOlxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSB8fCB2YWx1ZS5sZW5ndGggIT09IDIpIHtcbiAgICAgICAgcmV0dXJuIGRvbWFpbi5tYXAoZCA9PiBkKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlLm1hcChcbiAgICAgICAgKGQsIGkpID0+XG4gICAgICAgICAgbm90TnVsbG9yVW5kZWZpbmVkKGQpICYmIGlzSW5SYW5nZShkLCBkb21haW4pID8gZCA6IGRvbWFpbltpXVxuICAgICAgKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgICAgaWYgKCFBcnJheS5pc0FycmF5KHZhbHVlKSkge1xuICAgICAgICByZXR1cm4gW107XG4gICAgICB9XG4gICAgICBjb25zdCBmaWx0ZXJlZFZhbHVlID0gdmFsdWUuZmlsdGVyKGQgPT4gZG9tYWluLmluY2x1ZGVzKGQpKTtcbiAgICAgIHJldHVybiBmaWx0ZXJlZFZhbHVlLmxlbmd0aCA/IGZpbHRlcmVkVmFsdWUgOiBbXTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnNlbGVjdDpcbiAgICAgIHJldHVybiBkb21haW4uaW5jbHVkZXModmFsdWUpID8gdmFsdWUgOiB0cnVlO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIHJldHVybiBudWxsO1xuICB9XG59XG4vKiBlc2xpbnQtZW5hYmxlIGNvbXBsZXhpdHkgKi9cblxuLyoqXG4gKiBDYWxjdWxhdGUgbnVtZXJpYyBkb21haW4gYW5kIHN1aXRhYmxlIHN0ZXBcbiAqXG4gKiBAcGFyYW0ge09iamVjdFtdfSBkYXRhXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSB2YWx1ZUFjY2Vzc29yXG4gKiBAcmV0dXJucyB7b2JqZWN0fSBkb21haW4gYW5kIHN0ZXBcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE51bWVyaWNGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKSB7XG4gIGxldCBkb21haW4gPSBbMCwgMV07XG4gIGxldCBzdGVwID0gMC4xO1xuXG4gIGNvbnN0IG1hcHBlZFZhbHVlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubWFwKHZhbHVlQWNjZXNzb3IpIDogW107XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoZGF0YSkgJiYgZGF0YS5sZW5ndGggPiAxKSB7XG4gICAgZG9tYWluID0gU2NhbGVVdGlscy5nZXRMaW5lYXJEb21haW4obWFwcGVkVmFsdWUpO1xuICAgIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG5cbiAgICAvLyBpbiBjYXNlIGVxdWFsIGRvbWFpbiwgWzk2LCA5Nl0sIHdoaWNoIHdpbGwgYnJlYWsgcXVhbnRpemUgc2NhbGVcbiAgICBpZiAoIWRpZmYpIHtcbiAgICAgIGRvbWFpblsxXSA9IGRvbWFpblswXSArIDE7XG4gICAgfVxuXG4gICAgc3RlcCA9IGdldE51bWVyaWNTdGVwU2l6ZShkaWZmKSB8fCBzdGVwO1xuICAgIGRvbWFpblswXSA9IGZvcm1hdE51bWJlckJ5U3RlcChkb21haW5bMF0sIHN0ZXAsICdmbG9vcicpO1xuICAgIGRvbWFpblsxXSA9IGZvcm1hdE51bWJlckJ5U3RlcChkb21haW5bMV0sIHN0ZXAsICdjZWlsJyk7XG4gIH1cblxuICBjb25zdCB7aGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX0gPSBnZXRIaXN0b2dyYW0oZG9tYWluLCBtYXBwZWRWYWx1ZSk7XG5cbiAgcmV0dXJuIHtkb21haW4sIHN0ZXAsIGhpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19O1xufVxuXG5mdW5jdGlvbiBnZXROdW1lcmljU3RlcFNpemUoZGlmZikge1xuICBpZiAoZGlmZiA+IDEwMCkge1xuICAgIHJldHVybiAxO1xuICB9IGVsc2UgaWYgKGRpZmYgPCAyMCAmJiBkaWZmID4gMykge1xuICAgIHJldHVybiAwLjAxO1xuICB9IGVsc2UgaWYgKGRpZmYgPD0gMykge1xuICAgIHJldHVybiAwLjAwMTtcbiAgfVxufVxuXG4vKipcbiAqIENhbGN1bGF0ZSB0aW1lc3RhbXAgZG9tYWluIGFuZCBzdWl0YWJsZSBzdGVwXG4gKlxuICogQHBhcmFtIHtPYmplY3RbXX0gZGF0YVxuICogQHBhcmFtIHtmdW5jdGlvbn0gdmFsdWVBY2Nlc3NvclxuICogQHJldHVybnMge29iamVjdH0gZG9tYWluIGFuZCBzdGVwXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRUaW1lc3RhbXBGaWVsZERvbWFpbihkYXRhLCB2YWx1ZUFjY2Vzc29yKSB7XG4gIC8vIHRvIGF2b2lkIGNvbnZlcnRpbmcgc3RyaW5nIGZvcm1hdCB0aW1lIHRvIGVwb2NoXG4gIC8vIGV2ZXJ5IHRpbWUgd2UgY29tcGFyZSB3ZSBzdG9yZSBhIHZhbHVlIG1hcHBlZCB0byBpbnQgaW4gZmlsdGVyIGRvbWFpblxuXG4gIGNvbnN0IG1hcHBlZFZhbHVlID0gQXJyYXkuaXNBcnJheShkYXRhKSA/IGRhdGEubWFwKHZhbHVlQWNjZXNzb3IpIDogW107XG4gIGNvbnN0IGRvbWFpbiA9IFNjYWxlVXRpbHMuZ2V0TGluZWFyRG9tYWluKG1hcHBlZFZhbHVlKTtcbiAgbGV0IHN0ZXAgPSAwLjAxO1xuXG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG4gIGNvbnN0IGVudHJ5ID0gVGltZXN0YW1wU3RlcE1hcC5maW5kKGYgPT4gZi5tYXggPj0gZGlmZik7XG4gIGlmIChlbnRyeSkge1xuICAgIHN0ZXAgPSBlbnRyeS5zdGVwO1xuICB9XG5cbiAgY29uc3Qge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19ID0gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpO1xuXG4gIHJldHVybiB7ZG9tYWluLCBzdGVwLCBtYXBwZWRWYWx1ZSwgaGlzdG9ncmFtLCBlbmxhcmdlZEhpc3RvZ3JhbX07XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBoaXN0b2dyYW1Db25zdHJ1Y3QoZG9tYWluLCBtYXBwZWRWYWx1ZSwgYmlucykge1xuICByZXR1cm4gZDNIaXN0b2dyYW0oKVxuICAgIC50aHJlc2hvbGRzKHRpY2tzKGRvbWFpblswXSwgZG9tYWluWzFdLCBiaW5zKSlcbiAgICAuZG9tYWluKGRvbWFpbikobWFwcGVkVmFsdWUpXG4gICAgLm1hcChiaW4gPT4gKHtcbiAgICAgIGNvdW50OiBiaW4ubGVuZ3RoLFxuICAgICAgeDA6IGJpbi54MCxcbiAgICAgIHgxOiBiaW4ueDFcbiAgICB9KSk7XG59XG4vKipcbiAqIENhbGN1bGF0ZSBoaXN0b2dyYW0gZnJvbSBkb21haW4gYW5kIGFycmF5IG9mIHZhbHVlc1xuICpcbiAqIEBwYXJhbSB7bnVtYmVyW119IGRvbWFpblxuICogQHBhcmFtIHtPYmplY3RbXX0gbWFwcGVkdmFsdWVcbiAqIEByZXR1cm5zIHtBcnJheVtdfSBoaXN0b2dyYW1cbiAqL1xuZnVuY3Rpb24gZ2V0SGlzdG9ncmFtKGRvbWFpbiwgbWFwcGVkVmFsdWUpIHtcbiAgY29uc3QgaGlzdG9ncmFtID0gaGlzdG9ncmFtQ29uc3RydWN0KGRvbWFpbiwgbWFwcGVkVmFsdWUsIDMwKTtcbiAgY29uc3QgZW5sYXJnZWRIaXN0b2dyYW0gPSBoaXN0b2dyYW1Db25zdHJ1Y3QoZG9tYWluLCBtYXBwZWRWYWx1ZSwgMTAwKTtcblxuICByZXR1cm4ge2hpc3RvZ3JhbSwgZW5sYXJnZWRIaXN0b2dyYW19O1xufVxuXG4vKipcbiAqIHJvdW5kIG51bWJlciBiYXNlZCBvbiBzdGVwXG4gKlxuICogQHBhcmFtIHtudW1iZXJ9IHZhbFxuICogQHBhcmFtIHtudW1iZXJ9IHN0ZXBcbiAqIEBwYXJhbSB7c3RyaW5nfSBib3VuZFxuICogQHJldHVybnMge251bWJlcn0gcm91bmRlZCBudW1iZXJcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGZvcm1hdE51bWJlckJ5U3RlcCh2YWwsIHN0ZXAsIGJvdW5kKSB7XG4gIGlmIChib3VuZCA9PT0gJ2Zsb29yJykge1xuICAgIHJldHVybiBNYXRoLmZsb29yKHZhbCAqICgxIC8gc3RlcCkpIC8gKDEgLyBzdGVwKTtcbiAgfVxuXG4gIHJldHVybiBNYXRoLmNlaWwodmFsICogKDEgLyBzdGVwKSkgLyAoMSAvIHN0ZXApO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gaXNJblJhbmdlKHZhbCwgZG9tYWluKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShkb21haW4pKSB7XG4gICAgcmV0dXJuIGZhbHNlO1xuICB9XG5cbiAgcmV0dXJuIHZhbCA+PSBkb21haW5bMF0gJiYgdmFsIDw9IGRvbWFpblsxXTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGdldFRpbWVXaWRnZXRUaXRsZUZvcm1hdHRlcihkb21haW4pIHtcbiAgaWYgKCFBcnJheS5pc0FycmF5KGRvbWFpbikpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IGRpZmYgPSBkb21haW5bMV0gLSBkb21haW5bMF07XG4gIHJldHVybiBkaWZmID4gZHVyYXRpb25ZZWFyXG4gICAgPyAnTU0vREQvWVknXG4gICAgOiBkaWZmID4gZHVyYXRpb25EYXkgPyAnTU0vREQgaGhhJyA6ICdNTS9ERCBoaDptbWEnO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0VGltZVdpZGdldEhpbnRGb3JtYXR0ZXIoZG9tYWluKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShkb21haW4pKSB7XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICBjb25zdCBkaWZmID0gZG9tYWluWzFdIC0gZG9tYWluWzBdO1xuICByZXR1cm4gZGlmZiA+IGR1cmF0aW9uWWVhclxuICAgID8gJ01NL0REL1lZJ1xuICAgIDogZGlmZiA+IGR1cmF0aW9uV2Vla1xuICAgICAgPyAnTU0vREQnXG4gICAgICA6IGRpZmYgPiBkdXJhdGlvbkRheVxuICAgICAgICA/ICdNTS9ERCBoaGEnXG4gICAgICAgIDogZGlmZiA+IGR1cmF0aW9uSG91ciA/ICdoaDptbWEnIDogJ2hoOm1tOnNzYSc7XG59XG5cbi8qKlxuICogU2FuaXR5IGNoZWNrIG9uIGZpbHRlcnMgdG8gcHJlcGFyZSBmb3Igc2F2ZVxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGUgLSBmaWx0ZXIgdHlwZVxuICogQHBhcmFtIHsqfSB2YWx1ZSAtIGZpbHRlciB2YWx1ZVxuICogQHJldHVybnMge2Jvb2xlYW59IHdoZXRoZXIgZmlsdGVyIGlzIHZhbHVlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc1ZhbGlkRmlsdGVyVmFsdWUoe3R5cGUsIHZhbHVlfSkge1xuICBpZiAoIXR5cGUpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgc3dpdGNoICh0eXBlKSB7XG4gICAgY2FzZSBGSUxURVJfVFlQRVMuc2VsZWN0OlxuICAgICAgcmV0dXJuIHZhbHVlID09PSB0cnVlIHx8IHZhbHVlID09PSBmYWxzZTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnJhbmdlOlxuICAgIGNhc2UgRklMVEVSX1RZUEVTLnRpbWVSYW5nZTpcbiAgICAgIHJldHVybiBBcnJheS5pc0FycmF5KHZhbHVlKSAmJiB2YWx1ZS5ldmVyeSh2ID0+IHYgIT09IG51bGwgJiYgIWlzTmFOKHYpKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLm11bHRpU2VsZWN0OlxuICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkodmFsdWUpICYmIEJvb2xlYW4odmFsdWUubGVuZ3RoKTtcblxuICAgIGNhc2UgRklMVEVSX1RZUEVTLmlucHV0OlxuICAgICAgcmV0dXJuIEJvb2xlYW4odmFsdWUubGVuZ3RoKTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0RmlsdGVyUGxvdChmaWx0ZXIsIGFsbERhdGEpIHtcbiAgaWYgKGZpbHRlci5wbG90VHlwZSA9PT0gUExPVF9UWVBFUy5oaXN0b2dyYW0gfHwgIWZpbHRlci55QXhpcykge1xuICAgIC8vIGhpc3RvZ3JhbSBzaG91bGQgYmUgY2FsY3VsYXRlZCB3aGVuIGNyZWF0ZSBmaWx0ZXJcbiAgICByZXR1cm4ge307XG4gIH1cblxuICBjb25zdCB7bWFwcGVkVmFsdWV9ID0gZmlsdGVyO1xuICBjb25zdCB7eUF4aXN9ID0gZmlsdGVyO1xuXG4gIC8vIHJldHVybiBsaW5lQ2hhcnRcbiAgY29uc3Qgc2VyaWVzID0gYWxsRGF0YVxuICAgIC5tYXAoKGQsIGkpID0+ICh7XG4gICAgICB4OiBtYXBwZWRWYWx1ZVtpXSxcbiAgICAgIHk6IGRbeUF4aXMudGFibGVGaWVsZEluZGV4IC0gMV1cbiAgICB9KSlcbiAgICAuZmlsdGVyKCh7eCwgeX0pID0+IE51bWJlci5pc0Zpbml0ZSh4KSAmJiBOdW1iZXIuaXNGaW5pdGUoeSkpXG4gICAgLnNvcnQoKGEsIGIpID0+IGFzY2VuZGluZyhhLngsIGIueCkpO1xuXG4gIGNvbnN0IHlEb21haW4gPSBleHRlbnQoc2VyaWVzLCBkID0+IGQueSk7XG4gIGNvbnN0IHhEb21haW4gPSBbc2VyaWVzWzBdLngsIHNlcmllc1tzZXJpZXMubGVuZ3RoIC0gMV0ueF07XG5cbiAgcmV0dXJuIHtsaW5lQ2hhcnQ6IHtzZXJpZXMsIHlEb21haW4sIHhEb21haW59LCB5QXhpc307XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWZhdWx0RmlsdGVyUGxvdFR5cGUoZmlsdGVyKSB7XG4gIGNvbnN0IGZpbHRlclBsb3RUeXBlcyA9IFN1cHBvcnRlZFBsb3RUeXBlW2ZpbHRlci50eXBlXTtcbiAgaWYgKCFmaWx0ZXJQbG90VHlwZXMpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGlmICghZmlsdGVyLnlBeGlzKSB7XG4gICAgcmV0dXJuIGZpbHRlclBsb3RUeXBlcy5kZWZhdWx0O1xuICB9XG5cbiAgcmV0dXJuIGZpbHRlclBsb3RUeXBlc1tmaWx0ZXIueUF4aXMudHlwZV0gfHwgbnVsbDtcbn1cbiJdfQ==