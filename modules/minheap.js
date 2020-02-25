export default class MinHeap{
    constructor(){
        this.heap = [];
        this.heapMap = new Map();

        this.insert = this.insert.bind(this);
        this.getLength = this.getLength.bind(this);
        this.remove = this.remove.bind(this);
        this.heapify = this.heapify.bind(this);
        this.has = this.has.bind(this);
        this.update = this.update.bind(this);
    }

    getLength(){
        return this.heap.length;
    }

    insert(obj, priority){
        const node = {node: obj, pr: priority, removed: false};
        this.heap.push(node);
        let curIdx = this.heap.length - 1;
        let curParentIdx = Math.floor((curIdx-1)/2);

        this.heapMap.set(obj.id, curIdx);
        while(curIdx !== 0 && this.heap[curIdx].pr < this.heap[curParentIdx].pr){
            const parent = this.heap[curParentIdx];
            this.heap[curParentIdx] = this.heap[curIdx];
            this.heap[curIdx] = parent;

            this.heapMap.set(this.heap[curParentIdx].node.id, curParentIdx);
            this.heapMap.set(this.heap[curIdx].node.id, curIdx);

            curIdx = curParentIdx;
            curParentIdx = Math.floor((curIdx-1) / 2);
        }
    }
    remove(){
        if(this.heap.length === 0){
            return null;
        }
        if(this.heap.length === 1){
            return this.heap.pop().node;
        }

        const output = this.heap[0];
        this.heap[0] = this.heap.pop();

        if(output.removed === true){
            this.heapify(0);
            return null;
        }else{
            this.heapMap.delete(output.node.id);
            this.heapMap.set(this.heap[0].node.id, 0);
            this.heapify(0);
            return output.node;
        }



    }
    heapify(index){
        let curIdx = index;
        let [l, r] = [2*curIdx + 1, 2*curIdx + 2];
        while (l < this.heap.length){
            let curChildIdx = l;
            if(r < this.heap.length - 1){
                curChildIdx = this.heap[r].pr < this.heap[l].pr ? r : l;
            }
            if(this.heap[curIdx].pr > this.heap[curChildIdx].pr){
                const curNode = this.heap[curIdx];
                this.heap[curIdx] = this.heap[curChildIdx];
                this.heap[curChildIdx] = curNode;

                this.heapMap.set(this.heap[curIdx].node.id, curIdx);
                this.heapMap.set(this.heap[curChildIdx].node.id, curChildIdx);
            }
            curIdx = curChildIdx;
            l = 2*curIdx + 1;
            r = 2*curIdx + 2;
        }
    }
    has(obj){
        return this.heapMap.has(obj.id);
    }
    update(obj, priority){
        const idx = this.heapMap.get(obj.id);        
        this.heap[idx].removed = true;
        this.insert(obj, priority);
    }
}