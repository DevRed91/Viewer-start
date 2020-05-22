
class DockingQuantityButton extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
        this._modelData = {};
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
        viewer.getObjectTree(function (tree) {
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

    drawChart(propertyName){
        let getLabels = (propertyName) => {
            return Object.keys(this._modelData[propertyName]);
        }
        let getCountInstances = (propertyName) => {
                return Object.keys(this._modelData[propertyName]).map((key) => this._modelData[propertyName][key].length);
        }

        let ctx = document.getElementById('barChart');

        let dataSet = getCountInstances(propertyName);
        console.log(dataSet);
        let colors = this.dynamicColors(getLabels(propertyName).length);
        new Chart(ctx, {
                // The type of chart we want to create
                type: 'bar',
    
                // The data for our dataset
                data: {
                    labels: getLabels(propertyName),
                    datasets: [{
                        label: 'Space Demarcation',
                        backgroundColor: colors.background,
                        borderColor: colors.borders,
                        borderWidth: 1,
                        data: dataSet
                    }]
                },
    
                // Configuration options go here
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                beginAtZero: true
                            }
                        }]
                    }
                },
                legend: {
                    display: false
                },
            });
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
                this._panel = new MyQuantityPanel(this.viewer, this.viewer.container, 'quantityChartPanel', 'Quantity Chart');
            }
            // Show/hide docking panel
            this._panel.setVisible(!this._panel.isVisible());

            // If panel is NOT visible, exit the function
            if (!this._panel.isVisible())
                return;

                this.getAllLeafComponents((dbIds) => {
                    let count = dbIds.length;
                    dbIds.forEach((dbId) => {
                        this.viewer.getProperties(dbId, (props) => {
                            props.properties.forEach((prop) => {
                                // console.log(prop.length);
                                if (!isNaN(prop.displayValue)) return; // let's not categorize properties that store numbers

                                // // some adjustments for revit:
                                prop.displayValue = prop.displayValue.replace('Revit ', ''); // remove this Revit prefix
                                
                                // //console.log(prop.displayValue);
                                if (prop.displayValue.indexOf('<') == 0) return; // skip categories that start with <

                                // //console.log(prop);
                                // // ok, now let's organize the data into this hash table
                                if (this._modelData[prop.displayName] == null) this._modelData[prop.displayName] = {};
                                if (this._modelData[prop.displayName][prop.displayValue] == null) this._modelData[prop.displayName][prop.displayValue] = [];
                                this._modelData[prop.displayName][prop.displayValue].push(dbId);

                                if (prop.displayName === 'Category'){

                                        // if(prop.displayValue === 'Walls'|| prop.displayValue === 'Doors'){
                                            // for (let i = 0; i < prop.displayValue.length; i++){
                                            console.log(count);
                                            console.log(prop.displayName, prop.displayValue.replace('Revit ', ''));
                                        // }
                                        
                                        // console.log(Object.keys(this._modelData[prop.displayName]));
                                        // console.log(Object.keys(this._modelData[prop.displayName][prop.displayValue]));
                                        // console.log(Object.keys(this._modelData[prop.displayName]).map((key) => this._modelData[prop.displayName][key].length));
                                    // this.drawChart(prop.displayName);
                                //    }

                                }

                            })
                            //if ((--count) == 0) this.callback();

                                
                        })
                    })
                })

        };
        this._button.setToolTip('Quantity Extension');
        this._button.addClass('dockingQuantityIcon');
        this._group.addControl(this._button);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('DockingQuantityButton', DockingQuantityButton);
