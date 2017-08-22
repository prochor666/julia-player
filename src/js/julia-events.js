/* *****************************************
* JuliaPlayer HTML5 player
* DOM and api events
****************************************** */
JuliaPlayer.prototype._Events = function (origin) {
    var self = this;
    self.init = function () {
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
        }).on('click', '.julia-fullscreen.off', function (e) {
            e.preventDefault();
            origin.Controls.press('fullscreen-off');
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
            origin.debug({ 'Video bitrate: ': Number($(this).val()) });
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
        origin.env.instance.off('mousemove touchmove', '.julia-shield, .julia-suggest').off('mouseover mousemove touchmove mouseout', '.julia-toolbar-top.julia-toolbar-visible, .julia-toolbar-bottom.julia-toolbar-visible, .julia-menu-settings.on').on('mousemove touchmove', '.julia-shield, .julia-suggest', function (e) {
            e.preventDefault();
            if (origin.env.started === true) {
                origin.env.toolbarBottom.addClass('julia-toolbar-visible');
                if (origin.options.source.title.length>0) {
                    origin.env.toolbarTop.addClass('julia-toolbar-visible');
                }
            }
            clearTimeout(mouseMoveCleaner);
            mouseMoveCleaner = setTimeout(function () {
                if (origin.env.started === true) {
                    origin.env.toolbarBottom.removeClass('julia-toolbar-visible');
                    if (origin.options.source.title.length>0) {
                        origin.env.toolbarTop.removeClass('julia-toolbar-visible');
                    }
                    origin.Ui.state(origin.env.menus.settings, 'on', '');
                }
            }, 1750);
        }).on('mouseover mousemove touchmove mouseout', '.julia-toolbar-top.julia-toolbar-visible, .julia-toolbar-bottom.julia-toolbar-visible, .julia-menu-settings.on', function (e) {
            e.preventDefault();
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
        $('body').off('julia.progress-change', '#julia-' + origin.env.ID).on('julia.progress-change', '#julia-' + origin.env.ID, function (e, data) {
            if (origin.env.started === true) {
                seekTo = origin.Timecode.toSeconds(data.percent);
                seekTo = seekTo >= origin.env.api.duration ? origin.env.api.duration : seekTo;
                origin.Controls.press('goto', { currentTime: seekTo });
            }
        });
        $('body').off('julia.volume-change', '#julia-' + origin.env.ID).on('julia.volume-change', '#julia-' + origin.env.ID, function (e, data) {
            origin.Controls.press('volume', { volume: data.percent });
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
            origin.Ui.state(origin.env.suggest, 'on', '');
            clearTimeout(origin.env.suggestTimer);
            if (origin.env.startupGoto > 0) {
                seekTo = origin.Timecode.toSeconds(origin.env.startupGoto);
                seekTo = seekTo >= origin.env.api.duration ? origin.env.api.duration : seekTo;
                origin.env.startupGoto = 0;
                origin.Controls.press('goto', { currentTime: seekTo });
            }
        };
        origin.env.api.onplaying = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'play', 'pause');
            origin.Ui.icon(origin.env.buttons.play, 'julia-play', 'julia-pause');
            origin.env.sliders.progress.buffered();
            origin.Ui.state(origin.env.preloader, 'on', '');
            origin.Ui.state(origin.env.suggest, 'on', '');
            origin.env.started = true;
            clearTimeout(origin.env.suggestTimer);
            origin.env.errorRecoveryAttempts = 0;
            origin.Controls.press('setDuration', { 'duration': origin.env.api.duration });
        };
        // Video pause
        origin.env.api.onpause = function (e) {
            origin.Ui.state(origin.env.buttons.play, 'pause', 'play');
            origin.Ui.icon(origin.env.buttons.play, 'julia-pause', 'julia-play');
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
            origin.Controls.press('setDuration', { 'duration': origin.env.api.duration });
            if (origin.env.mode != 'hls' && origin.env.mode != 'dash') {
                if ((origin.env.continuePlayback === true || origin.options.autoplay === true) && (origin.env.api.paused === true || origin.env.api.ended === true) && origin.Support.isMobile() === false && origin.env.started === false) {
                    origin.env.api.play();
                }
            }
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
            origin.Callback.onTime(currentTimeReadable, origin.env.api.currentTime);
        };
        // Video position
        origin.env.api.onseeked = function (e) {
        };
        // Video position
        origin.env.api.onseeking = function (e) {
            origin.Ui.state(origin.env.preloader, '', 'on');
        };
        // Volume
        origin.env.api.onvolumechange = function (e) {
            if (origin.env.api.muted === false) {
                origin.env.sliders.volume.update(origin.env.api.volume * 100);
            } else {
                origin.env.sliders.volume.update(0);
            }
        };
        // Set video duration
        origin.env.api.ondurationchange = function (e) {
            origin.Controls.press('setDuration', { 'duration': origin.env.api.duration });
        };
        origin.env.api.onended = function (e) {
            origin.Controls.press('stop');
            origin.Suggest.run();
        };
        $(window).on('resize', function () {
            origin.Support.resize();
        });
    };
    // Specific events, error handlers
    self.hlsLibEvents = function () {
        if (origin.env.mode == 'hls') {
            // API READY
            origin.env.hls.on(origin.env.context.Hls.Events.MEDIA_ATTACHED, function (event, data) {
                origin.env.hls.loadSource(origin.options.source.file);
            });
            origin.env.hls.on(origin.env.context.Hls.Events.MANIFEST_PARSED, function (event, data) {
                bitratesVideo = origin.Switcher.getBitrateList('video');
                tracksAudio = origin.Switcher.getTracks('audio');
                origin.debug({
                    'Stream is initialized and ready': event,
                    'Video bitrate list': bitratesVideo,
                    'Audio track list': tracksAudio,
                    'ABR video bitrate': origin.Switcher.getAutoBitrate('video'),
                    'Video bitrate': origin.Switcher.getBitrate('video')
                });
                if (typeof bitratesVideo === 'object' && bitratesVideo && bitratesVideo.length > 1) {
                    origin.Ui.state(origin.env.menus.video, '', 'on');
                    active = origin.Switcher.getAutoBitrate('video') === true ? -1 : origin.Switcher.getBitrate('video');
                    menuItems = origin.Switcher.prepareBitrateMenu(bitratesVideo, [{
                            active: active,
                            value: -1,
                            title: origin.options.i18n.auto
                        }], active);
                    origin.Ui.menu(origin.env.menus.video, menuItems);
                    origin.Ui.menuDisabled(origin.env.menus.video, false);
                } else {
                    origin.Ui.state(origin.env.menus.video, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.video, true);
                }
                // Audio tracks
                if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 0) {
                    origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                    active = origin.env.audioTrackActive;
                    menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                    origin.Ui.menu(origin.env.menus.audioTracks, menuItems);
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                } else {
                    origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                }
                if (origin.env.continuePlayback === true && origin.env.started === true) {
                    origin.env.api.play();
                }
            });
            origin.env.hls.on(origin.env.context.Hls.Events.LEVEL_LOADED, function (event, data) {
                tracksAudio = origin.Switcher.getTracks('audio');
                // Audio tracks
                if (typeof tracksAudio === 'object' && tracksAudio && tracksAudio.length > 1) {
                    origin.Ui.state(origin.env.menus.audioTracks, '', 'on');
                    active = origin.env.audioTrackActive;
                    menuItems = origin.Switcher.prepareTrackMenu(tracksAudio, [], active);
                    origin.Ui.menu(origin.env.menus.audioTracks, menuItems);
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                } else {
                    origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                    origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                }
            });
            // Error handling
            origin.env.hls.on(origin.env.context.Hls.Events.ERROR, function (event, data) {
                origin.debug({
                    'Recovering Hls Error': data.details,
                    'ErrorType': data.type,
                    'ErrorFatal': data.fatal,
                    'Data': data,
                    'Attempts': origin.env.errorRecoveryAttempts,
                    'Attempt limit': origin.env.errorRecoveryAttemptLimit
                }, true);
                if (origin.env.errorRecoveryAttempts >= origin.env.errorRecoveryAttemptLimit) {
                    if (data.fatal === true) {
                        // Bring to life again
                        switch (data.type) {
                        case origin.env.context.Hls.ErrorTypes.NETWORK_ERROR:
                            // try to recover network error
                            origin.env.hls.startLoad();
                            break;
                        case origin.env.context.Hls.ErrorTypes.MEDIA_ERROR:
                            if (origin.env.errorRecoveryAttempts > origin.env.errorRecoveryAttemptLimit / 10) {
                                origin.env.hls.swapAudioCodec();
                            }
                            // try to recover media error
                            origin.env.hls.recoverMediaError();
                            break;
                        default:
                            // try to recover other errors
                            origin.env.hls.startLoad();
                        }
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
                            'Data': event,
                            'Attempts': origin.env.errorRecoveryAttempts,
                            'Attempt limit': origin.env.errorRecoveryAttemptLimit
                        }, true);
                        if (event.error === 'download') {
                            origin.Source.recover(true);
                        } else {
                            origin.Source.recover();
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.PLAYBACK_ERROR:
                    case origin.env.context.dashjs.MediaPlayer.events.BUFFER_EMPTY:
                    case origin.env.context.dashjs.MediaPlayer.events.FRAGMENT_LOADING_ABANDONED:
                        origin.debug({
                            'Recovering Dash Error': eventName,
                            'ErrorType': event.type,
                            'Data': event,
                            'Attempts': origin.env.errorRecoveryAttempts,
                            'Attempt limit': origin.env.errorRecoveryAttemptLimit
                        }, true);
                        origin.Source.recover();
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.MANIFEST_LOADED:
                        origin.debug({ 'Dash Manifest loaded': event });
                        origin.env.dashInitialized = true;
                        if (origin.env.continuePlayback === true && origin.env.started === true) {
                            origin.env.api.play();
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.STREAM_INITIALIZED:
                        bitratesVideo = origin.Switcher.getBitrateList('video');
                        bitratesAudio = origin.Switcher.getBitrateList('audio');
                        tracksAudio = origin.Switcher.getTracks('audio');
                        origin.debug({
                            'Stream is initialized and ready': event,
                            'Video bitrate list': origin.Switcher.getBitrateList('video'),
                            'Audio bitrate list': origin.Switcher.getBitrateList('audio'),
                            'Audio track list': origin.Switcher.getTracks('audio'),
                            'ABR video bitrate': origin.Switcher.getAutoBitrate('video'),
                            'ABR audio bitrate': origin.Switcher.getAutoBitrate('audio'),
                            'Video bitrate': origin.Switcher.getBitrate('video'),
                            'Audio bitrate': origin.Switcher.getBitrate('audio')
                        });
                        // Optional buffer tunnning
                        if (Object.keys(origin.options.dashConfig).indexOf('setRichBufferThreshold') > -1) {
                             origin.env.dash.setRichBufferThreshold(origin.options.dashConfig.setRichBufferThreshold);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setBufferToKeep') > -1) {
                             origin.env.dash.setBufferToKeep(origin.options.dashConfig.setBufferToKeep);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setBufferPruningInterval') > -1) {
                             origin.env.dash.setBufferPruningInterval(origin.options.dashConfig.setBufferPruningInterval);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setBufferTimeAtTopQuality') > -1) {
                             origin.env.dash.setBufferTimeAtTopQuality(origin.options.dashConfig.setBufferTimeAtTopQuality);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setScheduleWhilePaused') > -1) {
                             origin.env.dash.setScheduleWhilePaused(origin.options.dashConfig.setScheduleWhilePaused);
                        }
                        if (Object.keys(origin.options.dashConfig).indexOf('setStableBufferTime') > -1) {
                             origin.env.dash.setStableBufferTime(origin.options.dashConfig.setStableBufferTime);
                        }

                        // Video bitrates
                        origin.env.dash.setFastSwitchEnabled(true);
                        if (typeof bitratesVideo === 'object' && bitratesVideo && bitratesVideo.length > 1) {
                            origin.Ui.state(origin.env.menus.video, '', 'on');
                            active = origin.Switcher.getAutoBitrate('video') === true ? -1 : origin.Switcher.getBitrate('video');
                            menuItems = origin.Switcher.prepareBitrateMenu(bitratesVideo, [{
                                    active: active,
                                    value: -1,
                                    title: origin.options.i18n.auto
                                }], active);
                            origin.Ui.menu(origin.env.menus.video, menuItems);
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
                            origin.Ui.menu(origin.env.menus.audio, menuItems);
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
                            origin.Ui.menu(origin.env.menus.audioTracks, menuItems);
                            origin.Ui.menuDisabled(origin.env.menus.audioTracks, false);
                        } else {
                            origin.Ui.state(origin.env.menus.audioTracks, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.audioTracks, true);
                        }
                        break;
                    case origin.env.context.dashjs.MediaPlayer.events.TEXT_TRACK_ADDED:
                        // Subtitle tracks
                        tracksText = origin.Switcher.getTracks('text');
                        origin.debug({ 'Text track list': origin.Switcher.getTracks('text') });
                        if (typeof tracksText === 'object' && tracksText && tracksText.length > 0) {
                            origin.Ui.state(origin.env.menus.subtitles, '', 'on');
                            active = origin.env.textTrackActive;
                            menuItems = origin.Switcher.prepareTrackMenu(tracksText, origin.options.i18n.textItems, active);
                            origin.Ui.menu(origin.env.menus.subtitles, menuItems);
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, false);
                        } else {
                            origin.Ui.state(origin.env.menus.subtitles, 'on', '');
                            origin.Ui.menuDisabled(origin.env.menus.subtitles, true);
                        }
                        break;
                    default:
                        origin.debug({
                            'Dash Event': eventName,
                            'EventType': event.type,
                            'Data': event,
                            'Attempts': origin.env.errorRecoveryAttempts,
                            'Attempt limit': origin.env.errorRecoveryAttemptLimit
                        });
                    }
                });
            });
        }
    };
};
