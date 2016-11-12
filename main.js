storyFadeLength = 5000;

taskLengths = {'remember':10}

messageHistory = []

function nextStoryline(lines){
    s = $(".story");
    nextLine = lines.shift()
    s.html(nextLine);
    
    messageHistory.unshift(nextLine);
    updateMemory()    
    
    s.css('animation-name', 'none')
    setTimeout(function(){s.css('animation-name', 'storyAnimation')},10)
    if (lines.length > 0){
        setTimeout(function(){
            nextStoryline(lines);
        }, storyFadeLength)
    } else {
        setTimeout(function(){
        }, storyFadeLength)
    }
}

function updateMemory(){
    $('#memory .messages').html(messageHistory.join('<br>'))
}

$(document).ready(function(){

    $('.task').click(function(){
        task = $(this)
        task.addClass('waiting');
        task.css('animation-duration',taskLengths[task.attr('id')]+'s')
        task.prop('disabled', true);
        setTimeout(function(){
            task.removeClass('waiting');
            task.prop('disabled', false);
        }, taskLengths['remember']*1000)
    })
    
    nextStoryline(['You wake up.', 'You are in darkness.'])
})

