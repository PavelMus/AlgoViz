import Node from './GridNode.js';

export default class Grid{
    constructor(rows, cols, gridDOM){
        this.rows = rows;
        this.cols = cols;
        this.gridDOM = gridDOM;
        this.grid_nodes = new Array(rows).fill(null).map( arr => new Array(cols).fill(null));
        this.grid_node_DOMs = new Array(rows).fill(null).map( arr => new Array(cols).fill(null));
        this.grid_node_row_DOMs = new Array(rows).fill(null);
        this.start_node = null;
        this.end_node = null;

        this.mouse_status = false;  // true = mouse down, false = mouse up

        this.initGridNodes = this.initGridNodes.bind(this);
        this.setVisited = this.setVisited.bind(this);
        this.resetVisited = this.resetVisited.bind(this);
        this.resetGrid = this.resetGrid.bind(this);
        this.setAdjacentNodes = this.setAdjacentNodes.bind(this);
        this.setAdjacentNodesDiag = this.setAdjacentNodesDiag.bind(this);
        this.resetNodeParents = this.resetNodeParents.bind(this);
        this.resetNodeDistances = this.resetNodeDistances.bind(this);
        this.randomizeWeights = this.randomizeWeights.bind(this);
        this.resetWeights = this.resetWeights.bind(this);
        this.removeWeight = this.removeWeight.bind(this);
        this.resetWalls = this.resetWalls.bind(this);
        this.setStartNode = this.setStartNode.bind(this);
        this.setEndNode = this.setEndNode.bind(this);
        this.setMouseDown = this.setMouseDown.bind(this);
        this.setMouseUp = this.setMouseUp.bind(this);
        this.addGridNodeEventListeners = this.addGridNodeEventListeners.bind(this);
    }
    initGridNodes() {
        for(let row = 0; row < this.rows; ++row) {
            const grid_row_DOM = document.createElement('tr');
            grid_row_DOM.id = `grid_row_${row}`;
            grid_row_DOM.classList.add('grid_row');

            this.grid_node_row_DOMs[row] = grid_row_DOM;
        
            for (let col = 0; col < this.cols; ++col) {
                const grid_node_DOM = document.createElement('td');
                grid_node_DOM.id = `${row}_${col}`;
                grid_node_DOM.classList.add('node');
                grid_row_DOM.appendChild(grid_node_DOM);

                let i = document.createElement('i');
                i.classList.add('fas');
                grid_node_DOM.appendChild(i);
    
                const node = new Node(row, col);
                this.grid_nodes[row][col] = node;

                this.grid_node_DOMs[row][col] = grid_node_DOM;
            }
            this.gridDOM.appendChild(grid_row_DOM);
        }
    
        this.setAdjacentNodes();
        this.setStartNode();
        this.setEndNode();
        //this.setAdjacentNodesDiag();
        this.addGridNodeEventListeners();
    }

    setVisited(nodes){
        nodes.forEach( node =>{
            const nodeDOM = this.grid_node_DOMs[node.row][node.col];
            if(!nodeDOM.classList.contains('start') && !nodeDOM.classList.contains('end')){
                nodeDOM.classList.add('visited');
            }
        });
    }
    resetVisited(){
        const str_node = this.grid_node_DOMs[this.start_node.row][this.start_node.col];
        str_node.classList.remove('expanded');
        str_node.style.backgroundColor = '#42a5f5';
        const end_node = this.grid_node_DOMs[this.end_node.row][this.end_node.col];
        end_node.classList.remove('expanded');
        end_node.style.backgroundColor = '#ff7043';
        for(let row = 0; row < this.rows; ++row){
            for(let col = 0; col < this.cols; ++col){
                if(this.grid_node_DOMs[row][col].classList.contains('visited')){
                    this.grid_node_DOMs[row][col].classList.remove('visited');
                    this.grid_node_DOMs[row][col].style.backgroundColor = '#fff1ff';
                    this.grid_node_DOMs[row][col].style.border = '1px solid #790e8b';
                }
            }
        }
        return true;
    }

    resetGrid(){
        this.start_node = null;
        this.end_node = null;
        this.mouse_status = false;
        
        for(let i = 0; i < this.rows; ++i){
            this.gridDOM.removeChild(this.grid_node_row_DOMs[i]); //infanticide of the grid rows
        }
        
        this.grid_nodes = new Array(this.rows).fill(null).map( arr => new Array(this.cols).fill(null));
        this.grid_node_DOMs = new Array(this.rows).fill(null).map( arr => new Array(this.cols).fill(null));
        this.grid_node_row_DOMs = new Array(this.rows).fill(null);

        this.initGridNodes();
    }

