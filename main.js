storyFadeLength = 5000;

taskLengths = {'remember':10}

messageHistory = []

memoryCount = 0

allTasksToAdd = [
    "<div class='task' id='remember'>Try to <br>remember</div>"
]

function addNextTask(){
    task = allTasksToAdd.shift()
    $('#tasks').append(task)
    
    
    $('#remember').click(function(){
        if ( ! $(this).hasClass('waiting') ){
            if (memoryCount == 0){
                nextStoryline(['You remember... something.'])
                $('#memory').css('opacity', '1')
            } else if (memoryCount < 20){
                nextStoryline(['You feel your memory improve.'])
            }
            memoryCount++;
        }
    })
    
    $('.task').click(function(){
        task = $(this)
        if ( ! task.hasClass('waiting') ){
            task.addClass('waiting');
            task.css('animation-duration',taskLengths[task.attr('id')]+'s')
            setTimeout(function(){
                task.removeClass('waiting');
            }, taskLengths['remember']*1000)
        }
    })
}

function nextStoryline(lines, callback){
    s = $(".story");
    nextLine = lines.shift()
    s.html(nextLine);
    
    messageHistory.unshift(nextLine);
    updateMemory()    
    
    s.css('animation-name', 'none')
    setTimeout(function(){s.css('animation-name', 'storyAnimation')},10)
    if (lines.length > 0){
        setTimeout(function(){
            nextStoryline(lines, callback);
        }, storyFadeLength)
    } else {
        setTimeout(function(){
            if (callback){
                callback()
            }
        }, storyFadeLength)
    }
}

function updateMemory(){
    $('#memory .messages').html(messageHistory.join('<br>'))
}

$(document).ready(function(){
    nextStoryline(['You wake up.', 'You are in darkness.'], function(){
        addNextTask()
    })
})

