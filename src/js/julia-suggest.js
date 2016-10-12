/* *****************************************
* Julia HTML5 media player
* Suggest
* suggest playlist engine
****************************************** */
Julia.prototype._Suggest = function(origin)
{
    var self = this;




    self.run = function()
    {
        origin.env.model.suggest.html('');
        origin.Controls.press('stop');
        origin.env.suggestClicked = false;

        if(origin.options.suggest.length > 0)
        {
            x = 0;
            for(var i in origin.options.suggest)
            {
                if(x < origin.options.suggestLimit && origin.options.suggest[i].played === false)
                {
                    mode = !!origin.options.suggest[i].live && origin.options.suggest[i].live === true ? 'live': 'vod';
                    liveText = !!origin.options.suggest[i].liveText ? origin.options.suggest[i].liveText: 'Live';
                    var poster = !!origin.options.suggest[i].poster ? origin.options.suggest[i].poster: '';
                    posterImage = poster.length>0 ? '<img src="'+poster+'" width="100%" height="100%">': '';
                    suggestItemWidget = $('<div class="julia-suggest-item" data-poster="'+poster+'" data-source="'+origin.options.suggest[i].source+'" data-mode="'+mode+'" data-live-text="'+liveText+'" data-index="'+i+'">'
                            + posterImage
                            +'<div class="julia-suggest-item-title">'+origin.options.suggest[i].title+'</div>'
                        +'</div>');

                        suggestItemWidget.on('click', function(e)
                        {
                            if(origin.options.onSuggest !== false)
                            {
                                origin.Callback.fn(origin.options.onSuggest, origin.options.suggest[i]);
                            }

                            origin.Api.shadowApi = false;

                            origin.options.muted = origin.env.api.muted;

                            origin.options.poster = $(this).data('poster');
                            origin.env.suggestClicked = true;
                            origin.env.model.buttons.bigPlay.hide();
                            origin.env.started = false;
                            origin.options.source = $(this).data('source');
                            origin.Api.source();
                            origin.options.autoplay = true;
                            origin.options.live = $(this).data('mode') == 'live' ? true: false;
                            origin.options.i18n.liveText = $(this).data('live-text');

                            origin.Ui.panel( origin.env.model.panels.live, origin.options.i18n.liveText );

                            origin.Base.debug({
                                suggestRemoveIndex: $(this).data('index'),
                                suggestRemove: $(this).data('source')
                            });

                            origin.options.suggest[$(this).data('index')].played = true;

                            origin.Ui.state(origin.env.model.suggest, 'on', '');

                            origin.env.model.buttons.bigPlay.click();
                        });

                    origin.env.model.suggest.append(suggestItemWidget);
                    x++;
                }
            }

            if(x > 0)
            {
                if(origin.options.suggestTimeout > 0 && origin.Support.isMobile() === false)
                {
                    setTimeout( function()
                    {
                        if(origin.env.suggestClicked === false)
                        {
                            origin.env.model.suggest.find('div.julia-suggest-item:first').click();
                        }
                    }, origin.options.suggestTimeout);
                }
                origin.Ui.state(origin.env.model.suggest, '', 'on');
            }

        }else{
            origin.Fullscreen.off();
        }

        origin.Base.debug({
            'Suggest' : 'raised'
        });
    };
};
