import anime from './modules/anime.es.js';
import {bubbleSort, cocktailShakerSort, insertionSort, heapSort, mergeSort, quickSort, selectionSort} from './modules/sorting.js'; 

let grid_bars = [];
let grid_bar_nums = [];
const bar_num = 100;

let is_sorted = false;
let animating_sort = false;
let phase_one_done = false;

let tutorial_icon_animate = null;

function initAll(){
    initGridBars();
    initButtons();
}

function initButtons() {
    const algorithms = document.getElementById('selected_algorithm');
    const algo_tabs = document.getElementById('algo_tabs');

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

    const algo_selected = () =>{
        algorithms.classList.remove('_opened');
        close_tabs(algo_tabs);
    }

    algorithms.onclick = (e) =>{
        e.preventDefault();
        if(algo_tabs.classList.contains('_closed')){
            open_tabs(algo_tabs);
            algorithms.classList.add('_opened');
        }else{
            close_tabs(algo_tabs);
            algorithms.classList.remove('_opened');
        }
    }

    const run = document.getElementById('RUN');

    const enable_run = () =>{
        if(run.classList.contains('disabled') && animating_sort === false){
            run.classList.remove('disabled');
        }
    }

    const info = document.getElementById('info');

    /*************************************ALGORITHMS*************************************/
    const bubble_sort = document.getElementById('bubble');
    bubble_sort.onclick = (e) =>{
        e.preventDefault();
        algo_selected();
        enable_run();
        setDescription("O( n<sup>2</sup> )", "O( n<sup>2</sup> )", "O( n<sup>2</sup> )", "O( 1 )");
        info.innerHTML = "<p><i class='far fa-comments'></i> Bubble sort, is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements and swaps them if they are in the wrong order.</p>";
        run.onclick = (e) => {
            e.preventDefault();
            if(is_sorted === true){
                reshufle();
            }
            const [cur_indices, swaps] = bubbleSort(grid_bar_nums, grid_bars);
            animateAlgorithm(cur_indices, swaps, false);
        };
    };

    const cocktail_sort = document.getElementById('cocktail');
    cocktail_sort.onclick = (e) =>{
        e.preventDefault();
        algo_selected();
        enable_run();
        setDescription("O( n<sup>2</sup> )", "O( n<sup>2</sup> )", "O( n<sup>2</sup> )", "O( 1 )");
        info.innerHTML = "<p><i class='fas fa-cocktail' aria-hidden='true'></i> Cocktail shaker sort, is an extension of bubble sort. The algorithm extends bubble sort by operating in two directions.</p>";
        run.onclick = async (e) => {
            e.preventDefault();
            if(is_sorted === true){
                reshufle();
            }
            const [cur_indices, swaps] = await cocktailShakerSort(grid_bar_nums, grid_bars);
            animateAlgorithm(cur_indices, swaps, false);
        };
    };


    const insertion_sort = document.getElementById('insertion');
    insertion_sort.onclick = (e) => {
        e.preventDefault();
        algo_selected();
        enable_run();
        setDescription("O( n<sup>2</sup> )", "O( n )", "O( n<sup>2</sup> )", "O( 1 )");
        info.innerHTML = "<p><i class='fas fa-sign-in-alt'></i> Insertion sort is a simple sorting algorithm that builds the final sorted array one item at a time. It is much less efficient on large lists than more advanced algorithms such as quicksort, heapsort, or merge sort.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            if(is_sorted === true){
                reshufle();
            }
            let [cur_indices, swaps] = await insertionSort(grid_bar_nums, grid_bars);
            animateAlgorithm(cur_indices, swaps, false);
        };
    };

    const heap_sort = document.getElementById('heap');
    heap_sort.onclick = (e) => {
        e.preventDefault();
        algo_selected();
        enable_run();
        setDescription("O( nlog n )", "O( nlog n )", "O( nlog n )", "O( n )");
        info.innerHTML = "<p><i class='fas fa-mountain'></i> Heapsort is a comparison-based sorting algorithm. Heapsort divides its input into a sorted and an unsorted region, and it iteratively shrinks the unsorted region by extracting the largest element from it and inserting it into the sorted region.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            if(is_sorted === true){
                reshufle();
            }
            const [cur_indices, cur_indices2, swaps, swaps2] = await heapSort(grid_bar_nums, grid_bars);
            animateAlgorithm(cur_indices, swaps, true);
            const phase2 = () =>{
                if(phase_one_done === true){
                    animateAlgorithm(cur_indices2, swaps2, false);
                }else{
                    setTimeout(phase2, 500);
                }
            }
            phase2();
        };
    };

    const merge_sort = document.getElementById('merge');
    merge_sort.onclick = (e) => {
        e.preventDefault();
        algo_selected();
        enable_run();
        setDescription("O( nlog n )", "O( nlog n )", "O( nlog n )", "O( n )");
        info.innerHTML = "<p><i class='fas fa-compress-arrows-alt'></i> Merge sort is an efficient, general-purpose, comparison-based sorting, divide and conquer algorithm.</p>";
        run.onclick = (ev) => {
            ev.preventDefault();
            if(is_sorted === true){
                reshufle();
            }
            const [cur_indices, swaps] = mergeSort(grid_bar_nums, grid_bars);
            animateMergeSort(cur_indices, swaps);
        };
    };

    const quick_sort = document.getElementById('quick');
    quick_sort.onclick = (e) => {
        e.preventDefault();
        algo_selected();
        enable_run();
        setDescription("O( n<sup>2</sup> )", "O( nlog n )", "O( nlog n )", "O( n )");
        info.innerHTML = "<p><i class='fas fa-bolt'></i> Quicksort is a divide-and-conquer algorithm. It works by selecting a 'pivot' element from the array and partitioning the other elements into two sub-arrays, according to whether they are less than or greater than the pivot. The sub-arrays are then sorted recursively.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            if(is_sorted === true){
                reshufle();
            }
            const [cur_indices, swaps] = await quickSort(grid_bar_nums, grid_bars);
            animateAlgorithm(cur_indices, swaps, false);
        };
    };

    const selection_sort = document.getElementById('selection');
    selection_sort.onclick = (e) => {
        e.preventDefault();
        algo_selected();
        enable_run();
        setDescription("O( n<sup>2</sup> )", "O( n )", "O( n<sup>2</sup> )", "O( 1 )");
        info.innerHTML = "<p><i class='fas fa-hand-pointer'></i> Selection sort is an in-place comparison sorting algorithm. It is noted for its simplicity and has performance advantages over more complicated algorithms in certain situations.</p>";
        run.onclick = async (ev) => {
            ev.preventDefault();
            if(is_sorted === true){
                reshufle();
            }
            const [cur_indices, swaps] = await selectionSort(grid_bar_nums, grid_bars);
            animateAlgorithm(cur_indices, swaps, false);
        };
    };

    // /*************************************RESET BUTTONS*************************************/

    const shuffle = document.getElementById('shuffle');
    shuffle.onclick = (e) => {
        e.preventDefault();
        reshufle();
    }``
}

