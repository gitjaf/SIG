<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
%{-- <meta content="width=device-width" name="viewport">
<meta content="text/html; charset=UTF-8" http-equiv="Content-Type"> --}%
<title>Nueva Tarea</title>
<style>
/* ------------------------------------- 
    GLOBAL 
------------------------------------- */
* { 
  margin:0;
  padding:0;
  font-family: "Helvetica Neue", "Helvetica", Helvetica, Arial, sans-serif; 
  font-size: 100%;
  line-height: 1.6;
}

img { 
  max-width: 100%; 
}

body {
  -webkit-font-smoothing:antialiased; 
  -webkit-text-size-adjust:none; 
  width: 100%!important; 
  height: 100%;
}


/* ------------------------------------- 
    ELEMENTS 
------------------------------------- */
a { 
  color: #348eda;
}

.btn-primary, .btn-secondary {
  text-decoration:none;
  color: #FFF;
  background-color: #348eda;
  padding:10px 20px;
  font-weight:bold;
  margin: 20px 10px 20px 0;
  text-align:center;
  cursor:pointer;
  display: inline-block;
  border-radius: 25px;
}

.btn-secondary{
  background: #aaa;
}

.last { 
  margin-bottom: 0;
}

.first{
  margin-top: 0;
}


/* ------------------------------------- 
    BODY 
------------------------------------- */
table.body-wrap { 
  width: 100%;
  padding: 20px;
}

table.body-wrap .container{
  border: 1px solid #f0f0f0;
}


/* ------------------------------------- 
    FOOTER 
------------------------------------- */
table.footer-wrap { 
  width: 100%;  
  clear:both!important;
}

.footer-wrap .container p {
  font-size:12px;
  color:#666;
  
}

table.footer-wrap a{
  color: #999;
}


/* ------------------------------------- 
    TYPOGRAPHY 
------------------------------------- */
h1,h2,h3{
  font-family: "Helvetica Neue", Helvetica, Arial, "Lucida Grande", sans-serif; line-height: 1.1; margin-bottom:15px; color:#000;
  margin: 20px 0 10px;
  line-height: 1.2;
  font-weight:200; 
}

h1 {
  font-size: 36px;
}
h2 {
  font-size: 28px;
}
h3 {
  font-size: 22px;
}

p, ul { 
  margin-bottom: 10px; 
  font-weight: normal; 
  font-size:14px;
}

ul li {
  margin-left:5px;
  list-style-position: inside;
}

/* --------------------------------------------------- 
    RESPONSIVENESS
    Nuke it from orbit. It's the only way to be sure. 
------------------------------------------------------ */

/* Set a max-width, and make it display as block so it will automatically stretch to that width, but will also shrink down on a phone or something */
.container {
  display:block!important;
  max-width:600px!important;
  margin:0 auto!important; /* makes it centered */
  clear:both!important;
}

/* This should also be a block element, so that it will fill 100% of the .container */
.content {
  padding:20px;
  max-width:600px;
  margin:0 auto;
  display:block; 
}

/* Let's make sure tables in the content area are 100% wide */
.content table { 
  width: 100%; 
}

.text-muted{
  color: gray;
  font-style: italic;
}

.text-primary{
  color: #348eda
}

.text-bold{
  font-weight: bold;
}


.label,
.badge {
  display: inline-block;
  padding: 2px 4px;
  font-size: 11.844px;
  font-weight: bold;
  line-height: 14px;
  color: #ffffff;
  text-shadow: 0 -1px 0 rgba(0, 0, 0, 0.25);
  white-space: nowrap;
  vertical-align: baseline;
  background-color: #999999;
}

.label {
  -webkit-border-radius: 3px;
     -moz-border-radius: 3px;
          border-radius: 3px;
}

.badge {
  padding-right: 9px;
  padding-left: 9px;
  -webkit-border-radius: 9px;
     -moz-border-radius: 9px;
          border-radius: 9px;
}

.label:empty,
.badge:empty {
  display: none;
}

a.label:hover,
a.label:focus,
a.badge:hover,
a.badge:focus {
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
}

