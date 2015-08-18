## Explaination of Files

- app.jsx: The simple React injection point that links the various components
and adds them to the DOM
- ui/: The various jsx files that use React to construct components
- stores/: The Flux complient datastores that react to actions and communicate with
the Flask server
- dispatcher/: The stock facebook Flux dispatcher
- constants/: Simple Flux constants that distinguish various actions
- actions/: Simple methods that allow the UI to communicate to the stores
