"use strict";
/* DOM Level2 Events implemented as described here:
 *
 * http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html
 *
 */
var core = require("../level1/core");

// The dependencies here are a bit screwy; when we get a chance to move all events to living, things will get simpler.
const Event = require("../living/generated/Event");
const CustomEvent = require("../living/generated/CustomEvent");
const MessageEvent = require("../living/generated/MessageEvent");
const ErrorEvent = require("../living/generated/ErrorEvent");
const HashChangeEvent = require("../living/generated/HashChangeEvent");
const UIEvent = require("../living/generated/UIEvent");
const MouseEvent = require("../living/generated/MouseEvent");
const KeyboardEvent = require("../living/generated/KeyboardEvent");
const TouchEvent = require("../living/generated/TouchEvent");
const MutationEvent = require("../living/generated/MutationEvent");
const ProgressEvent = require("../living/generated/ProgressEvent");
const domSymbolTree = require("../living/helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../living/node-type");

core.Event = Event.interface;
core.CustomEvent = CustomEvent.interface;
core.MessageEvent = MessageEvent.interface;
core.ErrorEvent = ErrorEvent.interface;
core.HashChangeEvent = HashChangeEvent.interface;
core.UIEvent = UIEvent.interface;
core.MouseEvent = MouseEvent.interface;
core.KeyboardEvent = KeyboardEvent.interface;
core.TouchEvent = TouchEvent.interface;
core.MutationEvent = MutationEvent.interface;
core.ProgressEvent = ProgressEvent.interface;

core.EventTarget = require('../living/generated/EventTarget').interface;
