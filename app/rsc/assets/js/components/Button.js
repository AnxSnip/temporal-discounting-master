// noinspection DuplicatedCode

import Button from "../shapes/button.js";
import tdGame from "../tdGame.js";

class Button {
    constructor(x, y, w, h, radius, context) {
        this.w = w;
        this.h = h;
        this.bottom = y + h / 2;
        this.top = y - h / 2;
        this.right = x + w / 2;
        this.left = x - w / 2;
        this.radius = radius;
        this.highlight = false;
        //this.selectable = selectable;
        //this.selected = false;
        this.ctx = context; //necessary because of different canvas
    }

    draw() {
        if (this.highlight) {
            this.ctx.fillStyle = UNLOCK_BUTTON_COLOR_LIT;
        } else {
            this.ctx.fillStyle = UNLOCK_BUTTON_COLOR;
        }
        this.ctx.beginPath();
        this.ctx.strokeStyle = UNLOCK_BUTTON_COLOR_STROKE;
        this.ctx.lineWidth = "4";
        this.ctx.moveTo(this.left + this.radius, this.top);
        this.ctx.lineTo(this.right - this.radius, this.top);
        this.ctx.quadraticCurveTo(this.right, this.top, this.right, this.top + this.radius);
        this.ctx.lineTo(this.right, this.bottom - this.radius);
        this.ctx.quadraticCurveTo(this.right, this.bottom, this.right - this.radius, this.bottom);
        this.ctx.lineTo(this.left + this.radius, this.bottom);
        this.ctx.quadraticCurveTo(this.left, this.bottom, this.left, this.bottom - this.radius);
        this.ctx.lineTo(this.left, this.top + this.radius);
        this.ctx.quadraticCurveTo(this.left, this.top, this.left + this.radius, this.top);
        this.ctx.fill();
        this.ctx.stroke();
    }

    contains(x, y) {
        //method wich return true if (x,y) inside of the square
        return x > this.left && x < this.right && y > this.top && y < this.bottom;
    }
}
