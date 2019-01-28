class Vector {
    constructor(magnitude, angle) {
        this.magnitude = magnitude;
        this.angle = angle;
    }
    
    getX() {
        return this.magnitude * Math.cos(this.angle);
    }
    
    setX(x) {
        let y = this.magnitude * Math.sin(this.angle);
        this.magnitude = Math.sqrt((x * x) + (y * y));
        this.angle = Math.atan2(y, x);
    }
    
    getY() {
        return this.magnitude * Math.sin(this.angle);
    }
    
    setY(y) {
        let x = this.magnitude * Math.cos(this.magnitude.angle);
        this.magnitude = Math.sqrt((x * x) + (y * y));
        this.angle = Math.atan2(y, x);
    }
    
    setMag(m) {
        this.magnitude = m;
    }
    
    getMag() {
        return this.magnitude;
    }
    
    setAngle(a){
        this.angle = a;
    }
    
    getAngle() {
        return this.angle;
    }
    
    add(v) {
        return Vector.rectangular(this.getX() + v.getX(), this.getY() + v.getY());
    }
    
    subtract(v) {
        return Vector.rectangular(this.getX() - v.getX(), this.getY() - v.getY())
    }
    
    static rectangular(x, y) {
        let m = Math.sqrt(x * x + y * y);
        let a = Math.atan2(y, x);
        return new Vector(m, a);
    }
    
    static polar(m, a) {
        return new Vector(m, a);
    }
}