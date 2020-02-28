export function bubbleSort(grid_bar_nums, grid_bars){
    const cur_indices = [];
    const swaps = [];
    for(let i = 0; i < grid_bars.length-1; ++i){
        for(let j = 1; j < grid_bars.length-i; ++j){
            cur_indices.push(j-1);
            cur_indices.push(j);
            if(grid_bar_nums[j-1] > grid_bar_nums[j]){
                swaps.push(true);
                swapGridNums(grid_bar_nums, grid_bars, j-1, j);
            }else{
                swaps.push(false);
            }
        }
    }
    return [cur_indices, swaps];
}

export function cocktailShakerSort(grid_bar_nums, grid_bars){
    const cur_indices = [];
    const swaps = [];
    let swapped = true;
    let start = 0;
    let end = grid_bars.length;
    while(swapped === true){
        swapped = false;
        for(let i = start+1; i < end; ++i){
            if(grid_bar_nums[i-1] > grid_bar_nums[i]){
                swapped = true;
                swaps.push(true);
                cur_indices.push(i-1);
                cur_indices.push(i);
                swapGridNums(grid_bar_nums, grid_bars, i-1, i);
            }
        }
        --end;
        if(swapped === false){
            break;
        }
        swapped = false;
        for(let j = end-1; j > start; --j){
            if(grid_bar_nums[j] < grid_bar_nums[j-1]){
                swapped = true;
                swaps.push(true);
                cur_indices.push(j-1);
                cur_indices.push(j);
                swapGridNums(grid_bar_nums, grid_bars, j, j-1);
            }
        }
        ++start;
    }
    return [cur_indices, swaps];
}

export function insertionSort(grid_bar_nums, grid_bars){
    const cur_indices = [];
    const swaps = [];
    for(let i = 1; i < grid_bars.length; ++i){
        let j = i;
        while(j > 0 && grid_bar_nums[j-1] > grid_bar_nums[j]){
            swaps.push(true);
            cur_indices.push(j-1);
            cur_indices.push(j);
            swapGridNums(grid_bar_nums, grid_bars, j-1, j);
            --j;
        }
    }
    return [cur_indices, swaps];
}

export function heapSort(grid_bar_nums, grid_bars){
    const swaps = [];
    const swaps2 = [];
    const cur_indices = [];
    const cur_indices2 = [];
    const heap = [];

    let k = 0;

    const heap_insert = (num)=>{
        let grid_idx = k;

        heap.push(num);

        let curIdx = heap.length - 1;
        let curParentIdx = Math.floor((curIdx-1)/2);
        
        swaps.push(true);
        cur_indices.push(curIdx);
        cur_indices.push(grid_idx);
        swapGridNums(grid_bar_nums, grid_bars, curIdx, grid_idx);
        ++k;

        while(curIdx !== 0 && heap[curIdx] > heap[curParentIdx]){
            const parent = heap[curParentIdx];
            heap[curParentIdx] = heap[curIdx];
            heap[curIdx] = parent;

            swaps.push(true);
            cur_indices.push(curParentIdx);
            cur_indices.push(curIdx);
            swapGridNums(grid_bar_nums, grid_bars, curParentIdx, curIdx);

            curIdx = curParentIdx;
            curParentIdx = Math.floor((curIdx-1) / 2);
        }
    }
    const heap_remove = () => {
        
        if(heap.length === 0){
            return null;
        }
        if(heap.length === 1){
            return heap.pop();
        }
        
        const output = heap[0];
        heap[0] = heap.pop();
        
        swaps2.push(true);
        cur_indices2.push(0);
        cur_indices2.push(heap.length);
        swapGridNums(grid_bar_nums, grid_bars, 0, heap.length);
        
        heapify(0);
        return output
    }
    const heapify = (index) =>{
        let curIdx = index;
        let [l, r] = [2*curIdx + 1, 2*curIdx + 2];
        while (l < heap.length){
            let curChildIdx = l;
            if(r < heap.length - 1){
                curChildIdx = heap[r] > heap[l] ? r : l;
            }
            if(heap[curIdx] < heap[curChildIdx]){
                const curNum = heap[curIdx];
                heap[curIdx] = heap[curChildIdx];
                heap[curChildIdx] = curNum;

                swaps2.push(true);
                cur_indices2.push(curIdx);
                cur_indices2.push(curChildIdx);
                swapGridNums(grid_bar_nums, grid_bars, curIdx, curChildIdx);
            }
            curIdx = curChildIdx;
            l = 2*curIdx + 1;
            r = 2*curIdx + 2;
        }
    }
    grid_bar_nums.forEach(bar =>{
        heap_insert(bar);
    });

    k = 99;
    for(let i = 0; i < 100; ++i){
        heap_remove();
    }
    
    return [cur_indices, cur_indices2, swaps, swaps2];
}

