const HIGHLIGHT_COLOUR = "#ff5555";
const DEFAULT_COLOUR = "#55ddff";
const CORRECT_COLOUR = "#7FBA00";
const CANVAS_WIDTH = 1600;
const CANVAS_HEIGHT = 700;
const BUTTON_COLOUR = "lightgrey";
const BUTTON_HOVER_COlOUR = "darkgrey";


var drill;
var instructionContainer = document.getElementById("instructionContainer");
var instructions;


class InstructionIcon{
    constructor(stage){
        this.stage = stage
        this.container = new createjs.Container();
        this.container.x = CANVAS_WIDTH - 40;
        this.container.y = 40;

        this.shape = new createjs.Shape();
        this.shape.graphics.setStrokeStyle(6).beginStroke(BUTTON_COLOUR).beginFill("rgba(255,255,255,1)").drawCircle(0, 0, 20, 20);
        this.shape.x = 0;
        this.shape.y = 0;
        this.container.addChild(this.shape);

        this.text = new createjs.Text("", "bold 30px Arial", BUTTON_COLOUR).set({
            text: "i",
            textAlign:"center",
            textBaseline: "middle",
            x: 0,
            y: 2
        });
        this.container.addChild(this.text);

        this.container.addEventListener("click", () =>{showInstruction()})
        this.container.addEventListener("mouseover", () =>{
            this.shape.graphics.clear().setStrokeStyle(6).beginStroke(BUTTON_HOVER_COlOUR).beginFill("rgba(255,255,255,1)").drawCircle(0, 0, 20, 20);
            this.text.color = BUTTON_HOVER_COlOUR;
            this.stage.update();
        })
        this.container.addEventListener("mouseout", () =>{
            this.shape.graphics.clear().setStrokeStyle(6).beginStroke(BUTTON_COLOUR).beginFill("rgba(255,255,255,1)").drawCircle(0, 0, 20, 20);
            this.text.color = BUTTON_COLOUR;
            this.stage.update();
        })

        stage.addChild(this.container);
    }
}
class Button{
    constructor(x, y, text, stage){
        this.font = ["", "40px Arial", ""];
        this.container = new createjs.Container();

        this.stage = stage;

        this.shapeNode = new createjs.Shape();
        this.textNode = new createjs.Text(...this.font);
        this.container.addChild(this.shapeNode);
        this.container.addChild(this.textNode);
        
        this.textNode.set(
            {
                text: text,
                textAlign:"center",
                textBaseline: "middle",
                x: 100,
                y: 50,
            }
        )

        this.shapeNode.graphics.beginFill(BUTTON_COLOUR)
                                      .drawRect(0, 0, 200, 100)
                                      .endFill();

        this.shapeNode.addEventListener("mouseover", () =>{
            this.hoverOn();
        });

        this.shapeNode.addEventListener("mouseout", () =>{
            this.hoverOff();
        });

        this.container.x = x;
        this.container.y = y;
        this.stage.addChild(this.container);
    }

    hoverOn(){
        this.shapeNode
            .graphics.clear()
                .beginFill(BUTTON_HOVER_COlOUR)
                .drawRect(0, 0, 200, 100)
                .endFill();
            this.textNode.x = this.textNode.x - 1;
            this.textNode.y = this.textNode.y + 1;
            this.stage.update();
    }

    hoverOff(){
        this.shapeNode
            .graphics.clear()
                .beginFill(BUTTON_COLOUR)
                .drawRect(0, 0, 200, 100)
                .endFill();
            this.textNode.x = this.textNode.x + 1;
            this.textNode.y = this.textNode.y - 1;
            this.stage.update();
    }
}

class SelectionSortDrill{
    constructor(){
        this.numValues = 8
        this.cellWidth = 120;
        this.cellHeight = 120;
        this.count = 1;
        this.font = ["", "50px Arial", ""]
        this.description = "-Sort the list using inesrtion sort, after each " + 
        "iteration click on Check to varify if it was correct.\n\n" + 
        "-Click on two elements to swap them around.\n\n" +
        "-Click on New List to get a new list.\n\n" + 
        "-Click on Revert to undo changes made in the current iteration."
        
        
        this.stage = new createjs.Stage("canvas");
        this.stage.enableMouseOver();
        
        var list = randomList(this.numValues);
        this.steps = this.selectionSortAlg(this.randomiseList(list));

        this.select = [];
        this.nodes = [];
        
        this.drawInitial();
        this.stage.update();
    }

