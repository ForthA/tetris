var board = [];


for (let row = -2; row < 20; row++) {
    board[row] = [];

    for (let col = 0; col < 10; col++) {
        board[row][col] = 0;
    }
}

const board_canvas= document.getElementById("tetris_board");

const board_ctx = board_canvas.getContext('2d');


var new_figure_board = []

var figures_name = ['S', 'B', 'L', 'Z', 'T'];

const figures = {
    'S' : [
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0],
        [1, 0, 0, 0]
    ],
    'B' : [
        [1, 1],
        [1, 1]
    ],
    'L' : [
        [1, 0, 0],
        [1, 0, 0],
        [1, 1, 0]
    ],
    'Z' : [
        [1, 0, 0],
        [1, 1, 0],
        [0, 1, 0]
    ],
    'T' : [
        [1, 1, 1],
        [0, 1, 0]
    ]
}
const colors = {
    'S': "blue",
    'B': "red",
    'L': "orange",
    'Z': "green",
    'T': "purple"
}

var figure = get_new_figure();
draw_new_figure_window(figure.name, colors[figure.name]);
document.addEventListener('keydown', (event) => {
    const keyName = event.key;
    switch (keyName){
        case 'ArrowLeft':
            if (isValid(figure.row, figure.column - 1)) {
                figure.column--;
            }
            break;
        case 'ArrowRight':
            if (isValid(figure.row, figure.column + 1)) {
                figure.column++;
            }
            break;
        default:
            break;
    }
});
function draw_board(){
    let height = parseInt(board_canvas.getAttribute('height'), 10);
    let width = parseInt(board_canvas.getAttribute('width'), 10);
    let cube_size = width/10;
    if (board_canvas.getContext('2d')){
        for (let i = 0;i < board.length;i++){
            for(let j = 0;j < board[i].length;j++){
                if (board[i][j] !== 0) {
                    board_ctx.fillStyle = colors[board[i][j]];
                    board_ctx.fillRect((i * cube_size) + 1, (j * cube_size) + 1, cube_size - 1, cube_size - 1);
                }
            }
        }
    }
}
function rotate_matrix(arr){
    let n_arr= [];
    let n_rows = arr[0].length;
    let n_cols = arr.length;
    for(let x = 0; x < n_rows; x++){
        let row_arr = [];
        for(let y = (n_cols - 1), z = 0; y >= 0; y--, z++){
            row_arr[z] = arr[y][x];
        }
        n_arr[x] = row_arr;
    };
    return n_arr;
}

function draw_new_figure_window(name, color){
    let canvas = document.getElementById("new_tetris_figure");
    let height = parseInt(canvas.getAttribute('height'), 10);
    let width = parseInt(canvas.getAttribute('width'), 10);
    let cube_size = width / 4;
    if (canvas.getContext('2d')){
        let ctx = canvas.getContext('2d');
        for (let i = 0;i < new_figure_board.length;i++){
            for(let j = 0;j < new_figure_board[i].length;j++){
                if (new_figure_board[i][j] !== 0) {
                    ctx.fillStyle = color;
                    if (name === 'S')
                        ctx.fillRect(cube_size * i + 1,cube_size + cube_size * j + 1, cube_size - 1, cube_size - 1)
                    else
                        ctx.fillRect(50 + cube_size * i + 1, 50 + cube_size * j + 1, cube_size - 1, cube_size - 1);
                }
            }
        }

    }
}

function draw_figure(){
    let height = parseInt(board_canvas.getAttribute('height'), 10);
    let width = parseInt(board_canvas.getAttribute('width'), 10);
    let cube_size = width/10;
    if (board_canvas.getContext('2d')) {
        for (let i = 0; i < figure.matrix.length; i++) {
            for (let j = 0; j < figure.matrix[i].length; j++) {
                if (new_figure_board[i][j] !== 0) {
                    board_ctx.fillStyle = colors[figure.name];
                    board_ctx.fillRect(((i + figure.column) * cube_size) + 1, ((j + figure.row) * cube_size) + 1, cube_size - 1, cube_size - 1);
                }
            }
        }
    }
}

function get_new_figure() {
    let figure_number = Math.floor(Math.random() * 5);
    let name = figures_name[figure_number];
    let matrix = figures[name];
    new_figure_board = matrix;
    return {
        name: name,
        matrix: matrix,
        row : -1,
        column : 2
    };
}

function isValid(x, y){
    for (let i = 0; i < figure.matrix.length; i++){
        for (let j = 0; j < figure.matrix[i].length; j++){
            if (figure.matrix[i][j] !== 0 && (board[i + x][j + y] !== 0
                || board[i + x][j + y] !== 0 || board[i + x][j + y] !== 0
                || board[i + x][j + y] !== 0)){
                return false;
            }
        }
    }
    return true;
}

function place_figure(x, y){
    for (let i = 0; i < figure.matrix.length; i++){
        for(let j = 0; j < figure.matrix[i].length; j++){
            board[x + i][y + j] = figure.name;
        }
    }
}
function loop(){
    if (!isValid(figure.row, figure.column)){
        place_figure();
        figure = get_new_figure();
        draw_new_figure_window(figure.name, colors[figure.name]);
    }
    board_ctx.fillStyle = 'black';
    board_ctx.fillRect(0, 0, board_canvas.width, board_canvas.height);
    draw_board();
    draw_figure();
    figure.row++;
}
function read(source){
    source.value = localStorage["tetris.username"];
}
function load_player_name(){
    let source = {};
    read(source);
    let name_place = document.getElementById("name-place");
    name_place.innerHTML = "Игрок: " + source.value;
}



const interval = setInterval(() =>
        loop()
    , 500);