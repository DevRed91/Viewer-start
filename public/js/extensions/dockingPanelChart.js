///////////////////////////////
//Docking Panel button
///////////////////////////////
class DockingChartButton extends Autodesk.Viewing.Extension {
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

    createButton(id, tooltip, addClass){
        let button = new Autodesk.Viewing.UI.Button(id);

    //button.icon.style.backgroundColor = color;
        button.setToolTip(tooltip);
        button.addClass(addClass);

        return button;

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

    drawChart(){
        let ctx = document.getElementById('pieChart');
        let dataSet = [60, 10, 20, 10]
        let colors = this.dynamicColors(dataSet.length);
        
        new Chart(ctx, {
            // The type of chart we want to create
            type: 'doughnut',

            // The data for our dataset
            data: {
                labels: ['Workspace', 'Collab', 'Service', 'Corridors'],
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
            'DockingChartButton',
            'Chart Extension',
            'dockingChartButtonIcon',
        )

        dockingButton.onClick = (ev) => {
            // Check if the panel is created or not
            if (panel == null) {
                panel = new MyChartPanel(viewer, viewer.container, 'descriptionPanel', 'Spaces Demarcation');
            }
            // Show/hide docking panel
            panel.setVisible(!panel.isVisible());

            // If panel is NOT visible, exit the function
            if (!panel.isVisible())
                return;

                this.drawChart();


        }
        
        this._group.addControl(dockingButton);
    }
        
}

Autodesk.Viewing.theExtensionManager.registerExtension('DockingChartButton', DockingChartButton);