    randomiseList(list){
        list.sort(function(a, b){return a - b});

        var temp = [];
        for (let i = 1; i < list.length; i++){
            temp.push(i);
        }
        
        var newList = new Array(list.length);
        var prev = 0;
        
        for (let n = temp.length; n > 0; n--){
            let random = Math.floor(Math.random() * temp.length);
            newList[temp[random]] = list[prev];
            prev = temp[random];
            temp.splice(random, 1);
        }
        newList[0] = list[prev];
        return newList;
    }

    selectionSortAlg(list){
        var steps = [];
        steps.push(list.slice());
    
        for (let i = this.numValues - 1; i >  0; i--){
            let max = 0;
            let maxIndex = 0;
            for (let j = 0; j <= i; j++){
                if (list[j] > max){
                    max = list[j];
                    maxIndex = j;
                }
            }
            list[maxIndex] = list[i];
            list[i] = max;
            steps.push(list.slice());
        }
        return steps;
    }
    
    swap(t1, t2){
        var temp = t1.parent.textNode.text;

        t1.parent.textNode.text = t2.parent.textNode.text;
        t2.parent.textNode.text = temp;

        t1.selected = false;
        this.setRectColour(t1, DEFAULT_COLOUR);
        
        t2.selected = false;
        this.setRectColour(t2, DEFAULT_COLOUR);
    }

    drawInitial(){
        for (let i = 0; i < this.numValues; i++){
            let container = new createjs.Container();
            let rect = new createjs.Shape();
            let text = new createjs.Text(...this.font);
            container.shapeNode = rect;
            container.textNode = text;
            
            this.setRectColour(rect, DEFAULT_COLOUR);
            rect.selected = false;
            container.y = CANVAS_HEIGHT/2 - this.cellHeight/2 - 100; 
            container.x = i * this.cellWidth 
                          + (CANVAS_WIDTH - this.numValues * this.cellWidth)/2;
    
            text.set({
                text: "" + this.steps[0][i],
                textAlign:"center",
                textBaseline: "middle",
                x: this.cellWidth/2,
                y: this.cellHeight/2,
            })
    
            container.addChild(rect);
            container.addChild(text);
            this.stage.addChild(container)
            
            rect.on("click", function(evt){
                drill.click(evt);
            });

            rect.addEventListener("mouseover", () => {
                this.setRectColour(rect, HIGHLIGHT_COLOUR);
                this.stage.update();
            });
            
            rect.addEventListener("mouseout", () => {
                if (!rect.selected){
                    this.setRectColour(rect, DEFAULT_COLOUR);
                    this.stage.update();
                }
            });
            this.nodes.push(container);
        }

        this.promptText = new createjs.Text("", "bold 50px Arial", "").set({
            text: "",
            textAlign: "center",
            x: CANVAS_WIDTH/2,
            y: 360,
            lineWidth: 400
        });
        this.stage.addChild(this.promptText);
        
        this.iterationText = new createjs.Text("", "50px Arial", "").set({
            text: "Iteration 1",
            x: this.nodes[0].x,
            y: 120,
            lineWidth: 400
        });
        this.stage.addChild(this.iterationText);

        this.stage.addChild(new createjs.Text("", "20px Arial", "").set({
            text: "Smallest\nElement",
            textAlign:"center",
            x: this.nodes[0].x  + this.cellWidth/2,
            y: this.nodes[0].y + this.cellHeight + 5
        }))

        this.stage.addChild(new createjs.Text("", "20px Arial", "").set({
            text: "Largest\nElement",
            textAlign:"center",
            x: this.nodes[this.numValues-1].x + this.cellWidth/2,
            y: this.nodes[this.numValues-1].y + this.cellHeight + 5
        }))

        this.checkButton = new Button(700, 500, "Check", this.stage);
        this.checkButton.shapeNode.addEventListener("click", () =>{
            this.check();
        });

        this.resetButton = new Button(400, 500, "New List", this.stage);
        this.resetButton.shapeNode.addEventListener("click", () =>{
            this.reset();
        });

        this.revertButton = new Button(1000, 500, "Revert", this.stage);
        this.revertButton.shapeNode.addEventListener("click", () =>{
            this.revert();
        });

        new InstructionIcon(this.stage);

        this.stage.update();
    }

