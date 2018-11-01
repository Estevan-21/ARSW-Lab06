package edu.eci.arsw.collabpaint.controller;

import edu.eci.arsw.collabpaint.model.Point;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.stereotype.Controller;
import org.springframework.web.util.HtmlUtils;

@Controller
public class CollabPaintController {


    @MessageMapping("/paint")
    @SendTo("/topic/newpoint")
    public Point greeting(Point point) throws Exception {     
        System.out.println("X:"+ point.getX()+" Y:"+point.getY());
        return new Point(point.getX(),point.getY());
    }

}
