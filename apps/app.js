$(document).ready(function() {
	$("#opening button").click(function() {
		$("#opening").css("display", "none"); // hide the opening message
		
		// create the problems the user will need to solve
		var quizProblem1 = new quizProblem("How old am I?", [22, 23, 16, 27], 27); 
		var quizProblem2 = new quizProblem("Where am I from?", ["Gary", "Chicago", "Detroit"], "Gary"); 
		var quizProblem3 = new quizProblem("Do I love mathematics?", ["Yes", "No"], "Yes"); 
		
		quizProblems = getAllProblems(quizProblem1, quizProblem2, quizProblem3); 
		startQuiz(quizProblems);
	});
});


function quizProblem(question, answerChoices, correctAnswer) {
	/* 
		question is a string representing the question the user is suppose to answer.
		answerChoices is an array of strings/numbers/booleans that represent the choices the user has to answer the question. 
		correctAnswer is a string/number/boolean that represent the correct answer choice for the given question.
	*/
	this.question = question; 
	this.answerChoices = answerChoices;
	this.correctAnswer = correctAnswer; 
}

function getAllProblems() {
	// Any arguments passed to this function should be a quizProblem object.
	// Returns an array of all the arguments in the order presented in the argument list with each having an added 
	//		property called num, which identifies the problem number that will be used to distinguish one problem from another. 
	
	var args = arguments;
	var problems = [];
	
	if (args.length === 0) {
		console.log("getAllProblems needs at least one argument");
	}
	else {
		$.each(args, function(index, problem) { 
			if (problem instanceof quizProblem) {
				problem.num = "Problem " + (index + 1); // gives the problem number
				problems.push(problem); 
			}
			else {
				console.log("getAllProblems only accepts instances of quizProblem"); 
			}
		});
	}
	return problems
}

function showProblem(problem) {
	var h2 = document.createElement("h2"); // a h2 element
	var ol = document.createElement("ol"); // a ol element
	var select = document.createElement("select"); // a select element
	var alphabets = "abcdefghijklmnopqrstuvwxyz"; // something used to help the user select among the answer choices by choosing a lowercase letter
	var correctChoice; // will be the letter of the correct answer to the problem

	
	
	$(h2).html("<div>" + problem.num + "</div> " + problem.question) // have the problem question be a h1 element
		 .find("div").css({
			color: "gray",
			"text-decoration": "underline",
			"text-align": "center"
		}); 
	
	$(ol).attr("type", "a") // changing marker type so that the items are numbered with lowercase letters
	 
	
	$.each(problem.answerChoices, function(index, option) {
		$(ol).append("<li>" + option + "</li>");
		$(select).append("<option value=" + alphabets.charAt(index) + " >" + alphabets.charAt(index) + " </option>");
		if(option === problem.correctAnswer) {
			correctChoice = alphabets.charAt(index); 
		}
	});

	
		   
	// the user will be able to see the question, the answer choices, and a place to submit his/her choice. 
	$(".question").append(h2);		  
	$(".answerChoices").append(ol);		   
	$("#answerForm").append(select)
					.append("<input type=submit value=submit>");
					
					
					
	return correctChoice; 
}


function removeProblem() { // remove problem from the DOM and hide feedback  

	$("#answerForm").children().remove();
	$(".answerChoices").children().remove();
	$(".question").children().remove();
	$("#feedback").css("display", "none");  
}


function showFeedback(userChoice, correctChoice) { // tell the user whether he/she submitted the correct choice and updates the number correctly answered problems if necessary
		// userChoice is the selection the user made 
		// correctChoice is the correct answer to the question of the problem

		var result;
		var color; 
		
		if(correctChoice === userChoice) { // the user got the problem right 
			var numCorrect = $("#numCorrect"); // used to make things a little easier for making changes 
			numCorrect.html(+numCorrect.text() + 1); // update the number of problems the user has got correct
			result = "right";
			color = "green";
			
		}
		else { // the user got the problem wrong 
			result = "wrong";
			color = "red"; 
		}

		// show the feedback to the user 
		$("#result").html(result)
					.css("color", color); 
					
		$("#correctAnswer").html("(" + correctChoice + ").");
		
		$("#feedback").css({// show feedback message
			display: "block",
			"text-align": "center"
		}); 
		
		
}

function startQuiz(problems) {
	var index = 0;
	var nextButton = $("#problem-section").find("button[name='next']"); // the button element that allows the user to go to the next question
	var playAgainButton = $("#endGame").find("button[name='play-again']"); // the button element that allows the user to play the game again
	var quitButton = $("#endGame").find("button[name='quit']"); // the button element that allows the user to quit the game
	var numOfProblems = problems.length; 
	var problem = problems[index];
	var correctChoice = showProblem(problem); // the correct letter to the given problem
	var userChoice; // will be the letter the user selected
  
	
	$("#stats").css("display", "block") // allow the user to see his/her playing statistics. 
			   .find("#total").html(numOfProblems); //will show the total number of problems so the user can see on the html webpage
			   
	nextButton.click(function() { // the user is clicked to go to the next problem
		// remove current problem and the feedback for the current problem 
		removeProblem();
		
		// get and show the next problem for the user to solve
		index += 1;
		correctChoice = showProblem(problems[index]);
		
		// Note: The reason index does not include 0 is because the "next" button does not appear until after the user has answered the first problem. 
		
		// the user should be able to click the submit button again and not see the next button; 
		$("#answerForm").find("input[type='submit']").attr("disabled", false); 
		nextButton.css("display", "none"); 
	}); 
		

	playAgainButton.click(function() { // allow user to play the game again
		removeProblem();// remove the last problem from the previous game
		correctChoice = showProblem(problems[0]); //show the first problem for this game
		$("#numCorrect").html(0); // since this will be a new game, the user has not answered any questions correctly 
		$("#numCompleted").html(0); // and the user has not completed any problems in this new game. 
		$(this).parent().css("display", "none"); // the user no longer needs to decide whether to play again or quit
	});
	
	quitButton.click(function() { // allow user to quit the game
		alert("Thanks for playing. Please close this tab in your browser."); 
		$("body").remove() // remove everything and just show a clear white background
	}); 
	
	$("#answerForm").submit(function(event) {
		event.preventDefault(); 
		
		$("#answerForm").find("input[type='submit']").attr("disabled", true); // the user should not be able to immediately click the submit button again
		$("#numCompleted").html(index+1); // since the user answered the question to the problem, update the number of problems that the user completed 
		userChoice = $("select option:selected").val(); // gets the letter choice the user selected 
		showFeedback(userChoice, correctChoice);
		
		console.log(userChoice);
		
		if(index === numOfProblems-1) { // the user went through all the problems 
			$("#endGame").fadeIn(5000); // allow the user to choose whether to play again or to quit
			index  = 0; // reset 
		}
		else { // all user to go next problem by clicking a button
			nextButton.css("display", "block"); 
		}
	});
}