    setRectColour(rect, colour){
        rect.graphics.clear()
                     .beginFill(colour)
                     .drawRect(0, 0, this.cellWidth, this.cellHeight)
                     .endFill();
        this.stage.update();
    }

    revert(){
        for (let i = 0; i < this.numValues; i++){
            this.nodes[i].textNode.text = this.steps[this.count-1][i];
        }
        this.stage.update();
        showInstruction(this.description);
    }

    click(event){
        if (!event.target.selected){
            event.target.selected = true;
            this.setRectColour(event.target, HIGHLIGHT_COLOUR);
            if (this.select.length == 1){
                this.swap(event.target, this.select[0]);
                this.select.pop();
            }
            else {
                this.select.push(event.target);
            }
        } else {
            event.target.selected = false;
            this.setRectColour(event.target, DEFAULT_COLOUR);
            this.select.pop();
        }
        this.stage.update();
    }

    check(){
        if (this.count == this.numValues){
            return;
        }

        var correct = true;
        for (let i = 0; i < this.numValues; i++){
            if (this.nodes[i].textNode.text != this.steps[this.count][i] + ""){
                correct = false;
                break;
            }
        }

        if (correct){
            let correctNode = this.nodes[this.numValues - this.count];
            this.count++;

            this.setRectColour(correctNode.shapeNode, CORRECT_COLOUR);
            correctNode.shapeNode.removeAllEventListeners();

            this.promptText.color = CORRECT_COLOUR;
            
            if (this.count == this.numValues){
                this.setRectColour(this.nodes[0].shapeNode, CORRECT_COLOUR);
                this.promptText.text = "The list is now sorted.";
                this.nodes[0].shapeNode.removeAllEventListeners();
            } else {
                this.iterationText.text = "Iteration "  + this.count;
                this.promptText.text = "Correct";
            }
        } else {
            this.revert();
            this.promptText.text = "Try Again";
            this.promptText.color = HIGHLIGHT_COLOUR;
        }

        this.stage.update();
    }

    reset(){
        this.stage.removeAllChildren();
        var list = randomList(this.numValues);
        this.steps = this.selectionSortAlg(this.randomiseList(list));

        this.select = [];
        this.nodes = [];
        this.count = 1;
        
        this.drawInitial();
        this.stage.update();
    }
}

class InsertionSortDrill{
    constructor(){
        this.numValues = 8
        this.cellWidth = 120;
        this.cellHeight = 120;
        this.count = 1;
        this.font = ["", "50px Arial", ""]
        this.maxSwap = 3;
        this.description = "-Sort the list using inesrtion sort, after each " + 
        "iteration click on Check to varify if it was correct.\n\n" + 
        "-Click on two elements to swap them around.\n\n" +
        "-Click on New List to get a new list.\n\n" + 
        "-Click on Revert to undo changes made in the current iteration. "

        this.stage = new createjs.Stage("canvas");
        this.stage.enableMouseOver();

        var list = randomList(this.numValues);
        this.steps = this.insertionSortAlg(this.randomiseList(list));

        this.select = [];
        this.nodes = [];

        
        this.drawInitial();
        this.stage.update();
    }

    randomiseList(list){
        var newList = [];
        var n = 0;

        list.sort(function(a, b){return a - b});

        newList.push(list[this.numValues-1]);
        for (let i = 0; i < this.numValues-1; i++){
            let location;
            
            if (n < -1){
                location = 0
            } else if (n > 1){
                location = Math.floor(Math.random() * (this.maxSwap - 1)) + 1
            } else {
                location = Math.floor(Math.random() * this.maxSwap)
            }

            if (location == 0){
                n++;
            } else {
                n--;
            }

            if (location >= newList.length){
                newList = newList.toSpliced(1, 0, list[i]);
            } else {
                newList = newList.toSpliced(newList.length - location, 0, list[i]);
            }
        }

        return newList;
    }

    insertionSortAlg(list){
        var steps = []
        steps.push(list.slice());
        for (let i = 1; i < this.numValues; i++){
            let count = 1;
            while (count <= i){
                if (list[i-count+1] < list[i-count]){
                    let temp = list[i-count+1];
                    list[i-count+1] = list[i-count];
                    list[i-count] = temp;
                    count++;
                } else {
                    break;
                }
            }
            steps.push(list.slice());
        }
        return steps;
    }