function initGridBars(){
    const temp_grid_bars = [];
    const temp_grid_bar_nums = [];
    const sort_grid = document.getElementById('sort_grid');
    for(let i = 0; i < bar_num; ++i){
        const bar = document.createElement('div');
        bar.classList.add('grid_bar');
        bar.id = `h${i}`;
        bar.style.height = `${i*0.74 + 1}vh`;

        temp_grid_bars.push(bar);
        temp_grid_bar_nums.push(i);
    }
    [grid_bars, grid_bar_nums] = shuffleArray(temp_grid_bars, temp_grid_bar_nums);
    grid_bars.forEach(bar => {
        sort_grid.appendChild(bar);
    });
}

function setDescription(wct, bct, avt, wcs){
    const description = document.getElementById('description');
    if(!description.classList.contains('slide_down')){
        description.classList.add('slide_down');
    }
    const wct_elem = document.getElementById('wct');
    const bct_elem = document.getElementById('bct');
    const avt_elem = document.getElementById('avt');
    const wcs_elem = document.getElementById('wcs');

    wct_elem.innerHTML = wct;
    bct_elem.innerHTML = bct;
    avt_elem.innerHTML = avt;
    wcs_elem.innerHTML = wcs;
}

function shuffleArray(elem_arr, num_arr) {
    let elem_copy = [].concat(elem_arr);
    let num_copy = [].concat(num_arr);

    let elem_output = [];
    let num_output = [];

    let n = elem_arr.length;
    let i = Number;
    while (n) {
        i = Math.floor(Math.random() * n--);
        elem_output.push(elem_copy.splice(i, 1)[0]);
        num_output.push(num_copy.splice(i, 1)[0]);

    }
    return [elem_output, num_output];
}

