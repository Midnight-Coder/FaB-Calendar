var suite = this;
describe('Fab Cal', function(){

    it('should take an unsorted list and sort it wrt start time', function(){
        var unsortedList = [{start: 30, end: 150}, {start: 560, end: 620}, {start: 540, end: 600}],
            sortedList = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}];
        suite.layOutDay(unsortedList);
        expect(unsortedList).toEqual(sortedList);
    });

    it('should be able to group overlapping transactions into the same list', function(){
        var conflictingList = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}],
            resolvedList = [[{start: 30, end: 150}], [{start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}]];

        expect(suite.resolveConflicts(conflictingList)).toEqual(resolvedList);
    });

    it('should be able to attach the width of the event card UI', function(){
        var list = [[{start: 30, end: 150}],
                    [{start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}]],
            eventsWithWidth = [[{start: 30, end: 150, width: 90}],
                    [{start: 540, end: 600, width: 30}, {start: 560, end: 620, width: 30}, {start: 610, end: 620, width: 30}]];
        suite.evalWidth(list);
        expect(list).toEqual(eventsWithWidth);
    });
});