    swap(t1, t2){
        var temp = t1.parent.textNode.text;

        t1.parent.textNode.text = t2.parent.textNode.text;
        t2.parent.textNode.text = temp;

        t1.selected = false;
        this.setRectColour(t1, DEFAULT_COLOUR);
        
        t2.selected = false;
        this.setRectColour(t2, DEFAULT_COLOUR);
    }

    drawInitial(){
        for (let i = 0; i < this.numValues; i++){
            let container = new createjs.Container();
            let rect = new createjs.Shape();
            let text = new createjs.Text(...this.font);
            container.shapeNode = rect;
            container.textNode = text;
            
            this.setRectColour(rect, DEFAULT_COLOUR);
            rect.selected = false;
            container.y = CANVAS_HEIGHT/2 - this.cellHeight/2 - 100; 
            container.x = i * this.cellWidth 
                          + (CANVAS_WIDTH - this.numValues * this.cellWidth)/2;
    
            text.set({
                text: "" + this.steps[0][i],
                textAlign:"center",
                textBaseline: "middle",
                x: this.cellWidth/2,
                y: this.cellHeight/2,
            })
    
            container.addChild(rect);
            container.addChild(text);
            this.stage.addChild(container)
            
            rect.on("click", function(evt){
                drill.click(evt);
            });

            rect.addEventListener("mouseover", () => {
                this.setRectColour(rect, HIGHLIGHT_COLOUR);
                this.stage.update();
            });
            
            rect.addEventListener("mouseout", () => {
                if (!rect.selected){
                    this.setRectColour(rect, DEFAULT_COLOUR);
                    this.stage.update();
                }
            });
            this.nodes.push(container);
        }

        this.promptText = new createjs.Text("", "bold 50px Arial", "").set({
            text: "",
            textAlign: "center",
            x: CANVAS_WIDTH/2,
            y: 400,
            lineWidth: 400
        });
        this.stage.addChild(this.promptText);
        
        this.iterationText = new createjs.Text("", "50px Arial", "").set({
            text: "Iteration 1",
            x: this.nodes[0].x,
            y: 120,
            lineWidth: 400
        });
        this.stage.addChild(this.iterationText);

        this.stage.addChild(new createjs.Text("", "20px Arial", "").set({
            text: "Smallest\nElement",
            textAlign:"center",
            x: this.nodes[0].x  + this.cellWidth/2,
            y: this.nodes[0].y + this.cellHeight + 5
        }))

        this.stage.addChild(new createjs.Text("", "20px Arial", "").set({
            text: "Largest\nElement",
            textAlign:"center",
            x: this.nodes[this.numValues-1].x + this.cellWidth/2,
            y: this.nodes[this.numValues-1].y + this.cellHeight + 5
        }))

        this.checkButton = new Button(700, 500, "Check", this.stage);
        this.checkButton.shapeNode.addEventListener("click", () =>{
            this.check();
        });

        this.resetButton = new Button(400, 500, "New List", this.stage);
        this.resetButton.shapeNode.addEventListener("click", () =>{
            this.reset();
        });

        this.revertButton = new Button(1000, 500, "Revert", this.stage);
        this.revertButton.shapeNode.addEventListener("click", () =>{
            this.revert();
        });

        new InstructionIcon(this.stage);

        this.stage.update();
    }

    setRectColour(rect, colour){
        rect.graphics.clear()
                     .beginFill(colour)
                     .drawRect(0, 0, this.cellWidth, this.cellHeight)
                     .endFill();
        this.stage.update();
    }

    revert(){
        for (let i = 0; i < this.numValues; i++){
            this.nodes[i].textNode.text = this.steps[this.count-1][i];
        }
        this.stage.update();
    }

    click(event){
        if (!event.target.selected){
            event.target.selected = true;
            this.setRectColour(event.target, HIGHLIGHT_COLOUR);
            if (this.select.length == 1){
                this.swap(event.target, this.select[0]);
                this.select.pop();
            }
            else {
                this.select.push(event.target);
            }
        } else {
            event.target.selected = false;
            this.setRectColour(event.target, DEFAULT_COLOUR);
            this.select.pop();
        }
        this.stage.update();
    }

