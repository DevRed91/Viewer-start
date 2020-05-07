///////////////////////////////
//Docking Panel
///////////////////////////////
class NestedViewerPanel extends Autodesk.Viewing.UI.DockingPanel{
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        // this._urn = '';
        this._parentViewer = viewer;
        // this._filter = filter;
        // this._
        // this.viewer = viewer;

    }

    // get urn(){
    //     return this._urn;
    // }

    // set urn(value){
    //     if (this._urn !== value){
    //         this._urn = value;
    //         this._updateDrop
    //     }
    // }
    initialize(){
        this.container.style.top = '5em';
        this.container.style.right = '8em';
        this.container.style.width = '400px';
        this.container.style.height = '600px';
        this.container.style.backgroundColor = 'white';

        this.title = this.createTitleBar(this.titleLabel || this.container.id);
        this.container.appendChild(this.title);

        this._container = document.createElement('div');
        this._container.style.position = 'absolute';
        this._container.style.left = '0';
        this._container.style.top = '50px';
        this._container.style.width = '100%';
        this._container.style.height = '100%'; // 400px - 50px (title bar) - 20px (footer)
        this.container.appendChild(this._container);

        this._overlay = document.createElement('canvas');
        this._overlay.id = 'canvasId';
        this._overlay.style.width = '100%';
        this._overlay.style.height = '100%';
        this._overlay.style.display = 'none';
        this._overlay.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        this._overlay.style.color = 'white';
        this._overlay.style.zIndex = '101';
        this._overlay.style.justifyContent = 'center';
        this._overlay.style.alignItems = 'center';
        this._container.appendChild(this._overlay);
    }

   
}


///////////////////////////////
//Docking Panel button
///////////////////////////////
class NestedViewerExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        // this._button = null;
    }

    load() {
        console.log('DockingPanelButton has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(dockingButton);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('DockingPanelButton has been unloaded');
        return true;
    }

    // getAllLeafComponents(callback) {
    //     this.viewer.getObjectTree(function (tree) {
    //         let leaves = [];
    //         tree.enumNodeChildren(tree.getRootId(), function (dbId) {
    //             if (tree.getChildCount(dbId) === 0) {
    //                 leaves.push(dbId);
    //             }
    //         }, true);
    //         callback(leaves);
    //     });
    // }

    createButton(id, tooltip, addClass){
        let button = new Autodesk.Viewing.UI.Button(id);

    //button.icon.style.backgroundColor = color;
        button.setToolTip(tooltip);
        button.addClass(addClass);

        return button;

    }

    // drawRectangle(){
    //     let c = document.getElementById("canvasId");
    //     let ctx = c.getContext("2d");
    //     ctx.beginPath();
    //     ctx.lineWidth = "50";
    //     ctx.strokeStyle = "blue";
    //     ctx.rect(200, 150, 150, 80);
    //     ctx.stroke();
    // }

    onToolbarCreated() {
        this._group = this.viewer.toolbar.getControl('AwesomeExtensionsToolbar');
        if (!this._group){
            this._group = new Autodesk.Viewing.UI.ControlGroup('AwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        this.createUI();
    }

    createUI(){
        let viewer = this.viewer;
        let panel = this.panel;

        let NestingButton = this.createButton(
            'NestingButton',
            'Nesting Extension',
            'NestingButtonIcon',
        )

        NestingButton.onClick = (ev) => {
            // Check if the panel is created or not
            if (panel == null) {
                panel = new NestedViewerPanel(viewer, viewer.container, 'descriptionPanel', 'Description');
            }
            // Show/hide docking panel
            panel.setVisible(!panel.isVisible());

            // this.drawRectangle();

            // If panel is NOT visible, exit the function
//             if (!panel.isVisible())
//                 return;

//             // First, the viewer contains all elements on the model, including
//             // categories (e.g. families or part definition), so we need to enumerate
//             // the leaf nodes, meaning actual instances of the model. The following
//             // getAllLeafComponents function is defined at the bottom
//             this.getAllLeafComponents((dbIds) => {
//                 // Now for leaf components, let's get some properties and count occurrences of each value
//                 const filteredProps = ['PropertyNameA', 'PropertyNameB'];
//                 // Get only the properties we need for the leaf dbIds
//                 this.viewer.model.getBulkProperties(dbIds, filteredProps, (items) => {
//                     // Iterate through the elements we found
//                     items.forEach((item) => {
//                         // and iterate through each property
//                         item.properties.forEach(function (prop) {
//                             // Use the filteredProps to store the count as a subarray
//                             if (filteredProps[prop.displayName] === undefined)
//                                 filteredProps[prop.displayName] = {};
//                             // Start counting: if first time finding it, set as 1, else +1
//                             if (filteredProps[prop.displayName][prop.displayValue] === undefined)
//                                 filteredProps[prop.displayName][prop.displayValue] = 1;
//                             else
//                                 filteredProps[prop.displayName][prop.displayValue] += 1;
//                         });
//                     });
//                     // Now ready to show!
//                     // The PropertyPanel has the .addProperty that receives the name, value
//                     // and category, that simple! So just iterate through the list and add them
//                     filteredProps.forEach((prop) => {
//                         if (filteredProps[prop] === undefined) return;
//                         Object.keys(filteredProps[prop]).forEach((val) => {
//                             panel.addProperty(val, filteredProps[prop][val], prop);
//                         });
//                     });
//                 });
//          });
        }
        
        this._group.addControl(NestingButton);
    }
        
}

Autodesk.Viewing.theExtensionManager.registerExtension('NestedViewerExtension', NestedViewerExtension);