var lastupdate = 0;

function formatState(state)
{   
    var stateh = ""
    if (state == "open"){
        stateh = "Nyitva";
    }else if (state == "closed"){
        stateh = "Zárva";
    }else if (state == "opening"){
        stateh = "Nyílik";
    }else if (state == "closing"){
        stateh = "Csukódik";
    }else{
        stateh = "Ismeretlen";
    }
    return stateh;
};

function formatTime(time)
{   
    return dateFormat(new Date(parseInt(time)*1000), "yyyy.mm.dd HH:MM:ss") + "-óta";
};


function click(name) 
{
    $.ajax({
	url:"clk",
	data:{'id':name}
    })
};

$.ajax({
    url:"cfg",
    success: function(data) {
	for (var i = 0; i < data.length; i++) {
	    var id = data[i][0];
	    var name = data[i][1];
	    var state = data[i][2];
	    var time = data[i][3];
	    var li = '<li id="' + id + '" data-icon="false">';
	    li = li + '<a href="javascript:click(\'' + id + '\');">';
	    li = li + '<img src="img/'+state + '.png" />';
	    li = li + '<h3>' + formatState(state) + '</h3>';
	    li = li + '<p>' + formatTime(time) + '</p>';
	    li = li + '</a></li>';
	    $("#doorlist").append(li);
	    $("#doorlist").listview('refresh');
	}
    }
});

function uptime() {
     $.ajax({
 	url:"upt",
 	success: function(data) {
 	    $("#uptime").html(data)
 	    setTimeout('uptime()', 60000)
 	},
 	error: function(XMLHttpRequest, textStatus, errorThrown) {
 	    setTimeout('uptime()', 60000)
 	},
 	dataType: "json",
 	timeout: 60000	
     });
}


function poll(){
    $.ajax({ 
    	url: "upd",
    	data: {'lastupdate': lastupdate },
    	success: function(response, status) {
    	    lastupdate = response.timestamp;
    	    for (var i = 0; i < response.update.length; i++) {
    		var id = response.update[i][0];
    		var state = response.update[i][1];
    		var time = response.update[i][2];
    		$("#" + id + " h3").html(formatState(state));
    		$("#" + id + " p").html(formatTime(time));
    		$("#" + id  + " img").attr("src", "img/" + state + ".png")
    		$("#doorlist").listview('refresh');
    	    }
    	    setTimeout('poll()', 1000);
        },
        // handle error
        error: function(XMLHttpRequest, textStatus, errorThrown){
            // try again in 10 seconds if there was a request error
            setTimeout('poll();', 10000);
        },
    	//complete: poll,
    	dataType: "json", 
    	timeout: 30000
    });    
};

function init() {
    uptime()
    poll()
}

$(document).live('pageinit', init);
