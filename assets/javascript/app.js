$(document).ready(function () {

    var timerMessage;
    var remainingSeconds;
    var currentQuestionNumber = 0;
    var countDown;
    var d = new Date();


    var unAnsweredQuestionCounter = 0;
    var inCorrectAnswerCounter = 0;
    var correctAnswerCounter = 0;

    var gameObject = {};

    function readQuestionFile() {
        // console.log("Read Started");
        fetch("/assets/javascript/questions.json")
            .then(function (resp) {
                return resp.json();
            })
            .then(function (data) {
                // console.log("Displaying Response of Fetch : ");
                // console.log(data);
                startGame(data);
            })
        // console.log("Read Completed");
    };

    function waitBeforeNextQuestion() {
        setTimeout(function () {
            // console.log("Going to ask Next Q");
            currentQuestionNumber++;
            // console.log(gameObject['question' + currentQuestionNumber])
            $('#outOfTimeMessage').remove();
            $('.questionFont').remove();
            createQuestionHtmlElement();
            askQuestion(gameObject['question' + currentQuestionNumber]);
        }, 2000);

    }

    function showStartButton() {
        $('.container').append($('<div>', {
            class: 'row justify-content-md-center',
            id: 'startButton'
        }));

        $('#startButton').append($('<div>', {
            class: 'col-xs-3 btn btn-primary btn-lg mt-3',
            text: 'START',
            id: 'startBtn'
        }));

        $('#startBtn').on("click", function () {
            // console.log("Clicked Start Button");
            readQuestionFile();
        });
    }

    function startGame(gameQuestions) {
        // console.log(gameQuestions);
        // console.log(Object.keys(gameQuestions));
        $('#startButton').remove();
        gameObject = gameQuestions;
        createQuestionHtmlElement();
        askQuestion(gameQuestions.question1);
        currentQuestionNumber = 1;
    }

    function createQuestionHtmlElement() {

        $('.container').append($('<div>', {
            id: 'timeMessage',
        }));

        $('.container').append($('<div>', {
            class: 'row justify-content-md-center',
            id: 'questionBlock'
        }));

        $('.container').append($('<div>', {
            class: 'row justify-content-md-center',
            id: 'choiceBlock'
        }));

    }

    function askQuestion(question) {
        // console.log(question.question);


        $('#questionBlock').append($('<div>', {
            id: 'questionText',
            class: 'questionFont'
        }));

        $('#questionText').text(question.question);
        var choiceArray = Object.values(question.choices);
        $('#choiceBlock').append($('<div>', {
            id: 'choiceList'
        }));

        // console.log(choiceArray);
        for (var i = 0; i < choiceArray.length; i++) {
            $('#choiceList')
                .append($('<div>', {
                        class: 'choiceItemBox justify-content-md-center'
                    })
                    .append($('<p>', {
                        class: 'choiceItem justify-content-md-center questionFont',
                        text: choiceArray[i],
                        'cnbr': choiceArray[i]
                    })))

        }
        $('.choiceItem').on("click", function () {
            // console.log($(this).attr("cnbr"))
            processResult(currentQuestionNumber, $(this).attr("cnbr"), false);
        })

        startCountDown();


    }

    function startCountDown() {

        remainingSeconds = 5;
        countDown = setInterval(function () {
            remainingSeconds--;
            timerMessage = "Time Remaining: " + remainingSeconds + " Seconds";

            $('#timeMessage').text(timerMessage);

            if (remainingSeconds <= 0) {
                processResult(currentQuestionNumber, null, true);
            }

        }, 1000)

    }

    function processResult(currentQuestionNumber, selectedAnswer, timedOut) {

        clearInterval(countDown);
        $('#questionBlock').remove();
        $('#choiceBlock').remove();

        var correctAnswer = 'The Correct Answer is : ' + gameObject['question' + currentQuestionNumber].answer
        var gameMessage;

        if (timedOut) {
            // console.log("Timed Out")
            unAnsweredQuestionCounter++;
            gameMessage = "Out of Time !!!";
        } else {


            if (gameObject['question' + currentQuestionNumber].answer === selectedAnswer) {
                // console.log("Correct Choice")
                correctAnswerCounter++;
                gameMessage = "Correct !!!"

            } else {
                // console.log("InCorrect Choice")
                inCorrectAnswerCounter++;
                gameMessage = "Nope !!!"
            }
        }

        $('.container').append($('<div>', {
            id: 'outOfTimeMessage',
            text: gameMessage
        }));


        $('.container').append($('<div>', {
            class: 'questionFont',
            text: correctAnswer
        }));

        if (currentQuestionNumber < Object.keys(gameObject).length) {

            waitBeforeNextQuestion();
        }else{

            console.log("Correct Answer : " + correctAnswerCounter);
            console.log("Incorrect Answer : " + inCorrectAnswerCounter);
            console.log("Unanswered Questions" + unAnsweredQuestionCounter);
        }


    }

    function renderGameStartPage() {
        showStartButton();
    }

    renderGameStartPage();
});