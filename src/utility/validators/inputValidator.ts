interface InputValidatorErrorObject {
    hasError: boolean;
    errors: string[];
}
export const inputValidator = (inputs: any[]) => {
  let hasError = false;
  let finalErrorsObject: InputValidatorErrorObject = {
    hasError: false,
    errors: [],
  };
  const errors: string[] = [];
  for (let i = 0; i < inputs.length; i++) {
    if (
      inputs[i].validations.includes("required") &&
      inputs[i].fieldValue.length === 0
    ) {
      errors.push(`${inputs[i].fieldName} required`);
    }
    if (
      inputs[i].validations.includes("minLength") &&
      inputs[i].fieldValue.length < inputs[i].minLength
    ) {
      errors.push(
        `${inputs[i].fieldName} minimum length is ${inputs[i].minLength}`
      );
    }
    if (
      inputs[i].validations.includes("maxLength") &&
      inputs[i].fieldValue.length > inputs[i].maxLength
    ) {
      errors.push(
        `${inputs[i].fieldName} maximum length is ${inputs[i].maxLength}`
      );
    }

    if (errors.length > 0) hasError = true;
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

const errorObjectBuilder = (fieldName: string, errors: string[]) => {
  const errorsObject = {
    [fieldName]: {
      errors: errors,
    },
  };

  return errorsObject;
};
