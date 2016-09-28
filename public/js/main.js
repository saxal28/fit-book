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

//favorite icon for recipe book
// $(".bulletin").on("click",function(){
//     $(this).css("color", "red")
//     $(this).css("font-size", "30px")
// })

// $("#like").on("click",function(){
//     var one = $(this).parent().next().children("p.upvotes").text();
//     console.log($(this).parent().next())
//     var two = parseInt(one) + 1
//     $(this).parent().next().children("p.upvotes").text(two);
    
// });

// $("#dislike").on("click",function(){
//     var one  = $(this).parent().prev().children("p.upvotes").text();
//     var two = parseInt(one) - 1;
//     $(this).parent().prev().children("p.upvotes").text(two);
    
// });

