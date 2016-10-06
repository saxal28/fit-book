// animate with scroll

$(".btn").hover(
    function() {
    $(this).addClass("animated infinite tada")
}, function() {
    $(this).removeClass("animated infinite tada")
});

$(document).ready(function() {
    $('#footer, #section1, #section2, #section4, .bulletin-navbar, .thumbnail, .ui.raised.segment, .item').addClass("hideme").viewportChecker({
        classToAdd: 'visible animated fadeInUp',
        offset: 100
       });
       
    $("#section3, .jumbotron").addClass("hideme").viewportChecker({
        classToAdd: 'visible animated slideInLeft',
        offset: 100
       });
    $("#section5").addClass("hideme").viewportChecker({
        classToAdd: 'visible animated slideInRight',
        offset: 100
       });
});

$("#saved-posts").hide();


$("#saved-posts-button").on("click", function() {
    $("#saved-posts").show().addClass("animated fadeInUp")
});
