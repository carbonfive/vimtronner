Function::property = (property, getter)->
  Object.defineProperty @prototype, property, get: getter
