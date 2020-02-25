import anime from "./modules/anime.es.js";
import Grid from "./modules/Grid.js";
import {
    aStarE,
    aStarM,
    bestFS,
    BFS,
    DFS,
    dijkstra
} from "./modules/pathfinding.js";
import {eller, recursiveBacktracking, recursiveDivision, kruskal} from "./modules/mazes.js";

const grid_rows = 9 * 3;
const grid_cols = 21 * 3;

const grid = new Grid(grid_rows, grid_cols, document.getElementById('grid_body'));

let tutorial_icon_animate = null;

let animating_path = false;

function initAll() {
    grid.initGridNodes();
    initButtons();
}

function initButtons() {
    const algorithms = document.getElementById('selected_algorithm');
    const maze = document.getElementById('maze');
    const algo_tabs = document.getElementById('algo_tabs');
    const maze_tabs = document.getElementById('maze_tabs');

    const open_tabs = (elem) =>{
        elem.classList.remove('_closed')
        elem.classList.remove('slide_up');
        elem.classList.add('slide_down');
    }
    const close_tabs = (elem) =>{
        elem.classList.add('slide_up');
        elem.classList.add('_closed');
        elem.classList.remove('slide_down');
    }

    const algo_selected = (algo) =>{
        algorithms.innerHTML = algo;
        algorithms.classList.remove('_opened');
        close_tabs(algo_tabs);
    }

    algorithms.onclick = (e) =>{
        e.preventDefault();
        if(algo_tabs.classList.contains('_closed')){
            if(!maze_tabs.classList.contains('_closed')){
                close_tabs(maze_tabs);
                maze.classList.remove('_opened');
            }
            open_tabs(algo_tabs);
            algorithms.classList.add('_opened');
        }else{
            close_tabs(algo_tabs);
            algorithms.classList.remove('_opened');
        }
    }

    maze.onclick = (e) =>{
        e.preventDefault();
        if(maze_tabs.classList.contains('_closed')){
            if(!algo_tabs.classList.contains('_closed')){
                close_tabs(algo_tabs);
                algorithms.classList.remove('_opened');
            }
            open_tabs(maze_tabs);
            maze.classList.add('_opened');
        }else{
            close_tabs(maze_tabs);
            maze.classList.remove('_opened');
        }
    }

    const run = document.getElementById('RUN');

    const enable_run = () =>{
        if(run.classList.contains('disabled') && animating_path === false){
            run.classList.remove('disabled');
        }
    }

    const info = document.getElementById('info');

    /*************************************ALGORITHMS*************************************/

    const astar_e = document.getElementById('a_star_e');
    astar_e.onclick = (e) =>{
        e.preventDefault();
        algo_selected('<i class="fas fa-star-half-alt" aria-hidden="true"></i> A* Search (E)');
        enable_run();
        info.innerHTML = "<p>A* Search with Euclidean heuristic selected, this is a weighted algorithm.</p>";
        run.onclick = async (e) => {
            e.preventDefault();
            const resetVisited = await grid.resetVisited();
            if(resetVisited === true){
                const reveal_targets = await aStarE(grid);
                revealAnimation(reveal_targets);
            }
        };
    };

    const astar_m = document.getElementById('a_star_m');
    astar_m.onclick = (e) =>{
        e.preventDefault();
        algo_selected('<i class="far fa-star" aria-hidden="true"></i> A* Search (M)');
        enable_run();
        info.innerHTML = "<p>A* Search with Manhattan heuristic selected, this is a weighted algorithm.</p>";
        run.onclick = async (e) => {
            e.preventDefault();
            const resetVisited = await grid.resetVisited();
            if(resetVisited === true){
                let reveal_targets = await aStarM(grid);
                revealAnimation(reveal_targets);
            }
        };
    };

    const bestfs = document.getElementById('best_PR');
    bestfs.onclick = (e) => {
        e.preventDefault();
        algo_selected('<i class="far fa-thumbs-up" aria-hidden="true"></i> Best First Search');
        enable_run();
        info.innerHTML = "<p>Greedy Best First Search selected, this is a weighted algorithm.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            const resetVisited = await grid.resetVisited();
            if(resetVisited === true){
                let reveal_targets = await bestFS(grid);
                revealAnimation(reveal_targets);
            }
        };
    };

    const bfs = document.getElementById('BFS_PR');
    bfs.onclick = (e) => {
        e.preventDefault();
        algo_selected('<i class="fas fa-expand-arrows-alt" aria-hidden="true"></i> Bredth First Search');
        enable_run();
        info.innerHTML = "<p>Bredth First Search selected, this is an unweighted algorithm.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            const resetVisited = await grid.resetVisited();
            if(resetVisited === true){
                const reveal_targets = await BFS(grid);
                revealAnimation(reveal_targets);
            }
        };
    };

    const dfs = document.getElementById('DFS_PR');
    dfs.onclick = (e) => {
        e.preventDefault();
        algo_selected('<i class="fas fa-arrow-down" aria-hidden="true"></i> Depth First Search');
        enable_run();
        info.innerHTML = "<p>Depth First Search selected, this is an unweighted algorithm.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            const resetVisited = await grid.resetVisited();
            if(resetVisited === true){
                const reveal_targets = await DFS(grid);
                revealAnimation(reveal_targets);
            }
        };
    };

    const djk = document.getElementById('DJK_PR');
    djk.onclick = (e) => {
        e.preventDefault();
        algo_selected('<i class="fas fa-random" aria-hidden="true"></i> Dijkstra Shortest Path');
        enable_run();
        info.innerHTML = "<p>Dijkstra's Shortest Path selected, this is a weighted algorithm.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            const resetVisited = await grid.resetVisited();
            if(resetVisited === true){
                const reveal_targets = await dijkstra(grid);
                revealAnimation(reveal_targets);
            }
        };
    };

    /*************************************MAZES*************************************/

    const maze_eller = document.getElementById('eller');
    maze_eller.onclick = async (e) => {
        e.preventDefault();
        close_tabs(maze_tabs);
        maze.classList.remove('_opened');
        grid.resetWalls();
        grid.resetVisited();
        const targets = await eller(grid);
        mazeGenAnimation(targets);
    }

    const maze_rb = document.getElementById('maze_rb');
    maze_rb.onclick = async (e) => {
        e.preventDefault();
        close_tabs(maze_tabs);
        maze.classList.remove('_opened');
        grid.resetWalls();
        grid.resetVisited();
        const targets = await recursiveBacktracking(grid);
        mazeGenAnimation(targets);
    }
    const maze_rd = document.getElementById('maze_rd');
    maze_rd.onclick = async (e) => {
        e.preventDefault();
        close_tabs(maze_tabs);
        maze.classList.remove('_opened');
        grid.resetWalls();
        grid.resetVisited();
        const targets = await recursiveDivision(grid);
        mazeGenAnimation(targets);
    }

    const maze_kruskal = document.getElementById('kruskal');
    maze_kruskal.onclick = async (e) => {
        e.preventDefault();
        close_tabs(maze_tabs);
        maze.classList.remove('_opened');
        grid.resetWalls();
        grid.resetVisited();
        const targets = await kruskal(grid);
        mazeGenAnimation(targets);
    }

    /*************************************RESET BUTTONS*************************************/

    const random_weights = document.getElementById('random_weights');
    random_weights.onclick = (e) => {
        e.preventDefault();
        grid.randomizeWeights();
    }

    const reset_weights = document.getElementById('reset_weights');
    reset_weights.onclick = (e) => {
        e.preventDefault();
        grid.resetWeights();
    }

    const reset_walls = document.getElementById('reset_walls');
    reset_walls.onclick = (e) => {
        e.preventDefault();
        grid.resetWalls();
    }

    const reset_grid = document.getElementById('reset_grid');
    reset_grid.onclick = (e) => {
        e.preventDefault();
        grid.resetGrid();
    }

    /*************************************TUTORIAL BUTTON*************************************/

    const tutorialIcon = document.getElementById('tutorial');
    tutorial_icon_animate = anime({
        targets: tutorialIcon,
        backgroundColor:['#ab47bc','#42a5f5'],
        easing: 'easeInOutExpo',
        endDelay: 1000,
        autoplay: false,
        direction: 'alternate',
        loop: true
    });

    tutorial_icon_animate.play();
    const tutorial = document.getElementById('tutorial');
    tutorial.onclick = (e) => {
        e.preventDefault();
        tutorial_icon_animate.reset();
    };
}

