// import { AuthClientThreeLegged } from "forge-apis";

AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.Toolbar = function (viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);

  var _viewer = viewer;

  var _this = this;


  _this.load = function () {

    createDivToolbar();

    console.log('Autodesk.ADN.Viewing.Extension.Toolbar loaded');

    return true;
  };

  function createButton(id,tooltip) {
    var button = new Autodesk.Viewing.UI.Button(id);
    button.setToolTip(tooltip);
    return button;
  }

  let started = false;

  function rotateCamera(){
    if (started){
      requestAnimationFrame(rotateCamera);
    }

    const nav = _viewer.navigation;
    const up = nav.getCameraUpVector();
    const axis = new THREE.Vector3(0, 0, 1);
    const speed = 10 * Math.PI/ 100;
    const matrix = new THREE.Matrix4().makeRotatetionAxis(axis, speed * 0.1);

    let pos = nav.getPosition();
    pos.applyMatrix4(matrix);
    up.applyMatrix4(matrix);
    nav.setView(pos, new THREE.Vector3(0, 0, 0));
    nav.setCameraUpVector(up);
    let viewState = _viewer.getState();
  }

  function createDivToolbar() {
    let toolbarDivHtml = document.createElement("div");
    toolbarDivHtml.id = "colorToolbar";

    $(_viewer.container).append(toolbarDivHtml);
   
    var toolbar = new Autodesk.Viewing.UI.ToolBar(true);

    var sideButtons = new Autodesk.Viewing.UI.ControlGroup(
      "SIDEBUTTONS");

      let redBtn = createButton(
        'RedButton',
        'Red Button'
      )
      redBtn.onClick = function(e){
        if (started = !started){
          if (started){
            rotateCamera();
          }
        }
      }
      let blueBtn = createButton(
        'Blue-Button',
        'Blue Button');

    sideButtons.addControl(redBtn);
    sideButtons.addControl(blueBtn);

    toolbar.addControl(sideButtons);

    $('#colorToolbar')[0].appendChild(
      toolbar.container);
  }
};
 
Autodesk.ADN.Viewing.Extension.Toolbar.prototype = Object.create(Autodesk.Viewing.Extension.prototype);

Autodesk.ADN.Viewing.Extension.Toolbar.prototype.constructor = Autodesk.ADN.Viewing.Extension.Toolbar;

Autodesk.Viewing.theExtensionManager.registerExtension(
    'Autodesk.ADN.Viewing.Extension.Toolbar', 
    Autodesk.ADN.Viewing.Extension.Toolbar);

    