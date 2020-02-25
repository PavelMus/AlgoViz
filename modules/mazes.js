import Node from "./GridNode.js";

export function eller(grid) {
    grid.resetWalls();
    const grid_rows = grid.rows;
    const grid_cols = grid.cols;
    const grid_nodes = grid.grid_nodes;
    const walls = [];
    const set_to_nodes = [];
    const node_to_sets = [];
    for (let row = 0; row < grid_rows; ++row) {
        set_to_nodes.push(new Map());
        node_to_sets.push(new Map());
        const walls_row = [];
        for (let col = 0; col < grid_cols; ++col) {
            if (row % 2 === 0) {
                const node = grid_nodes[row][col];
                node.wall = true;
                if (row > 0 && row < grid_rows - 1 && col > 0 && col < grid_cols - 1 && col % 2 === 1) {
                    walls_row.push(node);
                }
            } else if (col % 2 === 0) {
                const node = grid_nodes[row][col];
                node.wall = true;
                if (row > 0 && row < grid_rows - 1 && col > 0 && col < grid_cols - 1) {
                    walls_row.push(node);
                }
            } else {
                set_to_nodes[row].set(row * grid_cols + col, new Array());
                set_to_nodes[row].get(row * grid_cols + col).push(grid_nodes[row][col]);
                node_to_sets[row].set(grid_nodes[row][col].id, row * grid_cols + col);
            }
        }
        walls.push(walls_row);
    }

    for (let i = 1; i < walls.length - 1; i += 2) {
        const wall_row = walls[i];

        for (let j = 0; j < wall_row.length; ++j) {
            const rnd_wall_indx = Math.floor(Math.random() * wall_row.length);
            const rand_wall = wall_row[rnd_wall_indx];

            rand_wall.wall = false;

            let set1 = null;
            let set2 = null;

            rand_wall.adjacent_nodes.forEach(adjacent => {
                const node = grid_nodes[adjacent.row][adjacent.col];
                if (node.wall === false) {
                    if (set1 === null) {
                        set1 = node_to_sets[i].get(node.id);
                    } else {
                        set2 = node_to_sets[i].get(node.id);
                    }
                }
            });
            if (set1 !== set2) {
                const merged_sets = set_to_nodes[i].get(set1).concat(set_to_nodes[i].get(set2));

                set_to_nodes[i].set(set1, merged_sets);
                const nodes_in_set2 = set_to_nodes[i].get(set2);
                nodes_in_set2.forEach(node => {
                    node_to_sets[i].set(node.id, set1);
                });
                set_to_nodes[i].delete(set2);
            }
        }

        if(i < walls.length-2){
            set_to_nodes[i].forEach((node_arr, set_key, map) =>{
                const rand_node = node_arr[Math.floor(Math.random()*node_arr.length)];
                grid_nodes[rand_node.row+1][rand_node.col].wall = false;
            });
        }

        if(i === walls.length-2){
            wall_row.forEach(_node=>{
                _node.wall = false;
            });
        }
    }
    removeWeights(grid);
    return gridAnimationTargets(grid.grid_nodes.reduce((a, b) => a.concat(b)));
}

