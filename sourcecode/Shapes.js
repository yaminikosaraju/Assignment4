/* This sections contains the main functions used to
    manage the shapes and their operations

    Student Name: Delano Thomas | Yamini Kosaraju
    Student ID: 201990704 | 201892752
    Student Email: dmthomas@mun.ca | ykosaraju@mun.ca
    Course: Computer Graphics - COMP6909
    Assignment 3: Transformation, Navigation and Projections.

*/

class Shapes {

    constructor() {

        this.shape1 = [];
        this.shape2 = [];
        this.shape3 = [];
        this.shape4 = [];
        this.shape5 = [];

        this.shape1Indices = []
        this.shape2Indices = []
        this.shape3Indices = []
        this.shape4Indices = []
        this.shape5Indices = []

        this.shape1Color = vec4(1, 0, 0, 1.0);
        this.shape2Color = vec4(0, 1, 0, 1.0);
        this.shape3Color = vec4(1,0,1,1);
        this.shape4Color = vec4(0, 0, 1.0, 1.0);
        this.shape5Color = vec4(0, 0, 0, 1.0);

        this.shape1Pos = [0.5, -0.5, -0.2];
        this.shape2Pos = [-0.4, -0.1, 0];
        this.shape3Pos = [0.2, 0.2, -0.5]; 
        this.shape4Pos = [-0.7, 0.45, 0.5];
        this.shape5Pos = [0.1, -0.5, 0.7];

        this.shape1Motion = true;
        this.shape2Motion = true;
        this.shape3Motion = true; 
        this.shape4Motion = true;
        this.shape5Motion = true;

        this.theta = 0;
        this.rotate = rotate(this.theta,[0,0,1])        //Rotate about the z-axis
        this.noScale = vec3(1, 1, 1)                    //No Scaling - back to default
        this.uniformScale = vec3(0.5, 0.5, 0.5)         //Uniform Scaling
        this.nonUniformScale = vec3(0.9, 0.1, 0.6)      //Uniform Scaling
        this.translateToB = vec3(-0.7, 0.0, -0.8)        //Translate to point (-0.7,0,0.1)
        this.translateToA = vec3(0, 0.0, 0)             //Translate back to original point

        //Manage the last transformation on object
        this.shape1Transform = this.rotate;
        this.shape2Transform = this.randomTranslate();
        this.shape3Transform = this.nonUniformScale;
        this.shape4Transform = this.uniformScale;
        this.shape5Transform = this.translateToB;
    }

    //Build the shapes
    buildShapes() {

        //Create number 1 vertices and indices
        this.create1();
        this.shape1Indices = this.createIndices(this.shape1)

        //Create number 2 vertices and indices
        this.create2();
        this.shape2Indices = this.createIndices(this.shape2)

        //Create number 3 vertices and indices
        this.create3();
        this.shape3Indices = this.createIndices(this.shape3)

        //Create number 4 vertices and indices
        this.create4();
        this.shape4Indices = this.createIndices(this.shape4)

        //Create number 5 vertices and indices
        this.create5();
        this.shape5Indices = this.createIndices(this.shape5)

    }

    //Create semi-circles used to build some numbers
    createArc(innerR, outerR, center, angle, numVertices){

        //Array to house points on both semi-circles from 20
        let innerVetices = []
        let outerVetices = []
        let maxAngle = Math.PI * angle

        //Create upper points on both semi-circles
        for (let i = 0; i < numVertices; i++) {

            innerVetices.push(vec3((center[0] + innerR * Math.cos(maxAngle * i / numVertices)) * -1,
                center[1] + innerR * Math.sin(maxAngle * i / numVertices), 0.1))

            outerVetices.push(vec3((center[0] + outerR * Math.cos(maxAngle * i / numVertices)) * -1,
                center[1] + outerR * Math.sin(maxAngle * i / numVertices), 0.1))
        }

        //Arrange points in alternating order which will create the triangles
        let circleTop = [];
        for (let i = 0; i < innerVetices.length; i++) {

            circleTop.push(innerVetices[i])
            circleTop.push(outerVetices[i])
        }

        //Format array points in the arc to facilitate square mapping later
        let frontOfShape = []
        let numInArc = circleTop.length
        frontOfShape.push(circleTop[0], circleTop[1])
        for (let i=2; i<(numInArc -2); i+=2) {

            frontOfShape.push(circleTop[i], circleTop[i + 1])
            frontOfShape.push(circleTop[i], circleTop[i + 1])
        }
        frontOfShape.push(circleTop[numInArc - 2], circleTop[numInArc - 1])

        return frontOfShape
    }

