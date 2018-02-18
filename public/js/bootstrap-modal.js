var _createClass = function () {
    function defineProperties(target, props) {
        for (var i = 0; i < props.length; i++) {
            var descriptor = props[i];
            descriptor.enumerable = descriptor.enumerable || false;
            descriptor.configurable = true;

            if ("value" in descriptor) {
                descriptor.writable = true;
            }

            Object.defineProperty(target, descriptor.key, descriptor);
        }
    }

    return function (Constructor, protoProps, staticProps) {
        if (protoProps) {
            defineProperties(Constructor.prototype, protoProps);
        }

        if (staticProps) {
            defineProperties(Constructor, staticProps);
        }

        return Constructor;
    };
}();

!function(b){var a=function(d,c){this.init(d,c)};a.prototype={constructor:a,init:function(e,c){var f=this;this.options=c;this.$element=b(e).delegate('[data-dismiss="modal"]',"click.dismiss.modal",b.proxy(this.hide,this));this.options.remote&&this.$element.find(".modal-body").load(this.options.remote,function(){var g=b.Event("loaded");f.$element.trigger(g)});var d=typeof this.options.manager==="function"?this.options.manager.call(this):this.options.manager;d=d.appendModal?d:b(d).modalmanager().data("modalmanager");d.appendModal(this)},toggle:function(){return this[!this.isShown?"show":"hide"]()},show:function(){var c=b.Event("show");if(this.isShown){return}this.$element.trigger(c);if(c.isDefaultPrevented()){return}this.escape();this.tab();this.options.loading&&this.loading()},hide:function(c){c&&c.preventDefault();c=b.Event("hide");this.$element.trigger(c);if(!this.isShown||c.isDefaultPrevented()){return}this.isShown=false;this.escape();this.tab();this.isLoading&&this.loading();b(document).off("focusin.modal");this.$element.removeClass("in").removeClass("animated").removeClass(this.options.attentionAnimation).removeClass("modal-overflow").attr("aria-hidden",true);b.support.transition&&this.$element.hasClass("fade")?this.hideWithTransition():this.hideModal()},layout:function(){var f=this.options.height?"height":"max-height",d=this.options.height||this.options.maxHeight;if(this.options.width){this.$element.css("width",this.options.width);var c=this;this.$element.css("margin-left",function(){if(/%/ig.test(c.options.width)){return -(parseInt(c.options.width)/2)+"%"}else{return -(b(this).width()/2)+"px"}})}else{this.$element.css("width","");this.$element.css("margin-left","")}this.$element.find(".modal-body").css("overflow","").css(f,"");if(d){this.$element.find(".modal-body").css("overflow","auto").css(f,d)}var e=b(window).height()-10<this.$element.height();if(e||this.options.modalOverflow){this.$element.css("margin-top",0).addClass("modal-overflow")}else{this.$element.css("margin-top",0-this.$element.height()/2).removeClass("modal-overflow")}},tab:function(){var c=this;if(this.isShown&&this.options.consumeTab){this.$element.on("keydown.tabindex.modal","[data-tabindex]",function(h){if(h.keyCode&&h.keyCode==9){var g=[],f=Number(b(this).data("tabindex"));c.$element.find("[data-tabindex]:enabled:visible:not([readonly])").each(function(e){g.push(Number(b(this).data("tabindex")))});g.sort(function(i,e){return i-e});var d=b.inArray(f,g);if(!h.shiftKey){d<g.length-1?c.$element.find("[data-tabindex="+g[d+1]+"]").focus():c.$element.find("[data-tabindex="+g[0]+"]").focus()}else{d==0?c.$element.find("[data-tabindex="+g[g.length-1]+"]").focus():c.$element.find("[data-tabindex="+g[d-1]+"]").focus()}h.preventDefault()}})}else{if(!this.isShown){this.$element.off("keydown.tabindex.modal")}}},escape:function(){var c=this;if(this.isShown&&this.options.keyboard){if(!this.$element.attr("tabindex")){this.$element.attr("tabindex",-1)}this.$element.on("keyup.dismiss.modal",function(d){d.which==27&&c.hide()})}else{if(!this.isShown){this.$element.off("keyup.dismiss.modal")}}},hideWithTransition:function(){var c=this,d=setTimeout(function(){c.$element.off(b.support.transition.end);c.hideModal()},500);this.$element.one(b.support.transition.end,function(){clearTimeout(d);c.hideModal()})},hideModal:function(){var d=this.options.height?"height":"max-height";var c=this.options.height||this.options.maxHeight;if(c){this.$element.find(".modal-body").css("overflow","").css(d,"")}this.$element.hide().trigger("hidden")},removeLoading:function(){this.$loading.remove();this.$loading=null;this.isLoading=false},loading:function(f){f=f||function(){};var d=this.$element.hasClass("fade")?"fade":"";if(!this.isLoading){var c=b.support.transition&&d;this.$loading=b('<div class="loading-mask '+d+'">').append(this.options.spinner).appendTo(this.$element);if(c){this.$loading[0].offsetWidth}this.$loading.addClass("in");this.isLoading=true;c?this.$loading.one(b.support.transition.end,f):f()}else{if(this.isLoading&&this.$loading){this.$loading.removeClass("in");var e=this;b.support.transition&&this.$element.hasClass("fade")?this.$loading.one(b.support.transition.end,function(){e.removeLoading()}):e.removeLoading()}else{if(f){f(this.isLoading)}}}},focus:function(){var c=this.$element.find(this.options.focusOn);c=c.length?c:this.$element;c.focus()},attention:function(){if(this.options.attentionAnimation){this.$element.removeClass("animated").removeClass(this.options.attentionAnimation);var c=this;setTimeout(function(){c.$element.addClass("animated").addClass(c.options.attentionAnimation)},0)}this.focus()},destroy:function(){var c=b.Event("destroy");this.$element.trigger(c);if(c.isDefaultPrevented()){return}this.$element.off(".modal").removeData("modal").removeClass("in").attr("aria-hidden",true);if(this.$parent!==this.$element.parent()){this.$element.appendTo(this.$parent)}else{if(!this.$parent.length){this.$element.remove();this.$element=null}}this.$element.trigger("destroyed")}};b.fn.modal=function(d,c){return this.each(function(){var g=b(this),f=g.data("modal"),e=b.extend({},b.fn.modal.defaults,g.data(),typeof d=="object"&&d);if(!f){g.data("modal",(f=new a(this,e)))}if(typeof d=="string"){f[d].apply(f,[].concat(c))}else{if(e.show){f.show()}}})};b.fn.modal.defaults={keyboard:true,backdrop:true,loading:false,show:true,width:null,height:null,maxHeight:null,modalOverflow:false,consumeTab:true,focusOn:null,replace:false,resize:false,attentionAnimation:"shake",manager:"body",spinner:'<div class="loading-spinner" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>',backdropTemplate:'<div class="modal-backdrop" />'};b.fn.modal.Constructor=a;b(function(){b(document).off("click.modal").on("click.modal.data-api",'[data-toggle="modal"]',function(h){var g=b(this),d=g.attr("href"),c=b(g.attr("data-target")||(d&&d.replace(/.*(?=#[^\s]+$)/,""))),f=c.data("modal")?"toggle":b.extend({remote:!/#/.test(d)&&d},c.data(),g.data());h.preventDefault();c.modal(f).one("hide",function(){g.focus()})})})}(window.$);
!function(c){var a=function(f,e){this.init(f,e)};a.prototype={constructor:a,init:function(f,e){this.$element=c(f);this.options=c.extend({},c.fn.modalmanager.defaults,this.$element.data(),typeof e=="object"&&e);this.stack=[];this.backdropCount=0;if(this.options.resize){var h,g=this;c(window).on("resize.modal",function(){h&&clearTimeout(h);h=setTimeout(function(){for(var j=0;j<g.stack.length;j++){g.stack[j].isShown&&g.stack[j].layout()}},10)})}},createModal:function(f,e){c(f).modal(c.extend({manager:this},e))},appendModal:function(f){this.stack.push(f);var e=this;f.$element.on("show.modalmanager",b(function(h){var g=function(){f.isShown=true;var i=c.support.transition&&f.$element.hasClass("fade");e.$element.toggleClass("modal-open",e.hasOpenModal()).toggleClass("page-overflow",c(window).height()<e.$element.height());f.$parent=f.$element.parent();f.$container=e.createContainer(f);f.$element.appendTo(f.$container);e.backdrop(f,function(){f.$element.show();if(i){f.$element[0].offsetWidth}f.layout();f.$element.addClass("in").attr("aria-hidden",false);var j=function(){e.setFocus();f.$element.trigger("shown")};i?f.$element.one(c.support.transition.end,j):j()})};f.options.replace?e.replace(g):g()}));f.$element.on("hidden.modalmanager",b(function(g){e.backdrop(f);if(!f.$element.parent().length){e.destroyModal(f)}else{if(f.$backdrop){var h=c.support.transition&&f.$element.hasClass("fade");if(h){f.$element[0].offsetWidth}c.support.transition&&f.$element.hasClass("fade")?f.$backdrop.one(c.support.transition.end,function(){f.destroy()}):f.destroy()}else{f.destroy()}}}));f.$element.on("destroyed.modalmanager",b(function(g){e.destroyModal(f)}))},getOpenModals:function(){var f=[];for(var e=0;e<this.stack.length;e++){if(this.stack[e].isShown){f.push(this.stack[e])}}return f},hasOpenModal:function(){return this.getOpenModals().length>0},setFocus:function(){var f;for(var e=0;e<this.stack.length;e++){if(this.stack[e].isShown){f=this.stack[e]}}if(!f){return}f.focus()},destroyModal:function(f){f.$element.off(".modalmanager");if(f.$backdrop){this.removeBackdrop(f)}this.stack.splice(this.getIndexOfModal(f),1);var e=this.hasOpenModal();this.$element.toggleClass("modal-open",e);if(!e){this.$element.removeClass("page-overflow")}this.removeContainer(f);this.setFocus()},getModalAt:function(e){return this.stack[e]},getIndexOfModal:function(f){for(var e=0;e<this.stack.length;e++){if(f===this.stack[e]){return e}}},replace:function(g){var f;for(var e=0;e<this.stack.length;e++){if(this.stack[e].isShown){f=this.stack[e]}}if(f){this.$backdropHandle=f.$backdrop;f.$backdrop=null;g&&f.$element.one("hidden",b(c.proxy(g,this)));f.hide()}else{if(g){g()}}},removeBackdrop:function(e){e.$backdrop.remove();e.$backdrop=null},createBackdrop:function(g,f){var e;if(!this.$backdropHandle){e=c(f).addClass(g).appendTo(this.$element)}else{e=this.$backdropHandle;e.off(".modalmanager");this.$backdropHandle=null;this.isLoading&&this.removeSpinner()}return e},removeContainer:function(e){e.$container.remove();e.$container=null},createContainer:function(e){var f;f=c('<div class="modal-scrollable">').css("z-index",d("modal",this.getOpenModals().length)).appendTo(this.$element);if(e&&e.options.backdrop!="static"){f.on("click.modal",b(function(g){e.hide()}))}else{if(e){f.on("click.modal",b(function(g){e.attention()}))}}return f},backdrop:function(h,j){var f=h.$element.hasClass("fade")?"fade":"",i=h.options.backdrop&&this.backdropCount<this.options.backdropLimit;if(h.isShown&&i){var e=c.support.transition&&f&&!this.$backdropHandle;h.$backdrop=this.createBackdrop(f,h.options.backdropTemplate);h.$backdrop.css("z-index",d("backdrop",this.getOpenModals().length));if(e){h.$backdrop[0].offsetWidth}h.$backdrop.addClass("in");this.backdropCount+=1;e?h.$backdrop.one(c.support.transition.end,j):j()}else{if(!h.isShown&&h.$backdrop){h.$backdrop.removeClass("in");this.backdropCount-=1;var g=this;c.support.transition&&h.$element.hasClass("fade")?h.$backdrop.one(c.support.transition.end,function(){g.removeBackdrop(h)}):g.removeBackdrop(h)}else{if(j){j()}}}},removeSpinner:function(){this.$spinner&&this.$spinner.remove();this.$spinner=null;this.isLoading=false},removeLoading:function(){this.$backdropHandle&&this.$backdropHandle.remove();this.$backdropHandle=null;this.removeSpinner()},loading:function(h){h=h||function(){};this.$element.toggleClass("modal-open",!this.isLoading||this.hasOpenModal()).toggleClass("page-overflow",c(window).height()<this.$element.height());if(!this.isLoading){this.$backdropHandle=this.createBackdrop("fade",this.options.backdropTemplate);this.$backdropHandle[0].offsetWidth;var e=this.getOpenModals();this.$backdropHandle.css("z-index",d("backdrop",e.length+1)).addClass("in");var g=c(this.options.spinner).css("z-index",d("modal",e.length+1)).appendTo(this.$element).addClass("in");this.$spinner=c(this.createContainer()).append(g).on("click.modalmanager",c.proxy(this.loading,this));this.isLoading=true;c.support.transition?this.$backdropHandle.one(c.support.transition.end,h):h()}else{if(this.isLoading&&this.$backdropHandle){this.$backdropHandle.removeClass("in");var f=this;c.support.transition?this.$backdropHandle.one(c.support.transition.end,function(){f.removeLoading()}):f.removeLoading()}else{if(h){h(this.isLoading)}}}}};var d=(function(){var f,e={};return function(g,j){if(typeof f==="undefined"){var i=c('<div class="modal hide" />').appendTo("body"),h=c('<div class="modal-backdrop hide" />').appendTo("body");e.modal=+i.css("z-index");e.backdrop=+h.css("z-index");f=e.modal-e.backdrop;i.remove();h.remove();h=i=null}return e[g]+(f*j)}}());function b(e){return function(f){if(f&&this===f.target){return e.apply(this,arguments)}}}c.fn.modalmanager=function(f,e){return this.each(function(){var h=c(this),g=h.data("modalmanager");if(!g){h.data("modalmanager",(g=new a(this,f)))}if(typeof f==="string"){g[f].apply(g,[].concat(e))}})};c.fn.modalmanager.defaults={backdropLimit:999,resize:true,spinner:'<div class="loading-spinner fade" style="width: 200px; margin-left: -100px;"><div class="progress progress-striped active"><div class="bar" style="width: 100%;"></div></div></div>',backdropTemplate:'<div class="modal-backdrop" />'};c.fn.modalmanager.Constructor=a;c(function(){c(document).off("show.bs.modal").off("hidden.bs.modal")})}(window.$);
/**
 * --------------------------------------------------------------------------
 * Bootstrap (v4.0.0): button.js
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * --------------------------------------------------------------------------
 */

var Button = function ($$$1) {
    /**
     * ------------------------------------------------------------------------
     * Constants
     * ------------------------------------------------------------------------
     */
    var NAME = 'button';
    var VERSION = '4.0.0';
    var DATA_KEY = 'bs.button';
    var EVENT_KEY = "." + DATA_KEY;
    var DATA_API_KEY = '.data-api';
    var JQUERY_NO_CONFLICT = $$$1.fn[NAME];
    var ClassName = {
      ACTIVE: 'active',
      BUTTON: 'btn',
      FOCUS: 'focus'
    };
    var Selector = {
      DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
      DATA_TOGGLE: '[data-toggle="buttons"]',
      INPUT: 'input',
      ACTIVE: '.active',
      BUTTON: '.btn'
    };
    var Event = {
      CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY,
      FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY + DATA_API_KEY + " " + ("blur" + EVENT_KEY + DATA_API_KEY)
      /**
       * ------------------------------------------------------------------------
       * Class Definition
       * ------------------------------------------------------------------------
       */

    };

    var Button =
    /*#__PURE__*/
    function () {
      function Button(element) {
        this._element = element;
      } // Getters


      var _proto = Button.prototype;

      // Public
      _proto.toggle = function toggle() {
        var triggerChangeEvent = true;
        var addAriaPressed = true;
        var rootElement = $$$1(this._element).closest(Selector.DATA_TOGGLE)[0];

        if (rootElement) {
          var input = $$$1(this._element).find(Selector.INPUT)[0];

          if (input) {
            if (input.type === 'radio') {
              if (input.checked && $$$1(this._element).hasClass(ClassName.ACTIVE)) {
                triggerChangeEvent = false;
              } else {
                var activeElement = $$$1(rootElement).find(Selector.ACTIVE)[0];

                if (activeElement) {
                  $$$1(activeElement).removeClass(ClassName.ACTIVE);
                }
              }
            }

            if (triggerChangeEvent) {
              if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
                return;
              }

              input.checked = !$$$1(this._element).hasClass(ClassName.ACTIVE);
              $$$1(input).trigger('change');
            }

            input.focus();
            addAriaPressed = false;
          }
        }

        if (addAriaPressed) {
          this._element.setAttribute('aria-pressed', !$$$1(this._element).hasClass(ClassName.ACTIVE));
        }

        if (triggerChangeEvent) {
          $$$1(this._element).toggleClass(ClassName.ACTIVE);
        }
      };

      _proto.dispose = function dispose() {
        $$$1.removeData(this._element, DATA_KEY);
        this._element = null;
      }; // Static


      Button._jQueryInterface = function _jQueryInterface(config) {
        return this.each(function () {
          var data = $$$1(this).data(DATA_KEY);

          if (!data) {
            data = new Button(this);
            $$$1(this).data(DATA_KEY, data);
          }

          if (config === 'toggle') {
            data[config]();
          }
        });
      };

      _createClass(Button, null, [{
        key: "VERSION",
        get: function get() {
          return VERSION;
        }
      }]);
      return Button;
    }();
    /**
     * ------------------------------------------------------------------------
     * Data Api implementation
     * ------------------------------------------------------------------------
     */


    $$$1(document).on(Event.CLICK_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
      event.preventDefault();
      var button = event.target;

      if (!$$$1(button).hasClass(ClassName.BUTTON)) {
        button = $$$1(button).closest(Selector.BUTTON);
      }

      Button._jQueryInterface.call($$$1(button), 'toggle');
    }).on(Event.FOCUS_BLUR_DATA_API, Selector.DATA_TOGGLE_CARROT, function (event) {
      var button = $$$1(event.target).closest(Selector.BUTTON)[0];
      $$$1(button).toggleClass(ClassName.FOCUS, /^focus(in)?$/.test(event.type));
    });
    /**
     * ------------------------------------------------------------------------
     * jQuery
     * ------------------------------------------------------------------------
     */

    $$$1.fn[NAME] = Button._jQueryInterface;
    $$$1.fn[NAME].Constructor = Button;

    $$$1.fn[NAME].noConflict = function () {
      $$$1.fn[NAME] = JQUERY_NO_CONFLICT;
      return Button._jQueryInterface;
    };

    return Button;
  }($);