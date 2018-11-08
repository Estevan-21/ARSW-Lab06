var app = (function () {

    class Point{
        constructor(x,y){
            this.x=x;
            this.y=y;
        }        
    }
    
    var stompClient = null;

    var addPointToCanvas = function (point) {        
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        ctx.arc(point.x, point.y, 3, 0, 2 * Math.PI);
        ctx.stroke();
    };
    
    var addPolygon= function (points) {
        var canvas = document.getElementById("canvas");
        var ctx = canvas.getContext("2d");
        ctx.beginPath();
        console.log("YAAAAAAAAAAAAAAAAAAAAAAAAAA"+points);
        console.log("X "+points[0].x);
        ctx.moveTo(points[0].x, points[0].y);
        for (i in points){
            ctx.lineTo(points[i].x, points[i].y);
        }
        ctx.fill();
    };

    var getMousePosition = function (evt) {
        canvas = document.getElementById("canvas");
        var rect = canvas.getBoundingClientRect();
        return {
            x: evt.clientX - rect.left,
            y: evt.clientY - rect.top
        };
    };


    var connectAndSubscribe = function () {
        console.info('Connecting to WS...');
        var socket = new SockJS('/stompendpoint');
        stompClient = Stomp.over(socket);
        
        //subscribe to /topic/TOPICXX when connections succeed
        stompClient.connect({}, function (frame) {
            //console.log('Connected: ' + frame);
            stompClient.subscribe("/topic/newpoint."+$("#pId").val(), function (eventbody) {
                var punto1=JSON.parse(eventbody.body);
                addPointToCanvas(punto1);         
                //console.log("ID suscripcion: "+$("#pId").val());
            });
            stompClient.subscribe("/topic/newpolygon."+$("#pId").val(), function (eventbody){
                console.log("SIIIIIIIIIII");
                var polygon = JSON.parse(eventbody.body);
                addPolygon(polygon);
            });
        });


    };
    
    

    return {

        init: function () {
            var can = document.getElementById("canvas");
             can.setAttribute("width",screen.width);
            
            $(can).click( function (e){
                var pt = getMousePosition(e);
                console.info("publishing point at "+pt);
                stompClient.send("/app/newpoint."+$("#pId").val(), {}, JSON.stringify(pt));
}); 
            
            //websocket connection
            connectAndSubscribe();
        },

        publishPoint: function(px,py){
            //stompClient.send("/app/paint", {}, JSON.stringify({x:$("#x").val(),y:$("#y").val()}));
            stompClient.send("/app/newpoint."+$("#pId").val(), {}, JSON.stringify({x:$("#x").val(),y:$("#y").val()}));            
            var pt=new Point(px,py);
            //console.log("ID topico: "+$("#pId").val());
            //console.info("publishing point at "+pt);
            //addPointToCanvas(pt);

            //publicar el evento
        },

        disconnect: function () {
            if (stompClient !== null) {
                stompClient.disconnect();
            }
            setConnected(false);
            //console.log("Disconnected");
        }
    };

})();