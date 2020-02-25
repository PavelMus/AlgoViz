//import anime from './anime.es.js';

export default class Node{
    constructor(row, col){
        this.id = `${row}_${col}`;
        this.row = row;
        this.col = col;
        this.type = null;
        this.parent_node = null;
        this.adjacent_nodes = [];
        this.shuffled_adjacent_nodes = [];
        this.weight = 1;
        this.distance = Infinity;
        this.h_distance = Infinity;
        this.visited = false;
        this.wall = false;
        this.animating = false;

        // this.setParent = this.setParent.bind(this);
        // this.resetParent = this.resetParent.bind(this);
        // this.addAdjacentNode = this.addAdjacentNode.bind(this);
        // this.isWall = this.isWall.bind(this);
        this.toggleWall = this.toggleWall.bind(this);
        // this.setWeight = this.setWeight.bind(this);
        // this.resetWeight = this.resetWeight(this);
        // this.setNodeType = this.setNodeType.bind(this);
        // this.getNodeType = this.getNodeType.bind(this);
        // this.isEqual = this.isEqual.bind(this);
        this.animateNode = this.animateNode.bind(this);
        this.isAnimating = this.isAnimating.bind(this);
        this.toggleAnimation = this.toggleAnimation.bind(this);
    }
    // setParent(node){
    //     this.parent_node = node;
    // }
    // resetParent(){
    //     this.parent_node = null;
    // }
    // addAdjacentNode(node){
    //     this.adjacent_nodes.push(node);
    // }
    // isWall(){
    //     return this.wall;
    // }
    toggleWall(){
        this.wall = !this.wall;
    }
    // setWeight(weight){
    //     this.weight = weight;
    // }
    // resetWeight(){
    //     this.weight = 1;
    // }
    // setNodeType(type){
    //     if(type === 'start'){
    //         this.type = 0;
    //     }else if(type ==='end'){
    //         this.type = 1
    //     }else if(type === 'unvisited'){
    //         this.type = null;
    //     }
    // }
    // getNodeType(){
    //     if(this.type === 0){
    //         return 'start';
    //     }else if(this.type === 1){
    //         return 'end';
    //     }else{
    //         return 'unvisited';
    //     }
    // }
    // isEqual(node){
    //     return this.id === node.id;
    // }
    animateNode(anim){
        let elem = document.getElementById(this.id);
        switch (anim) {
            case 'place-wall':
            if(!this.isAnimating()){
                this.toggleAnimation();
                this.toggleWall();
                elem.classList.add('wall');
                //elem.childNodes[0].classList.add('fa-align-justify');
                // anime({
                //     targets: elem,
                //     backgroundColor: {
                //         value:['#fff1ff', '#5f4339'],
                //         easing: "easeInOutExpo"
                //     },
                //     scale:[
                //         {value: 0.5},
                //         {value: 1.2, easing: 'easeInExpo'},
                //         {value: 1, easing: 'easeOutBounce'}
                //     ],
                //     duration: 100,
                //     delay: 0
                // });
                setTimeout(this.toggleAnimation, 500);
            }
                break;
            case 'remove-wall':
                if(!this.isAnimating()){
                    this.toggleAnimation();
                    this.toggleWall();
                    elem.classList.remove('wall');
                    //elem.childNodes[0].classList.remove('fa-align-justify');
                    // anime({
                    //     targets: elem,
                    //     backgroundColor:['#5f4339', '#fff1ff'],
                    //     scale: 1,
                    //     duration: 100
                    // });
                    setTimeout(this.toggleAnimation, 500);
                }
                break;
            default:
                break;
        }
    }
    isAnimating(){
        return this.animating;
    }
    toggleAnimation(){
        this.animating = !this.animating;
    }
}