export function mergeSort(grid_bar_nums, grid_bars){
    const swaps = [];
    const animation_stack = [];

    const merge_sort = (left, right) => {
        if(left < right){
            const mid = left + Math.floor((right-left)/2);
            merge_sort(left, mid);
            merge_sort(mid+1, right);
            merge(left, mid, right);
        }
    }
    const merge = (left, mid, right) => {
        let [i, j, k] = [0, 0, left];
        let l_size = mid - left + 1;
        let r_size = right - mid;

        const left_arr = grid_bar_nums.slice(left, left+l_size);
        const right_arr = grid_bar_nums.slice(mid+1, mid+1+r_size);

        const left_arr_elems = grid_bars.slice(left, left+l_size);
        const right_arr_elems = grid_bars.slice(mid+1, mid+1+r_size);

        while(i < l_size && j < r_size){
            if(left_arr[i] <= right_arr[j]){
                grid_bar_nums[k] = left_arr[i];
                grid_bars[k] = left_arr_elems[i];

                swaps.push(true);
                animation_stack.push(k);
                animation_stack.push(left_arr_elems[i]);
                animation_stack.push(right_arr_elems[j]);

                ++i;
            }else{
                grid_bar_nums[k] = right_arr[j];
                grid_bars[k] = right_arr_elems[j];

                swaps.push(true);
                animation_stack.push(k);
                animation_stack.push(right_arr_elems[j]);
                animation_stack.push(left_arr_elems[i]);

                ++j;
            }
            ++k;
        }
        while(i < left_arr.length){
            grid_bar_nums[k] = left_arr[i];
            grid_bars[k] = left_arr_elems[i];

            swaps.push(true);
            animation_stack.push(k);
            animation_stack.push(left_arr_elems[i]);
            animation_stack.push(left_arr_elems[i]);
            ++i;
            ++k;
        }
        while(j < right_arr.length){
            grid_bar_nums[k] = right_arr[j];
            grid_bars[k] = right_arr_elems[j];

            swaps.push(true);
            animation_stack.push(k);
            animation_stack.push(right_arr_elems[j]);
            animation_stack.push(right_arr_elems[j]);
            ++j;
            ++k;
        }
    }
    merge_sort(0, grid_bar_nums.length-1);
    return [animation_stack, swaps];
}

export function quickSort(grid_bar_nums, grid_bars){
    const swaps = [];
    const cur_indices = [];
    const quick_sort = (l, r) => {
        if(r < l) return;

        const pivotIndx = l + Math.floor(Math.random()*(r-l));
        const pivot = grid_bar_nums[pivotIndx];
        let i = l;
        let j = l;

        swaps.push(true);
        cur_indices.push(l);
        cur_indices.push(pivotIndx)

        swapGridNums(grid_bar_nums, grid_bars, l, pivotIndx);

        while(j <= r){
            swaps.push(false);
            cur_indices.push(l);
            cur_indices.push(j);
            
            if(grid_bar_nums[j] < pivot){
                ++i;
                
                swaps.push(true);
                cur_indices.push(i);
                cur_indices.push(j);
                
                swapGridNums(grid_bar_nums, grid_bars, i, j);
            }
            ++j;
        }
        swaps.push(true);
        cur_indices.push(l);
        cur_indices.push(i);

        swapGridNums(grid_bar_nums, grid_bars, l, i);

        quick_sort(l, i-1);
        quick_sort(i+1, r);
    }
    quick_sort(0, grid_bars.length-1);
    return [cur_indices, swaps];
}

export function selectionSort(grid_bar_nums, grid_bars){
    const bar_num = grid_bars.length;
    const swaps = [];
    const cur_indices = [];
    for(let i = 0; i < bar_num-1; ++i){
        let minIdx = i;
        for(let j = i+1; j < bar_num; ++j){
            cur_indices.push(minIdx);
            cur_indices.push(j);
            swaps.push(false);
            if(grid_bar_nums[j] < grid_bar_nums[minIdx]){
                minIdx = j;
            }
        }
        cur_indices.push(i);
        cur_indices.push(minIdx);
        swaps.push(true);
        swapGridNums(grid_bar_nums, grid_bars, i, minIdx);
    }
    return [cur_indices, swaps];
}

function swapGridNums(grid_bar_nums, grid_bars, a, b){
    const temp_num = grid_bar_nums[b];
    grid_bar_nums[b] = grid_bar_nums[a];
    grid_bar_nums[a] = temp_num;

    const temp_elem = grid_bars[b];
    grid_bars[b] = grid_bars[a];
    grid_bars[a] = temp_elem;
}
function insertGridNums(grid_bar_nums, grid_bars, a, b){
    const temp_num = grid_bar_nums.splice(b, 1);
    grid_bar_nums.splice(a, 0, temp_num);

    const temp_elem = grid_bars.splice(b, 1);
    grid_bars.splice(a, 0, temp_elem);
}