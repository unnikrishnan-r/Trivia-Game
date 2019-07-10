$(document).ready(function() {
  var timerMessage;
  var remainingSeconds = 30;
  var currentQuestionNumber = 0;
  var countDown;
  var d = new Date();

  var unAnsweredQuestionCounter = 0;
  var inCorrectAnswerCounter = 0;
  var correctAnswerCounter = 0;

  var gameObject = {};

  /* Function that dynamically add a "Start" button to page and defines a onclick event on the same.
     When clicked, it invokes readQuestionFile() function.
  */
  function showStartButton() {
    $(".container").append(
      $("<div>", {
        class: "row justify-content-md-center",
        id: "startButton"
      })
    );

    $("#startButton").append(
      $("<div>", {
        class: "col-xs-3 btn btn-primary btn-lg mt-3",
        text: "START",
        id: "startBtn"
      })
    );

    $("#startBtn").on("click", function() {
      // console.log("Clicked Start Button");
      //   readQuestionFile();
      startGame();
    });
  }

  //   Function to read a JSON file from repository. Once the file is read it invokes startGame() function
  //   by passing the JSON content from the file.
  function readQuestionFile() {
    console.log("Read Started");
    return fetch("assets/javascript/questions.json")
      .then(function(resp) {
        console.log("Read Completed");
        return resp.json();
      })
      .then(function(data) {
        console.log("Displaying Response of Fetch : ");
        console.log(data);
        // startGame(data);
        return data;
      });
  }

  /*This function starts the game by performing below
  1. Removes the start button from the page
  2. Copies JSON data to a global object
  3. Calls createQuestionHtmlElement() to create placeholders for questions, choices and timer message
  4. Calls askQuestion() to ask the first question
*/
  function startGame() {
    readQuestionFile().then(function(gameQuestions) {
      console.log("Displaying Game Data :" + gameQuestions);
      console.log(gameQuestions);
      console.log(Object.keys(gameQuestions));
      $("#startButton").remove();
      gameObject = gameQuestions;
      currentQuestionNumber = 1;
      createQuestionHtmlElement();
      askQuestion(gameQuestions.question1);
    });
  }

  /*Creates placeholders for:
    1. Timer message
    2. Question
    3. Choices
  */
  function createQuestionHtmlElement() {
    $(".container").append(
      $("<div>", {
        id: "timeMessage"
      })
    );

    $(".container").append(
      $("<div>", {
        class: "row justify-content-md-center",
        id: "questionBlock"
      })
    );

    $(".container").append(
      $("<div>", {
        class: "row justify-content-md-center",
        id: "choiceBlock"
      })
    );
  }

  /*Accepts the question data as argument and performs the below:
     1. Display the question on the screen
     2. Display the choices on the screen
     3. Define onclick event on the choices. When clicked it invokes processResult() by passing the value of the choice clicked
     4. Display initial timer message
     5. Once question and choices are displayed, initiate countdown timer.
  */
  function askQuestion(question) {
    // console.log(question.question);

    remainingSeconds = 30;
    timerMessage = "Time Remaining: " + remainingSeconds + " Seconds";
    $("#timeMessage").text(timerMessage);

    $("#questionBlock").append(
      $("<div>", {
        id: "questionText",
        class: "questionFont"
      })
    );

    $("#questionText").text(question.question);

    var choiceArray = Object.values(question.choices);
    $("#choiceBlock").append(
      $("<div>", {
        id: "choiceList"
      })
    );

    // console.log(choiceArray);
    for (var i = 0; i < choiceArray.length; i++) {
      $("#choiceList").append(
        $("<div>", {
          class: "choiceItemBox justify-content-md-center"
        }).append(
          $("<p>", {
            class: "choiceItem justify-content-md-center questionFont",
            text: choiceArray[i],
            cnbr: choiceArray[i]
          })
        )
      );
    }
    $(".choiceItem").on("click", function() {
      // console.log($(this).attr("cnbr"))
      processResult(currentQuestionNumber, $(this).attr("cnbr"), false);
    });

    startCountDown();
  }

  //Function that serves the need for a countdown timer. When time runs out, processResult() is called using timedOut arg
  function startCountDown() {
    countDown = setInterval(function() {
      remainingSeconds--;

      timerMessage = "Time Remaining: " + remainingSeconds + " Seconds";
      $("#timeMessage").text(timerMessage);

      if (remainingSeconds <= 0) {
        processResult(currentQuestionNumber, null, true);
      }
    }, 1000);
  }

  /*Function process the result. This can be invoked when clock runs out or user clics a choice. 
  Accepted arguments are current question number, selected answer, boolean indicating a timeout
  Below are performed
  1. Clear the setInterval so that count down stops
  2. Remove question and Choice blocks
  3. Setup gameMessage (Out of Time, Correct, Not correct etc)
  4. Increment counters (Unanswered, Correct Answer, Incorrect Answer etc)
  5. Show gameMessage and Correct answer on screen
  6. If more questions are left invoke waitAndAskNextQuestion()
  7. If it was the last question, display results
  */
  function processResult(currentQuestionNumber, selectedAnswer, timedOut) {
    clearInterval(countDown);
    $("#questionBlock").remove();
    $("#choiceBlock").remove();

    var correctAnswer = "The Correct Answer is : " + gameObject["question" + currentQuestionNumber].answer;
    var gameMessage;

    if (timedOut) {
      // console.log("Timed Out")
      unAnsweredQuestionCounter++;
      gameMessage = "Out of Time !!!";
    } else {
      if (gameObject["question" + currentQuestionNumber].answer === selectedAnswer) {
        // console.log("Correct Choice")
        correctAnswerCounter++;
        gameMessage = "Correct !!!";
      } else {
        // console.log("InCorrect Choice")
        inCorrectAnswerCounter++;
        gameMessage = "Nope !!!";
      }
    }

    $(".container").append(
      $("<div>", {
        id: "outOfTimeMessage",
        text: gameMessage
      })
    );

    $(".container").append(
      $("<div>", {
        class: "questionFont",
        text: correctAnswer
      })
    );

    if (currentQuestionNumber < Object.keys(gameObject).length) {
      waitAndAskNextQuestion();
    } else {
      console.log("Correct Answer : " + correctAnswerCounter);
      console.log("Incorrect Answer : " + inCorrectAnswerCounter);
      console.log("Unanswered Questions" + unAnsweredQuestionCounter);
      gameOver();
    }
  };

  /* This function handles the waiting before the next question is shown on screen using setTimeOut
  It then increments the question number, removes gameMessage and correct answer of previous question.
  Then creates placeholders for next question and choices and finally invokes askQuestion()
  */

  function waitAndAskNextQuestion() {
    setTimeout(function() {
      // console.log("Going to ask Next Q");
      currentQuestionNumber++;
      // console.log(gameObject['question' + currentQuestionNumber])
      $("#outOfTimeMessage").remove();
      $(".questionFont").remove();
      createQuestionHtmlElement();
      askQuestion(gameObject["question" + currentQuestionNumber]);
    }, 2000);
  }

  function gameOver() {
    setTimeout(function() {
      $("#outOfTimeMessage").remove();
      var gameOverMessage = "GAME OVER" + "<br/>" + 
      "Questions answered Correctly:" + correctAnswerCounter     + "<br/>"  +
      "Questions answered incorrectly:" + inCorrectAnswerCounter +  "<br/>" +
      "Questions skipped:" + unAnsweredQuestionCounter

      console.log(gameOverMessage);
      $(".questionFont").html(gameOverMessage);
    }, 3000);
  }
  showStartButton();
});
