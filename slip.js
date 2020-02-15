/**
 * Copyright 2016 Nicholas Humfrey, Nathanaël Lécaudé
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 **/

module.exports = function(RED) {
    "use strict";
    var slip = require('slip');

    function SLIP(n) {
        RED.nodes.createNode(this,n);
        var node = this;
        node.mode = n.mode;

        node.decoder = new slip.Decoder({
            onMessage: function(decoded) {
                var msg = Object.assign(this.lastMsg, {payload: new Buffer(decoded)});
                node.send(msg);
            },
            onError: function(msgBuffer, errorMsg) {
                node.error(errorMsg);
            }
        });

        node.on("input", function(msg) {
            if (node.mode == "encode") {
                msg.payload = new Buffer(
                    slip.encode(msg.payload)
                );
                node.send(msg);
            } else if (node.mode == "decode") {
                node.decoder.lastMsg = msg;
                node.decoder.decode(
                    msg.payload
                );
            }
        });
    }

    RED.nodes.registerType("slip", SLIP);
};
