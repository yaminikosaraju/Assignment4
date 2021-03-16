/* This sections contains the main functions used interact with the 
    scene, its creation, rendering and changes from pressed keys.

    Student Name: Delano Thomas | Yamini Kosaraju
    Student ID: 201990704 | 201892752
    Student Email: dmthomas@mun.ca | ykosaraju@mun.ca
    Course: Computer Graphics - COMP6909
    Assignment 3: Transformation, Navigation and Projections.

*/

//Base components
var gl;
var program;

//Projection view data
var near = 0.001;
var far = 100;
var fov = 120;
var aspectRatio;

//Model view data
var eye = vec3(0,0,1.8);
var at = vec3(0.0, 0.0, 0.0);
var up = vec3(0.0, 1.0, 0.0);

//Projection View in Use
var currentView = [];

window.onload = function init() {

    var canvas = document.getElementById("gl-canvas");
    gl = WebGLUtils.setupWebGL(canvas);

    if (!gl) {
        alert("WebGL isn't available");
    }

    // Configure WebGL
    gl.viewport(0, 0, canvas.width, canvas.height);
    //gl.clearColor(1.0, 1.0, 1.0, 1.0);
    gl.clearColor(0.777, 0.703, 0.457, 1);

    //Enable depth buffer
    gl.enable(gl.DEPTH_TEST);

    // Load shaders and initialize attribute buffers
    program = initShaders(gl, "vertex-shader", "fragment-shader");
    gl.useProgram(program);

    //Call the Shape class and its objects
    Shapes = new Shapes();
    Shapes.buildShapes();

    //Set default viewing variables
    aspectRatio = canvas.width / canvas.height;

    //Setup viewing matrices
    modelViewMatrix = lookAt(eye, at, up);
    orthoView = ortho(-1, 1, -1, 1, -5, 5);                         //Orthographic veiw
    perspectiveView = perspective(fov, aspectRatio, near, far)      //Perspective view
    currentView = perspectiveView;                                  //Default view will be perspective

    //render the shapes
    render();

};


//Read the Key pressed and affect the system settings
window.onkeypress = function keyPressed(Event) {

    console.log(Event.key)
    //Verify the key pressed and update the Shape variable
    switch (Event.key) {

        case '1':
            //Toggling the object's motion
            Shapes.shape1Motion = !Shapes.shape1Motion;
            document.getElementById("keyPressedTextArea").value += "You pressed 1 - Toggle the animation of object 1\n";
            break;

        case '2':
            //Toggling the object's motion
            Shapes.shape2Motion = !Shapes.shape2Motion;
            document.getElementById("keyPressedTextArea").value += "You pressed 2 - Toggle the animation of object 2\n";
            break;

        case '3':
            //Toggling the object's motion
            Shapes.shape3Motion = !Shapes.shape3Motion;
            document.getElementById("keyPressedTextArea").value += "You pressed 3 - Toggle the animation of object 3\n";
            break;

        case '4':
            //Toggling the object's motion
            Shapes.shape4Motion = !Shapes.shape4Motion;
            document.getElementById("keyPressedTextArea").value += "You pressed 4 - Toggle the animation of object 4\n";
            break;

        case '5':
            //Toggling the object's motion
            Shapes.shape5Motion = !Shapes.shape5Motion;
            document.getElementById("keyPressedTextArea").value += "You pressed 5 - Toggle the animation of object 5\n";
            break;

        case 'O':
        case 'o':
            //Toggling the scene's view
            currentView = orthoView;
            document.getElementById("keyPressedTextArea").value += "You pressed O - Switching to Orthographic view\n";
            break;

        case 'P':
        case 'p':
            //Toggling the scene's view
            currentView = perspectiveView;
            document.getElementById("keyPressedTextArea").value += "You pressed P - Switching to Perspective view\n";
            break;

        case 'W':
        case 'w':    
            //moving backward is translation backwards along the z
            eye[2] -= 0.1;
            document.getElementById("keyPressedTextArea").value += "You pressed W - Moving forward into the screen\n";
            break;            

        case 'A':
        case 'a':

            //moving backward is translation forward along the z
            eye[2] += 0.1;
            document.getElementById("keyPressedTextArea").value += "You pressed A - Moving backwards from the screen\n";
            break;

        case 'S':
        case 's':

            //Shift eye to the left by translation along the x
            eye[0] -= 0.1;
            document.getElementById("keyPressedTextArea").value += "You pressed S - Moving to the left\n";
            break;

        case 'D':
        case 'd':   
            
            //Shift eye to the right by translation along the x
            eye[0] += 0.1;
            document.getElementById("keyPressedTextArea").value += "You pressed D - Moving to the right\n";
            break;

        case 'E':
        case 'e':

            //Gazing upwards is changing the position of focus, this will be impacted on the y axis
            at[1] += 0.1;
            document.getElementById("keyPressedTextArea").value += "You pressed E - Looking upwards\n";
            break;

        case 'Q':
        case 'q':

            //Gazing downwards is changing the position of focus, this will be impacted on the y axis
            at[1] -= 0.1;
            document.getElementById("keyPressedTextArea").value += "You pressed Q - Looking downwards\n";
            break;
    }

    //Update modelview with new camera settings
    modelViewMatrix = lookAt(eye, at, up);

}


