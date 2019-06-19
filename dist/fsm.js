(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["fsm"] = factory();
	else
		root["fsm"] = factory();
})(global, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./lib/all.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./lib/all.ts":
/*!********************!*\
  !*** ./lib/all.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
__export(__webpack_require__(/*! ./fsm */ "./lib/fsm.ts"));


/***/ }),

/***/ "./lib/fsm.ts":
/*!********************!*\
  !*** ./lib/fsm.ts ***!
  \********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
// Shared libraries
const Util = __webpack_require__(/*! @terrencecrowley/util */ "@terrencecrowley/util");
// States
exports.FSM_STARTING = 0;
exports.FSM_PENDING = 1 << 0;
exports.FSM_DONE = 1 << 1;
exports.FSM_ERROR = 1 << 2;
exports.FSM_RELEASED = 1 << 3;
exports.FSM_CUSTOM1 = 1 << 4;
exports.FSM_CUSTOM2 = 1 << 5;
exports.FSM_CUSTOM3 = 1 << 6;
exports.FSM_CUSTOM4 = 1 << 7;
exports.FSM_CUSTOM5 = 1 << 8;
exports.FSM_CUSTOM6 = 1 << 9;
exports.FSM_CUSTOM7 = 1 << 10;
exports.FSM_CUSTOM8 = 1 << 11;
exports.FSM_CUSTOM9 = 1 << 12;
function FsmDone(s) {
    return ((s & exports.FSM_DONE) != 0) || ((s & exports.FSM_ERROR) != 0) || ((s & exports.FSM_RELEASED) != 0);
}
function FsmStateToString(state) {
    let a = [];
    if (state == exports.FSM_STARTING)
        return 'starting';
    else {
        if (state & exports.FSM_PENDING)
            a.push('pending');
        if (state & exports.FSM_DONE)
            a.push('done');
        if (state & exports.FSM_ERROR)
            a.push('error');
        if (state & exports.FSM_RELEASED)
            a.push('released');
        if (state & exports.FSM_CUSTOM1)
            a.push('custom1');
        if (state & exports.FSM_CUSTOM2)
            a.push('custom2');
        if (state & exports.FSM_CUSTOM3)
            a.push('custom3');
        if (state & exports.FSM_CUSTOM4)
            a.push('custom4');
        if (state & exports.FSM_CUSTOM5)
            a.push('custom5');
        if (state & exports.FSM_CUSTOM6)
            a.push('custom6');
        if (state & exports.FSM_CUSTOM7)
            a.push('custom7');
        if (state & exports.FSM_CUSTOM8)
            a.push('custom8');
        if (state & exports.FSM_CUSTOM9)
            a.push('custom9');
        return a.join('|');
    }
}
class FsmManager {
    constructor() {
        this.theId = 0;
        this.theEpoch = 0;
        this.bTickSet = false;
        this.theTickList = {};
        this.theBusyLoopCount = 0;
        this.doTick = this.doTick.bind(this);
    }
    forceTick(fsm) {
        this.theTickList[fsm.id] = fsm;
        if (!this.bTickSet) {
            this.bTickSet = true;
            setImmediate(this.doTick);
        }
    }
    doTick() {
        this.bTickSet = false;
        let nLoops = 0;
        while (nLoops < 1 && !Util.isEmpty(this.theTickList)) {
            nLoops++;
            let thisTickList = this.theTickList;
            this.theTickList = {};
            for (let id in thisTickList)
                if (thisTickList.hasOwnProperty(id)) {
                    let f = thisTickList[id];
                    f.preTick();
                    f.tick();
                }
        }
        if (Util.isEmpty(this.theTickList))
            this.theBusyLoopCount = 0;
        else
            this.theBusyLoopCount++;
        this.theEpoch++;
    }
}
exports.FsmManager = FsmManager;
class Fsm {
    constructor(env) {
        this._env = env;
        this.id = this.manager.theId++;
        this.state = exports.FSM_STARTING;
        this.dependentError = false;
        this.epochDone = -1;
        this._waitOn = null;
        this._waitedOn = null;
        this.manager.forceTick(this);
    }
    get env() { return this._env; }
    get manager() { return this.env.fsmManager; }
    get done() {
        return FsmDone(this.state);
    }
    get ready() {
        return !this.done && this._waitOn == null;
    }
    get iserror() {
        return (this.state & exports.FSM_ERROR) != 0;
    }
    get isDependentError() {
        return this.dependentError;
    }
    setDependentError() {
        this.dependentError = true;
    }
    clearDependentError() {
        this.dependentError = false;
    }
    get ticked() {
        return this.done && this.manager.theEpoch > this.epochDone;
    }
    waitOn(fsm) {
        if (fsm == null)
            return this;
        else if (Array.isArray(fsm)) {
            for (let i = 0; i < fsm.length; i++)
                this.waitOn(fsm[i]);
        }
        else {
            if (fsm.done) {
                // If dependency is already done, don't add to waitOn list but ensure that
                // this Fsm gets ticked during next epoch. This is because the dependent tick
                // only happens when the dependency state is changed.
                this.manager.forceTick(this);
                if (fsm.iserror)
                    this.setDependentError();
            }
            else {
                if (this._waitOn == null)
                    this._waitOn = {};
                this._waitOn[fsm.id] = fsm;
                if (fsm._waitedOn == null)
                    fsm._waitedOn = {};
                fsm._waitedOn[this.id] = this;
            }
        }
        return this;
    }
    setState(state) {
        this.state = state;
        if (this.done) {
            while (this._waitedOn) {
                let on = this._waitedOn;
                this._waitedOn = null;
                for (let id in on)
                    if (on.hasOwnProperty(id)) {
                        let f = on[id];
                        if (this.iserror)
                            f.setDependentError();
                        this.manager.forceTick(f);
                    }
            }
            this.epochDone = this.manager.theEpoch;
        }
        this.manager.forceTick(this);
    }
    // Can override if need to do more here
    end() {
        this.setState(exports.FSM_DONE);
    }
    // Cleans up _waitOn
    preTick() {
        if (this._waitOn == null)
            return;
        let bMore = false;
        for (let id in this._waitOn)
            if (this._waitOn.hasOwnProperty(id)) {
                let fsm = this._waitOn[id];
                if (fsm.done)
                    delete this._waitOn[id];
                else
                    bMore = true;
            }
        if (!bMore)
            this._waitOn = null;
    }
    tick() {
    }
}
exports.Fsm = Fsm;
// Launches callback provided when the associated Fsm (or Fsm array) completes.
class FsmOnDone extends Fsm {
    constructor(env, fsm, cb) {
        super(env);
        this.waitOn(fsm);
        this.fsm = fsm;
        this.cb = cb;
    }
    tick() {
        if (this.ready && this.state == exports.FSM_STARTING) {
            this.setState(this.isDependentError ? exports.FSM_ERROR : exports.FSM_DONE);
            this.cb(this.fsm);
        }
    }
}
exports.FsmOnDone = FsmOnDone;
class FsmSleep extends Fsm {
    constructor(env, delay) {
        super(env);
        this.delay = delay;
    }
    tick() {
        if (this.ready && this.state === exports.FSM_STARTING) {
            this.setState(exports.FSM_PENDING);
            setTimeout(() => { this.setState(exports.FSM_DONE); }, this.delay);
        }
    }
}
exports.FsmSleep = FsmSleep;
class FsmSerializer extends Fsm {
    constructor(env) {
        super(env);
        this.index = {};
    }
    serialize(id, fsm) {
        let prev = this.index[id];
        if (prev && !fsm)
            return prev;
        if (prev !== undefined)
            fsm.waitOn(prev);
        this.index[id] = fsm;
        if (this.done)
            this.setState(exports.FSM_STARTING);
        this.waitOn(fsm);
        return prev;
    }
    tick() {
        // If fully quiescent, take advantage to clear the waiting cache.
        if (this.ready && this.state == exports.FSM_STARTING) {
            this.index = {};
            this.setState(exports.FSM_DONE);
        }
    }
}
exports.FsmSerializer = FsmSerializer;
// The FsmTracker class provides a mechanism for serializing a set of finite state
// machines identified by a consistent unique identifier. A finite state machine is
// "tracked" until completion. If any other finite state machine calls "maybeWait"
// while any other are tracked and pending, that FSM will wait for the others to
// complete.
//
class FsmTrackerWrap extends Fsm {
    constructor(env, index, uid, fsm) {
        super(env);
        this.index = index;
        this.uid = uid;
        this.fsm = fsm;
        index._track(uid, fsm);
        this.waitOn(fsm);
    }
    tick() {
        if (this.ready && this.state == exports.FSM_STARTING) {
            this.index._untrack(this.uid, this.fsm);
            this.setState(exports.FSM_DONE);
        }
    }
}
class FsmTracker {
    constructor(env) {
        this.env = env;
        this.map = {};
    }
    _track(uid, fsm) {
        let a = this.map[uid];
        if (a === undefined) {
            a = [];
            this.map[uid] = a;
        }
        a.push(fsm);
    }
    _untrack(uid, fsm) {
        let a = this.map[uid];
        if (a) {
            for (let i = 0; i < a.length; i++)
                if (a[i] === fsm) {
                    if (a.length == 1)
                        delete this.map[uid];
                    else
                        a.splice(i, 1);
                    break;
                }
        }
    }
    track(uid, fsm) {
        return new FsmTrackerWrap(this.env, this, uid, fsm);
    }
    maybeWait(uid, fsm) {
        fsm.waitOn(this.map[uid]);
    }
}
exports.FsmTracker = FsmTracker;


/***/ }),

/***/ "@terrencecrowley/util":
/*!****************************************!*\
  !*** external "@terrencecrowley/util" ***!
  \****************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = require("@terrencecrowley/util");

/***/ })

/******/ });
});
//# sourceMappingURL=fsm.js.map