class HandleSelectionExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        this._modelData = {};
    }

    load() {
        console.log('HandleSelectionExtension has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(handleButton);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('HandleSelectionExtension has been unloaded');
        return true;
    }

    createButton(id, tooltip, addClass){
    let button = new Autodesk.Viewing.UI.Button(id);

    //   button.icon.style.backgroundColor = color;

      button.setToolTip(tooltip);

      button.addClass(addClass);

      return button;

    }

    getAllLeafComponents(callback) {
        this.viewer.getObjectTree(function (tree) {
            let leaves = [];
            tree.enumNodeChildren(tree.getRootId(), function (dbId) {
                if (tree.getChildCount(dbId) === 0) {
                    leaves.push(dbId);
                }
            }, true);
            callback(leaves);
        });
    }



    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('AwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('AwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }


        let handleButton = this.createButton(
            'handleSelectionExtensionButton',
            'Handle Selection Extension',
            'handleSelectionExtensionIcon',
        )
        let started = false;

        handleButton.onClick = (ev) => {
            // Check if the panel is created or not
            if (this._panel == null) {
                this._panel = new ModelSummaryPanel(this.viewer, this.viewer.container, 'quantityChartPanel', 'Quantity Chart');
            }
            // Get current selection
            const selection = this.viewer.getSelection();
            this.viewer.clearSelection();
            this._panel.removeAllProperties();
           
           // Anything selected?
            if (selection.length > 0) {
                
                // Show/hide docking panel
                this._panel.setVisible(!this._panel.isVisible());
                // If panel is NOT visible, exit the function
                if (!this._panel.isVisible())
                    return;

                let isolated = [];
                // Iterate through the list of selected dbIds
                selection.forEach((dbId) => {
                    // Get properties of each dbId
                    this.viewer.getProperties(dbId, (props) => {
                        props.properties.forEach((item) => {

                            switch (item.displayName){
                                case 'Width':
                                    console.log(Math.round(item.displayValue));
                                    this._panel.addProperty(item.displayName, Math.round(item.displayValue));
                                    break;
                                case 'Height':
                                    console.log(Math.round(item.displayValue));
                                    this._panel.addProperty(item.displayName, Math.round(item.displayValue));
                                    break;
                                case 'Area':
                                    console.log(Math.round(item.displayValue));
                                    this._panel.addProperty(item.displayName, `${Math.round(item.displayValue)} Sq.m.`);
                                    break;
                            }

                        })
                        
                        // Ask if want to isolate
                        if (selection) {
                            isolated.push(dbId);
                            this.viewer.isolate(isolated);
                            
                        }
                    });
                });
            } else {
                // If nothing selected, restore
                this.viewer.isolate(0);
            }
        }


        this._group.addControl(handleButton);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('HandleSelectionExtension', HandleSelectionExtension);
