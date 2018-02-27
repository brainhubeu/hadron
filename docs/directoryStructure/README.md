# Directory structure
```
- features:
  - step_definitions
  - support

- app:
  - config.js
  - config_dev.js // jeśli pliki dev/prod/test nie istnieją, to się nie wczytują
  - config_prod.js
  - config_test.js
  - routing.js
  - routing_dev.js
  - routing_prod.js
  - routing_test.js
  - services.js
  - services_dev.js
  - services_prod.js
  - services_test.js
  - listeners.js
  - listeners_dev.js
  - listenres_prod.js
  - listeners_test.js

- src:
  - shop:
    - controller:
      - product.controller.js      // powtórzona nazwa controler/model/entity bo inaczej będzie dużo plików które będą miały format <nazwa>.js
      __tests__:
        - product.controller.spec.js
    - model:
      - product.serializer.js
      - product.model.js
      __tests__:
        - product.model.spec.js
    - entity:
      - product.entity.js
      __tests__:
        - product.entity.test.js     // integracyjny
    - repository:
      - catalog.js
      __tests__:
        - catalog.test.js            // integracyjny
    - assets:
    - command:
      - generate.command.js
      __tests__:
        - generate.command.js
    - service:
      - priceCalculator.service.js
        __tests__:
          - priceCalculator.service.spec.js // w zależności co potrzeba.

- lib:
  - brainhub-framework // directory for our framework, will eventually end up as seperate library (so will be in node_modules)

- index.js
- package.json
- Dockerfile
- entrypoint.sh
- README.md
- tsconfig.json
- tslint.json
- .dockerignore
- .gitignore
- .gitlab-ci.yml
```
