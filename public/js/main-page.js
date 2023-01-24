function drawCanvas() {
    let text = `<canvas id="canvas" width="500" height="200"></canvas>`;
    document.getElementById("game-on").innerHTML = text;

    const canvas = document.getElementById('canvas');
    const ctx = canvas.getContext('2d');

    let v0 = document.getElementById('speed').value;
    let kat = document.getElementById('angle').value;

    v0 = v0 * 10 / 36;

    let radius = kat * Math.PI / 180;
    let v0x = v0 * Math.cos(radius) * 2;
    let v0y = v0 * Math.sin(radius) * 2;

    let x = parseFloat(document.getElementById('distance').value);
    let y = 2;
    let t = 0.0001;

    ctx.fillRect(0, canvas.height - 20, canvas.width, 20); //podloga
    let x1 = 100;
    let y1 = canvas.height - 30 * y;
    ctx.fillRect(x1, y1, 10, 100); //zawodnik
    ctx.fillRect(100 + x * 30, canvas.height - 60 * y, 15, y * 60);
    ctx.fillStyle = "red";
    let x2 = 100 + x * 30 - 40;
    let y2 = canvas.height - 60 * y + 10;
    ctx.fillRect(x2, y2, 40, 5); //kosz
    ctx.moveTo(x1 + 10, y1);
    ctx.stroke();
    draw(ctx, v0x, v0y, x1 + 10, y1, x2, y2, canvas, t, kat, v0);
}

function draw(ctx, vx, vy, x1, y1, x2, y2, canvas, t, kat, v0) {

    let g = 9.81;

    let x = x1 + vx * t;
    let y = y1 + vy * t - g * t * t / 2;
    vy = vy - g * t;
    ctx.fillStyle = "red";
    ctx.strokeStyle = "red";
    ctx.beginPath();
    ctx.moveTo(x1, canvas.height + 80 - y1);
    ctx.lineTo(x, canvas.height + 80 - y);
    ctx.stroke();
    t += 0.0001;

    let req;
    req = window.requestAnimationFrame(function () {
        draw(ctx, vx, vy, x, y, x2, y2, canvas, t, kat, v0);
    });

    let localPoints = 0;
    let isInBasket = false;
    if (x > x2 && x < x2 + 40) {
        if (y < y2 + 100 && y > y2 - 5 + 100) {
            cancelAnimationFrame(req);
            if (parseFloat(document.getElementById('distance').value) === 6.75) {
                localPoints += 3;
                isInBasket = true;
                let text = `<div class="result">Zdobyłeś ${localPoints} punkty!</div>`;
                document.getElementById('after-game').innerHTML = text;
                let urlParams = new URLSearchParams(window.location.search);
                let fname = urlParams.get('fname');
                let lname = urlParams.get('lname');
                //console.log(fname)
                //console.log(lname)
                if (fname != null && lname != null) {
                    fetchData(localPoints, isInBasket, kat, v0);
                    pause(10000);
                    document.location.reload();
                }
                else {
                    previousShots(localPoints, isInBasket, kat, v0);
                    pause(10000);
                    document.location.reload();
                }
            }
            else if (parseFloat(document.getElementById('distance').value) === 5) {
                localPoints += 2;
                isInBasket = true;
                let text = `<div class="result">Zdobyłeś ${localPoints} punkty!</div>`;
                document.getElementById('after-game').innerHTML = text;
                let urlParams = new URLSearchParams(window.location.search);
                let fname = urlParams.get('fname');
                let lname = urlParams.get('lname');
                //console.log(fname)
                //console.log(lname)
                if (fname != null && lname != null) {
                    fetchData(localPoints, isInBasket, kat, v0);
                    pause(10000);
                    document.location.reload();
                }
                else {
                    previousShots(localPoints, isInBasket, kat, v0);
                    pause(10000);
                    document.location.reload();
                }
            } else if (parseFloat(document.getElementById('distance').value) === 3.95) {
                localPoints += 1;
                isInBasket = true;
                let text = `<div class="result">Zdobyłeś ${localPoints} punkty!</div>`;
                document.getElementById('after-game').innerHTML = text;
                let urlParams = new URLSearchParams(window.location.search);
                let fname = urlParams.get('fname');
                let lname = urlParams.get('lname');
                //console.log(fname)
                //console.log(lname)
                if (fname != null && lname != null) {
                    fetchData(localPoints, isInBasket, kat, v0);
                    pause(10000);
                    document.location.reload();
                }
                else {
                    previousShots(localPoints, isInBasket, kat, v0);
                    pause(10000);
                    document.location.reload();
                }
            }
        }
    }
    if (y < 100) {
        cancelAnimationFrame(req);
        let text = `<div class="result">Spróbuj jeszcze raz</div>`;
        document.getElementById('after-game').innerHTML = text;
        let urlParams = new URLSearchParams(window.location.search);
        let fname = urlParams.get('fname');
        let lname = urlParams.get('lname');
        //console.log(fname);
        //console.log(lname);
        if (fname != null && lname != null) {
            fetchData(localPoints, isInBasket, kat, v0);
            pause(10000);
            document.location.reload();
        }
        else {
            previousShots(localPoints, isInBasket, kat, v0);
            pause(10000);
            document.location.reload();
        }
    }
}
function pause(time) {
    let start = new Date().getTime();
    for (let i = 0; i < 1e7; i++) {
        if ((new Date().getTime() - start) > time) {
            break;
        }
    }
}