function revealAnimation(targets) {
    const run = document.getElementById('RUN');

    const tm = anime.timeline({});
    const {
        visited_targets,
        shortest_path
    } = targets;
    const v_elems = [];
    visited_targets.forEach(el => v_elems.push(document.getElementById(el)));

    tm.add({
        targets: v_elems,
        backgroundColor: [
            {value: '#fff1ff'},
            {value: '#df78ef'},
            {value: '#ab47bc'}
        ],
        scale: [
            {value: 0.5},
            {value: 1.2, easing: 'easeInExpo'},
            {value: 1, easing: 'easeOutBounce'}
        ],
        delay: anime.stagger(10),
        begin: () => {
            run.classList.add('disabled');
            animating_path = true;
        }
    });

    if(shortest_path.length === 0){
        run.classList.remove('disabled');
        animating_path = false;
        return;
    }

    const sp_elems = [];
    shortest_path.forEach(el => sp_elems.push(document.getElementById(el)));

    const start_elem = sp_elems.shift();
    const end_elem = sp_elems.pop();

    // tm.add({
    //     targets: start_elem,
    //     backgroundColor: [
    //         {value: '#fff1ff'},
    //         {value: '#80d6ff'},
    //         {value: '#42a5f5'}
    //     ],
    //     borderRadius:[
    //         {value: '100%'},
    //         {value: '75%'},
    //         {value: '50%'}
    //     ],
    //     borderColor:[
    //         {value: '#cfff95'},
    //         {value: '#9ccc65'},
    //         {value: '#6b9b37'}
    //     ],
    //     scale: [
    //         {value: 0.5},
    //         {value: 2.2, easing: 'easeOutBounce'}
    //     ],
    //     update: () =>{
    //         start_elem.style.position = 'relative';
    //     }
    // });

    tm.add({
        targets: sp_elems,
        backgroundColor: [
            {value: '#cfff95'},
            {value: '#9ccc65'},
            {value: '#6b9b37'}
        ],
        borderColor:[
            {value: '#cfff95'},
            {value: '#9ccc65'},
            {value: '#6b9b37'}
        ],
        scale: [
            {value: 0.5},
            {value: 1.2, easing: 'easeInExpo'},
            {value: 1, easing: 'easeOutBounce'}
        ],
        delay: anime.stagger(20),
        begin: () => {
            start_elem.classList.add('expanded');
        },
        complete: () => {
            end_elem.classList.add('expanded');
            run.classList.remove('disabled');
            animating_path = false;
        }
    });

    // tm.add({
    //     targets: end_elem,
    //     backgroundColor: [
    //         { value: '#cfff95'},
    //         { value: '#ffa270'},
    //         { value: '#ff7043'}
    //     ],
    //     borderColor:[
    //         {value: '#cfff95'},
    //         {value: '#9ccc65'},
    //         {value: '#6b9b37'}
    //     ],
    //     borderRadius: [
    //         {value: '100%'},
    //         {value: '75%'},
    //         {value: '50%'}
    //     ],
    //     scale: [
    //         {value: 0.5},
    //         {value: 1.8, easing: 'easeOutBounce'}
    //     ]
    // });
}

function mazeGenAnimation(targets){
    let tIndex = 0;

    const addWall = () =>{
        targets[tIndex].classList.add('wall');
        ++tIndex;
        if(tIndex < targets.length){
            setTimeout(addWall);
        }
    }
    addWall();
    // anime({
    //     targets: targets,
    //     backgroundColor: {
    //         value:['#fff1ff', '#5f4339'],
    //         easing: "easeInOutExpo"
    //     },
    //     scale: [
    //         {value: 0.5},
    //         {value: 1.2, easing: 'easeInExpo'},
    //         {value: 1, easing: 'easeOutBounce'}
    //     ],
    //     borderColor: '#5f4339',
    //     delay: anime.stagger(5)
    // });
}

initAll();