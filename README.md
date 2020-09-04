## TechedFrontend project README.md

## BEFORE DEPLOYMENT ##

In order to install Angular dependencies run `npm install`.

## BASIC DEPLOYMENT ##

For the simplest deployment, create a production build and copy the output directory to a web server.
Start with the production build:

1.) In root directory of project run -> `ng build --prod`

2.) Copy everything within the output folder (dist/ by default) to a folder on the server.

3.) Configure the server to redirect requests for missing files to index.html. Learn more about server-side redirects https://angular.io/guide/deployment#fallback.

## WEB CONFIG ##

Right after you copy-pasted everything from dist file on server machine, paste web config for frontend. Without this app wont be able to work after refresh

## THE REST IS OPTIONAL!!! ##

## Enable runtime production mode ##

In addition to build optimizations, Angular also has a runtime production mode. Angular apps run in development mode by default, as you can see by the following message on the browser console:
# Angular is running in development mode. Call enableProdMode() to enable production mode.
Switching to production mode makes it run faster by disabling development specific checks such as the dual change detection cycles.
When you enable production builds via `--prod` command line flag, the runtime production mode is enabled as well.


## Production optimizations ##

The `--prod` meta-flag engages the following build optimization features:

Ahead-of-Time (AOT) Compilation: pre-compiles Angular component templates.
Production mode: deploys the production environment which enables production mode.
Bundling: concatenates your many application and library files into a few bundles.
Minification: removes excess whitespace, comments, and optional tokens.
Uglification: rewrites code to use short, cryptic variable and function names.
Dead code elimination: removes unreferenced modules and much unused code.

## Measure performance ##

You can make better decisions about what to optimize and how when you have a clear and accurate understanding of what's making the application slow. The cause may not be what you think it is. You can waste a lot of time and money optimizing something that has no tangible benefit or even makes the app slower. You should measure the app's actual behavior when running in the environments that are important to you.

The Chrome DevTools Network Performance page is a good place to start learning about measuring performance.

The WebPageTest tool is another good choice that can also help verify that your deployment was successful.

## Inspect the bundles ##
The source-map-explorer tool is a great way to inspect the generated JavaScript bundles after a production build.

Install source-map-explorer:

1.) `npm install source-map-explorer --save-dev`

2.) Build your app for production including the source maps
`ng build --prod --source-map`
List the generated bundles in the dist/ folder.

3.) `ls dist/*.bundle.js`
Run the explorer to generate a graphical representation of one of the bundles. The following example displays the graph for the main bundle.

node_modules/.bin/source-map-explorer dist/main.*.bundle.js
The source-map-explorer analyzes the source map generated with the bundle and draws a map of all dependencies, showing exactly which classes are included in the bundle.


## The base tag ##
The HTML <base href="..."/> specifies a base path for resolving relative URLs to assets such as images, scripts, and style sheets. For example, given the <base href="/my/app/">, the browser resolves a URL such as some/place/foo.jpg into a server request for my/app/some/place/foo.jpg. During navigation, the Angular router uses the base href as the base path to component, template, and module files.

In development, you typically start the server in the folder that holds index.html. That's the root folder and you'd add <base href="/"> near the top of index.html because / is the root of the app.
But on the shared or production server, you might serve the app from a subfolder. For example, when the URL to load the app is something like http://www.mysite.com/my/app/, the subfolder is my/app/ and you should add <base href="/my/app/"> to the server version of the index.html.

When the base tag is mis-configured, the app fails to load and the browser console displays 404 - Not Found errors for the missing files. Look at where it tried to find those files and adjust the base tag appropriately.