    check(){
        if (this.count == this.numValues){
            return;
        }

        var correct = true;
        if (this.select[0]){
            this.setRectColour(this.select[0], DEFAULT_COLOUR);
            this.select[0].selected = false;
            this.select.pop();
        }

        for (let i = 0; i < this.numValues; i++){
            if (this.nodes[i].textNode.text != this.steps[this.count][i] + ""){
                correct = false;
                break;
            }
        }

        if (correct){
            this.count++;

            this.promptText.color = CORRECT_COLOUR;
            
            if (this.count == this.numValues){
                this.nodes.forEach((e) => {
                    this.setRectColour(e.shapeNode, CORRECT_COLOUR);
                    this.promptText.text = "The list is now sorted.";
                    e.shapeNode.removeAllEventListeners();
                })
            } else {
                this.iterationText.text = "Iteration "  + this.count;
                this.promptText.text = "Correct";
            }
        } else {
            this.revert();
            this.promptText.text = "Try Again";
            this.promptText.color = HIGHLIGHT_COLOUR;
        }

        this.stage.update();
    }

    reset(){
        this.stage.removeAllChildren();
        var list = randomList(this.numValues);
        this.steps = this.insertionSortAlg(this.randomiseList(list));

        this.select = [];
        this.nodes = [];
        this.count = 1;
        
        this.drawInitial();
        this.stage.update();
    }
}

class heapDrill{
    constructor(){
        this.height = 4;
        this.stage = new createjs.Stage("canvas");
        this.values = randomList(8);

        this.nodes = [];
        this.lines = [];
        this.select = [];
        this.list =  [];

        this.drawInitial();
        this.stage.update();
    }

    drawInitial(){
        // Draw the binary tree
        for (let i = 0; i < this.height; i++){
            for (let j = 0; j < 1<<i; j++){
                let container = new createjs.Container();
                let text = new createjs.Text("", "30px Arial", "");
                text.set({
                    text: (((1<<i) + j) <= this.values.length)
                          ? "" + this.values[((1<<i) + j)-1] : "",
                    textAlign:"center",
                    textBaseline: "middle",
                    x: 0,
                    y: 0,
                })

                let circle = new createjs.Shape();
                circle.colour = "blue";
                circle.graphics.beginFill(DEFAULT_COLOUR)
                               .drawCircle(0, 0, 40)
                               .endFill();
                circle.on("click", function(evt){
                    drill.click(evt);
                });

                container.x = 160*j*(1<<(this.height-1-i)) 
                              + ((1<<(this.height-1-i)) - 1) * 80 + 250;
                container.y = 100*i + 100;

                container.addChild(circle);
                container.addChild(text);
                this.stage.addChild(container);
                this.nodes.push(container)
            }
        }

        for (let i = 0; i < Math.floor(this.nodes.length/2); i++){
            let line = new createjs.Shape();
            let startCoord = [this.nodes[i].x, this.nodes[i].y];
            let t1Coord = [this.nodes[i*2+1].x, this.nodes[i*2+1].y];
            let t2Coord = [this.nodes[i*2+2].x, this.nodes[i*2+2].y];

            line.graphics
                .setStrokeStyle(4)
                .beginStroke("black")
                .moveTo(...startCoord)
                .lineTo(...t1Coord)
                .endStroke();
            
            line.graphics
                .setStrokeStyle(4)
                .beginStroke("black")
                .moveTo(...startCoord)
                .lineTo(...t2Coord)
                .endStroke();
                
            this.stage.addChildAt(line, 0);
        }

        for (let i = 0; i < this.nodes.length; i++){
            let container = new createjs.Container();
            let rect = new createjs.Shape();
            let text = new createjs.Text("", "30px Arial", "");
    
            rect.graphics.beginFill(DEFAULT_COLOUR)
                         .drawRect(0, 0, 50, 50)
                         .endFill();
            rect.selected = false;
            container.y = 500; 
            container.x = i*50 + 200;
    
            text.set({
                text: "" + this.nodes[i].children[1].text,
                textAlign:"center",
                textBaseline: "middle",
                x: 25,
                y: 25,
            })
    
            container.addChild(rect);
            container.addChild(text);
            this.stage.addChild(container)
            this.list.push(container);
        }
    }

    swap(t1, t2){
        var temp = t1.parent.children[1].text;
        var l1 = this.list[this.nodes.indexOf(t1.parent)];
        var l2 = this.list[this.nodes.indexOf(t2.parent)];
        
        // Update the text value of node and list
        t1.parent.children[1].text = t2.parent.children[1].text;
        l1.children[1].text = t2.parent.children[1].text;

        t2.parent.children[1].text = temp;
        l2.children[1].text = temp;

        // Reset selected node colour
        t1.selected = false;
        t1.graphics.clear()
                   .beginFill(DEFAULT_COLOUR)
                   .drawCircle(0, 0, 40)
                   .endFill();
        l1.children[0].graphics.beginFill(DEFAULT_COLOUR)
                               .drawRect(0, 0, 50, 50)
                               .endFill();
        
        t2.selected = false;
        t2.graphics.clear()
                   .beginFill(DEFAULT_COLOUR)
                   .drawCircle(0, 0, 40)
                   .endFill();
        l2.children[0].graphics.beginFill(DEFAULT_COLOUR)
                               .drawRect(0, 0, 50, 50)
                               .endFill();
    }

