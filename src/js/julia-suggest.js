/* *****************************************
* JuliaPlayer HTML5 player
* suggest playlist engine
****************************************** */
JuliaPlayer.prototype._Suggest = function(origin)
{
    var self = this;




    self.run = function()
    {
        origin.env.suggest.html('');
        origin.env.suggestClicked = false;
        origin.env.buttons.bigPlay.hide();

        if(origin.options.suggest.length > 0)
        {
            x = 0;
            for(var i in origin.options.suggest)
            {
                if(x < origin.options.suggestLimit && origin.options.suggest[i].played === false)
                {
                    live = !!origin.options.suggest[i].live && origin.options.suggest[i].live === true ? true: false;
                    file = !!origin.options.suggest[i].file ? origin.options.suggest[i].file: '';
                    poster = !!origin.options.suggest[i].poster ? origin.options.suggest[i].poster: '';
                    title = !!origin.options.suggest[i].title ? origin.options.suggest[i].title: '';
                    mode = !!origin.options.suggest[i].mode ? origin.options.suggest[i].mode: 'legacy';
                    posterImage = poster.length>0 ? '<img src="'+poster+'" width="100%" height="100%">': '';

                    suggestItemWidget = $('<div class="julia-suggest-item" data-item-poster="'+poster+'" data-item-file="'+origin.options.suggest[i].file+'" data-mode="'+mode+'" data-item-title="'+origin.options.suggest[i].title+'" data-index="'+i+'" data-item-mode="'+origin.options.suggest[i].mode+'" data-item-live="'+origin.options.suggest[i].live+'">'
                            + posterImage
                            +'<div class="julia-suggest-item-title">'+origin.options.suggest[i].title+'</div>'
                        +'</div>');

                    suggestItemWidget.on('click', function(e)
                    {
                        origin.Ui.state( origin.env.preloader, '', 'on' );

                        if(origin.options.onSuggest !== false)
                        {
                            origin.Callback.fn(origin.options.onSuggest, origin.options.suggest[i]);
                        }

                        origin.Thumbs.shadowApi = false;

                        origin.env.suggestClicked = true;
                        origin.options.autoplay = true;
                        origin.options.source = {
                            file: $(this).data('item-file'),
                            poster: $(this).data('item-poster'),
                            title: $(this).data('item-title'),
                            mode: $(this).data('item-mode'),
                            live: $(this).data('item-live'),
                        };
                        origin.Source.set();

                        origin.debug({
                            suggestRemoveIndex: $(this).data('index'),
                            suggestRemove: $(this).data('item-file')
                        });

                        origin.options.suggest[$(this).data('index')].played = true;
                        origin.Ui.state(origin.env.suggest, 'on', '');
                        //origin.Controls.press('play');
                    });

                    origin.debug({
                        'Suggest item' : suggestItemWidget
                    });

                    origin.env.suggest.append(suggestItemWidget);
                    x++;
                }
            };

            if(x > 0)
            {
                if(origin.options.suggestTimeout > 0)
                {
                    origin.env.suggestTimer = setTimeout( function()
                    {
                        if(origin.env.suggestClicked === false)
                        {
                            origin.env.suggest.find('div.julia-suggest-item:first').click();
                        }
                    }, origin.options.suggestTimeout);
                }

                origin.Ui.state(origin.env.suggest, '', 'on');
            }

        }else{
            origin.Fullscreen.off();
        }

        origin.debug({
            'Suggest' : 'raised'+ origin.options.suggest.length
        });
    };
};
