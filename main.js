var storyFadeLength = 5000;

var taskLengths = {'remember':10, 'feel':20, 'forget':15}

var messageHistory = []

var memoryCount = 0

var allTasksToAdd = [
    ['remember',"<div class='task fadeIn' id='remember'>Try to <br>remember</div>"],
    ['feel',"<div class='task fadeIn' id='feel'>Try to <br>feel</div>"],
    ['forget',"<div class='task fadeIn' id='forget'>Try to <br>forget</div>"]
    
]

var forgotten = false;

function addNextTask(task){
    $('#tasks').append("<div class='task fadeIn' id='"+task+"'>Try to <br>"+task+"</div>")    
    
    $('#remember').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            if (memoryCount == 0){
                if (getCookie('rfnm')){
                    nextStoryline(['You remember... something.', "You've been here before."])
                } else{
                    nextStoryline(['You remember... something.'])
                }
                $('#memory').css('opacity', '1')
            } else if (memoryCount == 2){
                nextStoryline(["You remember how to feel."])
                addNextTask('feel');
                if (getCookie('rfnm')){
                    addNextTask('forget');
                }
            } else if (forgotten){
                nextStoryline(['You remember how to love.'])
                forgotten=false
                addNextTask('love')
            } else if (memoryCount < 10){
                nextStoryline(['You feel your memory improve.'])
            } else {
                nextStoryline(["You remember nothing more..."])
            }
            memoryCount++;
            $('#memory').css('height', 50+15*memoryCount)
        }
    });

    $('#love').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            $('#task').addClass('disabled')
            $('#tasks').css('opacity', 0);
            nextStoryline(['You feel...'], function(){
                setCookie('rfnm', 2, 1000);
                nextStoryline(['pain.']);
                setTimeout(function(){$('body').addClass('shake');
                setTimeout(function(){
                    $('body').removeClass('shake');
                    nextStoryline(['Wait.', "You've been here before too.", "What does this mean?", "What does any of this mean?"], function(){
                        $('#task').removeClass('disabled');
                        $('#tasks').css('opacity', 1);
                    })
                }, 2000);},2000);
            })
        }
    })
    
    $('#feel').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            $('#tasks').addClass('disabled')
            $('#tasks').css('opacity', 0);
            nextStoryline(['You feel...'], function(){
                
                if (getCookie('rfnm')){
                    setCookie('rfnm', 2, 1000);
                } else{
                    setCookie('rfnm', 1, 1000);
                }
                nextStoryline(['pain.']);
                setTimeout(function(){$('body').addClass('shake');
                setTimeout(function(){location.reload();}, 1500);},2000);
            })
        }
    })

    $('#forget').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            messageHistory = []
            nextStoryline(['You remembered too much.', 'You remembered the pain.', "You don't any more."], function(){
                $('#feel').hide()
                $('#forget').hide()
                $('#tasks').css('opacity', 1);
            })
            $('#tasks').css('opacity', 0);
            forgotten = true;
        }
    })
    
    $('.task').click(function(){
        var task = $(this)
        task.removeClass('fadeIn')
        if ( ! task.hasClass('disabled') ){
            task.addClass('waiting');
            task.addClass('disabled');
            task.css('animation-duration',taskLengths[task.attr('id')]+'s')
            setTimeout(function(){
                task.removeClass('waiting');
                task.removeClass('disabled');
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
    setTimeout(function(){s.css('animation-name', 'storyAnimation')},50)
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
        addNextTask('remember')
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