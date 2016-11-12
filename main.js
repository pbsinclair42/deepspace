storyFadeLength = 5000;

function nextStoryline(lines){
    s = $(".story");
    s.html(lines.shift());
    s.css('animation-name', 'none')
    setTimeout(function(){s.css('animation-name', 'storyAnimation')},10)
    if (lines.length > 0){
        setTimeout(function(){nextStoryline(lines)}, storyFadeLength)
    }
}

$(document).ready(function(){
    nextStoryline(['You wake up.', 'You are in darkness.'])
})

