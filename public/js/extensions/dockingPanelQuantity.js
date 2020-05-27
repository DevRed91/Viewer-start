class DockingQuantityButton extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        // this._modelData = {};
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

    getAllLeafComponents(callback) {
        // from https://learnforge.autodesk.io/#/viewer/extensions/panel?id=enumerate-leaf-nodes
        this.viewer.getObjectTree(function (tree) {
            var leaves = [];
            tree.enumNodeChildren(tree.getRootId(), function (dbId) {
                if (tree.getChildCount(dbId) === 0) {
                    leaves.push(dbId);
                }
            }, true);
            callback(leaves);
        });
    }
    
    dynamicColors(count){
        let background = [];
        let borders = [];
        for (let i = 0; i < count; i++){
            let r = Math.floor(Math.random() * 255);
            let g = Math.floor(Math.random() * 255);
            let b = Math.floor(Math.random() * 255);
        
            background.push('rgba(' + r + ', ' + g + ', '+ b + ', 0.7)');
            borders.push('rgba(' + r + ', ' + g + ', '+ b + ', 0.7)');
        } 
        return {background:background, borders:borders};
    }

    onToolbarCreated() {
        // Create a new toolbar group if it doesn't exist
        this._group = this.viewer.toolbar.getControl('AwesomeExtensionsToolbar');
        if (!this._group) {
            this._group = new Autodesk.Viewing.UI.ControlGroup('AwesomeExtensionsToolbar');
            this.viewer.toolbar.addControl(this._group);
        }

        // Add a new button to the toolbar group
        this._button = new Autodesk.Viewing.UI.Button('DockingQuantityButton');
        
        this._button.onClick = (ev) => {
            // // Check if the panel is created or not
            if (this._panel == null) {
                this._panel = new ModelSummaryPanel(this.viewer, this.viewer.container, 'quantityChartPanel', 'Quantity Chart');
            }
            
            // Show/hide docking panel
            this._panel.setVisible(!this._panel.isVisible());

            // If panel is NOT visible, exit the function
            if (!this._panel.isVisible())
                return;

                // this.viewer.search('Rooms', (idArray) => {
                //     console.log('Rooms numbers in this floor: '+ idArray.length);

                //     $.each(idArray, (num, dbId) => {
                //         this.viewer.getProperties(dbId, (propData) => {
                            
                //             propData.properties.filter((item) => {
                                
                //                 return (item.displayName === 'Layer' && item.displayValue === _specificFloorName);
                                
                //             })
                //         })
                //     })
                // })

                this.getAllLeafComponents((dbIds) => {
                    let count = dbIds.length;
                    let filteredProps = ['Material'];

                    this.viewer.model.getBulkProperties(dbIds, filteredProps, (items) => {
                        items.forEach((item) => {
                            item.properties.forEach(function (prop){
                                
                                if (filteredProps[prop.displayName] === undefined){
                                    filteredProps[prop.displayName] = {};
                                    console.log(filteredProps[prop.displayName]);
                                }
                                if (filteredProps[prop.displayName][prop.displayValue] === undefined){
                                    filteredProps[prop.displayName][prop.displayValue] = 1;
                                    console.log(filteredProps[prop.displayName][prop.displayValue]);
                                
                                }else {
                                    filteredProps[prop.displayName][prop.displayValue] += 1;
                                }
                            });
                        });

                        filteredProps.forEach((prop) => {
                            if (filteredProps[prop] === undefined){
                                return;
                            }

                            Object.keys(filteredProps[prop]).forEach((val) => {
                            if (val !== 'Leather - Brown, Pebble'){
                                console.log(val, filteredProps[prop][val]);

                                this._panel.addProperty(val, filteredProps[prop][val], prop);

                                }
                            })
                        });
                    })

            })

        };
        this._button.setToolTip('Quantity Extension');
        this._button.addClass('dockingQuantityIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DockingQuantityButton', DockingQuantityButton);