'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _propTypes = require('prop-types');

var _propTypes2 = _interopRequireDefault(_propTypes);

var _base = require('./base');

var _base2 = _interopRequireDefault(_base);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Close = _react2.default.createClass({
  displayName: 'Close',
  propTypes: {
    /** Set the height of the icon, ex. '16px' */
    height: _propTypes2.default.string
  },
  getDefaultProps: function getDefaultProps() {
    return {
      height: '16px',
      predefinedClassName: 'data-ex-icons-closewindow'
    };
  },
  render: function render() {
    return _react2.default.createElement(
      _base2.default,
      this.props,
      _react2.default.createElement(
        'g',
        { transform: 'translate(8,8)' },
        _react2.default.createElement('path', { d: 'M16.127688,49.4434399 L0.686714703,34.0024666 C-0.228904901,33.086847 -0.228904901,31.6023343 0.686714703,30.6867147 C1.12641074,30.2470187 1.72276655,30 2.34459065,30 L17.785564,30 C19.0804456,30 20.1301546,31.049709 20.1301546,32.3445907 L20.1301546,47.785564 C20.1301546,49.0804456 19.0804456,50.1301546 17.785564,50.1301546 C17.1637399,50.1301546 16.5673841,49.883136 16.127688,49.4434399 Z' }),
        _react2.default.createElement('path', {
          d: 'M45.127688,19.4434399 L29.6867147,4.0024666 C28.7710951,3.086847 28.7710951,1.60233431 29.6867147,0.686714703 C30.1264107,0.247018663 30.7227665,-8.17124146e-14 31.3445907,-8.17124146e-14 L46.785564,-7.7547585e-14 C48.0804456,-7.7547585e-14 49.1301546,1.04970899 49.1301546,2.34459065 L49.1301546,17.785564 C49.1301546,19.0804456 48.0804456,20.1301546 46.785564,20.1301546 C46.1637399,20.1301546 45.5673841,19.883136 45.127688,19.4434399 Z',
          transform: 'translate(39.065077, 10.065077) rotate(-180.000000) translate(-39.065077, -10.065077)'
        })
      )
    );
  }
});

