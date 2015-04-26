var sampleList = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}];
function layOutDay(events) {
    var markup, $div;
    //Sort events by start time
    events.sort(function(a,b){
        return a.start - b.start;
    });

    //Calculate the margin-top for each event card
    evalMarginTop(events);

    //Group all overlapping events together -> Aids width calculation
    events = resolveConflicts(events);

    //Calculate the width of each event card
    evalWidth(events);

    //Write markup to it
    markup = makeCalendarEventCards(events);
}
function resolveConflicts(list){
    //Group all overlapping events together
    var resolvedList = [],
        overlap = [list[0]];
    for(var i=1; i<list.length; i++){
        if(list[i-1].end < list[i].start){
            //Separate non overlapping event from the previous list of overlapping events
            resolvedList.push(overlap);
            overlap = [list[i]];
        }
        else{
            //Else club together with the other overlapping events in that timeframe
            overlap.push(list[i]);
        }
    }
    resolvedList.push(overlap);
    return resolvedList;
}
function evalWidth(nestedList){
    var k = 90 * 100,   //*100 -> optimize for rounding to second decimal place
        width;
    nestedList.forEach(function(groupOfEvents){
        //Each event in the group has to have the same width which totals to W (W=90% based on our styles)
        //Round to the nearest hundredth
        width = (Math.ceil(k/groupOfEvents.length))/100;
        for(var i = 0; i < groupOfEvents.length; i++){
            groupOfEvents[i].width = width;
        }
    });
}
function evalMarginTop(list){
    var k = 6.3 * 100,   //*100 -> optimize for rounding to second decimal place
        marginTop;
    list.forEach(function(entry){
        //Eval marginTop as the distance for 9:00 AM (00). Every 30 min slot = 6.3% margin-top
        marginTop = (entry.start*k)/30;
        //Round to the nearest hundredth
        entry.marginTop = Math.ceil(marginTop)/100;
    });
}
function makeCalendarEventCards(nestedList){

}
