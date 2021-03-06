/**
 * @fileoverview This module provides the HashMap constructor.
 * @author NHN Ent.
 *         FE Development Team <e0242@nhnent.com>
 * @dependency type, collection.js
 */

(function(tui) {
    'use strict';

    /* istanbul ignore if */
    if (!tui) {
        tui = window.tui = {};
    }
    if (!tui.util) {
        tui.util = window.tui.util = {};
    }

    /**
     * All the data in hashMap begin with _MAPDATAPREFIX;
     * @type {string}
     * @private
     */
    var _MAPDATAPREFIX = 'å';

    /**
     * HashMap can handle the key-value pairs.<br>
     * Caution:<br>
     *  HashMap instance has a length property but is not an instance of Array.
     * @param {Object} [obj] A initial data for creation.
     * @constructor
     * @memberof tui.util
     * @example
     *  var hm = new tui.util.HashMap({
     *      'mydata': {
     *           'hello': 'imfine'
     *       },
     *      'what': 'time'
     *  });
     */
    function HashMap(obj) {
        /**
         * size
         * @type {number}
         */
        this.length = 0;

        if (obj) {
            this.setObject(obj);
        }
    }

    /**
     * Set a data from the given key with value or the given object.
     * @param {string|Object} key A string or object for key
     * @param {*} [value] A data
     * @example
     *  var hm = new HashMap();
     *
     *  hm.set('key', 'value');
     *  hm.set({
     *      'key1': 'data1',
     *      'key2': 'data2'
     *  });
     */
    HashMap.prototype.set = function(key, value) {
        if(arguments.length === 2) {
            this.setKeyValue(key, value);
        } else {
            this.setObject(key);
        }
    };

    /**
     * Set a data from the given key with value.
     * @param {string} key A string for key
     * @param {*} value A data
     * @example
     *  var hm = new HashMap();
     *  hm.setKeyValue('key', 'value');
     */
    HashMap.prototype.setKeyValue = function(key, value) {
        if (!this.has(key)) {
            this.length += 1;
        }
        this[this.encodeKey(key)] = value;
    };

    /**
     * Set a data from the given object.
     * @param {Object} obj A object for data
     * @example
     *  var hm = new HashMap();
     *
     *  hm.setObject({
     *      'key1': 'data1',
     *      'key2': 'data2'
     *  });
     */
    HashMap.prototype.setObject = function(obj) {
        var self = this;

        tui.util.forEachOwnProperties(obj, function(value, key) {
            self.setKeyValue(key, value);
        });
    };

    /**
     * Merge with the given another hashMap.
     * @param {HashMap} hashMap Another hashMap instance
     */
    HashMap.prototype.merge = function(hashMap) {
        var self = this;

        hashMap.each(function(value, key) {
            self.setKeyValue(key, value);
        });
    };

    /**
     * Encode the given key for hashMap.
     * @param {string} key A string for key
     * @returns {string} A encoded key
     * @private
     */
    HashMap.prototype.encodeKey = function(key) {
        return _MAPDATAPREFIX + key;
    };

    /**
     * Decode the given key in hashMap.
     * @param {string} key A string for key
     * @returns {string} A decoded key
     * @private
     */
    HashMap.prototype.decodeKey = function(key) {
        var decodedKey = key.split(_MAPDATAPREFIX);
        return decodedKey[decodedKey.length-1];
    };

    /**
     * Return the value from the given key.
     * @param {string} key A string for key
     * @returns {*} The value from a key
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *
     *  hm.get('key') // value
     */
    HashMap.prototype.get = function(key) {
        return this[this.encodeKey(key)];
    };

    /**
     * Check the existence of a value from the key.
     * @param {string} key A string for key
     * @returns {boolean} Indicating whether a value exists or not.
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *
     *  hm.has('key') // true
     */
    HashMap.prototype.has = function(key) {
        return this.hasOwnProperty(this.encodeKey(key));
    };

    /**
     * Remove a data(key-value pairs) from the given key or the given key-list.
     * @param {...string|string[]} key A string for key
     * @returns {string|string[]} A removed data
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  //ex1
     *  hm.remove('key');
     *
     *  //ex2
     *  hm.remove('key', 'key2');
     *
     *  //ex3
     *  hm.remove(['key', 'key2']);
     */
    HashMap.prototype.remove = function(key) {
        if (arguments.length > 1) {
            key = tui.util.toArray(arguments);
        }

        return tui.util.isArray(key) ? this.removeByKeyArray(key) : this.removeByKey(key);
    };

    /**
     * Remove data(key-value pair) from the given key.
     * @param {string} key A string for key
     * @returns {*|null} A removed data
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *
     *  hm.removeByKey('key')
     */
    HashMap.prototype.removeByKey = function(key) {
        var data = this.has(key) ? this.get(key) : null;

        if (data !== null) {
            delete this[this.encodeKey(key)];
            this.length -= 1;
        }

        return data;
    };

    /**
     * Remove a data(key-value pairs) from the given key-list.
     * @param {string[]} keyArray An array of keys
     * @returns {string[]} A removed data
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.removeByKeyArray(['key', 'key2']);
     */
    HashMap.prototype.removeByKeyArray = function(keyArray) {
        var data = [],
            self = this;

        tui.util.forEach(keyArray, function(key) {
            data.push(self.removeByKey(key));
        });

        return data;
    };

    /**
     * Remove all the data
     */
    HashMap.prototype.removeAll = function() {
        var self = this;

        this.each(function(value, key) {
            self.remove(key);
        });
    };

    /**
     * Execute the provided callback once for each all the data.
     * @param {Function} iteratee Callback function
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.each(function(value, key) {
     *      //do something...
     *  });
     */
    HashMap.prototype.each = function(iteratee) {
        var self = this,
            flag;

        tui.util.forEachOwnProperties(this, function(value, key) {
            if (key.charAt(0) === _MAPDATAPREFIX) {
                flag = iteratee(value, self.decodeKey(key));
            }

            if (flag === false) {
                return flag;
            }
        });
    };

    /**
     * Return the key-list stored.
     * @returns {Array} A key-list
     * @example
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.keys();  //['key', 'key2');
     */
    HashMap.prototype.keys = function() {
        var keys = [],
            self = this;

        this.each(function(value, key) {
            keys.push(self.decodeKey(key));
        });

        return keys;
    };

    /**
     * Work similarly to Array.prototype.map().<br>
     * It executes the provided callback that checks conditions once for each element of hashMap,<br>
     *  and returns a new array having elements satisfying the conditions
     * @param {Function} condition A function that checks conditions
     * @returns {Array} A new array having elements satisfying the conditions
     * @example
     *  //ex1
     *  var hm = new HashMap();
     *  hm.set('key', 'value');
     *  hm.set('key2', 'value');
     *
     *  hm.find(function(value, key) {
     *      return key === 'key2';
     *  }); // ['value']
     *
     *  //ex2
     *  var hm = new HashMap({
     *      'myobj1': {
     *           visible: true
     *       },
     *      'mybobj2': {
     *           visible: false
     *       }
     *  });
     *
     *  hm.find(function(obj, key) {
     *      return obj.visible === true;
     *  }); // [{visible: true}];
     */
    HashMap.prototype.find = function(condition) {
        var founds = [];

        this.each(function(value, key) {
            if (condition(value, key)) {
                founds.push(value);
            }
        });

        return founds;
    };

    /**
     * Return a new Array having all values.
     * @returns {Array} A new array having all values
     */
    HashMap.prototype.toArray = function() {
        var result = [];

        this.each(function(v) {
            result.push(v);
        });

        return result;
    };

    tui.util.HashMap = HashMap;

})(window.tui);
