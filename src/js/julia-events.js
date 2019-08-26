/* *****************************************
* JuliaPlayer HTML5 player
* DOM and api events
****************************************** */
JuliaPlayer.prototype._Events = function (origin) {
    var self = this;
    self.init = function () {
        origin.env.instance.on('init.julia play.julia pause.julia stop.julia timeUpdate.julia seek.julia volumeChange.julia durationChange.julia fullscreen.julia fullscreenExit.julia sourceSet.julia modeSet.julia resize.julia', function(event){
            origin.env.lastEventRised = event.type;
            switch (event.type) {
                case 'durationChange':
                    origin.Callback.fn(origin.options.onDurationChange);
                break; case 'fullscreen':
                    origin.Callback.fn(origin.options.onFullscreen);
                break; case 'fullscreenExit':
                    origin.Callback.fn(origin.options.onFullscreenExit);
                break; case 'modeSet':
                    origin.Callback.fn(origin.options.onModeSet); 
                break; case 'pause':
                    origin.Callback.fn(origin.options.onPause);
                break; case 'play':
                    origin.Callback.fn(origin.options.onPlay);
                break; case 'resize':
                    origin.Callback.fn(origin.options.onResize); 
                break; case 'seek':
                    origin.Callback.fn(origin.options.onSeek); 
                break; case 'sourceSet':
                    origin.Callback.fn(origin.options.onSourceSet); 
                break; case 'stop':
                    origin.Callback.fn(origin.options.onStop);
                break; case 'timeUpdate':
                    origin.Callback.fn(origin.options.onTimeUpdate);
                break; case 'volumeChange':
                    origin.Callback.fn(origin.options.onVolumeChange);
                break; default:
                    origin.Callback.fn(origin.options.onInit);
            }
        });
    };
    self.ui = function () {
        // Bottom bar
        origin.env.toolbarBottom.off().on('contextmenu', function (e) {
            e.stopPropagation();
            e.preventDefault();
        }).on('click', '.julia-play.play', function (e) {
            e.preventDefault();
            origin.Controls.press('play');
        }).on('click', '.julia-play.pause', function (e) {
            e.preventDefault();
            origin.Controls.press('pause');
        }).on('click', '.julia-sound.on', function (e) {
            e.preventDefault();
            origin.Controls.press('sound-off');
        }).on('click', '.julia-sound.off', function (e) {
            e.preventDefault();
            origin.Controls.press('sound-on');
        }).on('click', '.julia-fullscreen.on', function (e) {
            e.preventDefault();
            origin.Controls.press('fullscreen-on');
            $(this).blur();
        }).on('click', '.julia-fullscreen.off', function (e) {
            e.preventDefault();
            origin.Controls.press('fullscreen-off');
            $(this).blur();
        }).on('click', '.julia-settings', function (e) {
            e.preventDefault();
            if (origin.env.menus.settings.hasClass('on')) {
                origin.Ui.state(origin.env.menus.settings, 'on', '');
            } else {
                origin.Ui.state(origin.env.menus.settings, '', 'on');
            }
        });
        // Top bar
        origin.env.toolbarTop.off().on('contextmenu', function (e) {
            e.stopPropagation();
            e.preventDefault();
        });
        origin.env.menus.speed.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (!isNaN(Number($(this).val()))) {
                origin.env.api.playbackRate = parseFloat(Number($(this).val()));
            }
        });
        origin.env.menus.video.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            origin.debug({ 'Video bitrate: ': Number($(this).val())});
            if (Number($(this).val()) == '-1') {
                origin.Switcher.setAutoBitrate('video', true);
            } else {
                origin.Switcher.setAutoBitrate('video', false);
                origin.Switcher.setBitrate('video', Number($(this).val()));
            }
        });
        origin.env.menus.audio.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (Number($(this).val()) == '-1') {
                origin.Switcher.setAutoBitrate('audio', true);
            } else {
                origin.Switcher.setAutoBitrate('audio', false);
                origin.Switcher.setBitrate('audio', Number($(this).val()));
            }
        });
        origin.env.menus.audioTracks.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (!isNaN(Number($(this).val()))) {
                origin.env.audioTrackActive = Number($(this).val());
                origin.debug({ 'trackIndex': origin.env.audioTrackActive });
                origin.Switcher.setTrack('audio', origin.env.audioTrackActive);
            }
        });
        origin.env.menus.subtitles.off().on('change', '.julia-dropdown-select', function (e) {
            e.preventDefault();
            if (!isNaN(Number($(this).val()))) {
                t = origin.Switcher.getTracks('text');
                origin.env.textTrackActive = Number($(this).val());
                origin.debug({
                    'trackIndex': origin.env.textTrackActive,
                    'trackObj': t[origin.env.textTrackActive]
                });
                origin.Subtitles.setTrack(origin.env.textTrackActive);
            }
        });
        origin.env.buttons.bigPlay.off().on('click contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
            if (e.type == 'click') {
                origin.Controls.press('play');
            }
        });
        // Area click
        origin.env.shield.off().on('dblclick click contextmenu', function (e) {
            e.preventDefault();
            e.stopPropagation();
            origin.Ui.state(origin.env.menus.settings, 'on', '');
            if (e.type == 'click') {
                if (origin.options.pauseOnClick === true && origin.Support.isMobile() === false) {
                    if (origin.env.api.paused === false) {
                        origin.Controls.press('pause');
                    } else {
                        origin.Controls.press('play');
                    }
                }
            }
            if (e.type == 'dblclick') {
                if (origin.env.instance.hasClass('julia-fullscreen-on')) {
                    origin.Controls.press('fullscreen-off');
                } else {
                    origin.Controls.press('fullscreen-on');
                }
            }
        });
        // Fullscreen toolbar behavior bindings
        var mouseMoveCleaner;
        origin.env.instance
        .off('mousemove touchmove', '.julia-shield')
        .off('mouseover mousemove touchmove mouseout', '.julia-toolbar-top.julia-toolbar-visible, .julia-toolbar-bottom.julia-toolbar-visible, .julia-menu-settings.on')
        .on('mousemove touchmove', '.julia-shield', function (e) {
            e.preventDefault();
            if (origin.env.started === true) {
                origin.Ui.cursor(true);
                origin.env.toolbarBottom.addClass('julia-toolbar-visible');
                if (origin.options.source.title.length>0) {
                    origin.env.toolbarTop.addClass('julia-toolbar-visible');
                }
            }
            clearTimeout(mouseMoveCleaner);
            mouseMoveCleaner = setTimeout(function () {
                if (origin.env.started === true) {
                    origin.Ui.cursor(false);
                    origin.env.toolbarBottom.removeClass('julia-toolbar-visible');
                    if (origin.options.source.title.length>0) {
                        origin.env.toolbarTop.removeClass('julia-toolbar-visible');
                    }
                    origin.Ui.state(origin.env.menus.settings, 'on', '');
                }
            }, 1750);
        }).on('mouseover mousemove touchmove mouseout', '.julia-toolbar-top.julia-toolbar-visible, .julia-toolbar-bottom.julia-toolbar-visible, .julia-menu-settings.on', function (e) {
            //e.preventDefault();
            if (origin.env.started === true) {
                origin.env.toolbarBottom.addClass('julia-toolbar-visible');
                if (origin.options.source.title.length>0) {
                    origin.env.toolbarTop.addClass('julia-toolbar-visible');
                }
            }
            clearTimeout(mouseMoveCleaner);
            if ([
                    'mouseout',
                    'touchend'
                ].lastIndexOf(e.type.toLowerCase()) > -1) {
                mouseMoveCleaner = setTimeout(function (e) {
                    if (origin.env.started === true) {
                        origin.Ui.cursor(false);
                        origin.env.toolbarBottom.removeClass('julia-toolbar-visible');
                        if (origin.options.source.title.length>0) {
                            origin.env.toolbarTop.removeClass('julia-toolbar-visible');
                        }
                        origin.Ui.state(origin.env.menus.settings, 'on', '');
                    }
                }, 1750);
            }
        });
        // Bind progressbar change
        $('#julia-' + origin.env.ID).off('progressSliderChange.julia').on('progressSliderChange.julia', function (e) {
            if (origin.env.started === true) {
                seekTo = origin.Timecode.toSeconds(origin.env.eventBridge.progressSliderChange);
                seekTo = seekTo >= origin.Support.getDuration() ? origin.Support.getDuration(): seekTo;
                origin.Controls.press('goto', { currentTime: seekTo });
            }
        });
        $('#julia-' + origin.env.ID).off('volumeSliderChange.julia').on('volumeSliderChange.julia', function (e) {
            origin.Controls.press('volume', { volume: origin.env.eventBridge.volumeSliderChange });
        });
        // Focus state
        $(window).on('click', function() {
            $('.julia-player').removeClass('julia-focused');
        });

        // Keyboard
        $(document.activeElement).on('keypress keydown', function(e) {

            if (origin.env.started === true && origin.options.source.live === false && origin.env.instance.hasClass('julia-focused')) {

                if ( e.type == 'keydown' ) {

                    switch (e.keyCode) {
                        case 37: // left arrow
                            e.preventDefault();
                            var t = origin.env.api.currentTime - origin.options.skip;
                            origin.Controls.press( 'goto', {
                                currentTime: t >= 0 ? t: 0
                            } );

                        break; case 39: // right arrow
                            e.preventDefault();
                            var t = origin.env.api.currentTime + origin.options.skip;
                            origin.Controls.press( 'goto', {
                                currentTime: t <= origin.env.api.duration ? t: origin.env.api.duration
                            } );

                        break; case 38: // up arrow
                            e.preventDefault();
                            var vol = ( origin.env.api.volume + 0.1 ) * 100;
                            origin.Controls.press( 'volume', {
                                volume: vol <= 100 ? vol : 100
                            } );

                        break; case 40: // down arrow
                            e.preventDefault();
                            var vol = ( origin.env.api.volume - 0.1 ) * 100;
                            origin.Controls.press( 'volume', {
                                volume: vol >= 0 ? vol : 0
                            } );

                        break; default:
                            // do nothing
                    }
                }
            }
        });


        // Fullscreen event included
        $(window).on('resize', function () {
            origin.Support.resize();
        });
    };
    self.native = function () {
        // Video playback detect
        origin.env.api.onplay = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'play', 'pause');
            origin.Ui.icon(origin.env.buttons.play, 'julia-play', 'julia-pause');
            origin.env.buttons.bigPlay.hide();
            origin.env.sliders.progress.buffered();
            //origin.Ui.state( origin.env.preloader, 'on', '' );
            origin.event('play.julia');
            if (origin.env.startupGoto > 0) {
                seekTo = origin.Timecode.toSeconds(origin.env.startupGoto);
                seekTo = seekTo >= origin.Support.getDuration() ? origin.Support.getDuration(): seekTo;
                origin.env.startupGoto = 0;
                origin.Controls.press('goto', { currentTime: seekTo });
            }
        };
        origin.env.api.onplaying = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'play', 'pause');
            origin.Ui.icon(origin.env.buttons.play, 'julia-play', 'julia-pause');
            origin.env.sliders.progress.buffered();
            origin.Ui.state(origin.env.preloader, 'on', '');
            origin.env.started = true;
            origin.env.errorRecoveryAttempts = 0;
            origin.Controls.press('setDuration', { 'duration': origin.Support.getDuration() });
        };
        origin.env.api.onwaiting = function (e) {
            //origin.env.sliders.progress.buffered();
            origin.Ui.state(origin.env.preloader, '', 'on');
        };
        // Video pause
        origin.env.api.onpause = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'pause', 'play');
            origin.Ui.icon(origin.env.buttons.play, 'julia-pause', 'julia-play');
            origin.event('pause.julia');
            setTimeout(function () {
                if (origin.env.api.paused === true || origin.env.api.ended === true) {
                    origin.env.buttons.bigPlay.show();
                }
            }, 400);
        };
        window.onerror = function (e) {
        };
        // Errors
        origin.env.api.onerror = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            });
            origin.Source.recover();
        };
        origin.env.api.onabort = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onemptied = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onstalled = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onsuspend = function (e) {
            origin.debug({
                'Error event': e.type,
                'Attempts': origin.env.errorRecoveryAttempts,
                'Attempt limit': origin.env.errorRecoveryAttemptLimit
            }, true);
            origin.Source.recover();
        };
        origin.env.api.onloadeddata = function (e) {
        };
        origin.env.api.oncanplaythrough = function (e) {
            origin.Support.resize(e.type);
            origin.Controls.press('setDuration', { 'duration': origin.Support.getDuration() });
            if (origin.env.mode != 'hls' && origin.env.mode != 'dash') {
                if ((origin.env.continuePlayback === true || origin.options.autoplay === true) && (origin.env.api.paused === true || origin.env.api.ended === true) && origin.Support.isMobile() === false && origin.env.started === false) {
                    origin.Support.playVideo();
                }
            }
        };
        origin.env.api.onloadedmetadata = function (e) {
            origin.Support.resize(e.type);
        };
        origin.env.api.onloadstart = function (e) {
            origin.Support.resize(e.type);
        };
        // Video position
        origin.env.api.ontimeupdate = function (e) {
            currentTimeReadable = origin.Timecode.toHuman(origin.env.api.currentTime);
            if (origin.env.api.seeking === false) {
                origin.env.sliders.progress.update(origin.Timecode.toPercents(origin.env.api.currentTime));
                origin.Ui.panel(origin.env.panels.currentTime, currentTimeReadable);    //origin.Ui.state( origin.env.preloader, 'on', '' );
            }
            origin.env.sliders.progress.buffered();
            origin.env.errorRecoveryAttempts = 0;
            origin.Callback.onTime('onTime');
            origin.event('timeUpdate.julia');
        };
        // Video position
        origin.env.api.onseeked = function (e) {
            origin.Ui.state(origin.env.preloader, 'on', '');
            origin.event('seek.julia');
        };
        // Video position
        origin.env.api.onseeking = function (e) {
            origin.Ui.state(origin.env.preloader, '', 'on');
        };
        // Volume
        origin.env.api.onvolumechange = function (e) {
            origin.event('volumeChange.julia');
            if (origin.env.api.muted === false) {
                origin.env.sliders.volume.update(origin.env.api.volume * 100);
            } else {
                origin.env.sliders.volume.update(0);
            }
        };
        // Set video duration
        origin.env.api.ondurationchange = function (e) {
            origin.event('durationChange.julia');
            origin.Controls.press('setDuration', { 'duration': origin.Support.getDuration() });
        };
        origin.env.api.onended = function (e) {
            origin.Controls.press('stop');
        };
    };
    // Specific events, error handlers
    self.hlsLibEvents = function () {
        if (origin.env.mode == 'hls') {
            // API READY
            origin.env.hls.on(origin.env.context.Hls.Events.MEDIA_ATTACHED, function (event, data) {
                origin.env.hls.loadSource(origin.options.source.file);
            });
            origin.env.hls.on(origin.env.context.Hls.Events.MANIFEST_PARSED, function (event, data) {
                var bitratesVideo = origin.Switcher.getBitrateList('video');
                var tracksAudio = origin.Switcher.getTracks('audio');
                var menuItems;
                origin.debug({
                    'Stream is initialized and ready': event,
                    'Video bitrate list': bitratesVideo,
                    'Audio track list': tracksAudio,
                    'ABR video bitrate': origin.Switcher.getAutoBitrate('video'),
                    'Video bitrate': origin.Switcher.getBitrate('video')
                });
                // Video bitrates
                origin.debug({ 'HLS video bitrates track list': tracksAudio });
                if (typeof bitratesVideo === 'object' && bitratesVideo && bitratesVideo.length > 1) {
                    origin.Ui.state(origin.env.menus.video, '', 'on');
                    active = origin.Switcher.getAutoBitrate('video') === true ? -1 : origin.Switcher.getBitrate('video');
                    menuItems = origin.Switcher.prepareBitrateMenu(bitratesVideo, [{
                            active: active,
                            value: -1,
                            title: origin.options.i18n.auto
                        }], active);
                    origin.Ui.menu(origin.env.menus.video, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.videoBitrateList));
                    origin.Ui.menuDisabled(origin.env.menus.video, false);
                } else {
                    origin.Ui.state(origin.env.menus.video, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.video, true);
                }
                // Audio tracks
                origin.debug({ 'HLS audio track list': tracksAudio });
                if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 0) {
                    origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                    active = origin.env.audioTrackActive;
                    menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                    origin.Ui.menu(origin.env.menus.audioTracks, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.audioTracksList));
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                } else {
                    origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                }
                if (origin.env.continuePlayback === true && origin.env.started === true) {
                    origin.Support.playVideo();
                }
            });

            origin.env.hls.on(origin.env.context.Hls.Events.LEVEL_LOADED, function (event, data) {
                tracksAudio = origin.Switcher.getTracks('audio');
                origin.debug({ 'HLS audio track list': tracksAudio });
                // Audio tracks
                if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 1) {
                    origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                    active = origin.env.audioTrackActive;
                    menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                    origin.Ui.menu(origin.env.menus.audioTracks, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.audioTracksList));
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                } else {
                    origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                }
            });

            // Txt tracks
            origin.env.hls.on(origin.env.context.Hls.Events.SUBTITLE_TRACKS_UPDATED, function (event, data) {
                var tracksText = origin.Switcher.getTracks('text');
                origin.debug({ 'HLS text track list': tracksText });
                if (typeof tracksText === 'object' && tracksText && tracksText.length > 0) {
                    origin.Ui.state(origin.env.menus.subtitles, '', 'on');
                    active = origin.env.textTrackActive;
                    menuItems = origin.Switcher.prepareTrackMenu(tracksText, [{
                                    active: -1,
                                    value: -1,
                                    title: 'Off'
                                }], active);
                    
                    origin.Ui.menu(origin.env.menus.subtitles, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.textTracksList));
                    origin.Ui.menuDisabled(origin.env.menus.subtitles, false);
                } else {
                    origin.Ui.state(origin.env.menus.subtitles, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.subtitles, true);
                }
            });
            // Error handling
            origin.env.hls.on(origin.env.context.Hls.Events.ERROR, function (event, data) {
                origin.debug({
                    'Recovering Hls Error': data.details,
                    'ErrorType': data.type,
                    'ErrorFatal': data.fatal,
                    'Attempts': origin.env.errorRecoveryAttempts + ' of ' + origin.env.errorRecoveryAttemptLimit,
                }, true);
                if (origin.env.errorRecoveryAttempts <= origin.env.errorRecoveryAttemptLimit) {

                    if (data.fatal === true) {
                        // Bring to life again
                        switch (data.type) {
                        case origin.env.context.Hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            origin.env.hls.startLoad();
                            origin.Controls.press('stop');
                            origin.Ui.cursor(true);
                            break;
                        case origin.env.context.Hls.ErrorTypes.MEDIA_ERROR:
                            if (origin.env.errorRecoveryAttempts == origin.env.errorRecoveryAttemptLimit) {
                                origin.env.hls.swapAudioCodec();
                            }
                            // try to recover media error
                            origin.env.hls.recoverMediaError();
                            break;
                        default:
                            // try to recover other errors
                            origin.env.hls.startLoad();
                        }
                        origin.env.errorRecoveryAttempts++;
                    }
                    origin.env.errorRecoveryAttempts++;
                } else {
                    origin.Source.recover();
                }
            });
        }
        ;
    };
    // Specific events, error handlers
    self.dashLibEvents = function () {
        if (origin.env.mode == 'dash') {
            Object.keys(origin.env.context.dashjs.MediaPlayer.events).map(function (eventName, index) {
                origin.env.dash.on(origin.env.context.dashjs.MediaPlayer.events[eventName], function (event) {
                    switch (event.type) {
                    case origin.env.context.dashjs.MediaPlayer.events.ERROR:
                        origin.debug({
                            'Recovering Dash Error': eventName,
                            'ErrorType': event.type,
                            'Error': event.error,
                        }, true);
                        if (event.error === 'download') {
                            origin.Source.recover(true);
                        } else {
                            origin.Source.recover();
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.PLAYBACK_ERROR:
                    case origin.env.context.dashjs.MediaPlayer.events.BUFFER_EMPTY:
                    //case origin.env.context.dashjs.MediaPlayer.events.FRAGMENT_LOADING_ABANDONED:
                        origin.debug({
                            'Recovering Dash Buffer Error': eventName,
                            'ErrorType': event.type,
                        }, true);
                        origin.Source.recover();
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.MANIFEST_LOADED:
                        origin.debug({ 'Dash Manifest loaded': event });
                        origin.env.dashInitialized = true;
                        if (origin.env.continuePlayback === true && origin.env.started === true) {
                            origin.Support.playVideo();
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.STREAM_INITIALIZED:
                        bitratesVideo = origin.Switcher.getBitrateList('video');
                        bitratesAudio = origin.Switcher.getBitrateList('audio');
                        tracksAudio = origin.Switcher.getTracks('audio');
                        tracksText = origin.Switcher.getTracks('text');
                        origin.debug({
                            'Stream is initialized and ready': event,
                            'Video bitrate list': origin.Switcher.getBitrateList('video'),
                            'Audio bitrate list': origin.Switcher.getBitrateList('audio'),
                            'Audio track list': origin.Switcher.getTracks('audio'),
                            'Text track list': origin.Switcher.getBitrate('audio'),
                            'ABR video bitrate': origin.Switcher.getAutoBitrate('video'),
                            'ABR audio bitrate': origin.Switcher.getAutoBitrate('audio'),
                            'Video bitrate': origin.Switcher.getBitrate('video'),
                            'Audio bitrate': origin.Switcher.getBitrate('audio'),
                        });
                        // Optional buffer tunnning
                        if (Object.keys(origin.options.dashConfig).indexOf('streaming') > -1 && Object.keys(origin.options.dashConfig.streaming).length > 0) {
                            origin.env.dash.updateSettings({
                                    'streaming': origin.options.dashConfig.streaming,
                                }
                            );
                        }

                        // Video bitrates
                        origin.env.dash.updateSettings({
                                'streaming': {
                                    'fastSwitchEnabled': true
                                },
                            }
                        );
                        if (typeof bitratesVideo === 'object' && bitratesVideo && bitratesVideo.length > 1) {
                            origin.Ui.state(origin.env.menus.video, '', 'on');
                            active = origin.Switcher.getAutoBitrate('video') === true ? -1 : origin.Switcher.getBitrate('video');
                            menuItems = origin.Switcher.prepareBitrateMenu(bitratesVideo, [{
                                    active: active,
                                    value: -1,
                                    title: origin.options.i18n.auto
                                }], active);
                            origin.Ui.menu(origin.env.menus.video, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.videoBitrateList));
                            origin.Ui.menuDisabled(origin.env.menus.video, false);
                        } else {
                            origin.Ui.state(origin.env.menus.video, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.video, true);
                        }
                        // Audio bitrates
                        if (typeof bitratesAudio === 'object' && bitratesAudio && bitratesAudio.length > 1) {
                            origin.Ui.state(origin.env.menus.audio, '', 'on');
                            active = origin.Switcher.getAutoBitrate('audio') === true ? -1 : origin.Switcher.getBitrate('audio');
                            menuItems = origin.Switcher.prepareBitrateMenu(bitratesAudio, [], active);
                            origin.Ui.menu(origin.env.menus.audio, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.audioBitrateList));
                            origin.Ui.menuDisabled(origin.env.menus.audio, false);
                        } else {
                            origin.Ui.state(origin.env.menus.audio, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.audio, true);
                        }
                        // Audio tracks
                        if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 1) {
                            origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                            active = origin.env.audioTrackActive;
                            menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                            origin.Ui.menu(origin.env.menus.audioTracks, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.audioTracksList));
                            origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                        } else {
                            origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                        }
                        if (typeof tracksText === 'object' && tracksText && tracksText.length > 0) {
                            origin.Ui.state(origin.env.menus.subtitles, '', 'on');
                            active = origin.env.textTrackActive;
                            menuItems = origin.Switcher.prepareTrackMenu(tracksText, [{
                                            active: -1,
                                            value: -1,
                                            title: 'Off'
                                        }], active);
                            origin.Ui.menu(origin.env.menus.subtitles, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.textTracksList));
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, false);
                        } else {
                            origin.Ui.state(origin.env.menus.subtitles, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, true);
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.TEXT_TRACK_ADDED:
                    case origin.env.context.dashjs.MediaPlayer.events.TEXT_TRACKS_ADDED:
                        // Subtitle tracks
                        tracksText = origin.Switcher.getTracks('text');
                        origin.debug({ 'DASH text track list': tracksText });
                        if (typeof tracksText === 'object' && tracksText && tracksText.length > 0) {
                            origin.Ui.state(origin.env.menus.subtitles, '', 'on');
                            active = origin.env.textTrackActive;
                            menuItems = origin.Switcher.prepareTrackMenu(tracksText, [{
                                            active: -1,
                                            value: -1,
                                            title: 'Off'
                                        }], active);
                            origin.Ui.menu(origin.env.menus.subtitles, origin.Switcher.translateItems(menuItems, 'title', origin.options.i18n.textTracksList));
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, false);
                        } else {
                            origin.Ui.state(origin.env.menus.subtitles, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, true);
                        }
                        break;
                    default:
                        /*
                        origin.debug({
                            'Dash Event': eventName,
                            'EventType': event.type,
                            'Data': event,
                            'Attempts': origin.env.errorRecoveryAttempts,
                            'Attempt limit': origin.env.errorRecoveryAttemptLimit
                        });
                        */
                    }
                });
            });
        }
    };
};
