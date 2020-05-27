class RoomShaderExtension extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('DockingQuantityButton has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(this._button);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('DockingQuantityButton has been unloaded');
        return true;
    }


    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('NewExtensionToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('FloorExtensionToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('RoomShaderButton');
        
        this._button.onClick = (ev) => {
            
                this.viewer.search('Rooms', (idArray) => {
                    console.log('Rooms numbers in this floor: '+ idArray.length);

                    $.each(idArray, (num, dbId) => {
                        this.viewer.getProperties(dbId, (propData) => {
                            
                            propData.properties.filter((item) => {
                                
                                return (item.displayName === 'Layer' && item.displayValue === _specificFloorName);
                                
                            })
                        })
                    })
                })

        };
        this._button.setToolTip('Room Shader Extension');
        this._button.addClass('roomShaderIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('RoomShaderExtension', RoomShaderExtension);