var audio, context, analyser, frequencyData;
$(document).ready(function() {

    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    } catch(e) { console.log(e); }

    $('#mobile_nav').change(function() {
        window.location = $(this).find('option:selected').val();
    });

    $('#listen').click(function() {
        if (!audio) {
            audio = new Audio('http://ksdt.ucsd.edu:8000/stream');
            audio.crossOrigin = 'anonymous';
            if (context && navigator.userAgent.indexOf('Firefox') == -1) {
                audio.addEventListener('canplay', function(e) {
                    var source = context.createMediaElementSource(audio);
                    analyser = context.createAnalyser();
                    source.connect(analyser);
                    analyser.connect(context.destination);
                    analyser.fftSize = 64;
                    frequencyData = new Uint8Array(analyser.frequencyBinCount);
                    e.target.removeEventListener(e.type, arguments.callee);
                });
            }
        }
        if (audio.paused) {
            audio.play();
        } else {
            audio.pause();
        }
    });

    setInterval ( function() {
        if (audio) {
            if (audio.paused) {
                if ($('#listen').text() != 'paused')
                    $('#listen').text('paused');
            } else if (audio.readyState === 0 && audio.networkState === 2) {
                if ($('#listen').text() != 'loading...')
                    $('#listen').text('loading...');
            } else if (audio.readyState == 4 && audio.networkState == 2) {
                if ($('#listen').text() != 'playing')
                    $('#listen').text('playing');
            }
        }

    }, 100);

/*    setInterval(function() {
        var query = [], i, attr, script,
            fn = '_spinitron' + (Math.random().toString() + new Date().getTime()).slice(2, -1);
        window[fn] = function (html) {
            var obj = $.parseHTML(html);
            console.log(obj);
        };
        query.push('station=kzsc');
        query.push('num=1');
        query.push('time=0');
        query.push('nolinks=1');
        query.push('callback=' + fn);
        script = document.createElement('script');
        script.src = '//spinitron.com/radio/newestsong.php?' + query.join('&');
        document.getElementsByTagName('head')[0].appendChild(script);
    }, 10000);*/

    function update() {
        requestAnimationFrame(update);
        //do lmao stuff here
        if (analyser) {
            analyser.getByteFrequencyData(frequencyData);

            var sum = 0;
            for (var i = 0; i < frequencyData.length; i++) {
                sum += frequencyData[i];
            }

            var avg = sum / frequencyData.length;

            $('#sun').css('transform', 'scale('+(1+(avg/100))+')');

        }
    }
    update();

});
