var suite = this;
describe('Fab Cal', function(){

    it('should take an unsorted list and turn it into a list of sorted events with margin-top, height and width',
    function(){
        var unsortedList = [{start: 30, end: 150}, {start: 560, end: 620}, {start: 540, end: 600}],
            sortedList = [{start: 30, end: 150, marginTop: 6.3, width: 90},
                {start: 540, end: 600, marginTop: 113.4, width: 45}, {start: 560, end: 620, marginTop: 117.6, width: 45}];
        suite.layOutDay(unsortedList);
        expect(unsortedList).toEqual(sortedList);
    });

    it('should be able to group overlapping transactions into the same list', function(){
        var conflictingList = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}],
            resolvedList = [[{start: 30, end: 150}], [{start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}]];

        expect(suite.resolveConflicts(conflictingList)).toEqual(resolvedList);
    });

    it('should be able to evaluate the width for each event card', function(){
        var list = [[{start: 30, end: 150}],
                [{start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}]],
            eventsWithWidth = [[{start: 30, end: 150, width: 90}],
                [{start: 540, end: 600, width: 30}, {start: 560, end: 620, width: 30}, {start: 610, end: 620, width: 30}]];

        suite.evalWidth(list);
        expect(list).toEqual(eventsWithWidth);
    });

    it('should be able to evaluate the marginTop for each each event card', function(){
        var list = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}],
            eventsWithHeight = [{start: 30, end: 150, marginTop: 6.3}, {start: 540, end: 600, marginTop: 113.4},
                {start: 560, end: 620, marginTop: 117.6}, {start: 610, end: 620, marginTop: 128.1}];

        suite.evalMarginTop(list);
        expect(list).toEqual(eventsWithHeight)
    });

    it('should be able to generate event cards from a comprehensive events list', function(){
        var list = [[{start: 30, end: 150, marginTop: 6.3, width: 90, height: 20}]],
            markup = "<div class='event'style='height:20%;margin-top:6.3%'><p>Sample Item</p>"
                + "<small>Sample Location</small></div>";

        expect(suite.makeCalendarEventCards(list)).toEqual(markup);
    });
});
