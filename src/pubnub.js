/* global window */

import config from '../config.json';
import Wrapper from './wrapper';

(function () {

  window.PubNubAngular = ng.core.Class({
    constructor: function () {
      if (typeof PubNub === 'undefined' || PubNub === null) {
        throw new Error('PubNub is not in global scope. Ensure that pubnub.js v4 library is included before the angular adapter');
      }

      this.wrappers = {};
    },

    /**
     * Initializer for default instance
     *
     * @param {Object} initConfig
     */
    init: function (initConfig) {

      let instance = this.getInstance(config.default_instance_name);

      instance.init(initConfig);

      return instance;
    },

    /**
     * Instance getter
     *
     * @param instanceName
     * @returns {Wrapper}
     */
    getInstance: function (instanceName) {
      let instance = this.wrappers[instanceName];

      if (instance && instance instanceof Wrapper) {
        return instance;
      } else if (typeof instanceName === 'string' && instanceName.length > 0) {
        this.wrappers[instanceName] = new Wrapper(instanceName, this);

        config.attributes_to_delegate.forEach((attribute) => {
          this.wrappers[instanceName].wrapAttribute(attribute);

          if (!this[attribute]) {
            Object.defineProperty(this, attribute, {
              get: function () {
                return this.getInstance(config.default_instance_name)[attribute];
              }
            });
          }
        });

        config.methods_to_delegate.forEach((method) => {
          this.wrappers[instanceName].wrapMethod(method);

          if (!this[method]) {
            this[method] = function (args) {
              return this.getInstance(config.default_instance_name)[method](args);
            };
          }
        });

        return this.wrappers[instanceName];
      }

      return instance;
    },

    /**
     * Subscribe method wrapped for default instance
     *
     * @param {object} args
     */
    subscribe: function (args) {
      this.getInstance(config.default_instance_name).subscribe(args);
    },

    /**
     * Unsubscribe method wrapped for default instance
     *
     * @param {object} args
     */
    unsubscribe: function (args) {
      this.getInstance(config.default_instance_name).unsubscribe(args);
    },

    /**
     * GetMessage method wrapped for default instance
     *
     * @param {string|[string]} channel
     * @param callback
     */
    getMessage: function (channel, callback) {
      this.getInstance(config.default_instance_name).getMessage(channel, callback);
    },

    /**
     * GetPresence method wrapped for default instance
     *
     * @param {string|[string]} channel
     * @param callback
     */
    getPresence: function (channel, callback) {
      this.getInstance(config.default_instance_name).getPresence(channel, callback);
    },

    /**
     * GetStatus method wrapped for default instance
     *
     * @param {string|[string]} channel
     * @param callback
     */
    getStatus: function (channel, callback) {
      this.getInstance(config.default_instance_name).getStatus(channel, callback);
    },

    /**
     * GetError method wrapped for default instance
     *
     * @param callback
     */
    getError: function (callback) {
      this.getInstance(config.default_instance_name).getError(callback);
    }
  });

})();
