///////////////////////////////
//Docking Panel
///////////////////////////////
class MyAwesomePanel extends Autodesk.Viewing.UI.DockingPanel{
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        
        this.viewer = viewer;

        // // the style of the docking panel
        // this.container.classList.add('docking-panel-container-solid-color-a');
        this.container.style.top = "10px";
        this.container.style.left = "10px";
        this.container.style.width = "600";
        this.container.style.height = "600";
        this.container.style.resize = "auto";
        this.container.style.backgroundColor = 'rgba(0, 0, 0, 0.75)';

        //this is where we should place the content of our panel
        this._container = document.createElement('div');
        this._container.style.position = 'absolute';
        this._container.style.left = '0';
        this._container.style.top = '50px';
        this._container.style.width = '100%';
        // this._container.style.height = '100%'; // 400px - 50px (title bar) - 20px (footer)
        this.container.appendChild(this._container);

        let canvas = document.createElement('canvas');
        canvas.style.width = '100%';
        // canvas.style.height = '100%';
        canvas.id = 'pieChart';

        // div.innerText = 'My content here';
        // let ctx = document.getElementById('pieChart');
        // let chart = new Chart(ctx, {
        //     // The type of chart we want to create
        //     type: 'line',

        //     // The data for our dataset
        //     data: {
        //         labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
        //         datasets: [{
        //             label: 'My First dataset',
        //             backgroundColor: 'rgb(255, 99, 132)',
        //             borderColor: 'rgb(255, 99, 132)',
        //             data: [0, 10, 5, 2, 20, 30, 45]
        //         }]
        //     },

        //     // Configuration options go here
        //     options: {}
        // });
        this.container.appendChild(canvas);
        // // and may also append child elements...


    }
}


///////////////////////////////
//Docking Panel button
///////////////////////////////
class DockingPanelButton extends Autodesk.Viewing.Extension {
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

    drawRectangle(){
        let ctx = document.getElementById('pieChart');
        let chart = new Chart(ctx, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
                labels: ['Workspace', 'Collab', 'Service', 'Corridors'],
                datasets: [{
                    label: 'Space Demarcation',
                    backgroundColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                        
                    ],
                    borderColor: [
                        'rgba(255, 99, 132, 1)',
                        'rgba(54, 162, 235, 1)',
                        'rgba(255, 206, 86, 1)',
                        'rgba(75, 192, 192, 1)'
                    ],
                    data: [60, 10, 20, 10]
                }]
            },

            // Configuration options go here
            options: {
                labels:{
                    fontColor: 'white'
                }
            }
        });
    }

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

        let dockingButton = this.createButton(
            'DockingButton',
            'Docking Extension',
            'dockingButtonIcon',
        )

        dockingButton.onClick = (ev) => {
            // Check if the panel is created or not
            if (panel == null) {
                panel = new MyAwesomePanel(viewer, viewer.container, 'descriptionPanel', 'Description');
            }
            // Show/hide docking panel
            panel.setVisible(!panel.isVisible());

            // If panel is NOT visible, exit the function
            if (!panel.isVisible())
                return;

                this.drawRectangle();

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
        
        this._group.addControl(dockingButton);
    }
        
}

Autodesk.Viewing.theExtensionManager.registerExtension('DockingPanelButton', DockingPanelButton);