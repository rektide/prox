# prox

> prox is a runtime instrumentation engine for javascript objects, providing hooks to interrogate, interrupt, and extend normal object behavior.

By default prox does nothing: it creates a transparent proxy of an object that appears like the object. This is good. All operations
  get to the underlying object because there are no command chains associated with any object events: these chains live in the proxy
  yet are exposed to permit runtime instrumentation of objects.

# Usage
