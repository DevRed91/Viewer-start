
import { Extension } from "../../src/application/Extension";
import { TOOLBAR_CREATED_EVENT, TOOLBAR } from "../../src/gui/GuiViewerToolbarConst";
import { Button } from "../../src/gui/controls/Button";
import { FusionOrbitTool } from "./FusionOrbitTool";

import "./FusionOrbit.css" // IMPORTANT!!

/**
 * Provides a customization to the orbit tool. 
 * 
 * The extension id is: `Autodesk.Viewing.FusionOrbit`
 * 
 * @example
 *   viewer.loadExtension('Autodesk.Viewing.FusionOrbit')
 * 
 * @memberof Autodesk.Viewing.Extensions
 * @alias Autodesk.Viewing.Extensions.FusionOrbitExtension
 * @see {@link Autodesk.Viewing.Extension} for common inherited methods.
 * @constructor
 */
export function FusionOrbitExtension(viewer, options) {
    Extension.call(this, viewer, options);
    this.name = 'fusionorbit';
    this.modes = ['fusionorbit','fusionfreeorbit'];
}

FusionOrbitExtension.prototype = Object.create(Extension.prototype);
FusionOrbitExtension.prototype.constructor = FusionOrbitExtension;

var proto = FusionOrbitExtension.prototype;

proto.load = function() {
    var self = this;
    var viewer = this.viewer;

    this.tool = new FusionOrbitTool();
    this.tool.setViewer(viewer);
    viewer.toolController.registerTool(this.tool);

    return true;
};

proto.onToolbarCreated = function(toolbar)
{
    var self   = this;
    var viewer = this.viewer;
    var navTools = toolbar.getControl(TOOLBAR.NAVTOOLSID);

    if (!navTools || !navTools.orbitbutton) {
        return;
    }
    
    // save button behaviors, before modifying them
    this.classicBehavior = {};
    this.classicBehavior.orbitOnClick = navTools.orbitbutton.onClick;
    this.classicBehavior.freeorbitOnClick = navTools.freeorbitbutton.onClick;
    this.classicBehavior.returnToDefault = navTools.returnToDefault;

    navTools.freeorbitbutton.onClick = function(e) {
        var state = navTools.freeorbitbutton.getState();
        if (state === Button.State.INACTIVE) {
            self.activate('fusionfreeorbit');
            navTools.freeorbitbutton.setState(Button.State.ACTIVE);
        } else if (state === Button.State.ACTIVE) {
            self.deactivate();
            navTools.freeorbitbutton.setState(Button.State.INACTIVE);
        }
    };

    navTools.orbitbutton.onClick = function(e) {
        var state = navTools.orbitbutton.getState();
        if (state === Button.State.INACTIVE) {
            self.activate('fusionorbit');
            navTools.orbitbutton.setState(Button.State.ACTIVE);
        } else if (state === Button.State.ACTIVE) {
            self.deactivate();
        }
    };

    navTools.returnToDefault = function() {
        if (navTools.orbittoolsbutton) {    // can be null when switching sheets
            // clear active button
            navTools.orbittoolsbutton.setState(Button.State.ACTIVE);
        }
    };

    // set combo button
    navTools.orbittoolsbutton.setState(Button.State.INACTIVE);
    if (viewer.prefs.fusionOrbitConstrained) {
        navTools.orbittoolsbutton.onClick = navTools.orbitbutton.onClick;
        navTools.orbittoolsbutton.setIcon(navTools.orbitbutton.iconClass);
        viewer.setDefaultNavigationTool("orbit");
    } else {
        navTools.orbittoolsbutton.onClick = navTools.freeorbitbutton.onClick;
        navTools.orbittoolsbutton.setIcon(navTools.freeorbitbutton.iconClass);
        viewer.setDefaultNavigationTool("freeorbit");
    }

    // reset
    viewer.setActiveNavigationTool();
    navTools.returnToDefault && navTools.returnToDefault();
};

proto.unload = function () {
    
    var viewer = this.viewer;
    
    // restore LMV Classic button behaviors
    if (this.classicBehavior) {
        var toolbar = viewer.getToolbar();
        var navTools = toolbar.getControl(TOOLBAR.NAVTOOLSID);

        if (navTools) {
            if (navTools.orbitbutton)
                navTools.orbitbutton.onClick = this.classicBehavior.orbitOnClick;

            if (navTools.freeorbitbutton)
                navTools.freeorbitbutton.onClick = this.classicBehavior.freeorbitOnClick;

            navTools.returnToDefault = this.classicBehavior.returnToDefault;

            if (navTools.orbittoolsbutton) {    // can be null when switching sheets
                if (navTools.orbitbutton)
                    navTools.orbittoolsbutton.onClick = navTools.orbitbutton.onClick;
                else
                    navTools.orbittoolsbutton.onClick = null;
                navTools.orbittoolsbutton.setIcon("adsk-icon-orbit-constrained");
                navTools.orbittoolsbutton.setState(Button.State.ACTIVE);
            }
        } 
        this.classicBehavior = null;
    }
    
    viewer.setActiveNavigationTool("orbit");
    viewer.setDefaultNavigationTool("orbit");

    // Deregister tool
    viewer.toolController.deregisterTool(this.tool);
    this.tool.setViewer(null);
    this.tool = null;

    return true;
};

/**
 * Activates the extension's tool.
 * 
 * @param {string} [mode] - Either 'fusionorbit' (default) or 'fusionfreeorbit'. 
 * 
 * @memberof Autodesk.Viewing.Extensions.FusionOrbitExtension
 * @alias Autodesk.Viewing.Extensions.FusionOrbitExtension#activate
 */
proto.activate = function (mode) {
    if (this.activeStatus && this.mode === mode) {
        return;
    }
    switch (mode) {
        default:
        case 'fusionorbit':
            this.viewer.setActiveNavigationTool("fusion orbit constrained");
            this.mode = 'fusionorbit';
            break;
        case 'fusionfreeorbit':
            this.viewer.setActiveNavigationTool("fusion orbit");
            this.mode = 'fusionfreeorbit';
            break;
    }
    this.activeStatus = true;
    return true;
};

/**
 * Deactivates the extension's tool.
 * 
 * @memberof Autodesk.Viewing.Extensions.FusionOrbitExtension
 * @alias Autodesk.Viewing.Extensions.FusionOrbitExtension#deactivate
 */
proto.deactivate = function () {
    if(this.activeStatus) {
        this.viewer.setActiveNavigationTool();
        this.activeStatus = false;
    }
    return true;
};

