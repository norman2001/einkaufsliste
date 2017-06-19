var path = require('path')
var browserify = require('browserify')
var couchdbPush = require('couchdb-push')
var b = browserify()
var fs = require('fs')
var fse = require('fs-extra')
var appBundleFilename = 'app.bundle.js'
// var url = require('url')
// every folder need a trailing slash!
var destinations = ['build/latest/', 'build/latest_as_couchapp/_attachments/']
var resources = ['index.html', 'css/', 'fonts/', 'imgs/', 'js/']

var isAppBundleBuilded = false
var couchDbPath
var pushSeedData = false

// packageJSON and metaJSON
// var packageJSONFile = path.resolve(__dirname, '..', 'package.json')
// var packageJSON = JSON.parse(fs.readFileSync(packageJSONFile))
// var productName = packageJSON['productName']
// var version = packageJSON['version']
// var description = packageJSON['description']
// var icon = packageJSON['icon']
// var rootPath = packageJSON['rootPath']
// var docTypes = packageJSON['docTypes']

// seed folder
var seedFolder = path.resolve(__dirname, '../seed')

if (process.platform === 'darwin') {
  try {
    var applescript = require('applescript')
  } catch (er) {
    console.log('No applescript available. You will have live without notifications.')
    applescript = null
  }
}

function build (couchDb, shouldPushSeedData) {
  couchDbPath = couchDb
  if (shouldPushSeedData) pushSeedData = shouldPushSeedData
  console.log('\n[INFO] ======== start new build ========= (' + new Date().toISOString() + ')')

  // copy all prepared static sources
  for (var k = 0; k < destinations.length; ++k) {
    var folder = destinations[k]
    var fromFolder = path.resolve(__dirname, '../src/')
    var toFolder = path.resolve(__dirname, '../', folder)

    // empty the folder
    try {
      fse.emptyDirSync(toFolder)
    } catch (e) {}

    // fill
    for (var i = 0; i < resources.length; ++i) {
      var ressource = resources[i]
      var src = path.resolve(fromFolder, ressource)
      var dest = path.resolve(toFolder, ressource)

      if (fs.lstatSync(src).isDirectory()) {
        fse.copySync(src, dest, {clobber: true, dereference: false, preserveTimestamps: false})
      } else {
        fs.createReadStream(src).pipe(fs.createWriteStream(dest))
      }
    }

    console.log('[INFO] re-created the ressources ' + resources + ' in folder ' + folder)
  }

  // copy seed folder to attachments
  if (fs.existsSync(seedFolder)) {
    var attachmentFolder = path.resolve(__dirname, '..', 'build/latest_as_couchapp/_attachments/')
    var seedAttachmentFolder = path.resolve(attachmentFolder, 'seed')
    if (!fs.existsSync(seedAttachmentFolder)) fs.mkdirSync(seedAttachmentFolder)
    fse.copySync(seedFolder, seedAttachmentFolder, {clobber: true, dereference: false, preserveTimestamps: false})
  }

  // create and store the browserify/ampersand.js bundle
  b.add('./src/app.js')
  // create the bundle
  b.on('bundle', function (bundle) {
    storeNewBundleInDestinations(bundle, appBundleFilename)
  }).bundle()
    .on('error', function (err) {
      console.log('[ABORT] Bundle building failed. Reason: ' + err.message)
    })
}

function push (couchDb, shouldPushSeedData) {
  couchDbPath = couchDb
  if (shouldPushSeedData) pushSeedData = shouldPushSeedData
  pushDdoc(couchDbPath)
}

// ==== Utils ====

// ===== BUILD =====
function storeNewBundleInDestinations (bundle, bundleFilename) {
  for (var i = 0; i < destinations.length; ++i) {
    var folder = destinations[i]
    if (!fs.accessSync(folder, fs.F_OK) && !fs.existsSync(path.resolve(folder, 'js/'))) fs.mkdirSync(folder + 'js/')
    var isLast = (destinations[i] === destinations[destinations.length - 1] && bundleFilename === appBundleFilename)
    var bundlefile = getWriteableFileStream(folder + 'js/' + bundleFilename, isLast)
    bundle.pipe(bundlefile)
  }
}

