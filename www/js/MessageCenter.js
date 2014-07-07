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
 * @example
 * <caption>Event:target</caption>
 * //You have message data_acquired.
 * //But you also have obj1, obj2, obj3, which all wants to subscribe to their own data_acquired
 * //And you also have a module LoadingSpinner, which wants to subscribe to ALL data_requested and data_acquired and show Spinner till they'd be resolved.
 *
 * //Objects use:
 * mc.subcribe("data_acquired:obj1", {subscriber:this, callback:this.callback});
 * mc.subcribe("data_acquired:obj2", {subscriber:this, callback:this.callback});
 * mc.subcribe("data_acquired:obj3", {subscriber:this, callback:this.callback});
 * //Loading spinner use:
 * mc.subcribe("data_acquired", {subscriber:this, callback:this.callback});
 * //Voila!Done.
 * //Works simple. In subsriptions:
 * var subcriptions = {event_name: { subscribers, children},event_name: {subscribers, children} }
 * //And children are: {event_name:subscribers}
 * //with our example: subscriptions:{"data_acquired":{subscribers:[LoadingSpinner], children:{"obj1":{OBJ1}, "obj2":{OBJ2}, "obj3":{OBJ3}}}}
 * @author Shmidt Ivan
 * @version 0.0.3
 * @module MessageCenter
 */
define([], function () {
    //    'use strict';
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
        var subscriptions = {};
        /**
         * Allows subscribing to events(=messages)
         * @param {string} message Message name, which you are trying to subscribe
         * @param {Object} subscriber Subscriber = {subscriber: Object, callback: Function}
         * @memberof module:MessageCenter
         * @function subscribe
         * @example
         * MessageCenter.subscribe("someEvent", { subscriber:this, callback:function(){} });
         */
        this.subscribe = function (message, subscriber) {
            var insertSubscription = function () {
                if (!(_.has(subscriptions, _event))) {
                    subscriptions[_event] = {
                        children: {},
                        subscribers: []
                    };
                };
                if (!(_.has(subscriptions[_event].children, _target))) {
                    subscriptions[_event].children[_target] = {
                        subscribers: []
                    };
                };
                //Got all data from closure
                if (!_target) {
                    //Only namespace == TOP LEVEL
                    subscriptions[_event].subscribers.push(subscriber);
                } else {
                    subscriptions[_event].children[_target].subscribers.push(subscriber);
                }
            };
            var re = /([^:]+):?([\s\S]*)/;
            var result = message.match(re);
            if (!result && !(result[1])) {
                console.log("Error in msg:", message);
                return
            }
            var _event = result[1],
                _target = result[2];
            console.log('%c[Message Center]' + subscriber.subscriber + ' subscribed to:' + message, 'background: #222; color: #55b6da')
            insertSubscription();

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
         *Somebody.subscribe("someEvent:someAdd",{subscriber:Somebody, callback:function(d){ console.log(d.data); }}
         *MessageCenter.publish("someEvent:someAdd", {data: "someData"});
         * //Logs out "someData"
         *
         */
        this.publish = function (message, args) {
            var publishForSubscriber = function (s, args) {
                s.callback.call(s.subscriber, args);
            };
            var re = /([^:]+):?([\s\S]*)/;
            var result = message.match(re);
            if (!result && !(result[1])) {
                console.log("Error in msg:", message);
                return
            }
            var _event = result[1],
                _target = result[2];
            //            var txtArgs = (args) ? ", args:" + JSON.stringify(args) : "";
            console.log('%c[Message Center]Published:' + message, 'background: #222; color: #bada55', args || "");

            if (_.has(subscriptions, _event)) {
                _.each(subscriptions[_event].subscribers, function (s, i) {
                    var argsToSend = {
                        target: _target || "",
                        data: args
                    }
                    publishForSubscriber(s, argsToSend);
                    if (s.once) subscriptions[_event].subscribers.splice(i, 1);
                });
                if (_target && _.has(subscriptions[_event].children, _target)) {
                    _.each(subscriptions[_event].children[_target].subscribers, function (s, i) {
                        publishForSubscriber(s, args);
                        if (s.once) subscriptions[_event].children[_target].subscribers.splice(i, 1);
                    });
                }

            }
        };
        /**
         * Development-time function.<br> 
         * @memberof module:MessageCenter
         * @function getSubs
         * @return {Array<subscriptions>}
        */
        this.getSubs = function () {
            return subscriptions;
        }
    };
    return new MessageCenter();
})