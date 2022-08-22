import Triangle from "./triangle.js"
import Circle from "./circle.js";
import Square from "./square.js";
import Cross from "./cross.js";

import Diamond from "./diamond.js";
import X from "./x_shape.js";
import Star from "./star.js";
import Hexagon from "./hexagon.js";
import Ring from "./ring.js";
import Quatrefoil from "./quatrefoil.js";

class ShapeFactory{
    static shapeFromName(shapeName, x, y, minSize, selectable, context){
        switch(shapeName){
            case "Triangle":
                return new Triangle(x, y, minSize, selectable, context)
            case "Circle":
                return new Circle(x, y, minSize, selectable, context)
            case "Square":
                return new Square(x, y, minSize, selectable, context)
            case "Cross":
                return new Cross(x, y, minSize, selectable, context)
            case "Diamond":
                return new Diamond(x, y, minSize, selectable, context)
            case "X":
                return new X(x, y, minSize, selectable, context)
            case "Star":
                return new Star(x, y, minSize, selectable, context)
            case "Hexagon":
                return new Hexagon(x, y, minSize, selectable, context)
            case "Ring":
                return new Ring(x, y, minSize, selectable, context)
            case "Quatrefoil":
                return new Quatrefoil(x, y, minSize, selectable, context)
            default:
                console.log('Unknown shape specified: ' + shapeName)
        }
    }
}
export default ShapeFactory