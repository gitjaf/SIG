package org.sigma.code.common

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.context.HttpSessionSecurityContextRepository
import grails.converters.JSON

class LoginController {

    
	/**
	 * Dependency injection for the authenticationTrustResolver.
	 */
	def authenticationTrustResolver

	/**
	 * Dependency injection for the springSecurityService.
	 */
	def springSecurityService

	/**
	 * Dependency injection for the authenticationManager.
	 */
	def authenticationManager

	def halBuilderService

	def login() {
		def username = request.JSON?.username
		def password = request.JSON?.password
		
		
		Usuario details = Usuario.findByUsername(username);
		if(!details.accountExpired && !details.accountLocked){

			if(!details.enabled && details.password == password){
				details.password = springSecurityService.encodePassword(password)
				details.enabled = true
				details.save(flush: true)
				def rol = Rol.findByAuthority('ROLE_USER')
				if(!details.authorities.contains(rol)){
					RolUsuario.create details, rol
				}
			}
			password = springSecurityService.encodePassword(password)

			UsernamePasswordAuthenticationToken token = new UsernamePasswordAuthenticationToken(username, password);
			token.setDetails(details);
			
			try {
				Authentication auth = authenticationManager.authenticate(token);
		  		SecurityContextHolder.getContext().setAuthentication(auth);

		  		request.getSession().setAttribute(HttpSessionSecurityContextRepository.SPRING_SECURITY_CONTEXT_KEY, SecurityContextHolder.getContext());
		  		response.status = 200
		  		
		  		render halBuilderService.buildModel(details) as JSON
			}
			catch(BadCredentialsException bce) {
				response.status = 401
				render false
			}

    	} else {
    		response.status = 401
    		render "Cuenta Bloqueada"
    	}
	}

	def getStatus() {
		Authentication auth = SecurityContextHolder.getContext().getAuthentication();
		
	    if (auth != null && !auth.getName().equals("anonymousUser") && auth.isAuthenticated()) {
	    	response.status = 200
	    	Usuario user = Usuario.findByUsername(auth.getName())
	    	render halBuilderService.buildModel(user) as JSON;
	    } else {
	    	response.status = 401
	    	render false;
	    }
	}

	
}
