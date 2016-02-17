describe('Test PointDetector by touch event information.', function() {
    var pd,
        pl,
        event,
        i;

    beforeEach(function() {
        pd = new window.Asdf.module.pointDetector;
        // event mock (10, 0) -> (408, 199)
        pl = [];
        event = {};
        i = 0;
        event.start = new Date() - 1000;
        event.end = new Date() - 1;
        for (; i < 200; i++) {
            pl.push({ x: 10 + (i+i), y: i });
        }
        event.list = pl;
    });

    it('pd is defined', function() {
        expect(pd).toBeDefined();
    });

    describe('test cardinal Points', function() {
        it('figure out cardinal points, SE', function() {
            var first = { x: 10, y: 10 },
                final = { x: 60, y: 30 },
                cardinalPoints;
            cardinalPoints = pd.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('SE');
        });

        it('figure out cardinal points, NW', function() {
            var first = { x: 60, y: 100 },
                final = { x: 10, y: 30 },
                cardinalPoints;
            cardinalPoints = pd.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('NW');
        });

        it('figure out cardinal points, N', function() {
            var first = { x: 60, y: 100 },
                final = { x: 60, y: 30 },
                cardinalPoints;
            cardinalPoints = pd.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('N');
        });

        it('figure out cardinal points, E', function() {
            var first = { x: 30, y: 100 },
                final = { x: 100, y: 100 },
                cardinalPoints;
            cardinalPoints = pd.getCardinalPoints(first, final);
            expect(cardinalPoints).toBe('E');
        });

        it('get duplicated charaters, between strings', function() {
            var str1 = 'asdf',
                str2 = 'kbga',
                dupl = pd._getDuplicatedString(str1, str2);

            expect(dupl).toBe('a');
        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = { x: 30, y: 100 },
                final = { x: 100, y : 250 },
                cardinalPoint = pd.getCardinalPoints(first, final),
                nearestPoint = pd.getNearestPoint(first, final, cardinalPoint);

            expect(nearestPoint).toBe('S');

        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = { x: 250, y: 0 },
                final = { x: 10, y : 150 },
                cardinalPoint = pd.getCardinalPoints(first, final),
                nearestPoint = pd.getNearestPoint(first, final, cardinalPoint);

            expect(nearestPoint).toBe('W');

        });

        it('figure out nearest four points(W,E,S,N)', function() {
            var first = { x: 10, y: 250 },
                final = { x: 100, y : 100 },
                cardinalPoint = pd.getCardinalPoints(first, final),
                nearestPoint = pd.getNearestPoint(first, final, cardinalPoint);

            expect(nearestPoint).toBe('N');

        });

        it('figure out nearest four point(W,E,S,N), use get direction.', function() {
            var result = pd.getDirection(pl);
            expect(result).toBe('E');
        });
    });


    describe('test event type', function() {
        it('flick event uprise.', function() {
            pd.extractType(event);
            expect(pd.type).toBe('flick');
        });

        it('ignore event(return none)', function() {
            event.start = 10000;
            event.end = 11000;
            event.list.push({
                x: 11,
                y: 5
            });
            pd.extractType(event);
            expect(pd.type).toBe('none');
        });

        it('ignore event(return none)', function() {
            event.start = 10000;
            event.end = 11000;
            event.list.push({
                x: 100,
                y: 100
            });
            pd.extractType(event);
            expect(pd.type).toBe('none');
        });
    });

    it('get Event type and direction', function() {
        var result = pd.figure(event);
        expect(result.direction).toBe('E');
        expect(result.type).toBe('flick');
    });

});
