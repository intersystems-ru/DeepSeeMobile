/**
 * @fileOverview
 * Message center module implementation<br>
 * <strong>What does Message Center(mc)?</strong><br>
 * It supplies your application with low-dependency components
 * @example
 * <caption>Logger.js</caption>
 * define(['MessageCenter'],function(mc){
 *  mc.subscribe("messageReceived",{subscriber:this, callback:function(d){console.log("Logger:",d.msg);}});
 *  });
 * @example
 * <caption>SomeModule.js</caption>
 * define(['MessageCenter'],function(mc){
 *  mc.publish("messageReceived",{msg:"Some Message});
 *  });
 * @example
 * //As a result you have 2 modules, which don't know about each other.
 * //All you do is inform MessageCenter and waiting for info from MessageCenter.
 * @author Shmidt Ivan
 * @version 0.0.3
 * @module MessageCenter
 * @requires Utils
 */
define(['Utils'], function (Utils) {
    'use strict';
    /**
     * @constructor
     * @alias module:MessageCenter
     * @return {Object} Instance
     * @property {Array.<Object>} subscriptions
     */
    function MessageCenter() {
        /**@lends module:MessageCenter#*/

        if (MessageCenter.prototype._instance) {
            return MessageCenter.prototype._instance;
        }
        MessageCenter.prototype._instance = this;
        /**
         * Array of subscriptions<br>
         * @example
         * var subscription = {
         *          message:"someEvent",
         *          subscribers:[
         *              {
         *                  subscriber:Window,
         *                  callback:console.log,
         *                  once:true
         *              }
         *          ]
         *      };
         * subscriptions.push(subscription);
         * @var {Array.<Object>}
         * @name module:MessageCenter#subscriptions
         * @private
         */
        var subscriptions = [];
        /**
         * Allows subscribing to events(=messages)
         * @param {string} message Message name, which you are trying to subscribe
         * @param {Object} subscriber Subscriber = {subscriber: Object, callback: Function}
         * @memberof module:MessageCenter
         * @function subscribe
         * @example
         * MessageCenter.subscribe("someEvent", { subscriber:this, callback:function(){} });
         */
        this.subscribe = function subscribe_f (message, subscriber) {
            
            
            console.log('%c[Message Center]' + subscriber.subscriber + ' subscribed to:' + message, 'background: #222; color: #bada55')
            var i = 0;
            var l = subscriptions.length
            for (; i < l; i++) {
                if (subscriptions[i].message == message) break;
            }
            if (i == subscriptions.length) {
                subscriptions.push({
                    message: message,
                    subscribers: [subscriber]
                })
            } else {
                var j = 0;

                for (; j < subscriptions[i].subscribers.length; j++) {
                    if (subscriptions[i].subscribers[j].subscriber == subscriber.subscriber) break;
                }
                subscriptions[i].subscribers[j] = subscriber;
                return true;

            }

        };
        /**
         * Allows publishing events(=messages)
         * @param {string} message Message name, which you want to publish
         * @param {Object} [args] Data that you want to transfer to subscribers
         * @memberof module:MessageCenter
         * @function publish
         * @example
         *<caption>Simple publish</caption>
         * MessageCenter.publish("someEvent");
         *@example
         *<caption>To catch data</caption>
         *Somebody.subscribe("someEvent",{subscriber:Somebody, callback:function(d){ console.log(d.data); }}
         *MessageCenter.publish("someEvent", {data: "someData"});
         * //Logs out "someData"
         *
         */
        this.publish = function (message, args) {
            var txtArgs = (args) ? ", data:" + JSON.stringify(args) : "";
            console.log('%c[Message Center] Published:' + message + txtArgs, 'background: #222; color: #bada55')
            var i = 0,
                l = subscriptions.length
            for (; i < l; i++) {
                if (subscriptions[i].message == message) break;
            }
            if ((i == l)) return; //Have not any subscribers
            if (subscriptions[i].subscribers && subscriptions[i].subscribers[0]) {
                var l = subscriptions[i].subscribers.length,
                    j = 0;
                for (; j < l; j++) {
                    var s = subscriptions[i].subscribers[j];
                    s.callback.call(s.subscriber, args);
                    if (s.once) subscriptions[i].subscribers.splice(j, 1); //delete subscriber

                }
            }
        };
        this.getSubs = function(){return subscriptions;}
    };
    return new MessageCenter();
})