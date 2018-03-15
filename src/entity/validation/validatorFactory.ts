import * as JsonSchemaValidator from 'ajv';

const factory = (schemas: any) => {
  const validator = new JsonSchemaValidator({ allErrors: true });

  Object.keys(schemas).forEach((key) => {
    const schema = Object.assign({
        $async: true,
        $schema: 'http://json-schema.org/draft-07/schema#',
        title: key,
      },                         schemas[key]);

    validator.addSchema(schema, key);
  });

  return (name: string, dataToValidate: any) => {
    return new Promise((resolve, reject) => {
        const validation = validator.validate(name, dataToValidate);
        if (validation instanceof Promise) {
            validation.then(resolve)
                .catch((error) => reject(Error(`Error: ${error.message} ${JSON.stringify(error.errors)}`)));
          } else {
            return validation === true ? resolve(dataToValidate) : reject(Error('Error: Validation failed.'));
          }
      });
  };
};

export default factory;
