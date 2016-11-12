var storyFadeLength = 5000;

var taskLengths = {'remember':10, 'feel':20, 'forget':15, 'love':13, 'escape':25, 'awaken':40}

var messageHistory = []

var memoryCount = 0

var forgotten = false;
var loved = false;
var escaped = false;
var lovedtwice = false;

function addNextTask(task){
    $('#tasks').append("<div class='task fadeIn' id='"+task+"'>Try to <br>"+task+"</div>")    
    
    $('#remember').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            if (memoryCount == 0){
                if (getCookie('rfnm')){
                    nextStoryline(['You remember... something.', "You've been here before."])
                    memoryCount++;
                } else{
                    nextStoryline(['You remember... nothing.', "Nothing before this anyway."])
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
            } else if (escaped & lovedtwice){
                nextStoryline(["You remember how to awaken"])
                addNextTask("awaken")
                lovedtwice = false
            } else if (loved & memoryCount >= 4){
                nextStoryline(["...was love an emotion?  Or was it something more?"])
                lovedtwice=true
            } else if (memoryCount < 8){
                nextStoryline(['You feel your memory improve.'])
            } else {
                nextStoryline(["You remember nothing more..."])
            }
            memoryCount++;
            $('#memory').css('height', 50+30*memoryCount)
        }
    });

    $('#love').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            if (! loved){
                $('.task').addClass('disabled')
                $('#tasks').css('opacity', 0);
                nextStoryline(['You feel...'], function(){
                    setCookie('rfnm', 2, 1000);
                    nextStoryline(['pain.']);
                    setTimeout(function(){
                        $('body').addClass('shake');
                        $('#crumble')[0].play();
                        setTimeout(function(){
                            $('body').removeClass('shake');
                            nextStoryline(['Wait.', "You've been here before too.", "What does this mean?", "What does any of this mean?"], function(){
                                $('.task').removeClass('disabled');
                                $('#tasks').css('opacity', 1);
                                addNextTask('feel');
                                addNextTask('escape');
                            })
                        }, 1700);
                    },2000);
                })
                loved = true
            } else {
                nextStoryline(['But what even is love?']);
            }
        }
    })

    $('#escape').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            $('.task').addClass('disabled')
            $('#tasks').css('opacity', 0);
            nextStoryline(['Escape?', 'Escape from where?', 'Escape from what?', "You'll never escape from yourself."], function(){
                $('.task').removeClass('disabled');
                $('#tasks').css('opacity', 1);
                escaped = true;
            });
        }
    })
    
    $('#feel').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            if (! loved){
                $('#tasks').addClass('disabled')
                $('#tasks').css('opacity', 0);
                nextStoryline(['You feel...'], function(){

                    if (getCookie('rfnm')){
                        setCookie('rfnm', 2, 1000);
                    } else{
                        setCookie('rfnm', 1, 1000);
                    }
                    nextStoryline(['pain.']);
                    setTimeout(function(){
                        $('body').addClass('shake');
                        $('#crumble')[0].play();
                        setTimeout(function(){
                            $('body').empty();
                            setTimeout(function(){location.reload();},500)
                        }, 1000);
                    },2000);
                })
            } else {
                nextStoryline(["You feel...", "nothing."])
            }
        }
    })
    
    $('#awaken').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            $('.task').addClass('disabled')
            $('#tasks').css('opacity', 0);
            nextStoryline(['You awake to find yourself in your bed.', 'You remember... a dream.', "You remember...", "it felt...", "deep.", "Or maybe just stupid and pretentious, you're not sure.", "Either way, it'll make a great story for your instagram.", '"What is love but pain? #deep "', '"We can escape from anything, but we can never escape from ourselves. #deep "', '"Is love an emotion, or is it something more? #deep "'], function(){
                nextStoryline(['"#deep "'])
                setTimeout(function(){
                    $('.story').css("opacity", 1)
                    $('.story').css("transform", "scale(1.0)")
                    $('.story').css("text-shadow", "0px 0px 8px #fff");
                    $('.story').css("animation", "none");
                    setCookie('rfnm', 0, -1);
                    setTimeout(function(){
                        $('#memory').css('opacity',0)
                    }, 3000)
                    setTimeout(function(){
                        $('#stories').css('transition','opacity 2s')
                        $('#stories').css('opacity',0)
                    }, 8000)
                    setTimeout(function(){
                        $('#stories').remove()
                        $('#memory').remove()
                        $('#tasks').remove()
                        $('#credits').show()
                        $('#credits').css('opacity',1)
                    }, 12000)
                }, 2000)
            });
        }
    })

    $('#forget').click(function(){
        if ( ! $(this).hasClass('disabled') ){
            messageHistory = []
            nextStoryline(['You remembered too much.', 'You remembered the pain.', "You don't any more."], function(){
                $('#feel').remove()
                $('#forget').remove()
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
    $('#crumble')[0].volume = 0.5
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