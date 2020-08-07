/*
Agregado while

Ingrese una edad(0 y 120), nombre y un sexo(f o m)
informar:
nivel 1:
cuantos son en total 
cuantos mayores de edad 
cuantos menores de edad 
cuantos adolescentes de edad 
la edad mas vieja;
la edad mas joven;*/
function mostrar()

{
    var edad;
    var nombre;
    var sexo;
    var contador;
    var acumulador;
    var bandera;
    var respuesta;
    var contadorEdad;
    contadorEdad=0;
    bandera=0;
    acumulador=0;
    contador=0;
    respuesta="si";
    edad= prompt("Ingrese edad: ");
    edad= parseInt(edad);
    
    while(edad<0 || edad>120 || isNaN(edad))
    {
       
        edad= prompt("Ingrese una edad entre 1 y 120 años:");
        edad= parseInt(edad);
        contadorEdad=contadorEdad++;
    }




















}


















/*
nivel:2

cuantas mujeres;
cuantos hombres;
cuantas adolescentes mujeres 
cuantos niños hombres 
el promedio de edad
el promedio de edad de las mujeres
el promedio de edad de los hombres
la cantidad de edades pares 

nivel 3:


el nombre de la persona mas vieja
el nombre de la persona mas joven

el sexo de la persona mas vieja
el sexo de la persona mas joven

nivel dios:

cuantas personas hay con la edad minima
cuantas personas hay con la edad maxima
el nombre de la ultima persona con la mayor edad encontrada
el nombre de la ultima persona con la menor edad encontrada

*/