.label-important,
.badge-important {
  background-color: #b94a48;
}

.label-important[href],
.badge-important[href] {
  background-color: #953b39;
}

.label-warning,
.badge-warning {
  background-color: #f89406;
}

.label-warning[href],
.badge-warning[href] {
  background-color: #c67605;
}

.label-success,
.badge-success {
  background-color: #468847;
}

.label-success[href],
.badge-success[href] {
  background-color: #356635;
}

.label-info,
.badge-info {
  background-color: #3a87ad;
}

.label-info[href],
.badge-info[href] {
  background-color: #2d6987;
}

.label-inverse,
.badge-inverse {
  background-color: #333333;
}

.label-inverse[href],
.badge-inverse[href] {
  background-color: #1a1a1a;
}


.nueva {
  background-color: #049cdb;
}

.cerrada {
  background-color: #f89406;
}

.encurso {
  background-color: #7a43b6;
}

.terminada {
  background-color: #46a546;
}

.alta {
  background-color: #9d261d;  
}

.normal {
  background-color: #f89406;  
}

.baja {
  background-color: #46a546;  
}

.sinapuro{
  background-color: silver;
}

</style>
</head>
 
<body bgcolor="#f6f6f6">

<!-- body -->
<table class="body-wrap">
  <tbody><tr>
    <td></td>
    <td bgcolor="#FFFFFF" class="container">

      <!-- content -->
      <div class="content">
      <table>
        <tbody><tr>
          <td>
            <h2 class="text-primary">${tarea.asunto}</h2>
            <p class="text-muted">Usted ha sido agregado a esta tarea como <b>${tipoAsignacion}</b> por <span class="text-muted text-bold">${tarea.responsable.persona.nombreCompleto}</span>.</p>
            <g:if test="${tarea.tipo}">
              <p><span class="text-bold">Clasificada como: </span> ${tarea.tipo}</p>
            </g:if>
            <g:if test="${tarea.prioridad}">
              <p><span class="text-bold">Estado: </span> <label class="label ${tarea.estado.replaceAll('\\s','').toLowerCase()}"> ${tarea.estado}</label>&nbsp; <span class="text-bold">Prioridad: </span> <label class="label ${tarea.prioridad.replaceAll('\\s','').toLowerCase()}">${tarea.prioridad}</label></p>
            </g:if>
            <g:if test="${tarea.fechaInicio || tarea.fechaRevision || tarea.fechaVencimiento} ">
              <p>
                <g:if test="${tarea.fechaInicio}">
                  <span class="text-bold">Inicio: </span><g:formatDate format="dd/MM/yyyy" date="${tarea.fechaInicio}"/> &nbsp;
                </g:if>
                <g:if test="${tarea.fechaRevision}">
                  <span class="text-bold">Revisión:</span> <g:formatDate format="dd/MM/yyyy" date="${tarea.fechaRevision}"/> &nbsp;
                </g:if>
                <g:if test="${tarea.fechaVencimiento}">
                  <span class="text-bold">Vencimiento:</span> <g:formatDate format="dd/MM/yyyy" date="${tarea.fechaVencimiento}"/>
                </g:if>
              </p>
            </g:if>
            <hr>
            <p class="text-muted">${tarea.descripcion}</p>
            <p><a class="btn-primary" href="${url}">Acceda a su Listado de Tareas</a></p>
           </td>
        </tr>
      </tbody></table>
      </div>
      <!-- /content -->
                  
    </td>
    <td></td>
  </tr>
</tbody></table>
<!-- /body -->

<!-- footer -->
<table class="footer-wrap">
  <tbody><tr>
    <td></td>
    <td class="container">
      
      <!-- content -->
      <div class="content">
        <table>
          <tbody><tr>
            <td align="center">
              <p>SIG - Tareas  <a href="${url}">Bandeja de Entrada</a> 
              </p>
            </td>
          </tr>
        </tbody></table>
      </div><!-- /content -->
        
    </td>
    <td></td>
  </tr>
</tbody></table>
<!-- /footer -->


</body></html>