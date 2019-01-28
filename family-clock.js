class ClockComponent {
    constructor(canvas, urls) {
        if(!canvas || !urls || urls.length < 3 ){
            let m = "Invalid arguments";
            alert(m);
            throw Error(m);
        }
        
        this.canvas = canvas;
        this.images =  {};
        this.loadImages(urls);
    }
    
    loadImage(o, onFinished) {
        let image = new Image();
        image.onload = () => {
            o.image = image;
            onFinished(o);
        };
        image.src = o.url;
    }
    
    
    loadImages(urls) {
        let _o = urls.pop();
        this.loadImage(_o, (o) => {
            this.images[o.name] = this.images[o.name] || [];
            this.images[o.name].push(o.image);
            if(urls.length > 0){
                this.loadImages(urls);
            }else{
                this.setRender();
            }
        });
    }
    
    setRender() {
        this.render();
        setTimeout(() => this.setRender(), 60 / 1000);
    }

    randomImage(images) {
        return images[Math.floor(Math.random()*images.length)];
    }
    
    render() {
        let width = this.canvas.parentElement.clientWidth
        this.canvas.width = this.canvas.height = width;
        this.radius = this.canvas.width / 2;
        this.circle = this.radius / 8;
        
        let ctx = this.canvas.getContext('2d');
        let time = (() => {
            let midnight = new Date();
            midnight.setHours(0);
            midnight.setMinutes(0);
            midnight.setSeconds(0);
            midnight.setMilliseconds(0);
            return Date.now() - midnight.getTime();
        })();
        
        let hours = time / (60 * 60 * 1000);
        let minutes = hours * 60 % 60;
        let seconds = minutes * 60 % 60;
        let c = {x: this.canvas.width / 2, y: this.canvas.height / 2};
        
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        ctx.lineCap = 'round';
        
        this.face(ctx, c);
        this.hourHand(ctx, hours, c);
        this.minuteHand(ctx, minutes, c);
        this.secondHand(ctx, seconds, c);
        this.center(ctx, c);
    }
    
    center(ctx, c) {
        // Center button
        ctx.beginPath();
        ctx.arc(c.x, c.y, 4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.strokeStyle = 'black';
        ctx.lineWidth = 2.5;
        ctx.fill();
        ctx.stroke();
    }
    
    face (ctx, c) {
        // Border
        let innerRadius = this.radius * 0.9;
        let outerRadius = this.radius;
        let strokeWidth = outerRadius - innerRadius;
        let centerRadius = this.radius - strokeWidth / 2;
        let grad;
        ctx.save();
        ctx.beginPath();
        ctx.arc(c.x, c.y, centerRadius, 0, 2 * Math.PI);
        grad = ctx.createRadialGradient(c.x, c.y, innerRadius, c.x, c.y, outerRadius);
        grad.addColorStop(0, '#333');
        grad.addColorStop(0.5, 'white');
        grad.addColorStop(1, '#333');
        ctx.strokeStyle = grad;
        ctx.lineWidth = strokeWidth;
        ctx.stroke();
        ctx.restore();
        
        // Dashes
        for (let i = 0; i < 60; i++) {
            let l = 4;
            let r = innerRadius - l; 
            
            if (i % 5 === 0){
                r -= l;
                l *= 2;
            }
            let v = new Vector(r, Math.PI * 2 * (i / 60) - Math.PI / 2);
            ctx.lineWidth = 3;
            ctx.strokeStyle = '#333';
            ctx.beginPath();
            ctx.moveTo(v.getX() + c.x, v.getY() + c.y);
            v.setMag(r + l);
            ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
            ctx.stroke();
        }
        
        // Numbers
        if(innerRadius >= 100){
            ctx.font = `${strokeWidth*0.95}px Noto Sans`;
            ctx.fillStyle = 'black';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            for (let i = 1; i <= 12; i++) {
                let v = new Vector(innerRadius - strokeWidth, Math.PI * 2 * (i / 12) - Math.PI / 2);
                ctx.fillText(i, v.getX() + c.x, v.getY() + c.y);
            }
        }
    }
    
    secondHand (ctx, seconds, c) {
        let length = this.radius * 0.75;
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = 'red';
        ctx.beginPath();
        let a = Math.PI * 2 * (seconds / 60) - Math.PI / 2;
        let v2 = new Vector(-20, a);
        let v = new Vector(length, a);
        ctx.moveTo(v2.getX() + c.x, v2.getY() + c.y);
        ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
        ctx.stroke();
        this.avatar(ctx, c, this.randomImage(this.images.second), length, a, ctx.strokeStyle);
    }
    
    minuteHand (ctx, minutes, c) {
        let length = this.radius * 0.65;
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        let a = Math.PI * 2 * (minutes / 60) - Math.PI / 2;
        let v2 = new Vector(-20, a);
        let v = new Vector(length, a);
        ctx.moveTo(v2.getX() + c.x, v2.getY() + c.y);
        ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
        ctx.stroke();
        
        this.avatar(ctx, c, this.randomImage(this.images.minute), length, a, ctx.strokeStyle);
    }
    
    hourHand (ctx, hours, c) {
        let length = this.radius * 0.45;
        ctx.lineWidth = 4;
        ctx.strokeStyle = '#ccc';
        ctx.beginPath();
        let a = Math.PI * 2 * (hours / 12) - Math.PI / 2;
        let v2 = new Vector(-20, a);
        let v = new Vector(length, a);
        ctx.moveTo(v2.getX() + c.x, v2.getY() + c.y);
        ctx.lineTo(v.getX() + c.x, v.getY() + c.y);
        ctx.stroke();
        this.avatar(ctx, c, this.randomImage(this.images.hour), length, a, ctx.strokeStyle);
    }
    
    avatar(ctx, c, image, length, angle, strokeStyle) {  
        let v = new Vector(length - this.circle * 1.5, angle);
        let x = v.getX() + c.x;
        let y = v.getY() + c.y;
        
        ctx.save();
        ctx.beginPath();
        ctx.arc(x, y, this.circle, 0, 2 * Math.PI, true);
        ctx.strokeStyle = strokeStyle;
        ctx.stroke();
        ctx.closePath();
        ctx.clip();
        ctx.drawImage(image, x - this.circle, y - this.circle, this.circle * 2 + 2, this.circle * 2 + 2);
        ctx.beginPath();
        ctx.arc(x, y, 2, 0, Math.PI*2, true);
        ctx.clip();
        ctx.closePath();
        ctx.restore();
    }
}
