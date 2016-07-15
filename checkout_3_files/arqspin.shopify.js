console.log("Arqspin Shopify App v3.43");
window.arqspin_embed_params = window.arqspin_embed_params || "&is=-0.16&ms=0.16";
var arqit = function () {
    $("img[src*='arqball']:not([src*='thumb']):not([src*='compact']):not(.noarq)").each(function () {
        var img_params = this.src.split("_");
        var spinid = /arqball_([0-9a-z]*)/.exec($(this).attr("src"));
        var mindim = Math.min($(this).width(), $(this).height(), $(this).parent().width(), $(this).parent().height());
        if (location.hostname == "wallisreidjewelry.com" || location.hostname == "www.wallisreidjewelry.com" || location.hostname == "shop-genie.myshopify.com" || location.hostname == "fongift.myshopify.com" || location.hostname == "exotic-lids.myshopify.com" || location.hostname == "www.mactownvape.com" || location.hostname == "go-ham.myshopify.com" || location.hostname == "www.goham.com" || location.hostname == "ellabing.com"){
            mindim = $(this).width();
        }

        var minCutoff;
        img_params.forEach(function(param) {if (param.indexOf('min-') > -1) minCutoff = param.replace('min-', '');});
        minCutoff ? null : minCutoff = 111;
        console.log(minCutoff);
        if (mindim <= minCutoff) {
            if (img_params.indexOf("to") > -1) {
                if ($(this).siblings().hasClass("arqspin_overlay")) return;
                $(this).css('z-index', 0).css('position', 'absolute').width(mindim).height(mindim);
                var overlay = $('<img class="arqspin_overlay">').attr('src', 'https://s3.amazonaws.com/spins.arqspin.com/shopify_thumbnail.png')
                .width(mindim)
                .height(mindim)
                .css('z-index', 1)
                .css('position', 'absolute');
                $(this).after(overlay);
            }
            return;
        } 
        if ($(this).siblings().hasClass("arqspin")) {
            if (location.hostname !== "shop.justonce1.com") {
                $(this).siblings().css("width", mindim).css("height", mindim);
            }
            return;
        }
        var box = $("<div class='arqspin' style='position:absolute; z-index:-1;'/>").css("width", mindim).css("height", mindim);
        var iframe = $("<iframe class='arqspin' src='//dfdo2n9cwdl7u.cloudfront.net/iframe.html?spin=" + spinid[1] + window.arqspin_embed_params + "' width=" + mindim + " height=" + mindim + " scrolling='no' frameborder='0'></iframe>");
        if (typeof $(iframe).on === "function") {
            $(iframe).on("load", function () {
                $(this).parent().css("z-index", 10);
            });
        } else {
            $(iframe).bind("load", function () {
                $(this).parent().css("z-index", 10);
            });
        }
        var img = this;
        $(iframe).wrap(box);
        $(img).before($(iframe).parent());
        var origSrc = img.src
        var intervalid = setInterval(function () {
            if (origSrc !== img.src) {
                $(iframe).parent().remove();
                clearInterval(intervalid);
            }
            if ($(img).is(":hidden")) {
                $(box).remove();
                clearInterval(intervalid);
            }
        }, 200);
    });
};
if(location.hostname !== "uniquecameraco.com" && location.hostname !== "www.uniquecameraco.com"){
  arqit();
  var arqInterval = setInterval(arqit, 1e3);    
}
