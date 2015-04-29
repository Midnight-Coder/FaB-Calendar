var sampleList = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}];
                //{9:30 am - 11:30 am}, {6:00 pm - 7:00 pm}, {6:20 pm - 7:20 pm}, {7:10 pm - 8:10 pm}
/*
Methods for Measurements:
    height & margin-top: defines the units 'px' since time events are specified in px.
    height: defines the height/length of the event card per 30min slot
    marginTop: defines the margin of the card from the top of the container

    width & left: units '%' relative to container width
    widht: defines the width/breadth of the event card (varies with number of overlaping cards)
    left: defines the position of the card on the X-axis (for overlaping events)
*/
var eventCardDimensions = {
    height: 22,
    width: 93,
    marginTop: 22,
    left: 32
};
window.onload = function(){
    layOutDay(sampleList);
};
function layOutDay(events) {
    var markupFragment, $div;
    //Sort events by start time
    events.sort(function(a,b){
        return a.start - b.start;
    });

    //Calculate the margin-top for each event card
    evalMarginTop(events);

    //Calculate the height for each event card
    evalHeight(events);

    //Group all overlapping events together -> Aids width calculation
    events = resolveConflicts(events);

    //Calculate the width of each event card
    evalWidth(events);

    //Write markup to it
    markupFragment = makeCalendarEventCards(events);

    document.getElementsByClassName('events-container')[0].appendChild(markupFragment);
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
    var k = eventCardDimensions.width * 100,   //*100 -> optimize for rounding to second decimal place
        width;
    nestedList.forEach(function(groupOfEvents){
        //Each event in the group has to have the same width which totals to W (W=90% based on our styles)
        //Round to the nearest hundredth
        width = (Math.ceil(k/groupOfEvents.length))/100;
        groupOfEvents[0].width = width;
        groupOfEvents[0].left = 0;
        for(var i = 1; i < groupOfEvents.length; i++){
            groupOfEvents[i].width = width;
            groupOfEvents[i].left = eventCardDimensions.left + groupOfEvents[i-1].left;
        }
    });
}
function evalMarginTop(list){
    var k = eventCardDimensions.marginTop * 10,   //*10 -> optimization -> precalc of constants
        marginTop;
    list.forEach(function(entry){
        //Eval marginTop as the distance for 9:00 AM (00)
        marginTop = (entry.start*k)/30;
        //Round to the nearest tenth (px is accurate for 1 decimal notation)
        entry.marginTop = Math.ceil(marginTop)/10;
    });
}
function evalHeight(list){
    var height;
    list.forEach(function(entry){
        //Eval height as the distance from (end-start)

        //Round to nearest tens
        height = (Math.round((entry.end - entry.start)/10))*10
        height = (height*eventCardDimensions.height)/30;
        //Round to the nearest hundredth
        entry.height = Math.round(height);
    });
}
function makeCalendarEventCards(nestedList){
    var markup = '',
        eventCards = document.createDocumentFragment(),
        $small = document.createElement('small'),
        $p = document.createElement('p'),
        $div = document.createElement('div'),
        $clonedNode;

        //TODO find interesting items
        $p.innerHTML = 'Sample Item:';
        $small.innerHTML = 'Sample Location';


        $div.className = 'event';
        $div.appendChild($p);
        $div.appendChild($small);


    for(var i = 0; i < nestedList.length; i++){
        for(var j = 0; j < nestedList[i].length; j++){
            $clonedNode = $div.cloneNode(true);
            $clonedNode.children[0].innerHTML +=  nestedList[i][j].start + '-' + nestedList[i][j].end;
            $clonedNode.style.width = nestedList[i][j].width+'%';
            $clonedNode.style.height = nestedList[i][j].height+'px';
            $clonedNode.style.left = nestedList[i][j].left+'%';
            $clonedNode.style.marginTop = nestedList[i][j].marginTop+'px';
            eventCards.appendChild($clonedNode);
        }
    }
    return eventCards;
}
