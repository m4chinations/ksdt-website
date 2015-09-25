var audio, context, analyser, frequencyData;
$(document).ready(function() {

    try {
        window.AudioContext = window.AudioContext||window.webkitAudioContext;
        context = new AudioContext();
    } catch(e) { console.log(e); }

    $('#listen').click(function() {
        if (!audio) {
            audio = new Audio('http://ksdt.ucsd.edu:8000/stream');
            audio.crossOrigin = 'anonymous';
            if (context) {
                var source = context.createMediaElementSource(audio);
                analyser = context.createAnalyser();
                source.connect(analyser);
                analyser.connect(context.destination);
                analyser.fftSize = 64;
                frequencyData = new Uint8Array(analyser.frequencyBinCount);
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