    setAdjacentNodes() {
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                if (row + 1 < this.rows) {
                    this.grid_nodes[row][col].adjacent_nodes.push({row: row+1, col: col});
                }
                if (row - 1 >= 0) {
                    this.grid_nodes[row][col].adjacent_nodes.push({row: row-1, col: col});
                }
                if (col - 1 >= 0) {
                    this.grid_nodes[row][col].adjacent_nodes.push({row: row, col: col-1});
                }
                if (col + 1 < this.cols) {
                    this.grid_nodes[row][col].adjacent_nodes.push({row: row, col: col+1});
                }
            }
        }
    }

    setAdjacentNodesDiag(){
        const getNeighbors = (_row, _col) =>{
            let neighbors = [];
            for(let row = _row - 1; row <= _row + 1; ++row){
                for(let col = _col - 1; col <= _col + 1; ++col){
                    if(row >= 0 && row < this.rows && col >= 0 && col < this.cols){
                        neighbors.push({row: row, col: col});
                    }
                }
            }
            return neighbors;
        }
    
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                this.grid_nodes[row][col].adjacent_nodes = getNeighbors(row, col);
            }
        }
    }

    resetNodeParents() {
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                this.grid_nodes[row][col].parent_node = null;
            }
        }
    }

    resetNodeDistances(){
        for(let row = 0; row < this.rows; ++row){
            for(let col = 0; col < this.cols; ++col){
                this.grid_nodes[row][col].distance = Infinity;
                this.grid_nodes[row][col].h_distance = Infinity;
            }
        }
    }

    randomizeWeights(){
        this.resetWeights();
        const weights = ['weight0', 'weight1', 'weight2', 'weight3', 'weight4', 'weight5', 'weight6', 'weight7', 'weight8', 'weight9']
        for(let row = 0; row < this.rows; ++row){
            for(let col = 0; col < this.cols; ++col){
                const node = this.grid_nodes[row][col];
                if(!node.wall && node.id !== this.start_node.id && node.id !== this.end_node.id){
                    const weight = Math.floor(Math.random()*10);
                    node.weight = weight;
                    if(weight !== 0){
                        const w_icon = this.grid_node_DOMs[row][col].childNodes[0];
                        w_icon.classList.add('fa-weight-hanging');
                        w_icon.classList.add(weights[weight]);
                        this.grid_node_DOMs[row][col].classList.add('weight');
                        // <i class="fas fa-weight-hanging"></i>
                    }
                }
            }
        }
    }

    resetWeights(){
        for(let row = 0; row < this.rows; ++row){
            for(let col = 0; col < this.cols; ++col){
                if(this.grid_node_DOMs[row][col].classList.contains('weight')){
                    const to_remove = this.grid_node_DOMs[row][col].childNodes[0];
                    to_remove.classList.remove('fa-weight-hanging');
                    this.grid_node_DOMs[row][col].classList.remove('weight');
                }
            }
        }
    }

    removeWeight(row, col){
        if(this.grid_node_DOMs[row][col].classList.contains('weight')){
            const to_remove = this.grid_node_DOMs[row][col].childNodes[0];
            this.grid_node_DOMs[row][col].removeChild(to_remove);
            this.grid_node_DOMs[row][col].classList.remove('weight');
        }
    }

    resetWalls(){
        for(let row = 0; row < this.rows; ++row){
            for(let col = 0; col < this.cols; ++col){
                if(this.grid_nodes[row][col].wall){
                    this.grid_nodes[row][col].wall = false;
                    if(this.grid_node_DOMs[row][col].classList.contains('wall')){
                        this.grid_node_DOMs[row][col].classList.remove('wall');
                    }
                }
            }
        }
    }
    
    setStartNode() {
        this.start_node = this.grid_nodes[13][9];
        this.start_node.type = 'start';

        const elem = document.getElementById(this.start_node.id);
        elem.classList.add('start');

        elem.childNodes[0].classList.add('fa-map-marker-alt');
    }
    
    setEndNode() {
        this.end_node = this.grid_nodes[13][53];
        this.end_node.type = 'end';

        const elem = document.getElementById(this.end_node.id);
        elem.classList.add('end');

        elem.childNodes[0].classList.add('fa-medal');
    }

    setMouseDown(){
        if(!this.mouse_status){
            this.mouse_status = true;
        }
    }

    setMouseUp(){
        if(this.mouse_status){
            this.mouse_status = false;
        }
    }

    addGridNodeEventListeners() {
        const body = document.querySelector('body');
        body.addEventListener('mousedown', (e) => {
            e.preventDefault();
            this.setMouseDown();
        }, false);

        body.addEventListener('mouseup', (e) => {
            e.preventDefault();
            this.setMouseUp();
        }, false);
    
        for (let row = 0; row < this.rows; ++row) {
            for (let col = 0; col < this.cols; ++col) {
                const node = this.grid_nodes[row][col];
                const elem = this.grid_node_DOMs[row][col];
                elem.addEventListener('mousedown', (e) => {
                    e.preventDefault();
                    if(!elem.classList.contains('start') && !elem.classList.contains('end')){
                        if (!node.wall) {
                            if(elem.classList.contains('weight')){
                                this.removeWeight(node.row, node.col);
                            }
                            node.animateNode('place-wall');
                        } else {
                            node.animateNode('remove-wall');
                        }
                    }
                });
                elem.addEventListener('mouseenter', (e) => {
                    e.preventDefault();
                    if(!elem.classList.contains('start') && !elem.classList.contains('end')){
                        if (!node.wall && this.mouse_status) {
                            if(elem.classList.contains('weight')){
                                this.removeWeight(node.row, node.col);
                            }
                            node.animateNode('place-wall');
                        } else if (this.mouse_status) {
                            node.animateNode('remove-wall');
                        }
                    }
                });
            }
        }
    }
}