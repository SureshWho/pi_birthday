/*
 * Candle class.
 */

const Blow: boolean  = false;
const Light: boolean = true;

class CandleConnection {
    candle: Candle;
    state: boolean;
    
    constructor (candle:Candle, state:boolean) {
        this.candle = candle;
        this.state  = state;
    }
}

interface CandleConnectionDictionary {
    [id:number]:CandleConnection;
}

class Candle {
    lit:            boolean;
    connections:    CandleConnectionDictionary;
    ready:          boolean;

    /* constructor default state of a candle is lit(ON). */
    constructor (public label: string, public id: number, light: boolean=true) {
        this.label = label;
        this.id    = id;
        this.ready = false;
        this.connections = [,];
        this.lit = light;

        console.log("Creating candle", label);
    }

    /* set this candle as start candle */
    start () {
        this.ready = true;
    }
    /* blow this candle */
    action (action: boolean=false, parentCandle?: Candle):CandleConnectionDictionary {

        console.log("Tring to %s %s through %s", Candle.actionString(action), this.label, parentCandle ? parentCandle.label : "Parent");

        /* check I'm lit */
        if (this.lit === action) {
            console.error("Your are trying to %s me %o I'm %s", 
                         Candle.actionString(action), this, this.stateString());
            return [];
        }

        /* if I'm first candle just perform the action it OFF and return my connections */
        if (!parentCandle)
        {
            this.lit = action;

            /* mark all my connected candles are ready */
            this.markAllConnectionsReady (true);

            return this.connections;
        }
        else {
            /* if I'm a middle candle */

            /* my parent should not be lit */
            if (parentCandle.lit !== action) {
                console.error("Your are trying to %s a me %o through a %s parent %o", 
                Candle.actionString(action), this, parentCandle.stateString(), parentCandle);
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

             /* perform the action on me */
            this.lit = action;

            /* mark all me parent connections are not ready */
            parentCandle.markAllConnectionsReady (false);

            /* disable all connection with parent */
            parentCandle.disbaleAllConnections ();

            /* mark all my connected candles are ready */
            this.markAllConnectionsReady (true);
            parentCandle.ready = false;

            return this.connections;
        }
    }

    /* check whether candle is lit or not.*/
    isLit ():boolean {
        return this.lit;
    }

   /* returns candle state as a string */
   static actionString (action: boolean):string {
       let string = action ? "LIGHT" : "BLOW";
       return string;
    }

    /* returns candle state as a string */
    stateString (state?: boolean):string {
        let flag = (state) ? state : this.lit;
        let string = flag ? "LIT" : "NOT LIT";
        return string;
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
            /* just log one-way */
            if (connectBothWays)
                console.log("Connecting[%d]->[%d]", this.id, candle.id);
            if (!connection)
                var connection = new CandleConnection(candle, true);
            this.connections[candle.id] = connection;
            if (connectBothWays)
                return candle.connect(this, false);
        }
    }

    /* disconnects the given candle from this candle */
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

    /* disbale the connection between this candle and given candle */
    disableConnection (candle: Candle):boolean {
        /* if the candle does not exist already in connections add it */
        if (!this.connections.hasOwnProperty(candle.id))
        {
            console.log("Connections between candle [%d]->[%d] does NOT exists", this.id, candle.id);
            return false;
        }
        else    
        {
            console.log("Disbaling connection [%d]->[%d]", this.id, candle.id);
            this.connections[candle.id].state = false;
        }
    }

    /* disconnect all my connections */
    disbaleAllConnections () {
        for (var key in this.connections) {
            this.connections[key].state = false;
        }
    }

     /* disconnect all my connections */
    disconnectAll () {
        for (var key in this.connections) {
            this.disconnect (this.connections[key].candle);
        }
    }

    /* mask all my connection as ready or not ready */
    markAllConnectionsReady (ready?: boolean) {
        for (var key in this.connections) {
            this.connections[key].candle.ready = ready;
    }
}

    printConnections () {
        //console.log(this.connections);
        console.log("Ready ", this.ready, this.stateString());
        for (var key in this.connections) {
            console.log("[%s]->[%s] ", 
            this.label,
            this.connections[key].candle.label,
            this.connections[key].state
            );
        }
    }
}

interface CandlePlacements {
    [id:number]:number[];
}

let g_candlePlacements:CandlePlacements = {
    0:[1],
    1:[3,11],
    2:[3,4,5,6,7,8,10],
    3:[4,5,6,7,9,10,13],
    4:[5,7,8,10,11,13],
    5:[10,11],
    6:[10],
    7:[8,10],
    8:[10,11,13],
    9:[10],
    10:[13],
    11:[12],
};

class Cake {

    candles: Candle[] = new Array (15);
    defaultAction: boolean;
    startCandle: number;

    constructor (startCandle:number, defaultAction:boolean, construction: CandlePlacements, numCandles:number) {
        this.defaultAction = defaultAction;
        this.startCandle   = startCandle;
        this.placeCandles (construction, numCandles, startCandle);
    }

    placeCandles (construction: CandlePlacements, numCandles:number, startCandle:number) {

        /* create necessary candles */
        for (var i = 0; i < numCandles; i++) {
            this.candles[i] = new Candle ("Candle_" + i, i);
        }

        /* place candles */
        for (var fromCandleId in construction) {
            /* doing only ford connections should be enough */
            for (var i = 0; i < construction[fromCandleId].length; i++) {
                var toCandleId =  construction[fromCandleId][i];
                if (toCandleId > +fromCandleId) {
                    this.candles[fromCandleId].connect(this.candles[toCandleId]);
                }
            }
        }

        /* set first candle */
        this.candles[startCandle].start ();

    }

    removeCandles (construction: CandlePlacements) {
        for (var i = 0; i < this.candles.length; i++)
            delete this.candles[i];
    }

    printLogs () {
        for (var i = 0; i < this.candles.length; i++)
            this.candles[i].printConnections;
    }
}

var cake = new Cake (0, Blow, g_candlePlacements, 15);
