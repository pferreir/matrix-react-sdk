/*
Copyright 2015 OpenMarket Ltd

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/

'use strict';

var React = require('react');
var ReactDOM = require('react-dom');
var HtmlUtils = require('../../../HtmlUtils');
var linkify = require('linkifyjs');
var linkifyElement = require('linkifyjs/element');
var linkifyMatrix = require('../../../linkify-matrix');

linkifyMatrix(linkify);

module.exports = React.createClass({
    displayName: 'TextualMessage',

    componentDidMount: function() {
        linkifyElement(this.refs.content, linkifyMatrix.options);

        if (this.props.mxEvent.getContent().format === "org.matrix.custom.html")
            HtmlUtils.highlightDom(ReactDOM.findDOMNode(this));
    },

    componentDidUpdate: function() {
        if (this.props.mxEvent.getContent().format === "org.matrix.custom.html")
            HtmlUtils.highlightDom(ReactDOM.findDOMNode(this));
    },

    shouldComponentUpdate: function(nextProps) {
        // exploit that events are immutable :)
        return (nextProps.mxEvent.getId() !== this.props.mxEvent.getId() ||
                nextProps.searchTerm !== this.props.searchTerm);
    },

    render: function() {
        var mxEvent = this.props.mxEvent;
        var content = mxEvent.getContent();
        var body = HtmlUtils.bodyToHtml(content, this.props.searchTerm);

        switch (content.msgtype) {
            case "m.emote":
                var name = mxEvent.sender ? mxEvent.sender.name : mxEvent.getSender();
                return (
                    <span ref="content" className="mx_MEmoteTile mx_MessageTile_content">
                        * { name } { body }
                    </span>
                );
            case "m.notice":
                return (
                    <span ref="content" className="mx_MNoticeTile mx_MessageTile_content">
                        { body }
                    </span>
                );
            default: // including "m.text"
                return (
                    <span ref="content" className="mx_MTextTile mx_MessageTile_content">
                        { body }
                    </span>
                );
        }
    },
});