function fetchData(points, isInBasket, angle, speed) {
    let data = {
        points: points,
        isInBasket: isInBasket,
        angle: angle,
        speed: speed
    }
    fetch("/", {
        headers:
        {
            'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify(data)
    }).then((response) => {
        response.json().then(function (data) {
            let result = JSON.parse(data);
            console.log(result)
        });
    }).catch((error) => {
        console.log(error)
    });
}

function previousShots(points, isInBasket, angle, speed) {
    let t_isInBasket = [];
    let t_points = [];
    let t_angle = [];
    let t_speed = [];
    let tmp_points = [];
    let tmp_isInBasket = [];
    let tmp_angle = [];
    let tmp_speed = [];
    if (localStorage.getItem("points") != null) {
        t_points = JSON.parse(localStorage.getItem("points"));
        t_isInBasket = JSON.parse(localStorage.getItem("isInBasket"));
        t_angle = JSON.parse(localStorage.getItem("angle"));
        t_speed = JSON.parse(localStorage.getItem("speed"));
        for (let i = 0; i < t_speed.length; i++) {
            tmp_points[i] = parseInt(t_points[i]);
            tmp_angle[i] = parseFloat(t_angle[i]);
            tmp_speed[i] = parseFloat(t_speed[i]);
            if (t_isInBasket[i] === 'false') {
                tmp_isInBasket[i] = false;
            }
            else {
                tmp_isInBasket[i] = true;
            }
        }
        tmp_points[tmp_points.length] = points;
        tmp_angle[tmp_angle.length] = angle;
        tmp_isInBasket[tmp_isInBasket.length] = isInBasket;
        tmp_speed[tmp_speed.length] = speed;
        console.log(tmp_points);
        console.log(tmp_speed);
        console.log(tmp_angle);
        console.log(tmp_isInBasket);
    }
    else {
        tmp_points[0] = points;
        tmp_angle[0] = angle;
        tmp_isInBasket[0] = isInBasket;
        tmp_speed[0] = speed;
    }
    localStorage.setItem("points", JSON.stringify(tmp_points));
    localStorage.setItem("angle", JSON.stringify(tmp_angle));
    localStorage.setItem("isInBasket", JSON.stringify(tmp_isInBasket));
    localStorage.setItem("speed", JSON.stringify(tmp_speed));
}

function drawTable() {
    if (localStorage.getItem("speed") != null) {
        let t_isInBasket = [];
        let t_points = [];
        let t_angle = [];
        let t_speed = [];
        let tmp_points = [];
        let tmp_isInBasket = [];
        let tmp_angle = [];
        let tmp_speed = [];
        t_points = JSON.parse(localStorage.getItem("points"));
        t_isInBasket = JSON.parse(localStorage.getItem("isInBasket"));
        t_angle = JSON.parse(localStorage.getItem("angle"));
        t_speed = JSON.parse(localStorage.getItem("speed"));
        for (let i = 0; i < t_speed.length; i++) {
            tmp_points[i] = parseInt(t_points[i]);
            tmp_angle[i] = parseFloat(t_angle[i]);
            tmp_speed[i] = parseFloat(t_speed[i]);
            if (t_isInBasket[i] === 'false') {
                tmp_isInBasket[i] = false;
            }
            else {
                tmp_isInBasket[i] = true;
            }
        }
        let text = '<table><thead><tr>';
        text += '<th>Punkty</th>';
        text += '<th>Czy trafiony</th>';
        text += '<th>Kąt rzutu [&ordm;]</th>';
        text += '<th>Prędkość rzutu [m/s]</th></tr>';
        for (let i = 0; i < tmp_speed.length; i++) {
            text += '<tr><td>' + tmp_points[i] + '</td>';
            if (tmp_isInBasket) {
                text += '<td>Tak</td>';
            }
            else {
                text += '<td>Nie</td>';
            }
            text += '<td>' + tmp_angle[i] + '</td>';
            text += '<td>' + tmp_speed[i] + '</td></tr>';
        }
        text += '</table><br>';
        let text1 = '<input id="update" type="button" value="Aktualizuj" onclick="updateData()">'
        document.getElementById('results-table').innerHTML = text;
        document.getElementById('update-div').innerHTML = text1;
    }
}

function updateData() {
    if (localStorage.getItem('angle') != null) {
        let t_isInBasket = [];
        let t_points = [];
        let t_angle = [];
        let t_speed = [];
        let tmp_points = [];
        let tmp_isInBasket = [];
        let tmp_angle = [];
        let tmp_speed = [];
        t_points = JSON.parse(localStorage.getItem("points"));
        t_isInBasket = JSON.parse(localStorage.getItem("isInBasket"));
        t_angle = JSON.parse(localStorage.getItem("angle"));
        t_speed = JSON.parse(localStorage.getItem("speed"));
        for (let i = 0; i < t_speed.length; i++) {
            tmp_points[i] = parseInt(t_points[i]);
            tmp_angle[i] = parseFloat(t_angle[i]);
            tmp_speed[i] = parseFloat(t_speed[i]);
            if (t_isInBasket[i] === 'false') {
                tmp_isInBasket[i] = false;
            }
            else {
                tmp_isInBasket[i] = true;
            }
        }
        console.log(tmp_speed);
        console.log(tmp_angle);
        let data = {
            points: tmp_points,
            angle: tmp_angle,
            speed: tmp_speed,
            isInBasket: tmp_isInBasket
        }
        fetch("/", {
            headers:
            {
                'Content-Type': 'application/json'
            },
            method: "POST",
            body: JSON.stringify(data)
        }).then((response) => {
            response.json().then(function (data) {
                let result = JSON.parse(data);
                console.log(result)
            });
        }).catch((error) => {
            console.log(error)
        });
        localStorage.clear();
        document.location.reload();
    }
}