//Render the shape - Go through the list of shapes and render each
function render() {

    //Clear the colour and depth buffer
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    //Load data to GPU and draw the number 1 - Rotate the shape
    if (Shapes.shape1Motion) {

        Shapes.theta += 15;
        Shapes.shape1Transform = rotate(Shapes.theta, [0, 0, 1]);
    }
    let shape1Trans = mult(Shapes.shape1Transform, translate(Shapes.shape1Pos));
    loadGPU(Shapes.shape1, Shapes.shape1Indices, Shapes.shape1Color, shape1Trans, modelViewMatrix, currentView)
    gl.drawElements(gl.TRIANGLES, Shapes.shape1Indices.length, gl.UNSIGNED_SHORT, 0);


    //Load data to GPU and draw the number 2 - random translation of shape
    if (Shapes.shape2Motion) {

        Shapes.shape2Transform = Shapes.randomTranslate();
    }
    loadGPU(Shapes.shape2, Shapes.shape2Indices, Shapes.shape2Color, Shapes.shape2Transform, modelViewMatrix, currentView)
    gl.drawElements(gl.TRIANGLES, Shapes.shape2Indices.length, gl.UNSIGNED_SHORT, 0);


    //Load data to GPU and draw the number 3 - non-uniform Scaling
    if (Shapes.shape3Motion && Shapes.shape3Transform == Shapes.nonUniformScale) {

        //Create transform from non-uniform scale and shape's denstination
        Shapes.shape3Transform = Shapes.noScale;

    } else if (Shapes.shape3Motion && Shapes.shape3Transform == Shapes.noScale) {

        //Create transform from non-uniform scale and shape's denstination
        Shapes.shape3Transform = Shapes.nonUniformScale;

    } else {
        //Togged off: Do nothing - old scale will remain
    }
    let shape3Trans = mult(translate(Shapes.shape3Pos), scalem(Shapes.shape3Transform));
    loadGPU(Shapes.shape3, Shapes.shape3Indices, Shapes.shape3Color, shape3Trans, modelViewMatrix, currentView)
    gl.drawElements(gl.TRIANGLES, Shapes.shape3Indices.length, gl.UNSIGNED_SHORT, 0);


    //Load data to GPU and draw the number 4 - uniform Scaling
    if (Shapes.shape4Motion && Shapes.shape4Transform == Shapes.uniformScale) {

        Shapes.shape4Transform = Shapes.noScale;

    } else if (Shapes.shape4Motion && Shapes.shape4Transform == Shapes.noScale) {

        Shapes.shape4Transform = Shapes.uniformScale;

    } else {
        //Togged off: Do nothing - old scale will remain
    }
    let shape4Trans = mult(translate(Shapes.shape4Pos), scalem(Shapes.shape4Transform));
    loadGPU(Shapes.shape4, Shapes.shape4Indices, Shapes.shape4Color, shape4Trans, modelViewMatrix, currentView)
    gl.drawElements(gl.TRIANGLES, Shapes.shape4Indices.length, gl.UNSIGNED_SHORT, 0)

    //Load data to GPU and draw the number 5 - Move from point A to B and back
    if (Shapes.shape5Motion && Shapes.shape5Transform == Shapes.translateToB) {

        Shapes.shape5Transform = Shapes.translateToA;

    } else if (Shapes.shape5Motion && Shapes.shape5Transform == Shapes.translateToA) {

        Shapes.shape5Transform = Shapes.translateToB;
    } else {

    }
    let shape5Trans = mult(translate(Shapes.shape5Transform), translate(Shapes.shape5Pos));
    loadGPU(Shapes.shape5, Shapes.shape5Indices, Shapes.shape5Color, shape5Trans, modelViewMatrix, currentView)
    gl.drawElements(gl.TRIANGLES, Shapes.shape5Indices.length, gl.UNSIGNED_SHORT, 0);

    //Repeat the call
    setTimeout(render, 500);

}


//Load vertices, indicies and color into the GPU array.
function loadGPU(vertices, indices, color, transMat, modelViewMat, projectMat) {

    //Set colour for the shape
    var fColorLocation = gl.getUniformLocation(program, "fColor");
    gl.uniform4fv(fColorLocation, color)

    //Set transform model for the shape
    var transformLoc = gl.getUniformLocation(program, "transform");
    gl.uniformMatrix4fv(transformLoc, false, flatten(transMat))
    
    //Set transform model for the shape
    var mvMatrixLoc = gl.getUniformLocation(program, "modelViewMatrix");
    gl.uniformMatrix4fv(mvMatrixLoc, false, flatten(modelViewMat))

    //Set transform model for the shape
    var projMatrixLoc = gl.getUniformLocation(program, "projectionMatrix");
    gl.uniformMatrix4fv(projMatrixLoc, false, flatten(projectMat))  

    // indices element buffer
    var iBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, iBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), gl.STATIC_DRAW);

    // vertex array attribute buffer
    var vBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, flatten(vertices), gl.STATIC_DRAW);

    var positionLoc = gl.getAttribLocation(program, "vPosition");
    gl.vertexAttribPointer(positionLoc, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLoc);

}
