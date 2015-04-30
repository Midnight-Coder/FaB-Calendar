var suite = this;
describe('Fab Cal', function(){

    it('should take an unsorted list and turn it into a list of sorted events with margin-top, height, left and width',
    function(){
        var list = [{start: 30, end: 150}, {start: 560, end: 620}, {start: 540, end: 600}];
        //Ensuring none of the test events get injected into the DOM
        spyOn(suite, 'makeCalendarEventCards');
        spyOn(document, 'getElementsByClassName').and.returnValue([{
            appendChild: function(){}
        }]);
        spyOn(document, 'appendChild');
        suite.layOutDay(list);

        expect(list[0].start).toBeLessThan(list[1].start);
        expect(list[1].start).toBeLessThan(list[2].start);
        expect(suite.makeCalendarEventCards).toHaveBeenCalled();
    });

    it('should be able to group overlapping transactions into the same list', function(){
        var conflictingList = [
                {start: 30, end: 150},
                {start: 540, end: 600},
                {start: 560, end: 620},
                {start: 610, end: 620}],
            resolvedList = [
                [{start: 30, end: 150}],
                [{start: 540, end: 600}, {start: 560, end: 620}],
                [{start: 560, end: 620}, {start: 610, end: 620}]];

        expect(suite.resolveConflicts(conflictingList)).toEqual(resolvedList);
    });

    it('should be able to evaluate the width for each event card', function(){
        var list = [
                [{start: 30, end: 150}],
                [{start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 620}]],
            expectedList = [
                [{start: 30, end: 150, width: 90}],
                [{start: 540, end: 600, width: 30}, {start: 560, end: 620, width: 30}],
                [{start: 560, end: 620, width: 30}, {start: 610, end: 620, width: 30}]];

        suite.evalWidth(list);
        expect(list).toEqual(expectedList);
    });

    it('should be able to evaluate the left for each event card', function(){
        var list = [
                [{start: 30, end: 150}],
                [{start: 540, end: 600}, {start: 560, end: 620}],
                [{start: 560, end: 620}, {start: 610, end: 620}]],
            expectedList = [
                {start: 30, end: 150, left: 0},
                {start: 540, end: 600, left: 0},
                {start: 560, end: 620, left: 30},
                {start: 610, end: 620, left: 0}];

        suite.evalleft(list);
        expect(list).toEqual(expectedList);
    });

    it('should be able to remove redundant event cards and flatten the list', function(){
        var list = [
                [   {start: 30, end: 150, width: 90, left: 0}],
                [   {start: 540, end: 600, width: 30, left: 0},
                    {start: 560, end: 620, width: 30, left: 0}],
                [   {start: 560, end: 620, width: 30, left: 0},
                    {start: 610, end: 620, width: 30, left: 0}]],
            flattenedList = [
                {start: 30, end: 150, width: 90, left: 0},
                {start: 540, end: 600, width: 30, left: 0},
                {start: 560, end: 620, width: 30, left: 0},
                {start: 610, end: 620, width: 30, left: 0}];

        suite.flattenList(list);
        expect(list).toEqual(flattenedList);
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

    xit('should be able to generate event cards from a comprehensive events list', function(){
        var list = [[{start: 30, end: 150, marginTop: 6.3, width: 90, height: 20}]],
            markup = "<div class='event'style='width:90%;height:20%;margin-top:6.3%;'><p>Sample Item</p>"
                + "<small>Sample Location</small></div>";

        expect(suite.makeCalendarEventCards(list)).toEqual(markup);
    });
});
