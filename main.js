var request = require('request');
var esprima = require('esprima');
var async = require('async');
var mkdirp = require('mkdirp');
var mkdirpSync = mkdirp.sync;
var path = require('path');
var Promise = require('promise');
var gencode = require('escodegen').generate;
var fs = require('fs');
var js_beautify = require('js-beautify').js_beautify;

var uglify_js = require('uglify-js');

var PARALLEL_LIMIT = 4;
var PREFIX = 'http://www.typescriptlang.org/Script/';

var moduleHash = Object.create(null);
var mirrorDir = path.join(__dirname, 'mirror');
var moduleSeeds = [];

function foundModule(moduleId) {
    if (!(moduleId in moduleHash)) {
        moduleHash[moduleId] = true;
        moduleSeeds.push(moduleId);
    }
}

function _parseModuleId(moduleId) {
    var ret = {};
    var k = moduleId.indexOf('!');
    if (k >= 0) {
        var pluginModuleId = moduleId.slice(0, k);
        foundModule(pluginModuleId);
        ret.pluginModuleId = pluginModuleId;
        moduleId = moduleId.slice(k + 1);
        if (pluginModuleId.indexOf('css') >= 0) {
            return null;
        }
    }
    ret.path = mirrorDir + '/' + moduleId + '.js';
    ret.url = PREFIX + moduleId + '.js';
    ret.id = moduleId;
    k = ret.path.lastIndexOf('/');
    if (k >= 0) {
        ret.dirs = ret.path.slice(0, k);
    } else {
        ret.dirs = '';
    }
    return ret;
}

function deobsecure(code) {
    var ast = uglify_js.parser.parse(code);
    var w = uglify_js.uglify.ast_walker();
    var walk = w.walk;

    function exprToStmts(expr, stmts, addReturn) {
        switch (expr[0]) {
            case 'seq':
                expr.slice(1).forEach(function (iExpr, k) {
                    exprToStmts(walk(iExpr), stmts, addReturn && (k === expr.length - 2));
                });
                break;
            default:
                stmts.push([addReturn ? 'return' : 'stat', walk(expr)]);
                break;
        }
    }

    ast = w.with_walkers({
        "var": function (defs) {
            var p = w.parent();
            if (p != null && p[0] == 'for') {
                return ['var', defs];
            }
            var stmts = defs.map(function (def) {
                if (def[1] == null) {
                    return ['var', [[def[0]]]];
                }
                return ['var', [[def[0], walk(def[1])]]];
            });
            return ['toplevel', stmts];
        },
        "stat": function (expr) {
            if (expr == null) {
                return ['stmt'];
            }
            var stmts = [];
            exprToStmts(expr, stmts, false);
            var p = w.parent();
            var needBlock = p != null && (
                p[0] == 'if' ||
                p[0] == 'while' ||
                p[0] == 'do' ||
                p[0] == 'for' ||
                p[0] == 'for-in');
            return [needBlock ? 'block' : 'toplevel', stmts];
        },
        "return": function (expr) {
            if (expr == null) {
                return ['return'];
            }
            var stmts = [];
            exprToStmts(expr, stmts, true);
            var p = w.parent();
            var needBlock = p != null && (
                p[0] == 'if' ||
                p[0] == 'while' ||
                p[0] == 'do' ||
                p[0] == 'for' ||
                p[0] == 'for-in');
            return [needBlock ? 'block' : 'toplevel', stmts];
        }
    }, function () {
        return walk(ast);
    });
    return js_beautify(uglify_js.uglify.gen_code(ast, {
        beautify: true
    }), {
        "indent_size": 2,
        "wrap_line_length": 120
    });
}

