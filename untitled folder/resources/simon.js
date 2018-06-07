// create trim method in older browsers
if (typeof String.prototype.trim !== 'function') {  
  String.prototype.trim = function () {  
    return this.replace(/^\s+|\s+$/g,'');  
  };  
} 

var wordPairs = [
	["SPIX", "SPECS"], 
	["FISH", "FESH"], 
	["GISS", "GUESS"], 
	["SICT", "SECT"], 
	["DIT", "DEBT"], 
	["GICK", "GECK"], 
	["SKIP", "SKEP"], 
	["SHITH", "SHETH"], 
	["SIFT", "SEFT"], 
	["SKISS", "SKESS"], 
	["SITCH", "SETCH"], 
	["FIT", "FET"], 
	["SHIP", "SHEP"], 
	["THIT", "THET"], 
	["DITCH", "DETCH"], 
	["FIX", "FEX"], 
	["THIFT", "THEFT"],
	["SPIFF", "SPEFF"],
	["DIFT", "DEFT"],
	["CYST", "SEST"],
	["SHIFF", "CHEF"],
	["FIP", "FEP"],
	["DISP", "DESP"],
	["DITH", "DEATH"]
];

// shuffle word pairs
for (i = 0; i < wordPairs.length; i++) {
	wordPairs[i] = shuffle(wordPairs[i]);
};

var Nitems = 0;

var stimuli = [];
for (i = 0; i < 2; i++) {
	wordPairs = shuffle(wordPairs);
	for (j = 0; j < wordPairs.length; j++) {
		stimuli.push(wordPairs[j][i]);
		Nitems++;
	};
};

var condition = shuffle(["from-ih", "from-eh"])[0];

var realWords = ["SPECS", "FISH", "GUESS", "SECT", "DEBT", "SKIP", "SIFT", "FIT", "SHIP", "DITCH", "FIX", "THEFT", "DEFT", "CYST", "CHEF", "DEATH"];

var currItem = 0;
var data = {"condition":condition};
var timesPlayed = 0;
var finalDisplayDuration = 3000; //length of time spent on final screen, before submitting

var expectedTime = "5";
var payment = "$1.00";

var startTime = Date.now();

var repeatWorker = false;
var ut_id = "ganong-labels-01302018"; // unique experiment identifier. must first register on uniqueturker.myleott.com

$(document).ready(function() {
	
	if (UTWorkerLimitReached(ut_id)) {
		$('.slide').empty();
		repeatWorker = true;
		alert("You have already completed this HIT under another batch and cannot complete it again. Please click 'Return HIT' to avoid any impact on your approval rating.");
		$('#repeatWorker').show();
	} else {
	
		$('#expectedTime').html(expectedTime);
		$('.Nitems').html(Nitems);
		$('#payment').html(payment);
		showSlide("intro");
		
		if (turk.previewMode) {
			$("#mustaccept").show();
			$('#gotoSetup').hide();
		};
		
		$('#gotoSetup').click(function() {
			startTime = Date.now(); //log start time
			showSlide('setup');
		});	
		
		$('#gotoInstructions').click(function() {
			var testSoundText = $('#testBox').val();
			if (testSoundText.trim().toLowerCase() == "yellow") {
				$("#testError").hide();
				$("#testBox").val("");
				showSlide('instructions');
			} else {
				$("#testError").show();
			}
		});	
		
		$('#startButton').click(function() {
			$('#currItem').html(currItem);
			$('#itemProgress').show();
			stepExperiment();
		});
		
		$('#toEndInfo2').click(function() {
			var lang = $('#langBox').val();
			if (lang == '') {
				$('#langError').show();
			} else {
				$('#langError').hide();
				data.language = lang.replace(",", ";").replace(":",";");
				data.otherlangs = $('#otherlangBox').val().replace(",", ";").replace(":",";");
				showSlide('endInfo2');
			};
		});
		
		$('#toEndInfo3').click(function() {
			var USresponse = $('#USForm').serialize();
			if (USresponse.length == 0) {
				$('#USError').show();
			} else {
				$('#USError').hide();
				var hearing = $('#HearingForm').serialize();
				if (hearing.length == 0) {
					$('#HearingError').show();
				} else {
					$('#HearingError').hide();
					data.hearingErrors = hearing.split('=')[1];
					data.USnative = USresponse.split('=')[1];
					showSlide('endInfo3');
					$('#comments').focus();
				};
			};
		});
		
		$('#endbutton').click(function() {
			data.comments = $('#comments').val().replace(/,/g, ";").replace(/:/g,";");
			data.expDuration = (Date.now() - startTime) / 60000; //duration of experiment, in minutes
			data.repeatWorker = repeatWorker;
			showSlide('finish');
			setTimeout(function() { turk.submit(data)}, finalDisplayDuration);
		});
		
		// listener to increase play counter when audio is played
		$("#recordingObject").on("play", function () {
		  timesPlayed++;
		});
		
		// listener to click the continue button when enter is pressed in the test box
		$("#testBox").keyup(function(event){
			if(event.keyCode == 13){
				$("#gotoInstructions").click();
			}
		});
		
		// listener to click the continue button when enter is pressed in the heard box
		$("#heardBox").keyup(function(event){
			if(event.keyCode == 13){
				$("#toLexicalDecision").click();
			}
		});
		
	};

});