    //Create indices for a shape provided - inputs are generally rectangles
    createIndices(vertices) {

        let indices = []
        let midOfArray = Math.floor(vertices.length / 2)

        //Go through the vertices and pull 4 vertices from
        //the start and 4 from the second half of vertices
        //Will create cubes from both pieces
        for (let i = 0; i < midOfArray; i += 4) {

            let j = midOfArray + i

            //Front
            indices.push(i, i+1, i + 3)
            indices.push(i + 3, i + 2, i)
            
            //Back
            indices.push(j + 1, j, j + 3)
            indices.push(j + 3, j , j+2)

            //Left
            indices.push(i, j, j + 1)
            indices.push(j + 1, i+1, i)

            //Right
            indices.push(i + 2, i + 3, j + 3)
            indices.push(j + 3, j + 2, i + 2)

            //Top
            indices.push(i, i + 2, j + 2)
            indices.push(j+2, j, i)

            //Bottom
            indices.push(i+1, j+1, j + 3)
            indices.push(j+3, i + 3, i+1)
            
        }

        //Return new indices
        return indices
    }

    //Create a random Matrix where shape will transalated to
    randomTranslate() {

        let x = (Math.random() * (1 - (-1)) + (-1)).toFixed(1);
        let y = (Math.random() * (1 - (-1)) + (-1)).toFixed(1);
        let z = (Math.random() * (1 - (-1)) + (-1)).toFixed(1);

        return translate(x, y, z);
    }

    //Create shape1
    create1() {

        //Pieces of the shape
        let base = [vec3(0.1, 0.2, 0.1),
                    vec3(0.1, 0, 0.1),
                    vec3(0.7, 0.2, 0.1),
                    vec3(0.7, 0, 0.1)];

        let shaft = [vec3(0.3, 1, 0.1),
                    vec3(0.5, 1, 0.1),
                    vec3(0.3, 0, 0.1),
                    vec3(0.5, 0, 0.1)];

        let diag = [vec3(0.3, 1, 0.1),
                    vec3(0.3, 0.8, 0.1),
                    vec3(0, 0.7, 0.1),
                    vec3(0.15, 0.65, 0.1)];

        //Front side of the shape
        let frontOfShape = base.concat(shaft, diag);

        //Back side of shape is 0.1 unit away from front in the z direction
        let backOfShape = []
        for (let i = 0; i < frontOfShape.length; i++) {

            backOfShape.push(vec3(frontOfShape[i][0], frontOfShape[i][1], frontOfShape[i][2] -0.1))
        }

        //Shape before it is instanciated
        this.shape1 = frontOfShape.concat(backOfShape);

    }


    //Create shape2
    create2() {

        //Building main pieces of shape
        let arc = this.createArc(0.3, 0.5, vec2(-0.5,0.5), 1.35, 60)

        let diag = [vec3(0.77, 0.405, 0.1),
        vec3(0.95, 0.32, 0.1),
        vec3(0, -0.2, 0.1),
        vec3(0.25, -0.2, 0.1)];

        let base = [vec3(0, -0.2, 0.1),
        vec3(0, -0.4, 0.1),
        vec3(1, -0.2, 0.1),
        vec3(1, -0.4, 0.1)];
        
        diag = [vec3(0.655, 0.2445, 0.1),
                vec3(0.758, 0.0725, 0.1),
                vec3(0, -0.2, 0.1),
                vec3(0.37, -0.2, 0.1)]

        //Front side of the shape
        let frontOfShape = arc.concat(diag,base)

        //Back side of shape is 0.1 unit away from front in the z direction
        let backOfShape = []
        for (let i = 0; i < frontOfShape.length; i++) {

            backOfShape.push(vec3(frontOfShape[i][0], frontOfShape[i][1], frontOfShape[i][2] -0.1))
        }

        //Shape before it is instanciated
        this.shape2 = frontOfShape.concat(backOfShape);
    }