    click(event){
        if (!event.target.selected){
            // Select node
            event.target.selected = true;
            event.target.graphics.beginFill(HIGHLIGHT_COLOUR)
                                 .drawCircle(0, 0, 40, 40)
                                 .endFill();

            this.list[
                this.nodes.indexOf(event.target.parent)
            ].children[0].graphics.beginFill(HIGHLIGHT_COLOUR)
                                  .drawRect(0, 0, 50, 50)
                                  .endFill();

            // Swap node if there is another selected node
            if (this.select.length == 1){
                this.swap(event.target, this.select[0]);
                this.select.pop();
            }
            else {
                this.select.push(event.target);
            }
        } else {
            // Deselect node
            event.target.selected = false;
            event.target.graphics.beginFill(DEFAULT_COLOUR)
                                 .drawCircle(0, 0, 40, 40)
                                 .endFill();
            this.list[
                this.nodes.indexOf(event.target.parent)
            ].children[0].graphics.beginFill(DEFAULT_COLOUR)
                                  .drawRect(0, 0, 50, 50)
                                  .endFill();
            this.select.pop();
        }
        this.stage.update();
    }
}

class DFS{
    constructor(){
        this.stage = new createjs.Stage("canvas");
        this.nodePositions = [
            { x: 800, y: 50, value: 0, children: [1, 2]},
            { x: 450, y: 200, value: 1, children: [0, 3, 4, 6]},
            { x: 1150, y: 200, value: 2, children: [0, 4, 5, 7]},
            { x: 100, y: 350, value: 3, children: [1, 6]},
            { x: 800, y: 350, value: 4, children: [1, 2, 6, 7]},
            { x: 1500, y: 350, value: 5, children: [2, 7]},
            { x: 450, y: 500, value: 6, children: [1, 3, 4, 8]},
            { x: 1150, y: 500, value: 7, children: [2, 4, 5, 8]},
            { x: 800, y: 650, value: 8, children: [6, 7]}
        ]
        this.nodes = [];
        

        this.drawInitial();
    }

    drawInitial(){
        var temp = [Math.floor(Math.random()*9)];
        var newNum = 0;
        while (this.nodes.length < 5){
            newNum = Math.floor(Math.random()*temp.length);
            let val = temp[newNum];
            this.nodes.push(val);
            temp.splice(newNum, 1);
            this.nodePositions[val].children.forEach((e) =>{
                if (!this.nodes.includes(e) && !temp.includes(e)){
                    temp.push(e);
                };
            })
        }
        
        this.nodes.forEach((e) =>{
            let pos = this.nodePositions[e];
            const node = new createjs.Shape();
            node.colour = "blue";
            node.graphics.beginFill(DEFAULT_COLOUR)
            .drawCircle(0, 0, 40)
            .endFill();
            
            node.x = pos.x;
            node.y = pos.y;
            this.stage.addChild(node);
        })
        
        this.nodes.forEach((e) =>{
            let pos = this.nodePositions[e];
            let connected = false;
            while (!connected){
                pos.children.forEach((child) => {
                    if ((this.nodes.includes(child)) && (Math.random() > 0.5)){
                        this.stage.addChild(drawArc(
                            pos, this.nodePositions[child], 
                            Math.floor(Math.random() * 10) + 1 + ""));
                        connected = true;
                    }})
                }
            })
        

        this.stage.update();
    }
}

function changeAlg(){
    var selected = document.getElementById("selection");
    const DRILL_LIST = {
        "selection": SelectionSortDrill,
        "insertion": InsertionSortDrill,
        "heap":heapDrill,
        "dfs": DFS
    }    

    if (selected.value in DRILL_LIST){
        if (drill){
            drill.stage.removeAllChildren();
            drill.stage.update();
        }
        drill = new (DRILL_LIST[selected.value])();
        instructions.innerText = drill.description;
        instructionContainer.style.display = "none";
        drill.stage.update();
    } else {
        console.error("Invalid Selected Value");
    }
}

