// import { AuthClientThreeLegged } from "forge-apis";

AutodeskNamespace("Autodesk.ADN.Viewing.Extension");

Autodesk.ADN.Viewing.Extension.Toolbar = function (viewer, options) {

  Autodesk.Viewing.Extension.call(this, viewer, options);

  let _this = this;

  let _elementIds = [];

  let _canvasId = null;

  let _components = null;

  let _graphType = 'pie';

  let _propName = 'label';


  _this.load = function () {

    createDivToolbar();

    console.log('Autodesk.ADN.Viewing.Extension.Toolbar loaded');

    return true;
  };

  _this.unload = function(){
    
    // deleteToolbar();

    console.log('Autodesk.ADN.Viewing.Extension.Toolbar loaded');

    return true;

  }

  function createOverlay(canvasId){
    let html = [
      '<canvas class= "graph id = "' + canvasId + '" width = "300 height = "300">', 
      '</canvas>',
    
    ].join('\n');

    $(viewer.container).append(html);
  }

  function mapComponentsByPropName (propName, components, onResult){
    let componentsMap = {};

    async.each(components, 
      function (component, callback){
        getPropertyValue(component.dbId, propName, function (value){
          if (propName === 'label'){
            value = value.split(':')[0];
          }

          if (!componentsMap[value]){
            componentsMap[value] = [];
          }

          componentsMap[value].push(component.dbId);

          callback();

        });
      }, function (err){
        onResult(componentsMap);
      })
  }

  function getAvailableProperties(components, onResult){
    let propertiesMap = {};

    async.each(components, (component, callback) => {
         viewer.getProperties(component.dbId, function (result){
           for (let i = 0; i < result.properties.length; i++){
             let prop = result.properties[i];

             propertiesMap[prop.displayName] = {};
           }

           callback();
         })
    }, function (err){
        onResult(Object.keys(propertiesMap));
    })
  }

  function createButton(id,tooltip) {
    var button = new Autodesk.Viewing.UI.Button(id);
    button.setToolTip(tooltip);
    return button;
  }


  function getAllLeafComponents(viewer, callback) {
    // store the results
    let tree; // the instance tree

    function getLeafComponentsRec(parent) {
      let components = []; 
        
      if (typeof parent.children !== 'undefined'){
	      for (let i = 0; i < parent.children.length; i++){
            let children = parent.children;
            let child = children[i];
            console.log(child);
            
            if (typeof child.children !== 'undefined'){
            let subComps = getLeafComponentsRec(child);
            console.log(subComps);
            
            components.push.apply(components, subComps);
            console.log(components);
            }  
            else {
              components.push(child);
              console.log(components);
             }       
          }
       }
        return components;
    }
    viewer.getObjectTree(function (objectTree) {
        tree = objectTree;
        var allLeafComponents = getLeafComponentsRec(tree.getRootId());
         console.log(allLeafComponents);
    });
};

  function getPropertyValue(dbId, displayName, callback){
    function _cb(result){
      if(result.properties){
        for (let i = 0; i < result.properties.length; i++){
          let prop = result.properties[i];

          if (prop.displayName === displayName){

            callback(prop.displayValue);

            return;
          }
        }

        callback('undefined');
      }
    }
    viewer.getProperties(dbId, _cb);
  }

  function guid() {

    var d = new Date().getTime();

    var guid = 'xxxx-xxxx-xxxx-xxxx'.replace(
      /[xy]/g,
      function (c) {
        var r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        return (c == 'x' ? r : (r & 0x7 | 0x8)).toString(16);
      });

    return guid;
  };

  // let started = false;
  // function rotateCamera(){
  //   if (started){
  //     requestAnimationFrame(rotateCamera);
  //   }

    // const nav = _viewer.navigation;
    // const up = nav.getCameraUpVector();
    // const axis = new THREE.Vector3(0, 0, 1);
    // const speed = 10 * Math.PI/ 100;
    // const matrix = new THREE.Matrix4().makeRotatetionAxis(axis, speed * 0.1);

    // let pos = nav.getPosition();
    // pos.applyMatrix4(matrix);
    // up.applyMatrix4(matrix);
    // nav.setView(pos, new THREE.Vector3(0, 0, 0));
    // nav.setCameraUpVector(up);
    // let viewState = _viewer.getState();
  // }

  function createDivToolbar() {
    let toolbarDivHtml = document.createElement("div");
    toolbarDivHtml.id = "colorToolbar";

    $(viewer.container).append(toolbarDivHtml);
   
    var toolbar = new Autodesk.Viewing.UI.ToolBar(true);

    var sideButtons = new Autodesk.Viewing.UI.ControlGroup(
      "SIDEBUTTONS");

      // let redBtn = createButton(
      //   'RedButton',
      //   'Red Button'
      // )
      // redBtn.onClick = function(e){
      
      // }
      let blueBtn = createButton(
        'Blue-Button',
        'Blue Button');

    // sideButtons.addControl(redBtn);
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

    