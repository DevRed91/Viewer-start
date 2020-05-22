class ModelSummaryPanel extends Autodesk.Viewing.UI.PropertyPanel {
    constructor(viewer, container, id, title, options) {
        super(container, id, title, options);
        this.viewer = viewer;

        this.container.style.top = "10px";
        this.container.style.left = "10px";
        this.container.style.width = "600";
        this.container.style.height = "600";
        this.container.style.resize = "auto";
        this.container.style.backgroundColor = 'rgba(255, 255, 255, 0.75)';

    }
   
}