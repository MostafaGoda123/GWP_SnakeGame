let lastRenderTime = 0
let snake_speed = 5 ;
let gameOver = false
let game_board = document.getElementById("game_board")

function main(currentTime) {
   if (gameOver) {
      if (confirm("You lose!!! pres OK to restart")) {
         window.location = "/"
      }
      return;
   }

   window.requestAnimationFrame(main)
   let seconds = (currentTime - lastRenderTime) / 1000 ;
   if ( seconds < 1 / snake_speed ) return
   lastRenderTime = currentTime
   update()
   draw()
}
window.requestAnimationFrame(main)
/*-------------------------------------------*/
function update() {
   updateSnake()
   checkDeath()
   updateFood()
}
function draw() {
   game_board.innerHTML = "";
   drawSnake()
   drawFood()
}
/*-------------------------------------------*/
let snakeBody = [ 
   { x:11 , y:11 }
]
function updateSnake() {
   for ( i=snakeBody.length - 2 ; i>=0 ; i-- ){
      snakeBody[i+1] = {...snakeBody[i]}
   }
   getInputDirection()
   snakeBody[0].x += inputDirection.x ;
   snakeBody[0].y += inputDirection.y ;
}
/*-------------------------------------------*/
function drawSnake() {
   snakeBody.forEach(segment => {   
      let segElement = document.createElement("div")
      segElement.style.gridColumnStart = segment.x
      segElement.style.gridRowStart = segment.y
      segElement.classList.add("snake")
      game_board.appendChild(segElement)
   })
}
/*-------------------------------------------*/
let inputDirection = { x:0 , y:0 } , lastInputDirection
function getInputDirection() {
   window.addEventListener("keydown" , function (e) {
      switch (e.key) {
         case "ArrowUp":
            if ( lastInputDirection.y !== 0 ) break ;
            inputDirection = { x:0 , y:-1 }
            break;
         case "ArrowDown":
            if ( lastInputDirection.y !== 0 ) break ;
            inputDirection = { x:0 , y:1 }
            break;
         case "ArrowLeft":
            if ( lastInputDirection.x !== 0 ) break ;
            inputDirection = { x:-1 , y:0 }
            break;
         case "ArrowRight":
            if ( lastInputDirection.x !== 0 ) break ;
            inputDirection = { x:1 , y:0 }
            break;
      }
   })
   lastInputDirection = inputDirection ;
   return inputDirection 
}
/*-------------------------------------------*/
let snakeFood = randomGridPosition() 
let expansion_rate = 1 ;
let newSegment = 0 ;
function updateFood() {
   if (onSnake(snakeFood)) {
      newSegment += expansion_rate ;
      for ( i=0 ; i<newSegment ; i++ ){
         snakeBody.push({ ...snakeBody[snakeBody.length-1] })
      }
      newSegment = 0 ;
      snakeFood = randomGridPosition()
   }
}
function onSnake(position) {
   return snakeBody.some(seg => {
      return position.x === seg.x && position.y === seg.y
   })
}
function randomGridPosition() {
   let newFood;
   while (newFood == null || onSnake(newFood)) {
      return {
         x : Math.floor(Math.random()*21) + 1 ,
         y : Math.floor(Math.random()*21) + 1 
      }
   }
}
/*-------------------------------------------*/
function drawFood() {
   let segElement = document.createElement("div")
   segElement.style.gridColumnStart = snakeFood.x
   segElement.style.gridRowStart = snakeFood.y
   segElement.classList.add("food")
   game_board.appendChild(segElement)
}
/*-------------------------------------------*/
function checkDeath() {
   if (
      snakeBody[0].x < 1 ||
      snakeBody[0].x > 21 ||
      snakeBody[0].y < 1 ||
      snakeBody[0].y > 21 ||
      onSnakeIgnoreHead()
   ) {
      gameOver = true
   }
}
function onSnakeIgnoreHead() {
   return snakeBody.some((seg , index) => {
      if ( index == 0 ) return false
      else {
         return snakeBody[0].x === seg.x && snakeBody[0].y === seg.y
      }
   })
}
/*-------------------------------------------*/
