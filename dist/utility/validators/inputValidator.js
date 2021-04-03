"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.inputValidator = void 0;
const inputValidator = (inputs) => {
    let hasError = false;
    let finalErrorsObject = {
        hasError: false,
        errors: [],
    };
    const errors = [];
    for (let i = 0; i < inputs.length; i++) {
        if (inputs[i].validations.includes("required") &&
            inputs[i].fieldValue.length === 0) {
            errors.push(`${inputs[i].fieldName} required`);
        }
        if (inputs[i].validations.includes("minLength") &&
            inputs[i].fieldValue.length < inputs[i].minLength) {
            errors.push(`${inputs[i].fieldName} minimum length is ${inputs[i].minLength}`);
        }
        if (inputs[i].validations.includes("maxLength") &&
            inputs[i].fieldValue.length > inputs[i].maxLength) {
            errors.push(`${inputs[i].fieldName} maximum length is ${inputs[i].maxLength}`);
        }
        if (errors.length > 0)
            hasError = true;
        // const errorsObject = errorObjectBuilder(`${inputs[i].fieldName}`, errors);
        // finalErrorsObject = {
        //   ...finalErrorsObject,
        //   ...errorsObject,
        // };
    }
    finalErrorsObject.hasError = hasError;
    finalErrorsObject.errors = errors;
    return finalErrorsObject;
};
exports.inputValidator = inputValidator;
const errorObjectBuilder = (fieldName, errors) => {
    const errorsObject = {
        [fieldName]: {
            errors: errors,
        },
    };
    return errorsObject;
};
