$(document).ready(function() {
	$("#opening button").click(function() {
		// create the problems about Thinkful for the user to solve
		var quizProblem1 = new QuizProblem("In what year was Thinkful founded?", [2009, 2010, 2012, 2013], 2013),
			quizProblem2 = new QuizProblem("Who is not listed as a co-founder of Thinkful?", ["Darrell Silver", "Dan Friedman", "Andrew Ng"], "Andrew Ng"),
			quizProblem3 = new QuizProblem("Which statement about Thinkful is false?", ["Thinkful has a course that teaches only frontend web development.", 
				"Thinkful has a course that teaches only C programming.", "Thinkful offers 1-on-1 mentoring for more than five different courses."], 
				"Thinkful has a course that teaches only C programming."),
			quizProblem4 = new QuizProblem("What is the highest price charged monthly by Thinkful for any 1-on-1 course (not including any career paths)?",
				["$300", "$500", "$800", "$1000"], "$500"),
			quizProblem5 = new QuizProblem("Do Thinkful's 1-on-1 courses allow for flexible learning goals and schedules?", ["Yes", "No"], "Yes"),
			quizProblems = getAllProblems(quizProblem1, quizProblem2, quizProblem3, quizProblem4, quizProblem5); 

		// hide the opening message and show section that will contain the problems and allow user to solve them 
		$("#opening").css("display", "none");
		$("h1").css("display", "block")
		$("#problem-section").css("display", "block"); 
		
		
		startQuiz(quizProblems);
	});
});

/* Create an object the question, answer choices, and the correct answer for a quiz problem. */ 
function QuizProblem(question, answerChoices, correctAnswer) {
	/* 
		question is a string representing the question the user is suppose to answer.
		answerChoices is an array of strings/numbers/booleans that represent the choices the user has to answer the question. 
		correctAnswer is a string/number/boolean that represent the correct answer choice for the given question.
	*/
	this.question = question; 
	this.answerChoices = answerChoices;
	this.correctAnswer = correctAnswer; 
}

/* Gather all QuizProblem instances that were created into an array and return that array. */
function getAllProblems() {
	// Any arguments passed to this function should be a QuizProblem object.
	// Returns an array of all the arguments in the order presented in the argument list.
	
	var args = arguments,
		problems = [];
	
	if (args.length === 0) {
		console.log("getAllProblems needs at least one argument");
	}
	else {
		$.each(args, function(index, problem) { 
			if (problem instanceof QuizProblem) {
				problems.push(problem); 
			}
			else {
				console.log("getAllProblems only accepts instances of quizProblem"); 
			}
		});
	}
	return problems
}

/* 	Allow the user to see problem number, question, answer choices, and a place to
		 submit his/her choice. Return the correct answer for the given problem. */
function showProblem(problem, num) {
	// problem is an instance of QuizProblem
	// num is an integer that represents the problem number
	
	var h2 = document.createElement("h2"),
		ol = document.createElement("ol"),
		select = document.createElement("select"),
		alphabets = "abcdefghijklmnopqrstuvwxyz", // something used to help the user select among the answer choices by choosing a lowercase letter
		correctChoice; 
	
	$(h2).text(problem.question) 

	// changing marker type of the ordered list to be lowercase letters
	$(ol).attr("type", "a") 
	
	$(select).attr("required", true)
			 .css("margin-right", "2em")
			 .append("<option value=''>Select Letter</option>");
	 
	$.each(problem.answerChoices, function(index, option) {
		$(ol).append("<li>" + option + "</li>");
		$(select).append("<option value=" + alphabets.charAt(index) + " >" + alphabets.charAt(index) + " </option>");
		if(option === problem.correctAnswer) {
			correctChoice = alphabets.charAt(index); 
		}
	});	
	
	
	
	$("#question").append(h2);		  
	$("#answerChoices").append(ol);		   
	$("#answerForm").append(select)
					.append("<input type=submit value=Submit>");
	$("#problemNumber").html(num); 				
								
	
	return correctChoice; 
}


// Remove problem from the DOM and hide feedback  message.
function removeProblem() { 
	$("#answerForm").children().remove();
	$("#answerChoices").children().remove();
	$("#question").children().remove();
	$("#feedback").css("display", "none");  
}

/* Give the user feedback as to whether he/she submitted the correct choice and update 
		the number of correctly answered problems if necessary. */
function showFeedback(userChoice, correctChoice) { 
		// userChoice is the selection the user made 
		// correctChoice is the correct answer to the question of the problem

		var result,
			color; 
		
		if(correctChoice === userChoice) { // the user got the problem right 
			var numCorrect = $("#numCorrect"); 
			numCorrect.html(+numCorrect.text() + 1); 
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
		
		$("#feedback").css({
			display: "block",
			"text-align": "center"
		}); 
		
		
}

/* Allow the user to play the game */
function startQuiz(problems) {
	// problems is an array of instances of QuizProblem
	
	var index = 0,
		nextButton = $("#problem-section").find("button[name='next']"), 
		playAgainButton = $("#endGame").find("button[name='play-again']"),
		quitButton = $("#endGame").find("button[name='quit']"),
		numOfProblems = problems.length,
		correctChoice = showProblem(problems[index], index+1), 
		userChoice; // will be the letter the user selected
  
	// allow the user to see his/her playing statistics. 
	$("#stats").css("display", "block") 
			   .find("#total").html(numOfProblems); 
	

	// the user can click to go to the next problem
	nextButton.click(function() { 
		// remove current problem and the feedback for the current problem 
		removeProblem();
		
		// get and show the next problem for the user to solve
		index += 1;
		correctChoice = showProblem(problems[index], index+1);
		
		// Note: The reason index does not include 0 is because the "next" button does not appear until after the user has answered the first problem. 
		
		// at the next problem, the user should be able to select and submit his/her answer choice 
		$("#answerForm").find("input[type='submit']").css("display", "inline-block");
		$("#answerForm").find("select").attr("disabled", false);
		$(this).css("display", "none"); 
	}); 
		
	// the user can click to play the game again
	playAgainButton.click(function() { 
		removeProblem();// remove the last problem from the previous game
		correctChoice = showProblem(problems[0], 1); 
		$("#numCorrect").html(0); 
		$("#numCompleted").html(0); 
		$(this).parent().css("display", "none"); 
	});
	
	// the user can click to end the game
	quitButton.click(function() { 
		alert("Thanks for playing. Please close this tab in your browser."); 
		$("body").remove() 
	}); 
	
	// the user can submit the answer choice
	$("#answerForm").submit(function(event) {
		event.preventDefault(); 
		
		// gets the letter choice the user selected 
		userChoice = $("select option:selected").val(); 
		
		if (userChoice !== '') { // the user did select an answer choice
			// do not allow the user to press submit again or change an option from the select element
			$("#answerForm").find("input[type='submit']").css("display", "none"); 
			$("#answerForm").find("select").attr("disabled", true); 
			
			// update number of problems the user completed
			$("#numCompleted").html(index+1); 
			
			showFeedback(userChoice, correctChoice);
			
			console.log(userChoice);
			
			if(index === numOfProblems-1) { // the user completed all the problems 
				$("#endGame").fadeIn(7000, function() {
					this.scrollIntoView();
				});
				index  = 0; // reset 
			}
			else { // allow user to go next problem by clicking a button
				nextButton.css("display", "block"); 
			}
		}
		else {
			alert("You must select a letter.");
		}
	});
}