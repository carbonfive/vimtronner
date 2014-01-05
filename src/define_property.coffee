Function::property = (property, description)->
  Object.defineProperty @prototype, property, description
