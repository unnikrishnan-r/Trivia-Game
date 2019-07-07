

fetch("https://github.com/unnikrishnan-r/Trivia-Game/blob/master/assets/javascript/questions.json")
.then(function(resp){
    return resp.json();
})
.then(function(data){
    console.log(data);
});
