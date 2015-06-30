/**
 * @fileoverview Define namespace
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency inheritance.js, object.js, collection.js
 */
(function(ne) {

    'use strict';
    /* istanbul ignore if */
    if (!ne) {
        ne = window.ne = {};
    }
    /* istanbul ignore if */
    if (!ne.util) {
        ne.util = window.ne.util = {};
    }

    /**
     * Define namespace
     * @param {string} name - Module name
     * @param {(object|function)} props - A set of modules or one module
     * @param {boolean} isOverride flag - What if module already define, override or not
     * @returns {(object|function)} Defined namespace
     * @memberof ne.util
     * @example
     * var neComp = defineNamespace('ne.component');
     * neComp.listMenu = ne.util.defineClass({
     *      init: function() {
     *          // code
     *      }
     * });
     */
    var defineNamespace = function(name, props, isOverride) {
        var namespace,
            lastspace,
            result,
            module = getNamespace(name);

        if (!isOverride && isValidType(module)) {
            return module;
        }

        namespace = name.split('.');
        lastspace = namespace.pop();
        namespace.unshift(window);

        result = ne.util.reduce(namespace, function(obj, name) {
            obj[name] = obj[name] || {};
            return obj[name];
        });

        result[lastspace] = isValidType(props) ? props : {};

        return result[lastspace];

    };

    /**
     * Get namespace
     * @param {string} name - namespace
     * @returns {*}
     */
    var getNamespace = function(name) {
        var namespace,
            result;

        namespace = name.split('.');
        namespace.unshift(window);

        result = ne.util.reduce(namespace, function(obj, name) {
            return obj && obj[name];
        });
        return result;
    };

    /**
     * Check valid type
     * @param {*} module
     * @returns {boolean}
     */
    var isValidType = function(module) {
        return (ne.util.isObject(module) || ne.util.isFunction(module));
    };

    ne.util.defineNamespace = defineNamespace;

})(window.ne);