export function recursiveDivision(grid) {
    grid.resetWalls();
    const grid_rows = grid.rows;
    const grid_cols = grid.cols;

    const grid_nodes = grid.grid_nodes;
    const targets = [];

    for (let row = 0; row < grid_rows; ++row) {
        targets.push(document.getElementById(`${row}_${0}`));
        grid_nodes[row][0].wall = true;
        targets.push(document.getElementById(`${row}_${grid_cols-1}`));
        grid_nodes[row][grid_cols - 1].wall = true;
    }
    for (let col = 0; col < grid_cols; ++col) {
        targets.push(document.getElementById(`${0}_${col}`));
        grid_nodes[0][col].wall = true;
        targets.push(document.getElementById(`${grid_rows-1}_${col}`));
        grid_nodes[grid_rows - 1][col].wall = true;
    }

    const selectOpening = function (start, range) {
        const opening = (start + Math.floor(Math.random() * range)) | 1;
        return opening;
    }
    const selectWall = function (start, range) {
        const wall = ((start + Math.floor(Math.random() * range)) | 1) ^ 1;
        return wall;
    }

    const helper = function (low_row, high_row, low_col, high_col) {
        if (high_row <= low_row || high_col <= low_col) {
            return;
        }

        const col_range = high_col - low_col;
        const row_range = high_row - low_row;

        let vert_horz = Math.floor(Math.random() * 2) === 0 ? false : true;
        if (col_range > row_range) {
            vert_horz = true;
        } else if (row_range > col_range) {
            vert_horz = false;
        }

        if (vert_horz && row_range > 1) {
            const col_selected = selectWall(low_col, col_range + 1);
            const opened = selectOpening(low_row, row_range);

            if (col_selected > low_col && col_selected < high_col) {
                for (let row = low_row; row <= high_row; ++row) {
                    let node_id = `${row}_${col_selected}`;
                    if (node_id !== `${opened}_${col_selected}`) {
                        grid_nodes[row][col_selected].wall = true;
                        targets.push(document.getElementById(node_id));
                    }
                }
            }
            helper(low_row, high_row, low_col, col_selected - 1);
            helper(low_row, high_row, col_selected + 1, high_col);
        } else if (col_range > 1) {
            const row_selected = selectWall(low_row, row_range + 1);
            const opened = selectOpening(low_col, col_range);

            if (row_selected > low_row && row_selected < high_row) {
                for (let col = low_col; col <= high_col; ++col) {
                    let node_id = `${row_selected}_${col}`;
                    if (node_id !== `${row_selected}_${opened}`) {
                        grid_nodes[row_selected][col].wall = true;
                        targets.push(document.getElementById(node_id));
                    }
                }
            }

            helper(low_row, row_selected - 1, low_col, high_col);
            helper(row_selected + 1, high_row, low_col, high_col);
        }
    }

    helper(1, grid_rows - 1, 1, grid_cols - 1);
    removeWeights(grid);
    return targets;
}


export function recursiveBacktracking(grid) {
    grid.resetWalls();
    const grid_nodes = grid.grid_nodes;
    const maze_nodes = createMazeGrid_RB(grid);

    let visited = new Map();
    visited.set(grid.start_node.id, grid.start_node);
    const start_point = maze_nodes.get(grid.start_node.id);

    grid_nodes.forEach(grid_row => {
        grid_row.forEach(node => {
            node.toggleWall();
        });
    });

    const helper = function (cur_node) {
        visited.set(cur_node.id, cur_node);
        let adjacent = cur_node.adjacent_nodes;
        const row = cur_node.row;
        const col = cur_node.col;
        adjacent.forEach(adj => {
            if (!visited.has(adj.id)) {
                if (adj.d === 'right') {
                    grid_nodes[row][col + 1].toggleWall();
                } else if (adj.d === 'left') {
                    grid_nodes[row][col - 1].toggleWall();
                } else if (adj.d === 'up') {
                    grid_nodes[row - 1][col].toggleWall();
                } else {
                    grid_nodes[row + 1][col].toggleWall();
                }
                helper(maze_nodes.get(adj.id));
            }
        });
    }
    helper(start_point);
    removeWeights(grid);
    return gridAnimationTargets(grid.grid_nodes.reduce((a, b) => a.concat(b)));
}