function reshufle(){
    const sort_grid = document.getElementById('sort_grid');
    grid_bars.forEach(bar=>{
        sort_grid.removeChild(bar);
    });

    grid_bar_nums.length = 0;
    grid_bars.length = 0;

    animating_sort = false;
    phase_one_done = false;
    is_sorted = false;

    initGridBars();
}

function animateMergeSort(stack, swaps){
    const run = document.getElementById('RUN');
    const sort_grid = document.getElementById('sort_grid');
    const insert = (elem, index) =>{
        sort_grid.removeChild(elem);
        sort_grid.insertBefore(elem, sort_grid.childNodes[index]);
    }
    const helper = (indx) => {
        if(indx < swaps.length){
            const index = stack[3*indx];
            const elem1 = stack[3*indx+1];
            const elem2 = stack[3*indx+2];
            anime({
                targets: [elem1, elem2],
                backgroundColor: ['#42a5f5', '#fff1ff'],
                duration: 20
            });
            if(swaps[indx] === true){
                insert(elem1, index);
            }
            setTimeout(helper, 0, indx+1);
        }else{
            is_sorted = true;
            phase_one_done = true;
            animating_sort = false;
            animateSortDone();
            run.classList.remove('disabled');
        }
    }
    run.classList.add('disabled');
    animating_sort = true;
    helper(0);
}

function animateAlgorithm(cur_indices, swaps, two_phased){
    const run = document.getElementById('RUN');
    const sort_grid = document.getElementById('sort_grid');

    const helper = (idx) =>{
        if(idx < swaps.length){
            const a = cur_indices[2*idx];
            const b = cur_indices[2*idx +1];
            let child_a = sort_grid.childNodes[a+1];
            let child_b = sort_grid.childNodes[b+1];
            anime({
                targets: [child_a, child_b],
                backgroundColor: ['#42a5f5', '#fff1ff'],
                duration: 3
            });
            swap(a+1, b+1, idx, swaps[idx]);
            
        }else{
            if(!two_phased){
                animateSortDone();
            }
            is_sorted = true;
            phase_one_done = true;
            animating_sort = false;
            run.classList.remove('disabled');
        }
    }

    const swap = (a, b, idx, swp) =>{
        let child_a = sort_grid.childNodes[a];
        let child_b = sort_grid.childNodes[b];
        
        if(swp === true){
            if(a+1 === b){
                sort_grid.insertBefore(child_b, child_a);
            }else if(b === bar_num){
                sort_grid.insertBefore(child_b, child_a);
                sort_grid.removeChild(child_a);
                sort_grid.appendChild(child_a);
            }else if(a !== b){
                sort_grid.insertBefore(child_b, child_a);
                child_a = sort_grid.childNodes[a+1];
                child_b = sort_grid.childNodes[b+1];
                sort_grid.insertBefore(child_a, child_b);
            }
        }
        setTimeout(helper, 6, idx+1);
    }

    run.classList.add('disabled');
    animating_sort = true;
    helper(0);
}

function animateSortDone(){
    anime({
        targets: grid_bars,
        backgroundColor: [{value: '#ffeb3b', duration: 100}, {value: '#42a5f5', duration: 100}],
        easing: 'easeInOutExpo',
        delay: anime.stagger(10)
    });
}

initAll();