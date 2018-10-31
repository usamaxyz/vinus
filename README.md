## Vinus


### Introduction

Vinus is an abstruction built on top of Gulp. It helps you accomplish common Gulp tasks without any initial configuration. 

Vinus helps you in:
- Compiling javascript
     - ES6 support through Babel
     - CommonJs support through Browserify
     - Typescript support
- Compiling sass and less
- Generating rtl css
- Minifying css and js
- Concat, copy and rename files


Vinus makes every things ready for you. It's fast and easy to use:
- No Gulp experience required
- No initial configuration
- No wasting time searching and configuring plugins.


### Vinus API
Vinus accepts (input as) organized nodes of assets. Node types are: css, js, copy. Each node has several properties such as **src** and **dist**.
You can add multiple nodes of the same type.

Vinus offer an api to build your nodes as desired by chaining calls of api functions. There are two type of functions:
- Functions that create new node. e.g. `newCss()` `newJS()` 
- Functions that customize (set properties of) the last created node. e.g. `src()` `dist()`.

After starting a new node, any trailing calls considered as customization for the last node as long as the call does not create a new node.
```javascript
vinus
    //create new css node 1
    .newCss()
        //set node 1 source
        .src('src/css/style1.css')
        //set node 1 distination
        .dist('dist/css')
    //create new css node 2
    .newCss()
        //set node 2 source
        .src('src/css/style2.css')
        //set node 2 distination
        .dist('dist/css')
    //create new js node 3
    .newJs()
        //set node 3 source
        .src('src/js/index.js')
        //set node 3 distination
        .dist('dist/js')
```

#### Vinus API function list:
- `newCss()` Create new **css** node. Then you can customize this node using:
    - `src(src)` To set the source which can be one path or array paths
    - `dist(dist)` To set the destination. If it contains a trailing file name, then Vinus will concat source files
    - `concat(name)` To concat the source into one file
    - `rename(name)` To set the name of the output file
    - `asLess()` Indicate that source is **Less**
    - `asSass()` Indicate that source is **Sass**
    - `withRtl()` To generate rtl from ltr

- `newJs()` Create new **js** node. Then you can customize this node using:
    - `src(src)` To set the source which can be one path or array paths
    - `dist(dist)` To set the destination. If it contains a trailing file name, then Vinus will concat source files
    - `concat(name)` To concat the source into on file
    - `rename(name)` To set the name of the output file
    - `babelify()` To pass the source through **Babel**
    - `browserify()` To pass the source through **Browserify**
    - `asTs()` Indicate that source is **Typescript**

- `newCopy()` Create new **copy** node. Then you can customize this node using:
    - `src(src)` To set the source which can be one path or array paths
    - `dist(dist)` To set the destination. If it contains a trailing file name, then Vinus will concat source files
    - `rename(name)` To set the name of the output file
    
Alias Functions:
- `css(src, dist)` 
    - alias for: `newCss().src(src).dist(dist)`
- `sass(src, dist)` 
    - alias for: `newCss().src(src).dist(dist).asSass()`
- `less(src, dist)` 
    - alias for: `newCss().src(src).dist(dist).less()`
- `js(src, dist)` 
    - alias for: `newJs().src(src).dist(dist)`
- `vue(src, dist)` for VueJs
    - alias for: `newJs().src(src).dist(dist).babelify().browserify()`
- `babel(src, dist)` 
    - alias for: `newJs().src(src).dist(dist).babelify()`
- `ts(src, dist)` 
    - alias for: `newJs().src(src).dist(dist).babelify().browserify().asTs()`
- `copy(src, dist)`       
    - alias for: `newCopy().src(src).dist(dist)`
   
   
   
### Usage
- `npm install vinus`
- `npm install --global gulp-cli`
- `npx vinus init` will copy `start.js`, `.babelrc`, `tsconfig.json`, `gulpfile.js`. Note: this command will not copy any file if it is already exist.
- Build desired nodes in `start.js` using Vinus API
- `gulp` to compile all nodes. You can use:
    - `gulp scripts` to compile js nodes only
    - `gulp styles` to compile css nodes only
    - `gulp copy` to compile copy nodes only
- `gulp watch` to watch source files and run Gulp if any has changed



### Grouping Nodes
You can organize your nodes into groups. For example you can use `newGroup('backend')` to create a new group of nodes that are related to admin panel. And create another one `newGroup('frontend')` for the frontend.
Then you can choose which group to compile using `--group` flag. For example to compile **backend** only:
`gulp --group=backend`

If no `--group` flag supplied, then Vinus compile the nodes that does not belong to any group.

**Example** 
```javascript
vinus
    //no group
    .css([
        'src/css/nav.css',
        'src/css/charts.css',
        '...'
        ], 'dist/css/theme.css')
    .withRtl()
    .css('src/css/without-rtl.css', 'dist/css')
    .sass('sass/style.scss', 'dist/css')
    .js('src/js/')
    
    //starting new group
    .newGroup('vendors')
    .copy('node_modules/jquery/dist/jquery.min.js', 'public/vendors/jquery')
    .copy([
        'node_modules/bootstrap/dist/css/bootstrap.min.css',
        'node_modules/bootstrap/dist/js/bootstrap.min.js'
        ], 'public/vendors/bootstrap')
        
    .newGroup('vue')
    .js('src/js/vue/index.js', 'dist/js/vue/app.js')
```
For this example: The command `gulp` will compile all the nodes except those that come after **vendors** group. While `gulp --group=vendors` will compile the 2 **copy** nodes.


Vinus is open-sourced software licensed under the [MIT license](https://opensource.org/licenses/MIT).