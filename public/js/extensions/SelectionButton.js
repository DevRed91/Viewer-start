class HandleSelectionExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
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
            // Get current selection
            const selection = this.viewer.getSelection();
            this.viewer.clearSelection();
            // Anything selected?
            if (selection.length > 0) {
                let isolated = [];
                // let redColor = new THREE.Vector4(1, 0, 0, 0.5);
                // Iterate through the list of selected dbIds
                selection.forEach((dbId) => {
                    // Get properties of each dbId
                    this.viewer.getProperties(dbId, (props) => {
                        // Output properties to console
                        console.log(props);
                        // Ask if want to isolate
                        if (selection) {
                            isolated.push(dbId);
                            this.viewer.isolate(isolated);
                            // this.viewer.setThemingColor(dbId, redColor);
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