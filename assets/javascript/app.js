$(document).ready(function () {

    var timerMessage;
    var remainingSeconds;

    function readQuestionFile() {
        console.log("Read Started");
        fetch("/assets/javascript/questions.json")
            .then(function (resp) {
                return resp.json();
            })
            .then(function (data) {
                // console.log("Displaying Response of Fetch : ");
                // console.log(data);
                startGame(data);
            })
        console.log("Read Completed");
    };


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
            console.log("Clicked Start Button");
            readQuestionFile();
        });
    }

    function startGame(gameQuestions) {
        console.log(gameQuestions);
        console.log(Object.keys(gameQuestions));
        $('#startButton').remove();
        createQuestionHtmlElement();
        askQuestion(gameQuestions.question1);
        startCountDown();
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
        console.log(question.question);


        $('#questionBlock').append($('<div>', {
            id: 'questionText',
            class: 'questionFont'
        }));

        $('#questionText').text(question.question);
        var choiceArray = Object.values(question.choices);
        $('#choiceBlock').append($('<div>', {
            id: 'choiceList'
        }));

        console.log(choiceArray);
        for (var i = 0; i < choiceArray.length; i++) {
            $('#questionText').append('<p>' + '\n' + '</p>');

            $('#choiceList')
                .append($('<div>', {
                        class: 'choiceItemBox justify-content-md-center'
                    })
                    .append($('<p>', {
                        class: 'choiceItem justify-content-md-center questionFont',
                        text: choiceArray[i],
                        'cnbr': i
                    })))

        }
        $('.choiceItem').on("click", function () {
            console.log($(this).attr("cnbr"))
            // processSelectedChoice(cnbr);
        })

    }

    function startCountDown() {
        remainingSeconds = 30;  
        var countDown = setInterval(function(){
            remainingSeconds --;
            timerMessage = "Time Remaining: " + remainingSeconds + " Seconds";
    
            $('#timeMessage').text(timerMessage);

            if (remainingSeconds <= 0) {
                clearInterval(countDown);
                handlegameTimedOut();
            }
    
        },1000)

    }

    function renderGameStartPage() {
        showStartButton();
    }

    renderGameStartPage();
});