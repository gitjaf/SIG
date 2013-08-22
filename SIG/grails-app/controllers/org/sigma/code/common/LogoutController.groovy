package org.sigma.code.common

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import grails.converters.JSON

class LogoutController {

    def logout() { 
    	Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
	    if (auth != null && !auth.getName().equals("anonymousUser") && auth.isAuthenticated()) {
    		if(request.getSession().getAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY)){
    			request.getSession().removeAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY);
    			SecurityContextHolder.getContext().setAuthentication(null);
    		}
	    	response.status = 200
	    	render true;
	    } else {
	    	response.status = 401
	    	render false;
	    }
    }
}
