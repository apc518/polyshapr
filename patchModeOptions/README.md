# Patch Mode Options

Each file in this directory is responsible for defining the options for different parts of a Patch that have "modes". That is, a parameter of Patch whose value is an enum, and other related parameters.

The respective enums will be defined, and a list of option objects will also be defined. Each option object will contain a `name` which is one of the respective enums, a `displayName`, and a `func` whose use will vary.