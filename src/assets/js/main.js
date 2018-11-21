/**
 * Created by sanchez 
 */
'use strict';

//check the environment
// if (process.env.NODE_ENV !== 'production') {
//     console.log('Looks like we are in development mode!');
// }

// import CSS
// import animate_css from 'animate.css/animate.min.css';
import css from '../css/css.css';
import scss from '../css/sass.scss';


// import Js Plugins/Entities

//ES6 Module
import 'pixi.js';
// import Howler from 'howler';



window.h5 = {
    initAudioCanvas: function() {
        try {
            var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        } catch (e) {
            alert('Your browser does not support AudioContext!');
            console.log(e);
        }

        var audio = document.getElementById('audio');

        var source = audioCtx.createMediaElementSource(audio);
        var analyser = audioCtx.createAnalyser();
        analyser.connect(audioCtx.destination);
        source.connect(analyser);

        //确定频域的FFT的大小
        analyser.fftSize = 2048;
        //fftSize一半，用于可视化的数据量的数量
        var bufferLength = analyser.frequencyBinCount;
        //创建无符号字节数组
        var dataArray = new Uint8Array(bufferLength);

        //当前频域数据
        // analyser.getByteFrequencyData()

        //将当前波形，或者时域数据拷贝
        // analyser.getByteTimeDomainData(dataArray);
        
        //Create a Pixi Application
        var app = new PIXI.Application({ width: 800, height: 600 });
        //Add the canvas that Pixi automatically created for you to the HTML document
        document.getElementById('canvas-wrapper').appendChild(app.view);
        var w = 800;
        var h = 600;
        var graphics = new PIXI.Graphics();

        graphics.clear();

        app.stage.addChild(graphics);

        function draw() {
            //get waveform data and put it into the array created above
            analyser.getByteTimeDomainData(dataArray);
            graphics.clear();
            var sliceWidth = w * 1.0 / bufferLength;
            var x = 0;
            graphics.beginFill(0xFFFFFF);
            // console.log(dataArray)
            for (var i = 0; i < bufferLength; i++) {
                // console.log(dataArray[i])
                var v = dataArray[i] / 128.0;
                var y = v * h / 2;

                if (i === 0) {
                    // graphics.clear();
                    graphics.moveTo(x, y);
                } else {
                    graphics.lineTo(x, y);
                }
                x += sliceWidth;
            }
            graphics.lineTo(w, h / 2);
            graphics.endFill();
        }

        var ticker = new PIXI.ticker.Ticker();
        ticker.stop();
        ticker.add((deltaTime) => {
            draw()
        });
        // audio.play();
        audio.addEventListener('play', function() {
            console.log('play');
            ticker.start();
        })


    },
    isPc: function() {
        var userAgentInfo = navigator.userAgent;
        var Agents = new Array('Android', 'iPhone', 'SymbianOS', 'Windows Phone', 'iPad', 'iPod');
        var flag = true;
        for (var v = 0; v < Agents.length; v++) {
            if (userAgentInfo.indexOf(Agents[v]) > 0) { flag = false; break; }
        }
        return flag;
    },
    rootResize: function() {
        var wFsize;

        //iphone6/6s/7/8 orientation=portrait screen.width=750px screen.height=1334px / WeChat window.innerWidth=750px window.innerHeight=1206px 
        var wWidth = (window.screen.width > 0) ? (window.innerWidth >= window.screen.width || window.innerWidth == 0) ? screen.width :
            window.innerWidth : window.innerWidth;
        var wHeight = (window.screen.height > 0) ? (window.innerHeight >= window.screen.height || window.innerHeight == 0) ?
            window.screen.height : window.innerHeight : window.innerHeight;
        // var wWidth = window.innerWidth;
        // var wHeight = window.innerHeight;

        if (wWidth > wHeight) {
            wFsize = wHeight / 750 * 100;
        } else {
            wFsize = wWidth / 750 * 100;
        }
        document.getElementsByTagName('html')[0].style.fontSize = wFsize + 'px';
    },
    eventInit: function() {
        var that = this;
        document.addEventListener('touchstart', function(e) {}, { passive: false });
        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
        }, { passive: false });
        return that;
    },
    cssInit: function() {
        var that = this;
        var noChangeCountToEnd = 100,
            noEndTimeout = 1000;
        that.rootResize();
        window.addEventListener('onorientationchange' in window ? 'orientationchange' : 'resize', function() {
            var interval,
                timeout,
                end,
                lastInnerWidth,
                lastInnerHeight,
                noChangeCount;
            end = function() {
                // "orientationchangeend"
                clearInterval(interval);
                clearTimeout(timeout);
                interval = null;
                timeout = null;
                that.rootResize();
            };
            interval = setInterval(function() {
                if (window.innerWidth === lastInnerWidth && window.innerHeight === lastInnerHeight) {
                    noChangeCount++;
                    if (noChangeCount === noChangeCountToEnd) {
                        // The interval resolved the issue first.
                        end();
                    }
                } else {
                    lastInnerWidth = window.innerWidth;
                    lastInnerHeight = window.innerHeight;
                    noChangeCount = 0;
                }
            });
            timeout = setTimeout(function() {
                // The timeout happened first.
                end();
            }, noEndTimeout);
        });

        return that;
    },
    init: function() {
        var that = this;
        that.cssInit().eventInit();
        that.initAudioCanvas();
    }
};
window.onload = function() {
    window.h5.init();
};

//Stats JavaScript Performance Monitor

//import Stats from 'stats.js';
//showStats();
// function showStats() {
//     var stats = new Stats();
//     stats.showPanel(0); // 0: fps, 1: ms, 2: mb, 3+: custom
//     var fs = document.createElement('div');
//     fs.style.position = 'absolute';
//     fs.style.left = 0;
//     fs.style.top = 0;
//     fs.style.zIndex = 999;
//     fs.appendChild(stats.domElement);
//     document.body.appendChild(fs);

//     function animate() {
//         stats.begin();
//         // monitored code goes here
//         stats.end();
//         requestAnimationFrame(animate);
//     }
//     requestAnimationFrame(animate);
// }