function randomList(size){
    // Generate list of distinct values between 1 and 100 inclusive.
    if (size > 100){
        console.error("Error: Random List size should be less than 100")
        return null;
    }
    
    var list = new Set();
    while (list.size < size){
        list.add(Math.floor(Math.random() * 100) + 1);
    }

    list = Array.from(list);
    return list;
}

function drawArc(A, B, value="", reverse=false){
    const angleA = Math.atan2(B.y - A.y, B.x - A.x) - 10*Math.PI/180;
    const angleB = Math.atan2(A.y - B.y, A.x - B.x) + 5*Math.PI/180;

    const pointA = {
        x: Math.cos(angleA) * 50 + A.x, // 10 + 40(size of circle) = 50
        y:Math.sin(angleA) * 50 + A.y
    };
    const pointB = {
        x: Math.cos(angleB) * 60 + B.x, // 20 + 40(size of circle) = 50
        y:Math.sin(angleB) * 60 + B.y
    };

    const container = new createjs.Container();
    const shape = new createjs.Shape();
    const text = new createjs.Text("", "30px Arial", "");

    // Calculate the midpoint
    const midX = (pointA.x + pointB.x) / 2;
    const midY = (pointA.y + pointB.y) / 2;

    container.x = midX;
    container.y = midY;

    pointA.x = pointA.x - midX;
    pointA.y = pointA.y - midY;
    
    pointB.x = pointB.x - midX;
    pointB.y = pointB.y - midY;

    // Calculate the perpendicular offset for a flatter arc
    const deltaX = pointB.x - pointA.x;
    const deltaY = pointB.y - pointA.y;
    const length = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

    // Normalize the perpendicular direction
    const perpX = -(deltaY / length) * (reverse? -1:1);
    const perpY = deltaX / length * (reverse? -1:1);

    // Calculate the new center for a flatter arc
    const centerX = perpX * length; // Adjust value for flatness
    const centerY = perpY * length; // Adjust value for flatness

    // Calculate the radius
    const radius = Math.sqrt(Math.pow(pointA.x - centerX, 2) 
                   + Math.pow(pointA.y - centerY, 2));

    // Calculate the angles
    const startAngle = Math.atan2(pointA.y - centerY, pointA.x - centerX);
    const endAngle = Math.atan2(pointB.y - centerY, pointB.x - centerX);

    // Draw the arc
    shape.graphics.setStrokeStyle(4).beginStroke("black");
    shape.graphics.arc(centerX, centerY, radius, startAngle, endAngle, reverse);

    shape.graphics.beginFill("black");
    shape.graphics.drawPolyStar(pointB.x, pointB.y, 10, 3 , 0, 
                                endAngle*180/Math.PI- (reverse?90:-90));
    shape.graphics.moveTo(0, 0);
    
    text.set({
        text: "" + value,
        textAlign:"center",
        textBaseline: "middle",
        x: -perpX*radius + centerX + (reverse? 20:-20)*perpX, 
        y: -perpY*radius + centerY + (reverse? 20:-20)*perpY
    });
    
    // Add the shape to the stage
    container.addChild(shape);
    container.addChild(text);
    return(container);
}

function showInstruction(){
    var height = document.getElementById("canvasContainer").offsetHeight + "px";
    instructionContainer.style.height = height;

    instructionContainer.style.display = "flex";
}

$(function(){
    var selected = document.getElementById("selection");
    var value = new URLSearchParams(window.location.search).get("selected")
    var canvas = document.getElementById("canvas");
    var close = document.getElementById("x");
    var height = document.getElementById("canvasContainer").offsetHeight + "px";

    instructionContainer = document.getElementById("instructionContainer");
    instructions = document.getElementById("instructions");

    instructionContainer.style.height = height;
    close.addEventListener("click", () => {
        instructionContainer.style.display = "none";
    });
    
    canvas.height = CANVAS_HEIGHT;
    canvas.width = CANVAS_WIDTH;
    canvas.getContext("2d", {willReadFrequently: true});
    
    for (let i = 0; i < selected.options.length; i++){
        if (selected.options[i].value == value){
            selected.selectedIndex = i;
            selected.onchange();
            break;
        }
    }
    window.onresize = (function(){
        var height = document.getElementById("canvasContainer").offsetHeight + "px";
        instructionContainer.style.height = height;
    })
})