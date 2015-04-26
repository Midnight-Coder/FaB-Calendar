var sampleList = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}];
function layOutDay(events) {
    var markup, $div;
    //Sort events by start time
    events.sort(function(a,b){
        return a.start - b.start;
    });
    //Group all overlapping events together
    events = resolveConflicts(events);

    //Wrap the width corresponding to each event
    evalWidth(events);
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
function evalWidth(list){

}
