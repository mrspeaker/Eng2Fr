var eng2fr = {
    from: null,
    to: null,
    suggester: {
        i: 0,
        words: [
            [ "beer", "binouze" ],
            [ "another beer", "une autre bière" ],
            [ "crazy", "fou" ],
            [ "What the heck?!", "c'est quoi ce délire" ],
            [ "whatever", "n'importe quoi"]
        ],
        next: function(){
            return this.words[ ( this.i++ ) % this.words.length ];
        }
    },
    
    init: function() {
        this.bindSwipe( $( "#display" ) );
        this.from = $( "#from" );
        this.to = $( "#to" );
        Events.listen( "card_next", $.proxy( this.next, this ) );
        Events.listen( "card_flip", $.proxy( this.flip, this ) );
        
        // Begin!
        this.next();
    },
    
    next: function() {
        var to = this.to,
            from = this.from,
            next = this.suggester.next(),
            _this = this;
        
        to.text( next[ 0 ] );
        
        to.addClass( "push in current" );
        from.addClass( "push out" ).one( "webkitAnimationEnd", function() {
            from.text( next[ 1 ] );            
            from.removeClass( "current push out" );
            to.removeClass( "push in" );
            _this.from = to;
            _this.to = from;
        });
    },

    flip: function() {
        var to = this.to,
            from = this.from,
            _this = this;
        
        to.addClass( "flip in current" );
        from.addClass( "flip out" ).one( "webkitAnimationEnd", function() {
            from.removeClass( "current flip out" );
            to.removeClass( "flip in" );
            _this.from = to;
            _this.to = from;
        });
    },
    
    bindSwipe: function( el ) {
        this.xStart = null;
        this.downEvent = 'ontouchstart' in document.documentElement && navigator.appVersion.indexOf( 'iPhone OS ' ) > -1 ? 'touchstart' : 'mousedown';
        this.upEvent =  'ontouchend' in document.documentElement && navigator.appVersion.indexOf( 'iPhone OS ' ) > -1 ? 'touchend' : 'mouseup';

        var _this = this;
        el.bind({
            "touchstart mousedown": function( e ) {
                if( e.type !== _this.downEvent ) return;
                e.preventDefault();
                _this.xStart = e.pageX && e.pageX > 0 ? e.pageX : e.originalEvent.changedTouches[ 0 ].pageX;
            },
            "touchend mouseup": function( e ) {
                if( e.type !== _this.upEvent ) return;
                var newX = e.pageX && e.pageX > 0 ? e.pageX : e.originalEvent.changedTouches[ 0 ].pageX;
                var diff = newX - _this.xStart;
                if( Math.abs( diff ) > 20) {
                    if( diff > 0 ){
                        Events.trigger( "card_previous", {} );
                    } else {
                        Events.trigger( "card_next", {} );
                    }
                } else {
                    Events.trigger( "card_flip", {} );
                }
            },
            "touchmove": function( e ) {
                e.preventDefault();
            }
        });
    }
};
