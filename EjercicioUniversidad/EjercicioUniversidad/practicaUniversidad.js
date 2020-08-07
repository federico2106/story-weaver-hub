/*
1. El alumno deberá ingresar:
Nombre del alumno
Carrera (Programación, Psicología, Diseño gráfico)
Estado de la carrera: en curso-abandono-finalizado
Sexo (femenino-masculino-nobinario)
Edad (18 o más)
Nota (entre 1 y 10)
2. Se desconoce la cantidad de alumnos que se ingresaran.
3. Se deberán validar los casos resaltados en negrita.
4. El programa deberá informar a través del documento html:
A. Cantidad total de alumnos de cada carrera.
B. Cantidad total de mujeres que cursan la carrera de programación
C. Cantidad de alumnos no binarios.
D. Promedio de notas de los alumnos finalizantes.
E. Nombre, sexo y edad del alumno mas viejo en la carrera de psicología.
F. Nombre, nota y estado de la carrera del mejor alumno no binario que estudia psicología.)
G. ¿Cuál es la carrera que tiene más alumnos? */




function probarEjercicio()
{
	
	var edad;
	var contadorEdad;
	var nombre;
	var contadorNombre;
	var sexo;
	var contadorSexo;
	var carrera;
	var contadorCarrera;
	var nota;
	var contadorNota;
	var estadoDeLaCarrera;
	var contadorEstadoDeLaCarrera;
	var respuesta;
	var acumuladorEdad;
	respuesta="si"
	contadorEdad=0;
	acumuladorEdad=0;
	
	
	 while(respuesta=="si")
	{
	
		nombre= prompt("ingrese sun nombre");
		contadorEdad= contadorEdad+1;

		
	edad= prompt("Ingrese su edad: ");
	while(edad<18)
	{
		edad= prompt("reingrese su edad, tiene que ser mayo de 18 años");
		edad= parseInt(edad);
		edad= edad+acumuladorEdad;
		contadorEdad++;
	}
	carrera= prompt("Ingrese carrera");
	while(carrera!="Psicologia" && carrera!="Programacion" && carrera!="Diseño Grafico")
	{
		carrera= prompt("ingrese carrera:Psicologia-Programacion Diseño Gráfico: ");
	}
	sexo= prompt("Ingrese sexo: Femenino-Masculino-NoBinario");
	
	while(sexo!="Masculino" && sexo!="Femenino" && sexo!="NoBinario")
	{
		sexo= prompt("Reingrese su sexo: ");
	}

	estadoDeLaCarrera= prompt("Ingrese el estado de su carrera: ");
	while(estadoDeLaCarrera!="en curso"&& estadoDeLaCarrera!="abandono"&& estadoDeLaCarrera!="finalizado")
	
	{
		estadoDeLaCarrera= prompt("reingrese el estado de su carrera: ");
	}
	nota= prompt("Ingrese su nota del 1 al 10");
	
	
	while(nota<0 || nota>10)
	
	{
		nota= prompt("Error, ingrese nota del 1 al 10");
	}
	respuesta=prompt("Quiere ingresar otro formulario?");
	}
	 
/*
	 nombre= prompt("Ingrese su nombre: ");
	
	 sexo= prompt("Ingrese: Masculino-Femenino-NoBinario: ");
	 carrera= prompt("Ingrese carrera: ");
	 nota= prompt("Ingrese nota del 1 al 10: ");
	 estadoDeLaCarrera= prompt("Ingrese el estado de su carrera:en curso-abandono-finalizado:  ");
	
	 */




































}
