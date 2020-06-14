/*
 * Candle class.
 */

interface CandleConnection {
    [id:number]:Candle;
}

class Candle {
    lit:            boolean;
    connections:    CandleConnection;

    /* constructor default state of a candle is lit(ON). */
    constructor (public label: string, public id: number, light: boolean=true) {
        this.label = label;
        this.id    = id;
        this.light(light);
        this.connections = [];
    }

    /* light the candle */
    light (light: boolean=true) {
        this.lit = light;
        console.log("Lighting", this.lit);
        return this.lit;
    }

    /* check whether candle is lit or not.*/
    isLit ():boolean {
        return this.lit;
    }

    /* returns candle state as a string */
    isLitAsString ():string {
        let litString = this.isLit() ? "ON" : "OFF";
        console.log("I'm  %s %s", this.label, litString);
        return litString
    }

    /* returns candle state as a string */
    connect (candle: Candle, connectBothWays:boolean=true):boolean {

        /* if the candle does not exist already in connections add it */
        if (this.connections.hasOwnProperty(candle.id))
        {
            console.log("Connections between candle [%d]->[%d] already exists", this.id, candle.id);
            return false;
        }
        else    
        {
            console.log("Connecting[%d]->[%d]", this.id, candle.id);
            this.connections[candle.id] = candle;
            if (connectBothWays)
                return candle.connect(this, false);
        }
    }

    printConnections () {
        //console.log(this.connections);
        for (var key in this.connections) {
            console.log("[%s]->[%s]", this.label, this.connections[key].label);
        }
    }
}

let c1 = new Candle ("Candle 1", 1);
let c2 = new Candle ("Candle 2", 2, false);
let c3 = new Candle ("Candle 3", 3);

c1.isLitAsString();
c2.isLitAsString();
c2.light();
c2.isLitAsString();

c1.connect(c2);
c1.connect(c3);

c1.printConnections ();
c2.printConnections ();
c3.printConnections ();