/**
 * Copyright 2016 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

require('dotenv').load();

var express = require('express');
var app = express();

var port = process.env.PORT || 5000;
app.set('port', port);

require('./app')(app);

// Endpoint to be called from the client side
app.post('/api/message', function (req, res) {
    var workspace = process.env.WORKSPACE_ID || '<workspace-id>';
    if (!workspace || workspace === '<workspace-id>') {
        return res.json({
            'output': {
                'text': 'The app has not been configured with a <b>WORKSPACE_ID</b> environment variable. Please refer to the ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple">README</a> documentation on how to set this variable. <br>' + 'Once a workspace has been defined the intents may be imported from ' + '<a href="https://github.com/watson-developer-cloud/conversation-simple/blob/master/training/car_workspace.json">here</a> in order to get a working application.'
            }
        });
    }
    var payload = {
        workspace_id: workspace,
        context: req.body.context || {},
        input: req.body.input || {}
    };

    // Send the input to the conversation service
    conversation.message(payload, function (err, data) {
        if (err) {
            return res.status(err.code || 500).json(err);
        }
        return res.json(updateMessage(payload, data));
    });
});

// Listen on the specified port
app.listen(port, function () {
    console.log('Client server listening on port ' + port);
});