function getWriteableFileStream (pathToBundle, isLast) {
  // create the writeable file handler
  var file = fs.createWriteStream(path.resolve(__dirname, '..', pathToBundle))

  // prepare for error/success states while storing to disk
  file.on('finish', function () {
    if (pathToBundle.indexOf(appBundleFilename) > -1) isAppBundleBuilded = true
    console.log('[INFO] re-created ' + pathToBundle)
    if (isAppBundleBuilded && couchDbPath && isLast) {
      pushDdoc(couchDbPath, pushSeedData)
    } else if (isAppBundleBuilded && isLast) {
      console.log('[INFO] ============= finished ===========')
      if (applescript) applescript.execString('display notification "App was updated" with title "Build done"')
    }
  })
  file.on('error', function (err) {
    console.log('[ABORT] Bundle could not been saved into ' + pathToBundle + ' Reason: ' + err.message)
  })

  return file
}

// ===== PUSH =====

function pushDdoc (couchDbPath, shouldPushSeedData) {
  // var metaJSON = createMetaJSON(couchDbPath)
  // fs.writeFileSync(path.resolve(__dirname, 'latest_as_couchapp', 'meta.json'), JSON.stringify(metaJSON))
  console.log('[INFO] ============= PUSHING TO COUCHDB ===========')
  couchdbPush(couchDbPath, path.resolve(__dirname, './latest_as_couchapp'), function (err, resp) {
    if (err) {
      console.log('[ERROR] ============= PUSHING TO COUCHDB ===========')
      if (applescript) applescript.execString('display notification "' + err + '" with title "Build error"')
      console.error(err)
    } else {
      console.log('[INFO] ============= SUCCESSFULLY PUSHED TO COUCHDB ===========')
      if (shouldPushSeedData) pushSeedDocs(couchDbPath)
      if (applescript) applescript.execString('display notification "App was uploaded" with title "Build done"')
    }
    console.log('[INFO] ============= finished ===========')
  })
}

// If there are seed documents use script to upload them automatically
function pushSeedDocs (couchDbPath) {
  if (!fs.existsSync(seedFolder)) {
    console.log('[INFO] ============= No SEED DATA AVAILABLE ===========')
    return
  }

  console.log('[INFO] ============= PUSHING SEED TO COUCHDB ===========')
  fs.readdir(seedFolder, function (error, files) {
    if (error) {
      console.error('[ERROR] ============= GETTING SEED FOLDER ===========')
    }
    for (var i = 0; i < files.length; ++i) {
      var file = files[i]
      pushSeedDoc(couchDbPath, file)
    }
    console.log('[INFO] ============= SUCCESSFULLY PUSHED SEED TO COUCHDB ===========')
    if (applescript) applescript.execString('display notification "App was uploaded" with title "Build done"')
  })
}

function pushSeedDoc (couchDbPath, file) {
  var filePath = path.resolve(__dirname, '../seed', file)
  if (fs.lstatSync(filePath).isDirectory()) {
    var files = fs.readdirSync(filePath)
    for (var i = 0; i < files.length; i++) {
      var subfile = files[i]
      pushSeedDoc(couchDbPath, file + '/' + subfile)
    }
  } else {
    if (file.indexOf('json') === -1) return
    couchdbPush(couchDbPath, filePath, function (err, resp) {
      if (err) {
        if (applescript) applescript.execString('display notification "' + err + '" with title "Seed error"')
        console.error(err)
      }
    })
  }
}

// function createMetaJSON (couchDbPath) {
//   var couchDBParts = url.parse(couchDbPath)
//   var metaJSON = {}
//   if (productName) metaJSON['productName'] = productName
//   if (version) metaJSON['version'] = version
//   if (description) metaJSON['description'] = description
//   if (icon) metaJSON['icon'] = icon
//   if (rootPath) metaJSON['rootPath'] = rootPath
//   if (docTypes) metaJSON['docTypes'] = docTypes
//   metaJSON['updated_at'] = formatLocalDate()
//   if (couchDBParts && couchDBParts.auth) metaJSON['pushed_by'] = couchDBParts.auth.split(':')[0]
//   else metaJSON['pushed_by'] = 'unknown'
//   return metaJSON
// }

// function formatLocalDate () {
//   var now = new Date()
//   var tzo = -now.getTimezoneOffset()
//   var dif = tzo >= 0 ? '+' : '-'
//   var pad = function (num) {
//     var norm = Math.abs(Math.floor(num))
//     return (norm < 10 ? '0' : '') + norm
//   }
//   return now.getFullYear() +
//     '-' + pad(now.getMonth() + 1) +
//     '-' + pad(now.getDate()) +
//     'T' + pad(now.getHours()) +
//     ':' + pad(now.getMinutes()) +
//     ':' + pad(now.getSeconds()) +
//     dif + pad(tzo / 60) +
//     ':' + pad(tzo % 60)
// }

module.exports = {
  push: push,
  build: build
}
