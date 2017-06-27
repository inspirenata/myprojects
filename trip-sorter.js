/**
 * Trip Sorter API
 *
 * Input data types:
 *
 *  Planes:
 *  {
 *       type: 'plane',
 *       from: 'Stockholm',
 *       to: 'New York JFK',
 *       number: 'SK22',        // required
 *       gate: '22',            // required
 *       seat: '7B',            // required
 *       baggage: 'auto'        // not required
 *   }
 *
 *   Trains:
 *   {
 *       type: 'train',
 *       from: 'Madrid',
 *       to: 'Barcelona',
 *       number: '78A',         // required
 *       seat: '45B'            // required
 *   }
 *
 *   Bus:
 *   {
 *       type: 'bus',
 *       from: 'Barcelona',
 *       to: 'Gerona Airport'
 *   }
 *
 */

(function(exports) {

    function Tripper() {
        this.cards = [];

        this.head = null;
        this.tail = null;
        this.current = null;
    }

    Tripper.prototype.addCard = function(card) {
        if (card instanceof Card) {
            this.cards.push(card);
        } else {
            throw new Error('Invalid Card type.');
        }
    };

    Tripper.prototype.importRaw = function(jsonRows) {
        var cardFactory = new CardFactory();

        for (var i = 0; i < jsonRows.length; i++) {
            this.addCard(cardFactory.createCard(jsonRows[i]));
        }
    };

    Tripper.prototype.assignLinks = function() {
        if (this.cards.length == 0) {
            return false;
        }

        if (this.cards.length == 1) {
            this.head = this.tail = this.current = this.cards[0];

            return true;
        }

        for (var i = 0; i < this.cards.length; i++) {
            for (var j = 0; j < this.cards.length; j++) {
                if (this.cards[i].to == this.cards[j].from) {
                    this.cards[i].next = this.cards[j];
                }

                if (this.cards[i].from == this.cards[j].to) {
                    this.cards[i].prev = this.cards[j];
                }
            }
        }

        for (i = 0; i < this.cards.length; i++) {
            if (this.cards[i].prev == null) {
                this.head = this.cards[i];
            }
            if (this.cards[i].next == null) {
                this.tail = this.cards[i];
            }
        }

        return this;
    };

    Tripper.prototype.sort = function() {
        return this.assignLinks();
    };

    Tripper.prototype.getCards = function () {
        return this.cards;
    };

    Tripper.prototype.route = function() {
        this.sort();

        if (this.getCards().length == 0) {
            console.log('You have not any cards or tickets, stay and relax.');

            return true;
        }

        this.current = this.head;

        console.log('\n-------------------- Trip starts --------------------\n');

        do {
            var text = this.current.draw();

            console.log(text);

            this.current = this.current.next;
        } while (this.current != null);

        this.current = this.tail;

        console.log('\n-------------------- Trip ends ----------------------\n');

        return true;
    };

    // Card factory
    function CardFactory() {}
    CardFactory.prototype.createCard = function(options) {
        options = options || {
            'type': 'card'
        };

        options.type = options.type || 'card';

        var cardConstructor;

        if (options.type == 'bus') {
            cardConstructor = BusCard;
        } else if (options.type == 'train') {
            cardConstructor = TrainCard;
        } else if (options.type == 'plane') {
            cardConstructor = PlaneCard;
        } else if (options.type == 'card') {
            cardConstructor = Card;
        } else {
            throw new TypeError('Invalid Card type');
        }

        var card = new cardConstructor(options);
        card.setDeparture(options.from);
        card.setArrival(options.to);

        return card;
    };

    var CardFactoryInstance = new CardFactory();

    function Card() {
        this.prev = null;
        this.next = null;
    }

    Card.prototype.setDeparture = function(departure) {
        this.from = departure;
    };

    Card.prototype.setArrival = function(arrival) {
        this.to = arrival;
    };

    Card.prototype.draw = function() {
        return 'From ' + this.from + ' get into ' + this.to;
    };

    // Bus Card Type
    function BusCard(options) {}
    BusCard.prototype = CardFactoryInstance.createCard();
    BusCard.prototype.constructor = BusCard;

    BusCard.prototype.draw = function() {
        return 'Take the bus from ' + this.from
        + ' to ' + this.to
        + '. No seat assignment';
    };

    // Train Card Type
    function TrainCard(options) {
        if (!options.number) {
            throw new TypeError('Train number should be included.');
        }

        if (!options.seat) {
            throw new TypeError('Your seat place should be included.');
        }

        this.seat   = options.seat;
        this.number = options.number;
    }
    TrainCard.prototype = CardFactoryInstance.createCard();
    TrainCard.prototype.constructor = TrainCard;

    TrainCard.prototype.draw = function() {
        return 'Take train ' + this.number
        + ' from ' + this.from
        + ' to ' + this.to
        + '. Seat ' + this.seat + '.';
    };

    // Plane Card type
    function PlaneCard(options) {
        if (!options.number) {
            throw new TypeError('Flight number should be included.');
        }

        if (!options.gate) {
            throw new TypeError('Gate info should be included on card.');
        }

        if (!options.seat) {
            throw new TypeError('Your seat place should be included.');
        }

        this.gate   = options.gate;
        this.seat   = options.seat;
        this.number = options.number;

        if (typeof options.baggage != 'undefined') {
            this.baggage = options.baggage;
        }
    }
    PlaneCard.prototype = CardFactoryInstance.createCard();
    PlaneCard.prototype.constructor = PlaneCard;

    PlaneCard.prototype.draw = function() {
        var route = 'From ' + this.from + ', take flight ' + this.number
                    + ' to ' + this.to + '. Gate ' + this.gate + '. Seat ' + this.seat + '. ';

        if (typeof this.baggage != 'undefined' && this.baggage != '') {
            if (this.baggage == 'auto') {
                route += 'Baggage will be automatically transferred from your last leg.';
            } else {
                route += 'Baggage drop at ticket counter ' + this.baggage + '.';
            }
        } else {
            route += 'No information on baggage.';
        }

        return route;
    };

    // Tripper API
    exports.TripManager = function () {
        var tripper = new Tripper();
        this.importRaw = function (jsonRawData) {
            tripper.importRaw(jsonRawData);
        };
        this.addCard = function (data) {
            tripper.addCard(data);
        };
        this.route = function () {
            tripper.route();
        };
        this.createCard = function(options) {
            return CardFactoryInstance.createCard(options);
        }
    }

})(this);

var tripper = new this.TripManager();
tripper.importRaw([
    {
        type: 'plane',
        from: 'Gerona Airport',
        to: 'Stockholm',
        number: 'SK455',
        gate: '45B',
        seat: '3A',
        baggage: '344'
    },
    {
        type: 'plane',
        from: 'Stockholm',
        to: 'New York JFK',
        number: 'SK22',
        gate: '22',
        seat: '7B',
        baggage: 'auto'
    },
    {
        type: 'train',
        from: 'Madrid',
        to: 'Barcelona',
        number: '78A',
        seat: '45B'
    },
    {
        type: 'bus',
        from: 'Barcelona',
        to: 'Gerona Airport'
    }
]);
tripper.route();
tripper.addCard(tripper.createCard({
    type: 'plane',
    from: 'New York JFK',
    to: 'Moscow',
    number: 'MSK90',
    gate: '2A',
    seat: '10C'
}));

tripper.route();
