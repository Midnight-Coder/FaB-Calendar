var sampleList = [{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}];
                //{9:30 am - 11:30 am}, {6:00 pm - 7:00 pm}, {6:20 pm - 7:20 pm}, {7:10 pm - 8:10 pm}
//var sampleList2 = [{start: 5, end: 20}, {start: 10, end: 50}, {start: 15, end: 20}, {start: 30, end: 40}, {start: 45, end: 60}];
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
    marginTop: 24,
    left: 32
};

function layOutDay(events) {
    var $eventsContainer = document.getElementsByClassName('events-container')[0],
        markupFragment;
    //Sort events by start time
    events.sort(function(a,b){
        return a.start - b.start;
    });

    //Calculate the margin-top for each event card
    evalMarginTop(events);

    //Calculate the height for each event card
    evalHeight(events);

    //Calculate the width and left(pos) of each event card
    evalWidthAndLeft(events);

    //Generate document fragment for it
    markupFragment = makeCalendarEventCards(events);

    //Clear previous enteries and populate it
    $eventsContainer.innerHTML = null;
    $eventsContainer.appendChild(markupFragment);
}

function groupOverlappingEvents(list){
    /*
        * For each event find overlapping events and maximum #columns required
        * Optimize by ignoring events that overlap with other events - theta(n^2)
    */
    var overlappingEvents = [],
        maxColumns = 0;
    list.forEach(function(meeting, index){
        //Optimization: don't form conflict list for already processed events
        if(meeting.isProcessed){
            return;
        }
        overlappingEvents[index] = [];
        for(var i = 0; i < list.length; i++){
            if(i === index){
                continue;
            }
            if(areOverLappingEvents(meeting, list[i])){
                list[i].isProcessed = true;
                overlappingEvents[index].push(list[i]);
            }
        }
    });
    return overlappingEvents;
}

function areOverLappingEvents(meeting1, meeting2){
    //If meeting 1 starts while meeting 2 is in progress
    if(meeting1.start > meeting2.start && meeting1.start < meeting2.end){
        return true;
    }
    //If meeting 2 starts while meeting 1 is in progress
    if(meeting2.start > meeting1.start && meeting2.start < meeting1.end){
        return true;
    }
    return false;
}

function evalWidthAndLeft(eventList){
//Each event in the group has to have the same width W (mandated)
    var overLappingEvents = groupOverlappingEvents(eventList),
        maxWidth = eventCardDimensions.width * 100,   //*100 -> optimize for rounding to second decimal place
        width, left;
    //Iterate - start with events having max overlap
    overLappingEvents.forEach(function(overlaps, index){
        //ForEach will ignore all undefined events (events which were already defined in another overlapping list)

        left = 0;
        //Check if existing event has a width else calc new width
        /*
            We need to check only the first overlapping element for presence of width
            Optimization based on the fact : overlaps[] is sorted by start time (increasing order)
        */
        width = (overlaps.length && overlaps[0].width)?
                overlaps[0].width:
                (Math.ceil(maxWidth/(overlaps.length+1)))/100;  //Round to 2nd decimal place
        eventList[index].left = left;
        eventList[index].width = width;
        left += width;
        overlaps.forEach(function(conflictingMeeting){
            if(!conflictingMeeting.width){
                conflictingMeeting.width = width;
                conflictingMeeting.left = left;
            }
            left += width;

            //sanitize the object
            delete conflictingMeeting.isProcessed;
        });
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
        height = (Math.round((entry.end - entry.start)/10))*10;
        height = (height*eventCardDimensions.height)/30;
        //Round to the nearest hundredth
        entry.height = Math.round(height);
    });
}

function makeCalendarEventCards(eventList){
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

    for(var j = 0; j < eventList.length; j++){
        $clonedNode = $div.cloneNode(true);
        $clonedNode.children[0].innerHTML +=  eventList[j].start + '-' + eventList[j].end;
        $clonedNode.style.width = eventList[j].width+'%';
        $clonedNode.style.height = eventList[j].height+'px';
        $clonedNode.style.left = eventList[j].left+'%';
        $clonedNode.style.marginTop = eventList[j].marginTop+'px';
        eventCards.appendChild($clonedNode);
    }
    return eventCards;
}
