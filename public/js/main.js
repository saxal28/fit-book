//article animation slide code

$(".article-overlay").hide();


$(".weightlifting").hover(function() {
    $(this).children().fadeIn();
}, function() {
    $(this).children().fadeOut();
});

$(".cardio").hover(function() {
    $(this).children().fadeIn(200);
}, function() {
    $(this).children().fadeOut(200);
});

$(".nutrition").hover(function() {
    $(this).children().fadeIn();
}, function() {
    $(this).children().fadeOut();
});

$(".all-articles").hover(function() {
    $(this).children().fadeIn();
}, function() {
    $(this).children().fadeOut();
});