///////////////////////////////
//Docking Panel
///////////////////////////////
class MyQuantityPanel extends Autodesk.Viewing.UI.DockingPanel{
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
        this.container.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';

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
        canvas.id = 'barChart';
        this.container.appendChild(canvas);

    }
}