export function kruskal(grid) {
    grid.resetWalls();
    const grid_rows = grid.rows;
    const grid_cols = grid.cols;
    const grid_nodes = grid.grid_nodes;
    const walls = [];
    const set_to_nodes = new Map();
    const node_to_sets = new Map();
    for (let row = 0; row < grid_rows; ++row) {
        for (let col = 0; col < grid_cols; ++col) {
            if (row % 2 === 0) {
                const node = grid_nodes[row][col];
                node.wall = true;
                if (row > 0 && row < grid_rows - 1 && col > 0 && col < grid_cols - 1 && col % 2 === 1) {
                    walls.push(node);
                }
            } else if (col % 2 === 0) {
                const node = grid_nodes[row][col];
                node.wall = true;
                if (row > 0 && row < grid_rows - 1 && col > 0 && col < grid_cols - 1) {
                    walls.push(node);
                }
            } else {
                set_to_nodes.set(row * grid_cols + col, new Array());
                set_to_nodes.get(row * grid_cols + col).push(grid_nodes[row][col]);
                node_to_sets.set(grid_nodes[row][col].id, row * grid_cols + col);
            }
        }
    }

    const rand_walls = shuffleArray(walls);

    while (set_to_nodes.size > 1 && rand_walls.length > 0) {
        const wall_node = rand_walls.pop();
        let set1 = null;
        let set2 = null;

        wall_node.adjacent_nodes.forEach(adjacent => {
            const node = grid_nodes[adjacent.row][adjacent.col];
            if (node.wall === false) {
                if (set1 === null) {
                    set1 = node_to_sets.get(node.id);
                } else {
                    set2 = node_to_sets.get(node.id);
                }
            }
        });
        if (set1 !== set2) {
            wall_node.wall = false;

            const merged_sets = set_to_nodes.get(set1).concat(set_to_nodes.get(set2));

            set_to_nodes.set(set1, merged_sets);
            const nodes_in_set2 = set_to_nodes.get(set2);
            nodes_in_set2.forEach(node => {
                node_to_sets.set(node.id, set1);
            });
            set_to_nodes.delete(set2);
        }
    }

    removeWeights(grid);
    return gridAnimationTargets(grid.grid_nodes.reduce((a, b) => a.concat(b)));
}

function createMazeGrid_RB(real_grid) {
    const grid_rows = real_grid.rows;
    const grid_cols = real_grid.cols;

    const maze_nodes = new Map();

    for (let row = 1; row < grid_rows - 1; row += 2) {
        for (let col = 1; col < grid_cols - 1; col += 2) {
            let node = new Node(row, col);
            maze_nodes.set(`${row}_${col}`, node);
            real_grid.grid_nodes[row][col].toggleWall();
        }
    }

    setAdjacentNodes_RB(maze_nodes, grid_rows, grid_cols);

    maze_nodes.forEach(node => {
        node.adjacent_nodes = shuffleArray(node.adjacent_nodes);
    });

    return maze_nodes;
}

function setAdjacentNodes_RB(maze_nodes, grid_rows, grid_cols) {
    for (let row = 1; row < grid_rows - 1; row += 2) {
        for (let col = 1; col < grid_cols - 1; col += 2) {
            let adjacent = maze_nodes.get(`${row}_${col}`).adjacent_nodes;
            if (row + 2 < grid_rows - 1) {
                adjacent.push({
                    id: `${row+2}_${col}`,
                    d: 'down'
                });
            }
            if (row - 2 >= 1) {
                adjacent.push({
                    id: `${row-2}_${col}`,
                    d: 'up'
                });
            }
            if (col - 2 >= 1) {
                adjacent.push({
                    id: `${row}_${col-2}`,
                    d: 'left'
                });
            }
            if (col + 2 < grid_cols - 1) {
                adjacent.push({
                    id: `${row}_${col+2}`,
                    d: 'right'
                });
            }
        }
    }
}

function shuffleArray(arr) {
    let copy = [].concat(arr);
    let output = [];
    let n = arr.length;
    let i = Number;
    while (n) {
        i = Math.floor(Math.random() * n--);
        output.push(copy.splice(i, 1)[0]);
    }
    return output;
}

function removeWeights(grid) {
    for (let row = 0; row < grid.rows; ++row) {
        for (let col = 0; col < grid.cols; ++col) {
            if (grid.grid_nodes[row][col].wall) {
                grid.removeWeight(row, col);
            }
        }
    }
}

function gridAnimationTargets(grid) {
    let targets = [];
    grid.forEach(node => {
        if (node.wall === true) {
            let elem = document.getElementById(node.id);
            targets.push(elem);
        }
    });
    return targets;
}