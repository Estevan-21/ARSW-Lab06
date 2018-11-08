/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package edu.eci.arsw.collabpaint.controller;

import edu.eci.arsw.collabpaint.model.Point;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

/**
 *
 * @author estevan
 */

    
@Controller
public class STOMPMessagesHandler {
    
	List puntos=new ArrayList();
        int id=0;
	@Autowired
	SimpMessagingTemplate msgt;
    
	@MessageMapping("/newpoint.{numdibujo}")    
	public void handlePointEvent(Point pt,@DestinationVariable String numdibujo) throws Exception {   
                if(id!=Integer.parseInt(numdibujo)){
                    puntos.clear();
                }
                id=Integer.parseInt(numdibujo);
		System.out.println("Nuevo punto recibido en el servidor!:"+pt);
                puntos.add(pt);            
                if (puntos.size()>=4){
                    msgt.convertAndSend("/topic/newpolygon."+numdibujo, puntos);
                    System.out.println(puntos.size());
                }
		msgt.convertAndSend("/topic/newpoint."+numdibujo, pt);
	}
                
}
    
