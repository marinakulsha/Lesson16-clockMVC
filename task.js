(function() {

    const clockTimeZone1 = { timeZone: "America/New_York" };
    const clockTimeZone2 = { timeZone: "Europe/Minsk" };
    const clockTimeZone3 = { timeZone: "Europe/London" };
    const clockTimeZone4 = { timeZone: "Asia/Tokyo" };
    const clockTimeZone5 = { timeZone: "Europe/Berlin" };
    const clockTimeZone6 = { timeZone: "Asia/Vladivostok" };

    DOMView("clock1", "Нью-Йорк (GMT-5)");
    DOMView("clock2", "Минск (GMT+3)");

    SVGView("clock3", "Лондон (GMT+1)");
    SVGView("clock4", "Токио (GMT+9)");

    CanvasView("clock5", "Берлин (GMT+1)");
    CanvasView("clock6", "Владивосток (GMT+10)");

    //model
    function Clock(timeZone) {

        var myView = null;
        var timerId = null;
        var stopped = false;
        var timeZone = timeZone;

        this.start = function(view) {
            if (!stopped) {
                myView = view;
                this.date = new Date((new Date().toLocaleString("en-US", timeZone)));
                if (myView) {
                    timerId = setInterval(() => this.updateTime(), 1000);
                };
            };
        };

        this.updateTime = function() {
            this.date = new Date(this.date.getTime() + 1000);
            this.updateView();
        };

        this.updateView = function() {
            this.hours = this.date.getHours();
            this.minutes = this.date.getMinutes();
            this.seconds = this.date.getSeconds();

            this.hoursDeg = 30 * ((this.hours + 11) % 12 + 1);
            this.minutesDeg = 6 * this.minutes;
            this.secondsDeg = 6 * this.seconds;

            if (myView)
                myView.update();
        };

        this.startClock = function(timeZone) {
            this.stopClock();
            var timeZone = timeZone;
            this.date = new Date((new Date().toLocaleString("en-US", timeZone)));

            timerId = setInterval(() => this.updateTime(), 1000);
            stopped = false;
        };

        this.stopClock = function() {
            if (timerId) {
                clearInterval(timerId);
            };
            stopped = true;
        };
    };


    //view
    function ClockViewDOM() {
        var myModel = null; // с какой моделью работаем
        var myField = null; // внутри какого элемента DOM наша вёрстка
        var hourHand = null;
        var minuteHand = null;
        var secondHand = null;

        this.start = function(model, field) {
            myModel = model;
            myField = field;

            hourHand = myField.querySelector('.hour');
            minuteHand = myField.querySelector('.minute');
            secondHand = myField.querySelector('.second');
        };

        this.update = function() {
            hourHand.style.transform = `rotate(${myModel.hoursDeg}deg)`;
            minuteHand.style.transform = `rotate(${myModel.minutesDeg}deg)`;
            secondHand.style.transform = `rotate(${myModel.secondsDeg}deg)`;
        };
    };

    function ClockViewSVG() {
        var myModel = null; // с какой моделью работаем
        var myField = null; // внутри какого элемента DOM наша вёрстка

        var hourHandSVG = null;
        var minuteHandSVG = null;
        var secondHandSVG = null;

        this.start = function(model, field) {
            myModel = model;
            myField = field;

            hourHandSVG = myField.querySelector('.hourSVG');
            minuteHandSVG = myField.querySelector('.minuteSVG');
            secondHandSVG = myField.querySelector('.secondSVG');
        };

        this.update = function() {
            hourHandSVG.setAttribute('transform', `rotate(${myModel.hoursDeg} 135 135)`);
            minuteHandSVG.setAttribute('transform', `rotate(${myModel.minutesDeg} 135 135)`);
            secondHandSVG.setAttribute('transform', `rotate(${myModel.secondsDeg} 135 135)`);
        };
    }

    function ClockViewCanvas(func, domId) {
        var myModel = null; // с какой моделью работаем

        this.renderFunct = func;
        this.start = function(model, domId) {
            myModel = model;
            myField = domId;
        }
        this.update = function() {
            this.renderFunct(myModel.hours, myModel.minutes, myModel.seconds, domId); //вызов функции
        };
    };


    // controller
    function ClockControllerButtons() {
        var myModel = null; // с какой моделью работаем
        var myField = null; // внутри какого элемента DOM наша вёрстка

        this.start = function(model, field) {
            myModel = model;
            myField = field;

            var buttonStart = myField.querySelector(' .startBtn');
            buttonStart.addEventListener('click', this.startModel);

            var btnStop = myField.querySelector(' .stopBtn');
            btnStop.addEventListener('click', this.stopModel);
        };

        this.startModel = function() {
            myModel.startClock(); // контроллер вызывает только методы модели
        };

        this.stopModel = function() {
            myModel.stopClock(); // контроллер вызывает только методы модели
        };
    };


    ///////////////////////////////////////////////////////////////////////////////////////////
    // настройка, инициализация первого комплекта
    // создаём все три компонента
    var clock1 = new Clock(clockTimeZone1);
    var view1 = new ClockViewDOM();
    var controller1 = new ClockControllerButtons();

    // увязываем компоненты друг с другом
    // указываем компонентам, в каком DOM им работать
    var containerElem1 = document.getElementById('clock1');
    clock1.start(view1);
    view1.start(clock1, containerElem1);
    controller1.start(clock1, containerElem1);
    clock1.updateView();

    //////////////////////////////////////////////////////////////////////////////////////////////
    // настройка, инициализация второго комплекта 
    var clock2 = new Clock(clockTimeZone2);
    var view2 = new ClockViewDOM();
    var controller2 = new ClockControllerButtons();

    // увязываем компоненты друг с другом
    // указываем компонентам, в каком DOM им работать
    var containerElem2 = document.getElementById('clock2');
    clock2.start(view2);
    view2.start(clock2, containerElem2);
    controller2.start(clock2, containerElem2);
    clock2.updateView();

    /////////////////////////////////////////////////////////////////////////////////////////////////
    // настройка, инициализация третьего комплекта
    // создаём все три компонента
    var clock3 = new Clock(clockTimeZone3);
    var view3 = new ClockViewSVG();
    var controller3 = new ClockControllerButtons();

    // увязываем компоненты друг с другом
    // указываем компонентам, в каком DOM им работать
    var containerElem3 = document.getElementById('clock3');
    clock3.start(view3);
    view3.start(clock3, containerElem3);
    controller3.start(clock3, containerElem3);
    clock3.updateView();

    ////////////////////////////////////////////////////////////////////////////////////////////////
    // настройка, инициализация четвертого комплекта
    // создаём все три компонента
    var clock4 = new Clock(clockTimeZone4);
    var view4 = new ClockViewSVG();
    var controller4 = new ClockControllerButtons();

    // увязываем компоненты друг с другом
    // указываем компонентам, в каком DOM им работать
    var containerElem4 = document.getElementById('clock4');
    clock4.start(view4);
    view4.start(clock4, containerElem4);
    controller4.start(clock4, containerElem4);
    clock4.updateView();

    //////////////////////////////////////////////////////////////////////////////////////////////////
    // настройка, инициализация пятого комплекта
    // создаём все три компонента
    var clock5 = new Clock(clockTimeZone5);
    var view5 = new ClockViewCanvas(showClock, "clock5");
    var controller5 = new ClockControllerButtons();

    // увязываем компоненты друг с другом
    // указываем компонентам, в каком DOM им работать
    var containerElem5 = document.getElementById('clock5');
    clock5.start(view5);
    view5.start(clock5, containerElem5);
    controller5.start(clock5, containerElem5);
    clock5.updateView();

    ///////////////////////////////////////////////////////////////////////////////////////////////////
    // настройка, инициализация шестого комплекта
    // создаём все три компонента
    var clock6 = new Clock(clockTimeZone6);
    var view6 = new ClockViewCanvas(showClock, "clock6");
    var controller6 = new ClockControllerButtons();

    // увязываем компоненты друг с другом
    // указываем компонентам, в каком DOM им работать
    var containerElem6 = document.getElementById('clock6');
    clock6.start(view6);
    view6.start(clock6, containerElem6);
    controller6.start(clock6, containerElem6);
    clock6.updateView();

    ////////////////////////////////////////////////////////////////////////////////////////////////////
    //функции отрисовки часов

    function DOMView(domId, timelabel) {
        var clockDOM = document.getElementById(domId);

        clockDOM.innerHTML = `<div class="panel"><div class="maintitle"> DOM </div><button class="startBtn">Старт</button><button class="stopBtn">Стоп</button><span class="timeZone"> ${timelabel}</span></div><div class="clockWrap"></div>`;

        var divClock = document.querySelector(`#${domId} .clockWrap`);

        var numbers = ["12", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10", "11"];
        var str = "";
        for (var i = 0; i < numbers.length; i++) {
            str += `<div class="circle"><span class="numbers">${numbers[i]}</span></div>`;
        }
        str += `<div class="red-circle"></div><span class="hour"></span><span class="minute"></span><span class="second"></span>`;
        divClock.innerHTML = str;
        divClock.style.cssText = 'position:relative;width:252px;height:252px;margin:0;border-radius:50%;border-radius:100%;background:#fffb02;border:5px solid rgb(240, 216, 5);';

        var greenCircles = document.querySelectorAll(`#${domId} .circle`);
        for (var i = 0; i < greenCircles.length; i++) {
            var greenCircle = greenCircles[i];
            greenCircle.style.cssText = 'width: 30px;height: 30px;position: absolute;border-radius: 50%;background-color: rgb(24, 170, 24);display: flex;align-items: center;justify-content: center;';
        };

        var redCircle = document.querySelector(`#${domId} .red-circle`);
        redCircle.style.cssText = 'position: absolute;top: 0;left: 0;right: 0;bottom: 0;width: 12px;height: 12px;border-radius: 100px;background: rgb(255, 0, 0); border: 2px solid #ff0000;margin: auto;z-index: 2;';

        var namberCircles = document.querySelectorAll(`#${domId} .numbers`);

        for (var i = 0; i < namberCircles.length; i++) {
            var namberCircle = namberCircles[i];
            namberCircle.style.cssText = 'flex: 1 1 auto; align-self:center; text-align:center; font-size:14px; font-weight:700;font-family:"Comic Sans MS";';
        };

        var num = 0;
        for (i = 0; i < greenCircles.length; i++) {
            var greenCircle = greenCircles[i];
            var radius = 100;
            var angle = num / 180 * Math.PI;
            var redCenterX = redCircle.offsetLeft + redCircle.offsetWidth / 2;
            var redCenterY = redCircle.offsetTop + redCircle.offsetHeight / 2;
            var greenCenterX = redCenterX + radius * Math.sin(angle);
            var greenCenterY = redCenterY - radius * Math.cos(angle);

            greenCircle.style.left = Math.round(greenCenterX - greenCircle.offsetWidth / 2) + "px";
            greenCircle.style.top = Math.round(greenCenterY - greenCircle.offsetHeight / 2) + "px";

            num += 30;
        };

        var hourHand = document.querySelector(`#${domId} .hour`);
        hourHand.style.cssText = 'position: absolute;height: 80px; width: 4px;margin: auto;top: -30%;left: 0;bottom: 0;right: 0;background: black;transform-origin: bottom center;transform: rotate(0deg); box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4); z-index: 1; border-radius: 25px;';
        var minutHand = document.querySelector(`#${domId} .minute`);
        minutHand.style.cssText = 'position: absolute;height: 90px; width: 2px;top: -35%; left: 0; box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.4);transform: rotate(0deg); margin: auto;bottom: 0; right: 0; background: black;transform-origin: bottom center; z-index: 1;border-radius: 25px;';
        var secondHand = document.querySelector(`#${domId} .second`);
        secondHand.style.cssText = 'position: absolute;height: 95px; width: 2px;margin: auto;top: -37%;left: 0; bottom: 0;right: 0; border-radius: 4px;background: #FF4B3E; transform-origin: bottom center;transform: rotate(0deg);z-index: 1;';
    };

    ////////////////////////////////////////////////////////////////////////////////////////////////////////
    function SVGView(domId, timelabel) {
        var clockDOM = document.getElementById(domId);
        clockDOM.innerHTML = `<div class="panel"><div class="maintitle"> SVG </div><button class="startBtn">Старт</button><button class="stopBtn">Стоп</button><span class="timeZone"> ${timelabel}</span></div>`;

        // создать svg tag
        const svg_container = document.createElementNS("http://www.w3.org/2000/svg", "svg");
        svg_container.setAttribute("width", "270");
        svg_container.setAttribute("height", "270");
        svg_container.id = "containerClock";
        clockDOM.appendChild(svg_container);

        //создать границу часов
        const clock_frame = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        clock_frame.setAttribute("cx", "135");
        clock_frame.setAttribute("cy", "135");
        clock_frame.setAttribute("r", "129");
        clock_frame.setAttribute("style", "fill:#fffb02;stroke:rgb(240, 216, 5); stroke-width:1.9%");
        svg_container.appendChild(clock_frame);


        // создать зеленые кружки
        for (let i = 0; i < 12; i++) {
            const radian = (2 * Math.PI) / 12 * (i - 2);
            const green_circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
            green_circle.setAttribute("cx", (Math.cos(radian) * 104 + 135).toString()); //centerX + radius * Math.cos(radian);Полный круг - 2pi радианов
            green_circle.setAttribute("cy", (Math.sin(radian) * 104 + 135).toString()); //centerY + radius * Math.sin(radian);
            green_circle.setAttribute("r", "5.5%");
            green_circle.setAttribute("style", "fill:rgb(24, 170, 24);stroke:none;");
            green_circle.setAttribute("id", "green");
            svg_container.appendChild(green_circle);


            //надпись у кружков
            const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
            text.setAttribute("x", (Math.cos(radian) * 105 + 134).toString());
            text.setAttribute("y", (Math.sin(radian) * 105 + 139).toString());
            text.setAttribute("width", "30");
            text.setAttribute("height", "30");
            text.setAttribute("text-anchor", "middle");
            text.setAttribute("stroke", "black");
            text.setAttribute("stroke-width", "1px");
            text.textContent = `${i + 1}`;
            svg_container.appendChild(text);

        };

        //сгрупируем все стрелки
        const group = document.createElementNS("http://www.w3.org/2000/svg", "g");
        group.id = "hands";
        svg_container.appendChild(group);


        // часовая стрелка
        const hour_hand = document.createElementNS("http://www.w3.org/2000/svg", "line");
        hour_hand.setAttribute("x1", "135");
        hour_hand.setAttribute("y1", "135");
        hour_hand.setAttribute("x2", "135");
        hour_hand.setAttribute("y2", "50");
        hour_hand.setAttribute("class", "hourSVG");
        hour_hand.setAttribute("style", "stroke:black; stroke-width:1.5%;stroke-linecap:round");
        group.appendChild(hour_hand);

        //минутная стрелка
        const minute_hand = document.createElementNS("http://www.w3.org/2000/svg", "line");
        minute_hand.setAttribute("x1", "135");
        minute_hand.setAttribute("y1", "135");
        minute_hand.setAttribute("x2", "135");
        minute_hand.setAttribute("y2", "40");
        minute_hand.setAttribute("class", "minuteSVG");
        minute_hand.setAttribute("style", "stroke:black; stroke-width:0.8%;stroke-linecap:round");
        group.appendChild(minute_hand);

        // секундная стрелка
        const sec_hand = document.createElementNS("http://www.w3.org/2000/svg", "line");
        sec_hand.setAttribute("x1", "135");
        sec_hand.setAttribute("y1", "135");
        sec_hand.setAttribute("x2", "135");
        sec_hand.setAttribute("y2", "35");
        sec_hand.setAttribute("class", "secondSVG");
        sec_hand.setAttribute("style", "stroke:red; stroke-width:0.6%;stroke-linecap:round");
        group.appendChild(sec_hand);


        //центр
        const clock_dot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
        clock_dot.setAttribute("cx", "135");
        clock_dot.setAttribute("cy", "135");
        clock_dot.setAttribute("r", "2.5%");
        clock_dot.setAttribute("style", "fill:red;stroke:red; stroke-width:0.6%");
        svg_container.appendChild(clock_dot);
    }

    /////////////////////////////////////////////////////////////////////////////////////////////////////
    function CanvasView(domId, timelabel) {
        var clockDOM = document.getElementById(domId);
        clockDOM.innerHTML = `<div class="panel"><div class="maintitle"> Canvas </div><button class="startBtn">Старт</button><button class="stopBtn">Стоп</button><span class="timeZone"> ${timelabel}</span></div>`;

        //создаем tag canvas
        var canvas = document.createElement('canvas');
        canvas.className = 'canvas';
        canvas.width = '270';
        canvas.height = '270';
        clockDOM.appendChild(canvas);

        var angle;
        var ctx = canvas.getContext('2d');
        var centerX = canvas.width / 2;
        var centerY = canvas.height / 2;

        clock_outer();
        draw_circles();
        clock_center();

        //рисуем окружность
        function clock_outer() {
            ctx.beginPath();
            ctx.arc(centerX, centerY, 133, 0, Math.PI * 2); //arc(x, y, radius, startAngle, endAngle, anticlockwise)
            ctx.strokeStyle = 'rgb(240, 216, 5)';
            ctx.fillStyle = '#fffb02';
            ctx.fill();
            ctx.lineWidth = 4;
            ctx.closePath();
            ctx.stroke();
        }

        //рисуем центр
        function clock_center() {
            ctx.beginPath();
            ctx.arc(centerX, centerY, 7, 0, Math.PI * 2);
            ctx.fillStyle = 'red';
            ctx.strokeStyle = 'red';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.closePath();
            ctx.stroke();
        }

        // нарисовать зеленые кружки
        function draw_circles() {
            for (var i = 0; i < 12; i++) {
                angle = (Math.PI * 2) / 12 * (i - 2); //угол
                ctx.beginPath();
                var x1 = centerX + Math.cos(angle) * 105;
                var y1 = centerY + Math.sin(angle) * 105;
                ctx.arc(x1, y1, 15, 0, Math.PI * 2);
                ctx.fillStyle = 'rgb(24, 170, 24)';
                ctx.strokeStyle = 'rgb(24, 170, 24)';
                ctx.fill();
                ctx.lineWidth = 2;
                ctx.closePath();
                ctx.stroke();

                //надпись у кружков
                let text = `${i + 1}`;
                var x2 = 129 + Math.cos(angle) * 105;
                var y2 = 140 + Math.sin(angle) * 105;
                ctx.font = '14px Comic Sans MS';
                ctx.fillStyle = 'black';
                ctx.fillText(text, x2, y2);
            };
        };

        //создаем 2 канвас
        var handCanvas = document.createElement('canvas');
        handCanvas.className = 'handcanvas';
        handCanvas.width = canvas.width;
        handCanvas.height = canvas.height;
        clockDOM.appendChild(handCanvas);
        handCanvas.style.cssText = 'position:absolute;right:110px;';
    };

    ///////////////////////////////////////////////////////////////////////////////////////////////
    function showClock(hours, minutes, seconds, domId) {
        var handCanvas = document.querySelector(`#${domId} .handcanvas`);
        var handCtx = handCanvas.getContext('2d');
        var centerX = handCanvas.width / 2;
        var centerY = handCanvas.height / 2;

        function blank() {
            handCtx.clearRect(0, 0, handCanvas.width, handCanvas.height);
        };

        blank();
        show_seconds();
        show_minutes();
        show_hours();

        //рисуем секундную стрелку
        function show_seconds() {
            angle = ((Math.PI * 2) * (seconds / 60)) - ((Math.PI * 2) / 4); //угол поворота
            handCtx.beginPath();
            handCtx.lineWidth = 1.9; //ширина стрелки
            handCtx.lineCap = 'round'; //округление на конце
            // начать с центра
            handCtx.moveTo(centerX, centerY);
            // нарисовать длину
            //centerX + radius * Math.cos(angle);Полный круг(360 град) - 2pi радианов
            //centerY + radius * Math.sin(angle);
            handCtx.lineTo((centerX + Math.cos(angle) * 100),
                centerY + Math.sin(angle) * 100);
            handCtx.strokeStyle = 'red'; // цвет стрелки.
            handCtx.stroke();
            handCtx.closePath();
        };

        //рисуем минутную стрелку
        function show_minutes() {
            angle = ((Math.PI * 2) * (minutes / 60)) - ((Math.PI * 2) / 4); //угол поворота
            handCtx.beginPath();
            handCtx.lineWidth = 2.5; //ширина стрелки
            handCtx.lineCap = 'round'; //округление на конце 
            handCtx.moveTo(centerX, centerY); // начать с центра
            // нарисовать длину
            //centerX + radius * Math.cos(angle);Полный круг - 2pi радианов
            //centerY + radius * Math.sin(angle);
            handCtx.lineTo((centerX + Math.cos(angle) * 98),
                (centerY + Math.sin(angle) * 98));
            handCtx.strokeStyle = 'black'; // цвет стрелки.
            handCtx.stroke();
            handCtx.closePath();
        };


        //рисуем часовую стрелку
        function show_hours() {
            angle = ((Math.PI * 2) * ((hours * 5 + (minutes / 60) * 5) / 60)) - ((Math.PI * 2) / 4); //угол поворота
            handCtx.beginPath();
            handCtx.lineWidth = 4; //ширина стрелки
            handCtx.lineCap = 'round'; //округление на конце
            handCtx.moveTo(centerX, centerY); // начать с центра
            // нарисовать длину
            //centerX + radius * Math.cos(angle);Полный круг - 2pi радианов
            //centerY + radius * Math.sin(angle);
            handCtx.lineTo((centerX + Math.cos(angle) * 80), centerY + Math.sin(angle) * 80);
            handCtx.strokeStyle = 'black'; // цвет стрелки.
            handCtx.stroke();
            handCtx.closePath();
        };
    };

}())