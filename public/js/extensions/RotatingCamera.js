class RotatingCamera extends Autodesk.Viewing.Extension {
    constructor(viewer, options) {
        super(viewer, options);
        this._group = null;
        this._button = null;
    }

    load() {
        console.log('RotatingCamera Extension has been loaded');
        return true;
    }

    unload() {
        // Clean our UI elements if we added any
        if (this._group) {
            this._group.removeControl(rotationButton);
            if (this._group.getNumberOfControls() === 0) {
                this.viewer.toolbar.removeControl(this._group);
            }
        }
        console.log('RotatingCamera Extension has been unloaded');
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


        let rotationButton = this.createButton(
            'rotationButtonExtensionButton',
            'Rotate Camera Extension',
            'toolbarCameraRotation',
        )

        let started = false;
        let rotateCamera = () => {
            if (started) {
                requestAnimationFrame(rotateCamera);
            }

            const nav = this.viewer.navigation;
            const up = nav.getCameraUpVector();
            const axis = new THREE.Vector3(0, 0, 1);
            const speed = 10.0 * Math.PI / 180;
            const matrix = new THREE.Matrix4().makeRotationAxis(axis, speed * 0.1);

            let pos = nav.getPosition();
            pos.applyMatrix4(matrix);
            up.applyMatrix4(matrix);
            nav.setView(pos, new THREE.Vector3(0, 0, 0));
            nav.setCameraUpVector(up);
            let viewState = this.viewer.getState();
       };

       rotationButton.onClick = (ev) => {

            started = !started;
            if (started){
                rotateCamera();
            }
        }


        this._group.addControl(rotationButton);
    }
}

Autodesk.Viewing.theExtensionManager.registerExtension('RotatingCamera', RotatingCamera);