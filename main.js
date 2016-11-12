var storyFadeLength = 5000;

var taskLengths = {'remember':10, 'feel':20}

var messageHistory = []

var memoryCount = 0

var allTasksToAdd = [
    ['remember',"<div class='task fadeIn' id='remember'>Try to <br>remember</div>"],
    ['feel',"<div class='task fadeIn' id='feel'>Try to <br>feel</div>"]
]

function addNextTask(){
    var task = allTasksToAdd.shift()
    $('#tasks').append(task[1])    
    
    $('#remember').click(function(){
        if ( ! $(this).hasClass('waiting') ){
            if (memoryCount == 0){
                nextStoryline(['You remember... something.'])
                $('#memory').css('opacity', '1')
            } else if (memoryCount == 3){
                nextStoryline(["You remember how to feel."])
                addNextTask();
            } else if (memoryCount < 20){
                nextStoryline(['You feel your memory improve.'])
                $('#memory').css('height', 50+10*memoryCount)
            }
            memoryCount++;
        }
    })
    
    $('#feel').click(function(){
        if ( ! $(this).hasClass('waiting') ){
            $('#tasks').css('opacity', 0);
            nextStoryline(['You feel...'], function(){
                setCookie('rfnm', 1, 1000);
                nextStoryline(['pain']);
                setTimeout(function(){$('body').addClass('shake');
                setTimeout(function(){location.reload();}, 2000);},2000);
            })
        }
    })

    $('.task').click(function(){
        var task = $(this)
        task.removeClass('fadeIn')
        if ( ! task.hasClass('waiting') ){
            task.addClass('waiting');
            task.css('animation-duration',taskLengths[task.attr('id')]+'s')
            setTimeout(function(){
                task.removeClass('waiting');
            }, taskLengths[task.attr('id')]*1000)
        }
    })
}

function nextStoryline(lines, callback){
    var s = $(".story");
    var nextLine = lines.shift()
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






function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length,c.length);
        }
    }
    return "";
}