/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const isNode = !!(typeof process !== 'undefined' && process.version);
/**
 * @internal
 */
const deferredPromiseDebugTimeout = typeof process !== 'undefined' &&
    typeof process.env['PUPPETEER_DEFERRED_PROMISE_DEBUG_TIMEOUT'] !== 'undefined'
    ? Number(process.env['PUPPETEER_DEFERRED_PROMISE_DEBUG_TIMEOUT'])
    : -1;

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Asserts that the given value is truthy.
 * @param value - some conditional statement
 * @param message - the error message to throw if the value is not truthy.
 *
 * @internal
 */
const assert = (value, message) => {
    if (!value) {
        throw new Error(message);
    }
};

/**
 * @internal
 */
/**
 * @internal
 */
function isErrorLike(obj) {
    return (typeof obj === 'object' && obj !== null && 'name' in obj && 'message' in obj);
}

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
let debugModule = null;
/**
 * @internal
 */
async function importDebug() {
    if (!debugModule) {
        debugModule = (await import('./chunks/index.mjs').then(function (n) { return n.i; })).default;
    }
    return debugModule;
}
/**
 * A debug function that can be used in any environment.
 *
 * @remarks
 * If used in Node, it falls back to the
 * {@link https://www.npmjs.com/package/debug | debug module}. In the browser it
 * uses `console.log`.
 *
 * In Node, use the `DEBUG` environment variable to control logging:
 *
 * ```
 * DEBUG=* // logs all channels
 * DEBUG=foo // logs the `foo` channel
 * DEBUG=foo* // logs any channels starting with `foo`
 * ```
 *
 * In the browser, set `window.__PUPPETEER_DEBUG` to a string:
 *
 * ```
 * window.__PUPPETEER_DEBUG='*'; // logs all channels
 * window.__PUPPETEER_DEBUG='foo'; // logs the `foo` channel
 * window.__PUPPETEER_DEBUG='foo*'; // logs any channels starting with `foo`
 * ```
 *
 * @example
 *
 * ```
 * const log = debug('Page');
 *
 * log('new page created')
 * // logs "Page: new page created"
 * ```
 *
 * @param prefix - this will be prefixed to each log.
 * @returns a function that can be called to log to that debug channel.
 *
 * @internal
 */
const debug = (prefix) => {
    if (isNode) {
        return async (...logArgs) => {
            (await importDebug())(prefix)(logArgs);
        };
    }
    return (...logArgs) => {
        const debugLevel = globalThis.__PUPPETEER_DEBUG;
        if (!debugLevel) {
            return;
        }
        const everythingShouldBeLogged = debugLevel === '*';
        const prefixMatchesDebugLevel = everythingShouldBeLogged ||
            /**
             * If the debug level is `foo*`, that means we match any prefix that
             * starts with `foo`. If the level is `foo`, we match only the prefix
             * `foo`.
             */
            (debugLevel.endsWith('*')
                ? prefix.startsWith(debugLevel)
                : prefix === debugLevel);
        if (!prefixMatchesDebugLevel) {
            return;
        }
        // eslint-disable-next-line no-console
        console.log(`${prefix}:`, ...logArgs);
    };
};

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$q = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$s = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _JSHandle_disposed, _JSHandle_context, _JSHandle_remoteObject;
/**
 * Represents a reference to a JavaScript object. Instances can be created using
 * {@link Page.evaluateHandle}.
 *
 * Handles prevent the referenced JavaScript object from being garbage-collected
 * unless the handle is purposely {@link JSHandle.dispose | disposed}. JSHandles
 * are auto-disposed when their associated frame is navigated away or the parent
 * context gets destroyed.
 *
 * Handles can be used as arguments for any evaluation function such as
 * {@link Page.$eval}, {@link Page.evaluate}, and {@link Page.evaluateHandle}.
 * They are resolved to their referenced object.
 *
 * @example
 *
 * ```ts
 * const windowHandle = await page.evaluateHandle(() => window);
 * ```
 *
 * @public
 */
class JSHandle {
    /**
     * @internal
     */
    constructor(context, remoteObject) {
        _JSHandle_disposed.set(this, false);
        _JSHandle_context.set(this, void 0);
        _JSHandle_remoteObject.set(this, void 0);
        __classPrivateFieldSet$q(this, _JSHandle_context, context, "f");
        __classPrivateFieldSet$q(this, _JSHandle_remoteObject, remoteObject, "f");
    }
    /**
     * @internal
     */
    get client() {
        return __classPrivateFieldGet$s(this, _JSHandle_context, "f")._client;
    }
    /**
     * @internal
     */
    get disposed() {
        return __classPrivateFieldGet$s(this, _JSHandle_disposed, "f");
    }
    /**
     * @internal
     */
    executionContext() {
        return __classPrivateFieldGet$s(this, _JSHandle_context, "f");
    }
    /**
     * Evaluates the given function with the current handle as its first argument.
     *
     * @see {@link ExecutionContext.evaluate} for more details.
     */
    async evaluate(pageFunction, ...args) {
        return await this.executionContext().evaluate(pageFunction, this, ...args);
    }
    /**
     * Evaluates the given function with the current handle as its first argument.
     *
     * @see {@link ExecutionContext.evaluateHandle} for more details.
     */
    async evaluateHandle(pageFunction, ...args) {
        return await this.executionContext().evaluateHandle(pageFunction, this, ...args);
    }
    async getProperty(propertyName) {
        return this.evaluateHandle((object, propertyName) => {
            return object[propertyName];
        }, propertyName);
    }
    /**
     * Gets a map of handles representing the properties of the current handle.
     *
     * @example
     *
     * ```ts
     * const listHandle = await page.evaluateHandle(() => document.body.children);
     * const properties = await listHandle.getProperties();
     * const children = [];
     * for (const property of properties.values()) {
     *   const element = property.asElement();
     *   if (element) {
     *     children.push(element);
     *   }
     * }
     * children; // holds elementHandles to all children of document.body
     * ```
     */
    async getProperties() {
        assert(__classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f").objectId);
        // We use Runtime.getProperties rather than iterative building because the
        // iterative approach might create a distorted snapshot.
        const response = await this.client.send('Runtime.getProperties', {
            objectId: __classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f").objectId,
            ownProperties: true,
        });
        const result = new Map();
        for (const property of response.result) {
            if (!property.enumerable || !property.value) {
                continue;
            }
            result.set(property.name, createJSHandle(__classPrivateFieldGet$s(this, _JSHandle_context, "f"), property.value));
        }
        return result;
    }
    /**
     * @returns A vanilla object representing the serializable portions of the
     * referenced object.
     * @throws Throws if the object cannot be serialized due to circularity.
     *
     * @remarks
     * If the object has a `toJSON` function, it **will not** be called.
     */
    async jsonValue() {
        if (!__classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f").objectId) {
            return valueFromRemoteObject(__classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f"));
        }
        const value = await this.evaluate(object => {
            return object;
        });
        if (value === undefined) {
            throw new Error('Could not serialize referenced object');
        }
        return value;
    }
    /**
     * @returns Either `null` or the handle itself if the handle is an
     * instance of {@link ElementHandle}.
     */
    asElement() {
        return null;
    }
    /**
     * Releases the object referenced by the handle for garbage collection.
     */
    async dispose() {
        if (__classPrivateFieldGet$s(this, _JSHandle_disposed, "f")) {
            return;
        }
        __classPrivateFieldSet$q(this, _JSHandle_disposed, true, "f");
        await releaseObject(this.client, __classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f"));
    }
    /**
     * Returns a string representation of the JSHandle.
     *
     * @remarks
     * Useful during debugging.
     */
    toString() {
        if (!__classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f").objectId) {
            return 'JSHandle:' + valueFromRemoteObject(__classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f"));
        }
        const type = __classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f").subtype || __classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f").type;
        return 'JSHandle@' + type;
    }
    /**
     * Provides access to the
     * [Protocol.Runtime.RemoteObject](https://chromedevtools.github.io/devtools-protocol/tot/Runtime/#type-RemoteObject)
     * backing this handle.
     */
    remoteObject() {
        return __classPrivateFieldGet$s(this, _JSHandle_remoteObject, "f");
    }
}
_JSHandle_disposed = new WeakMap(), _JSHandle_context = new WeakMap(), _JSHandle_remoteObject = new WeakMap();

/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @public
 */
class CustomError extends Error {
    constructor(message) {
        super(message);
        this.name = this.constructor.name;
        Error.captureStackTrace(this, this.constructor);
    }
}
/**
 * TimeoutError is emitted whenever certain operations are terminated due to
 * timeout.
 *
 * @remarks
 * Example operations are {@link Page.waitForSelector | page.waitForSelector} or
 * {@link PuppeteerNode.launch | puppeteer.launch}.
 *
 * @public
 */
class TimeoutError extends CustomError {
}
/**
 * ProtocolError is emitted whenever there is an error from the protocol.
 *
 * @public
 */
class ProtocolError extends CustomError {
    constructor() {
        super(...arguments);
        this.originalMessage = '';
    }
}
/**
 * Puppeteer methods might throw errors if they are unable to fulfill a request.
 * For example, `page.waitForSelector(selector[, options])` might fail if the
 * selector doesn't match any nodes during the given timeframe.
 *
 * For certain types of errors Puppeteer uses specific error classes. These
 * classes are available via `puppeteer.errors`.
 *
 * @example
 * An example of handling a timeout error:
 *
 * ```ts
 * try {
 *   await page.waitForSelector('.foo');
 * } catch (e) {
 *   if (e instanceof puppeteer.errors.TimeoutError) {
 *     // Do something if this is a timeout.
 *   }
 * }
 * ```
 *
 * @public
 */
const errors = Object.freeze({
    TimeoutError,
    ProtocolError,
});

/**
 * Creates an returns a promise along with the resolve/reject functions.
 *
 * If the promise has not been resolved/rejected withing the `timeout` period,
 * the promise gets rejected with a timeout error.
 *
 * @internal
 */
function createDeferredPromiseWithTimer(timeoutMessage, timeout = 5000) {
    let isResolved = false;
    let isRejected = false;
    let resolver = (_) => { };
    let rejector = (_) => { };
    const taskPromise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejector = reject;
    });
    const timeoutId = setTimeout(() => {
        isRejected = true;
        rejector(new TimeoutError(timeoutMessage));
    }, timeout);
    return Object.assign(taskPromise, {
        resolved: () => {
            return isResolved;
        },
        finished: () => {
            return isResolved || isRejected;
        },
        resolve: (value) => {
            clearTimeout(timeoutId);
            isResolved = true;
            resolver(value);
        },
        reject: (err) => {
            clearTimeout(timeoutId);
            isRejected = true;
            rejector(err);
        },
    });
}
/**
 * Creates an returns a promise along with the resolve/reject functions.
 *
 * @internal
 */
function createDeferredPromise() {
    let isResolved = false;
    let isRejected = false;
    let resolver = (_) => { };
    let rejector = (_) => { };
    const taskPromise = new Promise((resolve, reject) => {
        resolver = resolve;
        rejector = reject;
    });
    return Object.assign(taskPromise, {
        resolved: () => {
            return isResolved;
        },
        finished: () => {
            return isResolved || isRejected;
        },
        resolve: (value) => {
            isResolved = true;
            resolver(value);
        },
        reject: (err) => {
            isRejected = true;
            rejector(err);
        },
    });
}
/**
 * @internal
 */
function createDebuggableDeferredPromise(timeoutMessage) {
    if (deferredPromiseDebugTimeout > 0) {
        return createDeferredPromiseWithTimer(timeoutMessage, deferredPromiseDebugTimeout);
    }
    return createDeferredPromise();
}

/**
 * Mitt: Tiny (~200b) functional event emitter / pubsub.
 * @name mitt
 * @returns {Mitt}
 */
function mitt(all) {
    all = all || new Map();
    return {
        /**
         * A Map of event names to registered handler functions.
         */
        all: all,
        /**
         * Register an event handler for the given type.
         * @param {string|symbol} type Type of event to listen for, or `"*"` for all events
         * @param {Function} handler Function to call in response to given event
         * @memberOf mitt
         */
        on: function (type, handler) {
            var handlers = all.get(type);
            var added = handlers && handlers.push(handler);
            if (!added) {
                all.set(type, [handler]);
            }
        },
        /**
         * Remove an event handler for the given type.
         * @param {string|symbol} type Type of event to unregister `handler` from, or `"*"`
         * @param {Function} handler Handler function to remove
         * @memberOf mitt
         */
        off: function (type, handler) {
            var handlers = all.get(type);
            if (handlers) {
                handlers.splice(handlers.indexOf(handler) >>> 0, 1);
            }
        },
        /**
         * Invoke all handlers for the given type.
         * If present, `"*"` handlers are invoked after type-matched handlers.
         *
         * Note: Manually firing "*" handlers is not supported.
         *
         * @param {string|symbol} type The event type to invoke
         * @param {Any} [evt] Any value (object is recommended and powerful), passed to each handler
         * @memberOf mitt
         */
        emit: function (type, evt) {
            (all.get(type) || []).slice().map(function (handler) { handler(evt); });
            (all.get('*') || []).slice().map(function (handler) { handler(type, evt); });
        }
    };
}

/**
 * The EventEmitter class that many Puppeteer classes extend.
 *
 * @remarks
 *
 * This allows you to listen to events that Puppeteer classes fire and act
 * accordingly. Therefore you'll mostly use {@link EventEmitter.on | on} and
 * {@link EventEmitter.off | off} to bind
 * and unbind to event listeners.
 *
 * @public
 */
class EventEmitter {
    /**
     * @internal
     */
    constructor() {
        this.eventsMap = new Map();
        this.emitter = mitt(this.eventsMap);
    }
    /**
     * Bind an event listener to fire when an event occurs.
     * @param event - the event type you'd like to listen to. Can be a string or symbol.
     * @param handler - the function to be called when the event occurs.
     * @returns `this` to enable you to chain method calls.
     */
    on(event, handler) {
        this.emitter.on(event, handler);
        return this;
    }
    /**
     * Remove an event listener from firing.
     * @param event - the event type you'd like to stop listening to.
     * @param handler - the function that should be removed.
     * @returns `this` to enable you to chain method calls.
     */
    off(event, handler) {
        this.emitter.off(event, handler);
        return this;
    }
    /**
     * Remove an event listener.
     * @deprecated please use {@link EventEmitter.off} instead.
     */
    removeListener(event, handler) {
        this.off(event, handler);
        return this;
    }
    /**
     * Add an event listener.
     * @deprecated please use {@link EventEmitter.on} instead.
     */
    addListener(event, handler) {
        this.on(event, handler);
        return this;
    }
    /**
     * Emit an event and call any associated listeners.
     *
     * @param event - the event you'd like to emit
     * @param eventData - any data you'd like to emit with the event
     * @returns `true` if there are any listeners, `false` if there are not.
     */
    emit(event, eventData) {
        this.emitter.emit(event, eventData);
        return this.eventListenersCount(event) > 0;
    }
    /**
     * Like `on` but the listener will only be fired once and then it will be removed.
     * @param event - the event you'd like to listen to
     * @param handler - the handler function to run when the event occurs
     * @returns `this` to enable you to chain method calls.
     */
    once(event, handler) {
        const onceHandler = eventData => {
            handler(eventData);
            this.off(event, onceHandler);
        };
        return this.on(event, onceHandler);
    }
    /**
     * Gets the number of listeners for a given event.
     *
     * @param event - the event to get the listener count for
     * @returns the number of listeners bound to the given event
     */
    listenerCount(event) {
        return this.eventListenersCount(event);
    }
    /**
     * Removes all listeners. If given an event argument, it will remove only
     * listeners for that event.
     * @param event - the event to remove listeners for.
     * @returns `this` to enable you to chain method calls.
     */
    removeAllListeners(event) {
        if (event) {
            this.eventsMap.delete(event);
        }
        else {
            this.eventsMap.clear();
        }
        return this;
    }
    eventListenersCount(event) {
        var _a;
        return ((_a = this.eventsMap.get(event)) === null || _a === void 0 ? void 0 : _a.length) || 0;
    }
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldGet$r = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ExecutionContext_instances, _ExecutionContext_evaluate;
/**
 * @public
 */
const EVALUATION_SCRIPT_URL = 'pptr://__puppeteer_evaluation_script__';
const SOURCE_URL_REGEX = /^[\040\t]*\/\/[@#] sourceURL=\s*(\S*?)\s*$/m;
/**
 * Represents a context for JavaScript execution.
 *
 * @example
 * A {@link Page} can have several execution contexts:
 *
 * - Each {@link Frame} of a {@link Page | page} has a "default" execution
 *   context that is always created after frame is attached to DOM. This context
 *   is returned by the {@link Frame.executionContext} method.
 * - Each {@link https://developer.chrome.com/extensions | Chrome extensions}
 *   creates additional execution contexts to isolate their code.
 *
 * @remarks
 * By definition, each context is isolated from one another, however they are
 * all able to manipulate non-JavaScript resources (such as DOM).
 *
 * @remarks
 * Besides pages, execution contexts can be found in
 * {@link WebWorker | workers}.
 *
 * @internal
 */
class ExecutionContext {
    /**
     * @internal
     */
    constructor(client, contextPayload, world) {
        _ExecutionContext_instances.add(this);
        this._client = client;
        this._world = world;
        this._contextId = contextPayload.id;
        this._contextName = contextPayload.name;
    }
    /**
     * Evaluates the given function.
     *
     * @example
     *
     * ```ts
     * const executionContext = await page.mainFrame().executionContext();
     * const result = await executionContext.evaluate(() => Promise.resolve(8 * 7))* ;
     * console.log(result); // prints "56"
     * ```
     *
     * @example
     * A string can also be passed in instead of a function:
     *
     * ```ts
     * console.log(await executionContext.evaluate('1 + 2')); // prints "3"
     * ```
     *
     * @example
     * Handles can also be passed as `args`. They resolve to their referenced object:
     *
     * ```ts
     * const oneHandle = await executionContext.evaluateHandle(() => 1);
     * const twoHandle = await executionContext.evaluateHandle(() => 2);
     * const result = await executionContext.evaluate(
     *   (a, b) => a + b,
     *   oneHandle,
     *   twoHandle
     * );
     * await oneHandle.dispose();
     * await twoHandle.dispose();
     * console.log(result); // prints '3'.
     * ```
     *
     * @param pageFunction - The function to evaluate.
     * @param args - Additional arguments to pass into the function.
     * @returns The result of evaluating the function. If the result is an object,
     * a vanilla object containing the serializable properties of the result is
     * returned.
     */
    async evaluate(pageFunction, ...args) {
        return await __classPrivateFieldGet$r(this, _ExecutionContext_instances, "m", _ExecutionContext_evaluate).call(this, true, pageFunction, ...args);
    }
    /**
     * Evaluates the given function.
     *
     * Unlike {@link ExecutionContext.evaluate | evaluate}, this method returns a
     * handle to the result of the function.
     *
     * This method may be better suited if the object cannot be serialized (e.g.
     * `Map`) and requires further manipulation.
     *
     * @example
     *
     * ```ts
     * const context = await page.mainFrame().executionContext();
     * const handle: JSHandle<typeof globalThis> = await context.evaluateHandle(
     *   () => Promise.resolve(self)
     * );
     * ```
     *
     * @example
     * A string can also be passed in instead of a function.
     *
     * ```ts
     * const handle: JSHandle<number> = await context.evaluateHandle('1 + 2');
     * ```
     *
     * @example
     * Handles can also be passed as `args`. They resolve to their referenced object:
     *
     * ```ts
     * const bodyHandle: ElementHandle<HTMLBodyElement> =
     *   await context.evaluateHandle(() => {
     *     return document.body;
     *   });
     * const stringHandle: JSHandle<string> = await context.evaluateHandle(
     *   body => body.innerHTML,
     *   body
     * );
     * console.log(await stringHandle.jsonValue()); // prints body's innerHTML
     * // Always dispose your garbage! :)
     * await bodyHandle.dispose();
     * await stringHandle.dispose();
     * ```
     *
     * @param pageFunction - The function to evaluate.
     * @param args - Additional arguments to pass into the function.
     * @returns A {@link JSHandle | handle} to the result of evaluating the
     * function. If the result is a `Node`, then this will return an
     * {@link ElementHandle | element handle}.
     */
    async evaluateHandle(pageFunction, ...args) {
        return __classPrivateFieldGet$r(this, _ExecutionContext_instances, "m", _ExecutionContext_evaluate).call(this, false, pageFunction, ...args);
    }
}
_ExecutionContext_instances = new WeakSet(), _ExecutionContext_evaluate = async function _ExecutionContext_evaluate(returnByValue, pageFunction, ...args) {
    const suffix = `//# sourceURL=${EVALUATION_SCRIPT_URL}`;
    if (isString(pageFunction)) {
        const contextId = this._contextId;
        const expression = pageFunction;
        const expressionWithSourceUrl = SOURCE_URL_REGEX.test(expression)
            ? expression
            : expression + '\n' + suffix;
        const { exceptionDetails, result: remoteObject } = await this._client
            .send('Runtime.evaluate', {
            expression: expressionWithSourceUrl,
            contextId,
            returnByValue,
            awaitPromise: true,
            userGesture: true,
        })
            .catch(rewriteError$1);
        if (exceptionDetails) {
            throw new Error('Evaluation failed: ' + getExceptionMessage(exceptionDetails));
        }
        return returnByValue
            ? valueFromRemoteObject(remoteObject)
            : createJSHandle(this, remoteObject);
    }
    const functionText = pageFunction.toString();
    /**
     * We remove the check for the ability for dynamic javascript to be
     * serializable, because the Workers runtime does not allow dynamic
     * javascript to be executed, as a security precaution. In the
     * future, we can consider the serialization check in the back end
     * but before the message gets to the remote browser.
     */
    let callFunctionOnPromise;
    try {
        callFunctionOnPromise = this._client.send('Runtime.callFunctionOn', {
            functionDeclaration: functionText + '\n' + suffix + '\n',
            executionContextId: this._contextId,
            arguments: args.map(convertArgument.bind(this)),
            returnByValue,
            awaitPromise: true,
            userGesture: true,
        });
    }
    catch (error) {
        if (error instanceof TypeError &&
            error.message.startsWith('Converting circular structure to JSON')) {
            error.message += ' Recursive objects are not allowed.';
        }
        throw error;
    }
    const { exceptionDetails, result: remoteObject } = await callFunctionOnPromise.catch(rewriteError$1);
    if (exceptionDetails) {
        throw new Error('Evaluation failed: ' + getExceptionMessage(exceptionDetails));
    }
    return returnByValue
        ? valueFromRemoteObject(remoteObject)
        : createJSHandle(this, remoteObject);
    function convertArgument(arg) {
        if (typeof arg === 'bigint') {
            // eslint-disable-line valid-typeof
            return { unserializableValue: `${arg.toString()}n` };
        }
        if (Object.is(arg, -0)) {
            return { unserializableValue: '-0' };
        }
        if (Object.is(arg, Infinity)) {
            return { unserializableValue: 'Infinity' };
        }
        if (Object.is(arg, -Infinity)) {
            return { unserializableValue: '-Infinity' };
        }
        if (Object.is(arg, NaN)) {
            return { unserializableValue: 'NaN' };
        }
        const objectHandle = arg && arg instanceof JSHandle ? arg : null;
        if (objectHandle) {
            if (objectHandle.executionContext() !== this) {
                throw new Error('JSHandles can be evaluated only in the context they were created!');
            }
            if (objectHandle.disposed) {
                throw new Error('JSHandle is disposed!');
            }
            if (objectHandle.remoteObject().unserializableValue) {
                return {
                    unserializableValue: objectHandle.remoteObject().unserializableValue,
                };
            }
            if (!objectHandle.remoteObject().objectId) {
                return { value: objectHandle.remoteObject().value };
            }
            return { objectId: objectHandle.remoteObject().objectId };
        }
        return { value: arg };
    }
};
const rewriteError$1 = (error) => {
    if (error.message.includes('Object reference chain is too long')) {
        return { result: { type: 'undefined' } };
    }
    if (error.message.includes("Object couldn't be returned by value")) {
        return { result: { type: 'undefined' } };
    }
    if (error.message.endsWith('Cannot find context with specified id') ||
        error.message.endsWith('Inspected target navigated or closed')) {
        throw new Error('Execution context was destroyed, most likely because of a navigation.');
    }
    throw error;
};

var __classPrivateFieldSet$p = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$q = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTTPRequest_instances, _HTTPRequest_client, _HTTPRequest_isNavigationRequest, _HTTPRequest_allowInterception, _HTTPRequest_interceptionHandled, _HTTPRequest_url, _HTTPRequest_resourceType, _HTTPRequest_method, _HTTPRequest_postData, _HTTPRequest_headers, _HTTPRequest_frame, _HTTPRequest_continueRequestOverrides, _HTTPRequest_responseForRequest, _HTTPRequest_abortErrorReason, _HTTPRequest_interceptResolutionState, _HTTPRequest_interceptHandlers, _HTTPRequest_initiator, _HTTPRequest_continue, _HTTPRequest_respond, _HTTPRequest_abort;
/**
 * Represents an HTTP request sent by a page.
 * @remarks
 *
 * Whenever the page sends a request, such as for a network resource, the
 * following events are emitted by Puppeteer's `page`:
 *
 * - `request`: emitted when the request is issued by the page.
 * - `requestfinished` - emitted when the response body is downloaded and the
 *   request is complete.
 *
 * If request fails at some point, then instead of `requestfinished` event the
 * `requestfailed` event is emitted.
 *
 * All of these events provide an instance of `HTTPRequest` representing the
 * request that occurred:
 *
 * ```
 * page.on('request', request => ...)
 * ```
 *
 * NOTE: HTTP Error responses, such as 404 or 503, are still successful
 * responses from HTTP standpoint, so request will complete with
 * `requestfinished` event.
 *
 * If request gets a 'redirect' response, the request is successfully finished
 * with the `requestfinished` event, and a new request is issued to a
 * redirected url.
 *
 * @public
 */
class HTTPRequest {
    /**
     * @internal
     */
    constructor(client, frame, interceptionId, allowInterception, event, redirectChain) {
        _HTTPRequest_instances.add(this);
        /**
         * @internal
         */
        this._failureText = null;
        /**
         * @internal
         */
        this._response = null;
        /**
         * @internal
         */
        this._fromMemoryCache = false;
        _HTTPRequest_client.set(this, void 0);
        _HTTPRequest_isNavigationRequest.set(this, void 0);
        _HTTPRequest_allowInterception.set(this, void 0);
        _HTTPRequest_interceptionHandled.set(this, false);
        _HTTPRequest_url.set(this, void 0);
        _HTTPRequest_resourceType.set(this, void 0);
        _HTTPRequest_method.set(this, void 0);
        _HTTPRequest_postData.set(this, void 0);
        _HTTPRequest_headers.set(this, {});
        _HTTPRequest_frame.set(this, void 0);
        _HTTPRequest_continueRequestOverrides.set(this, void 0);
        _HTTPRequest_responseForRequest.set(this, null);
        _HTTPRequest_abortErrorReason.set(this, null);
        _HTTPRequest_interceptResolutionState.set(this, {
            action: InterceptResolutionAction.None,
        });
        _HTTPRequest_interceptHandlers.set(this, void 0);
        _HTTPRequest_initiator.set(this, void 0);
        __classPrivateFieldSet$p(this, _HTTPRequest_client, client, "f");
        this._requestId = event.requestId;
        __classPrivateFieldSet$p(this, _HTTPRequest_isNavigationRequest, event.requestId === event.loaderId && event.type === 'Document', "f");
        this._interceptionId = interceptionId;
        __classPrivateFieldSet$p(this, _HTTPRequest_allowInterception, allowInterception, "f");
        __classPrivateFieldSet$p(this, _HTTPRequest_url, event.request.url, "f");
        __classPrivateFieldSet$p(this, _HTTPRequest_resourceType, (event.type || 'other').toLowerCase(), "f");
        __classPrivateFieldSet$p(this, _HTTPRequest_method, event.request.method, "f");
        __classPrivateFieldSet$p(this, _HTTPRequest_postData, event.request.postData, "f");
        __classPrivateFieldSet$p(this, _HTTPRequest_frame, frame, "f");
        this._redirectChain = redirectChain;
        __classPrivateFieldSet$p(this, _HTTPRequest_continueRequestOverrides, {}, "f");
        __classPrivateFieldSet$p(this, _HTTPRequest_interceptHandlers, [], "f");
        __classPrivateFieldSet$p(this, _HTTPRequest_initiator, event.initiator, "f");
        for (const [key, value] of Object.entries(event.request.headers)) {
            __classPrivateFieldGet$q(this, _HTTPRequest_headers, "f")[key.toLowerCase()] = value;
        }
    }
    /**
     * Warning! Using this client can break Puppeteer. Use with caution.
     *
     * @experimental
     */
    get client() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_client, "f");
    }
    /**
     * @returns the URL of the request
     */
    url() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_url, "f");
    }
    /**
     * @returns the `ContinueRequestOverrides` that will be used
     * if the interception is allowed to continue (ie, `abort()` and
     * `respond()` aren't called).
     */
    continueRequestOverrides() {
        assert(__classPrivateFieldGet$q(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        return __classPrivateFieldGet$q(this, _HTTPRequest_continueRequestOverrides, "f");
    }
    /**
     * @returns The `ResponseForRequest` that gets used if the
     * interception is allowed to respond (ie, `abort()` is not called).
     */
    responseForRequest() {
        assert(__classPrivateFieldGet$q(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        return __classPrivateFieldGet$q(this, _HTTPRequest_responseForRequest, "f");
    }
    /**
     * @returns the most recent reason for aborting the request
     */
    abortErrorReason() {
        assert(__classPrivateFieldGet$q(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        return __classPrivateFieldGet$q(this, _HTTPRequest_abortErrorReason, "f");
    }
    /**
     * @returns An InterceptResolutionState object describing the current resolution
     * action and priority.
     *
     * InterceptResolutionState contains:
     * action: InterceptResolutionAction
     * priority?: number
     *
     * InterceptResolutionAction is one of: `abort`, `respond`, `continue`,
     * `disabled`, `none`, or `already-handled`.
     */
    interceptResolutionState() {
        if (!__classPrivateFieldGet$q(this, _HTTPRequest_allowInterception, "f")) {
            return { action: InterceptResolutionAction.Disabled };
        }
        if (__classPrivateFieldGet$q(this, _HTTPRequest_interceptionHandled, "f")) {
            return { action: InterceptResolutionAction.AlreadyHandled };
        }
        return { ...__classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f") };
    }
    /**
     * @returns `true` if the intercept resolution has already been handled,
     * `false` otherwise.
     */
    isInterceptResolutionHandled() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_interceptionHandled, "f");
    }
    /**
     * Adds an async request handler to the processing queue.
     * Deferred handlers are not guaranteed to execute in any particular order,
     * but they are guaranteed to resolve before the request interception
     * is finalized.
     */
    enqueueInterceptAction(pendingHandler) {
        __classPrivateFieldGet$q(this, _HTTPRequest_interceptHandlers, "f").push(pendingHandler);
    }
    /**
     * Awaits pending interception handlers and then decides how to fulfill
     * the request interception.
     */
    async finalizeInterceptions() {
        await __classPrivateFieldGet$q(this, _HTTPRequest_interceptHandlers, "f").reduce((promiseChain, interceptAction) => {
            return promiseChain.then(interceptAction);
        }, Promise.resolve());
        const { action } = this.interceptResolutionState();
        switch (action) {
            case 'abort':
                return __classPrivateFieldGet$q(this, _HTTPRequest_instances, "m", _HTTPRequest_abort).call(this, __classPrivateFieldGet$q(this, _HTTPRequest_abortErrorReason, "f"));
            case 'respond':
                if (__classPrivateFieldGet$q(this, _HTTPRequest_responseForRequest, "f") === null) {
                    throw new Error('Response is missing for the interception');
                }
                return __classPrivateFieldGet$q(this, _HTTPRequest_instances, "m", _HTTPRequest_respond).call(this, __classPrivateFieldGet$q(this, _HTTPRequest_responseForRequest, "f"));
            case 'continue':
                return __classPrivateFieldGet$q(this, _HTTPRequest_instances, "m", _HTTPRequest_continue).call(this, __classPrivateFieldGet$q(this, _HTTPRequest_continueRequestOverrides, "f"));
        }
    }
    /**
     * Contains the request's resource type as it was perceived by the rendering
     * engine.
     */
    resourceType() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_resourceType, "f");
    }
    /**
     * @returns the method used (`GET`, `POST`, etc.)
     */
    method() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_method, "f");
    }
    /**
     * @returns the request's post body, if any.
     */
    postData() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_postData, "f");
    }
    /**
     * @returns an object with HTTP headers associated with the request. All
     * header names are lower-case.
     */
    headers() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_headers, "f");
    }
    /**
     * @returns A matching `HTTPResponse` object, or null if the response has not
     * been received yet.
     */
    response() {
        return this._response;
    }
    /**
     * @returns the frame that initiated the request, or null if navigating to
     * error pages.
     */
    frame() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_frame, "f");
    }
    /**
     * @returns true if the request is the driver of the current frame's navigation.
     */
    isNavigationRequest() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_isNavigationRequest, "f");
    }
    /**
     * @returns the initiator of the request.
     */
    initiator() {
        return __classPrivateFieldGet$q(this, _HTTPRequest_initiator, "f");
    }
    /**
     * A `redirectChain` is a chain of requests initiated to fetch a resource.
     * @remarks
     *
     * `redirectChain` is shared between all the requests of the same chain.
     *
     * For example, if the website `http://example.com` has a single redirect to
     * `https://example.com`, then the chain will contain one request:
     *
     * ```ts
     * const response = await page.goto('http://example.com');
     * const chain = response.request().redirectChain();
     * console.log(chain.length); // 1
     * console.log(chain[0].url()); // 'http://example.com'
     * ```
     *
     * If the website `https://google.com` has no redirects, then the chain will be empty:
     *
     * ```ts
     * const response = await page.goto('https://google.com');
     * const chain = response.request().redirectChain();
     * console.log(chain.length); // 0
     * ```
     *
     * @returns the chain of requests - if a server responds with at least a
     * single redirect, this chain will contain all requests that were redirected.
     */
    redirectChain() {
        return this._redirectChain.slice();
    }
    /**
     * Access information about the request's failure.
     *
     * @remarks
     *
     * @example
     *
     * Example of logging all failed requests:
     *
     * ```ts
     * page.on('requestfailed', request => {
     *   console.log(request.url() + ' ' + request.failure().errorText);
     * });
     * ```
     *
     * @returns `null` unless the request failed. If the request fails this can
     * return an object with `errorText` containing a human-readable error
     * message, e.g. `net::ERR_FAILED`. It is not guaranteed that there will be
     * failure text if the request fails.
     */
    failure() {
        if (!this._failureText) {
            return null;
        }
        return {
            errorText: this._failureText,
        };
    }
    /**
     * Continues request with optional request overrides.
     *
     * @remarks
     *
     * To use this, request
     * interception should be enabled with {@link Page.setRequestInterception}.
     *
     * Exception is immediately thrown if the request interception is not enabled.
     *
     * @example
     *
     * ```ts
     * await page.setRequestInterception(true);
     * page.on('request', request => {
     *   // Override headers
     *   const headers = Object.assign({}, request.headers(), {
     *     foo: 'bar', // set "foo" header
     *     origin: undefined, // remove "origin" header
     *   });
     *   request.continue({headers});
     * });
     * ```
     *
     * @param overrides - optional overrides to apply to the request.
     * @param priority - If provided, intercept is resolved using
     * cooperative handling rules. Otherwise, intercept is resolved
     * immediately.
     */
    async continue(overrides = {}, priority) {
        // Request interception is not supported for data: urls.
        if (__classPrivateFieldGet$q(this, _HTTPRequest_url, "f").startsWith('data:')) {
            return;
        }
        assert(__classPrivateFieldGet$q(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        assert(!__classPrivateFieldGet$q(this, _HTTPRequest_interceptionHandled, "f"), 'Request is already handled!');
        if (priority === undefined) {
            return __classPrivateFieldGet$q(this, _HTTPRequest_instances, "m", _HTTPRequest_continue).call(this, overrides);
        }
        __classPrivateFieldSet$p(this, _HTTPRequest_continueRequestOverrides, overrides, "f");
        if (__classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority === undefined ||
            priority > __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            __classPrivateFieldSet$p(this, _HTTPRequest_interceptResolutionState, {
                action: InterceptResolutionAction.Continue,
                priority,
            }, "f");
            return;
        }
        if (priority === __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            if (__classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").action === 'abort' ||
                __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").action === 'respond') {
                return;
            }
            __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").action =
                InterceptResolutionAction.Continue;
        }
        return;
    }
    /**
     * Fulfills a request with the given response.
     *
     * @remarks
     *
     * To use this, request
     * interception should be enabled with {@link Page.setRequestInterception}.
     *
     * Exception is immediately thrown if the request interception is not enabled.
     *
     * @example
     * An example of fulfilling all requests with 404 responses:
     *
     * ```ts
     * await page.setRequestInterception(true);
     * page.on('request', request => {
     *   request.respond({
     *     status: 404,
     *     contentType: 'text/plain',
     *     body: 'Not Found!',
     *   });
     * });
     * ```
     *
     * NOTE: Mocking responses for dataURL requests is not supported.
     * Calling `request.respond` for a dataURL request is a noop.
     *
     * @param response - the response to fulfill the request with.
     * @param priority - If provided, intercept is resolved using
     * cooperative handling rules. Otherwise, intercept is resolved
     * immediately.
     */
    async respond(response, priority) {
        // Mocking responses for dataURL requests is not currently supported.
        if (__classPrivateFieldGet$q(this, _HTTPRequest_url, "f").startsWith('data:')) {
            return;
        }
        assert(__classPrivateFieldGet$q(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        assert(!__classPrivateFieldGet$q(this, _HTTPRequest_interceptionHandled, "f"), 'Request is already handled!');
        if (priority === undefined) {
            return __classPrivateFieldGet$q(this, _HTTPRequest_instances, "m", _HTTPRequest_respond).call(this, response);
        }
        __classPrivateFieldSet$p(this, _HTTPRequest_responseForRequest, response, "f");
        if (__classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority === undefined ||
            priority > __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            __classPrivateFieldSet$p(this, _HTTPRequest_interceptResolutionState, {
                action: InterceptResolutionAction.Respond,
                priority,
            }, "f");
            return;
        }
        if (priority === __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            if (__classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").action === 'abort') {
                return;
            }
            __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").action = InterceptResolutionAction.Respond;
        }
    }
    /**
     * Aborts a request.
     *
     * @remarks
     * To use this, request interception should be enabled with
     * {@link Page.setRequestInterception}. If it is not enabled, this method will
     * throw an exception immediately.
     *
     * @param errorCode - optional error code to provide.
     * @param priority - If provided, intercept is resolved using
     * cooperative handling rules. Otherwise, intercept is resolved
     * immediately.
     */
    async abort(errorCode = 'failed', priority) {
        // Request interception is not supported for data: urls.
        if (__classPrivateFieldGet$q(this, _HTTPRequest_url, "f").startsWith('data:')) {
            return;
        }
        const errorReason = errorReasons[errorCode];
        assert(errorReason, 'Unknown error code: ' + errorCode);
        assert(__classPrivateFieldGet$q(this, _HTTPRequest_allowInterception, "f"), 'Request Interception is not enabled!');
        assert(!__classPrivateFieldGet$q(this, _HTTPRequest_interceptionHandled, "f"), 'Request is already handled!');
        if (priority === undefined) {
            return __classPrivateFieldGet$q(this, _HTTPRequest_instances, "m", _HTTPRequest_abort).call(this, errorReason);
        }
        __classPrivateFieldSet$p(this, _HTTPRequest_abortErrorReason, errorReason, "f");
        if (__classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority === undefined ||
            priority >= __classPrivateFieldGet$q(this, _HTTPRequest_interceptResolutionState, "f").priority) {
            __classPrivateFieldSet$p(this, _HTTPRequest_interceptResolutionState, {
                action: InterceptResolutionAction.Abort,
                priority,
            }, "f");
            return;
        }
    }
}
_HTTPRequest_client = new WeakMap(), _HTTPRequest_isNavigationRequest = new WeakMap(), _HTTPRequest_allowInterception = new WeakMap(), _HTTPRequest_interceptionHandled = new WeakMap(), _HTTPRequest_url = new WeakMap(), _HTTPRequest_resourceType = new WeakMap(), _HTTPRequest_method = new WeakMap(), _HTTPRequest_postData = new WeakMap(), _HTTPRequest_headers = new WeakMap(), _HTTPRequest_frame = new WeakMap(), _HTTPRequest_continueRequestOverrides = new WeakMap(), _HTTPRequest_responseForRequest = new WeakMap(), _HTTPRequest_abortErrorReason = new WeakMap(), _HTTPRequest_interceptResolutionState = new WeakMap(), _HTTPRequest_interceptHandlers = new WeakMap(), _HTTPRequest_initiator = new WeakMap(), _HTTPRequest_instances = new WeakSet(), _HTTPRequest_continue = async function _HTTPRequest_continue(overrides = {}) {
    const { url, method, postData, headers } = overrides;
    __classPrivateFieldSet$p(this, _HTTPRequest_interceptionHandled, true, "f");
    const postDataBinaryBase64 = postData
        ? Buffer.from(postData).toString('base64')
        : undefined;
    if (this._interceptionId === undefined) {
        throw new Error('HTTPRequest is missing _interceptionId needed for Fetch.continueRequest');
    }
    await __classPrivateFieldGet$q(this, _HTTPRequest_client, "f")
        .send('Fetch.continueRequest', {
        requestId: this._interceptionId,
        url,
        method,
        postData: postDataBinaryBase64,
        headers: headers ? headersArray(headers) : undefined,
    })
        .catch(error => {
        __classPrivateFieldSet$p(this, _HTTPRequest_interceptionHandled, false, "f");
        return handleError(error);
    });
}, _HTTPRequest_respond = async function _HTTPRequest_respond(response) {
    __classPrivateFieldSet$p(this, _HTTPRequest_interceptionHandled, true, "f");
    const responseBody = response.body && isString(response.body)
        ? Buffer.from(response.body)
        : response.body || null;
    const responseHeaders = {};
    if (response.headers) {
        for (const header of Object.keys(response.headers)) {
            const value = response.headers[header];
            responseHeaders[header.toLowerCase()] = Array.isArray(value)
                ? value.map(item => {
                    return String(item);
                })
                : String(value);
        }
    }
    if (response.contentType) {
        responseHeaders['content-type'] = response.contentType;
    }
    if (responseBody && !('content-length' in responseHeaders)) {
        responseHeaders['content-length'] = String(Buffer.byteLength(responseBody));
    }
    const status = response.status || 200;
    if (this._interceptionId === undefined) {
        throw new Error('HTTPRequest is missing _interceptionId needed for Fetch.fulfillRequest');
    }
    await __classPrivateFieldGet$q(this, _HTTPRequest_client, "f")
        .send('Fetch.fulfillRequest', {
        requestId: this._interceptionId,
        responseCode: status,
        responsePhrase: STATUS_TEXTS[status],
        responseHeaders: headersArray(responseHeaders),
        body: responseBody ? responseBody.toString('base64') : undefined,
    })
        .catch(error => {
        __classPrivateFieldSet$p(this, _HTTPRequest_interceptionHandled, false, "f");
        return handleError(error);
    });
}, _HTTPRequest_abort = async function _HTTPRequest_abort(errorReason) {
    __classPrivateFieldSet$p(this, _HTTPRequest_interceptionHandled, true, "f");
    if (this._interceptionId === undefined) {
        throw new Error('HTTPRequest is missing _interceptionId needed for Fetch.failRequest');
    }
    await __classPrivateFieldGet$q(this, _HTTPRequest_client, "f")
        .send('Fetch.failRequest', {
        requestId: this._interceptionId,
        errorReason: errorReason || 'Failed',
    })
        .catch(handleError);
};
/**
 * @public
 */
var InterceptResolutionAction;
(function (InterceptResolutionAction) {
    InterceptResolutionAction["Abort"] = "abort";
    InterceptResolutionAction["Respond"] = "respond";
    InterceptResolutionAction["Continue"] = "continue";
    InterceptResolutionAction["Disabled"] = "disabled";
    InterceptResolutionAction["None"] = "none";
    InterceptResolutionAction["AlreadyHandled"] = "already-handled";
})(InterceptResolutionAction || (InterceptResolutionAction = {}));
const errorReasons = {
    aborted: 'Aborted',
    accessdenied: 'AccessDenied',
    addressunreachable: 'AddressUnreachable',
    blockedbyclient: 'BlockedByClient',
    blockedbyresponse: 'BlockedByResponse',
    connectionaborted: 'ConnectionAborted',
    connectionclosed: 'ConnectionClosed',
    connectionfailed: 'ConnectionFailed',
    connectionrefused: 'ConnectionRefused',
    connectionreset: 'ConnectionReset',
    internetdisconnected: 'InternetDisconnected',
    namenotresolved: 'NameNotResolved',
    timedout: 'TimedOut',
    failed: 'Failed',
};
function headersArray(headers) {
    const result = [];
    for (const name in headers) {
        const value = headers[name];
        if (!Object.is(value, undefined)) {
            const values = Array.isArray(value) ? value : [value];
            result.push(...values.map(value => {
                return { name, value: value + '' };
            }));
        }
    }
    return result;
}
async function handleError(error) {
    if (['Invalid header'].includes(error.originalMessage)) {
        throw error;
    }
    // In certain cases, protocol will return error if the request was
    // already canceled or the page was closed. We should tolerate these
    // errors.
    debugError(error);
}
// List taken from
// https://www.iana.org/assignments/http-status-codes/http-status-codes.xhtml
// with extra 306 and 418 codes.
const STATUS_TEXTS = {
    '100': 'Continue',
    '101': 'Switching Protocols',
    '102': 'Processing',
    '103': 'Early Hints',
    '200': 'OK',
    '201': 'Created',
    '202': 'Accepted',
    '203': 'Non-Authoritative Information',
    '204': 'No Content',
    '205': 'Reset Content',
    '206': 'Partial Content',
    '207': 'Multi-Status',
    '208': 'Already Reported',
    '226': 'IM Used',
    '300': 'Multiple Choices',
    '301': 'Moved Permanently',
    '302': 'Found',
    '303': 'See Other',
    '304': 'Not Modified',
    '305': 'Use Proxy',
    '306': 'Switch Proxy',
    '307': 'Temporary Redirect',
    '308': 'Permanent Redirect',
    '400': 'Bad Request',
    '401': 'Unauthorized',
    '402': 'Payment Required',
    '403': 'Forbidden',
    '404': 'Not Found',
    '405': 'Method Not Allowed',
    '406': 'Not Acceptable',
    '407': 'Proxy Authentication Required',
    '408': 'Request Timeout',
    '409': 'Conflict',
    '410': 'Gone',
    '411': 'Length Required',
    '412': 'Precondition Failed',
    '413': 'Payload Too Large',
    '414': 'URI Too Long',
    '415': 'Unsupported Media Type',
    '416': 'Range Not Satisfiable',
    '417': 'Expectation Failed',
    '418': "I'm a teapot",
    '421': 'Misdirected Request',
    '422': 'Unprocessable Entity',
    '423': 'Locked',
    '424': 'Failed Dependency',
    '425': 'Too Early',
    '426': 'Upgrade Required',
    '428': 'Precondition Required',
    '429': 'Too Many Requests',
    '431': 'Request Header Fields Too Large',
    '451': 'Unavailable For Legal Reasons',
    '500': 'Internal Server Error',
    '501': 'Not Implemented',
    '502': 'Bad Gateway',
    '503': 'Service Unavailable',
    '504': 'Gateway Timeout',
    '505': 'HTTP Version Not Supported',
    '506': 'Variant Also Negotiates',
    '507': 'Insufficient Storage',
    '508': 'Loop Detected',
    '510': 'Not Extended',
    '511': 'Network Authentication Required',
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$o = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$p = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _SecurityDetails_subjectName, _SecurityDetails_issuer, _SecurityDetails_validFrom, _SecurityDetails_validTo, _SecurityDetails_protocol, _SecurityDetails_sanList;
/**
 * The SecurityDetails class represents the security details of a
 * response that was received over a secure connection.
 *
 * @public
 */
class SecurityDetails {
    /**
     * @internal
     */
    constructor(securityPayload) {
        _SecurityDetails_subjectName.set(this, void 0);
        _SecurityDetails_issuer.set(this, void 0);
        _SecurityDetails_validFrom.set(this, void 0);
        _SecurityDetails_validTo.set(this, void 0);
        _SecurityDetails_protocol.set(this, void 0);
        _SecurityDetails_sanList.set(this, void 0);
        __classPrivateFieldSet$o(this, _SecurityDetails_subjectName, securityPayload.subjectName, "f");
        __classPrivateFieldSet$o(this, _SecurityDetails_issuer, securityPayload.issuer, "f");
        __classPrivateFieldSet$o(this, _SecurityDetails_validFrom, securityPayload.validFrom, "f");
        __classPrivateFieldSet$o(this, _SecurityDetails_validTo, securityPayload.validTo, "f");
        __classPrivateFieldSet$o(this, _SecurityDetails_protocol, securityPayload.protocol, "f");
        __classPrivateFieldSet$o(this, _SecurityDetails_sanList, securityPayload.sanList, "f");
    }
    /**
     * @returns The name of the issuer of the certificate.
     */
    issuer() {
        return __classPrivateFieldGet$p(this, _SecurityDetails_issuer, "f");
    }
    /**
     * @returns {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
     * marking the start of the certificate's validity.
     */
    validFrom() {
        return __classPrivateFieldGet$p(this, _SecurityDetails_validFrom, "f");
    }
    /**
     * @returns {@link https://en.wikipedia.org/wiki/Unix_time | Unix timestamp}
     * marking the end of the certificate's validity.
     */
    validTo() {
        return __classPrivateFieldGet$p(this, _SecurityDetails_validTo, "f");
    }
    /**
     * @returns The security protocol being used, e.g. "TLS 1.2".
     */
    protocol() {
        return __classPrivateFieldGet$p(this, _SecurityDetails_protocol, "f");
    }
    /**
     * @returns The name of the subject to which the certificate was issued.
     */
    subjectName() {
        return __classPrivateFieldGet$p(this, _SecurityDetails_subjectName, "f");
    }
    /**
     * @returns The list of {@link https://en.wikipedia.org/wiki/Subject_Alternative_Name | subject alternative names (SANs)} of the certificate.
     */
    subjectAlternativeNames() {
        return __classPrivateFieldGet$p(this, _SecurityDetails_sanList, "f");
    }
}
_SecurityDetails_subjectName = new WeakMap(), _SecurityDetails_issuer = new WeakMap(), _SecurityDetails_validFrom = new WeakMap(), _SecurityDetails_validTo = new WeakMap(), _SecurityDetails_protocol = new WeakMap(), _SecurityDetails_sanList = new WeakMap();

var __classPrivateFieldSet$n = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$o = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _HTTPResponse_instances, _HTTPResponse_client, _HTTPResponse_request, _HTTPResponse_contentPromise, _HTTPResponse_bodyLoadedPromise, _HTTPResponse_bodyLoadedPromiseFulfill, _HTTPResponse_remoteAddress, _HTTPResponse_status, _HTTPResponse_statusText, _HTTPResponse_url, _HTTPResponse_fromDiskCache, _HTTPResponse_fromServiceWorker, _HTTPResponse_headers, _HTTPResponse_securityDetails, _HTTPResponse_timing, _HTTPResponse_parseStatusTextFromExtrInfo;
/**
 * The HTTPResponse class represents responses which are received by the
 * {@link Page} class.
 *
 * @public
 */
class HTTPResponse {
    /**
     * @internal
     */
    constructor(client, request, responsePayload, extraInfo) {
        _HTTPResponse_instances.add(this);
        _HTTPResponse_client.set(this, void 0);
        _HTTPResponse_request.set(this, void 0);
        _HTTPResponse_contentPromise.set(this, null);
        _HTTPResponse_bodyLoadedPromise.set(this, void 0);
        _HTTPResponse_bodyLoadedPromiseFulfill.set(this, () => { });
        _HTTPResponse_remoteAddress.set(this, void 0);
        _HTTPResponse_status.set(this, void 0);
        _HTTPResponse_statusText.set(this, void 0);
        _HTTPResponse_url.set(this, void 0);
        _HTTPResponse_fromDiskCache.set(this, void 0);
        _HTTPResponse_fromServiceWorker.set(this, void 0);
        _HTTPResponse_headers.set(this, {});
        _HTTPResponse_securityDetails.set(this, void 0);
        _HTTPResponse_timing.set(this, void 0);
        __classPrivateFieldSet$n(this, _HTTPResponse_client, client, "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_request, request, "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_bodyLoadedPromise, new Promise(fulfill => {
            __classPrivateFieldSet$n(this, _HTTPResponse_bodyLoadedPromiseFulfill, fulfill, "f");
        }), "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_remoteAddress, {
            ip: responsePayload.remoteIPAddress,
            port: responsePayload.remotePort,
        }, "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_statusText, __classPrivateFieldGet$o(this, _HTTPResponse_instances, "m", _HTTPResponse_parseStatusTextFromExtrInfo).call(this, extraInfo) ||
            responsePayload.statusText, "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_url, request.url(), "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_fromDiskCache, !!responsePayload.fromDiskCache, "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_fromServiceWorker, !!responsePayload.fromServiceWorker, "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_status, extraInfo ? extraInfo.statusCode : responsePayload.status, "f");
        const headers = extraInfo ? extraInfo.headers : responsePayload.headers;
        for (const [key, value] of Object.entries(headers)) {
            __classPrivateFieldGet$o(this, _HTTPResponse_headers, "f")[key.toLowerCase()] = value;
        }
        __classPrivateFieldSet$n(this, _HTTPResponse_securityDetails, responsePayload.securityDetails
            ? new SecurityDetails(responsePayload.securityDetails)
            : null, "f");
        __classPrivateFieldSet$n(this, _HTTPResponse_timing, responsePayload.timing || null, "f");
    }
    /**
     * @internal
     */
    _resolveBody(err) {
        if (err) {
            return __classPrivateFieldGet$o(this, _HTTPResponse_bodyLoadedPromiseFulfill, "f").call(this, err);
        }
        return __classPrivateFieldGet$o(this, _HTTPResponse_bodyLoadedPromiseFulfill, "f").call(this);
    }
    /**
     * @returns The IP address and port number used to connect to the remote
     * server.
     */
    remoteAddress() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_remoteAddress, "f");
    }
    /**
     * @returns The URL of the response.
     */
    url() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_url, "f");
    }
    /**
     * @returns True if the response was successful (status in the range 200-299).
     */
    ok() {
        // TODO: document === 0 case?
        return __classPrivateFieldGet$o(this, _HTTPResponse_status, "f") === 0 || (__classPrivateFieldGet$o(this, _HTTPResponse_status, "f") >= 200 && __classPrivateFieldGet$o(this, _HTTPResponse_status, "f") <= 299);
    }
    /**
     * @returns The status code of the response (e.g., 200 for a success).
     */
    status() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_status, "f");
    }
    /**
     * @returns The status text of the response (e.g. usually an "OK" for a
     * success).
     */
    statusText() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_statusText, "f");
    }
    /**
     * @returns An object with HTTP headers associated with the response. All
     * header names are lower-case.
     */
    headers() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_headers, "f");
    }
    /**
     * @returns {@link SecurityDetails} if the response was received over the
     * secure connection, or `null` otherwise.
     */
    securityDetails() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_securityDetails, "f");
    }
    /**
     * @returns Timing information related to the response.
     */
    timing() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_timing, "f");
    }
    /**
     * @returns Promise which resolves to a buffer with response body.
     */
    buffer() {
        if (!__classPrivateFieldGet$o(this, _HTTPResponse_contentPromise, "f")) {
            __classPrivateFieldSet$n(this, _HTTPResponse_contentPromise, __classPrivateFieldGet$o(this, _HTTPResponse_bodyLoadedPromise, "f").then(async (error) => {
                if (error) {
                    throw error;
                }
                try {
                    const response = await __classPrivateFieldGet$o(this, _HTTPResponse_client, "f").send('Network.getResponseBody', {
                        requestId: __classPrivateFieldGet$o(this, _HTTPResponse_request, "f")._requestId,
                    });
                    return Buffer.from(response.body, response.base64Encoded ? 'base64' : 'utf8');
                }
                catch (error) {
                    if (error instanceof ProtocolError &&
                        error.originalMessage === 'No resource with given identifier found') {
                        throw new ProtocolError('Could not load body for this request. This might happen if the request is a preflight request.');
                    }
                    throw error;
                }
            }), "f");
        }
        return __classPrivateFieldGet$o(this, _HTTPResponse_contentPromise, "f");
    }
    /**
     * @returns Promise which resolves to a text representation of response body.
     */
    async text() {
        const content = await this.buffer();
        return content.toString('utf8');
    }
    /**
     *
     * @returns Promise which resolves to a JSON representation of response body.
     *
     * @remarks
     *
     * This method will throw if the response body is not parsable via
     * `JSON.parse`.
     */
    async json() {
        const content = await this.text();
        return JSON.parse(content);
    }
    /**
     * @returns A matching {@link HTTPRequest} object.
     */
    request() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_request, "f");
    }
    /**
     * @returns True if the response was served from either the browser's disk
     * cache or memory cache.
     */
    fromCache() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_fromDiskCache, "f") || __classPrivateFieldGet$o(this, _HTTPResponse_request, "f")._fromMemoryCache;
    }
    /**
     * @returns True if the response was served by a service worker.
     */
    fromServiceWorker() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_fromServiceWorker, "f");
    }
    /**
     * @returns A {@link Frame} that initiated this response, or `null` if
     * navigating to error pages.
     */
    frame() {
        return __classPrivateFieldGet$o(this, _HTTPResponse_request, "f").frame();
    }
}
_HTTPResponse_client = new WeakMap(), _HTTPResponse_request = new WeakMap(), _HTTPResponse_contentPromise = new WeakMap(), _HTTPResponse_bodyLoadedPromise = new WeakMap(), _HTTPResponse_bodyLoadedPromiseFulfill = new WeakMap(), _HTTPResponse_remoteAddress = new WeakMap(), _HTTPResponse_status = new WeakMap(), _HTTPResponse_statusText = new WeakMap(), _HTTPResponse_url = new WeakMap(), _HTTPResponse_fromDiskCache = new WeakMap(), _HTTPResponse_fromServiceWorker = new WeakMap(), _HTTPResponse_headers = new WeakMap(), _HTTPResponse_securityDetails = new WeakMap(), _HTTPResponse_timing = new WeakMap(), _HTTPResponse_instances = new WeakSet(), _HTTPResponse_parseStatusTextFromExtrInfo = function _HTTPResponse_parseStatusTextFromExtrInfo(extraInfo) {
    if (!extraInfo || !extraInfo.headersText) {
        return;
    }
    const firstLine = extraInfo.headersText.split('\r', 1)[0];
    if (!firstLine) {
        return;
    }
    const match = firstLine.match(/[^ ]* [^ ]* (.*)/);
    if (!match) {
        return;
    }
    const statusText = match[1];
    if (!statusText) {
        return;
    }
    return statusText;
};

var __classPrivateFieldGet$n = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NetworkEventManager_requestWillBeSentMap, _NetworkEventManager_requestPausedMap, _NetworkEventManager_httpRequestsMap, _NetworkEventManager_responseReceivedExtraInfoMap, _NetworkEventManager_queuedRedirectInfoMap, _NetworkEventManager_queuedEventGroupMap;
/**
 * Helper class to track network events by request ID
 *
 * @internal
 */
class NetworkEventManager {
    constructor() {
        /**
         * There are four possible orders of events:
         * A. `_onRequestWillBeSent`
         * B. `_onRequestWillBeSent`, `_onRequestPaused`
         * C. `_onRequestPaused`, `_onRequestWillBeSent`
         * D. `_onRequestPaused`, `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestWillBeSent`, `_onRequestPaused`, `_onRequestPaused`
         * (see crbug.com/1196004)
         *
         * For `_onRequest` we need the event from `_onRequestWillBeSent` and
         * optionally the `interceptionId` from `_onRequestPaused`.
         *
         * If request interception is disabled, call `_onRequest` once per call to
         * `_onRequestWillBeSent`.
         * If request interception is enabled, call `_onRequest` once per call to
         * `_onRequestPaused` (once per `interceptionId`).
         *
         * Events are stored to allow for subsequent events to call `_onRequest`.
         *
         * Note that (chains of) redirect requests have the same `requestId` (!) as
         * the original request. We have to anticipate series of events like these:
         * A. `_onRequestWillBeSent`,
         * `_onRequestWillBeSent`, ...
         * B. `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestWillBeSent`, `_onRequestPaused`, ...
         * C. `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestPaused`, `_onRequestWillBeSent`, ...
         * D. `_onRequestPaused`, `_onRequestWillBeSent`,
         * `_onRequestPaused`, `_onRequestWillBeSent`, `_onRequestPaused`,
         * `_onRequestWillBeSent`, `_onRequestPaused`, `_onRequestPaused`, ...
         * (see crbug.com/1196004)
         */
        _NetworkEventManager_requestWillBeSentMap.set(this, new Map());
        _NetworkEventManager_requestPausedMap.set(this, new Map());
        _NetworkEventManager_httpRequestsMap.set(this, new Map());
        /*
         * The below maps are used to reconcile Network.responseReceivedExtraInfo
         * events with their corresponding request. Each response and redirect
         * response gets an ExtraInfo event, and we don't know which will come first.
         * This means that we have to store a Response or an ExtraInfo for each
         * response, and emit the event when we get both of them. In addition, to
         * handle redirects, we have to make them Arrays to represent the chain of
         * events.
         */
        _NetworkEventManager_responseReceivedExtraInfoMap.set(this, new Map());
        _NetworkEventManager_queuedRedirectInfoMap.set(this, new Map());
        _NetworkEventManager_queuedEventGroupMap.set(this, new Map());
    }
    forget(networkRequestId) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_requestWillBeSentMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$n(this, _NetworkEventManager_requestPausedMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$n(this, _NetworkEventManager_queuedEventGroupMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$n(this, _NetworkEventManager_queuedRedirectInfoMap, "f").delete(networkRequestId);
        __classPrivateFieldGet$n(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").delete(networkRequestId);
    }
    responseExtraInfo(networkRequestId) {
        if (!__classPrivateFieldGet$n(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").has(networkRequestId)) {
            __classPrivateFieldGet$n(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").set(networkRequestId, []);
        }
        return __classPrivateFieldGet$n(this, _NetworkEventManager_responseReceivedExtraInfoMap, "f").get(networkRequestId);
    }
    queuedRedirectInfo(fetchRequestId) {
        if (!__classPrivateFieldGet$n(this, _NetworkEventManager_queuedRedirectInfoMap, "f").has(fetchRequestId)) {
            __classPrivateFieldGet$n(this, _NetworkEventManager_queuedRedirectInfoMap, "f").set(fetchRequestId, []);
        }
        return __classPrivateFieldGet$n(this, _NetworkEventManager_queuedRedirectInfoMap, "f").get(fetchRequestId);
    }
    queueRedirectInfo(fetchRequestId, redirectInfo) {
        this.queuedRedirectInfo(fetchRequestId).push(redirectInfo);
    }
    takeQueuedRedirectInfo(fetchRequestId) {
        return this.queuedRedirectInfo(fetchRequestId).shift();
    }
    numRequestsInProgress() {
        return [...__classPrivateFieldGet$n(this, _NetworkEventManager_httpRequestsMap, "f")].filter(([, request]) => {
            return !request.response();
        }).length;
    }
    storeRequestWillBeSent(networkRequestId, event) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_requestWillBeSentMap, "f").set(networkRequestId, event);
    }
    getRequestWillBeSent(networkRequestId) {
        return __classPrivateFieldGet$n(this, _NetworkEventManager_requestWillBeSentMap, "f").get(networkRequestId);
    }
    forgetRequestWillBeSent(networkRequestId) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_requestWillBeSentMap, "f").delete(networkRequestId);
    }
    getRequestPaused(networkRequestId) {
        return __classPrivateFieldGet$n(this, _NetworkEventManager_requestPausedMap, "f").get(networkRequestId);
    }
    forgetRequestPaused(networkRequestId) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_requestPausedMap, "f").delete(networkRequestId);
    }
    storeRequestPaused(networkRequestId, event) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_requestPausedMap, "f").set(networkRequestId, event);
    }
    getRequest(networkRequestId) {
        return __classPrivateFieldGet$n(this, _NetworkEventManager_httpRequestsMap, "f").get(networkRequestId);
    }
    storeRequest(networkRequestId, request) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_httpRequestsMap, "f").set(networkRequestId, request);
    }
    forgetRequest(networkRequestId) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_httpRequestsMap, "f").delete(networkRequestId);
    }
    getQueuedEventGroup(networkRequestId) {
        return __classPrivateFieldGet$n(this, _NetworkEventManager_queuedEventGroupMap, "f").get(networkRequestId);
    }
    queueEventGroup(networkRequestId, event) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_queuedEventGroupMap, "f").set(networkRequestId, event);
    }
    forgetQueuedEventGroup(networkRequestId) {
        __classPrivateFieldGet$n(this, _NetworkEventManager_queuedEventGroupMap, "f").delete(networkRequestId);
    }
}
_NetworkEventManager_requestWillBeSentMap = new WeakMap(), _NetworkEventManager_requestPausedMap = new WeakMap(), _NetworkEventManager_httpRequestsMap = new WeakMap(), _NetworkEventManager_responseReceivedExtraInfoMap = new WeakMap(), _NetworkEventManager_queuedRedirectInfoMap = new WeakMap(), _NetworkEventManager_queuedEventGroupMap = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$m = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$m = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _NetworkManager_instances, _NetworkManager_client, _NetworkManager_ignoreHTTPSErrors, _NetworkManager_frameManager, _NetworkManager_networkEventManager, _NetworkManager_extraHTTPHeaders, _NetworkManager_credentials, _NetworkManager_attemptedAuthentications, _NetworkManager_userRequestInterceptionEnabled, _NetworkManager_protocolRequestInterceptionEnabled, _NetworkManager_userCacheDisabled, _NetworkManager_emulatedNetworkConditions, _NetworkManager_deferredInitPromise, _NetworkManager_updateNetworkConditions, _NetworkManager_updateProtocolRequestInterception, _NetworkManager_cacheDisabled, _NetworkManager_updateProtocolCacheDisabled, _NetworkManager_onRequestWillBeSent, _NetworkManager_onAuthRequired, _NetworkManager_onRequestPaused, _NetworkManager_patchRequestEventHeaders, _NetworkManager_onRequest, _NetworkManager_onRequestServedFromCache, _NetworkManager_handleRequestRedirect, _NetworkManager_emitResponseEvent, _NetworkManager_onResponseReceived, _NetworkManager_onResponseReceivedExtraInfo, _NetworkManager_forgetRequest, _NetworkManager_onLoadingFinished, _NetworkManager_emitLoadingFinished, _NetworkManager_onLoadingFailed, _NetworkManager_emitLoadingFailed;
/**
 * We use symbols to prevent any external parties listening to these events.
 * They are internal to Puppeteer.
 *
 * @internal
 */
const NetworkManagerEmittedEvents = {
    Request: Symbol('NetworkManager.Request'),
    RequestServedFromCache: Symbol('NetworkManager.RequestServedFromCache'),
    Response: Symbol('NetworkManager.Response'),
    RequestFailed: Symbol('NetworkManager.RequestFailed'),
    RequestFinished: Symbol('NetworkManager.RequestFinished'),
};
/**
 * @internal
 */
class NetworkManager extends EventEmitter {
    constructor(client, ignoreHTTPSErrors, frameManager) {
        super();
        _NetworkManager_instances.add(this);
        _NetworkManager_client.set(this, void 0);
        _NetworkManager_ignoreHTTPSErrors.set(this, void 0);
        _NetworkManager_frameManager.set(this, void 0);
        _NetworkManager_networkEventManager.set(this, new NetworkEventManager());
        _NetworkManager_extraHTTPHeaders.set(this, {});
        _NetworkManager_credentials.set(this, void 0);
        _NetworkManager_attemptedAuthentications.set(this, new Set());
        _NetworkManager_userRequestInterceptionEnabled.set(this, false);
        _NetworkManager_protocolRequestInterceptionEnabled.set(this, false);
        _NetworkManager_userCacheDisabled.set(this, false);
        _NetworkManager_emulatedNetworkConditions.set(this, {
            offline: false,
            upload: -1,
            download: -1,
            latency: 0,
        });
        _NetworkManager_deferredInitPromise.set(this, void 0);
        __classPrivateFieldSet$m(this, _NetworkManager_client, client, "f");
        __classPrivateFieldSet$m(this, _NetworkManager_ignoreHTTPSErrors, ignoreHTTPSErrors, "f");
        __classPrivateFieldSet$m(this, _NetworkManager_frameManager, frameManager, "f");
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Fetch.requestPaused', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onRequestPaused).bind(this));
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Fetch.authRequired', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onAuthRequired).bind(this));
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Network.requestWillBeSent', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onRequestWillBeSent).bind(this));
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Network.requestServedFromCache', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onRequestServedFromCache).bind(this));
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Network.responseReceived', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onResponseReceived).bind(this));
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Network.loadingFinished', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onLoadingFinished).bind(this));
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Network.loadingFailed', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onLoadingFailed).bind(this));
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f").on('Network.responseReceivedExtraInfo', __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onResponseReceivedExtraInfo).bind(this));
    }
    /**
     * Initialize calls should avoid async dependencies between CDP calls as those
     * might not resolve until after the target is resumed causing a deadlock.
     */
    initialize() {
        if (__classPrivateFieldGet$m(this, _NetworkManager_deferredInitPromise, "f")) {
            return __classPrivateFieldGet$m(this, _NetworkManager_deferredInitPromise, "f");
        }
        __classPrivateFieldSet$m(this, _NetworkManager_deferredInitPromise, createDebuggableDeferredPromise('NetworkManager initialization timed out'), "f");
        const init = Promise.all([
            __classPrivateFieldGet$m(this, _NetworkManager_ignoreHTTPSErrors, "f")
                ? __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Security.setIgnoreCertificateErrors', {
                    ignore: true,
                })
                : null,
            __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Network.enable'),
        ]);
        const deferredInitPromise = __classPrivateFieldGet$m(this, _NetworkManager_deferredInitPromise, "f");
        init
            .then(() => {
            deferredInitPromise.resolve();
        })
            .catch(err => {
            deferredInitPromise.reject(err);
        });
        return __classPrivateFieldGet$m(this, _NetworkManager_deferredInitPromise, "f");
    }
    async authenticate(credentials) {
        __classPrivateFieldSet$m(this, _NetworkManager_credentials, credentials, "f");
        await __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolRequestInterception).call(this);
    }
    async setExtraHTTPHeaders(extraHTTPHeaders) {
        __classPrivateFieldSet$m(this, _NetworkManager_extraHTTPHeaders, {}, "f");
        for (const key of Object.keys(extraHTTPHeaders)) {
            const value = extraHTTPHeaders[key];
            assert(isString(value), `Expected value of header "${key}" to be String, but "${typeof value}" is found.`);
            __classPrivateFieldGet$m(this, _NetworkManager_extraHTTPHeaders, "f")[key.toLowerCase()] = value;
        }
        await __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Network.setExtraHTTPHeaders', {
            headers: __classPrivateFieldGet$m(this, _NetworkManager_extraHTTPHeaders, "f"),
        });
    }
    extraHTTPHeaders() {
        return Object.assign({}, __classPrivateFieldGet$m(this, _NetworkManager_extraHTTPHeaders, "f"));
    }
    numRequestsInProgress() {
        return __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").numRequestsInProgress();
    }
    async setOfflineMode(value) {
        __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").offline = value;
        await __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_updateNetworkConditions).call(this);
    }
    async emulateNetworkConditions(networkConditions) {
        __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").upload = networkConditions
            ? networkConditions.upload
            : -1;
        __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").download = networkConditions
            ? networkConditions.download
            : -1;
        __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").latency = networkConditions
            ? networkConditions.latency
            : 0;
        await __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_updateNetworkConditions).call(this);
    }
    async setUserAgent(userAgent, userAgentMetadata) {
        await __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Network.setUserAgentOverride', {
            userAgent: userAgent,
            userAgentMetadata: userAgentMetadata,
        });
    }
    async setCacheEnabled(enabled) {
        __classPrivateFieldSet$m(this, _NetworkManager_userCacheDisabled, !enabled, "f");
        await __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolCacheDisabled).call(this);
    }
    async setRequestInterception(value) {
        __classPrivateFieldSet$m(this, _NetworkManager_userRequestInterceptionEnabled, value, "f");
        await __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolRequestInterception).call(this);
    }
}
_NetworkManager_client = new WeakMap(), _NetworkManager_ignoreHTTPSErrors = new WeakMap(), _NetworkManager_frameManager = new WeakMap(), _NetworkManager_networkEventManager = new WeakMap(), _NetworkManager_extraHTTPHeaders = new WeakMap(), _NetworkManager_credentials = new WeakMap(), _NetworkManager_attemptedAuthentications = new WeakMap(), _NetworkManager_userRequestInterceptionEnabled = new WeakMap(), _NetworkManager_protocolRequestInterceptionEnabled = new WeakMap(), _NetworkManager_userCacheDisabled = new WeakMap(), _NetworkManager_emulatedNetworkConditions = new WeakMap(), _NetworkManager_deferredInitPromise = new WeakMap(), _NetworkManager_instances = new WeakSet(), _NetworkManager_updateNetworkConditions = async function _NetworkManager_updateNetworkConditions() {
    await __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Network.emulateNetworkConditions', {
        offline: __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").offline,
        latency: __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").latency,
        uploadThroughput: __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").upload,
        downloadThroughput: __classPrivateFieldGet$m(this, _NetworkManager_emulatedNetworkConditions, "f").download,
    });
}, _NetworkManager_updateProtocolRequestInterception = async function _NetworkManager_updateProtocolRequestInterception() {
    const enabled = __classPrivateFieldGet$m(this, _NetworkManager_userRequestInterceptionEnabled, "f") || !!__classPrivateFieldGet$m(this, _NetworkManager_credentials, "f");
    if (enabled === __classPrivateFieldGet$m(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
        return;
    }
    __classPrivateFieldSet$m(this, _NetworkManager_protocolRequestInterceptionEnabled, enabled, "f");
    if (enabled) {
        await Promise.all([
            __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolCacheDisabled).call(this),
            __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Fetch.enable', {
                handleAuthRequests: true,
                patterns: [{ urlPattern: '*' }],
            }),
        ]);
    }
    else {
        await Promise.all([
            __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_updateProtocolCacheDisabled).call(this),
            __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Fetch.disable'),
        ]);
    }
}, _NetworkManager_cacheDisabled = function _NetworkManager_cacheDisabled() {
    return __classPrivateFieldGet$m(this, _NetworkManager_userCacheDisabled, "f");
}, _NetworkManager_updateProtocolCacheDisabled = async function _NetworkManager_updateProtocolCacheDisabled() {
    await __classPrivateFieldGet$m(this, _NetworkManager_client, "f").send('Network.setCacheDisabled', {
        cacheDisabled: __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_cacheDisabled).call(this),
    });
}, _NetworkManager_onRequestWillBeSent = function _NetworkManager_onRequestWillBeSent(event) {
    // Request interception doesn't happen for data URLs with Network Service.
    if (__classPrivateFieldGet$m(this, _NetworkManager_userRequestInterceptionEnabled, "f") &&
        !event.request.url.startsWith('data:')) {
        const { requestId: networkRequestId } = event;
        __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").storeRequestWillBeSent(networkRequestId, event);
        /**
         * CDP may have sent a Fetch.requestPaused event already. Check for it.
         */
        const requestPausedEvent = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequestPaused(networkRequestId);
        if (requestPausedEvent) {
            const { requestId: fetchRequestId } = requestPausedEvent;
            __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_patchRequestEventHeaders).call(this, event, requestPausedEvent);
            __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, event, fetchRequestId);
            __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").forgetRequestPaused(networkRequestId);
        }
        return;
    }
    __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, event, undefined);
}, _NetworkManager_onAuthRequired = function _NetworkManager_onAuthRequired(event) {
    let response = 'Default';
    if (__classPrivateFieldGet$m(this, _NetworkManager_attemptedAuthentications, "f").has(event.requestId)) {
        response = 'CancelAuth';
    }
    else if (__classPrivateFieldGet$m(this, _NetworkManager_credentials, "f")) {
        response = 'ProvideCredentials';
        __classPrivateFieldGet$m(this, _NetworkManager_attemptedAuthentications, "f").add(event.requestId);
    }
    const { username, password } = __classPrivateFieldGet$m(this, _NetworkManager_credentials, "f") || {
        username: undefined,
        password: undefined,
    };
    __classPrivateFieldGet$m(this, _NetworkManager_client, "f")
        .send('Fetch.continueWithAuth', {
        requestId: event.requestId,
        authChallengeResponse: { response, username, password },
    })
        .catch(debugError);
}, _NetworkManager_onRequestPaused = function _NetworkManager_onRequestPaused(event) {
    if (!__classPrivateFieldGet$m(this, _NetworkManager_userRequestInterceptionEnabled, "f") &&
        __classPrivateFieldGet$m(this, _NetworkManager_protocolRequestInterceptionEnabled, "f")) {
        __classPrivateFieldGet$m(this, _NetworkManager_client, "f")
            .send('Fetch.continueRequest', {
            requestId: event.requestId,
        })
            .catch(debugError);
    }
    const { networkId: networkRequestId, requestId: fetchRequestId } = event;
    if (!networkRequestId) {
        return;
    }
    const requestWillBeSentEvent = (() => {
        const requestWillBeSentEvent = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequestWillBeSent(networkRequestId);
        // redirect requests have the same `requestId`,
        if (requestWillBeSentEvent &&
            (requestWillBeSentEvent.request.url !== event.request.url ||
                requestWillBeSentEvent.request.method !== event.request.method)) {
            __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").forgetRequestWillBeSent(networkRequestId);
            return;
        }
        return requestWillBeSentEvent;
    })();
    if (requestWillBeSentEvent) {
        __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_patchRequestEventHeaders).call(this, requestWillBeSentEvent, event);
        __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, requestWillBeSentEvent, fetchRequestId);
    }
    else {
        __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").storeRequestPaused(networkRequestId, event);
    }
}, _NetworkManager_patchRequestEventHeaders = function _NetworkManager_patchRequestEventHeaders(requestWillBeSentEvent, requestPausedEvent) {
    requestWillBeSentEvent.request.headers = {
        ...requestWillBeSentEvent.request.headers,
        // includes extra headers, like: Accept, Origin
        ...requestPausedEvent.request.headers,
    };
}, _NetworkManager_onRequest = function _NetworkManager_onRequest(event, fetchRequestId) {
    let redirectChain = [];
    if (event.redirectResponse) {
        // We want to emit a response and requestfinished for the
        // redirectResponse, but we can't do so unless we have a
        // responseExtraInfo ready to pair it up with. If we don't have any
        // responseExtraInfos saved in our queue, they we have to wait until
        // the next one to emit response and requestfinished, *and* we should
        // also wait to emit this Request too because it should come after the
        // response/requestfinished.
        let redirectResponseExtraInfo = null;
        if (event.redirectHasExtraInfo) {
            redirectResponseExtraInfo = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f")
                .responseExtraInfo(event.requestId)
                .shift();
            if (!redirectResponseExtraInfo) {
                __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").queueRedirectInfo(event.requestId, {
                    event,
                    fetchRequestId,
                });
                return;
            }
        }
        const request = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
        // If we connect late to the target, we could have missed the
        // requestWillBeSent event.
        if (request) {
            __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_handleRequestRedirect).call(this, request, event.redirectResponse, redirectResponseExtraInfo);
            redirectChain = request._redirectChain;
        }
    }
    const frame = event.frameId
        ? __classPrivateFieldGet$m(this, _NetworkManager_frameManager, "f").frame(event.frameId)
        : null;
    const request = new HTTPRequest(__classPrivateFieldGet$m(this, _NetworkManager_client, "f"), frame, fetchRequestId, __classPrivateFieldGet$m(this, _NetworkManager_userRequestInterceptionEnabled, "f"), event, redirectChain);
    __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").storeRequest(event.requestId, request);
    this.emit(NetworkManagerEmittedEvents.Request, request);
    request.finalizeInterceptions();
}, _NetworkManager_onRequestServedFromCache = function _NetworkManager_onRequestServedFromCache(event) {
    const request = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    if (request) {
        request._fromMemoryCache = true;
    }
    this.emit(NetworkManagerEmittedEvents.RequestServedFromCache, request);
}, _NetworkManager_handleRequestRedirect = function _NetworkManager_handleRequestRedirect(request, responsePayload, extraInfo) {
    const response = new HTTPResponse(__classPrivateFieldGet$m(this, _NetworkManager_client, "f"), request, responsePayload, extraInfo);
    request._response = response;
    request._redirectChain.push(request);
    response._resolveBody(new Error('Response body is unavailable for redirect responses'));
    __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, false);
    this.emit(NetworkManagerEmittedEvents.Response, response);
    this.emit(NetworkManagerEmittedEvents.RequestFinished, request);
}, _NetworkManager_emitResponseEvent = function _NetworkManager_emitResponseEvent(responseReceived, extraInfo) {
    const request = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequest(responseReceived.requestId);
    // FileUpload sends a response without a matching request.
    if (!request) {
        return;
    }
    const extraInfos = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(responseReceived.requestId);
    if (extraInfos.length) {
        debugError(new Error('Unexpected extraInfo events for request ' +
            responseReceived.requestId));
    }
    const response = new HTTPResponse(__classPrivateFieldGet$m(this, _NetworkManager_client, "f"), request, responseReceived.response, extraInfo);
    request._response = response;
    this.emit(NetworkManagerEmittedEvents.Response, response);
}, _NetworkManager_onResponseReceived = function _NetworkManager_onResponseReceived(event) {
    const request = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    let extraInfo = null;
    if (request && !request._fromMemoryCache && event.hasExtraInfo) {
        extraInfo = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f")
            .responseExtraInfo(event.requestId)
            .shift();
        if (!extraInfo) {
            // Wait until we get the corresponding ExtraInfo event.
            __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").queueEventGroup(event.requestId, {
                responseReceivedEvent: event,
            });
            return;
        }
    }
    __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_emitResponseEvent).call(this, event, extraInfo);
}, _NetworkManager_onResponseReceivedExtraInfo = function _NetworkManager_onResponseReceivedExtraInfo(event) {
    // We may have skipped a redirect response/request pair due to waiting for
    // this ExtraInfo event. If so, continue that work now that we have the
    // request.
    const redirectInfo = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").takeQueuedRedirectInfo(event.requestId);
    if (redirectInfo) {
        __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(event.requestId).push(event);
        __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_onRequest).call(this, redirectInfo.event, redirectInfo.fetchRequestId);
        return;
    }
    // We may have skipped response and loading events because we didn't have
    // this ExtraInfo event yet. If so, emit those events now.
    const queuedEvents = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").forgetQueuedEventGroup(event.requestId);
        __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_emitResponseEvent).call(this, queuedEvents.responseReceivedEvent, event);
        if (queuedEvents.loadingFinishedEvent) {
            __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFinished).call(this, queuedEvents.loadingFinishedEvent);
        }
        if (queuedEvents.loadingFailedEvent) {
            __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFailed).call(this, queuedEvents.loadingFailedEvent);
        }
        return;
    }
    // Wait until we get another event that can use this ExtraInfo event.
    __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").responseExtraInfo(event.requestId).push(event);
}, _NetworkManager_forgetRequest = function _NetworkManager_forgetRequest(request, events) {
    const requestId = request._requestId;
    const interceptionId = request._interceptionId;
    __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").forgetRequest(requestId);
    interceptionId !== undefined &&
        __classPrivateFieldGet$m(this, _NetworkManager_attemptedAuthentications, "f").delete(interceptionId);
    if (events) {
        __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").forget(requestId);
    }
}, _NetworkManager_onLoadingFinished = function _NetworkManager_onLoadingFinished(event) {
    // If the response event for this request is still waiting on a
    // corresponding ExtraInfo event, then wait to emit this event too.
    const queuedEvents = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        queuedEvents.loadingFinishedEvent = event;
    }
    else {
        __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFinished).call(this, event);
    }
}, _NetworkManager_emitLoadingFinished = function _NetworkManager_emitLoadingFinished(event) {
    var _a;
    const request = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request) {
        return;
    }
    // Under certain conditions we never get the Network.responseReceived
    // event from protocol. @see https://crbug.com/883475
    if (request.response()) {
        (_a = request.response()) === null || _a === void 0 ? void 0 : _a._resolveBody(null);
    }
    __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, true);
    this.emit(NetworkManagerEmittedEvents.RequestFinished, request);
}, _NetworkManager_onLoadingFailed = function _NetworkManager_onLoadingFailed(event) {
    // If the response event for this request is still waiting on a
    // corresponding ExtraInfo event, then wait to emit this event too.
    const queuedEvents = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getQueuedEventGroup(event.requestId);
    if (queuedEvents) {
        queuedEvents.loadingFailedEvent = event;
    }
    else {
        __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_emitLoadingFailed).call(this, event);
    }
}, _NetworkManager_emitLoadingFailed = function _NetworkManager_emitLoadingFailed(event) {
    const request = __classPrivateFieldGet$m(this, _NetworkManager_networkEventManager, "f").getRequest(event.requestId);
    // For certain requestIds we never receive requestWillBeSent event.
    // @see https://crbug.com/750469
    if (!request) {
        return;
    }
    request._failureText = event.errorText;
    const response = request.response();
    if (response) {
        response._resolveBody(null);
    }
    __classPrivateFieldGet$m(this, _NetworkManager_instances, "m", _NetworkManager_forgetRequest).call(this, request, true);
    this.emit(NetworkManagerEmittedEvents.RequestFailed, request);
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$l = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$l = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FrameManager_instances, _FrameManager_page, _FrameManager_networkManager, _FrameManager_timeoutSettings, _FrameManager_frames, _FrameManager_contextIdToContext, _FrameManager_isolatedWorlds, _FrameManager_mainFrame, _FrameManager_client, _FrameManager_framesPendingTargetInit, _FrameManager_framesPendingAttachment, _FrameManager_onLifecycleEvent, _FrameManager_onFrameStartedLoading, _FrameManager_onFrameStoppedLoading, _FrameManager_handleFrameTree, _FrameManager_onFrameAttached, _FrameManager_onFrameNavigated, _FrameManager_createIsolatedWorld, _FrameManager_onFrameNavigatedWithinDocument, _FrameManager_onFrameDetached, _FrameManager_onExecutionContextCreated, _FrameManager_onExecutionContextDestroyed, _FrameManager_onExecutionContextsCleared, _FrameManager_removeFramesRecursively;
const UTILITY_WORLD_NAME = '__puppeteer_utility_world__';
/**
 * We use symbols to prevent external parties listening to these events.
 * They are internal to Puppeteer.
 *
 * @internal
 */
const FrameManagerEmittedEvents = {
    FrameAttached: Symbol('FrameManager.FrameAttached'),
    FrameNavigated: Symbol('FrameManager.FrameNavigated'),
    FrameDetached: Symbol('FrameManager.FrameDetached'),
    FrameSwapped: Symbol('FrameManager.FrameSwapped'),
    LifecycleEvent: Symbol('FrameManager.LifecycleEvent'),
    FrameNavigatedWithinDocument: Symbol('FrameManager.FrameNavigatedWithinDocument')};
/**
 * A frame manager manages the frames for a given {@link Page | page}.
 *
 * @internal
 */
class FrameManager extends EventEmitter {
    constructor(client, page, ignoreHTTPSErrors, timeoutSettings) {
        super();
        _FrameManager_instances.add(this);
        _FrameManager_page.set(this, void 0);
        _FrameManager_networkManager.set(this, void 0);
        _FrameManager_timeoutSettings.set(this, void 0);
        _FrameManager_frames.set(this, new Map());
        _FrameManager_contextIdToContext.set(this, new Map());
        _FrameManager_isolatedWorlds.set(this, new Set());
        _FrameManager_mainFrame.set(this, void 0);
        _FrameManager_client.set(this, void 0);
        /**
         * Keeps track of OOPIF targets/frames (target ID == frame ID for OOPIFs)
         * that are being initialized.
         */
        _FrameManager_framesPendingTargetInit.set(this, new Map());
        /**
         * Keeps track of frames that are in the process of being attached in #onFrameAttached.
         */
        _FrameManager_framesPendingAttachment.set(this, new Map());
        __classPrivateFieldSet$l(this, _FrameManager_client, client, "f");
        __classPrivateFieldSet$l(this, _FrameManager_page, page, "f");
        __classPrivateFieldSet$l(this, _FrameManager_networkManager, new NetworkManager(client, ignoreHTTPSErrors, this), "f");
        __classPrivateFieldSet$l(this, _FrameManager_timeoutSettings, timeoutSettings, "f");
        this.setupEventListeners(__classPrivateFieldGet$l(this, _FrameManager_client, "f"));
    }
    get timeoutSettings() {
        return __classPrivateFieldGet$l(this, _FrameManager_timeoutSettings, "f");
    }
    get networkManager() {
        return __classPrivateFieldGet$l(this, _FrameManager_networkManager, "f");
    }
    get client() {
        return __classPrivateFieldGet$l(this, _FrameManager_client, "f");
    }
    setupEventListeners(session) {
        session.on('Page.frameAttached', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameAttached).call(this, session, event.frameId, event.parentFrameId);
        });
        session.on('Page.frameNavigated', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameNavigated).call(this, event.frame);
        });
        session.on('Page.navigatedWithinDocument', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameNavigatedWithinDocument).call(this, event.frameId, event.url);
        });
        session.on('Page.frameDetached', (event) => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameDetached).call(this, event.frameId, event.reason);
        });
        session.on('Page.frameStartedLoading', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameStartedLoading).call(this, event.frameId);
        });
        session.on('Page.frameStoppedLoading', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameStoppedLoading).call(this, event.frameId);
        });
        session.on('Runtime.executionContextCreated', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onExecutionContextCreated).call(this, event.context, session);
        });
        session.on('Runtime.executionContextDestroyed', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onExecutionContextDestroyed).call(this, event.executionContextId, session);
        });
        session.on('Runtime.executionContextsCleared', () => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onExecutionContextsCleared).call(this, session);
        });
        session.on('Page.lifecycleEvent', event => {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onLifecycleEvent).call(this, event);
        });
    }
    async initialize(targetId, client = __classPrivateFieldGet$l(this, _FrameManager_client, "f")) {
        var _a;
        try {
            if (!__classPrivateFieldGet$l(this, _FrameManager_framesPendingTargetInit, "f").has(targetId)) {
                __classPrivateFieldGet$l(this, _FrameManager_framesPendingTargetInit, "f").set(targetId, createDebuggableDeferredPromise(`Waiting for target frame ${targetId} failed`));
            }
            const result = await Promise.all([
                client.send('Page.enable'),
                client.send('Page.getFrameTree'),
            ]);
            const { frameTree } = result[1];
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_handleFrameTree).call(this, client, frameTree);
            await Promise.all([
                client.send('Page.setLifecycleEventsEnabled', { enabled: true }),
                client.send('Runtime.enable').then(() => {
                    return __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_createIsolatedWorld).call(this, client, UTILITY_WORLD_NAME);
                }),
                // TODO: Network manager is not aware of OOP iframes yet.
                client === __classPrivateFieldGet$l(this, _FrameManager_client, "f")
                    ? __classPrivateFieldGet$l(this, _FrameManager_networkManager, "f").initialize()
                    : Promise.resolve(),
            ]);
        }
        catch (error) {
            // The target might have been closed before the initialization finished.
            if (isErrorLike(error) &&
                (error.message.includes('Target closed') ||
                    error.message.includes('Session closed'))) {
                return;
            }
            throw error;
        }
        finally {
            (_a = __classPrivateFieldGet$l(this, _FrameManager_framesPendingTargetInit, "f").get(targetId)) === null || _a === void 0 ? void 0 : _a.resolve();
            __classPrivateFieldGet$l(this, _FrameManager_framesPendingTargetInit, "f").delete(targetId);
        }
    }
    executionContextById(contextId, session = __classPrivateFieldGet$l(this, _FrameManager_client, "f")) {
        const key = `${session.id()}:${contextId}`;
        const context = __classPrivateFieldGet$l(this, _FrameManager_contextIdToContext, "f").get(key);
        assert(context, 'INTERNAL ERROR: missing context with id = ' + contextId);
        return context;
    }
    page() {
        return __classPrivateFieldGet$l(this, _FrameManager_page, "f");
    }
    mainFrame() {
        assert(__classPrivateFieldGet$l(this, _FrameManager_mainFrame, "f"), 'Requesting main frame too early!');
        return __classPrivateFieldGet$l(this, _FrameManager_mainFrame, "f");
    }
    frames() {
        return Array.from(__classPrivateFieldGet$l(this, _FrameManager_frames, "f").values());
    }
    frame(frameId) {
        return __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId) || null;
    }
    onAttachedToTarget(target) {
        if (target._getTargetInfo().type !== 'iframe') {
            return;
        }
        const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(target._getTargetInfo().targetId);
        if (frame) {
            frame.updateClient(target._session());
        }
        this.setupEventListeners(target._session());
        this.initialize(target._getTargetInfo().targetId, target._session());
    }
    onDetachedFromTarget(target) {
        const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(target._targetId);
        if (frame && frame.isOOPFrame()) {
            // When an OOP iframe is removed from the page, it
            // will only get a Target.detachedFromTarget event.
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, frame);
        }
    }
}
_FrameManager_page = new WeakMap(), _FrameManager_networkManager = new WeakMap(), _FrameManager_timeoutSettings = new WeakMap(), _FrameManager_frames = new WeakMap(), _FrameManager_contextIdToContext = new WeakMap(), _FrameManager_isolatedWorlds = new WeakMap(), _FrameManager_mainFrame = new WeakMap(), _FrameManager_client = new WeakMap(), _FrameManager_framesPendingTargetInit = new WeakMap(), _FrameManager_framesPendingAttachment = new WeakMap(), _FrameManager_instances = new WeakSet(), _FrameManager_onLifecycleEvent = function _FrameManager_onLifecycleEvent(event) {
    const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(event.frameId);
    if (!frame) {
        return;
    }
    frame._onLifecycleEvent(event.loaderId, event.name);
    this.emit(FrameManagerEmittedEvents.LifecycleEvent, frame);
}, _FrameManager_onFrameStartedLoading = function _FrameManager_onFrameStartedLoading(frameId) {
    const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId);
    if (!frame) {
        return;
    }
    frame._onLoadingStarted();
}, _FrameManager_onFrameStoppedLoading = function _FrameManager_onFrameStoppedLoading(frameId) {
    const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId);
    if (!frame) {
        return;
    }
    frame._onLoadingStopped();
    this.emit(FrameManagerEmittedEvents.LifecycleEvent, frame);
}, _FrameManager_handleFrameTree = function _FrameManager_handleFrameTree(session, frameTree) {
    if (frameTree.frame.parentId) {
        __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameAttached).call(this, session, frameTree.frame.id, frameTree.frame.parentId);
    }
    __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_onFrameNavigated).call(this, frameTree.frame);
    if (!frameTree.childFrames) {
        return;
    }
    for (const child of frameTree.childFrames) {
        __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_handleFrameTree).call(this, session, child);
    }
}, _FrameManager_onFrameAttached = function _FrameManager_onFrameAttached(session, frameId, parentFrameId) {
    if (__classPrivateFieldGet$l(this, _FrameManager_frames, "f").has(frameId)) {
        const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId);
        if (session && frame.isOOPFrame()) {
            // If an OOP iframes becomes a normal iframe again
            // it is first attached to the parent page before
            // the target is removed.
            frame.updateClient(session);
        }
        return;
    }
    const parentFrame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(parentFrameId);
    const complete = (parentFrame) => {
        assert(parentFrame, `Parent frame ${parentFrameId} not found`);
        const frame = new Frame(this, parentFrame, frameId, session);
        __classPrivateFieldGet$l(this, _FrameManager_frames, "f").set(frame._id, frame);
        this.emit(FrameManagerEmittedEvents.FrameAttached, frame);
    };
    if (parentFrame) {
        return complete(parentFrame);
    }
    const frame = __classPrivateFieldGet$l(this, _FrameManager_framesPendingTargetInit, "f").get(parentFrameId);
    if (frame) {
        if (!__classPrivateFieldGet$l(this, _FrameManager_framesPendingAttachment, "f").has(frameId)) {
            __classPrivateFieldGet$l(this, _FrameManager_framesPendingAttachment, "f").set(frameId, createDebuggableDeferredPromise(`Waiting for frame ${frameId} to attach failed`));
        }
        frame.then(() => {
            var _a;
            complete(__classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(parentFrameId));
            (_a = __classPrivateFieldGet$l(this, _FrameManager_framesPendingAttachment, "f").get(frameId)) === null || _a === void 0 ? void 0 : _a.resolve();
            __classPrivateFieldGet$l(this, _FrameManager_framesPendingAttachment, "f").delete(frameId);
        });
        return;
    }
    throw new Error(`Parent frame ${parentFrameId} not found`);
}, _FrameManager_onFrameNavigated = function _FrameManager_onFrameNavigated(framePayload) {
    const frameId = framePayload.id;
    const isMainFrame = !framePayload.parentId;
    const frame = isMainFrame ? __classPrivateFieldGet$l(this, _FrameManager_mainFrame, "f") : __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId);
    const complete = (frame) => {
        assert(isMainFrame || frame, `Missing frame isMainFrame=${isMainFrame}, frameId=${frameId}`);
        // Detach all child frames first.
        if (frame) {
            for (const child of frame.childFrames()) {
                __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, child);
            }
        }
        // Update or create main frame.
        if (isMainFrame) {
            if (frame) {
                // Update frame id to retain frame identity on cross-process navigation.
                __classPrivateFieldGet$l(this, _FrameManager_frames, "f").delete(frame._id);
                frame._id = frameId;
            }
            else {
                // Initial main frame navigation.
                frame = new Frame(this, null, frameId, __classPrivateFieldGet$l(this, _FrameManager_client, "f"));
            }
            __classPrivateFieldGet$l(this, _FrameManager_frames, "f").set(frameId, frame);
            __classPrivateFieldSet$l(this, _FrameManager_mainFrame, frame, "f");
        }
        // Update frame payload.
        assert(frame);
        frame._navigated(framePayload);
        this.emit(FrameManagerEmittedEvents.FrameNavigated, frame);
    };
    const pendingFrame = __classPrivateFieldGet$l(this, _FrameManager_framesPendingAttachment, "f").get(frameId);
    if (pendingFrame) {
        pendingFrame.then(() => {
            complete(isMainFrame ? __classPrivateFieldGet$l(this, _FrameManager_mainFrame, "f") : __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId));
        });
    }
    else {
        complete(frame);
    }
}, _FrameManager_createIsolatedWorld = async function _FrameManager_createIsolatedWorld(session, name) {
    const key = `${session.id()}:${name}`;
    if (__classPrivateFieldGet$l(this, _FrameManager_isolatedWorlds, "f").has(key)) {
        return;
    }
    await session.send('Page.addScriptToEvaluateOnNewDocument', {
        source: `//# sourceURL=${EVALUATION_SCRIPT_URL}`,
        worldName: name,
    });
    await Promise.all(this.frames()
        .filter(frame => {
        return frame._client() === session;
    })
        .map(frame => {
        // Frames might be removed before we send this, so we don't want to
        // throw an error.
        return session
            .send('Page.createIsolatedWorld', {
            frameId: frame._id,
            worldName: name,
            grantUniveralAccess: true,
        })
            .catch(debugError);
    }));
    __classPrivateFieldGet$l(this, _FrameManager_isolatedWorlds, "f").add(key);
}, _FrameManager_onFrameNavigatedWithinDocument = function _FrameManager_onFrameNavigatedWithinDocument(frameId, url) {
    const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId);
    if (!frame) {
        return;
    }
    frame._navigatedWithinDocument(url);
    this.emit(FrameManagerEmittedEvents.FrameNavigatedWithinDocument, frame);
    this.emit(FrameManagerEmittedEvents.FrameNavigated, frame);
}, _FrameManager_onFrameDetached = function _FrameManager_onFrameDetached(frameId, reason) {
    const frame = __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId);
    if (reason === 'remove') {
        // Only remove the frame if the reason for the detached event is
        // an actual removement of the frame.
        // For frames that become OOP iframes, the reason would be 'swap'.
        if (frame) {
            __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, frame);
        }
    }
    else if (reason === 'swap') {
        this.emit(FrameManagerEmittedEvents.FrameSwapped, frame);
    }
}, _FrameManager_onExecutionContextCreated = function _FrameManager_onExecutionContextCreated(contextPayload, session) {
    const auxData = contextPayload.auxData;
    const frameId = auxData && auxData.frameId;
    const frame = typeof frameId === 'string' ? __classPrivateFieldGet$l(this, _FrameManager_frames, "f").get(frameId) : undefined;
    let world;
    if (frame) {
        // Only care about execution contexts created for the current session.
        if (frame._client() !== session) {
            return;
        }
        if (contextPayload.auxData && !!contextPayload.auxData['isDefault']) {
            world = frame.worlds[MAIN_WORLD];
        }
        else if (contextPayload.name === UTILITY_WORLD_NAME &&
            !frame.worlds[PUPPETEER_WORLD].hasContext()) {
            // In case of multiple sessions to the same target, there's a race between
            // connections so we might end up creating multiple isolated worlds.
            // We can use either.
            world = frame.worlds[PUPPETEER_WORLD];
        }
    }
    const context = new ExecutionContext((frame === null || frame === void 0 ? void 0 : frame._client()) || __classPrivateFieldGet$l(this, _FrameManager_client, "f"), contextPayload, world);
    if (world) {
        world.setContext(context);
    }
    const key = `${session.id()}:${contextPayload.id}`;
    __classPrivateFieldGet$l(this, _FrameManager_contextIdToContext, "f").set(key, context);
}, _FrameManager_onExecutionContextDestroyed = function _FrameManager_onExecutionContextDestroyed(executionContextId, session) {
    const key = `${session.id()}:${executionContextId}`;
    const context = __classPrivateFieldGet$l(this, _FrameManager_contextIdToContext, "f").get(key);
    if (!context) {
        return;
    }
    __classPrivateFieldGet$l(this, _FrameManager_contextIdToContext, "f").delete(key);
    if (context._world) {
        context._world.clearContext();
    }
}, _FrameManager_onExecutionContextsCleared = function _FrameManager_onExecutionContextsCleared(session) {
    for (const [key, context] of __classPrivateFieldGet$l(this, _FrameManager_contextIdToContext, "f").entries()) {
        // Make sure to only clear execution contexts that belong
        // to the current session.
        if (context._client !== session) {
            continue;
        }
        if (context._world) {
            context._world.clearContext();
        }
        __classPrivateFieldGet$l(this, _FrameManager_contextIdToContext, "f").delete(key);
    }
}, _FrameManager_removeFramesRecursively = function _FrameManager_removeFramesRecursively(frame) {
    for (const child of frame.childFrames()) {
        __classPrivateFieldGet$l(this, _FrameManager_instances, "m", _FrameManager_removeFramesRecursively).call(this, child);
    }
    frame._detach();
    __classPrivateFieldGet$l(this, _FrameManager_frames, "f").delete(frame._id);
    this.emit(FrameManagerEmittedEvents.FrameDetached, frame);
};

var __classPrivateFieldSet$k = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$k = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Connection_instances, _Connection_url, _Connection_transport, _Connection_delay, _Connection_lastId, _Connection_sessions, _Connection_closed, _Connection_callbacks, _Connection_manuallyAttached, _Connection_onClose, _CDPSession_sessionId, _CDPSession_targetType, _CDPSession_callbacks, _CDPSession_connection;
const debugProtocolSend = debug('puppeteer:protocol:SEND ►');
const debugProtocolReceive = debug('puppeteer:protocol:RECV ◀');
/**
 * Internal events that the Connection class emits.
 *
 * @internal
 */
const ConnectionEmittedEvents = {
    Disconnected: Symbol('Connection.Disconnected'),
};
/**
 * @public
 */
class Connection extends EventEmitter {
    constructor(url, transport, delay = 0) {
        super();
        _Connection_instances.add(this);
        _Connection_url.set(this, void 0);
        _Connection_transport.set(this, void 0);
        _Connection_delay.set(this, void 0);
        _Connection_lastId.set(this, 0);
        _Connection_sessions.set(this, new Map());
        _Connection_closed.set(this, false);
        _Connection_callbacks.set(this, new Map());
        _Connection_manuallyAttached.set(this, new Set());
        __classPrivateFieldSet$k(this, _Connection_url, url, "f");
        __classPrivateFieldSet$k(this, _Connection_delay, delay, "f");
        __classPrivateFieldSet$k(this, _Connection_transport, transport, "f");
        __classPrivateFieldGet$k(this, _Connection_transport, "f").onmessage = this.onMessage.bind(this);
        __classPrivateFieldGet$k(this, _Connection_transport, "f").onclose = __classPrivateFieldGet$k(this, _Connection_instances, "m", _Connection_onClose).bind(this);
    }
    static fromSession(session) {
        return session.connection();
    }
    /**
     * @internal
     */
    get _closed() {
        return __classPrivateFieldGet$k(this, _Connection_closed, "f");
    }
    /**
     * @internal
     */
    get _sessions() {
        return __classPrivateFieldGet$k(this, _Connection_sessions, "f");
    }
    /**
     * @param sessionId - The session id
     * @returns The current CDP session if it exists
     */
    session(sessionId) {
        return __classPrivateFieldGet$k(this, _Connection_sessions, "f").get(sessionId) || null;
    }
    url() {
        return __classPrivateFieldGet$k(this, _Connection_url, "f");
    }
    send(method, ...paramArgs) {
        // There is only ever 1 param arg passed, but the Protocol defines it as an
        // array of 0 or 1 items See this comment:
        // https://github.com/ChromeDevTools/devtools-protocol/pull/113#issuecomment-412603285
        // which explains why the protocol defines the params this way for better
        // type-inference.
        // So now we check if there are any params or not and deal with them accordingly.
        const params = paramArgs.length ? paramArgs[0] : undefined;
        const id = this._rawSend({ method, params });
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet$k(this, _Connection_callbacks, "f").set(id, {
                resolve,
                reject,
                error: new ProtocolError(),
                method,
            });
        });
    }
    /**
     * @internal
     */
    _rawSend(message) {
        var _a;
        const id = __classPrivateFieldSet$k(this, _Connection_lastId, (_a = __classPrivateFieldGet$k(this, _Connection_lastId, "f"), ++_a), "f");
        const stringifiedMessage = JSON.stringify(Object.assign({}, message, { id }));
        debugProtocolSend(stringifiedMessage);
        __classPrivateFieldGet$k(this, _Connection_transport, "f").send(stringifiedMessage);
        return id;
    }
    /**
     * @internal
     */
    async onMessage(message) {
        if (__classPrivateFieldGet$k(this, _Connection_delay, "f")) {
            await new Promise(f => {
                return setTimeout(f, __classPrivateFieldGet$k(this, _Connection_delay, "f"));
            });
        }
        debugProtocolReceive(message);
        const object = JSON.parse(message);
        if (object.method === 'Target.attachedToTarget') {
            const sessionId = object.params.sessionId;
            const session = new CDPSession(this, object.params.targetInfo.type, sessionId);
            __classPrivateFieldGet$k(this, _Connection_sessions, "f").set(sessionId, session);
            this.emit('sessionattached', session);
            const parentSession = __classPrivateFieldGet$k(this, _Connection_sessions, "f").get(object.sessionId);
            if (parentSession) {
                parentSession.emit('sessionattached', session);
            }
        }
        else if (object.method === 'Target.detachedFromTarget') {
            const session = __classPrivateFieldGet$k(this, _Connection_sessions, "f").get(object.params.sessionId);
            if (session) {
                session._onClosed();
                __classPrivateFieldGet$k(this, _Connection_sessions, "f").delete(object.params.sessionId);
                this.emit('sessiondetached', session);
                const parentSession = __classPrivateFieldGet$k(this, _Connection_sessions, "f").get(object.sessionId);
                if (parentSession) {
                    parentSession.emit('sessiondetached', session);
                }
            }
        }
        if (object.sessionId) {
            const session = __classPrivateFieldGet$k(this, _Connection_sessions, "f").get(object.sessionId);
            if (session) {
                session._onMessage(object);
            }
        }
        else if (object.id) {
            const callback = __classPrivateFieldGet$k(this, _Connection_callbacks, "f").get(object.id);
            // Callbacks could be all rejected if someone has called `.dispose()`.
            if (callback) {
                __classPrivateFieldGet$k(this, _Connection_callbacks, "f").delete(object.id);
                if (object.error) {
                    callback.reject(createProtocolError(callback.error, callback.method, object));
                }
                else {
                    callback.resolve(object.result);
                }
            }
        }
        else {
            this.emit(object.method, object.params);
        }
    }
    dispose() {
        __classPrivateFieldGet$k(this, _Connection_instances, "m", _Connection_onClose).call(this);
        __classPrivateFieldGet$k(this, _Connection_transport, "f").close();
    }
    /**
     * @internal
     */
    isAutoAttached(targetId) {
        return !__classPrivateFieldGet$k(this, _Connection_manuallyAttached, "f").has(targetId);
    }
    /**
     * @internal
     */
    async _createSession(targetInfo, isAutoAttachEmulated = true) {
        if (!isAutoAttachEmulated) {
            __classPrivateFieldGet$k(this, _Connection_manuallyAttached, "f").add(targetInfo.targetId);
        }
        const { sessionId } = await this.send('Target.attachToTarget', {
            targetId: targetInfo.targetId,
            flatten: true,
        });
        __classPrivateFieldGet$k(this, _Connection_manuallyAttached, "f").delete(targetInfo.targetId);
        const session = __classPrivateFieldGet$k(this, _Connection_sessions, "f").get(sessionId);
        if (!session) {
            throw new Error('CDPSession creation failed.');
        }
        return session;
    }
    /**
     * @param targetInfo - The target info
     * @returns The CDP session that is created
     */
    async createSession(targetInfo) {
        return await this._createSession(targetInfo, false);
    }
}
_Connection_url = new WeakMap(), _Connection_transport = new WeakMap(), _Connection_delay = new WeakMap(), _Connection_lastId = new WeakMap(), _Connection_sessions = new WeakMap(), _Connection_closed = new WeakMap(), _Connection_callbacks = new WeakMap(), _Connection_manuallyAttached = new WeakMap(), _Connection_instances = new WeakSet(), _Connection_onClose = function _Connection_onClose() {
    if (__classPrivateFieldGet$k(this, _Connection_closed, "f")) {
        return;
    }
    __classPrivateFieldSet$k(this, _Connection_closed, true, "f");
    __classPrivateFieldGet$k(this, _Connection_transport, "f").onmessage = undefined;
    __classPrivateFieldGet$k(this, _Connection_transport, "f").onclose = undefined;
    for (const callback of __classPrivateFieldGet$k(this, _Connection_callbacks, "f").values()) {
        callback.reject(rewriteError(callback.error, `Protocol error (${callback.method}): Target closed.`));
    }
    __classPrivateFieldGet$k(this, _Connection_callbacks, "f").clear();
    for (const session of __classPrivateFieldGet$k(this, _Connection_sessions, "f").values()) {
        session._onClosed();
    }
    __classPrivateFieldGet$k(this, _Connection_sessions, "f").clear();
    this.emit(ConnectionEmittedEvents.Disconnected);
};
/**
 * Internal events that the CDPSession class emits.
 *
 * @internal
 */
const CDPSessionEmittedEvents = {
    Disconnected: Symbol('CDPSession.Disconnected'),
};
/**
 * The `CDPSession` instances are used to talk raw Chrome Devtools Protocol.
 *
 * @remarks
 *
 * Protocol methods can be called with {@link CDPSession.send} method and protocol
 * events can be subscribed to with `CDPSession.on` method.
 *
 * Useful links: {@link https://chromedevtools.github.io/devtools-protocol/ | DevTools Protocol Viewer}
 * and {@link https://github.com/aslushnikov/getting-started-with-cdp/blob/HEAD/README.md | Getting Started with DevTools Protocol}.
 *
 * @example
 *
 * ```ts
 * const client = await page.target().createCDPSession();
 * await client.send('Animation.enable');
 * client.on('Animation.animationCreated', () =>
 *   console.log('Animation created!')
 * );
 * const response = await client.send('Animation.getPlaybackRate');
 * console.log('playback rate is ' + response.playbackRate);
 * await client.send('Animation.setPlaybackRate', {
 *   playbackRate: response.playbackRate / 2,
 * });
 * ```
 *
 * @public
 */
class CDPSession extends EventEmitter {
    /**
     * @internal
     */
    constructor(connection, targetType, sessionId) {
        super();
        _CDPSession_sessionId.set(this, void 0);
        _CDPSession_targetType.set(this, void 0);
        _CDPSession_callbacks.set(this, new Map());
        _CDPSession_connection.set(this, void 0);
        __classPrivateFieldSet$k(this, _CDPSession_connection, connection, "f");
        __classPrivateFieldSet$k(this, _CDPSession_targetType, targetType, "f");
        __classPrivateFieldSet$k(this, _CDPSession_sessionId, sessionId, "f");
    }
    connection() {
        return __classPrivateFieldGet$k(this, _CDPSession_connection, "f");
    }
    send(method, ...paramArgs) {
        if (!__classPrivateFieldGet$k(this, _CDPSession_connection, "f")) {
            return Promise.reject(new Error(`Protocol error (${method}): Session closed. Most likely the ${__classPrivateFieldGet$k(this, _CDPSession_targetType, "f")} has been closed.`));
        }
        // See the comment in Connection#send explaining why we do this.
        const params = paramArgs.length ? paramArgs[0] : undefined;
        const id = __classPrivateFieldGet$k(this, _CDPSession_connection, "f")._rawSend({
            sessionId: __classPrivateFieldGet$k(this, _CDPSession_sessionId, "f"),
            method,
            params,
        });
        return new Promise((resolve, reject) => {
            __classPrivateFieldGet$k(this, _CDPSession_callbacks, "f").set(id, {
                resolve,
                reject,
                error: new ProtocolError(),
                method,
            });
        });
    }
    /**
     * @internal
     */
    _onMessage(object) {
        const callback = object.id ? __classPrivateFieldGet$k(this, _CDPSession_callbacks, "f").get(object.id) : undefined;
        if (object.id && callback) {
            __classPrivateFieldGet$k(this, _CDPSession_callbacks, "f").delete(object.id);
            if (object.error) {
                callback.reject(createProtocolError(callback.error, callback.method, object));
            }
            else {
                callback.resolve(object.result);
            }
        }
        else {
            assert(!object.id);
            this.emit(object.method, object.params);
        }
    }
    /**
     * Detaches the cdpSession from the target. Once detached, the cdpSession object
     * won't emit any events and can't be used to send messages.
     */
    async detach() {
        if (!__classPrivateFieldGet$k(this, _CDPSession_connection, "f")) {
            throw new Error(`Session already detached. Most likely the ${__classPrivateFieldGet$k(this, _CDPSession_targetType, "f")} has been closed.`);
        }
        await __classPrivateFieldGet$k(this, _CDPSession_connection, "f").send('Target.detachFromTarget', {
            sessionId: __classPrivateFieldGet$k(this, _CDPSession_sessionId, "f"),
        });
    }
    /**
     * @internal
     */
    _onClosed() {
        for (const callback of __classPrivateFieldGet$k(this, _CDPSession_callbacks, "f").values()) {
            callback.reject(rewriteError(callback.error, `Protocol error (${callback.method}): Target closed.`));
        }
        __classPrivateFieldGet$k(this, _CDPSession_callbacks, "f").clear();
        __classPrivateFieldSet$k(this, _CDPSession_connection, undefined, "f");
        this.emit(CDPSessionEmittedEvents.Disconnected);
    }
    /**
     * Returns the session's id.
     */
    id() {
        return __classPrivateFieldGet$k(this, _CDPSession_sessionId, "f");
    }
}
_CDPSession_sessionId = new WeakMap(), _CDPSession_targetType = new WeakMap(), _CDPSession_callbacks = new WeakMap(), _CDPSession_connection = new WeakMap();
function createProtocolError(error, method, object) {
    let message = `Protocol error (${method}): ${object.error.message}`;
    if ('data' in object.error) {
        message += ` ${object.error.data}`;
    }
    return rewriteError(error, message, object.error.message);
}
function rewriteError(error, message, originalMessage) {
    error.message = message;
    error.originalMessage = originalMessage !== null && originalMessage !== void 0 ? originalMessage : error.originalMessage;
    return error;
}

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$j = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$j = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _LifecycleWatcher_instances, _LifecycleWatcher_expectedLifecycle, _LifecycleWatcher_frameManager, _LifecycleWatcher_frame, _LifecycleWatcher_timeout, _LifecycleWatcher_navigationRequest, _LifecycleWatcher_eventListeners, _LifecycleWatcher_initialLoaderId, _LifecycleWatcher_sameDocumentNavigationCompleteCallback, _LifecycleWatcher_sameDocumentNavigationPromise, _LifecycleWatcher_lifecycleCallback, _LifecycleWatcher_lifecyclePromise, _LifecycleWatcher_newDocumentNavigationCompleteCallback, _LifecycleWatcher_newDocumentNavigationPromise, _LifecycleWatcher_terminationCallback, _LifecycleWatcher_terminationPromise, _LifecycleWatcher_timeoutPromise, _LifecycleWatcher_maximumTimer, _LifecycleWatcher_hasSameDocumentNavigation, _LifecycleWatcher_swapped, _LifecycleWatcher_navigationResponseReceived, _LifecycleWatcher_onRequest, _LifecycleWatcher_onResponse, _LifecycleWatcher_onFrameDetached, _LifecycleWatcher_terminate, _LifecycleWatcher_createTimeoutPromise, _LifecycleWatcher_navigatedWithinDocument, _LifecycleWatcher_navigated, _LifecycleWatcher_frameSwapped, _LifecycleWatcher_checkLifecycleComplete;
const puppeteerToProtocolLifecycle = new Map([
    ['load', 'load'],
    ['domcontentloaded', 'DOMContentLoaded'],
    ['networkidle0', 'networkIdle'],
    ['networkidle2', 'networkAlmostIdle'],
]);
const noop$1 = () => { };
/**
 * @internal
 */
class LifecycleWatcher {
    constructor(frameManager, frame, waitUntil, timeout) {
        _LifecycleWatcher_instances.add(this);
        _LifecycleWatcher_expectedLifecycle.set(this, void 0);
        _LifecycleWatcher_frameManager.set(this, void 0);
        _LifecycleWatcher_frame.set(this, void 0);
        _LifecycleWatcher_timeout.set(this, void 0);
        _LifecycleWatcher_navigationRequest.set(this, null);
        _LifecycleWatcher_eventListeners.set(this, void 0);
        _LifecycleWatcher_initialLoaderId.set(this, void 0);
        _LifecycleWatcher_sameDocumentNavigationCompleteCallback.set(this, noop$1);
        _LifecycleWatcher_sameDocumentNavigationPromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$j(this, _LifecycleWatcher_sameDocumentNavigationCompleteCallback, fulfill, "f");
        }));
        _LifecycleWatcher_lifecycleCallback.set(this, noop$1);
        _LifecycleWatcher_lifecyclePromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$j(this, _LifecycleWatcher_lifecycleCallback, fulfill, "f");
        }));
        _LifecycleWatcher_newDocumentNavigationCompleteCallback.set(this, noop$1);
        _LifecycleWatcher_newDocumentNavigationPromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$j(this, _LifecycleWatcher_newDocumentNavigationCompleteCallback, fulfill, "f");
        }));
        _LifecycleWatcher_terminationCallback.set(this, noop$1);
        _LifecycleWatcher_terminationPromise.set(this, new Promise(fulfill => {
            __classPrivateFieldSet$j(this, _LifecycleWatcher_terminationCallback, fulfill, "f");
        }));
        _LifecycleWatcher_timeoutPromise.set(this, void 0);
        _LifecycleWatcher_maximumTimer.set(this, void 0);
        _LifecycleWatcher_hasSameDocumentNavigation.set(this, void 0);
        _LifecycleWatcher_swapped.set(this, void 0);
        _LifecycleWatcher_navigationResponseReceived.set(this, void 0);
        if (Array.isArray(waitUntil)) {
            waitUntil = waitUntil.slice();
        }
        else if (typeof waitUntil === 'string') {
            waitUntil = [waitUntil];
        }
        __classPrivateFieldSet$j(this, _LifecycleWatcher_initialLoaderId, frame._loaderId, "f");
        __classPrivateFieldSet$j(this, _LifecycleWatcher_expectedLifecycle, waitUntil.map(value => {
            const protocolEvent = puppeteerToProtocolLifecycle.get(value);
            assert(protocolEvent, 'Unknown value for options.waitUntil: ' + value);
            return protocolEvent;
        }), "f");
        __classPrivateFieldSet$j(this, _LifecycleWatcher_frameManager, frameManager, "f");
        __classPrivateFieldSet$j(this, _LifecycleWatcher_frame, frame, "f");
        __classPrivateFieldSet$j(this, _LifecycleWatcher_timeout, timeout, "f");
        __classPrivateFieldSet$j(this, _LifecycleWatcher_eventListeners, [
            addEventListener(frameManager.client, CDPSessionEmittedEvents.Disconnected, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_terminate).bind(this, new Error('Navigation failed because browser has disconnected!'))),
            addEventListener(__classPrivateFieldGet$j(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.LifecycleEvent, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).bind(this)),
            addEventListener(__classPrivateFieldGet$j(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameNavigatedWithinDocument, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_navigatedWithinDocument).bind(this)),
            addEventListener(__classPrivateFieldGet$j(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameNavigated, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_navigated).bind(this)),
            addEventListener(__classPrivateFieldGet$j(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameSwapped, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_frameSwapped).bind(this)),
            addEventListener(__classPrivateFieldGet$j(this, _LifecycleWatcher_frameManager, "f"), FrameManagerEmittedEvents.FrameDetached, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onFrameDetached).bind(this)),
            addEventListener(__classPrivateFieldGet$j(this, _LifecycleWatcher_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Request, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onRequest).bind(this)),
            addEventListener(__classPrivateFieldGet$j(this, _LifecycleWatcher_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Response, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_onResponse).bind(this)),
        ], "f");
        __classPrivateFieldSet$j(this, _LifecycleWatcher_timeoutPromise, __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_createTimeoutPromise).call(this), "f");
        __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
    }
    async navigationResponse() {
        var _a;
        // Continue with a possibly null response.
        await ((_a = __classPrivateFieldGet$j(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _a === void 0 ? void 0 : _a.catch(() => { }));
        return __classPrivateFieldGet$j(this, _LifecycleWatcher_navigationRequest, "f") ? __classPrivateFieldGet$j(this, _LifecycleWatcher_navigationRequest, "f").response() : null;
    }
    sameDocumentNavigationPromise() {
        return __classPrivateFieldGet$j(this, _LifecycleWatcher_sameDocumentNavigationPromise, "f");
    }
    newDocumentNavigationPromise() {
        return __classPrivateFieldGet$j(this, _LifecycleWatcher_newDocumentNavigationPromise, "f");
    }
    lifecyclePromise() {
        return __classPrivateFieldGet$j(this, _LifecycleWatcher_lifecyclePromise, "f");
    }
    timeoutOrTerminationPromise() {
        return Promise.race([__classPrivateFieldGet$j(this, _LifecycleWatcher_timeoutPromise, "f"), __classPrivateFieldGet$j(this, _LifecycleWatcher_terminationPromise, "f")]);
    }
    dispose() {
        removeEventListeners(__classPrivateFieldGet$j(this, _LifecycleWatcher_eventListeners, "f"));
        __classPrivateFieldGet$j(this, _LifecycleWatcher_maximumTimer, "f") !== undefined && clearTimeout(__classPrivateFieldGet$j(this, _LifecycleWatcher_maximumTimer, "f"));
    }
}
_LifecycleWatcher_expectedLifecycle = new WeakMap(), _LifecycleWatcher_frameManager = new WeakMap(), _LifecycleWatcher_frame = new WeakMap(), _LifecycleWatcher_timeout = new WeakMap(), _LifecycleWatcher_navigationRequest = new WeakMap(), _LifecycleWatcher_eventListeners = new WeakMap(), _LifecycleWatcher_initialLoaderId = new WeakMap(), _LifecycleWatcher_sameDocumentNavigationCompleteCallback = new WeakMap(), _LifecycleWatcher_sameDocumentNavigationPromise = new WeakMap(), _LifecycleWatcher_lifecycleCallback = new WeakMap(), _LifecycleWatcher_lifecyclePromise = new WeakMap(), _LifecycleWatcher_newDocumentNavigationCompleteCallback = new WeakMap(), _LifecycleWatcher_newDocumentNavigationPromise = new WeakMap(), _LifecycleWatcher_terminationCallback = new WeakMap(), _LifecycleWatcher_terminationPromise = new WeakMap(), _LifecycleWatcher_timeoutPromise = new WeakMap(), _LifecycleWatcher_maximumTimer = new WeakMap(), _LifecycleWatcher_hasSameDocumentNavigation = new WeakMap(), _LifecycleWatcher_swapped = new WeakMap(), _LifecycleWatcher_navigationResponseReceived = new WeakMap(), _LifecycleWatcher_instances = new WeakSet(), _LifecycleWatcher_onRequest = function _LifecycleWatcher_onRequest(request) {
    var _a, _b;
    if (request.frame() !== __classPrivateFieldGet$j(this, _LifecycleWatcher_frame, "f") || !request.isNavigationRequest()) {
        return;
    }
    __classPrivateFieldSet$j(this, _LifecycleWatcher_navigationRequest, request, "f");
    // Resolve previous navigation response in case there are multiple
    // navigation requests reported by the backend. This generally should not
    // happen by it looks like it's possible.
    (_a = __classPrivateFieldGet$j(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _a === void 0 ? void 0 : _a.resolve();
    __classPrivateFieldSet$j(this, _LifecycleWatcher_navigationResponseReceived, createDeferredPromise(), "f");
    if (request.response() !== null) {
        (_b = __classPrivateFieldGet$j(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _b === void 0 ? void 0 : _b.resolve();
    }
}, _LifecycleWatcher_onResponse = function _LifecycleWatcher_onResponse(response) {
    var _a, _b;
    if (((_a = __classPrivateFieldGet$j(this, _LifecycleWatcher_navigationRequest, "f")) === null || _a === void 0 ? void 0 : _a._requestId) !== response.request()._requestId) {
        return;
    }
    (_b = __classPrivateFieldGet$j(this, _LifecycleWatcher_navigationResponseReceived, "f")) === null || _b === void 0 ? void 0 : _b.resolve();
}, _LifecycleWatcher_onFrameDetached = function _LifecycleWatcher_onFrameDetached(frame) {
    if (__classPrivateFieldGet$j(this, _LifecycleWatcher_frame, "f") === frame) {
        __classPrivateFieldGet$j(this, _LifecycleWatcher_terminationCallback, "f").call(null, new Error('Navigating frame was detached'));
        return;
    }
    __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_terminate = function _LifecycleWatcher_terminate(error) {
    __classPrivateFieldGet$j(this, _LifecycleWatcher_terminationCallback, "f").call(null, error);
}, _LifecycleWatcher_createTimeoutPromise = async function _LifecycleWatcher_createTimeoutPromise() {
    if (!__classPrivateFieldGet$j(this, _LifecycleWatcher_timeout, "f")) {
        return new Promise(noop$1);
    }
    const errorMessage = 'Navigation timeout of ' + __classPrivateFieldGet$j(this, _LifecycleWatcher_timeout, "f") + ' ms exceeded';
    await new Promise(fulfill => {
        return (__classPrivateFieldSet$j(this, _LifecycleWatcher_maximumTimer, setTimeout(fulfill, __classPrivateFieldGet$j(this, _LifecycleWatcher_timeout, "f")), "f"));
    });
    return new TimeoutError(errorMessage);
}, _LifecycleWatcher_navigatedWithinDocument = function _LifecycleWatcher_navigatedWithinDocument(frame) {
    if (frame !== __classPrivateFieldGet$j(this, _LifecycleWatcher_frame, "f")) {
        return;
    }
    __classPrivateFieldSet$j(this, _LifecycleWatcher_hasSameDocumentNavigation, true, "f");
    __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_navigated = function _LifecycleWatcher_navigated(frame) {
    if (frame !== __classPrivateFieldGet$j(this, _LifecycleWatcher_frame, "f")) {
        return;
    }
    __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_frameSwapped = function _LifecycleWatcher_frameSwapped(frame) {
    if (frame !== __classPrivateFieldGet$j(this, _LifecycleWatcher_frame, "f")) {
        return;
    }
    __classPrivateFieldSet$j(this, _LifecycleWatcher_swapped, true, "f");
    __classPrivateFieldGet$j(this, _LifecycleWatcher_instances, "m", _LifecycleWatcher_checkLifecycleComplete).call(this);
}, _LifecycleWatcher_checkLifecycleComplete = function _LifecycleWatcher_checkLifecycleComplete() {
    // We expect navigation to commit.
    if (!checkLifecycle(__classPrivateFieldGet$j(this, _LifecycleWatcher_frame, "f"), __classPrivateFieldGet$j(this, _LifecycleWatcher_expectedLifecycle, "f"))) {
        return;
    }
    __classPrivateFieldGet$j(this, _LifecycleWatcher_lifecycleCallback, "f").call(this);
    if (__classPrivateFieldGet$j(this, _LifecycleWatcher_hasSameDocumentNavigation, "f")) {
        __classPrivateFieldGet$j(this, _LifecycleWatcher_sameDocumentNavigationCompleteCallback, "f").call(this);
    }
    if (__classPrivateFieldGet$j(this, _LifecycleWatcher_swapped, "f") || __classPrivateFieldGet$j(this, _LifecycleWatcher_frame, "f")._loaderId !== __classPrivateFieldGet$j(this, _LifecycleWatcher_initialLoaderId, "f")) {
        __classPrivateFieldGet$j(this, _LifecycleWatcher_newDocumentNavigationCompleteCallback, "f").call(this);
    }
    function checkLifecycle(frame, expectedLifecycle) {
        for (const event of expectedLifecycle) {
            if (!frame._lifecycleEvents.has(event)) {
                return false;
            }
        }
        for (const child of frame.childFrames()) {
            if (child._hasStartedLoading &&
                !checkLifecycle(child, expectedLifecycle)) {
                return false;
            }
        }
        return true;
    }
};

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$i = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$i = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _IsolatedWorld_instances, _a, _IsolatedWorld_frame, _IsolatedWorld_document, _IsolatedWorld_contextPromise, _IsolatedWorld_detached, _IsolatedWorld_ctxBindings, _IsolatedWorld_boundFunctions, _IsolatedWorld_waitTasks, _IsolatedWorld_bindingIdentifier, _IsolatedWorld_client_get, _IsolatedWorld_frameManager_get, _IsolatedWorld_timeoutSettings_get, _IsolatedWorld_settingUpBinding, _IsolatedWorld_onBindingCalled, _WaitTask_instances, _WaitTask_isolatedWorld, _WaitTask_polling, _WaitTask_timeout, _WaitTask_predicateBody, _WaitTask_predicateAcceptsContextElement, _WaitTask_args, _WaitTask_binding, _WaitTask_runCount, _WaitTask_resolve, _WaitTask_reject, _WaitTask_timeoutTimer, _WaitTask_terminated, _WaitTask_root, _WaitTask_cleanup;
/**
 * A unique key for {@link IsolatedWorldChart} to denote the default world.
 * Execution contexts are automatically created in the default world.
 *
 * @internal
 */
const MAIN_WORLD = Symbol('mainWorld');
/**
 * A unique key for {@link IsolatedWorldChart} to denote the puppeteer world.
 * This world contains all puppeteer-internal bindings/code.
 *
 * @internal
 */
const PUPPETEER_WORLD = Symbol('puppeteerWorld');
/**
 * @internal
 */
class IsolatedWorld {
    constructor(frame) {
        _IsolatedWorld_instances.add(this);
        _IsolatedWorld_frame.set(this, void 0);
        _IsolatedWorld_document.set(this, void 0);
        _IsolatedWorld_contextPromise.set(this, createDeferredPromise());
        _IsolatedWorld_detached.set(this, false);
        // Set of bindings that have been registered in the current context.
        _IsolatedWorld_ctxBindings.set(this, new Set());
        // Contains mapping from functions that should be bound to Puppeteer functions.
        _IsolatedWorld_boundFunctions.set(this, new Map());
        _IsolatedWorld_waitTasks.set(this, new Set());
        // If multiple waitFor are set up asynchronously, we need to wait for the
        // first one to set up the binding in the page before running the others.
        _IsolatedWorld_settingUpBinding.set(this, null);
        _IsolatedWorld_onBindingCalled.set(this, async (event) => {
            let payload;
            if (!this.hasContext()) {
                return;
            }
            const context = await this.executionContext();
            try {
                payload = JSON.parse(event.payload);
            }
            catch {
                // The binding was either called by something in the page or it was
                // called before our wrapper was initialized.
                return;
            }
            const { type, name, seq, args } = payload;
            if (type !== 'internal' ||
                !__classPrivateFieldGet$i(this, _IsolatedWorld_ctxBindings, "f").has(__classPrivateFieldGet$i(IsolatedWorld, _a, "f", _IsolatedWorld_bindingIdentifier).call(IsolatedWorld, name, context._contextId))) {
                return;
            }
            if (context._contextId !== event.executionContextId) {
                return;
            }
            try {
                const fn = this._boundFunctions.get(name);
                if (!fn) {
                    throw new Error(`Bound function $name is not found`);
                }
                const result = await fn(...args);
                await context.evaluate(deliverResult, name, seq, result);
            }
            catch (error) {
                // The WaitTask may already have been resolved by timing out, or the
                // exection context may have been destroyed.
                // In both caes, the promises above are rejected with a protocol error.
                // We can safely ignores these, as the WaitTask is re-installed in
                // the next execution context if needed.
                if (error.message.includes('Protocol error')) {
                    return;
                }
                debugError(error);
            }
            function deliverResult(name, seq, result) {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore Code is evaluated in a different context.
                globalThis[name].callbacks.get(seq).resolve(result);
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore Code is evaluated in a different context.
                globalThis[name].callbacks.delete(seq);
            }
        });
        // Keep own reference to client because it might differ from the FrameManager's
        // client for OOP iframes.
        __classPrivateFieldSet$i(this, _IsolatedWorld_frame, frame, "f");
        __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).on('Runtime.bindingCalled', __classPrivateFieldGet$i(this, _IsolatedWorld_onBindingCalled, "f"));
    }
    get _waitTasks() {
        return __classPrivateFieldGet$i(this, _IsolatedWorld_waitTasks, "f");
    }
    get _boundFunctions() {
        return __classPrivateFieldGet$i(this, _IsolatedWorld_boundFunctions, "f");
    }
    frame() {
        return __classPrivateFieldGet$i(this, _IsolatedWorld_frame, "f");
    }
    clearContext() {
        __classPrivateFieldSet$i(this, _IsolatedWorld_document, undefined, "f");
        __classPrivateFieldSet$i(this, _IsolatedWorld_contextPromise, createDeferredPromise(), "f");
    }
    setContext(context) {
        assert(__classPrivateFieldGet$i(this, _IsolatedWorld_contextPromise, "f"), `ExecutionContext ${context._contextId} has already been set.`);
        __classPrivateFieldGet$i(this, _IsolatedWorld_ctxBindings, "f").clear();
        __classPrivateFieldGet$i(this, _IsolatedWorld_contextPromise, "f").resolve(context);
        for (const waitTask of this._waitTasks) {
            waitTask.rerun();
        }
    }
    hasContext() {
        return __classPrivateFieldGet$i(this, _IsolatedWorld_contextPromise, "f").resolved();
    }
    _detach() {
        __classPrivateFieldSet$i(this, _IsolatedWorld_detached, true, "f");
        __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).off('Runtime.bindingCalled', __classPrivateFieldGet$i(this, _IsolatedWorld_onBindingCalled, "f"));
        for (const waitTask of this._waitTasks) {
            waitTask.terminate(new Error('waitForFunction failed: frame got detached.'));
        }
    }
    executionContext() {
        if (__classPrivateFieldGet$i(this, _IsolatedWorld_detached, "f")) {
            throw new Error(`Execution context is not available in detached frame "${__classPrivateFieldGet$i(this, _IsolatedWorld_frame, "f").url()}" (are you trying to evaluate?)`);
        }
        if (__classPrivateFieldGet$i(this, _IsolatedWorld_contextPromise, "f") === null) {
            throw new Error(`Execution content promise is missing`);
        }
        return __classPrivateFieldGet$i(this, _IsolatedWorld_contextPromise, "f");
    }
    async evaluateHandle(pageFunction, ...args) {
        const context = await this.executionContext();
        return context.evaluateHandle(pageFunction, ...args);
    }
    async evaluate(pageFunction, ...args) {
        const context = await this.executionContext();
        return context.evaluate(pageFunction, ...args);
    }
    async $(selector) {
        const document = await this.document();
        return document.$(selector);
    }
    async $$(selector) {
        const document = await this.document();
        return document.$$(selector);
    }
    async document() {
        if (__classPrivateFieldGet$i(this, _IsolatedWorld_document, "f")) {
            return __classPrivateFieldGet$i(this, _IsolatedWorld_document, "f");
        }
        const context = await this.executionContext();
        __classPrivateFieldSet$i(this, _IsolatedWorld_document, await context.evaluateHandle(() => {
            return document;
        }), "f");
        return __classPrivateFieldGet$i(this, _IsolatedWorld_document, "f");
    }
    async $x(expression) {
        const document = await this.document();
        return document.$x(expression);
    }
    async $eval(selector, pageFunction, ...args) {
        const document = await this.document();
        return document.$eval(selector, pageFunction, ...args);
    }
    async $$eval(selector, pageFunction, ...args) {
        const document = await this.document();
        return document.$$eval(selector, pageFunction, ...args);
    }
    async content() {
        return await this.evaluate(() => {
            let retVal = '';
            if (document.doctype) {
                retVal = new XMLSerializer().serializeToString(document.doctype);
            }
            if (document.documentElement) {
                retVal += document.documentElement.outerHTML;
            }
            return retVal;
        });
    }
    async setContent(html, options = {}) {
        const { waitUntil = ['load'], timeout = __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_timeoutSettings_get).navigationTimeout(), } = options;
        // We rely upon the fact that document.open() will reset frame lifecycle with "init"
        // lifecycle event. @see https://crrev.com/608658
        await this.evaluate(html => {
            document.open();
            document.write(html);
            document.close();
        }, html);
        const watcher = new LifecycleWatcher(__classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_frameManager_get), __classPrivateFieldGet$i(this, _IsolatedWorld_frame, "f"), waitUntil, timeout);
        const error = await Promise.race([
            watcher.timeoutOrTerminationPromise(),
            watcher.lifecyclePromise(),
        ]);
        watcher.dispose();
        if (error) {
            throw error;
        }
    }
    /**
     * Adds a script tag into the current context.
     *
     * @remarks
     * You can pass a URL, filepath or string of contents. Note that when running Puppeteer
     * in a browser environment you cannot pass a filepath and should use either
     * `url` or `content`.
     */
    async addScriptTag(options) {
        const { url = null, path = null, content = null, id = '', type = '', } = options;
        if (url !== null) {
            try {
                const context = await this.executionContext();
                return await context.evaluateHandle(addScriptUrl, url, id, type);
            }
            catch (error) {
                throw new Error(`Loading script from ${url} failed`);
            }
        }
        if (path !== null) {
            let fs;
            try {
                fs = (await import('fs')).promises;
            }
            catch (error) {
                if (error instanceof TypeError) {
                    throw new Error('Can only pass a filepath to addScriptTag in a Node-like environment.');
                }
                throw error;
            }
            let contents = await fs.readFile(path, 'utf8');
            contents += '//# sourceURL=' + path.replace(/\n/g, '');
            const context = await this.executionContext();
            return await context.evaluateHandle(addScriptContent, contents, id, type);
        }
        if (content !== null) {
            const context = await this.executionContext();
            return await context.evaluateHandle(addScriptContent, content, id, type);
        }
        throw new Error('Provide an object with a `url`, `path` or `content` property');
        async function addScriptUrl(url, id, type) {
            const script = document.createElement('script');
            script.src = url;
            if (id) {
                script.id = id;
            }
            if (type) {
                script.type = type;
            }
            const promise = new Promise((res, rej) => {
                script.onload = res;
                script.onerror = rej;
            });
            document.head.appendChild(script);
            await promise;
            return script;
        }
        function addScriptContent(content, id, type = 'text/javascript') {
            const script = document.createElement('script');
            script.type = type;
            script.text = content;
            if (id) {
                script.id = id;
            }
            let error = null;
            script.onerror = e => {
                return (error = e);
            };
            document.head.appendChild(script);
            if (error) {
                throw error;
            }
            return script;
        }
    }
    /**
     * Adds a style tag into the current context.
     *
     * @remarks
     * You can pass a URL, filepath or string of contents. Note that when running Puppeteer
     * in a browser environment you cannot pass a filepath and should use either
     * `url` or `content`.
     */
    async addStyleTag(options) {
        const { url = null, content = null } = options;
        if (url !== null) {
            try {
                const context = await this.executionContext();
                return (await context.evaluateHandle(addStyleUrl, url));
            }
            catch (error) {
                throw new Error(`Loading style from ${url} failed`);
            }
        }
        if (content !== null) {
            const context = await this.executionContext();
            return (await context.evaluateHandle(addStyleContent, content));
        }
        throw new Error('Provide an object with a `url`, `path` or `content` property');
        async function addStyleUrl(url) {
            const link = document.createElement('link');
            link.rel = 'stylesheet';
            link.href = url;
            const promise = new Promise((res, rej) => {
                link.onload = res;
                link.onerror = rej;
            });
            document.head.appendChild(link);
            await promise;
            return link;
        }
        async function addStyleContent(content) {
            const style = document.createElement('style');
            style.appendChild(document.createTextNode(content));
            const promise = new Promise((res, rej) => {
                style.onload = res;
                style.onerror = rej;
            });
            document.head.appendChild(style);
            await promise;
            return style;
        }
    }
    async click(selector, options) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.click(options);
        await handle.dispose();
    }
    async focus(selector) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.focus();
        await handle.dispose();
    }
    async hover(selector) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.hover();
        await handle.dispose();
    }
    async select(selector, ...values) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        const result = await handle.select(...values);
        await handle.dispose();
        return result;
    }
    async tap(selector) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.tap();
        await handle.dispose();
    }
    async type(selector, text, options) {
        const handle = await this.$(selector);
        assert(handle, `No element found for selector: ${selector}`);
        await handle.type(text, options);
        await handle.dispose();
    }
    async _addBindingToContext(context, name) {
        // Previous operation added the binding so we are done.
        if (__classPrivateFieldGet$i(this, _IsolatedWorld_ctxBindings, "f").has(__classPrivateFieldGet$i(IsolatedWorld, _a, "f", _IsolatedWorld_bindingIdentifier).call(IsolatedWorld, name, context._contextId))) {
            return;
        }
        // Wait for other operation to finish
        if (__classPrivateFieldGet$i(this, _IsolatedWorld_settingUpBinding, "f")) {
            await __classPrivateFieldGet$i(this, _IsolatedWorld_settingUpBinding, "f");
            return this._addBindingToContext(context, name);
        }
        const bind = async (name) => {
            const expression = pageBindingInitString('internal', name);
            try {
                // TODO: In theory, it would be enough to call this just once
                await context._client.send('Runtime.addBinding', {
                    name,
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore The protocol definition is not up to date.
                    executionContextName: context._contextName,
                });
                await context.evaluate(expression);
            }
            catch (error) {
                // We could have tried to evaluate in a context which was already
                // destroyed. This happens, for example, if the page is navigated while
                // we are trying to add the binding
                const ctxDestroyed = error.message.includes('Execution context was destroyed');
                const ctxNotFound = error.message.includes('Cannot find context with specified id');
                if (ctxDestroyed || ctxNotFound) {
                    return;
                }
                else {
                    debugError(error);
                    return;
                }
            }
            __classPrivateFieldGet$i(this, _IsolatedWorld_ctxBindings, "f").add(__classPrivateFieldGet$i(IsolatedWorld, _a, "f", _IsolatedWorld_bindingIdentifier).call(IsolatedWorld, name, context._contextId));
        };
        __classPrivateFieldSet$i(this, _IsolatedWorld_settingUpBinding, bind(name), "f");
        await __classPrivateFieldGet$i(this, _IsolatedWorld_settingUpBinding, "f");
        __classPrivateFieldSet$i(this, _IsolatedWorld_settingUpBinding, null, "f");
    }
    async _waitForSelectorInPage(queryOne, root, selector, options, binding) {
        const { visible: waitForVisible = false, hidden: waitForHidden = false, timeout = __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_timeoutSettings_get).timeout(), } = options;
        const polling = waitForVisible || waitForHidden ? 'raf' : 'mutation';
        const title = `selector \`${selector}\`${waitForHidden ? ' to be hidden' : ''}`;
        async function predicate(root, selector, waitForVisible, waitForHidden) {
            const node = (await predicateQueryHandler(root, selector));
            return checkWaitForOptions(node, waitForVisible, waitForHidden);
        }
        const waitTaskOptions = {
            isolatedWorld: this,
            predicateBody: makePredicateString(predicate, queryOne),
            predicateAcceptsContextElement: true,
            title,
            polling,
            timeout,
            args: [selector, waitForVisible, waitForHidden],
            binding,
            root,
        };
        const waitTask = new WaitTask(waitTaskOptions);
        return waitTask.promise;
    }
    waitForFunction(pageFunction, options = {}, ...args) {
        const { polling = 'raf', timeout = __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_timeoutSettings_get).timeout() } = options;
        const waitTaskOptions = {
            isolatedWorld: this,
            predicateBody: pageFunction,
            predicateAcceptsContextElement: false,
            title: 'function',
            polling,
            timeout,
            args,
        };
        const waitTask = new WaitTask(waitTaskOptions);
        return waitTask.promise;
    }
    async title() {
        return this.evaluate(() => {
            return document.title;
        });
    }
    async adoptBackendNode(backendNodeId) {
        const executionContext = await this.executionContext();
        const { object } = await __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).send('DOM.resolveNode', {
            backendNodeId: backendNodeId,
            executionContextId: executionContext._contextId,
        });
        return createJSHandle(executionContext, object);
    }
    async adoptHandle(handle) {
        const executionContext = await this.executionContext();
        assert(handle.executionContext() !== executionContext, 'Cannot adopt handle that already belongs to this execution context');
        const nodeInfo = await __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_client_get).send('DOM.describeNode', {
            objectId: handle.remoteObject().objectId,
        });
        return (await this.adoptBackendNode(nodeInfo.node.backendNodeId));
    }
    async transferHandle(handle) {
        const result = await this.adoptHandle(handle);
        await handle.dispose();
        return result;
    }
}
_a = IsolatedWorld, _IsolatedWorld_frame = new WeakMap(), _IsolatedWorld_document = new WeakMap(), _IsolatedWorld_contextPromise = new WeakMap(), _IsolatedWorld_detached = new WeakMap(), _IsolatedWorld_ctxBindings = new WeakMap(), _IsolatedWorld_boundFunctions = new WeakMap(), _IsolatedWorld_waitTasks = new WeakMap(), _IsolatedWorld_settingUpBinding = new WeakMap(), _IsolatedWorld_onBindingCalled = new WeakMap(), _IsolatedWorld_instances = new WeakSet(), _IsolatedWorld_client_get = function _IsolatedWorld_client_get() {
    return __classPrivateFieldGet$i(this, _IsolatedWorld_frame, "f")._client();
}, _IsolatedWorld_frameManager_get = function _IsolatedWorld_frameManager_get() {
    return __classPrivateFieldGet$i(this, _IsolatedWorld_frame, "f")._frameManager;
}, _IsolatedWorld_timeoutSettings_get = function _IsolatedWorld_timeoutSettings_get() {
    return __classPrivateFieldGet$i(this, _IsolatedWorld_instances, "a", _IsolatedWorld_frameManager_get).timeoutSettings;
};
_IsolatedWorld_bindingIdentifier = { value: (name, contextId) => {
        return `${name}_${contextId}`;
    } };
const noop = () => { };
/**
 * @internal
 */
class WaitTask {
    constructor(options) {
        _WaitTask_instances.add(this);
        _WaitTask_isolatedWorld.set(this, void 0);
        _WaitTask_polling.set(this, void 0);
        _WaitTask_timeout.set(this, void 0);
        _WaitTask_predicateBody.set(this, void 0);
        _WaitTask_predicateAcceptsContextElement.set(this, void 0);
        _WaitTask_args.set(this, void 0);
        _WaitTask_binding.set(this, void 0);
        _WaitTask_runCount.set(this, 0);
        _WaitTask_resolve.set(this, noop);
        _WaitTask_reject.set(this, noop);
        _WaitTask_timeoutTimer.set(this, void 0);
        _WaitTask_terminated.set(this, false);
        _WaitTask_root.set(this, null);
        if (isString(options.polling)) {
            assert(options.polling === 'raf' || options.polling === 'mutation', 'Unknown polling option: ' + options.polling);
        }
        else if (isNumber(options.polling)) {
            assert(options.polling > 0, 'Cannot poll with non-positive interval: ' + options.polling);
        }
        else {
            throw new Error('Unknown polling options: ' + options.polling);
        }
        function getPredicateBody(predicateBody) {
            if (isString(predicateBody)) {
                return `return (${predicateBody});`;
            }
            return `return (${predicateBody})(...args);`;
        }
        __classPrivateFieldSet$i(this, _WaitTask_isolatedWorld, options.isolatedWorld, "f");
        __classPrivateFieldSet$i(this, _WaitTask_polling, options.polling, "f");
        __classPrivateFieldSet$i(this, _WaitTask_timeout, options.timeout, "f");
        __classPrivateFieldSet$i(this, _WaitTask_root, options.root || null, "f");
        __classPrivateFieldSet$i(this, _WaitTask_predicateBody, getPredicateBody(options.predicateBody), "f");
        __classPrivateFieldSet$i(this, _WaitTask_predicateAcceptsContextElement, options.predicateAcceptsContextElement, "f");
        __classPrivateFieldSet$i(this, _WaitTask_args, options.args, "f");
        __classPrivateFieldSet$i(this, _WaitTask_binding, options.binding, "f");
        __classPrivateFieldSet$i(this, _WaitTask_runCount, 0, "f");
        __classPrivateFieldGet$i(this, _WaitTask_isolatedWorld, "f")._waitTasks.add(this);
        if (__classPrivateFieldGet$i(this, _WaitTask_binding, "f")) {
            __classPrivateFieldGet$i(this, _WaitTask_isolatedWorld, "f")._boundFunctions.set(__classPrivateFieldGet$i(this, _WaitTask_binding, "f").name, __classPrivateFieldGet$i(this, _WaitTask_binding, "f").pptrFunction);
        }
        this.promise = new Promise((resolve, reject) => {
            __classPrivateFieldSet$i(this, _WaitTask_resolve, resolve, "f");
            __classPrivateFieldSet$i(this, _WaitTask_reject, reject, "f");
        });
        // Since page navigation requires us to re-install the pageScript, we should track
        // timeout on our end.
        if (options.timeout) {
            const timeoutError = new TimeoutError(`waiting for ${options.title} failed: timeout ${options.timeout}ms exceeded`);
            __classPrivateFieldSet$i(this, _WaitTask_timeoutTimer, setTimeout(() => {
                return this.terminate(timeoutError);
            }, options.timeout), "f");
        }
        this.rerun();
    }
    terminate(error) {
        __classPrivateFieldSet$i(this, _WaitTask_terminated, true, "f");
        __classPrivateFieldGet$i(this, _WaitTask_reject, "f").call(this, error);
        __classPrivateFieldGet$i(this, _WaitTask_instances, "m", _WaitTask_cleanup).call(this);
    }
    async rerun() {
        var _b;
        const runCount = __classPrivateFieldSet$i(this, _WaitTask_runCount, (_b = __classPrivateFieldGet$i(this, _WaitTask_runCount, "f"), ++_b), "f");
        let success = null;
        let error = null;
        const context = await __classPrivateFieldGet$i(this, _WaitTask_isolatedWorld, "f").executionContext();
        if (__classPrivateFieldGet$i(this, _WaitTask_terminated, "f") || runCount !== __classPrivateFieldGet$i(this, _WaitTask_runCount, "f")) {
            return;
        }
        if (__classPrivateFieldGet$i(this, _WaitTask_binding, "f")) {
            await __classPrivateFieldGet$i(this, _WaitTask_isolatedWorld, "f")._addBindingToContext(context, __classPrivateFieldGet$i(this, _WaitTask_binding, "f").name);
        }
        if (__classPrivateFieldGet$i(this, _WaitTask_terminated, "f") || runCount !== __classPrivateFieldGet$i(this, _WaitTask_runCount, "f")) {
            return;
        }
        try {
            success = await context.evaluateHandle(waitForPredicatePageFunction, __classPrivateFieldGet$i(this, _WaitTask_root, "f") || null, __classPrivateFieldGet$i(this, _WaitTask_predicateBody, "f"), __classPrivateFieldGet$i(this, _WaitTask_predicateAcceptsContextElement, "f"), __classPrivateFieldGet$i(this, _WaitTask_polling, "f"), __classPrivateFieldGet$i(this, _WaitTask_timeout, "f"), ...__classPrivateFieldGet$i(this, _WaitTask_args, "f"));
        }
        catch (error_) {
            error = error_;
        }
        if (__classPrivateFieldGet$i(this, _WaitTask_terminated, "f") || runCount !== __classPrivateFieldGet$i(this, _WaitTask_runCount, "f")) {
            if (success) {
                await success.dispose();
            }
            return;
        }
        // Ignore timeouts in pageScript - we track timeouts ourselves.
        // If the frame's execution context has already changed, `frame.evaluate` will
        // throw an error - ignore this predicate run altogether.
        if (!error &&
            (await __classPrivateFieldGet$i(this, _WaitTask_isolatedWorld, "f")
                .evaluate(s => {
                return !s;
            }, success)
                .catch(() => {
                return true;
            }))) {
            if (!success) {
                throw new Error('Assertion: result handle is not available');
            }
            await success.dispose();
            return;
        }
        if (error) {
            if (error.message.includes('TypeError: binding is not a function')) {
                return this.rerun();
            }
            // When frame is detached the task should have been terminated by the IsolatedWorld.
            // This can fail if we were adding this task while the frame was detached,
            // so we terminate here instead.
            if (error.message.includes('Execution context is not available in detached frame')) {
                this.terminate(new Error('waitForFunction failed: frame got detached.'));
                return;
            }
            // When the page is navigated, the promise is rejected.
            // We will try again in the new execution context.
            if (error.message.includes('Execution context was destroyed')) {
                return;
            }
            // We could have tried to evaluate in a context which was already
            // destroyed.
            if (error.message.includes('Cannot find context with specified id')) {
                return;
            }
            __classPrivateFieldGet$i(this, _WaitTask_reject, "f").call(this, error);
        }
        else {
            if (!success) {
                throw new Error('Assertion: result handle is not available');
            }
            __classPrivateFieldGet$i(this, _WaitTask_resolve, "f").call(this, success);
        }
        __classPrivateFieldGet$i(this, _WaitTask_instances, "m", _WaitTask_cleanup).call(this);
    }
}
_WaitTask_isolatedWorld = new WeakMap(), _WaitTask_polling = new WeakMap(), _WaitTask_timeout = new WeakMap(), _WaitTask_predicateBody = new WeakMap(), _WaitTask_predicateAcceptsContextElement = new WeakMap(), _WaitTask_args = new WeakMap(), _WaitTask_binding = new WeakMap(), _WaitTask_runCount = new WeakMap(), _WaitTask_resolve = new WeakMap(), _WaitTask_reject = new WeakMap(), _WaitTask_timeoutTimer = new WeakMap(), _WaitTask_terminated = new WeakMap(), _WaitTask_root = new WeakMap(), _WaitTask_instances = new WeakSet(), _WaitTask_cleanup = function _WaitTask_cleanup() {
    __classPrivateFieldGet$i(this, _WaitTask_timeoutTimer, "f") !== undefined && clearTimeout(__classPrivateFieldGet$i(this, _WaitTask_timeoutTimer, "f"));
    __classPrivateFieldGet$i(this, _WaitTask_isolatedWorld, "f")._waitTasks.delete(this);
};
async function waitForPredicatePageFunction(root, predicateBody, predicateAcceptsContextElement, polling, timeout, ...args) {
    root = root || document;
    const predicate = new Function('...args', predicateBody);
    let timedOut = false;
    if (timeout) {
        setTimeout(() => {
            return (timedOut = true);
        }, timeout);
    }
    switch (polling) {
        case 'raf':
            return await pollRaf();
        case 'mutation':
            return await pollMutation();
        default:
            return await pollInterval(polling);
    }
    async function pollMutation() {
        const success = predicateAcceptsContextElement
            ? await predicate(root, ...args)
            : await predicate(...args);
        if (success) {
            return Promise.resolve(success);
        }
        let fulfill = (_) => { };
        const result = new Promise(x => {
            return (fulfill = x);
        });
        const observer = new MutationObserver(async () => {
            if (timedOut) {
                observer.disconnect();
                fulfill();
            }
            const success = predicateAcceptsContextElement
                ? await predicate(root, ...args)
                : await predicate(...args);
            if (success) {
                observer.disconnect();
                fulfill(success);
            }
        });
        if (!root) {
            throw new Error('Root element is not found.');
        }
        observer.observe(root, {
            childList: true,
            subtree: true,
            attributes: true,
        });
        return result;
    }
    async function pollRaf() {
        let fulfill = (_) => { };
        const result = new Promise(x => {
            return (fulfill = x);
        });
        await onRaf();
        return result;
        async function onRaf() {
            if (timedOut) {
                fulfill();
                return;
            }
            const success = predicateAcceptsContextElement
                ? await predicate(root, ...args)
                : await predicate(...args);
            if (success) {
                fulfill(success);
            }
            else {
                requestAnimationFrame(onRaf);
            }
        }
    }
    async function pollInterval(pollInterval) {
        let fulfill = (_) => { };
        const result = new Promise(x => {
            return (fulfill = x);
        });
        await onTimeout();
        return result;
        async function onTimeout() {
            if (timedOut) {
                fulfill();
                return;
            }
            const success = predicateAcceptsContextElement
                ? await predicate(root, ...args)
                : await predicate(...args);
            if (success) {
                fulfill(success);
            }
            else {
                setTimeout(onTimeout, pollInterval);
            }
        }
    }
}

var __classPrivateFieldSet$h = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$h = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Frame_parentFrame, _Frame_url, _Frame_detached, _Frame_client;
/**
 * Represents a DOM frame.
 *
 * To understand frames, you can think of frames as `<iframe>` elements. Just
 * like iframes, frames can be nested, and when JavaScript is executed in a
 * frame, the JavaScript does not effect frames inside the ambient frame the
 * JavaScript executes in.
 *
 * @example
 * At any point in time, {@link Page | pages} expose their current frame
 * tree via the {@link Page.mainFrame} and {@link Frame.childFrames} methods.
 *
 * @example
 * An example of dumping frame tree:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://www.google.com/chrome/browser/canary.html');
 *   dumpFrameTree(page.mainFrame(), '');
 *   await browser.close();
 *
 *   function dumpFrameTree(frame, indent) {
 *     console.log(indent + frame.url());
 *     for (const child of frame.childFrames()) {
 *       dumpFrameTree(child, indent + '  ');
 *     }
 *   }
 * })();
 * ```
 *
 * @example
 * An example of getting text from an iframe element:
 *
 * ```ts
 * const frame = page.frames().find(frame => frame.name() === 'myframe');
 * const text = await frame.$eval('.selector', element => element.textContent);
 * console.log(text);
 * ```
 *
 * @remarks
 * Frame lifecycles are controlled by three events that are all dispatched on
 * the parent {@link Frame.page | page}:
 *
 * - {@link PageEmittedEvents.FrameAttached}
 * - {@link PageEmittedEvents.FrameNavigated}
 * - {@link PageEmittedEvents.FrameDetached}
 *
 * @public
 */
class Frame {
    /**
     * @internal
     */
    constructor(frameManager, parentFrame, frameId, client) {
        _Frame_parentFrame.set(this, void 0);
        _Frame_url.set(this, '');
        _Frame_detached.set(this, false);
        _Frame_client.set(this, void 0);
        /**
         * @internal
         */
        this._loaderId = '';
        /**
         * @internal
         */
        this._hasStartedLoading = false;
        /**
         * @internal
         */
        this._lifecycleEvents = new Set();
        this._frameManager = frameManager;
        __classPrivateFieldSet$h(this, _Frame_parentFrame, parentFrame !== null && parentFrame !== void 0 ? parentFrame : null, "f");
        __classPrivateFieldSet$h(this, _Frame_url, '', "f");
        this._id = frameId;
        __classPrivateFieldSet$h(this, _Frame_detached, false, "f");
        this._loaderId = '';
        this._childFrames = new Set();
        if (__classPrivateFieldGet$h(this, _Frame_parentFrame, "f")) {
            __classPrivateFieldGet$h(this, _Frame_parentFrame, "f")._childFrames.add(this);
        }
        this.updateClient(client);
    }
    /**
     * @internal
     */
    updateClient(client) {
        __classPrivateFieldSet$h(this, _Frame_client, client, "f");
        this.worlds = {
            [MAIN_WORLD]: new IsolatedWorld(this),
            [PUPPETEER_WORLD]: new IsolatedWorld(this),
        };
    }
    /**
     * @returns The page associated with the frame.
     */
    page() {
        return this._frameManager.page();
    }
    /**
     * @returns `true` if the frame is an out-of-process (OOP) frame. Otherwise,
     * `false`.
     */
    isOOPFrame() {
        return __classPrivateFieldGet$h(this, _Frame_client, "f") !== this._frameManager.client;
    }
    /**
     * Navigates a frame to the given url.
     *
     * @remarks
     * Navigation to `about:blank` or navigation to the same URL with a different
     * hash will succeed and return `null`.
     *
     * :::warning
     *
     * Headless mode doesn't support navigation to a PDF document. See the {@link
     * https://bugs.chromium.org/p/chromium/issues/detail?id=761295 | upstream
     * issue}.
     *
     * :::
     *
     * @param url - the URL to navigate the frame to. This should include the
     * scheme, e.g. `https://`.
     * @param options - navigation options. `waitUntil` is useful to define when
     * the navigation should be considered successful - see the docs for
     * {@link PuppeteerLifeCycleEvent} for more details.
     *
     * @returns A promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect.
     * @throws This method will throw an error if:
     *
     * - there's an SSL error (e.g. in case of self-signed certificates).
     * - target URL is invalid.
     * - the `timeout` is exceeded during navigation.
     * - the remote server does not respond or is unreachable.
     * - the main resource failed to load.
     *
     * This method will not throw an error when any valid HTTP status code is
     * returned by the remote server, including 404 "Not Found" and 500 "Internal
     * Server Error". The status code for such responses can be retrieved by
     * calling {@link HTTPResponse.status}.
     */
    async goto(url, options = {}) {
        const { referer = this._frameManager.networkManager.extraHTTPHeaders()['referer'], waitUntil = ['load'], timeout = this._frameManager.timeoutSettings.navigationTimeout(), } = options;
        let ensureNewDocumentNavigation = false;
        const watcher = new LifecycleWatcher(this._frameManager, this, waitUntil, timeout);
        let error = await Promise.race([
            navigate(__classPrivateFieldGet$h(this, _Frame_client, "f"), url, referer, this._id),
            watcher.timeoutOrTerminationPromise(),
        ]);
        if (!error) {
            error = await Promise.race([
                watcher.timeoutOrTerminationPromise(),
                ensureNewDocumentNavigation
                    ? watcher.newDocumentNavigationPromise()
                    : watcher.sameDocumentNavigationPromise(),
            ]);
        }
        try {
            if (error) {
                throw error;
            }
            return await watcher.navigationResponse();
        }
        finally {
            watcher.dispose();
        }
        async function navigate(client, url, referrer, frameId) {
            try {
                const response = await client.send('Page.navigate', {
                    url,
                    referrer,
                    frameId,
                });
                ensureNewDocumentNavigation = !!response.loaderId;
                return response.errorText
                    ? new Error(`${response.errorText} at ${url}`)
                    : null;
            }
            catch (error) {
                if (isErrorLike(error)) {
                    return error;
                }
                throw error;
            }
        }
    }
    /**
     * Waits for the frame to navigate. It is useful for when you run code which
     * will indirectly cause the frame to navigate.
     *
     * Usage of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API | History API}
     * to change the URL is considered a navigation.
     *
     * @example
     *
     * ```ts
     * const [response] = await Promise.all([
     *   // The navigation promise resolves after navigation has finished
     *   frame.waitForNavigation(),
     *   // Clicking the link will indirectly cause a navigation
     *   frame.click('a.my-link'),
     * ]);
     * ```
     *
     * @param options - options to configure when the navigation is consided
     * finished.
     * @returns a promise that resolves when the frame navigates to a new URL.
     */
    async waitForNavigation(options = {}) {
        const { waitUntil = ['load'], timeout = this._frameManager.timeoutSettings.navigationTimeout(), } = options;
        const watcher = new LifecycleWatcher(this._frameManager, this, waitUntil, timeout);
        const error = await Promise.race([
            watcher.timeoutOrTerminationPromise(),
            watcher.sameDocumentNavigationPromise(),
            watcher.newDocumentNavigationPromise(),
        ]);
        try {
            if (error) {
                throw error;
            }
            return await watcher.navigationResponse();
        }
        finally {
            watcher.dispose();
        }
    }
    /**
     * @internal
     */
    _client() {
        return __classPrivateFieldGet$h(this, _Frame_client, "f");
    }
    /**
     * @internal
     */
    executionContext() {
        return this.worlds[MAIN_WORLD].executionContext();
    }
    /**
     * Behaves identically to {@link Page.evaluateHandle} except it's run within
     * the context of this frame.
     *
     * @see {@link Page.evaluateHandle} for details.
     */
    async evaluateHandle(pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].evaluateHandle(pageFunction, ...args);
    }
    /**
     * Behaves identically to {@link Page.evaluate} except it's run within the
     * the context of this frame.
     *
     * @see {@link Page.evaluate} for details.
     */
    async evaluate(pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].evaluate(pageFunction, ...args);
    }
    /**
     * Queries the frame for an element matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns A {@link ElementHandle | element handle} to the first element
     * matching the given selector. Otherwise, `null`.
     */
    async $(selector) {
        return this.worlds[MAIN_WORLD].$(selector);
    }
    /**
     * Queries the frame for all elements matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns An array of {@link ElementHandle | element handles} that point to
     * elements matching the given selector.
     */
    async $$(selector) {
        return this.worlds[MAIN_WORLD].$$(selector);
    }
    /**
     * Runs the given function on the first element matching the given selector in
     * the frame.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```ts
     * const searchValue = await frame.$eval('#search', el => el.value);
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in the frame's context.
     * The first element matching the selector will be passed to the function as
     * its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $eval(selector, pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].$eval(selector, pageFunction, ...args);
    }
    /**
     * Runs the given function on an array of elements matching the given selector
     * in the frame.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```js
     * const divsCounts = await frame.$$eval('div', divs => divs.length);
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in the frame's context.
     * An array of elements matching the given selector will be passed to the
     * function as its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $$eval(selector, pageFunction, ...args) {
        return this.worlds[MAIN_WORLD].$$eval(selector, pageFunction, ...args);
    }
    /**
     * @deprecated Use {@link Frame.$$} with the `xpath` prefix.
     *
     * This method evaluates the given XPath expression and returns the results.
     * @param expression - the XPath expression to evaluate.
     */
    async $x(expression) {
        return this.worlds[MAIN_WORLD].$x(expression);
    }
    /**
     * Waits for an element matching the given selector to appear in the frame.
     *
     * This method works across navigations.
     *
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .mainFrame()
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - The selector to query and wait for.
     * @param options - Options for customizing waiting behavior.
     * @returns An element matching the given selector.
     * @throws Throws if an element matching the given selector doesn't appear.
     */
    async waitForSelector(selector, options = {}) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.waitFor, 'Query handler does not support waiting');
        return (await queryHandler.waitFor(this, updatedSelector, options));
    }
    /**
     * @deprecated Use {@link Frame.waitForSelector} with the `xpath` prefix.
     *
     * Wait for the `xpath` to appear in page. If at the moment of calling the
     * method the `xpath` already exists, the method will return immediately. If
     * the xpath doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * For a code example, see the example for {@link Frame.waitForSelector}. That
     * function behaves identically other than taking a CSS selector rather than
     * an XPath.
     *
     * @param xpath - the XPath expression to wait for.
     * @param options - options to configure the visiblity of the element and how
     * long to wait before timing out.
     */
    async waitForXPath(xpath, options = {}) {
        if (xpath.startsWith('//')) {
            xpath = `.${xpath}`;
        }
        return this.waitForSelector(`xpath/${xpath}`, options);
    }
    /**
     * @example
     * The `waitForFunction` can be used to observe viewport size change:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     * .  const browser = await puppeteer.launch();
     * .  const page = await browser.newPage();
     * .  const watchDog = page.mainFrame().waitForFunction('window.innerWidth < 100');
     * .  page.setViewport({width: 50, height: 50});
     * .  await watchDog;
     * .  await browser.close();
     * })();
     * ```
     *
     * To pass arguments from Node.js to the predicate of `page.waitForFunction` function:
     *
     * ```ts
     * const selector = '.foo';
     * await frame.waitForFunction(
     *   selector => !!document.querySelector(selector),
     *   {}, // empty options object
     *   selector
     * );
     * ```
     *
     * @param pageFunction - the function to evaluate in the frame context.
     * @param options - options to configure the polling method and timeout.
     * @param args - arguments to pass to the `pageFunction`.
     * @returns the promise which resolve when the `pageFunction` returns a truthy value.
     */
    waitForFunction(pageFunction, options = {}, ...args) {
        // TODO: Fix when NodeHandle has been added.
        return this.worlds[MAIN_WORLD].waitForFunction(pageFunction, options, ...args);
    }
    /**
     * @returns The full HTML contents of the frame, including the DOCTYPE.
     */
    async content() {
        return this.worlds[PUPPETEER_WORLD].content();
    }
    /**
     * Set the content of the frame.
     *
     * @param html - HTML markup to assign to the page.
     * @param options - Options to configure how long before timing out and at
     * what point to consider the content setting successful.
     */
    async setContent(html, options = {}) {
        return this.worlds[PUPPETEER_WORLD].setContent(html, options);
    }
    /**
     * @returns The frame's `name` attribute as specified in the tag.
     *
     * @remarks
     * If the name is empty, it returns the `id` attribute instead.
     *
     * @remarks
     * This value is calculated once when the frame is created, and will not
     * update if the attribute is changed later.
     */
    name() {
        return this._name || '';
    }
    /**
     * @returns The frame's URL.
     */
    url() {
        return __classPrivateFieldGet$h(this, _Frame_url, "f");
    }
    /**
     * @returns The parent frame, if any. Detached and main frames return `null`.
     */
    parentFrame() {
        return __classPrivateFieldGet$h(this, _Frame_parentFrame, "f");
    }
    /**
     * @returns An array of child frames.
     */
    childFrames() {
        return Array.from(this._childFrames);
    }
    /**
     * @returns `true` if the frame has been detached. Otherwise, `false`.
     */
    isDetached() {
        return __classPrivateFieldGet$h(this, _Frame_detached, "f");
    }
    /**
     * Adds a `<script>` tag into the page with the desired url or content.
     *
     * @param options - Options for the script.
     * @returns a promise that resolves to the added tag when the script's
     * `onload` event fires or when the script content was injected into the
     * frame.
     */
    async addScriptTag(options) {
        return this.worlds[MAIN_WORLD].addScriptTag(options);
    }
    /**
     * Adds a `<link rel="stylesheet">` tag into the page with the desired url or
     * a `<style type="text/css">` tag with the content.
     *
     * @param options - Options for the style link.
     * @returns a promise that resolves to the added tag when the stylesheets's
     * `onload` event fires or when the CSS content was injected into the
     * frame.
     */
    async addStyleTag(options) {
        return this.worlds[MAIN_WORLD].addStyleTag(options);
    }
    /**
     * Clicks the first element found that matches `selector`.
     *
     * @remarks
     * If `click()` triggers a navigation event and there's a separate
     * `page.waitForNavigation()` promise to be resolved, you may end up with a
     * race condition that yields unexpected results. The correct pattern for
     * click and wait for navigation is the following:
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(waitOptions),
     *   frame.click(selector, clickOptions),
     * ]);
     * ```
     *
     * @param selector - The selector to query for.
     */
    async click(selector, options = {}) {
        return this.worlds[PUPPETEER_WORLD].click(selector, options);
    }
    /**
     * Focuses the first element that matches the `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async focus(selector) {
        return this.worlds[PUPPETEER_WORLD].focus(selector);
    }
    /**
     * Hovers the pointer over the center of the first element that matches the
     * `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async hover(selector) {
        return this.worlds[PUPPETEER_WORLD].hover(selector);
    }
    /**
     * Selects a set of value on the first `<select>` element that matches the
     * `selector`.
     *
     * @example
     *
     * ```ts
     * frame.select('select#colors', 'blue'); // single selection
     * frame.select('select#colors', 'red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param selector - The selector to query for.
     * @param values - The array of values to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first
     * one is taken into account.
     * @returns the list of values that were successfully selected.
     * @throws Throws if there's no `<select>` matching `selector`.
     */
    select(selector, ...values) {
        return this.worlds[PUPPETEER_WORLD].select(selector, ...values);
    }
    /**
     * Taps the first element that matches the `selector`.
     *
     * @param selector - The selector to query for.
     * @throws Throws if there's no element matching `selector`.
     */
    async tap(selector) {
        return this.worlds[PUPPETEER_WORLD].tap(selector);
    }
    /**
     * Sends a `keydown`, `keypress`/`input`, and `keyup` event for each character
     * in the text.
     *
     * @remarks
     * To press a special key, like `Control` or `ArrowDown`, use
     * {@link Keyboard.press}.
     *
     * @example
     *
     * ```ts
     * await frame.type('#mytextarea', 'Hello'); // Types instantly
     * await frame.type('#mytextarea', 'World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @param selector - the selector for the element to type into. If there are
     * multiple the first will be used.
     * @param text - text to type into the element
     * @param options - takes one option, `delay`, which sets the time to wait
     * between key presses in milliseconds. Defaults to `0`.
     */
    async type(selector, text, options) {
        return this.worlds[PUPPETEER_WORLD].type(selector, text, options);
    }
    /**
     * @deprecated Use `new Promise(r => setTimeout(r, milliseconds));`.
     *
     * Causes your script to wait for the given number of milliseconds.
     *
     * @remarks
     * It's generally recommended to not wait for a number of seconds, but instead
     * use {@link Frame.waitForSelector}, {@link Frame.waitForXPath} or
     * {@link Frame.waitForFunction} to wait for exactly the conditions you want.
     *
     * @example
     *
     * Wait for 1 second:
     *
     * ```ts
     * await frame.waitForTimeout(1000);
     * ```
     *
     * @param milliseconds - the number of milliseconds to wait.
     */
    waitForTimeout(milliseconds) {
        return new Promise(resolve => {
            setTimeout(resolve, milliseconds);
        });
    }
    /**
     * @returns the frame's title.
     */
    async title() {
        return this.worlds[PUPPETEER_WORLD].title();
    }
    /**
     * @internal
     */
    _navigated(framePayload) {
        this._name = framePayload.name;
        __classPrivateFieldSet$h(this, _Frame_url, `${framePayload.url}${framePayload.urlFragment || ''}`, "f");
    }
    /**
     * @internal
     */
    _navigatedWithinDocument(url) {
        __classPrivateFieldSet$h(this, _Frame_url, url, "f");
    }
    /**
     * @internal
     */
    _onLifecycleEvent(loaderId, name) {
        if (name === 'init') {
            this._loaderId = loaderId;
            this._lifecycleEvents.clear();
        }
        this._lifecycleEvents.add(name);
    }
    /**
     * @internal
     */
    _onLoadingStopped() {
        this._lifecycleEvents.add('DOMContentLoaded');
        this._lifecycleEvents.add('load');
    }
    /**
     * @internal
     */
    _onLoadingStarted() {
        this._hasStartedLoading = true;
    }
    /**
     * @internal
     */
    _detach() {
        __classPrivateFieldSet$h(this, _Frame_detached, true, "f");
        this.worlds[MAIN_WORLD]._detach();
        this.worlds[PUPPETEER_WORLD]._detach();
        if (__classPrivateFieldGet$h(this, _Frame_parentFrame, "f")) {
            __classPrivateFieldGet$h(this, _Frame_parentFrame, "f")._childFrames.delete(this);
        }
        __classPrivateFieldSet$h(this, _Frame_parentFrame, null, "f");
    }
}
_Frame_parentFrame = new WeakMap(), _Frame_url = new WeakMap(), _Frame_detached = new WeakMap(), _Frame_client = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
async function queryAXTree(client, element, accessibleName, role) {
    const { nodes } = await client.send('Accessibility.queryAXTree', {
        objectId: element.remoteObject().objectId,
        accessibleName,
        role,
    });
    const filteredNodes = nodes.filter((node) => {
        return !node.role || node.role.value !== 'StaticText';
    });
    return filteredNodes;
}
const normalizeValue = (value) => {
    return value.replace(/ +/g, ' ').trim();
};
const knownAttributes = new Set(['name', 'role']);
const attributeRegexp = /\[\s*(?<attribute>\w+)\s*=\s*(?<quote>"|')(?<value>\\.|.*?(?=\k<quote>))\k<quote>\s*\]/g;
function isKnownAttribute(attribute) {
    return knownAttributes.has(attribute);
}
/**
 * The selectors consist of an accessible name to query for and optionally
 * further aria attributes on the form `[<attribute>=<value>]`.
 * Currently, we only support the `name` and `role` attribute.
 * The following examples showcase how the syntax works wrt. querying:
 *
 * - 'title[role="heading"]' queries for elements with name 'title' and role 'heading'.
 * - '[role="img"]' queries for elements with role 'img' and any name.
 * - 'label' queries for elements with name 'label' and any role.
 * - '[name=""][role="button"]' queries for elements with no name and role 'button'.
 */
function parseAriaSelector(selector) {
    const queryOptions = {};
    const defaultName = selector.replace(attributeRegexp, (_, attribute, _quote, value) => {
        attribute = attribute.trim();
        assert(isKnownAttribute(attribute), `Unknown aria attribute "${attribute}" in selector`);
        queryOptions[attribute] = normalizeValue(value);
        return '';
    });
    if (defaultName && !queryOptions.name) {
        queryOptions.name = normalizeValue(defaultName);
    }
    return queryOptions;
}
const queryOneId = async (element, selector) => {
    const { name, role } = parseAriaSelector(selector);
    const res = await queryAXTree(element.client, element, name, role);
    if (!res[0] || !res[0].backendDOMNodeId) {
        return null;
    }
    return res[0].backendDOMNodeId;
};
const queryOne = async (element, selector) => {
    const id = await queryOneId(element, selector);
    if (!id) {
        return null;
    }
    return (await element.frame.worlds[MAIN_WORLD].adoptBackendNode(id));
};
const waitFor = async (elementOrFrame, selector, options) => {
    let frame;
    let element;
    if (elementOrFrame instanceof Frame) {
        frame = elementOrFrame;
    }
    else {
        frame = elementOrFrame.frame;
        element = await frame.worlds[PUPPETEER_WORLD].adoptHandle(elementOrFrame);
    }
    const binding = {
        name: 'ariaQuerySelector',
        pptrFunction: async (selector) => {
            const id = await queryOneId(element || (await frame.worlds[PUPPETEER_WORLD].document()), selector);
            if (!id) {
                return null;
            }
            return (await frame.worlds[PUPPETEER_WORLD].adoptBackendNode(id));
        },
    };
    const result = await frame.worlds[PUPPETEER_WORLD]._waitForSelectorInPage((_, selector) => {
        return globalThis.ariaQuerySelector(selector);
    }, element, selector, options, binding);
    if (element) {
        await element.dispose();
    }
    if (!result) {
        return null;
    }
    if (!(result instanceof ElementHandle)) {
        await result.dispose();
        return null;
    }
    return result.frame.worlds[MAIN_WORLD].transferHandle(result);
};
const queryAll = async (element, selector) => {
    const exeCtx = element.executionContext();
    const { name, role } = parseAriaSelector(selector);
    const res = await queryAXTree(exeCtx._client, element, name, role);
    const world = exeCtx._world;
    return Promise.all(res.map(axNode => {
        return world.adoptBackendNode(axNode.backendDOMNodeId);
    }));
};
/**
 * @internal
 */
const ariaHandler = {
    queryOne,
    waitFor,
    queryAll,
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
function internalizeCustomQueryHandler(handler) {
    const internalHandler = {};
    if (handler.queryOne) {
        const queryOne = handler.queryOne;
        internalHandler.queryOne = async (element, selector) => {
            const jsHandle = await element.evaluateHandle(queryOne, selector);
            const elementHandle = jsHandle.asElement();
            if (elementHandle) {
                return elementHandle;
            }
            await jsHandle.dispose();
            return null;
        };
        internalHandler.waitFor = async (elementOrFrame, selector, options) => {
            let frame;
            let element;
            if (elementOrFrame instanceof Frame) {
                frame = elementOrFrame;
            }
            else {
                frame = elementOrFrame.frame;
                element = await frame.worlds[PUPPETEER_WORLD].adoptHandle(elementOrFrame);
            }
            const result = await frame.worlds[PUPPETEER_WORLD]._waitForSelectorInPage(queryOne, element, selector, options);
            if (element) {
                await element.dispose();
            }
            if (!result) {
                return null;
            }
            if (!(result instanceof ElementHandle)) {
                await result.dispose();
                return null;
            }
            return frame.worlds[MAIN_WORLD].transferHandle(result);
        };
    }
    if (handler.queryAll) {
        const queryAll = handler.queryAll;
        internalHandler.queryAll = async (element, selector) => {
            const jsHandle = await element.evaluateHandle(queryAll, selector);
            const properties = await jsHandle.getProperties();
            await jsHandle.dispose();
            const result = [];
            for (const property of properties.values()) {
                const elementHandle = property.asElement();
                if (elementHandle) {
                    result.push(elementHandle);
                }
            }
            return result;
        };
    }
    return internalHandler;
}
const defaultHandler = internalizeCustomQueryHandler({
    queryOne: (element, selector) => {
        if (!('querySelector' in element)) {
            throw new Error(`Could not invoke \`querySelector\` on node of type ${element.nodeName}.`);
        }
        return element.querySelector(selector);
    },
    queryAll: (element, selector) => {
        if (!('querySelectorAll' in element)) {
            throw new Error(`Could not invoke \`querySelectorAll\` on node of type ${element.nodeName}.`);
        }
        return [
            ...element.querySelectorAll(selector),
        ];
    },
});
const pierceHandler = internalizeCustomQueryHandler({
    queryOne: (element, selector) => {
        let found = null;
        const search = (root) => {
            const iter = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
            do {
                const currentNode = iter.currentNode;
                if (currentNode.shadowRoot) {
                    search(currentNode.shadowRoot);
                }
                if (currentNode instanceof ShadowRoot) {
                    continue;
                }
                if (currentNode !== root && !found && currentNode.matches(selector)) {
                    found = currentNode;
                }
            } while (!found && iter.nextNode());
        };
        if (element instanceof Document) {
            element = element.documentElement;
        }
        search(element);
        return found;
    },
    queryAll: (element, selector) => {
        const result = [];
        const collect = (root) => {
            const iter = document.createTreeWalker(root, NodeFilter.SHOW_ELEMENT);
            do {
                const currentNode = iter.currentNode;
                if (currentNode.shadowRoot) {
                    collect(currentNode.shadowRoot);
                }
                if (currentNode instanceof ShadowRoot) {
                    continue;
                }
                if (currentNode !== root && currentNode.matches(selector)) {
                    result.push(currentNode);
                }
            } while (iter.nextNode());
        };
        if (element instanceof Document) {
            element = element.documentElement;
        }
        collect(element);
        return result;
    },
});
const xpathHandler = internalizeCustomQueryHandler({
    queryOne: (element, selector) => {
        const doc = element.ownerDocument || document;
        const result = doc.evaluate(selector, element, null, XPathResult.FIRST_ORDERED_NODE_TYPE);
        return result.singleNodeValue;
    },
    queryAll: (element, selector) => {
        const doc = element.ownerDocument || document;
        const iterator = doc.evaluate(selector, element, null, XPathResult.ORDERED_NODE_ITERATOR_TYPE);
        const array = [];
        let item;
        while ((item = iterator.iterateNext())) {
            array.push(item);
        }
        return array;
    },
});
const INTERNAL_QUERY_HANDLERS = new Map([
    ['aria', { handler: ariaHandler }],
    ['pierce', { handler: pierceHandler }],
    ['xpath', { handler: xpathHandler }],
]);
const QUERY_HANDLERS = new Map();
/**
 * Registers a {@link CustomQueryHandler | custom query handler}.
 *
 * @remarks
 * After registration, the handler can be used everywhere where a selector is
 * expected by prepending the selection string with `<name>/`. The name is only
 * allowed to consist of lower- and upper case latin letters.
 *
 * @example
 *
 * ```
 * puppeteer.registerCustomQueryHandler('text', { … });
 * const aHandle = await page.$('text/…');
 * ```
 *
 * @param name - The name that the custom query handler will be registered
 * under.
 * @param queryHandler - The {@link CustomQueryHandler | custom query handler}
 * to register.
 *
 * @public
 */
function registerCustomQueryHandler(name, handler) {
    if (INTERNAL_QUERY_HANDLERS.has(name)) {
        throw new Error(`A query handler named "${name}" already exists`);
    }
    if (QUERY_HANDLERS.has(name)) {
        throw new Error(`A custom query handler named "${name}" already exists`);
    }
    const isValidName = /^[a-zA-Z]+$/.test(name);
    if (!isValidName) {
        throw new Error(`Custom query handler names may only contain [a-zA-Z]`);
    }
    QUERY_HANDLERS.set(name, { handler: internalizeCustomQueryHandler(handler) });
}
/**
 * @param name - The name of the query handler to unregistered.
 *
 * @public
 */
function unregisterCustomQueryHandler(name) {
    QUERY_HANDLERS.delete(name);
}
/**
 * @returns a list with the names of all registered custom query handlers.
 *
 * @public
 */
function customQueryHandlerNames() {
    return [...QUERY_HANDLERS.keys()];
}
/**
 * Clears all registered handlers.
 *
 * @public
 */
function clearCustomQueryHandlers() {
    QUERY_HANDLERS.clear();
}
const CUSTOM_QUERY_SEPARATORS = ['=', '/'];
/**
 * @internal
 */
function getQueryHandlerAndSelector(selector) {
    for (const handlerMap of [QUERY_HANDLERS, INTERNAL_QUERY_HANDLERS]) {
        for (const [name, { handler: queryHandler, transformSelector },] of handlerMap) {
            for (const separator of CUSTOM_QUERY_SEPARATORS) {
                const prefix = `${name}${separator}`;
                if (selector.startsWith(prefix)) {
                    selector = selector.slice(prefix.length);
                    if (transformSelector) {
                        selector = transformSelector(selector);
                    }
                    return { updatedSelector: selector, queryHandler };
                }
            }
        }
    }
    return { updatedSelector: selector, queryHandler: defaultHandler };
}

var __classPrivateFieldSet$g = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$g = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ElementHandle_instances, _ElementHandle_frame, _ElementHandle_frameManager_get, _ElementHandle_page_get, _ElementHandle_scrollIntoViewIfNeeded, _ElementHandle_getOOPIFOffsets, _ElementHandle_getBoxModel, _ElementHandle_fromProtocolQuad, _ElementHandle_intersectQuadWithViewport;
const applyOffsetsToQuad = (quad, offsetX, offsetY) => {
    return quad.map(part => {
        return { x: part.x + offsetX, y: part.y + offsetY };
    });
};
/**
 * ElementHandle represents an in-page DOM element.
 *
 * @remarks
 * ElementHandles can be created with the {@link Page.$} method.
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   const hrefElement = await page.$('a');
 *   await hrefElement.click();
 *   // ...
 * })();
 * ```
 *
 * ElementHandle prevents the DOM element from being garbage-collected unless the
 * handle is {@link JSHandle.dispose | disposed}. ElementHandles are auto-disposed
 * when their origin frame gets navigated.
 *
 * ElementHandle instances can be used as arguments in {@link Page.$eval} and
 * {@link Page.evaluate} methods.
 *
 * If you're using TypeScript, ElementHandle takes a generic argument that
 * denotes the type of element the handle is holding within. For example, if you
 * have a handle to a `<select>` element, you can type it as
 * `ElementHandle<HTMLSelectElement>` and you get some nicer type checks.
 *
 * @public
 */
class ElementHandle extends JSHandle {
    /**
     * @internal
     */
    constructor(context, remoteObject, frame) {
        super(context, remoteObject);
        _ElementHandle_instances.add(this);
        _ElementHandle_frame.set(this, void 0);
        __classPrivateFieldSet$g(this, _ElementHandle_frame, frame, "f");
    }
    /**
     * @internal
     */
    get frame() {
        return __classPrivateFieldGet$g(this, _ElementHandle_frame, "f");
    }
    /**
     * Queries the current element for an element matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns A {@link ElementHandle | element handle} to the first element
     * matching the given selector. Otherwise, `null`.
     */
    async $(selector) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.queryOne, 'Cannot handle queries for a single element with the given selector');
        return (await queryHandler.queryOne(this, updatedSelector));
    }
    /**
     * Queries the current element for all elements matching the given selector.
     *
     * @param selector - The selector to query for.
     * @returns An array of {@link ElementHandle | element handles} that point to
     * elements matching the given selector.
     */
    async $$(selector) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.queryAll, 'Cannot handle queries for a multiple element with the given selector');
        return (await queryHandler.queryAll(this, updatedSelector));
    }
    /**
     * Runs the given function on the first element matching the given selector in
     * the current element.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     *
     * ```ts
     * const tweetHandle = await page.$('.tweet');
     * expect(await tweetHandle.$eval('.like', node => node.innerText)).toBe(
     *   '100'
     * );
     * expect(await tweetHandle.$eval('.retweets', node => node.innerText)).toBe(
     *   '10'
     * );
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in this element's page's
     * context. The first element matching the selector will be passed in as the
     * first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $eval(selector, pageFunction, ...args) {
        const elementHandle = await this.$(selector);
        if (!elementHandle) {
            throw new Error(`Error: failed to find element matching selector "${selector}"`);
        }
        const result = await elementHandle.evaluate(pageFunction, ...args);
        await elementHandle.dispose();
        return result;
    }
    /**
     * Runs the given function on an array of elements matching the given selector
     * in the current element.
     *
     * If the given function returns a promise, then this method will wait till
     * the promise resolves.
     *
     * @example
     * HTML:
     *
     * ```html
     * <div class="feed">
     *   <div class="tweet">Hello!</div>
     *   <div class="tweet">Hi!</div>
     * </div>
     * ```
     *
     * JavaScript:
     *
     * ```js
     * const feedHandle = await page.$('.feed');
     * expect(
     *   await feedHandle.$$eval('.tweet', nodes => nodes.map(n => n.innerText))
     * ).toEqual(['Hello!', 'Hi!']);
     * ```
     *
     * @param selector - The selector to query for.
     * @param pageFunction - The function to be evaluated in the element's page's
     * context. An array of elements matching the given selector will be passed to
     * the function as its first argument.
     * @param args - Additional arguments to pass to `pageFunction`.
     * @returns A promise to the result of the function.
     */
    async $$eval(selector, pageFunction, ...args) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.queryAll, 'Cannot handle queries for a multiple element with the given selector');
        const handles = (await queryHandler.queryAll(this, updatedSelector));
        const elements = await this.evaluateHandle((_, ...elements) => {
            return elements;
        }, ...handles);
        const [result] = await Promise.all([
            elements.evaluate(pageFunction, ...args),
            ...handles.map(handle => {
                return handle.dispose();
            }),
        ]);
        await elements.dispose();
        return result;
    }
    /**
     * @deprecated Use {@link ElementHandle.$$} with the `xpath` prefix.
     *
     * The method evaluates the XPath expression relative to the elementHandle.
     * If there are no such elements, the method will resolve to an empty array.
     * @param expression - Expression to {@link https://developer.mozilla.org/en-US/docs/Web/API/Document/evaluate | evaluate}
     */
    async $x(expression) {
        if (expression.startsWith('//')) {
            expression = `.${expression}`;
        }
        return this.$$(`xpath/${expression}`);
    }
    /**
     * Wait for an element matching the given selector to appear in the current
     * element.
     *
     * Unlike {@link Frame.waitForSelector}, this method does not work across
     * navigations or if the element is detached from DOM.
     *
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .mainFrame()
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - The selector to query and wait for.
     * @param options - Options for customizing waiting behavior.
     * @returns An element matching the given selector.
     * @throws Throws if an element matching the given selector doesn't appear.
     */
    async waitForSelector(selector, options = {}) {
        const { updatedSelector, queryHandler } = getQueryHandlerAndSelector(selector);
        assert(queryHandler.waitFor, 'Query handler does not support waiting');
        return (await queryHandler.waitFor(this, updatedSelector, options));
    }
    /**
     * @deprecated Use {@link ElementHandle.waitForSelector} with the `xpath`
     * prefix.
     *
     * Wait for the `xpath` within the element. If at the moment of calling the
     * method the `xpath` already exists, the method will return immediately. If
     * the `xpath` doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * If `xpath` starts with `//` instead of `.//`, the dot will be appended
     * automatically.
     *
     * This method works across navigation
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .waitForXPath('//img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param xpath - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/XPath | xpath} of an
     * element to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when element specified by xpath string is
     * added to DOM. Resolves to `null` if waiting for `hidden: true` and xpath is
     * not found in DOM.
     * @remarks
     * The optional Argument `options` have properties:
     *
     * - `visible`: A boolean to wait for element to be present in DOM and to be
     *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
     *   properties. Defaults to `false`.
     *
     * - `hidden`: A boolean wait for element to not be found in the DOM or to be
     *   hidden, i.e. have `display: none` or `visibility: hidden` CSS properties.
     *   Defaults to `false`.
     *
     * - `timeout`: A number which is maximum time to wait for in milliseconds.
     *   Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The
     *   default value can be changed by using the {@link Page.setDefaultTimeout}
     *   method.
     */
    async waitForXPath(xpath, options = {}) {
        if (xpath.startsWith('//')) {
            xpath = `.${xpath}`;
        }
        return this.waitForSelector(`xpath/${xpath}`, options);
    }
    asElement() {
        return this;
    }
    /**
     * Resolves to the content frame for element handles referencing
     * iframe nodes, or null otherwise
     */
    async contentFrame() {
        const nodeInfo = await this.client.send('DOM.describeNode', {
            objectId: this.remoteObject().objectId,
        });
        if (typeof nodeInfo.node.frameId !== 'string') {
            return null;
        }
        return __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_frameManager_get).frame(nodeInfo.node.frameId);
    }
    /**
     * Returns the middle point within an element unless a specific offset is provided.
     */
    async clickablePoint(offset) {
        const [result, layoutMetrics] = await Promise.all([
            this.client
                .send('DOM.getContentQuads', {
                objectId: this.remoteObject().objectId,
            })
                .catch(debugError),
            __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get)._client().send('Page.getLayoutMetrics'),
        ]);
        if (!result || !result.quads.length) {
            throw new Error('Node is either not clickable or not an HTMLElement');
        }
        // Filter out quads that have too small area to click into.
        // Fallback to `layoutViewport` in case of using Firefox.
        const { clientWidth, clientHeight } = layoutMetrics.cssLayoutViewport || layoutMetrics.layoutViewport;
        const { offsetX, offsetY } = await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet$g(this, _ElementHandle_frame, "f"));
        const quads = result.quads
            .map(quad => {
            return __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, quad);
        })
            .map(quad => {
            return applyOffsetsToQuad(quad, offsetX, offsetY);
        })
            .map(quad => {
            return __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_intersectQuadWithViewport).call(this, quad, clientWidth, clientHeight);
        })
            .filter(quad => {
            return computeQuadArea(quad) > 1;
        });
        if (!quads.length) {
            throw new Error('Node is either not clickable or not an HTMLElement');
        }
        const quad = quads[0];
        if (offset) {
            // Return the point of the first quad identified by offset.
            let minX = Number.MAX_SAFE_INTEGER;
            let minY = Number.MAX_SAFE_INTEGER;
            for (const point of quad) {
                if (point.x < minX) {
                    minX = point.x;
                }
                if (point.y < minY) {
                    minY = point.y;
                }
            }
            if (minX !== Number.MAX_SAFE_INTEGER &&
                minY !== Number.MAX_SAFE_INTEGER) {
                return {
                    x: minX + offset.x,
                    y: minY + offset.y,
                };
            }
        }
        // Return the middle point of the first quad.
        let x = 0;
        let y = 0;
        for (const point of quad) {
            x += point.x;
            y += point.y;
        }
        return {
            x: x / 4,
            y: y / 4,
        };
    }
    /**
     * This method scrolls element into view if needed, and then
     * uses {@link Page.mouse} to hover over the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async hover() {
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const { x, y } = await this.clickablePoint();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.move(x, y);
    }
    /**
     * This method scrolls element into view if needed, and then
     * uses {@link Page.mouse} to click in the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async click(options = {}) {
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const { x, y } = await this.clickablePoint(options.offset);
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.click(x, y, options);
    }
    /**
     * This method creates and captures a dragevent from the element.
     */
    async drag(target) {
        assert(__classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).isDragInterceptionEnabled(), 'Drag Interception is not enabled!');
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const start = await this.clickablePoint();
        return await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.drag(start, target);
    }
    /**
     * This method creates a `dragenter` event on the element.
     */
    async dragEnter(data = { items: [], dragOperationsMask: 1 }) {
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const target = await this.clickablePoint();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.dragEnter(target, data);
    }
    /**
     * This method creates a `dragover` event on the element.
     */
    async dragOver(data = { items: [], dragOperationsMask: 1 }) {
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const target = await this.clickablePoint();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.dragOver(target, data);
    }
    /**
     * This method triggers a drop on the element.
     */
    async drop(data = { items: [], dragOperationsMask: 1 }) {
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const destination = await this.clickablePoint();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.drop(destination, data);
    }
    /**
     * This method triggers a dragenter, dragover, and drop on the element.
     */
    async dragAndDrop(target, options) {
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const startPoint = await this.clickablePoint();
        const targetPoint = await target.clickablePoint();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).mouse.dragAndDrop(startPoint, targetPoint, options);
    }
    /**
     * Triggers a `change` and `input` event once all the provided options have been
     * selected. If there's no `<select>` element matching `selector`, the method
     * throws an error.
     *
     * @example
     *
     * ```ts
     * handle.select('blue'); // single selection
     * handle.select('red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param values - Values of options to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first
     * one is taken into account.
     */
    async select(...values) {
        for (const value of values) {
            assert(isString(value), 'Values must be strings. Found value "' +
                value +
                '" of type "' +
                typeof value +
                '"');
        }
        return this.evaluate((element, vals) => {
            const values = new Set(vals);
            if (!(element instanceof HTMLSelectElement)) {
                throw new Error('Element is not a <select> element.');
            }
            const selectedValues = new Set();
            if (!element.multiple) {
                for (const option of element.options) {
                    option.selected = false;
                }
                for (const option of element.options) {
                    if (values.has(option.value)) {
                        option.selected = true;
                        selectedValues.add(option.value);
                        break;
                    }
                }
            }
            else {
                for (const option of element.options) {
                    option.selected = values.has(option.value);
                    if (option.selected) {
                        selectedValues.add(option.value);
                    }
                }
            }
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
            return [...selectedValues.values()];
        }, values);
    }
    /**
     * This method expects `elementHandle` to point to an
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input | input element}.
     *
     * @param filePaths - Sets the value of the file input to these paths.
     * If a path is relative, then it is resolved against the
     * {@link https://nodejs.org/api/process.html#process_process_cwd | current working directory}.
     * Note for locals script connecting to remote chrome environments,
     * paths must be absolute.
     */
    async uploadFile(...filePaths) {
        const isMultiple = await this.evaluate(element => {
            return element.multiple;
        });
        assert(filePaths.length <= 1 || isMultiple, 'Multiple file uploads only work with <input type=file multiple>');
        // Locate all files and confirm that they exist.
        let path;
        try {
            path = await import('path');
        }
        catch (error) {
            if (error instanceof TypeError) {
                throw new Error(`JSHandle#uploadFile can only be used in Node-like environments.`);
            }
            throw error;
        }
        const files = filePaths.map(filePath => {
            if (path.win32.isAbsolute(filePath) || path.posix.isAbsolute(filePath)) {
                return filePath;
            }
            else {
                return path.resolve(filePath);
            }
        });
        const { objectId } = this.remoteObject();
        const { node } = await this.client.send('DOM.describeNode', { objectId });
        const { backendNodeId } = node;
        /*  The zero-length array is a special case, it seems that
             DOM.setFileInputFiles does not actually update the files in that case,
             so the solution is to eval the element value to a new FileList directly.
         */
        if (files.length === 0) {
            await this.evaluate(element => {
                element.files = new DataTransfer().files;
                // Dispatch events for this case because it should behave akin to a user action.
                element.dispatchEvent(new Event('input', { bubbles: true }));
                element.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
        else {
            await this.client.send('DOM.setFileInputFiles', {
                objectId,
                files,
                backendNodeId,
            });
        }
    }
    /**
     * This method scrolls element into view if needed, and then uses
     * {@link Touchscreen.tap} to tap in the center of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async tap() {
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        const { x, y } = await this.clickablePoint();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).touchscreen.tap(x, y);
    }
    /**
     * Calls {@link https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/focus | focus} on the element.
     */
    async focus() {
        await this.evaluate(element => {
            if (!(element instanceof HTMLElement)) {
                throw new Error('Cannot focus non-HTMLElement');
            }
            return element.focus();
        });
    }
    /**
     * Focuses the element, and then sends a `keydown`, `keypress`/`input`, and
     * `keyup` event for each character in the text.
     *
     * To press a special key, like `Control` or `ArrowDown`,
     * use {@link ElementHandle.press}.
     *
     * @example
     *
     * ```ts
     * await elementHandle.type('Hello'); // Types instantly
     * await elementHandle.type('World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @example
     * An example of typing into a text field and then submitting the form:
     *
     * ```ts
     * const elementHandle = await page.$('input');
     * await elementHandle.type('some text');
     * await elementHandle.press('Enter');
     * ```
     */
    async type(text, options) {
        await this.focus();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).keyboard.type(text, options);
    }
    /**
     * Focuses the element, and then uses {@link Keyboard.down} and {@link Keyboard.up}.
     *
     * @remarks
     * If `key` is a single character and no modifier keys besides `Shift`
     * are being held down, a `keypress`/`input` event will also be generated.
     * The `text` option can be specified to force an input event to be generated.
     *
     * **NOTE** Modifier keys DO affect `elementHandle.press`. Holding down `Shift`
     * will type the text in upper case.
     *
     * @param key - Name of key to press, such as `ArrowLeft`.
     * See {@link KeyInput} for a list of all key names.
     */
    async press(key, options) {
        await this.focus();
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).keyboard.press(key, options);
    }
    /**
     * This method returns the bounding box of the element (relative to the main frame),
     * or `null` if the element is not visible.
     */
    async boundingBox() {
        const result = await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_getBoxModel).call(this);
        if (!result) {
            return null;
        }
        const { offsetX, offsetY } = await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet$g(this, _ElementHandle_frame, "f"));
        const quad = result.model.border;
        const x = Math.min(quad[0], quad[2], quad[4], quad[6]);
        const y = Math.min(quad[1], quad[3], quad[5], quad[7]);
        const width = Math.max(quad[0], quad[2], quad[4], quad[6]) - x;
        const height = Math.max(quad[1], quad[3], quad[5], quad[7]) - y;
        return { x: x + offsetX, y: y + offsetY, width, height };
    }
    /**
     * This method returns boxes of the element, or `null` if the element is not visible.
     *
     * @remarks
     *
     * Boxes are represented as an array of points;
     * Each Point is an object `{x, y}`. Box points are sorted clock-wise.
     */
    async boxModel() {
        const result = await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_getBoxModel).call(this);
        if (!result) {
            return null;
        }
        const { offsetX, offsetY } = await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_getOOPIFOffsets).call(this, __classPrivateFieldGet$g(this, _ElementHandle_frame, "f"));
        const { content, padding, border, margin, width, height } = result.model;
        return {
            content: applyOffsetsToQuad(__classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, content), offsetX, offsetY),
            padding: applyOffsetsToQuad(__classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, padding), offsetX, offsetY),
            border: applyOffsetsToQuad(__classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, border), offsetX, offsetY),
            margin: applyOffsetsToQuad(__classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, margin), offsetX, offsetY),
            width,
            height,
        };
    }
    /**
     * This method scrolls element into view if needed, and then uses
     * {@link Page.screenshot} to take a screenshot of the element.
     * If the element is detached from DOM, the method throws an error.
     */
    async screenshot(options = {}) {
        let needsViewportReset = false;
        let boundingBox = await this.boundingBox();
        assert(boundingBox, 'Node is either not visible or not an HTMLElement');
        const viewport = __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).viewport();
        if (viewport &&
            (boundingBox.width > viewport.width ||
                boundingBox.height > viewport.height)) {
            const newViewport = {
                width: Math.max(viewport.width, Math.ceil(boundingBox.width)),
                height: Math.max(viewport.height, Math.ceil(boundingBox.height)),
            };
            await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).setViewport(Object.assign({}, viewport, newViewport));
            needsViewportReset = true;
        }
        await __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_scrollIntoViewIfNeeded).call(this);
        boundingBox = await this.boundingBox();
        assert(boundingBox, 'Node is either not visible or not an HTMLElement');
        assert(boundingBox.width !== 0, 'Node has 0 width.');
        assert(boundingBox.height !== 0, 'Node has 0 height.');
        const layoutMetrics = await this.client.send('Page.getLayoutMetrics');
        // Fallback to `layoutViewport` in case of using Firefox.
        const { pageX, pageY } = layoutMetrics.cssVisualViewport || layoutMetrics.layoutViewport;
        const clip = Object.assign({}, boundingBox);
        clip.x += pageX;
        clip.y += pageY;
        const imageData = await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).screenshot(Object.assign({}, {
            clip,
        }, options));
        if (needsViewportReset && viewport) {
            await __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).setViewport(viewport);
        }
        return imageData;
    }
    /**
     * Resolves to true if the element is visible in the current viewport.
     */
    async isIntersectingViewport(options) {
        const { threshold = 0 } = options !== null && options !== void 0 ? options : {};
        return await this.evaluate(async (element, threshold) => {
            const visibleRatio = await new Promise(resolve => {
                const observer = new IntersectionObserver(entries => {
                    resolve(entries[0].intersectionRatio);
                    observer.disconnect();
                });
                observer.observe(element);
            });
            return threshold === 1 ? visibleRatio === 1 : visibleRatio > threshold;
        }, threshold);
    }
}
_ElementHandle_frame = new WeakMap(), _ElementHandle_instances = new WeakSet(), _ElementHandle_frameManager_get = function _ElementHandle_frameManager_get() {
    return __classPrivateFieldGet$g(this, _ElementHandle_frame, "f")._frameManager;
}, _ElementHandle_page_get = function _ElementHandle_page_get() {
    return __classPrivateFieldGet$g(this, _ElementHandle_frame, "f").page();
}, _ElementHandle_scrollIntoViewIfNeeded = async function _ElementHandle_scrollIntoViewIfNeeded() {
    const error = await this.evaluate(async (element) => {
        if (!element.isConnected) {
            return 'Node is detached from document';
        }
        if (element.nodeType !== Node.ELEMENT_NODE) {
            return 'Node is not of type HTMLElement';
        }
        return;
    });
    if (error) {
        throw new Error(error);
    }
    try {
        await this.client.send('DOM.scrollIntoViewIfNeeded', {
            objectId: this.remoteObject().objectId,
        });
    }
    catch (_err) {
        // Fallback to Element.scrollIntoView if DOM.scrollIntoViewIfNeeded is not supported
        await this.evaluate(async (element, pageJavascriptEnabled) => {
            const visibleRatio = async () => {
                return await new Promise(resolve => {
                    const observer = new IntersectionObserver(entries => {
                        resolve(entries[0].intersectionRatio);
                        observer.disconnect();
                    });
                    observer.observe(element);
                });
            };
            if (!pageJavascriptEnabled || (await visibleRatio()) !== 1.0) {
                element.scrollIntoView({
                    block: 'center',
                    inline: 'center',
                    // @ts-expect-error Chrome still supports behavior: instant but
                    // it's not in the spec so TS shouts We don't want to make this
                    // breaking change in Puppeteer yet so we'll ignore the line.
                    behavior: 'instant',
                });
            }
        }, __classPrivateFieldGet$g(this, _ElementHandle_instances, "a", _ElementHandle_page_get).isJavaScriptEnabled());
    }
}, _ElementHandle_getOOPIFOffsets = async function _ElementHandle_getOOPIFOffsets(frame) {
    let offsetX = 0;
    let offsetY = 0;
    let currentFrame = frame;
    while (currentFrame && currentFrame.parentFrame()) {
        const parent = currentFrame.parentFrame();
        if (!currentFrame.isOOPFrame() || !parent) {
            currentFrame = parent;
            continue;
        }
        const { backendNodeId } = await parent._client().send('DOM.getFrameOwner', {
            frameId: currentFrame._id,
        });
        const result = await parent._client().send('DOM.getBoxModel', {
            backendNodeId: backendNodeId,
        });
        if (!result) {
            break;
        }
        const contentBoxQuad = result.model.content;
        const topLeftCorner = __classPrivateFieldGet$g(this, _ElementHandle_instances, "m", _ElementHandle_fromProtocolQuad).call(this, contentBoxQuad)[0];
        offsetX += topLeftCorner.x;
        offsetY += topLeftCorner.y;
        currentFrame = parent;
    }
    return { offsetX, offsetY };
}, _ElementHandle_getBoxModel = function _ElementHandle_getBoxModel() {
    const params = {
        objectId: this.remoteObject().objectId,
    };
    return this.client.send('DOM.getBoxModel', params).catch(error => {
        return debugError(error);
    });
}, _ElementHandle_fromProtocolQuad = function _ElementHandle_fromProtocolQuad(quad) {
    return [
        { x: quad[0], y: quad[1] },
        { x: quad[2], y: quad[3] },
        { x: quad[4], y: quad[5] },
        { x: quad[6], y: quad[7] },
    ];
}, _ElementHandle_intersectQuadWithViewport = function _ElementHandle_intersectQuadWithViewport(quad, width, height) {
    return quad.map(point => {
        return {
            x: Math.min(Math.max(point.x, 0), width),
            y: Math.min(Math.max(point.y, 0), height),
        };
    });
};
function computeQuadArea(quad) {
    /* Compute sum of all directed areas of adjacent triangles
       https://en.wikipedia.org/wiki/Polygon#Simple_polygons
     */
    let area = 0;
    for (let i = 0; i < quad.length; ++i) {
        const p1 = quad[i];
        const p2 = quad[(i + 1) % quad.length];
        area += (p1.x * p2.y - p2.x * p1.y) / 2;
    }
    return Math.abs(area);
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const debugError = debug('puppeteer:error');
/**
 * @internal
 */
function getExceptionMessage(exceptionDetails) {
    if (exceptionDetails.exception) {
        return (exceptionDetails.exception.description || exceptionDetails.exception.value);
    }
    let message = exceptionDetails.text;
    if (exceptionDetails.stackTrace) {
        for (const callframe of exceptionDetails.stackTrace.callFrames) {
            const location = callframe.url +
                ':' +
                callframe.lineNumber +
                ':' +
                callframe.columnNumber;
            const functionName = callframe.functionName || '<anonymous>';
            message += `\n    at ${functionName} (${location})`;
        }
    }
    return message;
}
/**
 * @internal
 */
function valueFromRemoteObject(remoteObject) {
    assert(!remoteObject.objectId, 'Cannot extract value when objectId is given');
    if (remoteObject.unserializableValue) {
        if (remoteObject.type === 'bigint' && typeof BigInt !== 'undefined') {
            return BigInt(remoteObject.unserializableValue.replace('n', ''));
        }
        switch (remoteObject.unserializableValue) {
            case '-0':
                return -0;
            case 'NaN':
                return NaN;
            case 'Infinity':
                return Infinity;
            case '-Infinity':
                return -Infinity;
            default:
                throw new Error('Unsupported unserializable value: ' +
                    remoteObject.unserializableValue);
        }
    }
    return remoteObject.value;
}
/**
 * @internal
 */
async function releaseObject(client, remoteObject) {
    if (!remoteObject.objectId) {
        return;
    }
    await client
        .send('Runtime.releaseObject', { objectId: remoteObject.objectId })
        .catch(error => {
        // Exceptions might happen in case of a page been navigated or closed.
        // Swallow these since they are harmless and we don't leak anything in this case.
        debugError(error);
    });
}
/**
 * @internal
 */
function addEventListener(emitter, eventName, handler) {
    emitter.on(eventName, handler);
    return { emitter, eventName, handler };
}
/**
 * @internal
 */
function removeEventListeners(listeners) {
    for (const listener of listeners) {
        listener.emitter.removeListener(listener.eventName, listener.handler);
    }
    listeners.length = 0;
}
/**
 * @internal
 */
const isString = (obj) => {
    return typeof obj === 'string' || obj instanceof String;
};
/**
 * @internal
 */
const isNumber = (obj) => {
    return typeof obj === 'number' || obj instanceof Number;
};
/**
 * @internal
 */
async function waitForEvent(emitter, eventName, predicate, timeout, abortPromise) {
    let eventTimeout;
    let resolveCallback;
    let rejectCallback;
    const promise = new Promise((resolve, reject) => {
        resolveCallback = resolve;
        rejectCallback = reject;
    });
    const listener = addEventListener(emitter, eventName, async (event) => {
        if (!(await predicate(event))) {
            return;
        }
        resolveCallback(event);
    });
    if (timeout) {
        eventTimeout = setTimeout(() => {
            rejectCallback(new TimeoutError('Timeout exceeded while waiting for event'));
        }, timeout);
    }
    function cleanup() {
        removeEventListeners([listener]);
        clearTimeout(eventTimeout);
    }
    const result = await Promise.race([promise, abortPromise]).then(r => {
        cleanup();
        return r;
    }, error => {
        cleanup();
        throw error;
    });
    if (isErrorLike(result)) {
        throw result;
    }
    return result;
}
/**
 * @internal
 */
function createJSHandle(context, remoteObject) {
    if (remoteObject.subtype === 'node' && context._world) {
        return new ElementHandle(context, remoteObject, context._world.frame());
    }
    return new JSHandle(context, remoteObject);
}
/**
 * @internal
 */
function evaluationString(fun, ...args) {
    if (isString(fun)) {
        assert(args.length === 0, 'Cannot evaluate a string with arguments');
        return fun;
    }
    function serializeArgument(arg) {
        if (Object.is(arg, undefined)) {
            return 'undefined';
        }
        return JSON.stringify(arg);
    }
    return `(${fun})(${args.map(serializeArgument).join(',')})`;
}
/**
 * @internal
 */
function pageBindingInitString(type, name) {
    function addPageBinding(type, bindingName) {
        /* Cast window to any here as we're about to add properties to it
         * via win[bindingName] which TypeScript doesn't like.
         */
        const win = window;
        const binding = win[bindingName];
        win[bindingName] = (...args) => {
            const me = window[bindingName];
            let callbacks = me.callbacks;
            if (!callbacks) {
                callbacks = new Map();
                me.callbacks = callbacks;
            }
            const seq = (me.lastSeq || 0) + 1;
            me.lastSeq = seq;
            const promise = new Promise((resolve, reject) => {
                return callbacks.set(seq, { resolve, reject });
            });
            binding(JSON.stringify({ type, name: bindingName, seq, args }));
            return promise;
        };
    }
    return evaluationString(addPageBinding, type, name);
}
/**
 * @internal
 */
function pageBindingDeliverResultString(name, seq, result) {
    function deliverResult(name, seq, result) {
        window[name].callbacks.get(seq).resolve(result);
        window[name].callbacks.delete(seq);
    }
    return evaluationString(deliverResult, name, seq, result);
}
/**
 * @internal
 */
function pageBindingDeliverErrorString(name, seq, message, stack) {
    function deliverError(name, seq, message, stack) {
        const error = new Error(message);
        error.stack = stack;
        window[name].callbacks.get(seq).reject(error);
        window[name].callbacks.delete(seq);
    }
    return evaluationString(deliverError, name, seq, message, stack);
}
/**
 * @internal
 */
function pageBindingDeliverErrorValueString(name, seq, value) {
    function deliverErrorValue(name, seq, value) {
        window[name].callbacks.get(seq).reject(value);
        window[name].callbacks.delete(seq);
    }
    return evaluationString(deliverErrorValue, name, seq, value);
}
/**
 * @internal
 */
function makePredicateString(predicate, predicateQueryHandler) {
    function checkWaitForOptions(node, waitForVisible, waitForHidden) {
        if (!node) {
            return waitForHidden;
        }
        if (!waitForVisible && !waitForHidden) {
            return node;
        }
        const element = node.nodeType === Node.TEXT_NODE
            ? node.parentElement
            : node;
        const style = window.getComputedStyle(element);
        const isVisible = style && style.visibility !== 'hidden' && hasVisibleBoundingBox();
        const success = waitForVisible === isVisible || waitForHidden === !isVisible;
        return success ? node : null;
        function hasVisibleBoundingBox() {
            const rect = element.getBoundingClientRect();
            return !!(rect.top || rect.bottom || rect.width || rect.height);
        }
    }
    return `
    (() => {
      const predicateQueryHandler = ${predicateQueryHandler};
      const checkWaitForOptions = ${checkWaitForOptions};
      return (${predicate})(...args)
    })() `;
}
/**
 * @internal
 */
async function waitWithTimeout(promise, taskName, timeout) {
    let reject;
    const timeoutError = new TimeoutError(`waiting for ${taskName} failed: timeout ${timeout}ms exceeded`);
    const timeoutPromise = new Promise((_res, rej) => {
        return (reject = rej);
    });
    let timeoutTimer = null;
    if (timeout) {
        timeoutTimer = setTimeout(() => {
            return reject(timeoutError);
        }, timeout);
    }
    try {
        return await Promise.race([promise, timeoutPromise]);
    }
    finally {
        if (timeoutTimer) {
            clearTimeout(timeoutTimer);
        }
    }
}
/**
 * @internal
 */
async function getReadableFromProtocolStream(client, handle) {
    // TODO: Once Node 18 becomes the lowest supported version, we can migrate to
    // ReadableStream.
    if (!isNode) {
        throw new Error('Cannot create a stream outside of Node.js environment.');
    }
    const { Readable } = await import('stream');
    let eof = false;
    return new Readable({
        async read(size) {
            if (eof) {
                return;
            }
            const response = await client.send('IO.read', { handle, size });
            this.push(response.data, response.base64Encoded ? 'base64' : undefined);
            if (response.eof) {
                eof = true;
                await client.send('IO.close', { handle });
                this.push(null);
            }
        },
    });
}

/**
 * Copyright 2018 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$f = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$f = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Accessibility_client, _AXNode_instances, _AXNode_richlyEditable, _AXNode_editable, _AXNode_focusable, _AXNode_hidden, _AXNode_name, _AXNode_role, _AXNode_ignored, _AXNode_cachedHasFocusableChild, _AXNode_isPlainTextField, _AXNode_isTextOnlyObject, _AXNode_hasFocusableChild;
/**
 * The Accessibility class provides methods for inspecting Chromium's
 * accessibility tree. The accessibility tree is used by assistive technology
 * such as {@link https://en.wikipedia.org/wiki/Screen_reader | screen readers} or
 * {@link https://en.wikipedia.org/wiki/Switch_access | switches}.
 *
 * @remarks
 *
 * Accessibility is a very platform-specific thing. On different platforms,
 * there are different screen readers that might have wildly different output.
 *
 * Blink - Chrome's rendering engine - has a concept of "accessibility tree",
 * which is then translated into different platform-specific APIs. Accessibility
 * namespace gives users access to the Blink Accessibility Tree.
 *
 * Most of the accessibility tree gets filtered out when converting from Blink
 * AX Tree to Platform-specific AX-Tree or by assistive technologies themselves.
 * By default, Puppeteer tries to approximate this filtering, exposing only
 * the "interesting" nodes of the tree.
 *
 * @public
 */
class Accessibility {
    /**
     * @internal
     */
    constructor(client) {
        _Accessibility_client.set(this, void 0);
        __classPrivateFieldSet$f(this, _Accessibility_client, client, "f");
    }
    /**
     * Captures the current state of the accessibility tree.
     * The returned object represents the root accessible node of the page.
     *
     * @remarks
     *
     * **NOTE** The Chromium accessibility tree contains nodes that go unused on
     * most platforms and by most screen readers. Puppeteer will discard them as
     * well for an easier to process tree, unless `interestingOnly` is set to
     * `false`.
     *
     * @example
     * An example of dumping the entire accessibility tree:
     *
     * ```ts
     * const snapshot = await page.accessibility.snapshot();
     * console.log(snapshot);
     * ```
     *
     * @example
     * An example of logging the focused node's name:
     *
     * ```ts
     * const snapshot = await page.accessibility.snapshot();
     * const node = findFocusedNode(snapshot);
     * console.log(node && node.name);
     *
     * function findFocusedNode(node) {
     *   if (node.focused) return node;
     *   for (const child of node.children || []) {
     *     const foundNode = findFocusedNode(child);
     *     return foundNode;
     *   }
     *   return null;
     * }
     * ```
     *
     * @returns An AXNode object representing the snapshot.
     */
    async snapshot(options = {}) {
        var _a, _b;
        const { interestingOnly = true, root = null } = options;
        const { nodes } = await __classPrivateFieldGet$f(this, _Accessibility_client, "f").send('Accessibility.getFullAXTree');
        let backendNodeId;
        if (root) {
            const { node } = await __classPrivateFieldGet$f(this, _Accessibility_client, "f").send('DOM.describeNode', {
                objectId: root.remoteObject().objectId,
            });
            backendNodeId = node.backendNodeId;
        }
        const defaultRoot = AXNode.createTree(nodes);
        let needle = defaultRoot;
        if (backendNodeId) {
            needle = defaultRoot.find(node => {
                return node.payload.backendDOMNodeId === backendNodeId;
            });
            if (!needle) {
                return null;
            }
        }
        if (!interestingOnly) {
            return (_a = this.serializeTree(needle)[0]) !== null && _a !== void 0 ? _a : null;
        }
        const interestingNodes = new Set();
        this.collectInterestingNodes(interestingNodes, defaultRoot, false);
        if (!interestingNodes.has(needle)) {
            return null;
        }
        return (_b = this.serializeTree(needle, interestingNodes)[0]) !== null && _b !== void 0 ? _b : null;
    }
    serializeTree(node, interestingNodes) {
        const children = [];
        for (const child of node.children) {
            children.push(...this.serializeTree(child, interestingNodes));
        }
        if (interestingNodes && !interestingNodes.has(node)) {
            return children;
        }
        const serializedNode = node.serialize();
        if (children.length) {
            serializedNode.children = children;
        }
        return [serializedNode];
    }
    collectInterestingNodes(collection, node, insideControl) {
        if (node.isInteresting(insideControl)) {
            collection.add(node);
        }
        if (node.isLeafNode()) {
            return;
        }
        insideControl = insideControl || node.isControl();
        for (const child of node.children) {
            this.collectInterestingNodes(collection, child, insideControl);
        }
    }
}
_Accessibility_client = new WeakMap();
class AXNode {
    constructor(payload) {
        _AXNode_instances.add(this);
        this.children = [];
        _AXNode_richlyEditable.set(this, false);
        _AXNode_editable.set(this, false);
        _AXNode_focusable.set(this, false);
        _AXNode_hidden.set(this, false);
        _AXNode_name.set(this, void 0);
        _AXNode_role.set(this, void 0);
        _AXNode_ignored.set(this, void 0);
        _AXNode_cachedHasFocusableChild.set(this, void 0);
        this.payload = payload;
        __classPrivateFieldSet$f(this, _AXNode_name, this.payload.name ? this.payload.name.value : '', "f");
        __classPrivateFieldSet$f(this, _AXNode_role, this.payload.role ? this.payload.role.value : 'Unknown', "f");
        __classPrivateFieldSet$f(this, _AXNode_ignored, this.payload.ignored, "f");
        for (const property of this.payload.properties || []) {
            if (property.name === 'editable') {
                __classPrivateFieldSet$f(this, _AXNode_richlyEditable, property.value.value === 'richtext', "f");
                __classPrivateFieldSet$f(this, _AXNode_editable, true, "f");
            }
            if (property.name === 'focusable') {
                __classPrivateFieldSet$f(this, _AXNode_focusable, property.value.value, "f");
            }
            if (property.name === 'hidden') {
                __classPrivateFieldSet$f(this, _AXNode_hidden, property.value.value, "f");
            }
        }
    }
    find(predicate) {
        if (predicate(this)) {
            return this;
        }
        for (const child of this.children) {
            const result = child.find(predicate);
            if (result) {
                return result;
            }
        }
        return null;
    }
    isLeafNode() {
        if (!this.children.length) {
            return true;
        }
        // These types of objects may have children that we use as internal
        // implementation details, but we want to expose them as leaves to platform
        // accessibility APIs because screen readers might be confused if they find
        // any children.
        if (__classPrivateFieldGet$f(this, _AXNode_instances, "m", _AXNode_isPlainTextField).call(this) || __classPrivateFieldGet$f(this, _AXNode_instances, "m", _AXNode_isTextOnlyObject).call(this)) {
            return true;
        }
        // Roles whose children are only presentational according to the ARIA and
        // HTML5 Specs should be hidden from screen readers.
        // (Note that whilst ARIA buttons can have only presentational children, HTML5
        // buttons are allowed to have content.)
        switch (__classPrivateFieldGet$f(this, _AXNode_role, "f")) {
            case 'doc-cover':
            case 'graphics-symbol':
            case 'img':
            case 'Meter':
            case 'scrollbar':
            case 'slider':
            case 'separator':
            case 'progressbar':
                return true;
        }
        // Here and below: Android heuristics
        if (__classPrivateFieldGet$f(this, _AXNode_instances, "m", _AXNode_hasFocusableChild).call(this)) {
            return false;
        }
        if (__classPrivateFieldGet$f(this, _AXNode_focusable, "f") && __classPrivateFieldGet$f(this, _AXNode_name, "f")) {
            return true;
        }
        if (__classPrivateFieldGet$f(this, _AXNode_role, "f") === 'heading' && __classPrivateFieldGet$f(this, _AXNode_name, "f")) {
            return true;
        }
        return false;
    }
    isControl() {
        switch (__classPrivateFieldGet$f(this, _AXNode_role, "f")) {
            case 'button':
            case 'checkbox':
            case 'ColorWell':
            case 'combobox':
            case 'DisclosureTriangle':
            case 'listbox':
            case 'menu':
            case 'menubar':
            case 'menuitem':
            case 'menuitemcheckbox':
            case 'menuitemradio':
            case 'radio':
            case 'scrollbar':
            case 'searchbox':
            case 'slider':
            case 'spinbutton':
            case 'switch':
            case 'tab':
            case 'textbox':
            case 'tree':
            case 'treeitem':
                return true;
            default:
                return false;
        }
    }
    isInteresting(insideControl) {
        const role = __classPrivateFieldGet$f(this, _AXNode_role, "f");
        if (role === 'Ignored' || __classPrivateFieldGet$f(this, _AXNode_hidden, "f") || __classPrivateFieldGet$f(this, _AXNode_ignored, "f")) {
            return false;
        }
        if (__classPrivateFieldGet$f(this, _AXNode_focusable, "f") || __classPrivateFieldGet$f(this, _AXNode_richlyEditable, "f")) {
            return true;
        }
        // If it's not focusable but has a control role, then it's interesting.
        if (this.isControl()) {
            return true;
        }
        // A non focusable child of a control is not interesting
        if (insideControl) {
            return false;
        }
        return this.isLeafNode() && !!__classPrivateFieldGet$f(this, _AXNode_name, "f");
    }
    serialize() {
        const properties = new Map();
        for (const property of this.payload.properties || []) {
            properties.set(property.name.toLowerCase(), property.value.value);
        }
        if (this.payload.name) {
            properties.set('name', this.payload.name.value);
        }
        if (this.payload.value) {
            properties.set('value', this.payload.value.value);
        }
        if (this.payload.description) {
            properties.set('description', this.payload.description.value);
        }
        const node = {
            role: __classPrivateFieldGet$f(this, _AXNode_role, "f"),
        };
        const userStringProperties = [
            'name',
            'value',
            'description',
            'keyshortcuts',
            'roledescription',
            'valuetext',
        ];
        const getUserStringPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const userStringProperty of userStringProperties) {
            if (!properties.has(userStringProperty)) {
                continue;
            }
            node[userStringProperty] = getUserStringPropertyValue(userStringProperty);
        }
        const booleanProperties = [
            'disabled',
            'expanded',
            'focused',
            'modal',
            'multiline',
            'multiselectable',
            'readonly',
            'required',
            'selected',
        ];
        const getBooleanPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const booleanProperty of booleanProperties) {
            // RootWebArea's treat focus differently than other nodes. They report whether
            // their frame  has focus, not whether focus is specifically on the root
            // node.
            if (booleanProperty === 'focused' && __classPrivateFieldGet$f(this, _AXNode_role, "f") === 'RootWebArea') {
                continue;
            }
            const value = getBooleanPropertyValue(booleanProperty);
            if (!value) {
                continue;
            }
            node[booleanProperty] = getBooleanPropertyValue(booleanProperty);
        }
        const tristateProperties = ['checked', 'pressed'];
        for (const tristateProperty of tristateProperties) {
            if (!properties.has(tristateProperty)) {
                continue;
            }
            const value = properties.get(tristateProperty);
            node[tristateProperty] =
                value === 'mixed' ? 'mixed' : value === 'true' ? true : false;
        }
        const numericalProperties = [
            'level',
            'valuemax',
            'valuemin',
        ];
        const getNumericalPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const numericalProperty of numericalProperties) {
            if (!properties.has(numericalProperty)) {
                continue;
            }
            node[numericalProperty] = getNumericalPropertyValue(numericalProperty);
        }
        const tokenProperties = [
            'autocomplete',
            'haspopup',
            'invalid',
            'orientation',
        ];
        const getTokenPropertyValue = (key) => {
            return properties.get(key);
        };
        for (const tokenProperty of tokenProperties) {
            const value = getTokenPropertyValue(tokenProperty);
            if (!value || value === 'false') {
                continue;
            }
            node[tokenProperty] = getTokenPropertyValue(tokenProperty);
        }
        return node;
    }
    static createTree(payloads) {
        const nodeById = new Map();
        for (const payload of payloads) {
            nodeById.set(payload.nodeId, new AXNode(payload));
        }
        for (const node of nodeById.values()) {
            for (const childId of node.payload.childIds || []) {
                node.children.push(nodeById.get(childId));
            }
        }
        return nodeById.values().next().value;
    }
}
_AXNode_richlyEditable = new WeakMap(), _AXNode_editable = new WeakMap(), _AXNode_focusable = new WeakMap(), _AXNode_hidden = new WeakMap(), _AXNode_name = new WeakMap(), _AXNode_role = new WeakMap(), _AXNode_ignored = new WeakMap(), _AXNode_cachedHasFocusableChild = new WeakMap(), _AXNode_instances = new WeakSet(), _AXNode_isPlainTextField = function _AXNode_isPlainTextField() {
    if (__classPrivateFieldGet$f(this, _AXNode_richlyEditable, "f")) {
        return false;
    }
    if (__classPrivateFieldGet$f(this, _AXNode_editable, "f")) {
        return true;
    }
    return __classPrivateFieldGet$f(this, _AXNode_role, "f") === 'textbox' || __classPrivateFieldGet$f(this, _AXNode_role, "f") === 'searchbox';
}, _AXNode_isTextOnlyObject = function _AXNode_isTextOnlyObject() {
    const role = __classPrivateFieldGet$f(this, _AXNode_role, "f");
    return role === 'LineBreak' || role === 'text' || role === 'InlineTextBox';
}, _AXNode_hasFocusableChild = function _AXNode_hasFocusableChild() {
    if (__classPrivateFieldGet$f(this, _AXNode_cachedHasFocusableChild, "f") === undefined) {
        __classPrivateFieldSet$f(this, _AXNode_cachedHasFocusableChild, false, "f");
        for (const child of this.children) {
            if (__classPrivateFieldGet$f(child, _AXNode_focusable, "f") || __classPrivateFieldGet$f(child, _AXNode_instances, "m", _AXNode_hasFocusableChild).call(child)) {
                __classPrivateFieldSet$f(this, _AXNode_cachedHasFocusableChild, true, "f");
                break;
            }
        }
    }
    return __classPrivateFieldGet$f(this, _AXNode_cachedHasFocusableChild, "f");
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$e = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$e = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ConsoleMessage_type, _ConsoleMessage_text, _ConsoleMessage_args, _ConsoleMessage_stackTraceLocations;
/**
 * ConsoleMessage objects are dispatched by page via the 'console' event.
 * @public
 */
class ConsoleMessage {
    /**
     * @public
     */
    constructor(type, text, args, stackTraceLocations) {
        _ConsoleMessage_type.set(this, void 0);
        _ConsoleMessage_text.set(this, void 0);
        _ConsoleMessage_args.set(this, void 0);
        _ConsoleMessage_stackTraceLocations.set(this, void 0);
        __classPrivateFieldSet$e(this, _ConsoleMessage_type, type, "f");
        __classPrivateFieldSet$e(this, _ConsoleMessage_text, text, "f");
        __classPrivateFieldSet$e(this, _ConsoleMessage_args, args, "f");
        __classPrivateFieldSet$e(this, _ConsoleMessage_stackTraceLocations, stackTraceLocations, "f");
    }
    /**
     * @returns The type of the console message.
     */
    type() {
        return __classPrivateFieldGet$e(this, _ConsoleMessage_type, "f");
    }
    /**
     * @returns The text of the console message.
     */
    text() {
        return __classPrivateFieldGet$e(this, _ConsoleMessage_text, "f");
    }
    /**
     * @returns An array of arguments passed to the console.
     */
    args() {
        return __classPrivateFieldGet$e(this, _ConsoleMessage_args, "f");
    }
    /**
     * @returns The location of the console message.
     */
    location() {
        var _a;
        return (_a = __classPrivateFieldGet$e(this, _ConsoleMessage_stackTraceLocations, "f")[0]) !== null && _a !== void 0 ? _a : {};
    }
    /**
     * @returns The array of locations on the stack of the console message.
     */
    stackTrace() {
        return __classPrivateFieldGet$e(this, _ConsoleMessage_stackTraceLocations, "f");
    }
}
_ConsoleMessage_type = new WeakMap(), _ConsoleMessage_text = new WeakMap(), _ConsoleMessage_args = new WeakMap(), _ConsoleMessage_stackTraceLocations = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$d = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$d = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Coverage_jsCoverage, _Coverage_cssCoverage, _JSCoverage_instances, _JSCoverage_client, _JSCoverage_enabled, _JSCoverage_scriptURLs, _JSCoverage_scriptSources, _JSCoverage_eventListeners, _JSCoverage_resetOnNavigation, _JSCoverage_reportAnonymousScripts, _JSCoverage_includeRawScriptCoverage, _JSCoverage_onExecutionContextsCleared, _JSCoverage_onScriptParsed, _CSSCoverage_instances, _CSSCoverage_client, _CSSCoverage_enabled, _CSSCoverage_stylesheetURLs, _CSSCoverage_stylesheetSources, _CSSCoverage_eventListeners, _CSSCoverage_resetOnNavigation, _CSSCoverage_onExecutionContextsCleared, _CSSCoverage_onStyleSheet;
/**
 * The Coverage class provides methods to gathers information about parts of
 * JavaScript and CSS that were used by the page.
 *
 * @remarks
 * To output coverage in a form consumable by {@link https://github.com/istanbuljs | Istanbul},
 * see {@link https://github.com/istanbuljs/puppeteer-to-istanbul | puppeteer-to-istanbul}.
 *
 * @example
 * An example of using JavaScript and CSS coverage to get percentage of initially
 * executed code:
 *
 * ```ts
 * // Enable both JavaScript and CSS coverage
 * await Promise.all([
 *   page.coverage.startJSCoverage(),
 *   page.coverage.startCSSCoverage(),
 * ]);
 * // Navigate to page
 * await page.goto('https://example.com');
 * // Disable both JavaScript and CSS coverage
 * const [jsCoverage, cssCoverage] = await Promise.all([
 *   page.coverage.stopJSCoverage(),
 *   page.coverage.stopCSSCoverage(),
 * ]);
 * let totalBytes = 0;
 * let usedBytes = 0;
 * const coverage = [...jsCoverage, ...cssCoverage];
 * for (const entry of coverage) {
 *   totalBytes += entry.text.length;
 *   for (const range of entry.ranges) usedBytes += range.end - range.start - 1;
 * }
 * console.log(`Bytes used: ${(usedBytes / totalBytes) * 100}%`);
 * ```
 *
 * @public
 */
class Coverage {
    constructor(client) {
        _Coverage_jsCoverage.set(this, void 0);
        _Coverage_cssCoverage.set(this, void 0);
        __classPrivateFieldSet$d(this, _Coverage_jsCoverage, new JSCoverage(client), "f");
        __classPrivateFieldSet$d(this, _Coverage_cssCoverage, new CSSCoverage(client), "f");
    }
    /**
     * @param options - Set of configurable options for coverage defaults to
     * `resetOnNavigation : true, reportAnonymousScripts : false`
     * @returns Promise that resolves when coverage is started.
     *
     * @remarks
     * Anonymous scripts are ones that don't have an associated url. These are
     * scripts that are dynamically created on the page using `eval` or
     * `new Function`. If `reportAnonymousScripts` is set to `true`, anonymous
     * scripts will have `pptr://__puppeteer_evaluation_script__` as their URL.
     */
    async startJSCoverage(options = {}) {
        return await __classPrivateFieldGet$d(this, _Coverage_jsCoverage, "f").start(options);
    }
    /**
     * @returns Promise that resolves to the array of coverage reports for
     * all scripts.
     *
     * @remarks
     * JavaScript Coverage doesn't include anonymous scripts by default.
     * However, scripts with sourceURLs are reported.
     */
    async stopJSCoverage() {
        return await __classPrivateFieldGet$d(this, _Coverage_jsCoverage, "f").stop();
    }
    /**
     * @param options - Set of configurable options for coverage, defaults to
     * `resetOnNavigation : true`
     * @returns Promise that resolves when coverage is started.
     */
    async startCSSCoverage(options = {}) {
        return await __classPrivateFieldGet$d(this, _Coverage_cssCoverage, "f").start(options);
    }
    /**
     * @returns Promise that resolves to the array of coverage reports
     * for all stylesheets.
     * @remarks
     * CSS Coverage doesn't include dynamically injected style tags
     * without sourceURLs.
     */
    async stopCSSCoverage() {
        return await __classPrivateFieldGet$d(this, _Coverage_cssCoverage, "f").stop();
    }
}
_Coverage_jsCoverage = new WeakMap(), _Coverage_cssCoverage = new WeakMap();
/**
 * @public
 */
class JSCoverage {
    constructor(client) {
        _JSCoverage_instances.add(this);
        _JSCoverage_client.set(this, void 0);
        _JSCoverage_enabled.set(this, false);
        _JSCoverage_scriptURLs.set(this, new Map());
        _JSCoverage_scriptSources.set(this, new Map());
        _JSCoverage_eventListeners.set(this, []);
        _JSCoverage_resetOnNavigation.set(this, false);
        _JSCoverage_reportAnonymousScripts.set(this, false);
        _JSCoverage_includeRawScriptCoverage.set(this, false);
        __classPrivateFieldSet$d(this, _JSCoverage_client, client, "f");
    }
    async start(options = {}) {
        assert(!__classPrivateFieldGet$d(this, _JSCoverage_enabled, "f"), 'JSCoverage is already enabled');
        const { resetOnNavigation = true, reportAnonymousScripts = false, includeRawScriptCoverage = false, } = options;
        __classPrivateFieldSet$d(this, _JSCoverage_resetOnNavigation, resetOnNavigation, "f");
        __classPrivateFieldSet$d(this, _JSCoverage_reportAnonymousScripts, reportAnonymousScripts, "f");
        __classPrivateFieldSet$d(this, _JSCoverage_includeRawScriptCoverage, includeRawScriptCoverage, "f");
        __classPrivateFieldSet$d(this, _JSCoverage_enabled, true, "f");
        __classPrivateFieldGet$d(this, _JSCoverage_scriptURLs, "f").clear();
        __classPrivateFieldGet$d(this, _JSCoverage_scriptSources, "f").clear();
        __classPrivateFieldSet$d(this, _JSCoverage_eventListeners, [
            addEventListener(__classPrivateFieldGet$d(this, _JSCoverage_client, "f"), 'Debugger.scriptParsed', __classPrivateFieldGet$d(this, _JSCoverage_instances, "m", _JSCoverage_onScriptParsed).bind(this)),
            addEventListener(__classPrivateFieldGet$d(this, _JSCoverage_client, "f"), 'Runtime.executionContextsCleared', __classPrivateFieldGet$d(this, _JSCoverage_instances, "m", _JSCoverage_onExecutionContextsCleared).bind(this)),
        ], "f");
        await Promise.all([
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Profiler.enable'),
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Profiler.startPreciseCoverage', {
                callCount: __classPrivateFieldGet$d(this, _JSCoverage_includeRawScriptCoverage, "f"),
                detailed: true,
            }),
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Debugger.enable'),
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Debugger.setSkipAllPauses', { skip: true }),
        ]);
    }
    async stop() {
        assert(__classPrivateFieldGet$d(this, _JSCoverage_enabled, "f"), 'JSCoverage is not enabled');
        __classPrivateFieldSet$d(this, _JSCoverage_enabled, false, "f");
        const result = await Promise.all([
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Profiler.takePreciseCoverage'),
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Profiler.stopPreciseCoverage'),
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Profiler.disable'),
            __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Debugger.disable'),
        ]);
        removeEventListeners(__classPrivateFieldGet$d(this, _JSCoverage_eventListeners, "f"));
        const coverage = [];
        const profileResponse = result[0];
        for (const entry of profileResponse.result) {
            let url = __classPrivateFieldGet$d(this, _JSCoverage_scriptURLs, "f").get(entry.scriptId);
            if (!url && __classPrivateFieldGet$d(this, _JSCoverage_reportAnonymousScripts, "f")) {
                url = 'debugger://VM' + entry.scriptId;
            }
            const text = __classPrivateFieldGet$d(this, _JSCoverage_scriptSources, "f").get(entry.scriptId);
            if (text === undefined || url === undefined) {
                continue;
            }
            const flattenRanges = [];
            for (const func of entry.functions) {
                flattenRanges.push(...func.ranges);
            }
            const ranges = convertToDisjointRanges(flattenRanges);
            if (!__classPrivateFieldGet$d(this, _JSCoverage_includeRawScriptCoverage, "f")) {
                coverage.push({ url, ranges, text });
            }
            else {
                coverage.push({ url, ranges, text, rawScriptCoverage: entry });
            }
        }
        return coverage;
    }
}
_JSCoverage_client = new WeakMap(), _JSCoverage_enabled = new WeakMap(), _JSCoverage_scriptURLs = new WeakMap(), _JSCoverage_scriptSources = new WeakMap(), _JSCoverage_eventListeners = new WeakMap(), _JSCoverage_resetOnNavigation = new WeakMap(), _JSCoverage_reportAnonymousScripts = new WeakMap(), _JSCoverage_includeRawScriptCoverage = new WeakMap(), _JSCoverage_instances = new WeakSet(), _JSCoverage_onExecutionContextsCleared = function _JSCoverage_onExecutionContextsCleared() {
    if (!__classPrivateFieldGet$d(this, _JSCoverage_resetOnNavigation, "f")) {
        return;
    }
    __classPrivateFieldGet$d(this, _JSCoverage_scriptURLs, "f").clear();
    __classPrivateFieldGet$d(this, _JSCoverage_scriptSources, "f").clear();
}, _JSCoverage_onScriptParsed = async function _JSCoverage_onScriptParsed(event) {
    // Ignore puppeteer-injected scripts
    if (event.url === EVALUATION_SCRIPT_URL) {
        return;
    }
    // Ignore other anonymous scripts unless the reportAnonymousScripts option is true.
    if (!event.url && !__classPrivateFieldGet$d(this, _JSCoverage_reportAnonymousScripts, "f")) {
        return;
    }
    try {
        const response = await __classPrivateFieldGet$d(this, _JSCoverage_client, "f").send('Debugger.getScriptSource', {
            scriptId: event.scriptId,
        });
        __classPrivateFieldGet$d(this, _JSCoverage_scriptURLs, "f").set(event.scriptId, event.url);
        __classPrivateFieldGet$d(this, _JSCoverage_scriptSources, "f").set(event.scriptId, response.scriptSource);
    }
    catch (error) {
        // This might happen if the page has already navigated away.
        debugError(error);
    }
};
/**
 * @public
 */
class CSSCoverage {
    constructor(client) {
        _CSSCoverage_instances.add(this);
        _CSSCoverage_client.set(this, void 0);
        _CSSCoverage_enabled.set(this, false);
        _CSSCoverage_stylesheetURLs.set(this, new Map());
        _CSSCoverage_stylesheetSources.set(this, new Map());
        _CSSCoverage_eventListeners.set(this, []);
        _CSSCoverage_resetOnNavigation.set(this, false);
        __classPrivateFieldSet$d(this, _CSSCoverage_client, client, "f");
    }
    async start(options = {}) {
        assert(!__classPrivateFieldGet$d(this, _CSSCoverage_enabled, "f"), 'CSSCoverage is already enabled');
        const { resetOnNavigation = true } = options;
        __classPrivateFieldSet$d(this, _CSSCoverage_resetOnNavigation, resetOnNavigation, "f");
        __classPrivateFieldSet$d(this, _CSSCoverage_enabled, true, "f");
        __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetURLs, "f").clear();
        __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetSources, "f").clear();
        __classPrivateFieldSet$d(this, _CSSCoverage_eventListeners, [
            addEventListener(__classPrivateFieldGet$d(this, _CSSCoverage_client, "f"), 'CSS.styleSheetAdded', __classPrivateFieldGet$d(this, _CSSCoverage_instances, "m", _CSSCoverage_onStyleSheet).bind(this)),
            addEventListener(__classPrivateFieldGet$d(this, _CSSCoverage_client, "f"), 'Runtime.executionContextsCleared', __classPrivateFieldGet$d(this, _CSSCoverage_instances, "m", _CSSCoverage_onExecutionContextsCleared).bind(this)),
        ], "f");
        await Promise.all([
            __classPrivateFieldGet$d(this, _CSSCoverage_client, "f").send('DOM.enable'),
            __classPrivateFieldGet$d(this, _CSSCoverage_client, "f").send('CSS.enable'),
            __classPrivateFieldGet$d(this, _CSSCoverage_client, "f").send('CSS.startRuleUsageTracking'),
        ]);
    }
    async stop() {
        assert(__classPrivateFieldGet$d(this, _CSSCoverage_enabled, "f"), 'CSSCoverage is not enabled');
        __classPrivateFieldSet$d(this, _CSSCoverage_enabled, false, "f");
        const ruleTrackingResponse = await __classPrivateFieldGet$d(this, _CSSCoverage_client, "f").send('CSS.stopRuleUsageTracking');
        await Promise.all([
            __classPrivateFieldGet$d(this, _CSSCoverage_client, "f").send('CSS.disable'),
            __classPrivateFieldGet$d(this, _CSSCoverage_client, "f").send('DOM.disable'),
        ]);
        removeEventListeners(__classPrivateFieldGet$d(this, _CSSCoverage_eventListeners, "f"));
        // aggregate by styleSheetId
        const styleSheetIdToCoverage = new Map();
        for (const entry of ruleTrackingResponse.ruleUsage) {
            let ranges = styleSheetIdToCoverage.get(entry.styleSheetId);
            if (!ranges) {
                ranges = [];
                styleSheetIdToCoverage.set(entry.styleSheetId, ranges);
            }
            ranges.push({
                startOffset: entry.startOffset,
                endOffset: entry.endOffset,
                count: entry.used ? 1 : 0,
            });
        }
        const coverage = [];
        for (const styleSheetId of __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetURLs, "f").keys()) {
            const url = __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetURLs, "f").get(styleSheetId);
            assert(typeof url !== 'undefined', `Stylesheet URL is undefined (styleSheetId=${styleSheetId})`);
            const text = __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetSources, "f").get(styleSheetId);
            assert(typeof text !== 'undefined', `Stylesheet text is undefined (styleSheetId=${styleSheetId})`);
            const ranges = convertToDisjointRanges(styleSheetIdToCoverage.get(styleSheetId) || []);
            coverage.push({ url, ranges, text });
        }
        return coverage;
    }
}
_CSSCoverage_client = new WeakMap(), _CSSCoverage_enabled = new WeakMap(), _CSSCoverage_stylesheetURLs = new WeakMap(), _CSSCoverage_stylesheetSources = new WeakMap(), _CSSCoverage_eventListeners = new WeakMap(), _CSSCoverage_resetOnNavigation = new WeakMap(), _CSSCoverage_instances = new WeakSet(), _CSSCoverage_onExecutionContextsCleared = function _CSSCoverage_onExecutionContextsCleared() {
    if (!__classPrivateFieldGet$d(this, _CSSCoverage_resetOnNavigation, "f")) {
        return;
    }
    __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetURLs, "f").clear();
    __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetSources, "f").clear();
}, _CSSCoverage_onStyleSheet = async function _CSSCoverage_onStyleSheet(event) {
    const header = event.header;
    // Ignore anonymous scripts
    if (!header.sourceURL) {
        return;
    }
    try {
        const response = await __classPrivateFieldGet$d(this, _CSSCoverage_client, "f").send('CSS.getStyleSheetText', {
            styleSheetId: header.styleSheetId,
        });
        __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetURLs, "f").set(header.styleSheetId, header.sourceURL);
        __classPrivateFieldGet$d(this, _CSSCoverage_stylesheetSources, "f").set(header.styleSheetId, response.text);
    }
    catch (error) {
        // This might happen if the page has already navigated away.
        debugError(error);
    }
};
function convertToDisjointRanges(nestedRanges) {
    const points = [];
    for (const range of nestedRanges) {
        points.push({ offset: range.startOffset, type: 0, range });
        points.push({ offset: range.endOffset, type: 1, range });
    }
    // Sort points to form a valid parenthesis sequence.
    points.sort((a, b) => {
        // Sort with increasing offsets.
        if (a.offset !== b.offset) {
            return a.offset - b.offset;
        }
        // All "end" points should go before "start" points.
        if (a.type !== b.type) {
            return b.type - a.type;
        }
        const aLength = a.range.endOffset - a.range.startOffset;
        const bLength = b.range.endOffset - b.range.startOffset;
        // For two "start" points, the one with longer range goes first.
        if (a.type === 0) {
            return bLength - aLength;
        }
        // For two "end" points, the one with shorter range goes first.
        return aLength - bLength;
    });
    const hitCountStack = [];
    const results = [];
    let lastOffset = 0;
    // Run scanning line to intersect all ranges.
    for (const point of points) {
        if (hitCountStack.length &&
            lastOffset < point.offset &&
            hitCountStack[hitCountStack.length - 1] > 0) {
            const lastResult = results[results.length - 1];
            if (lastResult && lastResult.end === lastOffset) {
                lastResult.end = point.offset;
            }
            else {
                results.push({ start: lastOffset, end: point.offset });
            }
        }
        lastOffset = point.offset;
        if (point.type === 0) {
            hitCountStack.push(point.range.count);
        }
        else {
            hitCountStack.pop();
        }
    }
    // Filter out empty ranges.
    return results.filter(range => {
        return range.end - range.start > 1;
    });
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$c = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$c = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Dialog_client, _Dialog_type, _Dialog_message, _Dialog_defaultValue, _Dialog_handled;
/**
 * Dialog instances are dispatched by the {@link Page} via the `dialog` event.
 *
 * @remarks
 *
 * @example
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   page.on('dialog', async dialog => {
 *     console.log(dialog.message());
 *     await dialog.dismiss();
 *     await browser.close();
 *   });
 *   page.evaluate(() => alert('1'));
 * })();
 * ```
 *
 * @public
 */
class Dialog {
    /**
     * @internal
     */
    constructor(client, type, message, defaultValue = '') {
        _Dialog_client.set(this, void 0);
        _Dialog_type.set(this, void 0);
        _Dialog_message.set(this, void 0);
        _Dialog_defaultValue.set(this, void 0);
        _Dialog_handled.set(this, false);
        __classPrivateFieldSet$c(this, _Dialog_client, client, "f");
        __classPrivateFieldSet$c(this, _Dialog_type, type, "f");
        __classPrivateFieldSet$c(this, _Dialog_message, message, "f");
        __classPrivateFieldSet$c(this, _Dialog_defaultValue, defaultValue, "f");
    }
    /**
     * @returns The type of the dialog.
     */
    type() {
        return __classPrivateFieldGet$c(this, _Dialog_type, "f");
    }
    /**
     * @returns The message displayed in the dialog.
     */
    message() {
        return __classPrivateFieldGet$c(this, _Dialog_message, "f");
    }
    /**
     * @returns The default value of the prompt, or an empty string if the dialog
     * is not a `prompt`.
     */
    defaultValue() {
        return __classPrivateFieldGet$c(this, _Dialog_defaultValue, "f");
    }
    /**
     * @param promptText - optional text that will be entered in the dialog
     * prompt. Has no effect if the dialog's type is not `prompt`.
     *
     * @returns A promise that resolves when the dialog has been accepted.
     */
    async accept(promptText) {
        assert(!__classPrivateFieldGet$c(this, _Dialog_handled, "f"), 'Cannot accept dialog which is already handled!');
        __classPrivateFieldSet$c(this, _Dialog_handled, true, "f");
        await __classPrivateFieldGet$c(this, _Dialog_client, "f").send('Page.handleJavaScriptDialog', {
            accept: true,
            promptText: promptText,
        });
    }
    /**
     * @returns A promise which will resolve once the dialog has been dismissed
     */
    async dismiss() {
        assert(!__classPrivateFieldGet$c(this, _Dialog_handled, "f"), 'Cannot dismiss dialog which is already handled!');
        __classPrivateFieldSet$c(this, _Dialog_handled, true, "f");
        await __classPrivateFieldGet$c(this, _Dialog_client, "f").send('Page.handleJavaScriptDialog', {
            accept: false,
        });
    }
}
_Dialog_client = new WeakMap(), _Dialog_type = new WeakMap(), _Dialog_message = new WeakMap(), _Dialog_defaultValue = new WeakMap(), _Dialog_handled = new WeakMap();

var __classPrivateFieldSet$b = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$b = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _EmulationManager_client, _EmulationManager_emulatingMobile, _EmulationManager_hasTouch;
/**
 * @internal
 */
class EmulationManager {
    constructor(client) {
        _EmulationManager_client.set(this, void 0);
        _EmulationManager_emulatingMobile.set(this, false);
        _EmulationManager_hasTouch.set(this, false);
        __classPrivateFieldSet$b(this, _EmulationManager_client, client, "f");
    }
    async emulateViewport(viewport) {
        const mobile = viewport.isMobile || false;
        const width = viewport.width;
        const height = viewport.height;
        const deviceScaleFactor = viewport.deviceScaleFactor || 1;
        const screenOrientation = viewport.isLandscape
            ? { angle: 90, type: 'landscapePrimary' }
            : { angle: 0, type: 'portraitPrimary' };
        const hasTouch = viewport.hasTouch || false;
        await Promise.all([
            __classPrivateFieldGet$b(this, _EmulationManager_client, "f").send('Emulation.setDeviceMetricsOverride', {
                mobile,
                width,
                height,
                deviceScaleFactor,
                screenOrientation,
            }),
            __classPrivateFieldGet$b(this, _EmulationManager_client, "f").send('Emulation.setTouchEmulationEnabled', {
                enabled: hasTouch,
            }),
        ]);
        const reloadNeeded = __classPrivateFieldGet$b(this, _EmulationManager_emulatingMobile, "f") !== mobile || __classPrivateFieldGet$b(this, _EmulationManager_hasTouch, "f") !== hasTouch;
        __classPrivateFieldSet$b(this, _EmulationManager_emulatingMobile, mobile, "f");
        __classPrivateFieldSet$b(this, _EmulationManager_hasTouch, hasTouch, "f");
        return reloadNeeded;
    }
}
_EmulationManager_client = new WeakMap(), _EmulationManager_emulatingMobile = new WeakMap(), _EmulationManager_hasTouch = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$a = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$a = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FileChooser_element, _FileChooser_multiple, _FileChooser_handled;
/**
 * File choosers let you react to the page requesting for a file.
 *
 * @remarks
 * `FileChooser` instances are returned via the {@link Page.waitForFileChooser} method.
 *
 * In browsers, only one file chooser can be opened at a time.
 * All file choosers must be accepted or canceled. Not doing so will prevent
 * subsequent file choosers from appearing.
 *
 * @example
 *
 * ```ts
 * const [fileChooser] = await Promise.all([
 *   page.waitForFileChooser(),
 *   page.click('#upload-file-button'), // some button that triggers file selection
 * ]);
 * await fileChooser.accept(['/tmp/myfile.pdf']);
 * ```
 *
 * @public
 */
class FileChooser {
    /**
     * @internal
     */
    constructor(element, event) {
        _FileChooser_element.set(this, void 0);
        _FileChooser_multiple.set(this, void 0);
        _FileChooser_handled.set(this, false);
        __classPrivateFieldSet$a(this, _FileChooser_element, element, "f");
        __classPrivateFieldSet$a(this, _FileChooser_multiple, event.mode !== 'selectSingle', "f");
    }
    /**
     * Whether file chooser allow for
     * {@link https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input/file#attr-multiple | multiple}
     * file selection.
     */
    isMultiple() {
        return __classPrivateFieldGet$a(this, _FileChooser_multiple, "f");
    }
    /**
     * Accept the file chooser request with given paths.
     *
     * @param filePaths - If some of the `filePaths` are relative paths, then
     * they are resolved relative to the
     * {@link https://nodejs.org/api/process.html#process_process_cwd | current working directory}.
     */
    async accept(filePaths) {
        assert(!__classPrivateFieldGet$a(this, _FileChooser_handled, "f"), 'Cannot accept FileChooser which is already handled!');
        __classPrivateFieldSet$a(this, _FileChooser_handled, true, "f");
        await __classPrivateFieldGet$a(this, _FileChooser_element, "f").uploadFile(...filePaths);
    }
    /**
     * Closes the file chooser without selecting any files.
     */
    cancel() {
        assert(!__classPrivateFieldGet$a(this, _FileChooser_handled, "f"), 'Cannot cancel FileChooser which is already handled!');
        __classPrivateFieldSet$a(this, _FileChooser_handled, true, "f");
    }
}
_FileChooser_element = new WeakMap(), _FileChooser_multiple = new WeakMap(), _FileChooser_handled = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const _keyDefinitions = {
    '0': { keyCode: 48, key: '0', code: 'Digit0' },
    '1': { keyCode: 49, key: '1', code: 'Digit1' },
    '2': { keyCode: 50, key: '2', code: 'Digit2' },
    '3': { keyCode: 51, key: '3', code: 'Digit3' },
    '4': { keyCode: 52, key: '4', code: 'Digit4' },
    '5': { keyCode: 53, key: '5', code: 'Digit5' },
    '6': { keyCode: 54, key: '6', code: 'Digit6' },
    '7': { keyCode: 55, key: '7', code: 'Digit7' },
    '8': { keyCode: 56, key: '8', code: 'Digit8' },
    '9': { keyCode: 57, key: '9', code: 'Digit9' },
    Power: { key: 'Power', code: 'Power' },
    Eject: { key: 'Eject', code: 'Eject' },
    Abort: { keyCode: 3, code: 'Abort', key: 'Cancel' },
    Help: { keyCode: 6, code: 'Help', key: 'Help' },
    Backspace: { keyCode: 8, code: 'Backspace', key: 'Backspace' },
    Tab: { keyCode: 9, code: 'Tab', key: 'Tab' },
    Numpad5: {
        keyCode: 12,
        shiftKeyCode: 101,
        key: 'Clear',
        code: 'Numpad5',
        shiftKey: '5',
        location: 3,
    },
    NumpadEnter: {
        keyCode: 13,
        code: 'NumpadEnter',
        key: 'Enter',
        text: '\r',
        location: 3,
    },
    Enter: { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
    '\r': { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
    '\n': { keyCode: 13, code: 'Enter', key: 'Enter', text: '\r' },
    ShiftLeft: { keyCode: 16, code: 'ShiftLeft', key: 'Shift', location: 1 },
    ShiftRight: { keyCode: 16, code: 'ShiftRight', key: 'Shift', location: 2 },
    ControlLeft: {
        keyCode: 17,
        code: 'ControlLeft',
        key: 'Control',
        location: 1,
    },
    ControlRight: {
        keyCode: 17,
        code: 'ControlRight',
        key: 'Control',
        location: 2,
    },
    AltLeft: { keyCode: 18, code: 'AltLeft', key: 'Alt', location: 1 },
    AltRight: { keyCode: 18, code: 'AltRight', key: 'Alt', location: 2 },
    Pause: { keyCode: 19, code: 'Pause', key: 'Pause' },
    CapsLock: { keyCode: 20, code: 'CapsLock', key: 'CapsLock' },
    Escape: { keyCode: 27, code: 'Escape', key: 'Escape' },
    Convert: { keyCode: 28, code: 'Convert', key: 'Convert' },
    NonConvert: { keyCode: 29, code: 'NonConvert', key: 'NonConvert' },
    Space: { keyCode: 32, code: 'Space', key: ' ' },
    Numpad9: {
        keyCode: 33,
        shiftKeyCode: 105,
        key: 'PageUp',
        code: 'Numpad9',
        shiftKey: '9',
        location: 3,
    },
    PageUp: { keyCode: 33, code: 'PageUp', key: 'PageUp' },
    Numpad3: {
        keyCode: 34,
        shiftKeyCode: 99,
        key: 'PageDown',
        code: 'Numpad3',
        shiftKey: '3',
        location: 3,
    },
    PageDown: { keyCode: 34, code: 'PageDown', key: 'PageDown' },
    End: { keyCode: 35, code: 'End', key: 'End' },
    Numpad1: {
        keyCode: 35,
        shiftKeyCode: 97,
        key: 'End',
        code: 'Numpad1',
        shiftKey: '1',
        location: 3,
    },
    Home: { keyCode: 36, code: 'Home', key: 'Home' },
    Numpad7: {
        keyCode: 36,
        shiftKeyCode: 103,
        key: 'Home',
        code: 'Numpad7',
        shiftKey: '7',
        location: 3,
    },
    ArrowLeft: { keyCode: 37, code: 'ArrowLeft', key: 'ArrowLeft' },
    Numpad4: {
        keyCode: 37,
        shiftKeyCode: 100,
        key: 'ArrowLeft',
        code: 'Numpad4',
        shiftKey: '4',
        location: 3,
    },
    Numpad8: {
        keyCode: 38,
        shiftKeyCode: 104,
        key: 'ArrowUp',
        code: 'Numpad8',
        shiftKey: '8',
        location: 3,
    },
    ArrowUp: { keyCode: 38, code: 'ArrowUp', key: 'ArrowUp' },
    ArrowRight: { keyCode: 39, code: 'ArrowRight', key: 'ArrowRight' },
    Numpad6: {
        keyCode: 39,
        shiftKeyCode: 102,
        key: 'ArrowRight',
        code: 'Numpad6',
        shiftKey: '6',
        location: 3,
    },
    Numpad2: {
        keyCode: 40,
        shiftKeyCode: 98,
        key: 'ArrowDown',
        code: 'Numpad2',
        shiftKey: '2',
        location: 3,
    },
    ArrowDown: { keyCode: 40, code: 'ArrowDown', key: 'ArrowDown' },
    Select: { keyCode: 41, code: 'Select', key: 'Select' },
    Open: { keyCode: 43, code: 'Open', key: 'Execute' },
    PrintScreen: { keyCode: 44, code: 'PrintScreen', key: 'PrintScreen' },
    Insert: { keyCode: 45, code: 'Insert', key: 'Insert' },
    Numpad0: {
        keyCode: 45,
        shiftKeyCode: 96,
        key: 'Insert',
        code: 'Numpad0',
        shiftKey: '0',
        location: 3,
    },
    Delete: { keyCode: 46, code: 'Delete', key: 'Delete' },
    NumpadDecimal: {
        keyCode: 46,
        shiftKeyCode: 110,
        code: 'NumpadDecimal',
        key: '\u0000',
        shiftKey: '.',
        location: 3,
    },
    Digit0: { keyCode: 48, code: 'Digit0', shiftKey: ')', key: '0' },
    Digit1: { keyCode: 49, code: 'Digit1', shiftKey: '!', key: '1' },
    Digit2: { keyCode: 50, code: 'Digit2', shiftKey: '@', key: '2' },
    Digit3: { keyCode: 51, code: 'Digit3', shiftKey: '#', key: '3' },
    Digit4: { keyCode: 52, code: 'Digit4', shiftKey: '$', key: '4' },
    Digit5: { keyCode: 53, code: 'Digit5', shiftKey: '%', key: '5' },
    Digit6: { keyCode: 54, code: 'Digit6', shiftKey: '^', key: '6' },
    Digit7: { keyCode: 55, code: 'Digit7', shiftKey: '&', key: '7' },
    Digit8: { keyCode: 56, code: 'Digit8', shiftKey: '*', key: '8' },
    Digit9: { keyCode: 57, code: 'Digit9', shiftKey: '(', key: '9' },
    KeyA: { keyCode: 65, code: 'KeyA', shiftKey: 'A', key: 'a' },
    KeyB: { keyCode: 66, code: 'KeyB', shiftKey: 'B', key: 'b' },
    KeyC: { keyCode: 67, code: 'KeyC', shiftKey: 'C', key: 'c' },
    KeyD: { keyCode: 68, code: 'KeyD', shiftKey: 'D', key: 'd' },
    KeyE: { keyCode: 69, code: 'KeyE', shiftKey: 'E', key: 'e' },
    KeyF: { keyCode: 70, code: 'KeyF', shiftKey: 'F', key: 'f' },
    KeyG: { keyCode: 71, code: 'KeyG', shiftKey: 'G', key: 'g' },
    KeyH: { keyCode: 72, code: 'KeyH', shiftKey: 'H', key: 'h' },
    KeyI: { keyCode: 73, code: 'KeyI', shiftKey: 'I', key: 'i' },
    KeyJ: { keyCode: 74, code: 'KeyJ', shiftKey: 'J', key: 'j' },
    KeyK: { keyCode: 75, code: 'KeyK', shiftKey: 'K', key: 'k' },
    KeyL: { keyCode: 76, code: 'KeyL', shiftKey: 'L', key: 'l' },
    KeyM: { keyCode: 77, code: 'KeyM', shiftKey: 'M', key: 'm' },
    KeyN: { keyCode: 78, code: 'KeyN', shiftKey: 'N', key: 'n' },
    KeyO: { keyCode: 79, code: 'KeyO', shiftKey: 'O', key: 'o' },
    KeyP: { keyCode: 80, code: 'KeyP', shiftKey: 'P', key: 'p' },
    KeyQ: { keyCode: 81, code: 'KeyQ', shiftKey: 'Q', key: 'q' },
    KeyR: { keyCode: 82, code: 'KeyR', shiftKey: 'R', key: 'r' },
    KeyS: { keyCode: 83, code: 'KeyS', shiftKey: 'S', key: 's' },
    KeyT: { keyCode: 84, code: 'KeyT', shiftKey: 'T', key: 't' },
    KeyU: { keyCode: 85, code: 'KeyU', shiftKey: 'U', key: 'u' },
    KeyV: { keyCode: 86, code: 'KeyV', shiftKey: 'V', key: 'v' },
    KeyW: { keyCode: 87, code: 'KeyW', shiftKey: 'W', key: 'w' },
    KeyX: { keyCode: 88, code: 'KeyX', shiftKey: 'X', key: 'x' },
    KeyY: { keyCode: 89, code: 'KeyY', shiftKey: 'Y', key: 'y' },
    KeyZ: { keyCode: 90, code: 'KeyZ', shiftKey: 'Z', key: 'z' },
    MetaLeft: { keyCode: 91, code: 'MetaLeft', key: 'Meta', location: 1 },
    MetaRight: { keyCode: 92, code: 'MetaRight', key: 'Meta', location: 2 },
    ContextMenu: { keyCode: 93, code: 'ContextMenu', key: 'ContextMenu' },
    NumpadMultiply: {
        keyCode: 106,
        code: 'NumpadMultiply',
        key: '*',
        location: 3,
    },
    NumpadAdd: { keyCode: 107, code: 'NumpadAdd', key: '+', location: 3 },
    NumpadSubtract: {
        keyCode: 109,
        code: 'NumpadSubtract',
        key: '-',
        location: 3,
    },
    NumpadDivide: { keyCode: 111, code: 'NumpadDivide', key: '/', location: 3 },
    F1: { keyCode: 112, code: 'F1', key: 'F1' },
    F2: { keyCode: 113, code: 'F2', key: 'F2' },
    F3: { keyCode: 114, code: 'F3', key: 'F3' },
    F4: { keyCode: 115, code: 'F4', key: 'F4' },
    F5: { keyCode: 116, code: 'F5', key: 'F5' },
    F6: { keyCode: 117, code: 'F6', key: 'F6' },
    F7: { keyCode: 118, code: 'F7', key: 'F7' },
    F8: { keyCode: 119, code: 'F8', key: 'F8' },
    F9: { keyCode: 120, code: 'F9', key: 'F9' },
    F10: { keyCode: 121, code: 'F10', key: 'F10' },
    F11: { keyCode: 122, code: 'F11', key: 'F11' },
    F12: { keyCode: 123, code: 'F12', key: 'F12' },
    F13: { keyCode: 124, code: 'F13', key: 'F13' },
    F14: { keyCode: 125, code: 'F14', key: 'F14' },
    F15: { keyCode: 126, code: 'F15', key: 'F15' },
    F16: { keyCode: 127, code: 'F16', key: 'F16' },
    F17: { keyCode: 128, code: 'F17', key: 'F17' },
    F18: { keyCode: 129, code: 'F18', key: 'F18' },
    F19: { keyCode: 130, code: 'F19', key: 'F19' },
    F20: { keyCode: 131, code: 'F20', key: 'F20' },
    F21: { keyCode: 132, code: 'F21', key: 'F21' },
    F22: { keyCode: 133, code: 'F22', key: 'F22' },
    F23: { keyCode: 134, code: 'F23', key: 'F23' },
    F24: { keyCode: 135, code: 'F24', key: 'F24' },
    NumLock: { keyCode: 144, code: 'NumLock', key: 'NumLock' },
    ScrollLock: { keyCode: 145, code: 'ScrollLock', key: 'ScrollLock' },
    AudioVolumeMute: {
        keyCode: 173,
        code: 'AudioVolumeMute',
        key: 'AudioVolumeMute',
    },
    AudioVolumeDown: {
        keyCode: 174,
        code: 'AudioVolumeDown',
        key: 'AudioVolumeDown',
    },
    AudioVolumeUp: { keyCode: 175, code: 'AudioVolumeUp', key: 'AudioVolumeUp' },
    MediaTrackNext: {
        keyCode: 176,
        code: 'MediaTrackNext',
        key: 'MediaTrackNext',
    },
    MediaTrackPrevious: {
        keyCode: 177,
        code: 'MediaTrackPrevious',
        key: 'MediaTrackPrevious',
    },
    MediaStop: { keyCode: 178, code: 'MediaStop', key: 'MediaStop' },
    MediaPlayPause: {
        keyCode: 179,
        code: 'MediaPlayPause',
        key: 'MediaPlayPause',
    },
    Semicolon: { keyCode: 186, code: 'Semicolon', shiftKey: ':', key: ';' },
    Equal: { keyCode: 187, code: 'Equal', shiftKey: '+', key: '=' },
    NumpadEqual: { keyCode: 187, code: 'NumpadEqual', key: '=', location: 3 },
    Comma: { keyCode: 188, code: 'Comma', shiftKey: '<', key: ',' },
    Minus: { keyCode: 189, code: 'Minus', shiftKey: '_', key: '-' },
    Period: { keyCode: 190, code: 'Period', shiftKey: '>', key: '.' },
    Slash: { keyCode: 191, code: 'Slash', shiftKey: '?', key: '/' },
    Backquote: { keyCode: 192, code: 'Backquote', shiftKey: '~', key: '`' },
    BracketLeft: { keyCode: 219, code: 'BracketLeft', shiftKey: '{', key: '[' },
    Backslash: { keyCode: 220, code: 'Backslash', shiftKey: '|', key: '\\' },
    BracketRight: { keyCode: 221, code: 'BracketRight', shiftKey: '}', key: ']' },
    Quote: { keyCode: 222, code: 'Quote', shiftKey: '"', key: "'" },
    AltGraph: { keyCode: 225, code: 'AltGraph', key: 'AltGraph' },
    Props: { keyCode: 247, code: 'Props', key: 'CrSel' },
    Cancel: { keyCode: 3, key: 'Cancel', code: 'Abort' },
    Clear: { keyCode: 12, key: 'Clear', code: 'Numpad5', location: 3 },
    Shift: { keyCode: 16, key: 'Shift', code: 'ShiftLeft', location: 1 },
    Control: { keyCode: 17, key: 'Control', code: 'ControlLeft', location: 1 },
    Alt: { keyCode: 18, key: 'Alt', code: 'AltLeft', location: 1 },
    Accept: { keyCode: 30, key: 'Accept' },
    ModeChange: { keyCode: 31, key: 'ModeChange' },
    ' ': { keyCode: 32, key: ' ', code: 'Space' },
    Print: { keyCode: 42, key: 'Print' },
    Execute: { keyCode: 43, key: 'Execute', code: 'Open' },
    '\u0000': { keyCode: 46, key: '\u0000', code: 'NumpadDecimal', location: 3 },
    a: { keyCode: 65, key: 'a', code: 'KeyA' },
    b: { keyCode: 66, key: 'b', code: 'KeyB' },
    c: { keyCode: 67, key: 'c', code: 'KeyC' },
    d: { keyCode: 68, key: 'd', code: 'KeyD' },
    e: { keyCode: 69, key: 'e', code: 'KeyE' },
    f: { keyCode: 70, key: 'f', code: 'KeyF' },
    g: { keyCode: 71, key: 'g', code: 'KeyG' },
    h: { keyCode: 72, key: 'h', code: 'KeyH' },
    i: { keyCode: 73, key: 'i', code: 'KeyI' },
    j: { keyCode: 74, key: 'j', code: 'KeyJ' },
    k: { keyCode: 75, key: 'k', code: 'KeyK' },
    l: { keyCode: 76, key: 'l', code: 'KeyL' },
    m: { keyCode: 77, key: 'm', code: 'KeyM' },
    n: { keyCode: 78, key: 'n', code: 'KeyN' },
    o: { keyCode: 79, key: 'o', code: 'KeyO' },
    p: { keyCode: 80, key: 'p', code: 'KeyP' },
    q: { keyCode: 81, key: 'q', code: 'KeyQ' },
    r: { keyCode: 82, key: 'r', code: 'KeyR' },
    s: { keyCode: 83, key: 's', code: 'KeyS' },
    t: { keyCode: 84, key: 't', code: 'KeyT' },
    u: { keyCode: 85, key: 'u', code: 'KeyU' },
    v: { keyCode: 86, key: 'v', code: 'KeyV' },
    w: { keyCode: 87, key: 'w', code: 'KeyW' },
    x: { keyCode: 88, key: 'x', code: 'KeyX' },
    y: { keyCode: 89, key: 'y', code: 'KeyY' },
    z: { keyCode: 90, key: 'z', code: 'KeyZ' },
    Meta: { keyCode: 91, key: 'Meta', code: 'MetaLeft', location: 1 },
    '*': { keyCode: 106, key: '*', code: 'NumpadMultiply', location: 3 },
    '+': { keyCode: 107, key: '+', code: 'NumpadAdd', location: 3 },
    '-': { keyCode: 109, key: '-', code: 'NumpadSubtract', location: 3 },
    '/': { keyCode: 111, key: '/', code: 'NumpadDivide', location: 3 },
    ';': { keyCode: 186, key: ';', code: 'Semicolon' },
    '=': { keyCode: 187, key: '=', code: 'Equal' },
    ',': { keyCode: 188, key: ',', code: 'Comma' },
    '.': { keyCode: 190, key: '.', code: 'Period' },
    '`': { keyCode: 192, key: '`', code: 'Backquote' },
    '[': { keyCode: 219, key: '[', code: 'BracketLeft' },
    '\\': { keyCode: 220, key: '\\', code: 'Backslash' },
    ']': { keyCode: 221, key: ']', code: 'BracketRight' },
    "'": { keyCode: 222, key: "'", code: 'Quote' },
    Attn: { keyCode: 246, key: 'Attn' },
    CrSel: { keyCode: 247, key: 'CrSel', code: 'Props' },
    ExSel: { keyCode: 248, key: 'ExSel' },
    EraseEof: { keyCode: 249, key: 'EraseEof' },
    Play: { keyCode: 250, key: 'Play' },
    ZoomOut: { keyCode: 251, key: 'ZoomOut' },
    ')': { keyCode: 48, key: ')', code: 'Digit0' },
    '!': { keyCode: 49, key: '!', code: 'Digit1' },
    '@': { keyCode: 50, key: '@', code: 'Digit2' },
    '#': { keyCode: 51, key: '#', code: 'Digit3' },
    $: { keyCode: 52, key: '$', code: 'Digit4' },
    '%': { keyCode: 53, key: '%', code: 'Digit5' },
    '^': { keyCode: 54, key: '^', code: 'Digit6' },
    '&': { keyCode: 55, key: '&', code: 'Digit7' },
    '(': { keyCode: 57, key: '(', code: 'Digit9' },
    A: { keyCode: 65, key: 'A', code: 'KeyA' },
    B: { keyCode: 66, key: 'B', code: 'KeyB' },
    C: { keyCode: 67, key: 'C', code: 'KeyC' },
    D: { keyCode: 68, key: 'D', code: 'KeyD' },
    E: { keyCode: 69, key: 'E', code: 'KeyE' },
    F: { keyCode: 70, key: 'F', code: 'KeyF' },
    G: { keyCode: 71, key: 'G', code: 'KeyG' },
    H: { keyCode: 72, key: 'H', code: 'KeyH' },
    I: { keyCode: 73, key: 'I', code: 'KeyI' },
    J: { keyCode: 74, key: 'J', code: 'KeyJ' },
    K: { keyCode: 75, key: 'K', code: 'KeyK' },
    L: { keyCode: 76, key: 'L', code: 'KeyL' },
    M: { keyCode: 77, key: 'M', code: 'KeyM' },
    N: { keyCode: 78, key: 'N', code: 'KeyN' },
    O: { keyCode: 79, key: 'O', code: 'KeyO' },
    P: { keyCode: 80, key: 'P', code: 'KeyP' },
    Q: { keyCode: 81, key: 'Q', code: 'KeyQ' },
    R: { keyCode: 82, key: 'R', code: 'KeyR' },
    S: { keyCode: 83, key: 'S', code: 'KeyS' },
    T: { keyCode: 84, key: 'T', code: 'KeyT' },
    U: { keyCode: 85, key: 'U', code: 'KeyU' },
    V: { keyCode: 86, key: 'V', code: 'KeyV' },
    W: { keyCode: 87, key: 'W', code: 'KeyW' },
    X: { keyCode: 88, key: 'X', code: 'KeyX' },
    Y: { keyCode: 89, key: 'Y', code: 'KeyY' },
    Z: { keyCode: 90, key: 'Z', code: 'KeyZ' },
    ':': { keyCode: 186, key: ':', code: 'Semicolon' },
    '<': { keyCode: 188, key: '<', code: 'Comma' },
    _: { keyCode: 189, key: '_', code: 'Minus' },
    '>': { keyCode: 190, key: '>', code: 'Period' },
    '?': { keyCode: 191, key: '?', code: 'Slash' },
    '~': { keyCode: 192, key: '~', code: 'Backquote' },
    '{': { keyCode: 219, key: '{', code: 'BracketLeft' },
    '|': { keyCode: 220, key: '|', code: 'Backslash' },
    '}': { keyCode: 221, key: '}', code: 'BracketRight' },
    '"': { keyCode: 222, key: '"', code: 'Quote' },
    SoftLeft: { key: 'SoftLeft', code: 'SoftLeft', location: 4 },
    SoftRight: { key: 'SoftRight', code: 'SoftRight', location: 4 },
    Camera: { keyCode: 44, key: 'Camera', code: 'Camera', location: 4 },
    Call: { key: 'Call', code: 'Call', location: 4 },
    EndCall: { keyCode: 95, key: 'EndCall', code: 'EndCall', location: 4 },
    VolumeDown: {
        keyCode: 182,
        key: 'VolumeDown',
        code: 'VolumeDown',
        location: 4,
    },
    VolumeUp: { keyCode: 183, key: 'VolumeUp', code: 'VolumeUp', location: 4 },
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the 'License');
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an 'AS IS' BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$9 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$9 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Keyboard_instances, _Keyboard_client, _Keyboard_pressedKeys, _Keyboard_modifierBit, _Keyboard_keyDescriptionForString, _Mouse_client, _Mouse_keyboard, _Mouse_x, _Mouse_y, _Mouse_button, _Touchscreen_client, _Touchscreen_keyboard;
/**
 * Keyboard provides an api for managing a virtual keyboard.
 * The high level api is {@link Keyboard."type"},
 * which takes raw characters and generates proper keydown, keypress/input,
 * and keyup events on your page.
 *
 * @remarks
 * For finer control, you can use {@link Keyboard.down},
 * {@link Keyboard.up}, and {@link Keyboard.sendCharacter}
 * to manually fire events as if they were generated from a real keyboard.
 *
 * On MacOS, keyboard shortcuts like `⌘ A` -\> Select All do not work.
 * See {@link https://github.com/puppeteer/puppeteer/issues/1313 | #1313}.
 *
 * @example
 * An example of holding down `Shift` in order to select and delete some text:
 *
 * ```ts
 * await page.keyboard.type('Hello World!');
 * await page.keyboard.press('ArrowLeft');
 *
 * await page.keyboard.down('Shift');
 * for (let i = 0; i < ' World'.length; i++)
 *   await page.keyboard.press('ArrowLeft');
 * await page.keyboard.up('Shift');
 *
 * await page.keyboard.press('Backspace');
 * // Result text will end up saying 'Hello!'
 * ```
 *
 * @example
 * An example of pressing `A`
 *
 * ```ts
 * await page.keyboard.down('Shift');
 * await page.keyboard.press('KeyA');
 * await page.keyboard.up('Shift');
 * ```
 *
 * @public
 */
class Keyboard {
    /**
     * @internal
     */
    constructor(client) {
        _Keyboard_instances.add(this);
        _Keyboard_client.set(this, void 0);
        _Keyboard_pressedKeys.set(this, new Set());
        /**
         * @internal
         */
        this._modifiers = 0;
        __classPrivateFieldSet$9(this, _Keyboard_client, client, "f");
    }
    /**
     * Dispatches a `keydown` event.
     *
     * @remarks
     * If `key` is a single character and no modifier keys besides `Shift`
     * are being held down, a `keypress`/`input` event will also generated.
     * The `text` option can be specified to force an input event to be generated.
     * If `key` is a modifier key, `Shift`, `Meta`, `Control`, or `Alt`,
     * subsequent key presses will be sent with that modifier active.
     * To release the modifier key, use {@link Keyboard.up}.
     *
     * After the key is pressed once, subsequent calls to
     * {@link Keyboard.down} will have
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent/repeat | repeat}
     * set to true. To release the key, use {@link Keyboard.up}.
     *
     * Modifier keys DO influence {@link Keyboard.down}.
     * Holding down `Shift` will type the text in upper case.
     *
     * @param key - Name of key to press, such as `ArrowLeft`.
     * See {@link KeyInput} for a list of all key names.
     *
     * @param options - An object of options. Accepts text which, if specified,
     * generates an input event with this text.
     */
    async down(key, options = { text: undefined }) {
        const description = __classPrivateFieldGet$9(this, _Keyboard_instances, "m", _Keyboard_keyDescriptionForString).call(this, key);
        const autoRepeat = __classPrivateFieldGet$9(this, _Keyboard_pressedKeys, "f").has(description.code);
        __classPrivateFieldGet$9(this, _Keyboard_pressedKeys, "f").add(description.code);
        this._modifiers |= __classPrivateFieldGet$9(this, _Keyboard_instances, "m", _Keyboard_modifierBit).call(this, description.key);
        const text = options.text === undefined ? description.text : options.text;
        await __classPrivateFieldGet$9(this, _Keyboard_client, "f").send('Input.dispatchKeyEvent', {
            type: text ? 'keyDown' : 'rawKeyDown',
            modifiers: this._modifiers,
            windowsVirtualKeyCode: description.keyCode,
            code: description.code,
            key: description.key,
            text: text,
            unmodifiedText: text,
            autoRepeat,
            location: description.location,
            isKeypad: description.location === 3,
        });
    }
    /**
     * Dispatches a `keyup` event.
     *
     * @param key - Name of key to release, such as `ArrowLeft`.
     * See {@link KeyInput | KeyInput}
     * for a list of all key names.
     */
    async up(key) {
        const description = __classPrivateFieldGet$9(this, _Keyboard_instances, "m", _Keyboard_keyDescriptionForString).call(this, key);
        this._modifiers &= ~__classPrivateFieldGet$9(this, _Keyboard_instances, "m", _Keyboard_modifierBit).call(this, description.key);
        __classPrivateFieldGet$9(this, _Keyboard_pressedKeys, "f").delete(description.code);
        await __classPrivateFieldGet$9(this, _Keyboard_client, "f").send('Input.dispatchKeyEvent', {
            type: 'keyUp',
            modifiers: this._modifiers,
            key: description.key,
            windowsVirtualKeyCode: description.keyCode,
            code: description.code,
            location: description.location,
        });
    }
    /**
     * Dispatches a `keypress` and `input` event.
     * This does not send a `keydown` or `keyup` event.
     *
     * @remarks
     * Modifier keys DO NOT effect {@link Keyboard.sendCharacter | Keyboard.sendCharacter}.
     * Holding down `Shift` will not type the text in upper case.
     *
     * @example
     *
     * ```ts
     * page.keyboard.sendCharacter('嗨');
     * ```
     *
     * @param char - Character to send into the page.
     */
    async sendCharacter(char) {
        await __classPrivateFieldGet$9(this, _Keyboard_client, "f").send('Input.insertText', { text: char });
    }
    charIsKey(char) {
        return !!_keyDefinitions[char];
    }
    /**
     * Sends a `keydown`, `keypress`/`input`,
     * and `keyup` event for each character in the text.
     *
     * @remarks
     * To press a special key, like `Control` or `ArrowDown`,
     * use {@link Keyboard.press}.
     *
     * Modifier keys DO NOT effect `keyboard.type`.
     * Holding down `Shift` will not type the text in upper case.
     *
     * @example
     *
     * ```ts
     * await page.keyboard.type('Hello'); // Types instantly
     * await page.keyboard.type('World', {delay: 100}); // Types slower, like a user
     * ```
     *
     * @param text - A text to type into a focused element.
     * @param options - An object of options. Accepts delay which,
     * if specified, is the time to wait between `keydown` and `keyup` in milliseconds.
     * Defaults to 0.
     */
    async type(text, options = {}) {
        const delay = options.delay || undefined;
        for (const char of text) {
            if (this.charIsKey(char)) {
                await this.press(char, { delay });
            }
            else {
                if (delay) {
                    await new Promise(f => {
                        return setTimeout(f, delay);
                    });
                }
                await this.sendCharacter(char);
            }
        }
    }
    /**
     * Shortcut for {@link Keyboard.down}
     * and {@link Keyboard.up}.
     *
     * @remarks
     * If `key` is a single character and no modifier keys besides `Shift`
     * are being held down, a `keypress`/`input` event will also generated.
     * The `text` option can be specified to force an input event to be generated.
     *
     * Modifier keys DO effect {@link Keyboard.press}.
     * Holding down `Shift` will type the text in upper case.
     *
     * @param key - Name of key to press, such as `ArrowLeft`.
     * See {@link KeyInput} for a list of all key names.
     *
     * @param options - An object of options. Accepts text which, if specified,
     * generates an input event with this text. Accepts delay which,
     * if specified, is the time to wait between `keydown` and `keyup` in milliseconds.
     * Defaults to 0.
     */
    async press(key, options = {}) {
        const { delay = null } = options;
        await this.down(key, options);
        if (delay) {
            await new Promise(f => {
                return setTimeout(f, options.delay);
            });
        }
        await this.up(key);
    }
}
_Keyboard_client = new WeakMap(), _Keyboard_pressedKeys = new WeakMap(), _Keyboard_instances = new WeakSet(), _Keyboard_modifierBit = function _Keyboard_modifierBit(key) {
    if (key === 'Alt') {
        return 1;
    }
    if (key === 'Control') {
        return 2;
    }
    if (key === 'Meta') {
        return 4;
    }
    if (key === 'Shift') {
        return 8;
    }
    return 0;
}, _Keyboard_keyDescriptionForString = function _Keyboard_keyDescriptionForString(keyString) {
    const shift = this._modifiers & 8;
    const description = {
        key: '',
        keyCode: 0,
        code: '',
        text: '',
        location: 0,
    };
    const definition = _keyDefinitions[keyString];
    assert(definition, `Unknown key: "${keyString}"`);
    if (definition.key) {
        description.key = definition.key;
    }
    if (shift && definition.shiftKey) {
        description.key = definition.shiftKey;
    }
    if (definition.keyCode) {
        description.keyCode = definition.keyCode;
    }
    if (shift && definition.shiftKeyCode) {
        description.keyCode = definition.shiftKeyCode;
    }
    if (definition.code) {
        description.code = definition.code;
    }
    if (definition.location) {
        description.location = definition.location;
    }
    if (description.key.length === 1) {
        description.text = description.key;
    }
    if (definition.text) {
        description.text = definition.text;
    }
    if (shift && definition.shiftText) {
        description.text = definition.shiftText;
    }
    // if any modifiers besides shift are pressed, no text should be sent
    if (this._modifiers & -9) {
        description.text = '';
    }
    return description;
};
/**
 * The Mouse class operates in main-frame CSS pixels
 * relative to the top-left corner of the viewport.
 * @remarks
 * Every `page` object has its own Mouse, accessible with [`page.mouse`](#pagemouse).
 *
 * @example
 *
 * ```ts
 * // Using ‘page.mouse’ to trace a 100x100 square.
 * await page.mouse.move(0, 0);
 * await page.mouse.down();
 * await page.mouse.move(0, 100);
 * await page.mouse.move(100, 100);
 * await page.mouse.move(100, 0);
 * await page.mouse.move(0, 0);
 * await page.mouse.up();
 * ```
 *
 * **Note**: The mouse events trigger synthetic `MouseEvent`s.
 * This means that it does not fully replicate the functionality of what a normal user
 * would be able to do with their mouse.
 *
 * For example, dragging and selecting text is not possible using `page.mouse`.
 * Instead, you can use the {@link https://developer.mozilla.org/en-US/docs/Web/API/DocumentOrShadowRoot/getSelection | `DocumentOrShadowRoot.getSelection()`} functionality implemented in the platform.
 *
 * @example
 * For example, if you want to select all content between nodes:
 *
 * ```ts
 * await page.evaluate(
 *   (from, to) => {
 *     const selection = from.getRootNode().getSelection();
 *     const range = document.createRange();
 *     range.setStartBefore(from);
 *     range.setEndAfter(to);
 *     selection.removeAllRanges();
 *     selection.addRange(range);
 *   },
 *   fromJSHandle,
 *   toJSHandle
 * );
 * ```
 *
 * If you then would want to copy-paste your selection, you can use the clipboard api:
 *
 * ```ts
 * // The clipboard api does not allow you to copy, unless the tab is focused.
 * await page.bringToFront();
 * await page.evaluate(() => {
 *   // Copy the selected content to the clipboard
 *   document.execCommand('copy');
 *   // Obtain the content of the clipboard as a string
 *   return navigator.clipboard.readText();
 * });
 * ```
 *
 * **Note**: If you want access to the clipboard API,
 * you have to give it permission to do so:
 *
 * ```ts
 * await browser
 *   .defaultBrowserContext()
 *   .overridePermissions('<your origin>', [
 *     'clipboard-read',
 *     'clipboard-write',
 *   ]);
 * ```
 *
 * @public
 */
class Mouse {
    /**
     * @internal
     */
    constructor(client, keyboard) {
        _Mouse_client.set(this, void 0);
        _Mouse_keyboard.set(this, void 0);
        _Mouse_x.set(this, 0);
        _Mouse_y.set(this, 0);
        _Mouse_button.set(this, 'none');
        __classPrivateFieldSet$9(this, _Mouse_client, client, "f");
        __classPrivateFieldSet$9(this, _Mouse_keyboard, keyboard, "f");
    }
    /**
     * Dispatches a `mousemove` event.
     * @param x - Horizontal position of the mouse.
     * @param y - Vertical position of the mouse.
     * @param options - Optional object. If specified, the `steps` property
     * sends intermediate `mousemove` events when set to `1` (default).
     */
    async move(x, y, options = {}) {
        const { steps = 1 } = options;
        const fromX = __classPrivateFieldGet$9(this, _Mouse_x, "f"), fromY = __classPrivateFieldGet$9(this, _Mouse_y, "f");
        __classPrivateFieldSet$9(this, _Mouse_x, x, "f");
        __classPrivateFieldSet$9(this, _Mouse_y, y, "f");
        for (let i = 1; i <= steps; i++) {
            await __classPrivateFieldGet$9(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
                type: 'mouseMoved',
                button: __classPrivateFieldGet$9(this, _Mouse_button, "f"),
                x: fromX + (__classPrivateFieldGet$9(this, _Mouse_x, "f") - fromX) * (i / steps),
                y: fromY + (__classPrivateFieldGet$9(this, _Mouse_y, "f") - fromY) * (i / steps),
                modifiers: __classPrivateFieldGet$9(this, _Mouse_keyboard, "f")._modifiers,
            });
        }
    }
    /**
     * Shortcut for `mouse.move`, `mouse.down` and `mouse.up`.
     * @param x - Horizontal position of the mouse.
     * @param y - Vertical position of the mouse.
     * @param options - Optional `MouseOptions`.
     */
    async click(x, y, options = {}) {
        const { delay = null } = options;
        if (delay !== null) {
            await this.move(x, y);
            await this.down(options);
            await new Promise(f => {
                return setTimeout(f, delay);
            });
            await this.up(options);
        }
        else {
            await this.move(x, y);
            await this.down(options);
            await this.up(options);
        }
    }
    /**
     * Dispatches a `mousedown` event.
     * @param options - Optional `MouseOptions`.
     */
    async down(options = {}) {
        const { button = 'left', clickCount = 1 } = options;
        __classPrivateFieldSet$9(this, _Mouse_button, button, "f");
        await __classPrivateFieldGet$9(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
            type: 'mousePressed',
            button,
            x: __classPrivateFieldGet$9(this, _Mouse_x, "f"),
            y: __classPrivateFieldGet$9(this, _Mouse_y, "f"),
            modifiers: __classPrivateFieldGet$9(this, _Mouse_keyboard, "f")._modifiers,
            clickCount,
        });
    }
    /**
     * Dispatches a `mouseup` event.
     * @param options - Optional `MouseOptions`.
     */
    async up(options = {}) {
        const { button = 'left', clickCount = 1 } = options;
        __classPrivateFieldSet$9(this, _Mouse_button, 'none', "f");
        await __classPrivateFieldGet$9(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
            type: 'mouseReleased',
            button,
            x: __classPrivateFieldGet$9(this, _Mouse_x, "f"),
            y: __classPrivateFieldGet$9(this, _Mouse_y, "f"),
            modifiers: __classPrivateFieldGet$9(this, _Mouse_keyboard, "f")._modifiers,
            clickCount,
        });
    }
    /**
     * Dispatches a `mousewheel` event.
     * @param options - Optional: `MouseWheelOptions`.
     *
     * @example
     * An example of zooming into an element:
     *
     * ```ts
     * await page.goto(
     *   'https://mdn.mozillademos.org/en-US/docs/Web/API/Element/wheel_event$samples/Scaling_an_element_via_the_wheel?revision=1587366'
     * );
     *
     * const elem = await page.$('div');
     * const boundingBox = await elem.boundingBox();
     * await page.mouse.move(
     *   boundingBox.x + boundingBox.width / 2,
     *   boundingBox.y + boundingBox.height / 2
     * );
     *
     * await page.mouse.wheel({deltaY: -100});
     * ```
     */
    async wheel(options = {}) {
        const { deltaX = 0, deltaY = 0 } = options;
        await __classPrivateFieldGet$9(this, _Mouse_client, "f").send('Input.dispatchMouseEvent', {
            type: 'mouseWheel',
            x: __classPrivateFieldGet$9(this, _Mouse_x, "f"),
            y: __classPrivateFieldGet$9(this, _Mouse_y, "f"),
            deltaX,
            deltaY,
            modifiers: __classPrivateFieldGet$9(this, _Mouse_keyboard, "f")._modifiers,
            pointerType: 'mouse',
        });
    }
    /**
     * Dispatches a `drag` event.
     * @param start - starting point for drag
     * @param target - point to drag to
     */
    async drag(start, target) {
        const promise = new Promise(resolve => {
            __classPrivateFieldGet$9(this, _Mouse_client, "f").once('Input.dragIntercepted', event => {
                return resolve(event.data);
            });
        });
        await this.move(start.x, start.y);
        await this.down();
        await this.move(target.x, target.y);
        return promise;
    }
    /**
     * Dispatches a `dragenter` event.
     * @param target - point for emitting `dragenter` event
     * @param data - drag data containing items and operations mask
     */
    async dragEnter(target, data) {
        await __classPrivateFieldGet$9(this, _Mouse_client, "f").send('Input.dispatchDragEvent', {
            type: 'dragEnter',
            x: target.x,
            y: target.y,
            modifiers: __classPrivateFieldGet$9(this, _Mouse_keyboard, "f")._modifiers,
            data,
        });
    }
    /**
     * Dispatches a `dragover` event.
     * @param target - point for emitting `dragover` event
     * @param data - drag data containing items and operations mask
     */
    async dragOver(target, data) {
        await __classPrivateFieldGet$9(this, _Mouse_client, "f").send('Input.dispatchDragEvent', {
            type: 'dragOver',
            x: target.x,
            y: target.y,
            modifiers: __classPrivateFieldGet$9(this, _Mouse_keyboard, "f")._modifiers,
            data,
        });
    }
    /**
     * Performs a dragenter, dragover, and drop in sequence.
     * @param target - point to drop on
     * @param data - drag data containing items and operations mask
     */
    async drop(target, data) {
        await __classPrivateFieldGet$9(this, _Mouse_client, "f").send('Input.dispatchDragEvent', {
            type: 'drop',
            x: target.x,
            y: target.y,
            modifiers: __classPrivateFieldGet$9(this, _Mouse_keyboard, "f")._modifiers,
            data,
        });
    }
    /**
     * Performs a drag, dragenter, dragover, and drop in sequence.
     * @param target - point to drag from
     * @param target - point to drop on
     * @param options - An object of options. Accepts delay which,
     * if specified, is the time to wait between `dragover` and `drop` in milliseconds.
     * Defaults to 0.
     */
    async dragAndDrop(start, target, options = {}) {
        const { delay = null } = options;
        const data = await this.drag(start, target);
        await this.dragEnter(target, data);
        await this.dragOver(target, data);
        if (delay) {
            await new Promise(resolve => {
                return setTimeout(resolve, delay);
            });
        }
        await this.drop(target, data);
        await this.up();
    }
}
_Mouse_client = new WeakMap(), _Mouse_keyboard = new WeakMap(), _Mouse_x = new WeakMap(), _Mouse_y = new WeakMap(), _Mouse_button = new WeakMap();
/**
 * The Touchscreen class exposes touchscreen events.
 * @public
 */
class Touchscreen {
    /**
     * @internal
     */
    constructor(client, keyboard) {
        _Touchscreen_client.set(this, void 0);
        _Touchscreen_keyboard.set(this, void 0);
        __classPrivateFieldSet$9(this, _Touchscreen_client, client, "f");
        __classPrivateFieldSet$9(this, _Touchscreen_keyboard, keyboard, "f");
    }
    /**
     * Dispatches a `touchstart` and `touchend` event.
     * @param x - Horizontal position of the tap.
     * @param y - Vertical position of the tap.
     */
    async tap(x, y) {
        const touchPoints = [{ x: Math.round(x), y: Math.round(y) }];
        await __classPrivateFieldGet$9(this, _Touchscreen_client, "f").send('Input.dispatchTouchEvent', {
            type: 'touchStart',
            touchPoints,
            modifiers: __classPrivateFieldGet$9(this, _Touchscreen_keyboard, "f")._modifiers,
        });
        await __classPrivateFieldGet$9(this, _Touchscreen_client, "f").send('Input.dispatchTouchEvent', {
            type: 'touchEnd',
            touchPoints: [],
            modifiers: __classPrivateFieldGet$9(this, _Touchscreen_keyboard, "f")._modifiers,
        });
    }
}
_Touchscreen_client = new WeakMap(), _Touchscreen_keyboard = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @internal
 */
const _paperFormats = {
    letter: { width: 8.5, height: 11 },
    legal: { width: 8.5, height: 14 },
    tabloid: { width: 11, height: 17 },
    ledger: { width: 17, height: 11 },
    a0: { width: 33.1, height: 46.8 },
    a1: { width: 23.4, height: 33.1 },
    a2: { width: 16.54, height: 23.4 },
    a3: { width: 11.7, height: 16.54 },
    a4: { width: 8.27, height: 11.7 },
    a5: { width: 5.83, height: 8.27 },
    a6: { width: 4.13, height: 5.83 },
};

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$8 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$8 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TimeoutSettings_defaultTimeout, _TimeoutSettings_defaultNavigationTimeout;
const DEFAULT_TIMEOUT = 30000;
/**
 * @internal
 */
class TimeoutSettings {
    constructor() {
        _TimeoutSettings_defaultTimeout.set(this, void 0);
        _TimeoutSettings_defaultNavigationTimeout.set(this, void 0);
        __classPrivateFieldSet$8(this, _TimeoutSettings_defaultTimeout, null, "f");
        __classPrivateFieldSet$8(this, _TimeoutSettings_defaultNavigationTimeout, null, "f");
    }
    setDefaultTimeout(timeout) {
        __classPrivateFieldSet$8(this, _TimeoutSettings_defaultTimeout, timeout, "f");
    }
    setDefaultNavigationTimeout(timeout) {
        __classPrivateFieldSet$8(this, _TimeoutSettings_defaultNavigationTimeout, timeout, "f");
    }
    navigationTimeout() {
        if (__classPrivateFieldGet$8(this, _TimeoutSettings_defaultNavigationTimeout, "f") !== null) {
            return __classPrivateFieldGet$8(this, _TimeoutSettings_defaultNavigationTimeout, "f");
        }
        if (__classPrivateFieldGet$8(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
            return __classPrivateFieldGet$8(this, _TimeoutSettings_defaultTimeout, "f");
        }
        return DEFAULT_TIMEOUT;
    }
    timeout() {
        if (__classPrivateFieldGet$8(this, _TimeoutSettings_defaultTimeout, "f") !== null) {
            return __classPrivateFieldGet$8(this, _TimeoutSettings_defaultTimeout, "f");
        }
        return DEFAULT_TIMEOUT;
    }
}
_TimeoutSettings_defaultTimeout = new WeakMap(), _TimeoutSettings_defaultNavigationTimeout = new WeakMap();

var __classPrivateFieldSet$7 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$7 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _WebWorker_executionContext, _WebWorker_client, _WebWorker_url;
/**
 * This class represents a
 * {@link https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API | WebWorker}.
 *
 * @remarks
 * The events `workercreated` and `workerdestroyed` are emitted on the page
 * object to signal the worker lifecycle.
 *
 * @example
 *
 * ```ts
 * page.on('workercreated', worker =>
 *   console.log('Worker created: ' + worker.url())
 * );
 * page.on('workerdestroyed', worker =>
 *   console.log('Worker destroyed: ' + worker.url())
 * );
 *
 * console.log('Current workers:');
 * for (const worker of page.workers()) {
 *   console.log('  ' + worker.url());
 * }
 * ```
 *
 * @public
 */
class WebWorker extends EventEmitter {
    /**
     * @internal
     */
    constructor(client, url, consoleAPICalled, exceptionThrown) {
        super();
        _WebWorker_executionContext.set(this, createDeferredPromise());
        _WebWorker_client.set(this, void 0);
        _WebWorker_url.set(this, void 0);
        __classPrivateFieldSet$7(this, _WebWorker_client, client, "f");
        __classPrivateFieldSet$7(this, _WebWorker_url, url, "f");
        __classPrivateFieldGet$7(this, _WebWorker_client, "f").once('Runtime.executionContextCreated', async (event) => {
            const context = new ExecutionContext(client, event.context);
            __classPrivateFieldGet$7(this, _WebWorker_executionContext, "f").resolve(context);
        });
        __classPrivateFieldGet$7(this, _WebWorker_client, "f").on('Runtime.consoleAPICalled', async (event) => {
            const context = await __classPrivateFieldGet$7(this, _WebWorker_executionContext, "f");
            return consoleAPICalled(event.type, event.args.map((object) => {
                return new JSHandle(context, object);
            }), event.stackTrace);
        });
        __classPrivateFieldGet$7(this, _WebWorker_client, "f").on('Runtime.exceptionThrown', exception => {
            return exceptionThrown(exception.exceptionDetails);
        });
        // This might fail if the target is closed before we receive all execution contexts.
        __classPrivateFieldGet$7(this, _WebWorker_client, "f").send('Runtime.enable').catch(debugError);
    }
    /**
     * @internal
     */
    async executionContext() {
        return __classPrivateFieldGet$7(this, _WebWorker_executionContext, "f");
    }
    /**
     * @returns The URL of this web worker.
     */
    url() {
        return __classPrivateFieldGet$7(this, _WebWorker_url, "f");
    }
    /**
     * If the function passed to the `worker.evaluate` returns a Promise, then
     * `worker.evaluate` would wait for the promise to resolve and return its
     * value. If the function passed to the `worker.evaluate` returns a
     * non-serializable value, then `worker.evaluate` resolves to `undefined`.
     * DevTools Protocol also supports transferring some additional values that
     * are not serializable by `JSON`: `-0`, `NaN`, `Infinity`, `-Infinity`, and
     * bigint literals.
     * Shortcut for `await worker.executionContext()).evaluate(pageFunction, ...args)`.
     *
     * @param pageFunction - Function to be evaluated in the worker context.
     * @param args - Arguments to pass to `pageFunction`.
     * @returns Promise which resolves to the return value of `pageFunction`.
     */
    async evaluate(pageFunction, ...args) {
        const context = await __classPrivateFieldGet$7(this, _WebWorker_executionContext, "f");
        return context.evaluate(pageFunction, ...args);
    }
    /**
     * The only difference between `worker.evaluate` and `worker.evaluateHandle`
     * is that `worker.evaluateHandle` returns in-page object (JSHandle). If the
     * function passed to the `worker.evaluateHandle` returns a `Promise`, then
     * `worker.evaluateHandle` would wait for the promise to resolve and return
     * its value. Shortcut for
     * `await worker.executionContext()).evaluateHandle(pageFunction, ...args)`
     *
     * @param pageFunction - Function to be evaluated in the page context.
     * @param args - Arguments to pass to `pageFunction`.
     * @returns Promise which resolves to the return value of `pageFunction`.
     */
    async evaluateHandle(pageFunction, ...args) {
        const context = await __classPrivateFieldGet$7(this, _WebWorker_executionContext, "f");
        return context.evaluateHandle(pageFunction, ...args);
    }
}
_WebWorker_executionContext = new WeakMap(), _WebWorker_client = new WeakMap(), _WebWorker_url = new WeakMap();

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$6 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$6 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Page_instances, _Page_closed, _Page_client, _Page_target, _Page_keyboard, _Page_mouse, _Page_timeoutSettings, _Page_touchscreen, _Page_accessibility, _Page_frameManager, _Page_emulationManager, _Page_pageBindings, _Page_coverage, _Page_javascriptEnabled, _Page_viewport, _Page_screenshotTaskQueue, _Page_workers, _Page_fileChooserPromises, _Page_disconnectPromise, _Page_userDragInterceptionEnabled, _Page_handlerMap, _Page_onDetachedFromTarget, _Page_onAttachedToTarget, _Page_initialize, _Page_onFileChooser, _Page_onTargetCrashed, _Page_onLogEntryAdded, _Page_emitMetrics, _Page_buildMetricsObject, _Page_handleException, _Page_onConsoleAPI, _Page_onBindingCalled, _Page_addConsoleMessage, _Page_onDialog, _Page_resetDefaultBackgroundColor, _Page_setTransparentBackgroundColor, _Page_sessionClosePromise, _Page_go, _Page_screenshotTask;
/**
 * Page provides methods to interact with a single tab or
 * {@link https://developer.chrome.com/extensions/background_pages | extension background page}
 * in Chromium.
 *
 * :::note
 *
 * One Browser instance might have multiple Page instances.
 *
 * :::
 *
 * @example
 * This example creates a page, navigates it to a URL, and then saves a screenshot:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   await page.screenshot({path: 'screenshot.png'});
 *   await browser.close();
 * })();
 * ```
 *
 * The Page class extends from Puppeteer's {@link EventEmitter} class and will
 * emit various events which are documented in the {@link PageEmittedEvents} enum.
 *
 * @example
 * This example logs a message for a single page `load` event:
 *
 * ```ts
 * page.once('load', () => console.log('Page loaded!'));
 * ```
 *
 * To unsubscribe from events use the {@link Page.off} method:
 *
 * ```ts
 * function logRequest(interceptedRequest) {
 *   console.log('A request was made:', interceptedRequest.url());
 * }
 * page.on('request', logRequest);
 * // Sometime later...
 * page.off('request', logRequest);
 * ```
 *
 * @public
 */
class Page extends EventEmitter {
    /**
     * @internal
     */
    constructor(client, target, ignoreHTTPSErrors, screenshotTaskQueue) {
        super();
        _Page_instances.add(this);
        _Page_closed.set(this, false);
        _Page_client.set(this, void 0);
        _Page_target.set(this, void 0);
        _Page_keyboard.set(this, void 0);
        _Page_mouse.set(this, void 0);
        _Page_timeoutSettings.set(this, new TimeoutSettings());
        _Page_touchscreen.set(this, void 0);
        _Page_accessibility.set(this, void 0);
        _Page_frameManager.set(this, void 0);
        _Page_emulationManager.set(this, void 0);
        _Page_pageBindings.set(this, new Map());
        _Page_coverage.set(this, void 0);
        _Page_javascriptEnabled.set(this, true);
        _Page_viewport.set(this, void 0);
        _Page_screenshotTaskQueue.set(this, void 0);
        _Page_workers.set(this, new Map());
        _Page_fileChooserPromises.set(this, new Set());
        _Page_disconnectPromise.set(this, void 0);
        _Page_userDragInterceptionEnabled.set(this, false);
        _Page_handlerMap.set(this, new WeakMap());
        _Page_onDetachedFromTarget.set(this, (target) => {
            var _a;
            const sessionId = (_a = target._session()) === null || _a === void 0 ? void 0 : _a.id();
            __classPrivateFieldGet$6(this, _Page_frameManager, "f").onDetachedFromTarget(target);
            const worker = __classPrivateFieldGet$6(this, _Page_workers, "f").get(sessionId);
            if (!worker) {
                return;
            }
            __classPrivateFieldGet$6(this, _Page_workers, "f").delete(sessionId);
            this.emit("workerdestroyed" /* PageEmittedEvents.WorkerDestroyed */, worker);
        });
        _Page_onAttachedToTarget.set(this, async (createdTarget) => {
            __classPrivateFieldGet$6(this, _Page_frameManager, "f").onAttachedToTarget(createdTarget);
            if (createdTarget._getTargetInfo().type === 'worker') {
                const session = createdTarget._session();
                assert(session);
                const worker = new WebWorker(session, createdTarget.url(), __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_addConsoleMessage).bind(this), __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_handleException).bind(this));
                __classPrivateFieldGet$6(this, _Page_workers, "f").set(session.id(), worker);
                this.emit("workercreated" /* PageEmittedEvents.WorkerCreated */, worker);
            }
            if (createdTarget._session()) {
                __classPrivateFieldGet$6(this, _Page_target, "f")
                    ._targetManager()
                    .addTargetInterceptor(createdTarget._session(), __classPrivateFieldGet$6(this, _Page_onAttachedToTarget, "f"));
            }
        });
        __classPrivateFieldSet$6(this, _Page_client, client, "f");
        __classPrivateFieldSet$6(this, _Page_target, target, "f");
        __classPrivateFieldSet$6(this, _Page_keyboard, new Keyboard(client), "f");
        __classPrivateFieldSet$6(this, _Page_mouse, new Mouse(client, __classPrivateFieldGet$6(this, _Page_keyboard, "f")), "f");
        __classPrivateFieldSet$6(this, _Page_touchscreen, new Touchscreen(client, __classPrivateFieldGet$6(this, _Page_keyboard, "f")), "f");
        __classPrivateFieldSet$6(this, _Page_accessibility, new Accessibility(client), "f");
        __classPrivateFieldSet$6(this, _Page_frameManager, new FrameManager(client, this, ignoreHTTPSErrors, __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f")), "f");
        __classPrivateFieldSet$6(this, _Page_emulationManager, new EmulationManager(client), "f");
        __classPrivateFieldSet$6(this, _Page_coverage, new Coverage(client), "f");
        __classPrivateFieldSet$6(this, _Page_screenshotTaskQueue, screenshotTaskQueue, "f");
        __classPrivateFieldSet$6(this, _Page_viewport, null, "f");
        __classPrivateFieldGet$6(this, _Page_target, "f")
            ._targetManager()
            .addTargetInterceptor(__classPrivateFieldGet$6(this, _Page_client, "f"), __classPrivateFieldGet$6(this, _Page_onAttachedToTarget, "f"));
        __classPrivateFieldGet$6(this, _Page_target, "f")
            ._targetManager()
            .on("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$6(this, _Page_onDetachedFromTarget, "f"));
        __classPrivateFieldGet$6(this, _Page_frameManager, "f").on(FrameManagerEmittedEvents.FrameAttached, event => {
            return this.emit("frameattached" /* PageEmittedEvents.FrameAttached */, event);
        });
        __classPrivateFieldGet$6(this, _Page_frameManager, "f").on(FrameManagerEmittedEvents.FrameDetached, event => {
            return this.emit("framedetached" /* PageEmittedEvents.FrameDetached */, event);
        });
        __classPrivateFieldGet$6(this, _Page_frameManager, "f").on(FrameManagerEmittedEvents.FrameNavigated, event => {
            return this.emit("framenavigated" /* PageEmittedEvents.FrameNavigated */, event);
        });
        const networkManager = __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager;
        networkManager.on(NetworkManagerEmittedEvents.Request, event => {
            return this.emit("request" /* PageEmittedEvents.Request */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.RequestServedFromCache, event => {
            return this.emit("requestservedfromcache" /* PageEmittedEvents.RequestServedFromCache */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.Response, event => {
            return this.emit("response" /* PageEmittedEvents.Response */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.RequestFailed, event => {
            return this.emit("requestfailed" /* PageEmittedEvents.RequestFailed */, event);
        });
        networkManager.on(NetworkManagerEmittedEvents.RequestFinished, event => {
            return this.emit("requestfinished" /* PageEmittedEvents.RequestFinished */, event);
        });
        client.on('Page.domContentEventFired', () => {
            return this.emit("domcontentloaded" /* PageEmittedEvents.DOMContentLoaded */);
        });
        client.on('Page.loadEventFired', () => {
            return this.emit("load" /* PageEmittedEvents.Load */);
        });
        client.on('Runtime.consoleAPICalled', event => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_onConsoleAPI).call(this, event);
        });
        client.on('Runtime.bindingCalled', event => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_onBindingCalled).call(this, event);
        });
        client.on('Page.javascriptDialogOpening', event => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_onDialog).call(this, event);
        });
        client.on('Runtime.exceptionThrown', exception => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_handleException).call(this, exception.exceptionDetails);
        });
        client.on('Inspector.targetCrashed', () => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_onTargetCrashed).call(this);
        });
        client.on('Performance.metrics', event => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_emitMetrics).call(this, event);
        });
        client.on('Log.entryAdded', event => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_onLogEntryAdded).call(this, event);
        });
        client.on('Page.fileChooserOpened', event => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_onFileChooser).call(this, event);
        });
        __classPrivateFieldGet$6(this, _Page_target, "f")._isClosedPromise.then(() => {
            __classPrivateFieldGet$6(this, _Page_target, "f")
                ._targetManager()
                .removeTargetInterceptor(__classPrivateFieldGet$6(this, _Page_client, "f"), __classPrivateFieldGet$6(this, _Page_onAttachedToTarget, "f"));
            __classPrivateFieldGet$6(this, _Page_target, "f")
                ._targetManager()
                .off("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$6(this, _Page_onDetachedFromTarget, "f"));
            this.emit("close" /* PageEmittedEvents.Close */);
            __classPrivateFieldSet$6(this, _Page_closed, true, "f");
        });
    }
    /**
     * @internal
     */
    static async _create(client, target, ignoreHTTPSErrors, defaultViewport, screenshotTaskQueue) {
        const page = new Page(client, target, ignoreHTTPSErrors, screenshotTaskQueue);
        await __classPrivateFieldGet$6(page, _Page_instances, "m", _Page_initialize).call(page);
        if (defaultViewport) {
            await page.setViewport(defaultViewport);
        }
        return page;
    }
    /**
     * @returns `true` if drag events are being intercepted, `false` otherwise.
     */
    isDragInterceptionEnabled() {
        return __classPrivateFieldGet$6(this, _Page_userDragInterceptionEnabled, "f");
    }
    /**
     * @returns `true` if the page has JavaScript enabled, `false` otherwise.
     */
    isJavaScriptEnabled() {
        return __classPrivateFieldGet$6(this, _Page_javascriptEnabled, "f");
    }
    /**
     * Listen to page events.
     *
     * :::note
     *
     * This method exists to define event typings and handle proper wireup of
     * cooperative request interception. Actual event listening and dispatching is
     * delegated to {@link EventEmitter}.
     *
     * :::
     */
    on(eventName, handler) {
        if (eventName === 'request') {
            const wrap = __classPrivateFieldGet$6(this, _Page_handlerMap, "f").get(handler) ||
                ((event) => {
                    event.enqueueInterceptAction(() => {
                        return handler(event);
                    });
                });
            __classPrivateFieldGet$6(this, _Page_handlerMap, "f").set(handler, wrap);
            return super.on(eventName, wrap);
        }
        return super.on(eventName, handler);
    }
    once(eventName, handler) {
        // Note: this method only exists to define the types; we delegate the impl
        // to EventEmitter.
        return super.once(eventName, handler);
    }
    off(eventName, handler) {
        if (eventName === 'request') {
            handler = __classPrivateFieldGet$6(this, _Page_handlerMap, "f").get(handler) || handler;
        }
        return super.off(eventName, handler);
    }
    /**
     * This method is typically coupled with an action that triggers file
     * choosing.
     *
     * :::caution
     *
     * This must be called before the file chooser is launched. It will not return
     * a currently active file chooser.
     *
     * :::
     *
     * @remarks
     * In non-headless Chromium, this method results in the native file picker
     * dialog `not showing up` for the user.
     *
     * @example
     * The following example clicks a button that issues a file chooser
     * and then responds with `/tmp/myfile.pdf` as if a user has selected this file.
     *
     * ```ts
     * const [fileChooser] = await Promise.all([
     *   page.waitForFileChooser(),
     *   page.click('#upload-file-button'),
     *   // some button that triggers file selection
     * ]);
     * await fileChooser.accept(['/tmp/myfile.pdf']);
     * ```
     */
    async waitForFileChooser(options = {}) {
        if (!__classPrivateFieldGet$6(this, _Page_fileChooserPromises, "f").size) {
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.setInterceptFileChooserDialog', {
                enabled: true,
            });
        }
        const { timeout = __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f").timeout() } = options;
        const promise = createDeferredPromiseWithTimer(`Waiting for \`FileChooser\` failed: ${timeout}ms exceeded`);
        __classPrivateFieldGet$6(this, _Page_fileChooserPromises, "f").add(promise);
        return promise.catch(error => {
            __classPrivateFieldGet$6(this, _Page_fileChooserPromises, "f").delete(promise);
            throw error;
        });
    }
    /**
     * Sets the page's geolocation.
     *
     * @remarks
     * Consider using {@link BrowserContext.overridePermissions} to grant
     * permissions for the page to read its geolocation.
     *
     * @example
     *
     * ```ts
     * await page.setGeolocation({latitude: 59.95, longitude: 30.31667});
     * ```
     */
    async setGeolocation(options) {
        const { longitude, latitude, accuracy = 0 } = options;
        if (longitude < -180 || longitude > 180) {
            throw new Error(`Invalid longitude "${longitude}": precondition -180 <= LONGITUDE <= 180 failed.`);
        }
        if (latitude < -90 || latitude > 90) {
            throw new Error(`Invalid latitude "${latitude}": precondition -90 <= LATITUDE <= 90 failed.`);
        }
        if (accuracy < 0) {
            throw new Error(`Invalid accuracy "${accuracy}": precondition 0 <= ACCURACY failed.`);
        }
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setGeolocationOverride', {
            longitude,
            latitude,
            accuracy,
        });
    }
    /**
     * @returns A target this page was created from.
     */
    target() {
        return __classPrivateFieldGet$6(this, _Page_target, "f");
    }
    /**
     * @internal
     */
    _client() {
        return __classPrivateFieldGet$6(this, _Page_client, "f");
    }
    /**
     * Get the browser the page belongs to.
     */
    browser() {
        return __classPrivateFieldGet$6(this, _Page_target, "f").browser();
    }
    /**
     * Get the browser context that the page belongs to.
     */
    browserContext() {
        return __classPrivateFieldGet$6(this, _Page_target, "f").browserContext();
    }
    /**
     * @returns The page's main frame.
     *
     * @remarks
     * Page is guaranteed to have a main frame which persists during navigations.
     */
    mainFrame() {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").mainFrame();
    }
    get keyboard() {
        return __classPrivateFieldGet$6(this, _Page_keyboard, "f");
    }
    get touchscreen() {
        return __classPrivateFieldGet$6(this, _Page_touchscreen, "f");
    }
    get coverage() {
        return __classPrivateFieldGet$6(this, _Page_coverage, "f");
    }
    get accessibility() {
        return __classPrivateFieldGet$6(this, _Page_accessibility, "f");
    }
    /**
     * @returns An array of all frames attached to the page.
     */
    frames() {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").frames();
    }
    /**
     * @returns all of the dedicated {@link
     * https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API |
     * WebWorkers} associated with the page.
     *
     * @remarks
     * This does not contain ServiceWorkers
     */
    workers() {
        return Array.from(__classPrivateFieldGet$6(this, _Page_workers, "f").values());
    }
    /**
     * Activating request interception enables {@link HTTPRequest.abort},
     * {@link HTTPRequest.continue} and {@link HTTPRequest.respond} methods. This
     * provides the capability to modify network requests that are made by a page.
     *
     * Once request interception is enabled, every request will stall unless it's
     * continued, responded or aborted; or completed using the browser cache.
     *
     * Enabling request interception disables page caching.
     *
     * See the
     * {@link https://pptr.dev/next/guides/request-interception|Request interception guide}
     * for more details.
     *
     * @example
     * An example of a naïve request interceptor that aborts all image requests:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.setRequestInterception(true);
     *   page.on('request', interceptedRequest => {
     *     if (
     *       interceptedRequest.url().endsWith('.png') ||
     *       interceptedRequest.url().endsWith('.jpg')
     *     )
     *       interceptedRequest.abort();
     *     else interceptedRequest.continue();
     *   });
     *   await page.goto('https://example.com');
     *   await browser.close();
     * })();
     * ```
     *
     * @param value - Whether to enable request interception.
     */
    async setRequestInterception(value) {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager.setRequestInterception(value);
    }
    /**
     * @param enabled - Whether to enable drag interception.
     *
     * @remarks
     * Activating drag interception enables the `Input.drag`,
     * methods This provides the capability to capture drag events emitted
     * on the page, which can then be used to simulate drag-and-drop.
     */
    async setDragInterception(enabled) {
        __classPrivateFieldSet$6(this, _Page_userDragInterceptionEnabled, enabled, "f");
        return __classPrivateFieldGet$6(this, _Page_client, "f").send('Input.setInterceptDrags', { enabled });
    }
    /**
     * @param enabled - When `true`, enables offline mode for the page.
     * @remarks
     * NOTE: while this method sets the network connection to offline, it does
     * not change the parameters used in [page.emulateNetworkConditions(networkConditions)]
     * (#pageemulatenetworkconditionsnetworkconditions)
     */
    setOfflineMode(enabled) {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager.setOfflineMode(enabled);
    }
    /**
     * @param networkConditions - Passing `null` disables network condition emulation.
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * const slow3G = puppeteer.networkConditions['Slow 3G'];
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.emulateNetworkConditions(slow3G);
     *   await page.goto('https://www.google.com');
     *   // other actions...
     *   await browser.close();
     * })();
     * ```
     *
     * @remarks
     * NOTE: This does not affect WebSockets and WebRTC PeerConnections (see
     * https://crbug.com/563644). To set the page offline, you can use
     * [page.setOfflineMode(enabled)](#pagesetofflinemodeenabled).
     */
    emulateNetworkConditions(networkConditions) {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager.emulateNetworkConditions(networkConditions);
    }
    /**
     * This setting will change the default maximum navigation time for the
     * following methods and related shortcuts:
     *
     * - {@link Page.goBack | page.goBack(options)}
     *
     * - {@link Page.goForward | page.goForward(options)}
     *
     * - {@link Page.goto | page.goto(url,options)}
     *
     * - {@link Page.reload | page.reload(options)}
     *
     * - {@link Page.setContent | page.setContent(html,options)}
     *
     * - {@link Page.waitForNavigation | page.waitForNavigation(options)}
     *   @param timeout - Maximum navigation time in milliseconds.
     */
    setDefaultNavigationTimeout(timeout) {
        __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f").setDefaultNavigationTimeout(timeout);
    }
    /**
     * @param timeout - Maximum time in milliseconds.
     */
    setDefaultTimeout(timeout) {
        __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f").setDefaultTimeout(timeout);
    }
    /**
     * Runs `document.querySelector` within the page. If no element matches the
     * selector, the return value resolves to `null`.
     *
     * @param selector - A `selector` to query page for
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query page for.
     */
    async $(selector) {
        return this.mainFrame().$(selector);
    }
    /**
     * The method runs `document.querySelectorAll` within the page. If no elements
     * match the selector, the return value resolves to `[]`.
     * @remarks
     * Shortcut for {@link Frame.$$ | Page.mainFrame().$$(selector) }.
     * @param selector - A `selector` to query page for
     */
    async $$(selector) {
        return this.mainFrame().$$(selector);
    }
    /**
     * @remarks
     *
     * The only difference between {@link Page.evaluate | page.evaluate} and
     * `page.evaluateHandle` is that `evaluateHandle` will return the value
     * wrapped in an in-page object.
     *
     * If the function passed to `page.evaluteHandle` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     *
     * ```ts
     * const aHandle = await page.evaluateHandle('document');
     * ```
     *
     * @example
     * {@link JSHandle} instances can be passed as arguments to the `pageFunction`:
     *
     * ```ts
     * const aHandle = await page.evaluateHandle(() => document.body);
     * const resultHandle = await page.evaluateHandle(
     *   body => body.innerHTML,
     *   aHandle
     * );
     * console.log(await resultHandle.jsonValue());
     * await resultHandle.dispose();
     * ```
     *
     * Most of the time this function returns a {@link JSHandle},
     * but if `pageFunction` returns a reference to an element,
     * you instead get an {@link ElementHandle} back:
     *
     * @example
     *
     * ```ts
     * const button = await page.evaluateHandle(() =>
     *   document.querySelector('button')
     * );
     * // can call `click` because `button` is an `ElementHandle`
     * await button.click();
     * ```
     *
     * The TypeScript definitions assume that `evaluateHandle` returns
     * a `JSHandle`, but if you know it's going to return an
     * `ElementHandle`, pass it as the generic argument:
     *
     * ```ts
     * const button = await page.evaluateHandle<ElementHandle>(...);
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     */
    async evaluateHandle(pageFunction, ...args) {
        const context = await this.mainFrame().executionContext();
        return context.evaluateHandle(pageFunction, ...args);
    }
    /**
     * This method iterates the JavaScript heap and finds all objects with the
     * given prototype.
     *
     * @example
     *
     * ```ts
     * // Create a Map object
     * await page.evaluate(() => (window.map = new Map()));
     * // Get a handle to the Map object prototype
     * const mapPrototype = await page.evaluateHandle(() => Map.prototype);
     * // Query all map instances into an array
     * const mapInstances = await page.queryObjects(mapPrototype);
     * // Count amount of map objects in heap
     * const count = await page.evaluate(maps => maps.length, mapInstances);
     * await mapInstances.dispose();
     * await mapPrototype.dispose();
     * ```
     *
     * @param prototypeHandle - a handle to the object prototype.
     * @returns Promise which resolves to a handle to an array of objects with
     * this prototype.
     */
    async queryObjects(prototypeHandle) {
        const context = await this.mainFrame().executionContext();
        assert(!prototypeHandle.disposed, 'Prototype JSHandle is disposed!');
        const remoteObject = prototypeHandle.remoteObject();
        assert(remoteObject.objectId, 'Prototype JSHandle must not be referencing primitive value');
        const response = await context._client.send('Runtime.queryObjects', {
            prototypeObjectId: remoteObject.objectId,
        });
        return createJSHandle(context, response.objects);
    }
    /**
     * This method runs `document.querySelector` within the page and passes the
     * result as the first argument to the `pageFunction`.
     *
     * @remarks
     *
     * If no element is found matching `selector`, the method will throw an error.
     *
     * If `pageFunction` returns a promise `$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```ts
     * const searchValue = await page.$eval('#search', el => el.value);
     * const preloadHref = await page.$eval('link[rel=preload]', el => el.href);
     * const html = await page.$eval('.main-container', el => el.outerHTML);
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```ts
     * // if you don't provide HTMLInputElement here, TS will error
     * // as `value` is not on `Element`
     * const searchValue = await page.$eval(
     *   '#search',
     *   (el: HTMLInputElement) => el.value
     * );
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$eval`:
     *
     * @example
     *
     * ```ts
     * // The compiler can infer the return type in this case, but if it can't
     * // or if you want to be more explicit, provide it as the generic type.
     * const searchValue = await page.$eval<string>(
     *   '#search',
     *   (el: HTMLInputElement) => el.value
     * );
     * ```
     *
     * @param selector - the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query for
     * @param pageFunction - the function to be evaluated in the page context.
     * Will be passed the result of `document.querySelector(selector)` as its
     * first argument.
     * @param args - any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    async $eval(selector, pageFunction, ...args) {
        return this.mainFrame().$eval(selector, pageFunction, ...args);
    }
    /**
     * This method runs `Array.from(document.querySelectorAll(selector))` within
     * the page and passes the result as the first argument to the `pageFunction`.
     *
     * @remarks
     * If `pageFunction` returns a promise `$$eval` will wait for the promise to
     * resolve and then return its value.
     *
     * @example
     *
     * ```ts
     * // get the amount of divs on the page
     * const divCount = await page.$$eval('div', divs => divs.length);
     *
     * // get the text content of all the `.options` elements:
     * const options = await page.$$eval('div > span.options', options => {
     *   return options.map(option => option.textContent);
     * });
     * ```
     *
     * If you are using TypeScript, you may have to provide an explicit type to the
     * first argument of the `pageFunction`.
     * By default it is typed as `Element[]`, but you may need to provide a more
     * specific sub-type:
     *
     * @example
     *
     * ```ts
     * // if you don't provide HTMLInputElement here, TS will error
     * // as `value` is not on `Element`
     * await page.$$eval('input', (elements: HTMLInputElement[]) => {
     *   return elements.map(e => e.value);
     * });
     * ```
     *
     * The compiler should be able to infer the return type
     * from the `pageFunction` you provide. If it is unable to, you can use the generic
     * type to tell the compiler what return type you expect from `$$eval`:
     *
     * @example
     *
     * ```ts
     * // The compiler can infer the return type in this case, but if it can't
     * // or if you want to be more explicit, provide it as the generic type.
     * const allInputValues = await page.$$eval<string[]>(
     *   'input',
     *   (elements: HTMLInputElement[]) => elements.map(e => e.textContent)
     * );
     * ```
     *
     * @param selector - the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to query for
     * @param pageFunction - the function to be evaluated in the page context.
     * Will be passed the result of
     * `Array.from(document.querySelectorAll(selector))` as its first argument.
     * @param args - any additional arguments to pass through to `pageFunction`.
     *
     * @returns The result of calling `pageFunction`. If it returns an element it
     * is wrapped in an {@link ElementHandle}, else the raw value itself is
     * returned.
     */
    async $$eval(selector, pageFunction, ...args) {
        return this.mainFrame().$$eval(selector, pageFunction, ...args);
    }
    /**
     * The method evaluates the XPath expression relative to the page document as
     * its context node. If there are no such elements, the method resolves to an
     * empty array.
     *
     * @remarks
     * Shortcut for {@link Frame.$x | Page.mainFrame().$x(expression) }.
     *
     * @param expression - Expression to evaluate
     */
    async $x(expression) {
        return this.mainFrame().$x(expression);
    }
    /**
     * If no URLs are specified, this method returns cookies for the current page
     * URL. If URLs are specified, only cookies for those URLs are returned.
     */
    async cookies(...urls) {
        const originalCookies = (await __classPrivateFieldGet$6(this, _Page_client, "f").send('Network.getCookies', {
            urls: urls.length ? urls : [this.url()],
        })).cookies;
        const unsupportedCookieAttributes = ['priority'];
        const filterUnsupportedAttributes = (cookie) => {
            for (const attr of unsupportedCookieAttributes) {
                delete cookie[attr];
            }
            return cookie;
        };
        return originalCookies.map(filterUnsupportedAttributes);
    }
    async deleteCookie(...cookies) {
        const pageURL = this.url();
        for (const cookie of cookies) {
            const item = Object.assign({}, cookie);
            if (!cookie.url && pageURL.startsWith('http')) {
                item.url = pageURL;
            }
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Network.deleteCookies', item);
        }
    }
    /**
     * @example
     *
     * ```ts
     * await page.setCookie(cookieObject1, cookieObject2);
     * ```
     */
    async setCookie(...cookies) {
        const pageURL = this.url();
        const startsWithHTTP = pageURL.startsWith('http');
        const items = cookies.map(cookie => {
            const item = Object.assign({}, cookie);
            if (!item.url && startsWithHTTP) {
                item.url = pageURL;
            }
            assert(item.url !== 'about:blank', `Blank page can not have cookie "${item.name}"`);
            assert(!String.prototype.startsWith.call(item.url || '', 'data:'), `Data URL page can not have cookie "${item.name}"`);
            return item;
        });
        await this.deleteCookie(...items);
        if (items.length) {
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Network.setCookies', { cookies: items });
        }
    }
    /**
     * Adds a `<script>` tag into the page with the desired URL or content.
     *
     * @remarks
     * Shortcut for
     * {@link Frame.addScriptTag | page.mainFrame().addScriptTag(options)}.
     *
     * @returns Promise which resolves to the added tag when the script's onload
     * fires or when the script content was injected into frame.
     */
    async addScriptTag(options) {
        return this.mainFrame().addScriptTag(options);
    }
    /**
     * Adds a `<link rel="stylesheet">` tag into the page with the desired URL or a
     * `<style type="text/css">` tag with the content.
     * @returns Promise which resolves to the added tag when the stylesheet's
     * onload fires or when the CSS content was injected into frame.
     */
    async addStyleTag(options) {
        return this.mainFrame().addStyleTag(options);
    }
    /**
     * The method adds a function called `name` on the page's `window` object.
     * When called, the function executes `puppeteerFunction` in node.js and
     * returns a `Promise` which resolves to the return value of
     * `puppeteerFunction`.
     *
     * If the puppeteerFunction returns a `Promise`, it will be awaited.
     *
     * :::note
     *
     * Functions installed via `page.exposeFunction` survive navigations.
     *
     * :::note
     *
     * @example
     * An example of adding an `md5` function into the page:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * const crypto = require('crypto');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   page.on('console', msg => console.log(msg.text()));
     *   await page.exposeFunction('md5', text =>
     *     crypto.createHash('md5').update(text).digest('hex')
     *   );
     *   await page.evaluate(async () => {
     *     // use window.md5 to compute hashes
     *     const myString = 'PUPPETEER';
     *     const myHash = await window.md5(myString);
     *     console.log(`md5 of ${myString} is ${myHash}`);
     *   });
     *   await browser.close();
     * })();
     * ```
     *
     * @example
     * An example of adding a `window.readfile` function into the page:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * const fs = require('fs');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   page.on('console', msg => console.log(msg.text()));
     *   await page.exposeFunction('readfile', async filePath => {
     *     return new Promise((resolve, reject) => {
     *       fs.readFile(filePath, 'utf8', (err, text) => {
     *         if (err) reject(err);
     *         else resolve(text);
     *       });
     *     });
     *   });
     *   await page.evaluate(async () => {
     *     // use window.readfile to read contents of a file
     *     const content = await window.readfile('/etc/hosts');
     *     console.log(content);
     *   });
     *   await browser.close();
     * })();
     * ```
     *
     * @param name - Name of the function on the window object
     * @param pptrFunction - Callback function which will be called in Puppeteer's
     * context.
     */
    async exposeFunction(name, pptrFunction) {
        if (__classPrivateFieldGet$6(this, _Page_pageBindings, "f").has(name)) {
            throw new Error(`Failed to add page binding with name ${name}: window['${name}'] already exists!`);
        }
        let exposedFunction;
        switch (typeof pptrFunction) {
            case 'function':
                exposedFunction = pptrFunction;
                break;
            default:
                exposedFunction = pptrFunction.default;
                break;
        }
        __classPrivateFieldGet$6(this, _Page_pageBindings, "f").set(name, exposedFunction);
        const expression = pageBindingInitString('exposedFun', name);
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Runtime.addBinding', { name: name });
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.addScriptToEvaluateOnNewDocument', {
            source: expression,
        });
        await Promise.all(this.frames().map(frame => {
            return frame.evaluate(expression).catch(debugError);
        }));
    }
    /**
     * Provide credentials for `HTTP authentication`.
     *
     * @remarks
     * To disable authentication, pass `null`.
     */
    async authenticate(credentials) {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager.authenticate(credentials);
    }
    /**
     * The extra HTTP headers will be sent with every request the page initiates.
     *
     * :::tip
     *
     * All HTTP header names are lowercased. (HTTP headers are
     * case-insensitive, so this shouldn’t impact your server code.)
     *
     * :::
     *
     * :::note
     *
     * page.setExtraHTTPHeaders does not guarantee the order of headers in
     * the outgoing requests.
     *
     * :::
     *
     * @param headers - An object containing additional HTTP headers to be sent
     * with every request. All header values must be strings.
     */
    async setExtraHTTPHeaders(headers) {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager.setExtraHTTPHeaders(headers);
    }
    /**
     * @param userAgent - Specific user agent to use in this page
     * @param userAgentData - Specific user agent client hint data to use in this
     * page
     * @returns Promise which resolves when the user agent is set.
     */
    async setUserAgent(userAgent, userAgentMetadata) {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager.setUserAgent(userAgent, userAgentMetadata);
    }
    /**
     * @returns Object containing metrics as key/value pairs.
     *
     * - `Timestamp` : The timestamp when the metrics sample was taken.
     *
     * - `Documents` : Number of documents in the page.
     *
     * - `Frames` : Number of frames in the page.
     *
     * - `JSEventListeners` : Number of events in the page.
     *
     * - `Nodes` : Number of DOM nodes in the page.
     *
     * - `LayoutCount` : Total number of full or partial page layout.
     *
     * - `RecalcStyleCount` : Total number of page style recalculations.
     *
     * - `LayoutDuration` : Combined durations of all page layouts.
     *
     * - `RecalcStyleDuration` : Combined duration of all page style
     *   recalculations.
     *
     * - `ScriptDuration` : Combined duration of JavaScript execution.
     *
     * - `TaskDuration` : Combined duration of all tasks performed by the browser.
     *
     * - `JSHeapUsedSize` : Used JavaScript heap size.
     *
     * - `JSHeapTotalSize` : Total JavaScript heap size.
     *
     * @remarks
     * All timestamps are in monotonic time: monotonically increasing time
     * in seconds since an arbitrary point in the past.
     */
    async metrics() {
        const response = await __classPrivateFieldGet$6(this, _Page_client, "f").send('Performance.getMetrics');
        return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_buildMetricsObject).call(this, response.metrics);
    }
    /**
     *
     * @returns
     * @remarks Shortcut for
     * {@link Frame.url | page.mainFrame().url()}.
     */
    url() {
        return this.mainFrame().url();
    }
    async content() {
        return await __classPrivateFieldGet$6(this, _Page_frameManager, "f").mainFrame().content();
    }
    /**
     * @param html - HTML markup to assign to the page.
     * @param options - Parameters that has some properties.
     * @remarks
     * The parameter `options` might have the following options.
     *
     * - `timeout` : Maximum time in milliseconds for resources to load, defaults
     *   to 30 seconds, pass `0` to disable timeout. The default value can be
     *   changed by using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`: When to consider setting markup succeeded, defaults to
     *   `load`. Given an array of event strings, setting content is considered
     *   to be successful after all events have been fired. Events can be
     *   either:<br/>
     * - `load` : consider setting content to be finished when the `load` event
     *   is fired.<br/>
     * - `domcontentloaded` : consider setting content to be finished when the
     *   `DOMContentLoaded` event is fired.<br/>
     * - `networkidle0` : consider setting content to be finished when there are
     *   no more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider setting content to be finished when there are
     *   no more than 2 network connections for at least `500` ms.
     */
    async setContent(html, options = {}) {
        await __classPrivateFieldGet$6(this, _Page_frameManager, "f").mainFrame().setContent(html, options);
    }
    /**
     * @param url - URL to navigate page to. The URL should include scheme, e.g.
     * `https://`
     * @param options - Navigation Parameter
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`:When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     *
     * - `referer` : Referer header value. If provided it will take preference
     *   over the referer header value set by
     *   {@link Page.setExtraHTTPHeaders |page.setExtraHTTPHeaders()}.
     *
     * `page.goto` will throw an error if:
     *
     * - there's an SSL error (e.g. in case of self-signed certificates).
     * - target URL is invalid.
     * - the timeout is exceeded during navigation.
     * - the remote server does not respond or is unreachable.
     * - the main resource failed to load.
     *
     * `page.goto` will not throw an error when any valid HTTP status code is
     * returned by the remote server, including 404 "Not Found" and 500
     * "Internal Server Error". The status code for such responses can be
     * retrieved by calling response.status().
     *
     * NOTE: `page.goto` either throws an error or returns a main resource
     * response. The only exceptions are navigation to about:blank or navigation
     * to the same URL with a different hash, which would succeed and return null.
     *
     * NOTE: Headless mode doesn't support navigation to a PDF document. See the
     * {@link https://bugs.chromium.org/p/chromium/issues/detail?id=761295 |
     * upstream issue}.
     *
     * Shortcut for {@link Frame.goto | page.mainFrame().goto(url, options)}.
     */
    async goto(url, options = {}) {
        return await __classPrivateFieldGet$6(this, _Page_frameManager, "f").mainFrame().goto(url, options);
    }
    /**
     * @param options - Navigation parameters which might have the following
     * properties:
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`: When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     */
    async reload(options) {
        const result = await Promise.all([
            this.waitForNavigation(options),
            __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.reload'),
        ]);
        return result[0];
    }
    /**
     * Waits for the page to navigate to a new URL or to reload. It is useful when
     * you run code that will indirectly cause the page to navigate.
     *
     * @example
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(), // The promise resolves after navigation has finished
     *   page.click('a.my-link'), // Clicking the link will indirectly cause a navigation
     * ]);
     * ```
     *
     * @remarks
     * Usage of the
     * {@link https://developer.mozilla.org/en-US/docs/Web/API/History_API | History API}
     * to change the URL is considered a navigation.
     *
     * @param options - Navigation parameters which might have the following
     * properties:
     * @returns A `Promise` which resolves to the main resource response.
     *
     * - In case of multiple redirects, the navigation will resolve with the
     *   response of the last redirect.
     * - In case of navigation to a different anchor or navigation due to History
     *   API usage, the navigation will resolve with `null`.
     */
    async waitForNavigation(options = {}) {
        return await __classPrivateFieldGet$6(this, _Page_frameManager, "f").mainFrame().waitForNavigation(options);
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched response
     * @example
     *
     * ```ts
     * const firstResponse = await page.waitForResponse(
     *   'https://example.com/resource'
     * );
     * const finalResponse = await page.waitForResponse(
     *   response =>
     *     response.url() === 'https://example.com' && response.status() === 200
     * );
     * const finalResponse = await page.waitForResponse(async response => {
     *   return (await response.text()).includes('<html>');
     * });
     * return finalResponse.ok();
     * ```
     *
     * @remarks
     * Optional Waiting Parameters have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds, pass
     *   `0` to disable the timeout. The default value can be changed by using the
     *   {@link Page.setDefaultTimeout} method.
     */
    async waitForRequest(urlOrPredicate, options = {}) {
        const { timeout = __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f").timeout() } = options;
        return waitForEvent(__classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Request, request => {
            if (isString(urlOrPredicate)) {
                return urlOrPredicate === request.url();
            }
            if (typeof urlOrPredicate === 'function') {
                return !!urlOrPredicate(request);
            }
            return false;
        }, timeout, __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_sessionClosePromise).call(this));
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for.
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched response.
     * @example
     *
     * ```ts
     * const firstResponse = await page.waitForResponse(
     *   'https://example.com/resource'
     * );
     * const finalResponse = await page.waitForResponse(
     *   response =>
     *     response.url() === 'https://example.com' && response.status() === 200
     * );
     * const finalResponse = await page.waitForResponse(async response => {
     *   return (await response.text()).includes('<html>');
     * });
     * return finalResponse.ok();
     * ```
     *
     * @remarks
     * Optional Parameter have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds,
     *   pass `0` to disable the timeout. The default value can be changed by using
     *   the {@link Page.setDefaultTimeout} method.
     */
    async waitForResponse(urlOrPredicate, options = {}) {
        const { timeout = __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f").timeout() } = options;
        return waitForEvent(__classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager, NetworkManagerEmittedEvents.Response, async (response) => {
            if (isString(urlOrPredicate)) {
                return urlOrPredicate === response.url();
            }
            if (typeof urlOrPredicate === 'function') {
                return !!(await urlOrPredicate(response));
            }
            return false;
        }, timeout, __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_sessionClosePromise).call(this));
    }
    /**
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when network is idle
     */
    async waitForNetworkIdle(options = {}) {
        const { idleTime = 500, timeout = __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f").timeout() } = options;
        const networkManager = __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager;
        let idleResolveCallback;
        const idlePromise = new Promise(resolve => {
            idleResolveCallback = resolve;
        });
        let abortRejectCallback;
        const abortPromise = new Promise((_, reject) => {
            abortRejectCallback = reject;
        });
        let idleTimer;
        const onIdle = () => {
            return idleResolveCallback();
        };
        const cleanup = () => {
            idleTimer && clearTimeout(idleTimer);
            abortRejectCallback(new Error('abort'));
        };
        const evaluate = () => {
            idleTimer && clearTimeout(idleTimer);
            if (networkManager.numRequestsInProgress() === 0) {
                idleTimer = setTimeout(onIdle, idleTime);
            }
        };
        evaluate();
        const eventHandler = () => {
            evaluate();
            return false;
        };
        const listenToEvent = (event) => {
            return waitForEvent(networkManager, event, eventHandler, timeout, abortPromise);
        };
        const eventPromises = [
            listenToEvent(NetworkManagerEmittedEvents.Request),
            listenToEvent(NetworkManagerEmittedEvents.Response),
        ];
        await Promise.race([
            idlePromise,
            ...eventPromises,
            __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_sessionClosePromise).call(this),
        ]).then(r => {
            cleanup();
            return r;
        }, error => {
            cleanup();
            throw error;
        });
    }
    /**
     * @param urlOrPredicate - A URL or predicate to wait for.
     * @param options - Optional waiting parameters
     * @returns Promise which resolves to the matched frame.
     * @example
     *
     * ```ts
     * const frame = await page.waitForFrame(async frame => {
     *   return frame.name() === 'Test';
     * });
     * ```
     *
     * @remarks
     * Optional Parameter have:
     *
     * - `timeout`: Maximum wait time in milliseconds, defaults to `30` seconds,
     *   pass `0` to disable the timeout. The default value can be changed by using
     *   the {@link Page.setDefaultTimeout} method.
     */
    async waitForFrame(urlOrPredicate, options = {}) {
        const { timeout = __classPrivateFieldGet$6(this, _Page_timeoutSettings, "f").timeout() } = options;
        let predicate;
        if (isString(urlOrPredicate)) {
            predicate = (frame) => {
                return Promise.resolve(urlOrPredicate === frame.url());
            };
        }
        else {
            predicate = (frame) => {
                const value = urlOrPredicate(frame);
                if (typeof value === 'boolean') {
                    return Promise.resolve(value);
                }
                return value;
            };
        }
        const eventRace = Promise.race([
            waitForEvent(__classPrivateFieldGet$6(this, _Page_frameManager, "f"), FrameManagerEmittedEvents.FrameAttached, predicate, timeout, __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_sessionClosePromise).call(this)),
            waitForEvent(__classPrivateFieldGet$6(this, _Page_frameManager, "f"), FrameManagerEmittedEvents.FrameNavigated, predicate, timeout, __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_sessionClosePromise).call(this)),
            ...this.frames().map(async (frame) => {
                if (await predicate(frame)) {
                    return frame;
                }
                return await eventRace;
            }),
        ]);
        return eventRace;
    }
    /**
     * This method navigate to the previous page in history.
     * @param options - Navigation parameters
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect. If can not go back, resolves to `null`.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil` : When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     */
    async goBack(options = {}) {
        return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_go).call(this, -1, options);
    }
    /**
     * This method navigate to the next page in history.
     * @param options - Navigation Parameter
     * @returns Promise which resolves to the main resource response. In case of
     * multiple redirects, the navigation will resolve with the response of the
     * last redirect. If can not go forward, resolves to `null`.
     * @remarks
     * The argument `options` might have the following properties:
     *
     * - `timeout` : Maximum navigation time in milliseconds, defaults to 30
     *   seconds, pass 0 to disable timeout. The default value can be changed by
     *   using the {@link Page.setDefaultNavigationTimeout} or
     *   {@link Page.setDefaultTimeout} methods.
     *
     * - `waitUntil`: When to consider navigation succeeded, defaults to `load`.
     *   Given an array of event strings, navigation is considered to be
     *   successful after all events have been fired. Events can be either:<br/>
     * - `load` : consider navigation to be finished when the load event is
     *   fired.<br/>
     * - `domcontentloaded` : consider navigation to be finished when the
     *   DOMContentLoaded event is fired.<br/>
     * - `networkidle0` : consider navigation to be finished when there are no
     *   more than 0 network connections for at least `500` ms.<br/>
     * - `networkidle2` : consider navigation to be finished when there are no
     *   more than 2 network connections for at least `500` ms.
     */
    async goForward(options = {}) {
        return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_go).call(this, 1, options);
    }
    /**
     * Brings page to front (activates tab).
     */
    async bringToFront() {
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.bringToFront');
    }
    /**
     * Emulates given device metrics and user agent.
     *
     * @remarks
     * This method is a shortcut for calling two methods:
     * {@link Page.setUserAgent} and {@link Page.setViewport} To aid emulation,
     * Puppeteer provides a list of device descriptors that can be obtained via
     * {@link devices}. `page.emulate` will resize the page. A lot of websites
     * don't expect phones to change size, so you should emulate before navigating
     * to the page.
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * const iPhone = puppeteer.devices['iPhone 6'];
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.emulate(iPhone);
     *   await page.goto('https://www.google.com');
     *   // other actions...
     *   await browser.close();
     * })();
     * ```
     *
     * @remarks List of all available devices is available in the source code:
     * {@link https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts | src/common/DeviceDescriptors.ts}.
     */
    async emulate(options) {
        await Promise.all([
            this.setViewport(options.viewport),
            this.setUserAgent(options.userAgent),
        ]);
    }
    /**
     * @param enabled - Whether or not to enable JavaScript on the page.
     * @returns
     * @remarks
     * NOTE: changing this value won't affect scripts that have already been run.
     * It will take full effect on the next navigation.
     */
    async setJavaScriptEnabled(enabled) {
        if (__classPrivateFieldGet$6(this, _Page_javascriptEnabled, "f") === enabled) {
            return;
        }
        __classPrivateFieldSet$6(this, _Page_javascriptEnabled, enabled, "f");
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setScriptExecutionDisabled', {
            value: !enabled,
        });
    }
    /**
     * Toggles bypassing page's Content-Security-Policy.
     * @param enabled - sets bypassing of page's Content-Security-Policy.
     * @remarks
     * NOTE: CSP bypassing happens at the moment of CSP initialization rather than
     * evaluation. Usually, this means that `page.setBypassCSP` should be called
     * before navigating to the domain.
     */
    async setBypassCSP(enabled) {
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.setBypassCSP', { enabled });
    }
    /**
     * @param type - Changes the CSS media type of the page. The only allowed
     * values are `screen`, `print` and `null`. Passing `null` disables CSS media
     * emulation.
     * @example
     *
     * ```ts
     * await page.evaluate(() => matchMedia('screen').matches);
     * // → true
     * await page.evaluate(() => matchMedia('print').matches);
     * // → false
     *
     * await page.emulateMediaType('print');
     * await page.evaluate(() => matchMedia('screen').matches);
     * // → false
     * await page.evaluate(() => matchMedia('print').matches);
     * // → true
     *
     * await page.emulateMediaType(null);
     * await page.evaluate(() => matchMedia('screen').matches);
     * // → true
     * await page.evaluate(() => matchMedia('print').matches);
     * // → false
     * ```
     */
    async emulateMediaType(type) {
        assert(type === 'screen' ||
            type === 'print' ||
            (type !== null && type !== void 0 ? type : undefined) === undefined, 'Unsupported media type: ' + type);
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setEmulatedMedia', {
            media: type || '',
        });
    }
    /**
     * Enables CPU throttling to emulate slow CPUs.
     * @param factor - slowdown factor (1 is no throttle, 2 is 2x slowdown, etc).
     */
    async emulateCPUThrottling(factor) {
        assert(factor === null || factor >= 1, 'Throttling rate should be greater or equal to 1');
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setCPUThrottlingRate', {
            rate: factor !== null ? factor : 1,
        });
    }
    /**
     * @param features - `<?Array<Object>>` Given an array of media feature
     * objects, emulates CSS media features on the page. Each media feature object
     * must have the following properties:
     * @example
     *
     * ```ts
     * await page.emulateMediaFeatures([
     *   {name: 'prefers-color-scheme', value: 'dark'},
     * ]);
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: dark)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: light)').matches
     * );
     * // → false
     *
     * await page.emulateMediaFeatures([
     *   {name: 'prefers-reduced-motion', value: 'reduce'},
     * ]);
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: reduce)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: no-preference)').matches
     * );
     * // → false
     *
     * await page.emulateMediaFeatures([
     *   {name: 'prefers-color-scheme', value: 'dark'},
     *   {name: 'prefers-reduced-motion', value: 'reduce'},
     * ]);
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: dark)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-color-scheme: light)').matches
     * );
     * // → false
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: reduce)').matches
     * );
     * // → true
     * await page.evaluate(
     *   () => matchMedia('(prefers-reduced-motion: no-preference)').matches
     * );
     * // → false
     *
     * await page.emulateMediaFeatures([{name: 'color-gamut', value: 'p3'}]);
     * await page.evaluate(() => matchMedia('(color-gamut: srgb)').matches);
     * // → true
     * await page.evaluate(() => matchMedia('(color-gamut: p3)').matches);
     * // → true
     * await page.evaluate(() => matchMedia('(color-gamut: rec2020)').matches);
     * // → false
     * ```
     */
    async emulateMediaFeatures(features) {
        if (!features) {
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setEmulatedMedia', {});
        }
        if (Array.isArray(features)) {
            for (const mediaFeature of features) {
                const name = mediaFeature.name;
                assert(/^(?:prefers-(?:color-scheme|reduced-motion)|color-gamut)$/.test(name), 'Unsupported media feature: ' + name);
            }
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setEmulatedMedia', {
                features: features,
            });
        }
    }
    /**
     * @param timezoneId - Changes the timezone of the page. See
     * {@link https://source.chromium.org/chromium/chromium/deps/icu.git/+/faee8bc70570192d82d2978a71e2a615788597d1:source/data/misc/metaZones.txt | ICU’s metaZones.txt}
     * for a list of supported timezone IDs. Passing
     * `null` disables timezone emulation.
     */
    async emulateTimezone(timezoneId) {
        try {
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setTimezoneOverride', {
                timezoneId: timezoneId || '',
            });
        }
        catch (error) {
            if (isErrorLike(error) && error.message.includes('Invalid timezone')) {
                throw new Error(`Invalid timezone ID: ${timezoneId}`);
            }
            throw error;
        }
    }
    /**
     * Emulates the idle state.
     * If no arguments set, clears idle state emulation.
     *
     * @example
     *
     * ```ts
     * // set idle emulation
     * await page.emulateIdleState({isUserActive: true, isScreenUnlocked: false});
     *
     * // do some checks here
     * ...
     *
     * // clear idle emulation
     * await page.emulateIdleState();
     * ```
     *
     * @param overrides - Mock idle state. If not set, clears idle overrides
     */
    async emulateIdleState(overrides) {
        if (overrides) {
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setIdleOverride', {
                isUserActive: overrides.isUserActive,
                isScreenUnlocked: overrides.isScreenUnlocked,
            });
        }
        else {
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.clearIdleOverride');
        }
    }
    /**
     * Simulates the given vision deficiency on the page.
     *
     * @example
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     *
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   await page.goto('https://v8.dev/blog/10-years');
     *
     *   await page.emulateVisionDeficiency('achromatopsia');
     *   await page.screenshot({path: 'achromatopsia.png'});
     *
     *   await page.emulateVisionDeficiency('deuteranopia');
     *   await page.screenshot({path: 'deuteranopia.png'});
     *
     *   await page.emulateVisionDeficiency('blurredVision');
     *   await page.screenshot({path: 'blurred-vision.png'});
     *
     *   await browser.close();
     * })();
     * ```
     *
     * @param type - the type of deficiency to simulate, or `'none'` to reset.
     */
    async emulateVisionDeficiency(type) {
        const visionDeficiencies = new Set([
            'none',
            'achromatopsia',
            'blurredVision',
            'deuteranopia',
            'protanopia',
            'tritanopia',
        ]);
        try {
            assert(!type || visionDeficiencies.has(type), `Unsupported vision deficiency: ${type}`);
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setEmulatedVisionDeficiency', {
                type: type || 'none',
            });
        }
        catch (error) {
            throw error;
        }
    }
    /**
     * `page.setViewport` will resize the page. A lot of websites don't expect
     * phones to change size, so you should set the viewport before navigating to
     * the page.
     *
     * In the case of multiple pages in a single browser, each page can have its
     * own viewport size.
     * @example
     *
     * ```ts
     * const page = await browser.newPage();
     * await page.setViewport({
     *   width: 640,
     *   height: 480,
     *   deviceScaleFactor: 1,
     * });
     * await page.goto('https://example.com');
     * ```
     *
     * @param viewport -
     * @remarks
     * Argument viewport have following properties:
     *
     * - `width`: page width in pixels. required
     *
     * - `height`: page height in pixels. required
     *
     * - `deviceScaleFactor`: Specify device scale factor (can be thought of as
     *   DPR). Defaults to `1`.
     *
     * - `isMobile`: Whether the meta viewport tag is taken into account. Defaults
     *   to `false`.
     *
     * - `hasTouch`: Specifies if viewport supports touch events. Defaults to `false`
     *
     * - `isLandScape`: Specifies if viewport is in landscape mode. Defaults to false.
     *
     * NOTE: in certain cases, setting viewport will reload the page in order to
     * set the isMobile or hasTouch properties.
     */
    async setViewport(viewport) {
        const needsReload = await __classPrivateFieldGet$6(this, _Page_emulationManager, "f").emulateViewport(viewport);
        __classPrivateFieldSet$6(this, _Page_viewport, viewport, "f");
        if (needsReload) {
            await this.reload();
        }
    }
    /**
     * @returns
     *
     * - `width`: page's width in pixels
     *
     * - `height`: page's height in pixels
     *
     * - `deviceScalarFactor`: Specify device scale factor (can be though of as
     *   dpr). Defaults to `1`.
     *
     * - `isMobile`: Whether the meta viewport tag is taken into account. Defaults
     *   to `false`.
     *
     * - `hasTouch`: Specifies if viewport supports touch events. Defaults to
     *   `false`.
     *
     * - `isLandScape`: Specifies if viewport is in landscape mode. Defaults to
     *   `false`.
     */
    viewport() {
        return __classPrivateFieldGet$6(this, _Page_viewport, "f");
    }
    /**
     * Evaluates a function in the page's context and returns the result.
     *
     * If the function passed to `page.evaluteHandle` returns a Promise, the
     * function will wait for the promise to resolve and return its value.
     *
     * @example
     *
     * ```ts
     * const result = await frame.evaluate(() => {
     *   return Promise.resolve(8 * 7);
     * });
     * console.log(result); // prints "56"
     * ```
     *
     * You can pass a string instead of a function (although functions are
     * recommended as they are easier to debug and use with TypeScript):
     *
     * @example
     *
     * ```ts
     * const aHandle = await page.evaluate('1 + 2');
     * ```
     *
     * To get the best TypeScript experience, you should pass in as the
     * generic the type of `pageFunction`:
     *
     * ```ts
     * const aHandle = await page.evaluate(() => 2);
     * ```
     *
     * @example
     *
     * {@link ElementHandle} instances (including {@link JSHandle}s) can be passed
     * as arguments to the `pageFunction`:
     *
     * ```ts
     * const bodyHandle = await page.$('body');
     * const html = await page.evaluate(body => body.innerHTML, bodyHandle);
     * await bodyHandle.dispose();
     * ```
     *
     * @param pageFunction - a function that is run within the page
     * @param args - arguments to be passed to the pageFunction
     *
     * @returns the return value of `pageFunction`.
     */
    async evaluate(pageFunction, ...args) {
        return __classPrivateFieldGet$6(this, _Page_frameManager, "f").mainFrame().evaluate(pageFunction, ...args);
    }
    /**
     * Adds a function which would be invoked in one of the following scenarios:
     *
     * - whenever the page is navigated
     *
     * - whenever the child frame is attached or navigated. In this case, the
     *   function is invoked in the context of the newly attached frame.
     *
     * The function is invoked after the document was created but before any of
     * its scripts were run. This is useful to amend the JavaScript environment,
     * e.g. to seed `Math.random`.
     * @param pageFunction - Function to be evaluated in browser context
     * @param args - Arguments to pass to `pageFunction`
     * @example
     * An example of overriding the navigator.languages property before the page loads:
     *
     * ```ts
     * // preload.js
     *
     * // overwrite the `languages` property to use a custom getter
     * Object.defineProperty(navigator, 'languages', {
     * get: function () {
     * return ['en-US', 'en', 'bn'];
     * },
     * });
     *
     * // In your puppeteer script, assuming the preload.js file is
     * in same folder of our script
     * const preloadFile = fs.readFileSync('./preload.js', 'utf8');
     * await page.evaluateOnNewDocument(preloadFile);
     * ```
     */
    async evaluateOnNewDocument(pageFunction, ...args) {
        const source = evaluationString(pageFunction, ...args);
        await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.addScriptToEvaluateOnNewDocument', {
            source,
        });
    }
    /**
     * Toggles ignoring cache for each request based on the enabled state. By
     * default, caching is enabled.
     * @param enabled - sets the `enabled` state of cache
     */
    async setCacheEnabled(enabled = true) {
        await __classPrivateFieldGet$6(this, _Page_frameManager, "f").networkManager.setCacheEnabled(enabled);
    }
    /**
     * @remarks
     * Options object which might have the following properties:
     *
     * - `path` : The file path to save the image to. The screenshot type
     *   will be inferred from file extension. If `path` is a relative path, then
     *   it is resolved relative to
     *   {@link https://nodejs.org/api/process.html#process_process_cwd
     *   | current working directory}.
     *   If no path is provided, the image won't be saved to the disk.
     *
     * - `type` : Specify screenshot type, can be either `jpeg` or `png`.
     *   Defaults to 'png'.
     *
     * - `quality` : The quality of the image, between 0-100. Not
     *   applicable to `png` images.
     *
     * - `fullPage` : When true, takes a screenshot of the full
     *   scrollable page. Defaults to `false`.
     *
     * - `clip` : An object which specifies clipping region of the page.
     *   Should have the following fields:<br/>
     * - `x` : x-coordinate of top-left corner of clip area.<br/>
     * - `y` : y-coordinate of top-left corner of clip area.<br/>
     * - `width` : width of clipping area.<br/>
     * - `height` : height of clipping area.
     *
     * - `omitBackground` : Hides default white background and allows
     *   capturing screenshots with transparency. Defaults to `false`.
     *
     * - `encoding` : The encoding of the image, can be either base64 or
     *   binary. Defaults to `binary`.
     *
     * - `captureBeyondViewport` : When true, captures screenshot
     *   {@link https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot
     *   | beyond the viewport}. When false, falls back to old behaviour,
     *   and cuts the screenshot by the viewport size. Defaults to `true`.
     *
     * - `fromSurface` : When true, captures screenshot
     *   {@link https://chromedevtools.github.io/devtools-protocol/tot/Page/#method-captureScreenshot
     *   | from the surface rather than the view}. When false, works only in
     *   headful mode and ignores page viewport (but not browser window's
     *   bounds). Defaults to `true`.
     *
     * NOTE: Screenshots take at least 1/6 second on OS X. See
     * {@link https://crbug.com/741689} for discussion.
     * @returns Promise which resolves to buffer or a base64 string (depending on
     * the value of `encoding`) with captured screenshot.
     */
    async screenshot(options = {}) {
        let screenshotType = "png" /* Protocol.Page.CaptureScreenshotRequestFormat.Png */;
        // options.type takes precedence over inferring the type from options.path
        // because it may be a 0-length file with no extension created beforehand
        // (i.e. as a temp file).
        if (options.type) {
            screenshotType =
                options.type;
        }
        else if (options.path) {
            const filePath = options.path;
            const extension = filePath
                .slice(filePath.lastIndexOf('.') + 1)
                .toLowerCase();
            switch (extension) {
                case 'png':
                    screenshotType = "png" /* Protocol.Page.CaptureScreenshotRequestFormat.Png */;
                    break;
                case 'jpeg':
                case 'jpg':
                    screenshotType = "jpeg" /* Protocol.Page.CaptureScreenshotRequestFormat.Jpeg */;
                    break;
                case 'webp':
                    screenshotType = "webp" /* Protocol.Page.CaptureScreenshotRequestFormat.Webp */;
                    break;
                default:
                    throw new Error(`Unsupported screenshot type for extension \`.${extension}\``);
            }
        }
        if (options.quality) {
            assert(screenshotType === "jpeg" /* Protocol.Page.CaptureScreenshotRequestFormat.Jpeg */ ||
                screenshotType === "webp" /* Protocol.Page.CaptureScreenshotRequestFormat.Webp */, 'options.quality is unsupported for the ' +
                screenshotType +
                ' screenshots');
            assert(typeof options.quality === 'number', 'Expected options.quality to be a number but found ' +
                typeof options.quality);
            assert(Number.isInteger(options.quality), 'Expected options.quality to be an integer');
            assert(options.quality >= 0 && options.quality <= 100, 'Expected options.quality to be between 0 and 100 (inclusive), got ' +
                options.quality);
        }
        assert(!options.clip || !options.fullPage, 'options.clip and options.fullPage are exclusive');
        if (options.clip) {
            assert(typeof options.clip.x === 'number', 'Expected options.clip.x to be a number but found ' +
                typeof options.clip.x);
            assert(typeof options.clip.y === 'number', 'Expected options.clip.y to be a number but found ' +
                typeof options.clip.y);
            assert(typeof options.clip.width === 'number', 'Expected options.clip.width to be a number but found ' +
                typeof options.clip.width);
            assert(typeof options.clip.height === 'number', 'Expected options.clip.height to be a number but found ' +
                typeof options.clip.height);
            assert(options.clip.width !== 0, 'Expected options.clip.width not to be 0.');
            assert(options.clip.height !== 0, 'Expected options.clip.height not to be 0.');
        }
        return __classPrivateFieldGet$6(this, _Page_screenshotTaskQueue, "f").postTask(() => {
            return __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_screenshotTask).call(this, screenshotType, options);
        });
    }
    /**
     * Generates a PDF of the page with the `print` CSS media type.
     * @remarks
     *
     * NOTE: PDF generation is only supported in Chrome headless mode.
     *
     * To generate a PDF with the `screen` media type, call
     * {@link Page.emulateMediaType | `page.emulateMediaType('screen')`} before
     * calling `page.pdf()`.
     *
     * By default, `page.pdf()` generates a pdf with modified colors for printing.
     * Use the
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/-webkit-print-color-adjust | `-webkit-print-color-adjust`}
     * property to force rendering of exact colors.
     *
     * @param options - options for generating the PDF.
     */
    async createPDFStream(options = {}) {
        const { scale = 1, displayHeaderFooter = false, headerTemplate = '', footerTemplate = '', printBackground = false, landscape = false, pageRanges = '', preferCSSPageSize = false, margin = {}, omitBackground = false, timeout = 30000, } = options;
        let paperWidth = 8.5;
        let paperHeight = 11;
        if (options.format) {
            const format = _paperFormats[options.format.toLowerCase()];
            assert(format, 'Unknown paper format: ' + options.format);
            paperWidth = format.width;
            paperHeight = format.height;
        }
        else {
            paperWidth = convertPrintParameterToInches(options.width) || paperWidth;
            paperHeight =
                convertPrintParameterToInches(options.height) || paperHeight;
        }
        const marginTop = convertPrintParameterToInches(margin.top) || 0;
        const marginLeft = convertPrintParameterToInches(margin.left) || 0;
        const marginBottom = convertPrintParameterToInches(margin.bottom) || 0;
        const marginRight = convertPrintParameterToInches(margin.right) || 0;
        if (omitBackground) {
            await __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_setTransparentBackgroundColor).call(this);
        }
        const printCommandPromise = __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.printToPDF', {
            transferMode: 'ReturnAsStream',
            landscape,
            displayHeaderFooter,
            headerTemplate,
            footerTemplate,
            printBackground,
            scale,
            paperWidth,
            paperHeight,
            marginTop,
            marginBottom,
            marginLeft,
            marginRight,
            pageRanges,
            preferCSSPageSize,
        });
        const result = await waitWithTimeout(printCommandPromise, 'Page.printToPDF', timeout);
        if (omitBackground) {
            await __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_resetDefaultBackgroundColor).call(this);
        }
        assert(result.stream, '`stream` is missing from `Page.printToPDF');
        return getReadableFromProtocolStream(__classPrivateFieldGet$6(this, _Page_client, "f"), result.stream);
    }
    /**
     * @returns The page's title
     * @remarks
     * Shortcut for {@link Frame.title | page.mainFrame().title()}.
     */
    async title() {
        return this.mainFrame().title();
    }
    async close(options = { runBeforeUnload: undefined }) {
        const connection = __classPrivateFieldGet$6(this, _Page_client, "f").connection();
        assert(connection, 'Protocol error: Connection closed. Most likely the page has been closed.');
        const runBeforeUnload = !!options.runBeforeUnload;
        if (runBeforeUnload) {
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.close');
        }
        else {
            await connection.send('Target.closeTarget', {
                targetId: __classPrivateFieldGet$6(this, _Page_target, "f")._targetId,
            });
            await __classPrivateFieldGet$6(this, _Page_target, "f")._isClosedPromise;
        }
    }
    /**
     * Indicates that the page has been closed.
     * @returns
     */
    isClosed() {
        return __classPrivateFieldGet$6(this, _Page_closed, "f");
    }
    get mouse() {
        return __classPrivateFieldGet$6(this, _Page_mouse, "f");
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.mouse} to click in the center of the
     * element. If there's no element matching `selector`, the method throws an
     * error.
     * @remarks Bear in mind that if `click()` triggers a navigation event and
     * there's a separate `page.waitForNavigation()` promise to be resolved, you
     * may end up with a race condition that yields unexpected results. The
     * correct pattern for click and wait for navigation is the following:
     *
     * ```ts
     * const [response] = await Promise.all([
     *   page.waitForNavigation(waitOptions),
     *   page.click(selector, clickOptions),
     * ]);
     * ```
     *
     * Shortcut for {@link Frame.click | page.mainFrame().click(selector[, options]) }.
     * @param selector - A `selector` to search for element to click. If there are
     * multiple elements satisfying the `selector`, the first will be clicked
     * @param options - `Object`
     * @returns Promise which resolves when the element matching `selector` is
     * successfully clicked. The Promise will be rejected if there is no element
     * matching `selector`.
     */
    click(selector, options = {}) {
        return this.mainFrame().click(selector, options);
    }
    /**
     * This method fetches an element with `selector` and focuses it. If there's no
     * element matching `selector`, the method throws an error.
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector }
     * of an element to focus. If there are multiple elements satisfying the
     * selector, the first will be focused.
     * @returns Promise which resolves when the element matching selector is
     * successfully focused. The promise will be rejected if there is no element
     * matching selector.
     * @remarks
     * Shortcut for {@link Frame.focus | page.mainFrame().focus(selector)}.
     */
    focus(selector) {
        return this.mainFrame().focus(selector);
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.mouse} to hover over the center of the element.
     * If there's no element matching `selector`, the method throws an error.
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * to search for element to hover. If there are multiple elements satisfying
     * the selector, the first will be hovered.
     * @returns Promise which resolves when the element matching `selector` is
     * successfully hovered. Promise gets rejected if there's no element matching
     * `selector`.
     * @remarks
     * Shortcut for {@link Page.hover | page.mainFrame().hover(selector)}.
     */
    hover(selector) {
        return this.mainFrame().hover(selector);
    }
    /**
     * Triggers a `change` and `input` event once all the provided options have been
     * selected. If there's no `<select>` element matching `selector`, the method
     * throws an error.
     *
     * @example
     *
     * ```ts
     * page.select('select#colors', 'blue'); // single selection
     * page.select('select#colors', 'red', 'green', 'blue'); // multiple selections
     * ```
     *
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | Selector}
     * to query the page for
     * @param values - Values of options to select. If the `<select>` has the
     * `multiple` attribute, all values are considered, otherwise only the first one
     * is taken into account.
     * @returns
     *
     * @remarks
     * Shortcut for {@link Frame.select | page.mainFrame().select()}
     */
    select(selector, ...values) {
        return this.mainFrame().select(selector, ...values);
    }
    /**
     * This method fetches an element with `selector`, scrolls it into view if
     * needed, and then uses {@link Page.touchscreen} to tap in the center of the element.
     * If there's no element matching `selector`, the method throws an error.
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | Selector}
     * to search for element to tap. If there are multiple elements satisfying the
     * selector, the first will be tapped.
     * @returns
     * @remarks
     * Shortcut for {@link Frame.tap | page.mainFrame().tap(selector)}.
     */
    tap(selector) {
        return this.mainFrame().tap(selector);
    }
    /**
     * Sends a `keydown`, `keypress/input`, and `keyup` event for each character
     * in the text.
     *
     * To press a special key, like `Control` or `ArrowDown`, use {@link Keyboard.press}.
     * @example
     *
     * ```ts
     * await page.type('#mytextarea', 'Hello');
     * // Types instantly
     * await page.type('#mytextarea', 'World', {delay: 100});
     * // Types slower, like a user
     * ```
     *
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * of an element to type into. If there are multiple elements satisfying the
     * selector, the first will be used.
     * @param text - A text to type into a focused element.
     * @param options - have property `delay` which is the Time to wait between
     * key presses in milliseconds. Defaults to `0`.
     * @returns
     * @remarks
     */
    type(selector, text, options) {
        return this.mainFrame().type(selector, text, options);
    }
    /**
     * @deprecated Use `new Promise(r => setTimeout(r, milliseconds));`.
     *
     * Causes your script to wait for the given number of milliseconds.
     *
     * @remarks
     * It's generally recommended to not wait for a number of seconds, but instead
     * use {@link Frame.waitForSelector}, {@link Frame.waitForXPath} or
     * {@link Frame.waitForFunction} to wait for exactly the conditions you want.
     *
     * @example
     *
     * Wait for 1 second:
     *
     * ```ts
     * await page.waitForTimeout(1000);
     * ```
     *
     * @param milliseconds - the number of milliseconds to wait.
     */
    waitForTimeout(milliseconds) {
        return this.mainFrame().waitForTimeout(milliseconds);
    }
    /**
     * Wait for the `selector` to appear in page. If at the moment of calling the
     * method the `selector` already exists, the method will return immediately. If
     * the `selector` doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * This method works across navigations:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .waitForSelector('img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param selector - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Selectors | selector}
     * of an element to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when element specified by selector string
     * is added to DOM. Resolves to `null` if waiting for hidden: `true` and
     * selector is not found in DOM.
     * @remarks
     * The optional Parameter in Arguments `options` are :
     *
     * - `Visible`: A boolean wait for element to be present in DOM and to be
     *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
     *   properties. Defaults to `false`.
     *
     * - `hidden`: Wait for element to not be found in the DOM or to be hidden,
     *   i.e. have `display: none` or `visibility: hidden` CSS properties. Defaults to
     *   `false`.
     *
     * - `timeout`: maximum time to wait for in milliseconds. Defaults to `30000`
     *   (30 seconds). Pass `0` to disable timeout. The default value can be changed
     *   by using the {@link Page.setDefaultTimeout} method.
     */
    async waitForSelector(selector, options = {}) {
        return await this.mainFrame().waitForSelector(selector, options);
    }
    /**
     * Wait for the `xpath` to appear in page. If at the moment of calling the
     * method the `xpath` already exists, the method will return immediately. If
     * the `xpath` doesn't appear after the `timeout` milliseconds of waiting, the
     * function will throw.
     *
     * This method works across navigation
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   let currentURL;
     *   page
     *     .waitForXPath('//img')
     *     .then(() => console.log('First URL with image: ' + currentURL));
     *   for (currentURL of [
     *     'https://example.com',
     *     'https://google.com',
     *     'https://bbc.com',
     *   ]) {
     *     await page.goto(currentURL);
     *   }
     *   await browser.close();
     * })();
     * ```
     *
     * @param xpath - A
     * {@link https://developer.mozilla.org/en-US/docs/Web/XPath | xpath} of an
     * element to wait for
     * @param options - Optional waiting parameters
     * @returns Promise which resolves when element specified by xpath string is
     * added to DOM. Resolves to `null` if waiting for `hidden: true` and xpath is
     * not found in DOM.
     * @remarks
     * The optional Argument `options` have properties:
     *
     * - `visible`: A boolean to wait for element to be present in DOM and to be
     *   visible, i.e. to not have `display: none` or `visibility: hidden` CSS
     *   properties. Defaults to `false`.
     *
     * - `hidden`: A boolean wait for element to not be found in the DOM or to be
     *   hidden, i.e. have `display: none` or `visibility: hidden` CSS properties.
     *   Defaults to `false`.
     *
     * - `timeout`: A number which is maximum time to wait for in milliseconds.
     *   Defaults to `30000` (30 seconds). Pass `0` to disable timeout. The default
     *   value can be changed by using the {@link Page.setDefaultTimeout} method.
     */
    waitForXPath(xpath, options = {}) {
        return this.mainFrame().waitForXPath(xpath, options);
    }
    /**
     * Waits for a function to finish evaluating in the page's context.
     *
     * @example
     * The {@link Page.waitForFunction} can be used to observe viewport size change:
     *
     * ```ts
     * const puppeteer = require('puppeteer');
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   const page = await browser.newPage();
     *   const watchDog = page.waitForFunction('window.innerWidth < 100');
     *   await page.setViewport({width: 50, height: 50});
     *   await watchDog;
     *   await browser.close();
     * })();
     * ```
     *
     * @example
     * To pass arguments from node.js to the predicate of
     * {@link Page.waitForFunction} function:
     *
     * ```ts
     * const selector = '.foo';
     * await page.waitForFunction(
     *   selector => !!document.querySelector(selector),
     *   {},
     *   selector
     * );
     * ```
     *
     * @example
     * The predicate of {@link Page.waitForFunction} can be asynchronous too:
     *
     * ```ts
     * const username = 'github-username';
     * await page.waitForFunction(
     *   async username => {
     *     const githubResponse = await fetch(
     *       `https://api.github.com/users/${username}`
     *     );
     *     const githubUser = await githubResponse.json();
     *     // show the avatar
     *     const img = document.createElement('img');
     *     img.src = githubUser.avatar_url;
     *     // wait 3 seconds
     *     await new Promise((resolve, reject) => setTimeout(resolve, 3000));
     *     img.remove();
     *   },
     *   {},
     *   username
     * );
     * ```
     *
     * @param pageFunction - Function to be evaluated in browser context
     * @param options - Optional waiting parameters
     *
     * - `polling` - An interval at which the `pageFunction` is executed, defaults
     *   to `raf`. If `polling` is a number, then it is treated as an interval in
     *   milliseconds at which the function would be executed. If polling is a
     *   string, then it can be one of the following values:
     *   - `raf` - to constantly execute `pageFunction` in
     *     `requestAnimationFrame` callback. This is the tightest polling mode
     *     which is suitable to observe styling changes.
     *   - `mutation`- to execute pageFunction on every DOM mutation.
     * - `timeout` - maximum time to wait for in milliseconds. Defaults to `30000`
     *   (30 seconds). Pass `0` to disable timeout. The default value can be
     *   changed by using the {@link Page.setDefaultTimeout} method.
     *   @param args - Arguments to pass to `pageFunction`
     *   @returns A `Promise` which resolves to a JSHandle/ElementHandle of the the
     *   `pageFunction`'s return value.
     */
    waitForFunction(pageFunction, options = {}, ...args) {
        return this.mainFrame().waitForFunction(pageFunction, options, ...args);
    }
}
_Page_closed = new WeakMap(), _Page_client = new WeakMap(), _Page_target = new WeakMap(), _Page_keyboard = new WeakMap(), _Page_mouse = new WeakMap(), _Page_timeoutSettings = new WeakMap(), _Page_touchscreen = new WeakMap(), _Page_accessibility = new WeakMap(), _Page_frameManager = new WeakMap(), _Page_emulationManager = new WeakMap(), _Page_pageBindings = new WeakMap(), _Page_coverage = new WeakMap(), _Page_javascriptEnabled = new WeakMap(), _Page_viewport = new WeakMap(), _Page_screenshotTaskQueue = new WeakMap(), _Page_workers = new WeakMap(), _Page_fileChooserPromises = new WeakMap(), _Page_disconnectPromise = new WeakMap(), _Page_userDragInterceptionEnabled = new WeakMap(), _Page_handlerMap = new WeakMap(), _Page_onDetachedFromTarget = new WeakMap(), _Page_onAttachedToTarget = new WeakMap(), _Page_instances = new WeakSet(), _Page_initialize = async function _Page_initialize() {
    await Promise.all([
        __classPrivateFieldGet$6(this, _Page_frameManager, "f").initialize(__classPrivateFieldGet$6(this, _Page_target, "f")._targetId),
        __classPrivateFieldGet$6(this, _Page_client, "f").send('Performance.enable'),
        __classPrivateFieldGet$6(this, _Page_client, "f").send('Log.enable'),
    ]);
}, _Page_onFileChooser = async function _Page_onFileChooser(event) {
    if (!__classPrivateFieldGet$6(this, _Page_fileChooserPromises, "f").size) {
        return;
    }
    const frame = __classPrivateFieldGet$6(this, _Page_frameManager, "f").frame(event.frameId);
    assert(frame, 'This should never happen.');
    // This is guaranteed to be an HTMLInputElement handle by the event.
    const handle = (await frame.worlds[MAIN_WORLD].adoptBackendNode(event.backendNodeId));
    const fileChooser = new FileChooser(handle, event);
    for (const promise of __classPrivateFieldGet$6(this, _Page_fileChooserPromises, "f")) {
        promise.resolve(fileChooser);
    }
    __classPrivateFieldGet$6(this, _Page_fileChooserPromises, "f").clear();
}, _Page_onTargetCrashed = function _Page_onTargetCrashed() {
    this.emit('error', new Error('Page crashed!'));
}, _Page_onLogEntryAdded = function _Page_onLogEntryAdded(event) {
    const { level, text, args, source, url, lineNumber } = event.entry;
    if (args) {
        args.map(arg => {
            return releaseObject(__classPrivateFieldGet$6(this, _Page_client, "f"), arg);
        });
    }
    if (source !== 'worker') {
        this.emit("console" /* PageEmittedEvents.Console */, new ConsoleMessage(level, text, [], [{ url, lineNumber }]));
    }
}, _Page_emitMetrics = function _Page_emitMetrics(event) {
    this.emit("metrics" /* PageEmittedEvents.Metrics */, {
        title: event.title,
        metrics: __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_buildMetricsObject).call(this, event.metrics),
    });
}, _Page_buildMetricsObject = function _Page_buildMetricsObject(metrics) {
    const result = {};
    for (const metric of metrics || []) {
        if (supportedMetrics.has(metric.name)) {
            result[metric.name] = metric.value;
        }
    }
    return result;
}, _Page_handleException = function _Page_handleException(exceptionDetails) {
    const message = getExceptionMessage(exceptionDetails);
    const err = new Error(message);
    err.stack = ''; // Don't report clientside error with a node stack attached
    this.emit("pageerror" /* PageEmittedEvents.PageError */, err);
}, _Page_onConsoleAPI = async function _Page_onConsoleAPI(event) {
    if (event.executionContextId === 0) {
        // DevTools protocol stores the last 1000 console messages. These
        // messages are always reported even for removed execution contexts. In
        // this case, they are marked with executionContextId = 0 and are
        // reported upon enabling Runtime agent.
        //
        // Ignore these messages since:
        // - there's no execution context we can use to operate with message
        //   arguments
        // - these messages are reported before Puppeteer clients can subscribe
        //   to the 'console'
        //   page event.
        //
        // @see https://github.com/puppeteer/puppeteer/issues/3865
        return;
    }
    const context = __classPrivateFieldGet$6(this, _Page_frameManager, "f").executionContextById(event.executionContextId, __classPrivateFieldGet$6(this, _Page_client, "f"));
    const values = event.args.map(arg => {
        return createJSHandle(context, arg);
    });
    __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_addConsoleMessage).call(this, event.type, values, event.stackTrace);
}, _Page_onBindingCalled = async function _Page_onBindingCalled(event) {
    let payload;
    try {
        payload = JSON.parse(event.payload);
    }
    catch {
        // The binding was either called by something in the page or it was
        // called before our wrapper was initialized.
        return;
    }
    const { type, name, seq, args } = payload;
    if (type !== 'exposedFun' || !__classPrivateFieldGet$6(this, _Page_pageBindings, "f").has(name)) {
        return;
    }
    let expression = null;
    try {
        const pageBinding = __classPrivateFieldGet$6(this, _Page_pageBindings, "f").get(name);
        assert(pageBinding);
        const result = await pageBinding(...args);
        expression = pageBindingDeliverResultString(name, seq, result);
    }
    catch (error) {
        if (isErrorLike(error)) {
            expression = pageBindingDeliverErrorString(name, seq, error.message, error.stack);
        }
        else {
            expression = pageBindingDeliverErrorValueString(name, seq, error);
        }
    }
    __classPrivateFieldGet$6(this, _Page_client, "f")
        .send('Runtime.evaluate', {
        expression,
        contextId: event.executionContextId,
    })
        .catch(debugError);
}, _Page_addConsoleMessage = function _Page_addConsoleMessage(eventType, args, stackTrace) {
    if (!this.listenerCount("console" /* PageEmittedEvents.Console */)) {
        args.forEach(arg => {
            return arg.dispose();
        });
        return;
    }
    const textTokens = [];
    for (const arg of args) {
        const remoteObject = arg.remoteObject();
        if (remoteObject.objectId) {
            textTokens.push(arg.toString());
        }
        else {
            textTokens.push(valueFromRemoteObject(remoteObject));
        }
    }
    const stackTraceLocations = [];
    if (stackTrace) {
        for (const callFrame of stackTrace.callFrames) {
            stackTraceLocations.push({
                url: callFrame.url,
                lineNumber: callFrame.lineNumber,
                columnNumber: callFrame.columnNumber,
            });
        }
    }
    const message = new ConsoleMessage(eventType, textTokens.join(' '), args, stackTraceLocations);
    this.emit("console" /* PageEmittedEvents.Console */, message);
}, _Page_onDialog = function _Page_onDialog(event) {
    let dialogType = null;
    const validDialogTypes = new Set([
        'alert',
        'confirm',
        'prompt',
        'beforeunload',
    ]);
    if (validDialogTypes.has(event.type)) {
        dialogType = event.type;
    }
    assert(dialogType, 'Unknown javascript dialog type: ' + event.type);
    const dialog = new Dialog(__classPrivateFieldGet$6(this, _Page_client, "f"), dialogType, event.message, event.defaultPrompt);
    this.emit("dialog" /* PageEmittedEvents.Dialog */, dialog);
}, _Page_resetDefaultBackgroundColor = 
/**
 * Resets default white background
 */
async function _Page_resetDefaultBackgroundColor() {
    await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setDefaultBackgroundColorOverride');
}, _Page_setTransparentBackgroundColor = 
/**
 * Hides default white background
 */
async function _Page_setTransparentBackgroundColor() {
    await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setDefaultBackgroundColorOverride', {
        color: { r: 0, g: 0, b: 0, a: 0 },
    });
}, _Page_sessionClosePromise = function _Page_sessionClosePromise() {
    if (!__classPrivateFieldGet$6(this, _Page_disconnectPromise, "f")) {
        __classPrivateFieldSet$6(this, _Page_disconnectPromise, new Promise(fulfill => {
            return __classPrivateFieldGet$6(this, _Page_client, "f").once(CDPSessionEmittedEvents.Disconnected, () => {
                return fulfill(new Error('Target closed'));
            });
        }), "f");
    }
    return __classPrivateFieldGet$6(this, _Page_disconnectPromise, "f");
}, _Page_go = async function _Page_go(delta, options) {
    const history = await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.getNavigationHistory');
    const entry = history.entries[history.currentIndex + delta];
    if (!entry) {
        return null;
    }
    const result = await Promise.all([
        this.waitForNavigation(options),
        __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.navigateToHistoryEntry', { entryId: entry.id }),
    ]);
    return result[0];
}, _Page_screenshotTask = async function _Page_screenshotTask(format, options = {}) {
    await __classPrivateFieldGet$6(this, _Page_client, "f").send('Target.activateTarget', {
        targetId: __classPrivateFieldGet$6(this, _Page_target, "f")._targetId,
    });
    let clip = options.clip ? processClip(options.clip) : undefined;
    const captureBeyondViewport = typeof options.captureBeyondViewport === 'boolean'
        ? options.captureBeyondViewport
        : true;
    const fromSurface = typeof options.fromSurface === 'boolean'
        ? options.fromSurface
        : undefined;
    if (options.fullPage) {
        const metrics = await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.getLayoutMetrics');
        // Fallback to `contentSize` in case of using Firefox.
        const { width, height } = metrics.cssContentSize || metrics.contentSize;
        // Overwrite clip for full page.
        clip = { x: 0, y: 0, width, height, scale: 1 };
        if (!captureBeyondViewport) {
            const { isMobile = false, deviceScaleFactor = 1, isLandscape = false, } = __classPrivateFieldGet$6(this, _Page_viewport, "f") || {};
            const screenOrientation = isLandscape
                ? { angle: 90, type: 'landscapePrimary' }
                : { angle: 0, type: 'portraitPrimary' };
            await __classPrivateFieldGet$6(this, _Page_client, "f").send('Emulation.setDeviceMetricsOverride', {
                mobile: isMobile,
                width,
                height,
                deviceScaleFactor,
                screenOrientation,
            });
        }
    }
    const shouldSetDefaultBackground = options.omitBackground && (format === 'png' || format === 'webp');
    if (shouldSetDefaultBackground) {
        await __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_setTransparentBackgroundColor).call(this);
    }
    const result = await __classPrivateFieldGet$6(this, _Page_client, "f").send('Page.captureScreenshot', {
        format,
        quality: options.quality,
        clip,
        captureBeyondViewport,
        fromSurface,
    });
    if (shouldSetDefaultBackground) {
        await __classPrivateFieldGet$6(this, _Page_instances, "m", _Page_resetDefaultBackgroundColor).call(this);
    }
    if (options.fullPage && __classPrivateFieldGet$6(this, _Page_viewport, "f")) {
        await this.setViewport(__classPrivateFieldGet$6(this, _Page_viewport, "f"));
    }
    const buffer = options.encoding === 'base64'
        ? result.data
        : Buffer.from(result.data, 'base64');
    /*
    if (options.path) {
      try {
        const fs = (await importFS()).promises;
        await fs.writeFile(options.path, buffer);
      } catch (error) {
        if (error instanceof TypeError) {
          throw new Error(
            'Screenshots can only be written to a file path in a Node-like environment.'
          );
        }
        throw error;
      }
    }
    */
    return buffer;
    function processClip(clip) {
        const x = Math.round(clip.x);
        const y = Math.round(clip.y);
        const width = Math.round(clip.width + clip.x - x);
        const height = Math.round(clip.height + clip.y - y);
        return { x, y, width, height, scale: 1 };
    }
};
const supportedMetrics = new Set([
    'Timestamp',
    'Documents',
    'Frames',
    'JSEventListeners',
    'Nodes',
    'LayoutCount',
    'RecalcStyleCount',
    'LayoutDuration',
    'RecalcStyleDuration',
    'ScriptDuration',
    'TaskDuration',
    'JSHeapUsedSize',
    'JSHeapTotalSize',
]);
const unitToPixels = {
    px: 1,
    in: 96,
    cm: 37.8,
    mm: 3.78,
};
function convertPrintParameterToInches(parameter) {
    if (typeof parameter === 'undefined') {
        return undefined;
    }
    let pixels;
    if (isNumber(parameter)) {
        // Treat numbers as pixel values to be aligned with phantom's paperSize.
        pixels = parameter;
    }
    else if (isString(parameter)) {
        const text = parameter;
        let unit = text.substring(text.length - 2).toLowerCase();
        let valueText = '';
        if (unit in unitToPixels) {
            valueText = text.substring(0, text.length - 2);
        }
        else {
            // In case of unknown unit try to parse the whole parameter as number of pixels.
            // This is consistent with phantom's paperSize behavior.
            unit = 'px';
            valueText = text;
        }
        const value = Number(valueText);
        assert(!isNaN(value), 'Failed to parse parameter value: ' + text);
        pixels = value * unitToPixels[unit];
    }
    else {
        throw new Error('page.pdf() Cannot handle parameter type: ' + typeof parameter);
    }
    return pixels / 96;
}

/**
 * Copyright 2019 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$5 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$5 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Target_browserContext, _Target_session, _Target_targetInfo, _Target_sessionFactory, _Target_ignoreHTTPSErrors, _Target_defaultViewport, _Target_pagePromise, _Target_workerPromise, _Target_screenshotTaskQueue, _Target_targetManager;
/**
 * @public
 */
class Target {
    /**
     * @internal
     */
    constructor(targetInfo, session, browserContext, targetManager, sessionFactory, ignoreHTTPSErrors, defaultViewport, screenshotTaskQueue, isPageTargetCallback) {
        _Target_browserContext.set(this, void 0);
        _Target_session.set(this, void 0);
        _Target_targetInfo.set(this, void 0);
        _Target_sessionFactory.set(this, void 0);
        _Target_ignoreHTTPSErrors.set(this, void 0);
        _Target_defaultViewport.set(this, void 0);
        _Target_pagePromise.set(this, void 0);
        _Target_workerPromise.set(this, void 0);
        _Target_screenshotTaskQueue.set(this, void 0);
        _Target_targetManager.set(this, void 0);
        __classPrivateFieldSet$5(this, _Target_session, session, "f");
        __classPrivateFieldSet$5(this, _Target_targetManager, targetManager, "f");
        __classPrivateFieldSet$5(this, _Target_targetInfo, targetInfo, "f");
        __classPrivateFieldSet$5(this, _Target_browserContext, browserContext, "f");
        this._targetId = targetInfo.targetId;
        __classPrivateFieldSet$5(this, _Target_sessionFactory, sessionFactory, "f");
        __classPrivateFieldSet$5(this, _Target_ignoreHTTPSErrors, ignoreHTTPSErrors, "f");
        __classPrivateFieldSet$5(this, _Target_defaultViewport, defaultViewport !== null && defaultViewport !== void 0 ? defaultViewport : undefined, "f");
        __classPrivateFieldSet$5(this, _Target_screenshotTaskQueue, screenshotTaskQueue, "f");
        this._isPageTargetCallback = isPageTargetCallback;
        this._initializedPromise = new Promise(fulfill => {
            return (this._initializedCallback = fulfill);
        }).then(async (success) => {
            if (!success) {
                return false;
            }
            const opener = this.opener();
            if (!opener || !__classPrivateFieldGet$5(opener, _Target_pagePromise, "f") || this.type() !== 'page') {
                return true;
            }
            const openerPage = await __classPrivateFieldGet$5(opener, _Target_pagePromise, "f");
            if (!openerPage.listenerCount("popup" /* PageEmittedEvents.Popup */)) {
                return true;
            }
            const popupPage = await this.page();
            openerPage.emit("popup" /* PageEmittedEvents.Popup */, popupPage);
            return true;
        });
        this._isClosedPromise = new Promise(fulfill => {
            return (this._closedCallback = fulfill);
        });
        this._isInitialized =
            !this._isPageTargetCallback(__classPrivateFieldGet$5(this, _Target_targetInfo, "f")) ||
                __classPrivateFieldGet$5(this, _Target_targetInfo, "f").url !== '';
        if (this._isInitialized) {
            this._initializedCallback(true);
        }
    }
    /**
     * @internal
     */
    _session() {
        return __classPrivateFieldGet$5(this, _Target_session, "f");
    }
    /**
     * Creates a Chrome Devtools Protocol session attached to the target.
     */
    createCDPSession() {
        return __classPrivateFieldGet$5(this, _Target_sessionFactory, "f").call(this, false);
    }
    /**
     * @internal
     */
    _targetManager() {
        return __classPrivateFieldGet$5(this, _Target_targetManager, "f");
    }
    /**
     * @internal
     */
    _getTargetInfo() {
        return __classPrivateFieldGet$5(this, _Target_targetInfo, "f");
    }
    /**
     * If the target is not of type `"page"` or `"background_page"`, returns `null`.
     */
    async page() {
        var _a;
        if (this._isPageTargetCallback(__classPrivateFieldGet$5(this, _Target_targetInfo, "f")) && !__classPrivateFieldGet$5(this, _Target_pagePromise, "f")) {
            __classPrivateFieldSet$5(this, _Target_pagePromise, (__classPrivateFieldGet$5(this, _Target_session, "f")
                ? Promise.resolve(__classPrivateFieldGet$5(this, _Target_session, "f"))
                : __classPrivateFieldGet$5(this, _Target_sessionFactory, "f").call(this, true)).then(client => {
                var _a;
                return Page._create(client, this, __classPrivateFieldGet$5(this, _Target_ignoreHTTPSErrors, "f"), (_a = __classPrivateFieldGet$5(this, _Target_defaultViewport, "f")) !== null && _a !== void 0 ? _a : null, __classPrivateFieldGet$5(this, _Target_screenshotTaskQueue, "f"));
            }), "f");
        }
        return (_a = (await __classPrivateFieldGet$5(this, _Target_pagePromise, "f"))) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * If the target is not of type `"service_worker"` or `"shared_worker"`, returns `null`.
     */
    async worker() {
        if (__classPrivateFieldGet$5(this, _Target_targetInfo, "f").type !== 'service_worker' &&
            __classPrivateFieldGet$5(this, _Target_targetInfo, "f").type !== 'shared_worker') {
            return null;
        }
        if (!__classPrivateFieldGet$5(this, _Target_workerPromise, "f")) {
            // TODO(einbinder): Make workers send their console logs.
            __classPrivateFieldSet$5(this, _Target_workerPromise, (__classPrivateFieldGet$5(this, _Target_session, "f")
                ? Promise.resolve(__classPrivateFieldGet$5(this, _Target_session, "f"))
                : __classPrivateFieldGet$5(this, _Target_sessionFactory, "f").call(this, false)).then(client => {
                return new WebWorker(client, __classPrivateFieldGet$5(this, _Target_targetInfo, "f").url, () => { } /* consoleAPICalled */, () => { } /* exceptionThrown */);
            }), "f");
        }
        return __classPrivateFieldGet$5(this, _Target_workerPromise, "f");
    }
    url() {
        return __classPrivateFieldGet$5(this, _Target_targetInfo, "f").url;
    }
    /**
     * Identifies what kind of target this is.
     *
     * @remarks
     *
     * See {@link https://developer.chrome.com/extensions/background_pages | docs} for more info about background pages.
     */
    type() {
        const type = __classPrivateFieldGet$5(this, _Target_targetInfo, "f").type;
        if (type === 'page' ||
            type === 'background_page' ||
            type === 'service_worker' ||
            type === 'shared_worker' ||
            type === 'browser' ||
            type === 'webview') {
            return type;
        }
        return 'other';
    }
    /**
     * Get the browser the target belongs to.
     */
    browser() {
        return __classPrivateFieldGet$5(this, _Target_browserContext, "f").browser();
    }
    /**
     * Get the browser context the target belongs to.
     */
    browserContext() {
        return __classPrivateFieldGet$5(this, _Target_browserContext, "f");
    }
    /**
     * Get the target that opened this target. Top-level targets return `null`.
     */
    opener() {
        const { openerId } = __classPrivateFieldGet$5(this, _Target_targetInfo, "f");
        if (!openerId) {
            return;
        }
        return this.browser()._targets.get(openerId);
    }
    /**
     * @internal
     */
    _targetInfoChanged(targetInfo) {
        __classPrivateFieldSet$5(this, _Target_targetInfo, targetInfo, "f");
        if (!this._isInitialized &&
            (!this._isPageTargetCallback(__classPrivateFieldGet$5(this, _Target_targetInfo, "f")) ||
                __classPrivateFieldGet$5(this, _Target_targetInfo, "f").url !== '')) {
            this._isInitialized = true;
            this._initializedCallback(true);
            return;
        }
    }
}
_Target_browserContext = new WeakMap(), _Target_session = new WeakMap(), _Target_targetInfo = new WeakMap(), _Target_sessionFactory = new WeakMap(), _Target_ignoreHTTPSErrors = new WeakMap(), _Target_defaultViewport = new WeakMap(), _Target_pagePromise = new WeakMap(), _Target_workerPromise = new WeakMap(), _Target_screenshotTaskQueue = new WeakMap(), _Target_targetManager = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$4 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$4 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _TaskQueue_chain;
/**
 * @internal
 */
class TaskQueue {
    constructor() {
        _TaskQueue_chain.set(this, void 0);
        __classPrivateFieldSet$4(this, _TaskQueue_chain, Promise.resolve(), "f");
    }
    postTask(task) {
        const result = __classPrivateFieldGet$4(this, _TaskQueue_chain, "f").then(task);
        __classPrivateFieldSet$4(this, _TaskQueue_chain, result.then(() => {
            return undefined;
        }, () => {
            return undefined;
        }), "f");
        return result;
    }
}
_TaskQueue_chain = new WeakMap();

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$3 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$3 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _ChromeTargetManager_instances, _ChromeTargetManager_connection, _ChromeTargetManager_discoveredTargetsByTargetId, _ChromeTargetManager_attachedTargetsByTargetId, _ChromeTargetManager_attachedTargetsBySessionId, _ChromeTargetManager_ignoredTargets, _ChromeTargetManager_targetFilterCallback, _ChromeTargetManager_targetFactory, _ChromeTargetManager_targetInterceptors, _ChromeTargetManager_attachedToTargetListenersBySession, _ChromeTargetManager_detachedFromTargetListenersBySession, _ChromeTargetManager_initializeCallback, _ChromeTargetManager_initializePromise, _ChromeTargetManager_targetsIdsForInit, _ChromeTargetManager_storeExistingTargetsForInit, _ChromeTargetManager_setupAttachmentListeners, _ChromeTargetManager_removeAttachmentListeners, _ChromeTargetManager_onSessionDetached, _ChromeTargetManager_onTargetCreated, _ChromeTargetManager_onTargetDestroyed, _ChromeTargetManager_onTargetInfoChanged, _ChromeTargetManager_onAttachedToTarget, _ChromeTargetManager_finishInitializationIfReady, _ChromeTargetManager_onDetachedFromTarget;
/**
 * ChromeTargetManager uses the CDP's auto-attach mechanism to intercept
 * new targets and allow the rest of Puppeteer to configure listeners while
 * the target is paused.
 *
 * @internal
 */
class ChromeTargetManager extends EventEmitter {
    constructor(connection, targetFactory, targetFilterCallback) {
        super();
        _ChromeTargetManager_instances.add(this);
        _ChromeTargetManager_connection.set(this, void 0);
        /**
         * Keeps track of the following events: 'Target.targetCreated',
         * 'Target.targetDestroyed', 'Target.targetInfoChanged'.
         *
         * A target becomes discovered when 'Target.targetCreated' is received.
         * A target is removed from this map once 'Target.targetDestroyed' is
         * received.
         *
         * `targetFilterCallback` has no effect on this map.
         */
        _ChromeTargetManager_discoveredTargetsByTargetId.set(this, new Map());
        /**
         * A target is added to this map once ChromeTargetManager has created
         * a Target and attached at least once to it.
         */
        _ChromeTargetManager_attachedTargetsByTargetId.set(this, new Map());
        /**
         *
         * Tracks which sessions attach to which target.
         */
        _ChromeTargetManager_attachedTargetsBySessionId.set(this, new Map());
        /**
         * If a target was filtered out by `targetFilterCallback`, we still receive
         * events about it from CDP, but we don't forward them to the rest of Puppeteer.
         */
        _ChromeTargetManager_ignoredTargets.set(this, new Set());
        _ChromeTargetManager_targetFilterCallback.set(this, void 0);
        _ChromeTargetManager_targetFactory.set(this, void 0);
        _ChromeTargetManager_targetInterceptors.set(this, new WeakMap());
        _ChromeTargetManager_attachedToTargetListenersBySession.set(this, new WeakMap());
        _ChromeTargetManager_detachedFromTargetListenersBySession.set(this, new WeakMap());
        _ChromeTargetManager_initializeCallback.set(this, () => { });
        _ChromeTargetManager_initializePromise.set(this, new Promise(resolve => {
            __classPrivateFieldSet$3(this, _ChromeTargetManager_initializeCallback, resolve, "f");
        }));
        _ChromeTargetManager_targetsIdsForInit.set(this, new Set());
        _ChromeTargetManager_storeExistingTargetsForInit.set(this, () => {
            for (const [targetId, targetInfo,] of __classPrivateFieldGet$3(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").entries()) {
                if ((!__classPrivateFieldGet$3(this, _ChromeTargetManager_targetFilterCallback, "f") ||
                    __classPrivateFieldGet$3(this, _ChromeTargetManager_targetFilterCallback, "f").call(this, targetInfo)) &&
                    targetInfo.type !== 'browser') {
                    __classPrivateFieldGet$3(this, _ChromeTargetManager_targetsIdsForInit, "f").add(targetId);
                }
            }
        });
        _ChromeTargetManager_onSessionDetached.set(this, (session) => {
            __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_removeAttachmentListeners).call(this, session);
            __classPrivateFieldGet$3(this, _ChromeTargetManager_targetInterceptors, "f").delete(session);
        });
        _ChromeTargetManager_onTargetCreated.set(this, async (event) => {
            __classPrivateFieldGet$3(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            this.emit("targetDiscovered" /* TargetManagerEmittedEvents.TargetDiscovered */, event.targetInfo);
            // The connection is already attached to the browser target implicitly,
            // therefore, no new CDPSession is created and we have special handling
            // here.
            if (event.targetInfo.type === 'browser' && event.targetInfo.attached) {
                if (__classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(event.targetInfo.targetId)) {
                    return;
                }
                const target = __classPrivateFieldGet$3(this, _ChromeTargetManager_targetFactory, "f").call(this, event.targetInfo, undefined);
                __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").set(event.targetInfo.targetId, target);
            }
            if (event.targetInfo.type === 'shared_worker') {
                // Special case (https://crbug.com/1338156): currently, shared_workers
                // don't get auto-attached. This should be removed once the auto-attach
                // works.
                await __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f")._createSession(event.targetInfo, true);
            }
        });
        _ChromeTargetManager_onTargetDestroyed.set(this, (event) => {
            const targetInfo = __classPrivateFieldGet$3(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").get(event.targetId);
            __classPrivateFieldGet$3(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").delete(event.targetId);
            __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this, event.targetId);
            if ((targetInfo === null || targetInfo === void 0 ? void 0 : targetInfo.type) === 'service_worker' &&
                __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(event.targetId)) {
                // Special case for service workers: report TargetGone event when
                // the worker is destroyed.
                const target = __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(event.targetId);
                this.emit("targetGone" /* TargetManagerEmittedEvents.TargetGone */, target);
                __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").delete(event.targetId);
            }
        });
        _ChromeTargetManager_onTargetInfoChanged.set(this, (event) => {
            __classPrivateFieldGet$3(this, _ChromeTargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            if (__classPrivateFieldGet$3(this, _ChromeTargetManager_ignoredTargets, "f").has(event.targetInfo.targetId) ||
                !__classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(event.targetInfo.targetId) ||
                !event.targetInfo.attached) {
                return;
            }
            const target = __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(event.targetInfo.targetId);
            this.emit("targetChanged" /* TargetManagerEmittedEvents.TargetChanged */, {
                target: target,
                targetInfo: event.targetInfo,
            });
        });
        _ChromeTargetManager_onAttachedToTarget.set(this, async (parentSession, event) => {
            const targetInfo = event.targetInfo;
            const session = __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").session(event.sessionId);
            if (!session) {
                throw new Error(`Session ${event.sessionId} was not created.`);
            }
            const silentDetach = async () => {
                await session.send('Runtime.runIfWaitingForDebugger').catch(debugError);
                // We don't use `session.detach()` because that dispatches all commands on
                // the connection instead of the parent session.
                await parentSession
                    .send('Target.detachFromTarget', {
                    sessionId: session.id(),
                })
                    .catch(debugError);
            };
            if (!__classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").isAutoAttached(targetInfo.targetId)) {
                return;
            }
            // Special case for service workers: being attached to service workers will
            // prevent them from ever being destroyed. Therefore, we silently detach
            // from service workers unless the connection was manually created via
            // `page.worker()`. To determine this, we use
            // `this.#connection.isAutoAttached(targetInfo.targetId)`. In the future, we
            // should determine if a target is auto-attached or not with the help of
            // CDP.
            if (targetInfo.type === 'service_worker' &&
                __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").isAutoAttached(targetInfo.targetId)) {
                __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this, targetInfo.targetId);
                await silentDetach();
                if (__classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(targetInfo.targetId)) {
                    return;
                }
                const target = __classPrivateFieldGet$3(this, _ChromeTargetManager_targetFactory, "f").call(this, targetInfo);
                __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").set(targetInfo.targetId, target);
                this.emit("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, target);
                return;
            }
            if (__classPrivateFieldGet$3(this, _ChromeTargetManager_targetFilterCallback, "f") && !__classPrivateFieldGet$3(this, _ChromeTargetManager_targetFilterCallback, "f").call(this, targetInfo)) {
                __classPrivateFieldGet$3(this, _ChromeTargetManager_ignoredTargets, "f").add(targetInfo.targetId);
                __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this, targetInfo.targetId);
                await silentDetach();
                return;
            }
            const existingTarget = __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").has(targetInfo.targetId);
            const target = existingTarget
                ? __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(targetInfo.targetId)
                : __classPrivateFieldGet$3(this, _ChromeTargetManager_targetFactory, "f").call(this, targetInfo, session);
            __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_setupAttachmentListeners).call(this, session);
            if (existingTarget) {
                __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").set(session.id(), __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").get(targetInfo.targetId));
            }
            else {
                __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").set(targetInfo.targetId, target);
                __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").set(session.id(), target);
            }
            for (const interceptor of __classPrivateFieldGet$3(this, _ChromeTargetManager_targetInterceptors, "f").get(parentSession) ||
                []) {
                if (!(parentSession instanceof Connection)) {
                    // Sanity check: if parent session is not a connection, it should be
                    // present in #attachedTargetsBySessionId.
                    assert(__classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").has(parentSession.id()));
                }
                await interceptor(target, parentSession instanceof Connection
                    ? null
                    : __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").get(parentSession.id()));
            }
            __classPrivateFieldGet$3(this, _ChromeTargetManager_targetsIdsForInit, "f").delete(target._targetId);
            if (!existingTarget) {
                this.emit("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, target);
            }
            __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this);
            // TODO: the browser might be shutting down here. What do we do with the
            // error?
            await Promise.all([
                session.send('Target.setAutoAttach', {
                    waitForDebuggerOnStart: true,
                    flatten: true,
                    autoAttach: true,
                }),
                session.send('Runtime.runIfWaitingForDebugger'),
            ]).catch(debugError);
        });
        _ChromeTargetManager_onDetachedFromTarget.set(this, (_parentSession, event) => {
            const target = __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").get(event.sessionId);
            __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsBySessionId, "f").delete(event.sessionId);
            if (!target) {
                return;
            }
            __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f").delete(target._targetId);
            this.emit("targetGone" /* TargetManagerEmittedEvents.TargetGone */, target);
        });
        __classPrivateFieldSet$3(this, _ChromeTargetManager_connection, connection, "f");
        __classPrivateFieldSet$3(this, _ChromeTargetManager_targetFilterCallback, targetFilterCallback, "f");
        __classPrivateFieldSet$3(this, _ChromeTargetManager_targetFactory, targetFactory, "f");
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").on('Target.targetCreated', __classPrivateFieldGet$3(this, _ChromeTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").on('Target.targetDestroyed', __classPrivateFieldGet$3(this, _ChromeTargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").on('Target.targetInfoChanged', __classPrivateFieldGet$3(this, _ChromeTargetManager_onTargetInfoChanged, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").on('sessiondetached', __classPrivateFieldGet$3(this, _ChromeTargetManager_onSessionDetached, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_setupAttachmentListeners).call(this, __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f"));
        // TODO: remove `as any` once the protocol definitions are updated with the
        // next Chromium roll.
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f")
            .send('Target.setDiscoverTargets', {
            discover: true,
            filter: [{ type: 'tab', exclude: true }, {}],
        })
            .then(__classPrivateFieldGet$3(this, _ChromeTargetManager_storeExistingTargetsForInit, "f"))
            .catch(debugError);
    }
    async initialize() {
        await __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").send('Target.setAutoAttach', {
            waitForDebuggerOnStart: true,
            flatten: true,
            autoAttach: true,
        });
        __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_finishInitializationIfReady).call(this);
        await __classPrivateFieldGet$3(this, _ChromeTargetManager_initializePromise, "f");
    }
    dispose() {
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").off('Target.targetCreated', __classPrivateFieldGet$3(this, _ChromeTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").off('Target.targetDestroyed', __classPrivateFieldGet$3(this, _ChromeTargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").off('Target.targetInfoChanged', __classPrivateFieldGet$3(this, _ChromeTargetManager_onTargetInfoChanged, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f").off('sessiondetached', __classPrivateFieldGet$3(this, _ChromeTargetManager_onSessionDetached, "f"));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_instances, "m", _ChromeTargetManager_removeAttachmentListeners).call(this, __classPrivateFieldGet$3(this, _ChromeTargetManager_connection, "f"));
    }
    getAvailableTargets() {
        return __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedTargetsByTargetId, "f");
    }
    addTargetInterceptor(session, interceptor) {
        const interceptors = __classPrivateFieldGet$3(this, _ChromeTargetManager_targetInterceptors, "f").get(session) || [];
        interceptors.push(interceptor);
        __classPrivateFieldGet$3(this, _ChromeTargetManager_targetInterceptors, "f").set(session, interceptors);
    }
    removeTargetInterceptor(client, interceptor) {
        const interceptors = __classPrivateFieldGet$3(this, _ChromeTargetManager_targetInterceptors, "f").get(client) || [];
        __classPrivateFieldGet$3(this, _ChromeTargetManager_targetInterceptors, "f").set(client, interceptors.filter(currentInterceptor => {
            return currentInterceptor !== interceptor;
        }));
    }
}
_ChromeTargetManager_connection = new WeakMap(), _ChromeTargetManager_discoveredTargetsByTargetId = new WeakMap(), _ChromeTargetManager_attachedTargetsByTargetId = new WeakMap(), _ChromeTargetManager_attachedTargetsBySessionId = new WeakMap(), _ChromeTargetManager_ignoredTargets = new WeakMap(), _ChromeTargetManager_targetFilterCallback = new WeakMap(), _ChromeTargetManager_targetFactory = new WeakMap(), _ChromeTargetManager_targetInterceptors = new WeakMap(), _ChromeTargetManager_attachedToTargetListenersBySession = new WeakMap(), _ChromeTargetManager_detachedFromTargetListenersBySession = new WeakMap(), _ChromeTargetManager_initializeCallback = new WeakMap(), _ChromeTargetManager_initializePromise = new WeakMap(), _ChromeTargetManager_targetsIdsForInit = new WeakMap(), _ChromeTargetManager_storeExistingTargetsForInit = new WeakMap(), _ChromeTargetManager_onSessionDetached = new WeakMap(), _ChromeTargetManager_onTargetCreated = new WeakMap(), _ChromeTargetManager_onTargetDestroyed = new WeakMap(), _ChromeTargetManager_onTargetInfoChanged = new WeakMap(), _ChromeTargetManager_onAttachedToTarget = new WeakMap(), _ChromeTargetManager_onDetachedFromTarget = new WeakMap(), _ChromeTargetManager_instances = new WeakSet(), _ChromeTargetManager_setupAttachmentListeners = function _ChromeTargetManager_setupAttachmentListeners(session) {
    const listener = (event) => {
        return __classPrivateFieldGet$3(this, _ChromeTargetManager_onAttachedToTarget, "f").call(this, session, event);
    };
    assert(!__classPrivateFieldGet$3(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").has(session));
    __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").set(session, listener);
    session.on('Target.attachedToTarget', listener);
    const detachedListener = (event) => {
        return __classPrivateFieldGet$3(this, _ChromeTargetManager_onDetachedFromTarget, "f").call(this, session, event);
    };
    assert(!__classPrivateFieldGet$3(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").has(session));
    __classPrivateFieldGet$3(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").set(session, detachedListener);
    session.on('Target.detachedFromTarget', detachedListener);
}, _ChromeTargetManager_removeAttachmentListeners = function _ChromeTargetManager_removeAttachmentListeners(session) {
    if (__classPrivateFieldGet$3(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").has(session)) {
        session.off('Target.attachedToTarget', __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").get(session));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_attachedToTargetListenersBySession, "f").delete(session);
    }
    if (__classPrivateFieldGet$3(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").has(session)) {
        session.off('Target.detachedFromTarget', __classPrivateFieldGet$3(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").get(session));
        __classPrivateFieldGet$3(this, _ChromeTargetManager_detachedFromTargetListenersBySession, "f").delete(session);
    }
}, _ChromeTargetManager_finishInitializationIfReady = function _ChromeTargetManager_finishInitializationIfReady(targetId) {
    targetId !== undefined && __classPrivateFieldGet$3(this, _ChromeTargetManager_targetsIdsForInit, "f").delete(targetId);
    if (__classPrivateFieldGet$3(this, _ChromeTargetManager_targetsIdsForInit, "f").size === 0) {
        __classPrivateFieldGet$3(this, _ChromeTargetManager_initializeCallback, "f").call(this);
    }
};

/**
 * Copyright 2022 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$2 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$2 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _FirefoxTargetManager_instances, _FirefoxTargetManager_connection, _FirefoxTargetManager_discoveredTargetsByTargetId, _FirefoxTargetManager_availableTargetsByTargetId, _FirefoxTargetManager_availableTargetsBySessionId, _FirefoxTargetManager_ignoredTargets, _FirefoxTargetManager_targetFilterCallback, _FirefoxTargetManager_targetFactory, _FirefoxTargetManager_targetInterceptors, _FirefoxTargetManager_attachedToTargetListenersBySession, _FirefoxTargetManager_initializeCallback, _FirefoxTargetManager_initializePromise, _FirefoxTargetManager_targetsIdsForInit, _FirefoxTargetManager_onSessionDetached, _FirefoxTargetManager_onTargetCreated, _FirefoxTargetManager_onTargetDestroyed, _FirefoxTargetManager_onAttachedToTarget, _FirefoxTargetManager_finishInitializationIfReady;
/**
 * FirefoxTargetManager implements target management using
 * `Target.setDiscoverTargets` without using auto-attach. It, therefore, creates
 * targets that lazily establish their CDP sessions.
 *
 * Although the approach is potentially flaky, there is no other way for Firefox
 * because Firefox's CDP implementation does not support auto-attach.
 *
 * Firefox does not support targetInfoChanged and detachedFromTarget events:
 *
 * - https://bugzilla.mozilla.org/show_bug.cgi?id=1610855
 * - https://bugzilla.mozilla.org/show_bug.cgi?id=1636979
 *   @internal
 */
class FirefoxTargetManager extends EventEmitter {
    constructor(connection, targetFactory, targetFilterCallback) {
        super();
        _FirefoxTargetManager_instances.add(this);
        _FirefoxTargetManager_connection.set(this, void 0);
        /**
         * Keeps track of the following events: 'Target.targetCreated',
         * 'Target.targetDestroyed'.
         *
         * A target becomes discovered when 'Target.targetCreated' is received.
         * A target is removed from this map once 'Target.targetDestroyed' is
         * received.
         *
         * `targetFilterCallback` has no effect on this map.
         */
        _FirefoxTargetManager_discoveredTargetsByTargetId.set(this, new Map());
        /**
         * Keeps track of targets that were created via 'Target.targetCreated'
         * and which one are not filtered out by `targetFilterCallback`.
         *
         * The target is removed from here once it's been destroyed.
         */
        _FirefoxTargetManager_availableTargetsByTargetId.set(this, new Map());
        /**
         * Tracks which sessions attach to which target.
         */
        _FirefoxTargetManager_availableTargetsBySessionId.set(this, new Map());
        /**
         * If a target was filtered out by `targetFilterCallback`, we still receive
         * events about it from CDP, but we don't forward them to the rest of Puppeteer.
         */
        _FirefoxTargetManager_ignoredTargets.set(this, new Set());
        _FirefoxTargetManager_targetFilterCallback.set(this, void 0);
        _FirefoxTargetManager_targetFactory.set(this, void 0);
        _FirefoxTargetManager_targetInterceptors.set(this, new WeakMap());
        _FirefoxTargetManager_attachedToTargetListenersBySession.set(this, new WeakMap());
        _FirefoxTargetManager_initializeCallback.set(this, () => { });
        _FirefoxTargetManager_initializePromise.set(this, new Promise(resolve => {
            __classPrivateFieldSet$2(this, _FirefoxTargetManager_initializeCallback, resolve, "f");
        }));
        _FirefoxTargetManager_targetsIdsForInit.set(this, new Set());
        _FirefoxTargetManager_onSessionDetached.set(this, (session) => {
            this.removeSessionListeners(session);
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetInterceptors, "f").delete(session);
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").delete(session.id());
        });
        _FirefoxTargetManager_onTargetCreated.set(this, async (event) => {
            if (__classPrivateFieldGet$2(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").has(event.targetInfo.targetId)) {
                return;
            }
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").set(event.targetInfo.targetId, event.targetInfo);
            if (event.targetInfo.type === 'browser' && event.targetInfo.attached) {
                const target = __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetFactory, "f").call(this, event.targetInfo, undefined);
                __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").set(event.targetInfo.targetId, target);
                __classPrivateFieldGet$2(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, target._targetId);
                return;
            }
            if (__classPrivateFieldGet$2(this, _FirefoxTargetManager_targetFilterCallback, "f") &&
                !__classPrivateFieldGet$2(this, _FirefoxTargetManager_targetFilterCallback, "f").call(this, event.targetInfo)) {
                __classPrivateFieldGet$2(this, _FirefoxTargetManager_ignoredTargets, "f").add(event.targetInfo.targetId);
                __classPrivateFieldGet$2(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, event.targetInfo.targetId);
                return;
            }
            const target = __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetFactory, "f").call(this, event.targetInfo, undefined);
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").set(event.targetInfo.targetId, target);
            this.emit("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, target);
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, target._targetId);
        });
        _FirefoxTargetManager_onTargetDestroyed.set(this, (event) => {
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").delete(event.targetId);
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_instances, "m", _FirefoxTargetManager_finishInitializationIfReady).call(this, event.targetId);
            const target = __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").get(event.targetId);
            if (target) {
                this.emit("targetGone" /* TargetManagerEmittedEvents.TargetGone */, target);
                __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").delete(event.targetId);
            }
        });
        _FirefoxTargetManager_onAttachedToTarget.set(this, async (parentSession, event) => {
            const targetInfo = event.targetInfo;
            const session = __classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f").session(event.sessionId);
            if (!session) {
                throw new Error(`Session ${event.sessionId} was not created.`);
            }
            const target = __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").get(targetInfo.targetId);
            assert(target, `Target ${targetInfo.targetId} is missing`);
            this.setupAttachmentListeners(session);
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").set(session.id(), __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsByTargetId, "f").get(targetInfo.targetId));
            for (const hook of __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetInterceptors, "f").get(parentSession) || []) {
                if (!(parentSession instanceof Connection)) {
                    assert(__classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").has(parentSession.id()));
                }
                await hook(target, parentSession instanceof Connection
                    ? null
                    : __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsBySessionId, "f").get(parentSession.id()));
            }
        });
        __classPrivateFieldSet$2(this, _FirefoxTargetManager_connection, connection, "f");
        __classPrivateFieldSet$2(this, _FirefoxTargetManager_targetFilterCallback, targetFilterCallback, "f");
        __classPrivateFieldSet$2(this, _FirefoxTargetManager_targetFactory, targetFactory, "f");
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f").on('Target.targetCreated', __classPrivateFieldGet$2(this, _FirefoxTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f").on('Target.targetDestroyed', __classPrivateFieldGet$2(this, _FirefoxTargetManager_onTargetDestroyed, "f"));
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f").on('sessiondetached', __classPrivateFieldGet$2(this, _FirefoxTargetManager_onSessionDetached, "f"));
        this.setupAttachmentListeners(__classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f"));
    }
    addTargetInterceptor(client, interceptor) {
        const interceptors = __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetInterceptors, "f").get(client) || [];
        interceptors.push(interceptor);
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetInterceptors, "f").set(client, interceptors);
    }
    removeTargetInterceptor(client, interceptor) {
        const interceptors = __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetInterceptors, "f").get(client) || [];
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetInterceptors, "f").set(client, interceptors.filter(currentInterceptor => {
            return currentInterceptor !== interceptor;
        }));
    }
    setupAttachmentListeners(session) {
        const listener = (event) => {
            return __classPrivateFieldGet$2(this, _FirefoxTargetManager_onAttachedToTarget, "f").call(this, session, event);
        };
        assert(!__classPrivateFieldGet$2(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").has(session));
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").set(session, listener);
        session.on('Target.attachedToTarget', listener);
    }
    removeSessionListeners(session) {
        if (__classPrivateFieldGet$2(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").has(session)) {
            session.off('Target.attachedToTarget', __classPrivateFieldGet$2(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").get(session));
            __classPrivateFieldGet$2(this, _FirefoxTargetManager_attachedToTargetListenersBySession, "f").delete(session);
        }
    }
    getAvailableTargets() {
        return __classPrivateFieldGet$2(this, _FirefoxTargetManager_availableTargetsByTargetId, "f");
    }
    dispose() {
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f").off('Target.targetCreated', __classPrivateFieldGet$2(this, _FirefoxTargetManager_onTargetCreated, "f"));
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f").off('Target.targetDestroyed', __classPrivateFieldGet$2(this, _FirefoxTargetManager_onTargetDestroyed, "f"));
    }
    async initialize() {
        await __classPrivateFieldGet$2(this, _FirefoxTargetManager_connection, "f").send('Target.setDiscoverTargets', { discover: true });
        __classPrivateFieldSet$2(this, _FirefoxTargetManager_targetsIdsForInit, new Set(__classPrivateFieldGet$2(this, _FirefoxTargetManager_discoveredTargetsByTargetId, "f").keys()), "f");
        await __classPrivateFieldGet$2(this, _FirefoxTargetManager_initializePromise, "f");
    }
}
_FirefoxTargetManager_connection = new WeakMap(), _FirefoxTargetManager_discoveredTargetsByTargetId = new WeakMap(), _FirefoxTargetManager_availableTargetsByTargetId = new WeakMap(), _FirefoxTargetManager_availableTargetsBySessionId = new WeakMap(), _FirefoxTargetManager_ignoredTargets = new WeakMap(), _FirefoxTargetManager_targetFilterCallback = new WeakMap(), _FirefoxTargetManager_targetFactory = new WeakMap(), _FirefoxTargetManager_targetInterceptors = new WeakMap(), _FirefoxTargetManager_attachedToTargetListenersBySession = new WeakMap(), _FirefoxTargetManager_initializeCallback = new WeakMap(), _FirefoxTargetManager_initializePromise = new WeakMap(), _FirefoxTargetManager_targetsIdsForInit = new WeakMap(), _FirefoxTargetManager_onSessionDetached = new WeakMap(), _FirefoxTargetManager_onTargetCreated = new WeakMap(), _FirefoxTargetManager_onTargetDestroyed = new WeakMap(), _FirefoxTargetManager_onAttachedToTarget = new WeakMap(), _FirefoxTargetManager_instances = new WeakSet(), _FirefoxTargetManager_finishInitializationIfReady = function _FirefoxTargetManager_finishInitializationIfReady(targetId) {
    __classPrivateFieldGet$2(this, _FirefoxTargetManager_targetsIdsForInit, "f").delete(targetId);
    if (__classPrivateFieldGet$2(this, _FirefoxTargetManager_targetsIdsForInit, "f").size === 0) {
        __classPrivateFieldGet$2(this, _FirefoxTargetManager_initializeCallback, "f").call(this);
    }
};

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var __classPrivateFieldSet$1 = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet$1 = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Browser_instances, _Browser_ignoreHTTPSErrors, _Browser_defaultViewport, _Browser_process, _Browser_connection, _Browser_closeCallback, _Browser_targetFilterCallback, _Browser_isPageTargetCallback, _Browser_defaultContext, _Browser_contexts, _Browser_screenshotTaskQueue, _Browser_targetManager, _Browser_sessionId, _Browser_emitDisconnected, _Browser_setIsPageTargetCallback, _Browser_createTarget, _Browser_onAttachedToTarget, _Browser_onDetachedFromTarget, _Browser_onTargetChanged, _Browser_onTargetDiscovered, _Browser_getVersion, _BrowserContext_connection, _BrowserContext_browser, _BrowserContext_id;
const WEB_PERMISSION_TO_PROTOCOL_PERMISSION = new Map([
    ['geolocation', 'geolocation'],
    ['midi', 'midi'],
    ['notifications', 'notifications'],
    // TODO: push isn't a valid type?
    // ['push', 'push'],
    ['camera', 'videoCapture'],
    ['microphone', 'audioCapture'],
    ['background-sync', 'backgroundSync'],
    ['ambient-light-sensor', 'sensors'],
    ['accelerometer', 'sensors'],
    ['gyroscope', 'sensors'],
    ['magnetometer', 'sensors'],
    ['accessibility-events', 'accessibilityEvents'],
    ['clipboard-read', 'clipboardReadWrite'],
    ['clipboard-write', 'clipboardReadWrite'],
    ['payment-handler', 'paymentHandler'],
    ['persistent-storage', 'durableStorage'],
    ['idle-detection', 'idleDetection'],
    // chrome-specific permissions we have.
    ['midi-sysex', 'midiSysex'],
]);
/**
 * A Browser is created when Puppeteer connects to a Chromium instance, either through
 * {@link PuppeteerNode.launch} or {@link Puppeteer.connect}.
 *
 * @remarks
 *
 * The Browser class extends from Puppeteer's {@link EventEmitter} class and will
 * emit various events which are documented in the {@link BrowserEmittedEvents} enum.
 *
 * @example
 * An example of using a {@link Browser} to create a {@link Page}:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.goto('https://example.com');
 *   await browser.close();
 * })();
 * ```
 *
 * @example
 * An example of disconnecting from and reconnecting to a {@link Browser}:
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   // Store the endpoint to be able to reconnect to Chromium
 *   const browserWSEndpoint = browser.wsEndpoint();
 *   // Disconnect puppeteer from Chromium
 *   browser.disconnect();
 *
 *   // Use the endpoint to reestablish a connection
 *   const browser2 = await puppeteer.connect({browserWSEndpoint});
 *   // Close Chromium
 *   await browser2.close();
 * })();
 * ```
 *
 * @public
 */
class Browser extends EventEmitter {
    /**
     * @internal
     */
    constructor(product, connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback, sessionId) {
        super();
        _Browser_instances.add(this);
        _Browser_ignoreHTTPSErrors.set(this, void 0);
        _Browser_defaultViewport.set(this, void 0);
        _Browser_process.set(this, void 0);
        _Browser_connection.set(this, void 0);
        _Browser_closeCallback.set(this, void 0);
        _Browser_targetFilterCallback.set(this, void 0);
        _Browser_isPageTargetCallback.set(this, void 0);
        _Browser_defaultContext.set(this, void 0);
        _Browser_contexts.set(this, void 0);
        _Browser_screenshotTaskQueue.set(this, void 0);
        _Browser_targetManager.set(this, void 0);
        _Browser_sessionId.set(this, void 0);
        _Browser_emitDisconnected.set(this, () => {
            this.emit("disconnected" /* BrowserEmittedEvents.Disconnected */);
        });
        _Browser_createTarget.set(this, (targetInfo, session) => {
            var _a;
            const { browserContextId } = targetInfo;
            const context = browserContextId && __classPrivateFieldGet$1(this, _Browser_contexts, "f").has(browserContextId)
                ? __classPrivateFieldGet$1(this, _Browser_contexts, "f").get(browserContextId)
                : __classPrivateFieldGet$1(this, _Browser_defaultContext, "f");
            if (!context) {
                throw new Error('Missing browser context');
            }
            return new Target(targetInfo, session, context, __classPrivateFieldGet$1(this, _Browser_targetManager, "f"), (isAutoAttachEmulated) => {
                return __classPrivateFieldGet$1(this, _Browser_connection, "f")._createSession(targetInfo, isAutoAttachEmulated);
            }, __classPrivateFieldGet$1(this, _Browser_ignoreHTTPSErrors, "f"), (_a = __classPrivateFieldGet$1(this, _Browser_defaultViewport, "f")) !== null && _a !== void 0 ? _a : null, __classPrivateFieldGet$1(this, _Browser_screenshotTaskQueue, "f"), __classPrivateFieldGet$1(this, _Browser_isPageTargetCallback, "f"));
        });
        _Browser_onAttachedToTarget.set(this, async (target) => {
            if (await target._initializedPromise) {
                this.emit("targetcreated" /* BrowserEmittedEvents.TargetCreated */, target);
                target
                    .browserContext()
                    .emit("targetcreated" /* BrowserContextEmittedEvents.TargetCreated */, target);
            }
        });
        _Browser_onDetachedFromTarget.set(this, async (target) => {
            target._initializedCallback(false);
            target._closedCallback();
            if (await target._initializedPromise) {
                this.emit("targetdestroyed" /* BrowserEmittedEvents.TargetDestroyed */, target);
                target
                    .browserContext()
                    .emit("targetdestroyed" /* BrowserContextEmittedEvents.TargetDestroyed */, target);
            }
        });
        _Browser_onTargetChanged.set(this, ({ target, targetInfo, }) => {
            const previousURL = target.url();
            const wasInitialized = target._isInitialized;
            target._targetInfoChanged(targetInfo);
            if (wasInitialized && previousURL !== target.url()) {
                this.emit("targetchanged" /* BrowserEmittedEvents.TargetChanged */, target);
                target
                    .browserContext()
                    .emit("targetchanged" /* BrowserContextEmittedEvents.TargetChanged */, target);
            }
        });
        _Browser_onTargetDiscovered.set(this, (targetInfo) => {
            this.emit('targetdiscovered', targetInfo);
        });
        product = product || 'chrome';
        __classPrivateFieldSet$1(this, _Browser_ignoreHTTPSErrors, ignoreHTTPSErrors, "f");
        __classPrivateFieldSet$1(this, _Browser_defaultViewport, defaultViewport, "f");
        __classPrivateFieldSet$1(this, _Browser_process, process, "f");
        __classPrivateFieldSet$1(this, _Browser_screenshotTaskQueue, new TaskQueue(), "f");
        __classPrivateFieldSet$1(this, _Browser_connection, connection, "f");
        __classPrivateFieldSet$1(this, _Browser_closeCallback, closeCallback || function () { }, "f");
        __classPrivateFieldSet$1(this, _Browser_targetFilterCallback, targetFilterCallback ||
            (() => {
                return true;
            }), "f");
        __classPrivateFieldGet$1(this, _Browser_instances, "m", _Browser_setIsPageTargetCallback).call(this, isPageTargetCallback);
        if (product === 'firefox') {
            __classPrivateFieldSet$1(this, _Browser_targetManager, new FirefoxTargetManager(connection, __classPrivateFieldGet$1(this, _Browser_createTarget, "f"), __classPrivateFieldGet$1(this, _Browser_targetFilterCallback, "f")), "f");
        }
        else {
            __classPrivateFieldSet$1(this, _Browser_targetManager, new ChromeTargetManager(connection, __classPrivateFieldGet$1(this, _Browser_createTarget, "f"), __classPrivateFieldGet$1(this, _Browser_targetFilterCallback, "f")), "f");
        }
        __classPrivateFieldSet$1(this, _Browser_defaultContext, new BrowserContext(__classPrivateFieldGet$1(this, _Browser_connection, "f"), this), "f");
        __classPrivateFieldSet$1(this, _Browser_contexts, new Map(), "f");
        for (const contextId of contextIds) {
            __classPrivateFieldGet$1(this, _Browser_contexts, "f").set(contextId, new BrowserContext(__classPrivateFieldGet$1(this, _Browser_connection, "f"), this, contextId));
        }
        __classPrivateFieldSet$1(this, _Browser_sessionId, sessionId || 'unknown', "f");
    }
    /**
     * @internal
     */
    static async _create(product, connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback, sessionId) {
        const browser = new Browser(product, connection, contextIds, ignoreHTTPSErrors, defaultViewport, process, closeCallback, targetFilterCallback, isPageTargetCallback, sessionId);
        await browser._attach();
        return browser;
    }
    /**
     * @internal
     */
    get _targets() {
        return __classPrivateFieldGet$1(this, _Browser_targetManager, "f").getAvailableTargets();
    }
    /**
     * @internal
     */
    async _attach() {
        __classPrivateFieldGet$1(this, _Browser_connection, "f").on(ConnectionEmittedEvents.Disconnected, __classPrivateFieldGet$1(this, _Browser_emitDisconnected, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").on("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, __classPrivateFieldGet$1(this, _Browser_onAttachedToTarget, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").on("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$1(this, _Browser_onDetachedFromTarget, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").on("targetChanged" /* TargetManagerEmittedEvents.TargetChanged */, __classPrivateFieldGet$1(this, _Browser_onTargetChanged, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").on("targetDiscovered" /* TargetManagerEmittedEvents.TargetDiscovered */, __classPrivateFieldGet$1(this, _Browser_onTargetDiscovered, "f"));
        await __classPrivateFieldGet$1(this, _Browser_targetManager, "f").initialize();
    }
    /**
     * @internal
     */
    _detach() {
        __classPrivateFieldGet$1(this, _Browser_connection, "f").off(ConnectionEmittedEvents.Disconnected, __classPrivateFieldGet$1(this, _Browser_emitDisconnected, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").off("targetAvailable" /* TargetManagerEmittedEvents.TargetAvailable */, __classPrivateFieldGet$1(this, _Browser_onAttachedToTarget, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").off("targetGone" /* TargetManagerEmittedEvents.TargetGone */, __classPrivateFieldGet$1(this, _Browser_onDetachedFromTarget, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").off("targetChanged" /* TargetManagerEmittedEvents.TargetChanged */, __classPrivateFieldGet$1(this, _Browser_onTargetChanged, "f"));
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").off("targetDiscovered" /* TargetManagerEmittedEvents.TargetDiscovered */, __classPrivateFieldGet$1(this, _Browser_onTargetDiscovered, "f"));
    }
    /**
     * The spawned browser process. Returns `null` if the browser instance was created with
     * {@link Puppeteer.connect}.
     */
    process() {
        var _a;
        return (_a = __classPrivateFieldGet$1(this, _Browser_process, "f")) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * @internal
     */
    _targetManager() {
        return __classPrivateFieldGet$1(this, _Browser_targetManager, "f");
    }
    /**
     * @internal
     */
    _getIsPageTargetCallback() {
        return __classPrivateFieldGet$1(this, _Browser_isPageTargetCallback, "f");
    }
    /**
     * Creates a new incognito browser context. This won't share cookies/cache with other
     * browser contexts.
     *
     * @example
     *
     * ```ts
     * (async () => {
     *   const browser = await puppeteer.launch();
     *   // Create a new incognito browser context.
     *   const context = await browser.createIncognitoBrowserContext();
     *   // Create a new page in a pristine context.
     *   const page = await context.newPage();
     *   // Do stuff
     *   await page.goto('https://example.com');
     * })();
     * ```
     */
    async createIncognitoBrowserContext(options = {}) {
        const { proxyServer, proxyBypassList } = options;
        const { browserContextId } = await __classPrivateFieldGet$1(this, _Browser_connection, "f").send('Target.createBrowserContext', {
            proxyServer,
            proxyBypassList: proxyBypassList && proxyBypassList.join(','),
        });
        const context = new BrowserContext(__classPrivateFieldGet$1(this, _Browser_connection, "f"), this, browserContextId);
        __classPrivateFieldGet$1(this, _Browser_contexts, "f").set(browserContextId, context);
        return context;
    }
    /**
     * Returns an array of all open browser contexts. In a newly created browser, this will
     * return a single instance of {@link BrowserContext}.
     */
    browserContexts() {
        return [__classPrivateFieldGet$1(this, _Browser_defaultContext, "f"), ...Array.from(__classPrivateFieldGet$1(this, _Browser_contexts, "f").values())];
    }
    /**
     * Returns the default browser context. The default browser context cannot be closed.
     */
    defaultBrowserContext() {
        return __classPrivateFieldGet$1(this, _Browser_defaultContext, "f");
    }
    /**
     * @internal
     */
    async _disposeContext(contextId) {
        if (!contextId) {
            return;
        }
        await __classPrivateFieldGet$1(this, _Browser_connection, "f").send('Target.disposeBrowserContext', {
            browserContextId: contextId,
        });
        __classPrivateFieldGet$1(this, _Browser_contexts, "f").delete(contextId);
    }
    /**
     * The browser websocket endpoint which can be used as an argument to
     * {@link Puppeteer.connect}.
     *
     * @returns The Browser websocket url.
     *
     * @remarks
     *
     * The format is `ws://${host}:${port}/devtools/browser/<id>`.
     *
     * You can find the `webSocketDebuggerUrl` from `http://${host}:${port}/json/version`.
     * Learn more about the
     * {@link https://chromedevtools.github.io/devtools-protocol | devtools protocol} and
     * the {@link
     * https://chromedevtools.github.io/devtools-protocol/#how-do-i-access-the-browser-target
     * | browser endpoint}.
     */
    wsEndpoint() {
        return __classPrivateFieldGet$1(this, _Browser_connection, "f").url();
    }
    /**
     * Promise which resolves to a new {@link Page} object. The Page is created in
     * a default browser context.
     */
    async newPage() {
        return __classPrivateFieldGet$1(this, _Browser_defaultContext, "f").newPage();
    }
    /**
     * @internal
     */
    async _createPageInContext(contextId) {
        const { targetId } = await __classPrivateFieldGet$1(this, _Browser_connection, "f").send('Target.createTarget', {
            url: 'about:blank',
            browserContextId: contextId || undefined,
        });
        const target = __classPrivateFieldGet$1(this, _Browser_targetManager, "f").getAvailableTargets().get(targetId);
        if (!target) {
            throw new Error(`Missing target for page (id = ${targetId})`);
        }
        const initialized = await target._initializedPromise;
        if (!initialized) {
            throw new Error(`Failed to create target for page (id = ${targetId})`);
        }
        const page = await target.page();
        if (!page) {
            throw new Error(`Failed to create a page for context (id = ${contextId})`);
        }
        return page;
    }
    /**
     * All active targets inside the Browser. In case of multiple browser contexts, returns
     * an array with all the targets in all browser contexts.
     */
    targets() {
        return Array.from(__classPrivateFieldGet$1(this, _Browser_targetManager, "f").getAvailableTargets().values()).filter(target => {
            return target._isInitialized;
        });
    }
    /**
     * The target associated with the browser.
     */
    target() {
        const browserTarget = this.targets().find(target => {
            return target.type() === 'browser';
        });
        if (!browserTarget) {
            throw new Error('Browser target is not found');
        }
        return browserTarget;
    }
    /**
     * Searches for a target in all browser contexts.
     *
     * @param predicate - A function to be run for every target.
     * @returns The first target found that matches the `predicate` function.
     *
     * @example
     *
     * An example of finding a target for a page opened via `window.open`:
     *
     * ```ts
     * await page.evaluate(() => window.open('https://www.example.com/'));
     * const newWindowTarget = await browser.waitForTarget(
     *   target => target.url() === 'https://www.example.com/'
     * );
     * ```
     */
    async waitForTarget(predicate, options = {}) {
        const { timeout = 30000 } = options;
        let resolve;
        let isResolved = false;
        const targetPromise = new Promise(x => {
            return (resolve = x);
        });
        this.on("targetcreated" /* BrowserEmittedEvents.TargetCreated */, check);
        this.on("targetchanged" /* BrowserEmittedEvents.TargetChanged */, check);
        try {
            this.targets().forEach(check);
            if (!timeout) {
                return await targetPromise;
            }
            return await waitWithTimeout(targetPromise, 'target', timeout);
        }
        finally {
            this.off("targetcreated" /* BrowserEmittedEvents.TargetCreated */, check);
            this.off("targetchanged" /* BrowserEmittedEvents.TargetChanged */, check);
        }
        async function check(target) {
            if ((await predicate(target)) && !isResolved) {
                isResolved = true;
                resolve(target);
            }
        }
    }
    /**
     * An array of all open pages inside the Browser.
     *
     * @remarks
     *
     * In case of multiple browser contexts, returns an array with all the pages in all
     * browser contexts. Non-visible pages, such as `"background_page"`, will not be listed
     * here. You can find them using {@link Target.page}.
     */
    async pages() {
        const contextPages = await Promise.all(this.browserContexts().map(context => {
            return context.pages();
        }));
        // Flatten array.
        return contextPages.reduce((acc, x) => {
            return acc.concat(x);
        }, []);
    }
    /**
     * A string representing the browser name and version.
     *
     * @remarks
     *
     * For headless Chromium, this is similar to `HeadlessChrome/61.0.3153.0`. For
     * non-headless, this is similar to `Chrome/61.0.3153.0`.
     *
     * The format of browser.version() might change with future releases of Chromium.
     */
    async version() {
        const version = await __classPrivateFieldGet$1(this, _Browser_instances, "m", _Browser_getVersion).call(this);
        return version.product;
    }
    /**
     * The browser's original user agent. Pages can override the browser user agent with
     * {@link Page.setUserAgent}.
     */
    async userAgent() {
        const version = await __classPrivateFieldGet$1(this, _Browser_instances, "m", _Browser_getVersion).call(this);
        return version.userAgent;
    }
    /**
     * Closes Chromium and all of its pages (if any were opened). The {@link Browser} object
     * itself is considered to be disposed and cannot be used anymore.
     */
    async close() {
        await __classPrivateFieldGet$1(this, _Browser_closeCallback, "f").call(null);
        this.disconnect();
    }
    /**
     * Disconnects Puppeteer from the browser, but leaves the Chromium process running.
     * After calling `disconnect`, the {@link Browser} object is considered disposed and
     * cannot be used anymore.
     */
    disconnect() {
        __classPrivateFieldGet$1(this, _Browser_targetManager, "f").dispose();
        __classPrivateFieldGet$1(this, _Browser_connection, "f").dispose();
    }
    /**
     * Indicates that the browser is connected.
     */
    isConnected() {
        return !__classPrivateFieldGet$1(this, _Browser_connection, "f")._closed;
    }
    /**
     * Get the BISO session ID associated with this browser
     */
    sessionId() {
        return __classPrivateFieldGet$1(this, _Browser_sessionId, "f");
    }
}
_Browser_ignoreHTTPSErrors = new WeakMap(), _Browser_defaultViewport = new WeakMap(), _Browser_process = new WeakMap(), _Browser_connection = new WeakMap(), _Browser_closeCallback = new WeakMap(), _Browser_targetFilterCallback = new WeakMap(), _Browser_isPageTargetCallback = new WeakMap(), _Browser_defaultContext = new WeakMap(), _Browser_contexts = new WeakMap(), _Browser_screenshotTaskQueue = new WeakMap(), _Browser_targetManager = new WeakMap(), _Browser_sessionId = new WeakMap(), _Browser_emitDisconnected = new WeakMap(), _Browser_createTarget = new WeakMap(), _Browser_onAttachedToTarget = new WeakMap(), _Browser_onDetachedFromTarget = new WeakMap(), _Browser_onTargetChanged = new WeakMap(), _Browser_onTargetDiscovered = new WeakMap(), _Browser_instances = new WeakSet(), _Browser_setIsPageTargetCallback = function _Browser_setIsPageTargetCallback(isPageTargetCallback) {
    __classPrivateFieldSet$1(this, _Browser_isPageTargetCallback, isPageTargetCallback ||
        ((target) => {
            return (target.type === 'page' ||
                target.type === 'background_page' ||
                target.type === 'webview');
        }), "f");
}, _Browser_getVersion = function _Browser_getVersion() {
    return __classPrivateFieldGet$1(this, _Browser_connection, "f").send('Browser.getVersion');
};
/**
 * BrowserContexts provide a way to operate multiple independent browser
 * sessions. When a browser is launched, it has a single BrowserContext used by
 * default. The method {@link Browser.newPage | Browser.newPage} creates a page
 * in the default browser context.
 *
 * @remarks
 *
 * The Browser class extends from Puppeteer's {@link EventEmitter} class and
 * will emit various events which are documented in the
 * {@link BrowserContextEmittedEvents} enum.
 *
 * If a page opens another page, e.g. with a `window.open` call, the popup will
 * belong to the parent page's browser context.
 *
 * Puppeteer allows creation of "incognito" browser contexts with
 * {@link Browser.createIncognitoBrowserContext | Browser.createIncognitoBrowserContext}
 * method. "Incognito" browser contexts don't write any browsing data to disk.
 *
 * @example
 *
 * ```ts
 * // Create a new incognito browser context
 * const context = await browser.createIncognitoBrowserContext();
 * // Create a new page inside context.
 * const page = await context.newPage();
 * // ... do stuff with page ...
 * await page.goto('https://example.com');
 * // Dispose context once it's no longer needed.
 * await context.close();
 * ```
 *
 * @public
 */
class BrowserContext extends EventEmitter {
    /**
     * @internal
     */
    constructor(connection, browser, contextId) {
        super();
        _BrowserContext_connection.set(this, void 0);
        _BrowserContext_browser.set(this, void 0);
        _BrowserContext_id.set(this, void 0);
        __classPrivateFieldSet$1(this, _BrowserContext_connection, connection, "f");
        __classPrivateFieldSet$1(this, _BrowserContext_browser, browser, "f");
        __classPrivateFieldSet$1(this, _BrowserContext_id, contextId, "f");
    }
    /**
     * An array of all active targets inside the browser context.
     */
    targets() {
        return __classPrivateFieldGet$1(this, _BrowserContext_browser, "f").targets().filter(target => {
            return target.browserContext() === this;
        });
    }
    /**
     * This searches for a target in this specific browser context.
     *
     * @example
     * An example of finding a target for a page opened via `window.open`:
     *
     * ```ts
     * await page.evaluate(() => window.open('https://www.example.com/'));
     * const newWindowTarget = await browserContext.waitForTarget(
     *   target => target.url() === 'https://www.example.com/'
     * );
     * ```
     *
     * @param predicate - A function to be run for every target
     * @param options - An object of options. Accepts a timout,
     * which is the maximum wait time in milliseconds.
     * Pass `0` to disable the timeout. Defaults to 30 seconds.
     * @returns Promise which resolves to the first target found
     * that matches the `predicate` function.
     */
    waitForTarget(predicate, options = {}) {
        return __classPrivateFieldGet$1(this, _BrowserContext_browser, "f").waitForTarget(target => {
            return target.browserContext() === this && predicate(target);
        }, options);
    }
    /**
     * An array of all pages inside the browser context.
     *
     * @returns Promise which resolves to an array of all open pages.
     * Non visible pages, such as `"background_page"`, will not be listed here.
     * You can find them using {@link Target.page | the target page}.
     */
    async pages() {
        const pages = await Promise.all(this.targets()
            .filter(target => {
            var _a;
            return (target.type() === 'page' ||
                (target.type() === 'other' &&
                    ((_a = __classPrivateFieldGet$1(this, _BrowserContext_browser, "f")._getIsPageTargetCallback()) === null || _a === void 0 ? void 0 : _a(target._getTargetInfo()))));
        })
            .map(target => {
            return target.page();
        }));
        return pages.filter((page) => {
            return !!page;
        });
    }
    /**
     * Returns whether BrowserContext is incognito.
     * The default browser context is the only non-incognito browser context.
     *
     * @remarks
     * The default browser context cannot be closed.
     */
    isIncognito() {
        return !!__classPrivateFieldGet$1(this, _BrowserContext_id, "f");
    }
    /**
     * @example
     *
     * ```ts
     * const context = browser.defaultBrowserContext();
     * await context.overridePermissions('https://html5demos.com', [
     *   'geolocation',
     * ]);
     * ```
     *
     * @param origin - The origin to grant permissions to, e.g. "https://example.com".
     * @param permissions - An array of permissions to grant.
     * All permissions that are not listed here will be automatically denied.
     */
    async overridePermissions(origin, permissions) {
        const protocolPermissions = permissions.map(permission => {
            const protocolPermission = WEB_PERMISSION_TO_PROTOCOL_PERMISSION.get(permission);
            if (!protocolPermission) {
                throw new Error('Unknown permission: ' + permission);
            }
            return protocolPermission;
        });
        await __classPrivateFieldGet$1(this, _BrowserContext_connection, "f").send('Browser.grantPermissions', {
            origin,
            browserContextId: __classPrivateFieldGet$1(this, _BrowserContext_id, "f") || undefined,
            permissions: protocolPermissions,
        });
    }
    /**
     * Clears all permission overrides for the browser context.
     *
     * @example
     *
     * ```ts
     * const context = browser.defaultBrowserContext();
     * context.overridePermissions('https://example.com', ['clipboard-read']);
     * // do stuff ..
     * context.clearPermissionOverrides();
     * ```
     */
    async clearPermissionOverrides() {
        await __classPrivateFieldGet$1(this, _BrowserContext_connection, "f").send('Browser.resetPermissions', {
            browserContextId: __classPrivateFieldGet$1(this, _BrowserContext_id, "f") || undefined,
        });
    }
    /**
     * Creates a new page in the browser context.
     */
    newPage() {
        return __classPrivateFieldGet$1(this, _BrowserContext_browser, "f")._createPageInContext(__classPrivateFieldGet$1(this, _BrowserContext_id, "f"));
    }
    /**
     * The browser this browser context belongs to.
     */
    browser() {
        return __classPrivateFieldGet$1(this, _BrowserContext_browser, "f");
    }
    /**
     * Closes the browser context. All the targets that belong to the browser context
     * will be closed.
     *
     * @remarks
     * Only incognito browser contexts can be closed.
     */
    async close() {
        assert(__classPrivateFieldGet$1(this, _BrowserContext_id, "f"), 'Non-incognito profiles cannot be closed!');
        await __classPrivateFieldGet$1(this, _BrowserContext_browser, "f")._disposeContext(__classPrivateFieldGet$1(this, _BrowserContext_id, "f"));
    }
}
_BrowserContext_connection = new WeakMap(), _BrowserContext_browser = new WeakMap(), _BrowserContext_id = new WeakMap();

var __classPrivateFieldSet = (undefined && undefined.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (undefined && undefined.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BrowserWebSocketTransport_ws;
/**
 * @internal
 */
class BrowserWebSocketTransport {
    constructor(ws) {
        _BrowserWebSocketTransport_ws.set(this, void 0);
        __classPrivateFieldSet(this, _BrowserWebSocketTransport_ws, ws, "f");
        __classPrivateFieldGet(this, _BrowserWebSocketTransport_ws, "f").addEventListener('message', event => {
            if (this.onmessage) {
                this.onmessage.call(null, event.data);
            }
        });
        __classPrivateFieldGet(this, _BrowserWebSocketTransport_ws, "f").addEventListener('close', () => {
            if (this.onclose) {
                this.onclose.call(null);
            }
        });
        // Silently ignore all errors - we don't know what to do with them.
        __classPrivateFieldGet(this, _BrowserWebSocketTransport_ws, "f").addEventListener('error', () => { });
    }
    static create(url) {
        return new Promise((resolve, reject) => {
            const ws = new WebSocket(url);
            ws.addEventListener('open', () => {
                return resolve(new BrowserWebSocketTransport(ws));
            });
            ws.addEventListener('error', reject);
        });
    }
    send(message) {
        __classPrivateFieldGet(this, _BrowserWebSocketTransport_ws, "f").send(message);
    }
    close() {
        __classPrivateFieldGet(this, _BrowserWebSocketTransport_ws, "f").close();
    }
}
_BrowserWebSocketTransport_ws = new WeakMap();

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * Gets the global version if we're in the browser, else loads the node-fetch module.
 *
 * @internal
 */
const getFetch = async () => {
    return globalThis.fetch;
};

/**
 * Copyright 2020 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const getWebSocketTransportClass = async () => {
    return BrowserWebSocketTransport;
};
/**
 * Users should never call this directly; it's called when calling
 * `puppeteer.connect`.
 *
 * @internal
 */
async function _connectToBrowser(options) {
    const { browserWSEndpoint, browserURL, ignoreHTTPSErrors = false, defaultViewport = { width: 800, height: 600 }, transport, slowMo = 0, targetFilter, _isPageTarget: isPageTarget, sessionId = 'unknown', } = options;
    assert(Number(!!browserWSEndpoint) + Number(!!browserURL) + Number(!!transport) ===
        1, 'Exactly one of browserWSEndpoint, browserURL or transport must be passed to puppeteer.connect');
    let connection;
    if (transport) {
        connection = new Connection('', transport, slowMo);
    }
    else if (browserWSEndpoint) {
        const WebSocketClass = await getWebSocketTransportClass();
        const connectionTransport = await WebSocketClass.create(browserWSEndpoint);
        connection = new Connection(browserWSEndpoint, connectionTransport, slowMo);
    }
    else if (browserURL) {
        const connectionURL = await getWSEndpoint(browserURL);
        const WebSocketClass = await getWebSocketTransportClass();
        const connectionTransport = await WebSocketClass.create(connectionURL);
        connection = new Connection(connectionURL, connectionTransport, slowMo);
    }
    const version = await connection.send('Browser.getVersion');
    const product = version.product.toLowerCase().includes('firefox')
        ? 'firefox'
        : 'chrome';
    const { browserContextIds } = await connection.send('Target.getBrowserContexts');
    const browser = await Browser._create(product || 'chrome', connection, browserContextIds, ignoreHTTPSErrors, defaultViewport, undefined, () => {
        return connection.send('Browser.close').catch(debugError);
    }, targetFilter, isPageTarget, sessionId);
    await browser.pages();
    return browser;
}
async function getWSEndpoint(browserURL) {
    const endpointURL = new URL('/json/version', browserURL);
    const fetch = await getFetch();
    try {
        const result = await fetch(endpointURL.toString(), {
            method: 'GET',
        });
        if (!result.ok) {
            throw new Error(`HTTP ${result.statusText}`);
        }
        const data = await result.json();
        return data.webSocketDebuggerUrl;
    }
    catch (error) {
        if (isErrorLike(error)) {
            error.message =
                `Failed to fetch browser webSocket URL from ${endpointURL}: ` +
                    error.message;
        }
        throw error;
    }
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const deviceArray = [
    {
        name: 'Blackberry PlayBook',
        userAgent: 'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML like Gecko) Version/7.2.1.0 Safari/536.2+',
        viewport: {
            width: 600,
            height: 1024,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Blackberry PlayBook landscape',
        userAgent: 'Mozilla/5.0 (PlayBook; U; RIM Tablet OS 2.1.0; en-US) AppleWebKit/536.2+ (KHTML like Gecko) Version/7.2.1.0 Safari/536.2+',
        viewport: {
            width: 1024,
            height: 600,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'BlackBerry Z30',
        userAgent: 'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'BlackBerry Z30 landscape',
        userAgent: 'Mozilla/5.0 (BB10; Touch) AppleWebKit/537.10+ (KHTML, like Gecko) Version/10.0.9.2372 Mobile Safari/537.10+',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy Note 3',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy Note 3 landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.3; en-us; SM-N900T Build/JSS15J) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy Note II',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.1; en-us; GT-N7100 Build/JRO03C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy Note II landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.1; en-us; GT-N7100 Build/JRO03C) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S III',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S III landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.0; en-us; GT-I9300 Build/IMM76D) AppleWebKit/534.30 (KHTML, like Gecko) Version/4.0 Mobile Safari/534.30',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S5',
        userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S5 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 5.0; SM-G900P Build/LRX21T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S8',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G950U Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 740,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S8 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; SM-G950U Build/NRD90M) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.84 Mobile Safari/537.36',
        viewport: {
            width: 740,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy S9+',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36',
        viewport: {
            width: 320,
            height: 658,
            deviceScaleFactor: 4.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy S9+ landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; SM-G965U Build/R16NW) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.111 Mobile Safari/537.36',
        viewport: {
            width: 658,
            height: 320,
            deviceScaleFactor: 4.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Galaxy Tab S4',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.80 Safari/537.36',
        viewport: {
            width: 712,
            height: 1138,
            deviceScaleFactor: 2.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Galaxy Tab S4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.1.0; SM-T837A) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/70.0.3538.80 Safari/537.36',
        viewport: {
            width: 1138,
            height: 712,
            deviceScaleFactor: 2.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 768,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1024,
            height: 768,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad (gen 6)',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 768,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad (gen 6) landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 1024,
            height: 768,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad (gen 7)',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 810,
            height: 1080,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad (gen 7) landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 1080,
            height: 810,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad Mini',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 768,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad Mini landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1024,
            height: 768,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad Pro',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1024,
            height: 1366,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad Pro landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 11_0 like Mac OS X) AppleWebKit/604.1.34 (KHTML, like Gecko) Version/11.0 Mobile/15A5341f Safari/604.1',
        viewport: {
            width: 1366,
            height: 1024,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPad Pro 11',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 834,
            height: 1194,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPad Pro 11 landscape',
        userAgent: 'Mozilla/5.0 (iPad; CPU OS 12_2 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 1194,
            height: 834,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 4',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53',
        viewport: {
            width: 320,
            height: 480,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 4 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 7_1_2 like Mac OS X) AppleWebKit/537.51.2 (KHTML, like Gecko) Version/7.0 Mobile/11D257 Safari/9537.53',
        viewport: {
            width: 480,
            height: 320,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 5',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 320,
            height: 568,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 5 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 568,
            height: 320,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 6',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 6 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 667,
            height: 375,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 6 Plus',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 414,
            height: 736,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 6 Plus landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 736,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 7',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 7 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 667,
            height: 375,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 7 Plus',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 414,
            height: 736,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 7 Plus landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 736,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 8',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 667,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 8 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 667,
            height: 375,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 8 Plus',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 414,
            height: 736,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 8 Plus landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 736,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone SE',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 320,
            height: 568,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone SE landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 10_3_1 like Mac OS X) AppleWebKit/603.1.30 (KHTML, like Gecko) Version/10.0 Mobile/14E304 Safari/602.1',
        viewport: {
            width: 568,
            height: 320,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone X',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone X landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 11_0 like Mac OS X) AppleWebKit/604.1.38 (KHTML, like Gecko) Version/11.0 Mobile/15A372 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone XR',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 414,
            height: 896,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone XR landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 12_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/12.0 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 896,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 11',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 414,
            height: 828,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 11 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 828,
            height: 414,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 11 Pro',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 11 Pro landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 11 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 414,
            height: 896,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 11 Pro Max landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 13_7 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/13.1 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 896,
            height: 414,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12 Pro',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 Pro landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 428,
            height: 926,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 Pro Max landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 926,
            height: 428,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 12 Mini',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 12 Mini landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13 Pro',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 390,
            height: 844,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 Pro landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 844,
            height: 390,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13 Pro Max',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 428,
            height: 926,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 Pro Max landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 926,
            height: 428,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'iPhone 13 Mini',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 375,
            height: 812,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'iPhone 13 Mini landscape',
        userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/15.4 Mobile/15E148 Safari/604.1',
        viewport: {
            width: 812,
            height: 375,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'JioPhone 2',
        userAgent: 'Mozilla/5.0 (Mobile; LYF/F300B/LYF-F300B-001-01-15-130718-i;Android; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5',
        viewport: {
            width: 240,
            height: 320,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'JioPhone 2 landscape',
        userAgent: 'Mozilla/5.0 (Mobile; LYF/F300B/LYF-F300B-001-01-15-130718-i;Android; rv:48.0) Gecko/48.0 Firefox/48.0 KAIOS/2.5',
        viewport: {
            width: 320,
            height: 240,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Kindle Fire HDX',
        userAgent: 'Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true',
        viewport: {
            width: 800,
            height: 1280,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Kindle Fire HDX landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; en-us; KFAPWI Build/JDQ39) AppleWebKit/535.19 (KHTML, like Gecko) Silk/3.13 Safari/535.19 Silk-Accelerated=true',
        viewport: {
            width: 1280,
            height: 800,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'LG Optimus L70',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; LGMS323 Build/KOT49I.MS32310c) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 384,
            height: 640,
            deviceScaleFactor: 1.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'LG Optimus L70 landscape',
        userAgent: 'Mozilla/5.0 (Linux; U; Android 4.4.2; en-us; LGMS323 Build/KOT49I.MS32310c) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 384,
            deviceScaleFactor: 1.25,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Microsoft Lumia 550',
        userAgent: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 550) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Microsoft Lumia 950',
        userAgent: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 4,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Microsoft Lumia 950 landscape',
        userAgent: 'Mozilla/5.0 (Windows Phone 10.0; Android 4.2.1; Microsoft; Lumia 950) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/46.0.2486.0 Mobile Safari/537.36 Edge/14.14263',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 4,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 10',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 800,
            height: 1280,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 10 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 10 Build/MOB31T) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 1280,
            height: 800,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 4',
        userAgent: 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 384,
            height: 640,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 4.4.2; Nexus 4 Build/KOT49H) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 384,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 5',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 5 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0; Nexus 5 Build/MRA58N) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 5X',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 412,
            height: 732,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 5X landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 5X Build/OPR4.170623.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 732,
            height: 412,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 6',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 6 Build/N6F26U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 412,
            height: 732,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 6 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.1.1; Nexus 6 Build/N6F26U) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 732,
            height: 412,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 6P',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 412,
            height: 732,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 6P landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Nexus 6P Build/OPP3.170518.006) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 732,
            height: 412,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nexus 7',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 600,
            height: 960,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nexus 7 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 6.0.1; Nexus 7 Build/MOB30X) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Safari/537.36',
        viewport: {
            width: 960,
            height: 600,
            deviceScaleFactor: 2,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nokia Lumia 520',
        userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)',
        viewport: {
            width: 320,
            height: 533,
            deviceScaleFactor: 1.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nokia Lumia 520 landscape',
        userAgent: 'Mozilla/5.0 (compatible; MSIE 10.0; Windows Phone 8.0; Trident/6.0; IEMobile/10.0; ARM; Touch; NOKIA; Lumia 520)',
        viewport: {
            width: 533,
            height: 320,
            deviceScaleFactor: 1.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Nokia N9',
        userAgent: 'Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13',
        viewport: {
            width: 480,
            height: 854,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Nokia N9 landscape',
        userAgent: 'Mozilla/5.0 (MeeGo; NokiaN9) AppleWebKit/534.13 (KHTML, like Gecko) NokiaBrowser/8.5.0 Mobile Safari/534.13',
        viewport: {
            width: 854,
            height: 480,
            deviceScaleFactor: 1,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 2',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 411,
            height: 731,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 2 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0; Pixel 2 Build/OPD3.170816.012) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 731,
            height: 411,
            deviceScaleFactor: 2.625,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 2 XL',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 411,
            height: 823,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 2 XL landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 8.0.0; Pixel 2 XL Build/OPD1.170816.004) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/75.0.3765.0 Mobile Safari/537.36',
        viewport: {
            width: 823,
            height: 411,
            deviceScaleFactor: 3.5,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 3',
        userAgent: 'Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.181105.017.A1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36',
        viewport: {
            width: 393,
            height: 786,
            deviceScaleFactor: 2.75,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 3 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 9; Pixel 3 Build/PQ1A.181105.017.A1) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/66.0.3359.158 Mobile Safari/537.36',
        viewport: {
            width: 786,
            height: 393,
            deviceScaleFactor: 2.75,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 4',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36',
        viewport: {
            width: 353,
            height: 745,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 10; Pixel 4) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Mobile Safari/537.36',
        viewport: {
            width: 745,
            height: 353,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 4a (5G)',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 4a (5G)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 353,
            height: 745,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 4a (5G) landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 4a (5G)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 745,
            height: 353,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Pixel 5',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 393,
            height: 851,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Pixel 5 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 11; Pixel 5) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 851,
            height: 393,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
    {
        name: 'Moto G4',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 360,
            height: 640,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: false,
        },
    },
    {
        name: 'Moto G4 landscape',
        userAgent: 'Mozilla/5.0 (Linux; Android 7.0; Moto G (4)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/99.0.4812.0 Mobile Safari/537.36',
        viewport: {
            width: 640,
            height: 360,
            deviceScaleFactor: 3,
            isMobile: true,
            hasTouch: true,
            isLandscape: true,
        },
    },
];
/**
 * A list of devices to be used with `page.emulate(options)`. Actual list of devices can be found in {@link https://github.com/puppeteer/puppeteer/blob/main/src/common/DeviceDescriptors.ts | src/common/DeviceDescriptors.ts}.
 *
 * @example
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 * const iPhone = puppeteer.devices['iPhone 6'];
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.emulate(iPhone);
 *   await page.goto('https://www.google.com');
 *   // other actions...
 *   await browser.close();
 * })();
 * ```
 *
 * @public
 */
const devices = {};
for (const device of deviceArray) {
    devices[device.name] = device;
}

/**
 * Copyright 2021 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * A list of network conditions to be used with
 * `page.emulateNetworkConditions(networkConditions)`. Actual list of predefined
 * conditions can be found in
 * {@link https://github.com/puppeteer/puppeteer/blob/main/src/common/NetworkConditions.ts | src/common/NetworkConditions.ts}.
 *
 * @example
 *
 * ```ts
 * const puppeteer = require('puppeteer');
 * const slow3G = puppeteer.networkConditions['Slow 3G'];
 *
 * (async () => {
 *   const browser = await puppeteer.launch();
 *   const page = await browser.newPage();
 *   await page.emulateNetworkConditions(slow3G);
 *   await page.goto('https://www.google.com');
 *   // other actions...
 *   await browser.close();
 * })();
 * ```
 *
 * @public
 */
const networkConditions = Object.freeze({
    'Slow 3G': {
        download: ((500 * 1000) / 8) * 0.8,
        upload: ((500 * 1000) / 8) * 0.8,
        latency: 400 * 5,
    },
    'Fast 3G': {
        download: ((1.6 * 1000 * 1000) / 8) * 0.9,
        upload: ((750 * 1000) / 8) * 0.9,
        latency: 150 * 3.75,
    },
});

/**
 * The main Puppeteer class.
 *
 * IMPORTANT: if you are using Puppeteer in a Node environment, you will get an
 * instance of {@link PuppeteerNode} when you import or require `puppeteer`.
 * That class extends `Puppeteer`, so has all the methods documented below as
 * well as all that are defined on {@link PuppeteerNode}.
 * @public
 */
class Puppeteer {
    /**
     * @internal
     */
    constructor(settings) {
        this._changedProduct = false;
        this._isPuppeteerCore = settings.isPuppeteerCore;
        this.connect = this.connect.bind(this);
    }
    /**
     * This method attaches Puppeteer to an existing browser instance.
     *
     * @remarks
     *
     * @param options - Set of configurable options to set on the browser.
     * @returns Promise which resolves to browser instance.
     */
    connect(options) {
        return _connectToBrowser(options);
    }
    /**
     * @deprecated Import directly puppeteer.
     * @example
     *
     * ```ts
     * import {devices} from 'puppeteer';
     * ```
     */
    get devices() {
        return devices;
    }
    /**
     * @deprecated Import directly puppeteer.
     * @example
     *
     * ```ts
     * import {errors} from 'puppeteer';
     * ```
     */
    get errors() {
        return errors;
    }
    /**
     * @deprecated Import directly puppeteer.
     * @example
     *
     * ```ts
     * import {networkConditions} from 'puppeteer';
     * ```
     */
    get networkConditions() {
        return networkConditions;
    }
    /**
     * @deprecated Import directly puppeteer.
     * @example
     *
     * ```ts
     * import {registerCustomQueryHandler} from 'puppeteer';
     * ```
     */
    registerCustomQueryHandler(name, queryHandler) {
        return registerCustomQueryHandler(name, queryHandler);
    }
    /**
     * @deprecated Import directly puppeteer.
     * @example
     *
     * ```ts
     * import {unregisterCustomQueryHandler} from 'puppeteer';
     * ```
     */
    unregisterCustomQueryHandler(name) {
        return unregisterCustomQueryHandler(name);
    }
    /**
     * @deprecated Import directly puppeteer.
     * @example
     *
     * ```ts
     * import {customQueryHandlerNames} from 'puppeteer';
     * ```
     */
    customQueryHandlerNames() {
        return customQueryHandlerNames();
    }
    /**
     * @deprecated Import directly puppeteer.
     * @example
     *
     * ```ts
     * import {clearCustomQueryHandlers} from 'puppeteer';
     * ```
     */
    clearCustomQueryHandlers() {
        return clearCustomQueryHandlers();
    }
}

const HEADER_SIZE = 4; // Uint32
const MAX_MESSAGE_SIZE = 1048575; // Workers size is < 1MB
const FIRST_CHUNK_DATA_SIZE = MAX_MESSAGE_SIZE - HEADER_SIZE;
const messageToChunks = (data) => {
    const encoder = new TextEncoder();
    const encodedUint8Array = encoder.encode(data);
    // We only include the header into the first chunk
    const firstChunk = new Uint8Array(Math.min(MAX_MESSAGE_SIZE, HEADER_SIZE + encodedUint8Array.length));
    const view = new DataView(firstChunk.buffer);
    view.setUint32(0, encodedUint8Array.length, true);
    firstChunk.set(encodedUint8Array.slice(0, FIRST_CHUNK_DATA_SIZE), HEADER_SIZE);
    const chunks = [firstChunk];
    for (let i = FIRST_CHUNK_DATA_SIZE; i < data.length; i += MAX_MESSAGE_SIZE) {
        chunks.push(encodedUint8Array.slice(i, i + MAX_MESSAGE_SIZE));
    }
    return chunks;
};
const chunksToMessage = (chunks, sessionid) => {
    if (chunks.length === 0) {
        return null;
    }
    const emptyBuffer = new Uint8Array(0);
    const firstChunk = chunks[0] || emptyBuffer;
    const view = new DataView(firstChunk.buffer);
    const expectedBytes = view.getUint32(0, true);
    let totalBytes = -4;
    for (let i = 0; i < chunks.length; ++i) {
        const curChunk = chunks[i] || emptyBuffer;
        totalBytes += curChunk.length;
        if (totalBytes > expectedBytes) {
            throw new Error(`Should have gotten the exact number of bytes but we got more.  SessionID: ${sessionid}`);
        }
        if (totalBytes === expectedBytes) {
            const chunksToCombine = chunks.splice(0, i + 1);
            chunksToCombine[0] = firstChunk.subarray(HEADER_SIZE);
            const combined = new Uint8Array(expectedBytes);
            let offset = 0;
            for (let j = 0; j <= i; ++j) {
                const chunk = chunksToCombine[j] || emptyBuffer;
                combined.set(chunk, offset);
                offset += chunk.length;
            }
            const decoder = new TextDecoder();
            // return decoder.decode(combined)
            const message = decoder.decode(combined);
            return message;
        }
    }
    return null;
};

class WorkersWebSocketTransport {
    constructor(ws, sessionid) {
        this.chunks = [];
        this.pingInterval = setInterval(() => {
            return this.ws.send('ping');
        }, 1000); // TODO more investigation
        this.ws = ws;
        this.ws.addEventListener('message', event => {
            this.chunks.push(new Uint8Array(event.data));
            const message = chunksToMessage(this.chunks, sessionid);
            if (message && this.onmessage) {
                this.onmessage(message);
            }
        });
        this.ws.addEventListener('close', () => {
            console.log('websocket closed'); // TODO remove
            clearInterval(this.pingInterval);
            if (this.onclose) {
                this.onclose();
            }
        });
        this.ws.addEventListener('error', e => {
            console.error(`Websocket error: SessionID: ${sessionid}`, e);
            clearInterval(this.pingInterval);
        });
    }
    static async create(endpoint, sessionid) {
        const path = `/v1/connectDevtools?browser_session=${sessionid}`;
        const response = await endpoint.fetch(path, {
            headers: { Upgrade: 'websocket' },
        });
        response.webSocket.accept();
        return new WorkersWebSocketTransport(response.webSocket, sessionid);
    }
    send(message) {
        for (const chunk of messageToChunks(message)) {
            this.ws.send(chunk);
        }
    }
    close() {
        console.log('closing websocket'); // TODO remove
        clearInterval(this.pingInterval);
        this.ws.close();
    }
}

/**
 * Copyright 2017 Google Inc. All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
class PuppeteerWorkers extends Puppeteer {
    constructor() {
        super({ isPuppeteerCore: true });
        this.connect = this.connect.bind(this);
        this.launch = this.launch.bind(this);
    }
    async launch(endpoint) {
        const res = await endpoint.fetch('/v1/acquire');
        const status = res.status;
        const text = await res.text();
        if (status !== 200) {
            throw new Error(`Unabled to create new browser: code: ${status}: message: ${text}`);
        }
        // Got a 200, so response text is actually an AcquireResponse
        const response = JSON.parse(text);
        const transport = await WorkersWebSocketTransport.create(endpoint, response.sessionId);
        return this.connect({ transport, sessionId: response.sessionId });
    }
}
const puppeteer = new PuppeteerWorkers();
const { connect, launch } = puppeteer;

const FINGERPRINTS = {
  "facebook-pixel": {
    "name": "facebook-pixel",
    "categories": [
      "pixel",
      "marketing"
    ],
    "detectors": {
      "requestUrlRegex": "connect\\.facebook\\.net/.*/fbevents\\.js",
      "globalVariables": [
        "fbq"
      ]
    }
  },
  "framer": {
    "name": "framer",
    "detectors": {
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Framer"
      },
      "selectorExists": [
        "[data-framer-name]",
        "[data-framer-component-type]",
        "div[data-framer-page-wrapper]"
      ],
      "requestUrlRegex": [
        "events\\.framer\\.com/script"
      ]
    }
  },
  "google-analytics": {
    "name": "google-analytics",
    "categories": [
      "pixel",
      "analytics"
    ],
    "detectors": {
      "globalVariables": [
        "gtag",
        "ga",
        "GoogleAnalyticsObject",
        "__gaTracker"
      ],
      "requestUrlRegex": [
        "google-analytics\\.com/analytics\\.js",
        "googletagmanager\\.com/gtag/js",
        "google-analytics\\.com/collect",
        "analytics\\.google\\.com"
      ]
    }
  },
  "google-tag-manager": {
    "name": "google-tag-manager",
    "detectors": {
      "globalVariables": [
        "dataLayer",
        "google_tag_manager"
      ],
      "requestUrlRegex": [
        "googletagmanager\\.com/gtm\\.js",
        "googletagmanager\\.com/ns\\.html"
      ]
    }
  },
  "gtag": {
    "name": "gtag",
    "detectors": {
      "globalVariables": [
        "gtag"
      ],
      "requestUrlRegex": [
        "googletagmanager\\.com/gtag/js",
        "google-analytics\\.com/g/collect"
      ]
    }
  },
  "hotjar": {
    "name": "hotjar",
    "detectors": {
      "globalVariables": [
        "hj",
        "hjSiteSettings",
        "_hjSettings"
      ],
      "requestUrlRegex": [
        "static\\.hotjar\\.com/c/hotjar-",
        "vars\\.hotjar\\.com",
        "script\\.hotjar\\.com",
        "in\\.hotjar\\.com/api/v2/client/sites"
      ]
    }
  },
  "klaviyo": {
    "name": "klaviyo",
    "detectors": {
      "globalVariables": [
        "_learnq",
        "Klaviyo"
      ],
      "requestUrlRegex": [
        "a\\.klaviyo\\.com/media/js/analytics/analytics\\.js",
        "static\\.klaviyo\\.com/onsite/js/klaviyo\\.js",
        "static\\.klaviyo\\.com/onsite/js/klaviyo\\.min\\.js",
        "a\\.klaviyo\\.com/api/identify",
        "a\\.klaviyo\\.com/api/track"
      ]
    }
  },
  "next": {
    "name": "next",
    "detectors": {
      "globalVariables": [
        "next"
      ],
      "htmlRegex": "(data-next-page|data-next-url|__NEXT_DATA__|__next)"
    }
  },
  "nuxt": {
    "name": "nuxt",
    "detectors": {
      "globalVariables": [
        "__NUXT__",
        "$nuxt"
      ],
      "selectorExists": [
        "#__nuxt",
        "#__layout",
        "[data-n-head]",
        "[data-n-]"
      ]
    }
  },
  "react": {
    "name": "react",
    "categories": [
      "framework",
      "frontend"
    ],
    "detectors": {
      "globalVariables": [
        "React",
        "__REACT_DEVTOOLS_GLOBAL_HOOK__"
      ],
      "selectorExists": [
        "div[data-reactroot]",
        "[data-reactid]",
        "noscript[data-reactroot]",
        "#react-root"
      ]
    }
  },
  "segment": {
    "name": "segment",
    "detectors": {
      "globalVariables": [
        "analytics",
        "analytics.initialize",
        "analytics.invoked"
      ],
      "selectorExists": [
        "script[src*='cdn.segment.com/analytics.js']",
        "script[src*='cdn.segment.com/analytics.min.js']"
      ]
    }
  },
  "shopify": {
    "name": "shopify",
    "categories": [
      "cms",
      "ecommerce"
    ],
    "detectors": {
      "metaTagCheck": {
        "name": "shopify-checkout-api-token",
        "contentRegex": ".*"
      },
      "globalVariables": [
        "Shopify",
        "ShopifyAnalytics"
      ]
    }
  },
  "squarespace": {
    "name": "squarespace",
    "detectors": {
      "globalVariables": [
        "Squarespace"
      ],
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Squarespace"
      }
    },
    "themeDetection": {
      "method": "global",
      "globalPath": "Static.SQUARESPACE_CONTEXT.templateName"
    }
  },
  "statamic": {
    "name": "statamic",
    "detectors": {
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Statamic"
      },
      "globalVariables": [
        "Statamic"
      ],
      "selectorExists": [
        "[data-statamic]",
        "[data-statamic-field]",
        "[data-statamic-handler]"
      ]
    },
    "themeDetection": {
      "cssLinkRegex": "/themes/([\\w-]+)/"
    }
  },
  "svelte": {
    "name": "svelte",
    "detectors": {
      "globalVariables": [
        "__sveltekit",
        "__SVELTEKIT_DEV__"
      ],
      "selectorExists": [
        "[data-sveltekit]",
        "[data-sveltekit-preload-data]",
        "[data-sveltekit-reload]"
      ]
    }
  },
  "vue": {
    "name": "vue",
    "detectors": {
      "globalVariables": [
        "Vue",
        "__VUE_DEVTOOLS_GLOBAL_HOOK__",
        "VueRouter"
      ],
      "selectorExists": [
        "[data-v-]",
        "#app[data-v-app]",
        "[data-server-rendered='true']"
      ]
    }
  },
  "webflow": {
    "name": "webflow",
    "detectors": {
      "globalVariables": [
        "Webflow"
      ],
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Webflow"
      },
      "selectorExists": [
        ".w-webflow-badge"
      ]
    },
    "themeDetection": {
      "cssLinkRegex": "css/([\\w-]+)\\.webflow\\.css"
    }
  },
  "wix": {
    "name": "wix",
    "detectors": {
      "globalVariables": [
        "wixBiSession",
        "wixSdk"
      ],
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "Wix\\.com"
      },
      "selectorExists": [
        "div[class*='wixui-']"
      ]
    }
  },
  "wordpress": {
    "name": "wordpress",
    "detectors": {
      "metaTagCheck": {
        "name": "generator",
        "contentRegex": "WordPress"
      },
      "selectorExists": [
        "script[src*='wp-includes']",
        "body.wp-",
        "#wpadminbar"
      ],
      "globalVariables": [
        "wp",
        "wpApiSettings",
        "wc"
      ],
      "themeDetection": {
        "stylesheetRegex": "wp-content\\/themes\\/([-\\w]+)",
        "bodyClassRegex": "theme-([-\\w]+)",
        "cssIdentifierRegex": "Theme Name:\\s*([^\\n]+)"
      }
    }
  }
};
async function findTech(options, env) {
  const { url, timeout = 3e4, categories, excludeCategories, onProgress } = options;
  onProgress?.({
    current: 1,
    total: 1,
    currentUrl: url,
    status: "processing"
  });
  try {
    const browser = await puppeteer.launch(env.MYBROWSER);
    const page = await browser.newPage();
    try {
      await page.goto(url, { waitUntil: "networkidle0", timeout });
      const results = await processSingleUrl(page, categories, excludeCategories);
      onProgress?.({
        current: 1,
        total: 1,
        currentUrl: url,
        status: "completed"
      });
      return results;
    } finally {
      await browser.close();
    }
  } catch (error) {
    onProgress?.({
      current: 1,
      total: 1,
      currentUrl: url,
      status: "error",
      error: error instanceof Error ? error.message : String(error)
    });
    throw error;
  }
}
async function processSingleUrl(page, categories, excludeCategories) {
  const results = [];
  for (const [tech, fingerprint] of Object.entries(FINGERPRINTS)) {
    if (categories && fingerprint.categories) {
      const hasMatchingCategory = fingerprint.categories.some((cat) => categories.includes(cat));
      if (!hasMatchingCategory) continue;
    }
    if (excludeCategories && fingerprint.categories) {
      const hasExcludedCategory = fingerprint.categories.some((cat) => excludeCategories.includes(cat));
      if (hasExcludedCategory) continue;
    }
    const detected = await detectTechnology(page, fingerprint);
    results.push({
      name: tech,
      categories: fingerprint.categories || ["unidentified"],
      detected
    });
  }
  return results;
}
async function detectTechnology(page, fingerprint) {
  const { detectors } = fingerprint;
  if (detectors.htmlContains) {
    const html = await page.content();
    if (detectors.htmlContains.some((text) => html.includes(text))) {
      return true;
    }
  }
  if (detectors.htmlRegex) {
    const html = await page.content();
    if (new RegExp(detectors.htmlRegex).test(html)) {
      return true;
    }
  }
  if (detectors.requestUrlRegex) {
    const requests = await page.evaluate(() => {
      return globalThis.performance.getEntriesByType("resource").map((entry) => entry.name);
    });
    const regexes = Array.isArray(detectors.requestUrlRegex) ? detectors.requestUrlRegex : [detectors.requestUrlRegex];
    if (requests.some(
      (url) => regexes.some((regex) => new RegExp(regex).test(url))
    )) {
      return true;
    }
  }
  if (detectors.selectorExists) {
    for (const selector of detectors.selectorExists) {
      if (await page.$(selector)) {
        return true;
      }
    }
  }
  if (detectors.globalVariables) {
    const globals = await page.evaluate((vars) => {
      return vars.map((v) => globalThis[v] !== void 0);
    }, detectors.globalVariables);
    if (globals.some((exists) => exists)) {
      return true;
    }
  }
  if (detectors.cssCommentRegex) {
    const styles = await page.evaluate(() => {
      return Array.from(globalThis.document.styleSheets).map((sheet) => {
        try {
          return Array.from(sheet.cssRules).map((rule) => rule.cssText).join("\n");
        } catch {
          return "";
        }
      }).join("\n");
    });
    if (new RegExp(detectors.cssCommentRegex).test(styles)) {
      return true;
    }
  }
  return false;
}

export { findTech };
