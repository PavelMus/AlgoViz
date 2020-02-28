import Queue from "./Queue.js";
import {GridMinHeap} from "./minheap.js";

export async function aStarE(grid){
    grid.resetNodeDistances();
    grid.resetNodeParents();

    const grid_nodes = grid.grid_nodes;
    const visited = new Map();
    const heap = new GridMinHeap();

    const end_row = grid.end_node.row;
    const end_col = grid.end_node.col;

    let cur_node = grid.start_node;
    cur_node.distance = 0;

    heap.insert(cur_node, cur_node.distance);

    while(heap.getLength() > 0){
        cur_node = heap.remove();
        if(cur_node !== null){
            visited.set(cur_node.id, cur_node);
            if(cur_node.type === 'end'){
                return setAndReturn(grid, visited, cur_node);
            }
            cur_node.adjacent_nodes.forEach(node =>{
                let adjacent = grid_nodes[node.row][node.col];
                if(!adjacent.wall && !visited.has(adjacent.id)){
                    if(adjacent.distance > cur_node.distance + adjacent.weight){
                        adjacent.distance = cur_node.distance + adjacent.weight;
                        adjacent.parent_node = cur_node;
                    }
                    if(heap.has(adjacent)){
                        heap.update(adjacent, adjacent.weight + Math.sqrt(Math.pow(end_row-adjacent.row, 2) + Math.pow(end_col-adjacent.col, 2)));
                    }else{
                        heap.insert(adjacent, adjacent.weight + Math.sqrt(Math.pow(end_row-adjacent.row, 2) + Math.pow(end_col-adjacent.col, 2)));
                    }
                }
            });
        }
    }
    return setAndReturn(grid, visited, null);
}

export async function aStarM(grid){
    grid.resetNodeDistances();
    grid.resetNodeParents();

    const grid_nodes = grid.grid_nodes;
    const visited = new Map();
    const heap = new GridMinHeap();

    const end_row = grid.end_node.row;
    const end_col = grid.end_node.col;

    let cur_node = grid.start_node;
    cur_node.distance = 0;

    heap.insert(cur_node, cur_node.distance);

    while(heap.getLength() > 0){
        cur_node = heap.remove();
        if(cur_node !== null){
            visited.set(cur_node.id, cur_node);
            if(cur_node.type === 'end'){
                return setAndReturn(grid, visited, cur_node);
            }
            cur_node.adjacent_nodes.forEach(node =>{
                let adjacent = grid_nodes[node.row][node.col];
                if(!adjacent.wall && !visited.has(adjacent.id)){
                    if(adjacent.distance > cur_node.distance + adjacent.weight){
                        adjacent.distance = cur_node.distance + adjacent.weight;
                        adjacent.parent_node = cur_node;
                    }
                    if(heap.has(adjacent)){
                        heap.update(adjacent, adjacent.weight + Math.abs(end_row-adjacent.row) + Math.abs(end_col-adjacent.col));
                    }else{
                        heap.insert(adjacent, adjacent.weight + Math.abs(end_row-adjacent.row) + Math.abs(end_col-adjacent.col));
                    }
                }
            });
        }
    }
    return setAndReturn(grid, visited, null);
}

export async function bestFS(grid){
    grid.resetNodeDistances();
    grid.resetNodeParents();

    const grid_nodes = grid.grid_nodes;
    const visited = new Map();
    const heap = new GridMinHeap();

    let cur_node = grid.start_node;
    heap.insert(cur_node, cur_node.weight);

    while(heap.getLength() > 0){
        cur_node = heap.remove();
        visited.set(cur_node.id, cur_node);
        if(cur_node.type === 'end'){
            return setAndReturn(grid, visited, cur_node);
        }
        cur_node.adjacent_nodes.forEach(node =>{
            let adjacent = grid_nodes[node.row][node.col];
            if(!adjacent.wall && !visited.has(adjacent.id)){
                heap.insert(adjacent, adjacent.weight);
                adjacent.parent_node = cur_node;
            }
        });
    }
    return setAndReturn(grid, visited, null);
}

export async function dijkstra(grid){
    grid.resetNodeDistances();
    grid.resetNodeParents();

    const grid_nodes = grid.grid_nodes;
    const visited = new Map();
    const heap = new GridMinHeap();

    let cur_node = grid.start_node;
    cur_node.distance = 0;

    heap.insert(cur_node, cur_node.distance);

    while(heap.getLength() > 0){
        cur_node = heap.remove();
        visited.set(cur_node.id, cur_node);
        if(cur_node.type === 'end'){
            return setAndReturn(grid, visited, cur_node);
        }
        cur_node.adjacent_nodes.forEach(node =>{
            let adjacent = grid_nodes[node.row][node.col];
            if(!adjacent.wall && !visited.has(adjacent.id)){
                if(adjacent.distance > adjacent.weight + cur_node.distance){
                    adjacent.distance = adjacent.weight + cur_node.distance;
                    heap.insert(adjacent, adjacent.distance);
                    adjacent.parent_node = cur_node;
                }
            }
        });
    }
    return setAndReturn(grid, visited, null);
}

export async function DFS(grid){
    grid.resetNodeParents();

    const grid_nodes = grid.grid_nodes;
    const stack = [grid.start_node];
    const visited = new Map();
    while(stack.length > 0){
        const node = stack.pop();
        visited.set(node.id, node);
        if(node.type === 'end'){
            return setAndReturn(grid, visited, node);
        }
        node.adjacent_nodes.forEach(adj_node => {
            let adjacent = grid_nodes[adj_node.row][adj_node.col];
            if(!adjacent.wall && !visited.has(adjacent.id)){
                adjacent.parent_node = node;
                stack.push(adjacent);
            }
        });
    }
    return setAndReturn(grid, visited, null);
}

export async function BFS(grid){
    grid.resetNodeParents();

    const grid_nodes = grid.grid_nodes;
    const start_node = grid.start_node;
    const queue = new Queue();
    queue.enqueue(start_node);
    const visited = new Map();
    visited.set(start_node.id, start_node);
    while(queue.getLength() > 0){
        let node = queue.dequeue();
        if(node.type === 'end'){
            return setAndReturn(grid, visited, node);
        }
        node.adjacent_nodes.forEach(adj_node =>{
            const adjacent = grid_nodes[adj_node.row][adj_node.col];
            if(!visited.has(adjacent.id) && !adjacent.wall){
                adjacent.parent_node = node;
                visited.set(adjacent.id, adjacent);
                queue.enqueue(adjacent);
            }
        });
    }
    return setAndReturn(grid, visited, null);
}

async function setAndReturn(grid, visited_nodes, end_node){
    grid.setVisited(visited_nodes);
    let visited_targets = [];
    let shortest_path = [];
    visited_nodes.forEach((node, id, map) =>{
        visited_targets.push(id);
    });
    let cur_node = end_node;
    while(cur_node !== null){
        shortest_path.push(cur_node.id);
        cur_node = cur_node.parent_node;
    }
    return {visited_targets: visited_targets, shortest_path: shortest_path.reverse()};
}