    //Create shape3
    create3() {
        
        //Building main pieces of shape
        let upperArc = this.createArc(0.15, 0.25, vec2(-0.25,0.7), 1.53, 60)
        let lowerArc = this.createArc(0.15, 0.25, vec2(-0.25, 0.3), -1.53, 60)

        //Front side of the shape
        let frontOfShape = lowerArc.concat(upperArc)

        //Back side of shape is 0.1 unit away from front in the z direction
        let backOfShape = []
        for (let i = 0; i < frontOfShape.length; i++) {

            backOfShape.push(vec3(frontOfShape[i][0], frontOfShape[i][1], frontOfShape[i][2] -0.1))
        }

        //Shape before it is instanciated
        this.shape3 = frontOfShape.concat(backOfShape);

    }

    //Create shape4
    create4() {

        //Front of Shape
        let base = [vec3(0.2, 0.3, 0.1),
        vec3(0, 0.1, 0.1),
        vec3(0.8, 0.3, 0.1),
        vec3(0.8, 0.1 , 0.1)];

        let shaft = [vec3(0.5, 1, 0.1),
        vec3(0.7, 1, 0.1),
        vec3(0.5, 0, 0.1),
        vec3(0.7, 0, 0.1)]

        let diag = [vec3(0.5, 1, 0.1),
        vec3(0.5, 0.7, 0.1),
        vec3(0, 0.1, 0.1),
        vec3(0.2, 0.1, 0.1)]

        //Front side of the shape
        let frontOfShape = base.concat(shaft, diag);

        //Back side of shape is 0.1 unit away from front in the z direction
        let backOfShape = []
        for (let i = 0; i < frontOfShape.length; i++) {

            backOfShape.push(vec3(frontOfShape[i][0], frontOfShape[i][1], frontOfShape[i][2] -0.1))
        }
        
        //Shape before it is instanciated
        this.shape4 = frontOfShape.concat(backOfShape);
    }

    //Create shape5
    create5() {

        //Building main pieces of shape
        //let topArc = this.createArc(0.3, 0.5, vec2(0, -0.4), 0.55, 60)
        //let botArc = this.createArc(0.3, 0.5, vec2(0, -0.4), -0.55, 60)

        let topArc = this.createArc(0.2, 0.4, vec2(0.5, 0.2), 0.55, 60)
        let botArc = this.createArc(0.2, 0.4, vec2(0.5, 0.2), -0.55, 60)

        //Front of Shape
        let top = [vec3(0.4, 1, 0.1),
                    vec3(0.4, 0.8, 0.1),
                    vec3(0.9, 1, 0.1),
                    vec3(0.9, 0.8, 0.1)];

        let shaft = [vec3(0.4, 1, 0.1),
                    vec3(0.58, 1, 0.1),
                    vec3(0.4, 0.4, 0.1),
                    vec3(0.58, 0.4, 0.1)];
        
        let arc = topArc.concat(botArc)

        //Invert arc on y-axis
        let finalArc = []
        for(let i=0; i<arc.length; i++){

            finalArc.push(vec3(arc[i][0] *-1, arc[i][1], arc[i][2]))
        }

        //Front side of the shape
        let frontOfShape = top.concat(shaft,finalArc)

        //Back side of shape is 0.1 unit away from front in the z direction
        let backOfShape = []
        for (let i = 0; i < frontOfShape.length; i++) {

            backOfShape.push(vec3(frontOfShape[i][0], frontOfShape[i][1], frontOfShape[i][2] -0.1))
        }
        
        //Shape before it is instanciated
        this.shape5 = frontOfShape.concat(backOfShape);
    }

}
