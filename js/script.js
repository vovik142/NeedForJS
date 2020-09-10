const score = document.querySelector('.score'),
 start = document.querySelector('.start'),
 gameArea = document.querySelector('.gameArea'),
 car = document.createElement('div');
 car.classList.add('car');


 start.addEventListener('click', startGame);
document.addEventListener('keydown', startRun);
document.addEventListener('keyup', stopRun);

const keys = {
    ArrowUp:false,
    ArrowDown:false,
    ArrowLeft:false,
    ArrowRight:false
};


const settings = {
    start: false,
    score: 0,
    speed: 3,
    traffic: 3
};
    

 function getQuantityElements(heightElement){
    return document.documentElement.clientHeight / heightElement + 1;
 }
    
 function startGame ()  {
    start.classList.add('hide');
    gameArea.innerHTML = ''; // очищаем поле
    for (let i = 0; i < getQuantityElements(100); i++){
        const line = document.createElement('div');
        line.classList.add('line');
        line.style.top = (i * 100) + 'px';
        line.y = i * 100;
        gameArea.appendChild(line);
    }

    for (let i = 0; i < getQuantityElements(100 + settings.traffic); i++ ){
        const enemy = document.createElement('div');
        enemy.classList.add('enemy');
        enemy.y = -100 * settings.traffic * (i + 1);
        enemy.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        enemy.style.top = enemy.y + 'px';
        enemy.style.background = 'transparent url("../image/enemy2.png")  center / cover no-repeat';
        gameArea.appendChild(enemy);
    }
    settings.score = 0;
    settings.start = true;
    gameArea.appendChild(car);
    car.style.left = gameArea.offsetWidth/2 - car.offsetWidth/2; 
    car.style.top = 'auto';     // убрали стили из css и добавили в файл js чтобы машина была по центру после перезагрузки
    car.style.bottom = '10px';
    settings.x = car.offsetLeft; // добавляем после того как  добавили ребенка
    settings.y = car.offsetTop; 
    requestAnimationFrame(playGame);
 }

 function playGame () {
     if(settings.start){
         settings.score += settings.speed;
         score.innerHTML = 'SCORE<br>' +  settings.score;
        moveRoad();
        moveEnemy();
         if(keys.ArrowLeft && settings.x > 0){
             settings.x -= settings.speed;
         }
         if(keys.ArrowRight  && settings.x < (gameArea.offsetWidth - car.offsetWidth)){
             //settings.x++; машина двигается медленно
             settings.x += settings.speed; // в этом случае машина набирает скорость
         }
         if(keys.ArrowUp && settings.y > 0){
             settings.y -= settings.speed;
         }
         if(keys.ArrowDown && settings.y < (gameArea.offsetHeight - car.offsetHeight)){
            settings.y += settings.speed;
         }
         car.style.left = settings.x + "px";
         car.style.top = settings.y + "px";
         requestAnimationFrame(playGame);
     }
    }
 
 function startRun (event)  {
     event.preventDefault();
    keys[event.key] = true;
 };

 function stopRun (event)  {
    event.preventDefault();
    keys[event.key] = false;

 }

 function moveRoad () {
     let lines = document.querySelectorAll('.line');
     lines.forEach(function(line){
        line.y += settings.speed;
        line.style.top = line.y + 'px';

        //получаем высоту нашей страницы
        if(line.y >= document.documentElement.clientHeight) {
            line.y = -100;
        }
     });
 }

 function moveEnemy () {
    let enemy = document.querySelectorAll('.enemy');
    enemy.forEach(function(item ){
        let carRect = car.getBoundingClientRect();
        let enemyRect = item.getBoundingClientRect();
        if( carRect.top <= enemyRect.bottom &&
             carRect.right >= enemyRect.left &&
             carRect.left <= enemyRect.right &&
              carRect.bottom >= enemyRect.top){
            settings.start = false;
            console.warn('DTP');
            start.classList.remove('hide');
            start.style.top = score.offsetHeight; // после столкновения выводиться и перезапуск и очки
        }
        item.y += settings.speed / 2;
        item.style.top = item.y + 'px';
        if(item.y >= document.documentElement.clientHeight) {
            item.y = -100 * settings.traffic;
            item.style.left = Math.floor(Math.random() * (gameArea.offsetWidth - 50)) + 'px';
        }
    } );

    

 }