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

    /* blow this candle */
    blow (parentCandle?: Candle):CandleConnection {

        /* check I'm lit */
        if (!this.lit) {
            console.error("Your are trying to blow a not lit candle %o", this);
            return [];
        }

        /* if I'm first candle just put it OFF and return my connections */
        if (!parentCandle)
        {
            this.lit = false;
            return this.connections;
        }
        else {
            /* if I'm a middle candle */

            /* my parent should not be lit */
            if (parentCandle.lit) {
                console.error("Your are trying to blow a me %o through a lit parent %o", this, parentCandle);
                return [];
            }

            /* check I'm connected with my parent */
            if (!(parentCandle.id in this.connections)) {
                console.error("%o I'm not connected with my parent %o", this, parentCandle);
                return [];
            }

            /* 
             * if I'm connect with my parent, clear all my parents connections, OFF me and return 
             * my connections 
             */
            this.lit = false;
            parentCandle.disconnectAll ();
            return this.connections;
        }
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

    /* returns candle state as a string */
    disconnect (candle: Candle, connectBothWays:boolean=true):boolean {

        /* if the candle does not exist already in connections add it */
        if (!this.connections.hasOwnProperty(candle.id))
        {
            console.log("Connections between candle [%d]->[%d] does NOT exists", this.id, candle.id);
            return false;
        }
        else    
        {
            console.log("Disconnecting[%d]->[%d]", this.id, candle.id);
            delete this.connections[candle.id];
            if (connectBothWays)
                return candle.disconnect(this, false);
        }
    }

     /* returns candle state as a string */
     disconnectAll () {
        for (var key in this.connections) {
            this.disconnect(connections[key]);
        }
    }

    printConnections () {
        //console.log(this.connections);
        for (var key in this.connections) {
            console.log("[%s]->[%s]", this.label, this.connections[key].label);
        }
    }
}
let connections: CandleConnection;
let c1 = new Candle ("Candle 1", 1);
let c2 = new Candle ("Candle 2", 2);
let c3 = new Candle ("Candle 3", 3);
let c4 = new Candle ("Candle 4", 4);

c1.connect(c2);
c2.connect(c3);
c2.connect(c4);
c3.connect(c4);

connections = c1.blow ();
console.log(connections);

connections = c2.blow (c1);
console.log(connections);