function showSlide (slideName) {
    $('.slide').hide();
	$(".error").hide()
    $('#' + slideName).show();
}

function stepExperiment () {
	if (stimuli.length == 0) { // end the experiment
		$('#itemProgress').hide();
		showSlide('endInfo1');
	} else { //advance to next trial
		currItem++;
		$('#currItem').html(currItem);
		var trialdata = {
			"stimulus": stimuli.pop(),
			"trialnum": currItem,
			"definition": "NA",
		};
		if (realWords.indexOf(trialdata.stimulus) == -1) {
			trialdata.actualStatus = "NONWORD";
		} else {
			trialdata.actualStatus = "WORD";
		};
		typeTask(trialdata);
	};
}

function typeTask(trialdata) {
	$("#recordingSource").attr("src", "ganong/endpoints/" + trialdata.stimulus + "_" + condition + ".wav");
	$("#recordingObject").load();
	timesPlayed = 0;
	showSlide('stageListen');
	$("#recordingObject")[0].play();
	$("#heardBox").focus(); //set focus to textbox
	
	$('#toLexicalDecision').click(function() {
		var orthography = $("#heardBox").val().trim();
		if (orthography == "") {
			$("#heardError").show();
			$("#heardBox").focus();
		} else {
			$("#toLexicalDecision").unbind('click');
				// make continue button available for re-use 
			$(".heardResponse").html(orthography);
			trialdata.orthography = orthography.toLowerCase();
			trialdata.timesPlayed = timesPlayed;
			$("#heardBox").val("");
			lexicalTask(trialdata);
		};
	});
}

function lexicalTask(trialdata) {
	showSlide("stageLexical");
	$('#nonWordButton').click(function() {
		$("#realWordButton").unbind('click');
		$("#nonWordButton").unbind('click');
			// make continue button available for re-use 
		trialdata.response = "nonword";
		data["trial" + trialdata.trialnum] = trialdata;
		stepExperiment();
	});
	$('#realWordButton').click(function() {
		$("#realWordButton").unbind('click');
		$("#nonWordButton").unbind('click');
			// make continue button available for re-use 
		trialdata.response = "word";
		if (trialdata.actualStatus == "NONWORD") {
			definitionTask(trialdata);
		} else {
			data["trial" + trialdata.trialnum] = trialdata;
			stepExperiment();
		};
	});
}

function definitionTask(trialdata) {
	showSlide("stageDefinition");
	$("#definitionBox").focus();
	$('#nextTrial').click(function() {
		var definition = $("#definitionBox").val().replace(/,/g, ";").replace(/:/g,";").trim();
		if (definition == "") {
			$("#definitionError").show();
			$("#definitionBox").focus();
		} else {
			$("#nextTrial").unbind('click');
				// make continue button available for re-use 
			trialdata.definition = definition;
			data["trial" + trialdata.trialnum] = trialdata;
			$("#definitionBox").val("");
			stepExperiment();
		};
	});
	
}

function shuffle(v) { // non-destructive.
    newarray = v.slice(0);
    for (var j, x, i = newarray.length; i; j = parseInt(Math.random() * i), x = newarray[--i], newarray[i] = newarray[j], newarray[j] = x);
    return newarray;
}