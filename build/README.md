# Install 

The explanations assuming that `node.js` and `npm` are installed and initially the following command was executed

```bash
build $ npm install
```
(there must exist a `node_modules` folder)


# push it

For deploying the module it is possible just to push the module. 

### help

If not sure what options are possible, please run

```bash
$ build/.bin/push --help
```

### push 

```bash
build/.bin/push -c http://[username]:[password]@127.0.0.1:5984/vois
```

# build it


### help

If not sure what options are possible, please run

```bash
$ build/.bin/start-build --help
```

### build once

A node script creates a fresh copy of the source (images, styles, layout) in the `build/latest` folder and the demo application. It also compiles the `app.bundle.js` (js) and adds that to the destinations. It picks from sources only whats needed (whitelist).

```bash
$ build/.bin/start-build
```

### build permanently

In development it can be very helpful when the demo is updated automatically when the sources are changing. Watch for changes and build/upload the updated demo as following

```bash
$ node build/node_modules/watch/cli.js "build/.bin/start-build" src/  --wait=3 -d
```

Every time (throttled by 3s) a file (dot or hidden files are ignored) in the `src/` folder gets updated an output like this will appear in the terminal

```
[INFO] ======== start new build ========= (2015-09-08T16:26:32.608Z)
[INFO] re-created the ressources app.html,css/,fonts/,imgs/ in folderbuild/latest/
[INFO] re-created the ressources app.html,css/,fonts/,imgs/ in folderdemo/_attachments/
[INFO] re-created build/latest/js/app.bundle.js
[INFO] re-created demo/_attachments/js/app.bundle.js
[INFO] ============= finished ===========
```

### build and demo permanently

To build AND upload the demo in one process try this:

```bash
$ node build/node_modules/watch/cli.js "build/.bin/start-build -c http://[username]:[pwd]@127.0.0.1:5984/[db]" src/ --wait=3 -d
```

It will add some lines to the output

```
[INFO] ======== start new build ========= (2016-11-17T16:04:59.658Z)
[INFO] re-created the ressources index.html,css/,fonts/,imgs/,js/ in folder build/latest/
[INFO] re-created the ressources index.html,css/,fonts/,imgs/,js/ in folder build/latest_as_couchapp/_attachments/
[INFO] re-created build/latest/js/app.bundle.js
[INFO] re-created build/latest_as_couchapp/_attachments/js/app.bundle.js
[INFO] ============= PUSHING TO COUCHDB ===========
[INFO] ============= SUCCESSFULLY PUSHED TO COUCHDB ===========
[INFO] ============= finished ===========
```

### build, demo and push seed data permanently

To build AND upload the demo in one process try this:

```bash
$ node build/node_modules/watch/cli.js "build/.bin/start-build -c http://[username]:[pwd]@127.0.0.1:5984/[db] --with-seed" src/ --wait=3 -d
```

It will add some line to the output:

**If no seed folder is available**

```
[INFO] ======== start new build ========= (2016-11-17T16:05:44.884Z)
[INFO] re-created the ressources index.html,css/,fonts/,imgs/,js/ in folder build/latest/
[INFO] re-created the ressources index.html,css/,fonts/,imgs/,js/ in folder build/latest_as_couchapp/_attachments/
[INFO] re-created build/latest/js/app.bundle.js
[INFO] re-created build/latest_as_couchapp/_attachments/js/app.bundle.js
[INFO] ============= PUSHING TO COUCHDB ===========
[INFO] ============= SUCCESSFULLY PUSHED TO COUCHDB ===========
[INFO] ============= No SEED DATA AVAILABLE ===========
[INFO] ============= finished ===========
```

**Else**

```
[INFO] ======== start new build ========= (2016-11-17T16:05:44.884Z)
[INFO] re-created the ressources index.html,css/,fonts/,imgs/,js/ in folder build/latest/
[INFO] re-created the ressources index.html,css/,fonts/,imgs/,js/ in folder build/latest_as_couchapp/_attachments/
[INFO] re-created build/latest/js/app.bundle.js
[INFO] re-created build/latest_as_couchapp/_attachments/js/app.bundle.js
[INFO] ============= PUSHING TO COUCHDB ===========
[INFO] ============= SUCCESSFULLY PUSHED TO COUCHDB ===========
[INFO] ============= PUSHING SEED TO COUCHDB ===========
[INFO] ============= SUCCESSFULLY PUSHED SEED TO COUCHDB ===========
[INFO] ============= finished ===========
```

## Errors

### `sh: build/.bin/start-build: Permission denied`

please run `$ chmod +x build/.bin/start-build`

### `sh: build/.bin/push: Permission denied`

please run `$ chmod +x build/.bin/push`