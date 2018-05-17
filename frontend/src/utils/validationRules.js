import React from 'react';
import Validation from 'react-validation';
import validator from 'validator';

const exist = function (value) {
  return value !== null && value !== undefined;
};

const isEmpty = function (value) {
  return value === '';
};

Object.assign(Validation.rules, {
    required: {
        rule: value => value.toString().trim(),
        hint: () => <span className="form-error help-block is-visible">Required</span>
    },
    exist: {
        rule: value => exist(value),
        hint: () => <span className="form-error help-block is-visible">Field is not exists</span>
    },
    matchRegexp: {
        rule: value => !exist(value) || isEmpty(value) || regexp.test(value),
        hint: () => <span className="form-error help-block is-visible">Field is not match regexp</span>
    },
    undefined: {
        rule: value => value === undefined,
        hint: () => <span className="form-error help-block is-visible">Field is undefined</span>
    },
    emptyString: {
        rule: value => isEmpty(value),
        hint: () => <span className="form-error help-block is-visible">Field is empty</span>
    },
    email: {
        rule: value =>  validator.isEmail(value),
        hint: () => <span className="form-error help-block is-visible">Email is not valid</span>
    },
    url: {
        rule: value => validator.isURL(value),
        hint: () => <span className="form-error help-block is-visible">Url is not valid</span>
    },
    true: {
        rule: value => value === true,
        hint: () => <span className="form-error help-block is-visible">Field must be true</span>
    },
    false: {
        rule: value => value === false,
        hint: () => <span className="form-error help-block is-visible">Field must be false</span>
    },
    numeric:  {
        rule: value => validator.isNumeric(value),
        hint: () => <span className="form-error help-block is-visible">Field must be numeric</span>
    },
    alpha: {
        rule: value => validator.isAlpha(value),
        hint: () => <span className="form-error help-block is-visible">Field must be alpha</span>
    },
    alphanumeric: {
        rule: value => validator.isAlphanumeric(value),
        hint: () => <span className="form-error help-block is-visible">Field must be alphanumeric</span>
    },
    int: {
        rule: value => validator.isInt(value),
        hint: () => <span className="form-error help-block is-visible">Field must be int</span>
    },
    float: {
        rule: value => validator.isFloat(value),
        hint: () => <span className="form-error help-block is-visible">Field must be float</span>
    },
    length: {
        rule: (value, length) => !exist(value) || isEmpty(value) || value.length === length,
        hint: () => <span className="form-error help-block is-visible">Field length is wrong</span>
    },
    equals: {
        rule: (value, eql) => !exist(value) || isEmpty(value) || value == eql,
        hint: () => <span className="form-error help-block is-visible">Field equals is wrong</span>
    },
    equalsField: {
        rule: (value, field) => value == values[field],
        hint: () => <span className="form-error help-block is-visible">Field equals is wrong</span>
    },
    maxLength: {
        rule: (value, length) => !exist(value) || value.length <= length,
        hint: () => <span className="form-error help-block is-visible">Field max length is wrong</span>
    },
    minLength: {
        rule: (value, length) => !exist(value) || isEmpty(value) || value.length >= length,
        hint: () => <span className="form-error help-block is-visible">Field min length is wrong</span>
    }
});