exports.default = Close;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3NyYy9jb21wb25lbnRzL2NvbW1vbi9pY29ucy9jbG9zZS5qcyJdLCJuYW1lcyI6WyJDbG9zZSIsImNyZWF0ZUNsYXNzIiwiZGlzcGxheU5hbWUiLCJwcm9wVHlwZXMiLCJoZWlnaHQiLCJzdHJpbmciLCJnZXREZWZhdWx0UHJvcHMiLCJwcmVkZWZpbmVkQ2xhc3NOYW1lIiwicmVuZGVyIiwicHJvcHMiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTUEsUUFBUSxnQkFBTUMsV0FBTixDQUFrQjtBQUM5QkMsZUFBYSxPQURpQjtBQUU5QkMsYUFBVztBQUNUO0FBQ0FDLFlBQVEsb0JBQVVDO0FBRlQsR0FGbUI7QUFNOUJDLGlCQU44Qiw2QkFNWjtBQUNoQixXQUFPO0FBQ0xGLGNBQVEsTUFESDtBQUVMRywyQkFBcUI7QUFGaEIsS0FBUDtBQUlELEdBWDZCO0FBWTlCQyxRQVo4QixvQkFZckI7QUFDUCxXQUNFO0FBQUE7QUFBVSxXQUFLQyxLQUFmO0FBQ0U7QUFBQTtBQUFBLFVBQUcsV0FBVSxnQkFBYjtBQUNFLGdEQUFNLEdBQUUsNFlBQVIsR0FERjtBQUVFO0FBQ0UsYUFBRSx5YkFESjtBQUVFLHFCQUFVO0FBRlo7QUFGRjtBQURGLEtBREY7QUFXRDtBQXhCNkIsQ0FBbEIsQ0FBZDs7a0JBMkJlVCxLIiwiZmlsZSI6ImNsb3NlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IFJlYWN0IGZyb20gJ3JlYWN0JztcbmltcG9ydCBQcm9wVHlwZXMgZnJvbSAncHJvcC10eXBlcyc7XG5pbXBvcnQgQmFzZSBmcm9tICcuL2Jhc2UnO1xuXG5jb25zdCBDbG9zZSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgZGlzcGxheU5hbWU6ICdDbG9zZScsXG4gIHByb3BUeXBlczoge1xuICAgIC8qKiBTZXQgdGhlIGhlaWdodCBvZiB0aGUgaWNvbiwgZXguICcxNnB4JyAqL1xuICAgIGhlaWdodDogUHJvcFR5cGVzLnN0cmluZ1xuICB9LFxuICBnZXREZWZhdWx0UHJvcHMoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGhlaWdodDogJzE2cHgnLFxuICAgICAgcHJlZGVmaW5lZENsYXNzTmFtZTogJ2RhdGEtZXgtaWNvbnMtY2xvc2V3aW5kb3cnXG4gICAgfTtcbiAgfSxcbiAgcmVuZGVyKCkge1xuICAgIHJldHVybiAoXG4gICAgICA8QmFzZSB7Li4udGhpcy5wcm9wc30+XG4gICAgICAgIDxnIHRyYW5zZm9ybT1cInRyYW5zbGF0ZSg4LDgpXCI+XG4gICAgICAgICAgPHBhdGggZD1cIk0xNi4xMjc2ODgsNDkuNDQzNDM5OSBMMC42ODY3MTQ3MDMsMzQuMDAyNDY2NiBDLTAuMjI4OTA0OTAxLDMzLjA4Njg0NyAtMC4yMjg5MDQ5MDEsMzEuNjAyMzM0MyAwLjY4NjcxNDcwMywzMC42ODY3MTQ3IEMxLjEyNjQxMDc0LDMwLjI0NzAxODcgMS43MjI3NjY1NSwzMCAyLjM0NDU5MDY1LDMwIEwxNy43ODU1NjQsMzAgQzE5LjA4MDQ0NTYsMzAgMjAuMTMwMTU0NiwzMS4wNDk3MDkgMjAuMTMwMTU0NiwzMi4zNDQ1OTA3IEwyMC4xMzAxNTQ2LDQ3Ljc4NTU2NCBDMjAuMTMwMTU0Niw0OS4wODA0NDU2IDE5LjA4MDQ0NTYsNTAuMTMwMTU0NiAxNy43ODU1NjQsNTAuMTMwMTU0NiBDMTcuMTYzNzM5OSw1MC4xMzAxNTQ2IDE2LjU2NzM4NDEsNDkuODgzMTM2IDE2LjEyNzY4OCw0OS40NDM0Mzk5IFpcIiAvPlxuICAgICAgICAgIDxwYXRoXG4gICAgICAgICAgICBkPVwiTTQ1LjEyNzY4OCwxOS40NDM0Mzk5IEwyOS42ODY3MTQ3LDQuMDAyNDY2NiBDMjguNzcxMDk1MSwzLjA4Njg0NyAyOC43NzEwOTUxLDEuNjAyMzM0MzEgMjkuNjg2NzE0NywwLjY4NjcxNDcwMyBDMzAuMTI2NDEwNywwLjI0NzAxODY2MyAzMC43MjI3NjY1LC04LjE3MTI0MTQ2ZS0xNCAzMS4zNDQ1OTA3LC04LjE3MTI0MTQ2ZS0xNCBMNDYuNzg1NTY0LC03Ljc1NDc1ODVlLTE0IEM0OC4wODA0NDU2LC03Ljc1NDc1ODVlLTE0IDQ5LjEzMDE1NDYsMS4wNDk3MDg5OSA0OS4xMzAxNTQ2LDIuMzQ0NTkwNjUgTDQ5LjEzMDE1NDYsMTcuNzg1NTY0IEM0OS4xMzAxNTQ2LDE5LjA4MDQ0NTYgNDguMDgwNDQ1NiwyMC4xMzAxNTQ2IDQ2Ljc4NTU2NCwyMC4xMzAxNTQ2IEM0Ni4xNjM3Mzk5LDIwLjEzMDE1NDYgNDUuNTY3Mzg0MSwxOS44ODMxMzYgNDUuMTI3Njg4LDE5LjQ0MzQzOTkgWlwiXG4gICAgICAgICAgICB0cmFuc2Zvcm09XCJ0cmFuc2xhdGUoMzkuMDY1MDc3LCAxMC4wNjUwNzcpIHJvdGF0ZSgtMTgwLjAwMDAwMCkgdHJhbnNsYXRlKC0zOS4wNjUwNzcsIC0xMC4wNjUwNzcpXCJcbiAgICAgICAgICAvPlxuICAgICAgICA8L2c+XG4gICAgICA8L0Jhc2U+XG4gICAgKTtcbiAgfVxufSk7XG5cbmV4cG9ydCBkZWZhdWx0IENsb3NlO1xuIl19