var _parseModule = (function () {

    // Executes f on the object and its children (recursively).
    function visit(object, f) {
        var key, child;

        if (f.call(null, object) === false) {
            return;
        }
        for (key in object) {
            if (object.hasOwnProperty(key)) {
                child = object[key];
                if (typeof child === 'object' && child !== null) {
                    visit(child, f);
                }
            }
        }
    }

    var baseModuleId;

    function _foundDep(moduleId) {
        foundModule(normalize(moduleId, baseModuleId));
    }

    function _foundDeps(deps) {
        deps.elements.forEach(function (elm) {
            if (elm.type === 'Literal' && typeof elm.value === 'string') {
                if (elm.value !== 'require' && elm.value !== 'exports' && elm.value !== 'module') {
                    _foundDep(elm.value);
                }
            }
        });
    }

    function collect(node) {
        if (node.type === 'Literal' && typeof node.value === 'string' && node.value.substring(0, 3) === 'vs/') {
            _foundDep(node.value);
        }
        if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
            if (node.callee.name === 'define') {
                var args = node.arguments;
                if (args.length > 1) {
                    if (args[0].type === 'Literal') {
                        extract(args[0].value, node);
                        if (args.length > 2) {
                            if (args[1].type === 'ArrayExpression') {
                                _foundDeps(args[1]);
                            }
                        }
                    } else if (args[0].type === 'ArrayExpression') {
                        _foundDeps(args[0]);
                    }
                }
            } else if (node.callee.name === 'require') {
                var arg0 = node.arguments[0];
                if (arg0 && arg0.type === 'ArrayExpression') {
                    arg0.elements.forEach(function (arg) {
                        if (arg.type === 'Literal' && typeof arg.value === 'string') {
                            foundModule(arg.value);
                        }
                    });
                }
            }
        }
    }
    function extract(moduleId, node) {
        var r = _parseModuleId(moduleId);
        if (r) {
            var k = moduleSeeds.indexOf(moduleId);
            if (k >= 0) {
                moduleSeeds.splice(k, 1);
            }
            moduleHash[moduleId] = true;

            mkdirpSync(r.dirs);
            console.log('extract module: ' + moduleId);
            fs.writeFileSync(r.path, deobsecure(gencode(node)), 'utf-8');
        }
    }
    return function (text, moduleId) {
        baseModuleId = moduleId;
        try {
            visit(esprima.parse(text), collect);
        } catch(ex) {
            console.error(ex);
        }
    };
})();

/**
 * Trims the . and .. from an array of path segments.
 * It will keep a leading path segment if a .. will become
 * the first path segment, to help with module name lookups,
 * which act like paths, but can be remapped. But the end result,
 * all paths that use this function should look normalized.
 * NOTE: this method MODIFIES the input array.
 * @param {Array} ary the array of path segments.
 */
function trimDots(ary) {
    var i, part;
    for (i = ary.length; i--;) {
        part = ary[i];
        if (part === '.') {
            ary.splice(i, 1);
            i -= 1;
        } else if (part === '..') {
            if (i === 1 && (ary[2] === '..' || ary[0] === '..')) {
                //End of the line. Keep at least one non-dot
                //path segment at the front so it can be mapped
                //correctly to disk. Otherwise, there is likely
                //no path mapping for a path starting with '..'.
                //This can still fail, but catches the most reasonable
                //uses of ..
                break;
            } else if (i > 0) {
                ary.splice(i - 1, 2);
                i -= 2;
            }
        }
    }
}

function normalize(name, baseName) {
    var baseParts;

    //Adjust any relative paths.
    if (name && name.charAt(0) === '.') {
        //If have a base name, try to normalize against it,
        //otherwise, assume it is a top-level require that will
        //be relative to baseUrl in the end.
        if (baseName) {
            baseParts = baseName.split('/');
            baseParts = baseParts.slice(0, baseParts.length - 1);
            baseParts = baseParts.concat(name.split('/'));
            trimDots(baseParts);
            name = baseParts.join('/');
        }
    }

    return name;
}

function processModule(moduleId, callback) {
    var result = _parseModuleId(moduleId);
    if (!result) {
        callback();
        return;
    }
    Promise(function (resolve, reject) {
        if (!result.dirs) {
            resolve();
            return;
        }
        mkdirp(result.dirs, function (err) {
            if (err) {
                reject(err);
                return;
            }
            resolve();
        });
    }).then(function () {
        // todo: remove exists check.
//        if (fs.existsSync(result.path)) {
//            callback();
//            return;
//        }
        request.get(result.url, function (err, resp, body) {
            if (err || resp.statusCode >= 400) {
                callback();
                return;
            }
            var contentType = resp.headers['content-type'];
            if (contentType === 'application/x-javascript' ||
                contentType === 'text/javascript') {
                _parseModule(body, moduleId);
                console.log('found new module: ' + moduleId);
                // big js cause memery out problem, skip it.
                if (body.length > 1000000) {
                    fs.writeFile(result.path, body, 'utf-8', callback);
                } else {
                    fs.writeFile(result.path, deobsecure(body), 'utf-8', callback);
                }
            } else {
                fs.writeFile(result.path, body, 'utf-8', callback);
            }
        });
    });
}

function loop() {
    var tasks = moduleSeeds;
    moduleSeeds = [];
    async.eachLimit(tasks, PARALLEL_LIMIT, processModule, function () {
        if (moduleSeeds.length) {
            setTimeout(loop);
        }
    });
}

[
    'vs/editor/editor.main',
    'vs/nls!vs/editor/editor.main',
    'vs/css!vs/editor/editor.main',

    'vs/languages/typescript/typescript',
    'vs/languages/javascript/javascript'
].forEach(foundModule);
loop();
//
//console.log(
//    deobsecure(fs.readFileSync(path.join(__dirname, 'mirror', 'vs/base/collections.js'), 'utf-8'))
//);