/*
 Se necesita informar dependiendo las opciones llenadas en el formulario quien puede movilizarse o resguardarse.
Si es la residencia es de buenos aires consultar por confirm si pertenece a la zona de amba.
Si la persona es mayor de 60, no importa la profesión que tenga, el mensaje a mostrar es : No puede transitar, es persona de riesgo quédese en su casa.
Si la persona es Médico y menor de 25 : Usted es muy joven para ser médico
Si la persona es enfermero o almacenero entre 27 y 60 años: Usted puede transitar
Si la persona es entrenador, profesor, abogado o programador y reside en la zona de amba y tiene entre 20 y 60 años, el mensaje es : Solo salí para compras esenciales.
Si la persona es menor de 15 años, no importa donde resida, y tiene una profesión distinta a ser alumno: Es muy chico para tener una profesión
Si la persona es menor de 15 años, no importa donde resida, y es alumno: Respeta y colabora en tu casa, ya pronto volveremos a la escuela
Si la persona es mayor de 15 años y reside en otro lugar q no sea el amba: Usa el barbijo para transitar!
 */
function probarEjercicio()
{
	var edad;
	var profesion;
	var recidencia;
	var amba;

	edad= document.getElementById("edadTxtId").value;
	profesion= document.getElementById("profesionSelectId").value;
	recidencia= document.getElementById("residenciaSelectId").value;

	
	
	if(edad>60)
	{
		alert("No puede transitar, es persona de riesgo quédese en su casa.");

	}

	else
	{
		
		if(edad<25 && profesion=="1")
		{

			alert("Usted es muy joven para ser médico");
		}
		
		if(edad>27 && edad<60 )
		{
			
			if(profesion=="2" || profesion=="5")
			{
				alert("Usted puede transitar");
			}
		}
		
		
		if(edad>20 && edad<60)
		{
			
			/*switch(profesion)
			{
				case "4":
				case "3":
				case "6":
				case "7":
					
			switch(recidencia)
			{
				
				alert ("Solo salí para compras esenciales.");
				break
			}

			}	
			break;*/
		}



	}


	
	
	if(edad<15 && profesion!="8")
	{
		alert("Es muy chico para tener una profesión");
	}
	else
	{
		if(edad<15 && profesion=="8")
		{
			alert("Respeta y colabora en tu casa, ya pronto volveremos a la escuela");
		}
		
		
		/*if(edad>15)
		{

		}*/
	}
	






/*
	var amba= confirm("Sos de AMBA?");
	if (amba == true) {
	  alert("usa tapabnoca")
	} else {
	  txt = "You pressed Cancel!";
	  alert("se con el tramite");

	}*/

	
	
	switch(recidencia)
	{
		case "1":
			amba= confirm("sos de amba?")
			if(amba== true)
			{
				alert("usa tapaboca");
			}
			
			else
			{
				alert("segui con el tramite");
			}


	}
		

}