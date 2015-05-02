var suite = this;
describe('Fab Cal', function(){

    it('should be able to work with unsorted list', function(){
        var list = [{start: 30, end: 150}, {start: 560, end: 620}, {start: 540, end: 600}];

        spyOn(document, 'getElementsByClassName').and.returnValue([{
            appendChild: function(){}
        }]);
        spyOn(suite, 'evalWidthAndLeft');
        spyOn(suite, 'evalHeight');
        spyOn(suite, 'evalMarginTop');
        spyOn(suite, 'makeCalendarEventCards');
        spyOn(document, 'appendChild');
        suite.layOutDay(list);

        expect(list[0].start).toBeLessThan(list[1].start);
        expect(list[1].start).toBeLessThan(list[2].start);
        expect(suite.makeCalendarEventCards).toHaveBeenCalled();
        expect(suite.evalWidthAndLeft).toHaveBeenCalled();
        expect(suite.evalHeight).toHaveBeenCalled();
        expect(suite.evalMarginTop).toHaveBeenCalled();
        expect(document.getElementsByClassName).toHaveBeenCalled();
    });

    it('should be able to determine if two events overlap', function(){
        var event1 = {start: 540, end: 600},
            event2 = {start: 560, end: 620};
        expect(suite.isOverLappingEvents(event1, event2)).toBeTruthy();
    });

    it('should be able to return a list overlapping transactions', function(){
        var conflictingList = [
                {start: 30, end: 150},
                {start: 540, end: 600},
                {start: 560, end: 620},
                {start: 610, end: 620}
            ],
            resolvedList = [
                [], [{ start: 560, end: 620, isProcessed: true}], ,[{ start: 560, end: 620, isProcessed: true}]
            ];

        expect(suite.groupOverlappingEvents(conflictingList)).toEqual(resolvedList);
    });

    it('should be able to evaluate the width and left for each event card', function(){
        var list = [
                {start: 30, end: 150},
                {start: 540, end: 600},
                {start: 560, end: 620},
                {start: 610, end: 620}],
            expectedList = [
                {start: 30, end: 150, left: 0, width: 93},
                {start: 540, end: 600, left: 0, width: 46.5},
                {start: 560, end: 620, left: 46.5, width: 46.5},
                {start: 610, end: 620, left: 0, width: 46.5}
            ];

        suite.evalWidthAndLeft(list);
        expect(list).toEqual(expectedList);
    });

    it('should be able to evaluate the marginTop for each each event card', function(){
        var list = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}],
            eventsWithHeight = [
                {start: 30, end: 150, marginTop: 24},
                {start: 540, end: 600, marginTop: 432},
                {start: 560, end: 620, marginTop: 448},
                {start: 610, end: 620, marginTop: 488}];

        suite.evalMarginTop(list);
        expect(list).toEqual(eventsWithHeight)
    });

    it('should be able to evaluate the height for each each event card', function(){
        var list = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}],
            eventsWithHeight = [
                {start: 30, end: 150, height: 88},
                {start: 540, end: 600, height: 44},
                {start: 560, end: 620, height: 44},
                {start: 610, end: 620, height: 7}];

        suite.evalHeight(list);
        expect(list).toEqual(eventsWithHeight)
    });

    it('should be able to generate event cards from a comprehensive events list', function(){
        var list = [[{start: 30, end: 150, marginTop: 6.3, width: 90, height: 20, left:0}]],
            frag = suite.makeCalendarEventCards(list),
            $div;
        expect(frag.children[0] instanceof HTMLDivElement).toBeTruthy();
        $div = frag.children[0];
        expect($div.style.marginTop).toBe('6.3px');
        expect($div.style.width).toBe('90%');
        expect($div.style.height).toBe('20px');
        expect($div.style.left).toBe('0%');
    });
});
